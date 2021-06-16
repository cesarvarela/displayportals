import { Desktop } from 'grommet-icons'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import usePercentage from '../lib/usePercentage'
import { toPercentageConverter } from '../lib/utils'

const Wrapper = styled.div`
    background: ${({ color }) => color == 'blue' ? '#2ABBE8' : color == 'orange' ? '#F79321' : '#ccc'};
    position: absolute;
    opacity: .3;
    min-height: 10px;
    min-width: 10px;
    &:hover {
        opacity: 1 !important;
    }
    transition: all .5s;
`

function Portal({ connections, id, from, bounds, onClick, style = {}, className }) {

    const toPercentage = usePercentage()

    if (!toPercentage) {
        return null
    }

    const { x, y, width, height } = toPercentage(bounds)

    const position = {
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
    }

    const connected = connections.some(c => (c.from.id == id || c.to.id == id))

    if (connected) {

        const color = connections.some(c => (c.from.id == id)) ? 'orange' : 'blue'

        return <Wrapper className={className} color={color} style={{ ...position, ...style, opacity: 1, cursor: 'default', disabled: true }} />
    }

    const selected = from && from.id == id

    if (selected) {

        return <Wrapper className={className} color={'orange'} style={{ ...position, ...style, opacity: 1, cursor: 'default', disabled: true }} />
    }

    const color = from ? 'blue' : 'orange'

    return <Wrapper className={className} color={color} style={{ ...position, ...style, cursor: 'pointer' }} onClick={onClick} />
}

export default styled(Portal)``