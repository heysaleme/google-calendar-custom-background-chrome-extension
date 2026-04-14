# Google Calendar Custom Background

Make Google Calendar look more personal by adding your own background image or color.

This extension works in Chromium-based browsers such as:
- Google Chrome
- Arc
- Microsoft Edge
- Brave
- Opera

## What It Does

With this extension, you can:
- set a background image from a link
- upload an image from your computer
- use a solid background color
- preview the result before saving

The extension also makes parts of Google Calendar more transparent so your background is easier to see.

## How To Install

This extension is not installed from the Chrome Web Store. You need to add it manually once.

1. Download this project to your computer.
2. If you downloaded a ZIP file, unzip it first.
3. Open your browser and go to `chrome://extensions`
4. Turn on `Developer mode` in the top right corner.
5. Click `Load unpacked`.
6. Select the project folder.

After that, the extension will appear in your browser.

## How To Open The Settings

You can open the settings in either of these ways:

1. Open [Google Calendar](https://calendar.google.com)
2. Click the small background/settings icon in the top bar

Or:

1. Open `chrome://extensions`
2. Find `Google Calendar Custom Background`
3. Open its details
4. Click `Extension options`

## How To Use It

1. Open the extension settings.
2. Choose one background type:
   `Image URL`, `Color`, or `Local image`
3. Enter the image link, choose a color, or upload a file.
4. Adjust `Overlay opacity` if you want the background to be more visible or more soft.
5. Click `Save and apply`.
6. Go back to Google Calendar.

If you do not see the change right away, refresh the Google Calendar tab.

## Background Types Explained

### Image URL

Use this if you have a direct link to an image online.

Best option:
- links that end with `.jpg`, `.jpeg`, `.png`, or `.webp`

Some websites do not allow direct image loading, so if one link does not work, try another.

### Color

Use this if you want a simple solid background.

You can:
- pick a color with the color picker
- type a color like `#27476e`

### Local Image

Use this if the image is saved on your computer.

Supported formats include:
- JPG
- PNG
- WEBP

## Troubleshooting

### The background does not appear

Try this:
- refresh Google Calendar
- reopen the settings and click `Save and apply` again
- reload the extension on `chrome://extensions`

### My image link does not work

This usually means the link is not a direct image URL.

Try using:
- a direct file link ending in `.jpg`, `.png`, or `.webp`
- a different image host

### My uploaded image does not load

Try:
- using a smaller file
- using JPG or PNG
- selecting the file again

### Google Calendar looks strange after a Google update

Google sometimes changes its interface, and this extension depends on that interface.
If that happens, the extension may need an update.

## Screenshots

| Settings | Calendar |
| --- | --- |
| ![Options page](assets/screenshots/options-page.png) | ![Google Calendar with custom background](assets/screenshots/calendar-view.png) |

## Good To Know

- Your settings are saved in the browser.
- The extension only runs on `calendar.google.com`.
- Very large local images may not save well.
- Google Calendar's own interface updates can sometimes affect the styling.

## For Developers

If you are editing the project itself:
- `manifest.json` contains extension settings
- `src/content.js` and `src/content.css` apply the background inside Google Calendar
- `src/options.html`, `src/options.css`, and `src/options.js` power the settings page
- `src/background.js` opens the options page from the injected button
