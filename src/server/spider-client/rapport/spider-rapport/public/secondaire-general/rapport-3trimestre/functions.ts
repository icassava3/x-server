import { _selectSql } from '../../../../../../databases/index';
import { appCnx, fetchFromMsAccess, paramEtabObjet } from '../../../../../../databases/accessDB';
import {
  IChp1_A_2_a,
  IChp1_A_2_b,
  IChp1_A_3_a,
  IChp1_A_3_b,
  IChp1_A_3_c,
  IChp1_A_4_c,
  IChp_1_B_1,
  IChp_1_B_2,
  IChp_1_B_3,
  IChp1_B_4,
  IChp2_A,
  IChp2_B,
  IChp3_A,
  IChp3_B,
  IChp3_C,
  IChp3_D_1,
  IChp3_D_2,
  IChp3_D_3,
  IChp3_D_4,
  IChp3_D_5,
  IChp1_B_1,
  IChp_1_B_2_b,
  IChp_1_B_2_c,
  IChp_1_C_1,
  IChp4A_1,
  IChp4A_2,
  IChp4B_1,
  IChp4B_2,
  IChp4C_1,
  IChp4C_2,
  IChp2_A_2,
  IChp2_A_1,
  IChp3_D_6,
  IChp1A_3_a,
  IChp1A_3_b,
  IChp1A_4,
  IChp2_1,
  IChp3B,
  IChp3C,
  IChp3D_2,
  IChp4_B_2,
}
  from "./interfaces";

import functions_main from "../../../utils";

const _ = require("lodash");

/* objectif: somme total de filles et garçons par niveau
 * utilisation: chp1_B_1_a
 */
export const addTGFRow = (data: any) => {
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
          const isT = colItemIndex > 0 && [4, 6, 8, 9].includes(colIndex)
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
      if (colItem.genre === "G" || "") {
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
      if (formatedCols[0].genre === "G" || "") {
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


// ce tableau n'est pas encore cree dans SPIDER
const chp1_A_2_a_Activites_des_unites_pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         ' ' AS Discipline,
         ' ' AS DatePeriode,
         ' ' AS TypeActivite, 
         ' ' AS AnimateurTheme
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_2_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_2_b, index: number) => {
        return {
          // c0:index+1,
          c1: nv(item.Discipline),
          c2: nv(item.DatePeriode),
          c3: nv(item.TypeActivite),
          c4: nv(item.AnimateurTheme),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp1_A_2_a_Activites_des_unites_pedagogiques`
      );
      return reject(err);
    }
  });
};


/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_2_b_Activite_des_conseils_enseignement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         ' ' AS Discipline,
         ' ' AS DatePeriode,
         ' ' AS TypeActivite, 
         ' ' AS AnimateurTheme
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_2_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_2_b, index: number) => {
        return {
          // c0:index+1,
          c1: nv(item.Discipline),
          c2: nv(item.DatePeriode),
          c3: nv(item.TypeActivite),
          c4: nv(item.AnimateurTheme),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp1_A_2_b_Activite_des_conseils_enseignement`
      );
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_3_a_Chef_d_etablissement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      tbl_visit.type_visit AS typeVisiteur,
      Fonction.Fonction AS Visiteur, 
       [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomCompletProf, 
       Personnel.fil_gen, 
       Fonction.Fonction, 
       tbl_visit.date_visit AS Dates, 
       tbl_visit.heure_visit AS Heures, 
       Classes.ClasseCourt AS Classe, 
       Personnel.Fonction, 
       classe_matieres_TMP.MatLong AS Discipline
      FROM classe_matieres_TMP INNER JOIN (Fonction INNER JOIN (((Personnel INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers) 
      INNER JOIN tbl_visit ON Personnel.RefPersonnel = tbl_visit.id_pers) 
      INNER JOIN Classes ON tbl_visit.id_classe = Classes.RefClasse) ON Fonction.RefFonction = Personnel.Fonction) ON classe_matieres_TMP.RefMatière = Personnel.RefMatière
      WHERE (((Personnel.Fonction)=6))
      `;
      const sqlResult = await fetchFromMsAccess<IChp1A_3_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_3_a, index: number) => {
        return {
          c1: nv(item.nomVisiteur),
          c2: nv(item.NomCompletProf),
          c3: nv(item.Discipline),
          c4: nv(item.Classe),
          c5: nv(item.Dates),
          c6: nv(item.Heures),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_5_a_Chef_d_etablissement`);
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_3_b_Conseillers_Pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    // table non renseignee
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
      WHERE (((Fonction.RefFonction)=48));
      `;
      const sqlResult = await fetchFromMsAccess<IChp1A_3_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_3_b, index: number) => {
        return {
          // c0:index+1,
          c1: nv(item.Visiteur),
          c2: nv(item.NomCompletProf),
          c3: nv(item.Discipline),
          c4: nv(item.Classe),
          c5: nv(item.Dates),
          c6: nv(item.Heures),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_5_b_Conseillers_Pedagogiques`);
      return reject(err);
    }
  });
};


/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_3_c_Inspecteurs = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1_A_3_c[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_3_c, index: number) => {
        return {
          // c0:index+1,
          c1: nv(item.Visiteur),
          c2: nv(item.NomCompletProf),
          c3: nv(item.Discipline),
          c4: nv(item.Classe),
          c5: nv(item.Dates),
          c6: nv(item.Heures),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_3_c_Inspecteurs`);
      return reject(err);
    }
  });
};

/**
 * La table n'est pas encore implementé dans spider nous avons utiliser la matiere par defaut
 */
const chp1_A_4_Formations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
      ' ' AS Discipline, 
      ' ' AS DateFormation, 
      ' ' AS ThemeEtLieu,
      ' ' AS AnimateurDuTheme
      FROM Personnel 
      INNER JOIN Matières 
      ON Personnel.RefMatière = Matières.RefMatière
      `;
      const sqlResult = await fetchFromMsAccess<IChp1A_4[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_4, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Discipline),
          c2: nv(item.DateFormation),
          c3: nv(item.ThemeEtLieu),
          c4: nv(item.AnimateurDuTheme),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_5_c_Inspecteurs`);
      return reject(err);
    }
  });
};

const chp1_B_1_a_tableaux_statistiques_des_resultats_scolaire_par_niveau = (Moy:string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql1 = `
         SELECT Niveaux.RefNiveau, 
             "#FFFF" AS bg,  
             Niveaux.NiveauCourt, 
             Classes.ClasseCourt, 
            IIf([Elèves].[Sexe] Is Not Null AND [Elèves].[Sexe] <> 0 AND [Elèves].[Sexe] <> 1, IIf([Elèves].[Sexe]=2, "F", "G"), "G") AS genre,
             Count(Elèves.RefElève) AS EffectTotal, 
             Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
             Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
             Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
             IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
             Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
             IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
             Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, 
             IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
             IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL ( 
      SELECT Niveaux.RefNiveau,
      "#FDE9D9" AS bg, 
      Niveaux.NiveauCourt, 
      "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe] Is Not Null AND [Elèves].[Sexe] <> 0 AND [Elèves].[Sexe] <> 1, IIf([Elèves].[Sexe]=2, "F", "G"), "G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal,
       Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
       Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
       Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
       IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,
        Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
        IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
        Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, 
        IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
        IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )

      UNION ALL(
      SELECT Niveaux.RefNiveau,  
      "#FFFF" AS bg, Niveaux.NiveauCourt, 
      Classes.ClasseCourt,  
      IIf([Elèves].[Sexe] Is Not Null AND [Elèves].[Sexe] <> 0 AND [Elèves].[Sexe] <> 1, IIf([Elèves].[Sexe]=2, "F", "G"), "G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#FDE9D9" AS bg, 
      Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe] Is Not Null AND [Elèves].[Sexe] <> 0 AND [Elèves].[Sexe] <> 1, IIf([Elèves].[Sexe]=2, "F", "G"), "G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
       WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, 
      Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )

      UNION ALL(
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, 
      Niveaux.NiveauCourt, 
      Classes.ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau, 
      "#FDE9D9" AS bg,Niveaux.NiveauCourt, 
      "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, 
      Niveaux.NiveauCourt, 
      Classes.ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#FDE9D9" AS bg, 
      Niveaux.NiveauCourt, 
      "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
       WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL (
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg,Niveaux.NiveauCourt,Classes.ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal,Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse,
      Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse,Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1,
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,
      Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2,
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,
      Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3,
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,
      IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse 
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe, TypesClasses.RefTypeClasse
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<>6))
      ORDER BY Classes.OrdreClasse;

     UNION ALL 
SELECT Niveaux.RefNiveau, "#FDE9D9" AS bg, Niveaux.NiveauCourt, 'S/Total 2nde A' AS ClasseCourt, 
IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,
 IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=5));
)

UNION ALL (
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg,Niveaux.NiveauCourt,Classes.ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,Count(Elèves.RefElève) AS EffectTotal,Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse,Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse,Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1,IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2,IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3,IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse 
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<>5))
      ORDER BY Classes.OrdreClasse;

UNION ALL
SELECT Niveaux.RefNiveau, "#FDE9D9" AS bg, Niveaux.NiveauCourt, "S/Total 2nde C" AS ClasseCourt,  
IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=6));
)
UNION ALL( 
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg,
      Niveaux.NiveauCourt,"Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse,Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse,
      Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1,IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,
      Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2,IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,
      Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3,IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,
      IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse 
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )

      UNION ALL(
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=7))
      ORDER BY Classes.OrdreClasse;

     UNION ALL
      SELECT Niveaux.RefNiveau,"#FDE9D9" AS bg,
      Niveaux.NiveauCourt, 
      "Total " & "1ère A" AS ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,TypesClasses.RefTypeClasse,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=7));
      )

      UNION ALL ( 
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, 
      Niveaux.NiveauCourt, Classes.ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=8))
      ORDER BY Classes.OrdreClasse;
UNION ALL
    SELECT Niveaux.RefNiveau,"#FDE9D9" AS bg, Niveaux.NiveauCourt, 
    "Total " & "1ère C" AS ClasseCourt, 
    IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
    Count(Elèves.RefElève) AS EffectTotal, 
    Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
    Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
    Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
    IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
    FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
    WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
    GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,TypesClasses.RefTypeClasse,Elèves.Sexe
    HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=8));
)
    UNION ALL ( 
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, 
      Niveaux.NiveauCourt, Classes.ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=9))
      ORDER BY Classes.OrdreClasse;

UNION ALL 
SELECT Niveaux.RefNiveau,"#FDE9D9" AS bg, Niveaux.NiveauCourt, 
    "Total " & "1ère D" AS ClasseCourt, 
    IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
    Count(Elèves.RefElève) AS EffectTotal, 
    Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
    Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
    Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
    IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
    Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
    IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
    Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, 
    IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
    IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
    FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
    WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
    GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,TypesClasses.RefTypeClasse,Elèves.Sexe
    HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=9));
)

    UNION ALL( 
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, 
      Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)

