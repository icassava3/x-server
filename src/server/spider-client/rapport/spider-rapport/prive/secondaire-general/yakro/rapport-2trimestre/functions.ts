import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "./../../../../../../../databases/accessDB";
import {
  IChp1A_2_b,
  IChp1_A_1,
  IChp1_A_2_a,
  IChp1_B_1,
  IChp1_B_1_b,
  IChp1_B_2,
  IChp1_B_3,
  IChp2_A_1,
  IChp2_B,
  IChp2_C,
  IChp2_D,
  IChp2_E,
  IChp3_C_1,
  IChp3_C_2,
  IChp3_C_3,
  IChp4_2,
  IChp4_A_1_3,
} from "./interfaces";


import functions_main from "../../../../utils";
import { IChp_A_2_2 } from "../../abidjan3/rapport-3trimestre/interfaces";

const _ = require("lodash");



/* objectif: somme total de filles et garçons par niveau
 * utilisation: chp1_B_1_a
 */
export const addTGFRow = (data:any) => {
  let newData: any = [];
  newData = data.map((contentItem: any) => {
    let totalObject: any = {};
    let totalCol: any = [];
    let formatedCols: any = [];
    contentItem.cols.map((colItem: any, colItemIndex: number) => {
      let newCol: any = [];
      if (totalCol.length > 0) {
        const sum = colItem.col.map((col: any, colIndex: number) => {
          const formatedCol = col === 0 ? "0" : col;
          newCol.push(formatedCol);
          const isT = colItemIndex > 0 && [4, 6, 8,9].includes(colIndex)
          return isT
            ? ((col + totalCol[colIndex]) / (colItemIndex + 1)).toFixed(2)
            : col + totalCol[colIndex];
        });
        totalCol = sum;
      } else {
        colItem.col.map((col: any, colIndex: number) => {
          const formatedCol = col === 0 ? "0" : col;
          newCol.push(formatedCol);
        });
        totalCol = [...colItem.col];
      }
      if (colItem.genre === "G") {
        formatedCols.unshift({ ...colItem, col: newCol });
      } else {
        formatedCols.push({ ...colItem, col: newCol });
      }
    });
    if (formatedCols.length === 1) {
      const findformatedCols: any = formatedCols[0].col;
      let i: number = 0;
      let nombreLigne: number = findformatedCols.length;
      let newCols: any = [];
      for (i; i < nombreLigne; i++) {
        newCols.push("");
      }
      if (formatedCols[0].genre === "G") {
        formatedCols.push({ genre: "F", col: newCols });
      } else {
        formatedCols.unshift({ genre: "G", col: newCols });
      }
    }
    const newItems = totalCol.map((item: any) => (item === 0 ? "0" : item));
    totalObject = { genre: "T", col: newItems };
    const newCols = [...formatedCols, totalObject];
    return { ...contentItem, cols: newCols };
  });
  // console.log("newData..........", JSON.stringify(newData))
  return newData;
};


/**
 * Remplacer la valeur null par vide
 * @param data
 * @returns
 */

const nv = (data: any) => {
  return data === null || data === "null" ? "" : data;
};

const Identite = (): Promise<any | {}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        nomcompletetab,
        num_ouverture,
        num_reconnaissance,
        codeetab,
        sitgeo,
        bpetab,
        teletab,
        emailetab,
        drencomplet,

        fondateur,
        telfondateur,
        emailfondateur,

        nomchefetab,
        telchefetab,
        emailchefetab,
      } = await paramEtabObjet([
        "nomcompletetab",
        "num_ouverture",
        "num_reconnaissance",
        "codeetab",
        "sitgeo",
        "bpetab",
        "teletab",
        "emailetab",
        "drencomplet",

        "fondateur",
        "telfondateur",
        "emailfondateur",

        "nomchefetab",
        "telchefetab",
        "emailchefetab",
      ]);

      const result = {
        //ETABLISSEMENT
        drencomplet: drencomplet,
        nomcompletetab: nomcompletetab,
        num_ouverture: num_ouverture,
        num_reconnaissance: num_reconnaissance,
        codeetab: codeetab,
        sitgeo: sitgeo,
        bpetab: bpetab,
        teletab: teletab,
        emailetab: emailetab,

        //FONDATEUR
        fondateur: fondateur,
        telfondateur: telfondateur,
        emailfondateur: emailfondateur,

        //DIRECTEUR DES ETUDES
        nomchefetab: nomchefetab,
        telchefetab: telchefetab,
        emailchefetab: emailchefetab,
      };
      // console.log("Identite ... ", result);

      resolve(result);
    } catch (err: any) {
      console.log(`err => Identite`);
      return reject(err);
    }
  });
};


//******************************** debut chapitre 1 *************************************


// ce tableau n'est pas encore cree dans SPIDER
const chp1_A_1_activites_des_unites_pedagogiques_et_conseil_enseignement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         ' ' AS Discipline,
         ' ' AS DatePeriode,
         ' ' AS TypeActivite, 
         ' ' AS Objectifs,
         ' ' AS Cible,
         ' ' AS Dates,
         ' ' AS Lieu,
         ' ' AS Moyens
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_1, index: number) => {
        return {
          // c0:index+1,
          c1: nv(item.Discipline),
          c2: nv(item.DatePeriode),
          c3: nv(item.TypeActivite),
          c4: nv(item.Objectifs),
          c5: nv(item.Cible),
          c6: nv(item.Dates),
          c7: nv(item.Lieu),
          c8: nv(item.Moyens),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp1_A_1_activites_des_unites_pedagogiques_et_conseil_enseignement`
      );
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_2_a_Chef_d_etablissement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      tbl_visit.type_visit AS typeVisiteur,
      Fonction.Fonction AS Visiteur, 
       [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomCompletProf, 
       Personnel.fil_gen, 
       Fonction.Fonction, 
       Format([tbl_visit].[date_visit],"Short Date") AS Dates, 
       tbl_visit.heure_visit AS Heures, 
       Classes.ClasseCourt AS Classe, 
       Personnel.Fonction, 
       classe_matieres_TMP.MatLong AS Discipline
      FROM classe_matieres_TMP INNER JOIN (Fonction INNER JOIN (((Personnel INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers) 
      INNER JOIN tbl_visit ON Personnel.RefPersonnel = tbl_visit.id_pers) 
      INNER JOIN Classes ON tbl_visit.id_classe = Classes.RefClasse) ON Fonction.RefFonction = Personnel.Fonction) ON classe_matieres_TMP.RefMatière = Personnel.RefMatière
      WHERE (((Personnel.Fonction)=6))
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_2_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_2_a, index: number) => {
        return {
          c1: nv(item.Dates),
          c2: nv(item.NomCompletProf),
          c3: nv(item.Discipline),
          c4: nv(item.Classe),
          c5: nv(item.nomVisiteur),
          c6: nv(item.Heures),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_2_a_Chef_d_etablissement`);
      return reject(err);
    }
  });
};


