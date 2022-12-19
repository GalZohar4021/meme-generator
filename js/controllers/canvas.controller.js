

function drawText(ctx, line, isSelected = false) {
    const font = line.font.fontSize + 'px ' + line.font.fontFamily

    ctx.lineWidth = line.font.strokeSize
    ctx.strokeStyle = line.font.strokeColor
    ctx.fillStyle = line.font.color
    ctx.fontHeight = line.font.fontSize
    ctx.font = font
    if (line.font.textAlign === 'center') ctx.textAlign = line.font.textAlign
    else {
        if (line.font.textAlign === 'right') ctx.direction = 'ltr'
        else ctx.direction = 'rtl'
    }
    ctx.textBaseLine = 'top'

    ctx.fillText(line.txt, line.pos.x, line.pos.y)
    ctx.strokeText(line.txt, line.pos.x, line.pos.y)

    if (isSelected) drawRectBox(ctx, line)
}


function resizeLine(ctx, line, pos) {
    const oldBoxSize = getBoxSize(ctx, line)
    const boxSize = { x: pos.x - oldBoxSize.boxStartX, y: pos.y - oldBoxSize.boxStartY }

    if (boxSize.x <= 0 || boxSize.y <= 0) return
    if (oldBoxSize.boxStartX + boxSize.x > ctx.canvas.clientWidth || oldBoxSize.boxStartY + boxSize.y > ctx.canvas.clientHeight) return
    if (boxSize.x > ctx.canvas.clientWidth || boxSize.y > ctx.canvas.clientHeight) return

    
    if (isTextLine(line)) {
        const oldRatioY = oldBoxSize.boxDistanceY / line.font.fontSize
        line.font.fontSize = boxSize.y / oldRatioY
        console.log('---FONT --', line.font.fontSize)
    }
    else {
        line.size.height = boxSize.y
        line.size.width = boxSize.x
    }
}


function _getPaddingX(fontSize) {
    return (fontSize * 0.2)
}


function getBoxSize(ctx, line) {
    if (!isTextLine(line)) {
        const boxDistanceY = line.size.height
        const boxDistanceX = line.size.width
        const [boxStartX, boxStartY, paddingX, paddingY, textHeight] = [line.pos.x, line.pos.y, 0, 0, boxDistanceY]
        const circlePos = {
            x: boxStartX + boxDistanceX,
            y: boxStartY + boxDistanceY
        }
        return { boxStartX, boxStartY, boxDistanceX, boxDistanceY, paddingX, paddingY, textHeight, circlePos }
    }
    else {
        const metrics = ctx.measureText(line.txt)
        const textWidth = metrics.width

        const left = metrics.actualBoundingBoxLeft
        const right = metrics.actualBoundingBoxRight
        const paddingX = _getPaddingX(line.font.fontSize)

        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const lineHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        const paddingY = (lineHeight - textHeight) * 2


        // console.log('clicked x', line.pos.x, 'left', left, 'right', right)
        // console.log('start box x', boxStartX)

        let boxStartY = line.pos.y - textHeight - (paddingY / 2)
        let boxStartX, boxDistanceX


        if (line.font.textAlign === 'right') {
            boxStartX = line.pos.x + right + paddingX
            boxDistanceX = (textWidth + paddingX * 5) * -1
        }

        else if (line.font.textAlign === 'left') {
            boxStartX = line.pos.x - left - paddingX
            boxDistanceX = textWidth + paddingX * 5
        }

        else if (line.font.textAlign === 'center') {
            console.log(right, left)
            boxStartX = line.pos.x - left - paddingX * 3
            boxDistanceX = left + textWidth + paddingX * 6
        }

        const boxHeight = textHeight + paddingY

        const circlePos = {
            x: boxStartX + boxDistanceX,
            y: line.pos.y + (paddingY * 0.5)
        }
        console.log(circlePos)
        return {
            boxStartX, boxStartY, boxDistanceX, boxDistanceY: boxHeight, paddingX, paddingY, textHeight, circlePos
        }
    }
}


function isCircleArea(ctx, pos, line) {
    const { circlePos } = getBoxSize(ctx, line)
    const distance = Math.sqrt((circlePos.x - pos.x) ** 2 + (circlePos.y - pos.y) ** 2)
    return distance <= 10
}


function isLineArea(ctx, pos, line) {
    const boxSize = getBoxSize(ctx, line)
    const { boxStartX, boxStartY, boxDistanceX, boxDistanceY } = boxSize

    return (pos.x >= boxStartX && pos.x <= boxStartX + boxDistanceX && pos.y >= boxStartY && pos.y <= boxStartY + boxDistanceY)
}

function clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}


function drawImage(meme, container, canv, ctx, img) {
    const elImg = new Image()

    elImg.src = img.url
    elImg.onload = () => {


        resizeCanvas(container, canv)
        adjustImageSize(elImg, canv)

        ctx.drawImage(elImg, 0, 0, canv.width, canv.height)

        renderLines(ctx, meme)
        onRenderDone()
    }
}


function renderLines(ctx, meme) {
    meme.lines.map(line => {
        if (isTextLine(line)) _renderTextLine(ctx, line, isSelectedLine(line))
        else _renderStickerLine(ctx, line, isSelectedLine(line))

    })
}


function resizeCanvas(elContainer, elCanvas) {
    elCanvas.width = elContainer.offsetWidth
    elCanvas.height = elContainer.offsetHeight
}


function getDistanceXY(pos1, pos2) {
    // Calc the distance between two dots
    // Calc the distance between two dots
    const vectorX = (pos1.x - pos2.x)
    const vectorY = (pos1.y - pos2.y)

    return { vectorX, vectorY }
}


function _renderTextLine(ctx, line, isSelected = false) {
    drawText(ctx, line, isSelected)
}


function _renderStickerLine(ctx, line, isSelected = false) {
    const elImg = new Image()

    elImg.src = line.url
    elImg.onload = () => {
        ctx.drawImage(elImg, line.pos.x, line.pos.y, line.size.width, line.size.height)
        if (isSelected) drawRectBox(ctx, line)

    }
}

function drawRectBox(ctx, line) {
    const boxSize = getBoxSize(ctx, line)
    const { boxStartX, boxStartY, boxDistanceX, boxDistanceY } = boxSize

    ctx.strokeStyle = '#0080FE'
    console.log(boxDistanceX, boxDistanceY)


    ctx.strokeRect(boxStartX, boxStartY, boxDistanceX, boxDistanceY)
    ctx.fillStyle = 'white'
    drawArc(ctx, boxSize.circlePos.x, boxSize.circlePos.y, 10, '#1134A6')
}


function drawArc(ctx, x, y, size = 60, color) {
    ctx.beginPath()
    ctx.lineWidth = '6'
    ctx.arc(x, y, size, 0, 2 * Math.PI)
    ctx.strokeStyle = color
    ctx.stroke()
    ctx.fill()
}
