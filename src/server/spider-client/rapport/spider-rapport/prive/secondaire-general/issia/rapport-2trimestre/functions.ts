import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "./../../../../../../../databases/accessDB";

import _ from "lodash";

import {
  IChp1_B_1_b,
  IChp2_1, IChp2_2, IChp2_4, IChp3, IChp5_2, IChp6_2_1, IChp7_4_4, IChp7_6_1, IChp_A_2_2,
} from "./interfaces";
const fs = require("fs");
const _ = require("lodash");
import functions_main from "../../../../utils";

//la couleur du font des cellules du TOTAL de certains Tableau : ex: 1 Résultats des non affectés par niveau et par classe
//https://www.color-name.com/
const bg = {
  c1: "#FFFF",
  c2: "#FFC000",
}; //Color Name: Amber

const nv = (data: any) => {
  return data === null || data === "null" ? "" : data;
};
const zn = (data: any) => {
  return data === 0 ? "" : data;
};

const pageGarde = (): Promise<any | {}> => {
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
        boitepostale,
      } = await paramEtabObjet([
        "anscol1",
        "nometab",
        "codeetab",
        "teletab",
        "emailetab",
        "titrechefetab",
        "nomchefetab",
        "boitepostale",
      ]);

      const path = await functions_main.fileExists(
        `C:/SPIDER/Ressources/${codeetab}_logo.jpg`
      );
      const logo1 = path;
      // console.log("dataParams...", dataParams);

      const result = {
        ex: "ex",
        anscol1: anscol1,
        nometab: nometab,
        codeetab: codeetab,
        teletab: teletab,
        emailetab: emailetab,
        logo1: logo1,
        path: path,
        titrechefetab: titrechefetab,
        nomchefetab: nomchefetab,
      };
      resolve(result);
    } catch (err: any) {
      console.log(`err => pageGarde`);
      return reject(err);
    }
  });
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


//*** debut rapport  ***


const chp2_1_effectif_eleves_affect_et_non_affect = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, 
      "G" AS label, 
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
      SELECT 4 AS orderby, 
      "F" AS label, 
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
      HAVING (((Elèves.Sexe)=2));

      UNION ALL 
      SELECT 5 AS orderby, 
      "T" AS label, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      (SELECT Count(RefElève) AS T
      FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));               
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_1[]>(sql, appCnx);

      const isEmpty = {
        label:"",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "","","","",],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_1) => {
        const items = _.omit(item, ["label", "orderby"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      // console.log("🚀 ~ file: functions.ts:187 ~ returnnewPromise ~ contentsArray:", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_1_effectif_eleves_affect_et_non_affect`);
      return reject(err);
    }
  });
};

const chp2_2_effectif_eleves_affectes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 3 AS orderby, 
      "G" AS label, 
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
      WHERE (((TypesClasses.filière)=1) AND ((Elèves.Sexe)=1) AND ((Elèves.StatutElève)=1));
      UNION ALL
      SELECT 4 AS orderby, "F" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((Elèves.Sexe)=2) AND ((Elèves.StatutElève)=1));
      UNION ALL
      SELECT 5 AS orderby, 
      "T" AS label, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      (SELECT Count(RefElève) AS T
      FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière, Elèves.StatutElève
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1) AND ((Elèves.StatutElève)=1));  
      `;
      const sqlResult = await fetchFromMsAccess<IChp2_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_1) => {
        const items = _.omit(item, ["label", "orderby"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_2_effectif_eleves_affect_et_non_affect`);
      return reject(err);
    }
  });
};

const chp2_3_repartition_des_eleves_par_annee_de_naissance = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])) AS Genre, 
      Count(IIf([Sexe]=1,1,Null)) AS G, 
      Count(IIf([Sexe]=2,1,Null)) AS F, 
      Val([G]+[F]) AS T
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])), Elèves.Inscrit, TypesClasses.filière
      HAVING (((IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])))) AND ((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      
      UNION ALL (
      SELECT "TOTAL" AS Genre, 
      Count(IIf([Sexe]=1,1,Null)) AS G, 
      Count(IIf([Sexe]=2,1,Null)) AS F, 
      Val([G]+[F]) AS T
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      )          
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const row1: any = [];
      const row2: any = [];
      const row3: any = [];
      const row4: any = [];
      const contentsArray = sqlResult.map((item: IChp2_2) => {
        row1.push(item.Genre);
        row2.push(item.G);
        row3.push(item.F);
        row4.push(item.T);
      });
      const result: any[] = [{ row1, row2, row3, row4 }];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_3_repartition_des_eleves_par_annee_de_naissance`);
      return reject(err);
    }
  });
};

const chp2_4_effectif_par_nationalite_avec_approche_genre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Count(IIf([Redoub]=0 And [SEXE]=1 And [Nat]="70",1,Null)) AS GarçonIvoirienNonRedoub, 
      Count(IIf([Redoub]=0 And [SEXE]=2 And [Nat]="70",1,Null)) AS FilleIvoirienNonRedoub, 
      [GarçonIvoirienNonRedoub]+[FilleIvoirienNonRedoub] AS T1, 
      Count(IIf([Redoub]=0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS GarçonIvoirienDoublant, 
      Count(IIf([Redoub]=0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS FilleIvoirienDoublant, 
      [GarçonIvoirienDoublant]+[FilleIvoirienDoublant] AS T2, 
      Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS TotalGarçonIvoirienEtNon, 
      Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS TotalFilleIvoirienEtNon, 
      [TotalGarçonIvoirienEtNon]+[TotalFilleIvoirienEtNon] AS T3, 
      Count(IIf([Redoub]=True And [SEXE]=1 And [Nat]="70",1,Null)) AS GarçonRedoudIvoirien, 
      Count(IIf([Redoub]=True And [SEXE]=2 And [Nat]="70",1,Null)) AS FilleRedoudIvoirien, 
      [GarçonRedoudIvoirien]+[FilleRedoudIvoirien] AS T4, 
      Count(IIf([Redoub]=True And [SEXE]=1 And [Nat]<>"70",1,Null)) AS GarçonRedoudNonIvoirien, 
      Count(IIf([Redoub]=True And [SEXE]=2 And [Nat]<>"70",1,Null)) AS FilleRedoudNonIvoirien, 
      [GarçonRedoudNonIvoirien]+[FilleRedoudNonIvoirien] AS T5, 
      Count(IIf([Redoub]=True And [SEXE]=1,1,Null)) AS TotalRedoubGarçonIvoirienEtNon, 
      Count(IIf([Redoub]=True And [SEXE]=2,1,Null)) AS TotalRedoubFilleIvoirienEtNon, 
      [TotalGarçonIvoirienEtNon]+[TotalFilleIvoirienEtNon] AS T6, 
      Count(IIf([SEXE]=1,1,Null)) AS TotaGeneralGarçon, 
      Count(IIf([SEXE]=2,1,Null)) AS TotaGeneralFille, 
      [TotaGeneralGarçon]+[TotaGeneralFille] AS Total
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Elèves.inscrit, TypesClasses.filière
HAVING (((Elèves.inscrit)<>0) AND ((TypesClasses.filière)=1));
              `;
      const sqlResult = await fetchFromMsAccess<IChp2_4[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_4) => {
        const items = _.omit(item, ["NiveauSerie", "CycleX"]);
        return {
          cols: Object.values(items),
        };
      });
      // const result = functions_main.formatGroupBy(contentsArray);
      // console.log("🚀 ~ file: functions.ts:377 ~ returnnewPromise ~ contentsArray:", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_4_effectif_par_nationalite_avec_approche_genre`);
      return reject(err);
    }
  });
};
const chp2_5_effectif_premier_cycle_10_16ans = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=1 And DateDiff("yyyy",[Elèves].[DateNaiss],Date()) Between 10 And 16,1,Null)) AS _6eG, 
      Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=1 And DateDiff("yyyy",[Elèves].[DateNaiss],Date()) Between 10 And 16,1,Null)) AS _6eF, 
      [_6eG]+[_6eF] AS Total6, 
      Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=2 And DateDiff("yyyy",[Elèves].[DateNaiss],Date()) Between 10 And 16,1,Null)) AS _5eG, 
      Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=2 And DateDiff("yyyy",[Elèves].[DateNaiss],Date()) Between 10 And 16,1,Null)) AS _5eF, 
      [_5eG]+[_5eF] AS Total5, 
      Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=3 And DateDiff("yyyy",[Elèves].[DateNaiss],Date()) Between 10 And 16,1,Null)) AS _4eG, 
      Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=3 And DateDiff("yyyy",[Elèves].[DateNaiss],Date()) Between 10 And 16,1,Null)) AS _4eF, 
      [_4eG]+[_4eF] AS Total4, 
      Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=4 And DateDiff("yyyy",[Elèves].[DateNaiss],Date()) Between 10 And 16,1,Null)) AS _3eG, 
      Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=4 And DateDiff("yyyy",[Elèves].[DateNaiss],Date()) Between 10 And 16,1,Null)) AS _3eF, 
      [_3eG]+[_3eF] AS Total3, 
      Count(IIf([Elèves].[Sexe]=2 And DateDiff("yyyy",[Elèves].[DateNaiss],Date()) Between 10 And 16,1,Null)) AS TotalF, 
      Count(IIf([Elèves].[Sexe]=1 And DateDiff("yyyy",[Elèves].[DateNaiss],Date()) Between 10 And 16,1,Null)) AS TotalG, 
      [TotalF]+[TotalG] AS TotalGeneral
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY TypesClasses.filière, Elèves.inscrit
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
                    `;
      const sqlResult = await fetchFromMsAccess<IChp2_4[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_4) => {
        const items = _.omit(item, ["NiveauSerie", "CycleX"]);
        return {
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_5_effectif_premier_cycle_10_16ans`);
      return reject(err);
    }
  });
};

