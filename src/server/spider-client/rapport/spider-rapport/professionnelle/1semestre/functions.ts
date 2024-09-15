import { _selectSql } from "../../../../../databases/index";
import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../../../../../databases/accessDB";
import { IChp1, IChp12_3, IChp2_1, IChp2_2, IChp2_3, IChp3, IChp4_1, IChp4_2, IChp4_3, IChp4_4_1, IChp4_4_2, IChp7_2, IChp8 } from "./interfaces";

import functions_main, { formatDataEquipe, formatDataFiliere, formatDataFiliere1, formatDataFiliereProfessionnelle, formationFiliere, calculateTotals, calculateTotals1, filiereFormations, formatDataTechnique, groupLabelByDiplome } from "../../utils";

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
const chp1_2_filieres_de_formation = () => {
  return new Promise(async (resolve, reject) => {
    try {
let sql =`
SELECT Filières.Filière AS nomFiliere, 
Filières.groupe_filiere, 
Count(Filières.groupe_filiere) AS groupes, 
IIf([groupes]>1,[groupes] & " ans",[groupes] & " an") AS duree_etude, 
"" AS obs, 
"BT INDUSTRIEL" AS label
FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
GROUP BY Filières.Filière, Filières.groupe_filiere, "", Filières.OrdreEnseignement, Filières.RefFilière, "BT INDUSTRIEL"
HAVING (((Filières.RefFilière) In (106,109,110,135,112)));
UNION ALL 
(
SELECT Filières.Filière AS nomFiliere, 
Filières.groupe_filiere, 
Count(Filières.groupe_filiere) AS groupes, 
IIf([groupes]>1,[groupes] & " ans",[groupes] & " an") AS duree_etude, 
"" AS obs, 
"BT TERTIAIRE" AS label
FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
GROUP BY Filières.Filière, Filières.groupe_filiere, "", Filières.OrdreEnseignement, Filières.RefFilière, "BT TERTIAIRE"
HAVING (((Filières.RefFilière) In (86,88,90,13,87)));
)
UNION ALL (
SELECT Filières.Filière AS nomFiliere, 
Filières.groupe_filiere, 
Count(Filières.groupe_filiere) AS groupes, 
IIf([groupes]>1,[groupes] & " ans",[groupes] & " an") AS duree_etude, 
"" AS obs, 
"CAP INDUSTRIEL" AS label
FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
GROUP BY Filières.Filière, Filières.groupe_filiere, "", Filières.OrdreEnseignement, Filières.RefFilière, " CAP INDUSTRIEL"
HAVING (((Filières.RefFilière) In (114,120,130,121)));
)
UNION ALL (
SELECT Filières.Filière AS nomFiliere, 
Filières.groupe_filiere, 
Count(Filières.groupe_filiere) AS groupes, 
IIf([groupes]>1,[groupes] & " ans",[groupes] & " an") AS duree_etude, 
"" AS obs, 
"CAP TERTIAIRE" AS label
FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
GROUP BY Filières.Filière, Filières.groupe_filiere, "", Filières.OrdreEnseignement, Filières.RefFilière, "CAP TERTIAIRE"
HAVING (((Filières.RefFilière) In (36,14,37,38,154,119)));
 )
`;
const sqlResult = await fetchFromMsAccess<IChp1[]>(sql, appCnx);
console.log("🚀 ~ returnnewPromise ~ sqlResult:", sqlResult)
if (sqlResult.length === 0) return resolve([{}]);

const result = filiereFormations(sqlResult);
console.log("🚀 ~ returnnewPromise ~ result:", result)
resolve(result);
} catch (err: any) {
console.log(`err => chp1_2_filieres_de_formation`);
return reject(err);
}
});

};

const chp2_1_equipe_de_direction = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
      Fonction.Fonction AS fonction, 
      Fonction.Groupe, 
      Personnel.CelPers, 
      Personnel.Corps, 
      Personnel.Sexe, 
      Fonction.RefFonction, 
      Personnel.email, 
      Personnel.N°AutEnseigner AS NumAut
