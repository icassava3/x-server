import { _selectSql } from '../../../../../../../databases/index';
import { appCnx, fetchFromMsAccess, paramEtabObjet } from '../../../../../../../databases/accessDB';
import {
  IChp1_A_1,
  IChp1_A_2_a,
  IChp1_A_2_b,
  IChp1_B_1,
  IChp1_B_2,
  IChp1_B_5_2,
  IChp1_B_5_3,
  IChp1_B_6,
  IChp2_A,
  IChp2_A_1,
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
  IChp_1_B_4,
}
  from "./interfaces";

import functions_main, { nv, paramsEtablisement } from "../../../../utils";
const _ = require("lodash");

//*********************** debut chapitre 1 ***************

// ce tableau n'est pas encore cree dans SPIDER
const chp1_A_1_1_Activites_des_unites_pedagogiques = () => {
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
        `err => chp1_A_1_1_Activites_des_unites_pedagogiques`
      );
      return reject(err);
    }
  });
};
const chp1_A_1_2_Activites_des_conseils_enseignement = () => {
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
        `err => chp1_A_1_1_Activites_des_unites_pedagogiques`
      );
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_2_1_visite_de_classe = () => {
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
      console.log(`err => chp1_A_2_1_visite_de_classe`);
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_2_2_formations = () => {
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
      console.log(`err => chp1_A_2_2_formations`);
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
      T_Notes.MOYG3 AS MoyG3, 
      Notes.RangG3, 
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
          obj: { classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);

      const resultat = functions_main.fusionnerTableaux(sqlResult1, sqlResult2, 'MoyG3')
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
          c9: nv(item.MoyG3),
          c10: nv(item.RangG3),
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
      Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, 
      Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}));
)
UNION ALL (
SELECT Max(Niveaux.RefNiveau) AS RefNiveau, "#FFCDD2" AS bg, "" AS NiveauCourt, "Total Etabliss" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse, Elèves.StatutElève
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
      // console.log("🚀 ~ returnnewPromise ~ contentsArray:", contentsArray)
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
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG3]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG3]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG3]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG3]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG3]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG3]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG3]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Max(Niveaux.RefNiveau) AS MaxDeRefNiveau, "" AS NiveauCourt, "Total Etabliss" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG3]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG3] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG3] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
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
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, Elèves.Décision AS NumDeciAffect, Notes.RangG4
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Notes.RangG4) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY TypesClasses.RefTypeClasse, Classes.ClasseCourt, T_Notes.MOYG4 DESC , Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];  
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
          c7: nv(item.MoyG4),
          c8: nv(item.RangG4),
          c9: nv(item.ClasseCourt),
          label: item.label,
          // obj: { label: item.label },
        };
      });
      // const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_3_liste_major_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_4_Tableau_recapitulatif_des_eleves_par_sexe = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
SELECT IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
[NiveauCourt] & " " & [Série] AS NiveauSerie, 
(Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, 
Count(IIf([SEXE]=1,1,Null)) AS Garcons, 
Count(IIf([SEXE]=2,1,Null)) AS Filles, 
[Garcons]+[Filles] AS Total
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série], TypesClasses.RefTypeClasse, TypesClasses.filière, TypesClasses.Niveau
HAVING (((TypesClasses.filière)=1))
ORDER BY TypesClasses.Niveau;
      `;
      const sqlResult = await fetchFromMsAccess<IChp_1_B_4[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp_1_B_4, i: number) => {
        return {
          c1: nv(item.NiveauSerie),
          c2: nv(item.Garcons),
          c3: nv(item.Filles),
          c4: nv(item.Total),
        };
      });
      // const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_4_Tableau_récapitulatif_des_élèves_par_sexe`);
      return reject(err);
    }
  });
};


const chp1_B_5_1_Récapitulatif_des_résultats_annuels_des_élèves_affectés_et_non_affectés_par_genre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG4]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG4]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG4]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG4]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG4]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG4]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG4]<=8.5 And [SEXE]=1,1,Null)) AS G3, Count(IIf([MOYG4]<=8.5 And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY Classes.OrdreClasse;
UNION ALL 
SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
)
UNION ALL (
SELECT Max(Niveaux.RefNiveau) AS MaxDeRefNiveau, "" AS NiveauCourt, "Total Etabliss" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS G1, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS F1, IIf([EffectClasse]=0,0,Round(([G1]+[F1])/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=1,1,Null)) AS G2, Count(IIf([MOYG4] Between 8.5 And 9.99 And [SEXE]=2,1,Null)) AS F2, IIf([EffectClasse]=0,0,Round(([G2]+[F2])/[EffectClasse]*100,2)) AS Taux2, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=1,1,Null)) AS G3, Count(IIf(([MOYG4] Between 0 And 8.49) And [SEXE]=2,1,Null)) AS F3, IIf([EffectClasse]=0,0,Round(([G3]+[F3])/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
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
      console.log(`err => chp1_B_5_1_Récapitulatif_des_résultats_annuels_des_élèves_affectés_et_non_affectés_par_genre`);
      return reject(err);
    }
  });
};

