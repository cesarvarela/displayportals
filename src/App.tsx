import React, { useEffect, useRef, useState, MouseEvent } from 'react'
import styled from 'styled-components'
import { Grommet, Box } from 'grommet'
import Screen from './components/Screen'
import Portal from './components/Portal'
import Connection from './components/Connection'
import theme from './theme'
import Header from './components/Header'
import { IBounds, IConnection, IDisplay, IPortal, } from './interfaces'

interface IMousePortals {
    getDesktopSize: () => Promise<IBounds>,
    getDisplays: () => Promise<IDisplay[]>,
    getConnections: () => Promise<IConnection[]>,
    addConnection: ({ from, to }: { from: IPortal, to: IPortal }) => Promise<IConnection[]>,
    removeConnection: ({ connection }: { connection: IConnection }) => Promise<IConnection[]>,
}

declare global { interface Window { mouseportals: IMousePortals } }

const { getDisplays, getConnections, addConnection, removeConnection } = window.mouseportals



const Desktop = styled.div<{ onClick: (event: MouseEvent<HTMLDivElement>) => void }> `
    position: relative;
    width: 100%;
    padding-top: 50%;
    height: 0;
    ${Portal} {
        opacity: 0;
    }
    &:hover {
        ${Portal} {
            opacity: .5;
        }
    }
`

function App(): JSX.Element {

    const desktopRef = useRef()
    const [screens, setScreens] = useState([])
    const [portals, setPortals] = useState([])
    const [from, setFrom] = useState(null)
    const [connections, setConnections] = useState([])

    useEffect(() => {

        const loadScreens = async () => {

            const normalized = await getDisplays()
            const portals = []
            const screens = []

            for (const screen of normalized) {

                screens.push({ ...screen })

                const topPortal = {
                    id: `${screen.id}-top`,
                    bounds: { ...screen.bounds, height: 10 },
                }

                const bottomPortal = {
                    id: `${screen.id}-bottom`,
                    bounds: { ...screen.bounds, y: screen.bounds.y + screen.bounds.height - 10, height: 10 },
                    style: { transform: 'translateY(-100%)' }
                }

                const leftPortal = {
                    id: `${screen.id}-left`,
                    bounds: { ...screen.bounds, width: 10 },
                }

                const rightPortal = {
                    id: `${screen.id}-right`,
                    bounds: { ...screen.bounds, x: screen.bounds.x + screen.bounds.width - 10, width: 10 },
                    style: { transform: 'translateX(-100%)' }
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

    const onPortalClick = async ({ portal }: { portal: IPortal }) => {

        if (!from) {
            setFrom(portal)
        }
        else {

            const connections = await addConnection({ from, to: portal })
            setConnections(connections)
            setFrom(null)
        }
    }

    const onTrashClick = async ({ connection }: { connection: IConnection }): Promise<void> => {

        const connections = await removeConnection({ connection })
        setConnections(connections)
    }

    const cancel = () => {

        setFrom(null)
    }

    const onDesktopClick = (e: MouseEvent<HTMLDivElement>) => {

        if (e.target == desktopRef.current) {
            cancel()
        }
    }

    return <Grommet full theme={theme}>

        <Box overflow="auto" align="center" justify="start" pad={{ "horizontal": "medium" }} direction="column" background={{ "color": "background-back" }} fill="vertical">

            <Header />

            <Box align="center" justify="start" flex="grow" fill="horizontal" >
                <Box align="center" justify="center" background={{ color: "background-front" }} round="xsmall" fill="horizontal" pad="medium">

                    {screens.length &&
                        <Desktop onClick={(e) => onDesktopClick(e)} ref={desktopRef}>
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
    </Grommet >
}

export default App