const chp3_etat_des_boursiers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=1 And [Elèves].[Bourse]="BE",1,Null)) AS _6eG, 
      Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=1 And [Elèves].[Bourse]="BE",1,Null)) AS _6eF, 
      [_6eG]+[_6eF] AS Total6, 
      Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=2 And [Elèves].[Bourse]="BE",1,Null)) AS _5eG, 
      Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=2 And [Elèves].[Bourse]="BE",1,Null)) AS _5eF, 
      [_5eG]+[_5eF] AS Total5,  
      Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=3 And [Elèves].[Bourse]="BE",1,Null)) AS _4eG, 
      Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=3 And [Elèves].[Bourse]="BE",1,Null)) AS _4eF, 
      [_4eG]+[_4eF] AS Total4, 
      Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=4 And [Elèves].[Bourse]="BE",1,Null)) AS _3eG, 
      Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=4 And [Elèves].[Bourse]="BE",1,Null)) AS _3eF, 
      [_3eG]+[_3eF] AS Total3, 
      [_6eG]+[_5eG]+[_4eG]+[_3eG] AS TotalG1ercycle, 
      [_6eF]+[_5eF]+[_4eF]+[_3eF] AS TotalF1ercycle, 
      [TotalG1ercycle]+[TotalF1ercycle] AS TotalGeneral1ercycle, 
      Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=5 And [Elèves].[Bourse]="BE",1,Null)) AS _2ndAG, 
      Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=5 And [Elèves].[Bourse]="BE",1,Null)) AS _2ndAF, 
      [_2ndAG]+[_2ndAF] AS Total2ndA, 
      Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=6 And [Elèves].[Bourse]="BE",1,Null)) AS _2ndCG, 
      Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=6 And [Elèves].[Bourse]="BE",1,Null)) AS _2ndCF, 
      [_2ndCG]+[_2ndCF] AS Total2ndC, 
      [TotalG1ercycle]+[_2ndCG]+[_2ndAG] AS TotalGarçon, 
      [TotalF1ercycle]+[_2ndCF]+[_2ndAF] AS TotalFille
FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
GROUP BY TypesClasses.filière, Elèves.inscrit
HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
UNION ALL
SELECT 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=1 And [Elèves].[Bourse]="1/2B",1,Null)) AS _6eG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=1 And [Elèves].[Bourse]="1/2B",1,Null)) AS _6eF, 
Count(IIf([TypesClasses].[RefTypeClasse]=1 And [Elèves].[Bourse]="1/2B",1,Null)) AS Total6, 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=2 And [Elèves].[Bourse]="1/2B",1,Null)) AS _5eG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=2 And [Elèves].[Bourse]="1/2B",1,Null)) AS _5eF, 
Count(IIf([TypesClasses].[RefTypeClasse]=2 And [Elèves].[Bourse]="1/2B",1,Null)) AS Total5, 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=3 And [Elèves].[Bourse]="1/2B",1,Null)) AS _4eG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=3 And [Elèves].[Bourse]="1/2B",1,Null)) AS _4eF, 
Count(IIf([TypesClasses].[RefTypeClasse]=3 And [Elèves].[Bourse]="1/2B",1,Null)) AS Total4, 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=4 And [Elèves].[Bourse]="1/2B",1,Null)) AS _3eG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=4 And [Elèves].[Bourse]="1/2B",1,Null)) AS _3eF, 
Count(IIf([TypesClasses].[RefTypeClasse]=4 And [Elèves].[Bourse]="1/2B",1,Null)) AS Total3, 
[_6eG]+[_5eG]+[_4eG]+[_3eG] AS TotalG1ercycle, [_6eF]+[_5eF]+[_4eF]+[_3eF] AS TotalF1ercycle, 
[TotalG1ercycle]+[TotalF1ercycle] AS TotalGeneral1ercycle, 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=5 And [Elèves].[Bourse]="1/2B",1,Null)) AS _2ndAG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=5 And [Elèves].[Bourse]="1/2B",1,Null)) AS _2ndAF, 
[_2ndAG]+[_2ndAF] AS Total2ndA, 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=6 And [Elèves].[Bourse]="1/2B",1,Null)) AS _2ndCG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=6 And [Elèves].[Bourse]="1/2B",1,Null)) AS _2ndCF, 
[_2ndCG]+[_2ndCF] AS Total2ndC, 
[TotalG1ercycle]+[_2ndCG]+[_2ndAG] AS TotalGarçon, 
[TotalF1ercycle]+[_2ndCF]+[_2ndAF] AS TotalFille
FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
GROUP BY TypesClasses.filière, Elèves.inscrit
HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));

