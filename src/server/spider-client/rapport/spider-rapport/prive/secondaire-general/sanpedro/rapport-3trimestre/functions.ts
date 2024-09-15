import { _selectSql } from './../../../../../../../databases/index';
import { appCnx, fetchFromMsAccess, paramEtabObjet } from './../../../../../../../databases/accessDB';
import {
  IChp1_A_3_1_a,
  IChp1_A_3_1_b,
  IChp1_A_3_2_a,
  IChp1_A_3_2_b,
  IChp1_A_4_1,
  IChp1_A_4_2,
  IChp1_A_4_3,
  IChp1_B_1_1,
  IChp1_B_2_1,
  IChp1_B_2_2,
  IChp1_B_3,
  IChp1_B_4_1_1,
  IChp1_B_4_1_2,
  IChp2_B,
  IChp2_C,
  IChp2_D,
  IChp3_B_1,
  IChp3_B_2,
  IChp3_B_3,
  IChp3_B_4,
  IChp4_A,
  IChp4_B,
  IChp6_A_1,
  IChp6_B,

}
  from "./interfaces";

import functions_main from "../../../../utils";

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
/**
 *  ce tableau n'est pas encore cree dans SPIDER
 * nous avons utiliser la table eleves par defaut
 */
const chp1_A_3_1_a_Liste_des_Responsables_des_Conseils_d_Enseignement = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1_A_3_1_a[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_3_1_a, index: number) => {
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
        `err => chp1_A_3_1_a_Liste_des_Responsables_des_Conseils_d_Enseignement`
      );
      return reject(err);
    }
  });
};

// ce tableau n'est pas encore cree dans SPIDER
const chp1_A_3_1_b_Activites_des_Conseils_d_Enseignement = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1_A_3_1_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_3_1_b, index: number) => {
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
        `err => chp1_A_3_1_b_Activites_des_Conseils_d_Enseignement`
      );
      return reject(err);
    }
  });
};

//chp1_A  ce table n'est pas encore cree dans SPIDER table eleve utilise par defaut 
const chp1_A_3_2_a_Liste_des_Animateurs_des_Unites_Pedagogiques = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1_A_3_2_a[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_3_2_a, index: number) => {
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
        `err => chp1_A_3_2_a_Liste_des_Animateurs_des_Unites_Pedagogiques`
      );
      return reject(err);
    }
  });
};

/**
 *  ce tableau n'est pas encore cree dans SPIDER
 * nous avons utiliser la table eleves par defaut
 */
const chp1_A_3_2_b_Activites_des_Unites_Pedagogiques = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1_A_3_2_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_3_2_b, index: number) => {
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
        `err => chp1_A_3_2_b_Activites_des_Unites_Pedagogiques`
      );
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_4_1_Conseillers_Pedagogiques = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1_A_4_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_4_1, index: number) => {
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
      console.log(`err => chp1_A_4_1_Conseillers_Pedagogiques`);
      return reject(err);
    }
  });
};


/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_4_2_Inspecteurs = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp1_A_4_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_4_2, index: number) => {
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
      console.log(`err => chp1_A_4_2_Inspecteurs`);
      return reject(err);
    }
  });
};

/**
 * la table visite est vide
 * cette requette est a revoir (le nom du visiteur)
 */
