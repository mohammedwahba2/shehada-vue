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
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
app/
├── components/        # Vue components
│   ├── RecitePrompt.vue    # Audio playback for each step
│   ├── VisualizerOrb.vue   # Audio visualizer
│   ├── Certificate.vue     # Completion certificate
│   └── ...
├── composables/       # Reusable logic
│   ├── useSpeechRecognition.ts   # Voice recognition
│   ├── useAudioVisualizer.ts     # Mic visualization
│   └── useAudioPlayback.ts       # Audio playback
├── types/             # TypeScript definitions
└── constants/         # Static data (shahada steps, navigation)
```

## How the Voice Recognition Works

1. The app requests microphone access via `getUserMedia`
2. Uses the Web Speech API's `SpeechRecognition` to transcribe Arabic speech
3. Normalizes the transcript (removes diacritics, standardizes Arabic letter forms)
4. Matches against the 5 Shahada steps using consecutive word matching
5. Advances to the next step when a match is found

The matching algorithm handles common pronunciation variations and Arabic letter substitutions that non-native speakers might make.

## Audio Playback

The `useAudioPlayback` composable handles browser autoplay restrictions:
- Autoplay only works after user interaction
- Includes retry logic with exponential backoff
- Shows visual feedback (loading spinner, error icon)
- Generation-based cancellation prevents overlapping plays

## Audio Visualization

The orb animation is driven by real-time microphone input:
- Creates an `AudioContext` with `AnalyserNode`
- Calculates RMS (Root Mean Square) volume each frame
- Maps volume to the orb's visual state

## Browser Support

Works best in Chrome, Edge, and Safari. Firefox requires enabling `media.webspeech.recognition.enable` in `about:config`.

## Privacy

Everything runs locally in the browser. No data is sent to any server.

## License

MIT