# Shahada App

A web app for learning and reciting the Shahada with real-time voice recognition and audio visualization.

![Preview](public/preview.png)

## What it does

The app helps you learn the Shahada by:
- Listening to your recitation and transcribing it in real-time
- Showing you which words you've pronounced correctly
- Playing audio guides for each step
- Generating a certificate when you complete all 5 steps

## Tech Stack

- **Nuxt 4** with Vue 3 Composition API
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Web Speech API** for voice recognition
- **Web Audio API** for audio visualization

## Quick Start

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
```

### Deploy (Vercel)

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Optional: set `NUXT_PUBLIC_SITE_URL` for canonical URLs.
4. Deploy — no server secrets required.

## Project Structure

```
app/
├── components/        # Vue components
├── composables/       # useSpeechRecognition, useAudioVisualizer, useAudioPlayback, useOrbSvg
├── utils/             # Shahada matching helpers + tests
└── constants/         # shahadaSteps
public/
├── orbs/              # Figma SVG assets (listen, speak, engage, error)
└── audio/             # Step pronunciation guides (step1–5.m4a)
```

## Voice Recognition

1. Microphone access via `getUserMedia`
2. Web Speech API (`ar-SA`) with interim + final results
3. Arabic normalization and consecutive step matching
4. Auto-advance through 5 Shahada steps

## Audio Visualization

- Figma SVG orbs rendered **inline in the DOM** (not `<img>`) for iOS Safari compatibility
- SVG backgrounds use native gradients (no `foreignObject`) for mobile support
- **Desktop:** Web Audio `AnalyserNode` drives speaking vs listening
- **Mobile:** Speech API events drive orb state (iOS cannot share mic between Speech Recognition and AudioContext)
- All orbs are preloaded on mount to avoid flashes when the mode changes

## Browser Support

| Platform | Recommendation |
|----------|----------------|
| Desktop | Chrome, Edge, Safari, Firefox* |
| iPhone | **Safari only** for speech recognition |
| Android | Chrome |

\*Firefox: enable `media.webspeech.recognition.enable` in `about:config`.

## Privacy

All processing runs in the browser. No audio or transcripts are sent to a server.

## License

MIT
