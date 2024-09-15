import { _selectSql } from "../../../../../../databases/index";
import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../../../../../../databases/accessDB";
import {
  IChp,
  IChp1_11,
  IChp1_12_B,
  IChp1_12_A,
  IChp1_3,
  IChp1_4_a,
  IChp1_5,
  IChp1_6,
  IChp1_7_1,
  IChp1_8,
  IChp1_9,
  IChp1_educateur,
  IChp1_identification,
} from "./interfaces";

import functions_main from "../../../utils";

const _ = require("lodash");
const bg = { c1: "#E3E3E3", c2: "#ffcdd2" };
const pathDir = "./spider-rapport";

/**
 * Remplacer la valeur null par vide
 * @param data
 * @returns
 */

const nv = (data: any) => {
  return data === null || data === "null" ? "" : data;
};

/**
 * Remplacer la valeur undefined ou null par 0
 * @param data
 * @returns
 */
const nz = (data: any) => {
  return data === undefined || data === null ? 0 : data;
};

//*********************** debut chapitre  ***************
const chp1_identification = (RefFonction: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
          SELECT 
          Fonction.RefFonction, 
          Fonction.Fonction, 
          Corps.NomCorps, 
          [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
          Personnel.GradeActuel, 
          Personnel.TélPers AS Contact, 
          Personnel.CelPers, 
          Personnel.Quartier
         FROM Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps
         WHERE Fonction.RefFonction=${RefFonction};
                `;
      const sqlResult = await fetchFromMsAccess<IChp1_identification[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp1_identification) => {
        return {
          NomComplet: nv(item.NomComplet),
          NomCorps: nv(item.NomCorps),
          GradeActuel: nv(item.GradeActuel),
          Fonction: nv(item.Fonction),
          Contact: nv(item.Contact),
          CelPers: nv(item.CelPers),
          Quartier: nv(item.Quartier),
        };
      });
      // console.log("contentsArray.chp1_identification...", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chef_etablissement`);
      return reject(err);
    }
  });
}



const chp1_1_educateur = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Count(*) AS nbreEduc
      FROM (SELECT 
      Personnel.RefPersonnel, 
      Personnel.NomPers, 
      Personnel.PrénomPers, 
      Personnel.Fonction, 
      Fonction.FonctionCourt
      FROM Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps
      GROUP BY Personnel.RefPersonnel, Personnel.NomPers, Personnel.PrénomPers, Personnel.Fonction, Fonction.FonctionCourt
      HAVING (((Personnel.Fonction)=8)))  AS [Personnel];
                `;
      const sqlResult = await fetchFromMsAccess<IChp1_educateur[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      resolve(sqlResult);
    } catch (err: any) {
      console.log(`err => chp1_1_educateur`);
      return reject(err);
    }
  });
}

const chp1_3_statut_des_eleves = (internat: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const c = internat == "" ? "0" : internat;
      let sql = `
            SELECT 1 AS orderby, 
            "Internes" AS label, "${c}" AS internat, 
          Count(IIf([Elèves].[Sexe]=1 And [internat]="-1",1,Null)) AS G, 
          Count(IIf([Elèves].[Sexe]=2 And [internat]="-1",1,Null)) AS F, 
          [G]+[F] AS T FROM Elèves;
            UNION ALL
            SELECT 2 AS orderby, 
            "½ Pensionnaires" AS label, "" AS internat, 
            First(0) AS G, First(0) AS F, [G]+[F]  AS T FROM Elèves;
            UNION ALL
             SELECT 3 AS orderby, "Externes" AS label, '${c}' AS internat, 
             Count(IIf([Elèves].[Sexe]=1 And [internat]="0",1,Null)) AS G, 
             Count(IIf([Elèves].[Sexe]=2 And [internat]="0",1,Null)) AS F, [G]+[F] AS T FROM Elèves;
            `;
      const sqlResult = await fetchFromMsAccess<IChp1_3[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_3) => {
        const items = _.omit(item, ["orderby", "label", "internat"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      const result = functions_main.addSumRow(contentsArray);
      // console.log("result.chp1_3....", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_3_statut_des_eleves`);
      return reject(err);
    }
  });
};

const chp1_4_a_clubs_et_associations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT tbl_club_assoc.id AS orderby, 
            tbl_club_assoc.lib_club_assoc AS label
            FROM tbl_club_assoc;
        `;
      const sqlResult = await fetchFromMsAccess<IChp1_4_a[]>(sql, appCnx);
      const isEmpty={ c0:' ', c1: ' ' }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_4_a, index: number) => {
        return {
          c0: `0${index + 1})`,
          c1: nv(item.label),
        };
      });
      //  console.log("contentsArray.chp1_4_a...", contentsArray);
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_4_a_clubs_et_associations`);
      return reject(err);
    }
  });
};

