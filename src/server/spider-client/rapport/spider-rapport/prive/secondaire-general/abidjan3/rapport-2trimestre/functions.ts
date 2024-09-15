import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "./../../../../../../../databases/accessDB";
import {
  IChp_A_1,
  IChp_A_1_3_a,
  IChp_A_3_a,
  IChp_A_2_2,
  IChp_A_2_3,
  IChp_3_2,
  IChp_3_1,
  IChp_C_5_4,
  IChp_C_5_6,
  IChp1A_4,
  IChp1_B_c,
  IChp3_3,
  IChp2_4,
  IChp1_B_1_a,
  IChp2_5,
  IChp4_2_1,
  chp3_4_a_1,
  IChp1_B_1_b,
} from "./interfaces";
import functions_main, { nv, paramsEtablisement } from "../../../../utils";
const _ = require("lodash");

//  la table doc_numerique est vide et il manque une table ( nombre)
const chp1_A_1_documents_pedagogiques = () => {
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
      const sqlResult = await fetchFromMsAccess<IChp_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_A_1) => {
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

/**
 *  ce tableau n'est pas encore cree dans SPIDER
 * nous avons utiliser la table eleves par defaut
 */
const chp1_A_3_a_activites_des_unites_pedagogiques = () => {
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
      console.log(`err => chp1_A_3_a_activites_des_unites_pedagogiques`);
      return reject(err);
    }
  });
};

// ce tableau n'est pas encore cree dans SPIDER
const chp1_A_3_b_activites_des_conseils_d_enseignement = () => {
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
const chp1_A_4_visite_classe_et_formation = () => {
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
      console.log(`err =>  chp1_A_4_visite_classe_et_formation`);
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
      Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.cycle, TypesClasses.filière, Elèves.inscrit
      HAVING (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes));
      UNION ALL
      SELECT 2 AS orderby, 
      Niveaux.cycle AS label, 
      (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse BETWEEN 5 AND 14) AS NbreClasses, 
      Count(Elèves.RefElève) AS EffectTotal, 
      Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2,
       IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
       Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
       IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
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
      Count(IIf([MOYG2] Is Null,Null,1)) AS EffectClasse, 
      Count(IIf([MOYG2] Is Null,1,Null)) AS EffectNonClasse, 
      Count(IIf([MOYG2]>=10,1,Null)) AS Tranche1, 
      IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, 
      Count(IIf([MOYG2] Between 8.5 And 9.99,1,Null)) AS Tranche2, 
      IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, 
      Count(IIf([MOYG2] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, 
      IIf([EffectClasse]<1,Null,Round(Sum([MOYG2])/[EffectClasse],2)) AS MoyClasse
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
      // console.log("contentsArray.chp2_5....", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_B_1_a_synthese_generale_du_trimestre`);
      return reject(err);
    }
  });
};

