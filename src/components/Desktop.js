import React, { createRef, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Screen from './Screen'

const Wrapper = styled.div`
    position: relative;
    height: 400px;
    width: 400px;
    background: #ff0;
`

export default function Desktop({ screens }) {

    const ref = useRef()
    const [size, setSize] = useState()

    useEffect(() => {

        setSize({ width: ref.current.clientWidth, height: ref.current.clientHeight })
    }, [])

    return <Wrapper ref={ref}>
        {screens.map(s => <Screen key={s.id} {...s} desktopSize={size} />)}
    </Wrapper>
}
