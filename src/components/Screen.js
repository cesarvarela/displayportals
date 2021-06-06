import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    position: absolute;
    border: 2px solid #f00;
    border-radius: 6px;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 14px;
`

const percentage = (x) => `${x}%`
const f = Math.floor

export default function Screen({ id, bounds, primaryBounds, percentBounds, absoluteBounds, scaleFactor }) {

    const style = {
        left: percentage(percentBounds.x),
        top: percentage(percentBounds.y),
        width: percentage(percentBounds.width),
        height: percentage(percentBounds.height),
    }

    return <Wrapper style={style}>
        {id}
        <br />
        electron: ({f(bounds.x)},{f(bounds.y)}) {f(bounds.width)}x{f(bounds.height)}
        <br />
        absolute: ({f(absoluteBounds.x)},{f(absoluteBounds.y)}) {f(absoluteBounds.width)}x{f(absoluteBounds.height)}
        <br />
        {scaleFactor}
    </Wrapper>
}
