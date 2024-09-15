import { _selectSql } from '../../../../../../../databases/index';
import { appCnx, fetchFromMsAccess, paramEtabObjet } from '../../../../../../../databases/accessDB';
import {
  IChp1_A_1,
  IChp1_A_2_a,
  IChp1_A_2_b,
  IChp1_B_1_1,
  IChp1_B_1_3,
  IChp1_B_2_5,
  IChp2_A,
  IChp2_B,
  IChp2_C,
  IChp2_D,
  IChp2_E,
  IChp2_F,
  IChp2_F_1,
  IChp3_A_1,
  IChp3_A_2,
  IChp3_A_3,
  IChp3_B,
  IChp3_B_1,
  IChp4_A,
  IChp4_B,
  IChp4_C_D,
}
  from "./interfaces";

import functions_main, { nv } from "../../../../utils";

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

const chp1_B_1_1_resultats_de_fin_de_semestre = (StatutEleve: string) => {
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
      if (sqlResult1.length === 0) return resolve([]);

      let sql2 = `SELECT 
      Niveaux.RefNiveau AS OrderBy, 
      Classes.RefClasse, 
      Classes.ClasseLong, 
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      Elèves.LieuNaiss,
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
      IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2,
      T_Notes.MoyG1 AS MoyG1, 
      Notes.RangG1, 
      '-' AS MS, 
      (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, 
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      Elèves.Décision AS NumDeciAffect, 
      IIf(IsNull(Elèves.Obs),"",Elèves.Obs) AS Obs, 
      (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ, 
      TypesClasses.RefTypeClasse
      FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.inscrit)=True) AND ((Elèves.StatutElève)${StatutEleve}))
      ORDER BY Niveaux.RefNiveau, Classes.RefClasse, [NomElève] & " " & [PrénomElève]
      `;

      const sqlResult2 = await fetchFromMsAccess<IChp1_B_1_1[]>(sql2, appCnx);
      if (sqlResult2.length === 0) return resolve([
        {
          label: '',
          obj: { classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);
      const resultat = functions_main.fusionnerTableaux(sqlResult1, sqlResult2, 'MoyG1')

      const contentsArray = resultat.map((item: IChp1_B_1_1, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.Genre),
          c4: nv(item.DateNaiss),
          c5: nv(item.LieuNaiss),
          c6: nv(item.Nationalite),
          c7: nv(item.Redoub),
          c8: nv(item.StatutEleve),
          c9: nv(item.NumDeciAffect),
          c10: nv(item.MoyG1),
          c11: nv(item.RangG1),
          c12: nv(item.Appreciations),
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
      console.log(`err => chp1_B_1_1_resultats_de_fin_de_semestre`);
      return reject(err);
    }
  });
};

const chp1_B_1_3_tableaux_statistiqures_des_resultats = (StatutEleve: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
          SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, "#FFFF" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, 
          Count(IIf([MoyG1] Is Not Null And [SEXE]=2,1,Null)) AS F2, Count(IIf([MoyG1] Is Not Null And [SEXE]=1,1,Null)) AS G2,
          [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
          FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
          GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
          HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
          ORDER BY 1, 2,3,4;
          UNION ALL
          SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, "#E3E3E3" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, 
          Count(IIf([MoyG1] Is Not Null And [SEXE]=2,1,Null)) AS F2, Count(IIf([MoyG1] Is Not Null And [SEXE]=1,1,Null)) AS G2,
          [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
          FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
          GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
          HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
          ORDER BY 1, 2,3,4;
          UNION ALL 
          SELECT Max(Niveaux.RefNiveau) AS RefNiveau, "Total" AS NiveauCourt, "Total Etab" AS ClasseCourt, "#E3E3E3" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MoyG1] Is Not Null And [SEXE]=2,1,Null)) AS F2, Count(IIf([MoyG1] Is Not Null And [SEXE]=1,1,Null)) AS G2, [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
          FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
          HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)${StatutEleve}))
          ORDER BY 1, 2, 3, 4;
          
              `;
      const sqlResult_ = await fetchFromMsAccess<IChp1_B_1_3[]>(sql, appCnx);
      const sqlResult = _.orderBy(sqlResult_, ["RefNiveau", "NiveauCourt", "ClasseCourt"], ["asc", "asc", "asc"]);
      const isEmpty = {
        bg: "#FFFF",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_B_1_3) => {
        const items = _.omit(item, ["OrdreClasse", "RefNiveau", "NiveauCourt", "ClasseCourt", "bg", "EffectTotal", "EffectClasse", "EffectNonClasse", "MoyClasse"]);
        return {
          bg: item.bg,
          label: item.ClasseCourt,
          cols: Object.values(items),
        };
      });
      //  console.log("result.chp1_B_1_3 ...",JSON.stringify(contentsArray))
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_1_3_tableaux_statistiqures_des_resultats`);
      return reject(err);
    }
  });
};