FROM Groupe INNER JOIN (Personnel INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction) ON Groupe.RefGroupePers = Fonction.Groupe
WHERE (((Fonction.RefFonction) In (3,8,23,66)));
`;
      const sqlResult = await fetchFromMsAccess<IChp2_1[]>(sql, appCnx);
      // console.log("🚀 ~ returnnewPromise ~ sqlResult:", sqlResult)
      if (sqlResult.length === 0) return resolve([{ row1: [{}] }, { row2: [{}] }, { row3: [{}] }]);
      const result = formatDataEquipe(sqlResult);
      const result1 = [result]
      // console.log("🚀 ~ returnnewPromise ~ result++:", result)
      resolve(result1);
    } catch (err: any) {
      console.log(`err => chp2_1_equipe_de_direction`);
      return reject(err);
    }
  });
};

const chp2_2_personnels_admin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
      Fonction.Fonction AS fonction, 
      Fonction.Groupe, 
      [Personnel.TélPers] & "  " & [Personnel.CelPers] AS contactPers, 
      Personnel.Corps, 
      Personnel.Sexe, 
      Fonction.RefFonction, 
      Personnel.email, 
      Personnel.N°AutEnseigner AS NumAut
FROM Groupe INNER JOIN (Personnel INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction) ON Groupe.RefGroupePers = Fonction.Groupe
WHERE (((Fonction.RefFonction) In (25,10,49,30,12,43,62)));
`;
      const sqlResult = await fetchFromMsAccess<IChp2_1[]>(sql, appCnx);
      // console.log("🚀 ~ returnnewPromise ~ sqlResult:", sqlResult)
      if (sqlResult.length === 0) return resolve([{}]);
      // const result = formatDataEquipe(sqlResult);
      const contentsArray = sqlResult.map((item: IChp2_1,index: number) => {
        return {
          c1: nv(item.fonction),
          c2: nv(item.NomComplet),
          c3: nv(item.Sexe),
          c4: nv(item.contactPers),
          c5: nv(item.email),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_2_personnels_admin`);
      return reject(err);
    }
  });
};

const chp2_2_1_autres_pers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
      Fonction.Fonction AS fonction, 
      Fonction.Groupe, 
      [Personnel.TélPers] & " " & [Personnel.CelPers] AS contactPers, 
      Personnel.Corps, 
      Personnel.Sexe, 
      Fonction.RefFonction, 
      Personnel.email, 
      Personnel.N°AutEnseigner AS NumAut, 
      Groupe.RefGroupePers, 
      Personnel.fil_tech, 
      Personnel.Obs, 
      IIf([Personnel].[DateEmbauche] Is Not Null,"Oui"," ") AS DateEmbauche
FROM Groupe INNER JOIN (Personnel INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction) ON Groupe.RefGroupePers = Fonction.Groupe
WHERE (((Fonction.RefFonction) Not In (3,25,10,49,30,12,43,59,62)) AND ((Groupe.RefGroupePers)=1));
`;
      const sqlResult = await fetchFromMsAccess<IChp2_1[]>(sql, appCnx);
      // console.log("🚀 ~ returnnewPromise ~ sqlResult:", sqlResult)
      if (sqlResult.length === 0) return resolve([{}]);
      // const result = formatDataEquipe(sqlResult);
      const contentsArray = sqlResult.map((item: IChp2_1,index: number) => {
        return {
          c1: nv(item.fonction),
          c2: nv(item.NomComplet),
          c3: nv(item.Sexe),
          c4: nv(item.DateEmbauche === "Oui" ? "" :""),
          c5: nv(item.DateEmbauche),
          c6: nv(item.contactPers),
          c7: nv(item.Obs),
        };
      });
      // console.log("🚀 ~ returnnewPromise ~ contentsArray:", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_2_1_autres_pers`);
      return reject(err);
    }
  });
};

