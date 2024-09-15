import { _selectSql } from './../../../../../../databases/index';
import { appCnx, fetchFromMsAccess, paramEtabObjet } from './../../../../../../databases/accessDB';
import {
  IChp1_A_2_a,
  IChp1_A_2_b,
  IChp1_A_3_a,
  IChp1_A_3_b,
  IChp1_A_3_c,
  IChp1_A_4_c,
  IChp_1_B_1,
  IChp_1_B_2,
  IChp_1_B_3,
  IChp1_B_4,
  IChp2_A,
  IChp2_B,
  IChp3_A,
  IChp3_B,
  IChp3_C,
  IChp3_D_1,
  IChp3_D_2,
  IChp3_D_3,
  IChp3_D_4,
  IChp3_D_5,

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



//*********************** debut chapitre 1 ***************
//chp1_A  ce table n'est pas encore cree dans SPIDER table eleve utilise par defaut 
const chp1_A_2_a_Liste_des_Animateurs_des_Unites_Pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         ' ' AS ResponsableEtab, 
         ' ' AS Discipline,
         ' ' AS NomComplet, 
         ' ' AS Etab,
         ' ' AS Contact
         FROM Elèves   
         WHERE (((Elèves.RefElève)=0));
         `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_2_a[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_2_a, index: number) => {
        return {
          // c0:index+1,
          c1: nv(item.ResponsableEtab),
          c2: nv(item.Discipline),
          c3: nv(item.NomComplet),
          c4: nv(item.Etab),
          c5: nv(item.Contact),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp1_A_2_a_Liste_des_Animateurs_des_Unites_Pedagogiques`
      );
      return reject(err);
    }
  });
};

// ce tableau n'est pas encore cree dans SPIDER
const chp1_A_2_b_Activites_des_Conseils_d_Enseignement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         ' ' AS Discipline,
         ' ' AS DatePeriode,
         ' ' AS TypeActivite, 
         ' ' AS AnimateurTheme
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_2_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_2_b, index: number) => {
        return {
          // c0:index+1,
          c1: nv(item.Discipline),
          c2: nv(item.DatePeriode),
          c3: nv(item.TypeActivite),
          c4: nv(item.AnimateurTheme),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp1_A_2_b_Activites_des_Conseils_d_Enseignement`
      );
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_3_a_Chef_d_etablissement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      tbl_visit.type_visit AS typeVisiteur,
      Fonction.Fonction AS Visiteur, 
       [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomCompletProf, 
       Personnel.fil_gen, 
       Fonction.Fonction, 
       tbl_visit.date_visit AS Dates, 
       tbl_visit.heure_visit AS Heures, 
       Classes.ClasseCourt AS Classe, 
       Personnel.Fonction, 
       classe_matieres_TMP.MatLong AS Discipline
      FROM classe_matieres_TMP INNER JOIN (Fonction INNER JOIN (((Personnel INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers) 
      INNER JOIN tbl_visit ON Personnel.RefPersonnel = tbl_visit.id_pers) 
      INNER JOIN Classes ON tbl_visit.id_classe = Classes.RefClasse) ON Fonction.RefFonction = Personnel.Fonction) ON classe_matieres_TMP.RefMatière = Personnel.RefMatière
      WHERE (((Personnel.Fonction)=6))
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_3_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_3_a, index: number) => {
        return {
          c1: nv(item.nomVisiteur),
          c2: nv(item.NomCompletProf),
          c3: nv(item.Discipline),
          c4: nv(item.Classe),
          c5: nv(item.Dates),
          c6: nv(item.Heures),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_3_a_Chef_d_etablissement`);
      return reject(err);
    }
  });
};


