import { _selectSql } from "../../../../../databases/index";
import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../../../../../databases/accessDB";
import { IA_Chp2_2, IA_Chp3_1, IA_Chp3_2, IA_Chp1, IA_Chp2_1, IA_Chp3_3, IA_Chp4, IB_Chp1_1, IB_Chp1_2, IB_Chp2_1 } from "./interfaces";

import functions_main from "../../utils";

const _ = require("lodash");
const bg = { c1: "#E3E3E3", c2: "#ffcdd2" };
const pathDir = "./spider-rapport";
const critereTech=`In ("Secondaire Professionnel";"Secondaire Technique")`;
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
//Grand A
const A_chp1_filieres_de_formation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Filières.Filière AS nomFiliere, Filières.groupe_filiere, 
      Count(Filières.groupe_filiere) AS x, IIf([x]>1,[x] & " ans",[x] & " an") AS duree_etude
      FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Filières.Filière, Filières.groupe_filiere, Filières.OrdreEnseignement
      HAVING (((Filières.OrdreEnseignement) In ("Secondaire Technique","Secondaire Professionnel")));
            `;
      const sqlResult = await fetchFromMsAccess<IA_Chp1[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IA_Chp1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.nomFiliere),
          c2: nv(item.groupe_filiere),
          c3: nv(item.duree_etude),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err =>   A_chp1_filieres_de_formation`);
      return reject(err);
    }
  });
};

const A_chp2_1_effectif_des_enseignants_par_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Matières.MatLong AS label, "#FFFF" AS bg, 
      Count(IIf([Personnel].[RefPersonnel]<>0,1,Null)) AS total
      FROM (((Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers
      GROUP BY Matières.MatLong, Fonction.RefFonction
      HAVING (((Fonction.RefFonction)=6));   
      `;
      const sqlResult = await fetchFromMsAccess<IA_Chp2_1[]>(sql, appCnx);
      const isEmpty = [
        {
          bg: '#FFFF',
          label: '',
          cols: ['']
        }
      ];
      if (sqlResult.length === 0) return resolve(isEmpty);
      const contentsArray = sqlResult.map((item: IA_Chp2_1, index: number) => {
        return {
          c1: nv(item.label),
          c2: nv(item.total),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => A_chp2_1_effectif_des_enseignants_par_discipline`);
      return reject(err);
    }
  });
};

const A_chp2_2_personnel_administratif = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Fonction.Fonction AS fonction, Count(IIf([Personnel].[RefPersonnel]<>0,1,Null)) AS existant
      FROM (Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
      GROUP BY Fonction.Fonction, Fonction.Groupe
      HAVING (((Fonction.Groupe)=1));
      `;
      const sqlResult = await fetchFromMsAccess<IA_Chp2_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IA_Chp2_2, index: number) => {
        return {
          c1: nv(item.fonction),
          c2: nv(item.existant),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => A_chp2_2_personnel_administratif`);
      return reject(err);
    }
  });
};