const chp3_personnel_enseignant = () => {
return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Matières.MatLong AS label, Count(IIf([Personnel].[Sexe]="M",1,Null)) AS homme, Count(IIf([Personnel].[Sexe]="F",1,Null)) AS femme, [homme]+[femme] AS total, Count(IIf([Personnel].[RefTypePers]=3,1,Null)) AS permanant, Count(IIf([Personnel].[RefTypePers]=2,1,Null)) AS vacataire, Count(IIf([Personnel].[N°AutEnseigner]<>"",1,Null)) AS effEnsAut
FROM ((Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers
GROUP BY Matières.MatLong, Personnel.fil_prof, Fonction.RefFonction
HAVING (((Matières.MatLong)<>"") AND ((Personnel.fil_prof)=True) AND ((Fonction.RefFonction)=6));
UNION ALL (
SELECT "TOTAL" AS MatLong, Count(IIf([Personnel].[Sexe]="M",1,Null)) AS homme, Count(IIf([Personnel].[Sexe]="F",1,Null)) AS femme, [homme]+[femme] AS total, Count(IIf([Personnel].[RefTypePers]=3,1,Null)) AS permanant, Count(IIf([Personnel].[RefTypePers]=2,1,Null)) AS vacataire, Count(IIf([Personnel].[N°AutEnseigner]<>"",1,Null)) AS Aut
FROM ((Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers
GROUP BY Personnel.fil_prof, Fonction.RefFonction
HAVING ((("TOTAL")<>"") AND ((Personnel.fil_prof)=True) AND ((Fonction.RefFonction)=6))
)
`;
const sqlResult = await fetchFromMsAccess<IChp2_3[]>(sql, appCnx);
      const isEmpty = [
        {
          bg: '',
          label: '',
          cols: ['', '', '', '', '', '', '', '', '', '', '']
        },
        {
          bg: '',
          label: 'TOTAL',
          cols: ['', '', '', '', '', '', '', '', '', '', '']
        }
      ];
      if (sqlResult.length === 0) return resolve(isEmpty);
      const contentsArray = sqlResult.map((item: IChp2_3, index: number) => {
        const items = _.omit(item, ["label", "bg","fil_tech"]);
        return {
          bg: item.bg,
          label: item.label,
          cols: functions_main.rav(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_personnel_enseignant`);
      return reject(err);
    }
  });
};
const chp3_1_nombre_de_classe_par_filiere = () => {
  return new Promise(async (resolve, reject) => {
    try {
    let sql =`
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (22),1,Null)) AS annee1, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (27),1,Null)) AS annee2, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (32),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="F2 Electronique") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    UNION ALL (
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (251),1,Null)) AS annee1, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (252),1,Null)) AS annee2, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (253),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="F3 Electrotechnique") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )
    UNION ALL (
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (21),1,Null)) AS annee1, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (26),1,Null)) AS annee2, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (31),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="Mécanique") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )
    UNION ALL (
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (35,36),1,Null)) AS annee1, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (37),1,Null)) AS annee2, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (37),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="Biochimie") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )
    UNION ALL ( 
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (20),1,Null)) AS annee1, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (25),1,Null)) AS annee2, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (30),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="Economie") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )
    UNION ALL (
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (23),1,Null)) AS annee1, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (28),1,Null)) AS annee2, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (33),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="G1 Secrétariat") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )
    UNION ALL (
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (24),1,Null)) AS annee1, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (29),1,Null)) AS annee2, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (34),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="G2 Comptabilité") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )
    UNION ALL (
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([Filières].[RefFilière] In (114),1,Null)) AS annee1, 
    Count(IIf([Filières].[RefFilière] In (114),1,Null)) AS annee2, 
    Count(IIf([Filières].[RefFilière] In (114),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="CAP Mécanique Générale") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )
    UNION ALL (
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([Filières].[RefFilière] In (120),1,Null)) AS annee1, 
    Count(IIf([Filières].[RefFilière] In (120),1,Null)) AS annee2, 
    Count(IIf([Filières].[RefFilière] In (120),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="CAP Electricité") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )
    UNION ALL (
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([Filières].[RefFilière] In (130),1,Null)) AS annee1, 
    Count(IIf([Filières].[RefFilière] In (130),1,Null)) AS annee2, 
    Count(IIf([Filières].[RefFilière] In (130),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="CAP Mécanique Auto") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )
    UNION ALL (
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (96),1,Null)) AS annee1, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (97),1,Null)) AS annee2, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (98),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="CAP Coiffure") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )
    UNION ALL (
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (99),1,Null)) AS annee1, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (100),1,Null)) AS annee2, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (101),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="CAP Couture") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )
    UNION ALL (
    SELECT Filières.Filière AS nomFiliere, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (93),1,Null)) AS annee1, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (94),1,Null)) AS annee2, 
    Count(IIf([TypesClasses].[RefTypeClasse] In (95),1,Null)) AS annee3,
    [annee1]+[annee2]+[annee3] AS total
    FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
    GROUP BY Filières.Filière, Filières.OrdreEnseignement
    HAVING (((Filières.Filière)="CAP Sanitaire Social") AND ((Filières.OrdreEnseignement)="Secondaire Professionnel"));
    )    
`;
const sqlResult = await fetchFromMsAccess<IChp3[]>(sql, appCnx);
// console.log("🚀 ~ returnnewPromise ~ sqlResult:", sqlResult)

if (sqlResult.length === 0) return resolve([{ row1: [{}] }, { row2: [{}] }, { row3: [{}] },{ row4: [{}] },{ row5: [{}] },{ row6: [{}] },{ row7: [{}] },{ row8: [{}] },{ row9: [{}] },{ row10: [{}] },{ row11: [{}] },{ row12: [{}] },{ row13: [{}] },{ row14: [{}] }]);
const result = formatDataFiliereProfessionnelle(sqlResult);
const result1 = [result]
 console.log("🚀 ~ returnnewPromise ~ result1:", result1)
 resolve(result1);
    } catch (err: any) {
      console.log(`err => chp3_1_nombre_de_classe_par_filiere`);
      return reject(err);
    }
  });
};

