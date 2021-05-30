import React, { useEffect, useState } from 'react'
import { screen, BrowserWindow, getCurrentWindow } from '@electron/remote'
import styled from 'styled-components'
import Desktop from './components/Desktop'
import { Grommet, Button } from 'grommet'

const Drag = styled.div`
    width: 100&;
    height: 200px;
    background-color: #f00;
    -webkit-app-region: drag;
`

function Portal() {

    const onCloseClick = () => {
        getCurrentWindow().close()
    }

    return <Grommet>
        <Button label="Close" onClick={onCloseClick} />
        <Drag />
    </Grommet>
}

export default Portal