const A_chp3_1_effectifs_et_situation_des_eleves = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT Filières.Filière AS filiere, "#FFFF" AS bg, 
            Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F, Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G, [F]+[G] AS T, 
            Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, 
            Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, 
            Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, 
            Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G
            FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
            GROUP BY Filières.Filière, Filières.OrdreEnseignement
            HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel","Secondaire Technique")));
      
            `;
      const sqlResult = await fetchFromMsAccess<IA_Chp3_1[]>(sql, appCnx);
      // const sqlResult =[];
      const isEmpty = [
        {
          bg: "#FFFF",
          label: "",
          cols: ["", "", "", "", "", "", ""],
        },
        {
          bg: "#EBEBEB",
          label: "TOTAL",
          cols: ["", "", "", "", "", "", ""],
        },
      ];
      if (sqlResult.length === 0) return resolve([...isEmpty]);
      const contentsArray = sqlResult.map((item: IA_Chp3_1) => {
        const items = _.omit(item, ["filiere","bg"]);
        return {
          bg: "#FFFF",
          label: item.filiere,
          cols: Object.values(items),
        };
      });
      const resultSum = functions_main.addSumRow(contentsArray, "TOTAL", "#EBEBEB");
      const result = functions_main.rav2(resultSum);
      // console.log("result.A_chp3_1...", JSON.stringify(result))
      resolve(result);
    } catch (err: any) {
      console.log(`err => A_chp3_1_effectifs_et_situation_des_eleves`);
      return reject(err);
    }
  });
};

const A_chp3_2_resultats_scolaires = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Filières.Filière AS label, "#FFFF" AS bg, 
      Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F1, Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G1, 
      [F1]+[G1] AS T1, Count(IIf([SEXE]=2 And [MOYG_4]>=10,1,Null)) AS F2, 
      Count(IIf([SEXE]=1 And [MOYG_4]>=10,1,Null)) AS G2, [F2]+[G2] AS T2, 
      Count(IIf([SEXE]=2 And [Décision]="R",1,Null)) AS F3, 
      Count(IIf([SEXE]=1 And [Décision]="R",1,Null)) AS G3, 
      [F3]+[G3] AS T3, 
      Count(IIf([SEXE]=2 And [Décision]="E",1,Null)) AS F4, 
      Count(IIf([SEXE]=1 And [Décision]="E",1,Null)) AS G4, 
      [F4]+[G4] AS T4
      FROM ((Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_NotesTech ON Elèves.RefElève = T_NotesTech.RefElève
      GROUP BY Filières.Filière, Filières.OrdreEnseignement
      HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel","Secondaire Technique")));
            `;
      const sqlResult = await fetchFromMsAccess<IA_Chp3_2[]>(sql, appCnx);
      // const sqlResult =[];
      const isEmpty = [
        {
          bg: "#FFFF",
          label: "",
          cols: ["", "", "", "", "", "", "", "", "", "", "", ""],
        },
        {
          bg: "#EBEBEB",
          label: "TOTAL",
          cols: ["", "", "", "", "", "", "", "", "", "", "", ""],
        },
      ];
      if (sqlResult.length === 0) return resolve([...isEmpty]);
      const contentsArray = sqlResult.map((item: IA_Chp3_2) => {
        const items = _.omit(item, ["label","bg"]);
        return {
          bg: "#FFFF",
          label: item.label,
          cols: Object.values(items),
        };
      });
      const resultSum = functions_main.addSumRow(contentsArray, "TOTAL", "#EBEBEB");
      // const result = functions_main.rav2(resultSum);
      // console.log("result.A_chp3_2...", JSON.stringify(result))
      resolve(resultSum);
    } catch (err: any) {
      console.log(`err => A_chp3_2_resultats_scolaires`);
      return reject(err);
    }
  });
};

