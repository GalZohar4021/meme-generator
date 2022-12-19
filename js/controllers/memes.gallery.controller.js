var gMemeGallery
function onMemesGalleryInit() {
    gMemeGallery = document.querySelector('section.memes-box')
    renderMemes()
}
function renderMemes() {
    const memes = getMemes()
    clearGallery(gMemeGallery)
    memes.map(meme => {
        const className= `card-${meme.memeId}`
        const cardHTML = `
        <card data-id="${meme.memeId}" class="meme-container ${className}" onclick="onMemeEdit(this)">
        </card>`

        gMemeGallery.innerHTML += cardHTML
    })
    const elCards = gMemeGallery.querySelectorAll('.meme-container')
    console.dir(elCards)
    for (let i = 0; i < elCards.length; i++) {
        const elImg = new Image()
        elImg.src = getMemeById(elCards[i].dataset.id).url
        elImg.onload = function () {
            adjustImageSize(elImg, elCards[i], true)
            elCards[i].innerHTML += `<img src="${elImg.src}">`
        }
    }
    console.log('Memes loaded')
}

function onMemeEdit(elCard) {
    const memeId = elCard.dataset.id
    initEditMeme(getMemeById(memeId))
    onEditorPage()
}