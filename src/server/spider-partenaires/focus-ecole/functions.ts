import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../../databases/accessDB";
import Logger from "../../helpers/logger";
import {
  ISpiderEvaluationProgrammationItem,
  IFocusEcolePaymentItem,
  ISpiderMatiereItem,
  ISpiderSalleItem,
  ISpiderEvaluationNoteItem,
  ISpiderClassseItem,
  ISpiderPersonnelItem,
  ISpiderPlageHoraireItem,
  ISpiderStudentItem,
  ISpiderHoraireItem,
  ISpiderEcheancierItem,
  ISpiderClassseMatiereProf,
  ISpiderSeanceItem,
  ISpiderGroupeRubriqueItem,
  ISpiderRubriqueItem,
  ISpiderEcheancierIndividuelItem,
  ISpiderRubriqueOptionnelGlobalItem,
  ISpiderEcheancierRubriqueOptionnelItem,
  ISpiderSouscriptionFraisRubriqueOptionnelItem,
  ISpiderEleveRubriqueItem,
  ISpiderEcheancierPersonnelEleveRubriqueItem,
  ISpiderOptionTypeClasseRubriqueObligatoireItem,
  ISpiderTypeClasseRubriqueObligatoireItem,
  ISpiderEcheancierTypeClasseRubriqueObligatoireItem,
  ISpiderVersementItem,
  ISpiderDetailsVersementRubriqueObligatoireItem,
  ISpiderDetailsVersementRubriqueOptionnelItem
} from "./interfaces";
import { pFormat } from "../../helpers/function";
import { _executeSql, _selectSql } from "../../databases/index";
import redisFunctions from "../../databases/redis/functions";


/**
 * ftecher une ou plusieurs classes 
 * @param classeIds 
 * @returns 
 */
export function fetchClasses(classeIds: number[] | null = null): Promise<ISpiderClassseItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT Classes.RefClasse AS idClasse, Classes.ClasseCourt AS libelleClasseCourt, Classes.ClasseLong AS libelleClasseLong, Classes.genreClasse AS genreClasse,
       Classes.OrdreClasse AS ordreClasse,Classes.refTypeclasse AS idTypeclasse, Classes.Arts AS arts,Classes.LV2 AS lv2
        FROM Classes`;
      const sql = classeIds
        ? `${baseSql} WHERE Classes.RefClasse IN (${classeIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<ISpiderClassseItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation classes pour gain technologie");
      reject(error);
    }
  });
}

const setFocusEcoleHistoric = (
  action: string,
  payload: any,
  statut: number
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateNow = new Date().toLocaleString();
      const sql = `INSERT INTO focus_ecole_logs (action, payload, statut,date) VALUES (?, ?, ?, ?)`;
      const payloadStringify = JSON.stringify(payload);

      const sqlParams = [action, payloadStringify, statut, dateNow];
      await _executeSql(sql, sqlParams);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};


/**
 * recupper les donnes sur un  ou pluieurs eleves
 * @param studentIds  // Elèves.MatriculeEtablissement AS matricEts
 * @returns 
 */
export function fetchStudents(studentIds: number[] | null = null): Promise<ISpiderStudentItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const matricOrMatricProv = await redisFunctions.getGlobalVariable("matricOrMatricProv");

      const baseSql = `SELECT DISTINCT Elèves.RefElève AS idEleve,Elèves.nomElève AS nomEleve, Elèves.prénomElève AS prenomEleve,Elèves.Transféré AS transfert,Elèves.InaptEPS AS dispenseEPS,
      Elèves.Nat AS nationalite,Elèves.ResidenceElève AS residenceEleve,Elèves.N°Extrait AS numeroExtrait,Elèves.DateEnregExtr AS dateEnregExtrait,Elèves.emailElève AS emailEleve,Elèves.inscrit AS inscrit,
      Elèves.DateInscrip AS dateInscrit, Elèves.N°Transf AS numeroTransfert,Elèves.EtsOrig AS etabOrigine,
      IIf([Elèves].[statutElève]=1,"AFF","NAFF") AS statutEleve, IIf([Elèves].[sexe]=2,"F","M") AS sexe,Elèves.DecAffect6è AS decisionAffectation,
      Niveau_DPES.Niveau_Dpes as niveau, [classes].[RefClasse] AS idClasse,[classes].[LV2] AS lv2,[classes].[Arts] AS arts,
      ${matricOrMatricProv}, DateNaiss AS dateNaissance,
      Elèves.LieuNaiss AS lieuNaiss, IIf(Elèves.TélTuteur is null,"0000000000",Elèves.TélTuteur) AS mobile, IIf([Elèves].[Redoub]=Yes,"OUI","NON") AS redouble
      FROM Niveau_DPES INNER JOIN (Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON Niveau_DPES.RefTypeClasse = Classes.RefTypeClasse
      `;

      const sql = studentIds
        ? `${baseSql} WHERE Elèves.RefElève IN (${studentIds.join(",")})`
        : baseSql;

      console.log("🚀 ~ file: functions.ts ~ line 67 ~ returnnewPromise ~ sql", sql)
      const result = await fetchFromMsAccess<ISpiderStudentItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      console.log(
        "🚀 ~ file: functions.ts ~ line 77 ~ returnnewPromise ~ error",
        error
      );
      Logger.error("Erreur lors de recuperation eleves pour focus ecole");
      reject(error);
    }
  });
}


/**
 * fetcher l'echenacier individuel defini dans spider pour un ou plusieurs eleves
 * @param studentIds 
 * @returns 
 */