const chp1_B_1_5_tableaux_statistiqures_des_resultats = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, "#FFFF" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, 
            Count(IIf([MoyG1] Is Not Null And [SEXE]=2,1,Null)) AS F2, Count(IIf([MoyG1] Is Not Null And [SEXE]=1,1,Null)) AS G2,
            [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
            FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
            GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, TypesClasses.filière, Elèves.inscrit
            HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
            ORDER BY 1, 2,3,4;
            UNION ALL
            SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, "#E3E3E3" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, 
            Count(IIf([MoyG1] Is Not Null And [SEXE]=2,1,Null)) AS F2, Count(IIf([MoyG1] Is Not Null And [SEXE]=1,1,Null)) AS G2,
            [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
            FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
            GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
            HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
            ORDER BY 1, 2,3,4;
            UNION ALL 
            SELECT Max(Niveaux.RefNiveau) AS RefNiveau, "Total" AS NiveauCourt, "Total Etab" AS ClasseCourt, "#E3E3E3" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MoyG1] Is Not Null And [SEXE]=2,1,Null)) AS F2, Count(IIf([MoyG1] Is Not Null And [SEXE]=1,1,Null)) AS G2, [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
            FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
            WHERE (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
            ORDER BY 1, 2, 3, 4;
              `;
      const sqlResult_ = await fetchFromMsAccess<IChp1_B_1_3[]>(sql, appCnx);
      const sqlResult = _.orderBy(sqlResult_, ["RefNiveau", "NiveauCourt", "ClasseCourt"], ["asc", "asc", "asc"]);
      const isEmpty = {
        bg: "#FFFF",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_B_1_3) => {
        const items = _.omit(item, ["OrdreClasse", "RefNiveau", "NiveauCourt", "ClasseCourt", "bg", "EffectTotal", "EffectClasse", "EffectNonClasse", "MoyClasse"]);
        return {
          bg: item.bg,
          label: item.ClasseCourt,
          cols: Object.values(items),
        };
      });
      //  console.log("result.chp1_B_1_5 ...",JSON.stringify(contentsArray))
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_1_5_tableaux_statistiqures_des_resultats`);
      return reject(err);
    }
  });
};

