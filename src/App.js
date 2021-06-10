import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Grommet, Button, Box, Header, List, Heading, Text } from 'grommet'
import Screen from './components/Screen'
import { absolutePosition } from './lib/utils'
import Portal from './components/Portal'
import Connection from './components/Connection'

const { getAllDisplays, getConnections, addConnection, removeConnection } = window.mouseportals

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

function App() {

    const desktopRef = useRef()
    const [screens, setScreens] = useState([])
    const [portals, setPortals] = useState([])
    const [from, setFrom] = useState(null)
    const [connections, setConnections] = useState([])

    useEffect(() => {

        const loadScreens = async () => {

            const normalized = await getAllDisplays()
            let portals = []

            for (let screen of normalized) {

                const topPortal = {
                    id: `${screen.id}-top`,
                    left: screen.percentBounds.x,
                    top: screen.percentBounds.y,
                    width: screen.percentBounds.width,
                    height: screen.percentBounds.height / 10,
                }

                const bottomPortal = {
                    id: `${screen.id}-bottom`,
                    left: screen.percentBounds.x,
                    top: screen.percentBounds.y + screen.percentBounds.height - screen.percentBounds.height / 10,
                    width: screen.percentBounds.width,
                    height: screen.percentBounds.height / 10,
                }

                const leftPortal = {
                    id: `${screen.id}-left`,
                    left: screen.percentBounds.x,
                    top: screen.percentBounds.y,
                    width: screen.percentBounds.height / 30,
                    height: screen.percentBounds.height,
                }

                const rightPortal = {
                    id: `${screen.id}-right`,
                    left: screen.percentBounds.x + screen.percentBounds.width - screen.percentBounds.height / 30,
                    top: screen.percentBounds.y,
                    width: screen.percentBounds.height / 30,
                    height: screen.percentBounds.height,
                }

                portals.push(leftPortal)
                portals.push(topPortal)
                portals.push(rightPortal)
                portals.push(bottomPortal)
            }

            setPortals(portals)
            setScreens(normalized)
        }

        const loadConnections = async () => {

            const conenctions = await getConnections()
            setConnections(conenctions)
        }

        const load = async () => {

            await loadScreens()
            await loadConnections()
        }

        load()

    }, [])

    const onPortalClick = async ({ portal }) => {

        if (!from) {
            setFrom(portal)
        }
        else {

            addConnection({ from, to: portal })
            setConnections(c => [...c, { from, to: portal }])
            setFrom(null)
        }
    }

    const onTrashClick = async ({ connection }) => {

        const connections = await removeConnection({ connection })
        setConnections(connections)
    }

    const cancel = () => {

        setFrom(null)
    }

    const onDesktopClick = (e) => {

        if (e.target == desktopRef.current) {
            cancel()
        }
    }

    return <Grommet theme={theme}>
        <Box fill="vertical" overflow="auto" align="center" flex="grow" justify="between" pad={{ "horizontal": "medium" }} direction="column">
            <Header align="center" direction="row" justify="between" gap="medium" fill="horizontal">
                <Heading textAlign="start" level="2" size="medium">
                    Mouse portals
          </Heading>
            </Header>
            <Box align="center" justify="start" flex="grow" fill="horizontal">
                <Box align="center" justify="center" background={{ "color": "active-background" }} round="xsmall" fill="horizontal" pad="medium">

                    {screens.length &&
                        <Desktop onClick={onDesktopClick} ref={desktopRef}>
                            {screens.map((s, i) => <Screen key={s.id} index={i} {...s} />)}

                            {portals.map(portal => {

                                return <Portal
                                    key={portal.id}
                                    {...portal}
                                    from={from}
                                    connections={connections}
                                    onClick={() => onPortalClick({ portal })}
                                />
                            })}

                            {connections.map(connection => {

                                return <Connection key={connection.from.id + connection.to.id} {...connection} onClick={() => onTrashClick({ connection })} />
                            })}
                        </Desktop>
                    }

                </Box>
            </Box>
        </Box>
    </Grommet>
}

export default App