async function filter(){
    async function runFilter(data) {
        // the search box id on google is (APjFqb)
        let searchInput = document.querySelector('#APjFqb') || document.querySelector('#REsRA');
        if (searchInput.textContent) {
            let text = searchInput.textContent;
            console.log(text);
            // remove site: from the search text
            searchInput.textContent = text.replaceAll(/site:.*? /g, "");
        } else if (searchInput) {
            let text = searchInput.getAttribute("value");
            searchInput.setAttribute("value", text.replaceAll(/site:.*? /g, ""));
        };
    }
    

    const filterData = {}
    // fetches data from chrome api for user options
    await chrome.storage.sync.get("options").then((options) => {
        Object.assign(filterData, options.options.filter)
    })

    if (filterData.state) {
        runFilter(filterData);
    }

};
filter();


