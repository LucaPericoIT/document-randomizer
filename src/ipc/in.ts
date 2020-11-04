import {dialog, ipcMain, IpcMainInvokeEvent} from "electron";
import {createFileRequest, fileService} from "../service/fileService";
import log from "electron-log";

export const handleCreateFileRequest = () => {
    ipcInvoke('create-files-request', (event: IpcMainInvokeEvent, request: createFileRequest): Promise<string> => {
        return fileService.createFile(request.paths)
    })
};

export const handleOpenFileDialog = () => {
    ipcInvoke("open-file-dialog", (): Promise<string[]> => {
        return dialog.showOpenDialog({
            title: 'Select templates',
            defaultPath: __dirname,
            buttonLabel: 'Select',
            properties: ['openFile', 'openDirectory', 'multiSelections', 'showHiddenFiles']
        }).then(f => {
            if (!f.canceled) {
                return f.filePaths
            } else {
                return []
            }
        }).catch(err => {
            log.error("cannot load selected files", err)
            return []
        })
    })
};

function ipcInvoke(channel: string, callback: (event: IpcMainInvokeEvent, request: any) => Promise<any>) {
    ipcMain.handle(channel, callback)
}

