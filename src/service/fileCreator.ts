import * as fs from "fs"
import {v4 as uuidv4} from "uuid"
import moment from "moment"
import log from "electron-log"
import {randomData} from "./randomData"
import faker from "faker"
import path from "path";

export default class FileCreator {
  private randomData = randomData
  private randomDataLength = randomData.length - 1

  createFile(sourcePath: string, newPath: string): Promise<void> {
    const parsedPath =path.parse(newPath)
    const newFile = path.join(parsedPath.dir, parsedPath.name + "_" + uuidv4() + ".txt")

    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(sourcePath, {encoding: 'utf8'})
      const writeStream = fs.createWriteStream(newFile);


      const randomNumber = faker.random.number({min: 0, max: this.randomDataLength})
      const random: string[] = this.randomData[randomNumber].split(",")

      log.info(faker.date.past())
      readStream.on('data', data => {
        data = data.toString()
          .replace(/\[\[first_name\]\]/gi, faker.name.firstName())
          .replace(/\[\[last_name\]\]/gi, faker.name.lastName())
          .replace(/\[\[business_name\]\]/gi, faker.company.companyName())
          .replace(/\[\[street_number\]\]/gi, String(faker.random.number()))
          .replace(/\[\[street_address\]\]/gi, faker.address.streetName())
          .replace(/\[\[city\]\]/gi, faker.address.city())
          .replace(/\[\[random_2digits\]\]/gi, String(faker.random.number({min: 10, max: 99})))
          .replace(/\[\[random_4digits\]\]/gi, String(faker.random.number({min: 1000, max: 9999})))
          .replace(/\[\[random_6digits\]\]/gi, String(faker.random.number({min: 100000, max: 999999})))
          .replace(/\[\[phone_number\]\]/gi, faker.phone.phoneNumber())
          .replace(/\[\[email_address\]\]/gi, faker.internet.email())
          .replace(/\[\[job_type\]\]/gi, faker.name.jobTitle())
          .replace(/\[\[date_yyyymmdd\]\]/gi, moment(faker.date.past()).format("YYYY-MM-DD"))
          .replace(/\[\[date_yyyymm\]\]/gi, moment(faker.date.past()).format("YYYY-MM"))
          .replace(/\[\[date_yyyy\]\]/gi, moment(faker.date.past()).format("YYYY"))
          .replace(/\[\[social_insurance_number\]\]/gi, random[1])
          .replace(/\[\[province\]\]/gi, random[2])
          .replace(/\[\[postal_code_nospace\]\]/gi, random[0].replace(" ", ""))
          .replace(/\[\[postal_code_space\]\]/gi, random[0])
        writeStream.write(data, 'utf8');
      })

      readStream.on('error', (err) => {
        readStream.destroy()
        writeStream.end();
        reject(err)
      })

      readStream.on('close', () => {
        readStream.destroy()
        writeStream.end();
      })

      writeStream.on('finish', () => {
        resolve()
      });

      writeStream.on('error', function (err) {
        readStream.destroy()
        reject(err)
      });

    }).then(() => {
      log.debug("new file ", newFile, " created from ", sourcePath)
    }).catch((err) => {
      log.error("error while creating the new file from ", sourcePath, ": ", err)
    })
  }
}



