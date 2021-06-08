import React from 'react'
import styled from 'styled-components'
import { percentage } from '../lib/utils'

const Wrapper = styled.div`
    background: ${({ color }) => color == 'blue' ? '#2ABBE8' : color == 'orange' ? '#F79321' : '#ccc'};
    position: absolute;
    opacity: .3;
    &:hover {
        opacity: 1;
    }
`

export default function Portal({ connections, id, from, left, top, width, height, onClick }) {

    const style = {
        left: percentage(left),
        top: percentage(top),
        width: percentage(width),
        height: percentage(height),
    }

    const connected = connections.some(c => (c.from.id == id || c.to.id == id))

    if (connected) {

        const color = connections.some(c => (c.from.id == id)) ? 'orange' : 'blue'

        return <Wrapper color={color} style={{ ...style, opacity: 1, cursor: 'default', disabled: true }} />
    }

    const selected = from && from.id == id

    if (selected) {

        return <Wrapper color={'orange'} style={{ ...style, opacity: 1, cursor: 'default', disabled: true }} />
    }

    const color = from ? 'blue' : 'orange'

    return <Wrapper color={color} style={{ ...style, cursor: 'pointer' }} onClick={onClick} />
}