/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_3_b_Conseillers_Pedagogiques = () => {
  return new Promise(async (resolve, reject) => {
    // table non renseignee
    try {
      let sql = `SELECT
      Fonction.Fonction AS Visiteur,
      [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomCompletProf,
      Matières.MatLong AS Discipline,
      Classes.ClasseCourt AS Classe,
      tbl_visit.date_visit AS Dates,
      tbl_visit.heure_visit AS Heures
      FROM Classes INNER JOIN (Fonction INNER JOIN ((Personnel INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière)
      INNER JOIN tbl_visit ON Personnel.RefPersonnel = tbl_visit.id_pers) ON Fonction.RefFonction = Personnel.Fonction)
      ON Classes.RefClasse = tbl_visit.id_classe
      WHERE (((Fonction.RefFonction)=48));
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_3_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_3_b, index: number) => {
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
      console.log(`err => chp1_A_3_b_Conseillers_Pedagogiques`);
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_3_c_Inspecteurs = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT
      Fonction.Fonction AS Visiteur,
      [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomCompletProf,
      Matières.MatLong AS Discipline,
      Classes.ClasseCourt AS Classe,
      tbl_visit.date_visit AS Dates,
      tbl_visit.heure_visit AS Heures
      FROM Classes INNER JOIN (Fonction INNER JOIN ((Personnel INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière)
      INNER JOIN tbl_visit ON Personnel.RefPersonnel = tbl_visit.id_pers) ON Fonction.RefFonction = Personnel.Fonction)
      ON Classes.RefClasse = tbl_visit.id_classe
      WHERE (((Fonction.RefFonction)=7));
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_3_c[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_3_c, index: number) => {
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
      console.log(`err => chp1_A_3_c_Inspecteurs`);
      return reject(err);
    }
  });
};

/**
 * La table n'est pas encore implementé dans spider nous avons utiliser la matiere par defaut
 */
const chp1_A_4_c_Formations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
      ' ' AS Discipline, 
      ' ' AS DateFormation, 
      ' ' AS ThemeEtLieu,
      ' ' AS AnimateurDuTheme
      FROM Personnel 
      INNER JOIN Matières 
      ON Personnel.RefMatière = Matières.RefMatière
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_4_c[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_4_c, index: number) => {
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
      console.log(`err => chp1_A_4_c_Formations`);
      return reject(err);
    }
  });
};

// B
// const chp1_B_1_stat_resul_scol_par_clas = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let sql = `
//       SELECT Niveaux.RefNiveau, "#FFFF" AS bg,  Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
//       ORDER BY Classes.OrdreClasse;
//       UNION ALL
//       SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      
//       UNION ALL(
//       SELECT Niveaux.RefNiveau,  "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
//       ORDER BY Classes.OrdreClasse;
//       UNION ALL
//       SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
//       )
      
//       UNION ALL(
//       SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
//       ORDER BY Classes.OrdreClasse;
//       UNION ALL
//       SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg,Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
//       )
      
//       UNION ALL(
//       SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
//       ORDER BY Classes.OrdreClasse;
//       UNION ALL
//       SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
//       )
      
//       UNION ALL(
//       SELECT Niveaux.RefNiveau, "#FFFF" AS bg,Niveaux.NiveauCourt,Classes.ClasseCourt,Count(Elèves.RefElève) AS EffectTotal,Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse,Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse,Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1,IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2,IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3,IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse 
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
//       HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<>6))
//       ORDER BY Classes.OrdreClasse;

//      UNION ALL 
// SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & "2nde A" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
// FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
// GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
// HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=5));

// UNION ALL (
//       SELECT Niveaux.RefNiveau, "#FFFF" AS bg,Niveaux.NiveauCourt,Classes.ClasseCourt,Count(Elèves.RefElève) AS EffectTotal,Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse,Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse,Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1,IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2,IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3,IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse 
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
//       HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<>5))
//       ORDER BY Classes.OrdreClasse;
// )

//      UNION ALL
// SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & "2nde C" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
// FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
// GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
// HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=6));

//       UNION ALL
//       SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg,Niveaux.NiveauCourt,"Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt,Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse,Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse,Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1,IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2,IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3,IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse 
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
//       )
      
//       UNION ALL(
//       SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
//       HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=7))
//       ORDER BY Classes.OrdreClasse;

//      UNION ALL
//           SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & "1ère A" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,TypesClasses.RefTypeClasse
//       HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=7));


//        UNION ALL ( 
//       SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
//       HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=8))
//       ORDER BY Classes.OrdreClasse;
//         )

// UNION ALL
//     SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & "1ère C" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,TypesClasses.RefTypeClasse
//       HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=8));

//       UNION ALL
//       SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
//       )

      
//       UNION ALL(
//       SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
//       ORDER BY Classes.OrdreClasse;
//       UNION ALL
//       SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
//       HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
//       )
      
//       UNION ALL(
//       SELECT Max(Niveaux.RefNiveau) AS RefNiveau,"#FFCDD2" AS bg,  "" AS NiveauCourt,"Total Etabliss" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
//       FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
//       GROUP BY TypesClasses.filière, Elèves.inscrit
//       HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
//       )`;

//       const isEmpty = {
//         bg: "#FFFF",
//         group: "",
//         label: "",
//         cols: ["", "", "", "", "", "", "", "", "", ""]
//       }
//       const sqlResult = await fetchFromMsAccess<IChp_1_B_1[]>(sql, appCnx);
//       if (sqlResult.length === 0) return resolve([isEmpty]);
//       const contentsArray = sqlResult.map((item: any) => {
//         const items = _.omit(item, ["RefNiveau", "bg", "ClasseCourt", "NiveauCourt"]);
//         return {
//           bg: item.bg,
//           group: item.NiveauCourt,
//           label: item.ClasseCourt,
//           cols: Object.values(items),
//         };
//       });
//       resolve(contentsArray);
//     } catch (err: any) {
//       console.log(`err => chp1_B_1_stat_resul_scol_par_clas`);
//       return reject(err);
//     }
//   });
// };

const chp1_B_1_stat_resul_scol_par_clas = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT Niveaux.RefNiveau, "#FFFF" AS bg,  Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      
      UNION ALL(
      SELECT Niveaux.RefNiveau,  "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg,Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Max(Niveaux.RefNiveau) AS RefNiveau,"#FFCDD2" AS bg,  "" AS NiveauCourt,"Total Etabliss" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
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
      const sqlResult = await fetchFromMsAccess<IChp_1_B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: any) => {
        const items = _.omit(item, ["RefNiveau", "bg", "ClasseCourt", "NiveauCourt"]);
        return {
          bg: item.bg,
          group: item.NiveauCourt,
          label: item.ClasseCourt,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_1_stat_resul_scol_par_clas`);
      return reject(err);
    }
  });
};

const chp1_B_2_liste_nominative = () => {
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
      Classes.ClasseCourt, Classes.ClasseLong, 
      Elèves.MatriculeNational, [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, IIf([Elèves]![Redoub]=True,"R","") AS Redoub, IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2, Elèves.LV2 AS Lang, T_Notes.MOYG2 AS MoyG2, Notes.RangG2, '-' AS MS, (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ, IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, Elèves.Décision AS NumDeciAffect, IIf(IsNull(Elèves.Obs),"",Elèves.Obs) AS Obs
FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
WHERE (((Elèves.inscrit)=True))
ORDER BY Niveaux.RefNiveau, Classes.ClasseLong, [NomElève] & " " & [PrénomElève];
        `;
      const sqlResult2 = await fetchFromMsAccess<IChp_1_B_2[]>(sql2, appCnx);
      if (sqlResult2.length === 0) return resolve([
        {
          label: '',
          obj: {classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);
      const resultat = functions_main.fusionnerTableaux(sqlResult1,sqlResult2,'MoyG2')

      const contentsArray = resultat.map((item: IChp_1_B_2, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNaiss),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7:  nv(item.Lang2),
          c8: nv(item.MoyG2),
          c9: nv(item.RangG2),
          c10: nv(item.Appreciations),
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
    // console.log("result.chp1_B_2 ...",JSON.stringify(result[0]))
    resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_2_liste_nomination_eleve`);
      return reject(err);
    }
  });
};

const chp1_B_3_liste_major_classe_niveau = () => {
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
            IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2
,
      Elèves.LV2 AS Lang,
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      Elèves.Décision AS NumDeciAffect, Notes.RangG2
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Notes.RangG2) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY TypesClasses.RefTypeClasse, Classes.ClasseCourt, T_Notes.MOYG2 DESC , Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];  
      `;
      const sqlResult = await fetchFromMsAccess<IChp_1_B_3[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp_1_B_3, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNais),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.StatutEleve),
          c8: nv(item.NumDeciAffect),
          // c9: nv(item.Lang2),
          c9:  nv(item.Lang2),         
          c10: nv(item.MoyG2),
          c11: nv(item.RangG2),
          c12: nv(item.ClasseCourt),
          label:item.label,
          obj:{label:item.label},
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_3_liste_major_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_4_eleves_en_situation2 = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
        [NiveauCourt] & " " & [Série] AS NiveauSerie, 
        Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS GT1, 
        Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS FT1, 
        [GT1]+[FT1] AS TT1, 
        Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT2, 
        Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT2, 
        [GT2]+[FT2] AS TT2, 
        Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3A, 
        Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=2,1,Null)) AS FT3A, 
        [GT3A]+[FT3A] AS TT3A, 
        Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT3B, 
        Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3B, 
        [GT3B]+[FT3B] AS TT3B, Count(IIf([MOYG2]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, 
        Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, 
        [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3
        FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
        GROUP BY IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série], TypesClasses.filière, TypesClasses.Niveau
        HAVING (((TypesClasses.filière)=1))
        ORDER BY TypesClasses.Niveau;
        `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_4[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_B_4) => {
        const items = _.omit(item, ["NiveauSerie", "CycleX"]);
        // console.log(`items : `, items);
        return {
          group: item.CycleX,
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      const result = functions_main.formatGroupBy(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_4_eleves_en_situation`);
      return reject(err);
    }
  });
};

const chp1_B_4_eleves_en_situation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, [NiveauCourt] & " " & [Série] AS NiveauSerie, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS GT1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS FT1, [GT1]+[FT1] AS TT1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT2, [GT2]+[FT2] AS TT2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3A, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=2,1,Null)) AS FT3A, [GT3A]+[FT3A] AS TT3A, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT3B, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3B, [GT3B]+[FT3B] AS TT3B, Count(IIf([MOYG2]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série], TypesClasses.RefTypeClasse, TypesClasses.filière, Elèves.Inscrit
      HAVING (((Niveaux.RefNiveau)<7) AND ((TypesClasses.filière)=1) AND ((Elèves.Inscrit)=True));
      UNION ALL
      SELECT Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, "Tle A" AS NiveauSerie, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS GT1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS FT1, [GT1]+[FT1] AS TT1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT2, [GT2]+[FT2] AS TT2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3A, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=2,1,Null)) AS FT3A, [GT3A]+[FT3A] AS TT3A, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT3B, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3B, [GT3B]+[FT3B] AS TT3B, Count(IIf([MOYG2]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True))
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]);
      UNION ALL SELECT Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, [NiveauCourt] & " " & [Série] AS NiveauSerie, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS GT1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS FT1, [GT1]+[FT1] AS TT1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT2, [GT2]+[FT2] AS TT2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3A, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=2,1,Null)) AS FT3A, [GT3A]+[FT3A] AS TT3A, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT3B, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3B, [GT3B]+[FT3B] AS TT3B, Count(IIf([MOYG2]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série], TypesClasses.RefTypeClasse, TypesClasses.filière, Elèves.Inscrit
      HAVING (((TypesClasses.RefTypeClasse) In (11,12)) AND ((TypesClasses.filière)=1) AND ((Elèves.Inscrit)=True));
        `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_4[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_B_4) => {
        const items = _.omit(item, ["RefNiveau",, "CycleX","NiveauSerie"]);
        // console.log(`items : `, items);
        return {
          group: item.CycleX,
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      const result = functions_main.formatGroupBy(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_4_eleves_en_situation`);
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

