
//Arays that stores all the tracked domains
let domains=[];

// The current active doamin
let currentDomain;



class Domain{


	constructor(url){

		this.url=url;
		this.startTime=0;
		this.endTime;
		this.timeElapsed=0;
	}

	updateTime(){
		
		// The conditional resets the timer whenever we switch back to a tab that was previously active
		if(this.timeElapsed!==0){

			this.endTime=undefined;
			console.log(this.endTime);
		}
		
		//looke up documentation. basically calls a function over and over again after a set time interval.
		window.setInterval(()=>{

				this.startTime=this.endTime===undefined?new Date(): this.endTime;
				this.endTime=new Date();
				let timeintervals=this.endTime-this.startTime;
				this.timeElapsed+=timeintervals;

			},1000);
			
		}

	}


// look up chrome.tabs documentation. Part of chrome extensions API
chrome.tabs.onActivated.addListener((tab)=>{

	id=tab.tabId;
	let found=false; //checks if desired domain is already stored in the domain array

	// If no existing domain we create a new one other wise update the time spent on current domain
	
	chrome.tabs.get(id,(tab)=>{

		domains.forEach((domain)=>{

			if(domain.url===tab.url){

				found=true;
				currentDomain=domain;

			}


		})

	
	if(found){

		currentDomain.updateTime();
		
		window.setInterval(function(){
					
				console.log(currentDomain.url,currentDomain.timeElapsed);
			
			},1000)

	}

	
	else{

		let site=new Domain(tab.url);
		currentDomain=site;
		console.log(site);
		domains.push(site);
		currentDomain.updateTime();
		window.setInterval(function(){
					
				console.log(currentDomain.url,currentDomain.timeElapsed);
			
			},1000)

	}
		
	})

})
	