const chp1_B_1_b_tableaux_statistiqures_des_resultats_2e_trimestre = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
      HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle"))
      ORDER BY 2, 3, 4;
         
              UNION ALL 
              SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
              HAVING ((("T")<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="1er Cycle"))
              ORDER BY 1, 2, 3, 4;
                            
              UNION ALL
              SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
              GROUP BY Elèves.Sexe
              HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
              ORDER BY 1, 2, 3, 4;                            
            
              UNION ALL
              SELECT 4 AS RefNiveau, 5 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<5) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="1er Cycle") AND ((TypesClasses.filière)=1))
              HAVING ((("T")<>""))
              ORDER BY 1, 2, 3, 4;
                            
              UNION ALL
              SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], Elèves.Sexe, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING (((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle"))
ORDER BY 1, 2, 3, 4;

              UNION ALL
              SELECT Niveaux.RefNiveau, TypesClasses.RefTypeClasse AS RefTypeClasse, [NiveauCourt] & "" & [Série] AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Niveaux.RefNiveau, TypesClasses.RefTypeClasse, [NiveauCourt] & "" & [Série], TypesClasses.RefTypeClasse, TypesClasses.Filière, Elèves.inscrit, Niveaux.cycle
HAVING ((("T")<>"") AND ((TypesClasses.RefTypeClasse) Not In (10,13)) AND ((TypesClasses.Filière)=1) AND ((Elèves.inscrit)=Yes) AND ((Niveaux.cycle)="2nd Cycle"))
ORDER BY 1, 2, 3, 4;

              UNION ALL
              SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle"))
GROUP BY Niveaux.RefNiveau, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F",""))
HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
ORDER BY 1, 2, 3, 4;

              UNION ALL
              SELECT Niveaux.RefNiveau, 10 AS RefTypeClasse, "Tle A" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#FFFF" AS bg, (Select count(*) from Classes Where refTypeClasse in (10,13)) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True) AND ((Niveaux.cycle)="2nd Cycle"))
GROUP BY Niveaux.RefNiveau, "T"
HAVING ((("T")<>""))
ORDER BY 1, 2, 3, 4;
              UNION ALL
              SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
              GROUP BY Elèves.Sexe
              HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>""))
              ORDER BY 1, 2, 3, 4;
                            
              UNION ALL 
              SELECT 8 AS RefNiveau, 14 AS RefTypeClasse, First(Niveaux.cycle) AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse  BETWEEN 5 AND 13) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
              FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
              WHERE (((Niveaux.cycle)="2nd Cycle") AND ((TypesClasses.filière)=1))
              HAVING ((("T")<>""))
              ORDER BY 1, 2, 3, 4;                            
UNION ALL
SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, Elèves.Sexe, IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")) AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY Elèves.Sexe, TypesClasses.filière, Elèves.inscrit
HAVING (((IIf([Elèves].[Sexe]=1,"G",IIf([Elèves].[Sexe]=2,"F","")))<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY 1, 2, 3, 4;

UNION ALL
SELECT 9 AS RefNiveau, 15 AS RefTypeClasse, "TOTAL GENERAL" AS NiveauSerie, 3 AS Sexe, "T" AS Genre, "#EBEBEB" AS bg, (SELECT Count(*) AS T FROM Classes WHERE RefTypeClasse<14) AS NbreClasses, Count(Elèves.RefElève) AS EffectTotal, Count(IIf([MOYG1] Is Null,Null,1)) AS EffectClasse, Count(IIf([MOYG1] Is Null,1,Null)) AS EffectNonClasse, Count(IIf([MOYG1]>=10,1,Null)) AS Tranche1, IIf([EffectClasse]=0,0,Round([Tranche1]/[EffectClasse]*100,2)) AS Taux1, Count(IIf([MOYG1] Between 8.5 And 9.99,1,Null)) AS Tranche2, IIf([EffectClasse]=0,0,Round([Tranche2]/[EffectClasse]*100,2)) AS Taux2, Count(IIf([MOYG1] Between 0 And 8.49,1,Null)) AS Tranche3, IIf([EffectClasse]=0,0,Round([Tranche3]/[EffectClasse]*100,2)) AS Taux3, IIf([EffectClasse]<1,"",Round(Sum([MOYG1])/[EffectClasse],2)) AS MoyClasse
FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
GROUP BY TypesClasses.filière, Elèves.inscrit
HAVING ((("T")<>"") AND ((TypesClasses.filière)=1) AND ((Elèves.inscrit)=Yes))
ORDER BY 1, 2, 3, 4;
 `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_1_b[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const contentsArray = sqlResult.map((item: IChp1_B_1_b) => {
        const items = _.omit(item, ["RefNiveau", "bg", "label", "Genre", "NbreClasses","RefTypeClasse", "NiveauSerie", "Sexe",]);
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
      // console.log("🚀 ~ returnnewPromise ~ result:", result)
      // console.log("🚀 ~ file: functions.ts:418 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_1_b_tableaux_statistiqures_des_resultats_2e_trimestre`);
      return reject(err);
    }
  });
};

