import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../../../../../../../databases/accessDB";
import {
  IChp1A_4,
  IChp1_B_1_a,
  IChp1_B_1_b,
  IChp2_2,
  IChp2_5,
  IChp3_3,
  IChp4_2_1,
  IChp_1_C_1_a,
  IChp_3_1,
  IChp_3_2,
  IChp_A_1_3_a,
  IChp_A_2_2,
  IChp_A_2_3,
  IChp_A_3_a
} from "./interfaces";

import functions_main, { nv, paramsEtablisement } from "../../../../utils";

const _ = require("lodash");


/**
 *  ce tableau n'est pas encore cree dans SPIDER
 * nous avons utiliser la table eleves par defaut
 */
const chp1_A_1_activites_des_unites_pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
      ' ' AS Etablissement,
      ' ' AS TypeActivite, 
         ' ' AS NombrePresent,
         ' ' AS Observation
         FROM Elèves  
         WHERE Elèves.inscrit=true
         `;
      //  WHERE RefElève=0
      const sqlResult = await fetchFromMsAccess<IChp_A_1_3_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_A_1_3_a) => {
        return {
          c1: item.Etablissement,
          c2: item.TypeActivite,
          c3: item.NombrePresent,
          c4: item.Observation,
        };
      });
      // console.log("contentsArray...", contentsArray[1])
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_1_activites_des_unites_pedagogiques`);
      return reject(err);
    }
  });
};

// ce tableau n'est pas encore cree dans SPIDER
const chp1_A_2_activites_des_conseils_d_enseignement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         ' ' AS TypeActivite, 
         ' ' AS NombreParticipant,
        ' ' AS Observation
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp_A_3_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_A_3_a) => {
        return {
          c2: item.TypeActivite,
          c3: item.NombreParticipant,
          c4: item.Observation,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_3_b_2_activites_des_conseils_d_enseignement`);
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_3_visite_classe_et_formation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      tbl_visit.type_visit AS typeVisiteur, 
      Personnel.fil_gen, 
      Fonction.Fonction , 
      Personnel.Fonction, 
      classe_matieres_TMP.MatLong AS Discipline
      FROM classe_matieres_TMP INNER JOIN (Fonction INNER JOIN (((Personnel INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers) 
      INNER JOIN tbl_visit ON Personnel.RefPersonnel = tbl_visit.id_pers) INNER JOIN Classes ON tbl_visit.id_classe = Classes.RefClasse) ON Fonction.RefFonction = Personnel.Fonction) 
      ON classe_matieres_TMP.RefMatière = Personnel.RefMatière;
         `;
      const sqlResult = await fetchFromMsAccess<IChp1A_4[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_4) => {
        return {
          c1: nv(item.NomCompletProf),
          c2: nv(item.Discipline),
          c3: nv(item.Classe),
          c4: nv(item.Dates),
          c5: nv(item.Heures),
          c6: nv(item.Fonction),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err =>  chp1_A_3_visite_classe_et_formation`);
      return reject(err);
    }
  });
};

// B
const chp1_B_1_a_synthese_generale_du_trimestre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, Niveaux.cycle AS label, 
      (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,Null,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.cycle, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      UNION ALL
      SELECT 2 AS orderby, 
      Niveaux.cycle AS label, 
      (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse BETWEEN 5 AND 14) AS NbreClasses, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2,
       IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
       Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
       IIf([EffectClasse]<1,Null,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.cycle, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));

      UNION ALL (
      SELECT 3 AS orderby, 
      "Total Général" AS label, 
      (SELECT Count(Niveaux.RefNiveau) AS NbreClasses
      FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
      GROUP BY TypesClasses.filière
      HAVING (((TypesClasses.filière)=1))) AS NbreClasses, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,Null,Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY TypesClasses.filière, Elèves.inscrit
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_a) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label,
          cols: Object.values(functions_main.rav(items)),  
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_1_a_synthese_generale_du_trimestre`);
      return reject(err);
    }
  });
};

