import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../../../../../../../databases/accessDB";

import _ from "lodash";

import {
  IChp2_A_1,
  IChp1_A_2,
  IChp1_A_3_a,
  IChp1_A_3_b,
  IChp1_B_2,
  IChp2_C,
  IChp3_B,
  IChp3_A,
  IChp4_A_1,
  IChp2_D,
  IChp1_B_1_b,
  IChp1_A_4_a,
  IChp1_A_4_c,
  IChp1_A_4_d,
  IChp1_B_1,
  IChp1_B_3,
  IChp2_A_2,
  IChp2_B,
  IChp4_B,
  IChp3_D,
} from "./interfaces";
const fs = require("fs");
const _ = require("lodash");
import functions_main, { convertirFormatDate } from "../../../../utils";

//la couleur du font des cellules du TOTAL de certains Tableau : ex: 1 Résultats des non affectés par niveau et par classe
//https://www.color-name.com/
const bg = { c1: "#EBEBEB", c2: "##E3E3E3" };
const nv = (data: any) => {
  return data === null || data === "null" ? "" : data;
};

//if item is true or false return X or ""
const tf = (item: any) => {
  return {
    true: item == true ? "X" : "",
    false: item == false ? "X" : "",
  };
};

/* objectif: somme total de filles et garçons par niveau
 * utilisation: chp1_B_1_a
 */
const addTGFRow = (data) => {
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
          const isT = colItemIndex > 0 && [4, 6, 8,9].includes(colIndex)
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
      if (colItem.genre === "G") {
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
      if (formatedCols[0].genre === "G") {
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


//*** debut rapport1  ***

//  la table doc_numerique est vide et il manque une table ( nombre)
const chp1_A_2_documents_pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      doc_numerique.id_doc, 
      doc_numerique.nom_doc AS NomDoc,
      " " AS NombreDoc
      FROM doc_numerique
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_2) => {
        return {
          c1: item.NomDoc,
          c2: item.NombreDoc,
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
const chp1_A_3_a_liste_des_responsables_ce_et_animateurs_pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
        ' ' AS ResponsableEtab, 
         ' ' AS Discipline
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `
      const sqlResult = await fetchFromMsAccess<IChp1_A_3_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_3_a) => {
        return {
          c1: item.ResponsableEtab,
          c2: item.Discipline,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp1_A_3_a_1_liste_des_responsables_ce_et_animateurs_pedagogiques`
      );
      return reject(err);
    }
  });
};

/**
 *  ce tableau n'est pas encore cree dans SPIDER
 * nous avons utiliser la table eleves par defaut
 */