const chp1_B_1_c_statistique_eleves_en_situation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT Niveaux.RefNiveau, 
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
      [GT3B]+[FT3B] AS TT3B, 
      Count(IIf([MOYG2]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, 
      Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, 
      [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), 
      [NiveauCourt] & " " & [Série], 
      TypesClasses.RefTypeClasse, 
      TypesClasses.filière, 
      Elèves.Inscrit
      HAVING (((Niveaux.RefNiveau)<7) AND ((TypesClasses.filière)=1) AND ((Elèves.Inscrit)=True));
      UNION ALL
      SELECT Niveaux.RefNiveau, 
      IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
      "Tle A" AS NiveauSerie, 
      Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS GT1, 
      Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS FT1, 
      [GT1]+[FT1] AS TT1, 
      Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT2, [GT2]+[FT2] AS TT2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3A, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=2,1,Null)) AS FT3A, [GT3A]+[FT3A] AS TT3A, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT3B, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3B, [GT3B]+[FT3B] AS TT3B, Count(IIf([MOYG2]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      WHERE (((TypesClasses.filière)=1) AND ((TypesClasses.RefTypeClasse) In (10,13)) AND ((Elèves.Inscrit)=True))
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]);
      UNION ALL SELECT Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, [NiveauCourt] & " " & [Série] AS NiveauSerie, Count(IIf([MOYG2]>=10 And [SEXE]=1,1,Null)) AS GT1, Count(IIf([MOYG2]>=10 And [SEXE]=2,1,Null)) AS FT1, [GT1]+[FT1] AS TT1, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT2, [GT2]+[FT2] AS TT2, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3A, Count(IIf([MOYG2] Between 8.5 And 9.99 And [Redoub]=-1 And [SEXE]=2,1,Null)) AS FT3A, [GT3A]+[FT3A] AS TT3A, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=1,1,Null)) AS GT3B, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3B, [GT3B]+[FT3B] AS TT3B, Count(IIf([MOYG2]<8.5 And [Redoub]=-1 And [SEXE]=1,1,Null)) AS GT3C, Count(IIf([MOYG2]<8.5 And [Redoub]=0 And [SEXE]=2,1,Null)) AS FT3C, [GT3C]+[FT3C] AS TT3C, [TT3A]+[TT3B]+[TT3C] AS TT3
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série], TypesClasses.RefTypeClasse, TypesClasses.filière, Elèves.Inscrit
      HAVING (((TypesClasses.RefTypeClasse) In (11,12)) AND ((TypesClasses.filière)=1) AND ((Elèves.Inscrit)=True));
        `;
      const sqlResult = await fetchFromMsAccess<IChp1_B_c[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp1_B_c) => {
        const items = _.omit(item, ["RefNiveau", "CycleX", "NiveauSerie"]);
        return {
          group: item.CycleX,
          label: item.NiveauSerie,
          cols: Object.values(items),
        };
      });
      const result = functions_main.formatGroupBy(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_c_statistique_eleves_en_situation`);
      return reject(err);
    }
  });
};