const A_chp3_3_resultats_examens = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT "BT" AS examens, Filières.Filière AS label, "#FFFF" AS bg, Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F1, Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(IIf([SEXE]=2 And [AdmisExam]<>0,1,Null)) AS F2, Count(IIf([SEXE]=1 And [AdmisExam]<>0,1,Null)) AS G2, [F2]+[G2] AS T2
            FROM Examens, ((Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_NotesTech ON Elèves.RefElève = T_NotesTech.RefElève
            GROUP BY Niveaux.NiveauCourt, Filières.OrdreEnseignement, Filières.Filière
            HAVING (((Niveaux.NiveauCourt) Like '%BT%' And (Niveaux.NiveauCourt) Like '%3%') AND ((Filières.OrdreEnseignement) In ("Secondaire Professionnel","Secondaire Technique")));
            
            UNION ALL
            
            SELECT "CAP" AS examens, Filières.Filière AS label, "#FFFF" AS bg, Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F1, Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(IIf([SEXE]=2 And [AdmisExam]<>0,1,Null)) AS F2, Count(IIf([SEXE]=1 And [AdmisExam]<>0,1,Null)) AS G2, [F2]+[G2] AS T2
            FROM Examens, ((Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_NotesTech ON Elèves.RefElève = T_NotesTech.RefElève
            GROUP BY Niveaux.NiveauCourt, Filières.OrdreEnseignement, Filières.Filière
            HAVING (((Niveaux.NiveauCourt) Like '%CAP%' And (Niveaux.NiveauCourt) Like '%3%') AND ((Filières.OrdreEnseignement) In ("Secondaire Professionnel","Secondaire Technique")));
            
            UNION ALL
            
            SELECT "BAC" AS examens, Filières.Filière AS label, "#FFFF" AS bg, Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F1, Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G1, [F1]+[G1] AS T1, Count(IIf([SEXE]=2 And [AdmisExam]<>0,1,Null)) AS F2, Count(IIf([SEXE]=1 And [AdmisExam]<>0,1,Null)) AS G2, [F2]+[G2] AS T2
            FROM Examens, ((Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_NotesTech ON Elèves.RefElève = T_NotesTech.RefElève
            GROUP BY Filières.Filière, Niveaux.NiveauCourt, Filières.OrdreEnseignement
            HAVING (((Niveaux.NiveauCourt) Like '%Tle%') AND ((Filières.OrdreEnseignement) In ("Secondaire Professionnel","Secondaire Technique")));
            `;
      const sqlResult = await fetchFromMsAccess<IA_Chp3_3[]>(sql, appCnx);
      // const sqlResult =[];
      const isEmpty = [
        {
          bg: "#FFFF",
          examens:"",
          label: "",
          cols: ["", "", "", "", "", ""],
        },
        {
          bg: "#EBEBEB",
          examens: "",
          label: "TOTAL",
          cols: ["", "", "", "", "", ""],
        },
      ];
      if (sqlResult.length === 0) return resolve([...isEmpty]);
      const contentsArray = sqlResult.map((item: IA_Chp3_3) => {
        const items = _.omit(item, ["examens","label","bg"]);
        return {
          bg: "#FFFF",
          examens: item.examens,
          label: item.label,
          cols: Object.values(items),
        };
      });
      const resultSum = functions_main.addSumRow(contentsArray, "TOTAL", "#EBEBEB");
      const result = functions_main.rav2(resultSum);
      // console.log("result.A_chp3_3...", JSON.stringify(result))
      resolve(result);
    } catch (err: any) {
      console.log(`err => A_chp3_3_resultats_examens`);
      return reject(err);
    }
  });
};

const A_chp4_1_1ere_annee = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT "CAP" AS label, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS aff_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS non_aff_F, [aff_F]+[non_aff_F] AS T1, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS aff_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS non_aff_G, [aff_G]+[non_aff_G] AS T2
            FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
            HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Filières.Filière) Like '%CAP%'));
            
            UNION ALL
            
            SELECT "BT" AS label, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS aff_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS non_aff_F, [aff_F]+[non_aff_F] AS T1, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS aff_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS non_aff_G, [aff_G]+[non_aff_G] AS T2
            FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
            HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Filières.Filière) Like '%BT%'));
            `;
      const sqlResult = await fetchFromMsAccess<IA_Chp4[]>(sql, appCnx);
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
      const contentsArray = sqlResult.map((item: IA_Chp4) => {
        const items = _.omit(item, ["label","bg"]);
        return {
          bg: "#FFFF",
          label: item.label,
          cols: Object.values(items),
        };
      });
      const result = functions_main.addSumRow(contentsArray, "TOTAL", "#EBEBEB");
      // console.log("result.A_chp4_1...", JSON.stringify(result))
      resolve(result);
    } catch (err: any) {
      console.log(`err => A_chp4_1_1ere_annee`);
      return reject(err);
    }
  });
};

const A_chp4_2_2eme_annee = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT "CAP" AS label, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%2',1,Null)) AS aff_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%2',1,Null)) AS non_aff_F, [aff_F]+[non_aff_F] AS T1, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%2',1,Null)) AS aff_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%2',1,Null)) AS non_aff_G, [aff_G]+[non_aff_G] AS T2
            FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
            HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Filières.Filière) Like '%CAP%'));
            
            UNION ALL
            
            SELECT "BT" AS label, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%2',1,Null)) AS aff_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%2',1,Null)) AS non_aff_F, [aff_F]+[non_aff_F] AS T1, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%2',1,Null)) AS aff_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%2',1,Null)) AS non_aff_G, [aff_G]+[non_aff_G] AS T2
            FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
            HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Filières.Filière) Like '%BT%'));
            `;
      const sqlResult = await fetchFromMsAccess<IA_Chp4[]>(sql, appCnx);
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
      const contentsArray = sqlResult.map((item: IA_Chp4) => {
        const items = _.omit(item, ["label","bg"]);
        return {
          bg: "#FFFF",
          label: item.label,
          cols: Object.values(items),
        };
      });
      const result = functions_main.addSumRow(contentsArray, "TOTAL", "#EBEBEB");
      // console.log("result.A_chp4_2...", JSON.stringify(result))
      resolve(result);
    } catch (err: any) {
      console.log(`err => A_chp4_2_2eme_annee`);
      return reject(err);
    }
  });
};

const A_chp4_3_3eme_annee = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT "CAP" AS label, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%3',1,Null)) AS aff_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%3',1,Null)) AS non_aff_F, [aff_F]+[non_aff_F] AS T1, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%3',1,Null)) AS aff_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%3',1,Null)) AS non_aff_G, [aff_G]+[non_aff_G] AS T2
            FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
            HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Filières.Filière) Like '%CAP%'));
            
            UNION ALL
            
            SELECT "BT" AS label, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%3',1,Null)) AS aff_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%3',1,Null)) AS non_aff_F, [aff_F]+[non_aff_F] AS T1, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%3',1,Null)) AS aff_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%3',1,Null)) AS non_aff_G, [aff_G]+[non_aff_G] AS T2
            FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
            HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Filières.Filière) Like '%BT%'));
          
            UNION ALL
            
            SELECT "BAC" AS label, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=1,1,Null)) AS aff_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=2,1,Null)) AS non_aff_F, [aff_F]+[non_aff_F] AS T1, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=1,1,Null)) AS aff_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=2,1,Null)) AS non_aff_G, [aff_G]+[non_aff_G] AS T2
            FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
            HAVING (((Filières.OrdreEnseignement) In ("Secondaire Technique")) AND ((Niveaux.NiveauCourt)="Tle"));
            
            `;
      const sqlResult = await fetchFromMsAccess<IA_Chp4[]>(sql, appCnx);
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
      const contentsArray = sqlResult.map((item: IA_Chp4) => {
        const items = _.omit(item, ["label","bg"]);
        return {
          bg: "#FFFF",
          label: item.label,
          cols: Object.values(items),
        };
      });
      const result = functions_main.addSumRow(contentsArray, "TOTAL", "#EBEBEB");
      // console.log("result.A_chp4_3...", JSON.stringify(result))
      resolve(result);
    } catch (err: any) {
      console.log(`err => A_chp4_3_3eme_annee`);
      return reject(err);
    }
  });
};