export function fetchEcheancierIndividuel(studentIds: number[] | null = null): Promise<ISpiderEcheancierIndividuelItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT echeancier_individuel.idEleve, echeancier_individuel.idRubrique, echeancier_individuel.dateDebutPeriode, 
      echeancier_individuel.datefinPeriode, echeancier_individuel.montantDejaPaye, echeancier_individuel.montantPeriode, 
      echeancier_individuel.priorite, echeancier_individuel.libelleGroupeRubrique, echeancier_individuel.descriptionGroupeRubrique,
       echeancier_individuel.libelleCategorieGroupeRubrique, echeancier_individuel.libelleNaturePaiement, 
       echeancier_individuel.libellePeriode, echeancier_individuel.libelleRubrique, echeancier_individuel.descriptionRubrique,
        echeancier_individuel.nomEleve, echeancier_individuel.prenomEleve, echeancier_individuel.statutEleve,
         echeancier_individuel.ancienneteEleve, echeancier_individuel.idSouscriptionFraisRubriqueOptionnel
      FROM echeancier_individuel
      `;

      const sql = studentIds
        ? `${baseSql} WHERE echeancier_individuel.idEleve IN (${studentIds.join(",")})`
        : baseSql;
      const result = await _selectSql(sql, [])
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleves pour focus ecole");
      reject(error);
    }
  });
}

// export function fetchEcheancierIndividuel(studentIds: number[] | null = null): Promise<ISpiderEcheancierIndividuelItem[]> {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const baseSql = `SELECT echeancier_individuel_newspd.idEleve,echeancier_individuel_newspd.idEcheancier, echeancier_individuel_newspd.idRubrique, echeancier_individuel_newspd.dateDebutPeriode, 
//       echeancier_individuel_newspd.datefinPeriode, echeancier_individuel_newspd.montantDejaPaye, echeancier_individuel_newspd.montantPeriode, 
//       echeancier_individuel_newspd.priorite, echeancier_individuel_newspd.libelleGroupeRubrique, echeancier_individuel_newspd.descriptionGroupeRubrique,
//        echeancier_individuel_newspd.libelleCategorieGroupeRubrique, echeancier_individuel_newspd.libelleNaturePaiement, 
//        echeancier_individuel_newspd.libellePeriode, echeancier_individuel_newspd.libelleRubrique, echeancier_individuel_newspd.descriptionRubrique,
//         echeancier_individuel_newspd.nomEleve, echeancier_individuel_newspd.prenomEleve, echeancier_individuel_newspd.statutEleve,
//          echeancier_individuel_newspd.ancienneteEleve, echeancier_individuel_newspd.idSouscriptionFraisRubriqueOptionnel
//       FROM echeancier_individuel_newspd
//       `;

//       const sql = studentIds

//         ? `${baseSql} WHERE echeancier_individuel_newspd.idEleve IN (${studentIds.join(",")})`
//         : baseSql;
//       console.log("🚀 ~ file: functions.ts ~ line 139 ~ returnnewPromise ~ sql", sql)
//       const result = await fetchFromMsAccess<ISpiderEcheancierIndividuelItem[]>(sql, appCnx);
//       resolve(result);
//     } catch (error) {
//       console.log(
//         "🚀 ~ file: functions.ts ~ line 77 ~ returnnewPromise ~ error",
//         error
//       );
//       Logger.error("Erreur lors de recuperation eleves pour focus ecole");
//       reject(error);
//     }
//   });
// }

/**
 * Fetcher les options a tenir compte pour les rubliques obigatoires
 * @returns 
 */
export function fetchOptionTypeClasseRubriqueObligatoire(): Promise<ISpiderOptionTypeClasseRubriqueObligatoireItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT option_typeclasse_rubrique_obligatoire_newspd.idOptionTypeClasseRubrique, option_typeclasse_rubrique_obligatoire_newspd.idTypeClasse, option_typeclasse_rubrique_obligatoire_newspd.idRubrique, option_typeclasse_rubrique_obligatoire_newspd.priorite, option_typeclasse_rubrique_obligatoire_newspd.tenirCompteDeStatut, option_typeclasse_rubrique_obligatoire_newspd.tenirCompteDeAnciennete, option_typeclasse_rubrique_obligatoire_newspd.tenirCompteDeGenre
      FROM option_typeclasse_rubrique_obligatoire_newspd;`;
      const result = await fetchFromMsAccess<ISpiderOptionTypeClasseRubriqueObligatoireItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 *  fetcher les rubriques obligatoires definit suivant les types classes
 * @returns 
 */
export function fetchTypeClasseRubriqueObligatoire(): Promise<ISpiderTypeClasseRubriqueObligatoireItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT typeclasse_rubrique_obligatoire_newspd.idTypeClasseRubrique, typeclasse_rubrique_obligatoire_newspd.idOptionTypeClasseRubrique, typeclasse_rubrique_obligatoire_newspd.nombreVersement, typeclasse_rubrique_obligatoire_newspd.montantRubrique, typeclasse_rubrique_obligatoire_newspd.statut, typeclasse_rubrique_obligatoire_newspd.anciennete, typeclasse_rubrique_obligatoire_newspd.genre
        FROM typeclasse_rubrique_obligatoire_newspd;      `;
      const result = await fetchFromMsAccess<ISpiderTypeClasseRubriqueObligatoireItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * fetcher les echeances des rubriques obligatoires
 * @returns 
 */
export function fetchEcheancierTypeClasseRubriqueObligatoire(): Promise<ISpiderEcheancierTypeClasseRubriqueObligatoireItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT echeancier_typeclasse_rubrique_obligatoire_newspd.idTypeClasseRubrique, echeancier_typeclasse_rubrique_obligatoire_newspd.libellePeriode, echeancier_typeclasse_rubrique_obligatoire_newspd.dateDebutPeriode, echeancier_typeclasse_rubrique_obligatoire_newspd.dateFinPeriode, echeancier_typeclasse_rubrique_obligatoire_newspd.montantPeriode
        FROM echeancier_typeclasse_rubrique_obligatoire_newspd;`;
      const result = await fetchFromMsAccess<ISpiderEcheancierTypeClasseRubriqueObligatoireItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * Fetcher les rubriques optionnel global defini dans spider
 * @returns 
 */
export function fetchRubriqueOptionnelGlobal(): Promise<ISpiderRubriqueOptionnelGlobalItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT rubrique_optionnel_global.idRubriqueOptionnelGlobal, rubrique_optionnel_global.idRubrique, rubrique_optionnel_global.montantRubrique, rubrique_optionnel_global.nombreVersement
      FROM rubrique_optionnel_global`;
      const result = await _selectSql(sql, [])
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// export function fetchRubriqueOptionnelGlobalVBA(): Promise<ISpiderRubriqueOptionnelGlobalItem[]> {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const sql = `SELECT rubrique_optionnel_global_newspd.idRubriqueOptionnelGlobal, rubrique_optionnel_global_newspd.idRubrique, rubrique_optionnel_global_newspd.montantRubrique, rubrique_optionnel_global_newspd.nombreVersement
//       FROM rubrique_optionnel_global_newspd;`;
//       const result = await fetchFromMsAccess<ISpiderRubriqueOptionnelGlobalItem[]>(sql, appCnx);
//       resolve(result);
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

