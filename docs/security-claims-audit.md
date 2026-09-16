# Security and pricing claims audit (BDEV-251)

Ground truth is the iOS app and server source at `iamjohnnymac/heyblip-live` commit `e9a38e8`. File references below are relative to that repository. Site references are relative to this repository at `fc883c0` (before the fixes in this branch).

## Ground truth summary

| Topic | What the code does | Source |
|---|---|---|
| Direct messages | Noise_XX_25519_ChaChaPoly_SHA256: Curve25519 DH, ChaCha20-Poly1305 AEAD, HKDF-SHA-256 chaining. A fresh ephemeral key pair is generated for every handshake. | `Packages/BlipCrypto/Sources/NoiseHandshake.swift:7,80-98,168-169,316-321`; `NoiseCipherState.swift:16` |
| Session lifecycle | Send-direction rekey after 1,000 messages or 1 hour; session expires after 4 hours. There is no "rekey on reconnect" path. A failed initiator whose state was rotated between msg1 and msg3 is counted as `initiatorStateRotated` (retry semantics, no key material is reused). | `NoiseSessionManager.swift:43-44,149,170-173,197-222` |
| Private group messages | AES-256-GCM per-sender keys, distributed to members over pairwise Noise sessions, rotated on member add/remove or every 100 messages. | `Packages/BlipCrypto/Sources/SenderKeyManager.swift:16-21,95-101`; `Sources/Services/MessageService.swift:1484-1541` |
| Public event channels | Text is built as a `.meshBroadcast` packet with a plaintext payload and an Ed25519 signature. Not encrypted. | `Sources/Services/SendPipeline.swift:471-491` ("Send a signed public text message") |
| Reactions, edits, deletes, receipts, typing | Carried as sub-types inside the `noiseEncrypted` payload, so they inherit DM encryption. | `Packages/BlipProtocol/Sources/EncryptedSubType.swift:12-36` |
| Location sharing and I'm Here beacons | `LocationPayload` is full-precision Float64 lat/lon plus accuracy, sent as a plaintext `.locationShare` / `.iAmHereBeacon` broadcast with TTL 3. Broadcasts go to BLE and, when connected, to the WebSocket relay. | `Packages/BlipProtocol/Sources/LocationPayload.swift:5-18`; `Sources/ViewModels/FriendFinderViewModel.swift:235-265`; `Packages/BlipMesh/Sources/TransportCoordinator.swift:306-315` |
| SOS | `.sosAlert` is a plaintext broadcast carrying severity, a coarse geohash and an optional message, readable by every nearby phone by design. When the alert owner receives a `.sosAccept`, it sends its precise Float64 lat/lon as a plaintext `.sosPreciseLocation` packet addressed to the accepter; addressed packets go BLE first, then the WebSocket relay. The only UI that sends `.sosAccept` is the medical dashboard, hidden in v1 behind `V1LaunchFlags.showMedicalResponder = false`; the owner-side handler answers any accept packet on the wire. | `Sources/ViewModels/SOSViewModel.swift:567-599,623-646,772-795`; `Packages/BlipMesh/Sources/TransportCoordinator.swift:162-182`; `Sources/Views/Tabs/EventsTab/MedicalDashboard/MedicalDashboardView.swift:266`; `Sources/Utilities/V1LaunchFlags.swift:67`; `Packages/BlipProtocol/Sources/MessageType.swift:49-53` |
| Announce (presence) packet | Plaintext: username, display name, Noise public key, signing public key, 5-character geohash. | `Sources/Services/MessageService.swift:945-954` |
| Packet signing | Ed25519 via libsodium, 64-byte detached signature over the whole packet minus the TTL byte. Sender ID is the first 8 bytes of SHA-256(Noise public key). | `Packages/BlipCrypto/Sources/Signer.swift:31-56`; `KeyManager.swift:21,208-209`; `Packages/BlipProtocol/Sources/PacketSerializer.swift:246-255` |
| What the relay sees | Sender and recipient PeerID hex from the header, packet type byte, timestamps (rate limiting and logs), the geohash from announce packets (in-memory `Map`, dropped on disconnect), and whatever is plaintext on the wire (public channel text, announces, location shares, SOS). Every addressed packet for an offline recipient is queued for 1 hour with no type filter, so a `.sosPreciseLocation` packet is stored with plaintext coordinates (`packet-router.ts:235-260`, `store-forward.ts:33-34`). Recipient-less packets are fanned out to all connected peers (announces are scoped by geohash). | `server/relay/src/relay-room.ts:414-478`; `packet-router.ts:43-71,173-230`; `presence/presence.ts:44-45,344`; `store-forward/store-forward.ts:33-34` |
| Push notifications | Relay asks the auth worker to push; the APNs payload carries the sender's username or display name, the channel name for groups, and a `thread-id` (the sender PeerID hex for DMs). Bodies are generic ("Sent you a message"). | `server/relay/src/badge-ledger.ts` header; `server/auth/src/apns/payloads.ts:71-110` |
| Auth database | `users(email_hash SHA-256 hex, username, is_verified, message_balance, noise_public_key, signing_public_key, peer_id_hex, timestamps)`, `device_tokens(token, platform, bundle_id, locale, app_version, sandbox)`, `notification_prefs`, `abuse_reports`. No plaintext email, no display name, no phone number. | `server/auth/schema.sql:1-40`; `migrations/005_abuse_reports.sql` |
| Plaintext email | Received by the OTP endpoint. Used as two Workers KV keys: `code:<email>` for the code's TTL (default 600 s) and `rate:<email>` for send-code rate limiting with a 3,600 s TTL. Passed to Resend to deliver the code. Never written to Postgres. | `server/auth/src/challenge-session/otp.ts:89,300-309,381-387` |
| Avatars | Uploaded images are stored in a Cloudflare bucket. | `server/cdn/src/avatars/avatars.ts:56` |
| Auth mechanism | Ed25519 challenge-response, then an HMAC JWT with a default lifetime of 3,600 s. | `server/auth/src/challenge-session/session.ts:33,154`; `server/shared/src/jwt.ts:61` |
| Key storage on device | iOS Keychain, `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`. Not the Secure Enclave. | `Packages/BlipCrypto/Sources/KeyManager.swift:72-84` |
| Recovery kit (account export) | AES-256-GCM; key derived with HKDF-SHA-256 from the password and a random 32-byte salt. Note: HKDF is not a password-hardening KDF. | `KeyManager.swift:39-42,170-172` |
| TLS | Certificate pinning on the auth, relay and CDN worker hostnames. | `Sources/Services/ServerConfig.swift:38-42`; `CertificatePinningDelegate.swift` |
| Sentry | `sendDefaultPii = false`, but `attachScreenshot = true`, so a crash report can include a screenshot of the screen at crash time. Server side `sendDefaultPii: false`. | `Sources/Services/CrashReportingService.swift:62-65`; `server/shared/src/sentry-config.ts:118` |
| Analytics | Microsoft Clarity SDK is linked but `configureClarity()` is inside `#if DEBUG`; App Store builds never initialise it. | `App/AppDelegate.swift:4,35-37,45-60` |
| Phone numbers | No UI or service code references a phone number. `PhoneHasher` exists in BlipCrypto but has no callers in `Sources/`. | grep of `Sources/` for `phoneNumber|phoneHash|PhoneHasher` returns nothing |
| Account deletion | `DELETE FROM users WHERE noise_public_key = ...`; `device_tokens` and `notification_prefs` cascade. Avatar deletion was not verified. | `server/auth/src/registration/account.ts:20-23`; `schema.sql:53,89` |
| In-app purchases | The app lists StoreKit products `au.heyblip.Blip.starter10 / social25 / event50 / squad100 / season1000 / unlimited` ("Message Packs"). The server receipt endpoint returns 501 "not configured" and stores nothing. No "verified profile" product exists in source. | `Sources/ViewModels/StoreViewModel.swift:91-98`; `Sources/Views/Tabs/ProfileTab/MessagePackStore.swift`; `server/auth/src/receipts/verify.ts` |