const chp1_A_3_b_tableau_recapitulatif_des_activites_des_ce = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
      ' ' AS Activite,
      ' ' AS Theme, 
         ' ' AS Discipline,
         ' ' AS Lieu,
         ' ' AS Heure
         FROM Elèves  
         WHERE Elèves.inscrit=true
         `;
      //  WHERE RefElève=0
      const sqlResult = await fetchFromMsAccess<IChp1_A_3_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_3_b) => {
        return {
          c1: item.Activite,
          c2: item.Theme,
          c3: item.Discipline,
          c4: item.Lieu,
          c5: item.Heure,
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

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_4_a_Chef_d_etablissement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      tbl_visit.type_visit AS typeVisiteur, 
      Fonction.Fonction AS Visiteur, 
      [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomCompletProf, 
      Fonction.Fonction, 
      tbl_visit.date_visit AS Dates, 
      tbl_visit.heure_visit AS Heures, 
      Classes.ClasseCourt AS Classe, 
      Personnel.Fonction, 
      classe_matieres_TMP.MatLong AS Discipline, 
      TypesClasses.RefTypeClasse
      FROM (classe_matieres_TMP INNER JOIN (Fonction INNER JOIN (((Personnel INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers) INNER JOIN tbl_visit ON Personnel.RefPersonnel = tbl_visit.id_pers) INNER JOIN Classes ON tbl_visit.id_classe = Classes.RefClasse) ON Fonction.RefFonction = Personnel.Fonction) ON classe_matieres_TMP.RefMatière = Personnel.RefMatière) INNER JOIN TypesClasses ON classe_matieres_TMP.RefTypeClasse = TypesClasses.RefTypeClasse
      WHERE (((Personnel.Fonction)=6) AND ((TypesClasses.RefTypeClasse)<14)); 
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_4_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_4_a, index: number) => {
        return {
          c1: nv(item.Visiteur),
          c2: nv(item.NomCompletProf),
          c3: nv(item.Discipline),
          c4: convertirFormatDate(item.Dates),
          c5: nv(item.Heures),
          c6: nv(item.Classe),
        };
      });
      // console.log("🚀 ~ file: functions.ts:359 ~ returnnewPromise ~ contentsArray:", contentsArray)
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
const chp1_A_4_b_Animateurs_et_conseillers_pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Fonction.Fonction AS Visiteur, 
      [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomCompletProf, 
      Matières.MatLong AS Discipline, 
      Classes.ClasseCourt AS Classe, 
      tbl_visit.date_visit AS Dates, 
      tbl_visit.heure_visit AS Heures, 
      TypesClasses.RefTypeClasse
      FROM (Classes INNER JOIN (Fonction INNER JOIN ((Personnel INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) 
      INNER JOIN tbl_visit ON Personnel.RefPersonnel = tbl_visit.id_pers) ON Fonction.RefFonction = Personnel.Fonction) ON Classes.RefClasse = tbl_visit.id_classe) 
      INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse
      WHERE (((Fonction.RefFonction)=48) AND ((TypesClasses.RefTypeClasse)<14));
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_4_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_4_a, index: number) => {
        return {
          c1: nv(item.nomVisiteur),
          c2: nv(item.NomCompletProf),
          c3: nv(item.Discipline),
          c4: nv(item.Dates),
          c5: nv(item.Heures),
          c6: nv(item.Classe),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_4_b_Animateurs_et_conseillers_pedagogiques`);
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_4_c_Inspecteurs = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Fonction.Fonction AS Visiteur, 
      [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomCompletProf, 
      Matières.MatLong AS Discipline, 
      Classes.ClasseCourt AS Classe, 
      tbl_visit.date_visit AS Dates, 
      tbl_visit.heure_visit AS Heures, 
      TypesClasses.RefTypeClasse
      FROM (Classes INNER JOIN (Fonction INNER JOIN ((Personnel INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) INNER JOIN tbl_visit ON Personnel.RefPersonnel = tbl_visit.id_pers) ON Fonction.RefFonction = Personnel.Fonction) ON Classes.RefClasse = tbl_visit.id_classe) INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse
      WHERE (((Fonction.RefFonction)=7) AND ((TypesClasses.RefTypeClasse)<14));
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_4_c[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_4_c, index: number) => {
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
      console.log(`err => chp1_A_5_c_Inspecteurs`);
      return reject(err);
    }
  });
};

/**
 * La table n'est pas encore implementé dans spider nous avons utiliser la matiere par defaut
 */
