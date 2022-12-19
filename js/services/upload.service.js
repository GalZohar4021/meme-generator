function doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)
    console.log('formData:', formData)
    // Send a post req with the image to the server
    fetch('//ca-upload.com/here/upload.php', { method: 'POST', body: formData })
        .then(res => res.text())
        .then(url => {
            console.log('url:', url)
            onSuccess(url)
        })
}


async function onFaceBookShare() {
    const imgDataUrl = gCanvas.toDataURL('image/jpeg') // Gets the canvas content as an image format

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        // Encode the instance of certain characters in the url
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`,'chromeWindow','popup,height=100,width=200')
    }
    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
}


async function shareNavAPI() {
    // Get canvas as dataURL
    const dataUrl = gCanvas.toDataURL()

    // Convert dataUrl into blob using browser fetch API
    const blob = await (await fetch(dataUrl)).blob()

    // Create file form the blob
    const image = new File([blob], 'canvas.png', { type: blob.type })

    // Check if the device is able to share these files then open share dialog
    if (navigator.canShare && navigator.canShare({ files: [image] })) {
        try {
            await navigator.share({
                files: [image],         // Array of files to share
                title: 'MemeGene.',  // Share dialog title
                text: 'Generate and share your memes!'
            })
        } catch (error) {
            console.log('Sharing failed!', error)
        }
    } else {
        console.log('This device does not support sharing files.')
    }
}