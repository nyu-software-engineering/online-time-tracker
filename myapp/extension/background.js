//Arays that stores all the tracked domains
let domains = {};
let activeURL = null;
let startTime = new Date();

//Adds the delta time when active tab switches
function updateTime(url) {
    if (!domains[url]) {
        domains[url] = 0;
    }
    let deltaTime = new Date() - startTime;
    domains[url] += deltaTime / 1000;
    console.log(domains[url]);
}

//Changes the active tab and updates time of the previous active tab
function switchCurrentTab(url) {
    if (activeURL != null) {

        updateTime(activeURL);
    }
    activeURL = url;
    startTime = new Date();
}

//Triggers when the user goes to a different tab in the same window
chrome.tabs.onActivated.addListener((tab) => {
    let id = tab.tabId;

    chrome.tabs.get(id, (tab) => {
        URL = tab.url;
        switchCurrentTab(URL);
        //sends information to front end.
        chrome.storage.local.set(domains, function() {});
    })
})