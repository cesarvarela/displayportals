import React from 'react'
import styled from 'styled-components'
import { percentage } from '../lib/utils'
import { Trash as TrashIcon } from 'grommet-icons'

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
    border: 2px solid #ccc;
`

const Wrapper = styled.div`
    position: absolute;
    pointer-events: none;
    min-width: 1%;
    min-height: 1%;
    svg {
        position: absolute;
        line {
            stroke: #ccc;
            stroke-width: 4;
            position: absolute;
        }
    }
    &:hover {
        ${Trash} {
            border: 2px solid #333;
        }

        svg {
            line {
                stroke: #333;
            }
        }
    }
`

export default function Connection({ connections, from, to, onClick }) {

    const fromMiddle = { x: from.left + from.width / 2, y: from.top + from.height / 2 }
    const toMiddle = { x: to.left + to.width / 2, y: to.top + to.height / 2 }

    let direction = (fromMiddle.x < toMiddle.x && fromMiddle.y < toMiddle.y) || (toMiddle.x < fromMiddle.x && toMiddle.y < fromMiddle.y)
        ? 'left' : 'right'

    const style = {
        left: percentage(Math.min(fromMiddle.x, toMiddle.x)),
        top: percentage(Math.min(fromMiddle.y, toMiddle.y)),
        width: percentage(Math.abs(toMiddle.x - fromMiddle.x)),
        height: percentage(Math.abs(toMiddle.y - fromMiddle.y)),
    }

    if (toMiddle.x == fromMiddle.x) {
        direction = 'vertical'
    }

    if (toMiddle.y == fromMiddle.y) {
        direction = 'horizontal'
    }

    return <Wrapper style={{ ...style }} diagonal={direction}>
        {direction == 'left' &&
            <svg height="100%" width="100%">
                <line x1="0" y1="0" x2="100%" y2="100%" />
            </svg>
        }

        {direction == 'right' &&
            <svg height="100%" width="100%">
                <line x1="100%" y1="0" x2="0" y2="100%" />
            </svg>
        }

        {direction == 'horizontal' &&
            <svg height="100%" width="100%">
                <line x1="0" y1="50%" x2="100%" y2="50%" />
            </svg>
        }

        {direction == 'vertical' &&
            <svg height="100%" width="100%">
                <line x1="50%" y1="0" x2="50%" y2="100%" />
            </svg>
        }
        <Trash onClick={onClick} >
            <TrashIcon className="icon" size="small" />
        </Trash>
    </Wrapper>
}