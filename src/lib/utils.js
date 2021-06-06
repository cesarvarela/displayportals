const absolutePosition = ({ screens, position }) => {

    // const pixels = toPixelScreens({ screens })
    // const min = getMin({ screens: pixels })

    // return { x: min.x + position.x, y: min.y + position.y }
}

const getMin = ({ screens }) => {

    let minX = screens[0].pixelBounds.x;
    let minY = screens[0].pixelBounds.y;

    for (let i = 1; i < screens.length; i++) {

        const screen = screens[i]

        if (screen.pixelBounds.x < minX)
            minX = screen.pixelBounds.x

        if (screen.pixelBounds.y < minY)
            minY = screen.pixelBounds.y
    }

    return { x: Math.abs(minX), y: Math.abs(minY) }
}

const getMax = ({ screens }) => {

    let maxX = 0
    let maxY = 0

    for (let i = 0; i < screens.length; i++) {

        const screen = screens[i]

        if (screen.absoluteBounds.x + screen.absoluteBounds.width > maxX)
            maxX = screen.absoluteBounds.x + screen.absoluteBounds.width

        if (screen.absoluteBounds.y + screen.absoluteBounds.height > maxY)
            maxY = screen.absoluteBounds.y + screen.absoluteBounds.height
    }

    return { x: maxX, y: maxY }
}

const getPrimary = ({ screens }) => {

    for (let screen of screens) {

        if (screen.bounds.x == 0 && screen.bounds.y == 0) {

            return screen
        }
    }
}

const normalizeScreens = ({ screens }) => {

    const primary = getPrimary({ screens })

    const pixels = screens.map(s => {

        const pixelBounds = {
            x: Math.floor(s.bounds.x * primary.scaleFactor),
            y: Math.floor(s.bounds.y * primary.scaleFactor),
            width: Math.floor(s.bounds.width * primary.scaleFactor),
            height: Math.floor(s.bounds.height * primary.scaleFactor),
        }

        return { ...s, pixelBounds }
    })

    const min = getMin({ screens: pixels })

    const absolute = pixels.map(s => {

        const absoluteBounds = {
            x: s.pixelBounds.x + min.x,
            y: s.pixelBounds.y + min.y,
            width: s.pixelBounds.width,
            height: s.pixelBounds.height,
        }

        return { ...s, absoluteBounds }
    })

    const max = getMax({ screens: absolute })

    const percent = absolute.map(s => {

        const percentBounds = {
            x: s.absoluteBounds.x * 100 / max.x,
            y: s.absoluteBounds.y * 100 / max.y,
            width: s.absoluteBounds.width * 100 / max.x,
            height: s.absoluteBounds.height * 100 / max.y,
        }

        return { ...s, percentBounds }
    })

    return percent
}

export { absolutePosition, normalizeScreens }