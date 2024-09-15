import { _selectSql } from './../../../../../../databases/index';
import { appCnx, fetchFromMsAccess, paramEtabObjet } from './../../../../../../databases/accessDB';
import {
  IChp1A_3_a,
  IChp1A_3_b,
  IChp1A_4_a,
  IChp1A_4_b,
  IChp1A_5_a,
  IChp1A_5_b,
  IChp1A_5_c,
  IChp1A_6,
  IChp1B_1,
  IChp1B_2,
  IChp1B_3,
  IChp1B_4,
  IChp2A,
  IChp2B,
  IChp2C,
  IChp2D,
  IChp3A_1,
  IChp3A_2,
  IChp3B_1,
  IChp3B_2,
  IChp3C,
  IChp3D_1,
  IChp3D_2,
  IChp3D_3,
  IChp3D_4,
  IChp3D_5,
  IChp4A_1,
  IChp4A_2,
  IChp4B_1,
  IChp4B_2,
  IChp4C_1,
  IChp4C_2,
  IChp5A_1,
  IChp5A_2,
  IChp5A_3_a,
  IChp5A_3_b,
  IChp5A_3_c,
  IChp5B_1_a,
  IChp5B_1_b,
  IChp5B_2,
}
  from "./interfaces";

import { IReportData } from "./interfaces";
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



//*********** debut chapitre 1 *******
//chp1_A  ce table n'est pas encore cree dans SPIDER table eleve utilise par defaut 
const chp1_A_3_a_Liste_des_Animateurs_des_Unites_Pedagogiques = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1A_3_a[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_3_a, index: number) => {
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
        `err => chp1_A_3_a_Liste_des_Animateurs_des_Unites_Pedagogiques`
      );
      return reject(err);
    }
  });
};

/**
 *  ce tableau n'est pas encore cree dans SPIDER
 * nous avons utiliser la table eleves par defaut
 */const chp1_A_3_b_Activites_des_Unites_Pedagogiques = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1A_3_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_3_b, index: number) => {
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
        `err => chp1_A_3_b_Activites_des_Unites_Pedagogiques`
      );
      return reject(err);
    }
  });
};

/**
 *  ce tableau n'est pas encore cree dans SPIDER
 * nous avons utiliser la table eleves par defaut
 */
const chp1_A_4_a_Liste_des_Responsables_des_Conseils_d_Enseignement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
         ' ' AS Discipline,
         ' ' AS Responsable,
         ' ' AS Emploi, 
         ' ' AS Contact
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp1A_4_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_4_a, index: number) => {
        return {
          // c0:index+1,
          c1: nv(item.Discipline),
          c2: nv(item.Responsable),
          c3: nv(item.Emploi),
          c4: nv(item.Contact),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp1_A_4_a_Liste_des_Responsables_des_Conseils_d_Enseignement`
      );
      return reject(err);
    }
  });
};

// ce tableau n'est pas encore cree dans SPIDER
const chp1_A_4_b_Activites_des_Conseils_d_Enseignement = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1A_4_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_4_b, index: number) => {
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
        `err => chp1_A_4_b_Activites_des_Conseils_d_Enseignement`
      );
      return reject(err);
    }
  });
};


/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_5_a_Chef_d_etablissement = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1A_5_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_5_a, index: number) => {
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
      console.log(`err => chp1_A_5_a_Chef_d_etablissement`);
      return reject(err);
    }
  });
};


/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_5_b_Conseillers_Pedagogiques = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1A_5_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_5_b, index: number) => {
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
      console.log(`err => chp1_A_5_b_Conseillers_Pedagogiques`);
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_5_c_Inspecteurs = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1A_5_c[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_5_c, index: number) => {
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
const chp1_A_6_Formations = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1A_6[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1A_6, index: number) => {
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

const chp1_B_1_stat_resul_scol_par_clas = () => {
  // Old requette
  // return new Promise(async (resolve, reject) => {
  //   try {
  //     let sql = `SELECT Niveaux.RefNiveau, "#FFFF" AS bg,  Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
  //     ORDER BY Classes.OrdreClasse;
  //     UNION ALL
  //     SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      
  //     UNION ALL(
  //     SELECT Niveaux.RefNiveau,  "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
  //     ORDER BY Classes.OrdreClasse;
  //     UNION ALL
  //     SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
  //     )
      
  //     UNION ALL(
  //     SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
  //     ORDER BY Classes.OrdreClasse;
  //     UNION ALL
  //     SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg,Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
  //     )
      
  //     UNION ALL(
  //     SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
  //     ORDER BY Classes.OrdreClasse;
  //     UNION ALL
  //     SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
  //     )
      
  //     UNION ALL(
  //     SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
  //     ORDER BY Classes.OrdreClasse;
  //     UNION ALL
  //     SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
  //     )
      
  //     UNION ALL(
  //     SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
  //     ORDER BY Classes.OrdreClasse;
  //     UNION ALL
  //     SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
  //     )
      
  //     UNION ALL(
  //     SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
  //     ORDER BY Classes.OrdreClasse;
  //     UNION ALL
  //     SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
  //     HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
  //     )
      
  //     UNION ALL(
  //     SELECT Max(Niveaux.RefNiveau) AS RefNiveau,"#FFCDD2" AS bg,  "" AS NiveauCourt,"Total Etabliss" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
  //     FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
  //     GROUP BY TypesClasses.filière, Elèves.inscrit
  //     HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
  //     )
  //       `;

  //     const isEmpty = {
  //       bg: "#FFFF",
  //       group: "",
  //       label: "",
  //       cols: ["", "", "", "", "", "", "", "", "", ""]
  //     }
  //     const sqlResult = await fetchFromMsAccess<IChp1B_1[]>(sql, appCnx);
  //     if (sqlResult.length === 0) return resolve([isEmpty]);
  //     const contentsArray = sqlResult.map((item: any) => {
  //       const items = _.omit(item, ["RefNiveau", "bg", "ClasseCourt", "NiveauCourt"]);
  //       return {
  //         bg: item.bg,
  //         group: item.NiveauCourt,
  //         label: item.ClasseCourt,
  //         cols: Object.values(items),
  //       };
  //     });
  //     resolve(contentsArray);
  //   } catch (err: any) {
  //     console.log(`err => chp1_B_1_stat_resul_scol_par_clas`);
  //     return reject(err);
  //   }
  // });


  return new Promise(async (resolve, reject) => {
    // requette avec les totaux de chaque niveau et serie 
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg,  Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="6ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      
      UNION ALL(
      SELECT Niveaux.RefNiveau,  "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="5ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg,Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="4ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Niveaux.RefNiveau,"#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="3ème") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg,Niveaux.NiveauCourt,Classes.ClasseCourt,Count(Elèves.RefElève) AS EffectTotal,Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse,Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse,Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1,IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2,IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3,IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse 
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<>6))
      ORDER BY Classes.OrdreClasse;

     UNION ALL 
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & "2nde A" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=5));

UNION ALL (
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg,Niveaux.NiveauCourt,Classes.ClasseCourt,Count(Elèves.RefElève) AS EffectTotal,Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse,Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse,Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1,IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2,IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3,IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse 
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<>5))
      ORDER BY Classes.OrdreClasse;
)

     UNION ALL
