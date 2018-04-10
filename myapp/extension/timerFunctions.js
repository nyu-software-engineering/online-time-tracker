
// Followed the template method, has all the logic of the timer which will be abstracted in the UI

/*Also implemented the parseTime function here which saved me from writing a lot of extracode over and over again,

while also making code more readable*/

let timeout;
let interval;

let setDate;
let pauseDate;
let alarmDate;

function setAlarm(timeMilli)
{
	timeMilli=parseInt(timeMilli,10);
	interval = timeMilli;
	timeBeforeRinging(timeMilli);
}

function timeBeforeRinging(timeMilli){
	clearTimeout(timeout);
	pauseDate = null;

// implement parseTime as a demonstration of the template method
	let time=parseTime(timeMilli);

	alarmDate = new Date();
	// alarmDate.setTime(alarmDate.getTime() + millis);
	alarmDate.setHours(alarmDate.getHours() + time['hours']);
	alarmDate.setMinutes(alarmDate.getMinutes() + time['minutes']);
	alarmDate.setSeconds(alarmDate.getSeconds() + time['seconds']);
	alarmDate.setMilliseconds(alarmDate.getMilliseconds() + time['milliseconds']);
	setDate = new Date();
	timeout = setTimeout(ring, alarmDate - setDate);

}


function resume(){
    
    let remainingAfterPause = (alarmDate - pauseDate);
    timeBeforeRinging(remainingAfterPause);
}

function pause(){
    
    pauseDate = new Date();
    clearTimeout(timeout);
}


function restart(){
    
    timeBeforeRinging(interval);
}

function getTimeLeft()
{
    if (pauseDate){
        return (alarmDate - pauseDate);
    }
    else{
    	 
    	let timeNow = new Date();
    	return (alarmDate - now);
    }
   
}

function getTimeLeftString()
{

	//can apply parse time here;
    let timeLeft = getTimeLeft();
	time=parseTime(timeLeft);

	let secs=time['seconds'];
	let mins=time['minutes']
	let hours=time['hours'] 

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

function ring(){
   
    alert('Hello! Are you sure u still wanna stay on the internet')
}

function turnOff()
{
	clearTimeout(timeout);
	interval = 0;
	alarmDate = null;
   	pauseDate = null;
   	setDate = null;
}

function error()
{
	alert("wrong Input. Give a reasonable time");
}