Forward secrecy is not claimed anywhere on the site. If it is added later, the accurate wording is "fresh ephemeral keys per handshake, send-direction rekey every 1,000 messages or 1 hour, sessions expire after 4 hours".

## Claims table

Verdicts: accurate, overstated, false, unverifiable. Page and line are from the site at `fc883c0`.

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
| 11 | FAQ "Location is only shared with your friends during an active Friend Finder session and is not persisted on the server." (`FAQ.tsx:62`) | overstated | A 5-char geohash goes to the relay in every announce when location permission is granted, held in memory (`MessageService.swift:945-954`, `presence.ts:44-45`). Friend Finder positions are broadcasts. The relay queues an addressed `.sosPreciseLocation` for an offline accepter (`packet-router.ts:235-260`). | "While the app is connected to our relay it also holds, in memory only, a 5-character geohash ... Friend Finder positions are broadcast to nearby phones over the mesh and are not stored on the server. One exception: if someone accepts your SOS alert while they are offline, our relay queues the packet carrying your precise position for up to an hour ..." |
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
| 23 | Same as 15, 18, 19 in the agent markdown (`proxy.ts:81-85`) | overstated (row 19 mirror) | Mirror of `/tech`. | Mirrored. Rows added for group messages, public channels, recovery kit (ticket asks for the primitive list). |
| 24 | "**Encryption:** End-to-end (Noise XX + Ed25519)" (`proxy.ts:10`) | overstated | Same as 1. | Qualified to DMs; groups and public channels named. |
| 25 | "Private by default. Messages are encrypted before they leave your phone. Relay phones cannot read them." (`proxy.ts:19`) | overstated | Same as 6. | Qualified. |
| 26 | "Only your email, username, public keys, and push token are stored server-side." (`proxy.ts:31`) | false | Same as 10. | Hash and full set listed. |
| 27 | "End-to-end encrypted Bluetooth mesh, built for crowds of 100,000+." (`proxy.ts:120`) and `/organisers` description (`app/organisers/page.tsx:7`) | overstated | Same as 1. | "Bluetooth mesh with end-to-end encrypted direct messages". |
| 28 | "Email address (plaintext, for verification and recovery)" (`proxy.ts:164`) and "Email address: stored in plaintext" (`app/privacy/PrivacyClient.tsx:33`) | false | `users.email_hash` SHA-256 (`schema.sql:3`); plaintext held in KV as `code:<email>` for the OTP TTL (600 s) and as `rate:<email>` for 3,600 s (`server/auth/src/challenge-session/otp.ts:89,300-309,381-387`). | "stored only as a SHA-256 hash ... The address itself is held for up to an hour, while your verification code is live and for rate limiting on code requests, and is passed to our email provider to deliver the code. Then it is discarded; only the hash remains." |
| 29 | "Username and display name: chosen by you during setup" [stored] (`PrivacyClient.tsx:34`, `proxy.ts:165`) | overstated | No display name column in `schema.sql`; display name travels in announces. | Username stored; display name broadcast, not stored. |
| 30 | "Avatar image ... stored on our servers" (`PrivacyClient.tsx:35`) | accurate | `avatars.ts:56`. | Unchanged. |
| 31 | "Cryptographic public keys ... uploaded to our server" (`PrivacyClient.tsx:36`) | accurate | `schema.sql` `noise_public_key`, `signing_public_key`. | Unchanged. |
| 32 | "APNs device token ... Stored server-side" (`PrivacyClient.tsx:37`) | accurate but incomplete | `device_tokens` also stores locale, app version; pushes carry sender name and thread id (`payloads.ts:71-110`). | Adds those facts. |
| 33 | "JWT session tokens ... short-lived and refreshed automatically" (`PrivacyClient.tsx:38`) | accurate | 3,600 s default (`session.ts:33`). | Adds "after an Ed25519 challenge-response" and "expire after one hour". |
| 34 | "Approximate location: only when you actively opt in to Friend Finder ... not stored persistently" (`PrivacyClient.tsx:39`, `proxy.ts:170`) | overstated | Geohash in every announce when location permission is granted; relay memory only (`presence.ts:44-45,344`). | Describes the geohash, its scope, and that it is never written to a database. |
| 35 | "Message content: all direct messages are E2EE (Noise...). Group messages use AES-256-GCM sender key encryption. Our servers relay encrypted packets and cannot decrypt or read your messages." (`PrivacyClient.tsx:46`, `proxy.ts:174`) | overstated | Public channel messages transit the relay in plaintext. | Adds: "Messages in public event channels are Ed25519-signed but not encrypted: anyone at the event can read them, and so can our relay when it forwards them." |
| 36 | "Precise location: we do not collect precise GPS data except during an active SOS alert" (`PrivacyClient.tsx:48`, `proxy.ts:176`) | overstated | No database of GPS. Coordinates leave the phone for Friend Finder and beacons as plaintext broadcasts that also traverse the relay (`LocationPayload.swift`, `TransportCoordinator.swift:306-315`), and for SOS as a plaintext `.sosPreciseLocation` addressed to the accepter (`SOSViewModel.swift:623-646,793`), which the relay queues for up to 1 hour if the accepter is offline (`packet-router.ts:235-260`, `store-forward.ts:33-34`). | "we keep no database of GPS coordinates ... if the person who accepted your SOS is offline, the packet with your coordinates waits in the relay queue for up to 1 hour." |
| 37 | "do not use any third-party analytics services" (`PrivacyClient.tsx:49`) | accurate for App Store builds | Clarity SDK linked, initialised only under `#if DEBUG` (`AppDelegate.swift:35-37`). | Adds the Clarity caveat so a binary inspection is not a surprise. |
| 38 | "Device identifiers or advertising IDs: we do not collect IDFA, IDFV" (`PrivacyClient.tsx:50`) | accurate | No such columns or SDK calls found. | Unchanged. |
| 39 | Mesh relay "does not expose any personal data" (`PrivacyClient.tsx:66`) | overstated | Header PeerIDs, plaintext announces (username, display name, geohash) and public channel text are visible to relaying phones. | Rewritten to name what a relaying device sees. |
| 40 | "stores your account information (email, username, public keys, APNs token) in Neon Postgres ... store-and-forward delivery for encrypted packets only ... 1-hour TTL" (`PrivacyClient.tsx:71`) | overstated (email; "encrypted packets only") | Email hash; avatar in Cloudflare storage; the queue holds every addressed packet regardless of type (`packet-router.ts:235-260`), including plaintext `.sosPreciseLocation` (`SOSViewModel.swift:623-646`); TTL 1 hour is accurate (`store-forward.ts:33-34`). TLS pinning accurate (`ServerConfig.swift:38-42`). | "queues every addressed packet for an offline recipient, whatever its type, for up to 1 hour ... One addressed packet is not encrypted: when someone accepts your SOS alert, your phone sends them your precise GPS coordinates ..." |
| 41 | "Sentry: Collects anonymised diagnostic data only, no message content or personal identifiers." (`PrivacyClient.tsx:82`, `proxy.ts:182`) | overstated | `attachScreenshot = true` (`CrashReportingService.swift:62`). | "We disable Sentry's default personal-data collection and never send message content or your email. A crash report may include a screenshot of whatever was on screen at the moment of the crash." |
| 42 | "You can delete your account and all associated server-side data" (`PrivacyClient.tsx:88`) | accurate (avatar path unverified) | `account.ts:20-23` with cascades. | Unchanged. |
| 43 | Privacy meta description "We store only email, username, public keys, and push tokens, nothing else." (`app/privacy/page.tsx:7`) | false | Same as 10. | "We store a hash of your email, your username, public keys, push token, avatar and notification preferences, and never your messages." |
| 44 | "friends-only location sharing" (`app/features/page.tsx:59`) | overstated | Broadcast on the wire; the app filters display. | "location sharing you switch on and off" |
| 45 | "relays messages phone-to-phone over encrypted Bluetooth mesh" (`app/features/FeaturesClient.tsx:74`) | overstated | Same as 1. | "over Bluetooth mesh" |
| 46 | "Are Blip messages encrypted? Yes. ..." (`app/features/chat/page.tsx:37`) | overstated | Same as 9. | Qualified to DMs and private groups; public channels named. |
| 47 | "Encrypted chat with no signal, and no relay can read it" / "Every thread runs end-to-end encrypted." (`app/features/chat/ChatClient.tsx:73,75`) | false | Public channel threads are plaintext. | "Every direct message and private group runs end-to-end encrypted ... Public event channels are signed but not encrypted". |
| 48 | "the relay only ever sees enough to forward the packet" (`ChatClient.tsx:76`) | accurate but vague | Header: sender, recipient, TTL, type. | Names the header fields. |
| 49 | "The header of every thread says end-to-end encrypted" (`ChatClient.tsx:83`) | false | The app shows the label only for `channel.type == .dm` (`Sources/Views/Tabs/ChatsTab/ChatView.swift:326,401`). | "the header of a direct message thread says end-to-end encrypted". |
| 50 | "Everything stays end-to-end encrypted along the way." (`ChatClient.tsx:145-146`) | overstated | Same as 1. | "Direct messages stay end-to-end encrypted along the way." |
| 51 | "Your iPhone generates an Ed25519 key pair ... that key is your identity on the mesh." (`app/features/profile/page.tsx:32`, `ProfileClient.tsx:48,59,128-129`) | overstated | PeerID is a hash of the Curve25519 Noise key; Ed25519 is the signing key (`KeyManager.swift:9-21`). | "a Curve25519 key pair for encryption and an Ed25519 key pair for signing ... a hash of the Curve25519 public key is your identity on the mesh". |
| 52 | "Blip never asks for your mobile number" / "No phone number goes anywhere." (`profile/page.tsx:32`, `ProfileClient.tsx:57-59,411`) | accurate | No phone number code paths in `Sources/`. | Unchanged. |
| 53 | "at an event it never passes through a Blip server" / "travels phone-to-phone rather than through a Blip server" (`ProfileClient.tsx:61`, `profile/page.tsx:52`) | overstated | When a phone has internet, packets also go to the WebSocket relay (`TransportCoordinator.swift:306-315`; DM routing via relay in `relay-room.ts`). | "at an event they travel phone-to-phone, and when a phone has internet they can also pass through our relay as ciphertext." |
| 54 | "pushes your position to the people you have chosen to share with ... Friends only" (`app/features/nearby/NearbyClient.tsx:77`) | overstated | Broadcast on the wire; app-side filter. | Keeps the UI description, adds "On the wire, the packet is a mesh broadcast that nearby Blip phones relay." |
| 55 | "Nothing here routes through a Blip server. Positions travel the same encrypted path your messages take" (`NearbyClient.tsx:78`) | false | `.locationShare` plaintext; broadcasts reach the relay when connected. | "Positions do not need a Blip server ... as signed location packets. Unlike direct messages they are not encrypted, and when a phone has internet they also pass through our relay." |
| 56 | "Blip has no server collecting your position ... travels peer-to-peer over the mesh, to the people you chose." (`NearbyClient.tsx:260-262`) | overstated | Relay holds a geohash in memory; location packets are broadcasts. | "no server storing your position ... travels over the mesh as a broadcast that nearby phones relay, and the app shows it only to the friends you chose." |
| 57 | SOS "Encryption: Noise XX key agreement with Ed25519 packet signing" (`app/features/safety/SafetyClient.tsx:41`) | false | SOS is a plaintext signed broadcast so everyone can read it (`SOSViewModel.swift:584`). | "SOS alerts are Ed25519-signed broadcasts, left unencrypted so every nearby phone can read them" |
| 58 | "Your account is secured via Ed25519 challenge-response authentication and JWT session tokens." (`app/terms/TermsClient.tsx:42`) | accurate | `session.ts:154`; `jwt.ts`. | Unchanged. |
| 59 | "Relayed messages are end-to-end encrypted" (`TermsClient.tsx:62`) | overstated | Same as 6. | "Relayed direct and group messages are end-to-end encrypted ... Public event channel messages are signed but not encrypted." |
| 60 | "you cannot read relayed messages (they are encrypted)" / "Because messages are end-to-end encrypted, we cannot monitor or moderate message content." (`app/acceptable-use/AcceptableUseClient.tsx:47,52`) | overstated | Same as 6; the support page already says public surfaces are moderated server-side. | Qualified to direct and group messages. |
| 61 | "Your account, registered email hash, and public keys are permanently removed from our servers." (`app/support/SupportClient.tsx:87`) | accurate | `account.ts:20-23`. | Unchanged. |
| 62 | "a cryptographic key stored in your phone's secure enclave" (`SupportClient.tsx:119`) | false | iOS Keychain generic password items, `ThisDeviceOnly` (`KeyManager.swift:72-84`). | "cryptographic keys stored in your phone's iOS Keychain, marked device-only so they never sync to another device." |
| 63 | "a one-way hash of your email address (we never store your email in plain text)" (`SupportClient.tsx:135`) | accurate for the database | Plaintext sits in KV for up to 3,600 s (`rate:<email>`, `otp.ts:300-309`). | Adds "held for up to an hour for your verification code and rate limiting, then discarded; only the hash is stored in our database". |
| 64 | "Apple In-App Purchase transaction IDs if you've bought message packs" [stored] (`SupportClient.tsx:135`) | false | Receipt endpoint returns 501 and stores nothing (`receipts/verify.ts`). | Removed. Push token and avatar added to the stored list. |
| 65 | "we cannot read the content of direct messages or group messages" (`SupportClient.tsx:178`) | accurate | Groups use sender keys. | Unchanged. |
| 66 | "TLS with certificate pinning" (`PrivacyClient.tsx:71`) | accurate | `ServerConfig.swift:38-42`. | Unchanged. |
| 67 | "Dependencies: CryptoKit (Apple), swift-sodium, swift-opus" (`TechClient.tsx:81`) | accurate | `SECURITY.md` dependency table; `project.yml`. | Unchanged. |