/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_2_b_Inspecteurs_et_conseillers_pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT
      Fonction.Fonction AS Visiteur,
      [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomCompletProf,
      Matières.MatLong AS Discipline,
      Classes.ClasseCourt AS Classe,
      tbl_visit.date_visit AS Dates,
      tbl_visit.heure_visit AS Heures
      FROM Classes INNER JOIN (Fonction INNER JOIN ((Personnel INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière)
      INNER JOIN tbl_visit ON Personnel.RefPersonnel = tbl_visit.id_pers) ON Fonction.RefFonction = Personnel.Fonction)
      ON Classes.RefClasse = tbl_visit.id_classe
      WHERE (((Fonction.RefFonction)=7));
      `;
      const sqlResult = await fetchFromMsAccess<IChp1A_2_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_2_b, index: number) => {
        return {
          // c0:index+1,
          c1: nv(item.Dates),
          c2: nv(item.NomCompletProf),
          c3: nv(item.Discipline),
          c4: nv(item.Classe),
          c5: nv(item.Visiteur),
          c6: nv(item.Heures),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_2_b_Inspecteurs_et_conseillers_pedagogiques`);
      return reject(err);
    }
  });
};

const chp1_B_1_a_tableaux_des_resultats_eleves_affectes_par_classe_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, 1 AS orderby, Classes.OrdreClasse, 
      Classes.ClasseCourt, 
      Niveaux.NiveauCourt, 
      "#FFFF" AS bg, 
      IIf([Elèves].[Sexe]=1,"G","F") AS genre, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Classes.OrdreClasse, Classes.ClasseCourt, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe, Elèves.StatutElève
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3;
      UNION ALL 
      SELECT First(Niveaux.RefNiveau) AS RefNiveau, 2 AS orderby, First(Classes.OrdreClasse) AS OrdreClasse, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Niveaux.NiveauCourt, "#E3E3E3" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe, Elèves.StatutElève
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3;      
         `;

      const isEmpty = {
        bg: "#FFFF",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""]
      }
      const sqlResult = await fetchFromMsAccess<IChp1_B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_1) => {
        const items = _.omit(item, ["RefNiveau", "orderby", "OrdreClasse", "ClasseCourt", "NiveauCourt", "bg", "genre", "StatutElève"]);
        return {
          bg: item.bg,
          label: item.ClasseCourt,
          NiveauCourt: item.NiveauCourt,
          cols: [
            {
              genre: item.genre,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const groupeContents = await functions_main.formatGroupeByLabel(contentsArray);
      const result1 = await addTGFRow(groupeContents)

      // console.log("🚀 ~ file: functions.ts:273 ~ returnnewPromise ~ result1:", result1)

      const result2 = await result1.map((item: any) => {
        return {
          bg: item.bg,
          label: item.NiveauCourt,
          classe: item.label,
          cols: item.cols,
        };
      });
      const result = await functions_main.groupLabelByGroup(result2);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_a_tableaux_des_resultats_eleves_affectes_par_classe_par_niveau`);
      return reject(err);
    }
  });
};


const chp1_B_1_b_tableaux_des_resultats_eleves_affectes_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {

      let sql = `SELECT Niveaux.RefNiveau, 1 AS orderby, Niveaux.NiveauCourt AS label, Niveaux.NiveauCourt, 
      "#FFFF" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS genre, Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,
      Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe, Elèves.StatutElève
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2;
      UNION ALL 
      SELECT Niveaux.RefNiveau, 2 AS orderby, First(Niveaux.NiveauCourt) AS label, "Total " & First([Niveaux].[NiveauCourt]) AS NiveauCourt, "#E3E3E3" AS bg, "T" AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2;
      UNION ALL
      SELECT 8 AS RefNiveau, 1 AS orderby, "TOTAL" AS label, "TOTAL ETABL." AS NiveauCourt, "#E3E3E3" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS Genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY Elèves.inscrit, Elèves.Sexe, Elèves.StatutElève
      HAVING (((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2;
      UNION ALL 
      SELECT 8 AS RefNiveau, 2 AS orderby, "TOTAL" AS label, "TOTAL ETABL." AS NiveauCourt, "#E3E3E3" AS bg, "T" AS Genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY Elèves.inscrit, Elèves.StatutElève
      HAVING (((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2;      
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_b) => {
        const items = _.omit(item, ["RefNiveau", "orderby", "label", "NiveauCourt", "bg", "genre", "StatutElève"]);
        return {
          bg: item.bg,
          label: item.label,
          NiveauCourt: item.NiveauCourt,
          cols: [
            {
              genre: item.genre,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const result = functions_main.formatGroupeByLabel(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_a_tableaux_des_resultats_eleves_affectes_par_niveau`);
      return reject(err);
    }
  });
};


