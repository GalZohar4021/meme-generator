function setModalText(txt) {
    var modal = document.querySelector('.message-box')
    modal.innerText = txt
}
function openModal() {
    var modal = document.querySelector('.message-box')
    modal.classList.add('modal-open')
    console.log('Modal open')
}
function closeModal() {
    var modal = document.querySelector('.message-box')
    modal.classList.remove('modal-open')
    console.log('Modal close')
}
