
// Followed the template method, has all the logic of the timer which will be abstracted in the UI

/*Also implemented the parseTime function here which saved me from writing a lot of extracode over and over again,

while also making code more readable*/

let timeout;
let interval;

let setDate;
let pauseDate;
let alarmDate;

console.log('hi from timerfunctions');

console.log('timer functions');

function setAlarm(timeMilli)
{
	timeMilli=parseInt(timeMilli,10);
	interval = timeMilli;
	timeLeft(timeMilli);
}

function timeLeft(timeMilli){
	clearTimeout(timeout);
	pauseDate = null;

// implement parseTime as a demonstration of the template method
	let time=parseTime(timeMilli);
	alarmDate = new Date();
	chrome.storage.sync.set({alarmDate: alarmDate}, function(){

		console.log("the time is:",alarmDate)
	})
	// alarmDate.setTime(alarmDate.getTime() + millis);
	alarmDate.setHours(alarmDate.getHours() + time['hours']);
	alarmDate.setMinutes(alarmDate.getMinutes() + time['minutes']);
	alarmDate.setSeconds(alarmDate.getSeconds() + time['seconds']);
	alarmDate.setMilliseconds(alarmDate.getMilliseconds() + time['milliseconds']);
	setDate = new Date();
	timeout = setTimeout(ring, alarmDate - setDate);
	console.log(alarmDate);

	
}


function resume(){
    
    let remainingAfterPause = (alarmDate - pauseDate);
    timeLeft(remainingAfterPause);
}

function pause(){
    
    pauseDate = new Date();
    chrome.storage.sync.set({pauseDate: pauseDate}, function(){

    	console.log('saved', pauseDate);
		
	})

	console.log(pauseDate);
	clearTimeout(timeout);
    
}


function restart(){
    
    timeLeft(interval);
}

function getTimeLeft()
{
    if (pauseDate){
        return (alarmDate - pauseDate);
    }
    else{
    	 
    	let timeNow = new Date();
    	return (alarmDate - timeNow);
    }
   
}

function getTimeLeftString()
{
	console.log(alarmDate)
	//can apply parse time here;
    let timeLeft = getTimeLeft();
	let time=parseTime(timeLeft);

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
    turnOff();
}

function turnOff()
{
	clearTimeout(timeout);
	interval = null;
	alarmDate = null;
   	pauseDate = null;
   	setDate = null;
   	chrome.storage.sync.clear();
   
}

function error()
{
	alert("wrong Input. Give a reasonable time");
}
