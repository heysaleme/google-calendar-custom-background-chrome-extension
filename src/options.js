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

const form = document.getElementById("settings-form");
const statusNode = document.getElementById("status");
const previewNode = document.getElementById("preview");
const previewOverlayNode = previewNode.querySelector(".preview__overlay");
const typeInputs = Array.from(document.querySelectorAll('input[name="backgroundType"]'));
const typePanels = Array.from(document.querySelectorAll("[data-type-panel]"));
const imageUrlInput = document.getElementById("image-url");
const backgroundColorInput = document.getElementById("background-color");
const backgroundColorTextInput = document.getElementById("background-color-text");
const localFileInput = document.getElementById("local-file");
const localFileNameNode = document.getElementById("local-file-name");
const overlayOpacityInput = document.getElementById("overlay-opacity");
const overlayOpacityValueNode = document.getElementById("overlay-opacity-value");
const backgroundSizeInput = document.getElementById("background-size");
const backgroundPositionInput = document.getElementById("background-position");
const resetButton = document.getElementById("reset-button");

let currentSettings = { ...DEFAULT_SETTINGS };

function setStatus(message, isError = false) {
  statusNode.textContent = message;
  statusNode.style.color = isError ? "#a12f1f" : "";
}

function getSelectedBackgroundType() {
  const checked = typeInputs.find((input) => input.checked);
  return checked ? checked.value : DEFAULT_SETTINGS.backgroundType;
}

function normalizeColor(value) {
  return /^#([A-Fa-f0-9]{6})$/.test(value) ? value : DEFAULT_SETTINGS.backgroundColor;
}

function syncTypePanels(type) {
  typePanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.typePanel !== type);
  });
}

function collectSettingsFromForm() {
  return {
    backgroundType: getSelectedBackgroundType(),
    imageUrl: imageUrlInput.value.trim(),
    backgroundColor: normalizeColor(backgroundColorTextInput.value.trim()),
    localImageDataUrl: currentSettings.localImageDataUrl || "",
    localFileName: currentSettings.localFileName || "",
    overlayOpacity: Number(overlayOpacityInput.value),
    backgroundSize: backgroundSizeInput.value,
    backgroundPosition: backgroundPositionInput.value
  };
}

function getPreviewImage(settings) {
  if (settings.backgroundType === "url") {
    return settings.imageUrl;
  }

  if (settings.backgroundType === "local") {
    return settings.localImageDataUrl;
  }

  return "";
}

function applyPreview(settings) {
  const imageSource = getPreviewImage(settings);

  previewNode.style.backgroundColor = settings.backgroundColor;
  previewNode.style.backgroundImage = imageSource ? `url("${imageSource}")` : "none";
  previewNode.style.backgroundSize = settings.backgroundSize;
  previewNode.style.backgroundPosition = settings.backgroundPosition;
  previewNode.style.backgroundRepeat = "no-repeat";

  previewOverlayNode.style.background = `rgba(255, 255, 255, ${settings.overlayOpacity / 100})`;
  overlayOpacityValueNode.textContent = `${settings.overlayOpacity}%`;
}

function renderForm(settings) {
  typeInputs.forEach((input) => {
    input.checked = input.value === settings.backgroundType;
  });

  syncTypePanels(settings.backgroundType);
  imageUrlInput.value = settings.imageUrl;
  backgroundColorInput.value = settings.backgroundColor;
  backgroundColorTextInput.value = settings.backgroundColor;
  localFileNameNode.textContent = settings.localFileName || "No file selected.";
  overlayOpacityInput.value = String(settings.overlayOpacity);
  backgroundSizeInput.value = settings.backgroundSize;
  backgroundPositionInput.value = settings.backgroundPosition;
  applyPreview(settings);
}

function loadImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read the selected file."));
    reader.readAsDataURL(file);
  });
}

async function loadSettings() {
  const stored = await chrome.storage.local.get(DEFAULT_SETTINGS);
  currentSettings = {
    ...DEFAULT_SETTINGS,
    ...stored
  };
  renderForm(currentSettings);
}

async function saveSettings(event) {
  event.preventDefault();
  const nextSettings = collectSettingsFromForm();

  if (nextSettings.backgroundType === "url" && !nextSettings.imageUrl) {
    setStatus("Add an image URL before saving.", true);
    return;
  }

  if (nextSettings.backgroundType === "local" && !nextSettings.localImageDataUrl) {
    setStatus("Choose a local image before saving.", true);
    return;
  }

  currentSettings = nextSettings;
  await chrome.storage.local.set(currentSettings);
  applyPreview(currentSettings);
  setStatus("Settings saved. Open Google Calendar or switch back to its tab to see the update.");
}

async function resetSettings() {
  currentSettings = { ...DEFAULT_SETTINGS };
  localFileInput.value = "";
  await chrome.storage.local.set(currentSettings);
  renderForm(currentSettings);
  setStatus("Settings reset.");
}

typeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const nextSettings = {
      ...collectSettingsFromForm(),
      backgroundType: input.value
    };
    syncTypePanels(input.value);
    applyPreview(nextSettings);
  });
});

imageUrlInput.addEventListener("input", () => {
  applyPreview(collectSettingsFromForm());
});

backgroundColorInput.addEventListener("input", () => {
  backgroundColorTextInput.value = backgroundColorInput.value;
  applyPreview(collectSettingsFromForm());
});

backgroundColorTextInput.addEventListener("input", () => {
  const normalized = normalizeColor(backgroundColorTextInput.value.trim());
  backgroundColorInput.value = normalized;
  applyPreview(collectSettingsFromForm());
});

localFileInput.addEventListener("change", async () => {
  const [file] = localFileInput.files || [];

  if (!file) {
    currentSettings.localImageDataUrl = "";
    currentSettings.localFileName = "";
    localFileNameNode.textContent = "No file selected.";
    applyPreview(collectSettingsFromForm());
    return;
  }

  if (!file.type.startsWith("image/")) {
    setStatus("Select an image file.", true);
    return;
  }

  try {
    currentSettings.localImageDataUrl = await loadImageFile(file);
    currentSettings.localFileName = file.name;
    localFileNameNode.textContent = file.name;
    applyPreview(collectSettingsFromForm());
    setStatus("Local image loaded into preview.");
  } catch (error) {
    setStatus(error.message, true);
  }
});

overlayOpacityInput.addEventListener("input", () => {
  applyPreview(collectSettingsFromForm());
});

backgroundSizeInput.addEventListener("change", () => {
  applyPreview(collectSettingsFromForm());
});

backgroundPositionInput.addEventListener("change", () => {
  applyPreview(collectSettingsFromForm());
});

form.addEventListener("submit", saveSettings);
resetButton.addEventListener("click", resetSettings);

loadSettings().catch((error) => {
  setStatus(`Failed to load settings: ${error.message}`, true);
});
