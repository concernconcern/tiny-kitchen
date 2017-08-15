
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabArray) {
      var success =
        function (data) {
          chrome.tabs.create({ url: "http://localhost:8080/add-recipe" })
        }
      $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/recipe-sources",
        data: { url: tabArray[0].url },
        success: success,
        dataType: "json"
      });
    }
  )
});