# Video Player with Subtitle Editing

This project is a web-based video player built with **React**, **TypeScript**, and **Vite**. 
It allows users to upload a video file and a subtitle file (.srt), display the video with subtitles, and edit them in real-time. 
Additionally, it supports **audio waveform visualization** for better editing synchronization, and offline functionality by saving video and subtitle data in **IndexedDB**.

## Features

- **Video Playback**: Play video files directly in the browser.
- **Subtitle Editing**: 
    - Edit existing subtitles, including text, timing, and duration.
    - Merge subtitle files and adjust them to synchronize perfectly with the video.
    - Real-time updates to subtitles as you make changes, with immediate visual feedback.
- **Audio Waveform Display**: Visualize the audio waveform of the video for precise subtitle timing adjustments.
- **Offline Support**: 
    - Save video and subtitle data locally using **IndexedDB** for offline usage. 
    - The app retains your data even after refreshing or closing the browser, enabling a seamless experience across sessions.
- **Progress Tracking**: Keep track of subtitle progress in real time with synchronization during playback.

## Technologies Used

- **React** for building the user interface
- **TypeScript** for static typing and better developer experience
- **Vite** for fast development and building
- **WaveSurfer.js** for waveform visualization of the video
- **IndexedDB** for saving video and subtitle data locally
- **Chakra UI** for building responsive, accessible UI components
- **React Player** for video playback functionality

## Installation

To get the project up and running locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/ArturoTarantino/voiseed-assignment.git
    cd voiseed-assignment
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

The app will be accessible at `http://localhost:5173/` by default.

## Usage

1. Open the application in your browser.
2. Upload a video file and a subtitle file by clicking the upload button.
3. Once the video and subtitle files are loaded, you can edit subtitles, merge consecutive lines, or adjust their duration.
4. The video will display subtitles according to the time intervals defined for each one.
5. Use the video player controls to play, pause, or seek the video.
6. A waveform of the video's audio will be displayed, allowing for better synchronization of subtitles.

## Configuration

- **Video Duration**:
  - For videos less than 30 seconds, subtitles are shown in a larger font size with quick time intervals.
  - For longer videos, the font size and interval between subtitles are adjusted for better readability.

- **Recommended Video Length**: For the best experience, I recommend using a video around 30 seconds long. While the app is still usable with longer or shorter videos, the visual and functional experience may not be as optimal.

## Troubleshooting

- **Offline functionality not working**: Check your browser's IndexedDB settings and clear cache if necessary.