import { _selectSql } from './../../../../../../../databases/index';
import { appCnx, fetchFromMsAccess, paramEtabObjet } from './../../../../../../../databases/accessDB';
import {
  IChp1_A_1,
  IChp1_A_2_a,
  IChp1_A_2_b,
  IChp1_B_1,
  IChp1_B_2,
  IChp2_A,
  IChp2_B,
  IChp2_D,
  IChp2_E,
  IChp3_A,
  IChp3_A_1,
  IChp3_A_2,
  IChp3_B,
  IChp4_1,
  IChp4_2,
  IChp4_3,
  IChp_1_B_2,
}
from "./interfaces";

import functions_main, { nv, paramsEtablisement } from "../../../../utils";
const _ = require("lodash");

//*********************** debut chapitre 1 ***************

// ce tableau n'est pas encore cree dans SPIDER
const chp1_A_1_Activites_des_unites_pedagogiques_et_des_Conseils_d_Enseignement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         ' ' AS TypeActivite, 
         ' ' AS Nombre
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_1) => {
        return {
          c1: nv(item.TypeActivite),
          c2: nv(item.Nombre),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp1_A_1_Activites_des_unites_pedagogiques_et_des_Conseils_d_Enseignement`
      );
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_2_a_visite_de_classe = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT  [Nompers] & " " & [PrénomPers] AS nom_complet, 
      Matières.MatCourt AS matiere, 
      Count(IIf([tbl_visit].[id_pers],1,Null)) AS nombre_visit, 
      Format(tbl_visit.date_visit,"Short Date") AS date_visit, 
      tbl_visit.observ_visit
      FROM (Personnel INNER JOIN tbl_visit ON Personnel.RefPersonnel = tbl_visit.id_pers) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
      GROUP BY [Nompers] & " " & [PrénomPers], Matières.MatCourt, tbl_visit.date_visit, tbl_visit.observ_visit, Personnel.Fonction
      HAVING (((Personnel.Fonction)=6));  
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_2_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_2_a, index: number) => {
        return {
          c1: nv(item.nom_complet),
          c2: nv(item.matiere),
          c3: nv(item.nombre_visit),
          c4: nv(item.date_visit),
          c5: nv(item.observ_visit)
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_2_a_visite_de_classe`);
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_2_b_formations = () => {
  return new Promise(async (resolve, reject) => {
    // table non renseignee
    try {
      let sql = `SELECT TOP 1
         ' ' AS discipline, 
         ' ' AS enseignant_formes,
         ' ' AS nombre_formation,
         ' ' AS dates,
         ' ' AS obs
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_2_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_2_b, index: number) => {
        return {
          c1: nv(item.discipline),
          c2: nv(item.enseignant_formes),
          c3: nv(item.nombre_formation),
          c4: nv(item.dates),
          c5: nv(item.obs)
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_2_b_formations`);
      return reject(err);
    }
  });
};

