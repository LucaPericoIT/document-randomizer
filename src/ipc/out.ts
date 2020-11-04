import {IpcRenderer} from "electron";

export function requestOpenDialog(): Promise<string[]> {
    return getRenderer().invoke('open-file-dialog')
}

export function requestFileCreation(files: string[], clones: number): Promise<string> {
    return getRenderer().invoke('create-files-request', {paths: {files: files, count: clones}})
}


function getRenderer(): IpcRenderer {
    if (!window || !window.process || !window.require) {
        throw new Error(`Unable to require renderer process`);
    }
    return window.require('electron').ipcRenderer;
}