SELECT Niveaux.RefNiveau, "#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & "2nde C" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=6));

      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg,Niveaux.NiveauCourt,"Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt,Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse,Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse,Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1,IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1,Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2,IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2,Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3,IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3,IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse 
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="2nde") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=7))
      ORDER BY Classes.OrdreClasse;

     UNION ALL
          SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & "1ère A" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,TypesClasses.RefTypeClasse
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=7));


       UNION ALL ( 
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit, TypesClasses.RefTypeClasse
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=8))
      ORDER BY Classes.OrdreClasse;
        )

UNION ALL
    SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & "1ère C" AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit,TypesClasses.RefTypeClasse
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)=8));

      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="1ère") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )

      
      UNION ALL(
      SELECT Niveaux.RefNiveau, "#FFFF" AS bg, Niveaux.NiveauCourt, Classes.ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, Classes.ClasseCourt, Classes.OrdreClasse, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
      ORDER BY Classes.OrdreClasse;
      UNION ALL
      SELECT Niveaux.RefNiveau,"#E3E3E3" AS bg, Niveaux.NiveauCourt, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.NiveauCourt)="Tle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )
      
      UNION ALL(
      SELECT Max(Niveaux.RefNiveau) AS RefNiveau,"#FFCDD2" AS bg,  
      "" AS NiveauCourt,"Total Etabliss" AS ClasseCourt, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, 
      IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,0,Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY TypesClasses.filière, Elèves.inscrit
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      )`;

      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", ""]
      }
      const sqlResult = await fetchFromMsAccess<IChp1B_1[]>(sql, appCnx);
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

      let sql2 = `SELECT   
      Niveaux.RefNiveau AS OrderBy, 
      Classes.ClasseCourt, 
      Classes.ClasseLong, 
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
      Notes.RangG1, '-' AS MS, 
      (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, 
      (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ,
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve,
      Elèves.Décision AS NumDeciAffect,
      IIf(IsNull(Elèves.Obs),"",Elèves.Obs) AS Obs
      FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) 
      INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) 
      INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) 
      LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
      WHERE (((Elèves.inscrit)=True) AND ((Elèves.StatutElève)))
      ORDER BY Niveaux.RefNiveau, Classes.ClasseLong, [NomElève] & " " & [PrénomElève];  
        `;
      const sqlResult2 = await fetchFromMsAccess<IChp1B_2[]>(sql2, appCnx);
      if (sqlResult2.length === 0) return resolve([
        {
          label: '',
          obj: {classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);

      const resultat = functions_main.fusionnerTableaux(sqlResult1,sqlResult2,'MoyG1')

      const contentsArray = resultat.map((item: IChp1B_2, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNaiss),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7:  nv(item.Lang2),
          c8: nv(item.MoyG1),
          c9: nv(item.RangG1),
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
      console.log(`err => chp1_B_2_liste_nominative`);
      return reject(err);
    }
  });
};
//
const chp1_B_3_liste_major_classe_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      TypesClasses.RefTypeClasse, 
      T_Notes.MOYG1 AS MoyG1, 
      Niveaux.NiveauCourt, 
      Niveaux.NiveauCourt AS label, 
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(DateNaiss,"Short Date") AS DateNais, 
      Int((Date()-[DateNaiss])/365.5) AS Age, 
      IIf([Sexe]=1,"M","F") AS Genre,
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
      IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2,
      Elèves.LV2 AS Lang,
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve,
      Elèves.Décision AS NumDeciAffect, Notes.RangG1
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Notes.RangG1) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY TypesClasses.RefTypeClasse, T_Notes.MOYG1 DESC , Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];
        `;
      const sqlResult = await fetchFromMsAccess<IChp1B_3[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);
        const contentsArray = sqlResult.map((item: IChp1B_3, i: number) => {
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
          c10: nv(item.MoyG1),
          c11: nv(item.RangG1),
          c12: nv(item.ClasseCourt),
          label:item.label,
          obj:{label:item.label},
        };
      });
      // console.log("contentsArray ...", contentsArray)
      const result = functions_main.groupLabelByGroup(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_3_liste_major_classe_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_4_eleves_en_situation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, [NiveauCourt] & " " & [Série] AS NiveauSerie, Count(IIf([MOYG1]>=10 And [SEXE]=1,1,Null)) AS GT1, Count(IIf([MOYG1]>=10 And [SEXE]=2,1,Null)) AS FT1, [GT1]+[FT1] AS TT1, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT2, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT2, [GT2]+[FT2] AS TT2, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3A, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=2,1,Null)) AS FT3A, [GT3A]+[FT3A] AS TT3A, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT3B, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3B, [GT3B]+[FT3B] AS TT3B, Count(IIf([MOYG1]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série], TypesClasses.RefTypeClasse, TypesClasses.filière, Elèves.Inscrit
      HAVING (((Niveaux.RefNiveau)<7) AND ((TypesClasses.filière)=1) AND ((Elèves.Inscrit)=True));
      UNION ALL
      SELECT Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, "Tle A" AS NiveauSerie, Count(IIf([MOYG1]>=10 And [SEXE]=1,1,Null)) AS GT1, Count(IIf([MOYG1]>=10 And [SEXE]=2,1,Null)) AS FT1, [GT1]+[FT1] AS TT1, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT2, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT2, [GT2]+[FT2] AS TT2, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3A, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=2,1,Null)) AS FT3A, [GT3A]+[FT3A] AS TT3A, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT3B, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3B, [GT3B]+[FT3B] AS TT3B, Count(IIf([MOYG1]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True))
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]);
      UNION ALL SELECT Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, [NiveauCourt] & " " & [Série] AS NiveauSerie, Count(IIf([MOYG1]>=10 And [SEXE]=1,1,Null)) AS GT1, Count(IIf([MOYG1]>=10 And [SEXE]=2,1,Null)) AS FT1, [GT1]+[FT1] AS TT1, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT2, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT2, [GT2]+[FT2] AS TT2, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3A, Count(IIf([MOYG1] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=2,1,Null)) AS FT3A, [GT3A]+[FT3A] AS TT3A, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT3B, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3B, [GT3B]+[FT3B] AS TT3B, Count(IIf([MOYG1]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, Count(IIf([MOYG1]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série], TypesClasses.RefTypeClasse, TypesClasses.filière, Elèves.Inscrit
      HAVING (((TypesClasses.RefTypeClasse) In (11,12)) AND ((TypesClasses.filière)=1) AND ((Elèves.Inscrit)=True));
        `;
      const sqlResult = await fetchFromMsAccess<IChp1B_4[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1B_4) => {
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

// /********** fin chapitre 1 **********

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
        Elèves.EtsOrig
         FROM Nationalités RIGHT JOIN (Niveaux INNER JOIN (TypesClasses INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Nationalités.CODPAYS = Elèves.Nat
         WHERE (((Elèves.Transféré)=Yes))
         ORDER BY [NomElève] & " " & [PrénomElève];
        `;

      const sqlResult = await fetchFromMsAccess<IChp2A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2A, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.Genre),
          c4: nv(item.ClasseCourt),
          c5: nv(item.Age +" ans"),
          c6: nv(item.Redoub),
          c7: nv(item.Nat),
          c8: nv(item.EtsOrig),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_A_liste_transferts`);
      return reject(err);
    }
  });
};

const chp2_B_liste_boursiers = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp2B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2B, index: number) => {
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
      console.log(`err => chp2_B_liste_boursiers`);
      return reject(err);
    }
  });
};

const chp2_C_repartition_des_eleves_par_annee_de_naissance = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
         IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])) AS annee, 
         IIf([Elèves].[Sexe]=2,"F","G") AS genre,
         Count(IIf([Niveaux]![RefNiveau]=1,1,Null)) AS _6e, 
         Count(IIf(Niveaux!RefNiveau=2,1,Null)) AS _5e,
         Count(IIf(Niveaux!RefNiveau=3,1,Null)) AS _4e, 
         Count(IIf(Niveaux!RefNiveau=4,1,Null)) AS _3e, 
         Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1,
         Count(IIf(Niveaux!RefNiveau=5 And TypesClasses!Série="A",1,Null)) AS _2ndA, 
         Count(IIf(Niveaux!RefNiveau=5 And TypesClasses!Série="C",1,Null)) AS _2ndC, 
         Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="A",1,Null)) AS _1ereA, 
         Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="C",1,Null)) AS _1ereC, 
         Count(IIf(Niveaux!RefNiveau=6 And TypesClasses!Série="D",1,Null)) AS _1ereD, 
         Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, 
         Count(IIf(Niveaux!RefNiveau=7 And TypesClasses!Série="C",1,Null)) AS _TleC, 
         Count(IIf(Niveaux!RefNiveau=7 And TypesClasses!Série="D",1,Null)) AS _TleD,
         Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, 
         [ST1]+[ST2] AS TOTAL
        FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
        GROUP BY 
        IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])), 
        IIf([Elèves].[Sexe]=2,"F","G"), 
        Elèves.Inscrit, 
        '', 
        TypesClasses.filière
        HAVING Elèves.Inscrit=Yes AND TypesClasses.filière=1
        `;
      const sqlResult = await fetchFromMsAccess<IChp2C[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      let i = 1;
      const contentsArray = sqlResult.map((item: IChp2C) => {
        i++;
        const items = _.omit(item, [
          "annee",
          "genre",
          "ST1",
          "ST2"
        ]);
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
   //   const result = functions_main.addTRow(groupeContents);
      // console.log("🚀 ~ file: functions.ts:806 ~ returnnewPromise ~ result", result)
      resolve(result);
    } catch (err: any) {
      console.log(
        `err => chp2_C_repartition_des_eleves_par_annee_de_naissance`
      );
      return reject(err);
    }
  });
};

const chp2_D_effectif_par_niveau_avec_approche_genre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
              IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
              [NiveauCourt] & " " & [Série] AS NiveauSerie, 
              (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses,
              Count(IIf([Redoub]=0 And [SEXE]=1 And [Nat]="70",1,Null)) AS G1, 
              Count(IIf([Redoub]=0 And [SEXE]=2 And [Nat]="70",1,Null)) AS F1, 
              [G1]+[F1] AS T1, 
              Count(IIf([Redoub]=0 And [SEXE]=1 And [Nat]<>"70",1,Null)) AS G2, 
              Count(IIf([Redoub]=0 And [SEXE]=2 And [Nat]<>"70",1,Null)) AS F2, 
              [G2]+[F2] AS T2, 
              Count(IIf([Redoub]=True And [SEXE]=1 And [Nat]="70",1,Null)) AS G3, 
              Count(IIf([Redoub]=True And [SEXE]=2 And [Nat]="70",1,Null)) AS F3, 
              [G3]+[F3] AS T3, 
              Count(IIf([Redoub]=True And [SEXE]=1 And [Nat]<>"70",1,Null)) AS G4, 
              Count(IIf([Redoub]=True And [SEXE]=2 And [Nat]<>"70",1,Null)) AS F4, 
              [G4]+[F4] AS T4, 
              [G1]+[G2]+[G3]+[G4] AS TG, 
              [F1]+[F2]+[F3]+[F4] AS TF, 
              [TG]+[TF] AS TT
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) 
              INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) 
              INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              GROUP BY IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série], TypesClasses.RefTypeClasse, TypesClasses.filière, TypesClasses.Niveau
              HAVING (((TypesClasses.filière)=1))
              ORDER BY TypesClasses.Niveau;
              `;

      const sqlResult = await fetchFromMsAccess<IChp2D[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2D) => {
        const items = _.omit(item, ["NiveauSerie", "CycleX"]);
        return {
          group: item.CycleX,
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      const result = functions_main.formatGroupBy(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(
        `err => chp2_D_effectif_par_niveau_avec_approche_genre`
      );
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
// ce tableau n'est pas encore implementé dans spider
const chp3_A_1_LISTE_DES_MEMBRES_DU_CONSEIL_INTERIEUR = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        membre AS NomComplet, 
         '-' AS Genre,
         fonction AS Fonction,
         '-' AS QualiteMembre,
         '-' AS Contact
         FROM tbl_conseil_interieur   
         `;
      const sqlResult = await fetchFromMsAccess<IChp3A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3A_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.Genre),
          c3: nv(item.Fonction),
          c4: nv(item.QualiteMembre),
          c5: nv(item.Contact),
        }
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp3_A_1_LISTE_DES_MEMBRES_DU_CONSEIL_INTERIEUR`
      );
      return reject(err);
    }
  });
};

/**
 * ce tableau n'est pas encore implementé dans spider
 * Ce titre n’existe pas encore dans l’ancien rapport
 */
const chp3_A_2_fonctionnement_conseil = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT TOP 1
        '-' AS Periode, 
        '-' AS Activite_menee, 
        '-' AS Observations
        FROM tbl_conseil_interieur
        `;
      const sqlResult = await fetchFromMsAccess<IChp3A_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3A_2, index: number) => {
        return {
          c1: nv(item.Periode),
          c2: nv(item.Activite_menee),
          c3: nv(item.Observations),
        };
      });

      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_1_liste_membre_conseil_interieur`);
      return reject(err);
    }
  });
};

// Ce titre n’existe pas encore dans l’ancien rapport
const chp3_B_1_liste_membre_conseil_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        tbl_conseil_discipline.membre AS NomComplet, 
        '-' AS Genre,
        tbl_conseil_discipline.fonction AS Fonction,  
        tbl_conseil_discipline.qualite AS QualiteMembre,
        '-' AS Contact
        FROM tbl_conseil_discipline
        `;
      const sqlResult = await fetchFromMsAccess<IChp3B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3B_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.Genre),
          c3: nv(item.Fonction),
          c4: nv(item.QualiteMembre),
          c5: nv(item.Contact),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_B_1_liste_membre_conseil_discipline`);
      return reject(err);
    }
  });
};
/**
 * Ce titre n’existe pas encore dans l’ancien rapport
 * la table tbl_conseil_discipline est vide
 */
const chp3_B_2_fonctionnement_conseil_discipline = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp3B_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3B_2, index: number) => {
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
      console.log(`err => chp3_b_2_fonctionnement_conseil_discipline`);
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
      const sqlResult = await fetchFromMsAccess<IChp3C[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3C, index: number) => {
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
      const sqlResult = await fetchFromMsAccess<IChp3D_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3D_1, index: number) => {
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
      const sqlResult = await fetchFromMsAccess<IChp3D_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3D_2, index: number) => {
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
      console.log(`err => chp3_D_1_cas_abandon`);
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
      const sqlResult = await fetchFromMsAccess<IChp3D_3[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3D_3, index: number) => {
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
      const sqlResult = await fetchFromMsAccess<IChp3D_4[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3D_4, index: number) => {
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
      const sqlResult = await fetchFromMsAccess<IChp3D_5[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3D_5, index: number) => {
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

//*** debut chapitre 4 ***
const chp4_A_1_liste_du_personnel_administratif_et_d_encadrement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //Matricule	Genre	Emploi	Fonction actuelle	Contact
      let sql = `SELECT 
      [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Matricule, 
      Fonction.Fonction, 
      Matières.MatCourt AS Discipline, 
      Groupe.RefGroupePers, 
      Personnel.Sexe AS Genre, 
      Corps.NomCorps, 
      Personnel.CelPers AS Contact, 
      Personnel.TélPers
      FROM (Groupe INNER JOIN (Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) ON Groupe.RefGroupePers = Fonction.Groupe) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
      WHERE (((Groupe.RefGroupePers)=3))
      ORDER BY Personnel.NomPers;
      UNION ALL(
      SELECT 
          [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
          Personnel.Matricule, 
          Fonction.Fonction, 
          Matières.MatCourt AS Discipline, 
          Groupe.RefGroupePers, 
          Personnel.Sexe AS Genre, 
          Corps.NomCorps, 
          Personnel.CelPers AS Contact, 
          Personnel.TélPers
          FROM (Groupe INNER JOIN (Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) ON Groupe.RefGroupePers = Fonction.Groupe) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
          WHERE (((Groupe.RefGroupePers)=1))
          ORDER BY Personnel.NomPers
      )
      `;
      const sqlResult = await fetchFromMsAccess<IChp4A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4A_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.Matricule),
          c3: nv(item.Genre),
          c4: nv(item.NomCorps),
          c5: nv(item.Fonction),
          c6: nv(item.Contact),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp4_A_1_liste_du_personnel_administratif_et_d_encadrement`
      );
      return reject(err);
    }
  });
};

