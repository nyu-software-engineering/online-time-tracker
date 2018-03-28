//Adds the delta time when active tab switches

console.log("foo loaded");

class BackgroundFunctions{ 

    constructor(){  // setup a constructor to hold defaults

        this.domains = {};
        this.activeURL = null;
        this.startTime;
        this.currentTime;

    }


    switchCurrentTab(url){

        if(url!==this.activeURL){
            this.activeURL = url;
            console.log('switched url to:' +url);
        }

        this.startTime=new Date();
    }

    getCurrentTime(url){

         if (this.domains[url]===undefined) {
                this.domains[url] = {}
                this.domains[url]['time']=0;        
            }

            return this.domains[url]['time'];
       
    }

    stopTime(url){

        if (url!== null) {
            
            window.clearInterval(this.activeURL)
        }
        this.activeURL = null;

    }
    updateTime(url){
       
        let deltaTime = new Date() - this.startTime;
        deltaTime=deltaTime/1000
        console.log(`${url}s currentTime is ${this.currentTime}`);
        this.domains[url]['time'] = this.currentTime + deltaTime;

    //  chrome.storage.local.set({url: this.domains[url] }, function() {});
        console.log(this.activeURL,this.domains[url]['time']);
    
    }

    recordTime(url){
        this.activeURL = url;
        this.startTime = new Date();
    }

    getHostName(url){
        let hostName = this.parseUrl(url);
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

    parseUrl(url){
        //regex taken from stackoverflow
        let match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
            return match[2];
        } else {
            return null;
        }
    }

    parseTime (milliseconds) {

        let time = {};
        let rawSeconds = milliseconds / 1000;

        let hours = Math.floor(rawSeconds / 3600);

        time['hours'] = hours;
        rawSeconds = rawSeconds - 3600 * hours;

        let minutes = Math.floor(rawSeconds / 60);
        time['minutes'] = minutes


        let seconds = rawSeconds - 60 * minutes;
        time['seconds'] = Math.floor(seconds)

        return time;

    }

}