UNION ALL ( 
SELECT Niveaux.RefNiveau, 
"#FFFF" AS bg, 
Niveaux.NiveauCourt, 
Classes.ClasseCourt, 
IIf([Elèves].[Sexe] = 2, "F", "G") AS genre, 
Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([${Moy}] Is Null, Null, 1)) AS EffectClasse, 
Count(IIf([${Moy}] Is Null, 1, Null)) AS EffectNonClasse, 
Count(IIf([${Moy}] >= 10, 1, Null)) AS Tranche1, 
IIf([EffectClasse] = 0, 0, Round([Tranche1] / [EffectClasse] * 100, 2)) AS Taux1, 
Count(IIf([${Moy}] Between 8.5 And 9.99, 1, Null)) AS Tranche2, 
IIf([EffectClasse] = 0, 0, Round([Tranche2] / [EffectClasse] * 100, 2)) AS Taux2, 
Count(IIf([${Moy}] Between 0 And 8.49, 1, Null)) AS Tranche3, 
IIf([EffectClasse] = 0, 0, Round([Tranche3] / [EffectClasse] * 100, 2)) AS Taux3, 
IIf([EffectClasse] < 1, 0, Round(Sum([${Moy}]) / [EffectClasse], 2)) AS MoyClasse
FROM ((Niveaux 
INNER JOIN (TypesClasses 
INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) 
ON Niveaux.RefNiveau = TypesClasses.Niveau) 
INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) 
INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE ((Elèves.Sexe) Is Not Null AND (Elèves.Sexe = 1 OR Elèves.Sexe = 2))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe
HAVING ((Niveaux.NiveauCourt = "Tle A" AND TypesClasses.filière = 1 AND Elèves.inscrit = Yes) 
OR (Classes.OrdreClasse BETWEEN 10001 AND 10005))
ORDER BY Classes.OrdreClasse
UNION ALL
SELECT Niveaux.RefNiveau,
"#FDE9D9" AS bg, 
Niveaux.NiveauCourt, 
"S/Total  Tle A"  AS ClasseCourt, 
IIf([Elèves].[Sexe] = 2, "F", "G") AS genre, 
Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([${Moy}] Is Null, Null, 1)) AS EffectClasse, 
Count(IIf([${Moy}] Is Null, 1, Null)) AS EffectNonClasse, 
Count(IIf([${Moy}] >= 10, 1, Null)) AS Tranche1, 
IIf([EffectClasse] = 0, 0, Round([Tranche1] / [EffectClasse] * 100, 2)) AS Taux1, 
Count(IIf([${Moy}] Between 8.5 And 9.99, 1, Null)) AS Tranche2, 
IIf([EffectClasse] = 0, 0, Round([Tranche2] / [EffectClasse] * 100, 2)) AS Taux2, 
Count(IIf([${Moy}] Between 0 And 8.49, 1, Null)) AS Tranche3, 
IIf([EffectClasse] = 0, 0, Round([Tranche3] / [EffectClasse] * 100, 2)) AS Taux3, 
IIf([EffectClasse] < 1, 0, Round(Sum([${Moy}]) / [EffectClasse], 2)) AS MoyClasse
FROM ((Niveaux 
INNER JOIN (TypesClasses 
INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) 
ON Niveaux.RefNiveau = TypesClasses.Niveau) 
INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) 
INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE ((Elèves.Sexe) Is Not Null AND (Elèves.Sexe = 1 OR Elèves.Sexe = 2))
AND ((Niveaux.NiveauCourt = "Tle A" AND TypesClasses.filière = 1 AND Elèves.inscrit = Yes) 
OR (Classes.OrdreClasse BETWEEN 10001 AND 10005))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe;
)

UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, 
IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,
Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, 
IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2)))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe
HAVING (((Niveaux.NiveauCourt)="Tle C") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes)) OR (((Classes.OrdreClasse) Between 11000 And 11005))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#FDE9D9" AS bg, Niveaux.NiveauCourt, "S/Total Tle C" AS ClasseCourt, 
IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((Niveaux.NiveauCourt)="Tle C") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2))) OR (((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2)) AND ((Classes.OrdreClasse) Between 11000 And 11000))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe;
)

UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, 
Classes.ClasseCourt, IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, 
IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2)))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe
HAVING (((Niveaux.NiveauCourt)="Tle D") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes)) OR (((Classes.OrdreClasse) Between 12001 And 12007))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#FDE9D9" AS bg, Niveaux.NiveauCourt, "S/Total  Tle D" AS ClasseCourt, 
IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((Niveaux.NiveauCourt)="Tle C") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2))) OR (((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2)) AND ((Classes.OrdreClasse) Between 12001 And 12007))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe;
)

