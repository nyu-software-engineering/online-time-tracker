
//Arays that stores all the tracked domains
let domains=[];

// The current active domain
let currentDomain={};



class Domain{


	constructor(url){

		this.url=url;
		this.startTime=0;
		this.endTime;
		this.timeElapsed=0;
	}

	updateTime(){
		
		this.startTime=this.endTime===undefined? new Date(): this.endTime;
		this.endTime=new Date();
		let timeintervals=this.endTime-this.startTime;
		this.timeElapsed+=timeintervals;
		console.log(this.url,this.timeElapsed);
		
		}

	}

let URL;

//The indicator of setinterval(), used to stop the timer when the active tab is changed
let current;

// look up chrome.tabs documentation. Part of chrome extensions API
chrome.tabs.onActivated.addListener((tab)=>{

	//checks if desired domain is already stored in the domain array
	let found=false;
	
	//every tab has a unique id for each browser session. look up extension API
	let id=tab.tabId;
	

	// If no existing domain we create a new one other wise update the time spent on current domain
	
	chrome.tabs.get(id,(tab)=>{
		
		URL=tab.url;
		
		for(domain of domains){
			if(domain.url===URL){
				found=true;
				currentDomain=domain;
				break;

			}

		}


	if(found){

	//stops current timer
		window.clearInterval(current);

		if(currentDomain.timeElapsed!==0){

				currentDomain.endTime=new Date()
			}

	//restarts timer with new active tab	
		current=window.setInterval(function(){currentDomain.updateTime();},1000)
		
	}

	
	if(!found){

		window.clearInterval(current);
		let site= new Domain(URL);
		domains.push(site);
		currentDomain=site;
		current=window.setInterval(function(){currentDomain.updateTime();},1000)
		

	}

	})

		
})	

