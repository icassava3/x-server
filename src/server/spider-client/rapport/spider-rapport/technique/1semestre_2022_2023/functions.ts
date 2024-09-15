import { _selectSql } from "../../../../../databases/index";
import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../../../../../databases/accessDB";
import { IChp1, IChp2_1, IChp2_2, IChp2_3, IChp3, IChp4_1, IChp4_2, IChp4_3, IChp4_4_1, IChp4_4_2, IChp7_2 } from "./interfaces";

import functions_main from "../../utils";

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
const chp1_filieres_de_formation = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Filières.Filière AS nomFiliere, Filières.groupe_filiere, Count(Filières.groupe_filiere) AS x, IIf([x]>1,[x] & " ans",[x] & " an") AS duree_etude
      FROM (Filières INNER JOIN (Niveaux INNER JOIN TypesClasses ON Niveaux.RefNiveau = TypesClasses.Niveau) ON Filières.RefFilière = TypesClasses.Filière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse
      GROUP BY Filières.Filière, Filières.groupe_filiere, Filières.OrdreEnseignement
      HAVING (((Filières.OrdreEnseignement) In ("Secondaire Technique","Secondaire Professionnel")));
            `;
      const sqlResult = await fetchFromMsAccess<IChp1[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.nomFiliere),
          c2: nv(item.groupe_filiere),
          c3: nv(item.duree_etude),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err =>   chp1_filieres_de_formation`);
      return reject(err);
    }
  });
};

const chp2_1_personnel_administratif = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, Diplomes.NomDiplome AS emploi, Fonction.Fonction AS fonction, Int((Date()-[DateEmbauche])/365.5) AS x, IIf([x]>1,[x] & " ans",[x] & " an") AS anciennete, Fonction.Groupe, Personnel.CelPers, Personnel.Corps
      FROM (Personnel INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction
      WHERE (((Fonction.Groupe)=1));
      `;
      const sqlResult = await fetchFromMsAccess<IChp2_1[]>(sql, appCnx);

      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp2_1, index: number) => {
        return {
          c0: index + 1,
          c1: nv(item.fonction),
          c2: nv(item.NomComplet),
          c3: nv(item.emploi),
          c4: nv(item.anciennete),
          c5: nv(item.CelPers),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_1_personnel_administratif`);
      return reject(err);
    }
  });
};


