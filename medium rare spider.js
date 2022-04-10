const baseUrl = "https://nhentai.net/"
const baseUrlUnencrypted = "http://nhentai.net/"
const urlPrefix = baseUrl + "g/"
const searchPrefix = baseUrl + "search/?q="
const numberOnly = /^\d+$/

function setHintSuggestion() {
    chrome.omnibox.setDefaultSuggestion({
        description: "Type in a code to go to the nhentai page, or type something else to search!"
    })
}

chrome.omnibox.onInputChanged.addListener(function(input, suggest) {
    suggestions = []

    // Is code, add option to just go straight to the thing
    if (numberOnly.test(input.trim())) {
        suggestions.push({
            description: "Go to nhentai doujin ID #" + input,
            content: urlPrefix + input
        })
    }
    // Add search option
    suggestions.push({
        description: "Search on nhentai with given query",
        content: searchPrefix + encodeURIComponent(input)
    })
    suggest(suggestions)
})

chrome.omnibox.onInputEntered.addListener((input, disposition) => {
    if (!input.startsWith(baseUrl) && !input.startsWith(baseUrlUnencrypted)) {
        // Is code, add option to just go straight to the thing
        if (numberOnly.test(input.trim())) {
            input = urlPrefix + input
        }
        else if (input.startsWith("-")) {
            opt = input.slice(1,2)
            input = input.slice(3)
            switch (opt) {
                case "r":
                    input = baseUrl + "random"
                    break
                case "t":
                    if (input.trim() != "") {
                        input = baseUrl + "tag/" + input.replace(" ", "-")
                    }
                    else {
                        input = baseUrl + "tags"
                    }
                    break
                case "a":
                    if (input.trim() != "") {
                        input = baseUrl + "artist/" + input.replace(" ", "-")
                    }
                    else {
                        input = baseUrl + "artists"
                    }
                    break
                case "c":
                    if (input.trim() != "") {
                        input = baseUrl + "character/" + input.replace(" ", "-")
                    }
                    else {
                        input = baseUrl + "characters"
                    }
                    break
            }
        }
        else if (input.trim() == "") {
            input = "https://nhentai.net/"
        }
        else {
            input = searchPrefix + encodeURIComponent(input)
        }
    }
    switch (disposition) {
        case "currentTab":
            chrome.tabs.update({url: input})
            break
        case "newForegroundTab":
            chrome.tabs.create({url: input})
            break
        case "newBackgroundTab":
            chrome.tabs.create({url: input, active: false})
            break
    }
})