/**
 * Pas encore renseignée dans SPIDER 
 * nom de la table tbl_besoin_autre
 */
const chp4_A_2_etat_besoins_en_pers_admin_encad = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        '-' AS Fonction,
        '-' AS Existant_femmes,
        '-' AS Existant_garcons,
        tbl_besoin_autre_pers.qte_besoin,
        '-' AS Observations
        FROM tbl_besoin_autre_pers`;
      const sqlResult = await fetchFromMsAccess<IChp4A_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4A_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Fonction),
          c2: nv(item.Existant_femmes),
          c3: nv(item.Existant_garcons),
          c4: nv(item.qte_besoin),
          c5: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_A_2_etat_besoins_en_pers_admin_encad`);
      return reject(err);
    }
  });
};

const chp4_B_1_liste_personnel_enseignant_par_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      [Personnel.NomPers] & "" & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Matricule, 
      Fonction.Fonction, 
      Matières.MatCourt AS Discipline,
      Groupe.RefGroupePers, 
      Personnel.Sexe AS Genre, 
      Corps.NomCorps, 
      Personnel.CelPers AS Contact, 
      Personnel.TélPers
      FROM (Groupe INNER JOIN (Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) ON Groupe.RefGroupePers = Fonction.Groupe) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
      WHERE (((Groupe.RefGroupePers)=2))
      ORDER BY Personnel.NomPers;
        `;
      const sqlResult = await fetchFromMsAccess<IChp4B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4B_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.Matricule),
          c3: nv(item.Genre),
          c4: nv(item.NomCorps),
          c5: nv(item.Discipline),
          c6: nv(item.Contact),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err =>chp4_B_1_liste_personnel_enseignant_par_discipline`);
      return reject(err);
    }
  });
};