const chp1_5_double_vacation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, "Nombre de Classes" AS label, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=1) AS _6e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=2) AS _5e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=3) AS _4e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=4) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=5) AS _2ndA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=6) AS _2ndC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=7) AS _1ereA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=8) AS _1ereC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=9) AS _1ereD, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse In(10,13)) AS _TleA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=11) AS _TleC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=12) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY TypesClasses.filière
      HAVING (((TypesClasses.filière)=1));     
                `;
      const sqlResult = await fetchFromMsAccess<IChp1_5[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_5, i: number) => {
        const items = _.omit(item, ["orderby", "label", "ST1", "ST2", "TOTAL"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      // console.log("contentsArray.chp1_5...",JSON.stringify(contentsArray));
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_5_double_vacation`);
      return reject(err);
    }
  });
};

const chp1_6_enseignant_de_la_secode_langue = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, "Nombre de classes" AS label, Count(IIf([Classes].[LV2]="Allemand" And [Classes].[RefTypeClasse]=3,1,Null)) AS _4e_all, Count(IIf([Classes].[LV2]="Espagnol" And [Classes].[RefTypeClasse]=3,1,Null)) AS _4e_esp, Count(IIf([Classes].[LV2]="Allemand" And [Classes].[RefTypeClasse]=4,1,Null)) AS _3e_all, Count(IIf([Classes].[LV2]="Espagnol" And [Classes].[RefTypeClasse]=4,1,Null)) AS _3e_esp, Val([_4e_all]+[_3e_all]) AS ST1_all, Val([_4e_esp]+[_3e_esp]) AS ST1_esp, Count(IIf([Classes].[LV2]="Allemand" And [Classes].[RefTypeClasse]=5,1,Null)) AS _2ndA_all, Count(IIf([Classes].[LV2]="Espagnol" And [Classes].[RefTypeClasse]=5,1,Null)) AS _2ndA_esp, Count(IIf([Classes].[LV2]="Allemand" And [Classes].[RefTypeClasse]=6,1,Null)) AS _2ndC_all, Count(IIf([Classes].[LV2]="Espagnol" And [Classes].[RefTypeClasse]=6,1,Null)) AS _2ndC_esp, Count(IIf([Classes].[LV2]="Allemand" And [Classes].[RefTypeClasse]=7,1,Null)) AS _1ereA_all, Count(IIf([Classes].[LV2]="Espagnol" And [Classes].[RefTypeClasse]=7,1,Null)) AS _1ereA_esp, Count(IIf([Classes].[LV2]="Allemand" And [Classes].[RefTypeClasse] In (10,13),1,Null)) AS _TleA_all, 0 AS _TleA_esp, Val([_2ndA_all]+[_2ndC_all]+[_1ereA_all]+[_TleA_all]) AS ST2_all, Val(+[_2ndA_esp]+[_2ndC_esp]+[_1ereA_esp]+[_TleA_esp]) AS ST2_esp, [ST1_all]+[ST2_all] AS TOTAL_all, [ST1_esp]+[ST2_esp] AS TOTAL_esp
      FROM TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      HAVING (((Classes.RefTypeClasse)<14));
      
      UNION ALL
      SELECT 2 AS orderby, "nombre d’élèves" AS label, 
      Count(IIf([Elèves].[LV2]="Allemand" And [Classes].[RefTypeClasse]=3,1,Null)) AS _4e_all, Count(IIf([Elèves].[LV2]="Espagnol" And [Classes].[RefTypeClasse]=3,1,Null)) AS _4e_esp, Count(IIf([Elèves].[LV2]="Allemand" And [Classes].[RefTypeClasse]=4,1,Null)) AS _3e_all, Count(IIf([Elèves].[LV2]="Espagnol" And [Classes].[RefTypeClasse]=4,1,Null)) AS _3e_esp, Val([_4e_all]+[_3e_all]) AS ST1_all, Val([_4e_esp]+[_3e_esp]) AS ST1_esp, Count(IIf([Elèves].[LV2]="Allemand" And [Classes].[RefTypeClasse]=5,1,Null)) AS _2ndA_all, Count(IIf([Elèves].[LV2]="Espagnol" And [Classes].[RefTypeClasse]=5,1,Null)) AS _2ndA_esp, Count(IIf([Elèves].[LV2]="Allemand" And [Classes].[RefTypeClasse]=6,1,Null)) AS _2ndC_all, Count(IIf([Elèves].[LV2]="Espagnol" And [Classes].[RefTypeClasse]=6,1,Null)) AS _2ndC_esp, Count(IIf([Elèves].[LV2]="Allemand" And [Classes].[RefTypeClasse]=7,1,Null)) AS _1ereA_all, Count(IIf([Elèves].[LV2]="Espagnol" And [Classes].[RefTypeClasse]=7,1,Null)) AS _1ereA_esp, Count(IIf([Elèves].[LV2]="Allemand" And [Classes].[RefTypeClasse] In (10,13),1,Null)) AS _TleA_all, Count(IIf([Elèves].[LV2]="Espagnol" And [Classes].[RefTypeClasse] In (10,13),1,Null)) AS _TleA_esp, Val([_2ndA_all]+[_2ndC_all]+[_1ereA_all]+[_TleA_all]) AS ST2_all, Val(+[_2ndA_esp]+[_2ndC_esp]+[_1ereA_esp]+[_TleA_esp]) AS ST2_esp, [ST1_all]+[ST2_all] AS TOTAL_all, [ST1_esp]+[ST2_esp] AS TOTAL_esp
      FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY TypesClasses.filière
      HAVING (((TypesClasses.filière)=1));
                `;
      const sqlResult = await fetchFromMsAccess<IChp1_6[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_6, i: number) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_6_enseignant_de_la_secode_langue`);
      return reject(err);
    }
  });
};

