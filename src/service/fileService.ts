import * as path from "path";
import * as fs from "fs";
import {app} from "electron";
import FileCreator from "./fileCreator";

export interface createFileRequest {
    paths: request
}

interface request {
    files: string[]
    count: number
}

export default class FileService {
    private fileCreator: FileCreator

    constructor(fileCreator: FileCreator) {
        this.fileCreator = fileCreator
    }

    createFile(paths: request): Promise<string> {
        const newDir = path.join(app.getPath('home'), "generated_" + Date.now())
        fs.mkdirSync(newDir);

        return new Promise((resolve, rejects) => {
            const promises: Promise<void>[] = []
            paths.files.forEach((p: string) => {
                for (let i = 0; i < paths.count; i++) {
                    const filename = path.basename(p)
                    promises.push(this.fileCreator.createFile(p, path.join(newDir, filename + "_" + i)))
                }
            })

            return Promise.all([...promises])
                .then(() => resolve(newDir))
                .catch(err => rejects(err))
        })
    }
}

export const fileService = new FileService(new FileCreator())