// Examen blanc
const chp1_B_5_2_examen_blanc_bepc = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT Niveaux.RefNiveau, 
      IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
      [NiveauCourt] & " " & [Série] AS Classe, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2,1,Null)) AS InscritFille, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1,1,Null)) AS InscritGarçon, 
      [InscritFille]+[InscritGarçon] AS TotalInscrit, 
      Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=2,1,Null)) AS PresentFille, 
      Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=1,1,Null)) AS PresentGarçon, 
      [PresentFille]+[PresentGarçon] AS TotalPresent, 
      Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=2,1,Null)) AS AdmisFille, 
      Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=1,1,Null)) AS AdmisGarçon, 
      [AdmisFille]+[AdmisGarçon] AS TotalAdmis, 
      IIf([PresentFille]=0,0,Round([AdmisFille]/[PresentFille]*100,2)) AS TauxFille, 
      IIf([PresentGarçon]=0,0,Round([AdmisGarçon]/[PresentGarçon]*100,2)) AS TauxGarçon, 
      IIf([TotalPresent]=0,0,Round([TotalAdmis]/[TotalPresent]*100,2)) AS TotalTaux
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série]
      HAVING (((Niveaux.RefNiveau)=4));        
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_5_2[]>(sql, appCnx);

      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_B_5_2, i: number) => {
        const items = _.omit(item, ["RefNiveau", "Classe", "CycleX"]);
        return {
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_5_2_examen_blanc_bepc`);
      return reject(err);
    }
  });
};


const chp1_B_5_3_examen_blanc_bac = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Niveaux.RefNiveau, 
      [NiveauCourt] & " " & [Série] AS Serie, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1,1,Null)) AS InscritGarçon, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2,1,Null)) AS InscritFille, 
      [InscritFille]+[InscritGarçon] AS TotalInscrit, 
      Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=1,1,Null)) AS PresentGarçon, 
      Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=2,1,Null)) AS PresentFille, 
      [PresentFille]+[PresentGarçon] AS TotalPresent, 
      Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=1,1,Null)) AS AdmisGarçon, 
      Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=2,1,Null)) AS AdmisFille, 
      [AdmisFille]+[AdmisGarçon] AS TotalAdmis, 
      IIf([PresentGarçon]=0,0,Round([AdmisGarçon]/[PresentGarçon]*100,2)) AS TauxGarçon, 
      IIf([PresentFille]=0,0,Round([AdmisFille]/[PresentFille]*100,2)) AS TauxFille, 
      IIf([TotalPresent]=0,0,Round([TotalAdmis]/[TotalPresent]*100,2)) AS TotalTaux
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, [NiveauCourt] & " " & [Série], TypesClasses.Niveau, TypesClasses.RefTypeClasse
      HAVING (((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14)); 
      UNION ALL
      SELECT Niveaux.RefNiveau, "TOTAL" AS Serie, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1,1,Null)) AS InscritGarçon, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2,1,Null)) AS InscritFille, 
      [InscritFille]+[InscritGarçon] AS TotalInscrit, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1,1,Null)) AS PresentGarçon, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2,1,Null)) AS PresentFille, 
      [PresentFille]+[PresentGarçon] AS TotalPresent, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1,1,Null)) AS AdmisGarçon, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2,1,Null)) AS AdmisFille, 
      [AdmisFille]+[AdmisGarçon] AS TotalAdmis, 
      IIf([PresentGarçon]=0,0,Round([AdmisGarçon]/[PresentGarçon]*100,2)) AS TauxGarçon, 
      IIf([PresentFille]=0,0,Round([AdmisFille]/[PresentFille]*100,2)) AS TauxFille, 
      IIf([TotalPresent]=0,0,Round([TotalAdmis]/[TotalPresent]*100,2)) AS TotalTaux
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14))
      GROUP BY Niveaux.RefNiveau;
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_5_3[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_5_3, i: number) => {
        const items = _.omit(item, ["RefNiveau", "Serie"]);
        return {
          label: item.Serie,
          cols: Object.values(items),
        };
      });

      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_4_1_2_examen_blanc_bac`);
      return reject(err);
    }
  });
};