const chp1_A_4_d_Formations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
      ' ' AS Discipline, 
      ' ' AS DateFormation, 
      ' ' AS ThemeEtLieu,
      ' ' AS Activite
      FROM Personnel 
      INNER JOIN Matières 
      ON Personnel.RefMatière = Matières.RefMatière
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_4_d[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_4_d, index: number) => {
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


// B
const chp1_B_1_a_tableaux_statistiques_des_resultats_scolaire_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, 1 AS orderby, Classes.OrdreClasse, Classes.ClasseCourt, Niveaux.NiveauCourt, "#FFFF" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Classes.OrdreClasse, Classes.ClasseCourt, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY 1, 2, 3;
      UNION ALL
      SELECT First(Niveaux.RefNiveau) AS RefNiveau, 2 AS orderby, First(Classes.OrdreClasse) AS OrdreClasse, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Niveaux.NiveauCourt, "#E3E3E3" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY 1, 2, 3;
             `;
      const isEmpty = {
        bg: "#FFFF",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""]
      }
      const sqlResult = await fetchFromMsAccess<IChp1_B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_1) => {
        const items = _.omit(item, ["RefNiveau","orderby","OrdreClasse","ClasseCourt","NiveauCourt","bg","genre"]);
        return {
          bg:item.bg,
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
      const groupeContents =await functions_main.formatGroupeByLabel(contentsArray);    
      const result1 = await addTGFRow(groupeContents);

      const result2 = await result1.map((item: any) => {
        return {
          label: item.NiveauCourt,
          classe: item.label,
          cols: item.cols,
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

const chp1_B_1_b_recapitulatif_des_resultats_des_eleves_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      
      let sql = `SELECT Niveaux.RefNiveau, 1 AS orderby, Niveaux.NiveauCourt AS label, Niveaux.NiveauCourt, "#FFFF" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
                FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
                GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.Sexe
                HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
                ORDER BY 1, 2;
                UNION ALL
                SELECT Niveaux.RefNiveau, 2 AS orderby, First(Niveaux.NiveauCourt) AS label, "Total " & First([Niveaux].[NiveauCourt]) AS NiveauCourt, "#E3E3E3" AS bg, "T" AS genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
                FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
                GROUP BY Niveaux.RefNiveau, TypesClasses.filière, Elèves.inscrit
                HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
                ORDER BY 1, 2;   
                UNION ALL
                SELECT 8 AS RefNiveau, 1 AS orderby, "TOTAL" AS label, "TOTAL ETABL." AS NiveauCourt, "#E3E3E3" AS bg, IIf([Elèves].[Sexe]=1,"G","F") AS Genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
                FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
                WHERE (((TypesClasses.filière)=1))
                GROUP BY Elèves.inscrit, Elèves.Sexe
                HAVING (((Elèves.inscrit)=Yes))
                ORDER BY 1, 2;
                UNION ALL SELECT 8 AS RefNiveau, 2 AS orderby, "TOTAL" AS label, "TOTAL ETABL." AS NiveauCourt, "#E3E3E3" AS bg, "T" AS Genre, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
                FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
                WHERE (((TypesClasses.filière)=1))
                GROUP BY Elèves.inscrit
                HAVING (((Elèves.inscrit)=Yes))
                ORDER BY 1, 2;
                 `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_b) => {
        const items = _.omit(item, ["RefNiveau","orderby","label","NiveauCourt","bg","genre"]);
        return {
          bg:item.bg,
          label: item.label,
          NiveauCourt:item.NiveauCourt,
          cols: [
            {
              genre: item.genre,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const result = functions_main.formatGroupeByLabel(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_b_recapitulatif_des_resultats_des_eleves_par_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_2_liste_nominative = () => {
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

      let sql2 =`
      SELECT Classes.OrdreClasse, 
      TypesClasses.RefTypeClasse, 
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
      T_Notes.MOYG2 AS MoyG2, 
      Notes.RangG2, '-' AS MS, 
      (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, 
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, " " AS NumDeciAffect, 
      IIf(IsNull(Elèves.Obs),"",Elèves.Obs) AS Obs, (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ
       FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.inscrit)=True) AND ((Elèves.StatutElève)<>False))
       ORDER BY Classes.OrdreClasse, Niveaux.RefNiveau, Classes.RefClasse, [NomElève] & " " & [PrénomElève];
      `;
      const sqlResult2 = await fetchFromMsAccess<IChp1_B_2[]>(sql2, appCnx);
      // console.log("🚀 ~ file: functions.ts:645 ~ returnnewPromise ~ sqlResult2:", sqlResult2)
      if (sqlResult2.length === 0) return resolve([
        {
          label: '',
          obj: {classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);
      const resultat = functions_main.fusionnerTableaux(sqlResult1, sqlResult2, 'MoyG2')
      const contentsArray = resultat.map((item: IChp1_B_2, i: number) => {
        return {
          c0: i+1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNaiss),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.StatutEleve),
          c8: nv(item.NumDeciAffect),
          c9:  nv(item.Lang2),
          c10: nv(item.MoyG2),
          c11: nv(item.RangG2),
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
    resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_2_liste_nominative`);
      return reject(err);
    }
  });
};

