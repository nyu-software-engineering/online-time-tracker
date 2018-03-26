//Adds the delta time when active tab switches

console.log("foo loaded");


let domains ;
let activeURL;
let startTime ;

var backgroundFunctions = function() { // setup a constructor to hold defaults

    this.domains = {};
    this.activeURL = null;
    this.startTime =new Date();
}




backgroundFunctions.prototype.switchCurrentTab = function(url) {
    
    if (this.activeURL != null) {
        this.updateTime(this.activeURL);
    }
    this.activeURL = url;
    this.startTime = new Date();


}

backgroundFunctions.prototype.stopTime = function(url) {

    if (url != null) {
        this.updateTime(this.activeURL);
    }
    this.activeURL = null;
    this.startTime = new Date();

}
backgroundFunctions.prototype.updateTime = function(url) {

    if (!this.domains[url]) {
        this.domains[url] = 0;
    }
    let deltaTime = new Date() - this.startTime;
    this.domains[url] += deltaTime / 1000;
    // console.log(url);
    // console.log(this.domains[url]);
}
backgroundFunctions.prototype.recordTime = function(url) {
    this.activeURL = url;
    startTime = new Date();
}

backgroundFunctions.prototype.getHostName = function(url) {
    let hostName = this.parseurl(url);
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

backgroundFunctions.prototype.parseurl = function(url) {
    //regex taken from stackoverflow
    let match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    } else {
        return null;
    }
}

backgroundFunctions.prototype.parseTime = function(milliseconds) {

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

console.log('helloWorld');




module.exports = {

    backgroundFunctions: backgroundFunctions;

}

export {backgroundFunctions};