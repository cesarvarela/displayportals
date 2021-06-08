import React, { createRef, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { normalizeScreens } from '../lib/utils'
import Screen from './Screen'

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    padding-top: 33.333%;
    height: 0;
`

export default function Desktop({ screens }) {

    const [_screens, setScreens] = useState(normalizeScreens({ screens }))

    return <Wrapper>
        {_screens.map(s => <Screen key={s.id} {...s} />)}
    </Wrapper>
}
