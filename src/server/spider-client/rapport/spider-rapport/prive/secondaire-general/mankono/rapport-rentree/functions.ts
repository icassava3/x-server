import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../../../../../../../databases/accessDB";

import _ from "lodash";

import {
  IChp_B_2,
  IChp_A_1,
  IChp_A_1_3_1,
  IChp3_A_1,
  IChp_A_1_4_1,
  IChp_A_1_4_2,
  IChp_A_2_1_1,
  IChp_A_2_1_1_Result,
  IChp_A_2_2,
  IChp_A_2_3,
  IChp_B_1,
  IChp_B_1_Result,
  IChp_B_3,
  IChp_B_4,
  IChp_B_5,
  IChp_C_2_1,
  IChp_C_2_2,
  IChp_C_1_2,
  IChp_C_1_1,
  IChp_C_3_1,
  IChp_C_3_2,
  IChp_C_3_3,
  IChp_C_3_4,
  IChp_C_4,
  IChp_C_5_1,
  IChp_C_5_2,
  IChp_C_5_3,
  IChp_C_5_4,
  IChp_C_5_5,
  IChp_C_5_6,
  IChp_D_1,
  IChp_D_2,
  IChp1A_4,
  IChp1_B_c,
  IChp2_2,
  IChp3_3,
  IChp4_2_a,
  IChp5_1_a,
  IChp5_1_b,
  IChp5_2,
  IChp5A_3_c,
  IChp2_4,
  IChp1_B_1_a,
  IChp2_5,
  IChp2_3,
  IChp4_2_1,
  IChp2_1_a,
  chp3_4_a_1,
  IChp1_B_1_b,
  IChp3_E,
  IChp4_A_1,
  IChp4_A_4,
  IChp4_B,
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

      const path = await functions_main.fileExists(`C:/SPIDER/Ressources/${codeetab}_logo.jpg`);
      const logo1 = path;

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
        boitepostale: boitepostale
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
        boitepostale,
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
        "boitepostale",
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
        boitepostale: boitepostale,

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

//********* debut rapport1  ***

const chp2_1_liste_des_eleves_affectes_et_non = () => {
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
      Classes.RefClasse, 
      Classes.ClasseLong, 
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
      IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2, 
      Elèves.LV2 AS Lang, 
      T_Notes.MOYG1 AS MoyG1, 
      Elèves.LieuNaiss,
      Notes.RangG1, 
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      '' AS NumDeciAffect, 
      IIf(IsNull([Elèves].[Obs]),"",[Elèves].[Obs]) AS Obs, 
      TypesClasses.RefTypeClasse
   FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.inscrit)=True) AND ((Elèves.StatutElève)<>False))
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
      const resultat = functions_main.fusionnerTableaux(sqlResult1, sqlResult2, 'MoyG1')
      const contentsArray = resultat.map((item: IChp_A_2_2, i: number) => {
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
          c10: nv(item.Appreciations),
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
      console.log(`err => chp2_1_liste_des_eleves_affectes_et_non`);
      return reject(err);
    }
  });
};

