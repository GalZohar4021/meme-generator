const HOME_PAGE = 'page-gallery'
const EDITOR_PAGE = 'meme-editor'
const MEMES_PAGE = 'memes-gallery'
const ABOUT_PAGE = 'page-about'

var gPage = HOME_PAGE

function onInit() {
    onHomePageClick()
}

function onHomePageClick() {
    onGalleryInit()
    toggleActiveMainNavbar(HOME_PAGE)
    togglePages(HOME_PAGE)
}


function onEditorPage() {
    if(gPage !== HOME_PAGE) toggleActiveMainNavbar(HOME_PAGE)
    togglePages(EDITOR_PAGE)
}


function onMemesPage() {
    toggleActiveMainNavbar(MEMES_PAGE)
    togglePages(MEMES_PAGE)
    onMemesGalleryInit()
}


function onAboutPage() {
    toggleActiveMainNavbar(ABOUT_PAGE)
    togglePages(ABOUT_PAGE)
}


function togglePages(page) {
    document.querySelector('.' + page).classList.toggle('hidden-page')
    document.querySelector('.' + gPage).classList.toggle('hidden-page')
    gPage = page

    if (window.visualViewport.width < 1000 && isMenuOpen()) toggleMenu()
}


function toggleMenu() {
    document.body.classList.toggle('menu-open')
}


function isMenuOpen() {
    return document.body.classList.contains('menu-open')
}


function getCurrPage() {
    return gPage
}

function toggleActiveMainNavbar(page) {
    var oldPageLink = ''
    var newPageLink = ''
    switch (gPage) {
        case HOME_PAGE:
            oldPageLink = 'gallery'
            break;
        case EDITOR_PAGE:
            oldPageLink = 'gallery'
            break;
        case MEMES_PAGE:
            oldPageLink = 'memes'
            break;
        case ABOUT_PAGE:
            oldPageLink = 'about'
            break;
    }
    switch (page) {
        case HOME_PAGE:
            newPageLink = 'gallery'
            break;
        case MEMES_PAGE:
            newPageLink = 'memes'
            break;
        case ABOUT_PAGE:
            newPageLink = 'about'
            break;
    }
    document.querySelector('.' + oldPageLink).classList.toggle('active')
    document.querySelector('.' + newPageLink).classList.toggle('active')
}