const chp1_A_4_3_formations = () => {
  return new Promise(async (resolve, reject) => {
    // table non renseignee
    try {
      let sql = `SELECT TOP 1
         ' ' AS qualite_formateur, 
         ' ' AS discipline, 
         ' ' AS dates,
         ' ' AS heures,
         ' ' AS classe,
         ' ' AS obs
         FROM Elèves   
         WHERE Elèves.inscrit=true
         `;
      const sqlResult = await fetchFromMsAccess<IChp1_A_4_3[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1_A_4_3, index: number) => {
        return {
          c1: nv(item.qualite_formateur),
          c2: nv(item.discipline),
          c3: nv(item.dates),
          c4: nv(item.heures),
          c5: nv(item.classe)
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_4_3_formations`);
      return reject(err);
    }
  });
};

//B
const chp1_B_1_1_tableaux_statistiques_des_resultats_scolaire_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle") AND ((Elèves.StatutElève)=1))
      ORDER BY 2, 3, 4;
            UNION ALL 
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.StatutElève
      HAVING ((("T")<>"") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING (((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
          SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=1))
      GROUP BY Niveaux.RefNiveau, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F",""))
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=1))
      GROUP BY Niveaux.RefNiveau, "T"
      HAVING ((("T")<>""))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL 
            SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse  BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.StatutElève
      HAVING ((("T")<>"") AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
           SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Elèves.Sexe, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
          SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3, 4;
                 `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_1[]>(sql, appCnx);

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

      const contentsArray = sqlResult.map((item: IChp1_B_1_1) => {
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

const chp1_B_1_2_tableaux_statistiques_des_resultats_scolaire_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle") AND ((Elèves.StatutElève)=2))
      ORDER BY 2, 3, 4;
            UNION ALL 
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.StatutElève
      HAVING ((("T")<>"") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING (((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
          SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=2))
      GROUP BY Niveaux.RefNiveau, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F",""))
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle") AND ((Elèves.StatutElève)=2))
      GROUP BY Niveaux.RefNiveau, "T"
      HAVING ((("T")<>""))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
      SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL 
            SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse  BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
      GROUP BY Elèves.StatutElève
      HAVING ((("T")<>"") AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
           SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Elèves.Sexe, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
            UNION ALL
          SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING ((("T")<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=2))
      ORDER BY 1, 2, 3, 4;
      
                 `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_1[]>(sql, appCnx);
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

      const contentsArray = sqlResult.map((item: IChp1_B_1_1) => {
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
      console.log(`err => chp1_B_1_2_tableaux_statistiques_des_resultats_scolaire_par_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_1_3_tableaux_statistiques_des_resultats_scolaire_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle"))
      ORDER BY 2, 3, 4;
      
              
              UNION ALL 
              SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
              HAVING ((("T")<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle"))
              ORDER BY 1, 2, 3, 4;
                            
              UNION ALL
              SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
              GROUP BY Elèves.Sexe
              HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
              ORDER BY 1, 2, 3, 4;                            
            
              UNION ALL
              SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
              HAVING ((("T")<>""))
              ORDER BY 1, 2, 3, 4;
                            
              UNION ALL
              SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING (((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle"))
ORDER BY 1, 2, 3, 4;

              UNION ALL
              SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((("T")<>"") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle"))
ORDER BY 1, 2, 3, 4;

              UNION ALL
              SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle"))
GROUP BY Niveaux.RefNiveau, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F",""))
HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
ORDER BY 1, 2, 3, 4;

              UNION ALL
              SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle"))
GROUP BY Niveaux.RefNiveau, "T"
HAVING ((("T")<>""))
ORDER BY 1, 2, 3, 4;

              UNION ALL
              SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
              GROUP BY Elèves.Sexe
              HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
              ORDER BY 1, 2, 3, 4;
                            
              UNION ALL 
              SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse  BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
              HAVING ((("T")<>""))
              ORDER BY 1, 2, 3, 4;
                            
UNION ALL
SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Elèves.Sexe, TypesClasses.filière, Elèves.inscrit
HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY 1, 2, 3, 4;

UNION ALL
SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG3] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG3] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG3]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG3] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG3] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG3])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY TypesClasses.filière, Elèves.inscrit
HAVING ((("T")<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY 1, 2, 3, 4;

                 `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_1[]>(sql, appCnx);
      // console.log("sqlResult.length...:2+++", sqlResult.length)
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

      const contentsArray = sqlResult.map((item: IChp1_B_1_1) => {
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
      // console.log("result.chp1_B_1_1 ... ", JSON.stringify(result));
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_3_tableaux_statistiques_des_resultats_scolaire_par_niveau`);
      return reject(err);
    }
  });
};

const chp1_B_2_liste_nominative = (StatutEleve: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Niveaux.RefNiveau, 
      Classes.RefClasse, 
      Classes.ClasseLong, 
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      Elèves.NomElève AS NomEleve, 
      Elèves.PrénomElève AS PrenomEleve, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      Elèves.LieuNaiss, IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      "" AS ClassePrec, 
      Classes.ClasseCourt AS ClasseEnCours, 
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      "" AS NumDecStatut, 
      Elèves.N°Transf AS NumTransfert, 
      IIf([Bourse]="BE","BE",
      IIf([Bourse]="1/2B","1/2B","")) AS Regime, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      T_Notes.MOYG1, 
      T_Notes.MOYG2, 
      T_Notes.MOYG3, 
      T_Notes.MOYG4, 
      Notes.RangG4, 
      Elèves.Décision AS Decision, 
      (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, 
      (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ
      FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
      WHERE (((IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté"))='${StatutEleve}') AND ((TypesClasses.RefTypeClasse)<14) AND ((Elèves.inscrit)=True))
      ORDER BY Niveaux.RefNiveau, Classes.RefClasse, Elèves.NomElève, T_Notes.MOYG4 DESC;
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_2_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([
        {
          label: '',
          obj: { classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);
      const contentsArray = sqlResult.map((item: IChp1_B_2_1, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomEleve),
          c3: nv(item.PrenomEleve),
          c4: nv(item.DateNaiss),
          c5: nv(item.LieuNaiss),
          c6: nv(item.Genre),
          c7: nv(item.Nationalite),
          c8: nv(item.ClassePrec),
          c9: nv(item.ClasseEnCours),
          c10: nv(item.StatutEleve),
          c11: nv(item.NumDecStatut),
          c12: nv(item.NumTransfert),
          c13: nv(item.Regime),
          c14: nv(item.Redoub),
          c15: nv(item.MOYG1),
          c16: nv(item.MOYG2),
          c17: nv(item.MOYG3),
          c18: nv(item.MOYG4),
          c19: nv(item.RangG4),
          c20: nv(item.Decision),
          label: item.ClasseLong,
          obj: {
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

const chp1_B_2_1_liste_nominative = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
          SELECT Niveaux.RefNiveau, Classes.RefClasse, Classes.ClasseLong, Classes.ClasseCourt, Elèves.MatriculeNational, Elèves.NomElève AS NomEleve, Elèves.PrénomElève AS PrenomEleve, Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, Elèves.LieuNaiss, IIf([Elèves].[Sexe]=1,"M","F") AS Genre, IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite,"" AS ClassePrec,Classes.ClasseCourt AS ClasseEnCours,IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, "" AS NumDecStatut, Elèves.N°Transf AS NumTransfert, IIf([Bourse]="BE","BE",IIf([Bourse]="1/2B","1/2B","")) AS Regime, IIf([Elèves]![Redoub]=True,"R","") AS Redoub, T_Notes.MOYG1, T_Notes.MOYG2, T_Notes.MOYG3, T_Notes.MOYG4, Notes.RangG4, Elèves.Décision AS Decision, (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ
          FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
          WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.inscrit)=True))
          ORDER BY Niveaux.RefNiveau, Elèves.NomElève,Classes.RefClasse, T_Notes.MOYG4 DESC;
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_2_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([
        {
          label: '',
          obj: { classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);
      const contentsArray = sqlResult.map((item: IChp1_B_2_1, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomEleve),
          c3: nv(item.PrenomEleve),
          c4: nv(item.DateNaiss),
          c5: nv(item.LieuNaiss),
          c6: nv(item.Genre),
          c7: nv(item.Nationalite),
          c8: nv(item.ClassePrec),
          c9: nv(item.ClasseEnCours),
          c10: nv(item.StatutEleve),
          c11: nv(item.NumDecStatut),
          c12: nv(item.NumTransfert),
          c13: nv(item.Regime),
          c14: nv(item.Redoub),
          c15: nv(item.MOYG1),
          c16: nv(item.MOYG2),
          c17: nv(item.MOYG3),
          c18: nv(item.MOYG4),
          c19: nv(item.RangG4),
          c20: nv(item.Decision),
          label: item.ClasseLong,
          obj: {
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

const chp1_B_2_4_tableau_des_langues = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
          SELECT Elèves.LV2 AS Langue, IIf([Elèves].[Sexe]=1,"Garçons","Filles") AS Genre, Count(IIf([Classes].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([Classes].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_4e]+[_3e]) AS ST1, Count(IIf([Classes].[RefTypeClasse] In (5,6),1,Null)) AS _2nd, Count(IIf([Classes].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere, Count(IIf([Classes].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle, Val([_2nd]+[_1ere]+[_Tle]) AS ST2, Val([ST1]+[ST2]) AS ST3
          FROM (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse
          GROUP BY Elèves.LV2, Elèves.inscrit, TypesClasses.filière, Elèves.Sexe
          HAVING (((Elèves.LV2)<>"") AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.filière)=1))
          ORDER BY 1, 2 DESC;
          UNION ALL
          SELECT "TOTAL" AS Langue, IIf([Elèves].[Sexe]=1,"Garçons","Filles") AS Genre, Count(IIf([Classes].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([Classes].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_4e]+[_3e]) AS ST1, Count(IIf([Classes].[RefTypeClasse] In (5,6),1,Null)) AS _2nd, Count(IIf([Classes].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere, Count(IIf([Classes].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle, Val([_2nd]+[_1ere]+[_Tle]) AS ST2, Val([ST1]+[ST2]) AS ST3
          FROM (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse
          WHERE (((Elèves.LV2)<>""))
          GROUP BY Elèves.inscrit, TypesClasses.filière, Elèves.Sexe
          HAVING (((Elèves.inscrit)=Yes) AND ((TypesClasses.filière)=1))
          ORDER BY 1, 2 DESC;
      
                 `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_2_2[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: [
          {
            genre: "",
            col: ["", "", "", "", "", "", "", ""],
          },
        ],
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_2_2) => {
        const items = _.omit(item, ["Langue", "Genre"]);
        return {
          label: item.Langue,
          cols: [
            {
              genre: item.Genre,
              col: [...Object.values(items)],
            },
          ],
        };
      });
      const result = await functions_main.formatGroupeByLabel(contentsArray);
      // console.log("result.chp1_B_2_2 ... ", JSON.stringify(result[0]));
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_2_4_tableau_des_langues`);
      return reject(err);
    }
  });
};

const chp1_B_3_liste_major_classe_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      TypesClasses.RefTypeClasse, 
      Classes.ClasseCourt, 
      T_Notes.MOYG3 AS MoyG3, 
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
       IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2,
      Elèves.LV2 AS Lang,
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      Elèves.Décision AS NumDeciAffect, 
      Notes.RangG3
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Notes.RangG3) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY TypesClasses.RefTypeClasse, Classes.ClasseCourt, T_Notes.MOYG3 DESC , Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];  
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_3[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        group: [{}]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_3, i: number) => {
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
          c9: nv(item.Lang2),
          c10: nv(item.MoyG3),
          c11: nv(item.RangG3),
          c12: nv(item.ClasseCourt),
          label: item.label,
          obj: { label: item.label },
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

// Examen blanc
const chp1_B_4_1_1_examen_blanc_bepc = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT Niveaux.RefNiveau, 
      IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
      [NiveauCourt] & " " & [Série] AS Classe, 
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
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série]
      HAVING (((Niveaux.RefNiveau)=4));        
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_4_1_1[]>(sql, appCnx);

      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_B_4_1_1, i: number) => {
        const items = _.omit(item, ["RefNiveau", "Classe", "CycleX"]);
        return {
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_4_1_1_examen_blanc_bepc`);
      return reject(err);
    }
  });
};

const chp1_B_4_1_2_examen_blanc_bac = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Niveaux.RefNiveau, 
      [NiveauCourt] & " " & [Série] AS Serie, 
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
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, [NiveauCourt] & " " & [Série], TypesClasses.Niveau, TypesClasses.RefTypeClasse
      HAVING (((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14)); 
      UNION ALL
      SELECT Niveaux.RefNiveau, "TOTAL" AS Serie, Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2,1,Null)) AS InscritFille, Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1,1,Null)) AS InscritGarçon, [InscritFille]+[InscritGarçon] AS TotalInscrit, Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2,1,Null)) AS PresentFille, Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1,1,Null)) AS PresentGarçon, [PresentFille]+[PresentGarçon] AS TotalPresent, Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2,1,Null)) AS AdmisFille, Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1,1,Null)) AS AdmisGarçon, [AdmisFille]+[AdmisGarçon] AS TotalAdmis, IIf([PresentFille]=0,0,Round([AdmisFille]/[PresentFille]*100,2)) AS TauxFille, IIf([PresentGarçon]=0,0,Round([AdmisGarçon]/[PresentGarçon]*100,2)) AS TauxGarçon, IIf([TotalPresent]=0,0,Round([TotalAdmis]/[TotalPresent]*100,2)) AS TotalTaux
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14))
      GROUP BY Niveaux.RefNiveau;
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_4_1_2[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_4_1_2, i: number) => {
        const items = _.omit(item, ["RefNiveau", "Serie"]);
        return {
          label: item.Serie,
          cols: Object.values(items),
        };
      });

      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_4_1_2_examen_blanc_bac`);
      return reject(err);
    }
  });
};

// Examan de fin année
const chp1_B_4_2_1_examen_fin_annee_bepc = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Niveaux.RefNiveau, 
      IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
      [NiveauCourt] & " " & [Série] AS Classe, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2,1,Null)) AS InscritFille, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1,1,Null)) AS InscritGarçon, 
      [InscritFille]+[InscritGarçon] AS TotalInscrit, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2,1,Null)) AS PresentFille, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1,1,Null)) AS PresentGarçon, 
      [PresentFille]+[PresentGarçon] AS TotalPresent, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2,1,Null)) AS AdmisFille, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1,1,Null)) AS AdmisGarçon, 
      [AdmisFille]+[AdmisGarçon] AS TotalAdmis, 
      IIf([PresentFille]=0,0,Round([AdmisFille]/[PresentFille]*100,2)) AS TauxFille, 
      IIf([PresentGarçon]=0,0,Round([AdmisGarçon]/[PresentGarçon]*100,2)) AS TauxGarçon, 
      IIf([TotalPresent]=0,0,Round([TotalAdmis]/[TotalPresent]*100,2)) AS TotalTaux
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série]
      HAVING (((Niveaux.RefNiveau)=4));  
        `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_4_1_1[]>(sql, appCnx);
      const isEmpty = {
        cols: ["", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp1_B_4_1_1, i: number) => {
        const items = _.omit(item, ["RefNiveau", "Classe", "CycleX"]);
        return {
          cols: Object.values(items),
        };
      });
      // console.log("contentsArray ...", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_4_2_1_examen_fin_annee_bepc`);
      return reject(err);
    }
  });
};

const chp1_B_4_2_2_examen_fin_annee_bac = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Niveaux.RefNiveau, 
      [NiveauCourt] & " " & [Série] AS Serie, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2,1,Null)) AS InscritFille, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1,1,Null)) AS InscritGarçon, 
      [InscritFille]+[InscritGarçon] AS TotalInscrit, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2,1,Null)) AS PresentFille, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1,1,Null)) AS PresentGarçon, 
      [PresentFille]+[PresentGarçon] AS TotalPresent, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2,1,Null)) AS AdmisFille, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1,1,Null)) AS AdmisGarçon, 
      [AdmisFille]+[AdmisGarçon] AS TotalAdmis, 
      IIf([PresentFille]=0,0,Round([AdmisFille]/[PresentFille]*100,2)) AS TauxFille, 
      IIf([PresentGarçon]=0,0,Round([AdmisGarçon]/[PresentGarçon]*100,2)) AS TauxGarçon, 
      IIf([TotalPresent]=0,0,Round([TotalAdmis]/[TotalPresent]*100,2)) AS TotalTaux
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, [NiveauCourt] & " " & [Série], TypesClasses.Niveau, TypesClasses.RefTypeClasse
      HAVING (((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14));
      UNION ALL
      SELECT Niveaux.RefNiveau, "TOTAL" AS Serie, Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2,1,Null)) AS InscritFille, Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1,1,Null)) AS InscritGarçon, [InscritFille]+[InscritGarçon] AS TotalInscrit, Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2,1,Null)) AS PresentFille, Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1,1,Null)) AS PresentGarçon, [PresentFille]+[PresentGarçon] AS TotalPresent, Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2,1,Null)) AS AdmisFille, Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1,1,Null)) AS AdmisGarçon, [AdmisFille]+[AdmisGarçon] AS TotalAdmis, IIf([PresentFille]=0,0,Round([AdmisFille]/[PresentFille]*100,2)) AS TauxFille, IIf([PresentGarçon]=0,0,Round([AdmisGarçon]/[PresentGarçon]*100,2)) AS TauxGarçon, IIf([TotalPresent]=0,0,Round([TotalAdmis]/[TotalPresent]*100,2)) AS TotalTaux
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.Niveau)=7) AND ((TypesClasses.RefTypeClasse)<14))
      GROUP BY Niveaux.RefNiveau;
      `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_4_1_2[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_B_4_1_2, i: number) => {
        const items = _.omit(item, ["RefNiveau", "Serie"]);
        return {
          label: item.Serie,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_4_2_2_examen_fin_annee_bac`);
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
const chp2_B_repartition_des_eleves_par_annee_de_naissance = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])) AS label, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (1),1,Null)) AS _6e_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (1),1,Null)) AS _6e_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (2),1,Null)) AS _5e_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (2),1,Null)) AS _5e_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (3),1,Null)) AS _4e_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (3),1,Null)) AS _4e_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (4),1,Null)) AS _3e_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (4),1,Null)) AS _3e_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (1,2,3,4),1,Null)) AS ST1_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (1,2,3,4),1,Null)) AS ST1_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (5,6),1,Null)) AS _2nd_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (5,6),1,Null)) AS _2nd_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] Between 5 And 13,1,Null)) AS ST2_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] Between 5 And 13,1,Null)) AS ST2_F, Val([ST1_G]+[ST2_G]) AS ST_G, Val([ST1_F]+[ST2_F]) AS ST_F, Val([ST_F]+[ST_G]) AS T
              FROM (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse
              GROUP BY IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])), Elèves.inscrit, TypesClasses.filière
              HAVING (((IIf(IsNull([DateNaiss]),"Inconnue",Year([DateNaiss])))<>"1961") AND ((Elèves.inscrit)=Yes) AND ((TypesClasses.filière)=1))
              ORDER BY 1;
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_B[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp2_B) => {
        const items = _.omit(item, ["label"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      const resultSum = functions_main.addSumRow(contentsArray, "TOTAL", "#EBEBEB");
      const result = functions_main.rav2(resultSum);
      // console.log("contentsArray ... ", contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_B_repartition_des_eleves_par_annee_de_naissance`);
      return reject(err);
    }
  });
};