UNION ALL 
SELECT 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=1 And [Elèves].[Bourse]="BE" And [Elèves].[Bourse]="1/2B",1,Null)) AS _6eG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=1 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS _6eF, 
Count(IIf([TypesClasses].[RefTypeClasse]=1 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS Total6, 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=2 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS _5eG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=2 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS _5eF, 
Count(IIf([TypesClasses].[RefTypeClasse]=2 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS Total5, 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=3 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS _4eG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=3 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS _4eF, 
Count(IIf([TypesClasses].[RefTypeClasse]=3 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS Total4, 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=4 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS _3eG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=4 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS _3eF, 
Count(IIf([TypesClasses].[RefTypeClasse]=4 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS Total3, 
[_6eG]+[_5eG]+[_4eG]+[_3eG] AS TotalG1ercycle, [_6eF]+[_5eF]+[_4eF]+[_3eF] AS TotalF1ercycle, 
[TotalG1ercycle]+[TotalF1ercycle] AS TotalGeneral1ercycle, 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=5 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS _2ndAG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=5 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS _2ndAF, 
[_2ndAG]+[_2ndAF] AS Total2ndA, 
Count(IIf([Elèves].[Sexe]=1 And [TypesClasses].[RefTypeClasse]=6 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS _2ndCG, 
Count(IIf([Elèves].[Sexe]=2 And [TypesClasses].[RefTypeClasse]=6 And [Elèves].[Bourse]="BE"And [Elèves].[Bourse]="1/2B",1,Null)) AS _2ndCF, 
[_2ndCG]+[_2ndCF] AS Total2ndC, 
[TotalG1ercycle]+[_2ndCG]+[_2ndAG] AS TotalGarçon, 
[TotalF1ercycle]+[_2ndCF]+[_2ndAF] AS TotalFille
FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
GROUP BY TypesClasses.filière, Elèves.inscrit
HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
                `;
      const sqlResult = await fetchFromMsAccess<IChp3[]>(sql, appCnx);
      const isEmpty = 
        {

          row1: [, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '',],
          row2: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '',],
          row3: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '',]
        };

      if (sqlResult.length === 0) return resolve([isEmpty]);

      // Remplacer la valeur 0 par vide en laissant les espaces intacts 
      const filterZero = (arr: number[]) => {
        return arr.map((value) => {
          return value === 0 ? '' : value.toString();
        });
      }
      const generateEmptyArray = (length: number) => new Array(length).fill(0);

      const row1 = sqlResult.length > 0 ? filterZero(Object.values(sqlResult[0])) : generateEmptyArray(23);
      const row2 = sqlResult.length > 1 ? filterZero(Object.values(sqlResult[1])) : generateEmptyArray(23);
      const row3 = sqlResult.length > 2 ? filterZero(Object.values(sqlResult[2])) : generateEmptyArray(23);
      const result = [{ row1, row2, row3 }];

      // console.log("🚀 ~ file: functions.ts:551 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp3_etat_des_boursiers`);
      return reject(err);
    }
  });
};

const chp4_1_pyramide_classe_physique = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, "Nombre de Classes" AS label, 
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
      `;
      const sqlResult = await fetchFromMsAccess<IChp2_4[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "",],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_4) => {
        const items = _.omit(item, ["NiveauSerie", "CycleX", "orderby", "label"]);
        return {
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_1_pyramide_classe_physique`);
      return reject(err);
    }
  });
};

