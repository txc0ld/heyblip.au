"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import Nav from "@/components/Nav";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

export default function PrivacyClient() {
  return (
    <main className="mesh-gradient relative overflow-hidden">
      <Nav />
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />
      <section className="pt-8 md:pt-10 pb-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient mb-6">Privacy Policy</h1>
          <p className="text-sm text-[var(--muted)] mb-14">Last updated: April 2026</p>

          <div className="space-y-10 text-[var(--muted-strong)] text-[15px] leading-[1.8]">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Overview</h2>
              <p>Blip is a Bluetooth mesh chat app built for events — festivals, conferences, concerts, ultra marathons, hikes, and any high-density gathering where mobile reception is unreliable. Privacy is a core design principle. Direct messages and private group chats are end-to-end encrypted before they ever leave your device, and we collect only the minimum data needed to operate the service.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">What We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Email address</strong> — stored only as a SHA-256 hash, which is what we use to recognise your account and for recovery. The address itself is held for up to an hour, while your verification code is live and for rate limiting on code requests, and is passed to our email provider to deliver the code. Then it is discarded; only the hash remains.</li>
                <li><strong>Username</strong> — chosen by you during setup and stored on our server. Your display name is not stored in our database; it travels in the presence announcement your phone broadcasts to nearby phones and to the relay.</li>
                <li><strong>Avatar image</strong> — if you upload a profile photo, it is stored on our servers.</li>
                <li><strong>Cryptographic public keys</strong> — your Ed25519 signing key and Noise XX public key are uploaded to our server so other users can establish encrypted conversations with you.</li>
                <li><strong>APNs device token</strong> — provided by Apple when you enable push notifications. Stored server-side, along with your device locale and app version, to deliver push notifications to your device. Push notifications carry the sender&apos;s username and a thread identifier (for direct messages, a UUID derived from the sender&apos;s peer ID), never message content.</li>
                <li><strong>JWT session tokens</strong> — issued by our authentication server after an Ed25519 challenge-response to maintain your logged-in session. They expire after one hour and are refreshed automatically.</li>
                <li><strong>Approximate location</strong> — when you grant location permission and Nearby visibility is on, your phone&apos;s presence announcement includes a 5-character geohash (a cell roughly 5 km across). Our relay keeps it in memory while you are connected, uses it to scope who receives your announcement, and drops it when you disconnect. It is never written to a database. Friend Finder positions are broadcast over the mesh and, when a phone has internet, forwarded by our relay to every connected Blip phone; the relay forwards them and does not store them.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">What We Don&apos;t Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Message content</strong> — all direct messages are end-to-end encrypted using the Noise protocol (Noise_XX_25519_ChaChaPoly_SHA256). Private group messages use AES-256-GCM sender key encryption. Our servers relay these packets and cannot decrypt or read them. Messages in public event channels are Ed25519-signed but not encrypted: anyone at the event can read them, and so can our relay when it forwards them.</li>
                <li><strong>Contacts or address book</strong> — we do not collect or access your contacts.</li>
                <li><strong>Precise location</strong> — we keep no database of GPS coordinates. Precise coordinates leave your phone when you share your position in Friend Finder, drop an I&apos;m Here beacon, or someone accepts your SOS alert (the alert itself carries only a coarse geohash). They travel as signed, unencrypted mesh packets to nearby phones, and when a phone has internet they also go through our relay, which forwards Friend Finder positions and beacons to every Blip phone connected to it, not only nearby ones. Broadcast positions and beacons are forwarded, not stored. The SOS precise-location packet is different: it is addressed to the person who accepted your alert, and like every addressed packet our relay routes, it is written to relay storage until that person acknowledges it or one hour passes, whichever comes first.</li>
                <li><strong>Browsing history or usage analytics</strong> — we do not collect any browsing data and do not use any third-party analytics services, ad networks, or tracking pixels. The Microsoft Clarity SDK is linked into the app for our internal debug builds only and is never initialised in App Store builds.</li>
                <li><strong>Device identifiers or advertising IDs</strong> — we do not collect IDFA, IDFV, or any device fingerprinting data.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Authentication</strong> — your email address is used to verify your identity during registration via a one-time verification code.</li>
                <li><strong>Encryption</strong> — your public keys are shared with other users so they can initiate end-to-end encrypted conversations with you.</li>
                <li><strong>Push notifications</strong> — your APNs device token is used solely to deliver notifications when you receive messages while the app is in the background.</li>
                <li><strong>Friend Finder</strong> — if you opt in, your approximate location is shared with your friends for the duration of your session only.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Bluetooth Mesh Relay</h2>
              <p>When your device relays direct or group messages for other users through the Bluetooth mesh network, those messages are encrypted before transmission and your device cannot decrypt or read them. Relay participation is automatic and is a core part of how the mesh network functions. A relaying device does see each packet&apos;s header (sender and recipient IDs, which are hashes of public keys, plus packet type and hop count), and it can read public event channel messages and presence announcements, which are not encrypted.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Data Storage &amp; Security</h2>
              <p>Your messages and conversation history are stored locally on your device. Our backend infrastructure stores your account information (email hash, username, public keys, APNs token, notification preferences) in a Neon Postgres database, and your avatar in Cloudflare storage. Backend services run on Cloudflare Workers at edge locations. All communication between your device and our servers is encrypted via TLS with certificate pinning. The WebSocket relay writes every addressed packet it routes to relay storage before delivering it, whatever its type and whether or not the recipient is online, and deletes it when the recipient acknowledges it or after 1 hour, whichever comes first. Direct messages, private group messages and friend requests travel as Noise ciphertext the relay cannot read. Other addressed packets are not encrypted, and the one that carries personal data in plaintext is the SOS precise location: when someone accepts your SOS alert, your phone sends them your GPS coordinates as a signed, unencrypted packet, which sits in relay storage, coordinates included, until they acknowledge it or the hour passes. The relay also sees the header of every packet (sender and recipient IDs, type, timestamps).</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Third-Party Services</h2>
              <p>We use a limited number of third-party services to operate Blip. We do not sell or share your data with any third party for advertising or marketing purposes.</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>Cloudflare</strong> — hosts our backend workers (authentication, relay, and CDN). Data is processed on Cloudflare&apos;s edge network.</li>
                <li><strong>Neon</strong> — managed Postgres database that stores user account records and public keys.</li>
                <li><strong>Resend</strong> — sends transactional emails (verification codes). Receives your email address for delivery only.</li>
                <li><strong>Apple Push Notification service (APNs)</strong> — delivers push notifications to your device.</li>
                <li><strong>Sentry</strong> — crash reporting and performance monitoring. We disable Sentry&apos;s default personal-data collection and do not attach message data to a report, but a report may include a screenshot of whatever was on screen at the moment of the crash, and that screenshot can show messages that were open. Reports carry your username and an app-generated account identifier so we can group them per account. Your email is not sent.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Your Rights</h2>
              <p>You can delete your account at any time from the app settings. Deletion removes your account row (email hash, username, public keys, message balance) and, with it, your device tokens and notification preferences. Two things are not removed. Abuse reports you filed, or that were filed about you, reference your peer ID (a hash of your public key) plus the reporter&apos;s category and free-text reason, and we keep them so moderation history survives account deletion. Your avatar has no automatic deletion path yet; email privacy@heyblip.au to have it removed. You may request a copy of the data we hold about you. Under Australian privacy law and, where applicable, the GDPR, you have the right to access, correct, or delete your personal data. For any privacy-related enquiries, contact us at <a href="mailto:privacy@heyblip.au" className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors">privacy@heyblip.au</a>.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Children&apos;s Privacy</h2>
              <p>Blip is intended for users aged 13 and older. We do not knowingly collect personal information from children under 13. If we become aware that a user is under 13, we will promptly delete their account and associated data.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Changes to This Policy</h2>
              <p>We may update this policy from time to time. Material changes will be communicated via the app. Continued use of Blip after changes constitutes acceptance of the updated policy.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Contact</h2>
              <p>For privacy questions or data requests, email us at <a href="mailto:privacy@heyblip.au" className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors">privacy@heyblip.au</a>.</p>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
