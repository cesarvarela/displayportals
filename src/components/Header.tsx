import React from 'react'
import { Box, Header as GrommetHeader, Image, Heading } from 'grommet'

export default function Header(): JSX.Element {

    return <GrommetHeader align="center" direction="row" justify="between" gap="medium" fill="horizontal">
        <Box align="center" justify="center" width="xxsmall">
            <Image src="https://raw.githubusercontent.com/cesarvarela/displayportals/main/src/images/logo-trimmed.png" fill="horizontal" />
        </Box>
        <Heading textAlign="start" level="2" size="medium">
            Display Portals
        </Heading>
    </GrommetHeader>
}