const chp4_2_pyramide_classe_Pedagogique = () => {

  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, "Nombre de Classes" AS label, 
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
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_4[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "",],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_4) => {
        const items = _.omit(item, ["NiveauSerie", "CycleX", "orderby", "label"]);
        return {
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_2_pyramide_classe_Pedagogique`);
      return reject(err);
    }
  });
};


const chp5_1_personnel_administratif = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `

                `;
      const sqlResult = await fetchFromMsAccess<IChp3[]>(sql, appCnx);
      const isEmpty = 
        {

          row1: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
          row2: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
          row3: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        };

      if (sqlResult.length === 0) return resolve([isEmpty]);

      // Remplacer la valeur 0 par vide en laissant les espaces intacts 
      const filterZero = (arr: number[]) => {
        return arr.map((value) => {
          return value === 0 ? '' : value.toString();
        });
      }
      const generateEmptyArray = (length: number) => new Array(length).fill(0);

      const row1 = sqlResult.length > 0 ? filterZero(Object.values(sqlResult[0])) : generateEmptyArray(23);
      const row2 = sqlResult.length > 1 ? filterZero(Object.values(sqlResult[1])) : generateEmptyArray(23);
      const row3 = sqlResult.length > 2 ? filterZero(Object.values(sqlResult[2])) : generateEmptyArray(23);
      const result = [{ row1, row2, row3 }];

      resolve(result);
    } catch (err: any) {
      console.log(`err => chp3_etat_des_boursiers`);
      return reject(err);
    }
  });
};

const chp5_2_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=7,1,Null)) AS MathF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=8,1,Null)) AS PcF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=9,1,Null)) AS SvtF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=1,1,Null)) AS FrF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=2,1,Null)) AS PhilF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=5,1,Null)) AS AllF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=6,1,Null)) AS EspF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=3,1,Null)) AS HgF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=4,1,Null)) AS AngF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=12,1,Null)) AS EpsF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=13,1,Null)) AS EdhcF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=10,1,Null)) AS ApF, Count(IIf([Personnel].[Sexe]="F" And [Matières].[RefMatière]=15,1,Null)) AS InforF, [MathF]+[PcF]+[SvtF]+[FrF]+[PhilF]+[AllF]+[EspF]+[HgF]+[AngF]+[EpsF]+[EdhcF]+[ApF]+[inforF] AS TotalF
FROM Fonction INNER JOIN (Matières INNER JOIN Personnel ON Matières.RefMatière = Personnel.RefMatière) ON Fonction.RefFonction = Personnel.Fonction
GROUP BY Fonction.RefFonction
HAVING (((Fonction.RefFonction)=6));
      UNION ALL 
      SELECT Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=7,1,Null)) AS MathF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=8,1,Null)) AS PcF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=9,1,Null)) AS SvtF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=1,1,Null)) AS FrF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=2,1,Null)) AS PhilF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=5,1,Null)) AS AllF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=6,1,Null)) AS EspF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=3,1,Null)) AS HgF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=4,1,Null)) AS AngF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=12,1,Null)) AS EpsF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=13,1,Null)) AS EdhcF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=10,1,Null)) AS ApF, Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Matières].[RefMatière]=15,1,Null)) AS InforF, [MathF]+[PcF]+[SvtF]+[FrF]+[PhilF]+[AllF]+[EspF]+[HgF]+[AngF]+[EpsF]+[EdhcF]+[ApF]+[inforF] AS TotalF
FROM Fonction INNER JOIN (Matières INNER JOIN Personnel ON Matières.RefMatière = Personnel.RefMatière) ON Fonction.RefFonction = Personnel.Fonction
GROUP BY Fonction.RefFonction
HAVING (((Fonction.RefFonction)=6));
      UNION ALL 
      SELECT Count(IIf([Matières].[RefMatière]=7,1,Null)) AS MathF, Count(IIf([Matières].[RefMatière]=8,1,Null)) AS PcF, Count(IIf([Matières].[RefMatière]=9,1,Null)) AS SvtF, Count(IIf([Matières].[RefMatière]=1,1,Null)) AS FrF, Count(IIf([Matières].[RefMatière]=2,1,Null)) AS PhilF, Count(IIf([Matières].[RefMatière]=5,1,Null)) AS AllF, Count(IIf([Matières].[RefMatière]=6,1,Null)) AS EspF, Count(IIf([Matières].[RefMatière]=3,1,Null)) AS HgF, Count(IIf([Matières].[RefMatière]=4,1,Null)) AS AngF, Count(IIf([Matières].[RefMatière]=12,1,Null)) AS EpsF, Count(IIf([Matières].[RefMatière]=13,1,Null)) AS EdhcF, Count(IIf([Matières].[RefMatière]=10,1,Null)) AS ApF, Count(IIf([Matières].[RefMatière]=15,1,Null)) AS InforF, [MathF]+[PcF]+[SvtF]+[FrF]+[PhilF]+[AllF]+[EspF]+[HgF]+[AngF]+[EpsF]+[EdhcF]+[ApF]+[inforF] AS TotalF
FROM Fonction INNER JOIN (Matières INNER JOIN Personnel ON Matières.RefMatière = Personnel.RefMatière) ON Fonction.RefFonction = Personnel.Fonction
GROUP BY Fonction.RefFonction
HAVING (((Fonction.RefFonction)=6));
`;
      const sqlResult = await fetchFromMsAccess<IChp5_2[]>(sql, appCnx);
      const isEmpty = 
        {
          row1: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
          row2: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
          row3: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const filterZero = (arr: number[]) => {
        return arr.map((value) => {
          return value === 0 ? '' : value.toString();
        });
      }
      const generateEmptyArray = (length: number) => new Array(length).fill(0);
      const row1 = sqlResult.length > 0 ? filterZero(Object.values(sqlResult[0])) : generateEmptyArray(15);
      const row2 = sqlResult.length > 1 ? filterZero(Object.values(sqlResult[1])) : generateEmptyArray(15);
      const row3 = sqlResult.length > 2 ? filterZero(Object.values(sqlResult[2])) : generateEmptyArray(15);
      const result = [{ row1, row2, row3 }];
      // console.log("🚀 ~ file: functions.ts:762 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp5_2_personnel_enseignant`);
      return reject(err);
    }
  });
};

const chp5_3_statistique_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Count(IIf([Personnel].[Sexe]="F" And [Personnel].[RefTypePers]=3 And [Personnel].[Matricule] Is Null,1,Null)) AS PrivePermanent, 
      Count(IIf([Personnel].[Sexe]="F" And [Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=2,1,Null)) AS VacatairePrives, 
      Count(IIf([Personnel].[Sexe]="F" And [Personnel].[Matricule] Is Not Null And [Personnel].[RefTypePers]=2,1,Null)) AS VacataireFonct, 
      [PrivePermanent]+[VacatairePrives]+[VacataireFonct] AS Total, Count(IIf([Personnel].[Sexe]="F" And [Personnel].[N°AutEnseigner] Is Not Null,1,Null)) AS Autorisation, 
      Count(IIf([Personnel].[Sexe]="F" And [Personnel].[N°CNPS] Is Not Null,1,Null)) AS NumCnps
      FROM (Fonction INNER JOIN (Matières INNER JOIN Personnel ON Matières.RefMatière = Personnel.RefMatière) ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome
      GROUP BY Fonction.RefFonction
      HAVING (((Fonction.RefFonction)=6));
      UNION ALL 
      SELECT 
      Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Personnel].[RefTypePers]=3 And [Personnel].[Matricule] Is Null,1,Null)) AS PrivePermanent, 
      Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=2,1,Null)) AS VacatairePrives, 
      Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Personnel].[Matricule] Is Not Null And [Personnel].[RefTypePers]=2,1,Null)) AS VacataireFonct, 
      [PrivePermanent]+[VacatairePrives]+[VacataireFonct] AS Total, 
      Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Personnel].[N°AutEnseigner] Is Not Null,1,Null)) AS Autorisation, 
      Count(IIf(([Personnel].[Sexe]="M" Or [Personnel].[Sexe]=" ") And [Personnel].[N°CNPS] Is Not Null,1,Null)) AS NumCnps
      FROM (Fonction INNER JOIN (Matières INNER JOIN Personnel ON Matières.RefMatière = Personnel.RefMatière) ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome
      GROUP BY Fonction.RefFonction
      HAVING (((Fonction.RefFonction)=6))
      UNION ALL 
      SELECT 
      Count(IIf([Personnel].[RefTypePers]=3 And [Personnel].[Matricule] Is Null,1,Null)) AS PrivePermanent, 
      Count(IIf([Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=2,1,Null)) AS VacatairePrives, 
      Count(IIf([Personnel].[Matricule] Is Not Null And [Personnel].[RefTypePers]=2,1,Null)) AS VacataireFonct, 
      [PrivePermanent]+[VacatairePrives]+[VacataireFonct] AS Total, 
      Count(IIf([Personnel].[N°AutEnseigner] Is Not Null,1,Null)) AS Autorisation, 
      Count(IIf([Personnel].[N°CNPS] Is Not Null,1,Null)) AS NumCnps
      FROM (Fonction INNER JOIN (Matières INNER JOIN Personnel ON Matières.RefMatière = Personnel.RefMatière) ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome
      GROUP BY Fonction.RefFonction
      HAVING (((Fonction.RefFonction)=6))
      `;
      const sqlResult = await fetchFromMsAccess<IChp5_2[]>(sql, appCnx);
      const isEmpty = 
        {
          row1: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
          row2: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
          row3: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      // Remplacer la valeur 0 par vide en laissant les espaces intacts 
      const filterZero = (arr: number[]) => {
        return arr.map((value) => {
          return value === 0 ? '' : value.toString();
        });
      }
      const generateEmptyArray = (length: number) => new Array(length).fill(0);
      const row1 = sqlResult.length > 0 ? filterZero(Object.values(sqlResult[0])) : generateEmptyArray(15);
      const row2 = sqlResult.length > 1 ? filterZero(Object.values(sqlResult[1])) : generateEmptyArray(15);
      const row3 = sqlResult.length > 2 ? filterZero(Object.values(sqlResult[2])) : generateEmptyArray(15);
      const result = [{ row1, row2, row3 }];
      // console.log("🚀 ~ file: functions.ts:763 ~ returnnewPromise ~ result:", result)

      resolve(result);
    } catch (err: any) {
      console.log(`err => chp5_2_personnel_enseignant`);
      return reject(err);
    }
  });
};

// ce tableau n'est pas encore cree dans SPIDER
const chp6_2_1_activites_des_unites_pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         ' ' AS Discipline,
         ' ' AS DatePeriode,
         ' ' AS TypeActivite, 
         ' ' AS Animateur
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp6_2_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp6_2_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Discipline),
          c2: nv(item.DatePeriode),
          c3: nv(item.TypeActivite),
          c4: nv(item.Animateur),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp6_2_1_activites_des_unites_pedagogiques`
      );
      return reject(err);
    }
  });
};