const chp2_A_liste_boursiers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational,
        [NomElève] & " " & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt,
        IIf([Sexe]=1,"M","F") AS Genre,
        IIf([Bourse]="BE","BE","") AS BE,
        IIf([Bourse]="1/2B","1/2B","") AS Demiboursier
        FROM ((TypesClasses INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) 
        INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS
        WHERE (((Elèves.Bourse) Is Not Null))
        ORDER BY Elèves.Bourse DESC , [NomElève] & " " & [PrénomElève], Classes.OrdreClasse, [NomElève] & " " & [PrénomElève], Elèves.Bourse DESC , TypesClasses.Niveau;
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_A, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Genre),
          c5: nv(item.BE),
          c6: nv(item.Demiboursier),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_A_liste_boursiers`);
      return reject(err);
    }
  });
};

const chp2_B_pyramides_par_approche_genre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 1 AS orderby, "Nombre de Classes" AS label, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=1) AS _6e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=2) AS _5e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=3) AS _4e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=4) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=5) AS _2ndA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=6) AS _2ndC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=7) AS _1ereA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=8) AS _1ereC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=9) AS _1ereD, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse In(10,13)) AS _TleA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=11) AS _TleC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=12) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, '', TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      
      UNION ALL 
      SELECT 2 AS orderby, "Effectifs Par classe" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
      FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      
      UNION ALL 
      SELECT 3 AS orderby, IIf([Elèves].[Sexe]=1,"G","F") AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe;
      
      UNION ALL SELECT 4 AS orderby, "T" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
      FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));    
         `;
      const sqlResult = await fetchFromMsAccess<IChp2_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp2_B) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          ...items,
        };
      });
      // console.log("contentsArray ... ", contentsArray);
      const row = contentsArray;
      const row1 = Object.values(row[0]);
      const row2 = Object.values(row[1]);
      const row3 = Object.values(row[2]);
      const row4 = Object.values(row[3]);
      const row5 = Object.values(row[4]);
      const rows = { row1, row2, row3, row4, row5 };
      const result = [rows];
      // console.log("result ...", result)

      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_B_pyramides_par_approche_genre`);
      return reject(err);
    }
  });
};

/*** fin chapitre 2 ***
 *
 *
 *
 **************************************************************************/

//*** debut chapitre 3 ***
/**
 * ce tableau n'est pas encore implementé dans spider
 * Ce titre n’existe pas encore dans l’ancien rapport
 */
const chp3_A_fonctionnement_conseil = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
        '-' AS Periode, 
        '-' AS Activite_menee, 
        '-' AS Observations
        FROM tbl_conseil_interieur
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_A, index: number) => {
        return {
          c1: nv(item.Periode),
          c2: nv(item.Activite_menee),
          c3: nv(item.Observations),
        };
      });

      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_fonctionnement_conseil`);
      return reject(err);
    }
  });
};

