import React, { useEffect } from 'react'
import { screen } from '@electron/remote'

function App() {

    useEffect(() => {

        console.log(screen.getAllDisplays())

    }, [])

    return <div> hoils</div>
}

export default App