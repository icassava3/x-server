import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../../../../../../../databases/accessDB";

import _ from "lodash";

import {
  IChp_B_2,
  IChp_A_1_2,
  IChp_A_1_3_1,
  IChp_A_1_3_2,
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
  IChp4_1,
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
        boitepostale: boitepostale,
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
        boitepostale
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


//*** debut rapport1  ***



//  la table doc_numerique est vide et il manque une table ( nombre)
const chp1_A_2_documents_pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
         SELECT 
      doc_numerique.id_doc, 
      doc_numerique.nom_doc AS NomDoc,
      ' ' AS CahierDeText,
      ' ' AS CahierDeNotes,
      ' ' AS CahierDappel,
      " " AS NombreDoc
      FROM doc_numerique
         `;
      const sqlResult = await fetchFromMsAccess<IChp_A_1_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_A_1_2) => {
        return {
          c2: item.CahierDeText,
          c3: item.CahierDeNotes,
          c4: item.CahierDappel,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp_A_1_2_documents_Pédagogiques`);
      return reject(err);
    }
  });
};

//chp1_A  ce table n'est pas encore cree dans SPIDER table eleve utilise par defaut
const chp1_A_3_a_1_liste_des_animateurs_des_unites_pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
        ' ' AS ResponsableEtab, 
         ' ' AS Discipline,
         [NomElève] & " " & [PrénomElève] AS NomComplet, 
         ' ' AS Etab,
         ' ' AS Contact
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp_A_1_3_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_A_1_3_1) => {
        return {
          c1: item.ResponsableEtab,
          c2: item.Discipline,
          c3: item.NomComplet,
          c4: item.Etab,
          c5: item.Contact,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp1_A_3_a_1_liste_des_animateurs_des_unites_pedagogiques`
      );
      return reject(err);
    }
  });
};

/**
 *  ce tableau n'est pas encore cree dans SPIDER
 * nous avons utiliser la table eleves par defaut
 */
const chp1_A_3_a_2_activites_des_unites_pedagogiques = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp_A_1_3_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_A_1_3_2) => {
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
      console.log(`err => chp1_A_3_a_2_activites_des_unites_pedagogiques`);
      return reject(err);
    }
  });
};

// ce tableau n'est pas encore cree dans SPIDER nous avons utilise la table eleve pour afficher les donnees

const chp1_A_3_b_1_liste_des_responsables_des_conseils_d_enseignement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         '' AS Discipline,
         [NomElève] & " " & [PrénomElève] AS Responsable,
         '' AS Emploi, 
         '' AS Contact
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp_A_1_4_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_A_1_4_1) => {
        return {
          c1: item.Discipline,
          c2: item.Responsable,
          c3: item.Emploi,
          c4: item.Contact,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp1_A_3_b_1_liste_des_responsables_des_conseils_d_enseignement`
      );
      return reject(err);
    }
  });
};

// ce tableau n'est pas encore cree dans SPIDER
const chp1_A_3_b_2_activites_des_conseils_d_enseignement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         '' AS Discipline,
         ' ' AS TypeActivite, 
         ' ' AS NombreParticipant,
        ' ' AS Observation
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp_A_1_4_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_A_1_4_2) => {
        return {
          c1: item.Discipline,
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
const chp1_A_4_visite_classe_et_formation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      tbl_visit.type_visit AS typeVisiteur, 
      Personnel.fil_gen, 
      Fonction.Fonction, 
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
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_3_b_2_activites_des_conseils_d_enseignement`);
      return reject(err);
    }
  });
};

const chp4_1_effectif_eleves_affect_et_non_affect = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp4_1[]>(sql, appCnx);

      const isEmpty = {
        label:"",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "","","","",],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp4_1) => {
        const items = _.omit(item, ["label", "orderby"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_1_effectif_eleves_affect_et_non_affect`);
      return reject(err);
    }
  });
};

