import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../../../../../../../databases/accessDB";
import _ from "lodash";
import {
  IChp_A_1,
  IChp3_A_1,
  IChp_B_1,
} from "./interfaces";
const _ = require("lodash");
import functions_main, { nv, pageGarde, paramsEtablisement } from "../../../../utils";


//*** debut rapport1  ***

//  la table doc_numerique est vide et il manque une table ( nombre)
const chp1_A_1_effectif_et_pyramides = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
      SELECT 
      IIf(IsNull([Cycle]),Null,[cycle]) AS CycleX, 
      [NiveauCourt] & " " & [Série] AS NiveauSerie, 
      (Select count(*) from Classes Where refTypeClasse=TypesClasses.RefTypeClasse) AS classePedagogique, 
      " " AS classePhysique, 
      Count(IIf([SEXE]=1,1,Null)) AS G1, 
      Count(IIf([SEXE]=2,1,Null)) AS F1, 
      [G1]+[F1] AS T1, 
      Count(IIf([Redoub]=True And [SEXE]=1,1,Null)) AS G3, 
      Count(IIf([Redoub]=True And [SEXE]=2,1,Null)) AS F3, 
      [G3]+[F3] AS T3
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY IIf(IsNull([Cycle]),Null,[cycle]), [NiveauCourt] & " " & [Série], TypesClasses.RefTypeClasse, TypesClasses.filière, TypesClasses.Niveau
      HAVING (((TypesClasses.filière)=1))
      ORDER BY TypesClasses.Niveau;
         `;
      const sqlResult = await fetchFromMsAccess<IChp_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);

      const dataFormat = functions_main.calculerTotaux(sqlResult)
      // console.log("🚀 ~ file: functions.ts:223 ~ returnnewPromise ~ dataFormat:", dataFormat)
      const contentsArray = dataFormat.map((item: IChp_A_1) => {
        const items = _.omit(item, ["label","CycleX"]);
        return {
          cols: Object.values(items),
        };
      });
      // console.log("🚀 ~ file: functions.ts:231 ~ returnnewPromise ~ contentsArray:", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp1_A_1_effectif_et_pyramides`);
      return reject(err);
    }
  });
};

//chp1_A  ce table n'est pas encore cree dans SPIDER table eleve utilise par defaut
const chp2_1_des_resultats_des_examens_fin_de_session_bepc = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Niveaux.RefNiveau, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2,1,Null)) AS InscritFille, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1,1,Null)) AS InscritGarçon, 
      [InscritFille]+[InscritGarçon] AS TotalInscrit, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2,1,Null)) AS PresentFille, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1,1,Null)) AS PresentGarçon, 
      [PresentGarçon]+[PresentFille] AS TotalPresent, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2,1,Null)) AS FilleAdmis, 
      IIf([TotalPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2,1,Null))/[TotalPresent]*100,2)) AS TauxFilleAdmis, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1,1,Null)) AS GarçonAdmis, 
      IIf([TotalPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1,1,Null))/[TotalPresent]*100,2)) AS TauxGarçonAdmis, 
      IIf([TotalPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0,1,Null))/[TotalPresent]*100,2)) AS TotalTaux
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau
      HAVING (((Niveaux.RefNiveau)=4));
         `;
      const sqlResult = await fetchFromMsAccess<IChp_B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_B_1) => {
        const items = _.omit(item, ["RefNiveau", "label"]);
        return {
          cols: Object.values(items),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp2_1_des_resultats_des_examens_fin_de_session_bepc`
      );
      return reject(err);
    }
  });
};

