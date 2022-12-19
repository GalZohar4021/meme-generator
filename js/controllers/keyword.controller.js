function renderKeywords() {
    renderKeys()
    renderKeywordsFontSize()
    _addKeysListeners()
}

function renderKeys() {
    const keys = getKeywords()
    const elKeys = document.querySelector('.tags-list')
    const elExpand = document.querySelector('section.tags')

    var keysHTML = ''
    keys.map(key => {

        const className = `tag keyword-${key.id}`
        keysHTML +=
            `<span data-id=${key.id} class="${className}">${key.keyword}</span>`

    })
    elKeys.innerHTML = keysHTML
    const expandBtnStr = (isFullShown()) ? 'Less...' : 'More...'
    elExpand.replaceChildren(elKeys)
    elExpand.innerHTML += `<span class="more" onclick="onTagsToggleFull()">${expandBtnStr}</a>`


}

function renderKeywordsFontSize() {
    const keys = getKeywords()

    keys.map(key => {
        var elSpan = document.querySelector(`.keyword-${key.id}`)

        const size = window.getComputedStyle(elSpan, null).getPropertyValue('font-size')
        const font = parseInt(size.substring(0, size.length - 2)) + (key.count) + 'px'
        elSpan.style.fontSize = font
    })
}

function _addKeysListeners() {
    const keys = getKeywords()
    keys.map(key => addKeyListener(key))
}
function addKeyListener(key) {
    const selector = `.keyword-${key.id}`
    var elSpan = document.querySelector(selector)

    elSpan.addEventListener('click', function () {
        onKeywordClicked(key)
    })
}

function onSaveKeyword(key) {
    if (!key.length) return
    if(getKeywordIdx(key) !== -1) return
    createKey(key)
    renderKeywords()
}
function onKeywordClicked(key) {
    onKeywordSearched(key.keyword)
}
function onKeywordSearched(keyword) {
    keywordSearch(keyword)
    setFilter(keyword)

    renderKeywords()
    renderImages()
}
function onTagsToggleFull() {
    var toggled = document.querySelector('.tags-list').classList.contains('show-full')
    document.querySelector('.tags-list').classList.toggle('show-full')
    setKeysShownLength(toggled)
    renderKeywords()
}

function updateSearchKeyInput(txt) {
    document.querySelector('.search-bar input').value = txt
}
function onResetSearch() {
    document.querySelector('.search-bar input').value = ''
    resetFilter()
    renderImages()
}