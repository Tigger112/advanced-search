chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    // with and with out site: operator regex
    const urlWithOutOperator = /google.com\/search\?q=/g;
    const urlWithOperator = /google.com\/search\?q=site%3A/g;

    if (urlWithOutOperator.test(details.url) && !urlWithOperator.test(details.url)) {
        (async () => {
            const data = await chrome.storage.sync.get("options");
            // safety checks
            if (data.options.filter.state && data.options.filter.siteList.includes(data.options.filter.site)) {
                const currentUrl = new URL(details.url);

                const newUrl = currentUrl.origin + '/search?q=site%3A' + data.options.filter.site + "+" + currentUrl.search.slice(3);

                chrome.tabs.update(details.tabId, { url: newUrl })
                console.log("did work");
                console.log(newUrl);
            };
        })();
    };
})

// reloads the page
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "reload") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                const currentTabId = tabs[0].id;
                chrome.tabs.reload(currentTabId);
            }
        });
    };
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        // c&p from options.js
        const options = {};
        options.highlight = {
            // DeFault settings
            state: true, // turn on/off
            textColor: '#000000', // text color
            bgColor: '#a7e0f6', // background color
            bgOpacity: 100, // background opacity
            wordList: '', // text felid words
            searchState: true // google search box text on/off
        };

        options.filter = {
            // DeFault settings
            state: false, // turn on/off
            siteList: ["amazon.com","facebook.com", "wikipedia.com", "reddit.com",  "youtube.com"],
            site: "youtube.com"
        };

        chrome.storage.sync.set({ options })
    };
});