const chp1_B_1_1_1_liste_de_classe_et_resultats_des_eleves_affectes = (StatutEleve: string) => {
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

      let sql2 = `SELECT 
      Classes.OrdreClasse,
      Niveaux.RefNiveau AS OrderBy, 
      Classes.RefClasse, 
      Classes.ClasseLong, 
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),
      IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang2, 
      T_Notes.MOYG2 AS MoyG2, 
      Notes.RangG2, 
      '-' AS MS, 
      (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, 
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      Elèves.Décision AS NumDeciAffect, 
      IIf(IsNull(Elèves.Obs),"",Elèves.Obs) AS Obs, 
      (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ, 
      TypesClasses.RefTypeClasse
      FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.inscrit)=True) AND ((Elèves.StatutElève)${StatutEleve}))
      ORDER BY Classes.OrdreClasse, Niveaux.RefNiveau, Classes.RefClasse, [NomElève] & " " & [PrénomElève]
      `;
      const sqlResult2 = await fetchFromMsAccess<IChp1_B_2[]>(sql2, appCnx);
      if (sqlResult2.length === 0) return resolve([
        {
          label: '',
          obj: {classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);

      const resultat = functions_main.fusionnerTableaux(sqlResult1,sqlResult2,'MoyG2')
      const contentsArray = resultat.map((item: IChp1_B_2, i: number) => {
        return {
          // c0: i+1,
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
      // console.log("🚀 ~ file: functions.ts:350 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_1_1_liste_de_classe_et_resultats_des_eleves_affectes`);
      return reject(err);
    }
  });
};

const chp1_B_1_1_4_tableaux_des_resultats_eleves_affectes_par_classe_par_niveau = (StatutEleve: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, 
      "#FFFF" AS bg, 
      Niveaux.NiveauCourt, 
      Classes.ClasseCourt, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, 
      Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Max(Niveaux.RefNiveau) AS RefNiveau, "#FFCDD2" AS bg, "" AS NiveauCourt, "Total Etabliss" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
 `;
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""]
      }
      const sqlResult = await fetchFromMsAccess<IChp1_B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_1) => {
        const items = _.omit(item, ["RefNiveau", "bg", "ClasseCourt", "NiveauCourt", "RefTypeClasse", "StatutElève", "EffectNonClasse", "MoyClasse"]);
        return {
          bg: item.bg,
          group: item.NiveauCourt,
          label: item.ClasseCourt,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_1_1_4_tableaux_des_resultats_eleves_affectes_par_classe_par_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_1_1_6_tableaux_des_resultats_eleves_affectes_et_non_affectes_par_classe_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG2]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG2]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG2]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG2]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG2]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG2]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG2]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Max(Niveaux.RefNiveau) AS MaxDeRefNiveau, "" AS NiveauCourt, "Total Etabliss" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG2] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY TypesClasses.filière, Elèves.inscrit
HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
 `;
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""]
      }
      const sqlResult = await fetchFromMsAccess<IChp1_B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_1) => {
        const items = _.omit(item, ["RefNiveau", "ClasseCourt", "NiveauCourt", "RefTypeClasse", "EffectNonClasse", "MoyClasse"]);
        return {
          bg: item.bg,
          group: item.NiveauCourt,
          label: item.ClasseCourt,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_1_1_6_tableaux_des_resultats_eleves_affectes_et_non_affectes_par_classe_par_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_2_liste_major_classe_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      TypesClasses.RefTypeClasse, 
      Classes.ClasseCourt, 
      T_Notes.MOYG2 AS MoyG2, 
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
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, Elèves.Décision AS NumDeciAffect, Notes.RangG2
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Notes.RangG2) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY TypesClasses.RefTypeClasse, Classes.ClasseCourt, T_Notes.MOYG2 DESC , Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];  
      `;
      const sqlResult = await fetchFromMsAccess<IChp_1_B_2[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp_1_B_2, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.Genre),
          c4: nv(item.DateNais),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.MoyG2),
          c8: nv(item.RangG2),
          c9: nv(item.ClasseCourt),
          label: item.label,
          obj: { label: item.label},
        };
      });
      const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_3_liste_major_niveau`);
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
      const sqlResult = await fetchFromMsAccess<IChp2_A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_A, index: number) => {
        return {
          // c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.EtsOrig),
          c3: nv(item.ClasseCourt),
          c4: nv(item.NumTrans),
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

const chp2_B_situation_des_effectifs_apres_conseil = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
 `;
      const sqlResult = await fetchFromMsAccess<IChp2_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_B, index: number) => {
        return {
          // c0: index + 1,
          c1: nv(item.NiveauCourt),
          c2: nv(item.G1),
          c3: nv(item.F1),
          c4: nv(item.Total),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_B_situation_des_effectifs_apres_conseil`);
      return reject(err);
    }
  });
};

const chp2_C_pyramides = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT "Base" AS label, 
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
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
       `;
      const sqlResult = await fetchFromMsAccess<IChp2_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_B, index: number) => {
        const items = _.omit(item, ["label","ST1","ST2","TOTAL"]);
        return {
          cols: Object.values(items),
        };
      });
      // console.log("🚀 ~ file: functions.ts:702 ~ returnnewPromise ~ contentsArray:", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_C_pyramides`);
      return reject(err);
    }
  });
};

const chp2_D_repartition_des_eleves_par_annee_de_naissance = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])) AS annee, 
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
      const sqlResult = await fetchFromMsAccess<IChp2_D[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_D) => {
        const items = _.omit(item, ["annee","genre"]);
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
      // console.log("result.chp2_D...", result);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_D_repartition_des_eleves_par_annee_de_naissance`);
      return reject(err);
    }
  });
};