const chp2_C_liste_boursiers_et_demi_boursiers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT Niveaux.RefNiveau, Niveaux.NiveauCourt, Elèves.MatriculeNational, [NomElève] & " " & [PrénomElève] AS NomComplet, IIf([Sexe]=1,"M","F") AS Genre, Format([DateNaiss],"Short Date") AS DateNais, Elèves.LieuNaiss, IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, T_Notes.MoyG3, Notes.RangG3, IIf([Bourse]="BE","BE","1/2B") AS Regime, Classes.ClasseCourt
              FROM ((((TypesClasses INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) INNER JOIN T_Notes ON (TypesClasses.RefTypeClasse = T_Notes.RefTypeClasse) AND (Elèves.RefElève = T_Notes.RefElève)) INNER JOIN Notes ON T_Notes.RefElève = Notes.RefElève
              WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Bourse) Is Not Null))
              ORDER BY Niveaux.RefNiveau, T_Notes.MoyG3 DESC;
              
                `;
      const sqlResult = await fetchFromMsAccess<IChp2_C[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_C) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.Genre),
          c4: nv(item.DateNais),
          c5: nv(item.LieuNaiss),
          c6: nv(item.Nationalite),
          c7: nv(item.MoyG3),
          c8: nv(item.RangG3),
          c9: nv(item.Regime),
          c10: nv(item.ClasseCourt),
        };
      });
      // console.log("contentsArray ...", contentsArray)
      //  console.log("result.chp1_E ...",JSON.stringify(contentsArray[0]))
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_C_liste_boursiers_et_demi_boursiers`);
      return reject(err);
    }
  });
};

