import XlsxPopulate from "xlsx-populate";
import { paramEtabObjet } from '../../databases/accessDB';
import functions from "./functions";
import { IElevesSecondaireGeneralMoyennesParDiscipline, IElevesSecondaireGeneralRendementParDfaEtSexe, IElevesSecondaireGeneralRendementParDiscipline2, IElevesSecondaireGeneralRendementParTrancheMoyEtSexe, IGenererElevesSecondaireGeneralRendement } from './interfaces';
import { convertirFormatDate, getLibPeriod, merge2ArraysOfObjects, normalizeLib } from "../../../server/helpers/function";
var XLSX = require("xlsx");
const fs = require('fs');



const templateDir = process.env.NODE_ENV === "production"
    //@ts-ignore
    ? require("path").resolve(process.resourcesPath, 'templates')
    : process.argv.slice(2)[0] === 'sqlite' //si le projet est lancé avec "yarn start-server"
        ? require("path").resolve(__dirname, '..', '..', '..', '..', 'templates')    //server mode
        : require("path").resolve('./', 'templates')      //electron gui mode

const downloadDir = "C:/SPIDER/spd_save_tmp"

const niveauTleA1EreA = {
    "TleA": "TleA2",
    "1èreA": "1èreA2"
};

// ex: "12e" => 12, "5e" => 5
const extraireNombreDeRang = (rang: string | null) => {
    const match = rang?.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
}

//  PARTIE 1 : STATISTIQUES CIO RENDEMENT PAR TRIMESTRE 

/**
 * Formater les données avant de les insérer dans le fichier excel
 * @param data 
 * @returns 
 */

const formaterElevesSecondaireGeneralRendementParTrancheMoyEtSexe = (data: IElevesSecondaireGeneralRendementParTrancheMoyEtSexe[]) => {

    // let final = []
    const finalData = data.map((item) => {
        // const label: any = item.Serie ? `${item.NiveauCourt}${item.Serie}` : item.NiveauCourt
        const { FilleIns, GarcIns, FilleClass, GarcClass, FilleMoySup10,
            GarcMoySup10, FilleMoyEntr810, GarcMoyEntr810, FilleMoyInf8,
            GarcMoyInf8, libelleNiveauParSerie
        } = item
        // final = [...final, GarcClass+FilleClass, GarcMoySup10+FilleMoySup10, GarcMoyEntr810+FilleMoyEntr810, GarcMoyInf8+FilleMoyInf8]
        const values: any = [FilleIns, GarcIns, FilleClass, GarcClass, FilleMoySup10,
            GarcMoySup10, FilleMoyEntr810, GarcMoyEntr810, FilleMoyInf8, GarcMoyInf8]

        return { label: libelleNiveauParSerie, values }
    })
    return finalData
}
const formaterElevesSecondaireGeneralMoyennesParDisciplineEtSexe = (data2: IElevesSecondaireGeneralMoyennesParDiscipline[]) => {
    // Tle D -> 12, 1ère D -> 9, 2nde C -> 6
    const refTypeClasseArray = [6, 8, 9, 12]
    let dataFille = []
    let dataGarcon = []
    data2.map(item => {
        const label = item.libelleNiveauParSerie
        // const label: any = item.Serie ? `${item.NiveauCourt}${item.Serie}` : item.NiveauCourt
        const {
            Cycle, NiveauCourt, Serie, refTypeClasse,
            FilleCFClass, FilleCFInf10, FilleOGClass, FilleOGInf10, FilleANClass, FilleANInf10, FilleALLClass, FilleALLInf10,
            FilleESPClass, FilleESPInf10, FilleHGClass, FilleHGInf10, FilleMATHClass, FilleMATHInf10, FillePCClass,
            FillePCInf10, FilleSVTClass, FilleSVTInf10, FillePHILOClass, FillePHILOInf10, FilleFRClass, FilleFRInf10,
            GarcCFClass, GarcCFInf10, GarcOGClass, GarcOGInf10, GarcANClass, GarcANInf10, GarcALLClass, GarcALLInf10,
            GarcESPClass, GarcESPInf10, GarcHGClass, GarcHGInf10, GarcMATHClass, GarcMATHInf10, GarcPCClass,
            GarcPCInf10, GarcSVTClass, GarcSVTInf10, GarcPHILOClass, GarcPHILOInf10, GarcFRClass, GarcFRInf10,
        } = item
        const secondCycleClasse = ["Tle", "2nde", "1ère"]
        // Si on est au second cycle pour les garçons, on n'affiche pas composition francaise et orthographe grammaire, anglais et philo
        const newGarcCF1Class = Cycle === "2nd Cycle" ? null : GarcCFClass
        const newGarcCF1Inf10 = Cycle === "2nd Cycle" ? null : GarcCFInf10
        const newGarcOGClass = Cycle === "2nd Cycle" ? null : GarcOGClass
        const newGarcOG1Inf10 = Cycle === "2nd Cycle" ? null : GarcOGInf10
        const newGarcANInf10 = refTypeClasseArray.includes(refTypeClasse) ? null : GarcANInf10
        const newGarcANClass = refTypeClasseArray.includes(refTypeClasse) ? null : GarcANClass
        const newGarcPHILOInf10 = refTypeClasseArray.includes(refTypeClasse) ? null : GarcPHILOInf10
        const newGarcPHILOClass = refTypeClasseArray.includes(refTypeClasse) ? null : GarcPHILOClass
        //    Por les classes du second cycle littereiare on affiche pas les matières scientifiques
        const newGarcSVTClass = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : GarcSVTClass
        const newGarcSVTInf10 = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : GarcSVTInf10
        const newGarcPCClass = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : GarcPCClass
        const newGarcPCInf10 = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : GarcPCInf10
        // Pour le premier cycle on affiche pas la matière francais
        const newGarcFRClass = Cycle === "1er Cycle" ? null : refTypeClasseArray.includes(refTypeClasse) ? null : GarcFRClass
        const newGarcFRInf10 = Cycle === "1er Cycle" ? null : refTypeClasseArray.includes(refTypeClasse) ? null : GarcFRInf10

        // Si on est au second cycle pour les filles, on n'affiche pas composition francaise et orthographe grammaire, anglais et philo       
        const newFilleANInf10 = refTypeClasseArray.includes(refTypeClasse) ? null : FilleANInf10
        const newFilleANClass = refTypeClasseArray.includes(refTypeClasse) ? null : FilleANClass
        const newFillePHILOInf10 = refTypeClasseArray.includes(refTypeClasse) ? null : FillePHILOInf10
        const newFillePHILOClass = refTypeClasseArray.includes(refTypeClasse) ? null : FillePHILOClass
        const newFilleFRClass = Cycle === "1er Cycle" ? null : refTypeClasseArray.includes(refTypeClasse) ? null : FilleFRClass
        const newFilleFRInf10 = Cycle === "1er Cycle" ? null : refTypeClasseArray.includes(refTypeClasse) ? null : FilleFRInf10
        const newFilleCF1Class = Cycle === "2nd Cycle" ? null : FilleCFClass
        const newFilleCF1Inf10 = Cycle === "2nd Cycle" ? null : FilleCFInf10
        const newFilleOGClass = Cycle === "2nd Cycle" ? null : FilleOGClass
        const newFilleOG1Inf10 = Cycle === "2nd Cycle" ? null : FilleOGInf10
        //    Por les classes du second cycle littereiare on affiche pas les matières scientifiques
        const newFilleSVTClass = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : FilleSVTClass
        const newFilleSVTInf10 = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : FilleSVTInf10
        const newFillePCClass = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : FillePCClass
        const newFillePCInf10 = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : FillePCInf10

        const fille: any = [
            newFilleCF1Class, newFilleCF1Inf10, newFilleOGClass, newFilleOG1Inf10, newFilleANClass, newFilleANInf10, FilleALLClass, FilleALLInf10,
            FilleESPClass, FilleESPInf10, FilleHGClass, FilleHGInf10, FilleMATHClass, FilleMATHInf10, newFillePCClass,
            newFillePCInf10, newFilleSVTClass, newFilleSVTInf10, newFillePHILOClass, newFillePHILOInf10, newFilleFRClass, newFilleFRInf10
        ]
        const garcon: any = [
            newGarcCF1Class, newGarcCF1Inf10, newGarcOGClass, newGarcOG1Inf10, newGarcANClass, newGarcANInf10, GarcALLClass, GarcALLInf10,
            GarcESPClass, GarcESPInf10, GarcHGClass, GarcHGInf10, GarcMATHClass, GarcMATHInf10, newGarcPCClass,
            newGarcPCInf10, newGarcSVTClass, newGarcSVTInf10, newGarcPHILOClass, newGarcPHILOInf10, newGarcFRClass, newGarcFRInf10
        ]

        const newValuesFille = fille.map((val: any) => val === 0 ? null : val)
        const newValuesGarcon = garcon.map((val: any) => val === 0 ? null : val)


        dataFille.push({ label, newValues: newValuesFille, genre: "Féminin" })
        dataGarcon.push({ label, newValues: newValuesGarcon, genre: "Masculin" })


    })
    return [...dataFille, ...dataGarcon]
}