const chp4_2_effectif_eleves_affectes = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp4_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_1) => {
        const items = _.omit(item, ["label", "orderby"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_2_effectif_eleves_affectes`);
      return reject(err);
    }
  });
};

const chp4_3_repartition_des_eleves_par_annee_de_naissance = () => {
  return new Promise(async (resolve, reject) => {
    try {

      // L'ancienne requête qui prends en compte toute les années des repartition or le seconde en prends en compte que [1997; 2011 et +[ 

      // SELECT IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])) AS Genre, 
      // Count(IIf([Sexe]=1,1,Null)) AS G, 
      // Count(IIf([Sexe]=2,1,Null)) AS F, 
      // Val([G]+[F]) AS T
      // FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      // GROUP BY IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])), Elèves.Inscrit, TypesClasses.filière
      // HAVING (((IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])))) AND ((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));

      let sql = `
      SELECT 
      IIf(IsNull([DateNaiss]),"Inconnue",IIf(Year([DateNaiss])>=1997,Year([DateNaiss]),"1997")) AS Genre, 
      Count(IIf([Sexe]=1,1,Null)) AS G, 
      Count(IIf([Sexe]=2,1,Null)) AS F, 
      Val([G]+[F]) AS T
FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
GROUP BY IIf(IsNull([DateNaiss]),"Inconnue",IIf(Year([DateNaiss])>=1997,Year([DateNaiss]),"1997")), Elèves.Inscrit, TypesClasses.filière
HAVING (((IIf(IsNull([DateNaiss]),"Inconnue",IIf(Year([DateNaiss])>=1997,Year([DateNaiss]),"1997")))<>False) AND ((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1))
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
      const isEmpty = {
        row1: [''],
        row2: [''],
        row3: [''],
        row4: [''],
      };

      if (sqlResult.length === 0) return resolve([isEmpty]);
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
      console.log(`err => chp4_3_repartition_des_eleves_par_annee_de_naissance`);
      return reject(err);
    }
  });
};

const chp4_4_effectif_par_nationalite_avec_approche_genre = () => {
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
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "","","","","",""],
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
      console.log(`err => chp4_4_effectif_par_nationalite_avec_approche_genre`);
      return reject(err);
    }
  });
};

const chp6_2_pyramide_classe_Pedagogique = () => {

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
      console.log(`err => chp6_2_pyramide_classe_Pedagogique`);
      return reject(err);
    }
  });
};

const chp7_2_personnel_enseignant = () => {
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
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp7_2_personnel_enseignant`);
      return reject(err);
    }
  });
};

const chp7_3_statistique_personnel_enseignant = () => {
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
      console.log(`err => chp7_3_statistique_personnel_enseignant`);
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

////////////////////////////////////////////////////////////////////////////////////////

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
        "boitepostale",
      ]);

      const page_1 = await pageGarde();
      const identite = await Identite();

      // Chapitre 1	VIE PEDAGOGIQUE ET RESULTATS SCOLAIRES
      const chp1_A_2 = await chp1_A_2_documents_pedagogiques();
      const chp1_A_3_a_1 = await chp1_A_3_a_1_liste_des_animateurs_des_unites_pedagogiques();
      const chp1_A_3_a_2 =  await chp1_A_3_a_2_activites_des_unites_pedagogiques();
      const chp1_A_3_b_1 = await chp1_A_3_b_1_liste_des_responsables_des_conseils_d_enseignement();
      const chp1_A_3_b_2 = await chp1_A_3_b_2_activites_des_conseils_d_enseignement();
      const chp1_A_4 = await chp1_A_4_visite_classe_et_formation();
      const chp4_1 = await chp4_1_effectif_eleves_affect_et_non_affect();
      const chp4_2 = await chp4_2_effectif_eleves_affectes();
      const chp4_3 = await chp4_3_repartition_des_eleves_par_annee_de_naissance();
      const chp4_4 = await chp4_4_effectif_par_nationalite_avec_approche_genre();
      const chp6_2 = await chp6_2_pyramide_classe_Pedagogique();
      const chp7_2 = await chp7_2_personnel_enseignant();
      const chp7_3 = await chp7_3_statistique_personnel_enseignant();
      const chp8 = await chp8_cas_sociaux();

      const result = {
        ...data,
        name_report: "prive_rentree_issia",
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
        boitepostale,
        chp1_A_2,
        chp1_A_3_a_1,
        chp1_A_3_a_2,
        chp1_A_3_b_1,
        chp1_A_3_b_2,
        chp1_A_4,
        chp4_1,
        chp4_2,
        chp4_3,
        chp4_4,
        chp6_2,
        chp7_2,
        chp7_3,
        chp8
      };
      resolve(result);
    } catch (err: any) {
      return reject(err);
    }
  });
};


export default {
  rapport,
};