Totals: 67 claims. 24 accurate (6 of them made more specific), 33 overstated, 10 false, 0 unverifiable. One sub-item (avatar deletion on account delete) could not be verified and is noted in row 42 without changing the copy.

## Additions requested by the ticket

The ticket asks for the primitive list to be specific. Three rows were added to the `/tech` Encryption table and its `proxy.ts` mirror, each backed by code: group messages (AES-256-GCM sender keys), public event channels (signed, not encrypted), recovery kit (AES-256-GCM with HKDF-SHA-256). If any of these should not be published, drop the row; the audit stands without it.

## Pricing: needs John's decision

No "starting at" or "from" teasers exist on the site (grep of `src/` for `starting at`, `from $`, `from just`, `as low as`). Every price-model assertion below is left as written because the launch model is John's call. What the code shows: the app ships a Message Packs store (`au.heyblip.Blip.starter10` through `unlimited`) backed by `users.message_balance`; the server receipt endpoint is unimplemented (501); there is no verified-profile product.

| Where | Sentence as written | Proposed neutral wording (true under any model) |
|---|---|---|
| `components/Pricing.tsx:43-46` | "Optional verified profile. Messaging, friend finding, and SOS are free. Verification is a one-time add-on for people who want a visible trust marker." | Remove the section until the App Store Connect products exist, or replace with the actual product names and prices. |
| `components/Pricing.tsx:66-75` | "Verified Profile ... $15 one-time ... One payment for a persistent profile marker." | No verified-profile IAP exists in the app source. Delete, or replace with the real product. |
| `components/Pricing.tsx:24-25` | "No core feature lockout: Messaging, friend finding, and SOS stay available without paying." | Conflicts with `message_balance` and Message Packs in the app. Delete, or state exactly which actions consume a message credit. |
| `components/FAQ.tsx:42` | "Yes. Blip is currently free to download from the App Store. There are no ads, no subscriptions required for core messaging features, and no paid tiers gating the essentials like text, voice notes, photos, or SOS alerts." | "Blip is free to download from the App Store. There are no ads." (only if the listing is free; drop the "no paid tiers" clause unless Message Packs are removed). |
| `components/CTA.tsx:34` | "Free to try. Requires iPhone with iOS 17+." | "Requires iPhone with iOS 17+." |
| `app/download/page.tsx:7` | "Free core messaging, requires iOS 17 or newer." | "Requires iOS 17 or newer." |
| `app/features/*/…Client.tsx` (chat:157, profile:143, nearby:174) | "Free on the App Store. iPhone, iOS 17+." | "On the App Store. iPhone, iOS 17+." |
| `app/layout.tsx:154-156` | JSON-LD `Offer { price: "0", priceCurrency: "AUD" }` | Keep only if the listing is free; otherwise remove the Offer. |
| `proxy.ts:9,35` | "**Price:** Free" / "Free. No subscriptions gating core messaging." | "**Price:** see the App Store listing" / remove the Pricing section. |
| `.agents/product-marketing-context.md` | "Free download; premium tier planned" / "Currently free while in early alpha / testflight; paid tier TBD" | Update once decided; the marketing skills read this file. |