const chp1_B_1_b_tableaux_statistiques_des_resultats_3e_trimestre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      
      let sql = `
      SELECT 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
      Count(IIf([MOYG3] Is Not Null And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse)<14));
      UNION ALL
      SELECT 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
      Count(IIf([MOYG3]>=10 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse)<14));
      UNION ALL
      SELECT 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
      Count(IIf([MOYG3] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse)<14));
      UNION ALL
      SELECT 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
      Count(IIf([MOYG3] <8.5 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse)<14));      
                 `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_b) => {
        const items = _.omit(item, ["RefNiveau","bg","label","Genre","NbreClasses"]);
        return {
          cols: Object.values(items),
        };
      });
      const row = contentsArray
      const row1 = row[0];

      const row2 = row[1];
      const deuxPremiereLigne = contentsArray.slice(0,2) // 
      const row03 = functions_main.addPercentRow2(deuxPremiereLigne);//  pourcentage des deux premieres lignes
      const row3 = {cols:[...row03]}

      // console.log("🚀 ~ file: functions.ts:427 ~ returnnewPromise ~ row3:", row3)
      const row4 = row[2];
      const premierTabEtTroisiemme = contentsArray.slice(0, 1).concat(contentsArray.slice(2, 3))
      const row05 = functions_main.addPercentRow2(premierTabEtTroisiemme);//  pourcentage de la premiere ligne et la troisieme
      const row5 = {cols:[...row05]}

      const row6 = row[3]
      const dernierElement = contentsArray.slice(-1)[0]; // Recuperer le dernier element du tableau
      const elementsSouhaites = [row1, dernierElement]
      const row07 = functions_main.addPercentRow2(elementsSouhaites);//  pourcentage de la premiere ligne et la troisieme
      const row7 = {cols:[...row07]}

      const rows = {row1,row2,row3,row4,row5,row6,row7};
      const result = [rows];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_b_tableaux_statistiques_des_resultats_3e_trimestre`);
      return reject(err);
    }
  });
};

const chp1_B_1_d_liste_major_classe_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]) AS RefTypeClasse, 
      T_Notes.MOYG3 AS MoyG3, 
      IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",
      [NiveauCourt] & " " & [Série]) AS NiveauSerie, 
      Niveaux.NiveauCourt, 
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(DateNaiss,"Short Date") AS DateNais, 
      Int((Date()-[DateNaiss])/365.5) AS Age, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
            IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2
,
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      " " AS NumDeciAffect, Notes.RangG3
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]))<14) AND ((Notes.RangG2) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]), T_Notes.MOYG3 DESC , IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",[NiveauCourt] & " " & [Série]), Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];
      `;
      const sqlResult = await fetchFromMsAccess<IChp_A_2_3[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);

     // 1. je recupere les occurences distinctes des refTypeClasse
    //  retourne un seul  ReftypyClasse pour un niveau dans le data
     const distinctRefTypeClasse = _.uniqBy(sqlResult, "RefTypeClasse") as IChp_A_2_3[];
     // 2. je parcours les differents RefTypeClasse
     let result1 = [];
     distinctRefTypeClasse.map(x  => {
       // je recupere les élèves du niveau pour chaque RefTypeClasse puis je choisis les 3 premiers objet du tableau
       const currentTypeClasseStudents = sqlResult.filter(student => student.RefTypeClasse === x.RefTypeClasse)
       const troisMajors = currentTypeClasseStudents.slice(0, 3) // je prends de 0 à 3 (non inclus)
       result1 = result1.concat(troisMajors)
      });

      const contentsArray = result1.map((item: IChp_A_2_3, index: number) => {
        return {
          // c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNais),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7:  nv(item.Lang2),
          c8: nv(item.MoyG3),
          c9: nv(item.RangG3),
          c10: nv(item.ClasseCourt),
          label:item.NiveauSerie,//obligatoire car on regroupe par label
          obj:{label:item.NiveauSerie},
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup(contentsArray);
    //  console.log("result.chp1_B_3 ...",JSON.stringify(result[0]))
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_d_liste_major_classe_par_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_2_a_synthese_generale_de_fin_annee = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, Niveaux.cycle AS label, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,Null,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.cycle, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      UNION ALL
      SELECT 2 AS orderby, 
      Niveaux.cycle AS label, 
      (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse BETWEEN 5 AND 14) AS NbreClasses, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2,
       IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
       Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
       IIf([EffectClasse]<1,Null,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.cycle, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));

      UNION ALL (
      SELECT 3 AS orderby, 
      "Total Général" AS label, 
      (SELECT Count(Niveaux.RefNiveau) AS NbreClasses
      FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
      GROUP BY TypesClasses.filière
      HAVING (((TypesClasses.filière)=1))) AS NbreClasses, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG4] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG4] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG4]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG4] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG4] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,Null,Round(Sum([MOYG4])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY TypesClasses.filière, Elèves.inscrit
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_a) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label,
          cols: Object.values(functions_main.rav(items)),  
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_1_a_synthese_generale_du_trimestre`);
      return reject(err);
    }
  });
};

const chp1_B_2_b_tableaux_statistiques_scolaires_fin_annee = () => {
  return new Promise(async (resolve, reject) => {
    try { 
      let sql = `
      SELECT 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
      Count(IIf([MOYG4] Is Not Null And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse)<14));
      UNION ALL
      SELECT 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
      Count(IIf([MOYG4]>=10 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse)<14));
      UNION ALL
      SELECT 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
      Count(IIf([MOYG4] Between 8.5 And 9.99 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse)<14));
      UNION ALL
      SELECT 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
      Count(IIf([MOYG4] <8.5 And [TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse)<14));      
                 `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_b) => {
        const items = _.omit(item, ["RefNiveau","bg","label","Genre","NbreClasses"]);
        return {
          cols: Object.values(items),
        };
      });
      const row = contentsArray
      const row1 = row[0];

      const row2 = row[1];
      const deuxPremiereLigne = contentsArray.slice(0,2) // 
      const row03 = functions_main.addPercentRow2(deuxPremiereLigne);//  pourcentage des deux premieres lignes
      const row3 = {cols:[...row03]}

      const row4 = row[2];
      const premierTabEtTroisiemme = contentsArray.slice(0, 1).concat(contentsArray.slice(2, 3))
      const row05 = functions_main.addPercentRow2(premierTabEtTroisiemme);//  pourcentage de la premiere ligne et la troisieme
      const row5 = {cols:[...row05]}

      const row6 = row[3]
      const dernierElement = contentsArray.slice(-1)[0]; // Recuperer le dernier element du tableau
      const elementsSouhaites = [row1, dernierElement]
      const row07 = functions_main.addPercentRow2(elementsSouhaites);//  pourcentage de la premiere ligne et la troisieme
      const row7 = {cols:[...row07]}

      const rows = {row1,row2,row3,row4,row5,row6,row7};
      const result = [rows];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_b_tableaux_statistiques_des_resultats_3e_trimestre`);
      return reject(err);
    }
  });
};

