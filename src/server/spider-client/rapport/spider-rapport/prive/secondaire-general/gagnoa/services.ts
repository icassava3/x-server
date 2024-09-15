// import { paramEtabObjet } from '../../databases/accessDB';
import functions from "./functions";
import { IGenererElevesSecondaireGeneralRendement } from './interfaces';
import XlsxPopulate from "xlsx-populate"
import { AnyARecord } from 'dns';
import { paramEtabObjet } from "../../../../../../databases/accessDB";

const templatePath = process.env.NODE_ENV === "production"
    //@ts-ignore
    ? require("path").resolve(process.resourcesPath, 'templates', 'rapport_3trimestre_gagnoa.xlsx')
    : process.argv.slice(2)[0] === 'sqlite' //si le projet est lancé avec "yarn start-server"
        ? require("path").resolve(__dirname, '..', '..', '..', '..', 'templates', 'rapport_3trimestre_gagnoa.xlsx') //server mode
        : require("path").resolve('./', 'templates', 'rapport_3trimestre_gagnoa.xlsx')    
const downloadDir = "C:/SPIDER/spd_save_tmp"


/**
 * Générer la proportion des élèves n'ayant pas obtenus la moyenne au 1er trimestre
 * par niveau et par discipline au secondaire général
 * @returns 
 */