/**
 *  Fetcher l'echeancier global des rubriques optionnel defini dans spider
 * @returns 
 */
export function fetchEcheancierRubriqueOptionnelGlobal(): Promise<ISpiderEcheancierRubriqueOptionnelItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT echeancier_rubrique_optionnel_global.idEcheancierRubriqueOptionnelGlobal, echeancier_rubrique_optionnel_global.idRubriqueOptionnelGlobal, echeancier_rubrique_optionnel_global.libellePeriode, echeancier_rubrique_optionnel_global.dateDebutPeriode, echeancier_rubrique_optionnel_global.dateFinPeriode, echeancier_rubrique_optionnel_global.montantPeriode
      FROM echeancier_rubrique_optionnel_global;`;
      const result = await _selectSql(sql, []);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleves pour focus ecole");
      reject(error);
    }
  });
}

// export function fetchEcheancierRubriqueOptionnelGlobalVBA(): Promise<ISpiderEcheancierRubriqueOptionnelItem[]> {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const sql = `SELECT echeancier_rubrique_optionnel_global_newspd.idEcheancierRubriqueOptionnelGlobal, echeancier_rubrique_optionnel_global_newspd.idRubriqueOptionnelGlobal, echeancier_rubrique_optionnel_global_newspd.libellePeriode, echeancier_rubrique_optionnel_global_newspd.dateDebutPeriode, echeancier_rubrique_optionnel_global_newspd.dateFinPeriode, echeancier_rubrique_optionnel_global_newspd.montantPeriode
//       FROM echeancier_rubrique_optionnel_global_newspd;`;
//       const result = await fetchFromMsAccess<ISpiderEcheancierRubriqueOptionnelItem[]>(sql, appCnx);
//       resolve(result);
//     } catch (error) {
//       console.log(
//         "🚀 ~ file: functions.ts ~ line 77 ~ returnnewPromise ~ error",
//         error
//       );
//       Logger.error("Erreur lors de recuperation eleves pour focus ecole");
//       reject(error);
//     }
//   });
// }

/**
 * Fetcher les souscription rubrique optionnnel effectué par un ou plusieur eleve
 * @returns 
 */