const chp2_2_autre_personnel_administratif = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT Fonction.Fonction, Count(IIf([Personnel].[Sexe]="M",1,Null)) AS Homme, Count(IIf([Personnel].[Sexe]="F",1,Null)) AS Femme, [Homme]+[Femme] AS Total, Personnel.Obs
      FROM Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction
      GROUP BY Fonction.Fonction, Personnel.Obs, Fonction.Groupe
      HAVING (((Fonction.Groupe)=1));
      
      `;
      const sqlResult = await fetchFromMsAccess<IChp2_2[]>(sql, appCnx);
      const isEmpty = [
        {
          bg: '#FFFF',
          label: '',
          cols: ['', '', '', '']
        },
        {
          bg: '#E3E3E3',
          label: 'TOTAL',
          cols: ['', '', '', '']
        }
      ];
      if (sqlResult.length === 0) return resolve(isEmpty);
      const contentsArray = sqlResult.map((item: IChp2_2, index: number) => {
        const items = _.omit(item, ["Fonction"]);
        return {
          bg: '#FFFF',
          label: item.Fonction,
          cols: functions_main.rav(items),
        };
      });
      const result = functions_main.addSumRow(contentsArray, "TOTAL",'#E3E3E3');
      resolve(result);
    } catch (err: any) {
      console.log(`err => chp2_2_autre_personnel_administratif`);
      return reject(err);
    }
  });
};

const chp2_3_personnel_enseignant_par_discipline = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT Matières.MatLong AS label,"#FFFF" AS bg, Count(IIf([Personnel].[Sexe]="M" And [Diplomes].[NomDiplome]="Maitrise",1,Null)) AS h_maitrise, Count(IIf([Personnel].[Sexe]="M" And [Diplomes].[NomDiplome]="Licence",1,Null)) AS h_licence, Count(IIf([Personnel].[Sexe]="M" And [Diplomes].[NomDiplome]="Deug 2",1,Null)) AS h_deug, Count(IIf([Personnel].[Sexe]="M" And [Personnel].[N°AutEnseigner]<>"",1,Null)) AS h_n_aut_ens, Count(IIf([Personnel].[Sexe]="F" And [Diplomes].[NomDiplome]="Maitrise",1,Null)) AS f_maitrise, Count(IIf([Personnel].[Sexe]="F" And [Diplomes].[NomDiplome]="Licence",1,Null)) AS f_licence, Count(IIf([Personnel].[Sexe]="F" And [Diplomes].[NomDiplome]="Deug 2",1,Null)) AS f_deug, Count(IIf([Personnel].[Sexe]="F" And [Personnel].[N°AutEnseigner]<>"",1,Null)) AS f_n_aut_ens, Count(IIf([Personnel].[RefTypePers]=2,1,Null)) AS vacataire, Count(IIf([Personnel].[RefTypePers]=3,1,Null)) AS permanant, Count(IIf([Diplomes].[NomDiplome]="Maitrise" Or [Diplomes].[NomDiplome]="Licence" Or [Diplomes].[NomDiplome]="Deug 2",1,Null)) AS total
              FROM (((Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers
              WHERE (((Diplomes.RefDiplome) In (6,9,11)))
              GROUP BY Matières.MatLong, Fonction.RefFonction
              HAVING (((Fonction.RefFonction)=6));
              UNION ALL
              SELECT "TOTAL" AS MatLong,"#E3E3E3" AS bg, Count(IIf([Personnel].[Sexe]="M" And [Diplomes].[NomDiplome]="Maitrise",1,Null)) AS h_maitrise, Count(IIf([Personnel].[Sexe]="M" And [Diplomes].[NomDiplome]="Licence",1,Null)) AS h_licence, Count(IIf([Personnel].[Sexe]="M" And [Diplomes].[NomDiplome]="Deug 2",1,Null)) AS h_deug, Count(IIf([Personnel].[Sexe]="M" And [Personnel].[N°AutEnseigner]<>"",1,Null)) AS h_n_aut_ens, Count(IIf([Personnel].[Sexe]="F" And [Diplomes].[NomDiplome]="Maitrise",1,Null)) AS f_maitrise, Count(IIf([Personnel].[Sexe]="F" And [Diplomes].[NomDiplome]="Licence",1,Null)) AS f_licence, Count(IIf([Personnel].[Sexe]="F" And [Diplomes].[NomDiplome]="Deug 2",1,Null)) AS f_deug, Count(IIf([Personnel].[Sexe]="F" And [Personnel].[N°AutEnseigner]<>"",1,Null)) AS f_n_aut_ens, Count(IIf([Personnel].[RefTypePers]=2,1,Null)) AS vacataire, Count(IIf([Personnel].[RefTypePers]=3,1,Null)) AS permanant, Count(IIf([Diplomes].[NomDiplome]="Maitrise" Or [Diplomes].[NomDiplome]="Licence" Or [Diplomes].[NomDiplome]="Deug 2",1,Null)) AS total
              FROM (((Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers
              WHERE (((Diplomes.RefDiplome) In (6,9,11)))
              GROUP BY Fonction.RefFonction
              HAVING (((Fonction.RefFonction)=6));
              `;
       const sqlResult = await fetchFromMsAccess<IChp2_3[]>(sql, appCnx);
      const isEmpty = [
        {
          bg: '#FFFF',
          label: '',
          cols: ['', '', '', '', '', '', '', '', '', '', '']
        },
        {
          bg: '#E3E3E3',
          label: 'TOTAL',
          cols: ['', '', '', '', '', '', '', '', '', '', '']
        }
      ];
      if (sqlResult.length === 0) return resolve(isEmpty);
      const contentsArray = sqlResult.map((item: IChp2_3, index: number) => {
        const items = _.omit(item, ["label", "bg"]);
        return {
          bg: item.bg,
          label: item.label,
          cols: functions_main.rav(items),
        };
      });
      // console.log("result.chp2_3....", JSON.stringify(contentsArray));
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp2_3_personnel_enseignant_par_discipline`);
      return reject(err);
    }
  });
};


const chp3_nombre_de_classe_par_filiere = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT Filières.groupe_filiere AS diplome, Filières.Filière AS filiere, "#FFFF" AS bg, Count(IIf([Niveaux].[NiveauCourt] Like '%1',1,Null)) AS annee1, Count(IIf([Niveaux].[NiveauCourt] Like '%2',1,Null)) AS annee2, Count(IIf([Niveaux].[NiveauCourt] Like '%3',1,Null)) AS annee3, [annee1]+[annee2]+[annee3] AS total
              FROM Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
              GROUP BY Filières.groupe_filiere, Filières.Filière, Filières.OrdreEnseignement, Filières.RefFilière
              HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")))
              ORDER BY Filières.groupe_filiere, Filières.Filière;
              UNION ALL
              SELECT "TOTAL" AS diplome, "" AS filiere, "#E3E3E3" AS bg, 
              Count(IIf([Niveaux].[NiveauCourt] Like '%1',1,Null)) AS annee1, 
              Count(IIf([Niveaux].[NiveauCourt] Like '%2',1,Null)) AS annee2, 
              Count(IIf([Niveaux].[NiveauCourt] Like '%3',1,Null)) AS annee3, 
              [annee1]+[annee2]+[annee3] AS total
              FROM Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
              GROUP BY Filières.OrdreEnseignement
              HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")));
            `;
      const sqlResult = await fetchFromMsAccess<IChp3[]>(sql, appCnx);

      const isEmpty = [
        {
          bg: "#FFFF",
          label: "",
          cols: [
            {
              filiere: "",
              col: ["", "", "", ""],
            },
          ],
        },
        {
          bg: "#E3E3E3",
          label: "TOTAL",
          cols: [
            {
              filiere: "",
              col: ["", "", "", ""],
            },
          ],
        }
      ];
      if (sqlResult.length === 0) return resolve([...isEmpty]);
      const contentsArray = sqlResult.map((item: IChp3) => {
        const items = _.omit(item, ["diplome", "filiere", "bg"]);
        return {
          bg: item.bg,
          label: item.diplome,
          cols: [
            {
              filiere: item.filiere,
              col: functions_main.rav(items),
            },
          ],
        };
      });

      const result = functions_main.formatGroupeByLabel(contentsArray);
      // console.log("result.chp3....", JSON.stringify(result));
      resolve(result);
    } catch (err: any) {
      console.log(`err =>   chp3_nombre_de_classe_par_filiere`);
      return reject(err);
    }
  });
};

