const STORAGE_KEY_KEYS = 'keysDB'
var gKeywords
var gKeysLength = 4

_loadKeywords()
_renderDataListOptions()
function getKeywords() {
    return gKeywords.slice(0, gKeysLength + 1)
}


function _renderDataListOptions(){
    var elDataList = document.querySelector('#tags-list-search')
    gKeywords.map(keyword => {
        const dataHTML = `<option value="${keyword.keyword}">`
        elDataList.innerHTML += dataHTML
    })
}

function _findKeywords() {
    gKeywords = []
    const imgs = getImages()
    imgs.map(img => {
        const keys = img.keywords
        keys.map(key => {
            if (gKeywords.findIndex(val => val.keyword === key) === -1) {
                console.log(key)
                gKeywords.push(_createKeyword(key))
            }
            else console.log(key + ' already exists')
        })

    })
    console.log('Keywords not found. Initialized keywords')
}


function _createKeyword(keyword) {
    return {
        id: _makeKeywordId(),
        keyword,
        count: 1
    }
}

function isFullShown() {
    return (gKeysLength === gKeywords.length)
}

function setKeysShownLength(limited = true) {
    if (!limited) gKeysLength = gKeywords.length
    else gKeysLength = 2
}

function _loadKeywords() {
    gKeywords = loadFromStorage(STORAGE_KEY_KEYS)
    if (!gKeywords || !gKeywords.length) {
        _findKeywords()
        _saveKeywords()
    }
    else console.log('Keywords loaded')
    setKeysShownLength()
}

function _saveKeywords() {
    console.log('Saving keywords')
    saveToStorage(STORAGE_KEY_KEYS, gKeywords)
}

function _makeKeywordId(length = 6) {
    var txt = 'k'
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
function getKeywordIdx(newKey) {
    return gKeywords.findIndex(key => key.keyword === newKey)
}
function keywordSearch(newKey) {
    console.log('Value ' + newKey + ' was searched')
    const idx = getKeywordIdx(newKey)
    if (idx === -1) return
    console.log('Key found and count updated to ' + ++gKeywords[idx].count)
    _saveKeywords()
    updateSearchKeyInput(newKey)
}

function createKey(newKey) {
    gKeywords.unshift(_createKeyword(newKey))
    console.log('New key was recorded')
    _saveKeywords()
}