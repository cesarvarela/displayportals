import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    position: absolute;
    border: 2px solid #f00;
    border-radius: 6px;
`

const percentage = (x) => `${x}%`

export default function Screen({ id, bounds, pixelBounds, percentBounds, absoluteBounds, scaleFactor }) {

    const style = {
        left: percentage(percentBounds.x),
        top: percentage(percentBounds.y),
        width: percentage(percentBounds.width),
        height: percentage(percentBounds.height),
    }

    return <Wrapper style={style}>
        {id}
        <br />
        electron: ({bounds.x},{bounds.y}) {bounds.width}x{bounds.height}
        <br />
        pixels: ({pixelBounds.x},{pixelBounds.y}) {pixelBounds.width}x{pixelBounds.height}
        <br />
        absolute: ({absoluteBounds.x},{absoluteBounds.y}) {absoluteBounds.width}x{absoluteBounds.height}
        <br />
        {scaleFactor}
    </Wrapper>
}
