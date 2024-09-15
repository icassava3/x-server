import { IMoyenneGeneral } from '../../spider-whserver/interfaces';
import { appCnx, fetchFromMsAccess, paramEtabObjet } from '../../databases/accessDB';



/**
 * Recupperer les moyennes generales pour les eleves du technique pour une periode donnée
 * @param periodeEval 
 * @returns 
 */
 export function getMoyennesGeneralesTechnique(periodeEval: number, codeEtab: string, anneeScolaire: string, nomCompletEtab: string): Promise<any> {
    console.log("🚀 ~ file: functions.ts:12 ~ getMoyennesGeneralesTechnique ~ codeEtab:", codeEtab)
    return new Promise<IMoyenneGeneral[]>(async (resolve, reject) => {
      try {
        // const { anscol1, codeetab, nomcompletetab  } = await paramEtabObjet([
        //   "Anscol1",
        //   "CodeEtab",
        //   "NomCompletEtab"
        // ]);


        const sql = `SELECT "${anneeScolaire}" AS anneeScolaire,"${codeEtab}" AS [CODE ETABLISSEMENT], "${nomCompletEtab}" AS ETABLISSEMENT, T_NotesTech.RefElève AS idEleve, T_NotesTech.MOYG_1 AS moyenne, T_NotesTech.RangG_1 AS rang, Elèves.MatriculeNational AS MATRICULE, Elèves.NomElève AS NOM, Elèves.PrénomElève AS PRENOMS, Elèves.DateNaiss AS [DATE NAISS], Elèves.LieuNaiss AS [LIEU DE NAISSANCE], IIf([Elèves].[Sexe]=1,"M","F") AS GENRE, Niveaux.NiveauCourt AS NIVEAU, Filières.Filière AS FILIERE, Diplomes.NomDiplome AS DIPLOME, TypesClasses.Série AS [SERIE]
        FROM (Filières INNER JOIN (((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN (Elèves INNER JOIN T_NotesTech ON Elèves.RefElève = T_NotesTech.RefElève) ON Classes.RefClasse = Elèves.RefClasse) ON Filières.RefFilière = TypesClasses.Filière) LEFT JOIN Diplomes ON Elèves.Id_Dipl = Diplomes.RefDiplome;
        `.replace(/1/g, periodeEval.toString());
        // const sql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS [CODE ETABLISSEMENT], "${nomcompletetab}" AS ETABLISSEMENT, T_NotesTech.RefElève AS idEleve, T_NotesTech.MOYG_1 AS moyenne, T_NotesTech.RangG_1 AS rang, Elèves.MatriculeNational AS MATRICULE, Elèves.NomElève AS NOM, Elèves.PrénomElève AS PRENOMS, Elèves.DateNaiss AS [DATE NAISS], Elèves.LieuNaiss AS [LIEU DE NAISSANCE], IIf([Elèves].[Sexe] = 1, "M", "F") AS GENRE, Niveaux.NiveauCourt AS [NIVEAU], Filières.filière AS [FILIERE], TypesClasses.Exam AS [DIPLOME], TypesClasses.Série AS [SERIE]
        // FROM Filières INNER JOIN (((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN (Elèves INNER JOIN T_NotesTech ON Elèves.RefElève = T_NotesTech.RefElève) ON Classes.RefClasse = Elèves.RefClasse) ON Filières.RefFilière = TypesClasses.Filière;
        // `.replace(/1/g, periodeEval.toString());
        const result = await fetchFromMsAccess<IMoyenneGeneral[]>(sql, appCnx);
        resolve(result);
      } catch (error) {
        console.log("🚀 ~ file: functions.ts:259 ~ returnnewPromise<IMoyenneGeneral[]> ~ error:", error)
        reject(error);
      }
    });
  }

export default {
    getMoyennesGeneralesTechnique
}


export function fetchTypeClasseRubriqueObligatoire(): Promise<
  any[]
> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT typeclasse_rubrique_obligatoire_newspd.idTypeClasseRubrique, typeclasse_rubrique_obligatoire_newspd.idOptionTypeClasseRubrique, typeclasse_rubrique_obligatoire_newspd.nombreVersement, typeclasse_rubrique_obligatoire_newspd.montantRubrique, typeclasse_rubrique_obligatoire_newspd.statut, typeclasse_rubrique_obligatoire_newspd.anciennete, typeclasse_rubrique_obligatoire_newspd.genre
        FROM typeclasse_rubrique_obligatoire_newspd;      `;
      const result = await fetchFromMsAccess<
        any[]
      >(sql, appCnx);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}