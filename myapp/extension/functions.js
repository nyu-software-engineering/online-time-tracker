function parseurl(url){

//regex taken from stackoverflow
	let match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }

}

function getHostName(url){

	let hostName=parseurl(url);


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

function parseTime(milliseconds){

	let time={};
	let rawSeconds=milliseconds/1000;

	let hours=Math.floor(rawSeconds/3600);

	time['hours']=hours;
	rawSeconds=rawSeconds-3600*hours;

	let minutes=Math.floor(rawSeconds/60);
	time['minutes']=minutes


	let seconds=rawSeconds-60*minutes;
	time['seconds']=Math.floor(seconds)

	return time;



}

module.exports={

	getHostName: getHostName,
	parseTime: parseTime


}