const chp2_E_liste_boursiers = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp2_E[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_E, index: number) => {
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

const chp2_F_tableau_recapitulatif_des_eleves_par_sexe = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      UNION ALL (
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Count(IIf([SEXE]=1,1,Null)) AS G1, Count(IIf([SEXE]=2,1,Null)) AS F1, Val([G1]+[F1]) AS Total
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
 `;
      const sqlResult = await fetchFromMsAccess<IChp2_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_B, index: number) => {
        return {
          // c0: index + 1,
          c1: nv(item.NiveauCourt),
          c2: nv(item.G1),
          c3: nv(item.F1),
          c4: nv(item.Total),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_F_tableau_recapitulatif_des_eleves_par_sexe`);
      return reject(err);
    }
  });
};

//*** debut chapitre 3 ***
const chp3_A_etat_du_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Personnel.RefPersonnel, [NomPers] & " " & [PrénomPers] AS NomComplet, Personnel.Sexe AS Genre, Diplomes.NomDiplome, IIf([Personnel].[Matricule] Is Not Null And [Personnel].[RefTypePers]=2,"√","") AS FonctVacatire, IIf([Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=3,"√","") AS PrivePermanent, IIf([Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=2,"√","") AS PriveVacataire, Personnel.VolumeHoraire, Personnel.N°CNPS AS NumCnps, Personnel.N°AutEnseigner AS NumAut, Matières.MatLong, Personnel.TélPers AS Contacts, Personnel.Fonction
      FROM (Fonction INNER JOIN (Personnel INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) ON Fonction.RefFonction = Personnel.Fonction) LEFT JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome
      WHERE (((Personnel.Fonction)=6)); 
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_A, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.NomDiplome),
          c3: nv(item.Genre),
          c4: nv(item.FonctVacatire),
          c5: nv(item.PrivePermanent),
          c6: nv(item.PriveVacataire),
          c7: nv(item.VolumeHoraire),
          c8: nv(item.NumCnps),
          c9: nv(item.NumAut),
          c10: nv(item.MatLong),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_etat_du_personnel_enseignant`);
      return reject(err);
    }
  });
};

const chp3_A_1_enseignant_par_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT 
            Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[Corps] In (2,17),1,Null)) AS FR1, 
            Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[Corps] In (1,17),1,Null)) AS FR2, 
            Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[Corps] In (2,17),1,Null)) AS HG1, 
            Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[Corps] In (1,17),1,Null)) AS HG2, 
            Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[Corps] In (2,17),1,Null)) AS ANG1, 
            Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[Corps] In (1,17),1,Null)) AS ANG2, 
            Count(IIf([Personnel].[RefMatière]=2 And [Personnel].[Corps] In (2,17),1,Null)) AS PHILO1, 
            Count(IIf([Personnel].[RefMatière]=2 And [Personnel].[Corps] In (1,17),1,Null)) AS PHILO2, 
            Count(IIf([Personnel].[RefMatière]=5 And [Personnel].[Corps] In (2,17),1,Null)) AS ALL1, 
            Count(IIf([Personnel].[RefMatière]=5 And [Personnel].[Corps] In (1,17),1,Null)) AS ALL2, 
            Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Corps] In (2,17),1,Null)) AS ESP1, 
            Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Corps] In (1,17),1,Null)) AS ESP2, 
            Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[Corps] In (2,17),1,Null)) AS MATHS1, 
            Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[Corps] In (1,17),1,Null)) AS MATHS2, 
            Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[Corps] In (2,17),1,Null)) AS SVT1, 
            Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[Corps] In (1,17),1,Null)) AS SVT2, 
            Count(IIf([Personnel].[RefMatière]=13 And [Personnel].[Corps] In (2,17),1,Null)) AS EDHC1, 
            Count(IIf([Personnel].[RefMatière]=13 And [Personnel].[Corps] In (1,17),1,Null)) AS EDHC2, 
            Count(IIf([Personnel].[RefMatière]=10 And [Personnel].[Corps] In (2,17),1,Null)) AS AP1, 
            Count(IIf([Personnel].[RefMatière]=10 And [Personnel].[Corps] In (1,17),1,Null)) AS AP2, 
            Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[Corps] In (2,17),1,Null)) AS SP1, 
            Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[Corps] In (1,17),1,Null)) AS SP2, 
            Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Corps] In (2,17),1,Null)) AS EPS1, 
            Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Corps] In (1,17),1,Null)) AS EPS2, 
            Count(IIf([Personnel].[RefMatière]=15 And [Personnel].[Corps] In (2,17),1,Null)) AS INFOR1, 
            Count(IIf([Personnel].[RefMatière]=15 And [Personnel].[Corps] In (1,17),1,Null)) AS INFOR2, 
            Val([FR1]+[HG1]+[ANG1]+[PHILO1]+[ALL1]+[ESP1]+[MATHS1]+[SVT1]+[EDHC1]+[AP1]+[SP1]+[EPS1]+[INFOR1]) AS T1, 
            Val([FR2]+[HG2]+[ANG2]+[PHILO2]+[ALL2]+[ESP2]+[MATHS2]+[SVT2]+[EDHC2]+[AP2]+[SP2]+[EPS2]+[INFOR2]) AS T2, 
            Val([T1]+[T2]) AS T3
            FROM (Corps INNER JOIN Personnel ON Corps.RefCorps = Personnel.Corps) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
            GROUP BY Personnel.Fonction
            HAVING (((Personnel.Fonction)=6));
              `;
      const sqlResult = await fetchFromMsAccess<IChp3_A_1[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
          "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp3_A_1) => {
        return {
          cols: Object.values(item),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_1_enseignant_par_discipline`);
      return reject(err);
    }
  });
};

/*
corps 1 concerne PROFESSEUR DE LYCEE
corps 2 concerne PROFESSEUR DE COLLEGE
corps 17 concerne PROFESSEUR
*/
const chp3_A_2_enseignant_par_genre = (Corps: string = "2,17") => {
  return new Promise(async (resolve, reject) => {
    try {
      /*
       NB: 1 pour Homme et le 2 femme
       ex:FR1 pour Homme
          FR2 pour Femme   
      */
      let sql = `
                SELECT 
                Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[Sexe]="F",1,Null)) AS FR1, 
                Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[Sexe]="M",1,Null)) AS FR2, 
                Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[Sexe]="F",1,Null)) AS HG1, 
                Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[Sexe]="M" ,1,Null)) AS HG2, 
                Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[Sexe]="F" ,1,Null)) AS ANG1, 
                Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[Sexe]="M" ,1,Null)) AS ANG2, 
                Count(IIf([Personnel].[RefMatière]=2 And [Personnel].[Sexe]="F" ,1,Null)) AS PHILO1, 
                Count(IIf([Personnel].[RefMatière]=2 And [Personnel].[Sexe]="M" ,1,Null)) AS PHILO2, 
                Count(IIf([Personnel].[RefMatière]=5 And [Personnel].[Sexe]="F" ,1,Null)) AS ALL1, 
                Count(IIf([Personnel].[RefMatière]=5 And [Personnel].[Sexe]="M" ,1,Null)) AS ALL2, 
                Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="F" ,1,Null)) AS ESP1, 
                Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="M" ,1,Null)) AS ESP2, 
                Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[Sexe]="F" ,1,Null)) AS MATHS1, 
                Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[Sexe]="M" ,1,Null)) AS MATHS2, 
                Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[Sexe]="F" ,1,Null)) AS SVT1, 
                Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[Sexe]="M" ,1,Null)) AS SVT2, 
                Count(IIf([Personnel].[RefMatière]=13 And [Personnel].[Sexe]="F" ,1,Null)) AS EDHC1, 
                Count(IIf([Personnel].[RefMatière]=13 And [Personnel].[Sexe]="M" ,1,Null)) AS EDHC2, 
                Count(IIf([Personnel].[RefMatière]=10 And [Personnel].[Sexe]="F" ,1,Null)) AS AP1, 
                Count(IIf([Personnel].[RefMatière]=10 And [Personnel].[Sexe]="M" ,1,Null)) AS AP2, 
                Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[Sexe]="F" ,1,Null)) AS SP1, 
                Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[Sexe]="M" ,1,Null)) AS SP2, 
                Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="F" ,1,Null)) AS EPS1, 
                Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="M" ,1,Null)) AS EPS2, 
                Count(IIf([Personnel].[RefMatière]=15 And [Personnel].[Sexe]="F" ,1,Null)) AS INFOR1, 
                Count(IIf([Personnel].[RefMatière]=15 And [Personnel].[Sexe]="M" ,1,Null)) AS INFOR2, 
                Val([FR1]+[HG1]+[ANG1]+[PHILO1]+[ALL1]+[ESP1]+[MATHS1]+[SVT1]+[EDHC1]+[AP1]+[SP1]+[EPS1]+[INFOR1]) AS T1, 
                Val([FR2]+[HG2]+[ANG2]+[PHILO2]+[ALL2]+[ESP2]+[MATHS2]+[SVT2]+[EDHC2]+[AP2]+[SP2]+[EPS2]+[INFOR2]) AS T2
                FROM Personnel
                HAVING (((Personnel.Fonction)=6) AND ((Personnel.Corps) In (${Corps})));
              `;
      const sqlResult = await fetchFromMsAccess<IChp3_A_2[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
          "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp3_A_2) => {
        return {
          cols: Object.values(item),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_2_enseignant_par_genre`);
      return reject(err);
    }
  });
};

