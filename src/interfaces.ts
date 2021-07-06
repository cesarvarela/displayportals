interface ISetting {
    key: string,
    data?: unknown,
}

interface IBounds {
    x: number,
    y: number,
    width: number,
    height: number,
}
interface INativeDisplay {
    left: number,
    top: number,
    width: number,
    height: number,
}

interface IDisplay {
    id: string,
    name: string,
    bounds: IBounds,
    number: string,
}

interface IPortal {
    id: string
    bounds: IBounds,
}

interface IConnection {
    from: IPortal,
    to: IPortal,
}

interface IPosition {
    x: number,
    y: number,
}


export { ISetting, IBounds, INativeDisplay, IDisplay, IConnection, IPosition, IPortal }