UNION ALL (
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, 
      Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([${Moy}] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([${Moy}] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([${Moy}]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([${Moy}] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([${Moy}] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,0,Round(Sum([${Moy}])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
    )
      `;
      const isEmpty = {
        bg: "#FFFF",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""]
      }
      const sqlResult = await fetchFromMsAccess<IChp1_B_1[]>(sql1, appCnx);
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_B_1) => {
        const items = _.omit(item, ["RefNiveau", "orderby", "OrdreClasse", "ClasseCourt", "NiveauCourt", "bg", "genre"]);
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
      const result1 = await addTGFRow(groupeContents);
      const result2 = await result1.map((item: any) => {
        return {
          label: item.NiveauCourt,
          classe: item.label,
          cols: item.cols,
          bg: item.bg
        };
      });
      const result = await functions_main.groupLabelByGroup(result2);

      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_a_tableaux_statistiques_des_resultats_scolaire_par_niveau`);
      return reject(err);
    }
  });
};


const chp1_B_1_b_liste_nominative_des_eleves_et_resultats_scolaires = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql1 = `SELECT 
      tbl_apprec.IdAppréciation, 
      tbl_apprec.Niveau, 
      tbl_apprec.Appréciations AS Appreciations, 
      tbl_apprec.NotePlancher, 
      tbl_apprec.NotePlafond
      FROM tbl_apprec
      WHERE (((tbl_apprec.Niveau)="Trimestre"))
      `
      const sqlResult1 = await fetchFromMsAccess<any>(sql1, appCnx);
      if (sqlResult1.length === 0) return resolve([]);


      let sql2 = `
      SELECT Niveaux.RefNiveau AS OrderBy, 
      Classes.ClasseCourt, 
      Classes.ClasseLong, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss,
       IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
       IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite,
        IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
        IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
              IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2
,
        T_Notes.MOYG3 AS MoyG3, 
        Notes.RangG3,
         '-' AS MS, 
         (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, 
         (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ, 
         IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
         "" AS NumDeciAffect, 
         IIf(IsNull(Elèves.Obs),"",Elèves.Obs) AS Obs, 
         (IIf([Elèves].[RefElève]<>0,1,0)) AS EffectTotal,
          IIf([MOYG3]>=10,1,0) AS Admis, 
          IIf([Elèves].[Redoub]=0 And [MOYG3] Between 8.5 And 9.99,1,0) AS Redouble, 
          IIf([MOYG3] Between 0 And 8.49,1,0) AS Exclus
      FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
      WHERE (((Elèves.inscrit)=True) AND ((Elèves.StatutElève)<>False))
      ORDER BY Niveaux.RefNiveau, Classes.ClasseLong, [NomElève] & " " & [PrénomElève];
              `;
      const sqlResult2 = await fetchFromMsAccess<IChp_1_B_2[]>(sql2, appCnx);
      if (sqlResult2.length === 0) return resolve([
        {
          label: '',
          obj: { classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);
      const resultat = functions_main.fusionnerTableaux(sqlResult1, sqlResult2, 'MoyG3')
      const contentsArray = resultat.map((item: IChp_1_B_2, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.Genre),
          c4: nv(item.DateNaiss),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.Lang2),
          c8: nv(item.MoyG3),
          c9: nv(item.RangG3),
          c10: nv(item.Appreciations),
          Admis: item.Admis,
          Redouble: item.Redouble,
          Exclus: item.Exclus,
          label: item.ClasseLong,
          obj: {
            classeLong: item.ClasseLong,
            pp: nv(item.ProfP),
            educ: nv(item.Educ),
          },
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup2(contentsArray);
      // console.log("result.chp1_B_2 ...",JSON.stringify(result[0]))
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_2_liste_nomination_eleve`);
      return reject(err);
    }
  });
};

const chp1_B_1_c_liste_major_classe_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      TypesClasses.RefTypeClasse, 
      Classes.ClasseCourt, 
      T_Notes.MOYG3 AS MoyG3, 
      Niveaux.NiveauCourt, 
      Niveaux.NiveauCourt AS label, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(DateNaiss,"Short Date") AS DateNais, 
      Int((Date()-[DateNaiss])/365.5) AS Age, 
      IIf([Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
            IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2
,
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      Elèves.Décision AS NumDeciAffect, 
      Notes.RangG3
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Notes.RangG3) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY TypesClasses.RefTypeClasse, Classes.ClasseCourt, T_Notes.MOYG3 DESC , Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];  
      `;
      const sqlResult = await fetchFromMsAccess<IChp_1_B_3[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp_1_B_3, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNais),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.StatutEleve),
          c8: nv(item.NumDeciAffect),
          c9: nv(item.Lang2),
          c10: nv(item.MoyG3),
          c11: nv(item.RangG3),
          c12: nv(item.ClasseCourt),
          label: item.label,
          obj: { label: item.label },
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_c_liste_major_classe_niveau`);
      return reject(err);
    }
  });
};

//B Fin D'année
const chp1_B_2_a_tableaux_statistiques_des_resultats_scolaire_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
               SELECT Niveaux.RefNiveau, 
             "#FFFF" AS bg,  
             Niveaux.NiveauCourt, 
             Classes.ClasseCourt, 
            IIf([Elèves].[Sexe] Is Not Null AND [Elèves].[Sexe] <> 0 AND [Elèves].[Sexe] <> 1, IIf([Elèves].[Sexe]=2, "F", "G"), "G") AS genre,
             Count(Elèves.RefElève) AS EffectTotal, 
             Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
             Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
             Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
             IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
             Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
             IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
             Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, 
             IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
             IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL ( 
      SELECT Niveaux.RefNiveau,
      "#E3E3E3" AS bg, 
      Niveaux.NiveauCourt, 
      "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe] Is Not Null AND [Elèves].[Sexe] <> 0 AND [Elèves].[Sexe] <> 1, IIf([Elèves].[Sexe]=2, "F", "G"), "G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal,
       Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
       Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
       Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
       IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,
        Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
        IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
        Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, 
        IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
        IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )

      UNION ALL(
      SELECT Niveaux.RefNiveau,  
      "#FFFF" AS bg, Niveaux.NiveauCourt, 
      Classes.ClasseCourt,  
      IIf([Elèves].[Sexe] Is Not Null AND [Elèves].[Sexe] <> 0 AND [Elèves].[Sexe] <> 1, IIf([Elèves].[Sexe]=2, "F", "G"), "G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, 
      Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe] Is Not Null AND [Elèves].[Sexe] <> 0 AND [Elèves].[Sexe] <> 1, IIf([Elèves].[Sexe]=2, "F", "G"), "G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
       WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, 
      Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )

      UNION ALL(
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, 
      Niveaux.NiveauCourt, 
      Classes.ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau, 
      "#E3E3E3" AS bg,Niveaux.NiveauCourt, 
      "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, 
      Niveaux.NiveauCourt, 
      Classes.ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, 
      Niveaux.NiveauCourt, 
      "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
       WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL (
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg,Niveaux.NiveauCourt,Classes.ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal,Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse,
      Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse,Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1,
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,
      Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2,
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,
      Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3,
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,
      IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse 
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe, TypesClasses.RefTypeClasse
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<>6))
      ORDER BY Classes.OrdreClasse;

     UNION ALL 
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, 'S/Total 2nde A' AS ClasseCourt, 
IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,
 IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=5));
)

UNION ALL (
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg,Niveaux.NiveauCourt,Classes.ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,Count(Elèves.RefElève) AS EffectTotal,Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse,Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse,Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1,IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2,IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3,IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse 
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<>5))
      ORDER BY Classes.OrdreClasse;

UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "S/Total 2nde C" AS ClasseCourt,  
IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=6));
)
UNION ALL( 
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg,Niveaux.NiveauCourt,"Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse,Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse,
      Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1,IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,
      Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2,IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,
      Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3,IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,
      IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse 
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )

      UNION ALL(
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt,  
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=7))
      ORDER BY Classes.OrdreClasse;

     UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg,
      Niveaux.NiveauCourt, 
      "Total " & "1ère A" AS ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,TypesClasses.RefTypeClasse,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=7));
      )

      UNION ALL ( 
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, 
      Niveaux.NiveauCourt, Classes.ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=8))
      ORDER BY Classes.OrdreClasse;
UNION ALL
    SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, 
    "Total " & "1ère C" AS ClasseCourt, 
    IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
    Count(Elèves.RefElève) AS EffectTotal, 
    Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
    Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
    Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
    IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
    FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
    WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
    GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,TypesClasses.RefTypeClasse,Elèves.Sexe
    HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=8));
)
    UNION ALL ( 
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, 
      Niveaux.NiveauCourt, Classes.ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre,
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=9))
      ORDER BY Classes.OrdreClasse;

UNION ALL 
SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, 
    "Total " & "1ère D" AS ClasseCourt, 
    IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
    Count(Elèves.RefElève) AS EffectTotal, 
    Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
    Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
    Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
    IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
    Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
    IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
    Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, 
    IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
    IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
    FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
    WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
    GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,TypesClasses.RefTypeClasse,Elèves.Sexe
    HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=9));
)
    UNION ALL( 
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, 
      Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)

UNION ALL ( 
SELECT Niveaux.RefNiveau, 
"#FFFF" AS bg, 
Niveaux.NiveauCourt, 
Classes.ClasseCourt, 
IIf([Elèves].[Sexe] = 2, "F", "G") AS genre, 
Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([MOYG4] Is Null, Null, 1)) AS EffectClasse, 
Count(IIf([MOYG4] Is Null, 1, Null)) AS EffectNonClasse, 
Count(IIf([MOYG4] >= 10, 1, Null)) AS Tranche1, 
IIf([EffectClasse] = 0, 0, Round([Tranche1] / [EffectClasse] * 100, 2)) AS Taux1, 
Count(IIf([MOYG4] Between 8.5 And 9.99, 1, Null)) AS Tranche2, 
IIf([EffectClasse] = 0, 0, Round([Tranche2] / [EffectClasse] * 100, 2)) AS Taux2, 
Count(IIf([MOYG4] Between 0 And 8.49, 1, Null)) AS Tranche3, 
IIf([EffectClasse] = 0, 0, Round([Tranche3] / [EffectClasse] * 100, 2)) AS Taux3, 
IIf([EffectClasse] < 1, 0, Round(Sum([MOYG4]) / [EffectClasse], 2)) AS MoyClasse
FROM ((Niveaux 
INNER JOIN (TypesClasses 
INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) 
ON Niveaux.RefNiveau = TypesClasses.Niveau) 
INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) 
INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE ((Elèves.Sexe) Is Not Null AND (Elèves.Sexe = 1 OR Elèves.Sexe = 2))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe
HAVING ((Niveaux.NiveauCourt = "Tle A" AND TypesClasses.filière = 1 AND Elèves.inscrit = Yes) 
OR (Classes.OrdreClasse BETWEEN 10001 AND 10005))
ORDER BY Classes.OrdreClasse
UNION ALL
SELECT Niveaux.RefNiveau,
"#E3E3E3" AS bg, 
Niveaux.NiveauCourt, 
"S/Total  Tle A"  AS ClasseCourt, 
IIf([Elèves].[Sexe] = 2, "F", "G") AS genre, 
Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([MOYG4] Is Null, Null, 1)) AS EffectClasse, 
Count(IIf([MOYG4] Is Null, 1, Null)) AS EffectNonClasse, 
Count(IIf([MOYG4] >= 10, 1, Null)) AS Tranche1, 
IIf([EffectClasse] = 0, 0, Round([Tranche1] / [EffectClasse] * 100, 2)) AS Taux1, 
Count(IIf([MOYG4] Between 8.5 And 9.99, 1, Null)) AS Tranche2, 
IIf([EffectClasse] = 0, 0, Round([Tranche2] / [EffectClasse] * 100, 2)) AS Taux2, 
Count(IIf([MOYG4] Between 0 And 8.49, 1, Null)) AS Tranche3, 
IIf([EffectClasse] = 0, 0, Round([Tranche3] / [EffectClasse] * 100, 2)) AS Taux3, 
IIf([EffectClasse] < 1, 0, Round(Sum([MOYG4]) / [EffectClasse], 2)) AS MoyClasse
FROM ((Niveaux 
INNER JOIN (TypesClasses 
INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) 
ON Niveaux.RefNiveau = TypesClasses.Niveau) 
INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) 
INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE ((Elèves.Sexe) Is Not Null AND (Elèves.Sexe = 1 OR Elèves.Sexe = 2))
AND ((Niveaux.NiveauCourt = "Tle A" AND TypesClasses.filière = 1 AND Elèves.inscrit = Yes) 
OR (Classes.OrdreClasse BETWEEN 10001 AND 10005))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe;
)

UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2)))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe
HAVING (((Niveaux.NiveauCourt)="Tle C") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes)) OR (((Classes.OrdreClasse) Between 11000 And 11005))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "S/Total  Tle C" AS ClasseCourt, IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((Niveaux.NiveauCourt)="Tle C") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2))) OR (((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2)) AND ((Classes.OrdreClasse) Between 11000 And 11000))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe;
)

UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2)))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe
HAVING (((Niveaux.NiveauCourt)="Tle D") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes)) OR (((Classes.OrdreClasse) Between 12001 And 12007))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "S/Total  Tle D" AS ClasseCourt, IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((Niveaux.NiveauCourt)="Tle C") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2))) OR (((Elèves.Sexe) Is Not Null And ((Elèves.Sexe)=1 Or (Elèves.Sexe)=2)) AND ((Classes.OrdreClasse) Between 12001 And 12007))
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe;
)

UNION ALL (
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, 
      Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));

      UNION ALL
      SELECT Max(Niveaux.RefNiveau) AS RefNiveau,"#FFCDD2" AS bg,  "" AS NiveauCourt,
      "Total Etabliss" AS ClasseCourt, 
      IIf([Elèves].[Sexe]=2,"F","G") AS genre, 
      Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE [Elèves].[Sexe] Is Not Null AND ([Elèves].[Sexe] = 1 OR [Elèves].[Sexe] = 2)
      GROUP BY TypesClasses.filière, Elèves.inscrit,Elèves.Sexe
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      )
      `;
      const isEmpty = {
        bg: "#FFFF",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""]
      }
      const sqlResult = await fetchFromMsAccess<IChp1_B_1[]>(sql, appCnx);
      // console.log("🚀 ~ file: functions.ts:216 ~ returnnewPromise ~ sqlResult:", sqlResult)
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_B_1) => {
        const items = _.omit(item, ["RefNiveau", "orderby", "OrdreClasse", "ClasseCourt", "NiveauCourt", "bg", "genre"]);
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
      const result1 = await addTGFRow(groupeContents);

      const result2 = await result1.map((item: any) => {
        return {
          label: item.NiveauCourt,
          classe: item.label,
          cols: item.cols,
          // bg: item.bg,
        };
      });
      const result = await functions_main.groupLabelByGroup(result2);
      // console.log("result.chp1_B_1_a ... ", JSON.stringify(result[0]));

      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_a_tableaux_statistiques_des_resultats_scolaire_par_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_2_b_liste_nominative_des_eleves_et_resultats_scolaires = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau AS OrderBy, 
      Classes.ClasseCourt, 
      Classes.ClasseLong, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss,
       IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
       IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite,
        IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
        IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
              IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2,
        T_Notes.MOYG4 AS MoyG4, 
        Notes.RangG4,
         '-' AS MS, 
         (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, 
         (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ, 
         IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
         Elèves.Décision AS NumDeciAffect, 
         IIf(IsNull(Elèves.Obs),"",Elèves.Obs) AS Obs, 
         (IIf([Elèves].[RefElève]<>0,1,0)) AS EffectTotal,
          IIf([MOYG4]>=10,1,0) AS Admis, 
          IIf([Elèves].[Redoub]=0 And [MOYG4] Between 8.5 And 9.99,1,0) AS Redouble, 
          IIf([MOYG4] Between 0 And 8.49,1,0) AS Exclus
      FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
      WHERE (((Elèves.inscrit)=True) AND ((Elèves.StatutElève)<>False))
      ORDER BY Niveaux.RefNiveau, Classes.ClasseLong, [NomElève] & " " & [PrénomElève];
              `;
      const sqlResult = await fetchFromMsAccess<IChp_1_B_2_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([
        {
          label: '',
          obj: { classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);
      const contentsArray = sqlResult.map((item: IChp_1_B_2_b, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.Genre),
          c4: nv(item.DateNaiss),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.Lang2),
          c8: nv(item.MoyG4),
          c9: nv(item.RangG4),
          c10: nv(item.NumDeciAffect),
          Admis: item.Admis,
          Redouble: item.Redouble,
          Exclus: item.Exclus,
          label: item.ClasseLong,
          obj: {
            classeLong: item.ClasseLong,
            pp: nv(item.ProfP),
            educ: nv(item.Educ),
          },
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup2(contentsArray);
      // console.log("result.chp1_B_2 ...",JSON.stringify(result))
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_2_liste_nomination_eleve`);
      return reject(err);
    }
  });
};

const chp1_B_2_c_liste_major_classe_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      TypesClasses.RefTypeClasse, 
      Classes.ClasseCourt, 
      T_Notes.MOYG4 AS MoyG4, 
      Niveaux.NiveauCourt, 
      Niveaux.NiveauCourt AS label, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(DateNaiss,"Short Date") AS DateNais, 
      Int((Date()-[DateNaiss])/365.5) AS Age, 
      IIf([Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
            IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2,
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      Elèves.Décision AS NumDeciAffect, 
      Notes.RangG4
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Notes.RangG4) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY TypesClasses.RefTypeClasse, Classes.ClasseCourt, T_Notes.MOYG4 DESC , Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];  
      `;
      const sqlResult = await fetchFromMsAccess<IChp_1_B_2_c[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp_1_B_2_c, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNais),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.StatutEleve),
          c8: nv(item.NumDeciAffect),
          // c9: nv(item.Lang2),
          c9: nv(item.Lang2),
          c10: nv(item.MoyG4),
          c11: nv(item.RangG4),
          c12: nv(item.ClasseCourt),
          label: item.label,
          obj: { label: item.label },
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_c_liste_major_classe_niveau`);
      return reject(err);
    }
  });
};