const chp1_B_1_c_liste_nominative_troisieme_trimestre = (StatutEleve: string,) => {
  return new Promise(async (resolve, reject) => {
    try {

      let sql1 =`SELECT 
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
    Classes.RefClasse, Classes.ClasseLong, 
    Classes.ClasseCourt, Elèves.MatriculeNational, 
    [NomElève] & " " & [PrénomElève] AS NomComplet, 
    Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
    IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
    IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
    IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
    IIf(IsNull([Elèves].[LV2]),
    IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
    IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3)) AS Lang2, 
    T_Notes.MOYG3 AS MoyG3,
    Notes.RangG3, '-' AS MS, 
    (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, 
    IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
    Elèves.N°Affect6è AS NumDeciAffect, 
    IIf(IsNull(Elèves.Obs),"",Elèves.Obs) AS Obs, 
    (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ, 
TypesClasses.RefTypeClasse
FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.inscrit)=True) AND ((Elèves.StatutElève)${StatutEleve}))
ORDER BY Niveaux.RefNiveau, Classes.RefClasse, [NomElève] & " " & [PrénomElève];
`;
const sqlResult2 = await fetchFromMsAccess<IChp_A_2_2[]>(sql2, appCnx);

if (sqlResult2.length === 0) return resolve([
  {
    label: '',
    obj: {classeLong: '', pp: '', educ: '' },
    group: [{}],
    count: 0
  },
]);

const resultat = functions_main.fusionnerTableaux(sqlResult1,sqlResult2,'MoyG3')
// console.log("🚀 ~ file: functions.ts:794 ~ returnnewPromise ~ resultat:", resultat)

  const contentsArray = resultat.map((item: IChp_A_2_2, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNaiss),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.StatutEleve),
          c8: nv(item.NumDeciAffect),
          c9:  nv(item.Lang2),
          c10: nv(item.MoyG3),
          c11: nv(item.RangG3),
          c12: nv(item.ClasseCourt),
          c13: nv(item.Appreciations),
          label:item.ClasseLong,
          obj:{
            classeLong: item.ClasseLong,
            pp: nv(item.ProfP),
            educ: nv(item.Educ),
          },
        };
  });
    const result = functions_main.groupLabelByGroup(contentsArray);
    resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_c_liste_nominative_troisieme_trimestre`);
      return reject(err);
    }
  });
};

// liste nominative fin d'année 

const chp1_B_1_c_liste_nominative_fin_annee = (StatutEleve: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau AS OrderBy, 
      Classes.RefClasse, Classes.ClasseLong, 
      Classes.ClasseCourt, Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
      IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3)) AS Lang2, 
      T_Notes.MOYG4 AS MoyG4, 
      Notes.RangG4, '-' AS MS, 
      (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      Elèves.N°Affect6è AS NumDeciAffect, 
      Elèves.Décision AS Obs, 
      (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ, 
      TypesClasses.RefTypeClasse
     FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
    WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.inscrit)=True) AND ((Elèves.StatutElève)${StatutEleve}))
   ORDER BY Niveaux.RefNiveau, Classes.RefClasse, [NomElève] & " " & [PrénomElève];

      `;
      const sqlResult = await fetchFromMsAccess<IChp_A_2_2[]>(sql, appCnx);
      // console.log("🚀 ~ file: functions.ts:527 ~ returnnewPromise ~ sqlResult:", sqlResult)
      if (sqlResult.length === 0) return resolve([
        {
          label: '',
          obj: {classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);
      const contentsArray = sqlResult.map((item: IChp_A_2_2, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNaiss),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.StatutEleve),
          c8: nv(item.NumDeciAffect),
          c9:  nv(item.Lang2),
          c10: nv(item.MoyG4),
          c11: nv(item.RangG4),
          c12: nv(item.ClasseCourt),
          c13: nv(item.Obs),
          label:item.ClasseLong,
          obj:{
            classeLong: item.ClasseLong,
            pp: nv(item.ProfP),
            educ: nv(item.Educ),
          },
        };
  });
      // console.log("🚀 ~ file: functions.ts:558 ~ contentsArray ~ contentsArray:", contentsArray.slice(-50))
    const result = functions_main.groupLabelByGroup(contentsArray);
    resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_c_liste_nominative_fin_annee`);
      return reject(err);
    }
  });
};

const chp1_B_2_d_liste_major_classe_par_niveau_fin_annee = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]) AS RefTypeClasse, 
      T_Notes.MOYG4 AS MoyG4, 
      IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",
      [NiveauCourt] & " " & [Série]) AS NiveauSerie, 
      Niveaux.NiveauCourt, 
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(DateNaiss,"Short Date") AS DateNais, 
      Int((Date()-[DateNaiss])/365.5) AS Age, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
            IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2
,
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      " " AS NumDeciAffect, Notes.RangG4
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]))<14) AND ((Notes.RangG2) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]), T_Notes.MOYG4 DESC , IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",[NiveauCourt] & " " & [Série]), Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];
      `;
      const sqlResult = await fetchFromMsAccess<IChp_A_2_3[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);

     // 1. je recupere les occurences distinctes des refTypeClasse
    //  retourne un seul  ReftypyClasse pour un niveau dans le data
     const distinctRefTypeClasse = _.uniqBy(sqlResult, "RefTypeClasse") as IChp_A_2_3[];
     // 2. je parcours les differents RefTypeClasse
     let result1 = [];
     distinctRefTypeClasse.map(x  => {
       // je recupere les élèves du niveau pour chaque RefTypeClasse puis je choisis les 3 premiers objet du tableau
       const currentTypeClasseStudents = sqlResult.filter(student => student.RefTypeClasse === x.RefTypeClasse)
       const troisMajors = currentTypeClasseStudents.slice(0, 3) // je prends de 0 à 3 (non inclus)
       result1 = result1.concat(troisMajors)
      });

      const contentsArray = result1.map((item: IChp_A_2_3, index: number) => {
        return {
          // c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNais),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7:  nv(item.Lang2),
          c8: nv(item.MoyG4),
          c9: nv(item.RangG3),
          c10: nv(item.ClasseCourt),
          label:item.NiveauSerie,//obligatoire car on regroupe par label
          obj:{label:item.NiveauSerie},
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup(contentsArray);
    //  console.log("result.chp1_B_3 ...",JSON.stringify(result[0]))
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_d_liste_major_classe_par_niveau`);
      return reject(err);
    }
  });
};

const chp1_C_1_a_examen_blanc_bepc = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
SELECT 
Niveaux.RefNiveau, 
IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX1, 
[NiveauCourt] & " " & [Série] AS CycleX, 

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
IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX1, 
[NiveauCourt] & " " & [Série] AS CycleX, 

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
GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série]
HAVING (((Niveaux.RefNiveau)=4))
`;
      const sqlResult = await fetchFromMsAccess<IChp_1_C_1_a[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp_1_C_1_a, i: number) => {
        const items =_.omit(item, ["RefNiveau","CycleX","CycleX1"]);
        return {
          ...items,
        };
      });
      const row = contentsArray;
      const row1 = Object.values(row[0]);
      const row2 = Object.values(row[1]);
      const rows = { row1, row2};
      const result = [rows];

      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_C_1_a_examen_blanc_bepc`);
      return reject(err);
    }
  });
};

const chp1_C_1_b_examen_blanc_bac = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
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
HAVING (((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14)); 

UNION ALL
SELECT Niveaux.RefNiveau, "TOTAL" AS Serie, 

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
GROUP BY Niveaux.RefNiveau
      `;
      const sqlResult = await fetchFromMsAccess<IChp_1_C_1_a[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp_1_C_1_a, i: number) => {
        const items =_.omit(item, ["RefNiveau","Serie"]);
        return {
          label: item.Serie,
          cols: Object.values(items),
        };
      });
      
      // console.log("🚀 ~ file: functions.ts:1011 ~ returnnewPromise ~ contentsArray:", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_C_1_examen_blanc_bac`);
      return reject(err);
    }
  });
};

