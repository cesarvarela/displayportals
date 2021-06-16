import React from 'react'
import { Box, Text } from 'grommet'
import usePercentage from '../lib/usePercentage'

export default function Screen({ number, bounds }) {

    const toPercentage = usePercentage()

    if (!toPercentage) {
        return null
    }

    const { x, y, width, height } = toPercentage(bounds)

    const style = {
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
    }

    return <Box align="center" justify="center" background={{ "color": "light-3" }} round="small" style={style} border={{ "color": "light-4", "size": "medium" }}>
        <Text textAlign="center" weight="bold" size="3xl" color="dark-6">
            {number}
        </Text>
    </Box>
}