const chp1_B_6_taux_promotion_interne = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 2 AS orderby, 
      "Effectifs" AS label, 
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
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON (TypesClasses.RefTypeClasse = T_Notes.RefTypeClasse) AND (Elèves.RefElève = T_Notes.RefElève)
GROUP BY Elèves.Inscrit, TypesClasses.filière
HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
UNION ALL 
SELECT 3 AS orderby, "Admis" AS label, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON (TypesClasses.RefTypeClasse = T_Notes.RefTypeClasse) AND (Elèves.RefElève = T_Notes.RefElève)
GROUP BY Elèves.Inscrit, TypesClasses.filière
HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
UNION ALL 
SELECT 4 AS orderby, "Redoublants" AS label, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([MOYG4] Between 8.5 And 9.99 And [Redoub]=0 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON (TypesClasses.RefTypeClasse = T_Notes.RefTypeClasse) AND (Elèves.RefElève = T_Notes.RefElève)
GROUP BY Elèves.Inscrit, TypesClasses.filière
HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
UNION ALL 
SELECT 5 AS orderby, "Exclus" AS label, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([MOYG4]<8.5 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON (TypesClasses.RefTypeClasse = T_Notes.RefTypeClasse) AND (Elèves.RefElève = T_Notes.RefElève)
GROUP BY Elèves.Inscrit, TypesClasses.filière
HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
         `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_6[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_B_6) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          cols: Object.values(items),
        };
      });
      const row = contentsArray;
      const row1 = (row[0]);
      const row2 = (row[1]);
      const row3 = (row[2])
      const row4 = (row[3])
      const rows = {row1,row2,row3,row4};
      const result = [rows];
      // console.log("🚀 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_6_taux_promotion_interne`);
      return reject(err);
    }
  });
};


const chp1_B_3_situation_des_effectifs_apres_le_conseil_de_fin_annee = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, "Effectifs" AS label, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
Count(IIf([MOYG4]>=8.5 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON (Elèves.RefElève = T_Notes.RefElève) AND (TypesClasses.RefTypeClasse = T_Notes.RefTypeClasse)
GROUP BY Elèves.Inscrit, TypesClasses.filière
HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
UNION ALL
SELECT 3 AS orderby, "Filles" AS label, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e,
 Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=2 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON (TypesClasses.RefTypeClasse = T_Notes.RefTypeClasse) AND (Elèves.RefElève = T_Notes.RefElève)
GROUP BY Elèves.Inscrit, TypesClasses.filière
HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
UNION ALL 
SELECT 2 AS orderby, "Garcons" AS label, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA,
 Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC,
 Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
Count(IIf([MOYG4]>=8.5 And [Sexe]=1 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON (TypesClasses.RefTypeClasse = T_Notes.RefTypeClasse) AND (Elèves.RefElève = T_Notes.RefElève)
GROUP BY Elèves.Inscrit, TypesClasses.filière
HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
`;
      const sqlResult = await fetchFromMsAccess<IChp1_B_6[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_B_6) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          cols: Object.values(items),
        };
      });
      const row = contentsArray;
      const row1 = (row[0]);
      const row2 = (row[1]);
      const row3 = (row[2])
      const rows = {row1,row2,row3};
      const result = [rows];
      console.log("🚀 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_6_taux_promotion_interne`);
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

// Ce titre n’existe pas encore dans l’ancien rapport
const chp2_A_1_fonctionnement_du_conseil_interieur = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        ' ' AS Activite_menee, 
        ' ' AS Nombre
        FROM tbl_conseil_interieur
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_A_1, index: number) => {
        return {
          c1: item.Activite_menee,
          c2: item.Nombre,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_1_fonctionnement_du_conseil_interieur`);
      return reject(err);
    }
  });
};


const chp2_A_2_fonctionnement_du_conseil_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      ' ' AS Activite_menee, 
      ' ' AS Nombre
    FROM tbl_conseil_discipline;
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_A_1, index: number) => {
        return {
          c1: item.Activite_menee,
          c2: item.Nombre,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_2_fonctionnement_du_conseil_discipline`);
      return reject(err);
    }
  });
};

