import { _executeSql, _selectSql } from "../databases";
import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../databases/accessDB";
import redisFunctions from "../databases/redis/functions";
import { getAllStatEtab } from "../helpers/function";
import { IAccessConfig } from "../helpers/interfaces";
import photoshareService from "../spider-photo-share/services";
import { checkWarehouseActivatedAndAuthorizedHddSerialNumber } from "../spider-whserver/services";
import Logger from "./../helpers/logger";
import functions from "./functions";
import {
  IClasseItem,
  IEmployeesPhotoUploadPayload,
  IPersPhotoForMobileApp,
  IPhotoUploadPayload,
  IReqQueryProgInfos,
  IStudentPhotoForMobileApp,
  IStudentPhotoInfos,
} from "./interfaces";

const fs = require("fs");
const AdmZip = require("adm-zip");
const fse = require("fs-extra");
const downloadDir = "C:/SPIDER/spd_save_tmp"
const path = require("path");


/**
 * Dezzipe un fichier json et retourne son contenu
 * @param req 
 * @returns 
 */
export const getJsonFromPhotosZipFile = (req): Promise<IPhotoUploadPayload> => {
  return new Promise<IPhotoUploadPayload>(async (resolve, reject) => {
    try {
      const reqFile = req.file
      const fileName = reqFile.originalname.replace(".zip", "");
      const folderPath = `${downloadDir}/${fileName}`;

      //creation du dossier pour récupérer les fihiers contenu dans le zip
      await fse.ensureDir(folderPath);

      //extraction des fihiers contenu dans le zip dans le dossier créé
      const zip = new AdmZip(reqFile.path);
      zip.extractAllTo(folderPath, true);

      // prendre soin de remplacer les backslashes par des forward slashes
      const file_path = path.join(folderPath, 'data.json').replace(/\\/g, '/');
      console.log("🚀 ~ file: services.ts:44 ~ returnnewPromise ~ file_path:", file_path)

      // lire le contenu du json
      const jsonData = JSON.parse(fs.readFileSync(file_path));

      // supprime le dossier decompressé contenant le fichier csv
      await fse.remove(folderPath);

      // supprime le zip
      await fse.remove(reqFile.path);

      resolve(jsonData);
    } catch (error) {
      console.log(
        ":fusée: ~ file: services.ts ~ line 55 ~ returnnewPromise ~ error",
        error
      );
      Logger.error("");
      reject(error);
    }
  });
};


/**
 *  Sauvegarder photos pour plusieurs eleves
 * @param data
 * @returns
 */
// export const bulkUploadStudentsPhoto_old = (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const {
//         socketId,
//         photographerId,
//         photographerName,
//         deviceModel,
//         codeEtab,
//         anScol,
//       } = data;

//       //verifier que le codeEtab et l'annee scolaire envoyé via payload correspond bien a la base active
//       const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
//       const currentAnScol = paramObj.anscol1;
//       const currentCodeEtab = paramObj.codeetab;

//       if (currentAnScol !== anScol || currentCodeEtab !== codeEtab) {
//         const message =
//           "Les données envoyées ne correspondent pas à la base de données en cours sur le serveur!";
//         const error = {
//           name: "DATABASE_NO_MATCH",
//           message: message,
//         };
//         // io.to(socketId).emit("new photo failed", error);
//         return reject(error);
//       }

//       const studentIds: number[] = [];
//       const studentsData: any[] = await Promise.all(
//         data.students.map(async (item) => {
//           const result = await savePhotoToDb(
//             item._id,
//             photographerId,
//             photographerName,
//             deviceModel,
//             currentAnScol,
//             currentCodeEtab
//           );
//           if (!result) {
//             return reject("Une erreur s'est produite");
//           }
//           savePhotoBase64(item._id, item.photo);
//           studentIds.push(item._id);
//           return result;
//         })
//       );
//       resolve(studentsData);
//     } catch (error) {
//       console.log(
//         "🚀 ~ file: services.ts ~ line 55 ~ returnnewPromise ~ error",
//         error
//       );
//       Logger.error("");
//       reject(error);
//     }
//   });
// };