const chp1_B_1_6_liste_major_classe_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]) AS RefTypeClasse, 
      T_Notes.MoyG1 AS MoyG1, 
      IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",
      [NiveauCourt] & " " & [Série]) AS NiveauSerie, 
      Niveaux.NiveauCourt, 
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(DateNaiss,"Short Date") AS DateNais, 
      Elèves.LieuNaiss,
      Int((Date()-[DateNaiss])/365.5) AS Age, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
      IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2,
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      " " AS NumDeciAffect, Notes.RangG1
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]))<14) AND ((Notes.RangG1) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]), T_Notes.MoyG1 DESC , IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",[NiveauCourt] & " " & [Série]), Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_2_5[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_B_2_5) => {
        return {
          c1: nv(item.ClasseCourt),
          c2: nv(item.MatriculeNational),
          c3: nv(item.NomComplet),
          c4: nv(item.Genre),
          c5: nv(item.DateNais),
          c6: nv(item.LieuNaiss),
          c7: nv(item.Nationalite),
          c8: nv(item.Redoub),
          c9: nv(item.MoyG1),
          c10: nv(item.RangG1),
          label: item.NiveauSerie,//obligatoire car on regroupe par label
          obj: { label: item.NiveauSerie },
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup(contentsArray);
      // console.log("result.chp1_B_1_6 ...",JSON.stringify(result[0]))
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_6_liste_major_classe_par_niveau`);
      return reject(err);
    }
  });
};

/********** fin chapitre 1 **********
 *
 *
 *
 **************************************************************************/

//*********************** debut chapitre 2 ***************
const chp2_A_liste_transferts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & " " & [PrénomElève] AS NomComplet, 
        IIf([Sexe]=1,"M","F") AS Genre,
        Classes.ClasseCourt, 
        Int((Date()-[DateNaiss])/365.5) AS Age,
        IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
        Nationalités.NATIONAL AS Nat, 
        Elèves.EtsOrig, 
        Elèves.N°Transf AS NumTransfert
         FROM Nationalités RIGHT JOIN (Niveaux INNER JOIN (TypesClasses INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Nationalités.CODPAYS = Elèves.Nat
         WHERE (((Elèves.Transféré)=Yes))
         ORDER BY [NomElève] & " " & [PrénomElève];
        `;

      const sqlResult = await fetchFromMsAccess<IChp2_A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_A, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.EtsOrig),
          c3: nv(item.ClasseCourt),
          c4: nv(item.NumTransfert),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_A_liste_transferts`);
      return reject(err);
    }
  });
};

const chp2_B_situation_des_effectifs_apres_le_conseil_des_classes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT Niveaux.RefNiveau, 
              IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 1 AS orderby, [NiveauCourt] & " " & [Série] AS NiveauSerie, "#FFFF" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MoyG1] Is Not Null And [SEXE]=2,1,Null)) AS F2, Count(IIf([MoyG1] Is Not Null And [SEXE]=1,1,Null)) AS G2, [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([SEXE]=2 And [Redoub]=True,1,Null)) AS F3, Count(IIf([SEXE]=1 And [Redoub]=True,1,Null)) AS G3, [F3]+[G3] AS T3, Count(IIf([SEXE]=2 And [MoyG1]>=10,1,Null)) AS F4, Count(IIf([SEXE]=1 And [MoyG1]>=10,1,Null)) AS G4, [F4]+[G4] AS T4, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), 1, [NiveauCourt] & " " & [Série], TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
              HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<5))
              ORDER BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), 1, TypesClasses.RefTypeClasse;
              UNION ALL(
              SELECT First(Niveaux.RefNiveau) AS RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 2 AS orderby, "Total " & First([CycleX]) AS NiveauSerie, "#EBEBEB" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MoyG1] Is Null Or [SEXE]=2,Null,1)) AS F2, Count(IIf([MoyG1] Is Null Or [SEXE]=1,Null,1)) AS G2, [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([SEXE]=2 And [Redoub]=True,1,Null)) AS F3, Count(IIf([SEXE]=1 And [Redoub]=True,1,Null)) AS G3, [F3]+[G3] AS T3, Count(IIf([SEXE]=2 And [MoyG1]>=10,1,Null)) AS F4, Count(IIf([SEXE]=1 And [MoyG1]>=10,1,Null)) AS G4, [F4]+[G4] AS T4, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              GROUP BY IIf(IsNull([Cycle]),Null,[cycle]), 2, TypesClasses.filière, Elèves.inscrit
              HAVING (((IIf(IsNull([Cycle]),Null,[cycle]))="1er Cycle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
              ORDER BY First(Niveaux.RefNiveau), IIf(IsNull([Cycle]),Null,[cycle]), 2, 1;
              )  
              UNION ALL (
              SELECT Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 1 AS orderby, [NiveauCourt] & " " & [Série] AS NiveauSerie, "#FFFF" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MoyG1] Is Not Null And [SEXE]=2,1,Null)) AS F2, Count(IIf([MoyG1] Is Not Null And [SEXE]=1,1,Null)) AS G2, [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([SEXE]=2 And [Redoub]=True,1,Null)) AS F3, Count(IIf([SEXE]=1 And [Redoub]=True,1,Null)) AS G3, [F3]+[G3] AS T3, Count(IIf([SEXE]=2 And [MoyG1]>=10,1,Null)) AS F4, Count(IIf([SEXE]=1 And [MoyG1]>=10,1,Null)) AS G4, [F4]+[G4] AS T4, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), 1, [NiveauCourt] & " " & [Série], TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
              HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse) Between 5 And 9))
              ORDER BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), 1, TypesClasses.RefTypeClasse;
              )
              UNION ALL (
              SELECT Last([Niveaux].[RefNiveau]) AS RefNiveau, "2nd Cycle" AS CycleX, 1 AS orderby, "Tle A" AS NiveauSerie, "#FFFF" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, 0 AS EffectTotal, Count(IIf([MoyG1] Is Not Null And [SEXE]=2,1,Null)) AS F2, Count(IIf([MoyG1] Is Not Null And [SEXE]=1,1,Null)) AS G2, [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([SEXE]=2 And [Redoub]=True,1,Null)) AS F3, Count(IIf([SEXE]=1 And [Redoub]=True,1,Null)) AS G3, [F3]+[G3] AS T3, Count(IIf([SEXE]=2 And [MoyG1]>=10,1,Null)) AS F4, Count(IIf([SEXE]=1 And [MoyG1]>=10,1,Null)) AS G4, [F4]+[G4] AS T4, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse) In (10,13)))
              ORDER BY "2nd Cycle", 1;
              )
              UNION ALL(
              SELECT Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 1 AS orderby, [NiveauCourt] & " " & [Série] AS NiveauSerie, "#FFFF" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MoyG1] Is Not Null And [SEXE]=2,1,Null)) AS F2, Count(IIf([MoyG1] Is Not Null And [SEXE]=1,1,Null)) AS G2, [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([SEXE]=2 And [Redoub]=True,1,Null)) AS F3, Count(IIf([SEXE]=1 And [Redoub]=True,1,Null)) AS G3, [F3]+[G3] AS T3, Count(IIf([SEXE]=2 And [MoyG1]>=10,1,Null)) AS F4, Count(IIf([SEXE]=1 And [MoyG1]>=10,1,Null)) AS G4, [F4]+[G4] AS T4, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), 1, [NiveauCourt] & " " & [Série], TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
              HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse) Between 11 And 12))
              ORDER BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), 1, TypesClasses.RefTypeClasse;
              )
              UNION ALL(
              SELECT First(Niveaux.RefNiveau) AS RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 2 AS orderby, "Total " & First([CycleX]) AS NiveauSerie, "#EBEBEB" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MoyG1] Is Null Or [SEXE]=2,Null,1)) AS F2, Count(IIf([MoyG1] Is Null Or [SEXE]=1,Null,1)) AS G2, [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([SEXE]=2 And [Redoub]=True,1,Null)) AS F3, Count(IIf([SEXE]=1 And [Redoub]=True,1,Null)) AS G3, [F3]+[G3] AS T3, Count(IIf([SEXE]=2 And [MoyG1]>=10,1,Null)) AS F4, Count(IIf([SEXE]=1 And [MoyG1]>=10,1,Null)) AS G4, [F4]+[G4] AS T4, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              GROUP BY IIf(IsNull([Cycle]),Null,[cycle]), 2, TypesClasses.filière, Elèves.inscrit
              HAVING (((IIf(IsNull([Cycle]),Null,[cycle]))="2nd Cycle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
              ORDER BY First(Niveaux.RefNiveau), IIf(IsNull([Cycle]),Null,[cycle]), 2, 1;
              )
              UNION ALL(
              SELECT 8 AS RefNiveau, "Synthèse" AS CycleX, 3 AS orderby, "Total GENERAL" AS NiveauSerie, "#E3E3E3" AS bg, Count(IIf([SEXE]=2,1,Null)) AS F1, Count(IIf([SEXE]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MoyG1] Is Null Or [SEXE]=2,Null,1)) AS F2, Count(IIf([MoyG1] Is Null Or [SEXE]=1,Null,1)) AS G2, [F2]+[G2] AS T2, Count(IIf([MoyG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MoyG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([SEXE]=2 And [Redoub]=True,1,Null)) AS F3, Count(IIf([SEXE]=1 And [Redoub]=True,1,Null)) AS G3, [F3]+[G3] AS T3, Count(IIf([SEXE]=2 And [MoyG1]>=10,1,Null)) AS F4, Count(IIf([SEXE]=1 And [MoyG1]>=10,1,Null)) AS G4, [F4]+[G4] AS T4, Count(IIf([MoyG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MoyG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MoyG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MoyG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              GROUP BY "3", 3, TypesClasses.filière, Elèves.inscrit
              HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
              ORDER BY 1, 2, 3;
              )
              `;
      const sqlResult = await fetchFromMsAccess<IChp2_B[]>(sql, appCnx);
      // const sqlResult = _.orderBy(sqlResult_, ["RefNiveau","CycleX","orderby"], ["asc","asc","asc"]);
      const isEmpty = {
        bg: "#FFFF",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_B) => {
        const items = _.omit(item, ["RefNiveau", "CycleX", "orderby", "NiveauSerie", "bg", "EffectTotal", "EffectClasse", "EffectNonClasse", "MoyClasse"]);
        return {
          bg: item.bg,
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      //  console.log("result.chp2_B ...",JSON.stringify(contentsArray))
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_B_situation_des_effectifs_apres_le_conseil_des_classes`);
      return reject(err);
    }
  });
};

const chp2_C_pyramides = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT "BASE" AS label, Count(IIf([Classes].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([Classes].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([Classes].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([Classes].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([Classes].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([Classes].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([Classes].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([Classes].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([Classes].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([Classes].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([Classes].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([Classes].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
              FROM Classes
              WHERE (((Classes.RefTypeClasse)<14));
              `;
      const sqlResult = await fetchFromMsAccess<IChp2_C[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_C) => {
        const items = _.omit(item, ["label"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      //  console.log("result.chp2_C ...",JSON.stringify(contentsArray))
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
      let sql = `SELECT IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])) AS annee, IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(IIf([Niveaux]![RefNiveau]=1,1,Null)) AS 6e, Count(IIf(Niveaux!RefNiveau=2,1,Null)) AS 5e, Count(IIf(Niveaux!RefNiveau=3,1,Null)) AS 4e, Count(IIf(Niveaux!RefNiveau=4,1,Null)) AS 3e, Val([6e]+[5e]+[4e]+[3e]) AS ST1, Count(IIf(Niveaux!RefNiveau=5 And TypesClasses!Série="A",1,Null)) AS 2ndA, Count(IIf(Niveaux!RefNiveau=5 And TypesClasses!Série="C",1,Null)) AS 2ndC, Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="A",1,Null)) AS 1ereA, Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="C",1,Null)) AS 1ereC, Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="D",1,Null)) AS 1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS TleA, Count(IIf(Niveaux!RefNiveau=7 And TypesClasses!Série="C",1,Null)) AS TleC, Count(IIf(Niveaux!RefNiveau=7 And TypesClasses!Série="D",1,Null)) AS TleD, Val([2ndA]+[2ndC]+[1ereA]+[1ereC]+[1ereD]+[TleA]+[TleC]+[TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])), IIf([Elèves].[Sexe]=2,"F","G"), Elèves.Inscrit, '', TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      UNION ALL
      SELECT "TOTAL GENERAL" AS annee, IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY IIf([Elèves].[Sexe]=2,"F","G"), Elèves.Sexe;      
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_D[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_D) => {
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
      // console.log("result.chp2_D...", result[0]);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_D_repartition_des_eleves_par_annee_de_naissance`);
      return reject(err);
    }
  });
};

