const absolutePosition = ({ screens, position }) => {

    // const pixels = toPixelScreens({ screens })
    // const min = getMin({ screens: pixels })

    // return { x: min.x + position.x, y: min.y + position.y }
}

const getMin = ({ screens, prop }) => {

    let minX = Number.MAX_SAFE_INTEGER
    let minY = Number.MAX_SAFE_INTEGER

    for (let i = 0; i < screens.length; i++) {

        const screen = screens[i]
        const x = screen[prop].x
        const y = screen[prop].y

        if (x < minX)
            minX = x

        if (y < minY)
            minY = y
    }

    return { x: Math.abs(minX), y: Math.abs(minY) }
}

const getMax = ({ screens, prop }) => {

    let maxX = 0
    let maxY = 0

    for (let i = 0; i < screens.length; i++) {

        const screen = screens[i]

        if (screen[prop].x + screen[prop].width > maxX)
            maxX = screen[prop].x + screen[prop].width

        if (screen[prop].y + screen[prop].height > maxY)
            maxY = screen[prop].y + screen[prop].height
    }

    return { x: maxX, y: maxY }
}

const normalizeScreens = ({ screens }) => {

    let normalized = screens

    const min = getMin({ screens: normalized, prop: 'bounds' })

    normalized = normalized.map(s => {

        const absoluteBounds = {
            x: s.bounds.x + min.x,
            y: s.bounds.y + min.y,
            width: s.bounds.width,
            height: s.bounds.height,
        }

        return { ...s, absoluteBounds }
    })

    const max = getMax({ screens: normalized, prop: 'absoluteBounds' })

    normalized = normalized.map(s => {

        const percentBounds = {
            x: s.absoluteBounds.x * 100 / max.x,
            y: s.absoluteBounds.y * 100 / max.y,
            width: s.absoluteBounds.width * 100 / max.x,
            height: s.absoluteBounds.height * 100 / max.y,
        }

        return { ...s, percentBounds }
    })

    return normalized
}

const percentage = (x) => `${x}%`

export { absolutePosition, normalizeScreens, percentage }