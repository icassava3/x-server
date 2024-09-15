import axios from "axios";
import { appCnx, fetchFromMsAccess, paramEtabObjet } from "../databases/accessDB";
import redisFunctions from "../databases/redis/functions";
import { fetchPrivateRoute } from "../helpers/apiClient";
import { PHOTOSHARE_BASE_URL } from "../helpers/constants";
import { IAccessConfig } from "../helpers/interfaces";
import { ISendStudentsPhotos } from "./interfaces";
const fs = require("fs");

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

const getAxiosData = (data: any): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      //   const axiosResult = await axios.post(`${PHOTOSHARE_BASE_URL}/receiveDataPhotoBase64`,data);
      const auth_token = null;
      const axiosResult = await axios({
        method: 'post',
        url: `${PHOTOSHARE_BASE_URL}/uploadstudentphotobase64`,
        data,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: { 'Authorization': `Bearer ${auth_token}`, 'Content-Type': 'application/json' },
        /* timeout: 2000, */
      });

      if (axiosResult && axiosResult.data.status === 1) {
        // console.log("axiosResult.status....",axiosResult.data.status);
        resolve(axiosResult.data.data);
      }
    } catch (error) {
      reject(false);
    }
  });
};


export const sendStudentsPhotos = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const anneeScolaire = paramObj.anscol1;
      const codeEtab = paramObj.codeetab;

      const sql = `SELECT RefElève AS idEleve,'' AS photo FROM Elèves `;
      const studentArray = await fetchFromMsAccess<ISendStudentsPhotos[]>(sql, appCnx);

      const result = [];
      // const studentResult={}
      await Promise.all(
        studentArray.map(async (item: ISendStudentsPhotos) => {
          result.push({
            ...item,
            photo: await getFileToBase64(`${item.idEleve}`),
          })
        })
      );

      const studentResult = {
        anneeScolaire: anneeScolaire,
        codeEtab: codeEtab,
        photoDir: "eleves",
        datas: result
      }

      //    const url = `${PHOTOSHARE_BASE_URL}/receiveDataPhotoBase64`;
      //    const response = await fetchPrivateRoute(url, studentResult);

      console.log(`Befotre.getAxiosData ...`);
      const response = await getAxiosData(studentResult);
      console.log(`SendStudentsPhotos.response ...`, response);
      resolve(response);
    } catch (err) {
      reject(err)
    }
  })
}

/** 
 * 
*/
export function fetchEleves( studentIds: number[] | null = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT RefElève AS idEleve,nomElève AS nomEleve, prénomElève AS prenomEleve,RefClasse AS idClasse,'' AS photo FROM Elèves`;
      const sql = studentIds
        ? `${baseSql} WHERE Elèves.RefElève IN (${studentIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<ISendStudentsPhotos[]>(sql, appCnx);
      resolve(result);
    } catch (err) {
      reject(err)
    }
  })
}

export default {
  sendStudentsPhotos,
  fetchEleves
};