const genererRapport = (): Promise<any> => {
    // console.log("🚀 ~ genererRapport ~ data:", data)
    return new Promise(async (resolve, reject) => {
        try {
            // récupère et formate les données statistiques de la 1ère feuille du classeur excel ("Etab Rendement au général")
            const rapportData: any = await functions.rapport()
            console.log("🚀 ~ returnnewPromise ~ rapportData:", rapportData)
            const formatedStatRendement = formatStatistiqueScolaire(rapportData.chp1_B_1_a)
            console.log("🚀 ~ returnnewPromise ~ formatedStatRendement:", formatedStatRendement)

                var d = new Date();
                const name_report = "rapport_3trimestre_gagnoa"
                var datestring = d.getDate()  + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear()+ "_" +d.getHours() + "-" + d.getMinutes();
                const rapportNonRenseigne = name_report+"_"+ ""+ `${datestring}`
              
            const fileName = `${rapportNonRenseigne}.xlsx` //nom du fichier
            const filePath = `${downloadDir}/${fileName}` //chemin complet du fichier

            // Ouvre le template excel
            XlsxPopulate.fromFileAsync(templatePath)
                .then(workbook => {
                    // remplissage de la feuille 6 
                    const column = ['C', 'D', 'E', 'G', 'I', 'K', 'M',]

                    const worksheet = workbook.sheet("STATISTIQUES DES RESULTATS SCOLAIRES (3ème trimestre)");

                    const niveauxByRow = [
                        { row: 7, label: "6ème" }, { row: 8, label: "5ème" }, { row: 9, label: "4ème" }, { row: 10, label: "3ème" },
                        { row: 12, label: "2ndeA" }, { row: 13, label: "2ndeC" }, { row: 15, label: "1èreA" },
                        { row: 16, label: "1èreC" }, { row: 17, label: "1èreD" }, { row: 18, label: "TleA" },
                        { row: 19, label: "TleC" }, { row: 20, label: "TleD" }
                    ]
                    worksheet.cell(`B1`).value(`CHAPITRE || : RESULTATS SCOLAIRES ET LISTE DES MAJORS.`);
                    niveauxByRow.map((niveauItem) => {
                        const findStatRendement = formatedStatRendement.find((elt) => elt.label === niveauItem.label)
                        if (findStatRendement) {
                            column.map((col, index) => {
                                worksheet.cell(`${col}${niveauItem.row}`).value(findStatRendement.values[index]);
                            })
                        }

                    })

                    // remplissage de la feuil 2
                    // const columnMoy = ['C', 'D', 'F', 'G', 'I', 'J', 'L', 'M', 'O', 'P', 'R', 'S', 'U', 'V', 'X', 'Y', 'AA', 'AB', 'AD', 'AE', 'AG', 'AH']
                    // const worksheetMoy = workbook.sheet("Moy par discipline au général");
                    // const niveauxByRowMoy = [
                    //     { row: 7, label: "6ème", genre: "Féminin" },
                    //     { row: 8, label: "6ème", genre: "Masculin" },

                    //     { row: 10, label: "5ème", genre: "Féminin" },
                    //     { row: 11, label: "5ème", genre: "Masculin" },

                    //     { row: 13, label: "4ème", genre: "Féminin" },
                    //     { row: 14, label: "4ème", genre: "Masculin" },

                    //     { row: 16, label: "3ème", genre: "Féminin" },
                    //     { row: 17, label: "3ème", genre: "Masculin" },

                    //     { row: 23, label: "2ndeA", genre: "Féminin" },
                    //     { row: 24, label: "2ndeA", genre: "Masculin" },

                    //     { row: 26, label: "2ndeC", genre: "Féminin" },
                    //     { row: 27, label: "2ndeC", genre: "Masculin" },

                    //     { row: 32, label: "1èreA", genre: "Féminin" },
                    //     { row: 33, label: "1èreA", genre: "Masculin" },

                    //     { row: 35, label: "1èreC", genre: "Féminin" },
                    //     { row: 36, label: "1èreC", genre: "Masculin" },

                    //     { row: 38, label: "1èreD", genre: "Féminin" },
                    //     { row: 39, label: "1èreD", genre: "Masculin" },

                    //     { row: 41, label: "TleA1", genre: "Féminin" },
                    //     { row: 42, label: "TleA1", genre: "Masculin" },

                    //     { row: 44, label: "TleA", genre: "Féminin" },
                    //     { row: 45, label: "TleA", genre: "Masculin" },

                    //     { row: 47, label: "TleC", genre: "Féminin" },
                    //     { row: 48, label: "TleC", genre: "Masculin" },

                    //     { row: 50, label: "TleD", genre: "Féminin" },
                    //     { row: 51, label: "TleD", genre: "Masculin" },
                    // ]
                    // niveauxByRowMoy.map((niveauItem) => {
                    //     const findStatMoyennes = formatedStatMoyennesDisciplines.find((elt) => elt.label === niveauItem.label && elt.genre === niveauItem.genre)
                    //     if (findStatMoyennes) {
                    //         columnMoy.map((col, index) => {
                    //             worksheetMoy.cell(`${col}${niveauItem.row}`).value(findStatMoyennes.newValues[index]);
                    //         })
                    //     }
                    // })
                    // enregistre le fichier dans le dossier temporaire
                    console.log("🚀 ~ returnnewPromise ~ filePath:", filePath)
                    workbook.toFileAsync(filePath);
                })
                .catch(error => {
                    console.log("🚀 ~ file: services.ts:109 ~ returnnewPromise ~ error", error)
                    return reject(error)
                })
                console.log("🚀 ~ returnnewPromise ~ fileName:", fileName)
            resolve(fileName)
        } catch (error) {
            console.log("🚀 ~ returnnewPromise ~ error:", error)
            return reject(error);
        }
    });
};

const formatStatistiqueScolaire = (data: any) => {
    console.log("🚀 ~ formatStatistiqueScolaire ~ data:", data)
    const finalData = data.map((item, i: number) => {
        // const label: any = item.Serie ? `${item.NiveauCourt}${item.Serie}` : item.NiveauCourt
        const { NombreClasse, TotalClasse, NombreMoySup10, NombreMoyInf10, NombreMoyInf8,MoyenneClasse} = item
        const values: any = [NombreClasse, TotalClasse, NombreMoySup10, NombreMoyInf10, NombreMoyInf8,MoyenneClasse]
        return {
            // label, 
            values
        }
    })
    console.log("🚀 ~ formatStatistiqueScolaire ~ finalData:", finalData)
    return finalData
}

export default {
    genererRapport,
}
