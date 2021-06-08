import React from 'react'
import styled from 'styled-components'
import { percentage } from '../lib/utils'

const Wrapper = styled.div`
    position: absolute;
    border: 2px solid #999;
    border-radius: 6px;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 14px;
    overflow: hidden;
    background-color: #fff;
`

const Debug = styled.div`
    position: absolute;
    display: none;
`

const f = Math.floor

export default function Screen({ id, bounds, percentBounds, absoluteBounds, scaleFactor, editMode }) {

    const style = {
        left: percentage(percentBounds.x),
        top: percentage(percentBounds.y),
        width: percentage(percentBounds.width),
        height: percentage(percentBounds.height),
    }

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
    </Wrapper>
}