// Examen blanc
const chp1_C_3_a_examen_blanc = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, 
      "BEPC" AS Serie, 

      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS InscritIvoirienGarçon, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS InscritIvoirienFille, 
      [InscritIvoirienGarçon]+[InscritIvoirienFille] AS TotalInscritIvoirien, 
      
      Count(IIf([Elèves].[Inscrit]<>0 And ([SEXE]=1 And [Nat]<>"70"),1,Null)) AS GarçonEtrangerInscrit, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS FilleEtrangerInscrit, 
      [GarçonEtrangerInscrit]+[FilleEtrangerInscrit] AS TotalEtrangerInscrit, 
      
      [TotalInscritIvoirien]+[TotalEtrangerInscrit] AS TotalInscritIvoirienEtNon,
       
      Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=1 And [Nat]="70",1,Null)) AS PresentIvoirienGarçon,
      Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=2 And [Nat]="70",1,Null)) AS PresentIvoirienFille, 
      [PresentIvoirienGarçon]+[PresentIvoirienFille] AS TotalIvoirienPresent, 
      
      Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS PresentEtrangerGarçon,
      Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS PresentEtrangerFille, 
      [PresentEtrangerGarçon]+[PresentEtrangerFille] AS TotalEtrangerPresent, 
      
      [TotalIvoirienPresent]+[TotalEtrangerPresent] AS TotalPresentIvoirienEtNon,
      
      Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS AdmisIvoirienGarçon, 
      Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS AdmisIvoirienFille, 
      [AdmisIvoirienFille]+[AdmisIvoirienGarçon] AS TotalIvoirienAdmis, 
      
      Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS AdmisEtrangerGarçon, 
      Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS AdmisEtrangerFille, 
      [AdmisEtrangerGarçon]+[AdmisEtrangerFille] AS TotalEtrangerAdmis, 
      
      [TotalIvoirienAdmis]+[TotalEtrangerAdmis] AS TotalAdmisIvoirienEtNon,
      
      IIf([TotalIvoirienPresent]=0,0,Round([TotalIvoirienAdmis]/[TotalIvoirienPresent]*100,2)) AS TauxIvoirienAdmis, 
      IIf([TotalEtrangerPresent]=0,0,Round([TotalEtrangerAdmis]/[TotalIvoirienPresent]*100,2)) AS TauxEtrangerAdmis,
      IIf([TotalPresentIvoirienEtNon]=0,0,Round([TotalAdmisIvoirienEtNon]/[TotalPresentIvoirienEtNon]*100,2)) AS TotalTaux      
      
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série]
      HAVING (((Niveaux.RefNiveau)=4));

UNION ALL 

SELECT 
Niveaux.RefNiveau, 
[NiveauCourt] & " " & [Série] AS Serie, 

Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS InscritIvoirienGarçon, 
Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS InscritIvoirienFille, 
[InscritIvoirienGarçon]+[InscritIvoirienFille] AS TotalInscritIvoirien,

Count(IIf([Elèves].[Inscrit]<>0 And ([SEXE]=1 And [Nat]<>"70"),1,Null)) AS GarçonEtrangerInscrit, 
Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS FilleEtrangerInscrit, 
[GarçonEtrangerInscrit]+[FilleEtrangerInscrit] AS TotalEtrangerInscrit,  

 [TotalInscritIvoirien]+[TotalEtrangerInscrit] AS TotalInscritIvoirienEtNon,

Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=1 And [Nat]="70",1,Null)) AS PresentIvoirienGarçon,
Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=2 And [Nat]="70",1,Null)) AS PresentIvoirienFille, 
[PresentIvoirienGarçon]+[PresentIvoirienFille] AS TotalIvoirienPresent, 

Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS PresentEtrangerGarçon,
Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS PresentEtrangerFille, 
[PresentEtrangerGarçon]+[PresentEtrangerFille] AS TotalEtrangerPresent, 

[TotalIvoirienPresent]+[TotalEtrangerPresent] AS TotalPresentIvoirienEtNon,

Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS AdmisIvoirienGarçon, 
Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS AdmisIvoirienFille, 
[AdmisIvoirienFille]+[AdmisIvoirienGarçon] AS TotalIvoirienAdmis, 

Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS AdmisEtrangerGarçon, 
Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS AdmisEtrangerFille, 
[AdmisEtrangerGarçon]+[AdmisEtrangerFille] AS TotalEtrangerAdmis, 

[TotalIvoirienAdmis]+[TotalEtrangerAdmis] AS TotalAdmisIvoirienEtNon,

IIf([TotalIvoirienPresent]=0,0,Round([TotalIvoirienAdmis]/[TotalIvoirienPresent]*100,2)) AS TauxIvoirienAdmis, 
IIf([TotalEtrangerPresent]=0,0,Round([TotalEtrangerAdmis]/[TotalIvoirienPresent]*100,2)) AS TauxEtrangerAdmis,
IIf([TotalPresentIvoirienEtNon]=0,0,Round([TotalAdmisIvoirienEtNon]/[TotalPresentIvoirienEtNon]*100,2)) AS TotalTaux

FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, [NiveauCourt] & " " & [Série], TypesClasses.Niveau, TypesClasses.RefTypeClasse
HAVING (((Niveaux.RefNiveau)=7) AND ((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14));
 UNION ALL
 SELECT 
Niveaux.RefNiveau, 
"TOTAL BAC" AS Serie, 

Count(IIf([SEXE]=1 And [Nat]="70",1,Null)) AS TotalIvoirienGarçon, 
Count(IIf([SEXE]=2 And [Nat]="70",1,Null)) AS TotalIvoirienFille, 
[TotalIvoirienGarçon]+[TotalIvoirienFille] AS TotalIvoirien, 

Count(IIf([SEXE]=1 And [Nat]<>"70",1,Null)) AS TotalEtrangerGarçon, 
Count(IIf([SEXE]=2 And [Nat]<>"70",1,Null)) AS TotalEtrangerFille, 
[TotalEtrangerGarçon]+[TotalEtrangerFille] AS TotalEtranger, 

[TotalIvoirien]+[TotalEtranger] AS TotalIvoirienEtNon,

Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS InscritIvoirienGarçon, 
Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS InscritIvoirienFille, 
[InscritIvoirienGarçon]+[InscritIvoirienFille] AS TotalInscritIvoirien, 

Count(IIf([Elèves].[Inscrit]<>0 And ([SEXE]=1 And [Nat]<>"70"),1,Null)) AS GarçonEtrangerInscrit, 
Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS FilleEtrangerInscrit, 
[GarçonEtrangerInscrit]+[FilleEtrangerInscrit] AS TotalEtrangerInscrit, 

[TotalInscritIvoirien]+[TotalEtrangerInscrit] AS TotalInscritIvoirienEtNon,


Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=1 And [Nat]="70",1,Null)) AS PresentIvoirienGarçon,
Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=2 And [Nat]="70",1,Null)) AS PresentIvoirienFille, 
[PresentIvoirienGarçon]+[PresentIvoirienFille] AS TotalIvoirienPresent, 

Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS PresentEtrangerGarçon,
Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS PresentEtrangerFille, 
[PresentEtrangerGarçon]+[PresentEtrangerFille] AS TotalEtrangerPresent, 

[TotalIvoirienPresent]+[TotalEtrangerPresent] AS TotalPresentIvoirienEtNon,

IIf([TotalIvoirienPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [Nat]="70",1,Null))/[TotalIvoirienPresent]*100,2)) AS TauxIvoirienAdmis, 
IIf([TotalEtrangerPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [Nat]<>"70",1,Null))/[TotalIvoirienPresent]*100,2)) AS TauxEtrangerAdmis,
IIf([TotalPresentIvoirienEtNon]=0,0,Round(Count(IIf([Elèves].[AdmisExamBlanc]<>0,1,Null))/[TotalPresentIvoirienEtNon]*100,2)) AS TotalTaux

FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14))
GROUP BY Niveaux.RefNiveau;
       
      `;
      const sqlResult = await fetchFromMsAccess<IChp_1_C_1[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp_1_C_1, i: number) => {
        const items = _.omit(item, ["RefNiveau", "CycleX", "CycleX1", "Serie"]);
        return {
          label: item.Serie,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_C_3_a_examen_blanc`);
      return reject(err);
    }
  });
};

// Examan de fin année

const chp1_C_4_a_examen_fin_annee = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, 
      "BEPC" AS Serie, 

      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS InscritIvoirienGarçon, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS InscritIvoirienFille, 
      [InscritIvoirienGarçon]+[InscritIvoirienFille] AS TotalInscritIvoirien, 
      
      Count(IIf([Elèves].[Inscrit]<>0 And ([SEXE]=1 And [Nat]<>"70"),1,Null)) AS GarçonEtrangerInscrit, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS FilleEtrangerInscrit, 
      [GarçonEtrangerInscrit]+[FilleEtrangerInscrit] AS TotalEtrangerInscrit, 
      
      [TotalInscritIvoirien]+[TotalEtrangerInscrit] AS TotalInscritIvoirienEtNon,
       
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1 And [Nat]="70",1,Null)) AS PresentIvoirienGarçon,
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2 And [Nat]="70",1,Null)) AS PresentIvoirienFille, 
      [PresentIvoirienGarçon]+[PresentIvoirienFille] AS TotalIvoirienPresent, 
      
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS PresentEtrangerGarçon,
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS PresentEtrangerFille, 
      [PresentEtrangerGarçon]+[PresentEtrangerFille] AS TotalEtrangerPresent, 
      
      [TotalIvoirienPresent]+[TotalEtrangerPresent] AS TotalPresentIvoirienEtNon,
      
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS AdmisIvoirienGarçon, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS AdmisIvoirienFille, 
      [AdmisIvoirienFille]+[AdmisIvoirienGarçon] AS TotalIvoirienAdmis, 
      
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS AdmisEtrangerGarçon, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS AdmisEtrangerFille, 
      [AdmisEtrangerGarçon]+[AdmisEtrangerFille] AS TotalEtrangerAdmis, 
      
      [TotalIvoirienAdmis]+[TotalEtrangerAdmis] AS TotalAdmisIvoirienEtNon,
      
      IIf([TotalIvoirienPresent]=0,0,Round([TotalIvoirienAdmis]/[TotalIvoirienPresent]*100,2)) AS TauxIvoirienAdmis, 
      IIf([TotalEtrangerPresent]=0,0,Round([TotalEtrangerAdmis]/[TotalIvoirienPresent]*100,2)) AS TauxEtrangerAdmis,
      IIf([TotalPresentIvoirienEtNon]=0,0,Round([TotalAdmisIvoirienEtNon]/[TotalPresentIvoirienEtNon]*100,2)) AS TotalTaux      
      
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série]
      HAVING (((Niveaux.RefNiveau)=4));

UNION ALL 

