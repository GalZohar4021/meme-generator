const GRABBED = 1
const FOCUS = 2
const DRAGGING = 3
const IDLE = 4
const CIRCLE_RESIZE_START = 5
const CIRCLE_RESIZE_CHANGE = 6
const CIRCLE_RESIZE_END = 7

var loadedListeners = false
var gImg
var gCanvas
var gCtx
var gLastDragPos

var SELECT_STATE = IDLE
var gRenderMode = { download: false, link: '', saved: false }
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

_renderFontFamilyOptions()

function initEditMeme(meme) {
    gImg = getImageById(getSelectedImageId(meme))
    gCanvas = document.querySelector('#meme')
    gCtx = gCanvas.getContext('2d')
    setMeme(meme)
    renderMeme(meme)
    renderStickersBar()

    if (!loadedListeners) {
        initEditorListeners()
        loadedListeners = true
    }
}


function initEditor(img) {

    gImg = img
    const meme = newMeme(gImg)
    setMeme(meme)

    gCanvas = document.querySelector('#meme')
    gCtx = gCanvas.getContext('2d')

    renderMeme(meme)
    renderStickersBar()
    if (!loadedListeners) {
        initEditorListeners()
        loadedListeners = true
    }
}


function initEditorListeners() {

    var hammerTimer = new Hammer(document.querySelector('.tools-area'))
    var dblTap = new Hammer.Tap({ event: 'doubleTap', taps: 2 })
    hammerTimer.add([dblTap])
    hammerTimer.on('dbleTap', function () {
        ev.preventDefault()
    })

    window.addEventListener('resize', function () {
        if (getCurrPage() === EDITOR_PAGE) renderMeme(getMeme())
    })
    addMouseListeners()
    addTouchListeners()
}


function _renderFontFamilyOptions() {
    const famiyFonts = [
        'Impact',
        'Arial',
        'Italic',
        'Cambria',
        'Georgia',
        'Verdana',
        'unbounded'
    ]
    var elSelect = document.querySelector('.font-family-menu')
    let optionsHTML = ''
    famiyFonts.map(font => {
        optionsHTML += `<option value="${font}">${font}</option>`
    })
    elSelect.innerHTML = optionsHTML

}


function onFamilyFontChange(elSelect) {
    if (getSelectedLineIdx() === -1) return
    const line = getLine()
    line.font.fontFamily = elSelect.value
    renderMeme(getMeme())
}


function renderMeme(meme) {
    const elContainer = document.querySelector('.meme-container')
    drawImage(meme, elContainer, gCanvas, gCtx, getImageById(meme.selectedImgId))
}


function onEditText(elInput) {
    if (getSelectedLineIdx() === -1) {
        onAddTextLine()
        return
    }
    const line = getLine()
    if (!isTextLine(line)) {
        elInput.value = ""
        return
    }
    line.txt = elInput.value
    renderMeme(getMeme())
}


function onAddTextLine() {
    const elInput = document.querySelector('input[name="editor-text"]')
    const str = elInput.value

    if (!str.length) return


    const pos = { x: gCanvas.width / 2, y: gCanvas.height / 2 }

    // Model Update
    const meme = getMeme()
    const line = createTextLine(str, pos)
    addLine(line)
    onFocusLine(getLineIdx(line))

    // Render meme
    renderMeme(meme)

    console.log('New text line ' + str)
}


function onAddStickerLine(sticker) {
    const pos = { x: gCanvas.width / 2, y: gCanvas.height / 2 }

    // Model Update
    const meme = getMeme()
    const line = createStickerLine(sticker, pos)
    addLine(line)
    onFocusLine(getLineIdx(line))

    // Render meme
    renderMeme(meme)

    console.log('New sticker line ')
}


function onAlignmentSet(dir) {
    const meme = getMeme()
    const line = getLine()
    if (getSelectedLineIdx() === -1) return
    line.font.textAlign = dir
    renderMeme(meme)
}


function onRemoveTextLine() {
    const meme = getMeme()
    if (getSelectedLineIdx() === -1) return
    removeLine(meme, getSelectedLineIdx())
    renderMeme(meme)
}


function onFontSizeDown() {
    const meme = getMeme()
    const line = getLine()
    if (getSelectedLineIdx() === -1) return
    line.font.fontSize -= 5
    renderMeme(meme)
}


function onFontSizeUp() {
    if (getSelectedLineIdx() === -1) return
    const line = getLine()
    const meme = getMeme()
    line.font.fontSize += 5
    renderMeme(meme)
}


function onFocusChange() {
    if (linesEmpty()) return

    const meme = getMeme()
    const selectedIdx = getSelectedLineIdx() + 1
    const lineIdx = (selectedIdx >= meme.lines.length) ? 0 : selectedIdx

    onFocusLine(lineIdx)
}