const chp1_7_1_nombre_de_classes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
          SELECT 1 AS orderby, "Nombre de classes pédagogiques" AS label, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=1) AS _6e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=2) AS _5e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=3) AS _4e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=4) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1
          FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
          GROUP BY Elèves.Inscrit, TypesClasses.filière
          HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));  
                `;
      const sqlResult = await fetchFromMsAccess<IChp1_7_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_7_1, i: number) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      //  console.log("contentsArray.chp1_7_1_nbre_classes...",JSON.stringify(contentsArray));
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_7_1_nombre_de_classes`);
      return reject(err);
    }
  });
};

const chp1_7_1_pyramides_et_effectifs_eleves = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `

      SELECT 1 AS orderby,"Nombre d’élèves y   compris les redoublants" AS label, "Garçons" AS genre, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      HAVING (((Elèves.Sexe)=1));
      UNION ALL
      SELECT 2 AS orderby, "Nombre d’élèves y   compris les redoublants" AS label, "Filles" AS genre, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      HAVING (((Elèves.Sexe)=2));
      UNION ALL
      SELECT 3 AS orderby,"Nombre d’élèves y   compris les redoublants" AS label,  "Total" AS genre, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1));
      
      
      UNION ALL
      
      SELECT 1 AS orderby,"Nombre d ‘élèves Redoublants" AS label,"Garçons" AS genre, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      HAVING (((Elèves.Sexe)=1) AND ((Elèves.Redoub)=True));
      UNION ALL
      SELECT 2 AS orderby, "Nombre d ‘élèves Redoublants" AS label,"Filles" AS genre, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      HAVING (((Elèves.Sexe)=2) AND ((Elèves.Redoub)=True));
      UNION ALL
      SELECT 3 AS orderby,"Nombre d ‘élèves Redoublants" AS label, "Total" AS genre, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE TypesClasses.filière=1  AND Elèves.Redoub=True;
      
                `;
      const sqlResult = await fetchFromMsAccess<IChp1_7_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_7_1, i: number) => {
        const items = _.omit(item, ["orderby", "label", "genre"]);
        return {
          label: item.label,
          cols: [
            {
              genre: item.genre,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const groupeContents = functions_main.formatGroupeByLabel(contentsArray);
      const nbreClasses = await chp1_7_1_nombre_de_classes();

      const result = {
        data1: nbreClasses,
        data2: groupeContents,
      };
      //  console.log("result.chp1_7_1...",JSON.stringify(result));
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_7_1_pyramides_et_effectifs_eleves`);
      return reject(err);
    }
  });
};

const chp1_7_2_nombre_de_classes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, "Nombre de classes pédagogiques" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Val([_2ndA]+[_2ndC]) AS T_2nd, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Val([_1ereA]+[_1ereC]+[_1ereD]) AS T_1ere, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_TleA]+[_TleC]+[_TleD]) AS T_Tle, Val([T_2nd]+[T_1ere]+[T_Tle]) AS T_2nd_cycle, Count(IIf([TypesClasses].[RefTypeClasse]<14,1,Null)) AS T_1er_2nd_cycle
      FROM Classes INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse
      WHERE (((TypesClasses.filière)=1));
      
                `;
      const sqlResult = await fetchFromMsAccess<IChp1_7_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_7_1, i: number) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      //  console.log("contentsArray.chp1_7_2_nombre_de_classes...",JSON.stringify(contentsArray));
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_7_1_nombre_de_classes`);
      return reject(err);
    }
  });
};

const chp1_7_2_pyramides_et_effectifs_eleves = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT 1 AS orderby, "Nombre d’élèves y   compris les redoublants" AS label, "Garçons" AS genre, 
              Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Val([_2ndA]+[_2ndC]) AS T_2nd, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Val([_1ereA]+[_1ereC]+[_1ereD]) AS T_1ere, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_TleA]+[_TleC]+[_TleD]) AS T_Tle, Val([T_2nd]+[T_1ere]+[T_Tle]) AS T_2nd_cycle, Count(IIf([TypesClasses].[RefTypeClasse]<14,1,Null)) AS T_1er_2nd_cycle
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((TypesClasses.filière)=1))
              HAVING (((Elèves.Sexe)=1));
              UNION ALL
              SELECT 2 AS orderby,"Nombre d’élèves y   compris les redoublants" AS label,  "Filles" AS genre, 
              Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Val([_2ndA]+[_2ndC]) AS T_2nd, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Val([_1ereA]+[_1ereC]+[_1ereD]) AS T_1ere, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_TleA]+[_TleC]+[_TleD]) AS T_Tle, Val([T_2nd]+[T_1ere]+[T_Tle]) AS T_2nd_cycle, Count(IIf([TypesClasses].[RefTypeClasse]<14,1,Null)) AS T_1er_2nd_cycle
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((TypesClasses.filière)=1))
              HAVING (((Elèves.Sexe)=2));
              UNION ALL
              SELECT 3 AS orderby,"Nombre d’élèves y   compris les redoublants" AS label,  "Total" AS genre,
              Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Val([_2ndA]+[_2ndC]) AS T_2nd, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Val([_1ereA]+[_1ereC]+[_1ereD]) AS T_1ere, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_TleA]+[_TleC]+[_TleD]) AS T_Tle, Val([T_2nd]+[T_1ere]+[T_Tle]) AS T_2nd_cycle, Count(IIf([TypesClasses].[RefTypeClasse]<14,1,Null)) AS T_1er_2nd_cycle
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((TypesClasses.filière)=1));
                  
              UNION ALL
              
              SELECT 4 AS orderby,"Nombre d ‘élèves Redoublants" AS label, "Garçons" AS genre, 
              Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Val([_2ndA]+[_2ndC]) AS T_2nd, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Val([_1ereA]+[_1ereC]+[_1ereD]) AS T_1ere, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_TleA]+[_TleC]+[_TleD]) AS T_Tle, Val([T_2nd]+[T_1ere]+[T_Tle]) AS T_2nd_cycle, Count(IIf([TypesClasses].[RefTypeClasse]<14,1,Null)) AS T_1er_2nd_cycle
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((TypesClasses.filière)=1))
              HAVING (((Elèves.Sexe)=1) AND ((Elèves.Redoub)=True));
              UNION ALL
              SELECT 5 AS orderby,"Nombre d ‘élèves Redoublants" AS label, "Filles" AS genre, 
              Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Val([_2ndA]+[_2ndC]) AS T_2nd, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Val([_1ereA]+[_1ereC]+[_1ereD]) AS T_1ere, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_TleA]+[_TleC]+[_TleD]) AS T_Tle, Val([T_2nd]+[T_1ere]+[T_Tle]) AS T_2nd_cycle, Count(IIf([TypesClasses].[RefTypeClasse]<14,1,Null)) AS T_1er_2nd_cycle
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((TypesClasses.filière)=1))
              HAVING (((Elèves.Sexe)=2) AND ((Elèves.Redoub)=True));
              UNION ALL
              SELECT 6 AS orderby,"Nombre d ‘élèves Redoublants" AS label, "Total" AS genre, 
              Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Val([_2ndA]+[_2ndC]) AS T_2nd, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Val([_1ereA]+[_1ereC]+[_1ereD]) AS T_1ere, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_TleA]+[_TleC]+[_TleD]) AS T_Tle, Val([T_2nd]+[T_1ere]+[T_Tle]) AS T_2nd_cycle, Count(IIf([TypesClasses].[RefTypeClasse]<14,1,Null)) AS T_1er_2nd_cycle
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE TypesClasses.filière=1  AND Elèves.Redoub=True;
                `;
      const sqlResult = await fetchFromMsAccess<IChp1_7_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_7_1, i: number) => {
        const items = _.omit(item, ["orderby", "label", "genre"]);
        return {
          label: item.label,
          cols: [
            {
              genre: item.genre,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const groupeContents = functions_main.formatGroupeByLabel(contentsArray);
      const nbreClasses = await chp1_7_2_nombre_de_classes();

      const result = {
        data1: nbreClasses,
        data2: groupeContents,
      };
      //  console.log("result.chp1_7_2...",JSON.stringify(result));
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_7_2_pyramides_et_effectifs_eleves`);
      return reject(err);
    }
  });
};

const chp1_8_eleves_par_nationalite = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT Niveaux.RefNiveau, 1 AS orderby, [NiveauCourt] & " " & [Série] AS NiveauSerie, "#FFFF" AS bg, Count(IIf([SEXE]=1 And [Nat]="70",1,Null)) AS G1, Count(IIf([SEXE]=2 And [Nat]="70",1,Null)) AS F1, [G1]+[F1] AS T1, Count(IIf([SEXE]=1 And [Nat] Between "75" And "89",1,Null)) AS G2, Count(IIf([SEXE]=2 And [Nat] Between "75" And "89",1,Null)) AS F2, [G2]+[F2] AS T2, Count(IIf([SEXE]=1 And [Nat]>"89",1,Null)) AS G3, Count(IIf([SEXE]=2 And [Nat]>"89",1,Null)) AS F3, [G3]+[F3] AS T3, [G1]+[G2]+[G3] AS TG, [F1]+[F2]+[F3] AS TF, [TG]+[TF] AS TGF
            FROM Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau
            GROUP BY Niveaux.RefNiveau, 1, [NiveauCourt] & " " & [Série], TypesClasses.RefTypeClasse
            HAVING (((TypesClasses.RefTypeClasse)<5))
            ORDER BY 1,2,3;
            UNION ALL
            SELECT 4 AS RefNiveau, 2 AS orderby, "Total " & (IIf(IsNull([Cycle]),Null,[cycle])) AS NiveauSerie, "#EBEBEB" AS bg, Count(IIf([SEXE]=1 And [Nat]="70",1,Null)) AS G1, Count(IIf([SEXE]=2 And [Nat]="70",1,Null)) AS F1, [G1]+[F1] AS T1, Count(IIf([SEXE]=1 And [Nat] Between "75" And "89",1,Null)) AS G2, Count(IIf([SEXE]=2 And [Nat] Between "75" And "89",1,Null)) AS F2, [G2]+[F2] AS T2, Count(IIf([SEXE]=1 And [Nat]>"89",1,Null)) AS G3, Count(IIf([SEXE]=2 And [Nat]>"89",1,Null)) AS F3, [G3]+[F3] AS T3, [G1]+[G2]+[G3] AS TG, [F1]+[F2]+[F3] AS TF, [TG]+[TF] AS TGF
            FROM Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau
            GROUP BY "Total " & (IIf(IsNull([Cycle]),Null,[cycle])), Niveaux.cycle, TypesClasses.Filière
            HAVING (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.Filière)=1))
            ORDER BY 1, 2,3;
            UNION ALL
            SELECT Niveaux.RefNiveau, 3 AS orderby, [NiveauCourt] & " " & [Série] AS NiveauSerie, "#FFFF" AS bg, Count(IIf([SEXE]=1 And [Nat]="70",1,Null)) AS G1, Count(IIf([SEXE]=2 And [Nat]="70",1,Null)) AS F1, [G1]+[F1] AS T1, Count(IIf([SEXE]=1 And [Nat] Between "75" And "89",1,Null)) AS G2, Count(IIf([SEXE]=2 And [Nat] Between "75" And "89",1,Null)) AS F2, [G2]+[F2] AS T2, Count(IIf([SEXE]=1 And [Nat]>"89",1,Null)) AS G3, Count(IIf([SEXE]=2 And [Nat]>"89",1,Null)) AS F3, [G3]+[F3] AS T3, [G1]+[G2]+[G3] AS TG, [F1]+[F2]+[F3] AS TF, [TG]+[TF] AS TGF
            FROM Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau
            GROUP BY Niveaux.RefNiveau, [NiveauCourt] & " " & [Série], TypesClasses.RefTypeClasse
            HAVING (((TypesClasses.RefTypeClasse) Between 5 And 9))
            ORDER BY 1, 2,3;
            UNION ALL
            SELECT Last(Niveaux.RefNiveau) AS RefNiveau, 3 AS orderby, "Tle A" AS NiveauSerie, "#FFFF" AS bg, Count(IIf([SEXE]=1 And [Nat]="70",1,Null)) AS G1, Count(IIf([SEXE]=2 And [Nat]="70",1,Null)) AS F1, [G1]+[F1] AS T1, Count(IIf([SEXE]=1 And [Nat] Between "75" And "89",1,Null)) AS G2, Count(IIf([SEXE]=2 And [Nat] Between "75" And "89",1,Null)) AS F2, [G2]+[F2] AS T2, Count(IIf([SEXE]=1 And [Nat]>"89",1,Null)) AS G3, Count(IIf([SEXE]=2 And [Nat]>"89",1,Null)) AS F3, [G3]+[F3] AS T3, [G1]+[G2]+[G3] AS TG, [F1]+[F2]+[F3] AS TF, [TG]+[TF] AS TGF
            FROM Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau
            HAVING (((TypesClasses.RefTypeClasse) In (10,13)))
            ORDER BY 1, 2,3;
            UNION ALL
            SELECT Niveaux.RefNiveau, 3 AS orderby, [NiveauCourt] & " " & [Série] AS NiveauSerie, "#FFFF" AS bg, Count(IIf([SEXE]=1 And [Nat]="70",1,Null)) AS G1, Count(IIf([SEXE]=2 And [Nat]="70",1,Null)) AS F1, [G1]+[F1] AS T1, Count(IIf([SEXE]=1 And [Nat] Between "75" And "89",1,Null)) AS G2, Count(IIf([SEXE]=2 And [Nat] Between "75" And "89",1,Null)) AS F2, [G2]+[F2] AS T2, Count(IIf([SEXE]=1 And [Nat]>"89",1,Null)) AS G3, Count(IIf([SEXE]=2 And [Nat]>"89",1,Null)) AS F3, [G3]+[F3] AS T3, [G1]+[G2]+[G3] AS TG, [F1]+[F2]+[F3] AS TF, [TG]+[TF] AS TGF
            FROM Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau
            GROUP BY Niveaux.RefNiveau, 3, [NiveauCourt] & " " & [Série], TypesClasses.RefTypeClasse
            HAVING (((TypesClasses.RefTypeClasse) In (11,12)))
            ORDER BY 1, 2,3;
            UNION ALL
            SELECT 7 AS RefNiveau, 4 AS orderby, "Total " & (IIf(IsNull([Cycle]),Null,[cycle])) AS NiveauSerie, "#EBEBEB" AS bg, Count(IIf([SEXE]=1 And [Nat]="70",1,Null)) AS G1, Count(IIf([SEXE]=2 And [Nat]="70",1,Null)) AS F1, [G1]+[F1] AS T1, Count(IIf([SEXE]=1 And [Nat] Between "75" And "89",1,Null)) AS G2, Count(IIf([SEXE]=2 And [Nat] Between "75" And "89",1,Null)) AS F2, [G2]+[F2] AS T2, Count(IIf([SEXE]=1 And [Nat]>"89",1,Null)) AS G3, Count(IIf([SEXE]=2 And [Nat]>"89",1,Null)) AS F3, [G3]+[F3] AS T3, [G1]+[G2]+[G3] AS TG, [F1]+[F2]+[F3] AS TF, [TG]+[TF] AS TGF
            FROM Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau
            GROUP BY "Total " & (IIf(IsNull([Cycle]),Null,[cycle])), Niveaux.cycle, TypesClasses.Filière
            HAVING (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.Filière)=1))
            ORDER BY 1, 2,3;
            UNION ALL
            SELECT 8 AS RefNiveau, 5 AS orderby, "TOTAL GENERAL" AS NiveauSerie, "#E3E3E3" AS bg, Count(IIf([SEXE]=1 And [Nat]="70",1,Null)) AS G1, Count(IIf([SEXE]=2 And [Nat]="70",1,Null)) AS F1, [G1]+[F1] AS T1, Count(IIf([SEXE]=1 And [Nat] Between "75" And "89",1,Null)) AS G2, Count(IIf([SEXE]=2 And [Nat] Between "75" And "89",1,Null)) AS F2, [G2]+[F2] AS T2, Count(IIf([SEXE]=1 And [Nat]>"89",1,Null)) AS G3, Count(IIf([SEXE]=2 And [Nat]>"89",1,Null)) AS F3, [G3]+[F3] AS T3, [G1]+[G2]+[G3] AS TG, [F1]+[F2]+[F3] AS TF, [TG]+[TF] AS TGF
            FROM Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau
            GROUP BY TypesClasses.Filière
            HAVING (((TypesClasses.Filière)=1))
            ORDER BY 1, 2, 3;
                `;
      const sqlResult = await fetchFromMsAccess<IChp1_8[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_8, i: number) => {
        const items = _.omit(item, [
          "RefNiveau",
          "orderby",
          "NiveauSerie",
          "bg",
        ]);
        return {
          bg: item.bg,
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      //  console.log("contentsArray.chp1_8...",JSON.stringify(contentsArray));
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_8_eleves_par_nationalite`);
      return reject(err);
    }
  });
};

const chp1_9_eleves_affectes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
          SELECT 1 AS orderby, "Elèves affectés" AS label, Count(IIf([Elèves].[StatutElève]=1 And [Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (1),1,Null)) AS _6e_G, Count(IIf([Elèves].[StatutElève]=1 And [Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (1),1,Null)) AS _6e_F, Val([_6e_G]+[_6e_F]) AS _6e_T, Count(IIf([Elèves].[StatutElève]=1 And [Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (5),1,Null)) AS _2ndA_G, Count(IIf([Elèves].[StatutElève]=1 And [Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (5),1,Null)) AS _2ndA_F, Val([_2ndA_G]+[_2ndA_F]) AS _2ndA_T, Count(IIf([Elèves].[StatutElève]=1 And [Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (6),1,Null)) AS _2ndC_G, Count(IIf([Elèves].[StatutElève]=1 And [Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (6),1,Null)) AS _2ndC_F, Val([_2ndC_G]+[_2ndC_F]) AS _2ndC_T, Val([_2ndA_G]+[_2ndC_G]) AS _2nd_T_G, Val([_2ndA_F]+[_2ndC_F]) AS _2nd_T_F, Val([_2nd_T_G]+[_2nd_T_F]) AS _2nd_T_G_F
          FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
          WHERE (((Classes.RefTypeClasse)<5));
                `;
      const sqlResult = await fetchFromMsAccess<IChp1_9[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_9, i: number) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      //  console.log("contentsArray.chp1_9_eleves_affectes...",JSON.stringify(contentsArray));
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_9_eleves_affectes`);
      return reject(err);
    }
  });
};

const chp1_11_effectif_eleves_et_pyramides = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, "Nombre de Classes" AS label, 
      Count(IIf([Classes].[RefTypeClasse] In (1),1,Null)) AS _6e, 
      Count(IIf([Classes].[RefTypeClasse] In (2),1,Null)) AS _5e, 
      Count(IIf([Classes].[RefTypeClasse] In (3),1,Null)) AS _4e, 
      Count(IIf([Classes].[RefTypeClasse] In (4),1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([Classes].[RefTypeClasse] In (5),1,Null)) AS _2ndA, 
      Count(IIf([Classes].[RefTypeClasse] In (6),1,Null)) AS _2ndC, 
      Count(IIf([Classes].[RefTypeClasse] In (7),1,Null)) AS _1ereA, 
      Count(IIf([Classes].[RefTypeClasse] In (8),1,Null)) AS _1ereC, 
      Count(IIf([Classes].[RefTypeClasse] In (9),1,Null)) AS _1ereD, 
      Count(IIf([Classes].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
      Count(IIf([Classes].[RefTypeClasse] In (11),1,Null)) AS _TleC, 
      Count(IIf([Classes].[RefTypeClasse] In (12),1,Null)) AS _TleD, 
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
      [ST1]+[ST2] AS TOTAL
      FROM Classes
      WHERE (((Classes.RefTypeClasse)<14)); 
      UNION ALL 
      SELECT 2 AS orderby, "Effectifs" AS label, 
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
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
`;
const sqlResult = await fetchFromMsAccess<IChp1_11[]>(sql, appCnx);
const isEmpty = {
        label:"",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "","","","",],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_11, i: number) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          cols:Object.values(items),
        };
      });
      const row = contentsArray;
      const row1 = row[0];
      const row2 = row[1];
      const row3 = functions_main.calculateEstimationRow(row);
      const row4 = {row3};
      const result = [{row1,row2,row4}];
      // console.log("🚀 ~ file: functions.ts:583 ~ returnnewPromise ~ result----:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_11_effectif_eleves_et_pyramides`);
      return reject(err);
    }
  });
};