const chp2_E_liste_boursiers_et_demi_boursiers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
                SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Elèves.MatriculeNational, [NomElève] & " " & [PrénomElève] AS NomComplet, IIf([Sexe]=1,"M","F") AS Genre, Format([DateNaiss],"Short Date") AS DateNais, Elèves.LieuNaiss, IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, T_Notes.MoyG1, Notes.RangG1, IIf([Bourse]="BE","BE","1/2B") AS Regime, Classes.ClasseCourt
                FROM ((((TypesClasses INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) INNER JOIN T_Notes ON (Elèves.RefElève = T_Notes.RefElève) AND (TypesClasses.RefTypeClasse = T_Notes.RefTypeClasse)) INNER JOIN Notes ON T_Notes.RefElève = Notes.RefElève
                WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Bourse) Is Not Null))
                ORDER BY Niveaux.RefNiveau;
                `;
      const sqlResult = await fetchFromMsAccess<IChp2_E[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_E) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.Genre),
          c4: nv(item.DateNais),
          c5: nv(item.LieuNaiss),
          c6: nv(item.Nationalite),
          c7: nv(item.MoyG1),
          c8: nv(item.RangG1),
          c9: nv(item.Regime),
          c10: nv(item.ClasseCourt),
        };
      });
      // console.log("contentsArray ...", contentsArray)
      //  console.log("result.chp1_E ...",JSON.stringify(contentsArray[0]))
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_E_liste_boursiers_et_demi_boursiers`);
      return reject(err);
    }
  });
};

const chp2_F_recapitulatif_des_eleves_par_sexe = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT "F" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((TypesClasses.filière)=1))
              HAVING (((Elèves.Sexe)=2));
              UNION ALL 
              SELECT  "G" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((TypesClasses.filière)=1))
              HAVING (((Elèves.Sexe)=1));
              UNION ALL SELECT  "T" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
              FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
              HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
              FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
              GROUP BY Elèves.Inscrit, TypesClasses.filière
              HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
              `;

      const sqlResult = await fetchFromMsAccess<IChp2_F[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_F) => {
        const items = _.omit(item, ["label"]);
        return {
          label: item.label,
          cols: functions_main.rav(items),
        };
      });
      //console.log("result.chp2_F ...",JSON.stringify(contentsArray))
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_F_recapitulatif_des_eleves_par_sexe`);
      return reject(err);
    }
  });
};

const chp2_F_1_synthese = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT "EFFECTIFS" AS label, 
              Count(IIf([Sexe]=2 And [cycle]="1er Cycle",1,Null)) AS F1, 
              Count(IIf([Sexe]=1 And [cycle]="1er Cycle",1,Null)) AS G1, 
              Val([G1]+[F1]) AS T1, Count(IIf([Sexe]=2 And [cycle]="2nd Cycle",1,Null)) AS F2, 
              Count(IIf([Sexe]=1 And [cycle]="2nd Cycle",1,Null)) AS G2, Val([G2]+[F2]) AS T2, 
              Val([F1]+[F2]) AS TF, Val([G1]+[G2]) AS TG, Val([TF]+[TG]) AS TFG
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève;
              `;
      const sqlResult = await fetchFromMsAccess<IChp2_F_1[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_F_1) => {
        const items = _.omit(item, ["label"]);
        return {
          label: item.label,
          cols: functions_main.rav(items),
        };
      });
      //console.log("result.chp2_F_1 ...",JSON.stringify(contentsArray))
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_F_1_synthese`);
      return reject(err);
    }
  });
};