/**
 * Générer le récapitulatif des résultats des élèves par tranche de moyennes générales du 1er trimestre et par sexe au secondaire général
 * et la moyenne par discipline 
 * @returns 
 */
const genererElevesSecondaireGeneralStatCioRendement = (trimestre: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                anscol1, nomcompletetab, typeetab, decoupsemestres, drencomplet
            } = await paramEtabObjet(["Anscol1", "NomCompletEtab", "typeetab", "decoupSemestres", "DRENComplet"]);

            const path = require('path')
            const fileTime = new Date().toISOString().replace(/\D/g, '').substring(0, 14);
            const period = getLibPeriod(decoupsemestres, trimestre)
            const filePeriod = normalizeLib(period)
            const libEtab = normalizeLib(nomcompletetab)
            const fileName = `statCIO_${libEtab}_${filePeriod.toLocaleLowerCase()}_${anscol1}_${fileTime}.xlsx` //nom du fichier
            const downloadFilePath = `${downloadDir}/${fileName}` //chemin complet du fichier
            const filePath = path.join(templateDir, 'statsCioRendement.xlsx')



            // récupère et formate les données statistiques de la 1ère feuille du classeur excel ("Etab Rendement au général")
            const statRendement = await functions.getElevesSecondaireGeneralRendementParTrancheMoyEtSexe(trimestre)
            const formatedStatRendement = formaterElevesSecondaireGeneralRendementParTrancheMoyEtSexe(statRendement)

            // récupère et formate les données statistiques de la 2ème feuille du classeur excel ("Moy par discipline au général")
            const statMoyennesDisciplines = await functions.getElevesSecondaireGeneralMoyennesParDiscipline(trimestre)
            const formatedStatMoyennesDisciplines = formaterElevesSecondaireGeneralMoyennesParDisciplineEtSexe(statMoyennesDisciplines)


            // Ouvre le template excel
            XlsxPopulate.fromFileAsync(filePath)
                .then(workbook => {
                    // remplissage de la feuil 1
                    const column = ['E', 'F', 'H', 'I', 'N', 'P', 'T', 'V', 'Z', 'AB']

                    const worksheet = workbook.sheet("Etab Rendement au général");
                    const niveauxByRow = [
                        { row: 7, label: "6ème" }, { row: 8, label: "5ème" }, { row: 9, label: "4ème" }, { row: 10, label: "3ème" },
                        { row: 12, label: "2ndeA" }, { row: 13, label: "2ndeC" }, { row: 15, label: "1èreA" },
                        { row: 16, label: "1èreC" }, { row: 17, label: "1èreD" }, { row: 18, label: "TleA1" },
                        { row: 19, label: "TleA" }, { row: 20, label: "TleC" }, { row: 21, label: "TleD" }
                    ]

                    worksheet.cell(`B1`).value(`ANALYSE DU RENDEMENT DES ELEVES AU ${period} ${anscol1}`);
                    worksheet.cell(`A7`).value(drencomplet);
                    worksheet.cell(`B7`).value(nomcompletetab);
                    worksheet.cell(`C3`).value(
                        `Tableau 1: Récapitulatif des résultats des élèves par tranche de moyennes générales du ${period.toLowerCase()} et par sexe au secondaire général
                    `);
                    const typeEtab = typeetab && typeetab == "1" ? "Public" : "Privé"
                    worksheet.cell(`C7`).value(typeEtab);
                    niveauxByRow.map((niveauItem) => {
                        const findStatRendement = formatedStatRendement.find((elt) => elt.label === niveauItem.label)
                        if (findStatRendement) {
                            column.map((col, index) => {
                                worksheet.cell(`${col}${niveauItem.row}`).value(findStatRendement.values[index]);
                            })
                        }

                    })

                    // remplissage de la feuil 2
                    const columnMoy = ['C', 'D', 'F', 'G', 'I', 'J', 'L', 'M', 'O', 'P', 'R', 'S', 'U', 'V', 'X', 'Y', 'AA', 'AB', 'AD', 'AE', 'AG', 'AH']
                    const worksheetMoy = workbook.sheet("Moy par discipline au général");
                    const niveauxByRowMoy = [
                        { row: 7, label: "6ème", genre: "Féminin" },
                        { row: 8, label: "6ème", genre: "Masculin" },

                        { row: 10, label: "5ème", genre: "Féminin" },
                        { row: 11, label: "5ème", genre: "Masculin" },

                        { row: 13, label: "4ème", genre: "Féminin" },
                        { row: 14, label: "4ème", genre: "Masculin" },

                        { row: 16, label: "3ème", genre: "Féminin" },
                        { row: 17, label: "3ème", genre: "Masculin" },

                        { row: 23, label: "2ndeA", genre: "Féminin" },
                        { row: 24, label: "2ndeA", genre: "Masculin" },

                        { row: 26, label: "2ndeC", genre: "Féminin" },
                        { row: 27, label: "2ndeC", genre: "Masculin" },

                        { row: 32, label: "1èreA", genre: "Féminin" },
                        { row: 33, label: "1èreA", genre: "Masculin" },

                        { row: 35, label: "1èreC", genre: "Féminin" },
                        { row: 36, label: "1èreC", genre: "Masculin" },

                        { row: 38, label: "1èreD", genre: "Féminin" },
                        { row: 39, label: "1èreD", genre: "Masculin" },

                        { row: 41, label: "TleA1", genre: "Féminin" },
                        { row: 42, label: "TleA1", genre: "Masculin" },

                        { row: 44, label: "TleA", genre: "Féminin" },
                        { row: 45, label: "TleA", genre: "Masculin" },

                        { row: 47, label: "TleC", genre: "Féminin" },
                        { row: 48, label: "TleC", genre: "Masculin" },

                        { row: 50, label: "TleD", genre: "Féminin" },
                        { row: 51, label: "TleD", genre: "Masculin" },
                    ]

                    niveauxByRowMoy.map((niveauItem) => {
                        const findStatMoyennes = formatedStatMoyennesDisciplines.find((elt) => elt.label === niveauItem.label && elt.genre === niveauItem.genre)
                        if (findStatMoyennes) {
                            columnMoy.map((col, index) => {
                                worksheetMoy.cell(`${col}${niveauItem.row}`).value(findStatMoyennes.newValues[index]);
                            })
                        }

                    })
                    // enregistre le fichier dans le dossier temporaire
                    workbook.toFileAsync(downloadFilePath);
                })
                .catch(error => {
                    console.log("🚀 ~ file: services.ts:109 ~ returnnewPromise ~ error", error)
                    return reject(error)
                })

            resolve(fileName)
        } catch (error) {
            console.log("🚀 ~ file: services.ts:87 ~ returnnewPromise ~ error", error)
            return reject(error);
        }
    });

};