const chp1_B_1_c_tableaux_des_resultats_eleves_non_affectes_par_classe_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, 1 AS orderby, Classes.OrdreClasse, 
      Classes.ClasseCourt, 
      Niveaux.NiveauCourt, "#FFFF" AS bg, 
      IIf([Elèves].[Sexe]=1,"G","F") AS genre, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Classes.OrdreClasse, Classes.ClasseCourt, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe, Elèves.StatutElève
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3;
      UNION ALL 
      SELECT First(Niveaux.RefNiveau) AS RefNiveau, 2 AS orderby, First(Classes.OrdreClasse) AS OrdreClasse, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Niveaux.NiveauCourt, "#E3E3E3" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe, Elèves.StatutElève
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3;      
         `;

      const isEmpty = {
        bg: "#FFFF",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""]
      }
      const sqlResult = await fetchFromMsAccess<IChp1_B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_1) => {
        const items = _.omit(item, ["RefNiveau", "orderby", "OrdreClasse", "ClasseCourt", "NiveauCourt", "bg", "genre", "StatutElève"]);
        return {
          bg: item.bg,
          label: item.ClasseCourt,
          NiveauCourt: item.NiveauCourt,
          cols: [
            {
              genre: item.genre,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const groupeContents = await functions_main.formatGroupeByLabel(contentsArray);
      const result1 = await addTGFRow(groupeContents)

      // console.log("🚀 ~ file: functions.ts:273 ~ returnnewPromise ~ result1:", result1)

      const result2 = await result1.map((item: any) => {
        return {
          bg: item.bg,
          label: item.NiveauCourt,
          classe: item.label,
          cols: item.cols,
        };
      });
      const result = await functions_main.groupLabelByGroup(result2);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_a_tableaux_des_resultats_eleves_affectes_par_classe_par_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_1_d_tableaux_des_resultats_eleves_non_affectes_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {

      let sql = `SELECT Niveaux.RefNiveau, 1 AS orderby, Niveaux.NiveauCourt AS label, Niveaux.NiveauCourt, "#FFFF" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe, Elèves.StatutElève
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2;
      UNION ALL 
      SELECT Niveaux.RefNiveau, 2 AS orderby, 
      First(Niveaux.NiveauCourt) AS label, 
      "Total " & First([Niveaux].[NiveauCourt]) AS NiveauCourt, "#E3E3E3" AS bg, "T" AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, 
      Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2;
      UNION ALL
      SELECT 8 AS RefNiveau, 1 AS orderby, "TOTAL" AS label, "TOTAL ETABL." AS NiveauCourt, "#E3E3E3" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS Genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY Elèves.inscrit, Elèves.Sexe, Elèves.StatutElève
      HAVING (((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2;
      UNION ALL 
      SELECT 8 AS RefNiveau, 2 AS orderby, "TOTAL" AS label, "TOTAL ETABL." AS NiveauCourt, "#E3E3E3" AS bg, "T" AS Genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY Elèves.inscrit, Elèves.StatutElève
      HAVING (((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2;      
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_b) => {
        const items = _.omit(item, ["RefNiveau", "orderby", "label", "NiveauCourt", "bg", "genre", "StatutElève"]);
        return {
          bg: item.bg,
          label: item.label,
          NiveauCourt: item.NiveauCourt,
          cols: [
            {
              genre: item.genre,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const result = functions_main.formatGroupeByLabel(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_d_tableaux_des_resultats_eleves_non_affectes_par_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_1_e_recapitulatif_des_resultats_des_eleves_affectes_et_non_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {

      let sql = `SELECT Niveaux.RefNiveau, 1 AS orderby, Niveaux.NiveauCourt AS label, Niveaux.NiveauCourt, "#FFFF" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
                FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
                GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe
                HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
                ORDER BY 1, 2;
                UNION ALL
                SELECT Niveaux.RefNiveau, 2 AS orderby, First(Niveaux.NiveauCourt) AS label, "Total " & First([Niveaux].[NiveauCourt]) AS NiveauCourt, "#E3E3E3" AS bg, "T" AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
                FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
                GROUP BY Niveaux.RefNiveau, TypesClasses.filière, Elèves.inscrit
                HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
                ORDER BY 1, 2;
                UNION ALL
                SELECT 8 AS RefNiveau, 1 AS orderby, "TOTAL" AS label, "TOTAL ETABL." AS NiveauCourt, "#E3E3E3" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS Genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
                FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
                WHERE (((TypesClasses.filière)=1))
                GROUP BY Elèves.inscrit, Elèves.Sexe
                HAVING (((Elèves.inscrit)=Yes))
                ORDER BY 1, 2;
                UNION ALL SELECT 8 AS RefNiveau, 2 AS orderby, "TOTAL" AS label, "TOTAL ETABL." AS NiveauCourt, "#E3E3E3" AS bg, "T" AS Genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
                FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
                WHERE (((TypesClasses.filière)=1))
                GROUP BY Elèves.inscrit
                HAVING (((Elèves.inscrit)=Yes))
                ORDER BY 1, 2;
                 `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_b) => {
        const items = _.omit(item, ["RefNiveau", "orderby", "label", "NiveauCourt", "bg", "genre", "StatutElève"]);
        return {
          bg: item.bg,
          label: item.label,
          NiveauCourt: item.NiveauCourt,
          cols: [
            {
              genre: item.genre,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const result = functions_main.formatGroupeByLabel(contentsArray);
    // console.log("result.chp1_B_1_d...",JSON.stringify(result) );

      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_d_recapitulatif_des_resultats_des_eleves_affectes_et_non_par_niveau`);
      return reject(err);
    }
  });
};


// const chp1_B_2_liste_nominative = () => {
//   return new Promise(async (resolve, reject) => {
//     try {

//       let sql1 = `SELECT 
//       tbl_apprec.IdAppréciation, 
//       tbl_apprec.Niveau, 
//       tbl_apprec.Appréciations AS Appreciations, 
//       tbl_apprec.NotePlancher, 
//       tbl_apprec.NotePlafond
//       FROM tbl_apprec
//       WHERE (((tbl_apprec.Niveau)="Matière" Or (tbl_apprec.Niveau)="Trimestre"));      
//       `
//       const sqlResult1 = await fetchFromMsAccess<any>(sql1, appCnx);
//       if (sqlResult1.length === 0) return resolve([{}]);

//       let sql2 = `
//       SELECT Classes.OrdreClasse, 
//       Niveaux.RefNiveau AS OrderBy, 
//       Classes.ClasseCourt, 
//       Elèves.NomElève, 
//       Elèves.PrénomElève, 
//       [NomElève] & " " & [PrénomElève] AS NomComplet, 
//       Elèves.MatriculeNational, Elèves.Sexe, 
//       T_Notes.MOYG2 AS MoyG2, 
//       IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve,
//       Classes.ClasseLong, 
//       TypesClasses.Niveau, 
//       Format([Elèves].[DateNaiss],"Short Date") AS DateNaiss, 
//       IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
//       IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
//       IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
//       ' ' AS ProfP, 
//       ' ' AS Educ, 
//       TypesClasses.RefTypeClasse, 
//       Notes.RangG2, 
//       Elèves.LV2, 
//       '' AS NumDeciAffect, 
//       IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2
// FROM ((Niveaux INNER JOIN (((Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) INNER JOIN Notes ON T_Notes.RefElève = Notes.RefElève
// WHERE (((TypesClasses.RefTypeClasse)<14))
// ORDER BY Classes.OrdreClasse, Niveaux.RefNiveau;
//       `;
      
//       const sqlResult2 = await fetchFromMsAccess<IChp_A_2_2[]>(sql2, appCnx);
//       if (sqlResult2.length === 0) return resolve([
//         {
//           label: '',
//           obj: { classeLong: '', pp: '', educ: '' },
//           group: [{}],
//           count: 0
//         },
//       ]);

//       const resultat = functions_main.fusionnerTableaux(sqlResult1, sqlResult2, 'MoyG2')
//       const contentsArray = resultat.map((item: IChp_A_2_2,) => {
//         return {
//           c1: nv(item.MatriculeNational),
//           c2: nv(item.NomComplet),
//           c3: nv(item.Genre),
//           c4: nv(item.DateNaiss),
//           c5: nv(item.Nationalite),
//           c6: nv(item.Redoub),
//           c7: nv(item.StatutEleve),
//           c8: nv(item.NumDeciAffect),
//           c9: nv(item.MoyG2),
//           c10: nv(item.RangG2),
//           c11: nv(item.Appreciations),
//           label: item.ClasseLong,
//           obj: {
//             classeLong: item.ClasseLong,
//             pp: nv(item.ProfP),
//             educ: nv(item.Educ),
//           },
//         };
//       });
//       const result = functions_main.groupLabelByGroup(contentsArray);
//       resolve(result);
//     } catch (err: any) {
//       console.log(`err => chp1_B_2_liste_nominative`);
//       return reject(err);
//     }
//   });
// };



const chp1_B_2_liste_nominative = (StatutEleve: string) => {
  return new Promise(async (resolve, reject) => {
    try {

      let sql1 = `SELECT 
      tbl_apprec.IdAppréciation, 
      tbl_apprec.Niveau, 
      tbl_apprec.Appréciations AS Appreciations, 
      tbl_apprec.NotePlancher, 
      tbl_apprec.NotePlafond
      FROM tbl_apprec
      WHERE (((tbl_apprec.Niveau)="Matière" Or (tbl_apprec.Niveau)="Trimestre"));      
      `
      const sqlResult1 = await fetchFromMsAccess<any>(sql1, appCnx);
      if (sqlResult1.length === 0) return resolve([{}]);

      let sql2 = `
      SELECT Classes.OrdreClasse, 
      Niveaux.RefNiveau AS OrderBy, 
      Classes.RefClasse, [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Elèves.MatriculeNational, Classes.ClasseLong, Classes.ClasseCourt, 
      Format([Elèves].[DateNaiss],"Short Date") AS DateNaiss, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, ' ' AS ProfP, ' ' AS Educ, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2, Elèves.LV2 AS Lang, T_Notes.MOYG2 AS MoyG2, Notes.RangG2, IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve
     FROM (T_Notes INNER JOIN Notes ON T_Notes.RefElève = Notes.RefElève) INNER JOIN ((((Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse) INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau) INNER JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Inscrit)=True) AND ((Elèves.StatutElève)${StatutEleve}))
      ORDER BY Classes.OrdreClasse, Niveaux.RefNiveau, Classes.RefClasse, [NomElève] & " " & [PrénomElève];
      `;
      const sqlResult2 = await fetchFromMsAccess<IChp_A_2_2[]>(sql2, appCnx);
      if (sqlResult2.length === 0) return resolve([
        {
          label: '',
          obj: { classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);

      const resultat = functions_main.fusionnerTableaux(sqlResult1, sqlResult2, 'MoyG2')
      const contentsArray = resultat.map((item: IChp_A_2_2,) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.Genre),
          c4: nv(item.DateNaiss),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.StatutEleve),
          c8: nv(item.NumDeciAffect),
          c9: nv(item.MoyG2),
          c10: nv(item.RangG2),
          c11: nv(item.Appreciations),
          label: item.ClasseLong,
          obj: {
            classeLong: item.ClasseLong,
            pp: nv(item.ProfP),
            educ: nv(item.Educ),
          },
        };
      });
      const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_2_liste_nominative`);
      return reject(err);
    }
  });
};


const chp1_B_3_liste_major_classe_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]) AS RefTypeClasse, 
      IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",[NiveauCourt] & " " & [Série]) AS NiveauSerie, 
      Niveaux.NiveauCourt, Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(DateNaiss,"Short Date") AS DateNais, Int((Date()-[DateNaiss])/365.5) AS Age, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre,
       IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
       IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
       IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang2, 
       Elèves.LV2 AS Lang, 
       IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
       " " AS NumDeciAffect, 
       Notes.RangG2, 
       T_Notes.MOYG2 AS MoyG2
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]))<14) AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]), T_Notes.MOYG2 DESC , IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",[NiveauCourt] & " " & [Série]), Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];            
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_3[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);

      // 1. je recupere les occurences distinctes des refTypeClasse
      //  retourne un seul  ReftypyClasse pour un niveau dans le data
      const distinctRefTypeClasse = _.uniqBy(sqlResult, "RefTypeClasse") as IChp1_B_3[];
      // 2. je parcours les differents RefTypeClasse
      let result1 = [];
      distinctRefTypeClasse.map(x => {
        // je recupere les élèves du niveau pour chaque RefTypeClasse puis je choisis les 3 premiers objet du tableau
        const currentTypeClasseStudents = sqlResult.filter(student => student.RefTypeClasse === x.RefTypeClasse)
        const troisMajors = currentTypeClasseStudents[0] // je prends de 0  
        result1 = result1.concat(troisMajors)
      });

      const contentsArray = result1.map((item: IChp1_B_3, i: number) => {
        return {
          c1: nv(item.ClasseCourt),
          c2: nv(item.MatriculeNational),
          c3: nv(item.NomComplet),
          c4: nv(item.DateNais),
          c5: nv(item.Genre),
          c6: nv(item.StatutEleve),
          c7: nv(item.Redoub),
          c8: nv(item.MoyG2),
          // c9: nv(item.Lang2),
          c9:  nv(item.Lang2),
          label: item.NiveauSerie,//obligatoire car on regroupe par label
          obj: { label: item.NiveauSerie },
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_3_liste_major_classe_par_niveau`);
      return reject(err);
    }
  });
};


const chp2_A_liste_transferts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { nometab } = await paramEtabObjet(["nometab"]);
      let sql = `SELECT 
      TypesClasses.RefTypeClasse, 
      Classes.RefClasse, 
      Classes.ClasseCourt, 
      Niveaux.NiveauCourt, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Elèves.MatriculeNational, 
      IIf([Sexe]=1,"M","F") AS Genre, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
       Nationalités.NATIONAL AS Nat, 
       IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
       Elèves.EtsOrig, "${nometab}" AS EtsAcc, 
       Elèves.N°Transf AS NumTrans, 
       Elèves.Décision AS Decision
      FROM Nationalités RIGHT JOIN (Niveaux INNER JOIN (TypesClasses INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Nationalités.CODPAYS = Elèves.Nat
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Transféré)=Yes))
      ORDER BY TypesClasses.RefTypeClasse, Classes.RefClasse, [NomElève] & " " & [PrénomElève];
      `;
      const sqlResult = await fetchFromMsAccess<IChp2_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_A_1, index: number) => {
        return {
          // c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.MatriculeNational),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Redoub),
          c5: nv(item.DateNaiss),
          c6: nv(item.NumTrans),
          c7: nv(item.Decision),
          c8: nv(item.EtsOrig),
          label: item.NiveauCourt,  //obligatoire car on regroupe par label
          obj: { label: item.NiveauCourt },
        };
      });
      const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_A_liste_transferts`);
      return reject(err);
    }
  });
};

const chp2_B_repartition_des_eleves_par_annee_de_naissance = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])) AS annee, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
      Count(IIf([Niveaux]![RefNiveau]=1,1,Null)) AS 6e, 
      Count(IIf(Niveaux!RefNiveau=2,1,Null)) AS 5e, 
      Count(IIf(Niveaux!RefNiveau=3,1,Null)) AS 4e, 
      Count(IIf(Niveaux!RefNiveau=4,1,Null)) AS 3e, 
      Val([6e]+[5e]+[4e]+[3e]) AS ST1, 
      Count(IIf(Niveaux!RefNiveau=5 And TypesClasses!Série="A",1,Null)) AS 2ndA, 
      Count(IIf(Niveaux!RefNiveau=5 And TypesClasses!Série="C",1,Null)) AS 2ndC, 
      Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="A",1,Null)) AS 1ereA, 
      Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="C",1,Null)) AS 1ereC, 
      Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="D",1,Null)) AS 1ereD, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS TleA, 
      Count(IIf(Niveaux!RefNiveau=7 And TypesClasses!Série="C",1,Null)) AS TleC, 
      Count(IIf(Niveaux!RefNiveau=7 And TypesClasses!Série="D",1,Null)) AS TleD, 
      Val([2ndA]+[2ndC]+[1ereA]+[1ereC]+[1ereD]+[TleA]+[TleC]+[TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])), IIf([Elèves].[Sexe]=2,"F","G"), Elèves.Inscrit, '', TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      UNION ALL
      SELECT "TOTAL DREN" AS annee, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY IIf([Elèves].[Sexe]=2,"F","G"), Elèves.Sexe;      
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_B) => {
        const items = _.omit(item, ["annee", "genre"]);
        return {
          label: item.annee,
          cols: [
            {
              genre: item.genre,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const groupeContents = functions_main.formatGroupeByLabel(contentsArray);
      const result = functions_main.addGFTRow(groupeContents);
      // console.log("result.chp2_B...",JSON.stringify(result) );

      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_B_repartition_des_eleves_par_annee_de_naissance`);
      return reject(err);
    }
  });
};

const chp2_C_liste_boursiers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT Niveaux.RefNiveau, 
      Niveaux.NiveauCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Classes.ClasseCourt, 
      IIf([Sexe]=1,"M","F") AS Genre, 
      Elèves.Décision AS Decision, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      Elèves.lieuNaiss AS LieuNaissance,
      IIf([Bourse]="BE","BE","1/2B") AS Regime
      FROM ((TypesClasses INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS
      WHERE (((Elèves.Bourse) Is Not Null))
      ORDER BY Niveaux.RefNiveau, Elèves.Bourse DESC , [NomElève] & " " & [PrénomElève], Classes.OrdreClasse, [NomElève] & " " & [PrénomElève], Elèves.Bourse DESC , TypesClasses.Niveau;    
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_C[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_C, index: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.Genre),
          c4: nv(item.DateNaiss),
          c5: nv(item.LieuNaissance),
          label: item.NiveauCourt,  //obligatoire car on regroupe par label
          obj: { label: item.NiveauCourt },
        };
      });
      const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_C_liste_boursiers`);
      return reject(err);
    }
  });
};

const chp2_D_effectif_par_niveau_avec_approche_genre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, 
      Niveaux.NiveauCourt, 
      [NiveauCourt] & " " & [Série] AS NiveauSerie, 
      IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, 
      Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, 
      Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, 
      [F1]+[F2] AS T1, 
      Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, 
      Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, 
      [G1]+[G2] AS T2, 
      [F1]+[G1] AS TT1, 
      [F2]+[G2] AS TT2, 
      [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (1,2,3,4)));
UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau,
"#EBEBEB" AS bg, "1er Cycle" AS NiveauCourt, 
"TOTAL 1er Cycle" AS NiveauSerie, 
First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, 
(Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClasses, 
Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, 
Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, 
[F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, 
Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, 
[G1]+[G2] AS T2, 
[F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse) In (1,2,3,4)));

UNION ALL
SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (5,6)));
UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau,"#EBEBEB" AS bg, "2nde" AS NiveauCourt, "TOTAL 2nde" AS NiveauSerie, First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, (Select count(*) from Classes Where refTypeClasse in (5,6)) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse) In (5,6)));

UNION ALL
SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (7,8,9)));
UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau,"#EBEBEB" AS bg, "1ère" AS NiveauCourt, "TOTAL 1ère" AS NiveauSerie, First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, (Select count(*) from Classes Where refTypeClasse in (7,8,9)) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse) In (7,8,9)));

UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau, "#FFFF" AS bg,"Tle" AS NiveauCourt, "Tle A" AS NiveauSerie, "2nd Cycle" AS CycleX, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse) In (10,13)));
UNION ALL
SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (11,12)));
UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau,"#EBEBEB" AS bg, "Tle " AS NiveauCourt, "TOTAL Tle" AS NiveauSerie, First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, (Select count(*) from Classes Where refTypeClasse in (10,11,12,13)) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse) In (10,11,12,13)));

UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau,"#E3E3E3" AS bg, "Etabliss" AS NiveauCourt, "TOTAL Etabliss" AS NiveauSerie, "Etabliss" AS CycleX, (Select count(*) from Classes Where refTypeClasse<14) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse)<14));
`;
      const sqlResult = await fetchFromMsAccess<IChp2_D[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_D) => {
        const items = _.omit(item, ["RefNiveau", "bg", "NiveauCourt", "NiveauSerie", "CycleX"]);
        return {
          bg: item.bg,
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      // console.log("result.hp2_D...", contentsArray[5])
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_D_effectif_par_niveau_avec_approche_genre`);
      return reject(err);
    }
  });
};

const chp2_E_recap_effectif_classe_genre_aff_nonaffect = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
SELECT 1 AS orderby, 
"GARCONS" AS label, 
Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6eme, 
Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5eme, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4emeEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4emeAll, 
Val([_4emeEsp]+[_4emeAll]) AS Tot4eme, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3emeEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3emeAll, 
Val([_3emeEsp]+[_3emeAll]) AS Tot3eme, 
Val([_6eme]+[_5eme]+[_4emeEsp]+[_4emeAll]+[_3emeAll]+[_3emeEsp]) AS TotalCycle1, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndCEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndCAll, 
Val([_2ndAEsp]+[_2ndAll]+[_2ndCEsp]+[_2ndCAll]) AS TOT2nd, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereCEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereDEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereAAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereCAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereDAll, 
Val([_1ereAEsp]+[_1ereCEsp]+[_1ereDEsp]+[_1ereAAll]+[_1ereCAll]+[_1ereDAll]) AS TOT1ere, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (11,13),1,Null)) AS _TleCEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (12,13),1,Null)) AS _TleDEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleAAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (11,13),1,Null)) AS _TleCAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (12,13),1,Null)) AS _TleDAll, 
Val([_TleAEsp]+[_TleCEsp]+[_TleDEsp]+[_TleAAll]+[_TleCAll]+[_TleDAll]) AS TOTTle, 
Val([TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalCycle2, 
Val([TotalCycle1]+[TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalGeneral
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((Elèves.Sexe)=1));

UNION ALL (
SELECT 2 AS orderby, 
"FILLES" AS label, 
Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6eme, 
Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5eme, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4emeEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4emeAll, 
Val([_4emeEsp]+[_4emeAll]) AS Tot4eme, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3emeEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3emeAll, 
Val([_3emeEsp]+[_3emeAll]) AS Tot3eme, 
Val([_6eme]+[_5eme]+[_4emeEsp]+[_4emeAll]+[_3emeAll]+[_3emeEsp]) AS TotalCycle1, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndCEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndCAll, 
Val([_2ndAEsp]+[_2ndAll]+[_2ndCEsp]+[_2ndCAll]) AS TOT2nd, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereCEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereDEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereAAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereCAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereDAll, 
Val([_1ereAEsp]+[_1ereCEsp]+[_1ereDEsp]+[_1ereAAll]+[_1ereCAll]+[_1ereDAll]) AS TOT1ere, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (11,13),1,Null)) AS _TleCEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (12,13),1,Null)) AS _TleDEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleAAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (11,13),1,Null)) AS _TleCAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (12,13),1,Null)) AS _TleDAll, 
Val([_TleAEsp]+[_TleCEsp]+[_TleDEsp]+[_TleAAll]+[_TleCAll]+[_TleDAll]) AS TOTTle, 
Val([TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalCycle2, Val([TotalCycle1]+[TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalGeneral
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((Elèves.Sexe)=2));
)
UNION ALL (
SELECT 3 AS orderby, 
"TOTAL" AS label, 
Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6eme, 
Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5eme, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4emeEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4emeAll, 
Val([_4emeEsp]+[_4emeAll]) AS Tot4eme, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3emeEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3emeAll, 
Val([_3emeEsp]+[_3emeAll]) AS Tot3eme, 
Val([_6eme]+[_5eme]+[_4emeEsp]+[_4emeAll]+[_3emeAll]+[_3emeEsp]) AS TotalCycle1, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndCEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndCAll, 
Val([_2ndAEsp]+[_2ndAll]+[_2ndCEsp]+[_2ndCAll]) AS TOT2nd, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereCEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereDEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereAAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereCAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereDAll, 
Val([_1ereAEsp]+[_1ereCEsp]+[_1ereDEsp]+[_1ereAAll]+[_1ereCAll]+[_1ereDAll]) AS TOT1ere, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (11,13),1,Null)) AS _TleCEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (12,13),1,Null)) AS _TleDEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleAAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (11,13),1,Null)) AS _TleCAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (12,13),1,Null)) AS _TleDAll, 
Val([_TleAEsp]+[_TleCEsp]+[_TleDEsp]+[_TleAAll]+[_TleCAll]+[_TleDAll]) AS TOTTle, 
Val([TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalCycle2, 
Val([TotalCycle1]+[TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalGeneral
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1));
)
UNION ALL (
SELECT 4 AS orderby, "AFFECTES" AS label, 
Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6eme, 
Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5eme, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4emeEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4emeAll, 
Val([_4emeEsp]+[_4emeAll]) AS Tot4eme, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3emeEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3emeAll, 
Val([_3emeEsp]+[_3emeAll]) AS Tot3eme, 
Val([_6eme]+[_5eme]+[_4emeEsp]+[_4emeAll]+[_3emeAll]+[_3emeEsp]) AS TotalCycle1, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndCEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndCAll, 
Val([_2ndAEsp]+[_2ndAll]+[_2ndCEsp]+[_2ndCAll]) AS TOT2nd, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereCEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereDEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereAAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereCAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereDAll, 
Val([_1ereAEsp]+[_1ereCEsp]+[_1ereDEsp]+[_1ereAAll]+[_1ereCAll]+[_1ereDAll]) AS TOT1ere, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleAEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (11,13),1,Null)) AS _TleCEsp, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (12,13),1,Null)) AS _TleDEsp, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleAAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (11,13),1,Null)) AS _TleCAll, 
Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (12,13),1,Null)) AS _TleDAll, 
Val([_TleAEsp]+[_TleCEsp]+[_TleDEsp]+[_TleAAll]+[_TleCAll]+[_TleDAll]) AS TOTTle, 
Val([TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalCycle2, 
Val([TotalCycle1]+[TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalGeneral
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1))
HAVING (((Elèves.StatutElève)=1))
)
UNION ALL (
SELECT 5 AS orderby, 
"NON AFFECTES" AS label, 
Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6eme, 
Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5eme, 
Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4emeEsp,
 Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4emeAll, 
 Val([_4emeEsp]+[_4emeAll]) AS Tot4eme, 
 Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3emeEsp, 
 Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3emeAll, 
 Val([_3emeEsp]+[_3emeAll]) AS Tot3eme, 
 Val([_6eme]+[_5eme]+[_4emeEsp]+[_4emeAll]+[_3emeAll]+[_3emeEsp]) AS TotalCycle1, 
 Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndAEsp, 
 Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndCEsp, 
 Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndAll, 
 Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndCAll, 
 Val([_2ndAEsp]+[_2ndAll]+[_2ndCEsp]+[_2ndCAll]) AS TOT2nd, 
 Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereAEsp, 
 Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereCEsp, 
 Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereDEsp, 
 Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereAAll, 
 Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereCAll, 
 Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereDAll, 
 Val([_1ereAEsp]+[_1ereCEsp]+[_1ereDEsp]+[_1ereAAll]+[_1ereCAll]+[_1ereDAll]) AS TOT1ere, 
 Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleAEsp, 
 Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (11,13),1,Null)) AS _TleCEsp, 
 Count(IIf([Elèves].[LV2]="Espagnol" And [TypesClasses].[RefTypeClasse] In (12,13),1,Null)) AS _TleDEsp, 
 Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleAAll, 
 Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (11,13),1,Null)) AS _TleCAll, 
 Count(IIf([Elèves].[LV2]="Allemand" And [TypesClasses].[RefTypeClasse] In (12,13),1,Null)) AS _TleDAll, 
 Val([_TleAEsp]+[_TleCEsp]+[_TleDEsp]+[_TleAAll]+[_TleCAll]+[_TleDAll]) AS TOTTle, 
 Val([TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalCycle2, 
 Val([TotalCycle1]+[TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalGeneral
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1))
HAVING (((Elèves.StatutElève)=2));
)
UNION ALL ( 
SELECT 6 AS orderby, 
"NOMBRE DE CLASSES PEDAGOGIQUES" AS label, 
(SELECT Count(*) AS T FROM Classes WHERE  RefTypeClasse=1) AS _6eme, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=2) AS _5eme, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=3 AND [Classes].[LV2]="Espagnol") AS _4emeEsp, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=3 AND [Classes].[LV2]="Allemand") AS _4emeAll, 
Val([_4emeEsp]+[_4emeAll]) AS Tot4eme, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=4 AND [Classes].[LV2]="Espagnol") AS _3emeEsp, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=3 AND [Classes].[LV2]="Allemand") AS _3emeAll, 
Val([_3emeEsp]+[_3emeAll]) AS Tot3eme, Val([_6eme]+[_5eme]+[_4emeEsp]+[_4emeAll]+[_3emeEsp]+[_3emeAll]) AS TotalCycle1, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=5 AND ([Classes].[LV2]="Espagnol" OR [Classes].[LV2]="Mixte")) AS _2ndAEsp, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=6 AND ([Classes].[LV2]="Espagnol" OR [Classes].[LV2]="Mixte")) AS _2ndCEsp, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=5 AND [Classes].[LV2]="Espagnol") AS _2ndAll, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=6 AND [Classes].[LV2]="Espagnol") AS _2ndCAll, 
Val([_2ndCEsp]+[_2ndAEsp]+[_2ndCALL]+[_2ndAll]) AS Tot2nd, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=7 AND ([Classes].[LV2]="Espagnol" OR [Classes].[LV2]="Mixte")) AS _1ereAEsp, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=8 AND ([Classes].[LV2]="Espagnol" OR [Classes].[LV2]="Mixte")) AS _1ereCEsp, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=9 AND ([Classes].[LV2]="Espagnol" OR [Classes].[LV2]="Mixte")) AS _1ereDEsp, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=7 AND [Classes].[LV2]="Allemand") AS _1ereAAll, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=8) AS _1ereCAll, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=9) AS _1ereDAll, 
Val([_1ereAEsp]+[_1ereCEsp]+[_1ereDEsp]+[_1ereAAll]+[_1ereCAll]+[_1ereDAll]) AS TOT1ere, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=10 AND ([Classes].[LV2]="Espagnol" OR [Classes].[LV2]="Mixte")) AS _TleAEsp, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=11) AS _TleCEsp, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=12 AND [Classes].[LV2]="Espagnol") AS _TleDEsp, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=10 AND [Classes].[LV2]="Allemand") AS _TleAAll, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=11) AS _TleCAll, 
(SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=12) AS _TleDAll, 
Val([_TleAEsp]+[_TleCEsp]+[_TleDEsp]+[_TleAAll]+[_TleCAll]+[_TleDAll]) AS TOTTle, 
Val([TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalCycle2, 
Val([TotalCycle1]+[TOT2nd]+[TOT1ere]+[TOTTle]) AS TotalGeneral
FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
GROUP BY Elèves.Inscrit, TypesClasses.filière
HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
)        
 `
      const sqlResult = await fetchFromMsAccess<IChp2_E[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_E) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          ...items,
        };
      });
      // console.log("contentsArray.chp2_5....", contentsArray)
      const row = contentsArray;
      const row1 = Object.values(row[0]);
      const row2 = Object.values(row[1]);
      const row3 = Object.values(row[2]);
      const row4 = Object.values(row[3]);
      const row5 = Object.values(row[4]);
      const row6 = Object.values(row[5]);
      const rows = { row1, row2, row3, row4, row5, row6 };
      const result = [rows];
      // console.log("🚀 ~ file: functions.ts:1237 ~ returnnewPromise ~ result+++:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_E_recap_effectif_classe_genre_aff_nonaffect`);
      return reject(err);
    }
  });
};