const chp2_G_recapitulatif_des_eleves_par_sexe = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT "F" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
            FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
            WHERE (((TypesClasses.filière)=1) AND ((Elèves.Sexe)=2) AND ((Elèves.StatutElève)=1));

            UNION ALL 
            SELECT "G" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
            FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
            WHERE (((TypesClasses.filière)=1) AND ((Elèves.Sexe)=1) AND ((Elèves.StatutElève)=1));

            UNION ALL 
            SELECT "T" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
                      FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
                      HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
            FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
            GROUP BY Elèves.Inscrit, TypesClasses.filière, Elèves.StatutElève
            HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1) AND ((Elèves.StatutElève)=1));

                  `;

      const sqlResult = await fetchFromMsAccess<IChp2_F[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_F) => {
        const items = _.omit(item, ["label"]);
        return {
          label: item.label,
          cols: functions_main.rav(items),
        };
      });
      //console.log("result.chp2_G ...",JSON.stringify(contentsArray))
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_G_recapitulatif_des_eleves_par_sexe`);
      return reject(err);
    }
  });
};

const chp2_G_1_synthese = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT "EFFECTIFS" AS label, Count(IIf([Sexe]=2 And [cycle]="1er Cycle",1,Null)) AS F1, Count(IIf([Sexe]=1 And [cycle]="1er Cycle",1,Null)) AS G1, Val([G1]+[F1]) AS T1, Count(IIf([Sexe]=2 And [cycle]="2nd Cycle",1,Null)) AS F2, Count(IIf([Sexe]=1 And [cycle]="2nd Cycle",1,Null)) AS G2, Val([G2]+[F2]) AS T2, Val([F1]+[F2]) AS TF, Val([G1]+[G2]) AS TG, Val([TF]+[TG]) AS TFG
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              GROUP BY Elèves.StatutElève
              HAVING (((Elèves.StatutElève)=1));
              `;
      const sqlResult = await fetchFromMsAccess<IChp2_F_1[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_F_1) => {
        const items = _.omit(item, ["label"]);
        return {
          label: item.label,
          cols: functions_main.rav(items),
        };
      });
      //console.log("result.chp2_G_1 ...",JSON.stringify(contentsArray))
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_G_1_synthese`);
      return reject(err);
    }
  });
};

/*** fin chapitre 2 ***
 *
 **************************************************************************/
//*** debut chapitre 3 ***
const chp3_A_1_liste_nominative_du_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Personnel.RefPersonnel, [NomPers] & " " & [PrénomPers] AS NomComplet, Personnel.Sexe AS Genre, Diplomes.NomDiplome, IIf([Personnel].[Matricule] Is Not Null And [Personnel].[RefTypePers]=2,"√","") AS FonctVacatire, IIf([Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=3,"√","") AS PrivePermanent, IIf([Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=2,"√","") AS PriveVacataire, Personnel.VolumeHoraire, Personnel.N°CNPS AS NumCnps, Personnel.N°AutEnseigner AS NumAut, Matières.MatLong, Personnel.TélPers AS Contacts, Personnel.Fonction
      FROM (Fonction INNER JOIN (Personnel INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) ON Fonction.RefFonction = Personnel.Fonction) LEFT JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome
      WHERE (((Personnel.Fonction)=6)); 
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_A_1, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.Genre),
          c3: nv(item.NomDiplome),
          c4: nv(item.FonctVacatire),
          c5: nv(item.PrivePermanent),
          c6: nv(item.PriveVacataire),
          c7: nv(item.VolumeHoraire),
          c8: nv(item.NumCnps),
          c9: nv(item.NumAut),
          c10: nv(item.MatLong),
          c11: nv(item.Contacts),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_1_liste_nominative_du_personnel_enseignant`);
      return reject(err);
    }
  });
};

const chp3_A_2_synthese = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Count(IIf([Personnel].[RefTypePers]=3,1,Null)) AS Permanent, Count(IIf([Personnel].[RefTypePers]=2,1,Null)) AS Vacataire, Val([Permanent]+[Vacataire]) AS T1, Round(Count(IIf([Personnel].[Corps] In (17),1,Null))/2) AS x, Round(Count(IIf([Personnel].[Corps] In (2),1,Null))+[x],0) AS cycle1, Round(Count(IIf([Personnel].[Corps] In (1),1,Null))+[x]) AS cycle2, Val([cycle1]+[cycle2]) AS T2, Count(IIf([Personnel].[Sexe]="F" And [Personnel].[Fonction]=6,1,Null)) AS F3, Count(IIf([Personnel].[Sexe]="M" And [Personnel].[Fonction]=6,1,Null)) AS G3, Val([F3]+[G3]) AS T3, "" AS F4, "" AS G4, Val([F4]+[G4]) AS T4, "" AS F5, "" AS G5, Val([F5]+[G5]) AS T5
      FROM Personnel
      HAVING (((Personnel.Fonction)=6));      
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_A_2[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp3_A_2) => {
        const items = _.omit(item, ["x"]);
        return {
          cols: functions_main.rav(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_2_synthese`);
      return reject(err);
    }
  });
};

