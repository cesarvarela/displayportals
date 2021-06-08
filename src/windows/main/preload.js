import { ipcRenderer, contextBridge, screen } from "electron";

contextBridge.exposeInMainWorld("mouseportals", {
    getAllDisplays: () => ipcRenderer.invoke("getAllDisplays"),
    getPortals: () => ipcRenderer.invoke("getPortals"),
});