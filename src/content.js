const DEFAULT_SETTINGS = {
  backgroundType: "url",
  imageUrl: "",
  backgroundColor: "#27476e",
  localImageDataUrl: "",
  localFileName: "",
  overlayOpacity: 22,
  backgroundSize: "cover",
  backgroundPosition: "center center"
};

const BACKGROUND_ID = "gcbe-background-layer";
const SETTINGS_BUTTON_ID = "gcbe-settings-button";
const DARK_THEME_CLASS = "CcsDpe";
const TOP_BUTTONS_CLASS = "d6McF";
const BUTTON_HOLDER_CLASS = "uW9umb";
const TRANSPARENT_SELECTORS = [
  "html",
  "body",
  "#yDmH0d",
  "[role='navigation']",
  "[role='main']",
  "[role='main'] > div",
  "[role='complementary']",
  "[aria-label='Main drawer']",
  "[aria-label='Главное меню']",
  "[aria-label*='My calendars']",
  "[aria-label*='Мои календари']",
  "[aria-label*='Tasks']",
  "[aria-label*='Задачи']",
  "[data-test-id='calendar']",
  "[aria-label='Tasks']",
  "[aria-label='Задачи']",
  ".tEhMVd",
  ".A0xKTd",
  ".Xfkwo",
  ".rSoRzd",
  ".Kk7lMc-XuHpsb",
  ".Kk7lMc-DWWcKd-OomVLb",
  ".MCxZp",
  ".EIlDfe",
  ".LzwiGe",
  ".fFW7wc",
  ".QQYuzf",
  ".IYewr",
  ".toUqff"
];

function ensureBackgroundLayer() {
  let layer = document.getElementById(BACKGROUND_ID);

  if (!layer) {
    layer = document.createElement("div");
    layer.id = BACKGROUND_ID;
    document.body.appendChild(layer);
  }

  return layer;
}

function markTransparentNodes() {
  TRANSPARENT_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.classList.add("gcbe-transparent");
    });
  });

  document.documentElement.classList.add("gcbe-ready");
  document.body.classList.add("gcbe-ready");
}

function syncThemeClass() {
  if (!document.body) {
    return;
  }

  const isDarkTheme = document.body.classList.contains(DARK_THEME_CLASS);
  const shouldHaveDark = isDarkTheme;
  const shouldHaveLight = !isDarkTheme;

  if (document.body.classList.contains("gcbe-dark-theme") !== shouldHaveDark) {
    document.body.classList.toggle("gcbe-dark-theme", shouldHaveDark);
  }

  if (document.body.classList.contains("gcbe-light-theme") !== shouldHaveLight) {
    document.body.classList.toggle("gcbe-light-theme", shouldHaveLight);
  }
}

function createSettingsButton() {
  const button = document.createElement("button");
  button.id = SETTINGS_BUTTON_ID;
  button.className = TOP_BUTTONS_CLASS;
  button.type = "button";
  button.title = "Change background";
  button.setAttribute("aria-label", "Change background");
  button.innerHTML = `
    <span class="xjKiLb">
      <span class="Ce1Y1c gcbe-settings-button__icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" focusable="false" aria-hidden="true" class="NMm5M hhikbc gcbe-settings-button__icon">
          <path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25ZM6.75 5.5c-.69 0-1.25.56-1.25 1.25v10.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V6.75c0-.69-.56-1.25-1.25-1.25ZM8 15.5l2.7-3.37a1 1 0 0 1 1.57.02l1.57 1.99 1.56-2.01a1 1 0 0 1 1.58 1.23l-2.35 3.02A1 1 0 0 1 13.86 16l-1.59-2.02-2.5 3.12A1 1 0 1 1 8 15.5Zm2.25-5.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"></path>
        </svg>
      </span>
    </span>
  `;
  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "gcbe:open-options" });
  });
  return button;
}

function installSettingsButton() {
  if (document.getElementById(SETTINGS_BUTTON_ID)) {
    return;
  }

  const buttonHolder = document.querySelector(`.${BUTTON_HOLDER_CLASS}`);

  if (!buttonHolder) {
    return;
  }

  buttonHolder.insertBefore(createSettingsButton(), buttonHolder.firstElementChild || null);
}

function getImageSource(settings) {
  if (settings.backgroundType === "url") {
    return settings.imageUrl;
  }

  if (settings.backgroundType === "local") {
    return settings.localImageDataUrl;
  }

  return "";
}

function applyBackground(settings) {
  if (!document.body) {
    return;
  }

  const layer = ensureBackgroundLayer();
  markTransparentNodes();
  syncThemeClass();
  installSettingsButton();

  const imageSource = getImageSource(settings);
  const hasImage = Boolean(imageSource);

  layer.style.backgroundColor = settings.backgroundColor || DEFAULT_SETTINGS.backgroundColor;
  layer.style.backgroundImage = hasImage ? `url("${imageSource}")` : "none";
  layer.style.backgroundSize = "cover";
  layer.style.backgroundPosition = "center center";
  layer.style.setProperty("--gcbe-overlay", `rgba(255, 255, 255, ${(settings.overlayOpacity ?? DEFAULT_SETTINGS.overlayOpacity) / 100})`);
  layer.classList.toggle("gcbe-color-only", !hasImage);
}

function initObserver() {
  const contentObserver = new MutationObserver(() => {
    markTransparentNodes();
    installSettingsButton();
  });

  contentObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  const themeObserver = new MutationObserver(() => {
    syncThemeClass();
  });

  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"]
  });
}

function loadAndApplySettings() {
  chrome.storage.local.get(DEFAULT_SETTINGS, (settings) => {
    applyBackground(settings);
  });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  const nextSettings = { ...DEFAULT_SETTINGS };

  Object.keys(DEFAULT_SETTINGS).forEach((key) => {
    nextSettings[key] = changes[key] ? changes[key].newValue : DEFAULT_SETTINGS[key];
  });

  chrome.storage.local.get(DEFAULT_SETTINGS, (stored) => {
    applyBackground({
      ...nextSettings,
      ...stored
    });
  });
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    loadAndApplySettings();
    initObserver();
  });
} else {
  loadAndApplySettings();
  initObserver();
}
