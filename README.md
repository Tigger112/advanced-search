# Advanced Search Chrome Extension
## Introduction
Advanced Search is a powerful JavaScript-based Chrome extension designed to enhance the user experience on Google search pages. This extension aims to improve the efficiency of information gathering and filtering directly on Google's search platform.
## Table of Contents
- [Introduction](#introduction)
- [Video Demo](#video-demo)
- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [About](#about)
    - [Chrome Storage API](#chrome-storage-api)
    - [File Descriptions](#file-descriptions)
    - [File Information](#file-information)
## Video Demo
**[Watch the video demo](https://youtu.be/2tolDXJ1kKM)**.

## Description
Advanced Search works exclusively on Google search pages, offering a set of features to empower users to refine and customize their search experience. Whether it's highlighting specific text, styling highlighted fields, or narrowing down searches to a single website, this extension provides a suite of tools for a more productive search process.
## Features
- **Highlight Text**: Easily highlight text from the search box on the page.
- **Custom Text Highlighting**: Highlight user-provided text from a text field.
- **Styling Options**: Apply styles to the highlighted fields for better visibility.
- **Website Filtering**: Filter searches down to a single website.
- **Custom URL Filters**: Create and remove custom URL filters for a personalized search experience.

## Installation
1. Clone the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right.
4. Click "Load unpacked" and select the `advanced-search` folder from the cloned repository folder.

## Usage
- After installation, the extension's buttons will appear on Google search pages.
- Customize your search experience using the highlighted [features](#features).
- Refer to the [video demo](https://youtu.be/2tolDXJ1kKM) for a visual guide.
***
## About

### Chrome Storage API
I utilized [Chrome's Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage) to store and retrieve data throughout the extension using `chrome.storage.sync.get("options")` and `chrome.storage.sync.set("options")`. The `"options"` argument is an object declared with default options upon installation. This object is then set in Chrome storage, a process executed within the `service-worker.js` and `options.js` files.

**Efficient Usage:**
The current implementation could be further optimized for efficiency and readability.

*Reasoning for Chrome Storage:*
The choice of using the Storage API over other methods is based on its easily understandable nature.

### File Descriptions
- **`filter.js`**: Is to remove the [site: Google operator](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site) from the search bar.
- **`highligher.js`**: Is to highlight text found inside the search box and the input field on the page.
- **`overlay.js`**: This is the file where the code for the buttons that are added to the Google page lives.
- **`service-worker.js`**: Is a [Chrome service worker](https://developer.chrome.com/docs/workbox/service-worker-overview); its main functionality is to add [Chrome API events](https://developer.chrome.com/docs/extensions/reference/api/events) to check for when Chrome loads a URL. This is where filter redirect Chrome to a new URL with the [site: Google operator](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site) before the user searches.
- **`utility.js`**: Is for the two global functions `onPageUpdate()` `hex2rgb`, which are used in `highlighter.js`.
- **`opitons.js`**: Is for `popup.html`, and where the options object gets declared for the [Chrome storage API](https://developer.chrome.com/docs/extensions/reference/api/storage).
- **`popup.html`**: The html layout is designed around [Bootstrap tabs](https://getbootstrap.com/docs/5.0/components/navs-tabs/), requiring jQuery.
- **`layouts.css`**: CSS for the `overlay.js` buttons and containers.



### File Information
#### **`highligher.js`**
##### Functions
- `highlighter()`
\
**Brief Description**: A wrapper fucntion that interacts with the [Chrome storage API](https://developer.chrome.com/docs/extensions/reference/api/storage) to get the *highlight data* stored in the user `options` `object`; this data is stored in a local object called `highlightData` and than calls `highlight()` when the page mutates.

    - `highlight()`
    \
    **Brief Description**: a wrapper function that holds the highligher logic.

        - `getKeywords(data)`
        \
        **Brief Description**: It gets the search terms from the Google URL and the `popup.html` text field.
        \
        **Arguments**: `data` takes `options object` stored in the Chrome storage.
        \
        **Return**: an `array` of `strings` the user typed in the search bar and the `strings` in the `popup.html` text field.
        \

        - `getRegexKeywords(keywords)`
        \
        **Brief Description**: Creates a [rexgex object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) that will match any words in the list but not characters or HTML tags.
        \
        **Arguments**: `keywords` take an `array` of `strings`.
        \
        **Return**: a new [rexgex object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) or `null` if `keywords` is empty.

        - `markWords(container, regex)`
        \
        **Brief Description**: Recursively finds any `text nodes` in the container, then adds `<mark>` tags around the text if regex matches them.
        \
        **Arguments**: `container` is an `HTML element`. `regex` should be a [rexgex object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) of words find and mark.
        \
        **Return**: null recursive side-effects.

        - `markStyle(Data)`
        \
        **Brief Description**: Styles all `<mark>` tags in the `DOM` with the user styling options.
        \
        **Arguments**: `Data` take a `options Object` stored in the Chrome storage.
        \
        **Return**: null side-effects.
***

#### **`filter.js`**
##### Functions
- `filter()`
\
**Brief Description**: A wrapper function that interacts with the [Chrome storage API](https://developer.chrome.com/docs/extensions/reference/api/storage) to get the *filter data* stored in the user `options` `object`; this data is stored in a local object called `filterData` and then calls `runFilter(filterData)` if the filter is on.

    - `runFilter(filterData)`
    \
    **Brief Description**: A function that removes the [site: Google operator](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site) text from the search bar.
    \
    **Arguments** `filterData` takes `options object` stored in the Chrome storage.
    \
    **Return**: null side-effects.
***

#### **`options.js`**
##### Functions
- `newNotification(text, color)`
\
**Brief Description**: This function create a custom notification at the top of `popup.html` with a message.
\
**Arguments** `text` should be a `string` with the notifcation message, **`color`** should be a `string` with a [Bootstrap color name](https://getbootstrap.com/docs/4.0/utilities/colors/).
\
**Return**: null side-effects.

- `defaultOptions()`
\
**Brief Description**: Resets the data in the `options` `object` in the Chrome storage to its default.
\
**Return**: null side-effects.

- `addDropDownOption(url)`
\
**Brief Description**: Creates the HTML for the URL drop down.
\
**Arguments**: `url` should be a URL `string`.
\
**Return**: null side-effects.

- `addNewUrl(urls, newUrl)`
\
**Brief Description**: This function gets called when the add button is clicked, and updates the `options` `object` in the Chrome storage by adding the `newUrl` to the URL list in Chrome storage
\
**Arguments**: `urls` should be `options` `object` of the current *siteList property*, `newUrl` should be a `string` of the URL you want to update the current *siteList property* with.
\
**Return**: null side-effects.

- `addRow(url, table)`
\
**Brief Description**: Add a new `<tr>` to the `updateTable` with the appropriate `<td>` and calls `addDropDownOption(url)` to draw a new drop down option for this new row.
\
**Arguments**: `url` a `string` that contains a URL, `table` a `<tbody>` `HTML element`.
\
**Return**: null side-effects.
***