//Grand B
const B_chp1_1_resultats_scolaires = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
          SELECT Niveaux.RefNiveau, Classes.ClasseLong, 0 AS Effectif, Elèves.NomElève AS Nom, Elèves.PrénomElève AS Prenoms, T_NotesTech.MOYG_4, T_NotesTech.RangG_4, IIf([Elèves].[Bourse]="BE","BE",IIf([Elèves].[Bourse]<>"BE","1/2B","")) AS Bourses, Elèves.Décision AS Decision
          FROM ((Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_NotesTech ON Elèves.RefElève = T_NotesTech.RefElève
          GROUP BY Niveaux.RefNiveau, Classes.ClasseLong, Elèves.NomElève, Elèves.PrénomElève, T_NotesTech.MOYG_4, T_NotesTech.RangG_4, IIf([Elèves].[Bourse]="BE","BE",IIf([Elèves].[Bourse]<>"BE","1/2B","")), Elèves.Décision, Filières.OrdreEnseignement
          HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel","Secondaire Technique")))
          ORDER BY Niveaux.RefNiveau, Classes.ClasseLong, T_NotesTech.MOYG_4 DESC;    
            `;

      const sqlResult = await fetchFromMsAccess<IB_Chp1_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([
        {
          label: '',
          obj: {classeLong: '', effectif: ''},
          group: [{}],
          count: 0
        },
      ]);
      const contentsArray = sqlResult.map((item: IB_Chp1_1, i: number) => {
        return {
          c1: nv(item.Nom),
          c2: nv(item.Prenoms),
          c3: nv(item.MOYG_4),
          c4: nv(item.RangG_4),
          c5: nv(item.Bourses),
          c6: nv(item.Decision),
          label:item.ClasseLong,
          obj:{
            classeLong: item.ClasseLong,
            effectif: nv(item.Effectif),
          },
        };
  });
    // console.log("contentsArray ...", contentsArray)
    const result = functions_main.groupLabelByGroup(contentsArray);
    // console.log("result.B_chp1_1 ...",JSON.stringify(result[0]))
    resolve(result);
    } catch (err: any) {
      console.log(`err => const B_chp1_1_resultats_scolaires`);
      return reject(err);
    }
  });
};

const B_chp1_2_eleves_en_classe_examen = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT Niveaux.RefNiveau, Filières.Filière AS filiere, Classes.ClasseLong, Niveaux.NiveauCourt, Left([Niveaux].[NiveauCourt],3) AS dip, IIf([dip]="Tle","BAC",[dip]) AS diplome, Elèves.NomElève AS Nom, Elèves.PrénomElève AS Prenoms, Format([Elèves].[DateNaiss],"Short Date") AS DateNais, Elèves.LieuNaiss, IIf([Elèves].[Sexe]=1,"M","F") AS Genre, IIf([Elèves].[Bourse]="BE" Or [Elèves].[Bourse]="1/2BE","√","") AS BE, IIf([Elèves].[Bourse]<>"BE" Or [Elèves].[Bourse]<>"1/2BE","","√") AS NB, "" AS candidatLibre
              FROM ((Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse) INNER JOIN T_NotesTech ON Elèves.RefElève = T_NotesTech.RefElève
              GROUP BY Niveaux.RefNiveau, Filières.Filière, Classes.ClasseLong, Niveaux.NiveauCourt, Elèves.NomElève, Elèves.PrénomElève, Format([Elèves].[DateNaiss],"Short Date"), Elèves.LieuNaiss, IIf([Elèves].[Sexe]=1,"M","F"), IIf([Elèves].[Bourse]="BE" Or [Elèves].[Bourse]="1/2BE","√",""), IIf([Elèves].[Bourse]<>"BE" Or [Elèves].[Bourse]<>"1/2BE","","√"), Niveaux.NiveauCourt, Filières.OrdreEnseignement
              HAVING ((((Niveaux.NiveauCourt) Like 'Tle%' Or (Niveaux.NiveauCourt) Like '%3') And ((Niveaux.NiveauCourt) Like 'Tle%' Or (Niveaux.NiveauCourt) Like '%3')) AND ((Filières.OrdreEnseignement) In ("Secondaire Professionnel","Secondaire Technique")))
              ORDER BY Niveaux.RefNiveau, Classes.ClasseLong;
                  `;

      const sqlResult = await fetchFromMsAccess<IB_Chp1_2[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([
        {
          label: '',
          obj: {classeLong: '', filiere: '', diplome: '' },
          group: [{}],
          count: 0
        },
      ]);      
      const contentsArray = sqlResult.map((item: IB_Chp1_2, i: number) => {
        return {
          c1: nv(item.Nom),
          c2: nv(item.Prenoms),
          c3: nv(item.DateNais),
          c4: nv(item.LieuNaiss),
          c5: nv(item.Genre),
          c6: nv(item.BE),
          c7: nv(item.NB),
          c8: nv(item.candidatLibre),
          label:item.ClasseLong,
          obj:{
            classeLong: item.ClasseLong,
            filiere: nv(item.filiere),
            diplome: nv(item.diplome),
          },
        };
  });
    // console.log("contentsArray ...", contentsArray)
    const result = functions_main.groupLabelByGroup(contentsArray);
    // console.log("result.B_chp1_2 ...",JSON.stringify(result[0]))
    resolve(result);
    } catch (err: any) {
      console.log(`err => const B_chp1_2_eleves_en_classe_examen`);
      return reject(err);
    }
  });
};