## Before and after, every changed sentence

Sixty-seven exact string replacements against `fc883c0`. Each `before` string occurred exactly once in its file.

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
  - after: '{ label: "Session management", value: "Noise session per peer pair; fresh ephemeral keys per handshake; send-direction rekey every 1,000 messages or 1 hour; sessions expire after 4 hours" },\n      { label: "Group messages", value: "AES-256-GCM per-sender keys, distributed over pairwise Noise sessions, rotated on membership change or every 100 messages" },\n      { label: "Public event channels", value: "Ed25519-signed, not encrypted (open to everyone at the event)" },\n      { label: "Recovery kit", value: "AES-256-GCM; key derived with HKDF-SHA-256 from your password and a random 32-byte salt" },'
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
  - after: '- Session management: Noise session per peer pair; fresh ephemeral keys per handshake; send-direction rekey every 1,000 messages or 1 hour; sessions expire after 4 hours\n- Group messages: AES-256-GCM per-sender keys, distributed over pairwise Noise sessions, rotated on membership change or every 100 messages\n- Public event channels: Ed25519-signed, not encrypted (open to everyone at the event)\n- Recovery kit: AES-256-GCM; key derived with HKDF-SHA-256 from your password and a random 32-byte salt'
- `src/proxy.ts`
  - before: 'End-to-end encrypted Bluetooth mesh, built for crowds of 100,000+.'
  - after: 'Bluetooth mesh with end-to-end encrypted direct messages, built for crowds of 100,000+.'
