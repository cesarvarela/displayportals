import { useEffect, useState } from 'react'
import { IBounds } from '../interfaces'
const { getDesktopSize } = window.mouseportals

export default function usePercentage(): (bounds: IBounds) => IBounds {

    const [converter, setConverter] = useState(null)

    useEffect(() => {

        async function load() {

            const size = await getDesktopSize()

            setConverter(() => {

                return ({ x, y, width, height }: IBounds): IBounds => ({
                    width: width * 100 / size.x,
                    height: height * 100 / size.y,
                    x: x * 100 / size.x,
                    y: y * 100 / size.y,
                })
            })
        }

        load()

    }, [getDesktopSize])

    return converter
}