const chp1_B_3_liste_major_classe_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]) AS RefTypeClasse, 
      T_Notes.MOYG2 AS MoyG2, 
      IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",[NiveauCourt] & " " & [Série]) AS NiveauSerie, 
      Niveaux.NiveauCourt, 
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, Format(DateNaiss,"Short Date") AS DateNais, Int((Date()-[DateNaiss])/365.5) AS Age, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang2, 
      Elèves.LV2 AS Lang,
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, " " AS NumDeciAffect, Notes.RangG2
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]))<14) AND ((Notes.RangG2) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]), T_Notes.MOYG2 DESC , IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",[NiveauCourt] & " " & [Série]), Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_3[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);

     // 1. je recupere les occurences distinctes des refTypeClasse
    //  retourne un seul  ReftypyClasse pour un niveau dans le data
     const distinctRefTypeClasse = _.uniqBy(sqlResult, "RefTypeClasse") as IChp1_B_3[];
     // 2. je parcours les differents RefTypeClasse
     let result1 = [];
     distinctRefTypeClasse.map(x  => {
       // je recupere les élèves du niveau pour chaque RefTypeClasse puis je choisis les 3 premiers objet du tableau
       const currentTypeClasseStudents = sqlResult.filter(student => student.RefTypeClasse === x.RefTypeClasse)
       const troisMajors = currentTypeClasseStudents[0] // je prends de 0  
       result1 = result1.concat(troisMajors)
      });

      const contentsArray = result1.map((item: IChp1_B_3, i: number) => {
        return {
          c0: i+1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNais),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.StatutEleve),
          c8: nv(item.NumDeciAffect),
          c9:  nv(item.Lang2),
          c10: nv(item.MoyG2),
          c11: nv(item.RangG2),
          c12: nv(item.ClasseCourt),
          label:item.NiveauSerie,//obligatoire car on regroupe par label
          obj:{label:item.NiveauSerie},
        };
      });
      // console.log("contentsArray ...", contentsArray)
      // const result = functions_main.groupLabelByGroup(contentsArray);
    //  console.log("result.chp1_B_3 ...",JSON.stringify(result[0]))
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_3_liste_major_classe_par_niveau`);
      return reject(err);
    }
  });
};

//B

const chp2_A_1_liste_transferts = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp2_A_1[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_A_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.MatriculeNational),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Redoub),
          c5: nv(item.DateNaiss),
          c6: nv(item.NumTrans),
          c7: nv(item.Decision),
          c8: nv(item.EtsOrig),
          label:item.NiveauCourt,//obligatoire car on regroupe par label
          obj:{label:item.NiveauCourt},
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup(contentsArray);
    //  console.log("result.chp2_A_1 ...",JSON.stringify(result[0]))
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_A_1_liste_transferts`);
      return reject(err);
    }
  });
};

const chp2_A_2_rapport_1trimestre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT "Effectif" AS label, 
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
      SELECT "Base" AS label, 
      (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=1) AS _6e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=2) AS _5e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=3) AS _4e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=4) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=5) AS _2ndA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=6) AS _2ndC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=7) AS _1ereA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=8) AS _1ereC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=9) AS _1ereD, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse In(10,13)) AS _TleA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=11) AS _TleC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=12) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      
      `;
      const sqlResult = await fetchFromMsAccess<IChp2_A_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_A_2, index: number) => {
        const items = _.omit(item, ["label"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      // console.log("contentsArray.chp2_A_2...", contentsArray)
    //  console.log("result.chp2_A_2 ...",JSON.stringify(contentsArray[0]))
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_A_2_rapport_1trimestre`);
      return reject(err);
    }
  });
};

