# Google Calendar Custom Background

Chromium extension for adding a custom background to Google Calendar with a lightweight settings page and live preview.

It supports three background sources:
- image URL
- solid color
- local image upload

The extension also includes:
- a live preview before applying changes
- a top-bar button inside Google Calendar that opens the extension settings
- custom extension icons
- sidebar styling that lets the background show through more cleanly

## What The Project Does

This extension injects a custom background layer into `https://calendar.google.com/*` and stores user settings locally in the browser.

Current features:
- choose a background from URL
- choose a solid color
- upload a local image
- adjust overlay opacity
- live preview in the options page
- automatic background update for open Google Calendar tabs
- extension toolbar icon and custom branding assets
- settings shortcut button inside the Google Calendar header
- transparent and softened sidebar surfaces so the background also shows through the left panel more cleanly
- automatic adaptation for Google Calendar light and dark themes

The image behavior is intentionally fixed to:
- `background-size: cover`
- `background-position: center center`

That keeps the UI simpler and makes preview behavior consistent with the applied result.

## Project Structure

`manifest.json`

- Chrome extension manifest using Manifest V3
- registers permissions, options page, background worker, icons, and Google Calendar content script

`src/background.js`

- background service worker
- opens the extension options page when the in-calendar button is clicked

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
- keeps the UI intentionally minimal: source selection, upload/color input, opacity, save, and reset

`src/content.js`

- runs on Google Calendar pages
- reads saved settings from `chrome.storage.local`
- injects and updates the background layer
- listens for settings changes and reapplies them
- detects the current Google Calendar theme and applies matching extension theme classes
- injects a button into the Google Calendar top bar that opens the settings page

`src/content.css`

- styles for the injected background layer
- helper classes used to make Google Calendar containers transparent enough for the custom background to show through
- contains targeted fixes for sidebar and task-related surfaces
- styles the in-calendar settings button

`assets/`

- extension icons and icon source artwork
- optional place for screenshots used in the README

## How It Works

The extension has three main parts:

1. Options page

- lets the user configure the background
- saves settings into browser local storage
- previews the result before applying it

2. Content script

- runs inside Google Calendar
- inserts a fixed background layer behind the Calendar UI
- applies the saved image or color
- keeps an overlay so the calendar content stays readable
- softens selected sidebar surfaces with transparency and rounded corners
- reacts to Google Calendar dark/light theme changes
- adds a quick settings button in the Calendar header

3. Background worker

- receives a message from the in-calendar button
- opens the extension options page in a safe extension-controlled way

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
5. You can also use the small background/settings button inside the Google Calendar top bar to reopen the settings page later.

## Development Notes

There is no build step right now. This project is plain HTML, CSS, and JavaScript.

If you change the source files:

1. reload the extension in `chrome://extensions`
2. refresh the Google Calendar tab

## Current UI

The options page currently exposes only the core controls:
- background source
- image URL or local upload or solid color
- overlay opacity
- save and reset

The following image behaviors are fixed by design:
- `cover`
- centered positioning

This was done to keep preview behavior predictable and avoid mismatches between the preview and the real Google Calendar layout.

## Screenshots

If you want to add screenshots to the repository, put them here:

- `assets/screenshots/options-page.png`
- `assets/screenshots/calendar-view.png`

Recommended screenshots:

1. `options-page.png`
   Show the extension settings page with the blue theme and preview visible.

2. `calendar-view.png`
   Show Google Calendar with a custom background already applied, including the softened left sidebar and the small header button that opens settings.

## Limitations

- Google Calendar is a third-party app, so DOM or class name changes on Google's side can require updates to the content script
- some external image URLs may behave differently depending on how the remote server serves the image
- large local images are stored in browser local storage, so very large files are not ideal
- sidebar/task transparency depends on Google Calendar class names, so Google UI updates can require selector fixes

## Future Ideas

- built-in background presets
- blur, brightness, or dimming controls
- separate presets for different Google Calendar views
- multiple visual styles for the in-calendar sidebar surfaces