// ------------------------------------ FIN PARTIE 1 ---------------------------------------//


// PARTIE 2 :STATISTIQUES CIO RENDEMENT ANNUEL


const formaterElevesSecondaireGeneralRendementParDfaEtParSexeClasseIntermediaire = (data: IElevesSecondaireGeneralRendementParDfaEtSexe[]) => {
    const finalData = data.map((item) => {
        // const label: any = item.Serie ? `${item.NiveauCourt}${item.Serie}` : item.NiveauCourt
        const { FilleIns, GarcIns, FilleClass, GarcClass, FilleAdmise,
            GarcAdmis, FilleRedoublante, GarcRedoublant, FilleExclue,
            GarcExclu, libelleNiveauParSerie
        } = item
        const values: any = [FilleIns, GarcIns, FilleClass, GarcClass, FilleAdmise,
            GarcAdmis, FilleRedoublante, GarcRedoublant, FilleExclue, GarcExclu]

        return { label: libelleNiveauParSerie, values }
    })
    return finalData
}

const formaterElevesSecondaireGeneralRendementParDfaEtParSexeClasseExamen = (data: IElevesSecondaireGeneralRendementParDfaEtSexe[]) => {
    const finalData = data.map((item) => {
        // const label: any = item.Serie ? `${item.NiveauCourt}${item.Serie}` : item.NiveauCourt
        const { FilleIns, GarcIns, FilleClass, GarcClass, FilleRedoublante, GarcRedoublant, FilleExclue,
            GarcExclu, libelleNiveauParSerie
        } = item
        const values: any = [FilleIns, GarcIns, FilleClass, GarcClass, FilleRedoublante, GarcRedoublant, FilleExclue, GarcExclu]

        return { label: libelleNiveauParSerie, values }
    })
    return finalData
}

