//Arays that stores all the tracked domains
let domains = [];


let activeURL = null;
let startTime = new Date();


function updateTime(url) {
    if (!domains[url]) {
        domains[url] = 0;
    }
    let deltaTime = new Date() - startTime;
    // console.log(url);
    // console.log(domains[url]);
    domains[url] += deltaTime / 1000;
}

function switchCurrentTab(url) {
    if (activeURL != null) {
        
        updateTime(activeURL);
    }
    activeURL = url;
    startTime = new Date();
}


//The indicator of setinterval(), used to stop the timer when the active tab is changed
let current;
// look up chrome.tabs documentation. Part of chrome extensions API
chrome.tabs.onActivated.addListener((tab) => {

    //every tab has a unique id for each browser session. look up extension API
    let id = tab.tabId;

    // If no existing domain we create a new one other wise update the time spent on current domain
    chrome.tabs.get(id, (tab) => {

            URL = tab.url;
            console.log(URL);
            switchCurrentTab(URL);

            // let domainsObj = {};
            // domainsObj["arrayKey"] = domains;

            // console.log(domainsObj);
            var newArray = JSON.parse(JSON.stringify(domains));
            console.log(domains);
            chrome.storage.sync.set({"arrayKey": domains }
                ,
                function() {
                    console.log('Settings saved');
                });

    })


})