const chp2_B_repartition_des_eleves_par_annee_de_naissance = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])) AS annee, IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(IIf([Niveaux]![RefNiveau]=1,1,Null)) AS 6e, Count(IIf(Niveaux!RefNiveau=2,1,Null)) AS 5e, Count(IIf(Niveaux!RefNiveau=3,1,Null)) AS 4e, Count(IIf(Niveaux!RefNiveau=4,1,Null)) AS 3e, Val([6e]+[5e]+[4e]+[3e]) AS ST1, Count(IIf(Niveaux!RefNiveau=5 And TypesClasses!Série="A",1,Null)) AS 2ndA, Count(IIf(Niveaux!RefNiveau=5 And TypesClasses!Série="C",1,Null)) AS 2ndC, Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="A",1,Null)) AS 1ereA, Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="C",1,Null)) AS 1ereC, Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="D",1,Null)) AS 1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS TleA, Count(IIf(Niveaux!RefNiveau=7 And TypesClasses!Série="C",1,Null)) AS TleC, Count(IIf(Niveaux!RefNiveau=7 And TypesClasses!Série="D",1,Null)) AS TleD, Val([2ndA]+[2ndC]+[1ereA]+[1ereC]+[1ereD]+[TleA]+[TleC]+[TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])), IIf([Elèves].[Sexe]=2,"F","G"), Elèves.Inscrit, '', TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      UNION ALL
      SELECT "TOTAL DREN" AS annee, IIf([Elèves].[Sexe]=2,"F","G") AS genre, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY IIf([Elèves].[Sexe]=2,"F","G"), Elèves.Sexe;      
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_B) => {
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
      // console.log("result.chp2_B...", result[0]);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_B_repartition_des_eleves_par_annee_de_naissance`);
      return reject(err);
    }
  });
};

