
const STORAGE_KEY_IMG = 'imgDB'
var gImgs
var gCurrImg
var gCurrFilter = ''
_loadImages()


function getImages() {
    return _filterImages()
}
function getCurrImage() {
    return gCurrImg
}
function setCurrImg(img) {
    gCurrImg = img
}

function getImageById(id) {
    return gImgs.find(img => img.id === id)
}

function resetFilter() {
    gCurrFilter = ''
}

function setFilter(keyword) {
    gCurrFilter = keyword
}

function addImage(img) {
    gImgs.unshift(img)
    _saveImages()
}

function createImage(url, keywords) {
    return {
        id: _makeImageId(),
        url,
        keywords
    }
}

function _makeImageId(length = 6) {
    var txt = 'i'
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _loadImages() {
    gImgs = loadFromStorage(STORAGE_KEY_IMG)
    if (!gImgs || !gImgs.length) {
        console.log('Failed loading images data, initializing...')
        gImgs = []
        gImgs.unshift(createImage('img/1.jpg', ['trump', 'president']))
        gImgs.unshift(createImage('img/2.jpg', ['dogs']))
        gImgs.unshift(createImage('img/3.jpg', ['dog', 'baby', 'sleep']))
        gImgs.unshift(createImage('img/4.jpg', ['cat', 'sleep']))
        gImgs.unshift(createImage('img/5.jpg', ['kid', 'ambitios']))
        gImgs.unshift(createImage('img/6.jpg', ['pack', 'smile']))
        gImgs.unshift(createImage('img/7.jpg', ['kid', 'funny']))
        gImgs.unshift(createImage('img/8.jpg', ['thoughts', 'face']))
        gImgs.unshift(createImage('img/9.jpg', ['laugh', 'kid']))
        gImgs.unshift(createImage('img/10.jpg', ['laugh', 'obama', 'president']))
        gImgs.unshift(createImage('img/11.jpg', ['kiss', 'gay']))
        gImgs.unshift(createImage('img/12.jpg', ['point', 'you']))
        gImgs.unshift(createImage('img/13.jpg', ['de caprio', 'cheers']))
        gImgs.unshift(createImage('img/14.jpg', ['the rock', 'sunglasses']))
        gImgs.unshift(createImage('img/15.jpg', ['almost', 'a little']))
        gImgs.unshift(createImage('img/16.jpg', ['oh god', 'funny', 'gossip']))
        gImgs.unshift(createImage('img/17.jpg', ['putin', 'president']))
        gImgs.unshift(createImage('img/18.jpg', ['buzz', 'toy\'s story']))
        _saveImages()
    }
    else console.log('Images loaded successfully')
}

function _filterImages() {
    if (gCurrFilter.length) {
        return gImgs.filter(isImageMatchFilter)
    }
    return gImgs
}

function isImageMatchFilter(img) {
    return (img.keywords.findIndex(keyword => keyword.toUpperCase().includes(gCurrFilter.toUpperCase())) !== -1)
}

function _saveImages() {
    console.log('Saving images')
    saveToStorage(STORAGE_KEY_IMG, gImgs)
}