SELECT 
Niveaux.RefNiveau, 
[NiveauCourt] & " " & [Série] AS Serie, 

Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS InscritIvoirienGarçon, 
Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS InscritIvoirienFille, 
[InscritIvoirienGarçon]+[InscritIvoirienFille] AS TotalInscritIvoirien,

Count(IIf([Elèves].[Inscrit]<>0 And ([SEXE]=1 And [Nat]<>"70"),1,Null)) AS GarçonEtrangerInscrit, 
Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS FilleEtrangerInscrit, 
[GarçonEtrangerInscrit]+[FilleEtrangerInscrit] AS TotalEtrangerInscrit,  

 [TotalInscritIvoirien]+[TotalEtrangerInscrit] AS TotalInscritIvoirienEtNon,

Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1 And [Nat]="70",1,Null)) AS PresentIvoirienGarçon,
Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2 And [Nat]="70",1,Null)) AS PresentIvoirienFille, 
[PresentIvoirienGarçon]+[PresentIvoirienFille] AS TotalIvoirienPresent, 

Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS PresentEtrangerGarçon,
Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS PresentEtrangerFille, 
[PresentEtrangerGarçon]+[PresentEtrangerFille] AS TotalEtrangerPresent, 

[TotalIvoirienPresent]+[TotalEtrangerPresent] AS TotalPresentIvoirienEtNon,

Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS AdmisIvoirienGarçon, 
Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS AdmisIvoirienFille, 
[AdmisIvoirienFille]+[AdmisIvoirienGarçon] AS TotalIvoirienAdmis, 

Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS AdmisEtrangerGarçon, 
Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS AdmisEtrangerFille, 
[AdmisEtrangerGarçon]+[AdmisEtrangerFille] AS TotalEtrangerAdmis, 

[TotalIvoirienAdmis]+[TotalEtrangerAdmis] AS TotalAdmisIvoirienEtNon,

IIf([TotalIvoirienPresent]=0,0,Round([TotalIvoirienAdmis]/[TotalIvoirienPresent]*100,2)) AS TauxIvoirienAdmis, 
IIf([TotalEtrangerPresent]=0,0,Round([TotalEtrangerAdmis]/[TotalIvoirienPresent]*100,2)) AS TauxEtrangerAdmis,
IIf([TotalPresentIvoirienEtNon]=0,0,Round([TotalAdmisIvoirienEtNon]/[TotalPresentIvoirienEtNon]*100,2)) AS TotalTaux

FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, [NiveauCourt] & " " & [Série], TypesClasses.Niveau, TypesClasses.RefTypeClasse
HAVING (((Niveaux.RefNiveau)=7) AND ((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14));
 UNION ALL
 SELECT 
Niveaux.RefNiveau, 
"TOTAL BAC" AS Serie, 

Count(IIf([SEXE]=1 And [Nat]="70",1,Null)) AS TotalIvoirienGarçon, 
Count(IIf([SEXE]=2 And [Nat]="70",1,Null)) AS TotalIvoirienFille, 
[TotalIvoirienGarçon]+[TotalIvoirienFille] AS TotalIvoirien, 

Count(IIf([SEXE]=1 And [Nat]<>"70",1,Null)) AS TotalEtrangerGarçon, 
Count(IIf([SEXE]=2 And [Nat]<>"70",1,Null)) AS TotalEtrangerFille, 
[TotalEtrangerGarçon]+[TotalEtrangerFille] AS TotalEtranger, 

[TotalIvoirien]+[TotalEtranger] AS TotalIvoirienEtNon,

Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS InscritIvoirienGarçon, 
Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS InscritIvoirienFille, 
[InscritIvoirienGarçon]+[InscritIvoirienFille] AS TotalInscritIvoirien, 

Count(IIf([Elèves].[Inscrit]<>0 And ([SEXE]=1 And [Nat]<>"70"),1,Null)) AS GarçonEtrangerInscrit, 
Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS FilleEtrangerInscrit, 
[GarçonEtrangerInscrit]+[FilleEtrangerInscrit] AS TotalEtrangerInscrit, 

[TotalInscritIvoirien]+[TotalEtrangerInscrit] AS TotalInscritIvoirienEtNon,


Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1 And [Nat]="70",1,Null)) AS PresentIvoirienGarçon,
Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2 And [Nat]="70",1,Null)) AS PresentIvoirienFille, 
[PresentIvoirienGarçon]+[PresentIvoirienFille] AS TotalIvoirienPresent, 

Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS PresentEtrangerGarçon,
Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS PresentEtrangerFille, 
[PresentEtrangerGarçon]+[PresentEtrangerFille] AS TotalEtrangerPresent, 

[TotalIvoirienPresent]+[TotalEtrangerPresent] AS TotalPresentIvoirienEtNon,

IIf([TotalIvoirienPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0 And [Nat]="70",1,Null))/[TotalIvoirienPresent]*100,2)) AS TauxIvoirienAdmis, 
IIf([TotalEtrangerPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0 And [Nat]<>"70",1,Null))/[TotalIvoirienPresent]*100,2)) AS TauxEtrangerAdmis,
IIf([TotalPresentIvoirienEtNon]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0,1,Null))/[TotalPresentIvoirienEtNon]*100,2)) AS TotalTaux

FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14))
GROUP BY Niveaux.RefNiveau;

      `;
      const sqlResult = await fetchFromMsAccess<IChp_1_C_1[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp_1_C_1, i: number) => {
        const items = _.omit(item, ["RefNiveau", "CycleX", "CycleX1", "Serie"]);
        return {
          label: item.Serie,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_C_4_a_examen_fin_annee`);
      return reject(err);
    }
  });
};

const chp2_1_situation_des_effectifs_apres_conseil = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, 
      Niveaux.NiveauCourt, 
      [NiveauCourt] & " " & [Série] AS NiveauSerie, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, Count(IIf([SEXE]=2,1,Null)) AS EffFille, [T1]+[T2]+[T3] AS EffNiveau, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, [Gadmis]+[Fadmis] AS T1, Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, [Gredouble]+[Fredouble] AS T2, Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, [Gexclus]+[Fexclus] AS T3,(Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClassesfin, [Gredouble] AS EFG_FinAnnee, [Fredouble] AS EFF_FinAnnee, [EFG_FinAnnee]+[EFF_FinAnnee] AS EFT_FinAnnee
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (1,2,3,4)));
UNION ALL
SELECT 
 Last([Niveaux].[RefNiveau]) AS RefNiveau, 
  "#EBEBEB" AS bg, 
  "1er Cycle" AS NiveauCourt, 
   "TOTAL 1er Cycle" AS NiveauSerie, 
      First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClasses, 
Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
      [T1]+[T2]+[T3] AS EffNiveau,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis,   
      Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, 
      [Gadmis]+[Fadmis] AS T1,
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
      [Gredouble]+[Fredouble] AS T2, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
      [Gexclus]+[Fexclus] AS T3,(Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClassesfin,


      [Gredouble] AS [EFG_FinAnnee], 
      [Fredouble] AS [EFF_FinAnnee],  
      [EFG_FinAnnee]+[EFF_FinAnnee] AS [EFT_FinAnnee]
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.RefTypeClasse) In (1,2,3,4)));
UNION ALL

SELECT 
      Niveaux.RefNiveau, "#FFFF" AS bg, 
      Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, 
      IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, 
      Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
      Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
      [T1]+[T2]+[T3] AS EffNiveau,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis,
      Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, 
      [Gadmis]+[Fadmis] AS T1, 
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
      [Gredouble]+[Fredouble] AS T2, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
      [Gexclus]+[Fexclus] AS T3,(Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClassesfin, 
      [Gredouble] AS [EFG_FinAnnee], 
      [Fredouble] AS [EFF_FinAnnee],  
      [EFG_FinAnnee]+[EFF_FinAnnee] AS [EFT_FinAnnee]
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
      HAVING (((TypesClasses.RefTypeClasse) In (5,6)));
UNION ALL
  SELECT 
      Last([Niveaux].[RefNiveau]) AS RefNiveau, 
      "#EBEBEB" AS bg, 
      "1er Cycle" AS NiveauCourt, 
      "TOTAL 2nd" AS NiveauSerie, 
      First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse in (5,6)) AS NbreClasses, 
      Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
      Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
      [T1]+[T2]+[T3] AS EffNiveau,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis,   
      Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, 
      [Gadmis]+[Fadmis] AS T1,
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
      [Gredouble]+[Fredouble] AS T2, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
      [Gexclus]+[Fexclus] AS T3,(Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClassesfin,
      [Gredouble] AS [EFG_FinAnnee], 
      [Fredouble] AS [EFF_FinAnnee],  
      [EFG_FinAnnee]+[EFF_FinAnnee] AS [EFT_FinAnnee]
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.RefTypeClasse) In (5,6)));
UNION ALL ( 
      SELECT Niveaux.RefNiveau, 
      "#FFFF" AS bg, 
      Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, 
      IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, 
      Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
      Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
      [T1]+[T2]+[T3] AS EffNiveau,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
      Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, [Gadmis]+[Fadmis] AS T1, 
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
      [Gredouble]+[Fredouble] AS T2, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
      [Gexclus]+[Fexclus] AS T3,(Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClassesfin, 
      [Gredouble] AS [EFG_FinAnnee], 
      [Fredouble] AS [EFF_FinAnnee],  
      [EFG_FinAnnee]+[EFF_FinAnnee] AS [EFT_FinAnnee]
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
      HAVING (((TypesClasses.RefTypeClasse) In (7,8,9)));
      UNION ALL
      SELECT 
      Last([Niveaux].[RefNiveau]) AS RefNiveau, 
      "#EBEBEB" AS bg, 
      "2nd Cycle" AS NiveauCourt, 
      "TOTAL Premier" AS NiveauSerie, 
      First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse in (7,8,9)) AS NbreClasses, 
      Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
      Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
      [T1]+[T2]+[T3] AS EffNiveau,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis,   
      Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, 
      [Gadmis]+[Fadmis] AS T1,
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
      [Gredouble]+[Fredouble] AS T2, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
      [Gexclus]+[Fexclus] AS T3,(Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClassesfin,
      [Gredouble] AS [EFG_FinAnnee], 
      [Fredouble] AS [EFF_FinAnnee],  
      [EFG_FinAnnee]+[EFF_FinAnnee] AS [EFT_FinAnnee]
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.RefTypeClasse) In (7,8,9)));
      )
 UNION ALL (
      SELECT Niveaux.RefNiveau, 
      "#FFFF" AS bg, 
      Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, 
      IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, 
      Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
      Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
      [T1]+[T2]+[T3] AS EffNiveau,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
      Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis,
      [Gadmis]+[Fadmis] AS T1, 
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
      [Gredouble]+[Fredouble] AS T2, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
      [Gexclus]+[Fexclus] AS T3,(Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClassesfin, [Gredouble] AS [EFG_FinAnnee], [Fredouble] AS [EFF_FinAnnee],  
      [EFG_FinAnnee]+[EFF_FinAnnee] AS [EFT_FinAnnee]
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
      HAVING (((TypesClasses.RefTypeClasse) In (10,11,12,13,14)));
      UNION ALL
      SELECT 
      Last([Niveaux].[RefNiveau]) AS RefNiveau, 
      "#EBEBEB" AS bg, 
      "1er Cycle" AS NiveauCourt, 
      "TOTAL Terminal" AS NiveauSerie, 
      First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse in (10,11,12,13)) AS NbreClasses,
      Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
      Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
      [T1]+[T2]+[T3] AS EffNiveau,
      Count(Elèves.RefElève) AS EffectTotal,  
      Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis,   
      Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, 
      [Gadmis]+[Fadmis] AS T1,
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
      [Gredouble]+[Fredouble] AS T2, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
      [Gexclus]+[Fexclus] AS T3,(Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClassesfin,
      [Gredouble] AS [EFG_FinAnnee], 
      [Fredouble] AS [EFF_FinAnnee],  
      [EFG_FinAnnee]+[EFF_FinAnnee] AS [EFT_FinAnnee]
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.RefTypeClasse) In (10,11,12,13,14)));
      )
  UNION ALL
      SELECT 
      Last(Niveaux.RefNiveau) AS RefNiveau,"#E3E3E3" AS bg, 
      "Etabliss" AS NiveauCourt, 
      "TOTAL Etabliss" AS NiveauSerie, 
      "Etabliss" AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse<14) AS NbreClasses, 
      Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
      Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
      [T1]+[T2]+[T3] AS EffNiveau,
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis,   
      Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, 
      [Gadmis]+[Fadmis] AS T1,
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
      Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
      [Gredouble]+[Fredouble] AS T2, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
      Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
      [Gexclus]+[Fexclus] AS T3,(Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClassesfin,
      [Gredouble] AS [EFG_FinAnnee], 
      [Fredouble] AS [EFF_FinAnnee],  
      [EFG_FinAnnee]+[EFF_FinAnnee] AS [EFT_FinAnnee]
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      HAVING (((TypesClasses.RefTypeClasse)<14));

`;
      const sqlResult = await fetchFromMsAccess<IChp2_A_1[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_A_1) => {
        const items = _.omit(item, ["RefNiveau", "bg", "NiveauCourt", "NiveauSerie", "CycleX", "EffNiveau"]);
        return {
          bg: item.bg,
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_1_situation_des_effectifs_apres_conseil`);
      return reject(err);
    }
  });
};

