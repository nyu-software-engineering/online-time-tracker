//Arays that stores all the tracked domains


console.log('bg loaded');

let bgfnc = new backgroundFunctions();


//listens for change in checkmark on popup.html
// chrome.extension.onConnect.addListener(function(port) {
//     console.log("Connected .....");

//     port.onMessage.addListener(function(msg) {

//         port.postMessage("Hi Popufdp.js");
//         if (msg === "Record") {
//             console.log(msg);
//             recording = true;
//         } else if (msg === "Don't Record") {
//             console.log(msg);
//             recording = false;

//         }
//     });
// })

// if (recording) {


//triggers when url is changed on current tab

let updatedTab;

chrome.tabs.onUpdated.addListener(

	(tabId,changeinfo,tab)=>{

        
        let URL = bgfnc.getHostName(tab.url);
		if(URL!==bgfnc.activeURL){

			window.clearInterval(updatedTab)
		}
		
		bgfnc.switchCurrentTab(URL);
		let currentTime=bgfnc.getCurrentTime(bgfnc.activeURL);
		console.log(`current time on url :${bgfnc.activeURL} is ${currentTime}`)
		bgfnc.currentTime=currentTime;
		updatedTab=window.setInterval(function(){bgfnc.updateTime(bgfnc.activeURL,bgfnc.currentTime)},2000)

    }
);

//Triggers when the user goes to a different tab in the same window
// chrome.tabs.onActivated.addListener((tab) => {


//     let id = tab.tabId;
//     console.log('hello');
//     chrome.tabs.get(id, (tab) => {
       	
//        	let URL = bgfnc.getHostName(tab.url);
//        	console.log(bgfnc.activeURL);

//        	if(URL!==bgfnc.activeURL){

//        		window.clearInterval(updatedTab);
//        	}
        
//         bgfnc.switchCurrentTab(URL)
//         console.log(bgfnc.activeURL);
//         updatedTab=window.setInterval(function(){bgfnc.updateTime(bgfnc.activeURL);},3000)
//         //sends information to front end.
        
//     })
//  })


//Triggers when the user goes to a different chrome window
// chrome.windows.onFocusChanged.addListener(

//     function(windowId) {
    	
//         if (windowId == chrome.windows.WINDOW_ID_NONE) {
        	
//         	bgfnc.stopTime(bgfnc.activeURL);
    	
//     	} 


//         else {
            
//             chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
//             let url = bgfnc.getHostName(tabs[0].url);
// 		    chrome.tabs.get(id, (tab) => {
// 	        URL = tab.url;
// 	        bgfnc.switchCurrentTab(URL);
// 	        //sends information to front end.
// 	        chrome.storage.local.set(domains, function() {});

// 		    })
// 		})

// 	}
			
// })


