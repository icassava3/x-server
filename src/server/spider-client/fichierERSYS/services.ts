import { convertDateToLocaleStringDate, merge2ArraysOfObjects } from "../../helpers/function";
var XLSX = require("xlsx");
const fs = require('fs');
import XlsxPopulate from "xlsx-populate"
import functions from "./functions";
import { paramEtabObjet } from "../../databases/accessDB";
const _ = require('lodash');
import { Request } from "express";


const templateDir = process.env.NODE_ENV === "production"
    //@ts-ignore
    ? require("path").resolve(process.resourcesPath, 'templates')
    : process.argv.slice(2)[0] === 'sqlite' //si le projet est lancé avec "yarn start-server"
        ? require("path").resolve(__dirname, '..', '..', '..', '..', 'templates')    //server mode
        : require("path").resolve('./', 'templates')      //electron gui mode


const downloadDir = "C:/SPIDER/spd_save_tmp"

const codeFiliere = {
    "AB": "TEC01",
    "B": "TEC13",
    "F1": "TEC08",
    "F2": "TEC09",
    "G1": "TEC02",
    "G2": "TEC03",
    "F7": "TEC12",
    "T3": "TEC06",
}

const genererFichierERSYS = (idPeriode: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // C'est seulemnt quand on lance x-server en mode client qu'on exécute XLSX.set_fs(fs) sinon  ça crée une erreur
            const DATABASE_MODE: string = process.argv.slice(2)[0] || ""
            DATABASE_MODE === "" && XLSX.set_fs(fs);

            const codeIpes = "037014"
            const { anscol1, codeetab, nomcompletetab } = await paramEtabObjet([
                "Anscol1",
                "CodeEtab",
                "NomCompletEtab"
            ]);
            let codeEtab = codeetab;
            if ((codeEtab !== codeIpes) && (codeEtab === "000346")) codeEtab = codeIpes;

            const comparerMatricules = (obj1, obj2) => obj1.MATRICULE === obj2.MATRICULE;
            const fileTime = new Date().toISOString().replace(/\D/g, '').substring(0, 14);
            const path = require('path')
            const fileName = `FICHIER_BASE_DES_INSCRITS_ERSYS_${anscol1}_${fileTime}.xlsx` //nom du fichier
            const fileOutput = `${downloadDir}/${fileName}` //chemin complet du fichier
            // Chemin vers le template du fichier ERSYS
            const filePath = path.join(templateDir, 'FICHIER_BASE_DES_INSCRITS_ERSYS_2023_2024.xlsx')
            // Lire le fichier XLSX
            const workbook = XLSX.readFile(filePath);

            // Sélectionner la première feuille
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convertir les données en JSON
            const ersysAllData = XLSX.utils.sheet_to_json(worksheet, { range: "A2:N132958" });

            // Récuperer les moyennes des élèves en local
            const eleveMoyGeneraleTech = await functions.getMoyennesGeneralesTechnique(idPeriode, codeEtab, anscol1, nomcompletetab)
            // Merger les moyennes des élèves en local et ceux en ligne à travers le matricule
            const mergedErsysEleveAndEtabEleve: any[] = merge2ArraysOfObjects(ersysAllData, eleveMoyGeneraleTech, "MATRICULE")
            //   Recuperer les élèves de l'etablissement sur ERSYS
            const eleveDeLetabSurERSYS = mergedErsysEleveAndEtabEleve.filter((item: any) => item["CODE ETABLISSEMENT"] === codeEtab)

            // Récupérer les données des élèves qui se trouvent en local mais pas sur ERSYS
            const eleveAbsSurFichERSYS = _.differenceWith(eleveMoyGeneraleTech, eleveDeLetabSurERSYS, comparerMatricules);

            //  Récupérer les données des élèves qui se trouve sur ERSYS mais pas en local 
            const elevePresentSurFichERSYSMaisPasEnLocal = _.differenceWith(eleveDeLetabSurERSYS, eleveMoyGeneraleTech, comparerMatricules);

            // On formate les données pour pouvoir l'écrire dans le fichier excel
            const formetedDataAppAbsSurERSYS = formatedData(eleveAbsSurFichERSYS, "LOCALUNIQUEMENT")
            const formetedDataAppSurERSYSPasPhysiq = formatedData(elevePresentSurFichERSYSMaisPasEnLocal, "ERSYSUNIQUEMENT")
            XlsxPopulate.fromFileAsync(filePath)
                .then(workbook => {
                    // Remplissage de la feuille 1
                    // On remplit que la colonne moyenne
                    const colonneMoyenne = "G"
                    const worksheetMoy = workbook.sheet("INS ERSYS 2023-2024");
                    mergedErsysEleveAndEtabEleve.map((item: any, row: number) => {
                        worksheetMoy.cell(`${colonneMoyenne}${row + 3}`).value(item?.moyenne || "");
                    })

                    // Remplissage de la feuille 2
                    const col2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"]
                    const worksheetAbs = workbook.sheet("APPRENANTS Abs sur Fich ERSYS");
                    formetedDataAppAbsSurERSYS.map((item: any, row: number) => {
                        col2.map((col, index) => {
                            worksheetAbs.cell(`${col}${row + 3}`).value(item[index]);
                        })
                    })

                    // Remplissage de la feuille 3
                    const worksheetPre = workbook.sheet("APPRENANTS sur ERSYS pas Physiq");
                    formetedDataAppSurERSYSPasPhysiq.map((item: any, row: number) => {
                        col2.map((col, index) => {
                            worksheetPre.cell(`${col}${row + 3}`).value(item[index]);
                        })
                    })
                    // Enregistrer le fichier et résoudre la promesse avec le nom du fichier
                    workbook.toFileAsync(fileOutput)
                        .then(() => {
                            resolve(fileName);
                        })
                        .catch(error => {
                            reject(error);
                        });
                })

        } catch (error) {
            console.log("🚀 ~ file: services.ts:111 ~ returnnewPromise ~ error:", error)
            return reject(error);
        }
    });

};



export const serverUrl = (req: Request, fichName: string) => {
    const url = `${req.protocol}://${req.get("host")}/download/${fichName}`;
    return url;
};

export const formatedData = (donnees: any[], type: string): any[][] => {
    const donneesFormatees: any[][] = [];

    donnees.forEach(item => {
        const formattedItem: any[] = [
            item["MATRICULE"] || "",
            item["NOM"] || "",
            item["PRENOMS"] || "",
            convertDateToLocaleStringDate(item["DATE NAISS"]) || "",
            item["LIEU DE NAISSANCE"] || "",
            item["GENRE"] || "",
            item["moyenne"] || "",
            item["CODE ETABLISSEMENT"] || "",
            item["ETABLISSEMENT"] || "",
            item["NIVEAU"] || "",
            item["DIPLOME"] || "",
            type !== "ERSYSUNIQUEMENT" ?
                ["2nde", "1ere", "Tle"].includes(item["NIVEAU"]) ? `SERIE ${item["SERIE"]}`
                    :
                    item["FILIERE"]
                :
                item["FILIERE"]
            ,
            type !== "ERSYSUNIQUEMENT" ? codeFiliere[item["SERIE"]] || "" : item["CODE FILIERE"] || "",
            item["STATUT DE VALIDATION"] || ""
        ];
        donneesFormatees.push(formattedItem);
    });

    return donneesFormatees;
};


export default {
    genererFichierERSYS
}