export function fetchSouscriptionFraisRubriqueOptionnel(eleveIds: number[] | null = null): Promise<ISpiderSouscriptionFraisRubriqueOptionnelItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT souscription_frais_rubrique_optionnel.idSouscriptionFraisRubriqueOptionnel, souscription_frais_rubrique_optionnel.idEcheancierRubriqueOptionnel,
       souscription_frais_rubrique_optionnel.idEleve, souscription_frais_rubrique_optionnel.personnalise
      FROM souscription_frais_rubrique_optionnel`;
      const sql = eleveIds
        ? `${baseSql} WHERE souscription_frais_rubrique_optionnel.idEleve IN (${eleveIds.join(",")})`
        : baseSql;
      // const result = await _selectSql<ISpiderSouscriptionFraisRubriqueOptionnelItem[]>(sql, appCnx);
      const result = await _selectSql(sql, [])
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleves pour focus ecole");
      reject(error);
    }
  });
}

/**
 * Ancienne version 
 * Recupperer l' echeancier individuel d'un ou plusieurs eleves
 * @param studentIds 
 * @returns 
 */
export function fetchIndividualEcheancier(studentIds: number[] | null = null): Promise<ISpiderEcheancierItem[]> {
  return new Promise(async (resolve, reject) => {
    try {

      //fetch tables soldes echeances
      const getSoldeEcheancier = async () => {
        const sqlSoldeEch = `SELECT  SoldeEcheance.RefElève AS ideleve,
        SoldeEcheance.Octobre AS octobre, SoldeEcheance.Novembre AS novembre, SoldeEcheance.Décembre AS decembre,
        SoldeEcheance.Janvier AS janvier, SoldeEcheance.Février AS fevrier, SoldeEcheance.Mars AS mars,
        SoldeEcheance.Avril AS avril, SoldeEcheance.Mai AS mai, SoldeEcheance.Juin AS juin,SoldeEcheance.RefTypeVers As refTypeVers, 
        SoldeEcheance.Septembre AS septembre FROM SoldeEcheance`;

        const result = await fetchFromMsAccess<any>(sqlSoldeEch, appCnx);
        return result;
      };
      const soldeEcheanciers = await getSoldeEcheancier();

      //fetch les points de versements eleves rubriques
      const getRubriques = async () => {
        const baseSqlPointVers = `
        SELECT Elèves.RefElève AS ideleve, promotion_frais.RefTypeVers AS refTypeVers, promotion_frais.LibFrais AS libelle, promotion_frais.prioriteFrais AS priorite,IIf([StatutElève]=1,[ValFrais1],[Valfrais2]) AS Brut,
         IIf([Promotion_frais].[RefTypeVers]=2,IIf([StatutElève]=1,[tbl_promotion_PriseEnCharge].[Montant_PC],[tbl_PriseEnCharge_Perso].[Montant_PC]),0) AS PC, (SELECT montant_arriere FROM tbl_arrieres_rubriques WHERE RefElève =Elèves.RefElève And RefTypeVers=promotion_frais.RefTypeVers;) AS Arrieres,
          (SELECT montant_remise FROM tbl_remises_rubriques WHERE RefElève =Elèves.RefElève And RefTypeVers=promotion_frais.RefTypeVers;) AS Remise,
          ([Brut]+IIf([Arrieres] Is Null,0,[Arrieres]))-(IIf([PC] Is Null,0,[PC])+IIf([Remise] Is Null,0,[Remise])) AS NetAPayer, (SELECT Sum(DetailsVersements.Montant) AS Total FROM DetailsVersements WHERE RefElève =Elèves.RefElève And RefTypeVers=promotion_frais.RefTypeVers;) AS DejaPaye, 
          IIf(IsNull([Brut]),Null,(IIf([NetAPayer] Is Null,0,[NetAPayer]))-(IIf([DejaPaye] Is Null,0,[DejaPaye]))) AS Solde, TypesVersement.Categorie AS categorie
        FROM (((promotion_frais INNER JOIN (Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON promotion_frais.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN tbl_promotion_PriseEnCharge ON promotion_frais.RefTypeClasse = tbl_promotion_PriseEnCharge.RefTypeClasse) LEFT JOIN tbl_PriseEnCharge_Perso ON Elèves.RefElève = tbl_PriseEnCharge_Perso.RefElève) INNER JOIN TypesVersement ON promotion_frais.RefTypeVers = TypesVersement.RefTypeVers
        WHERE (((promotion_frais.RefTypeVers)<>5))`;

        const sqlPointVers = studentIds
          ? `${baseSqlPointVers} AND Elèves.RefElève IN (${studentIds.join(
            ","
          )})`
          : baseSqlPointVers;
        const result = await fetchFromMsAccess<any>(sqlPointVers, appCnx);
        return result;
      };
      const rubriques = await getRubriques();

      //fetch des eleves
      const getStudents = async () => {
        const baseSql = `SELECT DISTINCT Elèves.RefElève AS ideleve, Elèves.statutElève AS statut, Classes.RefTypeClasse AS refTypeClasse
        FROM Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse
        `;
        const sql = studentIds
          ? `${baseSql} WHERE Elèves.RefElève IN (${studentIds.join(",")})`
          : baseSql;
        const result = await fetchFromMsAccess<any>(sql, appCnx);
        return result;
      };
      const students = await getStudents();

      //fetch echeancier global
      const getEcheancierGlobal = async () => {
        const sqlEchGlobal = `SELECT EcheancierGlobal.statut AS statut,
        EcheancierGlobal.Octobre AS octobre, EcheancierGlobal.Novembre AS novembre, EcheancierGlobal.Décembre AS decembre,
         EcheancierGlobal.Janvier AS janvier, EcheancierGlobal.Février AS fevrier, EcheancierGlobal.Mars AS mars,
          EcheancierGlobal.Avril AS avril, EcheancierGlobal.Mai AS mai, EcheancierGlobal.Juin AS juin, EcheancierGlobal.Septembre AS septembre,
           TypesVersement.RefTypeVers As refTypeVers,TypesVersement.LibelléVers AS libelle, EcheancierGlobal.RefTypeClasse AS refTypeClasse
        FROM (TypesVersement INNER JOIN EcheancierGlobal ON TypesVersement.RefTypeVers = EcheancierGlobal.RefTypeVers)`;
        const result = await fetchFromMsAccess<any>(sqlEchGlobal, appCnx);
        return result;
      };
      const echeancierGlobal = await getEcheancierGlobal();

      //fetch echeancier perso
      const getEcheancierPerso = async () => {
        const sqlEchPerso = `SELECT EcheancierPerso.RefElève AS ideleve, EcheancierPerso.Octobre AS octobre, EcheancierPerso.Novembre AS novembre,
        EcheancierPerso.Décembre AS decembre, EcheancierPerso.Janvier AS janvier, EcheancierPerso.Février AS fevrier, EcheancierPerso.Mars AS mars,
         EcheancierPerso.Avril AS avril, EcheancierPerso.Mai AS mai, EcheancierPerso.Juin AS juin, EcheancierPerso.Septembre AS septembre, TypesVersement.LibelléVers AS libelle,
         EcheancierPerso.RefTypeVers AS refTypeVers
       FROM TypesVersement INNER JOIN EcheancierPerso ON TypesVersement.RefTypeVers = EcheancierPerso.RefTypeVers`;
        const sql = studentIds
          ? `${sqlEchPerso} WHERE EcheancierPerso.RefElève IN (${studentIds.join(
            ","
          )})`
          : sqlEchPerso;
        const result = await fetchFromMsAccess<any>(sql, appCnx);
        return result;
      };
      const echeancierPerso = await getEcheancierPerso();

      const paramEtab = await paramEtabObjet(["Anscol1", "DateButoirEcheance"]);
      const result = [];

      //Parcourir les élèves et obtenir les paiement du pour chaque élève.
      students.map((student) => {
        //on récupère les types de versement pour un élève.
        const studentRubriques = rubriques.filter(
          (item) => item.ideleve === student.ideleve
        );

        //on recupere les soldes echeances d'un eleves
        const studentSoldeEch = soldeEcheanciers.filter(
          (item) => item.ideleve === student.ideleve
        );


        //parcouirir les rubrique de l'eleve et verifier pouir chaque rubrique si elle presente dans echeanchier perso, global ou aucun
        studentRubriques.map((stuRubr) => {
          if (stuRubr.NetAPayer !== 0 && stuRubr.NetAPayer !== null) { //si le net a payer est positif


            //verifier rubrique presente dans echeancier perso
            const echPerso = echeancierPerso.find((item) =>
              item.ideleve === student.ideleve &&
              item.refTypeVers === stuRubr.refTypeVers
            );


            if (!echPerso) {//si rubrique pas presente dans echeancier perso
              //verifier rubrique presente dans echeancier global
              const echGlobal = echeancierGlobal.find(
                (item) =>
                  item.refTypeVers === stuRubr.refTypeVers &&
                  item.statut === student.statut &&
                  item.refTypeClasse === student.refTypeClasse
              );

              if (!echGlobal) { //si rubrique pas presente dans echeancier global
                //contruire un object pour la rubrique
                const montant = stuRubr.NetAPayer; // le montant total qui doit etre payé pour cette rubrique
                const soldeData = studentSoldeEch.find(
                  (item) => item.refTypeVers === stuRubr.refTypeVers
                );



                /* 
                *si on ne trouve pas la rubrique dans les soldeEcheance de l'eleves 
                *alors on on obtient le montant reste par la difference entre le montant total et le lontant deja paye
                * sinon on aditioner les montant reste des diffents mois
                */
                const montantReste = !soldeData ? stuRubr.NetAPayer - stuRubr.DejaPaye : (soldeData.octobre +
                  soldeData.novembre +
                  soldeData.decembre +
                  soldeData.janvier +
                  soldeData.fevrier +
                  soldeData.mars +
                  soldeData.avril +
                  soldeData.mai +
                  soldeData.juin +
                  soldeData.septembre);

                const montantPaye = montant - montantReste;
                //cas de rubrique non echanlonnée
                result.push({
                  idEleve: student.ideleve,
                  montant: stuRubr.NetAPayer,
                  dejaPaye: montantPaye,
                  datelimite: `${paramEtab.anscol1.split("-")[0]}-09-${pFormat(
                    paramEtab.datebutoirecheance,
                    2
                  )}`,
                  description: `${stuRubr.libelle} rentrée scolaire`,
                  rubrique: stuRubr.libelle,
                  idRubrique: stuRubr.refTypeVers,
                  categorieVersement: stuRubr.categorie,
                  periode: "Rentrée scolaire",
                  priorite: stuRubr.priorite
                });
              } else {

                // cas écheanchier global défini pour la rubrique
                const resultEchGlobal = echeancierItem(
                  echGlobal,
                  paramEtab,
                  student.ideleve,
                  studentSoldeEch,
                  stuRubr.refTypeVers,
                  stuRubr.categorie,
                  stuRubr.DejaPaye,
                  stuRubr.NetAPayer,
                  stuRubr.priorite
                );
                result.push(...resultEchGlobal);
              }
            } else {
              //cas écheanchier perso défini pour la rubrique
              const resultEchPerso = echeancierItem(
                echPerso,
                paramEtab,
                student.ideleve,
                studentSoldeEch,
                stuRubr.refTypeVers,
                stuRubr.categorie,
                stuRubr.DejaPaye,
                stuRubr.NetAPayer,
                stuRubr.priorite
              );
              result.push(...resultEchPerso);
            }
          }
        });
      });

      resolve(result);
    } catch (error) {
      console.log(
        "🚀 ~ file: functions.ts ~ line 240 ~ returnnewPromise ~ error",
        error
      );
      reject(error);
    }
  });
}

const echeancierItem = (
  echeance,
  paramEtab,
  ideleve,
  studentSoldeEch,
  refTypeVers,
  categorieVersement,
  montantDejaPaye,
  montantNetAPaye,
  prioriteRubrique
) => {
  const result = []; // doit contenir le resultat final

  if (studentSoldeEch.length === 0) {// si solde echeance de l'eleve pas defini
    const newItem: any = {
      idEleve: ideleve,
      montant: montantNetAPaye,
      datelimite: `${paramEtab.anscol1.split("-")[0]}-09-${pFormat(
        paramEtab.datebutoirecheance,
        2
      )}`,
      rubrique: echeance.libelle
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toUpperCase(),
      idRubrique: echeance.refTypeVers,
      periode: "Rentre scolaire",
      dejaPaye: montantDejaPaye,
      description: ` ${echeance.libelle} rentrée scolaire`,
      categorieVersement,
      priorite: prioriteRubrique
    };

    result.push(newItem);

  } else {


    const months = [
      "janvier",
      "fevrier",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "aout",
      "septembre",
      "octobre",
      "novembre",
      "decembre",
    ];

    Object.keys(echeance).map((key) => {
      const index: number = months.indexOf(key);
      if (index !== -1) {
        if (echeance[key] !== null) {
          const annee =
            index + 1 >= 9
              ? paramEtab.anscol1.split("-")[0]
              : paramEtab.anscol1.split("-")[1];
          const newIndex = index + 1;
          const mois = pFormat(newIndex, 2);
          const jour = pFormat(paramEtab.datebutoirecheance, 2);
          const dateLimit = `${annee}-${mois}-${jour}`;
          const montant = echeance[key];
          const montantReste =
            studentSoldeEch.length === 0
              ? montant - montantDejaPaye
              : studentSoldeEch[
              studentSoldeEch.findIndex(
                (item) => item.refTypeVers === refTypeVers
              )
              ][months[index]];
          //  const montantReste = studentSoldeEch[studentSoldeEch.findIndex((item) => item.refTypeVers === refTypeVers )][months[index]];

          const montantPaye = montant - montantReste;

          const newItem: any = {
            idEleve: ideleve,
            montant,
            dateLimitePeriode: dateLimit,
            rubrique: echeance.libelle
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .toUpperCase(),
            idRubrique: echeance.refTypeVers,
            periode: key,
            dejaPaye: montantPaye,
            description: `${echeance.libelle} ${key}`,
            categorieVersement,
            priorite: prioriteRubrique
          };

          result.push(newItem);
        }
      }
    });
  }

  return result;
};

/**
 * marquer toutes un groupe d'action (classe , eleve ...) comme success
 * @param actionFor
 * @returns
 */
export const setFocusEcoleLogsGroupActionSuccess = (
  actionFor: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      let actionsList = "()";
      if (actionFor === "eleve") {
        actionsList = "('ENVOYER_ELEVE','MODIFIER_ELEVE','SUPPRIMER_ELEVE')";
      } else if (actionFor === "classe") {
        actionsList = "('ENVOYER_CLASSE','MODIFIER_CLASSE','SUPPRIMER_CLASSE')";
      } else if (actionFor === "versement") {
        actionsList =
          "('ENVOYER_VERSEMENT','MODIFIER_PAIEMENT','SUPPRIMER_VERSEMENT')";
      } else if (actionFor === "echindividuel") {
        actionsList =
          "('ENVOYER_ECHEANCIER_INDIVIDUEL')";
      }
      const dateNow = new Date().toLocaleString();
      const sql = `UPDATE focus_ecole_logs SET statut = ?,date=? WHERE action IN  ${actionsList}`;
      await _executeSql(sql, [1, dateNow]);
      resolve(true);
    } catch (error) {
      console.log(
        "🚀 ~ file: functions.ts ~ line 333 ~ returnnewPromise ~ error",
        error
      );
      reject(error);
    }
  });
};

/**
 * fetcher un ou plusieurs versement
 * @param refEleves
 * @returns
 */
export const fetchPayments = async (versementIds: number[] | null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT * FROM versement`
      const sql = versementIds
        ? `${baseSql} WHERE idVersement IN (${versementIds.join(",")})`
        : baseSql;
      const result = await _selectSql(sql, [])
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation paiements pour gain technologie"
      );
      reject(error);
    }
  });
};