const formaterElevesSecondaireGeneralMoyennesParDisciplineEtSexeAnnuel = (data2: IElevesSecondaireGeneralMoyennesParDiscipline[]) => {
    // Tle D -> 12, 1ère D -> 9, 2nde C -> 6
    const refTypeClasseArray = [6, 8, 9, 12]
    let dataFille = []
    let dataGarcon = []
    data2.map(item => {
        // const label: any = item.Serie ? `${item.NiveauCourt}${item.Serie}` : item.NiveauCourt
        const {
            Cycle, NiveauCourt, Serie, refTypeClasse,
            FilleCFClass, FilleCFInf10, FilleOGClass, FilleOGInf10, FilleANClass, FilleANInf10, FilleALLClass, FilleALLInf10,
            FilleESPClass, FilleESPInf10, FilleHGClass, FilleHGInf10, FilleMATHClass, FilleMATHInf10, FillePCClass,
            FillePCInf10, FilleSVTClass, FilleSVTInf10, FillePHILOClass, FillePHILOInf10, FilleFRClass, FilleFRInf10,
            GarcCFClass, GarcCFInf10, GarcOGClass, GarcOGInf10, GarcANClass, GarcANInf10, GarcALLClass, GarcALLInf10,
            GarcESPClass, GarcESPInf10, GarcHGClass, GarcHGInf10, GarcMATHClass, GarcMATHInf10, GarcPCClass,
            GarcPCInf10, GarcSVTClass, GarcSVTInf10, GarcPHILOClass, GarcPHILOInf10, GarcFRClass, GarcFRInf10, libelleNiveauParSerie
        } = item
        const secondCycleClasse = ["Tle", "2nde", "1ère"]

        const newFilleESPClass = Cycle === "1er Cycle" ? null : FilleESPClass
        const newFilleESPInf10 = Cycle === "1er Cycle" ? null : FilleESPInf10
        const newFilleALLClass = Cycle === "1er Cycle" ? null : FilleALLClass
        const newFilleALLInf10 = Cycle === "1er Cycle" ? null : FilleALLInf10

        const newGarcESPClass = Cycle === "1er Cycle" ? null : GarcESPClass
        const newGarcESPInf10 = Cycle === "1er Cycle" ? null : GarcESPInf10
        const newGarcALLClass = Cycle === "1er Cycle" ? null : GarcALLClass
        const newGarcALLInf10 = Cycle === "1er Cycle" ? null : GarcALLInf10


        // Si on est au second cycle pour les garçons, on n'affiche pas composition francaise et orthographe grammaire, anglais et philo
        const newGarcCF1Class = Cycle === "2nd Cycle" ? null : GarcCFClass
        const newGarcCF1Inf10 = Cycle === "2nd Cycle" ? null : GarcCFInf10
        const newGarcOGClass = Cycle === "2nd Cycle" ? null : GarcOGClass
        const newGarcOG1Inf10 = Cycle === "2nd Cycle" ? null : GarcOGInf10
        const newGarcANInf10 = refTypeClasseArray.includes(refTypeClasse) ? null : GarcANInf10
        const newGarcANClass = refTypeClasseArray.includes(refTypeClasse) ? null : GarcANClass
        const newGarcPHILOInf10 = refTypeClasseArray.includes(refTypeClasse) ? null : GarcPHILOInf10
        const newGarcPHILOClass = refTypeClasseArray.includes(refTypeClasse) ? null : GarcPHILOClass
        //    Por les classes du second cycle littereiare on affiche pas les matières scientifiques
        const newGarcSVTClass = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : GarcSVTClass
        const newGarcSVTInf10 = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : GarcSVTInf10
        const newGarcPCClass = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : GarcPCClass
        const newGarcPCInf10 = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : GarcPCInf10
        // Pour le premier cycle on affiche pas la matière francais
        const newGarcFRClass = Cycle === "1er Cycle" ? null : refTypeClasseArray.includes(refTypeClasse) ? null : GarcFRClass
        const newGarcFRInf10 = Cycle === "1er Cycle" ? null : refTypeClasseArray.includes(refTypeClasse) ? null : GarcFRInf10

        // Si on est au second cycle pour les filles, on n'affiche pas composition francaise et orthographe grammaire, anglais et philo       
        const newFilleANInf10 = refTypeClasseArray.includes(refTypeClasse) ? null : FilleANInf10
        const newFilleANClass = refTypeClasseArray.includes(refTypeClasse) ? null : FilleANClass
        const newFillePHILOInf10 = refTypeClasseArray.includes(refTypeClasse) ? null : FillePHILOInf10
        const newFillePHILOClass = refTypeClasseArray.includes(refTypeClasse) ? null : FillePHILOClass
        const newFilleFRClass = Cycle === "1er Cycle" ? null : refTypeClasseArray.includes(refTypeClasse) ? null : FilleFRClass
        const newFilleFRInf10 = Cycle === "1er Cycle" ? null : refTypeClasseArray.includes(refTypeClasse) ? null : FilleFRInf10
        const newFilleCF1Class = Cycle === "2nd Cycle" ? null : FilleCFClass
        const newFilleCF1Inf10 = Cycle === "2nd Cycle" ? null : FilleCFInf10
        const newFilleOGClass = Cycle === "2nd Cycle" ? null : FilleOGClass
        const newFilleOG1Inf10 = Cycle === "2nd Cycle" ? null : FilleOGInf10
        //    Por les classes du second cycle littereiare on affiche pas les matières scientifiques
        const newFilleSVTClass = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : FilleSVTClass
        const newFilleSVTInf10 = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : FilleSVTInf10
        const newFillePCClass = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : FillePCClass
        const newFillePCInf10 = Cycle === "2nd Cycle" && secondCycleClasse.includes(NiveauCourt) && (Serie === "A" || Serie === "A1") ? null : FillePCInf10

        const fille: any = [
            newFilleCF1Class, newFilleCF1Inf10, newFilleOGClass, newFilleOG1Inf10, newFilleANClass, newFilleANInf10, newFilleALLClass, newFilleALLInf10,
            newFilleESPClass, newFilleESPInf10, FilleHGClass, FilleHGInf10, FilleMATHClass, FilleMATHInf10, newFillePCClass,
            newFillePCInf10, newFilleSVTClass, newFilleSVTInf10, newFillePHILOClass, newFillePHILOInf10, newFilleFRClass, newFilleFRInf10
        ]
        const garcon: any = [
            newGarcCF1Class, newGarcCF1Inf10, newGarcOGClass, newGarcOG1Inf10, newGarcANClass, newGarcANInf10, newGarcALLClass, newGarcALLInf10,
            newGarcESPClass, newGarcESPInf10, GarcHGClass, GarcHGInf10, GarcMATHClass, GarcMATHInf10, newGarcPCClass,
            newGarcPCInf10, newGarcSVTClass, newGarcSVTInf10, newGarcPHILOClass, newGarcPHILOInf10, newGarcFRClass, newGarcFRInf10
        ]

        const newValuesFille = fille.map((val: any) => val === 0 ? null : val)
        const newValuesGarcon = garcon.map((val: any) => val === 0 ? null : val)


        dataFille.push({ label: libelleNiveauParSerie, newValues: newValuesFille, genre: "Féminin" })
        dataGarcon.push({ label: libelleNiveauParSerie, newValues: newValuesGarcon, genre: "Masculin" })


    })
    return [...dataFille, ...dataGarcon]
}


