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
const DARK_THEME_CLASS = "CcsDpe";
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