const chp3_2_effectif_des_apprenants  = () => {
  return new Promise(async (resolve, reject) => {
    try {
    let sql =`
    SELECT "1ère année" AS niveau, "#FFFF" AS bg, Filières.Filière, (SELECT Count(Classes.RefClasse) AS cpt
    FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
    GROUP BY TypesClasses.Filière, Niveaux.NiveauCourt
    HAVING TypesClasses.Filière=[Filières].[RefFilière] AND Niveaux.NiveauCourt Like '%1') AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
GROUP BY Filières.Filière, Filières.OrdreEnseignement, Niveaux.NiveauCourt, Filières.RefFilière
HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Niveaux.NiveauCourt) Like '%1'))
ORDER BY 1;
    UNION ALL
    SELECT "TOTAL 1ère année" AS niveau,"#EBEBEB" AS bg, "" AS ClasseCourt, (SELECT Count(Classes.RefClasse) AS cpt
    FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
    HAVING (((Niveaux.NiveauCourt) Like '%1'))) AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
    FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
    HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Niveaux.NiveauCourt) Like '%1'));
    UNION ALL
    SELECT "2ème année" AS niveau, "#FFFF" AS bg, Filières.Filière, (SELECT Count(Classes.RefClasse) AS cpt
    FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
    GROUP BY TypesClasses.Filière, Niveaux.NiveauCourt
    HAVING TypesClasses.Filière=[Filières].[RefFilière] AND Niveaux.NiveauCourt Like '%2') AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
GROUP BY Filières.Filière, Filières.OrdreEnseignement, Niveaux.NiveauCourt, Filières.RefFilière
HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Niveaux.NiveauCourt) Like '%2'))
ORDER BY 1;

    UNION ALL
    SELECT "TOTAL 2ème année" AS niveau,"#EBEBEB" AS bg, "" AS ClasseCourt, (SELECT Count(Classes.RefClasse) AS cpt
    FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
    HAVING (((Niveaux.NiveauCourt) Like '%2'))) AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
    FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
    HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Niveaux.NiveauCourt) Like '%2'));     
    UNION ALL
 SELECT "3ème année" AS niveau, "#FFFF" AS bg, Filières.Filière, (SELECT Count(Classes.RefClasse) AS cpt
    FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
    GROUP BY TypesClasses.Filière, Niveaux.NiveauCourt
    HAVING TypesClasses.Filière=[Filières].[RefFilière] AND Niveaux.NiveauCourt Like '%3') AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
GROUP BY Filières.Filière, Filières.OrdreEnseignement, Niveaux.NiveauCourt, Filières.RefFilière
HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Niveaux.NiveauCourt) Like '%3'))
ORDER BY 1;
UNION ALL
    SELECT "TOTAL 3ème année" AS niveau,"#EBEBEB" AS bg, "" AS ClasseCourt, (SELECT Count(Classes.RefClasse) AS cpt
    FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
    HAVING (((Niveaux.NiveauCourt) Like '%3'))) AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
    FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
    HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Niveaux.NiveauCourt) Like '%3'));
    UNION ALL
    SELECT "TOTAL Général" AS niveau,"#E3E3E3" AS bg, "" AS ClasseCourt, (SELECT Count(Classes.RefClasse) AS cpt
    FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
    FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
    WHERE (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")));
`;
const sqlResult = await fetchFromMsAccess<IChp4_1[]>(sql, appCnx);
const isEmpty = {
  bg: "",
  label: "",
  cols: [
    {
      filiere: "",
      col: ["", "", "", "", "", ""],
    },
  ],
};
if (sqlResult.length === 0) return resolve([isEmpty]);
const contentsArray = sqlResult.map((item: IChp4_1) => {
  const items = _.omit(item, [
    "niveau",
    "bg",
    "ClasseCourt",
    "nbreClasses",
    "Filière",
  ]);
  return {
    bg: item.bg,
    label: item.niveau,
    cols: [
      {
        filiere: item.Filière,
        col: functions_main.rav(items),
      },
    ],
  };
});

const result = functions_main.formatGroupeByLabel(contentsArray);
 resolve(result);
    } catch (err: any) {
      console.log(`err => chp3_2_effectif_des_apprenants`);
      return reject(err);
    }
  });
};

const chp4_effectifs_1ere_annee = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT Filières.groupe_filiere AS diplome,
               Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS aff_F, 
               Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS non_aff_F, 
               [aff_F]+[non_aff_F] AS T1, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS aff_G, 
               Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS non_aff_G, [aff_G]+[non_aff_G] AS T2
              FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
              GROUP BY Filières.groupe_filiere, Filières.OrdreEnseignement
              HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")));
            `;
      const sqlResult = await fetchFromMsAccess<IChp4_3[]>(sql, appCnx);
      // const sqlResult =[];
      const isEmpty = [
        {
          bg: "#FFFF",
          label: "",
          cols: ["", "", "", "", "", ""],
        },
        {
          bg: "#EBEBEB",
          label: "TOTAL",
          cols: ["", "", "", "", "", ""],
        },
      ];
      if (sqlResult.length === 0) return resolve([...isEmpty]);
      const contentsArray = sqlResult.map((item: IChp4_3) => {
        const items = _.omit(item, ["diplome"]);
        return {
          bg: "#FFFF",
          label: item.diplome,
          cols: functions_main.rav(items),
        };
      });
      const result = functions_main.addSumRow(contentsArray, "TOTAL", "#EBEBEB");
      // console.log("result.chp4_3...", JSON.stringify(result))
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp4_3_effectifs_1ere_annee`);
      return reject(err);
    }
  });
};