/**
 * Générer le récapitulatif de la répartition des élèves des classes d'examen au secondaire général  par décision de fin d'année (DFA) selon le genre 
 * et la proportion d'élèves n'ayant pas obtenu la moyenne annuelle par niveau et par discipline au secondaire général selon le genre  
 * @returns 
 */
const genererElevesSecondaireGeneralStatCioRendementAnnuel = (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // Définition du trimestre (moyenne annuel)
            const trimestre = 4;

            // Récupération des données de l'établissement
            const {
                anscol1, nomcompletetab, typeetab, decoupsemestres, drencomplet
            } = await paramEtabObjet(["Anscol1", "NomCompletEtab", "typeetab", "decoupSemestres", "DRENComplet"]);

            const path = require('path')
            const fileTime = new Date().toISOString().replace(/\D/g, '').substring(0, 14);
            const libEtab = normalizeLib(nomcompletetab)
            const fileName = `statCIO_${libEtab}ANALYSE_RENDEMENT_ANNUEL_${anscol1}_${fileTime}.xlsx` //nom du fichier
            const downloadFilePath = `${downloadDir}/${fileName}` //chemin complet du fichier
            const filePath = path.join(templateDir, 'statsCioRendementAnnuel.xlsx')

            // récupérer et formater les données statistiques de la 1ère feuille du classeur excel ("Classes intermédiaires")
            const statRendement = await functions.getElevesSecondaireGeneralRendementParDfaEtParSexe(trimestre)
            const formaterStatRendementClasseIntermediaire = formaterElevesSecondaireGeneralRendementParDfaEtParSexeClasseIntermediaire(statRendement)

            // formater les données statistiques de la 2ème feuille du classeur excel ("Classes d'examen")
            const formaterStatRendementClasseExamen: any = formaterElevesSecondaireGeneralRendementParDfaEtParSexeClasseExamen(statRendement)

            // récupérer et formater les données statistiques de la 3ème feuille du classeur excel ("Moy par discipline au général")
            const statMoyennesDisciplines: any = await functions.getElevesSecondaireGeneralMoyennesParDiscipline(trimestre)
            const formatedStatMoyennesDisciplines: any = formaterElevesSecondaireGeneralMoyennesParDisciplineEtSexeAnnuel(statMoyennesDisciplines)

            // Ouvre le template excel
            XlsxPopulate.fromFileAsync(filePath)
                .then(workbook => {
                    const columnClasseIntermediaire = ['E', 'F', 'H', 'I', 'N', 'P', 'T', 'V', 'Z', 'AB']
                    const worksheetClasseIntermediaire = workbook.sheet("Classes intermédiaires");
                    const niveauxByRowClasseIntermediaire = [
                        { row: 7, label: "6ème" }, { row: 8, label: "5ème" }, { row: 9, label: "4ème" },
                        { row: 11, label: "2ndeA" }, { row: 12, label: "2ndeC" }, { row: 14, label: "1èreA" },
                        { row: 15, label: "1èreC" }, { row: 16, label: "1èreD" }
                    ]

                    worksheetClasseIntermediaire.cell(`B1`).value(`ANALYSE DU RENDEMENT ANNUEL DES ELEVES (${anscol1})`);
                    worksheetClasseIntermediaire.cell(`A7`).value(drencomplet);
                    worksheetClasseIntermediaire.cell(`B7`).value(nomcompletetab);
                    worksheetClasseIntermediaire.cell(`C3`).value(
                        `Tableau 1: Récapitulatif de la répartition des élèves des classes intermédiaires par décision de fin d'année (DFA) selon le genre
                    `);
                    const typeEtab = typeetab && typeetab == "1" ? "Public" : "Privé"
                    worksheetClasseIntermediaire.cell(`C7`).value(typeEtab);
                    niveauxByRowClasseIntermediaire.map((niveauItem) => {
                        const findStatRendement = formaterStatRendementClasseIntermediaire.find((elt) => elt.label === niveauItem.label)
                        if (findStatRendement) {
                            columnClasseIntermediaire.map((col, index) => {
                                worksheetClasseIntermediaire.cell(`${col}${niveauItem.row}`).value(findStatRendement.values[index]);
                            })
                        }

                    })

                    // remplissage de la feuil 2
                    const columnClasseExamen = ['E', 'F', 'H', 'I', 'N', 'P', 'T', 'V']

                    const worksheetClasseExamen = workbook.sheet("Classes d'examen");
                    const niveauxByRowClasseExamen = [
                        { row: 7, label: "3ème" }, { row: 9, label: "TleA1" }, { row: 10, label: "TleA" },
                        { row: 11, label: "TleC" }, { row: 12, label: "TleD" }
                    ]
                    worksheetClasseExamen.cell(`B1`).value(`ANALYSE DU RENDEMENT ANNUEL DES ELEVES (${anscol1})`);
                    worksheetClasseExamen.cell(`A7`).value(drencomplet);
                    worksheetClasseExamen.cell(`B7`).value(nomcompletetab);
                    worksheetClasseExamen.cell(`C3`).value(
                        `Tableau 2: Récapitulatif de la répartition des élèves des classes d'examen au secondaire général  par décision de fin d'année (DFA) selon le genre 
                    `);
                    worksheetClasseExamen.cell(`C7`).value(typeEtab);
                    niveauxByRowClasseExamen.map((niveauItem) => {
                        const findStatRendement = formaterStatRendementClasseExamen.find((elt) => elt.label === niveauItem.label)
                        if (findStatRendement) {
                            columnClasseExamen.map((col, index) => {
                                worksheetClasseExamen.cell(`${col}${niveauItem.row}`).value(findStatRendement.values[index]);
                            })
                        }
                    })

                    // remplissage de la feuil 3
                    const columnMoy = ['C', 'D', 'F', 'G', 'I', 'J', 'L', 'M', 'O', 'P', 'R', 'S', 'U', 'V', 'X', 'Y', 'AA', 'AB', 'AD', 'AE', 'AG', 'AH']
                    const worksheetMoy = workbook.sheet("Moy par discipline au général");

                    const niveauxByRowMoy = [
                        { row: 7, label: "6ème", genre: "Féminin" },
                        { row: 8, label: "6ème", genre: "Masculin" },

                        { row: 10, label: "5ème", genre: "Féminin" },
                        { row: 11, label: "5ème", genre: "Masculin" },

                        { row: 13, label: "4ème", genre: "Féminin" },
                        { row: 14, label: "4ème", genre: "Masculin" },

                        { row: 16, label: "3ème", genre: "Féminin" },
                        { row: 17, label: "3ème", genre: "Masculin" },

                        { row: 23, label: "2ndeA", genre: "Féminin" },
                        { row: 24, label: "2ndeA", genre: "Masculin" },

                        { row: 26, label: "2ndeC", genre: "Féminin" },
                        { row: 27, label: "2ndeC", genre: "Masculin" },

                        { row: 32, label: "1èreA", genre: "Féminin" },
                        { row: 33, label: "1èreA", genre: "Masculin" },

                        { row: 35, label: "1èreC", genre: "Féminin" },
                        { row: 36, label: "1èreC", genre: "Masculin" },

                        { row: 38, label: "1èreD", genre: "Féminin" },
                        { row: 39, label: "1èreD", genre: "Masculin" },

                        { row: 41, label: "TleA1", genre: "Féminin" },
                        { row: 42, label: "TleA1", genre: "Masculin" },

                        { row: 44, label: "TleA", genre: "Féminin" },
                        { row: 45, label: "TleA", genre: "Masculin" },

                        { row: 47, label: "TleC", genre: "Féminin" },
                        { row: 48, label: "TleC", genre: "Masculin" },

                        { row: 50, label: "TleD", genre: "Féminin" },
                        { row: 51, label: "TleD", genre: "Masculin" },
                    ]
                    // worksheetMoy.cell(`A6`).value(nomcompletetab);
                    worksheetMoy.cell(`A2`).value(
                        `Tableau 3: Proportion d'élèves n'ayant pas obtenu la moyenne annuelle par niveau et par discipline au secondaire général selon le genre `
                    );
                    niveauxByRowMoy.map((niveauItem) => {
                        const findStatMoyennes = formatedStatMoyennesDisciplines.find((elt) => elt.label === niveauItem.label && elt.genre === niveauItem.genre)
                        if (findStatMoyennes) {
                            columnMoy.map((col, index) => {
                                worksheetMoy.cell(`${col}${niveauItem.row}`).value(findStatMoyennes.newValues[index]);
                            })
                        }

                    })
                    // enregistre le fichier dans le dossier temporaire
                    workbook.toFileAsync(downloadFilePath);
                })
                .catch(error => {
                    console.log("🚀 ~ file: services.ts:441 ~ returnnewPromise ~ error:", error)
                    return reject(error)
                })
            resolve(fileName)
        } catch (error) {
            console.log("🚀 ~ file: services.ts:446 ~ returnnewPromise ~ error:", error)
            return reject(error);
        }
    });

};

