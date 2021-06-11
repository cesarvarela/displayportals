const absolutePosition = ({ screens, position }) => {

    // const pixels = toPixelScreens({ screens })
    // const min = getMin({ screens: pixels })

    // return { x: min.x + position.x, y: min.y + position.y }
}

const toPercentageConverter = ({ max }) => {

    return ({ x, y, width, height }) => ({
        width: width * 100 / max.x,
        height: height * 100 / max.y,
        x: x * 100 / max.x,
        y: y * 100 / max.y,
    })
}

const percentage = (x) => `${x}%`

export { absolutePosition, percentage, toPercentageConverter }