- `src/proxy.ts`
  - before: '- Email address (plaintext, for verification and recovery)\n- Username and display name'
  - after: '- Email address: stored only as a SHA-256 hash. The address itself is held for up to an hour (verification code and rate limiting), then discarded; only the hash remains\n- Username (your display name travels in your presence announcement and is not stored in our database)'
- `src/proxy.ts`
  - before: '- Approximate location — session-only, only when Friend Finder is opted in'
  - after: '- Approximate location: a 5-character geohash (a cell roughly 5 km across) sent in presence announcements while connected to the relay, held in memory only and dropped on disconnect'
- `src/proxy.ts`
  - before: '- Message content (E2E encrypted; we cannot decrypt)'
  - after: '- Message content of direct and group messages (E2E encrypted; we cannot decrypt). Public event channel messages are not encrypted'
- `src/proxy.ts`
  - before: '- Precise GPS (except during an active SOS you explicitly trigger)'
  - after: "- A database of precise GPS. Coordinates leave your phone for Friend Finder, I'm Here beacons, and SOS responders, as signed, unencrypted mesh packets that are relayed, not stored. One exception: when someone accepts your SOS alert while offline, the relay queues the packet carrying your precise position for up to 1 hour"
- `src/proxy.ts`
  - before: 'Sentry (crash reports, anonymised)'
  - after: 'Sentry (crash reports; a crash report may include a screenshot of the screen at the moment of the crash)'
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
  - after: "<li><strong>APNs device token</strong> — provided by Apple when you enable push notifications. Stored server-side, along with your device locale and app version, to deliver push notifications to your device. Push notifications carry the sender's username or display name and a thread identifier, never message content.</li>"
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<li><strong>JWT session tokens</strong> — issued by our authentication server to maintain your logged-in session. These are short-lived and refreshed automatically.</li>'
  - after: '<li><strong>JWT session tokens</strong> — issued by our authentication server after an Ed25519 challenge-response to maintain your logged-in session. They expire after one hour and are refreshed automatically.</li>'
- `src/app/privacy/PrivacyClient.tsx`
  - before: '<li><strong>Approximate location</strong> — only when you actively opt in to Friend Finder. Location data is session-only and is not stored persistently on our servers.</li>'
  - after: "<li><strong>Approximate location</strong> — when you grant location permission, your phone's presence announcement includes a 5-character geohash (a cell roughly 5 km across). Our relay keeps it in memory while you are connected, uses it to scope who receives your announcement, and drops it when you disconnect. It is never written to a database. Friend Finder positions are shared over the mesh, not through our servers.</li>"
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
  - after: "<li><strong>Sentry</strong> — crash reporting and performance monitoring. We disable Sentry's default personal-data collection and never send message content or your email. A crash report may include a screenshot of whatever was on screen at the moment of the crash.</li>"
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