// ------------------------------------ FIN PARTIE 2 ---------------------------------------//

// PARTIE 3: COLLECTE DE DONNEES STATISTIQUES PAR TRIMESTRE

const formaterElevesSecondaireGeneralRendementParDisciplineCollecte = (data: IElevesSecondaireGeneralRendementParDiscipline2[], periodeEval: number): string[] => {
    const finalData = data.map((item) => {
        // Pour obtenir 6EME ou 1EREA2
        const niveauFormater = normalizeLib(niveauTleA1EreA[item.libelleNiveauParSerie] || item.libelleNiveauParSerie).toUpperCase();
        const newSVT = ["2ndeA", "1èreA1", "1èreA2", "TleA1", "TleA2"].includes(niveauFormater) ? 22 : item[`SVT${periodeEval}`]
        const newPC = ["2ndeA", "1èreA1", "1èreA2", "TleA1", "TleA2"].includes(niveauFormater) ? 22 : item[`SP${periodeEval}`]
        const newPhilo = ["2ndeA", "2ndeC"].includes(niveauFormater) ? 22 : item[`PHILO${periodeEval}`]
        const newMGA = periodeEval === 3 ? item[`MOYG4_`] : ""
        const newRangMGA = periodeEval === 3 ? item[`RangG4_`] : ""

        const { matriculeEleve, nomEleve, prenomEleve, codeEtab,
            sexe, dateNaissance, cycle, dfa
        } = item
        const values: any = [matriculeEleve, nomEleve, prenomEleve, codeEtab, niveauFormater,
            sexe, cycle, item[`MATH${periodeEval}`], newPC, item[`AN${periodeEval}`],
            item[`ALL${periodeEval}`], item[`ESP${periodeEval}`], item[`HG${periodeEval}`], newSVT,
            item[`CF${periodeEval}`], item[`OG${periodeEval}`], item[`FR${periodeEval}`], newPhilo,
            item[`MOYG${periodeEval}`], extraireNombreDeRang(item[`RangG${periodeEval}`]), dfa, convertirFormatDate(dateNaissance), item[`COND${periodeEval}`], newMGA,
            extraireNombreDeRang(newRangMGA)
        ]

        return values
    })
    return [["matric", "Nom", "Prenoms", "CODE ETABL", "niveau", "sexe", "CYCLE", `MATH${periodeEval}`, `PHYS${periodeEval}`, `ANG${periodeEval}`, `ALL${periodeEval}`, `ESP${periodeEval}`, `HG${periodeEval}`, `SVT${periodeEval}`, `CF${periodeEval}`, `ORTH${periodeEval}`, `FRAN${periodeEval}`, `PHILO${periodeEval}`, `moytrim`, `Rang${periodeEval}`, `Red`, `DatNaiss`, `conduite${periodeEval}`, `MGA`, `Rang annuel`], ...finalData]
}