const chp3_B_etat_du_personnel_administratif = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Personnel.RefPersonnel, 
      [NomPers] & " " & [PrénomPers] AS NomComplet, 
      Diplomes.NomDiplome, 
      Personnel.Sexe, 
      Fonction.Fonction, 
      Personnel.N°CNPS AS NumCnps
      FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) LEFT JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome
      WHERE (((Personnel.Fonction)=3)); 
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_B, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.NomDiplome),
          c3: nv(item.Sexe),
          c4: nv(item.Fonction),
          c5: nv(item.NumCnps),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_B_etat_du_personnel_administratif`);
      return reject(err);
    }
  });
};

/******* fin chapitre 3 *****
 **************************************************************************************************/

const chp4_1_cas_de_deces = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Elèves.MatriculeNational, 
      Elèves.StatutElève AS StatutEleve,
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Classes.ClasseCourt,
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      Int((Date()-[DateNaiss])/365.5) AS Age, 
      Format(tbl_cs_deces.DateDécès,"Short Date") AS DateDeces, 
      tbl_cs_deces.CauseDécès AS CauseDeces
      FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_deces 
      ON Elèves.RefElève = tbl_cs_deces.RefElève) ON Classes.RefClasse = Elèves.RefClasse;     
        `;
      const sqlResult = await fetchFromMsAccess<IChp4_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_1, index: number) => {
        return {
          c0: index + 1,
          c1: item.MatriculeNational,
          c2: item.NomComplet,
          c3: item.ClasseCourt,
          c4: item.Genre,
          c5: item.CauseDeces,
          c6: item.StatutEleve,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_1_cas_de_deces`);
      return reject(err);
    }
  });
};

const chp4_2_cas_de_grossesse = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Int((Date()-[DateNaiss])/365.5) AS Age,
      Classes.ClasseCourt,
      [Elèves.ResidencePère] & ", " & [Elèves.MobilePère] AS AdresseParent, 
      Format(tbl_cs_grossesse.DateDepotCertificat,"Short Date") AS DateDepotCertificat, 
      Format(tbl_cs_grossesse.DateAccouchement,"Short Date") AS DateAccouchement, 
      "_" AS NomAuteur,
      "_" AS FonctionAuteur
      FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_grossesse ON Elèves.RefElève = tbl_cs_grossesse.RefElève) ON Classes.RefClasse = Elèves.RefClasse;    
        `;
      const sqlResult = await fetchFromMsAccess<IChp4_2[]>(sql, appCnx);
      const isEmpty = {
        MatriculeNational: "",
        NomComplet: "",
        Age: "",
        ClasseCourt: "",
        Genre: "",
        AdresseParent: "",
        DateDepotCertificat: "",
        DateAccouchement: "",
        NomAuteur: "",
        FonctionAuteur: "",
      };
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_2, index: number) => {
        return {
          c0: index + 1,
          c1: item.MatriculeNational,
          c2: item.NomComplet,
          c3: item.ClasseCourt,
          c4: item.Age,
          c5: item.NomAuteur,
          c6: item.FonctionAuteur,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_2_cas_de_grossesse`);
      return reject(err);
    }
  });
};

const chp4_3_cas_maladies = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp4_3[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_3, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.NatureMaladie),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_3_cas_maladies`);
      return reject(err);
    }
  });
};