function onFontColorChange(elColor) {
    if (getSelectedLineIdx() === -1) return

    const meme = getMeme()
    const line = getLine()
    line.font.color = elColor.value
    renderMeme(meme)
}


function onStrokeDesign(elStroke) {
    if (getSelectedLineIdx() === -1) return

    const meme = getMeme()
    const line = getLine()
    line.font.strokeColor = elStroke.value
    renderMeme(meme)
}


function getPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    // Check if its a touch ev
    if (TOUCH_EVS.includes(ev.type)) {

        //soo we will not trigger the mouse ev
        ev.preventDefault()

        //Gets the first touch point
        ev = ev.changedTouches[0]

        //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}


function onMemeSave() {
    gRenderMode.save = true

    setSelectedLine(-1)
    renderMeme(getMeme())
}


function onRenderDone() {
    if (gRenderMode.download) {
        console.log('alert')
        gRenderMode.download = false
        const data = document.querySelector('#meme').toDataURL()
        gRenderMode.link.href = data
        gRenderMode.link.download = "my-img.jpg"

        canvas.toBlob(blob => {
            let file = new Blob([blob], { type: "application/octet-stream" })
            let blobURL = URL.createObjectURL(file)
            window.location.href = blobURL
        })
    }
    if (gRenderMode.save) {
        gRenderMode.save = false
        const data = document.querySelector('#meme').toDataURL()
        saveMeme(data)

        setModalText('Meme Saved Successfully')
        openModal()
        setTimeout(() => {
            closeModal()
        }, 2000);
    }
}

async function onDownloadMeme(elLink) {

    gRenderMode.download = true
    gRenderMode.link = elLink

    setSelectedLine(-1)
    renderMeme(getMeme())
}


function onDown(ev) {
    ev.preventDefault()
    const pos = getPos(ev)
    if (getSelectedLineIdx() !== -1) {
        if (isCircleArea(gCtx, pos, getLine())) {
            onCircleResizeStart(getPos(ev))
            return
        }
    }

    const lineIdx = isInLinePos(gCtx, pos)

    if (lineIdx !== -1) onGrabLine(lineIdx, pos)
    else if (SELECT_STATE !== IDLE) onUnfocusLine()

    renderMeme(getMeme())

}


function onMove(ev) {
    const pos = getPos(ev)
    if (isGrabbing()) {
        onDraggingLine(pos)

        const meme = getMeme()
        renderMeme(meme)
    }
    else if (isResizing()) {
        onCircleResizeMove(pos)
    }
}


function onUp() {
    if (SELECT_STATE !== IDLE && !isResizing()) {
        console.log('\t------------\n\t DRAGGING STOPPED\n\t -----------')
        SELECT_STATE = FOCUS
    }
    else if (isResizing()) {
        onCircleResizeEnd()
    }
}


function onLeave() {
    if (isGrabbing()) SELECT_STATE = FOCUS
    if (isResizing()) SELECT_STATE = FOCUS
}


function onDraggingLine(pos) {
    const line = getLine()
    var posDis = getDistanceXY(gLastDragPos, pos)
    gLastDragPos = pos
    line.pos = { x: line.pos.x - posDis.vectorX, y: line.pos.y - posDis.vectorY }

    SELECT_STATE = DRAGGING

}


function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
    gCanvas.addEventListener('mouseleave', onLeave)
}


function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
    gCanvas.addEventListener('touchcancel', onUp)
}


function onFocusLine(lineIdx) {
    const line = getLineByIdx(lineIdx)
    const elInput = document.querySelector('input[name="editor-text"]')
    if (isTextLine(line)) elInput.value = line.txt

    SELECT_STATE = FOCUS
    setSelectedLine(lineIdx)
    console.log('\t-----\n\FOCUS -  ' + lineIdx + '\n\t -----')
}


function onUnfocusLine() {
    document.querySelector('input[name="editor-text"]').value = ''
    SELECT_STATE = IDLE
    setSelectedLine(-1)
    console.log('\t ------ \n\t Unfocus \n\t ------')
}


function onGrabLine(lineIdx, pos) {
    onFocusLine(lineIdx)
    gLastDragPos = pos
    SELECT_STATE = GRABBED
    console.log('\t-----\n\tGRABBED -  ' + lineIdx + '\n\t -----')
}


function isGrabbing() {
    return SELECT_STATE === GRABBED || SELECT_STATE === DRAGGING
}
function isResizing() {
    return SELECT_STATE === CIRCLE_RESIZE_CHANGE || SELECT_STATE === CIRCLE_RESIZE_START
}

function onCircleResizeStart() {
    SELECT_STATE = CIRCLE_RESIZE_START
    console.log('resize start')
}
function onCircleResizeMove(pos) {
    SELECT_STATE = CIRCLE_RESIZE_CHANGE
    resizeLine(gCtx, getLine(), pos)
    renderMeme(getMeme())
}
function onCircleResizeEnd() {
    console.log('resize done')
    SELECT_STATE = IDLE
}