const chp2_2_effectif_et_pyramides = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
          SELECT 1 AS orderby, 
          "Nombre de Classes" AS label, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=1) AS _6e, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=2) AS _5e, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=3) AS _4e, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=4) AS _3e, 
          Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=5) AS _2ndA, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=6) AS _2ndC, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=7) AS _1ereA, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=8) AS _1ereC, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=9) AS _1ereD, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse In(10,13)) AS _TleA, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=11) AS _TleC, 
          (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=12) AS _TleD, 
          Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
          [ST1]+[ST2] AS TOTAL
          FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
          GROUP BY Elèves.Inscrit, '', TypesClasses.filière
          HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));

          UNION ALL 
          SELECT 2 AS orderby, 
          "Effectifs Par classe" AS label, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
          Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
          FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
          HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
          FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
          GROUP BY Elèves.Inscrit, TypesClasses.filière
          HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));

          UNION ALL 
          SELECT 3 AS orderby, "G" AS label, 
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
          HAVING (((Elèves.Sexe)=1));
          UNION ALL 
          SELECT 4 AS orderby, "F" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
          FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
          WHERE (((TypesClasses.filière)=1))
          HAVING (((Elèves.Sexe)=2));

          UNION ALL 
          SELECT 5 AS orderby, "T" AS label, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
          Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
          FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
          HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
          FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
          GROUP BY Elèves.Inscrit, TypesClasses.filière
          HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));  
         `;
      const sqlResult = await fetchFromMsAccess<IChp2_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_1) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          ...items,
        };
      });
      const row = contentsArray;
      const row1 = Object.values(row[0]);
      const deuxPremiereLigne = contentsArray.slice(0, 2)
      const row02 = functions_main.calculDivisionEntiere2(deuxPremiereLigne);//prendre la deuxieme ligne et la supprimée avec la premiere
      const row2 = Object.values(row02);
      const row3 = Object.values(row[2]);
      const row4 = Object.values(row[3]);
      const row5 = Object.values(row[4]);
      const rows = { row1, row2, row3, row4, row5 };
      const result = [rows];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_2_effectif_et_pyramides`);
      return reject(err);
    }
  });
};


const chp2_A_2_taux_de_promotion_interne = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
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
      GROUP BY Elèves.Sexe;
      UNION ALL 
      SELECT 
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
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      UNION ALL (
      SELECT 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1) And [MOYG4] Is Null,1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2) And [MOYG4] Is Null,1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3) And [MOYG4] Is Null,1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4) And [MOYG4] Is Null,1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (5) And [MOYG4] Is Null,1,Null)) AS _2ndA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (6) And [MOYG4] Is Null,1,Null)) AS _2ndC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (7) And [MOYG4] Is Null,1,Null)) AS _1ereA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (8) And [MOYG4] Is Null,1,Null)) AS _1ereC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (9) And [MOYG4] Is Null,1,Null)) AS _1ereD, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (10,13) And [MOYG4] Is Null,1,Null)) AS _TleA,
       Count(IIf([TypesClasses].[RefTypeClasse] In (11) And [MOYG4] Is Null,1,Null)) AS _TleC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (12) And [MOYG4] Is Null,1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe;
      UNION ALL 
      SELECT 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1) And [MOYG4] Is Null,1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2) And [MOYG4] Is Null,1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3) And [MOYG4] Is Null,1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4) And [MOYG4] Is Null,1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (5) And [MOYG4] Is Null,1,Null)) AS _2ndA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (6) And [MOYG4] Is Null,1,Null)) AS _2ndC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (7) And [MOYG4] Is Null,1,Null)) AS _1ereA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (8) And [MOYG4] Is Null,1,Null)) AS _1ereC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (9) And [MOYG4] Is Null,1,Null)) AS _1ereD, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (10,13) And [MOYG4] Is Null,1,Null)) AS _TleA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (11) And [MOYG4] Is Null,1,Null)) AS _TleC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (12) And [MOYG4] Is Null,1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2,
       [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      )
      UNION ALL (
      SELECT 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (5) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _2ndA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (6) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _2ndC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (7) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _1ereA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (8) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _1ereC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (9) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _1ereD, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (10,13) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _TleA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (11) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _TleC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (12) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe;
      UNION ALL 
      SELECT 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _2ndA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (6) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _2ndC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (7) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _1ereA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (8) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _1ereC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (9) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _1ereD, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (10,13) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _TleA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (11) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _TleC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (12) And ([MOYG4] Between 0 And 8.49),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      )
      UNION ALL (
      SELECT 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (5) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _2ndA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (6) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _2ndC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (7) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _1ereA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (8) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _1ereC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (9) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _1ereD, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (10,13) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _TleA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (11) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _TleC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (12) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe;
      UNION ALL
      SELECT 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (5) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _2ndA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (6) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _2ndC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (7) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _1ereA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (8) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _1ereC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (9) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _1ereD, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (10,13) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _TleA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (11) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _TleC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (12) And ([MOYG4] Between 8.5 And 9.99),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes));
      )
      UNION ALL (
      SELECT 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1) And ([MOYG4]>=10),1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2) And ([MOYG4]>=10),1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3) And ([MOYG4]>=10),1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4) And ([MOYG4]>=10),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (5) And ([MOYG4]>=10),1,Null)) AS _2ndA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (6) And ([MOYG4]>=10),1,Null)) AS _2ndC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (7) And ([MOYG4]>=10),1,Null)) AS _1ereA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (8) And ([MOYG4]>=10),1,Null)) AS _1ereC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (9) And ([MOYG4]>=10),1,Null)) AS _1ereD, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (10,13) And ([MOYG4]>=10),1,Null)) AS _TleA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (11) And ([MOYG4]>=10),1,Null)) AS _TleC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (12) And ([MOYG4]>=10),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe;
      UNION ALL 
      SELECT 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1) And ([MOYG4]>=10),1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2) And ([MOYG4]>=10),1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3) And ([MOYG4]>=10),1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4) And ([MOYG4]>=10),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (5) And ([MOYG4]>=10),1,Null)) AS _2ndA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (6) And ([MOYG4]>=10),1,Null)) AS _2ndC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (7) And ([MOYG4]>=10),1,Null)) AS _1ereA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (8) And ([MOYG4]>=10),1,Null)) AS _1ereC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (9) And ([MOYG4]>=10),1,Null)) AS _1ereD, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (10,13) And ([MOYG4]>=10),1,Null)) AS _TleA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (11) And ([MOYG4]>=10),1,Null)) AS _TleC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (12) And ([MOYG4]>=10),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      )
      `
      const sqlResult = await fetchFromMsAccess<IChp2_A_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_A_2) => {
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
      const row7 = Object.values(row[6]);
      const row8 = Object.values(row[7]);
      const row9 = Object.values(row[8]);
      const row10 = Object.values(row[9]);
      const row11 = Object.values(row[10]);
      const row12 = Object.values(row[11]);
      const row13 = Object.values(row[12]);
      const row14 = Object.values(row[13]);
      const row15 = Object.values(row[14]);
      const rows = { row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13, row14, row15 };
      const result = [rows];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_A_2_taux_de_promotion_interne`);
      return reject(err);
    }
  });
};

const chp2_4_a_taux_de_promotion_interne_premier_cycle = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
Niveaux.RefNiveau, "#FFFF" AS bg, 
Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, 
IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, 
[Gadmis]+[Fadmis] AS T1,
IIf([EffectTotal]=0,0,Round([T1]/[EffectTotal]*100,2)) AS TauxAdmis, 
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
[Gredouble]+[Fredouble] AS T2, 
IIf([EffectTotal]=0,0,Round([T2]/[EffectTotal]*100,2)) AS TauxRedouble, 
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus,
[Gexclus]+[Fexclus] AS T3,
IIf([EffectTotal]=0,0,Round([T3]/[EffectTotal]*100,2)) AS TauxExclus
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (1,2,3,4)));
UNION ALL
SELECT 
 Last([Niveaux].[RefNiveau]) AS RefNiveau, 
  "#EBEBEB" AS bg, 
  "1er Cycle" AS NiveauCourt, 
   "TOTAL 1er Cycle" AS NiveauSerie, 
      First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, 
     Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, 
[Gadmis]+[Fadmis] AS T1,
IIf([EffectTotal]=0,0,Round([T1]/[EffectTotal]*100,2)) AS TauxAdmis, 
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
[Gredouble]+[Fredouble] AS T2, 
IIf([EffectTotal]=0,0,Round([T2]/[EffectTotal]*100,2)) AS TauxRedouble, 
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus,
[Gexclus]+[Fexclus] AS T3,
IIf([EffectTotal]=0,0,Round([T3]/[EffectTotal]*100,2)) AS TauxExclus

      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.RefTypeClasse) In (1,2,3,4)));
      `
      const sqlResult = await fetchFromMsAccess<IChp2_A_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_A_2) => {
        const items = _.omit(item, ["orderby", "label", "bg", "CycleX", "EffGarçon", "EffFille", "NiveauSerie", "NiveauCourt", "NbreClasses", "RefNiveau"]);
        return {
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      // console.log("contentsArray.chp2_5....", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_4_a_taux_de_promotion_interne_premier_cycle`);
      return reject(err);
    }
  });
};