const chp1_12_A_etat_et_besoins_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT DISTINCT Matières.RefMatière AS orderby, Matières.MatLong AS label, 
      Count(IIf([Personnel].[Corps]=2 And [Personnel].[Sexe]="F",1,Null)) AS cycle1_F, Count(IIf([Personnel].[Corps]=2 And [Personnel].[Sexe]="M",1,Null)) AS cycle1_H, [cycle1_F]+[cycle1_H] AS cycle1_T, "" AS besoins1,
      Count(IIf([Personnel].[Corps]=1 And [Personnel].[Sexe]="F",1,Null)) AS cycle2_F, Count(IIf([Personnel].[Corps]=1 And [Personnel].[Sexe]="M",1,Null)) AS cycle2_H, [cycle2_F]+[cycle2_H] AS cycle2_T, "" AS besoins2, 
      [cycle1_F]+[cycle2_F] AS cycle1_cycle2_F, [cycle1_H]+[cycle2_H] AS cycle1_cycle2_H, [cycle1_T]+[cycle2_T] AS cycle1_cycle2_T, "" AS besoins3
      FROM Personnel INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
      GROUP BY Matières.RefMatière, Matières.MatLong
      HAVING (((Matières.RefMatière) Not In (14,30)));  
      UNION ALL
      SELECT "" AS orderby, "TOTAL" AS label, 
      Count(IIf([Personnel].[Corps]=2 And [Personnel].[Sexe]="F",1,Null)) AS cycle1_F, Count(IIf([Personnel].[Corps]=2 And [Personnel].[Sexe]="M",1,Null)) AS cycle1_H, [cycle1_F]+[cycle1_H] AS cycle1_T, "" AS besoins1, 
      Count(IIf([Personnel].[Corps]=1 And [Personnel].[Sexe]="F",1,Null)) AS cycle2_F, Count(IIf([Personnel].[Corps]=1 And [Personnel].[Sexe]="M",1,Null)) AS cycle2_H, [cycle2_F]+[cycle2_H] AS cycle2_T, "" AS besoins2, 
      [cycle1_F]+[cycle2_F] AS cycle1_cycle2_F, [cycle1_H]+[cycle2_H] AS cycle1_cycle2_H, [cycle1_T]+[cycle2_T] AS cycle1_cycle2_T, "" AS besoins3
      FROM Personnel INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière;    
                `;
      const sqlResult = await fetchFromMsAccess<IChp1_12_A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_12_A, i: number) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label,
          cols: functions_main.rav(items),
        };
      });
      //  console.log("contentsArray.chp1_12...",JSON.stringify(contentsArray));
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_12_A_etat_et_besoins_personnel_enseignant`);
      return reject(err);
    }
  });
};

