document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.sync.get("arrayKey", function(items) {

        console.log("arrayKey", items);


    });
});