const chp2_4_b_taux_de_promotion_interne_second_cycle = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
Niveaux.RefNiveau, "#FFFF" AS bg, 
Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, 
IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, 
[Gadmis]+[Fadmis] AS T1,
IIf([EffectTotal]=0,0,Round([T1]/[EffectTotal]*100,2)) AS TauxAdmis, 
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
[Gredouble]+[Fredouble] AS T2, 
IIf([EffectTotal]=0,0,Round([T2]/[EffectTotal]*100,2)) AS TauxRedouble, 
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus,
[Gexclus]+[Fexclus] AS T3,
IIf([EffectTotal]=0,0,Round([T3]/[EffectTotal]*100,2)) AS TauxExclus
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (5,6,7,8,9,10,11,12,13,14)));
UNION ALL
SELECT 
 Last([Niveaux].[RefNiveau]) AS RefNiveau, 
  "#EBEBEB" AS bg, 
  "2nd Cycle" AS NiveauCourt, 
   "TOTAL 1er Cycle" AS NiveauSerie, 
      First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, 
     Count(IIf([SEXE]=1,1,Null)) AS EffGarçon, 
Count(IIf([SEXE]=2,1,Null)) AS EffFille, 
Count(Elèves.RefElève) AS EffectTotal, 
Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, 
[Gadmis]+[Fadmis] AS T1,
IIf([EffectTotal]=0,0,Round([T1]/[EffectTotal]*100,2)) AS TauxAdmis, 
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
[Gredouble]+[Fredouble] AS T2, 
IIf([EffectTotal]=0,0,Round([T2]/[EffectTotal]*100,2)) AS TauxRedouble, 
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus,
[Gexclus]+[Fexclus] AS T3,
IIf([EffectTotal]=0,0,Round([T3]/[EffectTotal]*100,2)) AS TauxExclus

      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.RefTypeClasse) In (5,6,7,8,9,10,11,12,13,14)));
      `
      const sqlResult = await fetchFromMsAccess<IChp2_A_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_A_2) => {
        const items = _.omit(item, ["orderby", "label", "bg", "CycleX", "EffGarçon", "EffFille", "NiveauSerie", "NiveauCourt", "RefNiveau"]);
        return {
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      // console.log("contentsArray.chp2_5....", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_4_b_taux_de_promotion_interne_second_cycle`);
      return reject(err);
    }
  });
};



// chp3

//*********** debut chapitre 3 ******************
/**
 * ce tableau n'est pas encore implementé dans spider
 * Ce titre n’existe pas encore dans l’ancien rapport
 */
const chp3_A_fonctionnement_conseil_du_conseil_interieur = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
        '-' AS Periode, 
        '-' AS Activite_menee, 
        '-' AS Observations
        FROM tbl_conseil_interieur
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_A, index: number) => {
        return {
          c1: nv(item.Periode),
          c2: nv(item.Activite_menee),
          c3: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_fonctionnement_conseil`);
      return reject(err);
    }
  });
};
/**
 * Ce titre n’existe pas encore dans l’ancien rapport
 * la table tbl_conseil_discipline est vide
 */
const chp3_B_fonctionnement_conseil_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
        '-' AS Dates,
        '-' AS NomComplet,
        '-' AS MatriculeNational,
        '-' AS ClasseCourt,
        '-' AS Genre, 
        '-' AS Objet,
        '-' AS Decision
        FROM tbl_conseil_discipline
        `;
      const sqlResult = await fetchFromMsAccess<IChp3B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3B, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Dates),
          c2: nv(item.NomComplet),
          c3: nv(item.MatriculeNational),
          c4: nv(item.ClasseCourt),
          c5: nv(item.Genre),
          c6: nv(item.Objet),
          c7: nv(item.Decision),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => const chp3_B_fonctionnement_conseil_discipline = () => {
        `);
      return reject(err);
    }
  });
};

// Ce titre n’existe pas encore dans l’ancien rapport, c’est un tableau
const chp3_C_activite_para_scolaire = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
        '-' AS Club, 
        '-' AS Dates,
        '-' AS ActiviteMenee
        FROM tbl_conseil_discipline
        `;
      const sqlResult = await fetchFromMsAccess<IChp3C[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3C, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Club),
          c2: nv(item.Dates),
          c3: nv(item.ActiviteMenee),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_C_activite_para_scolaire`);
      return reject(err);
    }
  });
};


const chp3_D_4_cas_maladies = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & " " & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt, 
        IIf([Sexe]=1,"M","F") AS Genre,
        tbl_cs_maladie.DateDepotCertificat, 
        tbl_cs_maladie.NatureMaladie, 
        tbl_cs_maladie.DureeMaladie
        FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_maladie ON Elèves.RefElève = tbl_cs_maladie.RefElève) ON Classes.RefClasse = Elèves.RefClasse
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_D_4[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_D_4, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Genre),
          c5: nv(item.DateDepotCertificat),
          c6: nv(item.NatureMaladie),
          c7: nv(item.DureeMaladie),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_D_4_cas_maladies`);
      return reject(err);
    }
  });
};

/**
 * Ce tableau n’est pas encore implémenté dans SPIDER
 * 
 */
const chp3_D_3_cas_grossesse = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & " " & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt, 
        Int((Date()-[DateNaiss])/365.5) AS Age, 
        tbl_cs_grossesse.QualiteAuteur,
        '-' AS TermeTheorique,
        '-' AS Auteur,
        '-' AS FonctionAuteur
        FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_grossesse 
        ON Elèves.RefElève = tbl_cs_grossesse.RefElève) 
        ON Classes.RefClasse = Elèves.RefClasse
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_D_3[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_D_3, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Age),
          c5: nv(item.QualiteAuteur),
          c6: nv(item.TermeTheorique),
          c7: nv(item.Auteur),
          c8: nv(item.FonctionAuteur),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_D_3_cas_grossesse`);
      return reject(err);
    }
  });
};

/**
 * Ce tableau n’est pas encore implémenté dans SPIDER il y d'autre champs à creer
 * nom de la table tbl_cs_abandon
 */
const chp3_D_1_cas_abandon = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & " " & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt, 
        IIf([Sexe]=1,"M","F") AS Genre,
        tbl_cs_abandon.RaisonAbandon AS Observations
        FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_abandon 
        ON Elèves.RefElève = tbl_cs_abandon.RefElève) 
        ON Classes.RefClasse = Elèves.RefClasse
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_D_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_D_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Genre),
          c5: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_D_1_cas_abandon`);
      return reject(err);
    }
  });
};

/**
 * 
 * Ce titre n’existe pas encore dans l’ancien rapport, c’est un tableau
 */
const chp3_D_2_encadrement_phsychosocial = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & " " & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt, 
        IIf([Sexe]=1,"M","F") AS Genre,
        '-' AS ProblemePsycho,
        '-' AS Observation
        FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_abandon 
        ON Elèves.RefElève = tbl_cs_abandon.RefElève) 
        ON Classes.RefClasse = Elèves.RefClasse
        `;
      const sqlResult = await fetchFromMsAccess<IChp3D_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3D_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Genre),
          c5: nv(item.ProblemePsycho),
          c6: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_D_1_cas_abandon`);
      return reject(err);
    }
  });
};

const chp3_D_5_cas_deces = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & "" & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt, 
        IIf([Sexe]=1,"M","F") AS Genre,
        tbl_cs_deces.DateDécès AS DateDeces, 
        tbl_cs_deces.CauseDécès AS CauseDeces
        FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_deces 
        ON Elèves.RefElève = tbl_cs_deces.RefElève)
        ON Classes.RefClasse = Elèves.RefClasse
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_D_5[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_D_5, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Genre),
          c5: nv(item.DateDeces),
          c6: nv(item.CauseDeces),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_D_5_cas_deces`);
      return reject(err);
    }
  });
};


//*** debut chapitre 4 ***
const chp4_A_1_liste_du_personnel_administratif_et_d_encadrement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //Matricule	Genre	Emploi	Fonction actuelle	Contact
      let sql = `SELECT 
      [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet,
       Personnel.Matricule, 
       Fonction.Fonction, 
       Matières.MatCourt AS Discipline, 
       Groupe.RefGroupePers, 
       Personnel.Sexe AS Genre, 
       Corps.NomCorps, 
       Personnel.CelPers AS Contact, 
       Personnel.TélPers, 
       '' AS Ass,
       Personnel.SitMatr
      FROM (Groupe INNER JOIN (Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) ON Groupe.RefGroupePers = Fonction.Groupe) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
      WHERE (((Groupe.RefGroupePers)=3))
      ORDER BY Personnel.NomPers
      UNION ALL(
           SELECT 
      [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet,
      Personnel.Matricule, 
      Fonction.Fonction, 
      Matières.MatCourt AS Discipline, 
      Groupe.RefGroupePers, 
      Personnel.Sexe AS Genre, 
      Corps.NomCorps, 
      Personnel.CelPers AS Contact, 
      Personnel.TélPers, 
      '' AS Ass,
      Personnel.SitMatr
      FROM (Groupe INNER JOIN (Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) ON Groupe.RefGroupePers = Fonction.Groupe) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
      WHERE (((Groupe.RefGroupePers)=1))
      ORDER BY Personnel.NomPers;
       )
      `;
      const sqlResult = await fetchFromMsAccess<IChp4A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4A_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.Matricule),
          c3: nv(item.Genre),
          c4: nv(item.NomCorps),
          c5: nv(item.Fonction),
          c6: nv(item.Contact),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp4_A_1_liste_du_personnel_administratif_et_d_encadrement`
      );
      return reject(err);
    }
  });
};

/**
 * Pas encore renseignée dans SPIDER 
 * nom de la table tbl_besoin_autre
 */
const chp4_A_2_etat_besoins_en_pers_admin_encad = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        '-' AS Fonction,
        '-' AS Existant_femmes,
        '-' AS Existant_garcons,
        tbl_besoin_autre_pers.qte_besoin,
        '-' AS Observations
        FROM tbl_besoin_autre_pers`;
      const sqlResult = await fetchFromMsAccess<IChp4A_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4A_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Fonction),
          c2: nv(item.Existant_femmes),
          c3: nv(item.Existant_garcons),
          c4: nv(item.qte_besoin),
          c5: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_A_2_etat_besoins_en_pers_admin_encad`);
      return reject(err);
    }
  });
};