const chp2_C_liste_boursiers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT Niveaux.RefNiveau, 
      Niveaux.NiveauCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Classes.ClasseCourt, 
      IIf([Sexe]=1,"M","F") AS Genre, 
      Elèves.Décision AS Decision, 
      IIf([Bourse]="BE","BE","1/2B") AS Regime
      FROM ((TypesClasses INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS
      WHERE (((Elèves.Bourse) Is Not Null))
      ORDER BY Niveaux.RefNiveau, Elèves.Bourse DESC , [NomElève] & " " & [PrénomElève], Classes.OrdreClasse, [NomElève] & " " & [PrénomElève], Elèves.Bourse DESC , TypesClasses.Niveau;    
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_C[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_C, index: number) => {
        return {
          c1: nv(item.NiveauCourt),
          c2: nv(item.MatriculeNational),
          c3: nv(item.NomComplet),
          c4: nv(item.Genre),
          c5: nv(item.ClasseCourt),
          c6: nv(item.Decision),
          c7: nv(item.Regime),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_C_liste_boursiers`);
      return reject(err);
    }
  });
};

const chp2_D_effectif_par_niveau_avec_approche_genre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (1,2,3,4)));
UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau,"#EBEBEB" AS bg, "1er Cycle" AS NiveauCourt, "TOTAL 1er Cycle" AS NiveauSerie, First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, (Select count(*) from Classes Where refTypeClasse in (1,2,3,4)) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse) In (1,2,3,4)));

UNION ALL
SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (5,6)));
UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau,"#EBEBEB" AS bg, "2nde" AS NiveauCourt, "TOTAL 2nde" AS NiveauSerie, First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, (Select count(*) from Classes Where refTypeClasse in (5,6)) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse) In (5,6)));

UNION ALL
SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (7,8,9)));
UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau,"#EBEBEB" AS bg, "1ère" AS NiveauCourt, "TOTAL 1ère" AS NiveauSerie, First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, (Select count(*) from Classes Where refTypeClasse in (7,8,9)) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse) In (7,8,9)));

UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau, "#FFFF" AS bg,"Tle" AS NiveauCourt, "Tle A" AS NiveauSerie, "2nd Cycle" AS CycleX, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse) In (10,13)));
UNION ALL
SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série] AS NiveauSerie, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, [NiveauCourt] & " " & [Série], IIf(IsNull([Cycle]),Null,[cycle]), TypesClasses.RefTypeClasse
HAVING (((TypesClasses.RefTypeClasse) In (11,12)));
UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau,"#EBEBEB" AS bg, "Tle " AS NiveauCourt, "TOTAL Tle" AS NiveauSerie, First(IIf(IsNull([Cycle]),Null,[cycle])) AS CycleX, (Select count(*) from Classes Where refTypeClasse in (10,11,12,13)) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse) In (10,11,12,13)));

UNION ALL
SELECT Last(Niveaux.RefNiveau) AS RefNiveau,"#E3E3E3" AS bg, "Etabliss" AS NiveauCourt, "TOTAL Etabliss" AS NiveauSerie, "Etabliss" AS CycleX, (Select count(*) from Classes Where refTypeClasse<14) AS NbreClasses, Count(IIf([Redoub]=-1 And [SEXE]=2,1,Null)) AS F1, Count(IIf([Redoub]=0 And [SEXE]=2,1,Null)) AS F2, [F1]+[F2] AS T1, Count(IIf([Redoub]=-1 And [SEXE]=1,1,Null)) AS G1, Count(IIf([Redoub]=0 And [SEXE]=1,1,Null)) AS G2, [G1]+[G2] AS T2, [F1]+[G1] AS TT1, [F2]+[G2] AS TT2, [TT1]+[TT2] AS TT3
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
HAVING (((TypesClasses.RefTypeClasse)<14));
     
              `;

       const sqlResult = await fetchFromMsAccess<IChp2_D[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_D) => {
        const items = _.omit(item, ["RefNiveau","bg","NiveauCourt","NiveauSerie","CycleX"]);
        return {
          bg: item.bg,
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      // console.log("result.hp2_D...", contentsArray[5])
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_D_effectif_par_niveau_avec_approche_genre`);
      return reject(err);
    }
  });
};

//CHAPITRE III.	VIE SCOLAIRE
const chp3_A_fonctionnement_du_conseil_interieur = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT tbl_conseil_interieur.membre, tbl_conseil_interieur.fonction, tbl_conseil_interieur.qualite
      FROM tbl_conseil_interieur
      GROUP BY tbl_conseil_interieur.membre, tbl_conseil_interieur.fonction, tbl_conseil_interieur.qualite;
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_A, index: number) => {
        return {
          c1: nv(item.membre),
          c2: nv(item.fonction),
          c3: nv(item.qualite),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_fonctionnement_du_conseil_interieur`);
      return reject(err);
    }
  });
};

const chp3_B_fonctionnement_du_conseil_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT tbl_conseil_discipline.membre, tbl_conseil_discipline.fonction, tbl_conseil_discipline.qualite
      FROM tbl_conseil_discipline
      GROUP BY tbl_conseil_discipline.membre, tbl_conseil_discipline.fonction, tbl_conseil_discipline.qualite;  
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_B, index: number) => {
        return {
          c1: nv(item.membre),
          c2: nv(item.fonction),
          c3: nv(item.qualite),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_B_fonctionnement_du_conseil_discipline`);
      return reject(err);
    }
  });
};

const chp3_D_tableau_recapitulatif_des_cas_sociaux = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT "Tableau récapitulatif des cas sociaux" AS label, 
                (SELECT Count(*) FROM tbl_cs_maladie) AS maladies, 
                (SELECT Count(*) FROM tbl_cs_grossesse) AS grossesses, 
                (SELECT Count(*) FROM tbl_cs_abandon) AS abandons, 
                (SELECT Count(*) FROM tbl_cs_handicap) AS handicaps, 
                (SELECT Count(*) FROM tbl_cs_deces) AS deces
                FROM TypesClasses INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
                GROUP BY Elèves.Inscrit, TypesClasses.Filière
                HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.Filière)=1));
              `;
      const sqlResult = await fetchFromMsAccess<IChp3_D[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_D, index: number) => {
        return {
          c1: nv(item.maladies),
          c2: nv(item.grossesses),
          c3: nv(item.abandons),
          c4: nv(item.handicaps),
          c5: nv(item.deces),
        };
      });
      // console.log("contentsArray...", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_D_tableau_recapitulatif_des_cas_sociaux`);
      return reject(err);
    }
  });
};