/**
 * Ce titre n’existe pas encore dans l’ancien rapport
 * la table tbl_conseil_discipline est vide
 */
const chp3_B_fonctionnement_conseil_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
        '-' AS Dates,
        '-' AS NomComplet,
        '-' AS MatriculeNational,
        '-' AS ClasseCourt,
        '-' AS Genre, 
        '-' AS Objet,
        '-' AS Decision
        FROM tbl_conseil_discipline
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_B, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Dates),
          c2: nv(item.NomComplet),
          c3: nv(item.MatriculeNational),
          c4: nv(item.ClasseCourt),
          c5: nv(item.Genre),
          c6: nv(item.Objet),
          c7: nv(item.Decision),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_B_fonctionnement_conseil_discipline`);
      return reject(err);
    }
  });
};

// Ce titre n’existe pas encore dans l’ancien rapport, c’est un tableau
const chp3_C_activite_para_scolaire = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
        '-' AS Club, 
        '-' AS Dates,
        '-' AS ActiviteMenee
        FROM tbl_conseil_discipline
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_C[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_C, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Club),
          c2: nv(item.Dates),
          c3: nv(item.ActiviteMenee),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_C_activite_para_scolaire`);
      return reject(err);
    }
  });
};

/**
 * Ce tableau n’est pas encore implémenté dans SPIDER il y d'autre champs à creer
 * nom de la table tbl_cs_abandon
 */