const chp4_1_1 = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql =`
      SELECT
      "1 ère année" AS niveau,
      Count(IIf([Elèves].[Sexe]=2 And [Niveaux].[NiveauCourt] Like "CAP% %1",1,Null)) AS cap_F,
      Count(IIf([Elèves].[Sexe]=1 And [Niveaux].[NiveauCourt] Like "CAP% %1",1,Null)) AS cap_G,
      [cap_f]+[cap_G] AS cap_total, 
      Count(IIf([Elèves].[Sexe]=2 And [Niveaux].[NiveauCourt] Like "BT% %1",1,Null)) AS bt_F,
      Count(IIf([Elèves].[Sexe]=1 And [Niveaux].[NiveauCourt] Like "BT% %1",1,Null)) AS bt_G,
      [bt_f]+[bt_G] AS bt_total,
      [cap_F]+[bt_F] AS t_F,
      [cap_G]+[bt_G] AS t_G,
      [t_F]+[t_G] AS t_Total
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.OrdreEnseignement
      HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")));
      UNION ALL (
        SELECT
        "2ème année" AS niveau,
        Count(IIf([Elèves].[Sexe]=2 And [Niveaux].[NiveauCourt] Like "CAP% %2",1,Null)) AS cap_F,
        Count(IIf([Elèves].[Sexe]=1 And [Niveaux].[NiveauCourt] Like "CAP% %2",1,Null)) AS cap_G,
        [cap_f]+[cap_G] AS cap_total, 
        Count(IIf([Elèves].[Sexe]=2 And [Niveaux].[NiveauCourt] Like "BT% %2",1,Null)) AS bt_F,
        Count(IIf([Elèves].[Sexe]=1 And [Niveaux].[NiveauCourt] Like "BT% %2",1,Null)) AS bt_G,
        [bt_f]+[bt_G] AS bt_total, 
        [cap_F]+[bt_F] AS t_F,
        [cap_G]+[bt_G] AS t_G,
        [t_F]+[t_G] AS t_Total
        FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
        GROUP BY Filières.OrdreEnseignement
        HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")));
      )
      UNION ALL (
        SELECT
        "3ème année" AS niveau,
        Count(IIf([Elèves].[Sexe]=2 And [Niveaux].[NiveauCourt] Like "CAP% %3",1,Null)) AS cap_F,
        Count(IIf([Elèves].[Sexe]=1 And [Niveaux].[NiveauCourt] Like "CAP% %3",1,Null)) AS cap_G,
        [cap_f]+[cap_G] AS cap_total, 
        Count(IIf([Elèves].[Sexe]=2 And [Niveaux].[NiveauCourt] Like "BT% %3",1,Null)) AS bt_F,
        Count(IIf([Elèves].[Sexe]=1 And [Niveaux].[NiveauCourt] Like "BT% %3",1,Null)) AS bt_G,
        [bt_f]+[bt_G] AS bt_total, 
        [cap_F]+[bt_F] AS t_F,
        [cap_G]+[bt_G] AS t_G,
        [t_F]+[t_G] AS t_Total
        FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
        GROUP BY Filières.OrdreEnseignement
        HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")));
      )            `;
      const sqlResult = await fetchFromMsAccess<IChp4_4_1[]>(sql, appCnx);
      // const sqlResult = [];
      const isEmpty = [
        {
          bg: "#FFFF",
          label: "",
          cols: ["", "", "", "", "", "", "", "", ""],
        },
        {
          bg: "#EBEBEB",
          label: "TOTAL",
          cols: ["", "", "", "", "", "", "", "", ""],
        },
      ];
      if (sqlResult.length === 0) return resolve([...isEmpty]);
      const contentsArray = sqlResult.map((item: IChp4_4_1) => {
        const items = _.omit(item, ["niveau"]);
        return {
          bg: "#FFFF",
          label: item.niveau,
          cols: functions_main.rav(items),
        };
      });
      const result = functions_main.addSumRow(contentsArray, "TOTAL");
      // console.log("result.chp4_1_1...", JSON.stringify(result))
      resolve(result);
    } catch (err: any) {
      console.log(`err =>   chp4_1_1`);
      return reject(err);
    }
  });

};

const chp4_1_2 = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql =`
      SELECT Filières.groupe_filiere AS diplome, Filières.Filière, "" AS acceuil, Count(IIf([Elèves].[Inscrit]=-1,1,Null)) AS inscrit, "" AS ecart
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.groupe_filiere, Filières.Filière, Filières.OrdreEnseignement
      HAVING (((Filières.OrdreEnseignement)="Secondaire Professionnel"))
      ORDER BY Filières.groupe_filiere;           
      UNION ALL
      SELECT "TOTAL" AS diplome, "" AS Filiere, "" AS acceuil, Count(IIf([Elèves].[Inscrit]=-1,1,Null)) AS inscrit, "" AS ecart
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
       WHERE (((Filières.OrdreEnseignement)="Secondaire Professionnel"));
               `;
      const sqlResult = await fetchFromMsAccess<IChp4_4_2[]>(sql, appCnx);
      // const sqlResult = [];
      const isEmpty = [
        {
          bg: "#FFFF",
          label: "",
          cols: [
            {
              niveau: "",
              col: ["", "", ""],
            },
          ],
        },
        {
          bg: "#EBEBEB",
          label: "TOTAL",
          cols: [
            {
              niveau: "",
              col: ["", "", ""],
            },
          ],
        },
      ];
      if (sqlResult.length === 0) return resolve([...isEmpty]);
      const contentsArray = sqlResult.map((item: IChp4_4_2) => {
        const items = _.omit(item, ["diplome", "niveau", "bg"]);
        return {
          bg: item.bg,
          label: item.diplome,
          cols: [
            {
              niveau: item.niveau,
              col: Object.values(items),
            },
          ],
        };
      });

      const result = functions_main.formatGroupeByLabel(contentsArray);
      // console.log("result.chp4_4_2 ... ", JSON.stringify(result));
      resolve(result);
    } catch (err: any) {
      console.log(`err =>   chp4_4_2`);
      return reject(err);
    }
  });
};

