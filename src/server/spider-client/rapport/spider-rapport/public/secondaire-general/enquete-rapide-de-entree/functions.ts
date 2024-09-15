import { _selectSql } from '../../../../../../databases/index';
import { appCnx, fetchFromMsAccess, paramEtabObjet } from '../../../../../../databases/accessDB';
import {
  IChp1,
  IChp2,
  IChp3,
  IChp4,
  IChp5,
  
}
  from "./interfaces";

import functions_main from "../../../utils";

const _ = require("lodash");
const bg = { 'c1': '#E3E3E3', 'c2': '#ffcdd2', };
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
  return data === undefined || data === null ?  0 : data;
};

//*********************** debut chapitre  ***************
const chp1_nombre_de_classes_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 1 AS orderby, "Nombre de Classes" AS label, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=1) AS _6e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=2) AS _5e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=3) AS _4e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=4) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=5) AS _2ndA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=6) AS _2ndC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=7) AS _1ereA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=8) AS _1ereC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=9) AS _1ereD, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse In(10,13)) AS _TleA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=11) AS _TleC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=12) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
                FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
                GROUP BY TypesClasses.filière
                HAVING (((TypesClasses.filière)=1));      
                `;
      const sqlResult = await fetchFromMsAccess<IChp1[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          ...items,
        };
      });
      // console.log("contentsArray.chp2_5....", contentsArray)
      const row = contentsArray;
      const row1 = Object.values(row[0]);
      const rows = { row1};
      const result = [rows];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_nombre_de_classes_par_niveau`);
      return reject(err);
    }
  });
};


const chp2_effectifs_eleves = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT 1 AS orderby, "Attendus" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
              FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
              HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
              FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
              GROUP BY TypesClasses.filière
              HAVING (((TypesClasses.filière)=1));
              UNION ALL
              SELECT 2 AS orderby, "Présents" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
              FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
              HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
              FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
              GROUP BY Elèves.Inscrit, TypesClasses.filière
              HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
                `;
      const sqlResult = await fetchFromMsAccess<IChp2[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2,i:number) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label ,
          cols: Object.values(items),
        };
      });

      const result=functions_main.addPercentRow(contentsArray,"% des présents");
      // console.log("result.chp2...",JSON.stringify(result));
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_effectifs_eleves`);
      return reject(err);
    }
  });
};