const chp1_B_2_liste_nominative = (StatutEleve: string) => {
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
      Classes.ClasseCourt, 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format(Elèves.DateNaiss,"Short Date") AS DateNaiss, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      IIf(IsNull([Elèves].[Nat]) Or [Elèves].[Nat]="70","",Left([Nationalités].[National],3)) AS Nationalite, 
      IIf([Elèves]![Redoub]=True,"R","") AS Redoub, 
      IIf(IsNull([Elèves].[LV2]),IIf([Classes].[LV2]="Aucune","",Left([Classes].[LV2],3)),Left([Elèves].[LV2],3)) AS Lang1, 
      IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2,
      T_Notes.MOYG2 AS MoyG2, 
      Notes.RangG2, 
      '-' AS MS, 
      (SELECT  [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.PP) AS ProfP, 
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      '' AS NumDeciAffect, 
      IIf(IsNull(Elèves.Obs),"",Elèves.Obs) AS Obs, 
      (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ, 
      TypesClasses.RefTypeClasse
      FROM (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (TypesClasses INNER JOIN ((Elèves LEFT JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Personnel.RefPersonnel = Classes.PP
      WHERE (((TypesClasses.RefTypeClasse)<14) AND ((Elèves.inscrit)=True) AND ((Elèves.StatutElève)${StatutEleve}))
      ORDER BY Classes.OrdreClasse, Niveaux.RefNiveau, Classes.RefClasse, [NomElève] & " " & [PrénomElève]
      `;
      const sqlResult2 = await fetchFromMsAccess<IChp_A_2_2[]>(sql2, appCnx);
      // console.log("🚀 ~ file: functions.ts:527 ~ returnnewPromise ~ sqlResult:", sqlResult)
      if (sqlResult2.length === 0) return resolve([
        {
          label: '',
          obj: { classeLong: '', pp: '', educ: '' },
          group: [{}],
          count: 0
        },
      ]);
      const resultat = functions_main.fusionnerTableaux(sqlResult1, sqlResult2, 'MoyG2')
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
          c9: nv(item.Lang2),
          c10: nv(item.MoyG2),
          c11: nv(item.RangG2),
          c12: nv(item.ClasseCourt),
          c13: nv(item.Appreciations),
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
      console.log(`err => chp1_B_2_liste_nominative`);
      return reject(err);
    }
  });
};

// B
const chp1_B_3_liste_major_classe_par_niveau = () => {
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

      let sql2 = `SELECT 
      Classes.OrdreClasse,
      IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]) AS RefTypeClasse, 
      T_Notes.MOYG2 AS MoyG2, 
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
      IIf([Classes].[LV2]="Aucune","",IIf([Classes].[LV2]="Mixte",Left([Elèves].[LV2],3),Left([Classes].[LV2],3))) AS Lang2,
      IIf([Elèves]![StatutElève]=1,"Affecté","Non Affecté") AS StatutEleve, 
      " " AS NumDeciAffect, 
      Notes.RangG2
      FROM Filières INNER JOIN (Notes RIGHT JOIN ((Niveaux INNER JOIN (((TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_Notes ON Elèves.RefElève = T_Notes.RefElève) ON Niveaux.RefNiveau = TypesClasses.Niveau) LEFT JOIN Nationalités ON Elèves.Nat = Nationalités.CODPAYS) ON Notes.RefElève = Elèves.RefElève) ON Filières.RefFilière = TypesClasses.Filière
      WHERE (((IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]))<14) AND ((Notes.RangG2) Like '1e%') AND ((Filières.RefFilière)=1) AND ((TypesClasses.filière)=1))
      ORDER BY Classes.OrdreClasse, IIf([TypesClasses].[RefTypeClasse]=13,10,[TypesClasses].[RefTypeClasse]), T_Notes.MOYG2 DESC , IIf([NiveauCourt] & " " & [Série]="Tle A1","Tle A",[NiveauCourt] & " " & [Série]), Niveaux.RefNiveau, Classes.ClasseCourt, [NomElève] & " " & [PrénomElève];
      `;
      const sqlResult2 = await fetchFromMsAccess<IChp_A_2_3[]>(sql2, appCnx);
      const isEmpty = {
        label: "",
        group: [{}],
      };
      if (sqlResult2.length === 0) return resolve([isEmpty]);

      // 1. je recupere les occurences distinctes des refTypeClasse
      //  retourne un seul  ReftypyClasse pour un niveau dans le data
      const distinctRefTypeClasse = _.uniqBy(sqlResult2, "RefTypeClasse") as IChp_A_2_3[];
      // 2. je parcours les differents RefTypeClasse
      let result1 = [];
      distinctRefTypeClasse.map(x => {
        // je recupere les élèves du niveau pour chaque RefTypeClasse puis je choisis les 3 premiers objet du tableau
        const currentTypeClasseStudents = sqlResult2.filter(student => student.RefTypeClasse === x.RefTypeClasse)
        const troisMajors = currentTypeClasseStudents.slice(0, 3) // je prends de 0 à 3 (non inclus)
        result1 = result1.concat(troisMajors)
      });

      const resultat = functions_main.fusionnerTableaux(sqlResult1, result1, 'MoyG2')

      const contentsArray = resultat.map((item: any, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomComplet),
          c3: nv(item.DateNais),
          c4: nv(item.Genre),
          c5: nv(item.Nationalite),
          c6: nv(item.Redoub),
          c7: nv(item.Lang2),
          c8: nv(item.MoyG2),
          c9: nv(item.RangG2),
          c10: nv(item.ClasseCourt),
          c11: nv(item.Appreciations),
          label: item.NiveauSerie, //Obligatoire car on regroupe par label
          obj: { label: item.NiveauSerie },
        };
      });
      const result = functions_main.groupLabelByGroup(contentsArray);
      console.log("🚀 ~ file: functions.ts:624 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp1_B_3_liste_major_classe_par_niveau`);
      return reject(err);
    }
  });
};

