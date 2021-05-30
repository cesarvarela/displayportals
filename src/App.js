import React, { useEffect, useState } from 'react'
import { screen, BrowserWindow, app } from '@electron/remote'
import styled from 'styled-components'
import Desktop from './components/Desktop'
import { Grommet, Button } from 'grommet'

function App() {

    const [screens, setScreens] = useState([])

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
    </Grommet>
}

export default App