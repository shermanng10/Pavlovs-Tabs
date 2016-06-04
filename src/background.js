function checkTabs(){
	chrome.tabs.query({currentWindow: true}, tabs => {
		let tab_count = tabs.length;
		let tab_ids = [];
		if (tab_count > 30) {
			for (let x = 0; x < tab_count/2; x++){
				tab_ids.push(tabs[x].id)
			}
			chrome.tabs.remove(tab_ids)
		}
	});
}

chrome.tabs.onCreated.addListener(() => {
	checkTabs()
});