// export const fetchPayments = async (versementIds: number[] | null) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const baseSql = `
//         SELECT Versements.RefElève AS idEleve, DetailsVersements.Montant AS montantVersement, Versements.RefVersement AS idVersement, UCase([lib_mode_paie]) AS modeVersemnt,
//          TypesVersement.LibelléVers AS rubriqueVersement, Versements.DateVers AS dateVersement 
//          FROM tbl_mode_vers_scolarite INNER JOIN ((TypesVersement INNER JOIN (Versements INNER JOIN DetailsVersements ON Versements.RefVersement = DetailsVersements.RefVers) ON TypesVersement.RefTypeVers = DetailsVersements.RefTypeVers) INNER JOIN Elèves ON Versements.RefElève = Elèves.RefElève) ON tbl_mode_vers_scolarite.id_mode_paie = Versements.ModePaie
//      `
//       const sql = versementIds
//         ? `${baseSql} WHERE Versements.RefVersement IN (${versementIds.join(",")})`
//         : baseSql;
//       const result = await fetchFromMsAccess<IFocusEcolePaymentItem[]>(
//         sql,
//         appCnx
//       );
//       resolve(result);
//     } catch (error) {
//       Logger.error(
//         "Erreur lors de recuperation paiements pour gain technologie"
//       );
//       reject(error);
//     }
//   });
// };

