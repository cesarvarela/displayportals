import { ipcRenderer, contextBridge } from "electron";
import { IConnection } from "../../interfaces";

contextBridge.exposeInMainWorld("mouseportals", {
    getDisplays: () => ipcRenderer.invoke("getDisplays"),
    getDesktopSize: () => ipcRenderer.invoke("getDesktopSize"),
    getConnections: () => ipcRenderer.invoke("getConnections"),
    addConnection: (connection: IConnection) => ipcRenderer.invoke("addConnection", connection),
    removeConnection: ({ connection }: { connection: IConnection }) => ipcRenderer.invoke("removeConnection", { connection }),
});