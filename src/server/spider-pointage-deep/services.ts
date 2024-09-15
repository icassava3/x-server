import { _executeSql, _selectSql } from "../databases";
import { paramEtabObjet } from "../databases/accessDB";
import { merge2ArraysOfObjects } from "../helpers/function";
import functions from "../spider-school-control/functions";
import { IEleveClasse, IPersonnelFonction } from "../spider-school-control/interfaces";


export const fetchAllPointage = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM pointage";
        _selectSql(sql, [])
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error);
            });
    })
}

export const insertNewPointage = (req, res) => {
    return new Promise((resolve, reject) => {
        // try {
        const { matriculeEleve, nomEleve, codeEtab, nomEtab, anneeScolaire } =
            req.body;

        //inserer nouveau pointage
        const datePointage = new Date().toISOString();
        const sql = `INSERT INTO pointage (nomEleve,matriculeEleve, codeEtab,nomEtab,anneeScolaire,datePointage) VALUES (?, ?, ?, ? , ?, ?)`;
        const sqlParams = [
            nomEleve,
            matriculeEleve,
            codeEtab,
            nomEtab,
            anneeScolaire,
            datePointage,
        ];

        _executeSql(sql, sqlParams)
            .then((obj: { affectedRows: number, lastId: number }) => {
                const n = {
                    idPointage: obj.lastId,
                    datePointage: datePointage,
                    ...req.body,
                };
                resolve(n)
            })
            .catch((error) => {
                reject(error)
            });
    })
}

export const fetcAllPointageWithActitvite = (data) => {
    return new Promise(async (resolve, reject) => {
        // const sql = `
        // SELECT
        //     pointage.*,
        //     _activite_school_control.*
        // FROM 
        //     pointage
        //     INNER JOIN _activite_school_control ON _activite_school_control.idActivite=pointage.idActivite
        // WHERE _activite_school_control.idTypeActiviteSchoolControl=?
        // `;

        const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

        const sql = `SELECT pointage.*,_activite_school_control.* 
                        FROM pointage INNER JOIN _activite_school_control ON pointage.idActivite = _activite_school_control.idActivite 
                        WHERE pointage.codeEtab=? AND pointage.anneeScolaire=? 
                            AND  _activite_school_control.idActivite=?
                            AND _activite_school_control.idTypeActiviteSchoolControl=?
                            `
        const historiques = await _selectSql(sql, [codeetab, anscol1, data.idActivite, data.idTypeActiviteSchoolControl])
        if (!historiques.length) return resolve([]);
        let eleves = []
        const elevesIds = historiques
            .filter(item => item.idActivite !== 5)
            .map(item => item.idPersonne);

        if (elevesIds.length) {
            eleves = await functions.getEleveWithClasse(elevesIds) as IEleveClasse[];
        }

        let personnels = []
        const personnelIds = historiques
            .filter(item => item.idActivite === 5)
            .map(item => item.idPersonne);

        if (personnelIds.length) {
            personnels = await functions.getPersonnelWithFonction(personnelIds) as IPersonnelFonction[];
        }
        const mergedArray = merge2ArraysOfObjects(historiques, eleves, "idPersonne");


        // _selectSql(sql, [codeetab, anscol1, data.idActivite, data.idTypeActiviteSchoolControl])
        //     .then((result) => {
        //         resolve(result)
        //     })
        //     .catch((error) => {
        //         reject(error);
        //     });

        resolve(mergedArray)

    })
}

interface RootObject {
  idPointage: number;
  idActivite: number;
  idPersonne: number;
  codeEtab: string;
  anneeScolaire: string;
  operateur: string;
  datePointage: string;
  createdatetime: string;
  libelleActivite: string;
  descriptionActivite: string;
  idTypeActiviteSchoolControl: number;
  genre: number;
  nomEleve: string;
  prenomEleve: string;
  matriculeEleve: string;
  libelleClasseCourt: string;
  libelleClasseLong: string;
}
