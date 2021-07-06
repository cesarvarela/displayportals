import { Tray, Menu, app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'
import storage from 'electron-json-storage'
import nativeDisplays from "displays"
import { ISetting, IBounds, INativeDisplay, IDisplay, IConnection, IPosition } from './interfaces'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

class Api {

    private mainWindow: BrowserWindow = null
    private tray: Tray = null
    private displays: any[] = null
    private desktopSize: any = null
    private desktopOffset: any = null
    private lastPortal: any = null
    private interval: NodeJS.Timer = null

    init(): void {

        console.log('init')

        this.setupDisplays()
        this.setupStorage()
        this.setupTray()
        this.setupIpc()

        this.openMainWindow()

        this.start()
    }

    async setupDisplays(): Promise<void> {
        const [displays, size, offset] = await this.detectDisplays()

        this.displays = displays
        this.desktopSize = size
        this.desktopOffset = offset
    }

    setupTray(): void {

        this.tray = new Tray(path.join(__dirname, 'assets', 'win-icon.png'));

        const menu = Menu.buildFromTemplate([
            {
                label: 'Settings',
                click: () => {
                    this.openMainWindow()
                }
            },
            {
                label: 'Open settings folder',
                click: () => {

                    shell.showItemInFolder(storage.getDefaultDataPath())
                }
            },
            {
                label: 'Quit',
                click: () => {
                    app.quit()
                }
            }
        ])

        this.tray.setContextMenu(menu)
    }

    setupIpc(): void {

        ipcMain.handle('getDisplays', async () => {
            return this.displays
        })

        ipcMain.handle('getDesktopSize', async () => {
            return this.desktopSize
        })

        ipcMain.handle('getConnections', async () => {

            return this.getConnections()
        })

        ipcMain.handle('addConnection', async (_, connection) => {

            return this.addConnection(connection)
        })

        ipcMain.handle('removeConnection', async (_, { connection }) => {

            return this.removeConnection({ connection })
        })

    }

    openMainWindow() {

        if (this.mainWindow && !this.mainWindow.isDestroyed()) {

            console.log('we')

            this.mainWindow.show()
        }
        else {

            console.log('wo')

            this.mainWindow = new BrowserWindow({
                width: 800,
                height: 600,
                icon: path.join(__dirname, 'win-icon.png'),
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: true,
                    enableRemoteModule: true,
                    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
                },
            });

            this.mainWindow.setMenu(null)
            this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

            if (!app.isPackaged) {

                this.mainWindow.webContents.openDevTools()
            }
        }
    }

    async addConnection({ from, to }: IConnection): Promise<IConnection[]> {

        const connections = await this.getSetting({ key: 'connections' })

        connections.push({ from, to })

        console.log("Added conection")

        await this.setSetting({ key: 'connections', data: connections })

        await this.restart()

        return connections
    }

    async removeConnection({ connection }: { connection: IConnection }): Promise<IConnection[]> {

        let connections = await this.getSetting({ key: 'connections' })

        connections = connections.filter((c: IConnection) => !(c.from.id == connection.from.id && c.to.id == connection.to.id))

        await this.setSetting({ key: 'connections', data: connections })

        console.log("Removed conection")

        await this.restart()

        return connections
    }

    async getConnections(): Promise<IConnection[]> {

        return this.getSetting({ key: 'connections' })
    }

    async setupStorage(): Promise<void> {

        if (!await this.hasSetting({ key: 'connections' })) {
            await this.setSetting({ key: 'connections', data: [] })
        }
    }

    async setSetting({ key, data }: ISetting): Promise<boolean> {

        return new Promise((resolve, reject) => {

            storage.set(key, data, (err: Error) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(true)
                }
            })
        })
    }

    async hasSetting({ key }: ISetting): Promise<boolean> {

        return new Promise((resolve, reject) => {

            storage.has(key, (err: Error, hasKey: boolean) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(hasKey)
                }
            })
        })
    }

    async getSetting({ key }: ISetting): Promise<any> {

        return new Promise((resolve, reject) => {

            storage.get(key, (err: Error, data: any) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })
        })
    }

    async detectDisplays(): Promise<[IDisplay[], IPosition, IPosition]> {

        const displays: INativeDisplay[] = nativeDisplays()
        const min = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER }
        const max = { x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER }

        let normalized = displays.map((display, index) => {

            const bounds = {
                x: display.left,
                y: display.top,
                width: display.width,
                height: display.height,
            }

            min.x = Math.min(bounds.x, min.x)
            min.y = Math.min(bounds.y, min.y)

            return ({
                id: `display-${index + 1}`,
                name: `${index + 1}`,
                bounds,
                number: `${index + 1}`,
            })
        })

        min.x = Math.abs(min.x)
        min.y = Math.abs(min.y)

        normalized = normalized.map(d => ({ ...d, bounds: { ...d.bounds, x: d.bounds.x + min.x, y: d.bounds.y + min.y } }))

        for (const screen of normalized) {
            const { bounds } = screen

            max.x = Math.max(bounds.x + bounds.width, max.x)
            max.y = Math.max(bounds.y + bounds.height, max.y)
        }

        return [normalized, max, min]
    }

    async restart() {

        console.log("Restarting...")

        await this.start()

        console.log("Restarted")
    }

    async start(): Promise<void> {

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const robotjs = require('robotjs')

        console.log("Starting...")

        const connections = await this.getConnections()

        console.log(`Loaded ${connections.length} connections.`)

        const contains = ({ bounds, pos: { x, y } }: { bounds: IBounds, pos: IPosition }) => {

            return bounds.x <= x && x <= bounds.x + bounds.width && bounds.y <= y && y <= bounds.y + bounds.height;
        }

        const abosolutePos = () => {

            const { x, y } = robotjs.getMousePos()

            return { x: x + this.desktopOffset.x, y: y + this.desktopOffset.y }
        }

        const relativeSet = ({ x, y }: IPosition) => {

            const rel = { x: x - this.desktopOffset.x, y: y - this.desktopOffset.y }

            robotjs.moveMouse(rel.x, rel.y)
            robotjs.moveMouse(rel.x, rel.y)
        }

        const direction = ({ bounds: { x, y, width, height } }: { bounds: IBounds }) => {

            return width > height ? 'horizontal' : 'vertical'
        }

        if (this.interval !== null) {

            clearInterval(this.interval)
        }

        this.interval = setInterval(async () => {

            const pos = abosolutePos()

            let from = null
            let to = null

            for (const connection of connections) {

                if (contains({ bounds: connection.from.bounds, pos })) {
                    from = connection.from
                    to = connection.to
                    break
                }
                else if (contains({ bounds: connection.to.bounds, pos })) {
                    from = connection.to
                    to = connection.from
                    break
                }
            }

            if (from == null && to == null) {
                this.lastPortal = null
            }

            if (this.lastPortal == null && from && to) {

                this.lastPortal = to
                const fromDirection = direction(from)
                const toDirection = direction(to);

                const result = `${fromDirection}:${toDirection}`

                switch (result) {


                    case 'vertical:horizontal': {

                        const ratio = 1 - Math.abs((from.bounds.y - pos.y) / from.bounds.height)
                        const target = { x: Math.round(to.bounds.x + to.bounds.width * ratio), y: to.bounds.y }

                        relativeSet(target)
                    }
                        break

                    case 'horizontal:vertical': {

                        const ratio = 1 - Math.abs((from.bounds.x - pos.x) / from.bounds.width)
                        const target = { x: to.bounds.x, y: Math.round(to.bounds.y + to.bounds.height * ratio) }

                        relativeSet(target)
                    }

                        break

                    case 'vertical:vertical': {

                        const ratio = Math.abs((from.bounds.y - pos.y) / from.bounds.height)
                        const target = { x: to.bounds.x, y: Math.round(to.bounds.y + to.bounds.height * ratio) }

                        relativeSet(target)
                    }

                        break

                    case 'horizontal:horizontal': {

                        const ratio = Math.abs((from.bounds.x - pos.x) / from.bounds.width)
                        const target = { x: Math.round(to.bounds.x + to.bounds.width * ratio), y: to.bounds.y }

                        relativeSet(target)
                    }

                        break
                }

                return
            }

        }, 0);
    }
}

export default Api
