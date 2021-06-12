import { ipcRenderer, contextBridge, screen } from "electron";

contextBridge.exposeInMainWorld("mouseportals", {
    getDisplays: () => ipcRenderer.invoke("getDisplays"),
    getDesktopSize: () => ipcRenderer.invoke("getDesktopSize"),
    getConnections: () => ipcRenderer.invoke("getConnections"),
    addConnection: (connection) => ipcRenderer.invoke("addConnection", connection),
    removeConnection: ({ connection }) => ipcRenderer.invoke("removeConnection", { connection }),
});