chrome.browserAction.onClicked.addListener(openMainPage);

function openMainPage() {
	var mainPageUrl = chrome.extension.getURL("a.html");
	chrome.tabs.create({"url": mainPageUrl});
}