const chp4_1_effectif_par_filiere_et_par_classe = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT "1ère année" AS niveau,
      "#FFFF" AS bg, 
      Classes.ClasseCourt, 
      (SELECT Count(Classes.RefClasse) AS cpt
      FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
      GROUP BY TypesClasses.Filière, Niveaux.NiveauCourt
      HAVING TypesClasses.Filière=[Filières].[RefFilière] AND Niveaux.NiveauCourt Like '%1') AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Classes.ClasseCourt, Filières.OrdreEnseignement, Niveaux.NiveauCourt, Filières.RefFilière
      HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Niveaux.NiveauCourt) Like '%1'))
      ORDER BY 1;
      UNION ALL
      SELECT "TOTAL 1ère année" AS niveau,"#EBEBEB" AS bg, "" AS ClasseCourt, (SELECT Count(Classes.RefClasse) AS cpt
      FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
      HAVING (((Niveaux.NiveauCourt) Like '%1'))) AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Niveaux.NiveauCourt) Like '%1'));
      
      UNION ALL
      SELECT "2ème année" AS niveau,"#FFFF" AS bg, Classes.ClasseCourt, (SELECT Count(Classes.RefClasse) AS cpt
      FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
      GROUP BY TypesClasses.Filière, Niveaux.NiveauCourt
      HAVING TypesClasses.Filière=[Filières].[RefFilière] AND Niveaux.NiveauCourt Like '%2') AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Classes.ClasseCourt, Filières.OrdreEnseignement, Niveaux.NiveauCourt, Filières.RefFilière
      HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Niveaux.NiveauCourt) Like '%2'))
      ORDER BY 1;
      UNION ALL
      SELECT "TOTAL 2ème année" AS niveau,"#EBEBEB" AS bg, "" AS ClasseCourt, (SELECT Count(Classes.RefClasse) AS cpt
      FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
      HAVING (((Niveaux.NiveauCourt) Like '%2'))) AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      HAVING (((Filières.OrdreEnseignement) In ("Secondaire Professionnel")) AND ((Niveaux.NiveauCourt) Like '%2'));     
      UNION ALL
      SELECT "3ème année" AS niveau,"#FFFF" AS bg, Classes.ClasseCourt, (SELECT Count(Classes.RefClasse) AS cpt
      FROM Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau
      GROUP BY TypesClasses.Filière, Niveaux.NiveauCourt
      HAVING TypesClasses.Filière=[Filières].[RefFilière] AND Niveaux.NiveauCourt Like '%3') AS nbreClasses, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse]<>"",1,Null)) AS be_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_G, [be_G]+[nb_G] AS total1, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse]<>"",1,Null)) AS be_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[Bourse] Is Null Or [Elèves].[Bourse]="",1,Null)) AS nb_F, [be_F]+[nb_F] AS total2
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Classes.ClasseCourt, Filières.OrdreEnseignement, Niveaux.NiveauCourt, Filières.RefFilière
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
            classe: "",
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
        ]);
        return {
          bg: item.bg,
          label: item.niveau,
          cols: [
            {
              classe: item.ClasseCourt,
              col: functions_main.rav(items),
            },
          ],
        };
      });

      const result = functions_main.formatGroupeByLabel(contentsArray);
      resolve(result);
    } catch (err: any) {
      console.log(`err =>   chp4_1_effectif_par_filiere_et_par_classe`);
      return reject(err);
    }
  });
};

