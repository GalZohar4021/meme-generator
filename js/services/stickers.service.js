const STORAGE_KEY_STICKERS = 'stickersDB'

var gStickers
var gStickerBarSize = 3
var gStickerBar = {
    startPos: 0,
    endPos: 0
}

_loadStickers()

function getStickers() {
    return gStickers.slice(gStickerBar.startPos, gStickerBar.endPos + 1)
}

function backStickerBar() {
    if (gStickerBar.startPos === 0) return
    gStickerBar.startPos--
    gStickerBar.endPos--
}
function nextStickerBar() {
    if (gStickers.length === gStickerBar.endPos + 1) return
    gStickerBar.startPos++
    gStickerBar.endPos++
}

function getSticker(stickerID) {
    return gStickers.find(sticker => sticker.id === stickerID)
}

function _loadStickers() {
    gStickers = loadFromStorage(STORAGE_KEY_STICKERS)
    if (!gStickers || !gStickers.length) {
        console.log('Failed loading Stickers data, initializing...')
        gStickers = []


        gStickers.unshift(_createSticker('img/design/stickers/approved.png'))
        gStickers.unshift(_createSticker('img/design/stickers/man.png'))
        gStickers.unshift(_createSticker('img/design/stickers/stamp.png'))
        gStickers.unshift(_createSticker('img/design/stickers/pizza1.png'))
        gStickers.unshift(_createSticker('img/design/stickers/bubble.png'))
        gStickers.unshift(_createSticker('img/design/stickers/crown-gold.png'))
        gStickers.unshift(_createSticker('img/design/stickers/pizza2.png'))
        gStickers.unshift(_createSticker('img/design/stickers/crown-black.png'))
        gStickers.unshift(_createSticker('img/design/stickers/pink-hat.png'))
        
        gStickers.unshift(_createSticker('img/design/stickers/israel.png'))
        gStickers.unshift(_createSticker('img/design/stickers/vietnam.png'))
        gStickers.unshift(_createSticker('img/design/stickers/germany.png'))
        gStickers.unshift(_createSticker('img/design/stickers/china.png'))
        gStickers.unshift(_createSticker('img/design/stickers/canada.png'))
        gStickers.unshift(_createSticker('img/design/stickers/ukraine.png'))
        gStickers.unshift(_createSticker('img/design/stickers/brazil.png'))
        gStickers.unshift(_createSticker('img/design/stickers/united-kingdom.png'))
        gStickers.unshift(_createSticker('img/design/stickers/united-states.png'))
        gStickers.unshift(_createSticker('img/design/stickers/glasses.png'))
        gStickers.unshift(_createSticker('img/design/stickers/sunglasses.png'))
        gStickers.unshift(_createSticker('img/design/stickers/lol.png'))

        _saveStickers()
    }
    else console.log('Stickers loaded successfully')

    if (gStickerBarSize > gStickers.length) gStickerBarSize = gStickers.length
    gStickerBar.startPos = 0
    gStickerBar.endPos = gStickerBarSize - 1
}



function _createSticker(url) {
    return {
        id: _makeStickerId(),
        url
    }
}
gStickers

function _makeStickerId(length = 6) {
    var txt = 's'
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
function _saveStickers() {
    console.log('Saving stickers')
    saveToStorage(STORAGE_KEY_STICKERS, gStickers)
}