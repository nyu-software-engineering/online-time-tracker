let bgpage = chrome.extension.getBackgroundPage();

function show(section){
    document.getElementById(section).style.display = "block";
}


function hide(section)
{
    document.getElementById(section).style.display = "none";
}

function disable(button){

		 document.getElementById(button).disabled = true;
}

function enable(button){

		 document.getElementById(button).disabled = false;
}

function load(){	
	console.log('hi from load');

    // if timer is paused, show resume button and hide pause button

    chrome.storage.sync.get(['pauseDate'],function(result){

    	bgpage.pauseDate=result.pauseDate;

    	console.log(bgpage.pauseDate);
    })
    	if(bgpage.pauseDate){
        	enable('resume');
        	disable("pause");
        	show('options');
        	hide('setTimer');
        	show('display');
    	}
    	else{

    		enable("pause");

    	}
    
  
   
    
   // if timer is off, show settings
   chrome.storage.sync.get(['alarmDate'],function(result){

   		bgpage.alarmDate=result.alarmDate;
   		console.log(bgpage.alarmDate);
   	 })

   		if(!bgpage.alarmDate){	
   			
			show("setTimer");
      		hide("display");
      		disable('pause')
			disable('cancel');
			disable('restart');
			disable('resume');
		}
		else{		
				
			show("options");
			hide('setTimer');
			show("display");
			enable('pause');
	        refreshDisplay();
				
		}
}



function setTimer(event)
{
	if(event!==undefined){
		event.preventDefault();
	}
	
    console.log('setTimer');
	let time= document.querySelector('#Time').value;
	
	// set timer, hide setTimer, display reset button
	if(isValid(time))
	{
		bgpage.setAlarm(time * 60000);
		hide("setTimer");
		show('display');
		disable("resume");
      	enable("pause");
      	enable('cancel');
      	enable('restart');
      	show('options');
		refreshDisplay();
	}
	else
		error();
}

// Returns true if 0 <= amt <= 240
function isValid(time)
{
	if(isNaN(time) || (time == null))
		return false;
	else if((time < 0) || (time > 240))
		return false;
	else
		return true;
}

function refreshDisplay()
{
 
	refreshDisplayTimeout = window.setInterval(function(){updateTimer();}, 100);
}

function updateTimer(){


	document.getElementById("timeLeft").textContent = bgpage.getTimeLeftString();
}

function pauseTimer()
{
    disable('pause');
    enable("resume");
    bgpage.pause();
    clearTimeout(refreshDisplayTimeout);
}

function resumeTimer()
{
    disable("resume");
    enable("pause");
    bgpage.resume();
    refreshDisplay();
}

function restartTimer()
{
    disable("resume");
    enable("pause");
    refreshDisplay();
    bgpage.restart();
    
}

function reset()
{
	clearTimeout(refreshDisplayTimeout);
	bgpage.turnOff();
	hide("display");
	show("setTimer");
	hide("options");
	document.getElementById("timeLeft").textContent="";
}


document.addEventListener('DOMContentLoaded', function () {
    load();
    console.log('timer is active');
    document.querySelector('#start').addEventListener('click', setTimer);
    document.querySelector('#cancel').addEventListener('click', reset);
    document.querySelector('#pause').addEventListener('click', pauseTimer);
    document.querySelector('#resume').addEventListener('click', resumeTimer);
    document.querySelector('#restart').addEventListener('click', restartTimer);
});