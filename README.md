# Google Calendar Custom Background

Chromium extension for adding a custom background to Google Calendar.

It supports three background sources:
- image URL
- solid color
- local image upload

The extension also includes a settings page with a live preview before applying changes to Google Calendar.

## What The Project Does

This extension injects a custom background layer into `https://calendar.google.com/*` and stores user settings locally in the browser.

Current features:
- choose a background from URL
- choose a solid color
- upload a local image
- adjust overlay opacity
- live preview in the options page
- automatic background update for open Google Calendar tabs

The image behavior is intentionally fixed to:
- `background-size: cover`
- `background-position: center center`

That keeps the UI simpler and makes preview behavior consistent with the applied result.

## Project Structure

`manifest.json`

- Chrome extension manifest using Manifest V3
- registers permissions, options page, and Google Calendar content script

`src/options.html`

- settings page markup
- contains the controls for background source, upload, color, preview, and save/reset actions

`src/options.css`

- visual styling for the settings page
- layout, theme, form controls, and preview mockup

`src/options.js`

- options page logic
- loads and saves settings with `chrome.storage.local`
- handles local file upload
- updates the live preview

`src/content.js`

- runs on Google Calendar pages
- reads saved settings from `chrome.storage.local`
- injects and updates the background layer
- listens for settings changes and reapplies them

`src/content.css`

- styles for the injected background layer
- helper classes used to make Google Calendar containers transparent enough for the custom background to show through

## How It Works

The extension has two main parts:

1. Options page

- lets the user configure the background
- saves settings into browser local storage
- previews the result before applying it

2. Content script

- runs inside Google Calendar
- inserts a fixed background layer behind the Calendar UI
- applies the saved image or color
- keeps an overlay so the calendar content stays readable

## Installation

1. Download or clone this repository.
2. Open Chromium or Chrome.
3. Go to `chrome://extensions`.
4. Enable `Developer mode`.
5. Click `Load unpacked`.
6. Select this project folder:
   `google-calendar-custom-background-chrome-extension`

After that:

1. Open the extension options page from `chrome://extensions`, or from the extension details page.
2. Choose a background source.
3. Save the settings.
4. Open or refresh Google Calendar.

## Development Notes

There is no build step right now. This project is plain HTML, CSS, and JavaScript.

If you change the source files:

1. reload the extension in `chrome://extensions`
2. refresh the Google Calendar tab

## Limitations

- Google Calendar is a third-party app, so DOM or class name changes on Google's side can require updates to the content script
- some external image URLs may behave differently depending on how the remote server serves the image
- large local images are stored in browser local storage, so very large files are not ideal

## Future Ideas

- dark and light preset themes for the options page
- built-in background presets
- blur, brightness, or dimming controls
- separate presets for different Google Calendar views
