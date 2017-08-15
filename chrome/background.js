
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) {

      alert(tabArray[0].url)
      chrome.tabs.create({ url: "http://twitter.com" });
    }
  )
});