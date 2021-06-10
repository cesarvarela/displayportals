import { screen, desktopCapturer, Tray, Menu, app, BrowserWindow, IpcMain, ipcMain, shell } from 'electron'
import robotjs from 'robotjs'
import path from 'path'
import storage from 'electron-json-storage'
import { normalizeScreens } from './lib/utils'

class Api {

    constructor() {
        this.mainWindow = null
        this.tray = null
    }

    init() {

        this.setupStorage()
        this.setupTray()
        this.setupIpc()

        this.openMainWindow()

        this.start()
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

        ipcMain.handle('getAllDisplays', async () => {
            return this.getAllDisplays()
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

    async getAllDisplays() {

        const desktops = await desktopCapturer.getSources({ types: ['screen'] })
        const displays = screen.getAllDisplays()
        const screens = displays.map(display => {

            const desktop = desktops.find(d => d.display_id == display.id)

            return ({ ...display, name: desktop.name, number: desktop.name.split(' ')[1] })
        })

        const normalized = normalizeScreens({ screens })

        return normalized
    }

    async getPosition() {
        return robotjs.getMousePos()
    }

    async setPosition({ x, y }) {

        console.log('set position', arguments)
        return robotjs.moveMouse(x, y)
    }

    async start() {

        setInterval(async () => {

            const pos = await this.getPosition()

            if (pos.x == 0 && pos.y == 0) {
                this.setPosition({ x: 400, y: 400 })
            }

        }, 100);
    }
}

export default Api