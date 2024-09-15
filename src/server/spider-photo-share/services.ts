import axios from "axios";
import { _executeSql, _selectSql } from "../databases";
import { paramEtabObjet } from "../databases/accessDB";
import functions from "./functions";
import { ISendStudentsPhotos } from "./interfaces";
import { PHOTOSHARE_BASE_URL, tmpDownloadDir } from '../helpers/constants';
import { IAccessConfig } from "../helpers/interfaces";
import redisFunctions from "../databases/redis/functions";

const fs = require("fs");
const archiver = require('archiver');
const FormData = require('form-data');



export const sendStudentsPhotosZip = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const AdmZip = require("adm-zip");
      const zip = new AdmZip();
      const { anscol1 } = await paramEtabObjet(["Anscol1"]);

      // const config = getAccessConfig();
      const config = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
      const photoDir = config.studentsPhotoDir;
      console.log("photoDir ++", photoDir)
      const zipName = `photos_eleves_${anscol1}.zip`;
      const zipPath = `${photoDir}${zipName}`;

      zip.addLocalFolder(photoDir);
      zip.writeZip(zipPath);
      const url = `${PHOTOSHARE_BASE_URL}/uploadstudentphotozip`;
      //envoyer les photos zippé a gain technologies
      let data: any = new FormData();
      data.append("zip_file", fs.createReadStream(zipName));
      const apiConfig: any = {
        method: "post",
        url: url,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data.boundary}`,
        },
        data: data,
      };
      resolve(true)
    } catch (err) {
      console.log("🚀 ~ file: services.ts ~ line 58 ~ returnnewPromise ~ err", err)
      reject(err);
    }
  })
};

/**
 * envoyer tous les photos des eleves par zip vers photoshare
 */
export const sendStudentsPhotosZipp = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1 } = await paramEtabObjet(["Anscol1"]);
      const config = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
      const photoDir = config.studentsPhotoDir;
      const zipName = `photos_eleves_${anscol1}.zip`;
      const destinationFolderName = `photos_eleves_${anscol1}`;
      // Create a new archive
      const archive = archiver('zip', {
        zlib: { level: 9 } // Set compression level
      });
      // Set the name of the ZIP file
      archive.directory(photoDir, destinationFolderName)

      //where to store the zip
      const zipPath = `${tmpDownloadDir}/${zipName}`;
      // Create a write stream for the ZIP file
      const output = fs.createWriteStream(zipPath);

      // When the ZIP file is finished writing, log a message
      output.on('close', () => {
        console.log(`${archive.pointer()} total bytes`);
        console.log(`ZIP file ${zipName} has been created`);
      });

      // When an error occurs, log the error message
      output.on('error', err => {
        console.error(err);
      });

      // Pipe the archive to the output stream
      archive.pipe(output);

      // Finalize the archive (this writes the ZIP file)
      archive.finalize();

      //envoyer le fichier zip ers photoshare
      const url = `${PHOTOSHARE_BASE_URL}/uploadstudentphotozip`;

      const form = new FormData();
      // const zipFile =  fs.createReadStream(path)
      form.append("zip_file", archive, zipName);
      await axios({
        method: "post",
        url,
        headers: {
          ...form.getHeaders(),
          "Content-Type": "multipart/form-data",
        },
        data: form,
      });

      resolve(true);


    } catch (err) {
      console.log("🚀 ~ file: services.ts ~ line 58 ~ returnnewPromise ~ err", err)
      reject(err);
    }
  })
};


export const sendStudentsPhotos = (studentIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const anneeScolaire = paramObj.anscol1;
      const codeEtab = paramObj.codeetab;
      const elevesList: any = await functions.fetchEleves(studentIds);

      //grouper les photos base64 des eleves par classe
      const groupByClass = {};
      await Promise.all(
        elevesList.map(async (item: ISendStudentsPhotos) => {
          const { idClasse } = item;
          if (!groupByClass[idClasse]) groupByClass[idClasse] = []; //
          const photoBse64 = await getFileToBase64(`${item.idEleve}`);
          if (photoBse64) groupByClass[idClasse].push({
            ...item,
            photo: photoBse64,
          });
        })
      );

      //envoyer les photos eleves par classe
      Promise.all(Object.values(groupByClass).map(async (itemClass:ISendStudentsPhotos[]) => {
        if(!itemClass.length) return
        const data = {
          anneeScolaire: anneeScolaire,
          codeEtab: codeEtab,
          photoDir: "eleves",
          datas: itemClass
        }
        const auth_token = null;
        await axios({
          method: 'post',
          url: `${PHOTOSHARE_BASE_URL}/uploadstudentphotobase64`,
          data,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          headers: { 'Authorization': `Bearer ${auth_token}`, 'Content-Type': 'application/json' },
          /* timeout: 2000, */
        }).catch(error => console.log("error", error));

      }));

      resolve(true);

    } catch (err) {
      console.log("🚀 ~ file: services.ts ~ line 58 ~ returnnewPromise ~ err", err)
      reject(err);
    }
  })
};

const getFileToBase64 = (fileName: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
      const photoDir = config.studentsPhotoDir;
      const file = `${photoDir}${fileName}.jpg`;
      //  console.log("file...", file)
      if (fs.existsSync(file)) {
        const fileBase64 = fs.readFileSync(file, 'base64');
        // console.log("fileBase64...", fileBase64);
        resolve(`${fileBase64}`);
      } else {
        // console.log('file not found')
        resolve('');
      }
    } catch (error) {
      reject(error)
    }
  });
};

export default {
  sendStudentsPhotos,
  sendStudentsPhotosZip
};