const chp3_effectifs_enseignants = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, "Attendus" AS label,
      Count(IIf([Personnel].[RefMatière]=7,1,Null)) AS maths, Count(IIf([Personnel].[RefMatière]=8,1,Null)) AS pc, Count(IIf([Personnel].[RefMatière]=9,1,Null)) AS svt, Count(IIf([Personnel].[RefMatière]=1,1,Null)) AS fr, Count(IIf([Personnel].[RefMatière]=4,1,Null)) AS ang, Count(IIf([Personnel].[RefMatière]=5,1,Null)) AS [all], Count(IIf([Personnel].[RefMatière]=6,1,Null)) AS esp, Count(IIf([Personnel].[RefMatière]=2,1,Null)) AS philo, Count(IIf([Personnel].[RefMatière]=3,1,Null)) AS hg, Count(IIf([Personnel].[RefMatière]=11,1,Null)) AS mus, Count(IIf([Personnel].[RefMatière]=10,1,Null)) AS ap, Count(IIf([Personnel].[RefMatière]=12,1,Null)) AS eps, Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[RefMatière2]=1,1,Null)) AS hg_lm, Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[RefMatière2]=13,1,Null)) AS lm_edhc, Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[RefMatière2]=6,1,Null)) AS ang_eps, Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[RefMatière2]=15,1,Null)) AS math_tice, Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[RefMatière2]=9,1,Null)) AS pc_svt, Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[RefMatière2]=8,1,Null)) AS svt_pc, Val([maths]+[pc]+[svt]+[fr]+[ang]+[all]+[esp]+[philo]+[hg]+[mus]+[ap]+[eps]+[hg_lm]+[lm_edhc]+[ang_eps]+[math_tice]+[pc_svt]+[svt_pc]) AS total
      FROM Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction
      HAVING (((Personnel.Fonction)=6));
      
      UNION ALL
      SELECT 2 AS orderby, "Présents" AS label, 
      Count(IIf([Personnel].[RefMatière]=7,1,Null)) AS maths, Count(IIf([Personnel].[RefMatière]=8,1,Null)) AS pc, Count(IIf([Personnel].[RefMatière]=9,1,Null)) AS svt, Count(IIf([Personnel].[RefMatière]=1,1,Null)) AS fr, Count(IIf([Personnel].[RefMatière]=4,1,Null)) AS ang, Count(IIf([Personnel].[RefMatière]=5,1,Null)) AS [all], Count(IIf([Personnel].[RefMatière]=6,1,Null)) AS esp, Count(IIf([Personnel].[RefMatière]=2,1,Null)) AS philo, Count(IIf([Personnel].[RefMatière]=3,1,Null)) AS hg, Count(IIf([Personnel].[RefMatière]=11,1,Null)) AS mus, Count(IIf([Personnel].[RefMatière]=10,1,Null)) AS ap, Count(IIf([Personnel].[RefMatière]=12,1,Null)) AS eps, Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[RefMatière2]=1,1,Null)) AS hg_lm, Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[RefMatière2]=13,1,Null)) AS lm_edhc, Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[RefMatière2]=6,1,Null)) AS ang_eps, Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[RefMatière2]=15,1,Null)) AS math_tice, Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[RefMatière2]=9,1,Null)) AS pc_svt, Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[RefMatière2]=8,1,Null)) AS svt_pc, Val([maths]+[pc]+[svt]+[fr]+[ang]+[all]+[esp]+[philo]+[hg]+[mus]+[ap]+[eps]+[hg_lm]+[lm_edhc]+[ang_eps]+[math_tice]+[pc_svt]+[svt_pc]) AS total
      FROM Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction
      HAVING (((Personnel.Fonction)=6));
      
      
                `;
      const sqlResult = await fetchFromMsAccess<IChp3[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3,i:number) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label ,
          cols: Object.values(items),
        };
      });

      const result=functions_main.addPercentRow(contentsArray,"% des présents");
      // console.log("result.chp3...",JSON.stringify(result));
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp3_effectifs_enseignants`);
      return reject(err);
    }
  });
};

const chp4_effectifs_personnel_administratif_et_encadrement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT 1 AS orderby, "Attendus" AS label, 
              Count(IIf([Personnel].[Fonction]=1 Or [Personnel].[Fonction]=2,1,Null)) AS chefetab, Count(IIf([Personnel].[Fonction]=16,1,Null)) AS adjoint_chefetab, Count(IIf([Personnel].[Fonction]=4,1,Null)) AS indend, Count(IIf([Personnel].[Fonction]=17,1,Null)) AS indend_adjoint, Count(IIf([Personnel].[Fonction]=7,1,Null)) AS insp_educ, Count(IIf([Personnel].[Fonction]=20,1,Null)) AS insp_ori, Count(IIf([Personnel].[Fonction]=8,1,Null)) AS educ, [chefetab]+[adjoint_chefetab]+[indend]+[indend_adjoint]+[insp_educ]+[insp_ori]+[educ] AS total
              FROM Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction;
      
              UNION ALL
              SELECT 2 AS orderby, "Présents" AS label, 
              Count(IIf([Personnel].[Fonction]=1 Or [Personnel].[Fonction]=2,1,Null)) AS chefetab, Count(IIf([Personnel].[Fonction]=16,1,Null)) AS adjoint_chefetab, Count(IIf([Personnel].[Fonction]=4,1,Null)) AS indend, Count(IIf([Personnel].[Fonction]=17,1,Null)) AS indend_adjoint, Count(IIf([Personnel].[Fonction]=7,1,Null)) AS insp_educ, Count(IIf([Personnel].[Fonction]=20,1,Null)) AS insp_ori, Count(IIf([Personnel].[Fonction]=8,1,Null)) AS educ, [chefetab]+[adjoint_chefetab]+[indend]+[indend_adjoint]+[insp_educ]+[insp_ori]+[educ] AS total
              FROM Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction;
                `;
      const sqlResult = await fetchFromMsAccess<IChp4[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4,i:number) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label ,
          cols: Object.values(items),
        };
      });

      const result=functions_main.addPercentRow(contentsArray,"% des présents");
      // console.log("result.chp4...",JSON.stringify(result));
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp4_effectifs_personnel_administratif_et_encadrement`);
      return reject(err);
    }
  });
};