// Chp3

/**
 * Ce tableau n’est pas encore implémenté dans SPIDER
 * 
 */
const chp3_C_1_cas_grossesse = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & " " & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt, 
        IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
        Int((Date()-[DateNaiss])/365.5) AS Age, 
        tbl_cs_grossesse.QualiteAuteur,
        ' ' AS Observations
        FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_grossesse 
        ON Elèves.RefElève = tbl_cs_grossesse.RefElève) 
        ON Classes.RefClasse = Elèves.RefClasse
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_C_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_C_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Genre),
          c5: nv(item.Age),
          c6: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_C_1_cas_grossesse`);
      return reject(err);
    }
  });
};

/**
 * Ce tableau n’est pas encore implémenté dans SPIDER il y d'autre champs à creer
 * nom de la table tbl_cs_abandon
 */
const chp3_C_2_cas_abandon = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & " " & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt, 
        IIf([Sexe]=1,"M","F") AS Genre,
        Int((Date()-[DateNaiss])/365.5) AS Age, 
        tbl_cs_abandon.RaisonAbandon AS Observations
        FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_abandon 
        ON Elèves.RefElève = tbl_cs_abandon.RefElève) 
        ON Classes.RefClasse = Elèves.RefClasse
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_C_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_C_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Genre),
          c5: nv(item.Age),
          c6: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_C_2_cas_abandon`);
      return reject(err);
    }
  });
};

