# Installation Guide

## Firefox Installation

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension folder
6. The extension will be loaded temporarily (until Firefox is restarted)

### For Permanent Installation in Firefox:
- You can package the extension as a .xpi file and install it permanently
- Or submit it to Mozilla Add-ons store for distribution

## Chrome Installation

1. Clone or download this repository
2. Replace `manifest.json` with `manifest-chrome.json` (rename it to `manifest.json`)
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top-right corner
5. Click "Load unpacked"
6. Select the extension folder
7. The extension will be loaded

## Configuration

1. After installation, click on the extension icon in your browser toolbar
2. Click the settings gear icon
3. Enter your Groq API key (get one from https://groq.com)
4. Save the settings
5. Navigate to LinkedIn or Instagram and the extension will start filtering your feed

## Features

- **Blur Mode**: Blurs cringe content until you decide to view it
- **Vanish Mode**: Completely removes cringe content from your feed
- **Mute Words**: Add specific words to automatically filter posts containing them
- **Statistics**: Track how much cringe content you've avoided and time saved

## Troubleshooting

- Make sure you have a valid Groq API key
- Ensure the extension is enabled in your browser
- Check that you're on LinkedIn's feed page (https://www.linkedin.com/feed/) or Instagram's feed page (https://www.instagram.com/)
- Refresh the page after making settings changes