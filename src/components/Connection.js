import React from 'react'
import styled from 'styled-components'
import { percentage } from '../lib/utils'
import { Trash as TrashIcon } from 'grommet-icons'

const Wrapper = styled.div`
    position: absolute;
    pointer-events: none;
`



const Point = styled.div`
    width: 10px;
    height: 10px;
    background-color: #f00;
    position: absolute;
`

const Trash = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 100%;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`

export default function Connection({ connections, from, to, onClick }) {

    const fromMiddle = { x: from.left + from.width / 2, y: from.top + from.height / 2 }
    const toMiddle = { x: to.left + to.width / 2, y: to.top + to.height / 2 }

    const diagonal = (fromMiddle.x < toMiddle.x && fromMiddle.y < toMiddle.y) || (toMiddle.x < fromMiddle.x && toMiddle.y < fromMiddle.y)
        ? 'left' : 'right'

    const style = {
        left: percentage(Math.min(fromMiddle.x, toMiddle.x)),
        top: percentage(Math.min(fromMiddle.y, toMiddle.y)),
        width: percentage(Math.abs(toMiddle.x - fromMiddle.x)),
        height: percentage(Math.abs(toMiddle.y - fromMiddle.y)),
    }

    return <Wrapper style={{ ...style }} diagonal={diagonal}>
        {diagonal == 'left' &&
            <svg height="100%" width="100%">
                <line x1="0" y1="0" x2="100%" y2="100%" style={{ stroke: 'rgb(255,0,0)', strokeWidth: 2, position: "absolute" }} />
            </svg>
        }

        {diagonal == 'right' &&
            <svg height="100%" width="100%">
                <line x1="100%" y1="0" x2="0" y2="100%" style={{ stroke: 'rgb(255,0,0)', strokeWidth: 2, position: "absolute" }} />
            </svg>
        }
        <Trash >
            <TrashIcon className="icon" size="small" onClick={onClick} onClick={onClick} />
        </Trash>
    </Wrapper>
}