const chp4_B_1_liste_personnel_enseignant_par_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      [Personnel.NomPers] & "" & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Matricule, 
      Fonction.Fonction, 
      Matières.MatLong AS Discipline, 
      Groupe.RefGroupePers, 
      Personnel.Sexe AS Genre, 
      Corps.NomCorps, 
      Personnel.CelPers AS Contact, 
      Personnel.TélPers, 
      '' AS Ass,
      Personnel.SitMatr
      FROM (Groupe INNER JOIN (Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) ON Groupe.RefGroupePers = Fonction.Groupe) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
      WHERE (((Groupe.RefGroupePers)=2))
      GROUP BY [Personnel.NomPers] & "" & [Personnel.PrénomPers], Personnel.Matricule, Fonction.Fonction, Matières.MatLong, Groupe.RefGroupePers, Personnel.Sexe, Corps.NomCorps, Personnel.CelPers, Personnel.TélPers, Personnel.NomPers, Personnel.SitMatr
      ORDER BY Personnel.NomPers;
        `;
      const sqlResult = await fetchFromMsAccess<IChp4B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([
        {
          label: '',
          obj: { discipline: '' },
          group: [{}],
          count: 0
        },
      ]);
      const contentsArray = sqlResult.map((item: IChp4B_1, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.Matricule),
          c3: nv(item.Genre),
          c4: nv(item.NomCorps),
          c5: nv(item.Discipline),
          c6: nv(item.Contact),
          label: item.Discipline,
          obj: {
            discipline: nv(item.Discipline),
          },
        };
      });
      const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err =>chp4_B_1_liste_personnel_enseignant_par_discipline`);
      return reject(err);
    }
  });
};

/**
 * Pas encore renseignée dans SPIDER 
 * cette requette a revoir
 * table tbl_besoin_prof
 */
const chp4_B_2_etat_besoin_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {

      let sql = `SELECT classe_matieres_prof_eval.matCourt AS label, Count(IIf([Niveaux].[cycle]="1er Cycle" And [Personnel].[Sexe]="F",1,Null)) AS pcf, Count(IIf([Niveaux].[cycle]="1er Cycle" And [Personnel].[Sexe]="M",1,Null)) AS pch, Val([pcf]+[pch]) AS pct, "" AS bs1, Count(IIf([Niveaux].[cycle]="2nd Cycle" And [Personnel].[Sexe]="F",1,Null)) AS scf, Count(IIf([Niveaux].[cycle]="2nd Cycle" And [Personnel].[Sexe]="M",1,Null)) AS sch, Val([scf]+[sch]) AS sct, "" AS bs2, Val([pcf]+[scf]) AS tf, Val([pch]+[sch]) AS th, Val([tf]+[th]) AS te, "" AS bs3, "" AS obs
      FROM Personnel INNER JOIN ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN classe_matieres_prof_eval ON TypesClasses.RefTypeClasse = classe_matieres_prof_eval.refTypeClasse) ON Personnel.RefPersonnel = classe_matieres_prof_eval.refPers
      GROUP BY classe_matieres_prof_eval.matCourt, "", TypesClasses.filière, Personnel.Fonction, Personnel.fil_gen
      HAVING (((TypesClasses.filière)=1) AND ((Personnel.Fonction)=6) AND ((Personnel.fil_gen)=True))
      ORDER BY classe_matieres_prof_eval.matCourt;
      
      UNION ALL(
      SELECT "TOTAL ETABLISSEMENT " AS label, Count(IIf([Niveaux].[cycle]="1er Cycle" And [Personnel].[Sexe]="F",1,Null)) AS pcf, Count(IIf([Niveaux].[cycle]="1er Cycle" And [Personnel].[Sexe]="M",1,Null)) AS pch, Val([pcf]+[pch]) AS pct, "" AS bs1, Count(IIf([Niveaux].[cycle]="2nd Cycle" And [Personnel].[Sexe]="F",1,Null)) AS scf, Count(IIf([Niveaux].[cycle]="2nd Cycle" And [Personnel].[Sexe]="M",1,Null)) AS sch, Val([scf]+[sch]) AS sct, "" AS bs2, Val([pcf]+[scf]) AS tf, Val([pch]+[sch]) AS th, Val([tf]+[th]) AS te, "" AS bs3, "" AS obs
      FROM Personnel INNER JOIN ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN classe_matieres_prof_eval ON TypesClasses.RefTypeClasse = classe_matieres_prof_eval.refTypeClasse) ON Personnel.RefPersonnel = classe_matieres_prof_eval.refPers
      GROUP BY "", TypesClasses.filière, Personnel.Fonction, Personnel.fil_gen
      HAVING (((TypesClasses.filière)=1) AND ((Personnel.Fonction)=6) AND ((Personnel.fil_gen)=True))
      ORDER BY "TOTAL ETABLISSEMENT ";
      )                    
       `;
      const sqlResult = await fetchFromMsAccess<IChp4_B_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp4_B_2) => {
        const items = _.omit(item, ["label", "obs"]);
        return {
          label: item.label,
          // cols: functions_main.rav(items),
          cols: Object.values(functions_main.rav(items)),
          // cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_2_1_enseignant_par_discipline`);
      return reject(err);
    }
  });

};


/**
 * la requette est bonne mais les personnels de services n'ont pas été renseignées dans SPIDER
 */
const chp4_C_1_liste_du_personnel_service = () => {

  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      [Personnel.NomPers] & "" & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Matricule, 
      Fonction.Fonction, 
      Matières.MatCourt AS Discipline, 
      Groupe.RefGroupePers, 
      Personnel.Sexe AS Genre, 
      Corps.NomCorps, 
      Personnel.CelPers AS Contact, 
      Personnel.TélPers, 
      Personnel.PrénomPers, 
      Personnel.SitMatr,
      Fonction.Fonction
      FROM (Groupe INNER JOIN (Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) ON Groupe.RefGroupePers = Fonction.Groupe) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
      WHERE (((Groupe.RefGroupePers)=4))
      ORDER BY Personnel.NomPers;
      `;
      const sqlResult = await fetchFromMsAccess<IChp4C_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4C_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.Matricule),
          c3: nv(item.Genre),
          c4: nv(item.Fonction),
          c5: nv(item.Contact),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_C_1_liste_du_personnel_service`);
      return reject(err);
    }
  });
};


/**
 * Pas encore renseignée dans SPIDER 
 * 
 */
const chp4_C_2_etat_besoins_personnel_service = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Fonction.Fonction, 
      IIf([Personnel.Sexe]=1,"M","F") AS Genre,
      tbl_besoin_autre_pers.qte_besoin, 
      Personnel.Obs AS Observations, 
      Groupe.RefGroupePers
      FROM Groupe INNER JOIN ((Fonction INNER JOIN tbl_besoin_autre_pers ON Fonction.RefFonction = tbl_besoin_autre_pers.id_fonction) INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Groupe.RefGroupePers = Fonction.Groupe
      WHERE (((Groupe.RefGroupePers)=4));
      `;
      const sqlResult = await fetchFromMsAccess<IChp4C_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4C_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Fonction),
          c2: (item.Genre === "F" ? "x" : ""),
          c3: (item.Genre === "M" ? "x" : ""),
          c4: nv(item.qte_besoin),
          c5: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_C_2_etat_besoins_personnel_service`);
      return reject(err);
    }
  });
};


const rapport = (data: any): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        anscol1,
        nometab,
        codeetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        drencomplet,
        date_signature,
      } = await paramEtabObjet([
        "anscol1",
        "nometab",
        "codeetab",
        "teletab",
        "emailetab",
        "titrechefetab",
        "nomchefetab",
        "drencomplet",
        "date_signature",
      ]);

      const path = await functions_main.fileExists(`C:/SPIDER/Ressources/${codeetab}_logo.jpg`);
      //les autres parametres du fichier python 
      const dataParams = { ...data, logo1: path, path };

      const chp1_A_2_a = await chp1_A_2_a_Activites_des_unites_pedagogiques()
      const chp1_A_2_b = await chp1_A_2_b_Activite_des_conseils_enseignement()
      const chp1_A_3_a = await chp1_A_3_a_Chef_d_etablissement()
      const chp1_A_3_b = await chp1_A_3_b_Conseillers_Pedagogiques()
      const chp1_A_3_c = await chp1_A_3_c_Inspecteurs()
      const chp1_A_4 = await chp1_A_4_Formations()
      const chp1_B_1_a = await chp1_B_1_a_tableaux_statistiques_des_resultats_scolaire_par_niveau("MOYG3")
      const chp1_B_1_b = await chp1_B_1_b_liste_nominative_des_eleves_et_resultats_scolaires()
      const chp1_B_1_c = await chp1_B_1_c_liste_major_classe_niveau()
      const chp1_B_2_a = await chp1_B_1_a_tableaux_statistiques_des_resultats_scolaire_par_niveau("MOYG4")
      const chp1_B_2_b = await chp1_B_2_b_liste_nominative_des_eleves_et_resultats_scolaires()
      const chp1_B_2_c = await chp1_B_2_c_liste_major_classe_niveau()
      const chp1_C_3_a = await chp1_C_3_a_examen_blanc()
      const chp1_C_4_a = await chp1_C_4_a_examen_fin_annee()
      const chp3_A = await chp3_A_fonctionnement_conseil_du_conseil_interieur()
      const chp3_B = await chp3_B_fonctionnement_conseil_discipline()
      const chp3_C = await chp3_C_activite_para_scolaire()
      const chp3_D_1 = await chp3_D_1_cas_abandon()
      const chp3_D_2 = await chp3_D_2_encadrement_phsychosocial()
      const chp3_D_3 = await chp3_D_3_cas_grossesse()
      const chp3_D_4 = await chp3_D_4_cas_maladies()
      const chp3_D_5 = await chp3_D_5_cas_deces()
      const chp4_A_1 = await chp4_A_1_liste_du_personnel_administratif_et_d_encadrement()
      const chp4_A_2 = await chp4_A_2_etat_besoins_en_pers_admin_encad()
      const chp4_B_1 = await chp4_B_1_liste_personnel_enseignant_par_discipline()
      const chp4_B_2 = await chp4_B_2_etat_besoin_personnel_enseignant()
      const chp4_C_1 = await chp4_C_1_liste_du_personnel_service()
      const chp4_C_2 = await chp4_C_2_etat_besoins_personnel_service()
      const chp2_1 = await chp2_1_situation_des_effectifs_apres_conseil()
      const chp2_2 = await chp2_2_effectif_et_pyramides()
      const chp2_A_2 = await chp2_A_2_taux_de_promotion_interne()
      const chp2_4_a = await chp2_4_a_taux_de_promotion_interne_premier_cycle()
      const chp2_4_b = await chp2_4_b_taux_de_promotion_interne_second_cycle()

      const result = {
        ...dataParams,
        name_report: "public_secondairegeneral_3trimestre",
        path_report: "public/secondaire-general",
        anscol1,
        nometab,
        codeetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        drencomplet,
        date_signature,
        chp1_A_2_a,
        chp1_A_2_b,
        chp1_A_3_c,
        chp1_A_3_a,
        chp1_A_3_b,
        chp1_A_4,
        chp1_B_1_a,
        chp1_B_1_b,
        chp1_B_1_c,
        chp1_B_2_a,
        chp1_B_2_b,
        chp1_B_2_c,
        chp1_C_3_a,
        chp1_C_4_a,
        chp3_A,
        chp3_B,
        chp3_C,
        chp3_D_4,
        chp3_D_3,
        chp3_D_1,
        chp3_D_2,
        chp3_D_5,
        chp4_A_1,
        chp4_A_2,
        chp4_B_1,
        chp4_B_2,
        chp4_C_1,
        chp4_C_2,
        chp2_A_2,
        chp2_1,
        chp2_2,
        chp2_4_a,
        chp2_4_b
      };
      resolve(result);
    } catch (err: any) {
      return reject(err);
    }
  });
};

export default {
  rapport
};