const chp3_A_3_effectifs_des_enseignants_par_discipline_et_par_cycle = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[Corps] In (2,17),1,Null)) AS FR1, Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[Corps] In (1,17),1,Null)) AS FR2, Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[Corps] In (2,17),1,Null)) AS HG1, Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[Corps] In (1,17),1,Null)) AS HG2, Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[Corps] In (2,17),1,Null)) AS ANG1, Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[Corps] In (1,17),1,Null)) AS ANG2, Count(IIf([Personnel].[RefMatière]=2 And [Personnel].[Corps] In (2,17),1,Null)) AS PHILO1, Count(IIf([Personnel].[RefMatière]=2 And [Personnel].[Corps] In (1,17),1,Null)) AS PHILO2, Count(IIf([Personnel].[RefMatière]=5 And [Personnel].[Corps] In (2,17),1,Null)) AS ALL1, Count(IIf([Personnel].[RefMatière]=5 And [Personnel].[Corps] In (1,17),1,Null)) AS ALL2, Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Corps] In (2,17),1,Null)) AS ESP1, Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Corps] In (1,17),1,Null)) AS ESP2, Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[Corps] In (2,17),1,Null)) AS MATHS1, Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[Corps] In (1,17),1,Null)) AS MATHS2, Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[Corps] In (2,17),1,Null)) AS SVT1, Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[Corps] In (1,17),1,Null)) AS SVT2, Count(IIf([Personnel].[RefMatière]=13 And [Personnel].[Corps] In (2,17),1,Null)) AS EDHC1, Count(IIf([Personnel].[RefMatière]=13 And [Personnel].[Corps] In (1,17),1,Null)) AS EDHC2, Count(IIf([Personnel].[RefMatière]=10 And [Personnel].[Corps] In (2,17),1,Null)) AS AP1, Count(IIf([Personnel].[RefMatière]=10 And [Personnel].[Corps] In (1,17),1,Null)) AS AP2, Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[Corps] In (2,17),1,Null)) AS SP1, Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[Corps] In (1,17),1,Null)) AS SP2, Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Corps] In (2,17),1,Null)) AS EPS1, Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Corps] In (1,17),1,Null)) AS EPS2, Count(IIf([Personnel].[RefMatière]=15 And [Personnel].[Corps] In (2,17),1,Null)) AS INFOR1, Count(IIf([Personnel].[RefMatière]=15 And [Personnel].[Corps] In (1,17),1,Null)) AS INFOR2, Count(IIf([Personnel].[RefMatière]=0 And [Personnel].[Corps] In (2,17),1,Null)) AS FHR1, Count(IIf([Personnel].[RefMatière]=0 And [Personnel].[Corps] In (1,17),1,Null)) AS FHR2, Val([FR1]+[HG1]+[ANG1]+[PHILO1]+[ALL1]+[ESP1]+[MATHS1]+[SVT1]+[EDHC1]+[AP1]+[SP1]+[EPS1]+[INFOR1]+[FHR1]) AS T1, Val([FR2]+[HG2]+[ANG2]+[PHILO2]+[ALL2]+[ESP2]+[MATHS2]+[SVT2]+[EDHC2]+[AP2]+[SP2]+[EPS2]+[INFOR2]+[FHR2]) AS T2, Val([T1]+[T2]) AS T3
              FROM (Corps INNER JOIN Personnel ON Corps.RefCorps = Personnel.Corps) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
              GROUP BY Personnel.Fonction
              HAVING (((Personnel.Fonction)=6));
              `;
      const sqlResult = await fetchFromMsAccess<IChp3_A_3[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
          "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp3_A_3) => {
        return {
          cols: Object.values(item),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_3_effectifs_des_enseignants_par_discipline_et_par_cycle`);
      return reject(err);
    }
  });
};

const chp3_A_4_enseignant_par_genre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
                SELECT Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[Sexe]="F",1,Null)) AS FR1, Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[Sexe]="M",1,Null)) AS FR2, Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[Sexe]="F",1,Null)) AS HG1, Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[Sexe]="M" ,1,Null)) AS HG2, Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[Sexe]="F" ,1,Null)) AS ANG1, Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[Sexe]="M" ,1,Null)) AS ANG2, Count(IIf([Personnel].[RefMatière]=2 And [Personnel].[Sexe]="F" ,1,Null)) AS PHILO1, Count(IIf([Personnel].[RefMatière]=2 And [Personnel].[Sexe]="M" ,1,Null)) AS PHILO2, Count(IIf([Personnel].[RefMatière]=5 And [Personnel].[Sexe]="F" ,1,Null)) AS ALL1, Count(IIf([Personnel].[RefMatière]=5 And [Personnel].[Sexe]="M" ,1,Null)) AS ALL2, Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="F" ,1,Null)) AS ESP1, Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="M" ,1,Null)) AS ESP2, Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[Sexe]="F" ,1,Null)) AS MATHS1, Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[Sexe]="M" ,1,Null)) AS MATHS2, Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[Sexe]="F" ,1,Null)) AS SVT1, Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[Sexe]="M" ,1,Null)) AS SVT2, Count(IIf([Personnel].[RefMatière]=13 And [Personnel].[Sexe]="F" ,1,Null)) AS EDHC1, Count(IIf([Personnel].[RefMatière]=13 And [Personnel].[Sexe]="M" ,1,Null)) AS EDHC2, Count(IIf([Personnel].[RefMatière]=10 And [Personnel].[Sexe]="F" ,1,Null)) AS AP1, Count(IIf([Personnel].[RefMatière]=10 And [Personnel].[Sexe]="M" ,1,Null)) AS AP2, Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[Sexe]="F" ,1,Null)) AS SP1, Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[Sexe]="M" ,1,Null)) AS SP2, Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="F" ,1,Null)) AS EPS1, Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="M" ,1,Null)) AS EPS2, Count(IIf([Personnel].[RefMatière]=15 And [Personnel].[Sexe]="F" ,1,Null)) AS INFOR1, Count(IIf([Personnel].[RefMatière]=15 And [Personnel].[Sexe]="M" ,1,Null)) AS INFOR2, Count(IIf([Personnel].[RefMatière]=0 And [Personnel].[Sexe]="F" ,1,Null)) AS FHR1, Count(IIf([Personnel].[RefMatière]=0 And [Personnel].[Sexe]="M" ,1,Null)) AS FHR2, Val([FR1]+[HG1]+[ANG1]+[PHILO1]+[ALL1]+[ESP1]+[MATHS1]+[SVT1]+[EDHC1]+[AP1]+[SP1]+[EPS1]+[INFOR1]+[FHR1]) AS T1, Val([FR2]+[HG2]+[ANG2]+[PHILO2]+[ALL2]+[ESP2]+[MATHS2]+[SVT2]+[EDHC2]+[AP2]+[SP2]+[EPS2]+[INFOR2]+[FHR2]) AS T2, Val([T1]+[T2]) AS T3
                FROM Personnel
                GROUP BY Personnel.Fonction
                HAVING (((Personnel.Fonction)=6));
              `;
      const sqlResult = await fetchFromMsAccess<IChp3_A_3[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
          "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp3_A_3) => {
        return {
          cols: Object.values(item),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_4_enseignant_par_genre`);
      return reject(err);
    }
  });
};