/**
 * Pas encore renseignée dans SPIDER 
 * cette requette a revoir
 * table tbl_besoin_prof
 */
const chp4_B_2_etat_besoin_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        '' AS Discipline,
        0 AS Femme_prof_cycle1,
        1 AS Homme_prof_cycle1,
        2 AS Total_prof_cycle1,
        3 AS Besoin_prof_cycle1, 
        1 AS Femme_prof_cycle2,
        2 AS Homme_prof_cycle2,
        3 AS Total_prof_cycle2,
        1 AS Besoin_prof_cycle2, 
        1 AS Femme_prof_total,
        1 AS Homme_prof_total,
        1 AS Total_prof_total,
        0 AS Besoin_prof_total
        FROM 
        tbl_besoin_prof
        `;
      // let sql = `
      // SELECT 
      // classe_matieres_TMP.MatLong AS Discipline, 
      // IIf([Sexe]=1,"M","F") AS Genre,
      // Niveaux.Cycle, 
      // Personnel.fil_gen, 
      // Groupe.RefGroupePers
      // FROM Groupe INNER JOIN (Fonction INNER JOIN (Niveaux INNER JOIN (((classe_matieres_TMP INNER JOIN tbl_besoin_prof ON classe_matieres_TMP.RefMatière = tbl_besoin_prof.id_matiere) INNER JOIN Personnel ON classe_matieres_TMP.RefPers = Personnel.RefPersonnel) 
      // INNER JOIN TypesClasses ON classe_matieres_TMP.RefTypeClasse = TypesClasses.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.RefTypeClasse) ON Fonction.RefFonction = Personnel.Fonction) ON Groupe.RefGroupePers = Fonction.Groupe
      // WHERE (((Groupe.RefGroupePers)=2));
      // `; 
      const sqlResult = await fetchFromMsAccess<IChp4B_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4B_2) => {
        const items = _.omit(item, ["Discipline"]);
        return {
          c1: item.Discipline,
          c2: item.Femme_prof_cycle1,
          c3: item.Homme_prof_cycle1,
          c4: item.Total_prof_cycle1,
          c5: item.Besoin_prof_cycle1,
          c6: item.Femme_prof_cycle2,
          c7: item.Homme_prof_cycle2,
          c8: item.Total_prof_cycle2,
          c9: item.Besoin_prof_cycle2,
          c10: item.Femme_prof_total,
          c11: item.Homme_prof_total,
          c12: item.Total_prof_total,
          c13: item.Besoin_prof_total,
          // cols: Object.values(items),
        };
      });
      // const reformatContents = addTotalRow(contentsArray);
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_B_2_etat_besoin_personnel_enseignant`);
      return reject(err);
    }
  });
};

/**
 * la requette est bonne mais les personnels de services n'ont pas été renseignées dans SPIDER
 */
const chp4_C_1_liste_du_personnel_service = () => {

  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      [Personnel.NomPers] & "" & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Matricule, 
      Fonction.Fonction, 
      Matières.MatCourt AS Discipline, 
      Groupe.RefGroupePers, 
      Personnel.Sexe AS Genre, 
      Corps.NomCorps, 
      Personnel.CelPers AS Contact, 
      Personnel.TélPers, 
      Personnel.PrénomPers, 
      Fonction.Fonction
      FROM (Groupe INNER JOIN (Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) ON Groupe.RefGroupePers = Fonction.Groupe) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
      WHERE (((Groupe.RefGroupePers)=4))
      ORDER BY Personnel.NomPers;
      `;
      const sqlResult = await fetchFromMsAccess<IChp4C_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4C_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.NomComplet),
          c2: nv(item.Matricule),
          c3: nv(item.Genre),
          c4: nv(item.Fonction),
          c5: nv(item.Contact),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_C_1_liste_du_personnel_service`);
      return reject(err);
    }
  });
};

/**
 * Pas encore renseignée dans SPIDER 
 * 
 */
const chp4_C_2_etat_besoins_personnel_service = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Fonction.Fonction, 
      IIf([Personnel.Sexe]=1,"M","F") AS Genre,
      tbl_besoin_autre_pers.qte_besoin, 
      Personnel.Obs AS Observations, 
      Groupe.RefGroupePers
      FROM Groupe INNER JOIN ((Fonction INNER JOIN tbl_besoin_autre_pers ON Fonction.RefFonction = tbl_besoin_autre_pers.id_fonction) INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Groupe.RefGroupePers = Fonction.Groupe
      WHERE (((Groupe.RefGroupePers)=4));
      `;
      const sqlResult = await fetchFromMsAccess<IChp4C_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4C_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Fonction),
          c2: (item.Genre === "F" ? "x" : ""),
          c3: (item.Genre === "M" ? "x" : ""),
          c4: nv(item.qte_besoin),
          c5: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_C_2_etat_besoins_personnel_service`);
      return reject(err);
    }
  });
};
/************ fin chapitre 4 ****************
 *
 *
 *
 **************************************************************************/

//*** debut chapitre 5 ***

/**
 * la Table tbl_rap_patrimoine non renseignee
 * cette requette a revoir
 * 
 */
const chp5_A_1_ETAT_DES_LOCAUX = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      rap_patrimoine.lib_local AS Locaux, 
      rap_patrimoine.lib_type_mat, 
      rap_patrimoine.Désignation, 
      rap_patrimoine.Bon, 
      rap_patrimoine.Mauvais, 
      rap_patrimoine.[Hors usage] AS HorsUsage, 
      rap_patrimoine.Total, 
      rap_patrimoine.Observ
      FROM rap_patrimoine;
      `;
      const sqlResult = await fetchFromMsAccess<IChp5A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp5A_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Locaux),
          c2: nv(item.Toiture),
          c3: nv(item.Plafond),
          c4: nv(item.Mur),
          c5: nv(item.Plancher),
          c6: nv(item.Portes),
          c7: nv(item.Fenetres),
          c8: nv(item.Electricite),
          c9: nv(item.Plomberie),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp5_A_1_ETAT_DES_LOCAUX`);
      return reject(err);
    }
  });
};

/**
 * la Table n'existe pas dans SPIDER 
 * Nous avons utiliser la table patrimoine par defaut
 */
const chp5_A_2_ETAT_DES_INSTALLATIONS_SPORTIVES = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      tbl_patrimoine.etat_mat AS Etats, 
      tbl_patrimoine.lib_mat, 
      tbl_type_patrimoine.lib_type_mat AS TypesInstallation, 
      tbl_empl_patrimoine.lib_local AS Besoins
      FROM (tbl_patrimoine INNER JOIN tbl_type_patrimoine ON tbl_patrimoine.id_type_mat = tbl_type_patrimoine.id_type_mat) 
      INNER JOIN tbl_empl_patrimoine ON tbl_patrimoine.id_local = tbl_empl_patrimoine.id_local;
      `;
      const sqlResult = await fetchFromMsAccess<IChp5A_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp5A_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.TypesInstallation),
          c2: nv(item.Etats),
          c3: nv(item.Besoins),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp5_A_2_ETAT_DES_INSTALLATIONS_SPORTIVES`);
      return reject(err);
    }
  });
};

/**
 * la Table n'existe pas dans SPIDER 
 * Nous avons utiliser la table patrimoine par defaut
 */
const chp5_A_3_a_Les_mobiliers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      rap_patrimoine.Désignation AS Designation, 
      rap_patrimoine.Bon, 
      rap_patrimoine.Mauvais, 
      rap_patrimoine.[Hors usage] AS HorsUsage, 
      rap_patrimoine.Total, 
      rap_patrimoine.Observ AS Besoins
      FROM rap_patrimoine;
      `;
      const sqlResult = await fetchFromMsAccess<IChp5A_3_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp5A_3_a, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Designation),
          c2: nv(item.Bon),
          c3: nv(item.Passable),
          c4: nv(item.HorsUsage),
          c5: nv(item.Total),
          c6: nv(item.Besoins),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp5_A_3_a_Les_mobiliers`);
      return reject(err);
    }
  });
};


/**
 * la Table n'existe pas dans SPIDER 
 * Nous avons utiliser la table patrimoine par defaut
 */
const chp5_A_3_b_Appareils_Electromenagers_et_Divers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
         rap_patrimoine.Désignation AS Designation, 
         rap_patrimoine.Bon, 
         rap_patrimoine.Mauvais, 
         rap_patrimoine.[Hors usage] AS HorsUsage, 
         rap_patrimoine.Total, 
         rap_patrimoine.Observ AS Besoins
         FROM rap_patrimoine;
         `;
      const sqlResult = await fetchFromMsAccess<IChp5A_3_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp5A_3_b, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Designation),
          c2: nv(item.Bon),
          c3: nv(item.Passable),
          c4: nv(item.HorsUsage),
          c5: nv(item.Total),
          c6: nv(item.Besoins),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp5_A_3_b_Appareils_Electromenagers_et_Divers`
      );
      return reject(err);
    }
  });
};

/**
 * la Table n'existe pas dans SPIDER 
 * Nous avons utiliser la table patrimoine par defaut
 */
const chp5_A_3_c_Appareils_Informatiques_et_accessoires = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      rap_patrimoine.Désignation AS Designation, 
      rap_patrimoine.Bon, 
      rap_patrimoine.Mauvais, 
      rap_patrimoine.[Hors usage] AS HorsUsage, 
      rap_patrimoine.Total, 
      rap_patrimoine.Observ AS Besoins
      FROM rap_patrimoine;
      `;
      const sqlResult = await fetchFromMsAccess<IChp5A_3_c[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp5A_3_c, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Designation),
          c2: nv(item.Bon),
          c3: nv(item.Passable),
          c4: nv(item.HorsUsage),
          c5: nv(item.Total),
          c6: nv(item.Besoins),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp5_A_3_c_Appareils_Informatiques_et_accessoires`
      );
      return reject(err);
    }
  });
};

/**
 * Ce tableau n’est pas encore implémenté dans l’ancien rapport
 * Nous avons utiliser la tbl_autres_activite_planning par defaut
 */
const chp5_B_1_a_Activites_du_COGES = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      " " AS DatesPeriodes, 
      tbl_autres_activites_planning.lib_activite AS ActivitesMenees, 
      tbl_autres_activites_planning.desc_activite AS Observations
      FROM tbl_autres_activites_planning;
         `;
      const sqlResult = await fetchFromMsAccess<IChp5B_1_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp5B_1_a, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.DatesPeriodes),
          c2: nv(item.ActivitesMenees),
          c3: nv(item.Observations),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp5_B_1_a_Activites_du_COGES`);
      return reject(err);
    }
  });
};


/**
 * Ce tableau n’est pas encore implémenté dans l’ancien rapport
 * Nous avons utiliser la tbl_autres_activite_planning par defaut
 */
const chp5_B_1_b_Etat_d_execution_des_fonds_COGES = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
         " " AS EffectifTotal, 
         " " AS SommeAllouee, 
         " " AS Depenses, 
         " " AS Disponible,
         tbl_autres_activites_planning.lib_activite AS ActivitesMenees, 
         tbl_autres_activites_planning.desc_activite AS Observations
         FROM tbl_autres_activites_planning;
            `;
      const sqlResult = await fetchFromMsAccess<IChp5B_1_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp5B_1_b, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.EffectifTotal),
          c2: nv(item.SommeAllouee),
          c3: nv(item.Depenses),
          c4: nv(item.Disponible),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp5_B_1_b_Etat_d_execution_des_fonds_COGES`
      );
      return reject(err);
    }
  });
};

/**
 *  la Table n'existe pas dans SPIDER 
 */
const chp5_B_2_ETAT_D_EXECUTION_DES_BUDGETS = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      " " AS EffectifTotal, 
      " " AS BudgetGeneral1, 
      " " AS Faes1, 
      " " AS BudgetGeneral2, 
      " " AS Faes2, 
      " " AS BudgetGeneral3, 
      " " AS Faes3,
      tbl_autres_activites_planning.lib_activite AS ActivitesMenees, 
      tbl_autres_activites_planning.desc_activite AS Observations
      FROM tbl_autres_activites_planning;
         `;
      const sqlResult = await fetchFromMsAccess<IChp5B_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp5B_2, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.EffectifTotal),
          c2: nv(item.BudgetGeneral1),
          c3: nv(item.Faes1),
          c4: nv(item.BudgetGeneral2),
          c5: nv(item.Faes2),
          c6: nv(item.BudgetGeneral3),
          c7: nv(item.Faes3),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp5_B_2_ETAT_D_EXECUTION_DES_BUDGETS`);
      return reject(err);
    }
  });
};

/*** *****fin chapitre 5 ***
 *
 *
 *
 **************************************************************************/


const rapport = (data: any): Promise<IReportData> => {
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


      const chp1_A_3_a = await chp1_A_3_a_Liste_des_Animateurs_des_Unites_Pedagogiques();
      const chp1_A_3_b = await chp1_A_3_b_Activites_des_Unites_Pedagogiques();
      const chp1_A_4_a = await chp1_A_4_a_Liste_des_Responsables_des_Conseils_d_Enseignement();
      const chp1_A_4_b = await chp1_A_4_b_Activites_des_Conseils_d_Enseignement();
     
      const chp1_A_5_a = await chp1_A_5_a_Chef_d_etablissement();
      const chp1_A_5_b = await chp1_A_5_b_Conseillers_Pedagogiques();
      const chp1_A_5_c = await chp1_A_5_c_Inspecteurs();
      const chp1_A_6 = await chp1_A_6_Formations();
      const chp1_B_1 = await chp1_B_1_stat_resul_scol_par_clas();
      const chp1_B_2 = await chp1_B_2_liste_nominative();
      const chp1_B_3 = await chp1_B_3_liste_major_classe_niveau();
      const chp1_B_4 = await chp1_B_4_eleves_en_situation();

      const chp2_A = await chp2_A_liste_transferts();
      const chp2_B = await chp2_B_liste_boursiers();
      const chp2_C = await chp2_C_repartition_des_eleves_par_annee_de_naissance();
      const chp2_D = await chp2_D_effectif_par_niveau_avec_approche_genre();

      const chp3_A_1 = await chp3_A_1_LISTE_DES_MEMBRES_DU_CONSEIL_INTERIEUR();
      const chp3_A_2 = await chp3_A_2_fonctionnement_conseil();
      const chp3_B_1 = await chp3_B_1_liste_membre_conseil_discipline();
      const chp3_B_2 = await chp3_B_2_fonctionnement_conseil_discipline();
      const chp3_C = await chp3_C_activite_para_scolaire();
      const chp3_D_1 = await chp3_D_1_cas_abandon();
      const chp3_D_2 = await chp3_D_2_encadrement_phsychosocial();
      const chp3_D_3 = await chp3_D_3_cas_grossesse();
      const chp3_D_4 = await chp3_D_4_cas_maladies();
      const chp3_D_5 = await chp3_D_5_cas_deces();

      const chp4_A_1 = await chp4_A_1_liste_du_personnel_administratif_et_d_encadrement();
      const chp4_A_2 = await chp4_A_2_etat_besoins_en_pers_admin_encad();
      const chp4_B_1 = await chp4_B_1_liste_personnel_enseignant_par_discipline();
      const chp4_B_2 = await chp4_B_2_etat_besoin_personnel_enseignant();
      const chp4_C_1 = await chp4_C_1_liste_du_personnel_service();
      const chp4_C_2 = await chp4_C_2_etat_besoins_personnel_service();

      const chp5_A_1 = await chp5_A_1_ETAT_DES_LOCAUX();
      const chp5_A_2 = await chp5_A_2_ETAT_DES_INSTALLATIONS_SPORTIVES();
      const chp5_A_3_a = await chp5_A_3_a_Les_mobiliers();
      const chp5_A_3_b = await chp5_A_3_b_Appareils_Electromenagers_et_Divers();
      const chp5_A_3_c = await chp5_A_3_c_Appareils_Informatiques_et_accessoires();
      const chp5_B_1_a = await chp5_B_1_a_Activites_du_COGES();
      const chp5_B_1_b = await chp5_B_1_b_Etat_d_execution_des_fonds_COGES();
      const chp5_B_2 = await chp5_B_2_ETAT_D_EXECUTION_DES_BUDGETS();


      const result = {
        ...dataParams,
        name_report: "public_secondairegeneral_1trimestre",
        path_report: "public/secondaire-general",
        anscol1,
        nometab,
        codeetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        drencomplet,

        chp1_A_3_a,
        chp1_A_3_b,
        chp1_A_4_a,
        chp1_A_4_b,
        chp1_A_5_a,
        chp1_A_5_b,
        chp1_A_5_c,
        chp1_A_6,
        chp1_B_1,
        chp1_B_2,
        chp1_B_3,
        chp1_B_4,

        chp2_A,
        chp2_B,
        chp2_C,
        chp2_D,

        chp3_A_1,
        chp3_A_2,
        chp3_B_1,
        chp3_B_2,
        chp3_C,
        chp3_D_1,
        chp3_D_2,
        chp3_D_3,
        chp3_D_4,
        chp3_D_5,

        chp4_A_1,
        chp4_A_2,
        chp4_B_1,
        chp4_B_2,
        chp4_C_1,
        chp4_C_2,

        chp5_A_1,
        chp5_A_2,
        chp5_A_3_a,
        chp5_A_3_b,
        chp5_A_3_c,
        chp5_B_1_a,

        chp5_B_1_b,
        chp5_B_2,
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