const chp3_C_3_autres_cas = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Elèves.RefElève, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Count(IIf([DateDécès] Is Null,Null,1)) AS Deces, 
      Count(IIf([tbl_cs_handicap].[DateDepotCertificat] Is Null,Null,1)) AS Handicap, 
      Count(IIf([tbl_cs_maladie].[DateDepotCertificat] Is Null,Null,1)) AS Maladie
      FROM ((Elèves INNER JOIN tbl_cs_deces ON Elèves.RefElève = tbl_cs_deces.RefElève) INNER JOIN tbl_cs_handicap ON Elèves.RefElève = tbl_cs_handicap.RefElève) INNER JOIN tbl_cs_maladie ON Elèves.RefElève = tbl_cs_maladie.RefElève
      GROUP BY Elèves.RefElève, Elèves.NomElève, Elèves.PrénomElève;
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_C_3[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_C_3, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Deces),
          c2: nv(item.Handicap),
          c3: nv(item.Maladie),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_C_3_autres_cas`);
      return reject(err);
    }
  });
};

const chp4_A_1_3_effectifs_des_enseignants_par_discipline_et_par_cycle = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
SELECT 
Count(IIf([Matières].[RefMatière]=1 And [Corps].[RefCorps] In (2,17),1,Null)) AS FrCycle1, 
Count(IIf([Matières].[RefMatière]=1 And   [Corps].[RefCorps] In (1,17),1,Null)) AS FrCycle2, 
Count(IIf([Matières].[RefMatière]=2 And [Corps].[RefCorps] In (2,17),1,Null)) AS PhiloCycle1, 
Count(IIf([Matières].[RefMatière]=2 And   [Corps].[RefCorps] In (1,17),1,Null)) AS PhiloCycle2, 
Count(IIf([Matières].[RefMatière]=4 And [Corps].[RefCorps] In (2,17),1,Null)) AS AnCycle1, 
Count(IIf([Matières].[RefMatière]=4 And   [Corps].[RefCorps] In (1,17),1,Null)) AS AnCycle2, 
Count(IIf([Matières].[RefMatière]=6 And [Corps].[RefCorps] In (2,17),1,Null)) AS EspCycle1, 
Count(IIf([Matières].[RefMatière]=6 And   [Corps].[RefCorps] In (1,17),1,Null)) AS EspCycle2, 
Count(IIf([Matières].[RefMatière]=5 And [Corps].[RefCorps] In (2,17),1,Null)) AS AllCycle1, 
Count(IIf([Matières].[RefMatière]=5 And   [Corps].[RefCorps] In (1,17),1,Null)) AS AllCycle2, 
Count(IIf([Matières].[RefMatière]=3 And [Corps].[RefCorps] In (2,17),1,Null)) AS HgCycle1, 
Count(IIf([Matières].[RefMatière]=3 And   [Corps].[RefCorps] In (1,17),1,Null)) AS HgCycle2, 
Count(IIf([Matières].[RefMatière]=7 And [Corps].[RefCorps] In (2,17),1,Null)) AS MathCycle1, 
Count(IIf([Matières].[RefMatière]=7 And   [Corps].[RefCorps] In (1,17),1,Null)) AS MathCycle2, 
Count(IIf([Matières].[RefMatière]=8 And [Corps].[RefCorps] In (2,17),1,Null)) AS PcCycle1, 
Count(IIf([Matières].[RefMatière]=8 And   [Corps].[RefCorps] In (1,17),1,Null)) AS PcCycle2, 
Count(IIf([Matières].[RefMatière]=9 And [Corps].[RefCorps] In (2,17),1,Null)) AS SvtCycle1, 
Count(IIf([Matières].[RefMatière]=9 And   [Corps].[RefCorps] In (1,17),1,Null)) AS SvtCycle2, 
Count(IIf([Matières].[RefMatière]=12 And [Corps].[RefCorps] In (2,17),1,Null)) AS EpsCycle1, 
Count(IIf([Matières].[RefMatière]=12 And   [Corps].[RefCorps] In (1,17),1,Null)) AS EpsCycle2, 
Count(IIf([Matières].[RefMatière]=10 And [Corps].[RefCorps] In (2,17),1,Null)) AS ApCycle1, 
Count(IIf([Matières].[RefMatière]=10 And   [Corps].[RefCorps] In (1,17),1,Null)) AS ApCycle2, 
Count(IIf([Matières].[RefMatière]=11 And [Corps].[RefCorps] In (2,17),1,Null)) AS MusCycle1, 
Count(IIf([Matières].[RefMatière]=11 And   [Corps].[RefCorps] In (1,17),1,Null)) AS MusCycle2, 
Val([FrCycle1]+[PhiloCycle1]+[AnCycle1]+[EspCycle1]+[AllCycle1]+[HgCycle1]+[MathCycle1]+[PcCycle1]+[SvtCycle1]+[EpsCycle1]+[ApCycle1]+[MusCycle1]) AS TotalCycle1, 
Val([FrCycle2]+[PhiloCycle2]+[AnCycle2]+[EspCycle2]+[AllCycle2]+[HgCycle2]+[MathCycle2]+[PcCycle2]+[SvtCycle2]+[EpsCycle2]+[ApCycle2]+[MusCycle2]) AS TotalCycle2
FROM (Corps INNER JOIN Personnel ON Corps.RefCorps = Personnel.Corps) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
GROUP BY Personnel.Fonction
HAVING (((Personnel.Fonction)=6));
        `;
      const sqlResult = await fetchFromMsAccess<IChp4_A_1_3[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_A_1_3) => {
        return {
              col: [...Object.values(item)],
        };
      });
      // console.log("🚀 ~ file: functions.ts:1353 ~ returnnewPromise ~ contentsArray:", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_A_1_3_effectifs_des_enseignants_par_discipline_et_par_cycle`);
      return reject(err);
    }
  });
};