const B_chp2_1_personnel_enseignant_administratif = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
                SELECT Personnel.NomPers AS Nom, 
                Personnel.PrénomPers AS Prenoms, 
                Format([Personnel].[DateNaiss],"Short Date") AS DateNaiss, 
                Personnel.LieuNaiss, 
                Matières.MatCourt AS Discipline, 
                Fonction.Fonction, 
                Int((Date()-[DateEmbauche])/365.5) AS Ancien, 
                IIf([Ancien]<=0,"",[Ancien]) AS Anciennete, 
                Format([Personnel].[DatePriseService],"Short Date") AS DatePriseService, 
                 "" AS DateRetraite, 
                Personnel.fil_tech
                FROM ((Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction) LEFT JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
                WHERE (((Fonction.Groupe) In (1,2)))
                ORDER BY Fonction.Groupe DESC;
              `;
      const sqlResult = await fetchFromMsAccess<IB_Chp2_1[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IB_Chp2_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Nom),
          c2: nv(item.Prenoms),
          c3: nv(item.DateNaiss),
          c4: nv(item.LieuNaiss),
          c5: nv(item.Discipline),
          c6: nv(item.Fonction),
          c7: nv(item.Anciennete),
          c8: nv(item.DatePriseService),
          c9: nv(item.DateRetraite),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => B_chp2_2_personnel_enseignant`);
      return reject(err);
    }
  });
};

const B_chp2_2_personnel_enseignant = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT Personnel.NomPers AS Nom, Personnel.PrénomPers AS Prenoms, Format([Personnel].[DateNaiss],"Short Date") AS DateNaiss, Personnel.LieuNaiss, Matières.MatCourt AS Discipline, Fonction.Fonction, Personnel.fil_tech
              FROM ((Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction) LEFT JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
              WHERE (((Personnel.fil_tech)=True) AND ((Fonction.Groupe) In (2)))
              ORDER BY Fonction.Groupe DESC;
              `;
      const sqlResult = await fetchFromMsAccess<IB_Chp2_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IB_Chp2_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Nom),
          c2: nv(item.Prenoms),
          c3: nv(item.DateNaiss),
          c4: nv(item.LieuNaiss),
          c5: nv(item.Discipline),
          c6: nv(item.Fonction),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => B_chp2_1_personnel_enseignant_administratif`);
      return reject(err);
    }
  });
};

