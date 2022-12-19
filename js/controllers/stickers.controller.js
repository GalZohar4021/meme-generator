

function renderStickersBar() {
    const stickers = getStickers()
    let stickersHTMLs = '<img class="sticker-bar-arrow" src="img/design/icons/left-arrow.png" onclick="onStickerBackPage()">'
    stickers.map(sticker => {
        stickersHTMLs += `<img class="stickers sticker-${sticker.id}" data-id="${sticker.id}" src="${sticker.url}" onclick="onStickerPicked(this)"></img>`
    })
    const elStickersBar = document.querySelector('nav.stickers-bar')
    elStickersBar.innerHTML = stickersHTMLs + '<img class="sticker-bar-arrow" src="img/design/icons/right-arrow.png" onclick="onStickerNextPage()">'
}

function onStickerPicked(elSticker) {
    const sticker = getSticker(elSticker.dataset.id)
    console.log('Sticker ' + sticker.id + ' was picked')
    onAddStickerLine(sticker)

    
}

function onStickerBackPage() {
    backStickerBar()
    renderStickersBar()
}

function onStickerNextPage() {
    nextStickerBar()
    renderStickersBar()
}