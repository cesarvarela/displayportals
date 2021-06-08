import { ipcRenderer, contextBridge, screen } from "electron";

contextBridge.exposeInMainWorld("mouseportals", {
    getAllDisplays: () => ipcRenderer.invoke("getAllDisplays"),
    getConnections: () => ipcRenderer.invoke("getConnections"),
    addConnection: (connection) => ipcRenderer.invoke("addConnection", connection),
});