// Examan de fin année 

const chp1_C_2_a_examen_fin_annee_bepc = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
Niveaux.RefNiveau, 
IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX1, 
[NiveauCourt] & " " & [Série] AS CycleX, 
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
IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX1, 
[NiveauCourt] & " " & [Série] AS CycleX, 

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
GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série]
HAVING (((Niveaux.RefNiveau)=4))
`;
      const sqlResult = await fetchFromMsAccess<IChp_1_C_1_a[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "","","","","","","","","","","","","","","",""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp_1_C_1_a, i: number) => {
        const items =_.omit(item, ["RefNiveau","CycleX","CycleX1"]);
        return {
          ...items,
        };
      });
      const row = contentsArray;
      const row1 = Object.values(row[0]);
      const row2 = Object.values(row[1]);
      const rows = {row1, row2};
      const result = [rows];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_C_2_a_examen_fin_annee_bepc`);
      return reject(err);
    }
  });

};

const chp1_C_2_b_examen_fin_annee_bac = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
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
HAVING (((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14)); 

UNION ALL
SELECT Niveaux.RefNiveau, "TOTAL" AS Serie, 
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
GROUP BY Niveaux.RefNiveau
      `;
      const sqlResult = await fetchFromMsAccess<IChp_1_C_1_a[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "","","","","","","","","","","","","","","",""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp_1_C_1_a, i: number) => {
        const items =_.omit(item, ["RefNiveau","Serie"]);
        return {
          label: item.Serie,
          cols: Object.values(items),
        };
      });
      
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_C_2_b_examen_fin_annee_bac`);
      return reject(err);
    }
  });
};