const genererElevesSecondaireGeneralStatCioCollecteDeDonnes = (trimestre: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            // C'est seulemnt quand on lance x-server en mode client qu'on exécute XLSX.set_fs(fs) sinon  ça crée une erreur
            const DATABASE_MODE: string = process.argv.slice(2)[0] || ""
            DATABASE_MODE === "" && XLSX.set_fs(fs);
            const { anscol1, nomcompletetab, decoupsemestres } = await paramEtabObjet([
                "Anscol1",
                "NomCompletEtab",
                "decoupSemestres"
            ]);

            const path = require('path')
            const period = getLibPeriod(decoupsemestres, trimestre)
            const libEtab = normalizeLib(nomcompletetab)
            const filePeriod = normalizeLib(period)
            const fileTime = new Date().toISOString().replace(/\D/g, '').substring(0, 14);
            const fileName = `COLLECTE_DE_DONNEES_TRIMESTRIELLES_${libEtab}_${filePeriod}_${anscol1}_${fileTime}.xlsx` //nom du fichier
            const downloadFilePath = `${downloadDir}/${fileName}` //chemin complet du fichier
            // Chemin vers le template du fichier collecteDonneesTrimestriel
            const filePath = path.join(templateDir, 'collecteDonneesTrimestriel.xlsx')

            // Récuperer les moyennes des élèves en local
            const eleveMoyGeneraleParDiscipline = await functions.getMoyennsParTrimEtParMatiere(trimestre)
            const elevesRang = await functions.fetchNotesGeneral(trimestre)
            const mergedData = merge2ArraysOfObjects(eleveMoyGeneraleParDiscipline, elevesRang, "idEleve")

            // On formate les données pour pouvoir l'écrire dans le fichier excel
            const formetedDataEleveMoyGeneraleParDiscipline = formaterElevesSecondaireGeneralRendementParDisciplineCollecte(mergedData, trimestre)

            XlsxPopulate.fromFileAsync(filePath)
                .then(workbook => {

                    // Remplissage de la feuille 1
                    const col2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y"]
                    const worksheetAbs = workbook.sheet("Fichier à renseigner");
                    formetedDataEleveMoyGeneraleParDiscipline.map((item: any, row: number) => {
                        col2.map((col, index) => {
                            worksheetAbs.cell(`${col}${row + 1}`).value(item[index]);
                        })
                    })


                    // Enregistrer le fichier et résoudre la promesse avec le nom du fichier
                    workbook.toFileAsync(downloadFilePath)
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


// ------------------------------------ FIN PARTIE 3 ---------------------------------------//

// PARTIE 4: SYNTHESE RAPPORT  TRIMESTRIEL ET RAPPORT ANNUEL ENSEINGEMENT SECONDAIRE PRIVE 


const formaterElevesSecondaireGeneralRendementParTrancheMoySynthese = (data: IElevesSecondaireGeneralRendementParTrancheMoyEtSexe[]) => {
    // let finalData = []
    const finalData = data.map((item) => {
        const { FilleIns, GarcIns, FilleClass, GarcClass, FilleMoySup10,
            GarcMoySup10, FilleMoyEntr810, GarcMoyEntr810, FilleMoyInf8,
            GarcMoyInf8, libelleNiveauParSerie
        } = item
        const values = [GarcClass + FilleClass, GarcMoySup10 + FilleMoySup10, GarcMoyEntr810 + FilleMoyEntr810, GarcMoyInf8 + FilleMoyInf8]
        return { label: libelleNiveauParSerie, values }
    })
    return finalData
}

const formaterElevesSecondaireGeneralRendementParTrancheMoyEtSexeSynthese = (data: IElevesSecondaireGeneralRendementParTrancheMoyEtSexe[]) => {
    const finalData = data.map((item) => {
        const { FilleIns, GarcIns, FilleClass, GarcClass, FilleMoySup10,
            GarcMoySup10, FilleMoyEntr810, GarcMoyEntr810, FilleMoyInf8,
            GarcMoyInf8, libelleNiveauParSerie
        } = item
        const values = [GarcClass + FilleClass, GarcMoySup10 + FilleMoySup10, FilleMoySup10, GarcMoySup10, FilleMoyEntr810 + GarcMoyEntr810, FilleMoyEntr810, GarcMoyEntr810, FilleMoyInf8 + GarcMoyInf8, FilleMoyInf8, GarcMoyInf8]
        return { label: libelleNiveauParSerie, values }
    })
    return finalData
}


const genererElevesSecondaireGeneralRendementSyntheseRapport = (trimestre: number, zone: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                anscol1, codeetab, nomcompletetab, typeetab, decoupsemestres, drencomplet
            } = await paramEtabObjet(["Anscol1", "CodeEtab", "NomCompletEtab", "typeetab", "decoupSemestres", "DRENComplet"]);

            const path = require('path')
            const fileTime = new Date().toISOString().replace(/\D/g, '').substring(0, 14);
            const period = getLibPeriod(decoupsemestres, trimestre)
            const filePeriod = normalizeLib(period)
            const libEtab = normalizeLib(nomcompletetab)
            const filePath = path.join(templateDir, 'syntheseRapportDRENA4.xlsx')
            const fileName = `SYNTHESE_RAPPORT_${libEtab}_${filePeriod.toLocaleLowerCase()}_${anscol1}_${fileTime}.xlsx` //nom du fichier
            const downloadFilePath = `${downloadDir}/${fileName}` //chemin complet du fichier

            // récupère et formate les données statistiques de la 1ère feuille du classeur excel
            const statRendementTrim = await functions.getElevesSecondaireGeneralRendementParTrancheMoyEtSexe(trimestre)
            // return resolve(statRendementTrim) 
            // const newStatRendementTrim = statRendementTrim.filter(item => !classeA1.includes(item.libelleNiveauParSerie))
            const formatedStatRendementTrim = formaterElevesSecondaireGeneralRendementParTrancheMoySynthese(statRendementTrim)
            // return resolve(formatedStatRendementTrim)
            const statRendementAnnuel = await functions.getElevesSecondaireGeneralRendementParTrancheMoyEtSexe(4)
            const formatedStatRendementAnnuel = formaterElevesSecondaireGeneralRendementParTrancheMoySynthese(statRendementAnnuel)

            const statRendementAnnuelParSexe = await functions.getElevesSecondaireGeneralRendementParTrancheMoyEtSexe(4)
            const formatedStatRendementAnnuelParSexe = formaterElevesSecondaireGeneralRendementParTrancheMoyEtSexeSynthese(statRendementAnnuelParSexe)

            // // Ouvre le template excel
            XlsxPopulate.fromFileAsync(filePath)
                .then(workbook => {
                    // remplissage de la feuille 1

                    const niveau = [
                        { label: "6ème", column: ['C', 'D', 'E', 'F'] },
                        { label: "5ème", column: ['G', 'H', 'I', 'J'] },
                        { label: "4ème", column: ['K', 'L', 'M', 'N'] },
                        { label: "3ème", column: ['O', 'P', 'Q', 'R'] },
                        { label: "2ndeA", column: ['S', 'T', 'U', 'V'] },
                        { label: "2ndeC", column: ['W', 'X', 'Y', 'Z'] },
                        { label: "1èreA", column: ['AA', 'AB', 'AC', 'AD'] },
                        { label: "1èreC", column: ['AE', 'AF', 'AG', 'AH'] },
                        { label: "1èreD", column: ['AI', 'AJ', 'AK', 'AL'] },
                        { label: "TleA", column: ['AM', 'AN', 'AO', 'AP'] },
                        { label: "TleC", column: ['AQ', 'AR', 'AS', 'AT'] },
                        { label: "TleD", column: ['AU', 'AV', 'AW', 'AX'] }
                    ]


                    const worksheet = workbook.sheet("STATISTIQUE 3e TRIM ");

                    // STATISTIQUE TRIMESTRIELLE 
                    worksheet.cell(`A1`).value(`STATISTIQUE ${period} ${anscol1}`);
                    worksheet.cell(`A5`).value(nomcompletetab);
                    worksheet.cell(`B5`).value(zone);
                    // column.map((col, index) => {
                    //     worksheet.cell(`${col}5`).value(formatedStatRendementTrim[index]);
                    // })
                    niveau.map(item => {
                        const findStat = formatedStatRendementTrim.find(elt => elt.label === item.label)
                        if (findStat) {
                            item.column.map((col: string, index: number) => {
                                worksheet.cell(`${col}5`).value(findStat.values[index]);
                            })
                        }
                    })

                    // STATISTIQUE ANNUELLE 
                    worksheet.cell(`A9`).value(`STATISTIQUE MOYENNE ANNUELLE ${anscol1}`);
                    worksheet.cell(`A13`).value(nomcompletetab);
                    worksheet.cell(`B13`).value(zone);
                    niveau.map(item => {
                        const findStat = formatedStatRendementAnnuel.find(elt => elt.label === item.label)
                        if (findStat) {
                            item.column.map((col: string, index: number) => {
                                worksheet.cell(`${col}13`).value(findStat.values[index]);
                            })
                        }
                    })



                    // // remplissage de la feuille 2

                    const niveauParSexe = [
                        { label: "6ème", column: ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] },
                        { label: "5ème", column: ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'] },
                        { label: "4ème", column: ['W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF'] },
                        { label: "3ème", column: ['AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP'] },
                        { label: "2ndeA", column: ['AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'] },
                        { label: "2ndeC", column: ['BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ'] },
                        { label: "1èreA", column: ['BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT'] },
                        { label: "1èreC", column: ['BU', 'BV', 'BW', 'BX', 'BY', 'BZ', 'CA', 'CB', 'CC', 'CD'] },
                        { label: "1èreD", column: ['CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN'] },
                        { label: "TleA", column: ['CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX'] },
                        { label: "TleC", column: ['CY', 'CZ', 'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH'] },
                        { label: "TleD", column: ['DI', 'DJ', 'DK', 'DL', 'DM', 'DN', 'DO', 'DP', 'DQ', 'DR'] }
                    ]
                    const worksheetAnnuel = workbook.sheet("STATISTIQUE ANNUEL");

                    worksheetAnnuel.cell(`A1`).value(`STATISTIQUE MOYENNE ANNUELLE ${anscol1}`);
                    worksheetAnnuel.cell(`A7`).value(nomcompletetab);
                    worksheetAnnuel.cell(`B7`).value(zone);

                    niveauParSexe.map(item => {
                        const findStat = formatedStatRendementAnnuelParSexe.find(elt => elt.label === item.label)
                        if (findStat) {
                            item.column.map((col: string, index: number) => {
                                worksheetAnnuel.cell(`${col}7`).value(findStat.values[index]);
                            })
                        }
                    })
                    // columnAnnuel.map((col, index) => {
                    //     worksheetAnnuel.cell(`${col}7`).value(formatedStatRendementAnnuelParSexe[index]);
                    // })

                    // enregistre le fichier dans le dossier temporaire
                    workbook.toFileAsync(downloadFilePath);
                })
                .catch(error => {
                    console.log("🚀 ~ file: services.ts:748 ~ returnnewPromise ~ error:", error)
                    return reject(error)
                })

            resolve(fileName)
        } catch (error) {
            console.log("🚀 ~ file: services.ts:754 ~ returnnewPromise ~ error:", error)
            return reject(error);
        }
    });

};