export const bulkUploadStudentsPhoto = (data: IPhotoUploadPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { codeEtab, anScol } = data;
      //verifier que le codeEtab et l'annee scolaire envoyé via payload correspondent bien à la base chargée sur x-server
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const currentAnScol = paramObj.anscol1;
      const currentCodeEtab = paramObj.codeetab;
      if (currentAnScol !== anScol || currentCodeEtab !== codeEtab) {
        const message =
          "Les données envoyées ne correspondent pas à la base de données en cours sur le serveur!";
        const error = {
          name: "DATABASE_NO_MATCH",
          message: message,
        };
        return reject(error);
      }
      // sauvegarde groupée dans sqlite
      const studentsData = await bulkSavePhotoInfoToDb(data);
      // copie des photos sur le disque
      data.students.map(async (item) => { savePhotoBase64(item._id, item.photo); });

      resolve(studentsData);
    } catch (error) {
      console.log(
        ":fusée: ~ file: services.ts ~ line 55 ~ returnnewPromise ~ error",
        error
      );
      Logger.error("");
      reject(error);
    }
  });
};
export const bulkUploadEmployeesPhoto = (data: IEmployeesPhotoUploadPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { codeEtab, anScol } = data;
      //verifier que le codeEtab et l'annee scolaire envoyé via payload correspondent bien à la base chargée sur x-server
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const currentAnScol = paramObj.anscol1;
      const currentCodeEtab = paramObj.codeetab;
      if (currentAnScol !== anScol || currentCodeEtab !== codeEtab) {
        const message =
          "Les données envoyées ne correspondent pas à la base de données en cours sur le serveur!";
        const error = {
          name: "DATABASE_NO_MATCH",
          message: message,
        };
        return reject(error);
      }
      // sauvegarde groupée dans sqlite
      // const studentsData = await bulkSavePhotoInfoToDb(data);
      // copie des photos sur le disque
      data.employees.map(async (item) => savePhotoBase64(item._id, item.photo,'employee'));
      resolve(data.employees);
    } catch (error) {
      console.log("🚀 ~ file: services.ts:198 ~ returnnewPromise ~ error:", error)
      Logger.error("");
      reject(error);
    }
  });
};


export const uploadPhotosZipJson = async (req) => {
  return new Promise(async (resolve, reject) => {
    const io = (req as any).io;
    const data = await getJsonFromPhotosZipFile(req)
    const { socketId } = data;
    try {
      const studentsData = await bulkUploadStudentsPhoto(data)
      io.to(socketId).emit("new photo", studentsData);
      const accessConfig = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
      // Obtenir toutes les stats de l'établissement
      getAllStatEtab(accessConfig?.studentsPhotoDir, io);
      resolve(studentsData);
    } catch (error) {
      io.to(socketId).emit("new photo failed", error);
      reject(error)
    }
  });
};


/**
 * 
 * @param io 
 * @param reqBody 
 * @returns 
 */
export const uploadStudentPhoto = async (io, reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        socketId,
        studentId,
        photographerId,
        photographerName,
        deviceModel
      } = reqBody;

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const currentAnScol = paramObj.anscol1;
      const currentCodeEtab = paramObj.codeetab;

      const studentData: any = await functions.savePhotoToDb(
        studentId,
        photographerId,
        photographerName,
        deviceModel,
        currentAnScol,
        currentCodeEtab
      );
      const accessConfig = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
      // Obtenir toutes les stats de l'établissement
      getAllStatEtab(accessConfig?.studentsPhotoDir, io);

      //envoyer egalement la photo vers photoshare si l'ordinateur est le serveur autorisé
      try {
        await checkWarehouseActivatedAndAuthorizedHddSerialNumber()
        await photoshareService.sendStudentsPhotos(studentData.studentId);
      } catch (error) {
        console.log("🚀 ~ file: services.ts:537 ~ returnnewPromise ~ error:", error)
      }
      resolve(studentData);
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * recuperer données de programmation
 * @param data 
 * @returns 
 */
export const getProgInfos = async (data: { photographerId: string, photographerName: string }) => {
  const { photographerId, photographerName } = data;
  const paramObj = await paramEtabObjet(["CodeEtab", "NomEtabAbr", "Anscol1"]);
  let today = new Date();
  const todayDate = today.toISOString().slice(0, 10);
  const prog = {
    codeEtab: paramObj.codeetab,
    anScol: paramObj.anscol1,
    libEtab: paramObj.nometababr,
    progId: `PROG-${paramObj.codeetab}-${Date.now()}`,
    photographerId: photographerId,
    photographerName: photographerName,
    dateSeance: todayDate,
    dateProg: todayDate,
    photosDir: paramObj.nometababr
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/ /g, "_"),
  };
  return prog;
};

/**
 *
 * @param studentIds tableau de student id
 * @returns
 */