const chp3_D_1_cas_abandon = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & " " & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt, 
        IIf([Sexe]=1,"M","F") AS Genre,
        tbl_cs_abandon.RaisonAbandon AS Observations
        FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_abandon 
        ON Elèves.RefElève = tbl_cs_abandon.RefElève) 
        ON Classes.RefClasse = Elèves.RefClasse
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_D_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_D_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Genre),
          c5: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_D_1_cas_abandon`);
      return reject(err);
    }
  });
};

/**
 * 
 * Ce titre n’existe pas encore dans l’ancien rapport, c’est un tableau
 */
const chp3_D_2_encadrement_phsychosocial = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & " " & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt, 
        IIf([Sexe]=1,"M","F") AS Genre,
        '-' AS ProblemePsycho,
        '-' AS Observation
        FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_abandon 
        ON Elèves.RefElève = tbl_cs_abandon.RefElève) 
        ON Classes.RefClasse = Elèves.RefClasse
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_D_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_D_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Genre),
          c5: nv(item.ProblemePsycho),
          c6: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_D_2_encadrement_phsychosocial`);
      return reject(err);
    }
  });
};
/**
 * Ce tableau n’est pas encore implémenté dans SPIDER
 * 
 */
const chp3_D_3_cas_grossesse = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & " " & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt, 
        Int((Date()-[DateNaiss])/365.5) AS Age, 
        tbl_cs_grossesse.QualiteAuteur,
        '-' AS TermeTheorique,
        '-' AS Auteur,
        '-' AS FonctionAuteur
        FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_grossesse 
        ON Elèves.RefElève = tbl_cs_grossesse.RefElève) 
        ON Classes.RefClasse = Elèves.RefClasse
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_D_3[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_D_3, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Age),
          c5: nv(item.QualiteAuteur),
          c6: nv(item.TermeTheorique),
          c7: nv(item.Auteur),
          c8: nv(item.FonctionAuteur),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_D_3_cas_grossesse`);
      return reject(err);
    }
  });
};

const chp3_D_4_cas_maladies = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp3_D_4[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_D_4, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Genre),
          c5: nv(item.DateDepotCertificat),
          c6: nv(item.NatureMaladie),
          c7: nv(item.DureeMaladie),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_d_1_cas_de_maladie`);
      return reject(err);
    }
  });
};