const getElevesSecondaireGeneralRendementParTrancheMoyEtSexe = (data: IGenererElevesSecondaireGeneralRendement) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { trimestre } = data
            const dd = await functions.getElevesSecondaireGeneralRendementParTrancheMoyEtSexe(trimestre)
            resolve(dd)
        } catch (error) {
            reject(error)
            console.log("🚀 ~ file: services.ts:283 ~ returnnewPromise ~ error:", error)

        }
    })
}

// const getElevesSecondaireGeneralMoyennesParDiscipline = (data: IGenererElevesSecondaireGeneralRendement) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const { trimestre } = data
//             const dd = await functions.getElevesSecondaireGeneralMoyennesParDiscipline(trimestre)
//             resolve(dd)
//         } catch (error) {
//             reject(error)
//             console.log("🚀 ~ file: services.ts:283 ~ returnnewPromise ~ error:", error)

//         }
//     })
// }




export default {
    genererElevesSecondaireGeneralStatCioRendement,
    genererElevesSecondaireGeneralStatCioRendementAnnuel,
    genererElevesSecondaireGeneralStatCioCollecteDeDonnes,
    genererElevesSecondaireGeneralRendementSyntheseRapport,
    getElevesSecondaireGeneralRendementParTrancheMoyEtSexe,
    // getElevesSecondaireGeneralMoyennesParDiscipline
}

