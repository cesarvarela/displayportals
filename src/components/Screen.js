import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    position: absolute;
    border: 2px solid #999;
    border-radius: 6px;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 14px;
    overflow: hidden;
`

const Portal = styled.div`
    cursor: pointer;
    background: #eee;
    position: absolute;
    &:hover {
        background: #ccc;
    }
`

const Debug = styled.div`
    position: absolute;
    display: none;
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

    const top = { height: 8, width: '100%', top: 0 }
    const bottom = { height: 8, width: '100%', bottom: 0 }
    const left = { width: 8, height: '100%', left: 0 }
    const right = { width: 8, height: '100%', right: 0 }

    return <Wrapper style={style}>
        <Debug>
            {id}
            <br />
                electron: ({f(bounds.x)},{f(bounds.y)}) {f(bounds.width)}x{f(bounds.height)}
            <br />
                absolute: ({f(absoluteBounds.x)},{f(absoluteBounds.y)}) {f(absoluteBounds.width)}x{f(absoluteBounds.height)}
            <br />
            {scaleFactor}
        </Debug>

        <Portal style={top} onClick={() => 1} />
        <Portal style={bottom} />
        <Portal style={left} />
        <Portal style={right} />

    </Wrapper>
}