const chp2_2_liste_des_eleves_affectes = () => {
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
      Classes.RefClasse, 
      Classes.ClasseLong, 
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
      IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2, 
      Elèves.LV2 AS Lang, 
      T_Notes.MOYG1 AS MoyG1, 
      Elèves.LieuNaiss,
      Notes.RangG1, 
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      '' AS NumDeciAffect, 
      IIf(IsNull([Elèves].[Obs]),"",[Elèves].[Obs]) AS Obs, 
      TypesClasses.RefTypeClasse
FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.inscrit)=True) AND ((Elèves.StatutElève)=1))
ORDER BY Classes.OrdreClasse, Niveaux.RefNiveau, Classes.RefClasse, [NomElève] & " " & [PrénomElève]`;
      const sqlResult2 = await fetchFromMsAccess<IChp_A_2_2[]>(sql2, appCnx);
      if (sqlResult2.length === 0) return resolve([
        {
          label: '',
          obj: { classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);
      const resultat = functions_main.fusionnerTableaux(sqlResult1, sqlResult2, 'MoyG1')
      const contentsArray = resultat.map((item: IChp_A_2_2, i: number) => {
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
          c10: nv(item.Appreciations),
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
      console.log(`err => chp2_2_liste_des_eleves_affectes`);
      return reject(err);
    }
  });
};

const chp3_A_liste_des_eleves_ayant_beneficie_de_transfert = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Classes.RefClasse, 
      TypesClasses.RefTypeClasse, 
      Elèves.MatriculeNational, [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Elèves.EtsOrig, 
      Classes.ClasseCourt, 
      Elèves.N°Transf AS NumTransfert
      FROM Nationalités RIGHT JOIN (Niveaux INNER JOIN (TypesClasses INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Nationalités.CODPAYS = Elèves.Nat
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Transféré)=Yes))
      ORDER BY Classes.RefClasse, TypesClasses.RefTypeClasse, [NomElève] & " " & [PrénomElève], Classes.ClasseCourt;
      `;
      const sqlResult = await fetchFromMsAccess<IChp_B_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_B_2, index: number) => {
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
      console.log(`err => chp3_A_liste_des_eleves_ayant_beneficie_de_transfert`);
      return reject(err);
    }
  });
};

const chp3_D_pyramides = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 5 AS orderby, "T" AS label, 
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
HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1))`;
      const sqlResult = await fetchFromMsAccess<IChp2_5[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_5) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_D_pyramides`);
      return reject(err);
    }
  });
};

const chp3_E_liste_boursiers_et_demi_boursiers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Niveaux.RefNiveau, 
      Niveaux.NiveauCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      IIf([Sexe]=1,"M","F") AS Genre, 
      Format([DateNaiss],"Short Date") AS DateNais, 
      Elèves.LieuNaiss, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      T_Notes.MoyG1, 
      Notes.RangG1, 
      IIf([Bourse]="BE","BE","1/2B") AS Regime, 
      Classes.ClasseCourt
      FROM ((((TypesClasses INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) INNER JOIN T_Notes ON (TypesClasses.RefTypeClasse = T_Notes.RefTypeClasse) AND (Elèves.RefElève = T_Notes.RefElève)) INNER JOIN Notes ON T_Notes.RefElève = Notes.RefElève
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Bourse) Is Not Null))
      ORDER BY Niveaux.RefNiveau;
                      `;
      const sqlResult = await fetchFromMsAccess<IChp3_E[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_E, i: number) => {
        return {
          c0: i + 1,
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
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_E_liste_boursiers_et_demi_boursiers`);
      return reject(err);
    }
  });
};

const chp3_F_tableau_recapitulatif_des_eleves_affectes_et_non_par_genre_et_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
          SELECT 1 AS orderby, "F" AS label, 
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
          SELECT 2 AS orderby, "G" AS label, 
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
          SELECT 5 AS orderby, "T" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
          FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
          HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
          FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
          GROUP BY Elèves.Inscrit, TypesClasses.filière
          HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));  
         `;
      const sqlResult = await fetchFromMsAccess<IChp2_5[]>(sql, appCnx);
      const isEmpty = {
        row1: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        row2: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        row3: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };

      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_5) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          ...items,
        };
      });
      const row = contentsArray;
      const row1 = Object.values(row[0]);
      const row2 = Object.values(row[1]);
      const row3 = Object.values(row[2]);
      const rows = { row1, row2, row3 };
      const result = [rows];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp3_F_tableau_recapitulatif_des_eleves_affectes_et_non_par_genre_et_par_niveau`);
      return reject(err);
    }
  });
};