// ce tableau n'est pas encore cree dans SPIDER
const chp6_2_2_1_liste_responsable_des_conseils_enseignement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         ' ' AS Discipline,
         ' ' AS Responsable,
         ' ' AS AutorisationEnseig,
         ' ' AS Contact
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp6_2_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp6_2_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Discipline),
          c2: nv(item.Responsable),
          c3: nv(item.AutorisationEnseig),
          c4: nv(item.Contact),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp6_2_2_1_activites_des_conseils_enseignement`
      );
      return reject(err);
    }
  });
};

// ce tableau n'est pas encore cree dans SPIDER
const chp6_2_2_2_activites_des_conseils_enseignement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         ' ' AS Discipline,
         ' ' AS DatePeriode,
         ' ' AS TypeActivite,
         ' ' AS Animateur
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp6_2_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp6_2_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Discipline),
          c2: nv(item.DatePeriode),
          c3: nv(item.TypeActivite),
          c4: nv(item.Animateur),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp6_2_2_2_activites_des_conseils_enseignement`
      );
      return reject(err);
    }
  });
};


const chp6_3_1_visite_directeur_etudes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=7,1,Null)) AS VisiteMath, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=8,1,Null)) AS VisitePC, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=9,1,Null)) AS VisiteSvt, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=1,1,Null)) AS VisiteFr, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=3,1,Null)) AS VisiteHg, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=2,1,Null)) AS VisitePhil, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=5,1,Null)) AS VisiteAll, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=6,1,Null)) AS VisiteEsp, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=4,1,Null)) AS VisiteAng, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=12,1,Null)) AS VisiteEps, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=13,1,Null)) AS VisiteEdhc, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=11,1,Null)) AS VisiteMus, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=21,1,Null)) AS VisiteRelig, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=10,1,Null)) AS VisiteAp, 
      Count(IIf([tbl_visit].[id_visiteur]=71 And [tbl_visit].[id_mat]=15,1,Null)) AS VisiteInf, 
      [VisiteMath]+[VisitePC]+[VisiteSvt]+[VisiteFr]+[VisiteHg]+[VisitePhil]+[VisiteAll]+[VisiteEsp]+[VisiteAng]+[VisiteEps]+[VisiteEdhc]+[VisiteMus]+[VisiteRelig]+[VisiteAp]+[VisiteInf] AS Total
FROM Matières INNER JOIN tbl_visit ON Matières.RefMatière = tbl_visit.id_mat;
      `;
      const sqlResult = await fetchFromMsAccess<IChp5_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      // Remplacer la valeur 0 par vide en laissant les espaces intacts 
      const filterZero = (arr: number[]) => {
        return arr.map((value) => {
          return value === 0 ? '' : value.toString();
        });
      }
      const generateEmptyArray = (length: number) => new Array(length).fill(0);
      const row1 = sqlResult.length > 0 ? filterZero(Object.values(sqlResult[0])) : generateEmptyArray(16);
      const result = [{ row1 }];
      // console.log("🚀 ~ file: functions.ts:933 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp5_2_personnel_enseignant`);
      return reject(err);
    }
  });
};

const chp7_1_resultats_des_eleves_affectes_et_non = () => {
  return new Promise(async (resolve, reject) => {
    try {

      let sql = `
      SELECT Niveaux.RefNiveau, 
      TypesClasses.RefTypeClasse AS RefTypeClasse, 
      [NiveauCourt] & "" & [Série] AS NiveauSerie, 
      Elèves.Sexe, 
      IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, 
      "#FFFF" AS bg, 
      (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle"))
      ORDER BY 2, 3, 4;
              UNION ALL 
              SELECT Niveaux.RefNiveau, 
              TypesClasses.RefTypeClasse AS RefTypeClasse, 
              [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, 
              "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
              HAVING ((("T")<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle"))
              ORDER BY 1, 2, 3, 4;
                            
              UNION ALL
              SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, 
              IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, 
              "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
              GROUP BY Elèves.Sexe
              HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
              ORDER BY 1, 2, 3, 4;                            
            
              UNION ALL
              SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
              HAVING ((("T")<>""))
              ORDER BY 1, 2, 3, 4;
                            
              UNION ALL
              SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING (((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle"))
ORDER BY 1, 2, 3, 4;

              UNION ALL
              SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((("T")<>"") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle"))
ORDER BY 1, 2, 3, 4;

              UNION ALL
              SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle"))
GROUP BY Niveaux.RefNiveau, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F",""))
HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
ORDER BY 1, 2, 3, 4;

              UNION ALL
              SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle"))
GROUP BY Niveaux.RefNiveau, "T"
HAVING ((("T")<>""))
ORDER BY 1, 2, 3, 4;

              UNION ALL
              SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
              GROUP BY Elèves.Sexe
              HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
              ORDER BY 1, 2, 3, 4;
                            
              UNION ALL 
SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse  BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
              HAVING ((("T")<>""))
              ORDER BY 1, 2, 3, 4;                   
UNION ALL
SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Elèves.Sexe, TypesClasses.filière, Elèves.inscrit
HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY 1, 2, 3, 4;

UNION ALL
SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY TypesClasses.filière, Elèves.inscrit
HAVING ((("T")<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY 1, 2, 3, 4;
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_b[]>(sql, appCnx);
      const isEmpty = {
        bg: "",
        label: "",
        cols: [
          {
            genre: "",
            nbre: "",
            col: ["", "", "", "", "", "", "", "", "", ""],
          }]
      }
      if (sqlResult.length === 0 || sqlResult.length === 2) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_b) => {
        const items = _.omit(item, ["RefNiveau", "RefTypeClasse", "NiveauSerie", "Sexe", "label", "Genre", "bg", "NbreClasses"]);
        return {
          bg: item.bg,
          label: item.NiveauSerie,
          cols: [
            {
              genre: item.Genre,
              nbre: item.NbreClasses,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const result = functions_main.formatGroupeByLabel(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_b_tableaux_statistiqures_des_resultats_2e_trimestre`);
      return reject(err);
    }
  });
};

