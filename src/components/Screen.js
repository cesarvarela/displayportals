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

const Number = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size:32px;
    font-weight: bold;
    color: #ccc;
`

export default function Screen({ id, number, bounds }) {

    const style = {
        left: percentage(bounds.x),
        top: percentage(bounds.y),
        width: percentage(bounds.width),
        height: percentage(bounds.height),
    }

    return <Wrapper style={style}>
        <Number>
            {number}
        </Number>
    </Wrapper>
}