const rapport = (data: any): Promise<any> => {
  // console.log("rapport...", data)
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
      } = await paramEtabObjet([
        "anscol1",
        "nometab",
        "codeetab",
        "teletab",
        "emailetab",
        "titrechefetab",
        "nomchefetab",
        "drencomplet",
      ]);

      const identite = await paramsEtablisement();
      const path = await functions_main.fileExists(`C:/SPIDER/Ressources/${codeetab}_logo.jpg`);
      //les autres parametres du fichier python 
      const dataParams = { ...data, logo1: path, path };
      // console.log("dataParams...", dataParams);

      const chp1_A_1 = await chp1_A_1_Activites_des_unites_pedagogiques_et_des_Conseils_d_Enseignement();
      const chp1_A_2_a = await chp1_A_2_a_visite_de_classe();
      const chp1_A_2_b = await chp1_A_2_b_formations();
      const chp1_B_1_1 = await chp1_B_1_1_1_liste_de_classe_et_resultats_des_eleves_affectes("=1"); //Elèves affectés 
      const chp1_B_1_2 = await chp1_B_1_1_1_liste_de_classe_et_resultats_des_eleves_affectes("=2"); //Elèves non affectés
      const chp1_B_1_3 = await chp1_B_1_1_1_liste_de_classe_et_resultats_des_eleves_affectes("<>0"); //Elèves affectés et non affectés

      const chp1_B_1_4 = await chp1_B_1_1_4_tableaux_des_resultats_eleves_affectes_par_classe_par_niveau("=1"); //Elèves affectés
      const chp1_B_1_5 = await chp1_B_1_1_4_tableaux_des_resultats_eleves_affectes_par_classe_par_niveau("=2"); //Elèves non affectés
      const chp1_B_1_6 = await chp1_B_1_1_6_tableaux_des_resultats_eleves_affectes_et_non_affectes_par_classe_par_niveau(); //Elèves affectés et non affectés
      const chp1_B_2 = await chp1_B_2_liste_major_classe_niveau();
      const chp2_A = await chp2_A_liste_transferts();
      const chp2_B = await chp2_B_situation_des_effectifs_apres_conseil();
      const chp2_C = await chp2_C_pyramides();
      const chp2_D = await chp2_D_repartition_des_eleves_par_annee_de_naissance();
      const chp2_E = await chp2_E_liste_boursiers();
      const chp2_F = await chp2_F_tableau_recapitulatif_des_eleves_par_sexe();

      const chp3_A = await chp3_A_etat_du_personnel_enseignant();
      const chp3_A_1 = await chp3_A_1_enseignant_par_discipline();
      const chp3_A_2 = await chp3_A_2_enseignant_par_genre("2,17");
      const chp3_A_3 = await chp3_A_2_enseignant_par_genre("1,17");
      const chp3_B = await chp3_B_etat_du_personnel_administratif();

      const chp4_1 = await chp4_1_cas_de_deces();
      const chp4_2 = await chp4_2_cas_de_grossesse();
      const chp4_3 = await chp4_3_cas_maladies();


      const result = {
        ...dataParams,
        name_report: "prive_secondairegeneral_bouake1_2trimestre",
        path_report: "prive/secondaire-general/bouake1",
        anscol1,
        nometab,
        codeetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        drencomplet,
        identite,

        chp1_A_1,
        chp1_A_2_a,
        chp1_A_2_b,
        chp1_B_1_1,
        chp1_B_1_2,
        chp1_B_1_3,
        chp1_B_1_4,
        chp1_B_1_5,
        chp1_B_1_6,
        chp1_B_2,
        chp2_A,
        chp2_B,
        chp2_C,
        chp2_D,
        chp2_E,
        chp2_F,
        chp3_A,
        chp3_A_1,
        chp3_A_2,
        chp3_A_3,
        chp3_B,
       chp4_1,
       chp4_2,
       chp4_3, 
      };
      console.log("🚀 ~ returnnewPromise ~ result++++:", result)
      resolve(result);
    } catch (err: any) {
      return reject(err);
    }
  });
};

export default {
  rapport
};