export const fetchStudents = async (studentIds: number[] | null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT Elèves.refElève AS _id, IIf(Elèves.[matriculeNational] is null AND Elèves.[matric_prov_dsps] is null,"", IIf(Elèves.[matriculeNational] is null,Elèves.[matric_prov_dsps],Elèves.[matriculeNational])) AS matricule, 
        Elèves.nomElève AS nom, Elèves.prénomElève AS prenom, Elèves.dateNaiss, 
        Classes.RefClasse AS idClasse, Classes.ClasseCourt AS classe
        FROM Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse`;

      const sql = studentIds
        ? `${baseSql} WHERE Elèves.RefElève IN (${studentIds.join(",")})`
        : baseSql;

      const data = await fetchFromMsAccess<IStudentPhotoForMobileApp[]>(
        sql,
        appCnx
      );

      const paramObj = await paramEtabObjet([
        "Anscol1",
        "NomEtabAbr",
        "CodeEtab",
      ]);

      const students = Promise.all(
        data.map(async (item: IStudentPhotoForMobileApp) => {
          const newItem: IStudentPhotoForMobileApp = {
            ...item,
            dateNaiss: new Date(item.dateNaiss).toISOString().substr(0, 10),
            classe: item.classe
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .replace(/ /g, "_"),
          };
          newItem.anScol = paramObj.anscol1;
          newItem.codeEtab = paramObj.codeetab;
          newItem.photoDir = paramObj.nometababr
            .replace(/\./g, "")
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .replace(/ /g, "_");
          return newItem;
        })
      );
      resolve(students);
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * retourne les informations liés au QRcode de prise de vue dans spider photo app
 * @param req
 * @returns
 */
export const getStudentPhotoInfosById = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {

      const studentId: number = req.params["studentId"];
      // TO DELETE 02/11/23
      //   const sql = `SELECT Elèves.refElève AS _id, IIf(Elèves.[matriculeNational] is null AND Elèves.[matric_prov_dsps] is null,"", IIf(Elèves.[matriculeNational] is null,Elèves.[matric_prov_dsps],Elèves.[matriculeNational])) AS matricule, 
      // Elèves.nomElève AS nom, Elèves.prénomElève AS prenom, Elèves.dateNaiss, 
      // Classes.RefClasse AS idClasse, Classes.ClasseCourt AS classe
      // FROM Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse
      // WHERE Elèves.RefElève=${studentId};
      //     `;
      //   const data = await fetchFromMsAccess<IStudentPhotoForMobileApp>(
      //     sql,
      //     appCnx
      //   );

      const studentData = await functions.getStudentPhotoInfosById(studentId)
      if (!studentData.length) return reject({ NAME: "NO_DATA_FOUND", message: "Aucune information trouvé sur cet élève" })

      const item = studentData[0];
      const newItem: IStudentPhotoForMobileApp = {
        ...item,
        dateNaiss: new Date(item.dateNaiss).toISOString().substr(0, 10),
        classe: item.classe
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .replace(/ /g, "_"),
      };
      const paramObj = await paramEtabObjet([
        "Anscol1",
        "NomEtabAbr",
        "CodeEtab",
      ]);
      /*  const paramSql = "SELECT * FROM params_etab_js WHERE param_name IN('Anscol1','NomEtabAbr')"
          const paramEtab = await fetchFromMsAccess<IParamEtabItem[]>(paramSql, dataCnx)
          const paramObj: { Anscol1?: string, NomEtabAbr?: string } = {}
          paramEtab.map((item: IParamEtabItem) => {
              paramObj[item.param_name] = item.param_value
          }) */
      newItem.anScol = paramObj.anscol1;
      newItem.codeEtab = paramObj.codeetab;
      newItem.photoDir = paramObj.nometababr
        .replace(/\./g, "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/ /g, "_");

      resolve(newItem);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * sauvegarder les infos de la photo dans la base sqlite
 */
export const bulkSavePhotoInfoToDb = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { students } = data;
      const studentIds = students.map(
        (x: { _id: string; photo: string }) => x._id
      );
      console.log("🚀 ~ file: services.ts:417 ~ returnnewPromise ~ studentIds:", studentIds)
      // récupère les infos de tous les élèves soumis, dans spider-app
      const matricOrMatricProv = await redisFunctions.getGlobalVariable("matricOrMatricProv");

      const studentSql = `SELECT cstr(RefElève) AS studentId, 
            ${matricOrMatricProv},
            NomElève & " " & PrénomElève AS nomPrenom, ClasseCourt AS classe
            FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
            WHERE Elèves.RefElève IN(${studentIds.join(",")});`;
      const studentArray: any = await fetchFromMsAccess<IStudentPhotoInfos[]>(
        studentSql,
        appCnx
      );
      if (studentArray.length < 1) {
        return reject(
          "Aucun élève correspondant n'a été trouvé dans la base de données chargée sur x-server"
        );
      }
      if (studentArray.length < studentIds.length) {
        return reject(
          "Certains élèves envoyés n'ont pas été trouvés dans la base de données chargée sur x-server"
        );
      }
      const datePhoto = new Date().toISOString();
      // construire les values
      const values = studentArray.map((item: IStudentPhotoInfos) => {
        return [
          `("${item.studentId}","${item.matricule}","${item.nomPrenom}","${item.classe}","${data.anScol}","${data.codeEtab}","${datePhoto}","${data.photographerId}","${data.photographerName}","${data.deviceModel}")`,
        ];
      });
      const sqlParams = [values.join(",")];
      const sql = `INSERT INTO photo (studentId, matricule, nomPrenom, classe,
                anneeScolaire,codeEtab, datePhoto, photographerId, photographerName, deviceModel)
                VALUES ${sqlParams}`;

      //insère dans la base sqlite
      const obj: any = await _executeSql(sql, []);
      // récupère les lignes dans la base sqlite
      const sql2 = `SELECT * FROM photo WHERE datePhoto='${datePhoto}'`;
      const records = await _selectSql(sql2, []);

      //envoyer egalement la photo vers photoshare si l'ordinateur est le serveur autorisé
      try {
        await checkWarehouseActivatedAndAuthorizedHddSerialNumber()
        photoshareService.sendStudentsPhotos(studentIds);
      } catch (error) {
        console.log("🚀 ~ file: services.ts:537 ~ returnnewPromise ~ error:", error)
      }

      resolve(records);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *  recuperer toutes les photos (lignes de photos) stocké en BD
 * @returns 
 */
export const fetchAllPhoto = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //TO DELETE 02/11/23 
      //const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      // const anScol = paramObj.anscol1;
      // const codeEtab = paramObj.codeetab;

      // const sql = `SELECT * FROM photo WHERE codeEtab='${codeEtab}' AND anneeScolaire='${anScol}' ORDER BY idPriseDeVue DESC`;
      // const result = await _selectSql(sql, []);
      const photos = await functions.fetchAllPhotoFromBD();
      resolve(photos);
    } catch (error) {
      reject(error);
    }
  });
};