const chp4_2 = (label: string) => {
  return new Promise(async (resolve, reject) => {
    try {

      let sql_CAP = ` 
      SELECT "CAP" AS niveau, Filières.Filière AS filiere, "#FFFF" AS bg, Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F, Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G, [F]+[G] AS T
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.Filière
      HAVING (((Filières.Filière) Like 'CAP%'));
      `;

      let sql_BT = ` 
      SELECT "BT" AS niveau, Filières.Filière AS filiere, "#FFFF" AS bg, Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F, Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G, [F]+[G] AS T
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.Filière
      HAVING (((Filières.Filière) Like 'BT%'));   
      `;

      let sql_BAC = ` 
      SELECT "BAC" AS niveau, Filières.Filière AS filiere, "#FFFF" AS bg, Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F, Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G, [F]+[G] AS T
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


const chp4_2_total_general = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT "TOTAL GENERAL" AS niveau,"" AS filiere, "#E3E3E3" AS bg, Count(IIf([Elèves].[Sexe]=2,1,Null)) AS F, Count(IIf([Elèves].[Sexe]=1,1,Null)) AS G, [F]+[G] AS T
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
      console.log(`err =>   chp4_2_total_general`);
      return reject(err);
    }
  });
};

const chp4_2_statut_des_eleves_par_niveau = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const CAP = await chp4_2("CAP") as any;
      const BT = await chp4_2("BT") as any;
      const BAC = await chp4_2("BAC") as any;
      const TOTAL = await chp4_2_total_general() as any;
      const dataResult = [...CAP, ...BT, ...BAC, ...TOTAL];
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
      // console.log("result.chp4_2_statut_des_eleves_par_niveau ... ",JSON.stringify(result));
      resolve(result);
    } catch (err: any) {
      console.log(`err =>   chp4_2_statut_des_eleves_par_niveau`);
      return reject(err);
    }
  });
};

const chp4_3_effectifs_1ere_annee = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT Filières.groupe_filiere AS diplome, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS aff_F, Count(IIf([Elèves].[Sexe]=2 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS non_aff_F, [aff_F]+[non_aff_F] AS T1, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=1 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS aff_G, Count(IIf([Elèves].[Sexe]=1 And [Elèves].[StatutElève]=2 And [Niveaux].[NiveauCourt] Like '%1',1,Null)) AS non_aff_G, [aff_G]+[non_aff_G] AS T2
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


const chp4_4_1 = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT
      "1ère année" AS niveau,
      Count(IIf([Elèves].[Sexe]=2 And [Niveaux].[NiveauCourt] Like "CAP% %1",1,Null)) AS cap_F,
      Count(IIf([Elèves].[Sexe]=1 And [Niveaux].[NiveauCourt] Like "CAP% %1",1,Null)) AS cap_G,
      [cap_f]+[cap_G] AS cap_total, Count(IIf([Elèves].[Sexe]=2 And [Niveaux].[NiveauCourt] Like "BT% %1",1,Null)) AS bt_F,
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
        [cap_f]+[cap_G] AS cap_total, Count(IIf([Elèves].[Sexe]=2 And [Niveaux].[NiveauCourt] Like "BT% %2",1,Null)) AS bt_F,
        Count(IIf([Elèves].[Sexe]=1 And [Niveaux].[NiveauCourt] Like "BT% %2",1,Null)) AS bt_G,
        [bt_f]+[bt_G] AS bt_total, [cap_F]+[bt_F] AS t_F,
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
        [cap_f]+[cap_G] AS cap_total, Count(IIf([Elèves].[Sexe]=2 And [Niveaux].[NiveauCourt] Like "BT% %3",1,Null)) AS bt_F,
        Count(IIf([Elèves].[Sexe]=1 And [Niveaux].[NiveauCourt] Like "BT% %3",1,Null)) AS bt_G,
        [bt_f]+[bt_G] AS bt_total, [cap_F]+[bt_F] AS t_F,
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
      const result = functions_main.addSumRow(contentsArray, "TOTAL", "#EBEBEB");
      // console.log("result.chp4_4_1...", JSON.stringify(result))
      resolve(result);
    } catch (err: any) {
      console.log(`err =>   chp4_4_1`);
      return reject(err);
    }
  });
};

const chp4_4_2 = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql =`
      SELECT Filières.groupe_filiere AS diplome, [NiveauCourt] & " " & [Série] AS niveau, "#FFFF" AS bg, "" AS acceuil, Count(IIf([Elèves].[Inscrit]=-1,1,Null)) AS inscrit, "" AS ecart
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      GROUP BY Filières.groupe_filiere, [NiveauCourt] & " " & [Série], Filières.OrdreEnseignement
      HAVING (((Filières.OrdreEnseignement) In ("Secondaire Technique","Secondaire Professionnel")))
      ORDER BY Filières.groupe_filiere;
      UNION ALL
      SELECT "TOTAL" AS diplome, "" AS niveau, "#EBEBEB" AS bg, "" AS acceuil, Count(IIf([Elèves].[Inscrit]=-1,1,Null)) AS inscrit, "" AS ecart
      FROM (Niveaux INNER JOIN ((TypesClasses INNER JOIN Filières ON TypesClasses.Filière = Filières.RefFilière) INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
      WHERE (((Filières.OrdreEnseignement) In ("Secondaire Technique","Secondaire Professionnel"))); 
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

const chp4_4_recapitulatif_general = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const _chp4_4_1 = await chp4_4_1();
      const _chp4_4_2 = await chp4_4_2();
      const result = {
        data1: _chp4_4_1,
        data2: _chp4_4_2,
      }

      resolve(result);
    } catch (err: any) {
      console.log(`err =>   chp4_4_recapitulatif_general`);
      return reject(err);
    }
  });
};

const chp7_2_clubs_et_associations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT tbl_club_assoc.lib_club_assoc AS designation, tbl_club_assoc.objet, "" AS responsable
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

      const chp1 = await chp1_filieres_de_formation();
      const chp2_1 = await chp2_1_personnel_administratif();
      const chp2_2 = await chp2_2_autre_personnel_administratif();
      const chp2_3 = await chp2_3_personnel_enseignant_par_discipline();
      const chp3 = await chp3_nombre_de_classe_par_filiere();
      const chp4_1 = await chp4_1_effectif_par_filiere_et_par_classe();
      const chp4_2 = await chp4_2_statut_des_eleves_par_niveau();
      const chp4_3 = await chp4_3_effectifs_1ere_annee();
      const chp4_4 = await chp4_4_recapitulatif_general();
      const chp7_2 = await chp7_2_clubs_et_associations();

      const result = {
        ...dataParams,
        name_report: "technique_1semestre",
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

        chp1,
        chp2_1,
        chp2_2,
        chp2_3,
        chp3,
        chp4_1,
        chp4_2,
        chp4_3,
        chp4_4,

        chp7_2,
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