//CHAPITRE IV.	PERSONNELS ENSEIGNANT ET ADMINISTRATIF
const chp4_A_1_liste_nominative_du_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      [Personnel.NomPers] & "" & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Matricule, 
      Fonction.Fonction AS discipline, 
      Diplomes.NomDiplome AS emploi, 
      "" AS vacataire, 
      "" AS permanant, 
      Int((Date()-[DateEmbauche])/365.5) AS anciennete, 
      Personnel.SitMatr AS sitmati, 
      Personnel.VolumeHoraire AS volhoraire, 
      Fonction.Groupe
      FROM (Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
      WHERE (((Fonction.Groupe)=2) AND ((Personnel.fil_gen)=True));
              `;
      const sqlResult = await fetchFromMsAccess<IChp4_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_A_1, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.Matricule),
          c3: nv(item.discipline),
          c4: nv(item.emploi),
          c5: nv(item.vacataire),
          c6: nv(item.permanant),
          c7: nv(item.anciennete),
          c8: nv(item.sitmati),
          c9: nv(item.volhoraire),
        };
      });
      // console.log("🚀 ~ file: functions.ts:1118 ~ returnnewPromise ~ contentsArray:", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp4_A_1_liste_nominative_du_personnel_enseignant`
      );
      return reject(err);
    }
  });
};

const chp4_B_liste_du_personnel_administratif = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
                  [Personnel.NomPers] & "" & [Personnel.PrénomPers] AS NomComplet, 
                  Personnel.Matricule, 
                  Diplomes.NomDiplome AS emploi, 
                  Fonction.Fonction AS fonction, 
                  Int((Date()-[DateEmbauche])/365.5) AS anciennete, 
                  Fonction.Groupe
                  FROM (Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
                  WHERE (((Fonction.Groupe)=1) AND ((Personnel.fil_gen)=True));  
              `;
      const sqlResult = await fetchFromMsAccess<IChp4_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_B, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.Matricule),
          c3: nv(item.emploi),
          c4: nv(item.fonction),
          c5: nv(item.anciennete),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp4_B_liste_du_personnel_administratif`
      );
      return reject(err);
    }
  });
};

const chp4_B_1_liste_du_personnel_administratif_et_encadrement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      [Personnel.NomPers] & "" & [Personnel.PrénomPers] AS NomComplet,
       Personnel.Matricule, 
       Diplomes.NomDiplome AS emploi, 
       Fonction.Fonction AS fonction, 
       Int((Date()-[DateEmbauche])/365.5) AS anciennete, 
       Fonction.Groupe
      FROM (Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
      WHERE (((Fonction.Groupe) In (1,3)) AND ((Personnel.fil_gen)=True));  
              `;
      const sqlResult = await fetchFromMsAccess<IChp4_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_B, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.Matricule),
          c3: nv(item.emploi),
          c4: nv(item.fonction),
          c5: nv(item.anciennete),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => const chp4_B_1_liste_du_personnel_administratif_et_encadrement = () => {
          `
      );
      return reject(err);
    }
  });
};

