# Jargon AI Ultimate Edition 3.0

A cross-platform AI assistant foundation for web, Android and iPhone. The web app is a Progressive Web App (PWA); Capacitor configuration is included for native Android/iOS project generation. This package is a source project, not a signed APK or iOS IPA.

## Included in this stage
- Existing registration, login, account plans, daily quotas, admin dashboard and IntaSend M-Pesa STK foundation.
- AI text chat through OpenAI Responses API.
- Optional web search in chat (provider/model access required).
- Image understanding from uploaded image files.
- PDF, DOCX and TXT text extraction and analysis (12 MB upload limit).
- Image generation through OpenAI image generation API.
- Voice recording/transcription and spoken answers. Microphone access requires HTTPS and user permission.
- PWA installation support and Capacitor Android/iOS project configuration.

## Requirements
- Node.js 20 or newer and npm.
- OpenAI API key with access to the selected models/features.
- IntaSend credentials only if enabling payments.
- Persistent disk/database storage for production.
- For Android native builds: Android Studio and Android SDK.
- For iOS native builds/signing: macOS, Xcode and an Apple Developer account for device distribution.

## Run locally
1. Copy `.env.example` to `.env`.
2. Set `OPENAI_API_KEY` and a long random `JWT_SECRET`. Keep secrets server-side.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000`. For microphone and PWA features on phones, use an HTTPS deployment.

## Deploy website / PWA
Deploy this Node service to a host with persistent storage. Build command: `npm install`; start command: `npm start`. Configure environment variables in the host dashboard, not in source control. Set `DB_FILE` to a persistent disk path. Set `NODE_ENV=production`, `JWT_SECRET`, `OPENAI_API_KEY`, and optionally IntaSend settings. Configure your payment provider webhook to `/api/payments/webhook` and verify provider webhook signatures before live payments. The current inherited webhook handler should be hardened with provider signature verification before production.

## Install on Android
After deployment to HTTPS, open the website in Chrome on Android, open the menu and choose Install app / Add to Home screen. For a native Android shell on a development computer, first replace the placeholder `server.url` and `allowNavigation` values in `capacitor.config.json` with your deployed HTTPS domain. This native wrapper loads your hosted Jargon website and backend, so deploy the server before building the wrapper. Then run:
```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```
Build and sign the app in Android Studio.

## Install on iPhone
Fastest route: deploy to HTTPS, open the website in Safari on iPhone, tap Share, then Add to Home Screen. The PWA manifest and Apple touch icon are configured.

For a native iOS shell (requires macOS + Xcode), use the same deployed HTTPS domain in `capacitor.config.json`, then run:
```bash
npm install
npx cap add ios
npx cap sync ios
npx cap open ios
```
Select a signing team in Xcode and build for your device. Apple signing/TestFlight/App Store distribution are separate steps.

## API features
- `POST /api/chat` accepts multipart form fields `messages` (JSON array), optional `webSearch=true`, and optional `file` (image/PDF/DOCX/TXT).
- `POST /api/images/generate` accepts `{ "prompt": "..." }`.
- `POST /api/audio/transcribe` accepts multipart `audio`.
- `POST /api/audio/speech` accepts `{ "text": "..." }` and returns MP3 audio.

All AI endpoints require an authenticated user. Daily plan quota is applied to chat and image generation; audio transcription/speech currently do not consume the message quota. Add separate audio/image quotas and cost monitoring before public launch.

## Roadmap — staged implementation
**Stage 1 (this source package):** web/PWA, Capacitor foundations, chat, search toggle, image/document analysis, image generation, voice, accounts, plans and M-Pesa foundation.

**Stage 2:** persistent cloud chat history, secure file library, spreadsheet analysis/export, PDF/DOCX/XLSX generation, better citations and source controls, per-feature quotas, admin usage analytics, payment webhook signature verification, automated tests and rate limiting.

**Stage 3:** video generation/editing provider integration, agent workflows with approvals, email/calendar integrations, reminders, user-controlled memory, native push notifications, subscriptions/renewals and app-store release.

## Important limitations / production checklist
- This is not yet a fully tested production service. Run `npm install` and `npm run check`, then test each provider endpoint with sandbox/test credentials.
- Web search availability depends on OpenAI API account/model/tool access.
- Image generation requires image model access and may incur additional API costs.
- Voice requires browser microphone permission; supported formats vary by browser/device.
- PDF text extraction does not OCR scanned/image-only PDFs. DOCX tables/layout may be simplified.
- Video generation, spreadsheet analysis, file export, agent workflows and external email/calendar actions are roadmap items, not currently active features.
- Add HTTPS, backups, persistent storage, rate limiting, CSRF protection for cookie-authenticated state changes, robust webhook signature verification, privacy policy, terms, moderation and monitoring before public launch.
- Never commit `.env` or expose secret keys in frontend code.
