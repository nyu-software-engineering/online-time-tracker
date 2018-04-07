let timeout;
let interval;

let setDate;
let pauseDate;
let alarmDate;

function setAlarm(tMillis)
{
	interval = tMillis;
	ringIn(tMillis + guiLagAdjustment);
}

function ringIn(tMillis)
{
	clearTimeout(timeout);
	pauseDate = null;

	let tSecs = parseInt(tMillis / 1000);
	let tMins = parseInt(tSecs / 60);
	let secs = tSecs % 60;
	let tHrs = parseInt(tMins / 60);
	let mins = tMins % 60;
	let millis = tMillis % 1000;

	alarmDate = new Date();
	// alarmDate.setTime(alarmDate.getTime() + millis);
	alarmDate.setHours(alarmDate.getHours() + tHrs);
	alarmDate.setMinutes(alarmDate.getMinutes() + mins);
	alarmDate.setSeconds(alarmDate.getSeconds() + secs);
	alarmDate.setMilliseconds(alarmDate.getMilliseconds() + millis);

	setDate = new Date();
	timeout = setTimeout(ring, alarmDate.getTime() - setDate.getTime());

	chrome.browserAction.setBadgeBackgroundColor({color:greenColor});
	setInterval(function() {
		chrome.browserAction.setBadgeText({text: getTimeLeftString()});
	}, 1000);
}

function pause()
{
    pauseDate = new Date();
    clearTimeout(timeout);
}

function resume()
{
    let remainingAfterPause = (alarmDate.getTime() - pauseDate.getTime());
    ringIn(remainingAfterPause);
}

function restart()
{
    ringIn(interval + guiLagAdjustment);
}

function getTimeLeft()
{
    if (pauseDate)
        return (alarmDate.getTime() - pauseDate.getTime());

    let now = new Date();
    return (alarmDate.getTime() - now.getTime());
}

function getTimeLeftPercent()
{
    return parseInt(getTimeLeft() / interval * 100);
}

function getTimeLeftString()
{
   let until = getTimeLeft();
	let tSecs = parseInt(until / 1000);
	let tMins = parseInt(tSecs / 60);
	let secs = tSecs % 60;
	let tHrs = parseInt(tMins / 60);
	let mins = tMins % 60;
	if(secs < 10) secs = "0" + secs;
	if(mins < 10) mins = "0" + mins;
	if(tHrs < 10) tHrs = "0" + tHrs;
	return ((tHrs > 0 ? tHrs + ":" : "") + mins + ":" + secs);
}

function didCreateNotification(notificationId) {}

function ring()
{
   let options = {
      type: "basic",
      title: "Timer",
      message: "Time\'s up!",
      iconUrl: "img/48.png",
      priority: 2
   }
   chrome.notifications.create("", options, didCreateNotification);
	turnOff();
}

function turnOff()
{
	clearTimeout(timeout);
	interval = 0;
	alarmDate = null;
   	pauseDate = null;
   	setDate = null;
	chrome.browserAction.setBadgeText({text: ""});
}

function error()
{
	alert("Please enter a number between 1 and 240.");
}