const chp2_D_pyramides_par_approche_genre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 1 AS orderby, IIf([Elèves].[Sexe]=1,"GARCONS","FILLES") AS label, 
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
      Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1))
      GROUP BY Elèves.Sexe
      HAVING (((Elèves.Sexe) Is Not Null));
     
      `;
      const sqlResult = await fetchFromMsAccess<IChp2_D[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp2_D) => {
        const items = _.omit(item, ["orderby", "label"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      const resultSum = functions_main.addSumRow(contentsArray, "TOTAL", "#EBEBEB");
      // console.log("contentsArray ... ", contentsArray);
      resolve(resultSum);
    } catch (err: any) {
      console.log(`err => chp2_D_pyramides_par_approche_genre`);
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
const chp3_B_1_deces = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp3_B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_B_1, index: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.StatutEleve),
          c5: nv(item.CauseDeces),
        };
      });

      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_B_1_deces`);
      return reject(err);
    }
  });
};

const chp3_B_2_cas_de_grossesse = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Int((Date()-[DateNaiss])/365.5) AS Age,
      Classes.ClasseCourt,
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      [Elèves.ResidencePère] & ", " & [Elèves.MobilePère] AS AdresseParent, 
      Format(tbl_cs_grossesse.DateDepotCertificat,"Short Date") AS DateDepotCertificat, 
      Format(tbl_cs_grossesse.DateAccouchement,"Short Date") AS DateAccouchement, 
      "_" AS NomAuteur,
      "_" AS FonctionAuteur,
      [MobilePère] & " \ " & [MobileMère] AS ContactsFamille,
      "" AS Contacts
      FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_grossesse ON Elèves.RefElève = tbl_cs_grossesse.RefElève) ON Classes.RefClasse = Elèves.RefClasse;    
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_B_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_B_2, index: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.DateNaiss),
          c5: nv(item.DateAccouchement),
          c6: nv(item.NomAuteur),
          c7: nv(item.FonctionAuteur),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_B_2_cas_de_grossesse`);
      return reject(err);
    }
  });
};

const chp3_B_3_maladies = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Elèves.MatriculeNational, [NomElève] & " " & [PrénomElève] AS NomComplet, Classes.ClasseCourt,
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      [MobilePère] & " \ " & [MobileMère] AS ContactsFamille, 
      tbl_cs_maladie.NatureMaladie,
      tbl_cs_maladie.DureeMaladie
      FROM (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN tbl_cs_maladie ON Elèves.RefElève = tbl_cs_maladie.RefElève;
        `;
      const sqlResult = await fetchFromMsAccess<IChp3_B_3[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_B_3, index: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.DateNaiss),
          c5: nv(item.NatureMaladie),
          c6: nv(item.DureeMaladie),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_B_3_maladies`);
      return reject(err);
    }
  });
};

const chp3_B_4_abandon = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Elèves.MatriculeNational, [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Classes.ClasseCourt, [MobilePère] & " \ " & [MobileMère] AS ContactsFamille,
       Format([Elèves].[DateNaiss],"Short Date") AS DateNaiss,
        Format([tbl_cs_abandon].[DateAbandon],"Short Date") AS DateAbandon, 
        tbl_cs_abandon.RaisonAbandon
      FROM (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN tbl_cs_abandon ON Elèves.RefElève = tbl_cs_abandon.RefElève;
                    `;
      const sqlResult = await fetchFromMsAccess<IChp3_B_4[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_B_4, index: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.ClasseCourt),
          c4: nv(item.DateNaiss),
          c5: nv(item.RaisonAbandon),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_B_4_abandon`);
      return reject(err);
    }
  });
};

/******* fin chapitre 3 *****
 *
 *
 
 **************************************************************************************************/

//*** debut chapitre 4 ***
const chp4_A_etat_du_personnel_administratif_et_encadrement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT [Personnel.NomPers] & "" & [Personnel.PrénomPers] AS NomComplet, Diplomes.NomDiplome, Fonction.Fonction, Personnel.N°CNPS AS NumCnps, Personnel.N°AutEnseigner AS NumAut, Personnel.TélPers AS Contacts, Fonction.Groupe
      FROM (Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
      WHERE (((Fonction.Groupe) In (1,3)) AND ((Personnel.fil_gen)=True));
              `;
      const sqlResult = await fetchFromMsAccess<IChp4_A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_A, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.NomDiplome),
          c3: nv(item.Fonction),
          c4: nv(item.NumCnps),
          c5: nv(item.NumAut),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_A_etat_du_personnel_administratif_et_encadrement`);
      return reject(err);
    }
  });
};

const chp4_B_liste_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Personnel.RefPersonnel, [NomPers] & " " & [PrénomPers] AS NomComplet, Personnel.Sexe AS Genre, Diplomes.NomDiplome, IIf([Personnel].[Matricule] Is Not Null And [Personnel].[RefTypePers]=2,"√","") AS FonctVacatire, IIf([Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=3,"√","") AS PrivePermanent, IIf([Personnel].[Matricule] Is Null And [Personnel].[RefTypePers]=2,"√","") AS PriveVacataire, Personnel.VolumeHoraire, Personnel.N°CNPS AS NumCnps, Personnel.N°AutEnseigner AS NumAut, Matières.MatCourt, Personnel.TélPers AS Contacts, Personnel.Fonction
      FROM (Fonction INNER JOIN (Personnel INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) ON Fonction.RefFonction = Personnel.Fonction) LEFT JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome
      WHERE (((Personnel.Fonction)=6)); 
        `;
      const sqlResult = await fetchFromMsAccess<IChp4_B[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_B, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.NomDiplome),
          c3: nv(item.FonctVacatire),
          c4: nv(item.PrivePermanent),
          c5: nv(item.PriveVacataire),
          c6: nv(item.VolumeHoraire),
          c7: nv(item.NumCnps),
          c8: nv(item.NumAut),
          c9: nv(item.MatCourt),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_B_liste_personnel_enseignant`);
      return reject(err);
    }
  });
};

const chp4_C_etat_du_personnel_de_service = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT [Personnel.NomPers] & "" & [Personnel.PrénomPers] AS NomComplet, Diplomes.NomDiplome, Fonction.Fonction, Personnel.N°CNPS AS NumCnps, Fonction.Groupe
      FROM (Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
      WHERE (((Fonction.Groupe)=4) AND ((Personnel.fil_gen)=True));
                    `;
      const sqlResult = await fetchFromMsAccess<IChp4_A[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp4_A, index: number) => {
        return {
          c1: nv(item.NomComplet),
          c2: nv(item.NomDiplome),
          c3: nv(item.Fonction),
          c4: nv(item.NumCnps),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp4_C_etat_du_personnel_de_service`);
      return reject(err);
    }
  });
};
/******* fin chapitre 4 *****
 *
 *
 
 **************************************************************************************************/

const chp6_A_1_situation_des_effectifs_apres_conseil_eleves_affectes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, 1 AS orderby, Classes.OrdreClasse, Classes.ClasseCourt, Niveaux.NiveauCourt, "#FFFF" AS bg, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, [Gadmis]+[Fadmis] AS T1, Count(IIf([Elèves].[Décision]="R" And [SEXE]=1,1,Null)) AS Gredouble, Count(IIf([Elèves].[Décision]="R" And [SEXE]=2,1,Null)) AS Fredouble, [Gredouble]+[Fredouble] AS T2, Count(IIf([Elèves].[Décision]="E" And [SEXE]=1,1,Null)) AS Gexclus, Count(IIf([Elèves].[Décision]="E" And [SEXE]=2,1,Null)) AS Fexclus, [Gexclus]+[Fexclus] AS T3, [Gredouble] AS EFG_FinAnnee, [Fredouble] AS EFF_FinAnnee, [EFG_FinAnnee]+[EFF_FinAnnee] AS EFT_FinAnnee, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, Classes.OrdreClasse, Classes.ClasseCourt, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3;
      
      UNION ALL
      SELECT First(Niveaux.RefNiveau) AS RefNiveau, 2 AS orderby, First(Classes.OrdreClasse) AS OrdreClasse, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Niveaux.NiveauCourt, "#E3E3E3" AS bg, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, [Gadmis]+[Fadmis] AS T1, Count(IIf([Elèves].[Décision]="R" And [SEXE]=1,1,Null)) AS Gredouble, Count(IIf([Elèves].[Décision]="R" And [SEXE]=2,1,Null)) AS Fredouble, [Gredouble]+[Fredouble] AS T2, Count(IIf([Elèves].[Décision]="E" And [SEXE]=1,1,Null)) AS Gexclus, Count(IIf([Elèves].[Décision]="E" And [SEXE]=2,1,Null)) AS Fexclus, [Gexclus]+[Fexclus] AS T3, [Gredouble] AS EFG_FinAnnee, [Fredouble] AS EFF_FinAnnee, [EFG_FinAnnee]+[EFF_FinAnnee] AS EFT_FinAnnee, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3;
      
      UNION ALL
      SELECT First(8) AS RefNiveau, 3 AS orderby, 100000 AS OrdreClasse, "TOTAL Etabliss" AS ClasseCourt, "Etabliss" AS NiveauCourt, "#E3E3E3" AS bg, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, [Gadmis]+[Fadmis] AS T1, Count(IIf([Elèves].[Décision]="R" And [SEXE]=1,1,Null)) AS Gredouble, Count(IIf([Elèves].[Décision]="R" And [SEXE]=2,1,Null)) AS Fredouble, [Gredouble]+[Fredouble] AS T2, Count(IIf([Elèves].[Décision]="E" And [SEXE]=1,1,Null)) AS Gexclus, Count(IIf([Elèves].[Décision]="E" And [SEXE]=2,1,Null)) AS Fexclus, [Gexclus]+[Fexclus] AS T3, [Gredouble] AS EFG_FinAnnee, [Fredouble] AS EFF_FinAnnee, [EFG_FinAnnee]+[EFF_FinAnnee] AS EFT_FinAnnee, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY TypesClasses.filière, Elèves.inscrit, Elèves.StatutElève
      HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Elèves.StatutElève)=1))
      ORDER BY 1, 2, 3;
      
           `;

      const sqlResult = await fetchFromMsAccess<IChp6_A_1[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "",
          "", "", "", "", "", "", "", "", "", ""],
      };

      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp6_A_1) => {
        const items = _.omit(item, ["RefNiveau", "bg", "NiveauCourt", "NiveauSerie", "EffectClasse", "ClasseCourt", "OrdreClasse", "orderby"]);
        return {
          bg: item.bg,
          label: item.ClasseCourt,
          cols: Object.values(items),
        };
      });

      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp6_A_1_situation_des_effectifs_apres_conseil_eleves_affectes`);
      return reject(err);
    }
  });
};

const chp6_A_2_situation_des_effectifs_apres_conseil_eleves_affectes_et_non_acceptes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT Niveaux.RefNiveau, 1 AS orderby, Classes.OrdreClasse, Classes.ClasseCourt, Niveaux.NiveauCourt, "#FFFF" AS bg, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, [Gadmis]+[Fadmis] AS T1, Count(IIf([Elèves].[Décision]="R" And [SEXE]=1,1,Null)) AS Gredouble, Count(IIf([Elèves].[Décision]="R" And [SEXE]=2,1,Null)) AS Fredouble, [Gredouble]+[Fredouble] AS T2, Count(IIf([Elèves].[Décision]="E" And [SEXE]=1,1,Null)) AS Gexclus, Count(IIf([Elèves].[Décision]="E" And [SEXE]=2,1,Null)) AS Fexclus, [Gexclus]+[Fexclus] AS T3, [Gredouble] AS EFG_FinAnnee, [Fredouble] AS EFF_FinAnnee, [EFG_FinAnnee]+[EFF_FinAnnee] AS EFT_FinAnnee, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
            FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
            GROUP BY Niveaux.RefNiveau, Classes.OrdreClasse, Classes.ClasseCourt, Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
            HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
            ORDER BY 1, 2, 3;
            
            
            UNION ALL
            SELECT First(Niveaux.RefNiveau) AS RefNiveau, 2 AS orderby, First(Classes.OrdreClasse) AS OrdreClasse, "Total " & First([Niveaux].[NiveauCourt]) AS ClasseCourt, Niveaux.NiveauCourt, "#E3E3E3" AS bg, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, [Gadmis]+[Fadmis] AS T1, Count(IIf([Elèves].[Décision]="R" And [SEXE]=1,1,Null)) AS Gredouble, Count(IIf([Elèves].[Décision]="R" And [SEXE]=2,1,Null)) AS Fredouble, [Gredouble]+[Fredouble] AS T2, Count(IIf([Elèves].[Décision]="E" And [SEXE]=1,1,Null)) AS Gexclus, Count(IIf([Elèves].[Décision]="E" And [SEXE]=2,1,Null)) AS Fexclus, [Gexclus]+[Fexclus] AS T3, [Gredouble] AS EFG_FinAnnee, [Fredouble] AS EFF_FinAnnee, [EFG_FinAnnee]+[EFF_FinAnnee] AS EFT_FinAnnee, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
            FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
            GROUP BY Niveaux.NiveauCourt, TypesClasses.filière, Elèves.inscrit
            HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
            ORDER BY 1, 2, 3;
            
            
            UNION ALL
            SELECT First(8) AS RefNiveau, 3 AS orderby, 100000 AS OrdreClasse, "TOTAL Etabliss" AS ClasseCourt, "Etabliss" AS NiveauCourt, "#E3E3E3" AS bg, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG4]>=10 And [SEXE]=1,1,Null)) AS Gadmis, Count(IIf([MOYG4]>=10 And [SEXE]=2,1,Null)) AS Fadmis, [Gadmis]+[Fadmis] AS T1, Count(IIf([Elèves].[Décision]="R" And [SEXE]=1,1,Null)) AS Gredouble, Count(IIf([Elèves].[Décision]="R" And [SEXE]=2,1,Null)) AS Fredouble, [Gredouble]+[Fredouble] AS T2, Count(IIf([Elèves].[Décision]="E" And [SEXE]=1,1,Null)) AS Gexclus, Count(IIf([Elèves].[Décision]="E" And [SEXE]=2,1,Null)) AS Fexclus, [Gexclus]+[Fexclus] AS T3, [Gredouble] AS EFG_FinAnnee, [Fredouble] AS EFF_FinAnnee, [EFG_FinAnnee]+[EFF_FinAnnee] AS EFT_FinAnnee, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
            FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
            GROUP BY TypesClasses.filière, Elèves.inscrit
            HAVING (((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
            ORDER BY 1, 2, 3;
            
      `;
      const sqlResult = await fetchFromMsAccess<IChp6_A_1[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "",
          "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp6_A_1) => {
        const items = _.omit(item, ["RefNiveau", "bg", "NiveauCourt", "NiveauSerie", "EffectClasse", "ClasseCourt", "OrdreClasse", "orderby"]);
        return {
          bg: item.bg,
          label: item.ClasseCourt,
          cols: Object.values(items),
        };
      });

      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp6_A_2_situation_des_effectifs_apres_conseil_eleves_affectes_et_non_acceptes`);
      return reject(err);
    }
  });
};

const chp6_B_pyramides_previsionnelles = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT "Eff. probable" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
      FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      
      UNION ALL 
      SELECT "Base souhaitée" AS label, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=1) AS _6e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=2) AS _5e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=3) AS _4e, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=4) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=5) AS _2ndA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=6) AS _2ndC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=7) AS _1ereA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=8) AS _1ereC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=9) AS _1ereD, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse In(10,13)) AS _TleA, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=11) AS _TleC, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse=12) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
      FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Elèves.Inscrit, TypesClasses.filière
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));
      
      `;
      const sqlResult = await fetchFromMsAccess<IChp6_B[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp6_B, index: number) => {
        const items = _.omit(item, ["label"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp6_B_pyramides_previsionnelles`);
      return reject(err);
    }
  });
};

const chp6_C_situation_des_eleves_affectes_de_l_etat = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
          SELECT IIf([Elèves].[Bourse]="BE" Or [Elèves].[Bourse]="1/2B","Boursiers","Non Boursiers") AS label, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (1),1,Null)) AS _6e_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (1),1,Null)) AS _6e_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (2),1,Null)) AS _5e_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (2),1,Null)) AS _5e_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (3),1,Null)) AS _4e_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (3),1,Null)) AS _4e_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (4),1,Null)) AS _3e_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (4),1,Null)) AS _3e_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (1,2,3,4),1,Null)) AS ST1_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (1,2,3,4),1,Null)) AS ST1_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (5,6),1,Null)) AS _2nd_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (5,6),1,Null)) AS _2nd_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle_F, Count(IIf([Elèves].[Sexe]=1 And [Classes].[RefTypeClasse] Between 5 And 13,1,Null)) AS ST2_G, Count(IIf([Elèves].[Sexe]=2 And [Classes].[RefTypeClasse] Between 5 And 13,1,Null)) AS ST2_F, Val([ST1_G]+[ST2_G]) AS ST_G, Val([ST1_F]+[ST2_F]) AS ST_F
          FROM (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse
          GROUP BY IIf([Elèves].[Bourse]="BE" Or [Elèves].[Bourse]="1/2B","Boursiers","Non Boursiers"), Elèves.inscrit, TypesClasses.filière
          HAVING (((Elèves.inscrit)=Yes) AND ((TypesClasses.filière)=1))
          ORDER BY 1;
        `;
      const sqlResult = await fetchFromMsAccess<IChp2_B[]>(sql, appCnx);
      const isEmpty = {
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      }
      if (sqlResult.length === 0) return resolve([isEmpty]);

      const contentsArray = sqlResult.map((item: IChp2_B) => {
        const items = _.omit(item, ["label"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      const result = functions_main.addSumRow(contentsArray, "TOTAL", "#EBEBEB");;
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp6_C_situation_des_eleves_affectes_de_l_etat`);
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


      const chp1_A_3_1_a = await chp1_A_3_1_a_Liste_des_Responsables_des_Conseils_d_Enseignement();
      const chp1_A_3_1_b = await chp1_A_3_1_b_Activites_des_Conseils_d_Enseignement();

      const chp1_A_3_2_a = await chp1_A_3_2_a_Liste_des_Animateurs_des_Unites_Pedagogiques();
      const chp1_A_3_2_b = await chp1_A_3_2_b_Activites_des_Unites_Pedagogiques();
      const chp1_A_4_1 = await chp1_A_4_1_Conseillers_Pedagogiques();
      const chp1_A_4_2 = await chp1_A_4_2_Inspecteurs();
      const chp1_A_4_3 = await chp1_A_4_3_formations();

      const chp1_B_1_1 = await chp1_B_1_1_tableaux_statistiques_des_resultats_scolaire_par_niveau(); //Elèves affectés
      const chp1_B_1_2 = await chp1_B_1_2_tableaux_statistiques_des_resultats_scolaire_par_niveau(); //Elèves non affectés
      const chp1_B_1_3 = await chp1_B_1_3_tableaux_statistiques_des_resultats_scolaire_par_niveau(); //Elèves affectés et non affectés
      const chp1_B_2_1 = await chp1_B_2_liste_nominative("Affecté");
      const chp1_B_2_2 = await chp1_B_2_liste_nominative("Non Affecté");
      const chp1_B_2_3 = await chp1_B_2_1_liste_nominative();//Affecté et Non Affecté

      const chp1_B_2_4 = await chp1_B_2_4_tableau_des_langues();
      const chp1_B_3 = await chp1_B_3_liste_major_classe_niveau();
      const chp1_B_4_1_1 = await chp1_B_4_1_1_examen_blanc_bepc();
      const chp1_B_4_1_2 = await chp1_B_4_1_2_examen_blanc_bac();
      const chp1_B_4_2_1 = await chp1_B_4_2_1_examen_fin_annee_bepc();
      const chp1_B_4_2_2 = await chp1_B_4_2_2_examen_fin_annee_bac();


      const chp2_B = await chp2_B_repartition_des_eleves_par_annee_de_naissance();
      const chp2_C = await chp2_C_liste_boursiers_et_demi_boursiers();
      const chp2_D = await chp2_D_pyramides_par_approche_genre();

      const chp3_B_1 = await chp3_B_1_deces();
      const chp3_B_2 = await chp3_B_2_cas_de_grossesse();
      const chp3_B_3 = await chp3_B_3_maladies();
      const chp3_B_4 = await chp3_B_4_abandon();

      const chp4_A = await chp4_A_etat_du_personnel_administratif_et_encadrement();
      const chp4_B = await chp4_B_liste_personnel_enseignant();
      const chp4_C = await chp4_C_etat_du_personnel_de_service();

      const chp6_A_1 = await chp6_A_1_situation_des_effectifs_apres_conseil_eleves_affectes();
      const chp6_A_2 = await chp6_A_2_situation_des_effectifs_apres_conseil_eleves_affectes_et_non_acceptes();
      const chp6_B = await chp6_B_pyramides_previsionnelles();
      const chp6_C = await chp6_C_situation_des_eleves_affectes_de_l_etat();

      // console.log("data...", anscol1)

      const result = {
        ...dataParams,
        name_report: "prive_secondairegeneral_sanpedro_3trimestre",
        path_report: "prive/secondaire-general/sanpedro",
        anscol1,
        nometab,
        codeetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        drencomplet,

        chp1_A_3_1_a,
        chp1_A_3_1_b,
        chp1_A_3_2_a,
        chp1_A_3_2_b,

        chp1_A_4_1,
        chp1_A_4_2,
        chp1_A_4_3,
        chp1_B_1_1,
        chp1_B_1_2,
        chp1_B_1_3,
        chp1_B_2_1,
        chp1_B_2_2,
        chp1_B_2_3,
        chp1_B_2_4,
        chp1_B_3,
        chp1_B_4_1_1,
        chp1_B_4_1_2,
        chp1_B_4_2_1,
        chp1_B_4_2_2,

        chp2_B,
        chp2_C,
        chp2_D,

        chp3_B_1,
        chp3_B_2,
        chp3_B_3,
        chp3_B_4,

        chp4_A,
        chp4_B,
        chp4_C,

        chp6_A_1,
        chp6_A_2,
        chp6_B,
        chp6_C,
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