/**
 * fetcher un ou plusieurs versement
 * @param versementIds 
 * @returns 
 */
export const fetchVersements = async (versementIds: number[] | null): Promise<ISpiderVersementItem[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT * FROM versement`
      const sql = versementIds
        ? `${baseSql} WHERE idVersement IN (${versementIds.join(",")})`
        : baseSql;
      const result = await _selectSql(sql, [])
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation paiements pour gain technologie"
      );
      reject(error);
    }
  });
};

/**
 * fetcher les details de versement pour une rubrique obligatoire
 * @param versementIds 
 * @returns 
 */
export const fetchDetailsVersementRubriqueObligatoire = async (versementIds: number[] | null): Promise<ISpiderDetailsVersementRubriqueObligatoireItem[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT details_versement_rubrique_obligatoire_newspd.idVersement, details_versement_rubrique_obligatoire_newspd.idRubrique, details_versement_rubrique_obligatoire_newspd.montant
      FROM details_versement_rubrique_obligatoire_newspd`
      const sql = versementIds
        ? `${baseSql} WHERE details_versement_rubrique_obligatoire_newspd.idVersement IN (${versementIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<ISpiderDetailsVersementRubriqueObligatoireItem[]>(
        sql,
        appCnx
      );
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation paiements pour gain technologie"
      );
      reject(error);
    }
  });
};

/**
 * fetcher les details de versement pour une rubrique optionnel
 * @param versementIds 
 * @returns 
 */
export const fetchDetailsVersementRubriqueOptionnel = async (versementIds: number[] | null): Promise<ISpiderDetailsVersementRubriqueOptionnelItem[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT details_versement_rubrique_obligatoire_newspd.idVersement, details_versement_rubrique_obligatoire_newspd.idRubrique, details_versement_rubrique_obligatoire_newspd.montant
      FROM details_versement_rubrique_obligatoire_newspd`
      const sql = versementIds
        ? `${baseSql} WHERE details_versement_rubrique_obligatoire_newspd.idVersement IN (${versementIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<ISpiderDetailsVersementRubriqueOptionnelItem[]>(
        sql,
        appCnx
      );
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation paiements pour gain technologie"
      );
      reject(error);
    }
  });
};


/**
 * fetcher les types classes
 * @returns 
 */
export const fetchTypeClasses = async (): Promise<ISpiderClassseMatiereProf[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT TypesClasses.RefTypeClasse AS idTypeClasse, Niveaux.NiveauCourt AS libelleTypeClasseCourt, Niveaux.NiveauLong AS libelleTypeClasseLong, Niveaux.Cycle AS Cycle, TypesClasses.Série AS Serie
FROM TypesClasses INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau;`;
      const result = await fetchFromMsAccess<ISpiderClassseMatiereProf[]>(sql, appCnx);

      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation paiements pour gain technologie"
      );
      reject(error);
    }
  });
};


/**
 * Obtenir la liste des profs par classe et par matiere
 * @returns 
 */
export const fetchClassesMatieresProfs = async (): Promise<ISpiderClassseMatiereProf[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT classe_matieres_prof_eval.refClasse AS idClasse, classe_matieres_prof_eval.refPers AS idPersonnel, classe_matieres_prof_eval.refMat AS idMatiere, classe_matieres_prof_eval.classeCourt AS libelleClasseCourt,
       Classes.classeLong AS libelleClasseLong, classe_matieres_prof_eval.refTypeClasse AS idTypeClasse, classe_matieres_prof_eval.ordreClasse AS ordreClasse, classe_matieres_prof_eval.matCourt AS libelleMatiereCourt, classe_matieres_prof_eval.matLong AS libelleMatiereLong, classe_matieres_prof_eval.nomPers AS nomPersonnel
      FROM classe_matieres_prof_eval INNER JOIN Classes ON classe_matieres_prof_eval.refClasse = Classes.RefClasse WHERE  classe_matieres_prof_eval.refPers IS NOT NULL;`;
      const result = await fetchFromMsAccess<ISpiderClassseMatiereProf[]>(sql, appCnx);

      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation paiements pour gain technologie"
      );
      reject(error);
    }
  });
};

/**
 * recuuper les horaires 
 * @returns 
 */
export function fecthHoraires(): Promise<ISpiderHoraireItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT Horaires.RefHoraire AS idHoraire, Horaires.Horaire AS libelleHoraire, Horaires.PlageHoraire AS plageHoraire FROM Horaires;`;
      const result = await fetchFromMsAccess<ISpiderHoraireItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation paiements pour gain technologie"
      );
      reject(error);
    }
  });
};

/**
 * recupperer les plage horaire
 * @returns 
 */
export function fecthPlageHoraires(): Promise<ISpiderPlageHoraireItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT PlagesHoraires.Chrono AS chrono, PlagesHoraires.Utilisation AS utilisation, PlagesHoraires.Debut AS debut, PlagesHoraires.Fin AS fin
      FROM PlagesHoraires;`;
      const result = await fetchFromMsAccess<ISpiderPlageHoraireItem[]>(
        sql,
        appCnx
      );
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de l'envoi plage horaire chez focus ecole");
      reject(error);
    }
  });
};

/**
 * recupper les données sur un ou plusieurs memebre du ersonnel
 * @param personnelIds 
 * @returns 
 */
export function fecthPersonnel(personnelIds: number[] | null = null): Promise<ISpiderPersonnelItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT Personnel.RefPersonnel AS idPersonnel, Personnel.NomPers AS nomPersonnel, Personnel.PrénomPers AS prenomPersonnel, Fonction.Fonction AS fonction,
       Personnel.Matricule AS matriculePersonnel,Personnel.Sexe AS sexe, Personnel.TélPers AS phone1, Personnel.CelPers AS phone2, Personnel.DateNaiss AS dateNaissance,
       Personnel.LieuNaiss AS lieuNaissance, Diplomes.NomDiplome AS libelleDiplome, Personnel.Quartier AS residence, Personnel.SitMatr AS situationMatrimoniale, 
       Personnel.DateEmbauche AS dateEmbauche, Personnel.N°CNPS AS numeroCnps, Personnel.NbEnfants AS nombreEnfant, Personnel.Corps AS corpsMetier
      FROM (Personnel LEFT JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction) LEFT JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome;
      `;
      const sql = personnelIds
        ? `${baseSql} WHERE Personnel.RefPersonnel IN (${personnelIds.join(",")})`
        : baseSql;
      console.log("🚀 ~ file: functions.ts ~ line 553 ~ returnnewPromise ~ sql", sql)
      const result = await fetchFromMsAccess<ISpiderPersonnelItem[]>(
        sql,
        appCnx
      );
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de l'envoi personnel chez focus ecole");
      reject(error);
    }
  });
};