const chp2_1_effectif_par_niveau_avec_approche_genre = () => {
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
              GROUP BY IIf(IsNull([Cycle]),Null,[cycle]), 
              [NiveauCourt] & " " & [Série], 
              TypesClasses.RefTypeClasse, 
              TypesClasses.filière, 
              TypesClasses.Niveau
              HAVING (((TypesClasses.filière)=1))
              ORDER BY TypesClasses.Niveau;
              `;
      const sqlResult = await fetchFromMsAccess<IChp2_4[]>(sql, appCnx);
      const isEmpty = {
        bg: "#FFFF",
        group: "",
        label: "",
        cols: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      };
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp2_4) => {
        const items = _.omit(item, ["NiveauSerie", "CycleX"]);
        return {
          group: item.CycleX,
          label: item.NiveauSerie,
          // cols: functions_main.rav(items),
          cols: Object.values(items),
        };
      });
      const result = functions_main.formatGroupBy(contentsArray);
      // console.log("🚀 ~ file: functions.ts:926 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_1_effectif_par_niveau_avec_approche_genre`);
      return reject(err);
    }
  });
};

const chp2_2_pyramides_par_approche_genre = () => {
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
          SELECT 2 AS orderby, "Effectifs Par classe" AS label, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, 
          Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
          FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
          HAVING RefTypeClasse=5) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
          FROM (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
          GROUP BY Elèves.Inscrit, TypesClasses.filière
          HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.filière)=1));

          UNION ALL 
          SELECT 3 AS orderby, "G" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
          FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
          WHERE (((TypesClasses.filière)=1))
          HAVING (((Elèves.Sexe)=1));
          UNION ALL 
          SELECT 4 AS orderby, "F" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, Count(IIf([TypesClasses].[RefTypeClasse] In (5),1,Null)) AS _2ndA, Count(IIf([TypesClasses].[RefTypeClasse] In (6),1,Null)) AS _2ndC, Count(IIf([TypesClasses].[RefTypeClasse] In (7),1,Null)) AS _1ereA, Count(IIf([TypesClasses].[RefTypeClasse] In (8),1,Null)) AS _1ereC, Count(IIf([TypesClasses].[RefTypeClasse] In (9),1,Null)) AS _1ereD, Count(IIf([TypesClasses].[RefTypeClasse] In (10,13),1,Null)) AS _TleA, Count(IIf([TypesClasses].[RefTypeClasse] In (11),1,Null)) AS _TleC, Count(IIf([TypesClasses].[RefTypeClasse] In (12),1,Null)) AS _TleD, Val([_2ndA]+[_2ndC]+[_1ereA]+[_1ereC]+[_1ereD]+[_TleA]+[_TleC]+[_TleD]) AS ST2, [ST1]+[ST2] AS TOTAL
          FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
          WHERE (((TypesClasses.filière)=1))
          HAVING (((Elèves.Sexe)=2));

          UNION ALL 
          SELECT 5 AS orderby, "T" AS label, Count(IIf([TypesClasses].[RefTypeClasse] In (1),1,Null)) AS _6e, Count(IIf([TypesClasses].[RefTypeClasse] In (2),1,Null)) AS _5e, Count(IIf([TypesClasses].[RefTypeClasse] In (3),1,Null)) AS _4e, Count(IIf([TypesClasses].[RefTypeClasse] In (4),1,Null)) AS _3e, Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, (SELECT Count(RefElève) AS T
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
      // console.log("contentsArray.chp2_5....", contentsArray)
      const row = contentsArray;
      const row1 = Object.values(row[0]);
      const row2 = Object.values(row[1]);
      const row3 = Object.values(row[2]);
      const row4 = Object.values(row[3]);
      const row5 = Object.values(row[4]);
      const rows = { row1, row2, row3, row4, row5 };
      const result = [rows];
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_2_pyramides_par_approche_genre`);
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

/**
 * On doit ajouter les champs (NomAuteur, FonctionAuteur) dans la table tbl_cs_grossesse
 */
const chp3_4_a_1_point_des_cas_de_grossesse = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT "DEUXIEME TRIMESTRE" AS label, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=1,1,Null)) AS _6e, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=2,1,Null)) AS _5e, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=3,1,Null)) AS _4e, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="1er Cycle" And [TypesClasses].[RefTypeClasse]=4,1,Null)) AS _3e, 
      Val([_6e]+[_5e]+[_4e]+[_3e]) AS ST1, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (5,6),1,Null)) AS _2nd, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (7,8,9),1,Null)) AS _1ere, 
      Count(IIf([tbl_cs_grossesse].[RefElève] Is Not Null And [Niveaux].[cycle]="2nd Cycle" And [TypesClasses].[RefTypeClasse] In (10,11,12,13),1,Null)) AS _Tle, 
      Val([_2nd]+[_1ere]+[_Tle]) AS ST2, [ST1]+[ST2] AS TOTAL, 
      "" AS obs
      FROM ((Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN tbl_cs_grossesse ON Elèves.RefElève = tbl_cs_grossesse.RefElève
      HAVING (((Elèves.Inscrit)=Yes) AND ((TypesClasses.RefTypeClasse)<14) AND ((Elèves.Sexe)=2));
      `;
      const sqlResult = await fetchFromMsAccess<chp3_4_a_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: chp3_4_a_1) => {
        const items = _.omit(item, ["label"]);
        return {
          label: item.label,
          cols: Object.values(items),
        };
      });
      // console.log("contentsArray.chp3_4_a_1 ... ", JSON.stringify(contentsArray));
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_4_a_1_point_des_cas_de_grossesses`);
      return reject(err);
    }
  });
};

const chp3_4_a_2_cas_de_grossesse = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Int((Date()-[DateNaiss])/365.5) AS Age,
      Classes.ClasseCourt,
      [Elèves.ResidencePère] & ", " & [Elèves.MobilePère] AS AdresseParent, 
      Format(tbl_cs_grossesse.DateDepotCertificat,"Short Date") AS DateDepotCertificat, 
      Format(tbl_cs_grossesse.DateAccouchement,"Short Date") AS DateAccouchement, 
      "_" AS NomAuteur,
      "_" AS FonctionAuteur
      FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_grossesse ON Elèves.RefElève = tbl_cs_grossesse.RefElève) ON Classes.RefClasse = Elèves.RefClasse;    
        `;
      const sqlResult = await fetchFromMsAccess<IChp_C_5_4[]>(sql, appCnx);
      const isEmpty = {
        MatriculeNational: "",
        NomComplet: "",
        Age: "",
        ClasseCourt: "",
        Genre: "",
        AdresseParent: "",
        DateDepotCertificat: "",
        DateAccouchement: "",
        NomAuteur: "",
        FonctionAuteur: "",
      };
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_C_5_4, index: number) => {
        return {
          c0: index + 1,
          c1: item.NomComplet,
          c2: item.MatriculeNational,
          c3: item.ClasseCourt,
          c4: item.NomAuteur,
          c5: item.FonctionAuteur,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_4_a_2_cas_de_grossesse`);
      return reject(err);
    }
  });
};

const chp3_4_b_2_cas_de_deces = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Elèves.MatriculeNational, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Classes.ClasseCourt,
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      Format(tbl_cs_deces.DateDécès,"Short Date") AS DateDeces, 
      tbl_cs_deces.CauseDécès AS CauseDeces
      FROM Classes INNER JOIN (Elèves INNER JOIN tbl_cs_deces 
      ON Elèves.RefElève = tbl_cs_deces.RefElève) ON Classes.RefClasse = Elèves.RefClasse;     
        `;
      const sqlResult = await fetchFromMsAccess<IChp_C_5_6[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_C_5_6, index: number) => {
        return {
          c0: index + 1,
          c1: item.NomComplet,
          c2: item.MatriculeNational,
          c3: item.ClasseCourt,
          c4: item.CauseDeces,
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_4_b_2_cas_de_deces`);
      return reject(err);
    }
  });
};

const chp4_2_enseignant_par_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      classe_matieres_prof_eval.matCourt AS label, 
      Count(IIf([Niveaux].[cycle]="1er Cycle" And [Personnel].[Sexe]="F",1,Null)) AS pcf, 
      Count(IIf([Niveaux].[cycle]="1er Cycle" And [Personnel].[Sexe]="M",1,Null)) AS pch, 
      Val([pcf]+[pch]) AS pct, 
      "" AS bs1, 
      Count(IIf([Niveaux].[cycle]="2nd Cycle" And [Personnel].[Sexe]="F",1,Null)) AS scf, 
      Count(IIf([Niveaux].[cycle]="2nd Cycle" And [Personnel].[Sexe]="M",1,Null)) AS sch, 
      Val([scf]+[sch]) AS sct, 
      "" AS bs2, Val([pcf]+[scf]) AS tf, 
      Val([pch]+[sch]) AS th, 
      Val([tf]+[th]) AS te, 
      "" AS bs3, "" AS obs
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
          cols: Object.values(functions_main.rav(items)),
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
      //les autres parametres du fichier python 
      const dataParams = { ...data, logo1: path, path };
      // console.log("dataParams...", dataParams);
      const identite = await paramsEtablisement();

      const chp1_A_1 = await chp1_A_1_documents_pedagogiques();
      const chp1_A_3_a = await chp1_A_3_a_activites_des_unites_pedagogiques();
      const chp1_A_3_b = await chp1_A_3_b_activites_des_conseils_d_enseignement();
      const chp1_A_4 = await chp1_A_4_visite_classe_et_formation();
      const chp1_B_1_a = await chp1_B_1_a_synthese_generale_du_trimestre();
      const chp1_B_1_b = await chp1_B_1_b_tableaux_statistiqures_des_resultats_2e_trimestre();
      const chp1_B_1_c = await chp1_B_1_c_statistique_eleves_en_situation();
      const chp1_B_2_a = await chp1_B_2_liste_nominative("=1"); //Elèves affectés
      const chp1_B_2_b = await chp1_B_2_liste_nominative("=2"); //Elèves non affectés
      const chp1_B_2_c = await chp1_B_2_liste_nominative("<>0"); //Elèves affectés et non affectés
      const chp1_B_3 = await chp1_B_3_liste_major_classe_par_niveau();
      const chp3_1 = await chp3_1_fonctionnement_du_conseil_interieur();
      const chp3_2 = await chp3_2_fonctionnement_du_conseil_discipline();
      const chp3_3 = await chp3_3_activite_para_scolaire();
      const chp3_4_a_1 = await chp3_4_a_1_point_des_cas_de_grossesse();
      const chp3_4_a_2 = await chp3_4_a_2_cas_de_grossesse();
      const chp3_4_b_2 = await chp3_4_b_2_cas_de_deces();
      const chp4_2 = await chp4_2_enseignant_par_discipline();
      const chp2_1 = await chp2_1_effectif_par_niveau_avec_approche_genre();
      const chp2_2 = await chp2_2_pyramides_par_approche_genre();

      const result = {
        ...dataParams,
        name_report: "prive_secondairegeneral_abidjan3_2trimestre",
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
        chp1_A_3_a,
        chp1_A_3_b,
        chp1_A_4,
        chp1_B_1_a,
        chp1_B_1_b,
        chp1_B_1_c,
        chp1_B_2_a,
        chp1_B_2_b,
        chp1_B_2_c,
        chp1_B_3,
        chp3_1,
        chp3_2,
        chp3_3,
        chp3_4_a_1,
        chp3_4_a_2,
        chp3_4_b_2,
        chp4_2,
        chp2_1,
        chp2_2
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