const chp2_1_effectif_et_pyramides = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp2_5[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_5) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          ...items,
        };
      });
      const row = contentsArray;
      const row1 = Object.values(row[0]);
      const deuxPremiereLigne = contentsArray.slice(0,2) 
      const row02 = functions_main.calculDivisionEntiere2(deuxPremiereLigne);//prendre la deuxieme ligne et la supprimée avec la premiere
      const row2 = Object.values(row02);
      const row3 = Object.values(row[2]);
      const row4 = Object.values(row[3]);
      const row5 = Object.values(row[4]);
      const rows = { row1, row2, row3, row4, row5 };
      const result = [rows];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_1_effectif_et_pyramides`);
      return reject(err);
    }
  });
};

const chp2_2_pyramides_previsionnelle = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT "Base prevision." AS label, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      (SELECT Count(RefElève) AS T FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse HAVING RefTypeClasse=5) AS _2ndA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      UNION ALL
      SELECT "Capacité Accueil." AS label, 
      (Select count(*) from Classes Where refTypeClasse=1) AS _6e, 
      (Select count(*) from Classes Where refTypeClasse=2) AS _5e, 
      (Select count(*) from Classes Where refTypeClasse=3) AS _4e, 
      (Select count(*) from Classes Where refTypeClasse=4) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      (Select count(*) from Classes Where refTypeClasse=5) AS _2ndA, 
      (Select count(*) from Classes Where refTypeClasse=6) AS _2ndC, 
      (Select count(*) from Classes Where refTypeClasse=7) AS _1ereA, 
      (Select count(*) from Classes Where refTypeClasse=8) AS _1ereC, 
      (Select count(*) from Classes Where refTypeClasse=9) AS _1ereD, 
      (Select count(*) from Classes Where refTypeClasse=10 And 13) AS _TleA, 
      (Select count(*) from Classes Where refTypeClasse=11) AS _TleC, 
      (Select count(*) from Classes Where refTypeClasse=12) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
         `;
      const sqlResult = await fetchFromMsAccess<IChp2_5[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_5) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          cols: Object.values(items),
        };
      });
      const row = contentsArray;
      const row1 = (row[0]);
      const row2 = (row[1]);
      const row03 = functions_main.calculDivisionEntiere(row);//  division des deux premieres lignes
      const row3 = {cols:[...row03]}
      const rows = {row1,row2,row3};
      const result = [rows];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_1_pyramides_previsionnelle`);
      return reject(err);
    }
  });
};

const chp2_3_taux_de_promotion_interne = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, 
      "#FFFF" AS bg, 
Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, 
IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
(Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, 
Count(IIf([SEXE]=1,1,Null)) AS GeffTotal, 
Count(IIf([SEXE]=2,1,Null)) AS FeffTotal, 
Count(Elèves.RefElève) AS EffectTotal, 

Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
 IIf([GeffTotal]=0,0,Round([Gadmis]/[GeffTotal]*100,2)) AS TauxG, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis,
 IIf([FeffTotal]=0,0,Round([Fadmis]/[FeffTotal]*100,2)) AS TauxF,
[Gadmis]+[Fadmis] AS TotalAdmis,
IIf([EffectTotal]=0,0,Round([TotalAdmis]/[EffectTotal]*100,2)) AS TauxAdmis,

Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
IIf([GeffTotal]=0,0,Round([Gredouble]/[GeffTotal]*100,2)) AS TauxGredouble,
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
IIf([FeffTotal]=0,0,Round([Gredouble]/[FeffTotal]*100,2)) AS TauxFredouble,
[Gredouble]+[Fredouble] AS TotalRedouble,
IIf([EffectTotal]=0,0,Round([TotalRedouble]/[EffectTotal]*100,2)) AS TauxRedouble, 

Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
IIf([GeffTotal]=0,0,Round([Gexclus]/[GeffTotal]*100,2)) AS TauxGexclus,
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
IIf([FeffTotal]=0,0,Round([Fexclus]/[FeffTotal]*100,2)) AS TauxFexclus,
[Gexclus]+[Fexclus] AS TotalExclus, 
IIf([EffectTotal]=0,0,Round([TotalExclus]/[EffectTotal]*100,2)) AS TauxExclus

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
      Count(IIf([SEXE]=1,1,Null)) AS GeffTotal, 
      Count(IIf([SEXE]=2,1,Null)) AS FeffTotal,
      Count(Elèves.RefElève) AS EffectTotal,

Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
IIf([GeffTotal]=0,0,Round([Gadmis]/[GeffTotal]*100,2)) AS TauxG, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis,
IIf([FeffTotal]=0,0,Round([Fadmis]/[FeffTotal]*100,2)) AS TauxF,
[Gadmis]+[Fadmis] AS TotalAdmis,
IIf([EffectTotal]=0,0,Round([TotalAdmis]/[EffectTotal]*100,2)) AS TauxAdmis,

Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
IIf([GeffTotal]=0,0,Round([Gredouble]/[GeffTotal]*100,2)) AS TauxGredouble,
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
IIf([FeffTotal]=0,0,Round([Gredouble]/[FeffTotal]*100,2)) AS TauxFredouble,
[Gredouble]+[Fredouble] AS TotalRedouble,
IIf([EffectTotal]=0,0,Round([TotalRedouble]/[EffectTotal]*100,2)) AS TauxRedouble, 

Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
IIf([GeffTotal]=0,0,Round([Gexclus]/[GeffTotal]*100,2)) AS TauxGexclus,
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
IIf([FeffTotal]=0,0,Round([Fexclus]/[FeffTotal]*100,2)) AS TauxFexclus,
[Gexclus]+[Fexclus] AS TotalExclus, 
IIf([EffectTotal]=0,0,Round([TotalExclus]/[EffectTotal]*100,2)) AS TauxExclus

      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.RefTypeClasse) In (1,2,3,4)));
UNION ALL (
SELECT 
Niveaux.RefNiveau, 
"#FFFF" AS bg, 
Niveaux.NiveauCourt, 
[NiveauCourt] & " " & [Série] AS NiveauSerie, 
IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
(Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, 
Count(IIf([SEXE]=1,1,Null)) AS GeffTotal, 
Count(IIf([SEXE]=2,1,Null)) AS FeffTotal, 
Count(Elèves.RefElève) AS EffectTotal, 

Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
 IIf([GeffTotal]=0,0,Round([Gadmis]/[GeffTotal]*100,2)) AS TauxG, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis,
 IIf([FeffTotal]=0,0,Round([Fadmis]/[FeffTotal]*100,2)) AS TauxF,
[Gadmis]+[Fadmis] AS TotalAdmis,
IIf([EffectTotal]=0,0,Round([TotalAdmis]/[EffectTotal]*100,2)) AS TauxAdmis,

Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
IIf([GeffTotal]=0,0,Round([Gredouble]/[GeffTotal]*100,2)) AS TauxGredouble,
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
IIf([FeffTotal]=0,0,Round([Gredouble]/[FeffTotal]*100,2)) AS TauxFredouble,
[Gredouble]+[Fredouble] AS TotalRedouble,
IIf([EffectTotal]=0,0,Round([TotalRedouble]/[EffectTotal]*100,2)) AS TauxRedouble, 

Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
IIf([GeffTotal]=0,0,Round([Gexclus]/[GeffTotal]*100,2)) AS TauxGexclus,
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
IIf([FeffTotal]=0,0,Round([Fexclus]/[FeffTotal]*100,2)) AS TauxFexclus,
[Gexclus]+[Fexclus] AS TotalExclus, 
IIf([EffectTotal]=0,0,Round([TotalExclus]/[EffectTotal]*100,2)) AS TauxExclus
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (5,6)));
UNION ALL
SELECT 
      Last([Niveaux].[RefNiveau]) AS RefNiveau, 
      "#EBEBEB" AS bg, 
      "2nd Cycle" AS NiveauCourt, 
      "TOTAL 2nd cycle" AS NiveauSerie, 
      First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse in (5,6)) AS NbreClasses, 
      Count(IIf([SEXE]=1,1,Null)) AS GeffTotal, 
      Count(IIf([SEXE]=2,1,Null)) AS FeffTotal,
      Count(Elèves.RefElève) AS EffectTotal,

Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
IIf([GeffTotal]=0,0,Round([Gadmis]/[GeffTotal]*100,2)) AS TauxG, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis,
IIf([FeffTotal]=0,0,Round([Fadmis]/[FeffTotal]*100,2)) AS TauxF,
[Gadmis]+[Fadmis] AS TotalAdmis,
IIf([EffectTotal]=0,0,Round([TotalAdmis]/[EffectTotal]*100,2)) AS TauxAdmis,

Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
IIf([GeffTotal]=0,0,Round([Gredouble]/[GeffTotal]*100,2)) AS TauxGredouble,
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
IIf([FeffTotal]=0,0,Round([Gredouble]/[FeffTotal]*100,2)) AS TauxFredouble,
[Gredouble]+[Fredouble] AS TotalRedouble,
IIf([EffectTotal]=0,0,Round([TotalRedouble]/[EffectTotal]*100,2)) AS TauxRedouble, 

Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
IIf([GeffTotal]=0,0,Round([Gexclus]/[GeffTotal]*100,2)) AS TauxGexclus,
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
IIf([FeffTotal]=0,0,Round([Fexclus]/[FeffTotal]*100,2)) AS TauxFexclus,
[Gexclus]+[Fexclus] AS TotalExclus, 
IIf([EffectTotal]=0,0,Round([TotalExclus]/[EffectTotal]*100,2)) AS TauxExclus
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.RefTypeClasse) In (5,6)));
)
UNION ALL(
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, 
Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, 
IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
(Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, 
Count(IIf([SEXE]=1,1,Null)) AS GeffTotal, 
Count(IIf([SEXE]=2,1,Null)) AS FeffTotal, 
Count(Elèves.RefElève) AS EffectTotal, 

Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
 IIf([GeffTotal]=0,0,Round([Gadmis]/[GeffTotal]*100,2)) AS TauxG, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis,
 IIf([FeffTotal]=0,0,Round([Fadmis]/[FeffTotal]*100,2)) AS TauxF,
[Gadmis]+[Fadmis] AS TotalAdmis,
IIf([EffectTotal]=0,0,Round([TotalAdmis]/[EffectTotal]*100,2)) AS TauxAdmis,

Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
IIf([GeffTotal]=0,0,Round([Gredouble]/[GeffTotal]*100,2)) AS TauxGredouble,
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
IIf([FeffTotal]=0,0,Round([Gredouble]/[FeffTotal]*100,2)) AS TauxFredouble,
[Gredouble]+[Fredouble] AS TotalRedouble,
IIf([EffectTotal]=0,0,Round([TotalRedouble]/[EffectTotal]*100,2)) AS TauxRedouble, 

Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
IIf([GeffTotal]=0,0,Round([Gexclus]/[GeffTotal]*100,2)) AS TauxGexclus,
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
IIf([FeffTotal]=0,0,Round([Fexclus]/[FeffTotal]*100,2)) AS TauxFexclus,
[Gexclus]+[Fexclus] AS TotalExclus, 
IIf([EffectTotal]=0,0,Round([TotalExclus]/[EffectTotal]*100,2)) AS TauxExclus

FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (7,8,9)));
UNION ALL
SELECT 
      Last([Niveaux].[RefNiveau]) AS RefNiveau, 
      "#EBEBEB" AS bg, 
      "2nd Cycle" AS NiveauCourt, 
      "TOTAL Premiere" AS NiveauSerie, 
      First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse in (7,8,9)) AS NbreClasses, 
      Count(IIf([SEXE]=1,1,Null)) AS GeffTotal, 
      Count(IIf([SEXE]=2,1,Null)) AS FeffTotal,
      Count(Elèves.RefElève) AS EffectTotal,

Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
IIf([GeffTotal]=0,0,Round([Gadmis]/[GeffTotal]*100,2)) AS TauxG, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis,
IIf([FeffTotal]=0,0,Round([Fadmis]/[FeffTotal]*100,2)) AS TauxF,
[Gadmis]+[Fadmis] AS TotalAdmis,
IIf([EffectTotal]=0,0,Round([TotalAdmis]/[EffectTotal]*100,2)) AS TauxAdmis,

Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
IIf([GeffTotal]=0,0,Round([Gredouble]/[GeffTotal]*100,2)) AS TauxGredouble,
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
IIf([FeffTotal]=0,0,Round([Gredouble]/[FeffTotal]*100,2)) AS TauxFredouble,
[Gredouble]+[Fredouble] AS TotalRedouble,
IIf([EffectTotal]=0,0,Round([TotalRedouble]/[EffectTotal]*100,2)) AS TauxRedouble, 

Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
IIf([GeffTotal]=0,0,Round([Gexclus]/[GeffTotal]*100,2)) AS TauxGexclus,
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
IIf([FeffTotal]=0,0,Round([Fexclus]/[FeffTotal]*100,2)) AS TauxFexclus,
[Gexclus]+[Fexclus] AS TotalExclus, 
IIf([EffectTotal]=0,0,Round([TotalExclus]/[EffectTotal]*100,2)) AS TauxExclus
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.RefTypeClasse) In (7,8,9)));
)
UNION ALL (
SELECT Niveaux.RefNiveau, "#FFFF" AS bg, 
Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, 
IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
(Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, 
Count(IIf([SEXE]=1,1,Null)) AS GeffTotal, 
Count(IIf([SEXE]=2,1,Null)) AS FeffTotal, 
Count(Elèves.RefElève) AS EffectTotal, 

Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
 IIf([GeffTotal]=0,0,Round([Gadmis]/[GeffTotal]*100,2)) AS TauxG, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis,
 IIf([FeffTotal]=0,0,Round([Fadmis]/[FeffTotal]*100,2)) AS TauxF,
[Gadmis]+[Fadmis] AS TotalAdmis,
IIf([EffectTotal]=0,0,Round([TotalAdmis]/[EffectTotal]*100,2)) AS TauxAdmis,

Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
IIf([GeffTotal]=0,0,Round([Gredouble]/[GeffTotal]*100,2)) AS TauxGredouble,
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
IIf([FeffTotal]=0,0,Round([Gredouble]/[FeffTotal]*100,2)) AS TauxFredouble,
[Gredouble]+[Fredouble] AS TotalRedouble,
IIf([EffectTotal]=0,0,Round([TotalRedouble]/[EffectTotal]*100,2)) AS TauxRedouble, 

Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
IIf([GeffTotal]=0,0,Round([Gexclus]/[GeffTotal]*100,2)) AS TauxGexclus,
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
IIf([FeffTotal]=0,0,Round([Fexclus]/[FeffTotal]*100,2)) AS TauxFexclus,
[Gexclus]+[Fexclus] AS TotalExclus, 
IIf([EffectTotal]=0,0,Round([TotalExclus]/[EffectTotal]*100,2)) AS TauxExclus

FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (10,11,12,13,14)));
UNION ALL
SELECT 
      Last([Niveaux].[RefNiveau]) AS RefNiveau, 
      "#EBEBEB" AS bg, 
      "2nd Cycle" AS NiveauCourt, 
      "TOTAL Terminal" AS NiveauSerie, 
      First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, 
      (Select count(*) from Classes Where refTypeClasse in (10,11,12,13,14)) AS NbreClasses, 
      Count(IIf([SEXE]=1,1,Null)) AS GeffTotal, 
      Count(IIf([SEXE]=2,1,Null)) AS FeffTotal,
      Count(Elèves.RefElève) AS EffectTotal,

Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
IIf([GeffTotal]=0,0,Round([Gadmis]/[GeffTotal]*100,2)) AS TauxG, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis,
IIf([FeffTotal]=0,0,Round([Fadmis]/[FeffTotal]*100,2)) AS TauxF,
[Gadmis]+[Fadmis] AS TotalAdmis,
IIf([EffectTotal]=0,0,Round([TotalAdmis]/[EffectTotal]*100,2)) AS TauxAdmis,

Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
IIf([GeffTotal]=0,0,Round([Gredouble]/[GeffTotal]*100,2)) AS TauxGredouble,
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
IIf([FeffTotal]=0,0,Round([Gredouble]/[FeffTotal]*100,2)) AS TauxFredouble,
[Gredouble]+[Fredouble] AS TotalRedouble,
IIf([EffectTotal]=0,0,Round([TotalRedouble]/[EffectTotal]*100,2)) AS TauxRedouble, 

Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
IIf([GeffTotal]=0,0,Round([Gexclus]/[GeffTotal]*100,2)) AS TauxGexclus,
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
IIf([FeffTotal]=0,0,Round([Fexclus]/[FeffTotal]*100,2)) AS TauxFexclus,
[Gexclus]+[Fexclus] AS TotalExclus, 
IIf([EffectTotal]=0,0,Round([TotalExclus]/[EffectTotal]*100,2)) AS TauxExclus
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.RefTypeClasse) In (10,11,12,13,14)));
)
UNION ALL
   SELECT 
 Last(Niveaux.RefNiveau) AS RefNiveau,
 "#E3E3E3" AS bg, 
 "Etabliss" AS NiveauCourt, 
 "TOTAL Etabliss" AS NiveauSerie, 
 "Etabliss" AS CycleX, 
 (Select count(*) from Classes Where refTypeClasse<14) AS NbreClasses, 
 Count(IIf([SEXE]=1,1,Null)) AS GeffTotal, 
 Count(IIf([SEXE]=2,1,Null)) AS FeffTotal,
 Count(Elèves.RefElève) AS EffectTotal,

Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, 
IIf([GeffTotal]=0,0,Round([Gadmis]/[GeffTotal]*100,2)) AS TauxG, 
Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis,
IIf([FeffTotal]=0,0,Round([Fadmis]/[FeffTotal]*100,2)) AS TauxF,
[Gadmis]+[Fadmis] AS TotalAdmis,
IIf([EffectTotal]=0,0,Round([TotalAdmis]/[EffectTotal]*100,2)) AS TauxAdmis,

Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=1),1,Null)) AS Gredouble, 
IIf([GeffTotal]=0,0,Round([Gredouble]/[GeffTotal]*100,2)) AS TauxGredouble,
Count(IIf([Redoub]=0 And ([MOYG4] Between 8.5 And 9.99 And [SEXE]=2),1,Null)) AS Fredouble, 
IIf([FeffTotal]=0,0,Round([Gredouble]/[FeffTotal]*100,2)) AS TauxFredouble,
[Gredouble]+[Fredouble] AS TotalRedouble,
IIf([EffectTotal]=0,0,Round([TotalRedouble]/[EffectTotal]*100,2)) AS TauxRedouble, 

Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=1,1,Null)) AS Gexclus, 
IIf([GeffTotal]=0,0,Round([Gexclus]/[GeffTotal]*100,2)) AS TauxGexclus,
Count(IIf([MOYG4] Between 0 And 8.49 And [SEXE]=2,1,Null)) AS Fexclus, 
IIf([FeffTotal]=0,0,Round([Fexclus]/[FeffTotal]*100,2)) AS TauxFexclus,
[Gexclus]+[Fexclus] AS TotalExclus, 
IIf([EffectTotal]=0,0,Round([TotalExclus]/[EffectTotal]*100,2)) AS TauxExclus

FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse)<14))

         `;
      const sqlResult = await fetchFromMsAccess<IChp2_2[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_2) => {
        const items = _.omit(item, ["orderby","label","RefNiveau","NbreClasses","NiveauCourt","bg","NiveauSerie","CycleX"]);
        return {
          bg: item.bg,
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_3_taux_de_promotion_interne`);
      return reject(err);
    }
  });
};

// Ce titre n’existe pas encore dans l’ancien rapport
const chp3_1_fonctionnement_du_conseil_interieur = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        ' ' AS Activite_menee, 
        ' ' AS Nombre,
        ' ' AS Observations
        FROM tbl_conseil_interieur
        `;
      const sqlResult = await fetchFromMsAccess<IChp_3_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_3_1, index: number) => {
        return {
          c1: item.Activite_menee,
          c2: item.Nombre,
          c3: item.Observations,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_1_fonctionnement_du_conseil_interieur`);
      return reject(err);
    }
  });
};

/**
 * Ce titre n’existe pas encore dans l’ancien rapport
 * Dans l'ancien rapport c'etait un texte de saisie (table à creer)
 */

const chp3_2_fonctionnement_du_conseil_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      ' ' AS Activite_menee, 
      ' ' AS Nombre,
      ' ' AS Observations
    FROM tbl_conseil_discipline;
        `;
      const sqlResult = await fetchFromMsAccess<IChp_3_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_3_2, index: number) => {
        return {
          c1: item.Activite_menee,
          c2: item.Nombre,
          c3: item.Observations,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_2_fonctionnement_du_conseil_discipline`);
      return reject(err);
    }
  });
};

// Ce titre n’existe pas encore dans l’ancien rapport, c’est un tableau
const chp3_3_activite_para_scolaire = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        '-' AS ActiviteMenee, 
        '-' AS Nombre,
        '-' AS Observation
        FROM tbl_conseil_discipline
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_3[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_3, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.ActiviteMenee),
          c2: nv(item.Nombre),
          c3: nv(item.Observation),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_3_activite_para_scolaire`);
      return reject(err);
    }
  });
};

