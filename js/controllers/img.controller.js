var gGallery

function onGalleryInit() {
    
    gGallery = document.querySelector('section.gallery')
    resetFilter()
    renderImages()
    renderKeywords()
}

function clearGallery(elGallery) {
    while (elGallery.firstChild) {
        elGallery.removeChild(elGallery.lastChild)
    }
}


function renderImages() {
    const images = getImages()
    //console.clear()
    var r = []
    clearGallery(gGallery)
    images.map(img => {
        r.push(img.keywords)
        const cardHTML =
            `<card data-id="${img.id}" class="img-container flex" onclick="onImageClicked(this)">
        </card>`
        gGallery.innerHTML += cardHTML
    })
    //console.table(r)

    const elCards = gGallery.querySelectorAll('.img-container')
    console.dir(elCards)
    for (let i = 0; i < elCards.length; i++) {
        const elImg = new Image()
        elImg.src = getImageById(elCards[i].dataset.id).url
        elImg.onload = function () {
            adjustImageSize(elImg, elCards[i])
            elCards[i].innerHTML += `<img src="${elImg.src}">`
        }
    }
    console.log('Images loaded')
}

function adjustImageSize(elImg, elContainer) {

    let imgRatio = elImg.width / elImg.height

    elImg.width = elContainer.offsetWidth
    elImg.height = elContainer.offsetWidth / imgRatio
    elContainer.height = elImg.height

}

function onImageClicked(elCard) {
    const id = elCard.dataset.id
    initEditor(getImageById(id))
    onEditorPage()
}

function onImageInput(ev) {
    loadImageFromInput(ev)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    reader.onload = (ev) => {
        let img = createImage(ev.target.result, [])
        addImage(img)
        renderImages()
    }
    reader.readAsDataURL(ev.target.files[0])
}