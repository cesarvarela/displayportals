import React, { useEffect, useState } from 'react'
import { screen, BrowserWindow, app, require, } from '@electron/remote'
import styled from 'styled-components'
import Desktop from './components/Desktop'
import { Grommet, Button } from 'grommet'
const robotjs = require('robotjs')

const getMin = ({ screens }) => {

    let minX = screens[0].bounds.x;
    let minY = screens[0].bounds.y;

    for (let i = 1; i < screens.length; i++) {

        const screen = screens[i]

        if (screen.bounds.x < minX)
            minX = screen.bounds.x

        if (screen.bounds.y < minY)
            minY = screen.bounds.y
    }

    return { x: Math.abs(minX), y: Math.abs(minY) }
}


const toPixel = ({ screens }) => {

    const pixels = screens.map(s => ({ ...s, bounds: { x: Math.floor(s.bounds.x * s.scaleFactor), y: Math.floor(s.bounds.y * s.scaleFactor) } }))

    return pixels
}

const toAbsolute = ({ screens, position }) => {

    const min = getMin({ screens })

    return { x: min.x + position.x, y: min.y + position.y }
}


function App() {

    const [screens, setScreens] = useState([])

    useEffect(() => {

        const interval = setInterval(() => {
            const position = robotjs.getMousePos()
            const abs = toAbsolute({ screens: toPixel({ screens }), position })

        }, 100)

        return () => {

            clearInterval(interval)
        }

    }, [screens])


    useEffect(() => {
        setScreens(screen.getAllDisplays())
    }, [])

    const openPortal = ({ backgroundColor }) => {

        const blue = new BrowserWindow({
            width: 40, height: 600,
            resizable: true,
            frame: false,
            backgroundColor,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            },
            minWidth: 10,
            minHeight: 10,
        })

        blue.removeMenu()
        blue.loadURL(PORTAL_WEBPACK_ENTRY)
        blue.show()
        blue.webContents.openDevTools()

        return blue
    }

    const onAddClick = () => {

        const blue = openPortal({ backgroundColor: '#2ABBE8' })
        const orange = openPortal({ backgroundColor: '#F79321' })
    }

    return <Grommet>
        <Button primary label="Create Portal" onClick={onAddClick} />
        <Desktop screens={screens} />

    </Grommet>
}

export default App