const chp3_B_etat_du_personnel_administratif = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT [Personnel.NomPers] & "" & [Personnel.PrénomPers] AS NomComplet, Diplomes.NomDiplome, Fonction.Fonction, Personnel.N°CNPS AS NumCnps, Personnel.N°AutEnseigner AS NumAut, Personnel.TélPers AS Contacts, Fonction.Groupe
      FROM (Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
      WHERE (((Fonction.Groupe)=1) AND ((Personnel.fil_gen)=True));      
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_B, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.NomDiplome),
          c3: nv(item.Fonction),
          c4: nv(item.NumCnps),
          c5: nv(item.NumAut),
          c6: nv(item.Contacts),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_B_etat_du_personnel_administratif`);
      return reject(err);
    }
  });
};

const chp3_B_1_synthese = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
                SELECT 
                Count(IIf([Personnel].[Fonction]=3 And [Personnel].[Sexe]="F",1,Null)) AS F1, 
                Count(IIf([Personnel].[Fonction]=3 And [Personnel].[Sexe]="M",1,Null)) AS H1, 
                Count(IIf([Personnel].[Fonction]=35 And [Personnel].[Sexe]="F",1,Null)) AS F2, 
                Count(IIf([Personnel].[Fonction]=35 And [Personnel].[Sexe]="M",1,Null)) AS H2, 
                Count(IIf([Personnel].[Fonction]=8 And [Personnel].[Sexe]="F",1,Null)) AS F3, 
                Count(IIf([Personnel].[Fonction]=8 And [Personnel].[Sexe]="M",1,Null)) AS H3, 
                Count(IIf([Personnel].[Fonction]=10 And [Personnel].[Sexe]="F",1,Null)) AS F4, 
                Count(IIf([Personnel].[Fonction]=10 And [Personnel].[Sexe]="M",1,Null)) AS H4, 
                Count(IIf([Personnel].[Fonction]=5 And [Personnel].[Sexe]="F",1,Null)) AS F5, 
                Count(IIf([Personnel].[Fonction]=5 And [Personnel].[Sexe]="M",1,Null)) AS H5, 
                Count(IIf([Personnel].[Fonction]=14 And [Personnel].[Sexe]="F",1,Null)) AS F6, 
                Count(IIf([Personnel].[Fonction]=14 And [Personnel].[Sexe]="M",1,Null)) AS H6, 
                Count(IIf([Personnel].[Fonction]=33 And [Personnel].[Sexe]="F",1,Null)) AS F7, 
                Count(IIf([Personnel].[Fonction]=33 And [Personnel].[Sexe]="M",1,Null)) AS H7, 
                Count(IIf([Personnel].[Fonction] Not In (3,35,8,10,5,14,33) And [Personnel].[Sexe]="F",1,Null)) AS F8, 
                Count(IIf([Personnel].[Fonction] Not In (3,35,8,10,5,14,33) And [Personnel].[Sexe]="M",1,Null)) AS H8, 
                Val([F1]+[F2]+[F3]+[F4]+[F5]+[F6]+[F7]+[F8]) AS TF, Val([H1]+[H2]+[H3]+[H4]+[H5]+[H6]+[H7]+[H8]) AS TH, 
                Val([TF]+[TH]) AS T
                FROM Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction;          
              `;
      const sqlResult = await fetchFromMsAccess<IChp3_B_1[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp3_B_1) => {
        return {
          cols: Object.values(item),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_B_1_synthese`);
      return reject(err);
    }
  });
};

/******* fin chapitre 3 *****
 *
 **************************************************************************************************/

//*** debut chapitre 4 ***
const chp4_A_deces = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
             SELECT Elèves.MatriculeNational, 
             [NomElève] & " " & [PrénomElève] AS NomComplet, 
             Classes.ClasseCourt, 
             tbl_cs_deces.CauseDécès AS CauseDeces, 
             IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
             Format(tbl_cs_deces.DateDécès,"Short Date") AS DateDeces, 
             IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
             [MobilePère] & " \ " & [MobileMère] AS ContactsFamille
             FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_deces ON Elèves.RefElève = tbl_cs_deces.RefElève) ON Classes.RefClasse = Elèves.RefClasse; 
             `;
      const sqlResult = await fetchFromMsAccess<IChp4_A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_A, index: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.CauseDeces),
          c5: nv(item.StatutEleve),
          c6: nv(item.ContactsFamille),
        };
      });

      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_A_deces`);
      return reject(err);
    }
  });
};
const chp4_B_cas_de_grossesse = () => {
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
      "_" AS FonctionAuteur,
      [MobilePère] & " \ " & [MobileMère] AS ContactsFamille,
      "" AS Contacts
      FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_grossesse ON Elèves.RefElève = tbl_cs_grossesse.RefElève) ON Classes.RefClasse = Elèves.RefClasse;    
        `;
      const sqlResult = await fetchFromMsAccess<IChp4_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_B, index: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.ContactsFamille),
          c5: nv(item.NomAuteur),
          c6: nv(item.FonctionAuteur),
          c7: nv(item.Contacts),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_B_cas_de_grossesse`);
      return reject(err);
    }
  });
};

const chp4_C_maladies = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Elèves.MatriculeNational, [NomElève] & " " & [PrénomElève] AS NomComplet, Classes.ClasseCourt, [MobilePère] & " \ " & [MobileMère] AS ContactsFamille, tbl_cs_maladie.NatureMaladie
      FROM (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN tbl_cs_maladie ON Elèves.RefElève = tbl_cs_maladie.RefElève;
        `;
      const sqlResult = await fetchFromMsAccess<IChp4_C_D[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_C_D, index: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.ContactsFamille),
          c5: nv(item.Description),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_C_maladies`);
      return reject(err);
    }
  });
};

const chp4_D_handicaps = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Classes.ClasseCourt, 
      [MobilePère] & " \ " & [MobileMère] AS ContactsFamille, 
      Format([Elèves].[DateNaiss],"Short Date") AS DateNaiss, 
      tbl_cs_handicap.NatureHandicap, 
      tbl_cs_handicap.OrigineHandicap
      FROM tbl_cs_handicap INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON tbl_cs_handicap.RefElève = Elèves.RefElève;        `;
      const sqlResult = await fetchFromMsAccess<IChp4_C_D[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_C_D, index: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.ContactsFamille),
          c5: nv(item.Description),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_D_handicaps`);
      return reject(err);
    }
  });
};

/******* fin chapitre 4 *****
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

      const path = await functions_main.fileExists(`C:/SPIDER/Ressources/${codeetab}_logo.jpg`);
      //les autres parametres du fichier python 
      const dataParams = { ...data, logo1: path, path };
      // console.log("dataParams...", dataParams);

      const chp1_A_1 = await chp1_A_1_Activites_des_unites_pedagogiques_et_des_Conseils_d_Enseignement();
      const chp1_A_2_a = await chp1_A_2_a_visite_de_classe();
      const chp1_A_2_b = await chp1_A_2_b_formations();
      const chp1_B_1_1 = await chp1_B_1_1_resultats_de_fin_de_semestre("<>0"); //Elèves affectés et non affectés
      const chp1_B_1_2 = await chp1_B_1_1_resultats_de_fin_de_semestre("=1"); //Elèves affectés

      const chp1_B_1_3 = await chp1_B_1_3_tableaux_statistiqures_des_resultats("=1"); //Elèves affectés
      const chp1_B_1_4 = await chp1_B_1_3_tableaux_statistiqures_des_resultats("=2"); //Elèves non affectés
      const chp1_B_1_5 = await chp1_B_1_5_tableaux_statistiqures_des_resultats(); //Elèves affectés et non affectés
      const chp1_B_1_6 = await chp1_B_1_6_liste_major_classe_par_niveau();

      const chp2_A = await chp2_A_liste_transferts();
      const chp2_B = await chp2_B_situation_des_effectifs_apres_le_conseil_des_classes();
      const chp2_C = await chp2_C_pyramides();
      const chp2_D = await chp2_D_repartition_des_eleves_par_annee_de_naissance();
      const chp2_E = await chp2_E_liste_boursiers_et_demi_boursiers();
      const chp2_F = await chp2_F_recapitulatif_des_eleves_par_sexe();
      const chp2_F_1 = await chp2_F_1_synthese();

      const chp2_G = await chp2_G_recapitulatif_des_eleves_par_sexe();
      const chp2_G_1 = await chp2_G_1_synthese();

      const chp3_A_1 = await chp3_A_1_liste_nominative_du_personnel_enseignant();
      const chp3_A_2 = await chp3_A_2_synthese();
      const chp3_A_3 = await chp3_A_3_effectifs_des_enseignants_par_discipline_et_par_cycle();
      const chp3_A_4 = await chp3_A_4_enseignant_par_genre();
      const chp3_B = await chp3_B_etat_du_personnel_administratif();
      const chp3_B_1 = await chp3_B_1_synthese();

      const chp4_A = await chp4_A_deces();
      const chp4_B = await chp4_B_cas_de_grossesse();
      const chp4_C = await chp4_C_maladies();
      const chp4_D = await chp4_D_handicaps();

      const result = {
        ...dataParams,
        name_report: "prive_secondairegeneral_bouake2_1trimestre",
        path_report: "prive/secondaire-general/bouake2",
        anscol1,
        nometab,
        codeetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        drencomplet,

        chp1_A_1,
        chp1_A_2_a,
        chp1_A_2_b,
        chp1_B_1_1,
        chp1_B_1_2,
        chp1_B_1_3,
        chp1_B_1_4,
        chp1_B_1_5,
        chp1_B_1_6,

        chp2_A,
        chp2_B,
        chp2_C,
        chp2_D,
        chp2_E,
        chp2_F,
        chp2_F_1,
        chp2_G,
        chp2_G_1,

        chp3_A_1,
        chp3_A_2,
        chp3_A_3,
        chp3_A_4,

        chp3_B,
        chp3_B_1,

        chp4_A,
        chp4_B,
        chp4_C,
        chp4_D,
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
