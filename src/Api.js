import { screen, systemPreferences, Tray, Menu, app, BrowserWindow, IpcMain, ipcMain } from 'electron'
import robotjs from 'robotjs'
import path from 'path'
import storage from 'electron-json-storage'

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
                label: 'Settings', click: () => {
                    this.openMainWindow()
                }
            },
            {
                label: 'Quit', click: () => {
                    app.quit()
                }
            }
        ])

        this.tray.setContextMenu(menu)
    }

    setupIpc() {

        ipcMain.handle('getAllDisplays', async () => {
            return screen.getAllDisplays()
        })

        ipcMain.handle('getPortals', async () => {

            return this.getSetting('portals')
        })
    }

    openMainWindow() {

        if (this.mainWindow) {

            this.mainWindow.show()
        }
        else {
            // Create the browser window.
            this.window = new BrowserWindow({
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
            this.window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

            // Open the DevTools.
            this.window.webContents.openDevTools();
        }
    }

    async savePortal() {
        storage.set()

    }

    async setupStorage() {

        if (!await this.hasSetting({ key: 'portals' })) {
            await this.setSetting({ key: 'portals', data: [] })
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

        return screen.getAllDisplays()
    }

    async getPosition() {
        return robotjs.getMousePos()
    }

    async setPosition({ x, y }) {

        console.log('set position', arguments)
        return robotjs.moveMouse(x, y)
    }

    async start() {

        console.log('Setup mouse listener')

        setInterval(async () => {

            const pos = await this.getPosition()

            if (pos.x == 0 && pos.y == 0) {
                this.setPosition({ x: 400, y: 400 })
            }

        }, 100);
    }
}

export default Api