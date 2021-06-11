import React from 'react'
import styled from 'styled-components'
import { percentage } from '../lib/utils'

const Wrapper = styled.div`
    background: ${({ color }) => color == 'blue' ? '#2ABBE8' : color == 'orange' ? '#F79321' : '#ccc'};
    position: absolute;
    opacity: .3;
    min-height: 10px;
    min-width: 10px;
    &:hover {
        opacity: 1;
    }
`

export default function Portal({ connections, id, from, x, y, width, height, onClick, style = {} }) {

    const position = {
        left: percentage(x),
        top: percentage(y),
        width: percentage(width),
        height: percentage(height),
    }

    const connected = connections.some(c => (c.from.id == id || c.to.id == id))

    if (connected) {

        const color = connections.some(c => (c.from.id == id)) ? 'orange' : 'blue'

        return <Wrapper color={color} style={{ ...position, ...style, opacity: 1, cursor: 'default', disabled: true }} />
    }

    const selected = from && from.id == id

    if (selected) {

        return <Wrapper color={'orange'} style={{ ...position, ...style, opacity: 1, cursor: 'default', disabled: true }} />
    }

    const color = from ? 'blue' : 'orange'

    return <Wrapper color={color} style={{ ...position, ...style, cursor: 'pointer' }} onClick={onClick} />
}