const chp3_D_5_cas_deces = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        Elèves.MatriculeNational, 
        [NomElève] & "" & [PrénomElève] AS NomComplet, 
        Classes.ClasseCourt, 
        IIf([Sexe]=1,"M","F") AS Genre,
        tbl_cs_deces.DateDécès AS DateDeces, 
        tbl_cs_deces.CauseDécès AS CauseDeces
        FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_deces 
        ON Elèves.RefElève = tbl_cs_deces.RefElève)
        ON Classes.RefClasse = Elèves.RefClasse
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_D_5[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_D_5, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.Genre),
          c5: nv(item.DateDeces),
          c6: nv(item.CauseDeces),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_D_5_cas_deces`);
      return reject(err);
    }
  });
};
/******* fin chapitre 3 *****
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
      const dataParams = { ...data,logo1:path,path};
      // console.log("dataParams...", dataParams);


      const chp1_A_2_a = await chp1_A_2_a_Liste_des_Animateurs_des_Unites_Pedagogiques();
      const chp1_A_2_b = await chp1_A_2_b_Activites_des_Conseils_d_Enseignement();
      const chp1_A_3_a = await chp1_A_3_a_Chef_d_etablissement();
      const chp1_A_3_b  = await chp1_A_3_b_Conseillers_Pedagogiques();
      const chp1_A_3_c = await chp1_A_3_c_Inspecteurs();
      const chp1_A_4_c = await chp1_A_4_c_Formations();

      const chp1_B_1 = await chp1_B_1_stat_resul_scol_par_clas();
      const chp1_B_2 = await chp1_B_2_liste_nominative();
      const chp1_B_3 = await chp1_B_3_liste_major_classe_niveau();
      const chp1_B_4 = await chp1_B_4_eleves_en_situation();

      const chp2_A = await chp2_A_liste_boursiers();
      const chp2_B = await chp2_B_pyramides_par_approche_genre();

      const chp3_A = await chp3_A_fonctionnement_conseil();
      const chp3_B = await chp3_B_fonctionnement_conseil_discipline();
      const chp3_C = await chp3_C_activite_para_scolaire();
      const chp3_D_1 = await chp3_D_1_cas_abandon();
      const chp3_D_2 = await chp3_D_2_encadrement_phsychosocial();
      const chp3_D_3 = await chp3_D_3_cas_grossesse();
      const chp3_D_4 = await chp3_D_4_cas_maladies();
      const chp3_D_5 = await chp3_D_5_cas_deces();


      const result = {
        ...dataParams,
        name_report: "public_secondairegeneral_2trimestre",
        path_report: "public/secondaire-general",
        anscol1,
        nometab,
        codeetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        drencomplet,

        chp1_A_2_a,
        chp1_A_2_b,
        chp1_A_3_a,
        chp1_A_3_b,
        chp1_A_3_c,
        chp1_A_4_c,

        chp1_B_1,
        chp1_B_2,
        chp1_B_3,
        chp1_B_4,

        chp2_A,
        chp2_B,

        chp3_A,
        chp3_B,
        chp3_C,
        chp3_D_1,
        chp3_D_2,
        chp3_D_3,
        chp3_D_4,
        chp3_D_5,
        
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
