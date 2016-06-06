function setGIF(gifUrl){
	console.log('running setGif')
	document.body.innerHTML += `<div id="gif_overlay"> 
									<img id="gif" src="${gifUrl}" alt="Bye GIF">
 								</div>`
};

console.log('hi there')
chrome.runtime.onMessage.addListener((message, sender, sendReponse) => { console.log(message["gifUrl"]); setGIF(message["gifUrl"]);})