const chp2_2_des_resultats_des_examens_fin_de_session_bac = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
      Niveaux.RefNiveau, 
      [NiveauCourt] & " " & [Série] AS Serie, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2,1,Null)) AS InscritFille, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1,1,Null)) AS InscritGarçon, 
      [InscritFille]+[InscritGarçon] AS TotalInscrit, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2,1,Null)) AS PresentFille, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1,1,Null)) AS PresentGarçon, 
      [PresentGarçon]+[PresentFille] AS TotalPresent, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2,1,Null)) AS FilleAdmis, 
      IIf([TotalPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2,1,Null))/[TotalPresent]*100,2)) AS TauxFilleAdmis, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1,1,Null)) AS GarçonAdmis, 
      IIf([TotalPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1,1,Null))/[TotalPresent]*100,2)) AS TauxGarçonAdmis,
      IIf([TotalPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0,1,Null))/[TotalPresent]*100,2)) AS TotalTaux
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, [NiveauCourt] & " " & [Série]
      HAVING (((Niveaux.RefNiveau)=7));
      UNION ALL
      SELECT Niveaux.RefNiveau, "Total" AS Serie, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=2,1,Null)) AS InscritFille, 
      Count(IIf([Elèves].[Inscrit]<>0 And [SEXE]=1,1,Null)) AS InscritGarçon, 
      [InscritFille]+[InscritGarçon] AS TotalInscrit, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=2,1,Null)) AS PresentFille, 
      Count(IIf([Elèves].[AbsExam]=0 And [SEXE]=1,1,Null)) AS PresentGarçon, 
      [PresentGarçon]+[PresentFille] AS TotalPresent, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2,1,Null)) AS FilleAdmis, 
      IIf([TotalPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=2,1,Null))/[TotalPresent]*100,2)) AS TauxFilleAdmis, 
      Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1,1,Null)) AS GarçonAdmis, 
      IIf([TotalPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0 And [SEXE]=1,1,Null))/[TotalPresent]*100,2)) AS TauxGarçonAdmis, 
      IIf([TotalPresent]=0,0,Round(Count(IIf([Elèves].[AdmisExam]<>0,1,Null))/[TotalPresent]*100,2)) AS TotalTaux
      FROM ((Niveaux INNER JOIN (TypesClasses INNER JOIN Classes ON TypesClasses.RefTypeClasse = Classes.RefTypeClasse) ON Niveaux.RefNiveau = TypesClasses.Niveau) INNER JOIN T_Notes ON Classes.RefClasse = T_Notes.RefClasse) INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève
      GROUP BY Niveaux.RefNiveau, "Total"
      HAVING (((Niveaux.RefNiveau)=7));
         `;
      const sqlResult = await fetchFromMsAccess<IChp_B_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp_B_1) => {
        const items = _.omit(item, ["RefNiveau", "label"]);
        return {
          cols: Object.values(items),
        };
      });
      // console.log("🚀 ~ file: functions.ts:322 ~ returnnewPromise ~ contentsArray:", contentsArray)
      resolve(contentsArray);
    } catch (err: any) {
      console.log(
        `err => chp2_2_des_resultats_des_examens_fin_de_session_bac`
      );
      return reject(err);
    }
  });
};

const chp3_A_1_enseignant_permanent = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Sexe AS Genre, 
      Diplomes.NomDiplome, 
      Matières.MatCourt AS Discipline, 
      Personnel.VolumeHoraire, 
      Personnel.N°AutEnseigner AS NumAutEnseigner, 
      Personnel.N°CNPS AS NumCnps, 
      Corps.NomCorps, 
      Personnel.Fonction, 
      TypePersonnel.RefTypePers
      FROM (((Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers
      WHERE (((Personnel.Fonction)=6) AND ((TypePersonnel.RefTypePers)=3));      
         `;
      //  WHERE RefElève=0
      const sqlResult = await fetchFromMsAccess<IChp3_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_A_1, i:number) => {
        return {
          c0:i+1,
          c1: nv(item.NomComplet),
          c2: nv(item.Genre),
          c3: nv(item.NomDiplome),
          c4: nv(item.Discipline),
          c5: nv(item.VolumeHoraire),
          c6: nv(item.NumAutEnseigner),
          c7: nv(item.NumCnps),          
        };
      });
      // console.log("contentsArray...", contentsArray[1])
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_1_enseignant_permanent`);
      return reject(err);
    }
  });
};

const chp3_A_2_enseignant_contractuels = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Sexe AS Genre, Diplomes.NomDiplome, 
      Matières.MatCourt AS Discipline, 
      Personnel.VolumeHoraire, 
      Personnel.N°AutEnseigner AS NumAutEnseigner, 
      Personnel.N°CNPS AS NumCnps, 
      Corps.NomCorps, 
      Personnel.Fonction, 
      TypePersonnel.RefTypePers
      FROM (((Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers
      WHERE (((Personnel.Fonction)=6) AND ((TypePersonnel.RefTypePers)=2));
         `;
      //  WHERE RefElève=0
      const sqlResult = await fetchFromMsAccess<IChp3_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_A_1, i:number) => {
        return {
          c0:i+1,
          c1: nv(item.NomComplet),
          c2: nv(item.Genre),
          c3: nv(item.NomDiplome),
          c4: nv(item.Discipline),
          c5: nv(item.VolumeHoraire),
          c6: nv(item.NumAutEnseigner),
          c7: nv(item.NumCnps),          
        };
      });
      // console.log("contentsArray...", contentsArray[1])
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_1_enseignant_permanent`);
      return reject(err);
    }
  });
};

const chp3_A_3_enseignant_vacataire = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Sexe AS Genre, 
      Diplomes.NomDiplome, 
      Matières.MatCourt AS Discipline, 
      Personnel.VolumeHoraire, 
      Personnel.N°AutEnseigner AS NumAutEnseigner, 
      Personnel.N°CNPS, 
      Corps.NomCorps, 
      Personnel.Fonction, 
      Personnel.Matricule
      FROM (((Corps INNER JOIN (Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) ON Corps.RefCorps = Personnel.Corps) INNER JOIN Matières ON Personnel.RefMatière = Matières.RefMatière) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) INNER JOIN TypePersonnel ON Personnel.RefTypePers = TypePersonnel.RefTypePers
      WHERE (((Personnel.Fonction)=6) AND ((Personnel.Matricule)<>" "));
         `;
      //  WHERE RefElève=0
      const sqlResult = await fetchFromMsAccess<IChp3_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_A_1, i:number) => {
        return {
          c0:i+1,
          c1: nv(item.NomComplet),
          c2: nv(item.Genre),
          c3: nv(item.NomDiplome),
          c4: nv(item.Discipline),
          c5: nv(item.VolumeHoraire),
          c6: nv(item.NumAutEnseigner),
        };
      });
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_A_3_enseignant_contractuels`);
      return reject(err);
    }
  });
};

const chp3_B_etat_du_personnel_admin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Sexe AS Genre, 
      Diplomes.NomDiplome, 
      Personnel.Fonction, 
      Personnel.N°CNPS AS NumCnps, 
      Fonction.Groupe, 
      Groupe.RefGroupePers
      FROM Groupe INNER JOIN ((Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) ON Groupe.RefGroupePers = Fonction.Groupe
      WHERE (((Groupe.RefGroupePers)=1));      
         `;
      //  WHERE RefElève=0
      const sqlResult = await fetchFromMsAccess<IChp3_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_A_1, i:number) => {
        return {
          c0: i+1,
          c1: nv(item.NomComplet),
          c2: nv(item.Genre),
          c3: nv(item.NomDiplome),
          c4: nv(item.Fonction),
          c5: nv(item.NumCnps),
        };
      });
      // console.log("contentsArray...", contentsArray[1])
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => chp3_B_etat_du_personnel_admin`);
      return reject(err);
    }
  });
};
const Chp3_C_autres_personnel = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT [Personnel.NomPers] & " " & [Personnel.PrénomPers] AS NomComplet, 
      Personnel.Sexe AS Genre, 
      Diplomes.NomDiplome, 
      Personnel.Fonction, 
      Personnel.N°CNPS, 
      Fonction.Groupe, 
      Groupe.RefGroupePers
      FROM Groupe INNER JOIN ((Fonction INNER JOIN Personnel ON Fonction.RefFonction = Personnel.Fonction) INNER JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) ON Groupe.RefGroupePers = Fonction.Groupe
      WHERE (((Personnel.Fonction)<>6) AND ((Groupe.RefGroupePers)<>1 And (Groupe.RefGroupePers)=3));
      `;
      const sqlResult = await fetchFromMsAccess<IChp3_A_1[]>(sql, appCnx);
      if (sqlResult.length === 0) return resolve([{}]);
      const contentsArray = sqlResult.map((item: IChp3_A_1, i:number) => {
        return {
          c0: i+1,
          c1: nv(item.NomComplet),
          c2: nv(item.Genre),
          c3: nv(item.NomDiplome),
          c4: nv(item.Fonction),
          c5: nv(item.NumCnps),
        };
      });
      // console.log("contentsArray...", contentsArray[1])
      resolve(contentsArray);
    } catch (err: any) {
      console.log(`err => Chp3_C_autres_personnel`);
      return reject(err);
    }
  });
};

/////////////////////////////////////////////////

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
        logo1,
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
      const identite = await paramsEtablisement();

      const chp1_A_1 = await chp1_A_1_effectif_et_pyramides();
      const chp2_1 = await chp2_1_des_resultats_des_examens_fin_de_session_bepc();
      const chp2_2 = await chp2_2_des_resultats_des_examens_fin_de_session_bac();
      const chp3_A_1 = await chp3_A_1_enseignant_permanent();
      const chp3_A_2 = await chp3_A_2_enseignant_contractuels();
      const chp3_A_3 = await chp3_A_3_enseignant_vacataire();
      const chp3_B = await chp3_B_etat_du_personnel_admin();
      const chp3_C = await Chp3_C_autres_personnel();
      const result = {
        ...data,
        name_report: "prive_secondairegeneral_abidjan3_rapportrentree",
        path_report: "prive/secondaire-general/abidjan3",
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
        chp1_A_1,
        chp2_1,
        chp2_2,
        chp3_A_1,
        chp3_A_2,
        chp3_A_3, 
        chp3_B,
        chp3_C
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