const chp5_effectifs_personnel_technique_et_entretient = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
                SELECT 1 AS orderby, "Attendus" AS label, 
                Count(IIf([Personnel].[Fonction]=10,1,Null)) AS secret, Count(IIf([Personnel].[Fonction]=33,1,Null)) AS info, Count(IIf([Personnel].[Fonction]=46,1,Null)) AS laboratin, Count(IIf([Personnel].[Fonction]=12,1,Null)) AS biblio, Count(IIf([Personnel].[Fonction]=67,1,Null)) AS reprog, Count(IIf([Personnel].[Fonction]=30,1,Null)) AS infi, Count(IIf([Personnel].[Fonction]=13,1,Null)) AS man, Count(IIf([Personnel].[Fonction]=43,1,Null)) AS archiv, Count(IIf([Personnel].[Fonction]=14,1,Null)) AS gardi, [secret]+[info]+[laboratin]+[biblio]+[reprog]+[infi]+[man]+[archiv]+[gardi] AS total
                FROM Personnel;
    
                UNION ALL
                SELECT 2 AS orderby, "Présents" AS label, 
                Count(IIf([Personnel].[Fonction]=10,1,Null)) AS secret, Count(IIf([Personnel].[Fonction]=33,1,Null)) AS info, Count(IIf([Personnel].[Fonction]=46,1,Null)) AS laboratin, Count(IIf([Personnel].[Fonction]=12,1,Null)) AS biblio, Count(IIf([Personnel].[Fonction]=67,1,Null)) AS reprog, Count(IIf([Personnel].[Fonction]=30,1,Null)) AS infi, Count(IIf([Personnel].[Fonction]=13,1,Null)) AS man, Count(IIf([Personnel].[Fonction]=43,1,Null)) AS archiv, Count(IIf([Personnel].[Fonction]=14,1,Null)) AS gardi, [secret]+[info]+[laboratin]+[biblio]+[reprog]+[infi]+[man]+[archiv]+[gardi] AS total
                FROM Personnel;
                `;
      const sqlResult = await fetchFromMsAccess<IChp5[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp5,i:number) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label ,
          cols: Object.values(items),
        };
      });

      const result=functions_main.addPercentRow(contentsArray,"% des présents");
      // console.log("result.chp5...",JSON.stringify(result));
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp5_effectifs_personnel_technique_et_entretient`);
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
        emailetab,
        titrechefetab,
        nomchefetab,
        ville,
      } = await paramEtabObjet([
        "anscol1",
        "nometab",
        "codeetab",
        "drencomplet",
        "bpetab",
        "emailetab",
        "titrechefetab",
        "nomchefetab",
        "ville",
      ]); 

      const path = await functions_main.fileExists(`C:/SPIDER/Ressources/${codeetab}_logo.jpg`);
      //les autres parametres du fichier python 
      const dataParams = { ...data,logo1:path,path};
      // console.log("dataParams...", dataParams);

      const chp1 = await chp1_nombre_de_classes_par_niveau();
      const chp2 = await chp2_effectifs_eleves();
      const chp3 = await chp3_effectifs_enseignants();
      const chp4 = await chp4_effectifs_personnel_administratif_et_encadrement();
      const chp5 = await chp5_effectifs_personnel_technique_et_entretient();
     

      const result = {
        ...dataParams,
        name_report: "public_secondairegeneral_enqueterentree",
        path_report: "public/secondaire-general",
        anscol1,
        nometab,
        codeetab,
        drencomplet,
        bpetab,
        emailetab,
        titrechefetab,
        nomchefetab,
        ville,

        chp1,
        chp2,
        chp3,
        chp4,
        chp5,
        
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
