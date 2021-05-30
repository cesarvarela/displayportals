import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    position: absolute;
    border: 2px solid #f00;
    border-radius: 6px;
`

const percentage = (x, desktopSize) => `${x}%`

export default function Screen({ id, bounds, scaleFactor, desktopSize }) {

    console.log(scaleFactor, desktopSize)

    const width = percentage(bounds.width, desktopSize)
    const height = percentage(bounds.height, desktopSize)
    const left = percentage(bounds.x, desktopSize)
    const top = percentage(bounds.y, desktopSize)

    return <Wrapper style={{ left, top, width, height }} >{id}</Wrapper>
}