const chp4_A_2_liste_nominative_du_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      [NomPers] & " " & [PrénomPers] AS NomComplet, 
      Personnel.Sexe AS Genre, 
      Personnel.N°CNPS AS NumCnps, 
      Diplomes.NomDiplome, 
      Matières.MatLong, 
      Personnel.VolumeHoraire, 
      Personnel.N°AutEnseigner AS NumAut, 
      Personnel.Fonction, Personnel.fil_gen, 
      IIf([Personnel].[Matricule] Is Null,"NON","OUI") AS Fonct, 
      IIf([Personnel]![Matricule] Is Null,"OUI","NON") AS Prive
     FROM (Fonction INNER JOIN (Personnel INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) ON Fonction.RefFonction = Personnel.Fonction) LEFT JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome
     WHERE (((Personnel.Fonction)=6));
        `;
      const sqlResult = await fetchFromMsAccess<IChp4_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.Genre),
          c3: nv(item.NumCnps),
          c4: nv(item.NomDiplome),
          c5: nv(item.MatLong),
          c6: nv(item.VolumeHoraire),
          c8: item.Fonct === "OUI" ? " " : "√",
          c7: nv(item.Fonct=== "NON" ? " ":"√"),
          c9: nv(item.NumAut),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_A_2_liste_nominative_du_personnel_enseignant`);
      return reject(err);
    }
  });
};


