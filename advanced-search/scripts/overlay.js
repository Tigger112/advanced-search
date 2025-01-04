async function app() {
    // google nav bar
    const nav = document.querySelector(".Q3DXx") || document.querySelector(".dAEiw.dXdtIf");
    const buttonContainer = document.createElement("div");

    class Tag {
        constructor(tagName, styleClass, id, text, children) {
            this.tagName = document.createElement(tagName);
            this.styleClass = styleClass;
            this.children = children;
            this.text = text;
            this.id = id;
        }

        
        element() {
            this.tagName.className = this.styleClass;

            if (this.children) {
                for (let child of this.children) {
                    this.tagName.appendChild(child);
                };
            };

            if (this.text) {
                this.tagName.textContent = this.text;
            };

            if (this.id) {
                this.tagName.id = this.id;
            }

            return this.tagName;
        }
    }

    const buttonNames = ["highlighter", "filter"]

    for (let num = 0; num < buttonNames.length; num++) {
        // text inside this button
        const buttonTextEl = new Tag("p", "button-text", null, buttonNames[num]);
        // on off text, empty
        const stateTag = new Tag("p", "state-text");
        // state container
        const displayState = new Tag("div", "display-state", `es-${buttonNames[num]}-state`, null, [stateTag.element()]);

        const button = new Tag("div", "button", `es-${buttonNames[num]}`, null, [buttonTextEl.element(), displayState.element()]);

        buttonContainer.appendChild(button.element());
    };

    const options = {};
    await chrome.storage.sync.get("options").then((data) => {
        Object.assign(options, data.options)
    })
    // on off p tags
    const highlighterStateText = buttonContainer.children[0].children[1].children[0];
    const filterStateText = buttonContainer.children[1].children[1].children[0];

    // control if the button style is on or off
    function setState(data, elTxt, elContainer) {
        if (data) {
            elTxt.textContent = 'ON';
            elContainer.classList.add('on');
            elContainer.classList.remove('off')
        } else {
            elTxt.textContent = 'OFF'
            elContainer.classList.add('off');
            elContainer.classList.remove('on')
        };
    };

    const highlightButton = buttonContainer.children[0];
    const filterButton = buttonContainer.children[1];

    setState(options.highlight.state, highlighterStateText, highlightButton);
    setState(options.filter.state, filterStateText, filterButton);
    
    buttonContainer.id = 'button-container';
    nav.insertBefore(buttonContainer, nav.children[1]);

    // on / off buttons reloads the page
    highlightButton.addEventListener("click", async () => {
        await chrome.storage.sync.get("options").then((data) => {
            Object.assign(options, data.options)
        })

        setState(!(options.highlight.state), highlighterStateText, highlightButton)
        options.highlight.state = !(options.highlight.state)
        chrome.storage.sync.set({ options });
        chrome.runtime.sendMessage({ action: "reload" });
    })
    
    filterButton.addEventListener("click", async() => {
        await chrome.storage.sync.get("options").then((data) => {
            Object.assign(options, data.options)
        })
        
        setState(!(options.filter.state), filterStateText, filterButton)
        options.filter.state = !(options.filter.state)
        chrome.storage.sync.set({ options });
        // search button on google
        document.querySelector('button[jsname="Tg7LZd"]').click();
    })
};
app()