// Chapitre 4
const chp4_2_enseignant_par_discipline = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp4_2_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp4_2_1) => {
        const items = _.omit(item, ["label"]);
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
      const dataParams = { ...data,logo1:path,path};
      const identite = await paramsEtablisement();

      const chp1_A_1 = await chp1_A_1_activites_des_unites_pedagogiques();
      const chp1_A_2 = await chp1_A_2_activites_des_conseils_d_enseignement();
      const chp1_A_3 = await chp1_A_3_visite_classe_et_formation();
      const chp1_B_1_a = await chp1_B_1_a_synthese_generale_du_trimestre();
      const chp1_B_1_b = await chp1_B_1_b_tableaux_statistiques_des_resultats_3e_trimestre();
      const chp1_B_1_c_1 = await chp1_B_1_c_liste_nominative_troisieme_trimestre("=1");
      const chp1_B_1_c_2 = await chp1_B_1_c_liste_nominative_troisieme_trimestre("=2");
      const chp1_B_1_c_3 = await chp1_B_1_c_liste_nominative_troisieme_trimestre("<>0");
      const chp1_B_2_c_1 = await chp1_B_1_c_liste_nominative_fin_annee("=1");
      const chp1_B_2_c_2 = await chp1_B_1_c_liste_nominative_fin_annee("=2");
      const chp1_B_2_c_3 = await chp1_B_1_c_liste_nominative_fin_annee("<>0");
      const chp1_B_1_d = await chp1_B_1_d_liste_major_classe_par_niveau();
      const chp1_B_2_a = await chp1_B_2_a_synthese_generale_de_fin_annee();
      const chp1_B_2_b = await chp1_B_2_b_tableaux_statistiques_scolaires_fin_annee();
      const chp1_B_2_d = await chp1_B_2_d_liste_major_classe_par_niveau_fin_annee();
      const chp1_C_1_a = await chp1_C_1_a_examen_blanc_bepc();
      const chp1_C_1_b = await chp1_C_1_b_examen_blanc_bac();
      const chp1_C_2_a = await chp1_C_2_a_examen_fin_annee_bepc();
      const chp1_C_2_b = await chp1_C_2_b_examen_fin_annee_bac();
      const chp2_1 = await chp2_1_effectif_et_pyramides();
      const chp2_2 = await chp2_2_pyramides_previsionnelle();
      const chp2_3 = await chp2_3_taux_de_promotion_interne();
      const chp3_1 = await chp3_1_fonctionnement_du_conseil_interieur();
      const chp3_2 = await chp3_2_fonctionnement_du_conseil_discipline();
      const chp3_3 = await chp3_3_activite_para_scolaire();
      const chp4_2 = await chp4_2_enseignant_par_discipline();

      const result = {
        ...dataParams,
        name_report: "prive_secondairegeneral_abidjan3_3trimestre",
        path_report: "prive/secondaire-general/abidjan3",
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
        chp1_A_2,
        chp1_A_3,
        chp1_B_1_a,
        chp1_B_1_b,
        chp1_B_1_c_1,    
        chp1_B_1_c_2,    
        chp1_B_1_c_3,    
        chp1_B_1_d,
        chp1_B_2_a, 
        chp1_B_2_b,  
        chp1_B_2_c_1,
        chp1_B_2_c_2,
        chp1_B_2_c_3,
        chp1_B_2_d, 
        chp1_C_1_a,
        chp1_C_1_b,
        chp1_C_2_a,
        chp1_C_2_b,
        chp2_1,
        chp2_2,
        chp2_3,
        chp3_1,
        chp3_2,
        chp3_3,
        chp4_2,
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
