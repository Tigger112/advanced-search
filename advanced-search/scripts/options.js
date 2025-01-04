// In-page cache of the user's options
const options = {};

const optionsForm = document.getElementById("optionsForm");

// on/off event
optionsForm.hlState.addEventListener("change", (event) => {
    options.highlight.state = event.target.checked;
    chrome.storage.sync.set({ options });

});

// look for text color change
optionsForm.hlTxtColor.addEventListener("change", (event) => {
    options.highlight.textColor = event.target.value;
    chrome.storage.sync.set({ options });
});

// look for text color change
optionsForm.hlBgColor.addEventListener("change", (event) => {
    options.highlight.bgColor = event.target.value;
    chrome.storage.sync.set({ options });
});

// look for opacity change
optionsForm.hlBgOpacity.addEventListener("change", (event) => {
    options.highlight.bgOpacity = event.target.value;
    chrome.storage.sync.set({ options });
});

// on/off for search words
optionsForm.hlSearchState.addEventListener("change", (event) => {
    options.highlight.searchState = event.target.checked;
    chrome.storage.sync.set({ options });
});

optionsForm.hlWordList.addEventListener("focusout", (event) => {
    options.highlight.wordList = event.target.value;
    chrome.storage.sync.set({ options });
});

// set the range out value %
optionsForm.hlBgOpacity.addEventListener("input", (event) => {
    optionsForm.hlBgOpacity.nextElementSibling.value = event.target.value + "%"
});

// shows the refresh tab warning on change
document.getElementById("highlighter").addEventListener("change", (event) => {
    newNotification('refresh page for changes to take effect', "info");
});

optionsForm.fState.addEventListener("change", (event) => {
    options.filter.state = event.target.checked;
    chrome.storage.sync.set({ options });
});

optionsForm.fSite.addEventListener("change", (event) => {
    options.filter.site = event.target.value;
    chrome.storage.sync.set({ options });
});

optionsForm.updateUrl.addEventListener("click", () => {
    optionsForm.updateUrl.hidden = true;
    document.getElementById("updateTableDiv").hidden = false;
}, false);

// Get the options out of storage
const data = await chrome.storage.sync.get("options");
Object.assign(options, data.options);


function newNotification(text, color) {
    const notification = document.getElementById("se-notification")
    notification.style.height = 'auto';
    notification.style.opacity = 1;
    notification.textContent = text
    notification.setAttribute("class", `h4 pb-2 mb-4 text-${color} border-bottom border-${color}`)
}


function defaultOptions() {
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

}

if (!options.hasOwnProperty('highlight') || !options.hasOwnProperty('filter')) {
    defaultOptions();
};

// call default options function that just restores the options
document.getElementById("defaultO").addEventListener("click", () => {
    defaultOptions();
    newNotification("options reset to default", "info");
})


const siteList = options.filter.siteList;
const siteTable = document.getElementById("updateTable");

optionsForm.addNewSiteBtn.addEventListener("click", () => {
    addNewUrl(siteList, optionsForm.addNewSiteInp.value);
});


function addDropDownOption(url) {
    const dropDownOption = document.createElement("option");
    dropDownOption.textContent = url;
    dropDownOption.value = url;
    optionsForm.fSite.insertBefore(dropDownOption, optionsForm.fSite.firstChild)
};


function addNewUrl(urls, newUrl) {
    urls.push(newUrl);
    options.filter.siteList = urls;
    addRow(newUrl, siteTable);
    chrome.storage.sync.set({ options });
};

function addRow(url, table) {
    addDropDownOption(url);

    const tableLayout = {
        row: document.createElement("tr"),
        col: {
            url: document.createElement("td"),
            update: document.createElement("td")
        }
    };

    // button in the table
    const removeBtn = document.createElement("button");
    removeBtn.setAttribute("class", "btn btn-danger");
    removeBtn.setAttribute("type", "button");
    removeBtn.textContent = "remove"
    removeBtn.textContent = "remove"

    removeBtn.addEventListener("click", (e) => {
        // row the button is in
        const btnParent = e.target.parentElement.parentElement;
        // index of the site in the list
        const removedIndex = siteList.indexOf(btnParent.firstChild.textContent.toString());
        if (removedIndex > -1) {
            options.filter.siteList.splice(removedIndex, 1)
            // remove the html
            btnParent.remove()
            // set the new list with the site removed
            chrome.storage.sync.set({ options });
        }
    })

    tableLayout.col.url.textContent = url;
    tableLayout.col.update.appendChild(removeBtn);

    tableLayout.row.appendChild(tableLayout.col.url);
    tableLayout.row.appendChild(tableLayout.col.update);

    table.insertBefore(tableLayout.row, table.children[1]);
};

for (let site of siteList) {
    addRow(site, siteTable)
}

// Set the saved values from chrome storage
optionsForm.hlState.checked = Boolean(options.highlight.state);
optionsForm.hlTxtColor.value = options.highlight.textColor;
optionsForm.hlBgColor.value = options.highlight.bgColor;
optionsForm.hlBgOpacity.value = options.highlight.bgOpacity;
optionsForm.hlBgOpacity.nextElementSibling.value = options.highlight.bgOpacity + "%";
optionsForm.hlSearchState.checked = options.highlight.searchState;
optionsForm.hlWordList.value = options.highlight.wordList;

optionsForm.fState.checked = Boolean(options.filter.state);
optionsForm.fSite.value = options.filter.site;

// tab buttons
const tabBtn = document.getElementsByClassName("nav-link");
let activeBtn = document.getElementById("hl-nav-btn");
for (let btn of tabBtn) {
    btn.addEventListener("click", () => {
        btn.setAttribute("class", "nav-link active");
        if (activeBtn !== btn) {
            activeBtn.setAttribute("class", "nav-link");
            activeBtn = btn;
        }
    });
}
