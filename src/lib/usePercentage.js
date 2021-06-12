import React, { useState } from 'react'
const { getDesktopSize } = window.mouseportals

export default function usePercentage() {

    const [converter, setConverter] = useState(null)

    useState(() => {

        async function load() {
            
            const size = await getDesktopSize()

            setConverter(() => {

                return ({ x, y, width, height }) => ({
                    width: width * 100 / size.x,
                    height: height * 100 / size.y,
                    x: x * 100 / size.x,
                    y: y * 100 / size.y,
                })
            })
        }

        load()

    }, [])

    return converter

}