/**
 * recuperer les notes d'une ou plusieurs evalutions
 * @param evalId ids des notes evaluations
 * @returns 
 */
export function fecthEvaluationNotes(evalIds: number[] | null = null): Promise<ISpiderEvaluationNoteItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🚀 ~ file: functions.ts ~ line 573 ~ fecthEvalNote ~ evalIds", evalIds)
      const baseSql = `SELECT tb_eval_note.idEval AS idEvaluationProgrammation, tb_eval_note.refEleve AS idEleve, tb_eval_note.noteEval AS noteEvaluation, tb_eval_note.dateSaisie AS dateSaisie, tb_eval_note.opSaisie AS operateurSaisie, tb_eval_note.dateModif AS dateModification, tb_eval_note.opModif AS operateurModification, tb_eval_note.recup AS recuperer, tb_eval_note.device AS device, tb_eval_prog.refMat AS idMatiere, tb_eval_prog.refClasse AS idClasse, tb_eval_prog.periodeEval AS periodeEvaluation
      FROM tb_eval_note INNER JOIN tb_eval_prog ON tb_eval_note.idEval = tb_eval_prog.idEval;`;
      const sql = evalIds
        ? `${baseSql} WHERE tb_eval_note.idEval IN ('${evalIds.join("','")}')`
        : baseSql;
      console.log("🚀 ~ file: functions.ts ~ line 578 ~ returnnewPromise ~ sql", sql)
      const result = await fetchFromMsAccess<ISpiderEvaluationNoteItem[]>(
        sql,
        appCnx
      );
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch note evaluation ");
      reject(error);
    }
  });
};

/**
 * fetcher la programtion des evalutions
 * @param evalIds 
 * @returns 
 */
export function fecthEvalProg(evalIds: number[] | null = null): Promise<ISpiderEvaluationProgrammationItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT tb_eval_prog.idEval AS idEvaluationProgrammation, tb_eval_prog.refClasse AS idClasse, tb_eval_prog.refMat AS idMatiere,
       tb_eval_prog.periodeEval AS periodeEvaluation, tb_eval_prog.numEval AS numeroEvaluation, tb_eval_prog.coefEval AS coefficientEvaluation,
        tb_eval_prog.dateCompo AS dateComposition, tb_eval_prog.typeEval AS typeEvaluation FROM tb_eval_prog`;
      const sql = evalIds
        ? `${baseSql} WHERE tb_eval_prog.idEval IN (${evalIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<ISpiderEvaluationProgrammationItem[]>(
        sql,
        appCnx
      );
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch programtion evaluation ");
      reject(error);
    }
  });
};

/**
 * recupper les données sur une ou plusieurs matieres
 * @param matieresIds 
 * @returns 
 */
export function fecthMatieres(matieresIds: number[] | null = null): Promise<ISpiderMatiereItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT Matières.RefMatière AS idMatiere, Matières.MatCourt AS libelleMatiereCourt, Matières.MatLong AS libelleMatiereLong, Matières.MatAbrég AS libelleMatiereAbreger, 
      Matières.Ordre AS ordreMatiere, Matières.CouleurMatière AS couleurMatiere, Matières.Gen AS [general], Matières.Bilan AS bilan
      FROM Matières`;
      const sql = matieresIds
        ? `${baseSql} WHERE Matières.RefMatière IN (${matieresIds.join(",")})`
        : baseSql;
      console.log("🚀 ~ file: functions.ts ~ line 636 ~ returnnewPromise ~ sql", sql)
      const result = await fetchFromMsAccess<ISpiderMatiereItem[]>(
        sql,
        appCnx
      );

      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch matieres");
      reject(error);
    }

  });
};

/**
 * recupperer les salles definit dans spider
 * @param roomIds 
 * @returns 
 */
export function fecthSalles(roomIds: number[] | null = null): Promise<ISpiderSalleItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT Salles.RefSalle AS idSalle, Salles.NomSalle AS libelleSalle, Salles.typeSalle AS typeSalle, Salles.CapaciteSalle AS capaciteSalle,
       Salles.ordreSalle AS ordreSalle FROM Salles`;
      const sql = roomIds
        ? `${baseSql} WHERE Salles.RefSalle IN (${roomIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<ISpiderSalleItem[]>(
        sql,
        appCnx
      );
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch salles");
      reject(error);
    }
  });
};

/**
 * fetchjer les seances programmées dans spider
 * @returns 
 */
export function fecthSeances(): Promise<ISpiderSeanceItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT Seances.RefSeance AS idSeance, Seances.RefSalle AS idSalle, Seances.RefPers AS idPersonnel, Seances.RefMatière AS idMatiere,
      Seances.RefClasse AS idClasse, Seances.RefHoraire AS idHoraire,Seances.obs AS observation
      FROM Seances;`;
      const result = await fetchFromMsAccess<ISpiderSeanceItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation seances"
      );
      reject(error);
    }
  });
};

/**
 * fetcher les groupes rubriques dans spider
 * @returns 
 */
