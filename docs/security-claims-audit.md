# Security and pricing claims audit (BDEV-251)

Ground truth is the iOS app and server source at `iamjohnnymac/heyblip-live` commit `e9a38e8`. File references below are relative to that repository. Site references are relative to this repository: rows 1 to 67 cite `fc883c0` (before the fixes in this branch), rows 68 to 88 were added in round 2 and cite the round-1 copy (`76dccbd`), rows 89 to 100 were added in round 3 and cite the audited head `fcb4eac`, and rows 101 onward were added in round 4 and cite the round-3 head `38844a4`. Round-3 and round-4 notes inside earlier rows are marked "Round 3" or "Round 4" and cite the same heads.

## Ground truth summary

| Topic | What the code does | Source |
|---|---|---|
| Direct messages | Noise_XX_25519_ChaChaPoly_SHA256: Curve25519 DH, ChaCha20-Poly1305 AEAD, HKDF-SHA-256 chaining. A fresh ephemeral key pair is generated for every handshake. | `Packages/BlipCrypto/Sources/NoiseHandshake.swift:7,80-98,168-169,316-321`; `NoiseCipherState.swift:16` |
| Session lifecycle | Send-direction rekey after 1,000 messages or 1 hour; session expires after 4 hours. There is no "rekey on reconnect" path. A failed initiator whose state was rotated between msg1 and msg3 is counted as `initiatorStateRotated` (retry semantics, no key material is reused). | `NoiseSessionManager.swift:43-44,149,170-173,197-222` |
| Private group messages | AES-256-GCM per-sender keys, distributed to members over pairwise Noise sessions. Rotation happens only inside `encrypt` once `messageCount >= maxMessages` (100). The type's doc comment promises rotation on member join/leave, but `rotateKey(forChannel:reason:)` has no callers in `Sources/`, so a removed member can decrypt until the next 100-message rotation. | `Packages/BlipCrypto/Sources/SenderKeyManager.swift:16-21,46-50,95-101,167-170,241-242`; `Sources/Services/MessageService.swift:1484-1541` |
| Public event channels | Text is built as a `.meshBroadcast` packet with a plaintext payload and an Ed25519 signature. Not encrypted. | `Sources/Services/SendPipeline.swift:471-491` ("Send a signed public text message") |
| Reactions, edits, deletes, receipts, typing | Carried as sub-types inside the `noiseEncrypted` payload, so they inherit DM encryption. | `Packages/BlipProtocol/Sources/EncryptedSubType.swift:12-36` |
| Location sharing and I'm Here beacons | `LocationPayload` is full-precision Float64 lat/lon plus accuracy, sent as a plaintext `.locationShare` / `.iAmHereBeacon` broadcast with TTL 3. Broadcasts go to BLE and, when connected, to the WebSocket relay. | `Packages/BlipProtocol/Sources/LocationPayload.swift:5-18`; `Sources/ViewModels/FriendFinderViewModel.swift:235-265`; `Packages/BlipMesh/Sources/TransportCoordinator.swift:306-315` |
| SOS | `.sosAlert` is a plaintext broadcast carrying severity, a coarse geohash and an optional message, readable by every nearby phone by design. When the alert owner receives a `.sosAccept`, it sends its precise Float64 lat/lon as a plaintext `.sosPreciseLocation` packet addressed to the accepter; addressed packets go BLE first, then the WebSocket relay. The only UI that sends `.sosAccept` is the medical dashboard, hidden in v1 behind `V1LaunchFlags.showMedicalResponder = false`; the owner-side handler answers any accept packet on the wire. | `Sources/ViewModels/SOSViewModel.swift:567-599,623-646,772-795`; `Packages/BlipMesh/Sources/TransportCoordinator.swift:162-182`; `Sources/Views/Tabs/EventsTab/MedicalDashboard/MedicalDashboardView.swift:266`; `Sources/Utilities/V1LaunchFlags.swift:67`; `Packages/BlipProtocol/Sources/MessageType.swift:49-53` |
| Announce (presence) packet | Plaintext: username, display name, Noise public key, signing public key, 5-character geohash. Sent only when the Nearby visibility setting is on and a geohash is available (location permission granted). | `Sources/Services/MessageService.swift:926-954` |
| Packet signing | Ed25519 via libsodium, 64-byte detached signature over the whole packet minus the TTL byte. Sender ID is the first 8 bytes of SHA-256(Noise public key). | `Packages/BlipCrypto/Sources/Signer.swift:31-56`; `KeyManager.swift:21,208-209`; `Packages/BlipProtocol/Sources/PacketSerializer.swift:246-255` |
| What the relay sees | Sender and recipient PeerID hex from the header, packet type byte, timestamps (rate limiting and logs), the geohash from announce packets (in-memory `Map`, dropped on disconnect), and whatever is plaintext on the wire (public channel text, announces, location shares, SOS). Every addressed packet the relay routes is written to storage before delivery, whether or not the recipient is online (`relay-room.ts:584` calls `queuePacket` on the unicast path before `send`), and the entry is removed only on relay ack or after the 1 hour TTL (`packet-router.ts:235-240`, `store-forward.ts:33-34`). There is no type filter, so a `.sosPreciseLocation` packet is stored with plaintext coordinates, and so is the unencrypted `.sessionLostNack` (`MessageService.swift:3229-3235`). Addressed packets that are encrypted: `.noiseEncrypted` DMs and the friend controls carried inside them (`EncryptedSubType.swift:25-27,62`). Recipient-less packets (location shares, I'm Here beacons, SOS alerts, public channel text) are fanned out to every peer connected to the single `"global-relay"` Durable Object, so "nearby" does not bound their audience once a phone has internet; only announces are scoped by geohash (`packet-router.ts:220-230`, `index.ts:90,195`). | `server/relay/src/relay-room.ts:414-478`; `server/relay/src/index.ts:90,195`; `packet-router.ts:43-71,173-230`; `presence/presence.ts:44-45,344`; `store-forward/store-forward.ts:33-34` |
| Push notifications | Relay asks the auth worker to push; the APNs payload carries the sender's username only (`senderDisplayName` and `channelName` are passed as null) and a `thread-id`, which for DMs is a synthetic UUID derived from the sender PeerID hex and for other types is the sender PeerID hex. Bodies are generic. | `server/auth/src/devices/push.ts:204-218`; `server/relay/src/relay-room.ts:767-781`; `server/auth/src/apns/payloads.ts:71-110,226-227` |
| Auth database | `users(email_hash SHA-256 hex, username, is_verified, message_balance, noise_public_key, signing_public_key, peer_id_hex, timestamps)`, `device_tokens(token, platform, bundle_id, locale, app_version, sandbox)`, `notification_prefs`, `abuse_reports`. No plaintext email, no display name, no phone number. | `server/auth/schema.sql:1-40`; `migrations/005_abuse_reports.sql` |
| Plaintext email | Received by the OTP endpoint. Used as two Workers KV keys: `code:<email>` for the code's TTL (default 600 s, overridable by the `CODE_TTL_SECONDS` env var, `otp.ts:147`; `:89` and `:120` are the reviewer and test-domain bypass branches with the same value) and `rate:<email>` for send-code rate limiting with a 3,600 s TTL. Passed to Resend to deliver the code. Never written to Postgres. | `server/auth/src/challenge-session/otp.ts:147,300-309,381-387` |
| Avatars | Uploaded images are stored in a Cloudflare bucket. | `server/cdn/src/avatars/avatars.ts:56` |
| Auth mechanism | Ed25519 challenge-response, then an HMAC JWT with a default lifetime of 3,600 s (overridable by `JWT_TTL_SECONDS` or `JWT_EXPIRY_SECONDS`, `session.ts:56`; the site's "one hour" describes the default). | `server/auth/src/challenge-session/session.ts:33,154`; `server/shared/src/jwt.ts:61` |
| Key storage on device | iOS Keychain, `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`. Not the Secure Enclave. | `Packages/BlipCrypto/Sources/KeyManager.swift:72-84` |
| Recovery kit (account export) | Implemented in `KeyManager` (AES-256-GCM; key derived with HKDF-SHA-256 from the password and a random 32-byte salt; HKDF is not a password-hardening KDF) and wrapped by `ProfileViewModel.exportRecoveryKit` / `importRecoveryKit`, but no view calls either. The only UI is a disabled "Recovery Kit Export" row subtitled "Unavailable in this build until file export is wired". Unshipped, so not published. | `KeyManager.swift:39-42,170-172`; `Sources/ViewModels/ProfileViewModel.swift:623-631`; `Sources/Views/Tabs/ProfileTab/Settings/SecuritySettings.swift:5-6,20,26-27` |
| TLS | Certificate pinning on the auth, relay and CDN worker hostnames. | `Sources/Services/ServerConfig.swift:38-42`; `CertificatePinningDelegate.swift` |
| Sentry | `sendDefaultPii = false`, but `attachScreenshot = true`, so a crash report can include a screenshot of the screen at crash time. After profile load the app calls `setUser(id: user.id.uuidString, username:)`, so reports carry the local account UUID and username. Server side `sendDefaultPii: false`. | `Sources/Services/CrashReportingService.swift:62-65,198-204`; `Sources/Services/AppLifecycleController.swift:95-99`; `server/shared/src/sentry-config.ts:118` |
| Analytics | Microsoft Clarity SDK is linked but `configureClarity()` is inside `#if DEBUG`; App Store builds never initialise it. | `App/AppDelegate.swift:4,35-37,45-60` |
| Phone numbers | No UI or service code references a phone number. `PhoneHasher` exists in BlipCrypto but has no callers in `Sources/`. | grep of `Sources/` for `phoneNumber|phoneHash|PhoneHasher` returns nothing |
| Account deletion | `DELETE FROM users WHERE noise_public_key = ...`; `device_tokens` and `notification_prefs` cascade. `abuse_reports` has no FK to `users` by design ("reports must survive account deletion") and stores reporter and target PeerID hex, category and a free-text reason. No avatar deletion path was found: `account.ts` does not mention avatars, `avatars.ts` has no delete handler, and `Sources/` has no avatar delete call. | `server/auth/src/registration/account.ts:20-23`; `schema.sql:53,89`; `server/auth/migrations/005_abuse_reports.sql`; `server/cdn/src/avatars/avatars.ts` |
| In-app purchases | The app lists StoreKit products `au.heyblip.Blip.starter10 / social25 / event50 / squad100 / season1000 / unlimited` ("Message Packs"). The server receipt endpoint returns 501 "not configured" and stores nothing. No "verified profile" product exists in source. | `Sources/ViewModels/StoreViewModel.swift:91-98`; `Sources/Views/Tabs/ProfileTab/MessagePackStore.swift`; `server/auth/src/receipts/verify.ts` |

Forward secrecy is not claimed anywhere on the site. If it is added later, the accurate wording is "fresh ephemeral keys per handshake, send-direction rekey every 1,000 messages or 1 hour, sessions expire after 4 hours".

## Claims table

Verdicts: accurate, overstated, false, unverifiable. Page and line are from the site at `fc883c0` for rows 1 to 67, `76dccbd` for rows 68 to 88, and `fcb4eac` for rows 89 onward.

| # | Claim as written (page, line) | Verdict | Ground truth (heyblip-live @ e9a38e8) | Corrected wording |
|---|---|---|---|---|
| 1 | "Privacy: E2E encrypted" (`components/Hero.tsx:11`) | overstated | Only DMs and private groups are E2EE. Public channels, location, SOS are plaintext (`SendPipeline.swift:471-491`, `FriendFinderViewModel.swift:235-265`). | "E2E encrypted DMs" |
| 2 | "Bluetooth mesh. Encrypted relay. SOS priority." (`Hero.tsx:122`) and "Private / Encrypted relay" (`Hero.tsx:180`) | overstated | Same as 1. | "Encrypted direct messages" |
| 3 | "End-to-end encrypted: Messages are encrypted before they leave your device." (`components/Security.tsx:8`) | overstated | Same as 1. | "Direct messages and private group chats are encrypted on your device before they leave it. Public event channels are signed but not encrypted." |
| 4 | "Encrypted relay: Phones that pass a message along cannot read its contents." (`Security.tsx:9`) | overstated | Relays read the header (sender/recipient PeerID, type, TTL) and plaintext broadcasts (`packet-router.ts:173-230`, `PacketSerializer.swift`). | "Phones that relay a direct or group message carry ciphertext they cannot open. They do see the packet header: sender and recipient IDs, packet type, and hop count." |
| 5 | "Noise XX and Ed25519 protect sessions and packet authenticity." (`Security.tsx:10`) | accurate | `NoiseHandshake.swift:7`; `Signer.swift`. | Named primitives exactly: "Noise XX (Curve25519, ChaCha20-Poly1305, HKDF-SHA-256) protects sessions. Ed25519 signatures protect packet authenticity." |
| 6 | "They can help a packet move without seeing what is inside it." (`Security.tsx:32`) | overstated | Public event channel text is plaintext on the mesh. | Qualified to direct messages and private groups; public channels named as open by design. |
| 7 | "Encrypted content: Relay devices cannot read messages." (`components/Features.tsx:27`) | overstated | Same as 6. | "Relay devices cannot read direct or private group messages." |
| 8 | "End-to-end encrypted chats, location sharing you control." (`components/AppScreens.tsx:49`) | overstated | Location is a plaintext broadcast, TTL 3, to BLE and relay; the user controls on/off, not the audience on the wire (`FriendFinderViewModel.swift:235-248`). | "End-to-end encrypted direct messages, location sharing you switch on and off." |
| 9 | FAQ "Is Blip end-to-end encrypted? Yes. Every direct message..." (`components/FAQ.tsx:47`) | accurate for DMs, silent on groups and public channels | Groups: `SenderKeyManager.swift`. Public: `SendPipeline.swift:471-491`. | Answer now covers DMs (yes), private groups (AES-256-GCM sender keys), public channels (signed, not encrypted). |
| 10 | FAQ "The only data stored server-side is your email, username, cryptographic public keys, and push notification token" (`FAQ.tsx:62`) | false | Email is stored as a SHA-256 hash (`schema.sql:3`). Also stored: avatar, notification prefs, `is_verified`, `message_balance`, device locale and app version. | Lists the hash and the full set. |
| 11 | FAQ "Location is only shared with your friends during an active Friend Finder session and is not persisted on the server." (`FAQ.tsx:62`) | overstated | A 5-char geohash goes to the relay in every announce when location permission is granted, held in memory (`MessageService.swift:945-954`, `presence.ts:44-45`). Friend Finder positions are broadcasts. The relay queues an addressed `.sosPreciseLocation` for an offline accepter (`packet-router.ts:235-260`). | "While the app is connected to our relay it also holds, in memory only, a 5-character geohash ... Friend Finder positions are broadcast to nearby phones over the mesh and are not stored on the server. One exception: if someone accepts your SOS alert while they are offline, our relay queues the packet carrying your precise position for up to an hour ..." Round 3 (`FAQ.tsx:62` at `fcb4eac`): the offline-only condition was not in the code (`relay-room.ts:584`); now says every addressed packet the relay routes is stored until acknowledged or an hour passes, and drops "nearby" for the fan-out. |
| 12 | "Blip uses end-to-end encrypted Bluetooth mesh to relay messages, voice notes, photos, and SOS alerts" (`app/layout.tsx:17`) | overstated | SOS is a plaintext broadcast (`SOSViewModel.swift:584`). | "Blip relays messages, voice notes, photos, and SOS alerts phone-to-phone over Bluetooth mesh, with end-to-end encrypted direct messages." |
| 13 | JSON-LD "End-to-end encrypted peer-to-peer messaging" and feature "End-to-end encrypted messages (Noise XX + Ed25519)" (`layout.tsx:151,160`) | overstated | Same as 1. | "direct messaging" / "direct messages". |
| 14 | "Email-based account setup, no phone numbers or ad tracking" (`layout.tsx:163`) | accurate | No phone number code paths; Clarity is DEBUG-only (`AppDelegate.swift:35-37`). | Unchanged. |
| 15 | "Key agreement: Noise XX handshake (Curve25519 + ChaChaPoly + SHA256)" (`app/tech/TechClient.tsx:44`) | accurate | `NoiseHandshake.swift:7`. | Exact primitives: "Noise_XX_25519_ChaChaPoly_SHA256 (Curve25519 DH, ChaCha20-Poly1305 AEAD, HKDF-SHA-256)". |
| 16 | "Packet signing: Ed25519 via libsodium (64-byte detached signatures)" (`TechClient.tsx:45`) | accurate | `KeyManager.swift:208-209`; `Signer.swift:38-56`. | Unchanged. |
| 17 | "Signable data: Full packet excluding TTL byte and signature" (`TechClient.tsx:46`) | accurate | `PacketSerializer.swift:246-255`. | Unchanged. |
| 18 | "Key distribution: Noise + signing public keys exchanged in announce payload" (`TechClient.tsx:48`) | accurate but incomplete | Announce also carries username, display name, geohash in plaintext (`MessageService.swift:945`). | Adds the plaintext fields. |
| 19 | "Session management: Noise session per peer pair, rekeying on reconnect" (`TechClient.tsx:49`) | overstated | Rekey every 1,000 messages or 1 hour; expiry 4 hours; no reconnect rekey (`NoiseSessionManager.swift:149,170-173`). | "Noise session per peer pair; fresh ephemeral keys per handshake; send-direction rekey every 1,000 messages or 1 hour; sessions expire after 4 hours" |
| 20 | "Sender ID: 8 bytes (SHA256 of noise public key, truncated)" (`TechClient.tsx:56`) | accurate | `KeyManager.swift:21`. | Unchanged. |
| 21 | "Signature: 64 bytes (optional, Ed25519)" (`TechClient.tsx:58`) | accurate | `PacketValidator.swift:85-93`. | Unchanged. |
| 22 | "Built for ... crowds with end-to-end encryption (Noise XX ...)" (`TechClient.tsx:107-109`) | overstated | Same as 1. | "with end-to-end encrypted direct messages (...)" |
| 23 | Same as 15, 18, 19 in the agent markdown (`proxy.ts:81-85`) | overstated (row 19 mirror) | Mirror of `/tech`. | Mirrored. Rows added for group messages (rotation every 100 messages only: `SenderKeyManager.swift:241-242`; `rotateKey(forChannel:reason:)` has no callers in `Sources/`) and public channels (ticket asks for the primitive list). The recovery kit row added in round 1 was dropped in round 2 as unshipped (`ProfileViewModel.swift:623-631` has no view callers). |
| 24 | "**Encryption:** End-to-end (Noise XX + Ed25519)" (`proxy.ts:10`) | overstated | Same as 1. | Qualified to DMs; groups and public channels named. |
| 25 | "Private by default. Messages are encrypted before they leave your phone. Relay phones cannot read them." (`proxy.ts:19`) | overstated | Same as 6. | Qualified. |
| 26 | "Only your email, username, public keys, and push token are stored server-side." (`proxy.ts:31`) | false | Same as 10. | Hash and full set listed. |
| 27 | "End-to-end encrypted Bluetooth mesh, built for crowds of 100,000+." (`proxy.ts:120`) and `/organisers` description (`app/organisers/page.tsx:7`) | overstated | Same as 1. | "Bluetooth mesh with end-to-end encrypted direct messages". |
| 28 | "Email address (plaintext, for verification and recovery)" (`proxy.ts:164`) and "Email address: stored in plaintext" (`app/privacy/PrivacyClient.tsx:33`) | false | `users.email_hash` SHA-256 (`schema.sql:3`); plaintext held in KV as `code:<email>` for the OTP TTL (600 s) and as `rate:<email>` for 3,600 s (`server/auth/src/challenge-session/otp.ts:89,300-309,381-387`). | "stored only as a SHA-256 hash ... The address itself is held for up to an hour, while your verification code is live and for rate limiting on code requests, and is passed to our email provider to deliver the code. Then it is discarded; only the hash remains." |
| 29 | "Username and display name: chosen by you during setup" [stored] (`PrivacyClient.tsx:34`, `proxy.ts:165`) | overstated | No display name column in `schema.sql`; display name travels in announces. | Username stored; display name broadcast, not stored. |
| 30 | "Avatar image ... stored on our servers" (`PrivacyClient.tsx:35`) | accurate | `avatars.ts:56`. | Unchanged. |
| 31 | "Cryptographic public keys ... uploaded to our server" (`PrivacyClient.tsx:36`) | accurate | `schema.sql` `noise_public_key`, `signing_public_key`. | Unchanged. |
| 32 | "APNs device token ... Stored server-side" (`PrivacyClient.tsx:37`) | accurate but incomplete | `device_tokens` also stores locale, app version; pushes carry the sender's username and a thread id, with display name and channel name null (`push.ts:208-214`) and the DM thread id a synthetic UUID from the sender PeerID (`relay-room.ts:767-771`). | Adds those facts. |
| 33 | "JWT session tokens ... short-lived and refreshed automatically" (`PrivacyClient.tsx:38`) | accurate | 3,600 s default (`session.ts:33`). | Adds "after an Ed25519 challenge-response" and "expire after one hour". |
| 34 | "Approximate location: only when you actively opt in to Friend Finder ... not stored persistently" (`PrivacyClient.tsx:39`, `proxy.ts:170`) | overstated | Geohash in every announce when location permission is granted and Nearby visibility is on (`MessageService.swift:926-934`); relay memory only (`presence.ts:44-45,344`). | Describes the geohash, its scope, and that it is never written to a database. Round 3 (`PrivacyClient.tsx:39` at `fcb4eac`): the round-1 sentence "Friend Finder positions are shared over the mesh, not through our servers" was false (`TransportCoordinator.swift:306-315` sends broadcasts to the relay); now says they are broadcast over the mesh and forwarded by the relay to every connected phone, not stored. |
| 35 | "Message content: all direct messages are E2EE (Noise...). Group messages use AES-256-GCM sender key encryption. Our servers relay encrypted packets and cannot decrypt or read your messages." (`PrivacyClient.tsx:46`, `proxy.ts:174`) | overstated | Public channel messages transit the relay in plaintext. | Adds: "Messages in public event channels are Ed25519-signed but not encrypted: anyone at the event can read them, and so can our relay when it forwards them." |
| 36 | "Precise location: we do not collect precise GPS data except during an active SOS alert" (`PrivacyClient.tsx:48`, `proxy.ts:176`) | overstated | No database of GPS. Coordinates leave the phone for Friend Finder and beacons as plaintext broadcasts that also traverse the relay (`LocationPayload.swift`, `TransportCoordinator.swift:306-315`), and for SOS as a plaintext `.sosPreciseLocation` addressed to the accepter (`SOSViewModel.swift:623-646,793`), which the relay writes to storage before delivery, online or not, until acknowledged or 1 hour passes (`relay-room.ts:584`, `packet-router.ts:235-240`, `store-forward.ts:33-34`). | "we keep no database of GPS coordinates ... if the person who accepted your SOS is offline, the packet with your coordinates waits in the relay queue for up to 1 hour." Round 3 (`PrivacyClient.tsx:48` at `fcb4eac`): "nearby phones" was too narrow; now says the relay forwards positions and beacons to every Blip phone connected to it (`packet-router.ts:220-230`). Round 3, same line and `proxy.ts:178`: the "offline" condition on the SOS queue was wrong (`relay-room.ts:584`); now says the addressed SOS precise-location packet is written to relay storage until acknowledged or one hour passes. |
| 37 | "do not use any third-party analytics services" (`PrivacyClient.tsx:49`) | accurate for App Store builds | Clarity SDK linked, initialised only under `#if DEBUG` (`AppDelegate.swift:35-37`). | Adds the Clarity caveat so a binary inspection is not a surprise. |
| 38 | "Device identifiers or advertising IDs: we do not collect IDFA, IDFV" (`PrivacyClient.tsx:50`) | accurate | No such columns or SDK calls found. | Unchanged. |
| 39 | Mesh relay "does not expose any personal data" (`PrivacyClient.tsx:66`) | overstated | Header PeerIDs, plaintext announces (username, display name, geohash) and public channel text are visible to relaying phones. | Rewritten to name what a relaying device sees. |
| 40 | "stores your account information (email, username, public keys, APNs token) in Neon Postgres ... store-and-forward delivery for encrypted packets only ... 1-hour TTL" (`PrivacyClient.tsx:71`) | overstated (email; "encrypted packets only") | Email hash; avatar in Cloudflare storage; the relay stores every addressed packet it routes before delivery, online or not (`relay-room.ts:584`), regardless of type, and removes it on ack or after 1 hour (`packet-router.ts:235-240`, `store-forward.ts:33-34`); plaintext addressed packets include `.sosPreciseLocation` (`SOSViewModel.swift:623-646`) and `.sessionLostNack` (`MessageService.swift:3229-3235`); encrypted ones are `.noiseEncrypted` DMs and the friend controls inside them (`EncryptedSubType.swift:25-27,62`). TLS pinning accurate (`ServerConfig.swift:38-42`). | "queues every addressed packet for an offline recipient, whatever its type, for up to 1 hour ... One addressed packet is not encrypted: when someone accepts your SOS alert, your phone sends them your precise GPS coordinates ..." Round 3 (`PrivacyClient.tsx:71` at `fcb4eac`): "for an offline recipient" and "one addressed packet is not encrypted" were both wrong; now says every routed addressed packet is written to storage until acknowledged or 1 hour passes, names the encrypted addressed packets (Noise DMs, private group messages, friend requests) and says the SOS precise location is the plaintext one that carries personal data. |
| 41 | "Sentry: Collects anonymised diagnostic data only, no message content or personal identifiers." (`PrivacyClient.tsx:82`, `proxy.ts:182`) | overstated | `attachScreenshot = true` (`CrashReportingService.swift:62`); `setUser` sends the local account UUID and username (`CrashReportingService.swift:198-204`; `AppLifecycleController.swift:95-99`). | "We disable Sentry's default personal-data collection and never send message content or your email. A crash report may include a screenshot of whatever was on screen at the moment of the crash, and is tagged with your username and an app-generated account identifier so we can group reports per account." Round 3 (`PrivacyClient.tsx:82` at `fcb4eac`): "never send message content" contradicted the screenshot sentence and nothing in `CrashReportingService.swift:62-65` enforces it; now says message data is not attached but a screenshot may show messages that were on screen, and reports carry username and account id. Round 4 (`PrivacyClient.tsx:82` at `38844a4`): "Your email is not sent" was still false. `EmailVerificationService.swift:57,65` logs `send-code <address>` with the plaintext email; `DebugLogger.log` forwards every line to `CrashReportingService.addBreadcrumb` (`Sources/Services/DebugLogger.swift:307-312`; `CrashReportingService.swift:213-217`), and `beforeSend` (`:79-99`) drops noisy events but scrubs nothing. Now: "Your email is not included in a report, except that the log line recording your sign-in code request can appear in the breadcrumb trail of a crash in the same sign-in session." |
| 42 | "You can delete your account and all associated server-side data" (`PrivacyClient.tsx:88`) | false | `account.ts:20-23` deletes the user row with cascades, but `abuse_reports` survives by design (`005_abuse_reports.sql`) and no avatar deletion path exists. | "Deletion removes your account row ... Two things are not removed. Abuse reports ... Your avatar has no automatic deletion path yet; email privacy@heyblip.au to have it removed." |
| 43 | Privacy meta description "We store only email, username, public keys, and push tokens, nothing else." (`app/privacy/page.tsx:7`) | false | Same as 10. | "We store a hash of your email, your username, public keys, push token, avatar and notification preferences, and never your messages." |
| 44 | "friends-only location sharing" (`app/features/page.tsx:59`) | overstated | Broadcast on the wire; the app filters display. | "location sharing you switch on and off" |
| 45 | "relays messages phone-to-phone over encrypted Bluetooth mesh" (`app/features/FeaturesClient.tsx:74`) | overstated | Same as 1. | "over Bluetooth mesh" |
| 46 | "Are Blip messages encrypted? Yes. ..." (`app/features/chat/page.tsx:37`) | overstated | Same as 9. | Qualified to DMs and private groups; public channels named. |
| 47 | "Encrypted chat with no signal, and no relay can read it" / "Every thread runs end-to-end encrypted." (`app/features/chat/ChatClient.tsx:73,75`) | false | Public channel threads are plaintext. | "Every direct message and private group runs end-to-end encrypted ... Public event channels are signed but not encrypted". |
| 48 | "the relay only ever sees enough to forward the packet" (`ChatClient.tsx:76`) | accurate but vague | Header: sender, recipient, TTL, type. | Names the header fields. |
| 49 | "The header of every thread says end-to-end encrypted" (`ChatClient.tsx:83`) | false | The padlock is driven by `isEncrypted`, which is false for any conversation with `ringStyle == .none` (groups) and true only when a connected peer holds a Noise public key (`Sources/Views/Tabs/ChatsTab/ChatView.swift:307-313`). | "the header of a direct message thread says end-to-end encrypted". |
| 50 | "Everything stays end-to-end encrypted along the way." (`ChatClient.tsx:145-146`) | overstated | Same as 1. | "Direct messages stay end-to-end encrypted along the way." See row 89 for the neighbouring "no server" sentence. |
| 51 | "Your iPhone generates an Ed25519 key pair ... that key is your identity on the mesh." (`app/features/profile/page.tsx:32`, `ProfileClient.tsx:48,59,128-129`) | overstated | PeerID is a hash of the Curve25519 Noise key; Ed25519 is the signing key (`KeyManager.swift:9-21`). | "a Curve25519 key pair for encryption and an Ed25519 key pair for signing ... a hash of the Curve25519 public key is your identity on the mesh". |
| 52 | "Blip never asks for your mobile number" / "No phone number goes anywhere." (`profile/page.tsx:32`, `ProfileClient.tsx:57-59,411`) | accurate | No phone number code paths in `Sources/`. | Unchanged. |
| 53 | "at an event it never passes through a Blip server" / "travels phone-to-phone rather than through a Blip server" (`ProfileClient.tsx:61`, `profile/page.tsx:52`) | overstated | When a phone has internet, packets also go to the WebSocket relay (`TransportCoordinator.swift:306-315`; DM routing via relay in `relay-room.ts`). | "at an event they travel phone-to-phone, and when a phone has internet they can also pass through our relay as ciphertext." |
| 54 | "pushes your position to the people you have chosen to share with ... Friends only" (`app/features/nearby/NearbyClient.tsx:77`) | overstated | Broadcast on the wire, and no friend filter on receive: `FriendFinderViewModel.swift:158-199` plots every received position; no "Friends only" string exists in the app and the only shipped control is the Share location button (`FriendFinderMapView.swift:16-17,270`; `V1LaunchFlags.swift:51`). | Round 1 kept the UI description and added the broadcast sentence; round 2 (row 79) removed the friends-only claim. |
| 55 | "Nothing here routes through a Blip server. Positions travel the same encrypted path your messages take" (`NearbyClient.tsx:78`) | false | `.locationShare` plaintext; broadcasts reach the relay when connected. | "Positions do not need a Blip server ... as signed location packets. Unlike direct messages they are not encrypted, and when a phone has internet they also pass through our relay." |
| 56 | "Blip has no server collecting your position ... travels peer-to-peer over the mesh, to the people you chose." (`NearbyClient.tsx:260-262`) | overstated | Relay holds a geohash in memory; location packets are broadcasts; no friend filter on receive: `FriendFinderViewModel.swift:158-199` plots every received position; no "Friends only" string exists in the app and the only shipped control is the Share location button (`FriendFinderMapView.swift:16-17,270`; `V1LaunchFlags.swift:51`). | Round 1: "no server storing your position ... the app shows it only to the friends you chose." Round 2 (row 80) removed the friends-only claim. |
| 57 | SOS "Encryption: Noise XX key agreement with Ed25519 packet signing" (`app/features/safety/SafetyClient.tsx:41`) | false | SOS is a plaintext signed broadcast so everyone can read it (`SOSViewModel.swift:584`). | "SOS alerts are Ed25519-signed broadcasts, left unencrypted so every nearby phone can read them". Round 3 (`SafetyClient.tsx:41` at `fcb4eac`): adds that the relay forwards them to every connected Blip phone (`packet-router.ts:220-230`). |
| 58 | "Your account is secured via Ed25519 challenge-response authentication and JWT session tokens." (`app/terms/TermsClient.tsx:42`) | accurate | `session.ts:154`; `jwt.ts`. | Unchanged. |
| 59 | "Relayed messages are end-to-end encrypted" (`TermsClient.tsx:62`) | overstated | Same as 6. | "Relayed direct and group messages are end-to-end encrypted ... Public event channel messages are signed but not encrypted." |
| 60 | "you cannot read relayed messages (they are encrypted)" / "Because messages are end-to-end encrypted, we cannot monitor or moderate message content." (`app/acceptable-use/AcceptableUseClient.tsx:47,52`) | overstated | Same as 6; the support page already says public surfaces are moderated server-side. | Qualified to direct and group messages. Round 3: see row 90 for the "relaying encrypted messages" clause on the same line. |
| 61 | "Your account, registered email hash, and public keys are permanently removed from our servers." (`app/support/SupportClient.tsx:87`) | accurate but incomplete | `account.ts:20-23`; abuse reports and avatar survive (row 42). | Adds device tokens and notification preferences to the removed list, and says abuse reports are kept and the avatar is removed on request. |
| 62 | "a cryptographic key stored in your phone's secure enclave" (`SupportClient.tsx:119`) | false | iOS Keychain generic password items, `ThisDeviceOnly` (`KeyManager.swift:72-84`). | "cryptographic keys stored in your phone's iOS Keychain, marked device-only so they never sync to another device." |
| 63 | "a one-way hash of your email address (we never store your email in plain text)" (`SupportClient.tsx:135`) | accurate for the database | Plaintext sits in KV for up to 3,600 s (`rate:<email>`, `otp.ts:300-309`). | Adds "held for up to an hour for your verification code and rate limiting, then discarded; only the hash is stored in our database". |
| 64 | "Apple In-App Purchase transaction IDs if you've bought message packs" [stored] (`SupportClient.tsx:135`) | false | Receipt endpoint returns 501 and stores nothing (`receipts/verify.ts`). | Removed. Push token and avatar added to the stored list. |
| 65 | "we cannot read the content of direct messages or group messages" (`SupportClient.tsx:178`) | accurate | Groups use sender keys. | Unchanged. |
| 66 | "TLS with certificate pinning" (`PrivacyClient.tsx:71`) | accurate | `ServerConfig.swift:38-42`. | Unchanged. |
| 67 | "Dependencies: CryptoKit (Apple), swift-sodium, swift-opus" (`TechClient.tsx:81`) | accurate | `SECURITY.md` dependency table; `project.yml`. | Unchanged. |
| 68 | "If you've set up a recovery kit (Profile → Settings → Backup), you can restore on a new device using the recovery file and the password you set." (`SupportClient.tsx:119`) | false | No view calls `exportRecoveryKit` / `importRecoveryKit` (`ProfileViewModel.swift:623-631`); the only UI is a disabled export row (`SecuritySettings.swift:5-6,26-27`); there is no import UI. | "The current app has no working backup or recovery kit (the Recovery Kit Export row in Settings is disabled), so if the phone is gone the keys are gone with it." |
| 69 | "Messages hop phone-to-phone over encrypted Bluetooth Low Energy mesh" (`public/llms.txt:3`) | overstated | Same as 1. | "over Bluetooth Low Energy mesh" |
| 70 | "End-to-end encrypted (Noise XX + Ed25519); relay phones cannot read messages" (`llms.txt:7`) | overstated | Same as 1. | "Direct messages are end-to-end encrypted (Noise XX + Ed25519) and private groups use AES-256-GCM sender keys; relay phones cannot read them. Public event channels are signed, not encrypted" |
| 71 | "location sharing is friends-only and user-controlled" (`llms.txt:11`) | false | No friends-only control ships (`V1LaunchFlags.swift:51`, `LocationSettings.swift:31-34`); no friend filter on receive: `FriendFinderViewModel.swift:158-199` plots every received position; no "Friends only" string exists in the app and the only shipped control is the Share location button (`FriendFinderMapView.swift:16-17,270`; `V1LaunchFlags.swift:51`). | "location sharing is off until you switch it on, and shared positions are signed mesh broadcasts that nearby Blip phones can read". Round 3 (`llms.txt:11` at `fcb4eac`): "nearby" replaced with nearby phones plus every Blip phone connected to the relay (`packet-router.ts:220-230`). |
| 72 | "SOS never touches a mobile tower, Wi-Fi, or a server" (`app/features/safety/page.tsx:42`) | false | `.sosAlert` is a broadcast (`SOSViewModel.swift:583-590`) and `TransportCoordinator.broadcast` also sends to the WebSocket relay when it is running (`TransportCoordinator.swift:306-315`). | "SOS needs no mobile tower, Wi-Fi, or server ... when a phone in the chain has internet it also passes through our relay." |
| 73 | "Outside an SOS or an active Friend Finder session, your location is not shared with anyone or stored on a server" (`safety/page.tsx:57`) | overstated | A 5-character geohash goes out in every announce while Nearby visibility is on and location is granted (`MessageService.swift:926-954`), held in relay memory (`presence.ts:44-45,344`); I'm Here beacons are also location broadcasts (`FriendFinderViewModel.swift:253-266`). | "the only location that leaves your phone is a 5-character geohash ... in your presence announcement while Nearby visibility is on, which our relay holds in memory only." |
| 74 | SOS transport "no tower, no Wi-Fi, no server" (`safety/SafetyClient.tsx:37`) | overstated | Same as 72. | "no tower or Wi-Fi needed, and the alert also passes through our relay when a phone has internet" |
| 75 | "There is no Blip server watching where you are. Location sharing runs peer-to-peer over the mesh ... scoped to friends only ... Meeting point pins go only to the people you choose" (`app/features/nearby/page.tsx:42`) | false | Location packets traverse the relay when online (`TransportCoordinator.swift:306-315`); no friend filter on receive: `FriendFinderViewModel.swift:158-199` plots every received position; no "Friends only" string exists in the app and the only shipped control is the Share location button (`FriendFinderMapView.swift:16-17,270`; `V1LaunchFlags.swift:51`); meeting points are hidden and never broadcast (`V1LaunchFlags.swift:29-33`). | Rewritten: no database of position; signed unencrypted packet any nearby phone can receive; relay forwards, does not keep; Share location button and Nearby visibility toggle. Meeting-point clause dropped. |
| 76 | "Messages are end-to-end encrypted before they leave your device" (`proxy.ts:163`) | overstated | Same as 1. | "Direct messages and private group messages are end-to-end encrypted before they leave your device; public event channels are signed but not encrypted." |
| 77 | Privacy meta description "end-to-end encrypted messages" (`app/privacy/page.tsx:7`) | overstated | Same as 1. | "end-to-end encrypted direct messages" |
| 78 | "No tower, no Wi-Fi, no check-in to a server." (`nearby/NearbyClient.tsx:61`) | overstated | Announces go to the relay when a phone has internet (`MessageService.swift:926-954`; `TransportCoordinator.swift:306-315`). | "with no tower or Wi-Fi needed. When a phone has internet, its presence announcement also goes to our relay." |
| 79 | "The app shows it only to friends, and the control ... says so — Friends only" (`NearbyClient.tsx:77`, round-1 wording) | false | no friend filter on receive: `FriendFinderViewModel.swift:158-199` plots every received position; no "Friends only" string exists in the app and the only shipped control is the Share location button (`FriendFinderMapView.swift:16-17,270`; `V1LaunchFlags.swift:51`). | "a signed, unencrypted mesh broadcast that nearby Blip phones relay, and any phone running Blip that receives it can plot it. Sharing is off until you switch it on". Round 3 (`NearbyClient.tsx:77` at `fcb4eac`): adds that the relay forwards it to every connected Blip phone, not only nearby ones (`packet-router.ts:220-230`, `index.ts:90`). |
| 80 | "the app shows it only to the friends you chose" (`NearbyClient.tsx:262`, round-1 wording) | false | Same as 79. | "a signed broadcast that nearby phones relay and can read, and it is off until you switch it on". Round 3 (`NearbyClient.tsx:262` at `fcb4eac`): adds the relay fan-out to every connected Blip phone (`packet-router.ts:220-230`). |
| 81 | "set to Friends only, so nobody outside that person's approved friends can see where they are" (`app/features/profile/page.tsx:42`) | false | Same as 79. The Friends-only row in the screenshot is hidden UI (`V1LaunchFlags.swift:51`). | "Location sharing is off until you switch it on from the Nearby map, and while it is on your position goes out as a signed, unencrypted mesh broadcast that any nearby Blip phone can receive." Round 3 (`profile/page.tsx:42` at `fcb4eac`): adds that the relay forwards it to every Blip phone connected to it (`packet-router.ts:220-230`). |
| 82 | "Set to Friends only in the screenshot. Open the row to change who can see where you are" (`profile/ProfileClient.tsx:93`) | false | Same as 81. | "Off until you switch it on from the Nearby map. While it is on, your position is a signed mesh broadcast that any nearby Blip phone can receive." Round 3 (`ProfileClient.tsx:93` at `fcb4eac`): adds the relay fan-out to every connected Blip phone (`packet-router.ts:220-230`). |
| 83 | "location data (unless you opt in to location-sharing per friend)" (`SupportClient.tsx:135`) | overstated | Per-friend sharing controls are hidden (`V1LaunchFlags.swift:51`); geohash in announces reaches the relay (`presence.ts:44-45`). | "we keep no database of your location (our relay holds a 5-character geohash in memory while you are connected; see the privacy policy for the SOS exception)" |
| 84 | "Location sharing: Friends only, you control it" (`NearbyClient.tsx:50`) | false | Same as 79. | "Off until you switch it on" |
| 85 | "sharing scoped to Friends only" (`NearbyClient.tsx:84`, screenshot caption) | false | Same as 79. | "and the sharing control" |
| 86 | "The Profile screen carries a location sharing setting. Set to friends only, it means friends only." (`NearbyClient.tsx:126`) | false | Same as 79; the Profile row is hidden (`V1LaunchFlags.swift:51`). | "Location sharing is off until you switch it on from the Nearby map. While it is on, any nearby Blip phone can receive your position." Round 3 (`NearbyClient.tsx:126` at `fcb4eac`): adds that every Blip phone connected to the relay can receive it too (`packet-router.ts:220-230`). |
| 87 | "which will remove your server-side data" (`app/terms/TermsClient.tsx:77`) | overstated | Same as 42. | "which removes your account data as described in the Privacy Policy; abuse reports are retained." |
| 88 | "Delete account + server data from app settings." (`proxy.ts:189`) | overstated | Same as 42. | "removes the account row, device tokens and notification prefs; abuse reports keyed by peer ID are retained; avatar removed on request" |
| 89 | "No towers, no Wi-Fi, no server." (`chat/ChatClient.tsx:144` at `fcb4eac`) | false | Group broadcasts go to the WebSocket relay whenever it is running (`TransportCoordinator.swift:306-315`). | "No towers or Wi-Fi needed, and when a phone has internet the message also passes through our relay." |
| 90 | "relaying encrypted messages for other users" (`acceptable-use/AcceptableUseClient.tsx:47` at `fcb4eac`) | overstated | Relayed traffic includes plaintext public channel text (`SendPipeline.swift:471-491`) and location packets (`FriendFinderViewModel.swift:235-265`). | "relaying packets for other users: encrypted direct and group messages, and unencrypted public channel messages and location packets" |
| 91 | "Location sharing — Friends only" (`profile/ProfileClient.tsx:308` at `fcb4eac`, live list of profile rows) | false | No such row ships: the precision picker and per-friend controls are hidden (`V1LaunchFlags.swift:51`, `LocationSettings.swift:31-34`); the visible Location group holds only a Proximity Alerts toggle (`LocationSettings.swift:47-52`) and the on/off share control is on the Nearby map. | "Location — proximity alerts; sharing itself is switched on from the Nearby map" |
| 92 | Alt texts "Location sharing set to Friends only" (`ProfileClient.tsx:65`) and "a Gate D meeting point with 45 min left, an I'm here button and a Friends only sharing control" (`nearby/NearbyClient.tsx:82`) at `fcb4eac` | false | Same as 91; meeting points are never broadcast (`V1LaunchFlags.swift:29-33`). The screenshots still show the hidden UI. | Friends-only and meeting-point phrases removed from both alts. |
| 93 | "If your event runs a Blip-equipped medical team, they see it too." (`safety/page.tsx:37` at `fcb4eac`) | false | `showMedicalResponder = false` hides the responder dashboard and a received SOS is not persisted (`V1LaunchFlags.swift:53-67`). | Sentence removed. |
| 94 | "A meeting point goes to the people you pick and expires on the timer you set when you shared it." (`NearbyClient.tsx:134` at `fcb4eac`) | false | Meeting points live only in view state and are never broadcast; the share target does nothing (`V1LaunchFlags.swift:29-33`). | Control point removed; grid reduced to two columns. |
| 95 | "maps your crew and shares meeting points" (`nearby/page.tsx:7` meta at `fcb4eac`) | false | Same as 94. | "and maps your crew" |
| 96 | "If you lose access to your device without having backed up your keys, your encrypted message history may be unrecoverable." (`terms/TermsClient.tsx:42` at `fcb4eac`) | false | No backup or key export ships (`SecuritySettings.swift:5-6,26-27`; `ProfileViewModel.swift:623-631` has no view callers). | "If you lose access to your device, your keys and your message history are lost with it; the current app has no backup or key export." |
| 97 | "encrypted group chat" (`features/page.tsx:7` meta at `fcb4eac`) | overstated | Public event channels are plaintext (`SendPipeline.swift:471-491`); only DMs and private groups are encrypted. | "group chat, end-to-end encrypted direct messages" |
| 98 | "end-to-end encrypted messaging" (`features/page.tsx:35` at `fcb4eac`) | overstated | Same as 97. | "end-to-end encrypted direct messages" |
| 99 | "encrypted messaging" (`public/llms.txt:16`) and "Noise XX + Ed25519 encryption" (`llms.txt:24`, `features/FeaturesClient.tsx:139`, `tech/page.tsx:7` meta, the last found by the round-3 phrase sweep) at `fcb4eac` | overstated | Noise XX encrypts direct messages only; Ed25519 signs packets, it does not encrypt (`NoiseHandshake.swift:7`; `Signer.swift:31-56`). | "end-to-end encrypted direct messages" / "Noise XX encrypted direct messages with Ed25519 packet signing" |
| 100 | Alt text "Blip end-to-end encrypted group chat ..." (`components/Hero.tsx:33,64`, `features/FeaturesClient.tsx:21`, `components/AppScreens.tsx:17` at `fcb4eac`) | overstated | The screenshot (`public/app-screens/08-encrypted-chat.png`) shows the "Festival Crew" private group, which uses AES-256-GCM sender keys (`SenderKeyManager.swift`); an unqualified "group chat" reads as covering public channels, which are plaintext. | "Blip end-to-end encrypted private group chat ..." in all four alts. |
| 101 | "Friend Finder — if you opt in, your approximate location is shared with your friends for the duration of your session only." (`privacy/PrivacyClient.tsx:60` at `38844a4`) | false | The payload carries full-precision Float64 latitude and longitude (`Packages/BlipProtocol/Sources/LocationPayload.swift:5-18`); `broadcastLocation()` sends it as a plaintext `.locationShare` broadcast (`FriendFinderViewModel.swift:235-248`); the receiver plots every position it gets with no friend filter (`FriendFinderViewModel.swift:158-199`; `V1LaunchFlags.swift:51`); the relay fans recipient-less packets to every connected phone (`server/relay/src/packet-router.ts:220-230`). Same falsehood as rows 71 and 79 to 86, and it contradicted lines 39 and 48 of the same policy. | "off until you switch sharing on. While it is on, your precise position is broadcast as a signed, unencrypted packet that any nearby Blip phone can receive and that our relay forwards to every connected Blip phone when a phone has internet. It is forwarded, not stored." |
| 102 | "10MB LRU cache, DMs cached 2hrs, SOS until resolved" (`tech/TechClient.tsx:38`, `proxy.ts:77`) and "holding direct messages for about two hours" (`features/chat/page.tsx:57`) at `38844a4` | false | `cacheDuration(for:)` returns 0 for an addressed `.noiseEncrypted` packet, so relay phones never cache a DM (`Packages/BlipMesh/Sources/StoreForwardCache.swift:26-31,213-218`); `dmDuration` (2 h, `:47`) is used only for `.friendRequest`/`.friendAccept` (`:252-253`). True parts: 10 MB cap (`:62`), SOS until resolved (`:59,175,227-228`). Other constants: `groupDuration` 30 min (`:50`) for recipient-less `.noiseEncrypted`, `channelDuration` 5 min (`:53`) for `.meshBroadcast` (public channel text, `SendPipeline.swift:484-485`) and `.locationShare` (`:249-250`). The internet relay's addressed queue TTL is 1 hour (`server/relay/src/store-forward/store-forward.ts:34`). | "10MB LRU cache on relay phones: private group messages 30 min, public channel and location packets 5 min, SOS until resolved; direct messages are not cached by relay phones (our internet relay holds them up to 1 hour)" / "Relay phones hold undelivered group and channel messages for a short window (30 minutes for private groups, 5 minutes for public channels) and forward them when a path opens up. A direct message is not cached by relay phones; when a phone has internet our relay holds it for up to an hour." |
| 103 | "Yes. Blip needs no Wi-Fi, no mobile data and no server to send a message." (`features/chat/page.tsx:32` at `38844a4`) | false | Same as row 89: `TransportCoordinator.broadcast` also hands every broadcast to the WebSocket relay whenever that transport is running (`Packages/BlipMesh/Sources/TransportCoordinator.swift:306-315`). `ChatClient.tsx:145-146` was reworded in round 3; this FAQ answer was missed. | "Yes. Blip needs no Wi-Fi or mobile data to send a message; when a phone has internet the message also passes through our relay." |
| 104 | "Direct messages, private group messages and friend requests travel as Noise ciphertext the relay cannot read." (`privacy/PrivacyClient.tsx:71` at `38844a4`, round-3 wording) | overstated | Friend requests are addressed Noise ciphertext (`Sources/Services/MessageService+FriendRequests.swift:424-429`, flags `.hasRecipient`). Private group messages are AES-256-GCM sender-key ciphertext carried in a `.noiseEncrypted` packet with `recipientID: nil` (`Sources/Services/MessageService.swift:1482-1511`), so the relay fans them out as recipient-less packets (`packet-router.ts:220-232`) and never writes them to the addressed queue. The sentence sat inside a paragraph about what the relay stores. | "Direct messages and friend requests travel as Noise ciphertext and private group messages as AES-256-GCM ciphertext; the relay can read none of them, and because a group message carries no recipient the relay forwards it without storing it." |
| 105 | "that does need internet on at least one side. If both you and your friend are stuck offline and not in Bluetooth range, messages will queue and deliver when one of you regains connectivity." (`support/SupportClient.tsx:151` at `38844a4`) | false | An addressed packet is queued at the relay only when the sender delivers it there, and the queue entry lives 1 hour (`server/relay/src/packet-router.ts:235-260`; `server/relay/src/store-forward/store-forward.ts:34`), so both phones must reach the relay, and within an hour of each other. Nothing in the relay stores a message for an offline sender. | "That needs both phones to reach the internet within an hour of each other: the relay holds a message for up to 1 hour and deletes it if the recipient has not collected it. If both you and your friend are offline and not in Bluetooth range, the message is delivered only once you are online to hand it to the relay and your friend connects within the following hour." |
| 106 | "An SOS reaches nearby phones running Blip and nothing else." (`safety/SafetyClient.tsx:308`) and "An SOS broadcasts over Bluetooth mesh to nearby phones running Blip" (`safety/page.tsx:32`) at `38844a4` | overstated | SOS alerts are recipient-less packets, and when a phone has internet the relay fans them to every connected Blip phone (`server/relay/src/packet-router.ts:220-230`; `TransportCoordinator.swift:306-315`). `SafetyClient.tsx:41` and `safety/page.tsx:37` on the same pages already said so after round 3. | "An SOS reaches phones running Blip and nothing else: nearby ones over the mesh and, when a phone has internet, every Blip phone connected to our relay." / "An SOS broadcasts over Bluetooth mesh to nearby phones running Blip, and when a phone has internet our relay forwards it to every Blip phone connected to it" |
| 107 | Meeting-point sentences still asserting audience, relay or offline behaviour at `38844a4`: "choose who it goes to" (`nearby/NearbyClient.tsx:93`, `nearby/page.tsx:52`), "The pin relays to your crew over the mesh ... only selected friends can see the pin" (`NearbyClient.tsx:94`), alt and caption "Share with Festival Crew ... only selected friends can see this pin" / "pick who it goes to ... above the sharing note" (`NearbyClient.tsx:98-100`), "the crew's Gate D meeting point" (`NearbyClient.tsx:84`), "a meeting point your whole crew can walk to" (`NearbyClient.tsx:158`), "drop a shared meeting point" (`nearby/page.tsx:37`), "Can I set a meeting point without signal? Yes. ... The pin travels to your crew over the mesh" (`nearby/page.tsx:50-52`), "set crew meeting points — all without reception" (`features/page.tsx:53`), "crew meeting points without internet" (`public/llms.txt:10`) | false | `showMeetingPoints = false`: points live only in view state, are never persisted or broadcast, and the Friends/Group/Everyone share target does nothing (`Sources/Utilities/V1LaunchFlags.swift:29-33`). A pin is a marker on the user's own map. Feature mentions with no audience or transport claim (`NearbyClient.tsx:89-91` heading, `proxy.ts:20,129`, `llms.txt:19`, `OrganisersClient.tsx:25`, `ChatClient.tsx:113`) stay per the John's-decision table. | Audience, relay and without-signal assertions removed; the remaining sentences say the pin is a marker on your own map and that sending it to your crew is not in the shipped app (see the round-4 pairs). |
| 108 | "Register a fresh account with the same email; friends will need to re-add you." (`support/SupportClient.tsx:119` at `38844a4`) | false | Registering again with a verified email whose row exists is case 3b: the server UPDATEs the stored keys and keeps the username, answering `recovered: true` (`server/auth/src/registration/register.ts:166-169,236-254`); the app shows a recovery confirmation screen with the existing username (`Sources/Views/Launch/CreateProfileStep.swift:680-686`). No fresh account is created. | "Verify the same email again on the new phone and confirm the takeover; your username comes back with new keys, and friends will need to re-add you." |
| 109 | "whether you show up in other people's Nearby list at all" (`nearby/NearbyClient.tsx:130`), "With it off you stop appearing to other people running Blip around you" (`profile/page.tsx:47`), "Turn it off and you stop appearing to other people running Blip around you" (`profile/ProfileClient.tsx:97`) at `38844a4` | overstated | The toggle gates only the presence announce (`Sources/Services/MessageService.swift:926`). Every BLE-connected peer is still upserted into the peer store (`Sources/Services/AppLifecycleController.swift:466-476`) and `refreshNearbyFriends` matches accepted friends against that set by key (`Sources/ViewModels/MeshViewModel.swift:262,310-313`), so a friend whose phone already holds your key this session still lists you. | "decides whether your name is announced to phones around you" / "your phone stops announcing your name to people running Blip around you" |
| 110 | "works entirely offline" (`components/FAQ.tsx:32` at `38844a4`) | overstated | Registration needs the auth server: the email code and the register call are HTTPS requests (`server/auth/src/challenge-session/otp.ts:147`; `server/auth/src/registration/register.ts`); there is no offline onboarding path. | "Once set up, Blip is an iOS messaging app that works offline using Bluetooth mesh networking. Creating your account needs internet once, to verify your email; after that it does not require ..." |

Totals: 110 claims. 23 accurate (10 of them made more specific), 52 overstated, 35 false, 0 unverifiable. Row 42 (account deletion) moved from accurate to false in round 2 once the abuse-report table and the missing avatar deletion path were checked. Round 3 added rows 89 to 100 (5 overstated, 7 false) and revised the corrected wording of rows 11, 34, 36, 40, 41, 57, 60, 71, 79 to 82 and 86. Round 4 added rows 101 to 110 (4 overstated, 6 false) and revised row 41 again.

## Additions requested by the ticket

The ticket asks for the primitive list to be specific. Two rows were added to the `/tech` Encryption table and its `proxy.ts` mirror, each backed by code: group messages (AES-256-GCM sender keys) and public event channels (signed, not encrypted). A recovery kit row was added in round 1 and removed in round 2: `exportRecoveryKit` and `importRecoveryKit` exist only in `ProfileViewModel.swift:623-631`, no view calls them, and the Settings row for export is disabled (`SecuritySettings.swift:5-6,26-27`). If either remaining row should not be published, drop it; the audit stands without it.

## Pricing: needs John's decision

No "starting at" or "from" teasers exist on the site (grep of `src/` for `starting at`, `from $`, `from just`, `as low as`). Every price-model assertion below is left as written because the launch model is John's call. What the code shows: the app ships a Message Packs store (`au.heyblip.Blip.starter10` through `unlimited`) backed by `users.message_balance`; the server receipt endpoint is unimplemented (501); there is no verified-profile product. In v1 the store, paywall, verified-profile sheet and StoreKit start-up are hidden behind `V1LaunchFlags.showMessagePackStore = false`, whose comment reads "v1 ships free" (`Sources/Utilities/V1LaunchFlags.swift:69-79`).

| Where | Sentence as written | Proposed neutral wording (true under any model) |
|---|---|---|
| `components/Pricing.tsx:43-46` | "Optional verified profile. Messaging, friend finding, and SOS are free. Verification is a one-time add-on for people who want a visible trust marker." | Remove the section until the App Store Connect products exist, or replace with the actual product names and prices. |
| `components/Pricing.tsx:66-75` | "Verified Profile ... $15 one-time ... One payment for a persistent profile marker." | No verified-profile IAP exists in the app source. Delete, or replace with the real product. |
| `components/Pricing.tsx:24-25` | "No core feature lockout: Messaging, friend finding, and SOS stay available without paying." | Conflicts with `message_balance` and Message Packs in the app. Delete, or state exactly which actions consume a message credit. |
| `components/FAQ.tsx:42` | "Yes. Blip is currently free to download from the App Store. There are no ads, no subscriptions required for core messaging features, and no paid tiers gating the essentials like text, voice notes, photos, or SOS alerts." | "Blip is free to download from the App Store. There are no ads." (only if the listing is free; drop the "no paid tiers" clause unless Message Packs are removed). |
| `components/CTA.tsx:34` | "Free to try. Requires iPhone with iOS 17+." | "Requires iPhone with iOS 17+." |
| `app/download/page.tsx:7` | "Free core messaging, requires iOS 17 or newer." | "Requires iOS 17 or newer." |
| `app/features/*/…Client.tsx` (at `fc883c0` chat:157, profile:143, nearby:174; at the round-4 head chat:158, profile:143, nearby:170) | "Free on the App Store. iPhone, iOS 17+." | "On the App Store. iPhone, iOS 17+." |
| `app/layout.tsx:154-156` | JSON-LD `Offer { price: "0", priceCurrency: "AUD" }` | Keep only if the listing is free; otherwise remove the Offer. |
| `proxy.ts:9,35` | "**Price:** Free" / "Free. No subscriptions gating core messaging." | "**Price:** see the App Store listing" / remove the Pricing section. |
| `.agents/product-marketing-context.md` | "Free download; premium tier planned" / "Currently free while in early alpha / testflight; paid tier TBD" | Update once decided; the marketing skills read this file. |
| `public/llms.txt:3` | "Blip is a free iOS app for chatting at festivals" | "Blip is an iOS app for chatting at festivals" |
| `public/llms.txt:12` | "iOS (iPhone) only; free download" | "iOS (iPhone) only" |

## Needs John's sign-off before publish

Each sentence below is accurate against `e9a38e8` and already in the branch, but discloses something a reader could find unwelcome. Site lines in this table and the two tables after it are at the round-4 head unless a commit is named. Publish, soften with a matching code change, or hold.

| Disclosure | Where | Code |
|---|---|---|
| Account deletion keeps abuse reports keyed by the reporter's and subject's peer ID with free-text reasons, and the avatar has no automatic deletion path | `PrivacyClient.tsx:88`, `TermsClient.tsx:77`, `SupportClient.tsx:87`, `proxy.ts:188` | `server/auth/migrations/005_abuse_reports.sql` ("No FK to users, reports must survive account deletion"); `account.ts:20-23`; no avatar delete in `server/cdn/src/avatars/avatars.ts` or `Sources/` |
| Public event channel messages are readable by the relay | `PrivacyClient.tsx:46` | `SendPipeline.swift:471-491` |
| Announce packets reach the relay in plaintext with username, display name and geohash | `TechClient.tsx:48` | `MessageService.swift:945-954` |
| Microsoft Clarity SDK is linked into the binary (debug-only init) | `PrivacyClient.tsx:49` | `App/AppDelegate.swift:4,35-37` |
| Sentry crash reports may include a screenshot and carry username plus an account identifier | `PrivacyClient.tsx:82`, `proxy.ts` third parties | `CrashReportingService.swift:62,198-204` |
| Location packets pass through the relay when a phone has internet | `NearbyClient.tsx:78`, `nearby/page.tsx:42` | `TransportCoordinator.swift:306-315` |
| Recipient-less packets that reach the relay (Friend Finder positions, I'm Here beacons, SOS alerts, public channel text) are fanned out to every Blip phone connected to the single relay room, not only nearby phones; only announces are geohash-scoped (round 3) | `PrivacyClient.tsx:48`, `llms.txt:11`, `NearbyClient.tsx:77,126,258`, `profile/page.tsx:42`, `ProfileClient.tsx:93`, `SafetyClient.tsx:41`, `safety/page.tsx:37` | `server/relay/src/packet-router.ts:220-230`; `server/relay/src/index.ts:90,195` |
| The relay writes the SOS owner's precise GPS in plaintext to relay storage, online or not, until the accepter acknowledges it or 1 hour passes (round 3 wording). Depends on `showMedicalResponder`: the only sender of `.sosAccept` is the hidden medical dashboard, so today no shipped UI triggers this path, but the owner-side handler answers any accept packet on the wire | `PrivacyClient.tsx:48,71`, `FAQ.tsx:62`, `proxy.ts:178` | `relay-room.ts:584`; `packet-router.ts:235-240`; `SOSViewModel.swift:772-795`; `V1LaunchFlags.swift:67`; `MedicalDashboardView.swift:266` |
| Any nearby Blip phone can plot a shared position; there is no friends-only audience | `NearbyClient.tsx:50,77,126,258`, `profile/page.tsx:42`, `ProfileClient.tsx:93`, `llms.txt:11` | `FriendFinderViewModel.swift:158-199`; `V1LaunchFlags.swift:51` |
| A removed group member can decrypt until the next 100-message rotation | `TechClient.tsx:50`, `proxy.ts:87` | `SenderKeyManager.swift:241-242`; `rotateKey(forChannel:reason:)` has no callers |
| No working backup or recovery kit | `SupportClient.tsx:119` | `SecuritySettings.swift:5-6,26-27` |
| The plaintext email can reach Sentry as a breadcrumb: the `send-code <address>` log line is forwarded to `addBreadcrumb` and `beforeSend` does not scrub it, so a crash in the same sign-in session ships it (round 4). A one-line redaction of the address at `EmailVerificationService.swift:65` would remove the caveat from the policy; that is an app ticket for John, not a change in this repo | `PrivacyClient.tsx:82` | `EmailVerificationService.swift:57,65`; `DebugLogger.swift:307-312`; `CrashReportingService.swift:79-99,213-217` |
| The site sells a $15 one-time Verified Profile add-on that cannot be bought in the shipped build (round 4). The StoreKit product list holds six message packs and no verified-profile product, the verified CTA string reads "Unavailable until StoreKit verification is wired", and `showMessagePackStore = false` hides the store, paywall and verified-profile sheet entirely. Price copy is John's list and is left as written; see the pricing table and the `showMessagePackStore` entry under Flag dependencies | `components/Pricing.tsx:43-75` | `Sources/ViewModels/StoreViewModel.swift:91-98`; `Sources/Views/Tabs/ProfileTab/MessagePackStore.swift:13`; `Sources/Utilities/V1LaunchFlags.swift:69-79` |

## Unshipped features, copy removed or reworded (round 3)

Each sentence below asserted, as present-tense behaviour, a feature that `Sources/Utilities/V1LaunchFlags.swift` hides in the shipped app. Round 3 rewrote or removed them (claims rows 91 to 96). The `before` wording is kept here so it can be restored when the flag flips.

| Where (at `fcb4eac`) | Before | Now | Flag |
|---|---|---|---|
| `profile/ProfileClient.tsx:308` | "Location sharing — Friends only" | "Location — proximity alerts; sharing itself is switched on from the Nearby map" | `showLocationPrecisionControls` (`V1LaunchFlags.swift:45-51`) |
| `profile/ProfileClient.tsx:65` (alt) | "rows for Location sharing set to Friends only, Nearby visibility On, ..." | "rows for Location, Nearby visibility On, ..." | `showLocationPrecisionControls` |
| `nearby/NearbyClient.tsx:82` (alt) | "Priya 2 min away, a Gate D meeting point with 45 min left, an I'm here button and a Friends only sharing control" | "Priya 2 min away, and an I'm here button" | `showMeetingPoints`, `showLocationPrecisionControls` |
| `nearby/NearbyClient.tsx:134` | Control point "Pins that run out": "A meeting point goes to the people you pick and expires on the timer you set when you shared it." | Removed; control-point grid is now two columns | `showMeetingPoints` (`V1LaunchFlags.swift:29-33`) |
| `nearby/page.tsx:7` (meta) | "maps your crew and shares meeting points" | "and maps your crew" | `showMeetingPoints` |
| `safety/page.tsx:37` | "If your event runs a Blip-equipped medical team, they see it too." | Removed | `showMedicalResponder` (`V1LaunchFlags.swift:53-67`) |
| `terms/TermsClient.tsx:42` | "If you lose access to your device without having backed up your keys, your encrypted message history may be unrecoverable." | "If you lose access to your device, your keys and your message history are lost with it; the current app has no backup or key export." | none (recovery kit has no UI: `SecuritySettings.swift:5-6,26-27`) |
| `nearby/NearbyClient.tsx:93` and `nearby/page.tsx:52` (round 4, at `38844a4`) | "give it a label, choose who it goes to, and set how long it lasts" | "give it a label, and set how long it lasts" | `showMeetingPoints` |
| `nearby/NearbyClient.tsx:94` (round 4) | "The pin relays to your crew over the mesh exactly like a message does, then shows on their map with the time remaining on it. The sheet tells you the venue and the location accuracy your phone reported, and states plainly that only selected friends can see the pin." | "In this build the pin is a marker on your own map, shown with the time remaining on it; sending it to your crew over the mesh is not in the shipped app. The sheet tells you the venue and the location accuracy your phone reported." | `showMeetingPoints` |
| `nearby/NearbyClient.tsx:84,98-100` (round 4, alt and caption) | "the crew's Gate D meeting point"; "fields for Label Gate D, Share with Festival Crew and Expires in 45 minutes, a Share meeting point button, and a note that only selected friends can see this pin"; "Label the pin, pick who it goes to, give it an expiry. The venue and reported accuracy sit under the fields, above the sharing note." | "a Gate D meeting point"; "fields for Label Gate D and Expires in 45 minutes, and a Share meeting point button"; "Label the pin and give it an expiry. The venue and reported accuracy sit under the fields." | `showMeetingPoints` |
| `nearby/NearbyClient.tsx:158` (round 4) | "lets you drop a meeting point your whole crew can walk to" | "lets you mark a meeting point on the map" | `showMeetingPoints` |
| `nearby/page.tsx:37` (round 4) | "you can drop a shared meeting point" | "you can mark a meeting point on your own map" | `showMeetingPoints` |
| `nearby/page.tsx:52` (round 4, FAQ answer) | "Yes. Pick a spot — a gate, a stage, a food van — give it a label, choose who it goes to, and set how long it lasts. The pin travels to your crew over the mesh, the same way a message does. On the map it shows as a flagged pin with the time remaining, so nobody has to ask where again." | "In this build a meeting point is a marker on your own map. Pick a spot — a gate, a stage, a food van — give it a label, and set how long it lasts; it shows as a flagged pin with the time remaining. It does not travel to your crew over the mesh; sending a pin to friends is not in the shipped app." | `showMeetingPoints` |
| `features/page.tsx:53` (round 4) | "set crew meeting points — all without reception" | "mark a meeting point on it — all without reception" | `showMeetingPoints` |
| `public/llms.txt:10` (round 4) | "Find friends nearby, friend map, and crew meeting points without internet" | "Find friends nearby, friend map, and a meeting-point marker on your own map, all without internet" | `showMeetingPoints` |

The screenshots at `public/app-screens/05-nearby.png`, `13-profile.png` and `14-meeting-point.png` still show the hidden Friends-only row, sharing control, meeting-point pin and the Share with field and friends-only note on the meeting-point sheet; the alt texts no longer describe them.

## Flag dependencies

Flipping a `V1LaunchFlags` value does not by itself make the older copy true. Check before restoring any sentence from the table above.

- `showMeetingPoints` (`V1LaunchFlags.swift:29-33`): shows the drop button and sheets, but points still live only in view state and are never persisted or broadcast, so "goes to the people you pick", "shares meeting points", "choose who it goes to", "relays to your crew over the mesh", "only selected friends can see the pin" and the round-4 "marker on your own map" wording all need re-checking against the rebuilt feature before any of them is restored or removed.
- `showMessagePackStore` (`V1LaunchFlags.swift:69-79`): re-enables the Message Packs store and paywall, which contradicts every "free" sentence in the pricing table above (`Pricing.tsx`, `FAQ.tsx:42`, `CTA.tsx:34`, `download/page.tsx:7`, `proxy.ts:9,35`, `llms.txt:3,12`, the JSON-LD `Offer`). It does not make the $15 Verified Profile add-on purchasable: no such product exists in `StoreViewModel.swift:91-98` and the verified CTA is a placeholder (`MessagePackStore.swift:13`). See the sign-off row above.
- `showLocationPrecisionControls` (`V1LaunchFlags.swift:45-51`): shows the precision picker and per-friend rows, but `broadcastLocation()` ignores them and sends full accuracy, so "any nearby Blip phone can receive" and the relay fan-out sentences stay true and "Friends only" stays false.
- `showMedicalResponder` (`V1LaunchFlags.swift:53-67`): the SOS-accept path in the sign-off table depends on it. Today no shipped UI sends `.sosAccept`; the owner-side handler still answers any accept packet on the wire.

## Unshipped features the site markets (out of scope for BDEV-251, needs John's decision)

Found during the round-2 and round-4 sweeps. Each is hidden in the shipped app by `Sources/Utilities/V1LaunchFlags.swift`, or simply absent from it, and left as written because removing a feature section is a product call, not a claims fix. The false audience and behaviour sentences that sat inside these sections were fixed in round 3 (table above).

| Where | What the site says | What ships |
|---|---|---|
| `app/features/nearby/page.tsx:50-53`, `nearby/NearbyClient.tsx:84-101,158`, `app/features/page.tsx:53`, `proxy.ts:20,129`, `public/llms.txt:10,19`, `organisers/OrganisersClient.tsx:25`, `chat/ChatClient.tsx:113` (lines at the round-4 head) | Meeting points as a feature: the section heading, screenshot, FAQ question and list items. Since round 4 every sentence in these places that said who can see a pin, that it relays to your crew, or that it works without signal has been removed or now says the pin is a marker on your own map and sending it to friends is not in the shipped app (row 107, table above). | `showMeetingPoints = false` (`V1LaunchFlags.swift:29-33`): the drop button and sheets are hidden, points live only in view state, are never persisted or broadcast, and the share target does nothing. Whether the feature section stays on the site at all is John's call. |
| `nearby/NearbyClient.tsx:60,65,67`, `components/AppScreens.tsx:11` (round 4, at the round-4 head) | "People you have not added show up too, with an Add Friend button next to them"; the Nearby screenshot alt and caption describe a non-friend with an Add Friend button | The shipped Nearby tab renders only `nearbyFriends` and its header count is friends-only (`Sources/Views/Tabs/NearbyTab/NearbyView.swift:150-159`); strangers do not appear in the list. Copy left as written; recorded for John. |
| `app/layout.tsx:39` | SEO keyword "end-to-end encrypted messenger" | Only direct messages and private groups are end-to-end encrypted. Left as a keyword; change if John wants keywords held to the same standard as copy. |

## Before and after, every changed sentence

147 before/after pairs. Round-1 pairs are against `fc883c0`; round-2 pairs (from the recovery-kit entry for `SupportClient.tsx` onward) are against the round-1 copy at `76dccbd`; round-3 pairs (own subsection) are against `fcb4eac`; round-4 pairs (own subsection at the end, 24 pairs) are against `38844a4`. Where round 2 revised a round-1 sentence, the round-1 pair's `after` shows the final wording. Each `before` string occurred exactly once in its file when applied.

- `src/components/Hero.tsx`
  - before: '{ label: "Privacy", value: "E2E encrypted" }'
  - after: '{ label: "Privacy", value: "E2E encrypted DMs" }'
- `src/components/Hero.tsx`
  - before: 'Bluetooth mesh. Encrypted relay. SOS priority.'
  - after: 'Bluetooth mesh. Encrypted direct messages. SOS priority.'
- `src/components/Hero.tsx`
  - before: '<p className="text-sm text-[var(--muted-strong)]">Encrypted relay</p>'
  - after: '<p className="text-sm text-[var(--muted-strong)]">Encrypted direct messages</p>'
- `src/components/Security.tsx`
  - before: 'copy: "Messages are encrypted before they leave your device."'
  - after: 'copy: "Direct messages and private group chats are encrypted on your device before they leave it. Public event channels are signed but not encrypted."'
- `src/components/Security.tsx`
  - before: 'copy: "Phones that pass a message along cannot read its contents."'
  - after: 'copy: "Phones that relay a direct or group message carry ciphertext they cannot open. They do see the packet header: sender and recipient IDs, packet type, and hop count."'
- `src/components/Security.tsx`
  - before: 'copy: "Noise XX and Ed25519 protect sessions and packet authenticity."'
  - after: 'copy: "Noise XX (Curve25519, ChaCha20-Poly1305, HKDF-SHA-256) protects sessions. Ed25519 signatures protect packet authenticity."'
- `src/components/Security.tsx`
  - before: 'Blip uses the phones around you as transport, not as trusted servers.\n              They can help a packet move without seeing what is inside it.'
  - after: 'Blip uses the phones around you as transport, not as trusted servers.\n              For direct messages and private groups, they can help a packet move\n              without seeing what is inside it. Public event channels are open to\n              everyone at the event by design.'
- `src/components/Features.tsx`
  - before: 'detail: "Relay devices cannot read messages."'
  - after: 'detail: "Relay devices cannot read direct or private group messages."'
- `src/components/AppScreens.tsx`
  - before: 'text: "End-to-end encrypted chats, location sharing you control."'
  - after: 'text: "End-to-end encrypted direct messages, location sharing you switch on and off."'
- `src/components/FAQ.tsx`
  - before: '"Yes. Every direct message on Blip is end-to-end encrypted using the Noise protocol framework (Noise_XX_25519_ChaChaPoly_SHA256) with Ed25519 packet signing. The phones that relay your messages through the mesh cannot read them — only the intended recipient\'s device can decrypt the content."'
  - after: '"Direct messages, yes. Every direct message on Blip is end-to-end encrypted using the Noise protocol framework (Noise_XX_25519_ChaChaPoly_SHA256) with Ed25519 packet signing, so the phones that relay it through the mesh cannot read it. Private group chats are encrypted with AES-256-GCM sender keys exchanged over those Noise sessions. Public event channels are Ed25519-signed but not encrypted, because anyone at the event can join them."'
- `src/components/FAQ.tsx`
  - before: '"No. Blip does not collect precise GPS location, contacts, browsing history, or advertising identifiers. The only data stored server-side is your email, username, cryptographic public keys, and push notification token — the minimum required to deliver messages. Location is only shared with your friends during an active Friend Finder session and is not persisted on the server."'
  - after: '"Blip does not collect contacts, browsing history, or advertising identifiers, and we keep no database of GPS coordinates. Server-side we store a SHA-256 hash of your email (not the address itself), your username, your cryptographic public keys, your push notification token, your avatar if you upload one, and your notification preferences. While the app is connected to our relay it also holds, in memory only, a 5-character geohash (a cell roughly 5 km across) from your presence announcements. Friend Finder positions are broadcast to nearby phones over the mesh and are not stored on the server. One exception: if someone accepts your SOS alert while they are offline, our relay queues the packet carrying your precise position for up to an hour so it can be delivered when they reconnect."'
- `src/app/layout.tsx`
  - before: 'Blip uses end-to-end encrypted Bluetooth mesh to relay messages, voice notes, photos, and SOS alerts phone-to-phone.'
  - after: 'Blip relays messages, voice notes, photos, and SOS alerts phone-to-phone over Bluetooth mesh, with end-to-end encrypted direct messages.'
- `src/app/layout.tsx`
  - before: 'End-to-end encrypted peer-to-peer messaging via BLE mesh with Noise XX handshake and Ed25519 packet signing.'
  - after: 'End-to-end encrypted direct messaging via BLE mesh with Noise XX handshake and Ed25519 packet signing.'
- `src/app/layout.tsx`
  - before: '"End-to-end encrypted messages (Noise XX + Ed25519)"'
  - after: '"End-to-end encrypted direct messages (Noise XX + Ed25519)"'
- `src/app/tech/TechClient.tsx`
  - before: '{ label: "Key agreement", value: "Noise XX handshake (Curve25519 + ChaChaPoly + SHA256)" }'
  - after: '{ label: "Key agreement", value: "Noise_XX_25519_ChaChaPoly_SHA256 (Curve25519 DH, ChaCha20-Poly1305 AEAD, HKDF-SHA-256)" }'
- `src/app/tech/TechClient.tsx`
  - before: '{ label: "Key distribution", value: "Noise + signing public keys exchanged in announce payload" }'
  - after: '{ label: "Key distribution", value: "Noise + signing public keys sent in the announce payload, alongside username, display name, and a 5-character geohash (all plaintext)" }'
- `src/app/tech/TechClient.tsx`
  - before: '{ label: "Session management", value: "Noise session per peer pair, rekeying on reconnect" },'
  - after: '{ label: "Session management", value: "Noise session per peer pair; fresh ephemeral keys per handshake; send-direction rekey every 1,000 messages or 1 hour; sessions expire after 4 hours" },\n      { label: "Group messages", value: "AES-256-GCM per-sender keys, distributed over pairwise Noise sessions, rotated every 100 messages; a member who leaves can still decrypt until the next rotation" },\n      { label: "Public event channels", value: "Ed25519-signed, not encrypted (open to everyone at the event)" },'
- `src/app/tech/TechClient.tsx`
  - before: 'festival-scale and event-scale crowds with end-to-end encryption\n              (Noise XX handshake on Curve25519 + ChaChaPoly + SHA256), adaptive\n              gossip routing, and Ed25519 packet signing.'
  - after: 'festival-scale and event-scale crowds with end-to-end encrypted direct\n              messages (Noise XX handshake on Curve25519 + ChaChaPoly + SHA256),\n              adaptive gossip routing, and Ed25519 packet signing.'
- `src/proxy.ts`
  - before: '**Encryption:** End-to-end (Noise XX + Ed25519)'
  - after: '**Encryption:** End-to-end for direct messages (Noise XX + Ed25519); private groups use AES-256-GCM sender keys; public event channels are signed, not encrypted'
- `src/proxy.ts`
  - before: '- **Private by default.** Messages are encrypted before they leave your phone. Relay phones cannot read them.'
  - after: '- **Private by default.** Direct and group messages are encrypted before they leave your phone. Relay phones cannot read them. Public event channels are open to everyone at the event.'
- `src/proxy.ts`
  - before: 'Every direct message is end-to-end encrypted with Noise_XX_25519_ChaChaPoly_SHA256 and packet-signed with Ed25519. Blip uses email-based account setup, no phone numbers, and no ad tracking. Only your email, username, public keys, and push token are stored server-side.'
  - after: 'Every direct message is end-to-end encrypted with Noise_XX_25519_ChaChaPoly_SHA256 and packet-signed with Ed25519. Private group chats use AES-256-GCM sender keys. Public event channels are signed but not encrypted. Blip uses email-based account setup, no phone numbers, and no ad tracking. Server-side we store a SHA-256 hash of your email (not the address), your username, public keys, push token, avatar if uploaded, and notification preferences.'
- `src/proxy.ts`
  - before: '- Key agreement: Noise XX handshake (Curve25519 + ChaChaPoly + SHA256)'
  - after: '- Key agreement: Noise_XX_25519_ChaChaPoly_SHA256 (Curve25519 DH, ChaCha20-Poly1305 AEAD, HKDF-SHA-256)'
- `src/proxy.ts`
  - before: '- Key distribution: Noise + signing public keys exchanged in announce payload'
  - after: '- Key distribution: Noise + signing public keys sent in the announce payload, alongside username, display name, and a 5-character geohash (all plaintext)'
- `src/proxy.ts`
  - before: '- Session management: Noise session per peer pair, rekeying on reconnect'
  - after: '- Session management: Noise session per peer pair; fresh ephemeral keys per handshake; send-direction rekey every 1,000 messages or 1 hour; sessions expire after 4 hours\n- Group messages: AES-256-GCM per-sender keys, distributed over pairwise Noise sessions, rotated every 100 messages; a member who leaves can still decrypt until the next rotation\n- Public event channels: Ed25519-signed, not encrypted (open to everyone at the event)'
- `src/proxy.ts`
  - before: 'End-to-end encrypted Bluetooth mesh, built for crowds of 100,000+.'
  - after: 'Bluetooth mesh with end-to-end encrypted direct messages, built for crowds of 100,000+.'
- `src/proxy.ts`
  - before: '- Email address (plaintext, for verification and recovery)\n- Username and display name'
  - after: '- Email address: stored only as a SHA-256 hash. The address itself is held for up to an hour (verification code and rate limiting), then discarded; only the hash remains\n- Username (your display name travels in your presence announcement and is not stored in our database)'
- `src/proxy.ts`
  - before: '- Approximate location — session-only, only when Friend Finder is opted in'
  - after: '- Approximate location: a 5-character geohash (a cell roughly 5 km across) sent in presence announcements while Nearby visibility is on and location permission is granted, held in relay memory only and dropped on disconnect'
- `src/proxy.ts`
  - before: '- Message content (E2E encrypted; we cannot decrypt)'
  - after: '- Message content of direct and group messages (E2E encrypted; we cannot decrypt). Public event channel messages are not encrypted'
- `src/proxy.ts`
  - before: '- Precise GPS (except during an active SOS you explicitly trigger)'
  - after: "- A database of precise GPS. Coordinates leave your phone for Friend Finder, I'm Here beacons, and SOS responders, as signed, unencrypted mesh packets that are relayed, not stored. One exception: when someone accepts your SOS alert while offline, the relay queues the packet carrying your precise position for up to 1 hour"
- `src/proxy.ts`
  - before: 'Sentry (crash reports, anonymised)'
  - after: 'Sentry (crash reports; may include a screenshot of the screen at the moment of the crash, tagged with your username and an app-generated account identifier)'
- `src/app/privacy/page.tsx`
  - before: 'We store only email, username, public keys, and push tokens — nothing else.'
  - after: 'We store a hash of your email, your username, public keys, push token, avatar and notification preferences, and never your messages.'
- `src/app/privacy/PrivacyClient.tsx`
  - before: 'Your messages are end-to-end encrypted before they ever leave your device, and we collect only the minimum data needed to operate the service.'
  - after: 'Direct messages and private group chats are end-to-end encrypted before they ever leave your device, and we collect only the minimum data needed to operate the service.'
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<li><strong>Email address</strong> — stored in plaintext. Used for account verification (via email code) and account recovery.</li>'
  - after: '<li><strong>Email address</strong> — stored only as a SHA-256 hash, which is what we use to recognise your account and for recovery. The address itself is held for up to an hour, while your verification code is live and for rate limiting on code requests, and is passed to our email provider to deliver the code. Then it is discarded; only the hash remains.</li>'
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<li><strong>Username and display name</strong> — chosen by you during setup. Used to identify you to other users.</li>'
  - after: '<li><strong>Username</strong> — chosen by you during setup and stored on our server. Your display name is not stored in our database; it travels in the presence announcement your phone broadcasts to nearby phones and to the relay.</li>'
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<li><strong>APNs device token</strong> — provided by Apple when you enable push notifications. Stored server-side to deliver push notifications to your device.</li>'
  - after: "<li><strong>APNs device token</strong> — provided by Apple when you enable push notifications. Stored server-side, along with your device locale and app version, to deliver push notifications to your device. Push notifications carry the sender's username and a thread identifier (for direct messages, a UUID derived from the sender's peer ID), never message content.</li>"
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<li><strong>JWT session tokens</strong> — issued by our authentication server to maintain your logged-in session. These are short-lived and refreshed automatically.</li>'
  - after: '<li><strong>JWT session tokens</strong> — issued by our authentication server after an Ed25519 challenge-response to maintain your logged-in session. They expire after one hour and are refreshed automatically.</li>'
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<li><strong>Approximate location</strong> — only when you actively opt in to Friend Finder. Location data is session-only and is not stored persistently on our servers.</li>'
  - after: "<li><strong>Approximate location</strong> — when you grant location permission and Nearby visibility is on, your phone's presence announcement includes a 5-character geohash (a cell roughly 5 km across). Our relay keeps it in memory while you are connected, uses it to scope who receives your announcement, and drops it when you disconnect. It is never written to a database. Friend Finder positions are shared over the mesh, not through our servers.</li>"
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<li><strong>Message content</strong> — all direct messages are end-to-end encrypted using the Noise protocol (Noise_XX_25519_ChaChaPoly_SHA256). Group messages use AES-256-GCM sender key encryption. Our servers relay encrypted packets and cannot decrypt or read your messages.</li>'
  - after: '<li><strong>Message content</strong> — all direct messages are end-to-end encrypted using the Noise protocol (Noise_XX_25519_ChaChaPoly_SHA256). Private group messages use AES-256-GCM sender key encryption. Our servers relay these packets and cannot decrypt or read them. Messages in public event channels are Ed25519-signed but not encrypted: anyone at the event can read them, and so can our relay when it forwards them.</li>'
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<li><strong>Precise location</strong> — we do not collect precise GPS data except during an active SOS alert, which is an emergency-only feature you must explicitly trigger.</li>'
  - after: "<li><strong>Precise location</strong> — we keep no database of GPS coordinates. Precise coordinates leave your phone when you share your position in Friend Finder, drop an I'm Here beacon, or someone accepts your SOS alert (the alert itself carries only a coarse geohash). They travel as signed, unencrypted mesh packets to nearby phones and through our relay when a phone has internet. The relay does not keep them, with one exception: if the person who accepted your SOS is offline, the packet with your coordinates waits in the relay queue for up to 1 hour.</li>"
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<li><strong>Browsing history or usage analytics</strong> — we do not collect any browsing data and do not use any third-party analytics services, ad networks, or tracking pixels.</li>'
  - after: '<li><strong>Browsing history or usage analytics</strong> — we do not collect any browsing data and do not use any third-party analytics services, ad networks, or tracking pixels. The Microsoft Clarity SDK is linked into the app for our internal debug builds only and is never initialised in App Store builds.</li>'
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<p>When your device relays messages for other users through the Bluetooth mesh network, those messages are encrypted before transmission. Your device cannot decrypt or read relayed messages. Relay participation is automatic and is a core part of how the mesh network functions — it does not expose any personal data.</p>'
  - after: "<p>When your device relays direct or group messages for other users through the Bluetooth mesh network, those messages are encrypted before transmission and your device cannot decrypt or read them. Relay participation is automatic and is a core part of how the mesh network functions. A relaying device does see each packet's header (sender and recipient IDs, which are hashes of public keys, plus packet type and hop count), and it can read public event channel messages and presence announcements, which are not encrypted.</p>"
- `src/app/privacy/PrivacyClient.tsx`
  - before: 'Our backend infrastructure stores your account information (email, username, public keys, APNs token) in a Neon Postgres database. Backend services run on Cloudflare Workers at edge locations. All communication between your device and our servers is encrypted via TLS with certificate pinning. The WebSocket relay uses store-and-forward delivery for encrypted packets only — stored packets have a 1-hour TTL and are automatically cleaned up.'
  - after: 'Our backend infrastructure stores your account information (email hash, username, public keys, APNs token, notification preferences) in a Neon Postgres database, and your avatar in Cloudflare storage. Backend services run on Cloudflare Workers at edge locations. All communication between your device and our servers is encrypted via TLS with certificate pinning. The WebSocket relay queues every addressed packet for an offline recipient, whatever its type, for up to 1 hour, then deletes it. For direct and private group messages the queued payload is ciphertext the relay cannot read. One addressed packet is not encrypted: when someone accepts your SOS alert, your phone sends them your precise GPS coordinates as a signed, unencrypted packet, and if that person is offline the packet, coordinates included, sits in the relay queue until they reconnect or the hour passes. The relay also sees the header of every packet (sender and recipient IDs, type, timestamps).'
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<li><strong>Sentry</strong> — crash reporting and performance monitoring. Collects anonymised diagnostic data only — no message content or personal identifiers.</li>'
  - after: "<li><strong>Sentry</strong> — crash reporting and performance monitoring. We disable Sentry's default personal-data collection and never send message content or your email. A crash report may include a screenshot of whatever was on screen at the moment of the crash, and is tagged with your username and an app-generated account identifier so we can group reports per account.</li>"
- `src/app/features/page.tsx`
  - before: 'A profile without a phone number, cryptographic identity, friends-only location sharing, and battery controls built for long event days.'
  - after: 'A profile without a phone number, cryptographic identity, location sharing you switch on and off, and battery controls built for long event days.'
- `src/app/features/FeaturesClient.tsx`
  - before: 'Blip relays messages phone-to-phone over encrypted Bluetooth mesh, so'
  - after: 'Blip relays messages phone-to-phone over Bluetooth mesh, so'
- `src/app/features/chat/page.tsx`
  - before: '"Yes. Blip agrees keys with a Noise XX handshake (Curve25519, ChaChaPoly, SHA256) and signs packets with Ed25519. The phones that relay your message through the crowd carry ciphertext they cannot open. It is strong, standard cryptography — not a proprietary scheme, and not military-grade marketing."'
  - after: '"Direct messages and private groups, yes. Blip agrees keys with a Noise XX handshake (Curve25519, ChaChaPoly, SHA256) and signs packets with Ed25519. The phones that relay your direct message through the crowd carry ciphertext they cannot open. Public event channels are signed but not encrypted, because anyone at the event can join them. It is strong, standard cryptography — not a proprietary scheme, and not military-grade marketing."'
- `src/app/features/chat/ChatClient.tsx`
  - before: 'heading: "Encrypted chat with no signal — and no relay can read it",'
  - after: 'heading: "Encrypted direct messages with no signal — and no relay can read them",'
- `src/app/features/chat/ChatClient.tsx`
  - before: '"Every thread runs end-to-end encrypted. Keys are agreed with a Noise XX handshake, and packets are signed with Ed25519, so a phone that relays your message is carrying ciphertext it cannot open.",'
  - after: '"Every direct message and private group runs end-to-end encrypted. Keys are agreed with a Noise XX handshake, and packets are signed with Ed25519, so a phone that relays your message is carrying ciphertext it cannot open. Public event channels are signed but not encrypted, because anyone at the event can join them.",'
- `src/app/features/chat/ChatClient.tsx`
  - before: 'They arrive sealed, they leave sealed, and the relay only ever sees enough to forward the packet.'
  - after: 'They arrive sealed, they leave sealed, and the relay only ever sees the packet header: who sent it, who it is for, and how many hops it has left.'
- `src/app/features/chat/ChatClient.tsx`
  - before: 'Padlock badges mark encrypted direct messages. The header of every thread says end-to-end encrypted, in plain words.'
  - after: 'Padlock badges mark encrypted direct messages, and the header of a direct message thread says end-to-end encrypted, in plain words.'
- `src/app/features/chat/ChatClient.tsx`
  - before: 'onward, up to seven hops. No towers, no Wi-Fi, no server. Everything\n              stays end-to-end encrypted along the way.'
  - after: 'onward, up to seven hops. No towers, no Wi-Fi, no server. Direct\n              messages stay end-to-end encrypted along the way.'
- `src/app/features/profile/page.tsx`
  - before: 'Your iPhone generates an Ed25519 key pair when you install the app, and that key is your identity on the mesh.'
  - after: 'Your iPhone generates a Curve25519 key pair for encryption and an Ed25519 key pair for signing when you install the app, and a hash of the Curve25519 public key is your identity on the mesh.'
- `src/app/features/profile/page.tsx`
  - before: 'Message content is end-to-end encrypted, and at an event it travels phone-to-phone rather than through a Blip server.'
  - after: 'Direct messages are end-to-end encrypted; at an event they travel phone-to-phone, and when a phone has internet they can also pass through our relay as ciphertext.'
- `src/app/features/profile/ProfileClient.tsx`
  - before: '{ label: "Identity", value: "Ed25519 key pair" }'
  - after: '{ label: "Identity", value: "Curve25519 + Ed25519 key pairs" }'
- `src/app/features/profile/ProfileClient.tsx`
  - before: 'When you install the app your iPhone generates an Ed25519 key pair, and that key is your identity on the mesh.'
  - after: 'When you install the app your iPhone generates a Curve25519 key pair for encryption and an Ed25519 key pair for signing, and a hash of the Curve25519 public key is your identity on the mesh.'
- `src/app/features/profile/ProfileClient.tsx`
  - before: 'Message content is end-to-end encrypted, and at an event it never passes through a Blip server.'
  - after: 'Direct messages are end-to-end encrypted; at an event they travel phone-to-phone, and when a phone has internet they can also pass through our relay as ciphertext.'
- `src/app/features/profile/ProfileClient.tsx`
  - before: 'No, you do not need a phone number to use Blip. Your identity is a\n              cryptographic key pair generated on your iPhone — Ed25519 — plus a'
  - after: 'No, you do not need a phone number to use Blip. Your identity is a\n              pair of cryptographic keys generated on your iPhone — Curve25519 and Ed25519 — plus a'
- `src/app/features/nearby/NearbyClient.tsx`
  - before: '"One tap on I\'m here pushes your position to the people you have chosen to share with. The control at the bottom of the screen says exactly who that is — Friends only — and it stays where you can see it rather than buried in settings.",'
  - after: '"One tap on I\'m here shares your position. The app shows it only to friends, and the control at the bottom of the screen says so — Friends only — where you can see it rather than buried in settings. On the wire, the packet is a mesh broadcast that nearby Blip phones relay.",'
- `src/app/features/nearby/NearbyClient.tsx`
  - before: '"Nothing here routes through a Blip server. Positions travel the same encrypted path your messages take: phone to phone, hop by hop, through the crowd.",'
  - after: '"Positions do not need a Blip server. They travel over the mesh phone to phone, hop by hop, through the crowd, as signed location packets. Unlike direct messages they are not encrypted, and when a phone has internet they also pass through our relay.",'
- `src/app/features/nearby/NearbyClient.tsx`
  - before: 'sharing is honest. Blip has no server collecting your position, so\n              there is nothing central to track. What is shared travels\n              peer-to-peer over the mesh, to the people you chose.'
  - after: 'sharing is honest. Blip has no server storing your position, so\n              there is nothing central to track. What is shared travels over\n              the mesh as a broadcast that nearby phones relay, and the app\n              shows it only to the friends you chose.'
- `src/app/features/safety/SafetyClient.tsx`
  - before: 'value: "Noise XX key agreement with Ed25519 packet signing",'
  - after: 'value: "SOS alerts are Ed25519-signed broadcasts, left unencrypted so every nearby phone can read them",'
- `src/app/organisers/page.tsx`
  - before: 'Partner with Blip for end-to-end encrypted Bluetooth mesh comms when mobile reception fails.'
  - after: 'Partner with Blip for Bluetooth mesh comms with end-to-end encrypted direct messages when mobile reception fails.'
- `src/app/terms/TermsClient.tsx`
  - before: 'Relayed messages are end-to-end encrypted — your device cannot decrypt or read them.'
  - after: 'Relayed direct and group messages are end-to-end encrypted — your device cannot decrypt or read them. Public event channel messages are signed but not encrypted.'
- `src/app/acceptable-use/AcceptableUseClient.tsx`
  - before: 'While you cannot read relayed messages (they are encrypted), you should not attempt'
  - after: 'While you cannot read relayed direct or group messages (they are encrypted), you should not attempt'
- `src/app/acceptable-use/AcceptableUseClient.tsx`
  - before: 'Because messages are end-to-end encrypted, we cannot monitor or moderate message content.'
  - after: 'Because direct and group messages are end-to-end encrypted, we cannot monitor or moderate their content.'
- `src/app/support/SupportClient.tsx`
  - before: 'Blip identities are tied to a cryptographic key stored in your phone&apos;s secure enclave.'
  - after: 'Blip identities are tied to cryptographic keys stored in your phone&apos;s iOS Keychain, marked device-only so they never sync to another device.'
- `src/app/support/SupportClient.tsx`
  - before: 'your chosen username and display name, a one-way hash of your email address (we never store your email in plain text), your Noise and Ed25519 public keys, and Apple In-App Purchase transaction IDs if you&apos;ve bought message packs.'
  - after: 'your chosen username, a one-way SHA-256 hash of your email address (the address itself is held for up to an hour for your verification code and rate limiting, then discarded; only the hash is stored in our database), your Noise and Ed25519 public keys, your push token, and your avatar if you upload one.'
- `src/app/support/SupportClient.tsx`
  - before: 'If you&apos;ve set up a recovery kit (<strong>Profile → Settings → Backup</strong>), you can restore on a new device using the recovery file and the password you set. If you don&apos;t have a recovery kit, you can register a fresh account with the same email — friends will need to re-add you.'
  - after: 'The current app has no working backup or recovery kit (the Recovery Kit Export row in Settings is disabled), so if the phone is gone the keys are gone with it. Register a fresh account with the same email; friends will need to re-add you.'
- `public/llms.txt`
  - before: 'over encrypted Bluetooth Low Energy mesh'
  - after: 'over Bluetooth Low Energy mesh'
- `public/llms.txt`
  - before: '- End-to-end encrypted (Noise XX + Ed25519); relay phones cannot read messages'
  - after: '- Direct messages are end-to-end encrypted (Noise XX + Ed25519) and private groups use AES-256-GCM sender keys; relay phones cannot read them. Public event channels are signed, not encrypted'
- `public/llms.txt`
  - before: '- No phone number required; location sharing is friends-only and user-controlled'
  - after: '- No phone number required; location sharing is off until you switch it on, and shared positions are signed mesh broadcasts that nearby Blip phones can read'
- `src/app/features/safety/page.tsx`
  - before: '"Yes. SOS never touches a mobile tower, Wi-Fi, or a server. It travels over Bluetooth Low Energy between phones, up to seven hops. Range'
  - after: '"Yes. SOS needs no mobile tower, Wi-Fi, or server. It travels over Bluetooth Low Energy between phones, up to seven hops, and when a phone in the chain has internet it also passes through our relay. Range'
- `src/app/features/safety/page.tsx`
  - before: 'Outside an SOS or an active Friend Finder session, your location is not shared with anyone or stored on a server."'
  - after: "Outside an SOS, an I'm Here beacon, or Friend Finder sharing, the only location that leaves your phone is a 5-character geohash (a cell roughly 5 km across) in your presence announcement while Nearby visibility is on, which our relay holds in memory only.""
- `src/app/features/safety/SafetyClient.tsx`
  - before: 'value: "Bluetooth Low Energy 5.0+ — no tower, no Wi-Fi, no server",'
  - after: 'value: "Bluetooth Low Energy 5.0+; no tower or Wi-Fi needed, and the alert also passes through our relay when a phone has internet",'
- `src/app/features/nearby/page.tsx`
  - before: '"No. There is no Blip server watching where you are. Location sharing runs peer-to-peer over the mesh and you control it: the Profile screen has a location sharing setting scoped to friends only, plus a separate Nearby visibility toggle. Meeting point pins go only to the people you choose, and they expire on a timer you set."'
  - after: '"Blip keeps no database of where you are. When you switch on sharing, your position travels over the mesh as a signed, unencrypted packet that any nearby Blip phone can receive, and through our relay when a phone has internet; the relay forwards it and does not keep it. You control it from the Share location button on the Nearby map, and a separate Nearby visibility toggle controls whether your presence announcement, which carries a 5-character geohash, goes out at all."'
- `src/proxy.ts`
  - before: 'Messages are end-to-end encrypted before they leave your device; only the minimum required data is collected server-side.'
  - after: 'Direct messages and private group messages are end-to-end encrypted before they leave your device; public event channels are signed but not encrypted. Only the minimum required data is collected server-side.'
- `src/app/privacy/page.tsx`
  - before: 'How Blip handles your data: end-to-end encrypted messages, no tracking'
  - after: 'How Blip handles your data: end-to-end encrypted direct messages, no tracking'
- `src/app/features/nearby/NearbyClient.tsx`
  - before: '"All of it comes over Bluetooth mesh. No tower, no Wi-Fi, no check-in to a server.",'
  - after: '"All of it comes over Bluetooth mesh, with no tower or Wi-Fi needed. When a phone has internet, its presence announcement also goes to our relay.",'
- `src/app/features/nearby/NearbyClient.tsx`
  - before: ""One tap on I'm here shares your position. The app shows it only to friends, and the control at the bottom of the screen says so — Friends only — where you can see it rather than buried in settings. On the wire, the packet is a mesh broadcast that nearby Blip phones relay.","
  - after: ""One tap on I'm here shares your position as a signed, unencrypted mesh broadcast that nearby Blip phones relay, and any phone running Blip that receives it can plot it. Sharing is off until you switch it on, and the control sits on the map where you can see it rather than buried in settings.","
- `src/app/features/nearby/NearbyClient.tsx`
  - before: 'sharing is honest. Blip has no server storing your position, so\n              there is nothing central to track. What is shared travels over\n              the mesh as a broadcast that nearby phones relay, and the app\n              shows it only to the friends you chose.'
  - after: 'sharing is honest. Blip keeps no database of your position, so\n              there is nothing central to track. What is shared travels over\n              the mesh as a signed broadcast that nearby phones relay and can\n              read, and it is off until you switch it on.'
- `src/app/features/profile/page.tsx`
  - before: ""You decide, from the Location sharing row on your profile. The screen in our screenshot is set to Friends only, so nobody outside that person's approved friends can see where they are. Open the row to change it. Location sharing and Nearby visibility are separate controls, so you can adjust one without touching the other.""
  - after: '"You decide. Location sharing is off until you switch it on from the Nearby map, and while it is on your position goes out as a signed, unencrypted mesh broadcast that any nearby Blip phone can receive. Nearby visibility is a separate toggle that controls your presence announcement, so you can adjust one without touching the other."'
- `src/app/features/profile/ProfileClient.tsx`
  - before: 'text: "Set to Friends only in the screenshot. Open the row to change who can see where you are, or to switch it off.",'
  - after: 'text: "Off until you switch it on from the Nearby map. While it is on, your position is a signed mesh broadcast that any nearby Blip phone can receive.",'
- `src/app/support/SupportClient.tsx`
  - before: 'We do <strong>not</strong> collect message content, location data (unless you opt in to location-sharing per friend), contact lists, advertising IDs, or browsing analytics.'
  - after: 'We do <strong>not</strong> collect message content, contact lists, advertising IDs, or browsing analytics, and we keep no database of your location (our relay holds a 5-character geohash in memory while you are connected; see the privacy policy for the SOS exception).'
- `src/app/features/nearby/NearbyClient.tsx`
  - before: '{ label: "Location sharing", value: "Friends only, you control it" },'
  - after: '{ label: "Location sharing", value: "Off until you switch it on" },'
- `src/app/features/nearby/NearbyClient.tsx`
  - before: "an I'm here button, and sharing scoped to Friends only.","
  - after: "an I'm here button, and the sharing control.","
- `src/app/features/nearby/NearbyClient.tsx`
  - before: 'text: "The Profile screen carries a location sharing setting. Set to friends only, it means friends only.",'
  - after: 'text: "Location sharing is off until you switch it on from the Nearby map. While it is on, any nearby Blip phone can receive your position.",'
- `src/app/features/nearby/NearbyClient.tsx`
  - before: 'title: "Location sharing, scoped",'
  - after: 'title: "Location sharing, off by default",'
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<p>You can delete your account and all associated server-side data at any time from the app settings. You may request'
  - after: '<p>You can delete your account at any time from the app settings. Deletion removes your account row (email hash, username, public keys, message balance) and, with it, your device tokens and notification preferences. Two things are not removed. Abuse reports you filed, or that were filed about you, reference your peer ID (a hash of your public key) plus the reporter&apos;s category and free-text reason, and we keep them so moderation history survives account deletion. Your avatar has no automatic deletion path yet; email privacy@heyblip.au to have it removed. You may request'
- `src/app/terms/TermsClient.tsx`
  - before: 'You may delete your account at any time through the app settings, which will remove your server-side data.'
  - after: 'You may delete your account at any time through the app settings, which removes your account data as described in the Privacy Policy; abuse reports are retained.'
- `src/proxy.ts`
  - before: 'Delete account + server data from app settings.'
  - after: 'Delete account from app settings (removes the account row, device tokens and notification prefs; abuse reports keyed by peer ID are retained; avatar removed on request).'
- `src/app/support/SupportClient.tsx`
  - before: 'Your account, registered email hash, and public keys are permanently removed from our servers.'
  - after: 'Your account, registered email hash, public keys, device tokens and notification preferences are permanently removed from our servers. Abuse reports that reference your peer ID are kept for moderation history, and your avatar is removed on request to privacy@heyblip.au.'

### Round 3 (fact-check REVISE, against `fcb4eac`)

- `src/app/privacy/PrivacyClient.tsx:48`
  - before: 'They travel as signed, unencrypted mesh packets to nearby phones and through our relay when a phone has internet.'
  - after: 'They travel as signed, unencrypted mesh packets to nearby phones, and when a phone has internet they also go through our relay, which forwards Friend Finder positions and beacons to every Blip phone connected to it, not only nearby ones.'
- `public/llms.txt:11`
  - before: 'shared positions are signed mesh broadcasts that nearby Blip phones can read'
  - after: 'shared positions are signed, unencrypted broadcasts that nearby Blip phones can read and that, when a phone has internet, our relay forwards to every Blip phone connected to it'
- `src/app/features/nearby/NearbyClient.tsx:77`
  - before: "One tap on I'm here shares your position as a signed, unencrypted mesh broadcast that nearby Blip phones relay, and any phone running Blip that receives it can plot it."
  - after: "One tap on I'm here shares your position as a signed, unencrypted broadcast. Nearby Blip phones relay it, and when a phone has internet our relay forwards it to every Blip phone connected to the relay, not only nearby ones. Any phone running Blip that receives it can plot it."
- `src/app/features/nearby/NearbyClient.tsx:126`
  - before: 'While it is on, any nearby Blip phone can receive your position.'
  - after: 'While it is on, any nearby Blip phone can receive your position, and when a phone has internet so can every Blip phone connected to our relay.'
- `src/app/features/nearby/NearbyClient.tsx:262`
  - before: 'the mesh as a signed broadcast that nearby phones relay and can read, and it is off until you switch it on.'
  - after: 'the mesh as a signed broadcast that nearby phones relay and can read. When a phone has internet our relay forwards it to every Blip phone connected to the relay. It is off until you switch it on.'
- `src/app/features/profile/page.tsx:42`
  - before: 'your position goes out as a signed, unencrypted mesh broadcast that any nearby Blip phone can receive.'
  - after: 'your position goes out as a signed, unencrypted broadcast that any nearby Blip phone can receive, and that our relay forwards to every Blip phone connected to it when a phone has internet.'
- `src/app/features/profile/ProfileClient.tsx:93`
  - before: 'While it is on, your position is a signed mesh broadcast that any nearby Blip phone can receive.'
  - after: 'While it is on, your position is a signed, unencrypted broadcast that any nearby Blip phone can receive, and that reaches every Blip phone connected to our relay when a phone has internet.'
- `src/app/features/safety/SafetyClient.tsx:41`
  - before: 'SOS alerts are Ed25519-signed broadcasts, left unencrypted so every nearby phone can read them'
  - after: 'SOS alerts are Ed25519-signed broadcasts, left unencrypted so every nearby phone can read them; when a phone has internet our relay forwards them to every Blip phone connected to it'
- `src/app/features/safety/page.tsx:37`
  - before: 'Every Blip user within mesh range at your event. The alert hops phone to phone, so it reaches people you have never met, not just your crew.'
  - after: 'Every Blip user within mesh range at your event, and when a phone has internet, every Blip phone connected to our relay. The alert hops phone to phone, so it reaches people you have never met, not just your crew.'
- `src/app/privacy/PrivacyClient.tsx:48`
  - before: 'The relay does not keep them, with one exception: if the person who accepted your SOS is offline, the packet with your coordinates waits in the relay queue for up to 1 hour.'
  - after: 'Broadcast positions and beacons are forwarded, not stored. The SOS precise-location packet is different: it is addressed to the person who accepted your alert, and like every addressed packet our relay routes, it is written to relay storage until that person acknowledges it or one hour passes, whichever comes first.'
- `src/app/privacy/PrivacyClient.tsx:71`
  - before: 'The WebSocket relay queues every addressed packet for an offline recipient, whatever its type, for up to 1 hour, then deletes it. For direct and private group messages the queued payload is ciphertext the relay cannot read. One addressed packet is not encrypted: when someone accepts your SOS alert, your phone sends them your precise GPS coordinates as a signed, unencrypted packet, and if that person is offline the packet, coordinates included, sits in the relay queue until they reconnect or the hour passes.'
  - after: 'The WebSocket relay writes every addressed packet it routes to relay storage before delivering it, whatever its type and whether or not the recipient is online, and deletes it when the recipient acknowledges it or after 1 hour, whichever comes first. Direct messages, private group messages and friend requests travel as Noise ciphertext the relay cannot read. Other addressed packets are not encrypted, and the one that carries personal data in plaintext is the SOS precise location: when someone accepts your SOS alert, your phone sends them your GPS coordinates as a signed, unencrypted packet, which sits in relay storage, coordinates included, until they acknowledge it or the hour passes.'
- `src/components/FAQ.tsx:62`
  - before: 'Friend Finder positions are broadcast to nearby phones over the mesh and are not stored on the server. One exception: if someone accepts your SOS alert while they are offline, our relay queues the packet carrying your precise position for up to an hour so it can be delivered when they reconnect.'
  - after: 'Friend Finder positions are broadcast over the mesh, forwarded by our relay to every connected Blip phone when a phone has internet, and not stored on the server. One exception: when someone accepts your SOS alert, the packet carrying your precise position is addressed to them, and our relay stores every addressed packet it routes until it is acknowledged or an hour passes.'
- `src/proxy.ts:178`
  - before: 'One exception: when someone accepts your SOS alert while offline, the relay queues the packet carrying your precise position for up to 1 hour'
  - after: 'One exception: when someone accepts your SOS alert, the packet carrying your precise position is addressed to them, and the relay stores every addressed packet it routes until it is acknowledged or 1 hour passes'
- `src/app/privacy/PrivacyClient.tsx:82`
  - before: "We disable Sentry's default personal-data collection and never send message content or your email. A crash report may include a screenshot of whatever was on screen at the moment of the crash, and is tagged with your username and an app-generated account identifier so we can group reports per account."
  - after: "We disable Sentry's default personal-data collection and do not attach message data to a report, but a report may include a screenshot of whatever was on screen at the moment of the crash, and that screenshot can show messages that were open. Reports carry your username and an app-generated account identifier so we can group them per account. Your email is not sent."
- `src/app/features/chat/ChatClient.tsx:144`
  - before: 'No towers, no Wi-Fi, no server.'
  - after: 'No towers or Wi-Fi needed, and when a phone has internet the message also passes through our relay.'
- `src/app/privacy/PrivacyClient.tsx:39`
  - before: 'Friend Finder positions are shared over the mesh, not through our servers.'
  - after: 'Friend Finder positions are broadcast over the mesh and, when a phone has internet, forwarded by our relay to every connected Blip phone; the relay forwards them and does not store them.'
- `src/app/acceptable-use/AcceptableUseClient.tsx:47`
  - before: 'relaying encrypted messages for other users'
  - after: 'relaying packets for other users: encrypted direct and group messages, and unencrypted public channel messages and location packets'
- `src/app/features/profile/ProfileClient.tsx:308`
  - before: 'Location sharing — Friends only'
  - after: 'Location — proximity alerts; sharing itself is switched on from the Nearby map'
- `src/app/features/profile/ProfileClient.tsx:65`
  - before: 'above rows for Location sharing set to Friends only, Nearby visibility On,'
  - after: 'above rows for Location, Nearby visibility On,'
- `src/app/features/nearby/NearbyClient.tsx:82`
  - before: "Priya 2 min away, a Gate D meeting point with 45 min left, an I'm here button and a Friends only sharing control"
  - after: "Priya 2 min away, and an I'm here button"
- `src/app/features/nearby/NearbyClient.tsx:132-135`
  - before: 'title: "Pins that run out", text: "A meeting point goes to the people you pick and expires on the timer you set when you shared it."'
  - after: (removed; `md:grid-cols-3` became `md:grid-cols-2` at the control-point grid)
- `src/app/features/safety/page.tsx:37`
  - before: ' If your event runs a Blip-equipped medical team, they see it too.'
  - after: (removed)
- `src/app/features/nearby/page.tsx:7`
  - before: "Blip shows who's nearby over Bluetooth mesh, maps your crew and shares meeting points."
  - after: "Blip shows who's nearby over Bluetooth mesh and maps your crew."
- `src/app/terms/TermsClient.tsx:42`
  - before: 'If you lose access to your device without having backed up your keys, your encrypted message history may be unrecoverable.'
  - after: 'If you lose access to your device, your keys and your message history are lost with it; the current app has no backup or key export.'
- `src/app/features/page.tsx:7`
  - before: 'Everything Blip does without internet: encrypted group chat, voice push-to-talk,'
  - after: 'Everything Blip does without internet: group chat, end-to-end encrypted direct messages, voice push-to-talk,'
- `src/app/features/page.tsx:35`
  - before: 'Group chats, end-to-end encrypted messaging, voice notes, and push-to-talk'
  - after: 'Group chats, end-to-end encrypted direct messages, voice notes, and push-to-talk'
- `public/llms.txt:16`
  - before: 'Group chat, encrypted messaging, and voice push-to-talk with no internet or signal'
  - after: 'Group chat, end-to-end encrypted direct messages, and voice push-to-talk with no internet or signal'
- `public/llms.txt:24`
  - before: 'BLE 5.0 mesh, Noise XX + Ed25519 encryption, adaptive gossip routing, 7-hop TTL'
  - after: 'BLE 5.0 mesh, Noise XX encrypted direct messages with Ed25519 packet signing, adaptive gossip routing, 7-hop TTL'
- `src/app/features/FeaturesClient.tsx:139`
  - before: 'BLE 5.0 mesh, Noise XX + Ed25519 encryption, adaptive gossip routing, and a 7-hop TTL.'
  - after: 'BLE 5.0 mesh, Noise XX encrypted direct messages with Ed25519 packet signing, adaptive gossip routing, and a 7-hop TTL.'
- `src/components/Hero.tsx:33,64` (two occurrences), `src/app/features/FeaturesClient.tsx:21`
  - before: 'Blip end-to-end encrypted group chat still sending messages with no signal'
  - after: 'Blip end-to-end encrypted private group chat still sending messages with no signal'
- `src/components/AppScreens.tsx:17`
  - before: 'Blip end-to-end encrypted group chat where messages keep sending with no signal'
  - after: 'Blip end-to-end encrypted private group chat where messages keep sending with no signal'
- `src/app/tech/page.tsx:7`
  - before: 'Bluetooth Low Energy 5.0 mesh, Noise XX + Ed25519 encryption, adaptive gossip routing,'
  - after: 'Bluetooth Low Energy 5.0 mesh, Noise XX encrypted direct messages with Ed25519 packet signing, adaptive gossip routing,'

### Round 4 (fact-check REVISE, against `38844a4`)

- `src/app/privacy/PrivacyClient.tsx:60`
  - before: 'if you opt in, your approximate location is shared with your friends for the duration of your session only.'
  - after: 'off until you switch sharing on. While it is on, your precise position is broadcast as a signed, unencrypted packet that any nearby Blip phone can receive and that our relay forwards to every connected Blip phone when a phone has internet. It is forwarded, not stored.'
- `src/app/tech/TechClient.tsx:38`, `src/proxy.ts:77`
  - before: '10MB LRU cache, DMs cached 2hrs, SOS until resolved'
  - after: '10MB LRU cache on relay phones: private group messages 30 min, public channel and location packets 5 min, SOS until resolved; direct messages are not cached by relay phones (our internet relay holds them up to 1 hour)'
- `src/app/features/chat/page.tsx:57`
  - before: 'Blip stores undelivered messages and forwards them when a path opens up, holding direct messages for about two hours.'
  - after: 'Relay phones hold undelivered group and channel messages for a short window (30 minutes for private groups, 5 minutes for public channels) and forward them when a path opens up. A direct message is not cached by relay phones; when a phone has internet our relay holds it for up to an hour.'
- `src/app/features/chat/page.tsx:32`
  - before: 'Yes. Blip needs no Wi-Fi, no mobile data and no server to send a message.'
  - after: 'Yes. Blip needs no Wi-Fi or mobile data to send a message; when a phone has internet the message also passes through our relay.'
- `src/app/privacy/PrivacyClient.tsx:71`
  - before: 'Direct messages, private group messages and friend requests travel as Noise ciphertext the relay cannot read.'
  - after: 'Direct messages and friend requests travel as Noise ciphertext and private group messages as AES-256-GCM ciphertext; the relay can read none of them, and because a group message carries no recipient the relay forwards it without storing it.'
- `src/app/privacy/PrivacyClient.tsx:82`
  - before: 'Your email is not sent.'
  - after: 'Your email is not included in a report, except that the log line recording your sign-in code request can appear in the breadcrumb trail of a crash in the same sign-in session.'
- `src/app/support/SupportClient.tsx:151`
  - before: 'that does need internet on at least one side. If both you and your friend are stuck offline and not in Bluetooth range, messages will queue and deliver when one of you regains connectivity.'
  - after: 'That needs both phones to reach the internet within an hour of each other: the relay holds a message for up to 1 hour and deletes it if the recipient has not collected it. If both you and your friend are offline and not in Bluetooth range, the message is delivered only once you are online to hand it to the relay and your friend connects within the following hour.'
- `src/app/features/safety/SafetyClient.tsx:308`
  - before: 'An SOS reaches nearby phones running Blip and nothing else.'
  - after: 'An SOS reaches phones running Blip and nothing else: nearby ones over the mesh and, when a phone has internet, every Blip phone connected to our relay.'
- `src/app/features/safety/page.tsx:32`
  - before: 'An SOS broadcasts over Bluetooth mesh to nearby phones running Blip, so people around you know'
  - after: 'An SOS broadcasts over Bluetooth mesh to nearby phones running Blip, and when a phone has internet our relay forwards it to every Blip phone connected to it, so people around you know'
- `src/app/features/nearby/NearbyClient.tsx:84`
  - before: "the crew's Gate D meeting point on the map"
  - after: 'a Gate D meeting point on the map'
- `src/app/features/nearby/NearbyClient.tsx:93`
  - before: 'give it a label, choose who it goes to, and set how long it lasts'
  - after: 'give it a label, and set how long it lasts'
- `src/app/features/nearby/NearbyClient.tsx:94`
  - before: 'The pin relays to your crew over the mesh exactly like a message does, then shows on their map with the time remaining on it. The sheet tells you the venue and the location accuracy your phone reported, and states plainly that only selected friends can see the pin.'
  - after: 'In this build the pin is a marker on your own map, shown with the time remaining on it; sending it to your crew over the mesh is not in the shipped app. The sheet tells you the venue and the location accuracy your phone reported.'
- `src/app/features/nearby/NearbyClient.tsx:98` (alt)
  - before: 'fields for Label Gate D, Share with Festival Crew and Expires in 45 minutes, a Share meeting point button, and a note that only selected friends can see this pin'
  - after: 'fields for Label Gate D and Expires in 45 minutes, and a Share meeting point button'
- `src/app/features/nearby/NearbyClient.tsx:100` (caption)
  - before: 'Label the pin, pick who it goes to, give it an expiry. The venue and reported accuracy sit under the fields, above the sharing note.'
  - after: 'Label the pin and give it an expiry. The venue and reported accuracy sit under the fields.'
- `src/app/features/nearby/NearbyClient.tsx:158`
  - before: 'lets you drop a meeting point your whole crew can walk to.'
  - after: 'lets you mark a meeting point on the map.'
- `src/app/features/nearby/page.tsx:37`
  - before: 'and you can drop a shared meeting point.'
  - after: 'and you can mark a meeting point on your own map.'
- `src/app/features/nearby/page.tsx:52`
  - before: 'Yes. Pick a spot — a gate, a stage, a food van — give it a label, choose who it goes to, and set how long it lasts. The pin travels to your crew over the mesh, the same way a message does. On the map it shows as a flagged pin with the time remaining, so nobody has to ask where again.'
  - after: 'In this build a meeting point is a marker on your own map. Pick a spot — a gate, a stage, a food van — give it a label, and set how long it lasts; it shows as a flagged pin with the time remaining. It does not travel to your crew over the mesh; sending a pin to friends is not in the shipped app.'
- `src/app/features/page.tsx:53`
  - before: 'follow the friend map, and set crew meeting points — all without reception.'
  - after: 'follow the friend map, and mark a meeting point on it — all without reception.'
- `public/llms.txt:10`
  - before: 'Find friends nearby, friend map, and crew meeting points without internet'
  - after: 'Find friends nearby, friend map, and a meeting-point marker on your own map, all without internet'
- `src/app/support/SupportClient.tsx:119`
  - before: 'Register a fresh account with the same email; friends will need to re-add you.'
  - after: 'Verify the same email again on the new phone and confirm the takeover; your username comes back with new keys, and friends will need to re-add you.'
- `src/app/features/nearby/NearbyClient.tsx:130`
  - before: "A separate switch decides whether you show up in other people's Nearby list at all."
  - after: 'A separate switch decides whether your name is announced to phones around you.'
- `src/app/features/profile/page.tsx:47`
  - before: 'With it off you stop appearing to other people running Blip around you.'
  - after: 'With it off your phone stops announcing your name to people running Blip around you.'
- `src/app/features/profile/ProfileClient.tsx:97`
  - before: 'Turn it off and you stop appearing to other people running Blip around you.'
  - after: 'Turn it off and your phone stops announcing your name to people running Blip around you.'
- `src/components/FAQ.tsx:32`
  - before: 'Yes. Blip is an iOS messaging app that works entirely offline using Bluetooth mesh networking. It does not require'
  - after: 'Yes. Once set up, Blip is an iOS messaging app that works offline using Bluetooth mesh networking. Creating your account needs internet once, to verify your email; after that it does not require'
