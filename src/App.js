import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Desktop from './components/Desktop'
import { Grommet, Button, Box } from 'grommet'
import { absolutePosition } from './lib/utils'

const { getAllDisplays } = window.mouseportals

function App() {

    const [screens, setScreens] = useState([])

    useEffect(() => {

        const load = async () => {
            const result = await getAllDisplays()
            setScreens(result)
        }

        load()
    }, [])

    const onDebugClick = ()=> {
        
    }

    return <Grommet>
        <Box>
            {screens.length && <Desktop screens={screens} />}
        </Box>
        <Box>
            <Button label="debug window" />
        </Box>
    </Grommet>
}

export default App