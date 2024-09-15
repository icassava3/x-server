import { _executeSql, _selectSql } from "../databases";
import { appCnx, fetchFromMsAccess, paramEtabObjet } from "../databases/accessDB";
import { IClasseItem, IPersPhotoForMobileApp, IStudentPhotoForMobileApp, IStudentPhotoInfos, IstudentDataPhotoShare } from "./interfaces";

export const getStudentDataForPhotoShare = (studentId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const studentSql = `SELECT RefElève AS studentId, IIf(Elèves.[matriculeNational] is null AND Elèves.[matric_prov_dsps] is null,"", IIf(Elèves.[matriculeNational] is null,Elèves.[matric_prov_dsps],Elèves.[matriculeNational])) as matricule, 
            NomElève & " " & PrénomElève AS nomPrenom
            FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
            WHERE Elèves.RefElève=${studentId};
            `;
            const studentArray: any = await fetchFromMsAccess<
                IstudentDataPhotoShare[]
            >(studentSql, appCnx);
            resolve(studentArray)
        } catch (error) {
            reject(error)
        }
    })
}


/**
 * retourner les eleves au format pour les prises de vue
 * @returns
 */
export async function fetchAllStudents(): Promise<IStudentPhotoForMobileApp[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const studentsSql = `SELECT refElève as _id,  IIf(Elèves.[matriculeNational] is null AND Elèves.[matric_prov_dsps] is null,"",
       IIf(Elèves.[matriculeNational] is null,Elèves.[matric_prov_dsps],Elèves.[matriculeNational])) as matricule,  
          nomElève as nom, prénomElève as prenom, dateNaiss, 
          classes.RefClasse as idClasse,[ClasseCourt] AS classe,"" AS photo
          FROM Elèves INNER JOIN Classes ON Elèves.RefClasse=Classes.RefClasse
          ORDER BY nomElève, PrénomElève, refElève;`;
            const studentsArray = await fetchFromMsAccess<IStudentPhotoForMobileApp[]>(
                studentsSql,
                appCnx
            );

            // j'enlève les accents et les espaces dans la classe
            const results = studentsArray.map((item: IStudentPhotoForMobileApp) => {
                return {
                    ...item,
                    classe: item.classe
                        .normalize("NFD")
                        .replace(/\p{Diacritic}/gu, "")
                        .replace(/ /g, "_"),
                };
            });
            resolve(results);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * retourner les classes au format pour les prises de vue
 * @returns
 */
export async function fetchAllClasses(): Promise<IClasseItem[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const classesSql = `SELECT Classes.RefClasse AS idClasse, 
          [ClasseCourt] AS classe, Classes.OrdreClasse 
          FROM Classes WHERE ClasseCourt is not null
          ORDER BY Classes.OrdreClasse;`;
            const classesArray = await fetchFromMsAccess<IClasseItem[]>(
                classesSql,
                appCnx
            );
            // j'enlève les accents et les espaces dans la classe
            const results = classesArray.map((item: IClasseItem) => {
                return {
                    ...item,
                    classe: item.classe
                        .normalize("NFD")
                        .replace(/\p{Diacritic}/gu, "")
                        .replace(/ /g, "_"),
                };
            });
            resolve(results);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * retourner la liste du personnel au format pour les prises de vue
 * @returns
 */
export async function fetchAllPers(): Promise<IPersPhotoForMobileApp[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const studentsSql = `SELECT Personnel.RefPersonnel AS _id, Personnel.NomPers AS nom, 
      Personnel.PrénomPers AS prenom, Fonction.Fonction as fonction, IIf([CelPers] Is Null,"",[CelPers]) AS phone
      FROM Personnel INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
      WHERE Personnel.PrénomPers Is Not Null AND Fonction.Fonction Is Not Null
      ORDER BY Personnel.NomPers, Personnel.PrénomPers
      `;
            const persArray = await fetchFromMsAccess<IPersPhotoForMobileApp[]>(
                studentsSql,
                appCnx
            );
            resolve(persArray);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * retourner les infos lié a un eleve suivant son Id
 * @param studentId l'id de l'eleve dans spider
 * @returns
 */
export async function getStudentPhotoInfosById(studentId: number): Promise<IStudentPhotoForMobileApp[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `SELECT Elèves.refElève AS _id, IIf(Elèves.[matriculeNational] is null AND Elèves.[matric_prov_dsps] is null,"", IIf(Elèves.[matriculeNational] is null,Elèves.[matric_prov_dsps],Elèves.[matriculeNational])) AS matricule, 
          Elèves.nomElève AS nom, Elèves.prénomElève AS prenom, Elèves.dateNaiss, 
          Classes.RefClasse AS idClasse, Classes.ClasseCourt AS classe
          FROM Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse
          WHERE Elèves.RefElève=${studentId};
              `;
            const result = await fetchFromMsAccess<IStudentPhotoForMobileApp[]>(
                sql,
                appCnx
            );
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * recuperer toutes les photos (lignes de photos) stocké en BD
 * @returns 
 */
export const fetchAllPhotoFromBD = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
        const anScol = paramObj.anscol1;
        const codeEtab = paramObj.codeetab;
        const sql = `SELECT * FROM photo WHERE codeEtab='${codeEtab}' AND anneeScolaire='${anScol}' ORDER BY idPriseDeVue DESC`;
        const result = await _selectSql(sql, []);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
 * sauvegarde les informations de  la photo prise sur l'application mobile
 * @param req
 * @returns retourne l'enregistrement inseré avec son Id
 */
export const savePhotoToDb = (
    studentId: number | string,
    photographerId: string,
    photographerName: string,
    deviceModel: string,
    anScol: string,
    codeEtab: string
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        // récupère les infos de lélève dans spider-app
        const studentSql = `SELECT cstr(RefElève) AS studentId, MatriculeNational as matricule, 
              NomElève & " " & PrénomElève AS nomPrenom, ClasseCourt AS classe
              FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
              WHERE Elèves.RefElève=${studentId};
              `;
        const studentArray: any = await fetchFromMsAccess<IStudentPhotoInfos[]>(
          studentSql,
          appCnx
        );
  
        if (studentArray.length !== 1) {
          return reject(
            "Les infos de l'élève n'ont pas pu être récupérer dans cet établissement"
          );
        }
  
        const studentInfos = studentArray[0];
        const { matricule, nomPrenom, classe } = studentInfos;
        const datePhoto = new Date().toISOString();
        //  const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
  
        const sql = `INSERT INTO photo (studentId, matricule, nomPrenom, classe,
                  anneeScolaire,codeEtab, datePhoto, photographerId, photographerName, deviceModel) 
                  VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?,?)`;
        const sqlParams = [
          studentInfos.studentId,
          matricule,
          nomPrenom,
          classe,
          anScol,
          codeEtab,
          datePhoto,
          photographerId,
          photographerName,
          deviceModel,
        ];
        //insère dans la base sqlite
        const obj: any = await _executeSql(sql, sqlParams);
        const { lastID } = obj;
  
        // récupère la ligne dans la base sqlite
        const sql2 = `SELECT * FROM photo WHERE idPriseDeVue=?`;
        const record = await _selectSql(sql2, [lastID]);
  
        resolve(record[0]);
      } catch (error) {
        reject(error);
      }
    });
  };

export default {
    getStudentDataForPhotoShare,
    fetchAllStudents,
    fetchAllClasses,
    fetchAllPers,
    getStudentPhotoInfosById,
    fetchAllPhotoFromBD,
    savePhotoToDb
};