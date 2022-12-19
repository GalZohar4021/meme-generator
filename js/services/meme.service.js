const TYPE_TEXT = 'TXT'
const TYPE_STICKER = 'STIK'

const STORAGE_KEY_MEME = 'memeDB'

var gMemes
var gMeme
var gLine

_loadSavedMemes()


function newMeme(img) {
    return _createMeme(img.id)
}


function saveMeme(url) {
    gMeme.url = url
    const memeExists = gMemes.findIndex(meme => meme.memeId === gMeme.memeId)
    if (memeExists === -1) gMemes.push(gMeme)
    //console.log(memeExists)
    _saveMemes()
}


function setMeme(meme) {
    gMeme = meme
}


function getMemeById(id) {
    return gMemes.find(meme => meme.memeId === id)
}


function getMemes() {
    return gMemes
}


function getMeme() {
    return gMeme
}


function getLine() {
    let lineIdx = gMeme.selectedLineIdx
    if (lineIdx === -1) return undefined
    return gMeme.lines[lineIdx]
}


function _loadSavedMemes() {
    gMemes = loadFromStorage(STORAGE_KEY_MEME)
    if (!gMemes || !gMemes.length) gMemes = []
}


function _saveMemes() {
    saveToStorage(STORAGE_KEY_MEME, gMemes)
}


function linesEmpty() {
    return !gMeme.lines.length
}


function addLine(line) {
    gMeme.lines.push(line)
}

function createTextLine(txt, pos) {
    return {
        type: TYPE_TEXT,
        pos,
        txt,
        font: _createFont()
    }
}

function createStickerLine(sticker, pos) {
    return {
        type: TYPE_STICKER,
        pos,
        url: sticker.url,
        font: _createFont(),
        size: {
            height: 50,
            width: 50
        }
    }
}

function removeLine(meme, lineIdx) {
    meme.lines.splice(lineIdx, 1)
}


function _makeMemeId(length = 6) {
    var txt = 'm'
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _createMeme(imgId) {
    return {
        memeId: _makeMemeId(),
        selectedImgId: imgId,
        selectedLineIdx: -1,

        lines: [

        ]
    }
}

function _createFont() {
    return {
        strokeSize: 2,
        strokeColor: 'black',
        color: 'white',
        fontSize: 30,
        fontFamily: 'Impact',
        textAlign: 'center'
    }
}

function isInLinePos(ctx, pos) {
    return gMeme.lines.findIndex(line =>
        isLineArea(ctx, pos, line))
}
function getSelectedImageId(meme) {
    return meme.selectedImgId
}


function isTextLine(line) {
    return line.type === TYPE_TEXT
}


function isSelectedLine(line) {
    return gMeme.selectedLineIdx === getLineIdx(line)
}


function getLineIdx(sLine) {
    return gMeme.lines.findIndex(line => line === sLine)
}


function getLineByIdx(lineIdx) {
    return gMeme.lines[lineIdx]
}


function getSelectedLineIdx() {
    return gMeme.selectedLineIdx
}


function setSelectedLine(lineIdx) {
    gMeme.selectedLineIdx = lineIdx
}