export const getStudentPhotoForPhotoShare = (studentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const studentArray: any = await functions.getStudentDataForPhotoShare(
        studentId
      );
      const studentInfos = studentArray[0];
      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const studentData = {
        codeEtab: paramObj.codeetab,
        anScol: paramObj.anscol1,
        id: studentId,
        matricule: studentInfos.matricule,
        nom_pre: studentInfos.nomPrenom,
      };
      resolve(studentData);
    } catch (error) {
      reject(error);
    }
  });
};

const savePhotoBase64 = (id: string | number, photoBase64: string, type: "student" | 'employee' = 'student') => {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await redisFunctions.getGlobalVariable("accessConfig") as IAccessConfig;
      const buffer = Buffer.from(photoBase64, "base64");
      const photoPath = type === 'student'
        ? `${config.studentsPhotoDir}/${id}.jpg`
        : `${config.persPhotoDir}/${id}.jpg`

      fs.writeFile(
        photoPath,
        buffer,
        (err) => {
          if (err) reject(err);
          resolve(true);
        }
      );
    } catch (error) {
      console.log("error in savePhoto.....", error);
      reject(error);
    }
  });
};



/**
 * Récupération des infos,classes et elèves pour l'appli des photographes
 */
export const getProgData = (reqQuery: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prog = await getProgInfos(reqQuery)
      const eleves = await functions.fetchAllStudents();
      const classes = await functions.fetchAllClasses();
      const personnel = await functions.fetchAllPers();
      resolve({ prog, eleves, classes, personnel });
    } catch (error) {
      console.log("🚀 ~ file: controllers.ts ~ line 166 ~ returnnewPromise ~ error", error)
      reject(error)
    }
  })


};

export default {
  fetchAllPhoto,
  getStudentPhotoInfosById,
  fetchStudents,
  bulkUploadStudentsPhoto,
  getJsonFromPhotosZipFile,
  getProgData,
  bulkUploadEmployeesPhoto
};
