
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) {
      chrome.tabs.create({ url: `localhost:8080/add-recipe?url=${tabArray[0].url}` })
    }
  )
});