export function fecthGroupeRubriques(): Promise<ISpiderGroupeRubriqueItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT groupe_rubrique.idGroupeRubrique, groupe_rubrique.libelleGroupeRubrique, groupe_rubrique.descriptionGroupeRubrique, groupe_rubrique.idCategorieGroupeRubrique
      FROM groupe_rubrique;`;
      const result = await fetchFromMsAccess<ISpiderGroupeRubriqueItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation seances"
      );
      reject(error);
    }
  });
};

/**
 * fetcher les rubriques defini dans spider
 * @returns 
 */
export function fecthRubriques(rubriqueIds: number[] | null = null): Promise<ISpiderRubriqueItem[]> {
  return new Promise(async (resolve, reject) => {
    try {

      const baseSql = `SELECT rubrique.idRubrique, rubrique.idGroupeRubrique, rubrique.libelleRubrique, rubrique.descriptionRubrique, rubrique.idNaturePaiement, rubrique.desabonnementInterdit
      FROM rubrique`;

      const sql = rubriqueIds
        ? `${baseSql} WHERE rubrique.idRubrique IN (${rubriqueIds.join(",")})`
        : baseSql;

      const result = await _selectSql(sql, []);
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation rubriques"
      );
      reject(error);
    }
  });
};

/**
 * Fetcher tous les rubriques qu'un ou plusieurs ont personnalisé (le rythme de paiement / versement ...)
 * @param eleveIds 
 * @returns 
 */
export function fetchEleveRubrique(eleveIds: number[] | null = null): Promise<ISpiderEleveRubriqueItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT eleve_rubrique_newspd.idEleveRubrique, eleve_rubrique_newspd.idEleve, eleve_rubrique_newspd.idRubrique, eleve_rubrique_newspd.nombreVersement, eleve_rubrique_newspd.montantRubrique
      FROM eleve_rubrique_newspd`;
      const sql = eleveIds
        ? `${baseSql} WHERE eleve_rubrique_newspd.idEleve IN (${eleveIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<ISpiderEleveRubriqueItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleve rubrque");
      reject(error);
    }
  });
}

/**
 * fetcher les echeances de un ou  plusieurs rubrique personnalisé de un ou plusieur eleves (eleve rubrique)
 * @param idEleveRubrique l'id de la tabzl eleve rubrique
 */
export function fetchEcheancierPersonnelEleveRubrique(idEleveRubrique: number[] | null = null): Promise<ISpiderEcheancierPersonnelEleveRubriqueItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT echeancier_personnel_eleve_rubrique_newspd.idEcheancierRubriquePersonnel, echeancier_personnel_eleve_rubrique_newspd.idEleveRubrique, 
      echeancier_personnel_eleve_rubrique_newspd.libellePeriode, echeancier_personnel_eleve_rubrique_newspd.dateDebutPeriode,
       echeancier_personnel_eleve_rubrique_newspd.dateFinPeriode, echeancier_personnel_eleve_rubrique_newspd.montantPeriode
      FROM echeancier_personnel_eleve_rubrique_newspd`;
      const sql = baseSql
      // ? `${baseSql} WHERE echeancier_personnel_eleve_rubrique_newspd.idEleveRubrique.idEleve IN ("${idEleveRubrique.join(`","`)}")`
      // : baseSql;
      console.log("🚀 ~ file: functions.ts ~ line 1023 ~ returnnewPromise ~ sql", sql)
      const result = await fetchFromMsAccess<ISpiderEcheancierPersonnelEleveRubriqueItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleve rubrque");
      reject(error);
    }
  });
}


/**
 * 
 * @returns 
 */
export function subscriptionOptionnalRubric(): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {

      resolve(true);
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleve rubrque");
      reject(error);
    }
  });
}




/**
 * fetcher les libelles echeances vesr spider
 * @returns 
 */
export function fecthLibelleEcheances(): Promise<ISpiderRubriqueItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT libelle_echeance_newspd.idLibelleEcheance, libelle_echeance_newspd.idRubrique, libelle_echeance_newspd.LibelleEcheance
      FROM libelle_echeance_newspd;`;
      const result = await fetchFromMsAccess<ISpiderRubriqueItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation seances"
      );
      reject(error);
    }
  });
};
export function fetchLogs<IFocusEcoleLogItem>(logIds: number[] | null = null) {
  return new Promise(async (resolve, reject) => {
    try {
      if (logIds) {
        const sql = `SELECT * FROM focus_ecole_logs WHERE id IN  (${logIds.join(
          ","
        )})`;
        const result: IFocusEcoleLogItem[] = await _selectSql(sql, []);
        resolve(result);
      } else {
        const sql = `SELECT * FROM focus_ecole_logs`;
        const result: IFocusEcoleLogItem[] = await _selectSql(sql, []);
        resolve(result);
      }
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleves pour gain technologie");
      reject(error);
    }
  });
}

export const setLogsSuccess = (logIds: number[]): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateNow = new Date().toLocaleString();
      const sql = `UPDATE focus_ecole_logs SET statut = ?,date=? WHERE id IN  (${logIds.join(
        ","
      )})`;
      await _executeSql(sql, [1, dateNow]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  fetchClasses,
  setFocusEcoleHistoric,
  fetchStudents,
  fetchIndividualEcheancier,
  fetchEcheancierIndividuel,
  setFocusEcoleLogsGroupActionSuccess,
  fetchPayments,
  fetchLogs,
  fetchClassesMatieresProfs,
  fecthHoraires,
  fecthPlageHoraires,
  fecthEvaluationNotes,
  fecthEvalProg,
  fecthSalles,
  fecthPersonnel,
  fecthMatieres,
  setLogsSuccess,
  fecthSeances,
  fecthGroupeRubriques,
  fecthRubriques,
  fecthLibelleEcheances,
  fetchSouscriptionFraisRubriqueOptionnel,// Fetcher les souscription rubrique optionnnel effectué par un ou plusieur eleve
  fetchEleveRubrique,//Fetcher tous les rubriques qu'un ou plusieurs ont personnalisé (le rythme de paiement / versement ...)
  fetchEcheancierPersonnelEleveRubrique,//fetcher les echeances de un ou  plusieurs rubrique personnalisé  pour un ou plusieur eleves (eleve rubrique)*
  fetchRubriqueOptionnelGlobal,//Fetcher les rubriques optionnel global defini dans spider 
  fetchEcheancierRubriqueOptionnelGlobal,//Fetcher l'echeancier global des rubriques optionnel defini dans spider
  fetchOptionTypeClasseRubriqueObligatoire,//Fetcher les options des rubliques obigatoires
  fetchTypeClasseRubriqueObligatoire,// fetcher les rubriques obligatoires definit suivant les types classes
  fetchEcheancierTypeClasseRubriqueObligatoire,// fetcher les echeances des rubriques obligatoires
  fetchVersements, //fetcher un ou plusieurs versement
  fetchDetailsVersementRubriqueObligatoire, //fetcher les details de versement pour une rubrique obligatoire
  fetchDetailsVersementRubriqueOptionnel, // fetcher les details de versement pour une rubrique obligatoire
  subscriptionOptionnalRubric,//souscrire a une ou plusieurs rubrique optionnelle
  fetchTypeClasses,// fetcher tous les types classes
};