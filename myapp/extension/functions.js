//Adds the delta time when active tab switches

console.log("foo loaded");

let domains = {};
let activeURL = null;
let startTime; //startstimer
let currentTime; //time already spent on active url

function switchCurrentTab(url) {

        if (url !== activeURL) {
            activeURL = url;
        }

        startTime = new Date();
    }

function getCurrentTime(url) {

        if (domains[url] === undefined) {
            domains[url] = {}
            domains[url]['time'] = 0;
        }

        return domains[url]['time'];

    }

function stopTime(url) {

        if (url !== null) {

            window.clearInterval(activeURL)
        }
        activeURL = null;

    }
function updateTime(url) {

        if (url !== undefined && url!=="newtab") {

            let deltaTime = new Date() - startTime;
            deltaTime = deltaTime / 1000
            // console.log(`${url}s currentTime is ${currentTime}`);
            let updatedTime =  currentTime + deltaTime;
            domains[url]['time'] = updatedTime;
            //set domain and time to chrome storage local
            chrome.storage.local.set({ domains: domains }, function() {

            });
            console.log(activeURL,domains[url]['time']);
        }


    }

function recordTime(url) {
        activeURL = url;
        startTime = new Date();
    }

function getHostName(url) {
        let hostName = parseUrl(url);
        if (hostName != null) {
            let parts = hostName.split('.').reverse();

            if (parts != null && parts.length > 1) {
                hostName = parts[1]

                // if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2) {
                // hostName = parts[2]
                // }
            }
        }
        return hostName;
    }

function parseUrl(url) {
        //regex taken from stackoverflow
        let match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
            return match[2];
        } else {
            return null;
        }
    }

function  parseTime(milliseconds) {

        let time = {};
        let rawSeconds = milliseconds / 1000;

        milliseconds = milliseconds % 1000

        let hours = Math.floor(rawSeconds / 3600);

        time['hours'] = hours;
        rawSeconds = rawSeconds - 3600 * hours;

        let minutes = Math.floor(rawSeconds / 60);
        time['minutes'] = minutes


        let seconds = rawSeconds - 60 * minutes;
        time['seconds'] = Math.floor(seconds);

        time['milliseconds'] = milliseconds;

        return time;


    }

function formatTime(time){
    
            var time=parseTime(time);
            var secs=time['seconds'];
            var mins=time['minutes']
            var hours=time['hours'] 

            if( secs< 10){
                secs = "0" + secs;
            }
            if(mins< 10) {
                mins = "0" + mins
            };
            if(hours< 10){
                hours = "0" + hours;
            } 
            return ((hours > 0 ? hours + ":" : "") + mins + ":" + secs);
    }

function clear(){

    domains = {};
}