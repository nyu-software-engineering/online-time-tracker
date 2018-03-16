let domains=[];

class Domain{


	constructor(url){

		this.url=url;
		this.startTime=0;
		this.endTime=0;
		this.timeElapsed=0;
	}

	updateTime(){

		this.endTime=new Date();
		this.timeElapsed=this.endTime-this.startTime;		
	}

}

let currentDomain;

chrome.tabs.onActivated.addListener((tab)=>{

	id=tab.tabId;

	return chrome.tabs.get(id,(tab)=>{

		let found=false;

		domains.forEach((domain)=>{

			if(domain.url===tab.url){

				found=true;
				domain.updateTime();
				console.log(domain.url,domain.timeElapsed);
				currentDomain=domain;

			}


		})

	if(!found){

		let site=new Domain(tab.url);
		currentDomain=site;
		console.log(site);
		site.startTime=new Date();
		domains.push(site);

	}
		
	})

})
	
currentDomain.updateTime();
console.log(curentDomain.url,currentDomain.timeElapsed);