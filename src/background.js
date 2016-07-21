(function(){
  let newTabId
  let shouldFire = true

  function addGifToDOM(url){
    chrome.tabs.insertCSS(newTabId, {file: 'css/main.css', runAt: "document_end"}, () => {
      chrome.tabs.executeScript(newTabId, {
        code: "document.body.innerHTML += \"<div id='gif_overlay'> <div id='gif_header'> Say bye to your tabs!</div> <img id='gif' src= '"+url+"' alt='Bye GIF'> </div>\"",
        runAt: "document_end"
      }, () => { shouldFire = true })
    })
  }

  function getGIF(){
    let xhr = new XMLHttpRequest()
    xhr.open("GET", "https://api.giphy.com/v1/gifs/search?q=bye&api_key=dc6zaTOxFJmzC")
    xhr.send()
    xhr.onreadystatechange = () => {
      if(xhr.readyState===4 && xhr.status===200){
        let response = JSON.parse(xhr.response)
        let data = response["data"]
        let randomGifUrl = data[Math.floor(Math.random()*data.length)]["images"]["downsized_large"]["url"]
        addGifToDOM(randomGifUrl)
        }
    }
  }

  function createGifWindow(){
    chrome.windows.create({}, window => {
      newTabId = window.tabs[0].id
      getGIF()
    })
  }

  function removeTabs(tabIds){
    chrome.tabs.remove(tabIds)
    if (shouldFire){
      shouldFire = false
      createGifWindow()
    }
  }

  function checkTabs(){
    chrome.tabs.query({currentWindow: true}, tabs => {
      let tabCount = tabs.length
      let tabIds = []
      if (tabCount > 15) {
        for (let x = 0; x < tabCount/2; x++){
          tabIds.push(tabs[x].id)
        }
        removeTabs(tabIds)
      }
    })
  }

  chrome.tabs.onCreated.addListener(() => {
    checkTabs()
  })
})()