const chp4_B_2_liste_nominative_du_personnel_admin_et_encadrement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      [NomPers] & " " & [PrénomPers] AS NomComplet, 
      Diplomes.NomDiplome, 
      Fonction.Fonction, 
      Personnel.N°CNPS AS NumCnps, 
      Personnel.N°AutEnseigner AS NumAut, 
      Groupe.RefGroupePers
      FROM Groupe INNER JOIN ((Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) LEFT JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) ON Groupe.RefGroupePers = Fonction.Groupe
      WHERE (((Groupe.RefGroupePers) In (1,3)));
        `;
      const sqlResult = await fetchFromMsAccess<IChp4_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.NomDiplome),
          c3: nv(item.Fonction),
          c4: nv(item.NumCnps),
          c5: nv(item.NumAut),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_B_2_liste_nominative_du_personnel_admin_et_encadrement`);
      return reject(err);
    }
  });
};

const chp4_C_2_liste_nominative_du_personnel_de_service = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      [NomPers] & " " & [PrénomPers] AS NomComplet, 
      Diplomes.NomDiplome, 
      Fonction.Fonction, 
      Personnel.N°CNPS AS NumCnps, 
      Personnel.N°AutEnseigner AS NumAut, 
      Groupe.RefGroupePers
      FROM Groupe INNER JOIN ((Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) LEFT JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) ON Groupe.RefGroupePers = Fonction.Groupe
      WHERE (((Groupe.RefGroupePers)=4));

        `;
      const sqlResult = await fetchFromMsAccess<IChp4_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.NomDiplome),
          c3: nv(item.Fonction),
          c4: nv(item.NumCnps),
          c5: nv(item.NumAut),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_C_2_liste_nominative_du_personnel_de_service`);
      return reject(err);
    }
  });
};





