let newTabId;

function checkTabs(){
	chrome.tabs.query({currentWindow: true}, tabs => {
		let tabCount = tabs.length;
		let tabIds = [];
		if (tabCount > 15) {
			for (let x = 0; x < tabCount/2; x++){
				tabIds.push(tabs[x].id)
			}
			removeTabs(tabIds)
		}
	});
}

function createGifTab(){
	chrome.tabs.create({}, function(tab) {
		newTabId = tab.id;
		getGIF()
	})
}

function addGifToDOM(url){
	chrome.tabs.insertCSS(newTabId, {file: 'css/main.css', runAt: "document_end"}, function(){
		chrome.tabs.executeScript(newTabId, {
			code: "document.body.innerHTML += \"<div id='gif_overlay'> <img id='gif' src= '"+url+"' alt='Bye GIF'> </div>\"",
			runAt: "document_end"
		})
	})
}

function removeTabs(tabIds){
	chrome.tabs.remove(tabIds)
	createGifTab()
}

function getGIF(){
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.giphy.com/v1/gifs/search?q=bye&api_key=dc6zaTOxFJmzC");
	xhr.send();
	xhr.onreadystatechange = () => {
		if(xhr.readyState===4 && xhr.status===200){
			let response = JSON.parse(xhr.response);
			let data = response["data"]
			let randomGifUrl = data[Math.floor(Math.random()*data.length)]["images"]["downsized_large"]["url"]
			addGifToDOM(randomGifUrl)
    	}
	}
}

chrome.tabs.onCreated.addListener(() => {
	checkTabs()
});