const chp1_12_B_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT DISTINCT 
      Fonction.RefFonction, 
      Fonction.Fonction, 
      Fonction.FonctionCourt, 
      Count(IIf([Personnel].[Sexe]="F",1,Null)) AS F, 
      Count(IIf([Personnel].[Sexe]="M",1,Null)) AS H, 
      [F]+[H] AS T
      FROM Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction
      GROUP BY Fonction.RefFonction, Fonction.Fonction, Fonction.FonctionCourt
      HAVING (((Fonction.RefFonction) In (1,16,5,18,7,20,48,8,30,10,33,46,12,45,14,13,38,66)))
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_12_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_12_B, i: number) => {
        const items = _.omit(item, ["RefFonction", "FonctionCourt","Fonction"]);
        return {
          label: item.Fonction,
          cols: functions_main.rav(items),
        };
      });
      // console.log("contentsArray.chp1_12_B_personnel_enseignant...", JSON.stringify(contentsArray));
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_12_B_personnel_enseignant`);
      return reject(err);
    }
  });
};
/******* fin chapitre  *****
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
      ]);

      const path = await functions_main.fileExists(
        `C:/SPIDER/Ressources/${codeetab}_logo.jpg`
      );
      //les autres parametres du fichier python
      const dataParams = { ...data, logo1: path, path };
      // console.log("dataParams...", dataParams);

      const chp1_1_a = await chp1_identification(1);
      const chp1_1_b = await chp1_identification(16);
      const chp1_1_c = await chp1_identification(7);
      const chp1_1_d = await chp1_identification(20);
      const chp1_1_e = await chp1_identification(4);
      const chp1_1_f = await chp1_identification(17);
      const chp1_1 = await chp1_1_educateur();

      const chp1_3 = await chp1_3_statut_des_eleves(internat);
      const chp1_4_a = await chp1_4_a_clubs_et_associations();
      // console.log("chp1_4_a...", chp1_4_a);
      const chp1_5 = await chp1_5_double_vacation();

      const chp1_6 = await chp1_6_enseignant_de_la_secode_langue();
      const chp1_7_1 = await chp1_7_1_pyramides_et_effectifs_eleves();
      const chp1_7_2 = await chp1_7_2_pyramides_et_effectifs_eleves();
      const chp1_8 = await chp1_8_eleves_par_nationalite();
      const chp1_9 = await chp1_9_eleves_affectes();
      const chp1_11 = await chp1_11_effectif_eleves_et_pyramides();
      const chp1_12_A = await chp1_12_A_etat_et_besoins_personnel_enseignant();
      const chp1_12_B = await chp1_12_B_personnel_enseignant()

      const an1 = Number(anscol1.slice(0, 4)) - 1 + "/" + anscol1.slice(0, 4);
      const an2 = anscol1.replace("-", "/");
      // console.log("an1 ... ", an1,"| \n an2 ... ", an2)
      // console.log("codeetab ... ", codeetab, "| \n nometab ... ", nometab);

      const result = {
        ...dataParams,
        name_report: "public_secondairegeneral_rapportrentree",
        path_report: "public/secondaire-general",
        anscol1,
        an1,
        an2,
        nometab,
        codeetab,
        drencomplet,
        bpetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        internat,

        chp1_1_a,
        chp1_1_b,
        chp1_1_c,
        chp1_1_d,
        chp1_1_e,
        chp1_1_f,
        chp1_1,

        chp1_3,
        chp1_4_a,
        chp1_5,
        chp1_6,
        chp1_7_1,
        chp1_7_2,
        chp1_8,
        chp1_9,
        chp1_11,
        chp1_12_A,
        chp1_12_B,
      };
      // console.log("🚀 ~ file: functions.ts:765 ~ returnnewPromise ~ result:", result.chp1_11)
      resolve(result);
    } catch (err: any) {
      return reject(err);
    }
  });
};

export default {
  rapport,
};