const chp4_1_recapitulatif_general = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const _chp4_4_1 = await chp4_1_1();
      const _chp4_4_2 = await chp4_1_2();
      const result = {
        data1: _chp4_4_1,
        data2: _chp4_4_2,
      }
      // console.log("🚀 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err =>   chp4_1_recapitulatif_general`);
      return reject(err);
    }
  });
};

const chp4_2_capacite_accueil_etab = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      Filières.Filière AS nomFiliere, 
      '' AS capaciteAccueil, 
      Count(IIf([Elèves].[Inscrit]=-1,1,Null)) AS inscrit, 
      "" AS ecart
      FROM ((Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.Filière, Filières.OrdreEnseignement
      HAVING (((Filières.Filière)="F2 Electronique") AND ((Filières.OrdreEnseignement)="Secondaire Technique"));
      UNION ALL (
      SELECT Filières.Filière AS nomFiliere, 
      '' AS capaciteAccueil, 
      Count(IIf([Elèves].[Inscrit]=-1,1,Null)) AS inscrit, 
      "" AS ecart
      FROM ((Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.Filière, Filières.OrdreEnseignement
      HAVING (((Filières.Filière)="F3 Electrotechnique") AND ((Filières.OrdreEnseignement)="Secondaire Technique"));
      )
      UNION ALL (
      SELECT Filières.Filière AS nomFiliere, 
      '' AS capaciteAccueil, 
      Count(IIf([Elèves].[Inscrit]=-1,1,Null)) AS inscrit, 
      "" AS ecart
      FROM ((Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.Filière, Filières.OrdreEnseignement
      HAVING (((Filières.Filière)="Mécanique") AND ((Filières.OrdreEnseignement)="Secondaire Technique"));
      )
      UNION ALL (
      SELECT Filières.Filière AS nomFiliere, 
      '' AS capaciteAccueil, 
      Count(IIf([Elèves].[Inscrit]=-1,1,Null)) AS inscrit, 
      "" AS ecart
      FROM ((Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.Filière, Filières.OrdreEnseignement
      HAVING (((Filières.Filière)="Biochimie") AND ((Filières.OrdreEnseignement)="Secondaire Technique"));
      )
      UNION ALL (
      SELECT Filières.Filière AS nomFiliere, 
      '' AS capaciteAccueil, 
      Count(IIf([Elèves].[Inscrit]=-1,1,Null)) AS inscrit, 
      "" AS ecart
      FROM ((Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.Filière, Filières.OrdreEnseignement
      HAVING (((Filières.Filière)="G1 Secrétariat") AND ((Filières.OrdreEnseignement)="Secondaire Technique"));
      )
      UNION ALL (
      SELECT Filières.Filière AS nomFiliere, 
      '' AS capaciteAccueil, 
      Count(IIf([Elèves].[Inscrit]=-1,1,Null)) AS inscrit, 
      "" AS ecart
      FROM ((Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.Filière, Filières.OrdreEnseignement
      HAVING (((Filières.Filière)="G2 Comptabilité") AND ((Filières.OrdreEnseignement)="Secondaire Technique"));
      )
`;
      const sqlResult = await fetchFromMsAccess<IChp4_4_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const resultat = formatDataFiliere1(sqlResult)
const result = [resultat]
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp4_2_capacite_accueil_etab`);
      return reject(err);
    }
  });
};

const chp7_2_clubs_et_associations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT tbl_club_assoc.lib_club_assoc AS designation, 
      tbl_club_assoc.objet, "" AS responsable
      FROM tbl_club_assoc
      GROUP BY tbl_club_assoc.lib_club_assoc, tbl_club_assoc.objet, "";      
        `;
      const sqlResult = await fetchFromMsAccess<IChp7_2[]>(sql, appCnx);
      const isEmpty = { designation: '', objet: '', responsable: '' }
      if (sqlResult.length === 0) return resolve([isEmpty]);
      const contentsArray = sqlResult.map((item: IChp7_2, index: number) => {
        return {
          c1: nv(item.designation),
          c2: nv(item.objet),
          c3: nv(item.responsable),
        };
      });
      //  console.log("contentsArray.chp7_2...", contentsArray);
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp7_2_clubs_et_associations`);
      return reject(err);
    }
  });
};

const chp8_eleve_en_situation_handicap = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql =`
      SELECT tbl_cs_handicap.NatureHandicap, 
      [NomElève] & " " & [PrénomElève] AS NomComplet, 
      Format([Elèves].[DateNaiss],"Short Date") AS DateNaiss, 
      Elèves.LieuNaiss, 
      Elèves.Sexe, 
      Niveaux.NiveauCourt, 
      Filières.Filière, 
      [MobilePère] & " \ " & [MobileMère] AS ContactsFamille, 
      tbl_cs_handicap.OrigineHandicap
      FROM Niveaux INNER JOIN (Filières INNER JOIN ((tbl_cs_handicap INNER JOIN (Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) ON tbl_cs_handicap.RefElève = Elèves.RefElève) INNER JOIN TypesClasses ON Classes.RefTypeClasse = TypesClasses.RefTypeClasse) ON Filières.RefFilière = TypesClasses.Filière) ON Niveaux.RefNiveau = TypesClasses.Niveau
      WHERE (((Filières.OrdreEnseignement)="Secondaire Technique"));
`;
      const sqlResult = await fetchFromMsAccess<IChp8[]>(sql, appCnx);
      // console.log("🚀 ~ returnnewPromise ~ sqlResult:", sqlResult)
      if (sqlResult.length === 0) return resolve([{}]);
      // const result = formatDataEquipe(sqlResult);
      const contentsArray = sqlResult.map((item: IChp8,index: number) => {
        return {
          c1: nv(item.NatureHandicap),
          c2: nv(item.NomComplet),
          c3: `${nv(item.DateNaiss)}/${nv(item.LieuNaiss)}`,
          c4: nv(item.Sexe),
          c5: `${nv(item.NiveauCourt)}/${nv(item.Filière)}`,
          c6:  nv(item.ContactsFamille),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp8_eleve_en_situation_handicap`);
      return reject(err);
    }
  });
};

const chp12_resultat_1er_semestre = () => {
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
      SELECT Niveaux.RefNiveau AS OrderBy, 
      Classes.RefClasse, 
      Niveaux.NiveauCourt, 
      Niveaux.NiveauLong, 
      Elèves.MatriculeNational, 
      Elèves.NomElève, 
      Elèves.PrénomElève, 
      IIf([Elèves].[Sexe]=1,"M","F") AS Genre, 
      T_NotesTech.MOYG_1, 
      T_NotesTech.RangG_1, 
      Elèves.Bourse, 
      (SELECT [NomPers] & " " & [PrénomPers] FROM Personnel WHERE RefPersonnel=Classes.Educateur) AS Educ, 
      Filières.Filière, 
      Classes.ClasseCourt, 
      Filières.groupe_filiere, 
      "" AS pp
FROM T_NotesTech INNER JOIN (Filières INNER JOIN (Niveaux INNER JOIN (TypesClasses INNER JOIN (Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) ON T_NotesTech.RefElève = Elèves.RefElève
WHERE (((Filières.OrdreEnseignement)="Secondaire Professionnel") AND ((Elèves.inscrit)=True))
ORDER BY Niveaux.RefNiveau, Classes.RefClasse, Elèves.NomElève;
      `;
      const sqlResult2 = await fetchFromMsAccess<IChp12_3[]>(sql2, appCnx);
      // console.log("🚀 ~ returnnewPromise ~ sqlResult2:", sqlResult2)
      if (sqlResult2.length === 0) return resolve([
        {
          label: '',
          obj: { classeLong: '', pp: '', educ: '',},
          group: [{}],
          count: 0
        },
      ]);

      const resultat = functions_main.fusionnerTableaux(sqlResult1, sqlResult2, 'MoyG1')
      const contentsArray = resultat.map((item: IChp12_3, i: number) => {
        return {
          c1: nv(item.MatriculeNational),
          c2: nv(item.NomElève),
          c3: nv(item.PrénomElève),
          c4: nv(item.Genre),
          c5: nv(item.MoyG1),
          c6: nv(item.RangG1),
          c7: nv(item.Bourse),
          c8: nv(item.Appreciations),
          label: item.NiveauLong,
          count:i+1,
          obj: {
            classeLong: item.ClasseLong,
            pp: nv(item.ProfP),
            educ: nv(item.Educ),
          },
        };
      });
      const result = functions_main.groupLabelByGroup(contentsArray);
      console.log("🚀 ~ returnnewPromise ~ result:", result)
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp12_resultat_1er_semestre`);
      return reject(err);
    }
  });
};

const chp3_3 = (label: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql_CAP = ` 
      SELECT "CAP" AS niveau, 
      Filières.Filière AS filiere, "#FFFF" AS bg, 
      Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F, 
      Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G, 
      [F]+[G] AS T
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.Filière
      HAVING (((Filières.Filière) Like 'CAP%'));
      `;

      let sql_BT = ` 
      SELECT "BT" AS niveau, 
      Filières.Filière AS filiere, "#FFFF" AS bg, 
      Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F, 
      Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G, 
      [F]+[G] AS T
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.Filière
      HAVING (((Filières.Filière) Like 'BT%'));   
      `;

      let sql_BAC = ` 
      SELECT "BAC" AS niveau, 
      Filières.Filière AS filiere, 
      "#FFFF" AS bg, 
      Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F, 
      Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G, 
      [F]+[G] AS T
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.Filière, Niveaux.NiveauCourt
      HAVING (((Niveaux.NiveauCourt) Like 'Tle%')); 
      `;

      let sql = (label == "CAP" ? sql_CAP : (label == "BT" ? sql_BT : sql_BAC))
      // console.log("label", label)

      const sqlResult = await fetchFromMsAccess<IChp4_2[]>(sql, appCnx);
      const isEmpty = [
        {
          bg: "#FFFF",
          label: label,
          filiere: "",
          cols: ["", "", ""],
        },
        {
          bg: "#EBEBEB",
          label: "TOTAL /" + label,
          filiere: "",
          cols: ["", "", ""],
        },
      ];
      if (sqlResult.length === 0) return resolve([...isEmpty]);
      const contentsArray = sqlResult.map((item: IChp4_2) => {
        const items = _.omit(item, ["niveau", "filiere", "bg"]);
        return {
          bg: item.bg,
          label: item.niveau,
          filiere: item.filiere,
          cols: Object.values(items),
        };
      });
      const result = functions_main.addSumRow(contentsArray, "TOTAL / " + label, "#EBEBEB");
      // console.log("result.chp4_2." + label + " ...", JSON.stringify(result))
      resolve(result);
    } catch (err: any) {
      console.log(`err =>   chp4_2`);
      return reject(err);
    }
  });
};

const chp3_3_total_general = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT "TOTAL GENERAL" AS niveau,
      "" AS filiere, "#E3E3E3" AS bg, 
      Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F, 
      Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G, 
      [F]+[G] AS T
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      HAVING Niveaux.NiveauCourt Like 'CAP%' OR Niveaux.NiveauCourt Like 'BT%' OR Niveaux.NiveauCourt Like 'Tle%';    
      `;
      const sqlResult = await fetchFromMsAccess<IChp4_2[]>(sql, appCnx);
      const isEmpty = [
        {
          bg: "#E3E3E3",
          label: "TOTAL GENERAL",
          filiere: "",
          cols: ["", "", ""],
        },
      ];
      if (sqlResult.length === 0) return resolve([...isEmpty]);
      const contentsArray = sqlResult.map((item: IChp4_2) => {
        const items = _.omit(item, ["niveau", "filiere", "bg"]);
        return {
          bg: item.bg,
          label: item.niveau,
          filiere: item.filiere,
          cols: functions_main.rav(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err =>  chp3_3_total_general`);
      return reject(err);
    }
  });
};

const chp3_3_statut_des_eleves_par_niveau = () => {

  return new Promise(async (resolve, reject) => {
    try {
      const CAP = await chp3_3("CAP") as any;
      const BT = await chp3_3("BT") as any;
      const BAC = await chp3_3("BAC") as any;
      const TOTAL = await chp3_3_total_general() as any;
      const dataResult = [...CAP, ...BT, ...BAC , ...TOTAL];
      const contentsArray = dataResult.map((item: any) => {
        return {
          bg: item.bg,
          label: item.label,
          cols: [
            {
              filiere: item.filiere,
              col: functions_main.rav(item.cols),
            },
          ],
        };
      });

      const result = functions_main.formatGroupeByLabel(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err =>   chp3_3_statut_des_eleves_par_niveau`);
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
        telchefetab,
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
        "telchefetab",
        "internat",
        "num_ouverture",
        "ville",
        "sitgeo",
      ]);
      // console.log("🚀 ~ filenum_ouverture", num_ouverture,".ville...",ville)


      const path = await functions_main.fileExists(
        `C:/SPIDER/Ressources/${codeetab}_logo.jpg`
      );
      //les autres parametres du fichier python
      const dataParams = { ...data, logo1: path, path };
      // console.log("dataParams...", dataParams);

      const chp1_2 = await chp1_2_filieres_de_formation();
      const chp2_1 = await chp2_1_equipe_de_direction();
      const chp2_2 = await chp2_2_personnels_admin();
      const chp2_2_1 = await chp2_2_1_autres_pers();
      const chp3 = await chp3_personnel_enseignant();
      const chp3_1 = await chp3_1_nombre_de_classe_par_filiere();
      const chp3_2 = await chp3_2_effectif_des_apprenants();
      const chp3_3 = await chp3_3_statut_des_eleves_par_niveau();
      const chp4 = await chp4_effectifs_1ere_annee();
      const chp4_1 = await chp4_1_recapitulatif_general();
      const chp4_2 = await chp4_2_capacite_accueil_etab();
      const chp7_2 = await chp7_2_clubs_et_associations();
      const chp8 = await chp8_eleve_en_situation_handicap();
      const chp12 = await chp12_resultat_1er_semestre();

      const result = {
        ...dataParams,
        name_report: "professionnelle_1semestre",
        path_report: "professionnelle/",
        anscol1,
        nometab,
        codeetab,
        drencomplet,
        bpetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        telchefetab,
        internat,
        num_ouverture,
        ville,
        sitgeo,

        chp1_2,
        chp2_1,
        chp2_2,
        chp2_2_1,
        chp3,
        chp3_1,
        chp3_2,
        chp3_3,
        chp4,
        chp4_1,
        chp4_2,
        chp7_2,
        chp8,
        chp12
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