const B_chp2_3_personnel_administratif = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
            SELECT Personnel.NomPers AS Nom, Personnel.PrénomPers AS Prenoms, Format([Personnel].[DateNaiss],"Short Date") AS DateNaiss, Personnel.LieuNaiss, Fonction.Fonction, Int((Date()-[DateEmbauche])/365.5) AS Ancien, IIf([Ancien]<=0,"",[Ancien]) AS Anciennete, Format([Personnel].[DatePriseService],"Short Date") AS DatePriseService, Personnel.fil_tech
            FROM ((Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction) LEFT JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
            WHERE (((Fonction.Groupe) In (1)))
            ORDER BY Fonction.Groupe DESC;
              `;
      const sqlResult = await fetchFromMsAccess<IB_Chp2_1[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IB_Chp2_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Nom),
          c2: nv(item.Prenoms),
          c3: nv(item.DateNaiss),
          c4: nv(item.Fonction),
          c5: nv(item.Anciennete),
          c6: nv(item.DatePriseService),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => B_chp2_3_personnel_administratif`);
      return reject(err);
    }
  });
};

const B_chp2_4_autre_personnel = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT Personnel.NomPers AS Nom, Personnel.PrénomPers AS Prenoms, Format([Personnel].[DateNaiss],"Short Date") AS DateNaiss, Personnel.LieuNaiss, "" AS Discipline, Fonction.Fonction, Format([Personnel].[DatePriseService],"Short Date") AS DatePriseService, Personnel.fil_tech
              FROM ((Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction) LEFT JOIN Matières ON Personnel.RefMatière = Matières.RefMatière
              WHERE (((Fonction.Groupe) Not In (1,2)))
              ORDER BY Fonction.Groupe DESC;
              `;
      const sqlResult = await fetchFromMsAccess<IB_Chp2_1[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IB_Chp2_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.Nom),
          c2: nv(item.Prenoms),
          c3: nv(item.DateNaiss),
          c4: nv(item.Discipline),
          c5: nv(item.Fonction),
          c6: nv(item.DatePriseService),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => B_chp2_4_autre_personnel`);
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
      // console.log("🚀 ~ filenum_ouverture", num_ouverture,".ville...",ville)


      const path = await functions_main.fileExists(
        `C:/SPIDER/Ressources/${codeetab}_logo.jpg`
      );
      //les autres parametres du fichier python
      const dataParams = { ...data, logo1: path, path };
      // console.log("dataParams...", dataParams);

      const A_chp1 = await A_chp1_filieres_de_formation();
      const A_chp2_1 = await A_chp2_1_effectif_des_enseignants_par_discipline();     
      const A_chp2_2 = await A_chp2_2_personnel_administratif();
      const A_chp3_1 = await A_chp3_1_effectifs_et_situation_des_eleves();
      const A_chp3_2 = await A_chp3_2_resultats_scolaires();
      const A_chp3_3 = await A_chp3_3_resultats_examens();
      const A_chp4_1 = await A_chp4_1_1ere_annee();
      const A_chp4_2 = await A_chp4_2_2eme_annee();
      const A_chp4_3 = await A_chp4_3_3eme_annee();

      const B_chp1_1 = await B_chp1_1_resultats_scolaires();
      const B_chp1_2 = await B_chp1_2_eleves_en_classe_examen();
      const B_chp2_1 = await B_chp2_1_personnel_enseignant_administratif();
      const B_chp2_2 = await B_chp2_2_personnel_enseignant();
      const B_chp2_3 = await B_chp2_3_personnel_administratif();
      const B_chp2_4 = await B_chp2_4_autre_personnel();
      
      const result = {
        ...dataParams,
        name_report: "technique_2semestre",
        path_report: "technique/",
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

        A_chp1,
        A_chp2_1,
        A_chp2_2,
        A_chp3_1,
        A_chp3_2,
        A_chp3_3,
        A_chp4_1,
        A_chp4_2,
        A_chp4_3,

        B_chp1_1,
        B_chp1_2,
        B_chp2_1,
        B_chp2_2,
        B_chp2_3,
        B_chp2_4,
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