const chp7_2_resultats_des_eleves_affectes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle") AND ((Elèves.StatutElève)=1))
      ORDER BY 2, 3, 4;
            UNION ALL 
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.StatutElève
      HAVING ((("T")<>"") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING (((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
          SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=1))
      GROUP BY Niveaux.RefNiveau, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F",""))
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=1))
      GROUP BY Niveaux.RefNiveau, "T"
      HAVING ((("T")<>""))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL 
            SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse  BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.StatutElève
      HAVING ((("T")<>"") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
           SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Elèves.Sexe, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
          SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
                 `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_b[]>(sql, appCnx);

      const isEmpty = {
        bg: "",
        label: "",
        cols: [
          {
            genre: "",
            nbre: "",
            col: ["", "", "", "", "", "", "", "", "", ""],
          }]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_b) => {
        const items = _.omit(item, ["RefNiveau", "RefTypeClasse", "NiveauSerie", "Sexe", "label", "Genre", "bg", "NbreClasses"]);
        return {
          bg: item.bg,
          label: item.NiveauSerie,
          cols: [
            {
              genre: item.Genre,
              nbre: item.NbreClasses,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const result = await functions_main.formatGroupeByLabel(contentsArray);
      // console.log("result.chp1_B_1_1 ... ", JSON.stringify(result[0]));
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_1_tableaux_statistiques_des_resultats_scolaire_par_niveau`);
      return reject(err);
    }
  });
};

const chp7_3_resultats_des_eleves_non_affectes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle") AND ((Elèves.StatutElève)=2))
      ORDER BY 2, 3, 4;
            UNION ALL 
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.StatutElève
      HAVING ((("T")<>"") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING (((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
          SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=2))
      GROUP BY Niveaux.RefNiveau, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F",""))
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=2))
      GROUP BY Niveaux.RefNiveau, "T"
      HAVING ((("T")<>""))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL 
            SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse  BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.StatutElève
      HAVING ((("T")<>"") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
           SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Elèves.Sexe, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
          SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
                 `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_b[]>(sql, appCnx);

      const isEmpty = {
        bg: "",
        label: "",
        cols: [
          {
            genre: "",
            nbre: "",
            col: ["", "", "", "", "", "", "", "", "", ""],
          }]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_b) => {
        const items = _.omit(item, ["RefNiveau", "RefTypeClasse", "NiveauSerie", "Sexe", "label", "Genre", "bg", "NbreClasses"]);
        return {
          bg: item.bg,
          label: item.NiveauSerie,
          cols: [
            {
              genre: item.Genre,
              nbre: item.NbreClasses,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const result = await functions_main.formatGroupeByLabel(contentsArray);
      // console.log("result.chp1_B_1_1 ... ", JSON.stringify(result[0]));
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_1_tableaux_statistiques_des_resultats_scolaire_par_niveau`);
      return reject(err);
    }
  });
};

const chp7_4_liste_nominative_eleve = () => {
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
      SELECT 
      Classes.OrdreClasse,
      Niveaux.RefNiveau AS OrderBy,
      Classes.RefClasse, 
      Classes.ClasseLong, 
      Classes.ClasseCourt, Elèves.MatriculeNational, 
      Elèves.NomElève AS NomEleve, Elèves.PrénomElève AS PrenomEleve, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),
      IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
      IIf([Classes].[LV2]="Aucune","",
      IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2, 
      Elèves.LV2 AS Lang, 
      T_Notes.MOYG2 AS MoyG2, 
      Notes.RangG2, 
      '' AS Distinction, 
      (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, 
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, '' AS NumDeciAffect, 
      IIf(IsNull([Elèves].[Obs]),"",[Elèves].[Obs]) AS Obs, 
      (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ, 
      TypesClasses.RefTypeClasse, 
      Elèves.StatutElève
      FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.inscrit)=True))
      ORDER BY Classes.OrdreClasse, Niveaux.RefNiveau, Classes.RefClasse, [NomElève] & " " & [PrénomElève];
      `;
      const sqlResult2 = await fetchFromMsAccess<IChp_A_2_2[]>(sql2, appCnx);
      // console.log("🚀 ~ file: functions.ts:1358 ~ returnnewPromise ~ sqlResult2:", sqlResult1)
      if (sqlResult1.length === 0) return resolve([
        {
          label: '',
          obj: {classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);
      const resultat = functions_main.fusionnerTableaux(sqlResult1,sqlResult2,'MoyG2')
      const contentsArray = resultat.map((item: IChp_A_2_2, i: number) => {
        return {
          c1: nv(item.NomEleve),
          c2: nv(item.PrenomEleve),
          c3: nv(item.Genre),
          c4: nv(item.DateNaiss),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.StatutEleve),
          c8: nv(item.Lang2),
          c9:  nv(item.MoyG2),
          c10: nv(item.RangG2),
          c11: nv(item.Distinction),
          c12: nv(item.Appreciations),
          label:item.ClasseLong,
          obj:{
            classeLong: item.ClasseLong,
            pp: nv(item.ProfP),
            educ: nv(item.Educ),
          },
        };
  });
    // console.log("contentsArray ...", contentsArray)
    const result = functions_main.groupLabelByGroup(contentsArray);
    // console.log("🚀 ~ file: functions.ts:1390 ~ returnnewPromise ~ result++++:", result)
    // console.log("result.chp1_B_2 ...",JSON.stringify(result[0]))
    resolve(result);
    } catch (err: any) {
      console.log(`err => chp7_4_liste_nominative_eleve`);
      return reject(err);
    }
  });
};

const chp7_5_liste_major_classe_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]) AS RefTypeClasse, 
      T_Notes.MOYG2 AS MoyG2, 
      IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",[NiveauCourt] & " " & [Série]) AS NiveauSerie, 
      Niveaux.NiveauCourt, 
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(DateNaiss,"Short Date") AS DateNais, Int((Date()-[DateNaiss])/365.5) AS Age, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),
      IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
      IIf([Classes].[LV2]="Aucune","",
      IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2, 
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      " " AS NumDeciAffect, 
      Notes.RangG2, 
      IIf(IsNull([Elèves].[Obs]),"",[Elèves].[Obs]) AS Obs
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]))<14) AND ((Notes.RangG2) Like '1%*') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]), T_Notes.MOYG2 DESC , IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",[NiveauCourt] & " " & [Série]), Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];      `;
      const sqlResult = await fetchFromMsAccess<IChp7_4_4[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);

     // 1. je recupere les occurences distinctes des refTypeClasse
    //  retourne un seul  ReftypyClasse pour un niveau dans le data
     const distinctRefTypeClasse = _.uniqBy(sqlResult, "RefTypeClasse") as IChp7_4_4[];
     // 2. je parcours les differents RefTypeClasse
     let result1 = [];
     distinctRefTypeClasse.map(x  => {
       // je recupere les élèves du niveau pour chaque RefTypeClasse puis je choisis les 3 premiers objet du tableau
       const currentTypeClasseStudents = sqlResult.filter(student => student.RefTypeClasse === x.RefTypeClasse)
       const troisMajors = currentTypeClasseStudents.slice(0, 3) // je prends de 0 à 3 (non inclus)
       result1 = result1.concat(troisMajors)
      });

      const contentsArray = result1.map((item: IChp7_4_4, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNais),
          c4: nv(item.Genre),
          c5: nv(item.StatutEleve),
          c6: nv(item.Redoub),
          c7: nv(item.Nationalite),
          c8: nv(item.Obs),
          // c12: nv(item.ClasseCourt),
          label:item.NiveauSerie,
          obj:{label:item.NiveauSerie},
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup(contentsArray);
    //  console.log("result.chp1_B_3 ...",JSON.stringify(result[0]))
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_3_liste_major_classe_par_niveau`);
      return reject(err);
    }
  });
};


const chp7_6_1_resultat_probables_aux_examens_bepc = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql =`
      SELECT 
Niveaux.RefNiveau, 
IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX1, 
[NiveauCourt] & " " & [Série] AS CycleX, 

Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS InscritGarçon, 
Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS InscritFille, 
[InscritGarçon]+[InscritFille] AS TotalInscrit, 

Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=1 And [Nat]="70",1,Null)) AS PresentGarçon,
Count(IIf([Elèves].[AbsExamBlanc]=0 And [SEXE]=2 And [Nat]="70",1,Null)) AS PresentFille, 
[PresentGarçon]+[PresentFille] AS TotalPresent, 

Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=1 And [Nat]="70",1,Null)) AS AdmisGarçon, 
Count(IIf([Elèves].[AdmisExamBlanc]<>0 And [SEXE]=2 And [Nat]="70",1,Null)) AS AdmisFille, 
[AdmisFille]+[AdmisGarçon] AS TotalAdmis, 