/////////////////////////////////////////////////

//*** fin rapport  ***
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
        logo1
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
      ]);

      const page_1 = await pageGarde();
      const identite = await Identite();

      // Chapitre 1	VIE PEDAGOGIQUE ET RESULTATS SCOLAIRES
      // A
      const chp1_A_2 = await chp1_A_2_documents_pedagogiques();
      const chp1_A_3_a = await chp1_A_3_a_liste_des_responsables_ce_et_animateurs_pedagogiques();
      const chp1_A_3_b = await chp1_A_3_b_tableau_recapitulatif_des_activites_des_ce();
      const chp1_A_4_a = await chp1_A_4_a_Chef_d_etablissement();
      const chp1_A_4_b = await chp1_A_4_b_Animateurs_et_conseillers_pedagogiques();
      const chp1_A_4_c = await chp1_A_4_c_Inspecteurs();
      const chp1_A_4_d = await chp1_A_4_d_Formations();

      // B
      const chp1_B_1_a = await chp1_B_1_a_tableaux_statistiques_des_resultats_scolaire_par_niveau(); 
      const chp1_B_1_b = await  chp1_B_1_b_recapitulatif_des_resultats_des_eleves_par_niveau(); 
      // const chp1_B_2_a = await chp1_B_2_liste_nominative("=1"); //Elèves affectés
      // console.log("🚀 ~ file: functions.ts:1240 ~ returnnewPromise ~ chp1_B_2_a:", chp1_B_2_a)
      // const chp1_B_2_b = await chp1_B_2_liste_nominative("=2"); //Elèves non affectés
      const chp1_B_2_c = await chp1_B_2_liste_nominative(); //Elèves affectés et non affectés
      const chp1_B_3 = await chp1_B_3_liste_major_classe_par_niveau(); //Elèves affectés et non affectés

    //CHAPITRE II.	EFFECTIFS ET PYRAMIDES

    //A
    const chp2_A_1 = await chp2_A_1_liste_transferts();
    const chp2_A_2 = await chp2_A_2_rapport_1trimestre();
    const chp2_B = await chp2_B_repartition_des_eleves_par_annee_de_naissance();
    const chp2_C = await chp2_C_liste_boursiers();
    const chp2_D = await chp2_D_effectif_par_niveau_avec_approche_genre();

    //CHAPITRE III.	VIE SCOLAIRE
    //A
    const chp3_A = await chp3_A_fonctionnement_du_conseil_interieur();
    const chp3_B = await chp3_B_fonctionnement_du_conseil_discipline();
    const chp3_D = await chp3_D_tableau_recapitulatif_des_cas_sociaux();

    //CHAPITRE IV.	PERSONNELS ENSEIGNANT ET ADMINISTRATIF
    const chp4_A_1 = await chp4_A_1_liste_nominative_du_personnel_enseignant();
    const chp4_B = await chp4_B_liste_du_personnel_administratif();
    const chp4_B_1 = await chp4_B_1_liste_du_personnel_administratif_et_encadrement();

      const result = {
        ...data,
        name_report: "prive_secondairegeneral_korhogo_2trimestre",
        path_report: "prive/secondaire-general/korhogo",
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
        logo1,
        chp1_A_2,
        chp1_A_3_a,
        chp1_A_3_b,
        chp1_A_4_a,
        chp1_A_4_b,
        chp1_A_4_c,
        chp1_A_4_d,
        chp1_B_1_a,
        chp1_B_1_b,
        // chp1_B_2_a,
        // chp1_B_2_b,
        chp1_B_2_c,
        chp1_B_3,
        
        chp2_A_1,
        chp2_A_2,
        chp2_B,
        chp2_C,
        chp2_D,
        
        chp3_A,
        chp3_B,
        chp3_D,
        
        chp4_A_1,
        chp4_B,
        chp4_B_1,
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
