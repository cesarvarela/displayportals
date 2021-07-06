import { IBounds, IPosition } from "../interfaces"

const toPercentageConverter = ({ max }: { max: IPosition }) => {

    return ({ x, y, width, height }: IBounds): IBounds => ({
        width: width * 100 / max.x,
        height: height * 100 / max.y,
        x: x * 100 / max.x,
        y: y * 100 / max.y,
    })
}

const percentage = (x: number): string => `${x}%`

export { percentage, toPercentageConverter }