IIf([PresentFille]=0,0,Round([AdmisFille]/[PresentFille]*100,2)) AS TauxAdmisFille,
IIf([PresentGarçon]=0,0,Round([AdmisGarçon]/[PresentGarçon]*100,2)) AS TauxAdmisGarçon,
IIf([TotalPresent]=0,0,Round([TotalAdmis]/[TotalPresent]*100,2)) AS TauxAdmis

FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série]
HAVING (((Niveaux.RefNiveau)=4));
`;
      const sqlResult = await fetchFromMsAccess<IChp7_6_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp7_6_1) => {
        return {
          c1: nv(item.InscritFille),
          c2: nv(item.InscritGarçon),
          c3: nv(item.TotalInscrit),
          c4: nv(item.PresentFille),
          c5: nv(item.PresentGarçon),
          c6: nv(item.TotalPresent),
          c7: nv(item.AdmisFille),
          c8: nv(item.AdmisGarçon),
          c9: nv(item.TotalAdmis),
          c10:`${nv(item.TauxAdmisFille)}%`,
          c11:`${nv(item.TauxAdmisGarçon)}%`,
          c12:`${nv(item.TauxAdmis)}%`,
        };
      });
      // console.log("🚀 ~ returnnewPromise ~ contentsArray:", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp7_6_1_resultat_probables_aux_examens_bepc`);
      return reject(err);
    }
  });
};


const chp7_6_2_resultat_probables_aux_examens_bac = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql =`
      SELECT Niveaux.RefNiveau, [NiveauCourt] & " " & [Série] AS Serie, 
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
FROM ((Niveaux 
        INNER JOIN (TypesClasses 
        INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) 
        ON Niveaux.RefNiveau = TypesClasses.Niveau) 
        INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) 
        INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, [NiveauCourt] & " " & [Série], TypesClasses.Niveau, TypesClasses.RefTypeClasse
HAVING (((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)=10 OR (TypesClasses.RefTypeClasse)=12));
`;
      const sqlResult = await fetchFromMsAccess<IChp7_6_1[]>(sql, appCnx);
      console.log("🚀 ~ returnnewPromise ~ sqlResult:", sqlResult)
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp7_6_1) => {
        return {
          c1: nv(item.InscritFille),
          c2: nv(item.InscritGarçon),
          c3: nv(item.TotalInscrit),
          c4: nv(item.PresentFille),
          c5: nv(item.PresentGarçon),
          c6: nv(item.TotalPresent),
          c7: nv(item.AdmisFille),
          c8: nv(item.AdmisGarçon),
          c9: nv(item.TotalAdmis),
          c10:`${nv(item.TauxAdmisFille)}%`,
          c11:`${nv(item.TauxAdmisGarçon)}%`,
          c12:`${nv(item.TauxAdmis)}%`,
        };
      });
      const resultat = functions_main.reformatResult(contentsArray)
      console.log("🚀 ~ returnnewPromise ~ resultat-----:", resultat)
      resolve(resultat);
    } catch (err: any) {
      console.log(`err => chp7_6_2_resultat_probables_aux_examens_bac`);
      return reject(err);
    }
  });
};