const chp2_B_1_activite_des_clubs_et_associations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        '' AS Activite_menee, 
        '' AS Nombre
        FROM tbl_conseil_discipline
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_A_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Activite_menee),
          c2: nv(item.Nombre),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_3_activite_para_scolaire`);
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
        const items = _.omit(item, ["label", "ST1", "ST2", "TOTAL"]);
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


const chp2_C_1_cas_de_deces = () => {
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
      console.log(`err => chp2_C_1_cas_de_deces`);
      return reject(err);
    }
  });
};

const chp2_C_2_cas_de_grossesse = () => {
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
      console.log(`err => chp2_C_2_cas_de_grossesse`);
      return reject(err);
    }
  });
};

const chp2_C_3_cas_maladies = () => {
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
      console.log(`err => chp2_C_3_cas_maladies`);
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

      const chp1_A_1_1 = await chp1_A_1_1_Activites_des_unites_pedagogiques();
      const chp1_A_1_2 = await chp1_A_1_2_Activites_des_conseils_enseignement();
      const chp1_A_2_1 = await chp1_A_2_1_visite_de_classe();
      const chp1_A_2_2 = await chp1_A_2_2_formations();
      const chp1_B_1_1 = await chp1_B_1_1_1_liste_de_classe_et_resultats_des_eleves_affectes("=1"); //Elèves affectés 
      const chp1_B_1_2 = await chp1_B_1_1_1_liste_de_classe_et_resultats_des_eleves_affectes("=2"); //Elèves non affectés
      const chp1_B_1_3 = await chp1_B_1_1_1_liste_de_classe_et_resultats_des_eleves_affectes("<>0"); //Elèves affectés et non affectés

      const chp1_B_1_4 = await chp1_B_1_1_4_tableaux_des_resultats_eleves_affectes_par_classe_par_niveau("=1"); //Elèves affectés
      const chp1_B_1_5 = await chp1_B_1_1_4_tableaux_des_resultats_eleves_affectes_par_classe_par_niveau("=2"); //Elèves non affectés
      const chp1_B_1_6 = await chp1_B_1_1_6_tableaux_des_resultats_eleves_affectes_et_non_affectes_par_classe_par_niveau(); //Elèves affectés et non affectés
      const chp1_B_2 = await chp1_B_2_liste_major_classe_niveau();
      const chp1_B_3 = await chp1_B_3_situation_des_effectifs_apres_le_conseil_de_fin_annee();
      const chp1_B_4 = await chp1_B_4_Tableau_recapitulatif_des_eleves_par_sexe();
      const chp1_B_5_1 = await chp1_B_5_1_Récapitulatif_des_résultats_annuels_des_élèves_affectés_et_non_affectés_par_genre();
      const chp1_B_5_2 = await chp1_B_5_2_examen_blanc_bepc();
      const chp1_B_5_3 = await chp1_B_5_3_examen_blanc_bac();
      const chp1_B_6 = await chp1_B_6_taux_promotion_interne();
       
      const chp2_C_1 = await chp2_C_1_cas_de_deces();
      const chp2_C_2 = await chp2_C_2_cas_de_grossesse();
      const chp2_C_3 = await chp2_C_3_cas_maladies();


      const chp2_A_1 = await chp2_A_1_fonctionnement_du_conseil_interieur();
      const chp2_A_2 = await chp2_A_2_fonctionnement_du_conseil_discipline();
      const chp2_B_1 = await chp2_B_1_activite_des_clubs_et_associations();
      const chp2_B = await chp2_B_situation_des_effectifs_apres_conseil();
      const chp2_C = await chp2_C_pyramides();


      const result = {
        ...dataParams,
        name_report: "prive_secondairegeneral_bouake1_3trimestre",
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

        chp1_A_1_1,
        chp1_A_1_2,
        chp1_A_2_1,
        chp1_A_2_2,
        chp1_B_1_1,
        chp1_B_1_2,
        chp1_B_1_3,
        chp1_B_1_4,
        chp1_B_1_5,
        chp1_B_1_6,
        chp2_B_1,
        chp1_B_2,
        chp1_B_3,
        chp1_B_4,
        chp1_B_5_1,
        chp1_B_5_2,
        chp1_B_5_3,
        chp1_B_6,
        chp2_A_1,
        chp2_A_2,
        chp2_B,
        chp2_C,
        chp2_C_1,
        chp2_C_2,
        chp2_C_3,
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
