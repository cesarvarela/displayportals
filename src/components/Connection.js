import React from 'react'
import styled from 'styled-components'
import { Button } from 'grommet'
import { Trash as TrashIcon } from 'grommet-icons'
import usePercentage from '../lib/usePercentage'

const TrashWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: auto;
`

const Trash = styled(Button)`
    background-color: #e8e8e8;
    padding: 6px;
    border-radius: 12px;
    svg {
        width: 18px;
        height: 18px;
    }
`

const Wrapper = styled.div`
    position: absolute;
    pointer-events: none;
    & > svg {
        position: absolute;
        line {
            stroke: #999999;
            stroke-width: 4;
            position: absolute;
        }
    }
    &:hover {
        & > svg {
            line {
                stroke: #666666;
            }
        }
    }
`

export default function Connection({ from, to, onClick }) {

    const toPercentage = usePercentage()

    if (!toPercentage) {
        return null
    }

    const fromMiddle = { x: from.bounds.x + from.bounds.width / 2, y: from.bounds.y + from.bounds.height / 2 }
    const toMiddle = { x: to.bounds.x + to.bounds.width / 2, y: to.bounds.y + to.bounds.height / 2 }

    let direction = (fromMiddle.x < toMiddle.x && fromMiddle.y < toMiddle.y) || (toMiddle.x < fromMiddle.x && toMiddle.y < fromMiddle.y)
        ? 'left' : 'right'

    const { x, y, width, height } = toPercentage({
        x: Math.min(fromMiddle.x, toMiddle.x),
        y: Math.min(fromMiddle.y, toMiddle.y),
        width: Math.abs(toMiddle.x - fromMiddle.x),
        height: Math.abs(toMiddle.y - fromMiddle.y),
    })

    const style = {
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
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
        <TrashWrapper>
            <Trash icon={<TrashIcon />} type="button" onClick={onClick} plain={false} color="dark-4" size="small" />
        </TrashWrapper>
    </Wrapper>
}