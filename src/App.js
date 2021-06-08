import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Grommet, Button, Box, Header, List, Heading, Text } from 'grommet'
import { Add } from 'grommet-icons'
import Screen from './components/Screen'
import { absolutePosition, normalizeScreens } from './lib/utils'

const theme = {
    global: {
        colors: {
            brand: '#228BE6',
        },
        font: {
            family: 'Helvetica',
            size: '18px',
            height: '20px',
        },
    },
}

const Desktop = styled.div`
    position: relative;
    width: 100%;
    padding-top: 33.333%;
    height: 0;
`

const { getAllDisplays, getPortals } = window.mouseportals

function App() {

    const [screens, setScreens] = useState([])
    const [portals, setPortals] = useState([])
    const []

    useEffect(() => {

        const load = async () => {
            const result = await getAllDisplays()
            setScreens(normalizeScreens({ screens: result }))


        }

        load()
    }, [])

    const onDebugClick = () => {

    }

    return <Grommet theme={theme}>
        <Box fill="vertical" overflow="auto" align="center" flex="grow" justify="between" pad={{ "horizontal": "medium" }} direction="column">
            <Header align="center" direction="row" justify="between" gap="medium" fill="horizontal">
                <Heading textAlign="start" level="2" size="medium">
                    Mouse portals
          </Heading>
                <Button label="Button" />
            </Header>
            <Box align="center" justify="start" flex="grow" fill="horizontal">
                <Box align="center" justify="center" background={{ "color": "active-background" }} round="xsmall" fill="horizontal" pad="medium">
                    {screens.length && <Desktop>
                        {screens.map(s => <Screen key={s.id} {...s} />)}
                    </Desktop>}
                </Box>
                <Box align="stretch" justify="start" direction="column" fill="horizontal" flex="grow" pad={{ "vertical": "medium" }}>

                    {portals.length == 0
                        ?
                        <Box align="center" justify="center" direction="column" flex="grow" fill="horizontal" basis="small">
                            <Text margin="medium" weight="bold" color="dark-4">No portals yet, why not create one?</Text>
                            <Add size="large" color="dark-4" cursor="pointer" onClick />
                        </Box>
                        :
                        <>
                            <List data={[{ "name": "Eric", "count": 5 }, { "name": "Shimi", "count": 7 }]} />
                            <Box align="center" justify="start" direction="row" fill="horizontal" flex="shrink" width="xsmall" pad={{ "vertical": "large" }}>
                                <Button label="Add portal" icon={<Add />} primary size="medium" type="button" active={false} />
                            </Box>
                        </>
                    }

                </Box>
            </Box>
        </Box>
    </Grommet>
}

export default App