const chp3_F_1_synthese = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, "T" AS label, 
      Count(IIf([Niveaux].[Cycle]="1er Cycle" And [Elèves].[Sexe]=2,1,Null)) AS _FillePremierCycle, 
      Count(IIf([Niveaux].[Cycle]="1er Cycle" And [Elèves].[Sexe]=1,1,Null)) AS _GarçonPremierCycle, 
      Val([_FillePremierCycle]+[_GarçonPremierCycle]) AS ST1, 
      Count(IIf([Niveaux].[Cycle]="2nd Cycle" And [Elèves].[Sexe]=2,1,Null)) AS _FilleSecondCycle, 
      Count(IIf([Niveaux].[Cycle]="2nd Cycle" And [Elèves].[Sexe]=1,1,Null)) AS _GarçonSecondCycle, 
      Val([_FilleSecondCycle]+[_GarçonSecondCycle]) AS ST2, 
      Val([_FillePremierCycle]+[_FilleSecondCycle]) AS TotalFille, 
      Val([_GarçonPremierCycle]+[_GarçonSecondCycle]) AS TotalGarçon, 
      Val([TotalFille]+[TotalGarçon]) AS EffectifTotal
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
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_F_1_synthese`);
      return reject(err);
    }
  });
};


const chp3_G_tableau_recapitulatif_des_eleves_affectes_par_genre_et_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, "F" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((Elèves.Sexe)=2) AND ((Elèves.StatutElève)=1));
          UNION ALL 
          SELECT 2 AS orderby, "G" AS label, 
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
          SELECT 5 AS orderby, "T" AS label, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, 
          Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
          FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse HAVING RefTypeClasse=5) AS _2ndA, 
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
GROUP BY Elèves.Inscrit, TypesClasses.filière, Elèves.StatutElève
HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1) AND ((Elèves.StatutElève)=1))`;
      const sqlResult = await fetchFromMsAccess<IChp2_5[]>(sql, appCnx);
      const isEmpty = {
        row1: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        row2: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        row3: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_5) => {
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
      const rows = { row1, row2, row3 };
      const result = [rows];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp3_G_tableau_recapitulatif_des_eleves_affectes_par_genre_et_par_niveau`);
      return reject(err);
    }
  });
};

const chp3_G_1_synthese = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, "T" AS label, 
      Count(IIf([Niveaux].[Cycle]="1er Cycle" And [Elèves].[Sexe]=2,1,Null)) AS _FillePremierCycle, 
      Count(IIf([Niveaux].[Cycle]="1er Cycle" And [Elèves].[Sexe]=1,1,Null)) AS _GarçonPremierCycle, 
      Val([_FillePremierCycle]+[_GarçonPremierCycle]) AS ST1, 
      Count(IIf([Niveaux].[Cycle]="2nd Cycle" And [Elèves].[Sexe]=2,1,Null)) AS _FilleSecondCycle, 
      Count(IIf([Niveaux].[Cycle]="2nd Cycle" And [Elèves].[Sexe]=1,1,Null)) AS _GarçonSecondCycle, 
      Val([_FilleSecondCycle]+[_GarçonSecondCycle]) AS ST2, 
      Val([_FillePremierCycle]+[_FilleSecondCycle]) AS TotalFille, 
      Val([_GarçonPremierCycle]+[_GarçonSecondCycle]) AS TotalGarçon, 
      Val([TotalFille]+[TotalGarçon]) AS EffectifTotal
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière, Elèves.StatutElève
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1) AND ((Elèves.StatutElève)=1));      
`;
      const sqlResult = await fetchFromMsAccess<IChp2_5[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_5) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_G_1_synthese`);
      return reject(err);
    }
  });
};

// 
const chp4_A_1_liste_personnel_enseignant_par_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Sexe AS Genre, 
      Diplomes.NomDiplome, 
      Personnel.N°AutEnseigner AS NumAuth, 
      Personnel.VolumeHoraire, 
      Personnel.N°CNPS AS NumCnps, 
      Matières.MatCourt AS Discipline, 
      Personnel.CelPers AS Contact, 
      Personnel.TélPers, 
      TypePersonnel.LibelleTypePers, 
      Fonction.Fonction, 
      Groupe.RefGroupePers, 
      Corps.NomCorps, 
      Personnel.RefTypePers, 
      IIf([Personnel].[Matricule] Is Not Null And [Personnel].[RefTypePers]=2,"Vacataire","") AS VacataireFonct, 
      IIf([Personnel].[RefTypePers]=3 And [Personnel].[Matricule] Is Null,"Permanent","") AS PrivePermanent, 
      IIf([Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=2,"Vacataire","") AS VacatairePrives
      FROM (((Groupe INNER JOIN (Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) ON Groupe.RefGroupePers = Fonction.Groupe) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers
      WHERE (((Groupe.RefGroupePers)=2))
      GROUP BY [Personnel.NomPers] & " " & [Personnel.PrénomPers], Personnel.Sexe, Diplomes.NomDiplome, Personnel.N°AutEnseigner, Personnel.VolumeHoraire, Personnel.N°CNPS, Matières.MatCourt, Personnel.CelPers, Personnel.TélPers, TypePersonnel.LibelleTypePers, Fonction.Fonction, Groupe.RefGroupePers, Corps.NomCorps, Personnel.RefTypePers, IIf([Personnel].[Matricule] Is Not Null And [Personnel].[RefTypePers]=2,"Vacataire",""), IIf([Personnel].[RefTypePers]=3 And [Personnel].[Matricule] Is Null,"Permanent",""), IIf([Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=2,"Vacataire","");
              `;
      const sqlResult = await fetchFromMsAccess<IChp4_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_A_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.Genre),
          c3: nv(item.NomDiplome),
          c4: nv(item.VacataireFonct),
          c5: nv(item.PrivePermanent),
          c6: nv(item.VacatairePrives),
          c7: nv(item.VolumeHoraire),
          c8: nv(item.NumCnps),
          c9: nv(item.NumAuth),
          c10: nv(item.Discipline),
          c11: nv(item.Contact),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err =>chp4_B_1_liste_personnel_enseignant_par_discipline`);
      return reject(err);
    }
  });
};


const chp4_A_2_synthese_situation_des_enseignant_par_type_de_contrat = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Count(IIf([Personnel].[Sexe]="F" And [Personnel].[RefTypePers]=3 And [Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=3,1,Null)) AS PrivePermanent, 
      Count(IIf([Personnel].[Sexe]="F" And [Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=2,1,Null)) AS VacatairePrives, 
      [PrivePermanent]+[VacatairePrives] AS Total, 
      Count(IIf([Niveaux].[cycle]="1er Cycle",1,Null)) AS EnseignantPremierCycle, 
      Count(IIf([Niveaux].[cycle]="2nd Cycle",1,Null)) AS EnseignantSecondCycle, 
      [EnseignantPremierCycle]+[EnseignantSecondCycle] AS TotalCycle, 
      Count(IIf([Personnel].[Sexe]="F",1,Null)) AS FemmeProf, 
      Count(IIf([Personnel].[Sexe]="M",1,Null)) AS HommeProf, 
      [FemmeProf]+[HommeProf] AS TotalEnseignant, 
      Count(IIf([Personnel].[Sexe]="F" And [Personnel].[N°AutEnseigner]<>"",1,Null)) AS FemmeAutorise, 
      Count(IIf([Personnel].[Sexe]="M" And [Personnel].[N°AutEnseigner]<>"",1,Null)) AS HommeAutorise, 
      [FemmeAutorise]+[HommeAutorise] AS TotalProfAutorise, 
      Count(IIf([Personnel].[Sexe]="F" And [Personnel].[N°AutEnseigner]<>"" And [Fonction].[RefFonction]=3,1,Null)) AS DirecteurFemmeAutorise, 
      Count(IIf([Personnel].[Sexe]="M" And [Personnel].[N°AutEnseigner]<>"" And [Fonction].[RefFonction]=3,1,Null)) AS DirecteuHommeAutorise, 
      [DirecteurFemmeAutorise]+[DirecteuHommeAutorise] AS TotalDirecteurAutorise
FROM Niveaux INNER JOIN (TypesClasses INNER JOIN ((Fonction INNER JOIN (Matières INNER JOIN Personnel ON Matières.RefMatière = Personnel.RefMatière) ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) ON TypesClasses.RefTypeClasse = Personnel.RefTypePers) ON Niveaux.RefNiveau = TypesClasses.Niveau
GROUP BY Fonction.RefFonction, Personnel.fil_gen
HAVING (((Fonction.RefFonction)=6) AND ((Personnel.fil_gen)=True));
`;
      const sqlResult = await fetchFromMsAccess<IChp2_5[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };

      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_5) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_A_2_synthese_situation_des_enseignant_par_type_de_contrat`);
      return reject(err);
    }
  });
};

const chp4_A_3_enseignant_par_discipline = () => {
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
Count(IIf([Personnel].[RefMatière]=21 And [Personnel].[Corps] In (2,17),1,Null)) AS RELIGION1, 
Count(IIf([Personnel].[RefMatière]=21 And [Personnel].[Corps] In (1,17),1,Null)) AS RELIGION2, 
Val([FR1]+[HG1]+[ANG1]+[PHILO1]+[ALL1]+[ESP1]+[MATHS1]+[SVT1]+[EDHC1]+[AP1]+[SP1]+[EPS1]+[INFOR1]+[RELIGION1]) AS T1, 
Val([FR2]+[HG2]+[ANG2]+[PHILO2]+[ALL2]+[ESP2]+[MATHS2]+[SVT2]+[EDHC2]+[AP2]+[SP2]+[EPS2]+[INFOR2]+[RELIGION2]) AS T2, 
Val([T1]+[T2]) AS T3
FROM (Corps INNER JOIN Personnel ON Corps.RefCorps = Personnel.Corps) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
GROUP BY Personnel.Fonction
HAVING (((Personnel.Fonction)=6));
              `;
      const sqlResult = await fetchFromMsAccess<IChp3_A_1[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
          "", "", "", "", "", "", "", "", "", "", "", "", "", "","",""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp3_A_1) => {
        return {
          cols: Object.values(item),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_A_3_enseignant_par_discipline`);
      return reject(err);
    }
  });
};

const chp4_A_4_enseignant_par_genre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[Sexe]="F",1,Null)) AS FR1, 
      Count(IIf([Personnel].[RefMatière]=1 And [Personnel].[Sexe]="M",1,Null)) AS FR2, 
      Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[Sexe]="F",1,Null)) AS HG1, 
      Count(IIf([Personnel].[RefMatière]=3 And [Personnel].[Sexe]="M",1,Null)) AS HG2, 
      Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[Sexe]="F",1,Null)) AS ANG1, 
      Count(IIf([Personnel].[RefMatière]=4 And [Personnel].[Sexe]="M",1,Null)) AS ANG2, 
      Count(IIf([Personnel].[RefMatière]=2 And [Personnel].[Sexe]="F",1,Null)) AS PHILO1, 
      Count(IIf([Personnel].[RefMatière]=2 And [Personnel].[Sexe]="M",1,Null)) AS PHILO2, 
      Count(IIf([Personnel].[RefMatière]=5 And [Personnel].[Sexe]="F",1,Null)) AS ALL1, 
      Count(IIf([Personnel].[RefMatière]=5 And [Personnel].[Sexe]="M",1,Null)) AS ALL2, 
      Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="F",1,Null)) AS ESP1, 
      Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="M",1,Null)) AS ESP2, 
      Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[Sexe]="F",1,Null)) AS MATHS1, 
      Count(IIf([Personnel].[RefMatière]=7 And [Personnel].[Sexe]="M",1,Null)) AS MATHS2, 
      Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[Sexe]="F",1,Null)) AS SVT1, 
      Count(IIf([Personnel].[RefMatière]=9 And [Personnel].[Sexe]="M",1,Null)) AS SVT2, 
      Count(IIf([Personnel].[RefMatière]=13 And [Personnel].[Sexe]="F",1,Null)) AS EDHC1, 
      Count(IIf([Personnel].[RefMatière]=13 And [Personnel].[Sexe]="M",1,Null)) AS EDHC2, 
      Count(IIf([Personnel].[RefMatière]=10 And [Personnel].[Sexe]="F",1,Null)) AS AP1, 
      Count(IIf([Personnel].[RefMatière]=10 And [Personnel].[Sexe]="M",1,Null)) AS AP2, 
      Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[Sexe]="F",1,Null)) AS SP1, 
      Count(IIf([Personnel].[RefMatière]=8 And [Personnel].[Sexe]="M",1,Null)) AS SP2, 
      Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="F",1,Null)) AS EPS1, 
      Count(IIf([Personnel].[RefMatière]=6 And [Personnel].[Sexe]="M",1,Null)) AS EPS2, 
      Count(IIf([Personnel].[RefMatière]=15 And [Personnel].[Sexe]="F",1,Null)) AS INFOR1, 
      Count(IIf([Personnel].[RefMatière]=15 And [Personnel].[Sexe]="M",1,Null)) AS INFOR2, 
      Count(IIf([Personnel].[RefMatière]=21 And [Personnel].[Sexe]="F",1,Null)) AS RELIGION1, 
      Count(IIf([Personnel].[RefMatière]=21 And [Personnel].[Sexe]="M",1,Null)) AS RELIGION2,
    Val([FR1]+[HG1]+[ANG1]+[PHILO1]+[ALL1]+[ESP1]+[MATHS1]+[SVT1]+[EDHC1]+[AP1]+[SP1]+[EPS1]+[INFOR1]+[RELIGION1]) AS T1, 
    Val([FR2]+[HG2]+[ANG2]+[PHILO2]+[ALL2]+[ESP2]+[MATHS2]+[SVT2]+[EDHC2]+[AP2]+[SP2]+[EPS2]+[INFOR2]+[RELIGION2]) AS T2, 
    Val([T1]+[T2]) AS T3
FROM Personnel
WHERE (((Personnel.Fonction)=6));
              `;
      const sqlResult = await fetchFromMsAccess<IChp4_A_4[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
          "", "", "", "", "", "", "", "", "", "", "", "", "", "","",""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp4_A_4) => {
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

const chp4_B_etat_du_personnel_administratif = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Personnel.RefPersonnel, 
      [NomPers] & " " & [PrénomPers] AS NomComplet, Diplomes.NomDiplome, 
      Personnel.Sexe, 
      Fonction.Fonction, 
      Personnel.N°CNPS AS NumCnps, 
      Personnel.N°AutEnseigner AS NumAut, 
      Personnel.TélPers, 
      Personnel.CelPers
      FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) LEFT JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome
      WHERE (((Personnel.Fonction)=3));
              `;
      const sqlResult = await fetchFromMsAccess<IChp4_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_B, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.Sexe),
          c3: nv(item.NomDiplome),
          c4: nv(item.NumCnps),
          c5: nv(item.NumAut),
          c6: nv(item.CelPers),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_B_etat_du_personnel_administratif`);
      return reject(err);
    }
  });
};

