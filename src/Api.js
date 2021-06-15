import { screen, desktopCapturer, Tray, Menu, app, BrowserWindow, IpcMain, ipcMain, shell } from 'electron'
import robotjs from 'robotjs'
import path, { posix } from 'path'
import storage from 'electron-json-storage'
import nativeDisplays from "displays"

class Api {

    constructor() {
        this.mainWindow = null
        this.tray = null
        this.displays = null
        this.desktopSize = null
        this.desktopOffset = null
    }

    init() {
        this.setupDisplays()
        this.setupStorage()
        this.setupTray()
        this.setupIpc()

        this.openMainWindow()

        this.start()
    }

    async setupDisplays() {
        const [displays, size, offset] = await this.detectDisplays()

        this.displays = displays
        this.desktopSize = size
        this.desktopOffset = offset
    }

    setupTray() {

        this.tray = new Tray(path.join(__dirname, 'win-icon.png'));

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

    setupIpc() {

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
            this.mainWindow.show()
        }
        else {
            // Create the browser window.
            this.mainWindow = new BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: true,
                    enableRemoteModule: true,
                    preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
                },
            });

            // and load the index.html of the app.
            this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

            // Open the DevTools.
            this.mainWindow.webContents.openDevTools();
        }
    }

    async addConnection({ from, to }) {

        const connections = await this.getSetting({ key: 'connections' })

        connections.push({ from, to })

        await this.setSetting({ key: 'connections', data: connections })
    }

    async removeConnection({ connection }) {

        let connections = await this.getSetting({ key: 'connections' })

        connections = connections.filter(c => !(c.from.id == connection.from.id && c.to.id == connection.to.id))

        await this.setSetting({ key: 'connections', data: connections })

        return connections
    }

    async getConnections() {

        return this.getSetting({ key: 'connections' })
    }

    async setupStorage() {

        if (!await this.hasSetting({ key: 'connections' })) {
            await this.setSetting({ key: 'connections', data: [] })
        }
    }

    async setSetting({ key, data }) {

        return new Promise((resolve, reject) => {

            storage.set(key, data, (err) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve()
                }
            })
        })
    }

    async hasSetting({ key }) {

        return new Promise((resolve, reject) => {

            storage.has(key, (err, hasKey) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(hasKey)
                }
            })
        })
    }

    async getSetting({ key }) {

        return new Promise((resolve, reject) => {

            storage.get(key, (err, data) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(data)
                }
            })
        })
    }

    async detectDisplays() {

        const displays = nativeDisplays()
        const min = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER }
        const max = { x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER }

        let normalized = displays.map((display, index) => {

            const bounds = {
                x: display.left,
                y: display.top,
                width: display.width,
                height: display.height,
                scaleFactor: 1,
            }

            min.x = Math.min(bounds.x, min.x)
            min.y = Math.min(bounds.y, min.y)

            return ({
                id: index,
                name: index,
                bounds,
                number: index
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

    async start() {

        const connections = await this.getConnections()

        const contains = ({ bounds, pos: { x, y } }) => {

            return bounds.x <= x && x <= bounds.x + bounds.width && bounds.y <= y && y <= bounds.y + bounds.height;
        }

        const abosolutePos = () => {

            const { x, y } = robotjs.getMousePos()

            return { x: x + this.desktopOffset.x, y: y + this.desktopOffset.y }
        }

        const relativeSet = ({ x, y }) => {

            const rel = { x: x - this.desktopOffset.x, y: y - this.desktopOffset.y }

            console.log('relative pos', rel)

            // robotjs.moveMouse(rel.x, rel.y)
            robotjs.moveMouse(4500, 355)
        }

        const direction = ({ bounds: { x, y, width, height } }) => {

            return width > height ? 'horizontal' : 'vertical'
        }

        setInterval(async () => {

            const pos = abosolutePos()

            console.log(robotjs.getMousePos())

            for (const connection of connections) {

                const { from, to } = connection

                if (contains({ bounds: connection.from.bounds, pos })) {

                    const fromDirection = direction(connection.from)
                    const toDirection = direction(connection.to);

                    switch (`${fromDirection}:${toDirection}`) {

                        case 'vertical:horizontal':

                            const ratio = 1 - Math.abs((from.bounds.y - pos.y) / from.bounds.height)
                            const target = { x: Math.round(to.bounds.x + to.bounds.width * ratio), y: to.bounds.y + to.bounds.height + 1 }

                            // console.log(pos, fromDirection, toDirection, ratio, target)
                            relativeSet(target)
                            relativeSet(target)
                            // relativeSet({ x: 7365, y: 3526 })

                            break;

                        case 'horizontal:vertical':

                            break;
                    }
                }
                else if (contains({ bounds: connection.to.bounds, pos })) {

                    // console.log(pos)
                    // relativeSet(connection.from.bounds)
                }
            }

        }, 100); 0
    }
}

export default Api
