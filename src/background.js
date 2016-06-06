function checkTabs(newTab){
	chrome.tabs.query({currentWindow: true}, tabs => {
		let tabCount = tabs.length;
		let tabIds = [];
		if (tabCount > 30) {
			for (let x = 0; x < tabCount/2; x++){
				tabIds.push(tabs[x].id)
			}
			getGIF(newTab)
			chrome.tabs.remove(tabIds)
		}
	});
}

function getGIF(newTab){
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.giphy.com/v1/gifs/search?q=bye&api_key=dc6zaTOxFJmzC");
	xhr.send();
	xhr.onreadystatechange = function(){
		if(xhr.readyState===4 && xhr.status===200){
			let response = JSON.parse(xhr.response)
			let data = response["data"]
			let randomGifUrl = data[Math.floor(Math.random()*data.length)]["images"]["downsized_large"]["url"]
			console.log(newTab.id)
			chrome.tabs.sendMessage(newTab.id, {gifUrl: randomGifUrl})
		}
	}
}

chrome.tabs.onCreated.addListener((newTab) => {
	checkTabs(newTab)
});