const chp4_B_1_synthese_situation_du_personnel_admin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Count(IIf([Personnel].[Sexe]="M" And [Fonction].[RefFonction]=3,1,Null)) AS _DEH, 
      Count(IIf([Fonction].[RefFonction]=3 And [Personnel].[Sexe]="F",1,Null)) AS _DEF, 
      Count(IIf([Personnel].[Sexe]="M" And [Fonction].[RefFonction]=35,1,Null)) AS _SousDEH, 
      Count(IIf([Personnel].[Sexe]="F" And [Fonction].[RefFonction]=35,1,Null)) AS _SousDEF, 
      Count(IIf([Personnel].[Sexe]="M" And [Fonction].[RefFonction]=8,1,Null)) AS _EDUCH, 
      Count(IIf([Personnel].[Sexe]="F" And [Fonction].[RefFonction]=66,1,Null)) AS _EDUCF, 
      Count(IIf([Personnel].[Sexe]="M" And [Fonction].[RefFonction]=10,1,Null)) AS _SECRH, 
      Count(IIf([Personnel].[Sexe]="F" And [Fonction].[RefFonction]=10,1,Null)) AS _SECRF, 
      Count(IIf([Personnel].[Sexe]="M" And [Fonction].[RefFonction]=5,1,Null)) AS _ECONH, 
      Count(IIf([Personnel].[Sexe]="F" And [Fonction].[RefFonction]=5,1,Null)) AS _ECONF, 
      Count(IIf([Personnel].[Sexe]="M" And [Fonction].[RefFonction]=14,1,Null)) AS _GARDIENH, 
      Count(IIf([Personnel].[Sexe]="F" And [Fonction].[RefFonction]=14,1,Null)) AS _GARDIENF, 
      Count(IIf([Personnel].[Sexe]="M" And [Fonction].[RefFonction]=33,1,Null)) AS _INFORH, 
      Count(IIf([Personnel].[Sexe]="F" And [Fonction].[RefFonction]=33,1,Null)) AS _INFORF, 
      0 AS _AutreH, 
      0 AS _AutreF, 
      Val([_DEH]+[_SousDEH]+[_EDUCH]+[_SECRH]+[_ECONH]+[_GARDIENH]+[_INFORH]+[_AutreH]) AS _TOTALH, 
      Val([_DEF]+[_SousDEF]+[_EDUCF]+[_SECRF]+[_ECONF]+[_GARDIENF]+[_INFORF]+[_AutreF]) AS _TOTALF, 
      [_TOTALH]+[_TOTALF] AS _TOTAL