const chp8_cas_sociaux = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=1,1,Null)) AS _6e, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=2,1,Null)) AS _5e, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=3,1,Null)) AS _4e, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=4,1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (5,6),1,Null)) AS _2nd, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle, 
      Val([_2nd]+[_1ere]+[_Tle]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN tbl_cs_grossesse ON Elèves.RefElève = tbl_cs_grossesse.RefElève
WHERE (((Elèves.Inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Sexe)=2));
UNION ALL 
SELECT 
Count(IIf([tbl_cs_maladie].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=1,1,Null)) AS _6e, 
Count(IIf([tbl_cs_maladie].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=2,1,Null)) AS _5e, 
Count(IIf([tbl_cs_maladie].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=3,1,Null)) AS _4e, 
Count(IIf([tbl_cs_maladie].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=4,1,Null)) AS _3e, 
Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
Count(IIf([tbl_cs_maladie].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (5,6),1,Null)) AS _2nd, 
Count(IIf([tbl_cs_maladie].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere, 
Count(IIf([tbl_cs_maladie].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle, 
Val([_2nd]+[_1ere]+[_Tle]) AS ST2, 
[ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN tbl_cs_maladie ON Elèves.RefElève = tbl_cs_maladie.RefElève
WHERE (((Elèves.Inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Sexe)=2));
UNION ALL 
SELECT 
Count(IIf([tbl_cs_abandon].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=1,1,Null)) AS _6e, 
Count(IIf([tbl_cs_abandon].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=2,1,Null)) AS _5e, 
Count(IIf([tbl_cs_abandon].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=3,1,Null)) AS _4e, 
Count(IIf([tbl_cs_abandon].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=4,1,Null)) AS _3e, 
Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
Count(IIf([tbl_cs_abandon].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (5,6),1,Null)) AS _2nd, 
Count(IIf([tbl_cs_abandon].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere, 
Count(IIf([tbl_cs_abandon].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle, 
Val([_2nd]+[_1ere]+[_Tle]) AS ST2, 
[ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN tbl_cs_abandon ON Elèves.RefElève = tbl_cs_abandon.RefElève
WHERE (((Elèves.Inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Sexe)=2));
UNION ALL
SELECT 
Count(IIf([tbl_cs_handicap].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=1,1,Null)) AS _6e, 
Count(IIf([tbl_cs_handicap].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=2,1,Null)) AS _5e, 
Count(IIf([tbl_cs_handicap].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=3,1,Null)) AS _4e, 
Count(IIf([tbl_cs_handicap].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=4,1,Null)) AS _3e, 
Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
Count(IIf([tbl_cs_handicap].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (5,6),1,Null)) AS _2nd, 
Count(IIf([tbl_cs_handicap].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere, 
Count(IIf([tbl_cs_handicap].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle, 
Val([_2nd]+[_1ere]+[_Tle]) AS ST2, 
[ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN tbl_cs_handicap ON Elèves.RefElève = tbl_cs_handicap.RefElève
WHERE (((Elèves.Inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Sexe)=2));
UNION ALL
SELECT 
Count(IIf([tbl_cs_deces].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=1,1,Null)) AS _6e, 
Count(IIf([tbl_cs_deces].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=2,1,Null)) AS _5e, 
Count(IIf([tbl_cs_deces].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=3,1,Null)) AS _4e, 
Count(IIf([tbl_cs_deces].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=4,1,Null)) AS _3e, 
Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
Count(IIf([tbl_cs_deces].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (5,6),1,Null)) AS _2nd, 
Count(IIf([tbl_cs_deces].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere, 
Count(IIf([tbl_cs_deces].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle, 
Val([_2nd]+[_1ere]+[_Tle]) AS ST2, 
[ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN tbl_cs_deces ON Elèves.RefElève = tbl_cs_deces.RefElève
WHERE (((Elèves.Inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Sexe)=2));
      `;
      const sqlResult = await fetchFromMsAccess<IChp5_2[]>(sql, appCnx);
      const isEmpty = 
        {
          row1: ['', '', '', '', '', '', '', '', '', ''],
          row2: ['', '', '', '', '', '', '', '', '', ''],
          row3: ['', '', '', '', '', '', '', '', '', '',],
          row4: ['', '', '', '', '', '', '', '', '', '',],
          row5: ['', '', '', '', '', '', '', '', '', '',],
        };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      // Remplacer la valeur 0 par vide en laissant les espaces intacts 
      const filterZero = (arr: number[]) => {
        return arr.map((value) => {
          return value === 0 ? '' : value.toString();
        });
      }
      const generateEmptyArray = (length: number) => new Array(length).fill(0);
      const row1 = sqlResult.length > 0 ? filterZero(Object.values(sqlResult[0])) : generateEmptyArray(15);
      const row2 = sqlResult.length > 1 ? filterZero(Object.values(sqlResult[1])) : generateEmptyArray(15);
      const row3 = sqlResult.length > 2 ? filterZero(Object.values(sqlResult[2])) : generateEmptyArray(15);
      const row4 = sqlResult.length > 3 ? filterZero(Object.values(sqlResult[3])) : generateEmptyArray(15);
      const row5 = sqlResult.length > 4 ? filterZero(Object.values(sqlResult[4])) : generateEmptyArray(15);
      const result = [{row1,row2,row3,row4,row5}];

      resolve(result);
    } catch (err: any) {
      console.log(`err => chp8_cas_sociaux`);
      return reject(err);
    }
  });
};

/////////////////////////////////////////////////

//*** fin rapport1  ***
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
      const page_1 = await pageGarde();
      const identite = await Identite();
      const chp2_1 = await chp2_1_effectif_eleves_affect_et_non_affect();
      const chp2_2 = await chp2_2_effectif_eleves_affectes();
      const chp2_3 = await chp2_3_repartition_des_eleves_par_annee_de_naissance();
      const chp2_4 = await chp2_4_effectif_par_nationalite_avec_approche_genre();
      const chp2_5 = await chp2_5_effectif_premier_cycle_10_16ans();
      const chp3 = await chp3_etat_des_boursiers();
      const chp4_1 = await chp4_1_pyramide_classe_physique();
      const chp4_2 = await chp4_2_pyramide_classe_Pedagogique();
      const chp5_2 = await chp5_2_personnel_enseignant();
      const chp5_3 = await chp5_3_statistique_personnel_enseignant();
      const chp6_2_1 = await chp6_2_1_activites_des_unites_pedagogiques();
      const chp6_2_2_1 = await chp6_2_2_1_liste_responsable_des_conseils_enseignement();
      const chp6_2_2_2 = await chp6_2_2_2_activites_des_conseils_enseignement();
      const chp6_3_1 = await chp6_3_1_visite_directeur_etudes();
      const chp7_1 = await chp7_1_resultats_des_eleves_affectes_et_non();
      const chp7_2 = await chp7_2_resultats_des_eleves_affectes();
      const chp7_3 = await chp7_3_resultats_des_eleves_non_affectes();
      // const chp7_4_1 = await chp7_4_liste_nominative_eleve("=1");//Elèves affectés
      // const chp7_4_2 = await chp7_4_liste_nominative_eleve("=2");//Elèves non affectés
      const chp7_4_3 = await chp7_4_liste_nominative_eleve();//Elèves affectés et non affectés
      const chp7_5 = await chp7_5_liste_major_classe_par_niveau()
      const chp7_6_1 = await chp7_6_1_resultat_probables_aux_examens_bepc()
      const chp7_6_2 = await chp7_6_2_resultat_probables_aux_examens_bac()
      const chp8 = await chp8_cas_sociaux()

      const result = {
        ...data,
        name_report: "prive_secondairegeneral_issia_2trimestre",
        path_report: "prive/secondaire-general/issia",
        ...page_1,
        identite,
        anscol1,
        nometab,
        codeetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        drencomplet,
        chp2_1,
        chp2_2,
        chp2_3,
        chp2_4,
        chp2_5,
        chp3,
        chp4_1,
        chp4_2,
        chp5_2,
        chp5_3,
        chp6_2_1,
        chp6_2_2_1,
        chp6_2_2_2,
        chp6_3_1,
        chp7_1,
        chp7_2,
        chp7_3,
        // chp7_4_1,
        // chp7_4_2,
        chp7_4_3,
        chp7_5,
        chp7_6_1,
        chp7_6_2,
        chp8
      };
      console.log("🚀 ~ file: functions.ts:1490 ~ returnnewPromise ~ result:", result.chp7_6_2)
      resolve(result);
    } catch (err: any) {
      return reject(err);
    }
  });
};



export default {
  rapport,
};