/******* *****
 *
 *
 
 **************************************************************************************************/

const rapport = (data: any): Promise<any> => {
  // console.log("rapport...", data)
  return new Promise(async (resolve, reject) => {
    try {
      const {
        anscol1,
        nometab,
        codeetab,
        drencomplet,
        bpetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        internat,
        num_ouverture,
        ville,
        sitgeo,
      } = await paramEtabObjet([
        "anscol1",
        "nometab",
        "codeetab",
        "drencomplet",
        "bpetab",
        "teletab",
        "emailetab",
        "titrechefetab",
        "nomchefetab",
        "internat",
        "num_ouverture",
        "ville",
        "sitgeo",
      ]);

      const path = await functions_main.fileExists(`C:/SPIDER/Ressources/${codeetab}_logo.jpg`);
      //les autres parametres du fichier python 
      const dataParams = { ...data, logo1: path, path };
      // console.log("dataParams...", dataParams);
      const identite = await Identite();

      const chp1_A_1 = await chp1_A_1_activites_des_unites_pedagogiques_et_conseil_enseignement();
      const chp1_A_2_a = await chp1_A_2_a_Chef_d_etablissement();
      const chp1_A_2_b = await chp1_A_2_b_Inspecteurs_et_conseillers_pedagogiques();
      const chp1_B_1_a = await chp1_B_1_a_tableaux_des_resultats_eleves_affectes_par_classe_par_niveau();
      const chp1_B_1_b = await chp1_B_1_b_tableaux_des_resultats_eleves_affectes_par_niveau();
      const chp1_B_1_c = await chp1_B_1_c_tableaux_des_resultats_eleves_non_affectes_par_classe_par_niveau();
      const chp1_B_1_d = await chp1_B_1_d_tableaux_des_resultats_eleves_non_affectes_par_niveau();
      const chp1_B_1_e = await chp1_B_1_e_recapitulatif_des_resultats_des_eleves_affectes_et_non_par_niveau();
      const chp1_B_2_a = await chp1_B_2_liste_nominative("=1")
      const chp1_B_2_b = await chp1_B_2_liste_nominative("=2")
      const chp1_B_3 = await chp1_B_3_liste_major_classe_par_niveau()
      const chp2_A = await chp2_A_liste_transferts()
      const chp2_B = await chp2_B_repartition_des_eleves_par_annee_de_naissance()
      const chp2_C = await chp2_C_liste_boursiers()
      const chp2_D = await chp2_D_effectif_par_niveau_avec_approche_genre()
      const chp3_C_1 = await chp3_C_1_cas_grossesse()
      const chp3_C_2 = await chp3_C_2_cas_abandon()
      const chp3_C_3 = await chp3_C_3_autres_cas()
      const chp4_A_2 = await chp4_A_2_liste_nominative_du_personnel_enseignant()
      const chp4_B_2 = await chp4_B_2_liste_nominative_du_personnel_admin_et_encadrement()
      const chp4_C_2 = await chp4_C_2_liste_nominative_du_personnel_de_service()
      const chp2_E = await chp2_E_recap_effectif_classe_genre_aff_nonaffect()
      const chp4_A_1_3 = await chp4_A_1_3_effectifs_des_enseignants_par_discipline_et_par_cycle()

      const result = {
        ...dataParams,
        name_report: "prive_secondairegeneral_yakro_2trimestre",
        path_report: "prive/secondaire-general/yakro",
        identite,
        anscol1,
        nometab,
        codeetab,
        drencomplet,
        bpetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        internat,
        num_ouverture,
        ville,
        sitgeo,
        chp1_A_1,
        chp1_A_2_a,
        chp1_A_2_b,
        chp1_B_1_a,
        chp1_B_1_b,
        chp1_B_1_c,
        chp1_B_1_d,
        chp1_B_1_e,
        chp1_B_2_a,
        chp1_B_2_b,
        chp1_B_3,
        chp2_A,
        chp2_B,
        chp2_D,
        chp2_C,
        chp3_C_1,
        chp3_C_2,
        chp3_C_3,
        chp4_A_2,
        chp4_B_2,
        chp4_C_2,
        chp2_E,
        chp4_A_1_3

      };
        // console.log("🚀 ~ file: functions.ts:1595 ~ returnnewPromise ~ chp4_A_1_3:", chp4_A_1_3)
      resolve(result);
    } catch (err: any) {
      return reject(err);
    }
  });
};

export default {
  rapport
};