FROM Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction
GROUP BY Personnel.fil_gen
HAVING (((Personnel.fil_gen)=True));
`;
      const sqlResult = await fetchFromMsAccess<IChp2_5[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_5) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_B_1_synthese_situation_du_personnel_admin`);
      return reject(err);
    }
  });
};

/////////////////////////////////////////////////

//************ fin rapport1  ***************
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
        logo1,
        boitepostale
      } = await paramEtabObjet([
        "anscol1",
        "nometab",
        "codeetab",
        "teletab",
        "emailetab",
        "titrechefetab",
        "nomchefetab",
        "drencomplet",
        "logo1",
        "boitepostale",
      ]);

      const page_1 = await pageGarde();
      const identite = await Identite();
      const chp2_1 = await chp2_1_liste_des_eleves_affectes_et_non()
      const chp2_2 = await chp2_2_liste_des_eleves_affectes()
      const chp3_A = await chp3_A_liste_des_eleves_ayant_beneficie_de_transfert()
      const chp3_D = await chp3_D_pyramides()
      const chp3_E = await chp3_E_liste_boursiers_et_demi_boursiers()
      const chp3_F = await chp3_F_tableau_recapitulatif_des_eleves_affectes_et_non_par_genre_et_par_niveau()
      const chp3_F_1 = await chp3_F_1_synthese()
      const chp3_G = await chp3_G_tableau_recapitulatif_des_eleves_affectes_par_genre_et_par_niveau()
      const chp3_G_1 = await chp3_G_1_synthese()
      const chp4_A_1 = await chp4_A_1_liste_personnel_enseignant_par_discipline()
      const chp4_A_2 = await chp4_A_2_synthese_situation_des_enseignant_par_type_de_contrat()
      const chp4_A_3 = await chp4_A_3_enseignant_par_discipline()
      const chp4_A_4 = await chp4_A_4_enseignant_par_genre()
      const chp4_B = await chp4_B_etat_du_personnel_administratif()
      const chp4_B_1 = await chp4_B_1_synthese_situation_du_personnel_admin()
      const result = {
        ...data,
        name_report: "prive_secondairegeneral_mankono_rapportrentree",
        path_report: "prive/secondaire-general/mankono",
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
        boitepostale,
        logo1,
        chp2_1,
        chp2_2,
        chp3_A,
        chp3_D,
        chp3_E,
        chp3_F,
        chp3_F_1,
        chp3_G,
        chp3_G_1,
        chp4_A_1,
        chp4_A_2,
        chp4_A_3,
        chp4_A_4,
        chp4_B,
        chp4_B_1,
      }
      resolve(result);
    } catch (err: any) {
      return reject(err);
    }
  });
};

export default {
  rapport,
};
