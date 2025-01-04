async function highlighter() {
    const highlightData = {}
    // fetches data from chrome api for user options
    await chrome.storage.sync.get("options").then((options) => {
        Object.assign(highlightData, options.options.highlight)
    })
    
    
    function highlight() {
        function getKeywords(data) {
            const currentUrl = new URL(window.location.href);
            const queryParams = currentUrl.searchParams.get("q");
            let keywords = queryParams.split(" ")

            if (data.searchState && Boolean(data.wordList)) {
                data.wordList
                .split(" ")
                .map((word) => {
                    keywords.push(word)
                })
                return keywords;
                
            } else if (Boolean(data.wordList)){
                keywords = data.wordList.split(" ");
                return keywords;
                
            } else if (data.searchState) {
                return keywords;
            };
            
            // return '' so i can read the len as 0
            return '';
        };


        function getRegexKeywords(keywords) {
            let regText = '';
            // str construction 
            for (let num = 0; num < keywords.length; num++) {
                // if not word go to next word
                const word = new RegExp("[^\\W]", "g");
                if (word.test(keywords[num])) {
                    let newText = `${keywords[num]}|`;
                    regText = regText.concat(newText);
                }
        
            };
            if (regText.length > 0){
                regText = regText.slice(0, (regText.length -1));
            // regex to find all of the words in the el's "i hate regex"
                const re = new RegExp(`(?<!<\/?[^>]*|&[^;]*)\\b(${regText})\\b`, "gi");

                return re;

            };
            return null;
        };    


        function markWords(container, regex){
            const nodes = Array.from(container.childNodes);
            // tags to not look at
            const disableTags = ["STYLE", "SCRIPT", "MARK", "INPUT", "TEXTAREA"];
            nodes.forEach(node => {
            // long if that checks if the node is a text node and if its node contains text and it is parent is not a disable tag type  
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0 && !disableTags.includes(node.parentNode.nodeName)) {
                regex.lastIndex = 0;

                if (regex.test(node.nodeValue)) {
                    const wordsFromTextNode = node.nodeValue;
                    // these random numbers go be for every regex match in newText so later when split all of the mark tags get split
                    const matchId = "4377104578";
                    const newWordsFromTextNode = wordsFromTextNode.replaceAll(regex, `${matchId}$&${matchId}`);
                    const newWordsForTextNode = newWordsFromTextNode.split(matchId);
                    const newNodes = [];
                    // loop over text to find match and put it in side a mark tag 
                    newWordsForTextNode.forEach(nodeText => {
                    if (regex.test(nodeText)) {
                        const mark = document.createElement("mark");
                        mark.innerText = nodeText;
                        newNodes.push(mark);
        
                    } else {
                        newNodes.push(document.createTextNode(nodeText));
        
                    }
        
                    })
                    node.replaceWith(...newNodes);
        
                };
                } else {
                // Recursively process child nodes
                markWords(node, regex);
                };
        
            });
        };


        function markStyle(Data) {
            const tags = document.getElementsByTagName("mark");
            let textRgb = hex2rgb(Data.bgColor)
            for (let tag of tags) {
                tag.style.color = `${Data.textColor}`;
                tag.style.backgroundColor = `rgba(${textRgb}, ${Data.bgOpacity}%)`;;
            };
        }



        const regexKeyword = getRegexKeywords(getKeywords(highlightData));
        if (regexKeyword) {
            // recursive function that edits the text nodes with mark tags where the regex selects
            markWords(document.body, regexKeyword)
            markStyle(highlightData)
        };


    };


    if (highlightData.state) {
        // run highlight function with highlightData as arg on page update. helper function
        onPageUpdate(highlight, highlightData)
        
    }


};
highlighter();