chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "gcbe:open-options") {
    return false;
  }

  chrome.runtime.openOptionsPage(() => {
    if (chrome.runtime.lastError) {
      sendResponse({
        ok: false,
        error: chrome.runtime.lastError.message
      });
      return;
    }

    sendResponse({ ok: true });
  });

  return true;
});
