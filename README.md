# AutoCut

**Turn clips into videos.**

AutoCut is an AI-powered video editor for creators, bringing long-form and vertical video editing together in one application.

## What is AutoCut?

AutoCut helps you rapidly assemble raw media into polished, production-ready videos. Whether you are producing cinematic horizontal videos for YouTube or fast-paced vertical shorts for TikTok and Instagram Reels, AutoCut provides the tools to manage your assets, sequence your timeline, and export your final cut directly from your device.

## Key Features

- **Long-form Video Editing:** A full cinematic editing environment for horizontal HD content. Features smart timelines, voiceover syncing, and multi-track audio.
- **Vertical Video Editing:** A specialized 9:16 editor built specifically for fast-paced vertical content, complete with crop management and rapid frame seeking.
- **On-Device Rendering:** Export your finished timeline to high-quality video files entirely on your device using native FFmpeg integration.
- **Media Management:** Easily organize, categorize, and preview your raw clips before editing.
- **Mobile First:** A responsive, touch-friendly interface designed for creators on the go.

## How to Run

AutoCut is built with React, TypeScript, Vite, and Capacitor for native mobile deployment.

### Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

### Building for Android

1. Build the web assets:
   ```bash
   npm run build
   ```
2. Sync the web assets to the Android project:
   ```bash
   npx cap sync android
   ```
3. Open the project in Android Studio to build and deploy the APK:
   ```bash
   npx cap open android
   ```

## License

This project is open-source. Please see the repository for licensing information.

## Creator

**Built by Sahil**
- [Instagram](https://instagram.com/sahilsleem)
- [GitHub](https://github.com/sahilsleem)
- [Email](mailto:isahilsaleem@gmail.com)
