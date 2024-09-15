import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../databases/accessDB";
import Logger from "../helpers/logger";
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
  ISpiderDetailsVersementRubriqueOptionnelItem,
  ISpiderPlanning,
  IParentContact,
  IClassesMatieresProfsGeneral,
  IPromotionMatiereModuleGeneral,
  ICompoMatieresNotes,
  ICompoMoyennes,
  IListeCompoPrimaire,
  IMoyenneMatiere,
  IMoyenneGeneral,
} from "./interfaces";
import { pFormat } from "../helpers/function";
import { _executeSql, _selectSql } from "../databases/index";
import redisFunctions from "../databases/redis/functions";

/**
 * ftecher une ou plusieurs classes
 * @param classeIds
 * @returns
 */
export function fetchClasses(
  classeIds: number[] | null = null
): Promise<ISpiderClassseItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const baseSql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, Classes.RefClasse AS idClasse, Classes.ClasseCourt AS libelleClasseCourt, Classes.ClasseLong AS libelleClasseLong, Classes.genreClasse AS genreClasse,
       Classes.OrdreClasse AS ordreClasse,Classes.refTypeclasse AS idTypeclasse, Classes.Arts AS arts,Classes.LV2 AS lv2,Classes.maitre AS idInstituteur
        FROM Classes`;
      const sql = (classeIds && classeIds.length)
        ? `${baseSql} WHERE Classes.RefClasse IN (${classeIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<ISpiderClassseItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation classes");
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
export function fetchStudents(
  studentIds: number[] | null = null
): Promise<ISpiderStudentItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const matricOrMatricProv = await redisFunctions.getGlobalVariable("matricOrMatricProv");

      const baseSql = `SELECT RefElève AS idEleve, nomElève AS nomEleve, prénomElève AS prenomEleve, Transféré AS transfert, InaptEPS AS dispenseEPS,
      Nat AS nationalite, ResidenceElève AS residenceEleve, N°Extrait AS numeroExtrait, DateEnregExtr AS dateEnregExtrait, emailElève AS emailEleve, Elèves.inscrit AS inscrit,
      DateInscrip AS dateInscrit, N°Transf AS numeroTransfert, EtsOrig AS etabOrigine,
      IIf(statutElève=1,"AFF","NAFF") AS statutEleve, IIf(Elèves.sexe=2,"F","M") AS sexe, DecAffect6è AS decisionAffectation,
      RefClasse AS idClasse, Elèves.LV2 AS lv2, Elèves.Arts AS arts,
      ${matricOrMatricProv}, DateNaiss AS dateNaissance,
      LieuNaiss AS lieuNaissance, IIf(Redoub=Yes,"OUI","NON") AS redouble,
      Tuteur AS nomPrenomTuteur, TélTuteur AS telephoneTuteur, "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab
      FROM Elèves 
      WHERE Elèves.inscrit = yes`;

      const sql = studentIds && studentIds.length
        ? `${baseSql} AND Elèves.RefElève IN (${studentIds.join(",")})`
        : baseSql;

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

export function fetchParents(
  studentIds: number[] | null = null
): Promise<IParentContact[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);

      const filter = studentIds
        ? `And Elèves.RefElève IN (${studentIds.join(",")})`
        : "";

      const sql = `SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, Elèves.RefElève AS idEleve, Elèves.TélTuteur AS numeroCellulaire,"tuteur" AS filiation, Elèves.Tuteur AS nomPrenomParent, Elèves.ProfessionTuteur AS professionParent , Elèves.ResidenceTuteur AS residenceParent , Elèves.EmailTuteur AS emailParent 
FROM Elèves
      WHERE Elèves.inscrit = yes AND Elèves.TélTuteur Is Not Null And Elèves.TélTuteur <> "" ${filter}
      UNION ALL
      SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, Elèves.RefElève AS idEleve, Elèves.MobilePère AS numeroCellulaire,"père" AS filiation, Elèves.NomPère AS nomPrenomParent, Elèves.ProfessionPère AS professionParent , Elèves.ResidencePère AS residenceParent , Elèves.EmailPère AS emailParent 
      FROM Elèves
      WHERE Elèves.inscrit = yes AND Elèves.MobilePère Is Not Null And Elèves.MobilePère <> "" ${filter}
      UNION ALL
      SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, Elèves.RefElève AS idEleve, Elèves.MobileMère AS numeroCellulaire ,"mère" AS filiation, Elèves.NomMère AS nomPrenomParent, Elèves.ProfessionMère AS professionParent , Elèves.ResidenceMère AS residenceParent , Elèves.EmailMère AS emailParent
      FROM Elèves
      WHERE Elèves.inscrit = yes AND Elèves.MobileMère Is Not Null And Elèves.MobileMère <>"" ${filter}`

      const result = await fetchFromMsAccess<IParentContact[]>(sql, appCnx);

      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleves pour focus ecole");
      reject(error);
    }
  });
}


/**
 * Fetcher les options a tenir compte pour les rubliques obigatoires
 * @returns
 */
export function fetchOptionTypeClasseRubriqueObligatoire(): Promise<
  ISpiderOptionTypeClasseRubriqueObligatoireItem[]
> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT option_typeclasse_rubrique_obligatoire_newspd.idOptionTypeClasseRubrique, option_typeclasse_rubrique_obligatoire_newspd.idTypeClasse, option_typeclasse_rubrique_obligatoire_newspd.idRubrique, option_typeclasse_rubrique_obligatoire_newspd.priorite, option_typeclasse_rubrique_obligatoire_newspd.tenirCompteDeStatut, option_typeclasse_rubrique_obligatoire_newspd.tenirCompteDeAnciennete, option_typeclasse_rubrique_obligatoire_newspd.tenirCompteDeGenre
      FROM option_typeclasse_rubrique_obligatoire_newspd;`;
      const result = await fetchFromMsAccess<
        ISpiderOptionTypeClasseRubriqueObligatoireItem[]
      >(sql, appCnx);
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
export function fetchTypeClasseRubriqueObligatoire(): Promise<
  ISpiderTypeClasseRubriqueObligatoireItem[]
> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT typeclasse_rubrique_obligatoire_newspd.idTypeClasseRubrique, typeclasse_rubrique_obligatoire_newspd.idOptionTypeClasseRubrique, typeclasse_rubrique_obligatoire_newspd.nombreVersement, typeclasse_rubrique_obligatoire_newspd.montantRubrique, typeclasse_rubrique_obligatoire_newspd.statut, typeclasse_rubrique_obligatoire_newspd.anciennete, typeclasse_rubrique_obligatoire_newspd.genre
        FROM typeclasse_rubrique_obligatoire_newspd;      `;
      const result = await fetchFromMsAccess<
        ISpiderTypeClasseRubriqueObligatoireItem[]
      >(sql, appCnx);
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
export function fetchEcheancierTypeClasseRubriqueObligatoire(): Promise<
  ISpiderEcheancierTypeClasseRubriqueObligatoireItem[]
> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT echeancier_typeclasse_rubrique_obligatoire_newspd.idTypeClasseRubrique, echeancier_typeclasse_rubrique_obligatoire_newspd.libellePeriode, echeancier_typeclasse_rubrique_obligatoire_newspd.dateDebutPeriode, echeancier_typeclasse_rubrique_obligatoire_newspd.dateFinPeriode, echeancier_typeclasse_rubrique_obligatoire_newspd.montantPeriode
        FROM echeancier_typeclasse_rubrique_obligatoire_newspd;`;
      const result = await fetchFromMsAccess<
        ISpiderEcheancierTypeClasseRubriqueObligatoireItem[]
      >(sql, appCnx);
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
export function fetchRubriqueOptionnelGlobal(): Promise<
  ISpiderRubriqueOptionnelGlobalItem[]
> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT rubrique_optionnel_global.idRubriqueOptionnelGlobal, rubrique_optionnel_global.idRubrique, rubrique_optionnel_global.montantRubrique, rubrique_optionnel_global.nombreVersement
      FROM rubrique_optionnel_global`;
      const result = await _selectSql(sql, []);
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
export function fetchEcheancierRubriqueOptionnelGlobal(): Promise<
  ISpiderEcheancierRubriqueOptionnelItem[]
> {
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
export function fetchSouscriptionFraisRubriqueOptionnel(
  eleveIds: number[] | null = null
): Promise<ISpiderSouscriptionFraisRubriqueOptionnelItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT souscription_frais_rubrique_optionnel.idSouscriptionFraisRubriqueOptionnel, souscription_frais_rubrique_optionnel.idEcheancierRubriqueOptionnel,
       souscription_frais_rubrique_optionnel.idEleve, souscription_frais_rubrique_optionnel.personnalise
      FROM souscription_frais_rubrique_optionnel`;
      const sql = eleveIds
        ? `${baseSql} WHERE souscription_frais_rubrique_optionnel.idEleve IN (${eleveIds.join(
          ","
        )})`
        : baseSql;
      const result = await _selectSql(sql, []);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleves pour focus ecole");
      reject(error);
    }
  });
}

/**
 * fetcher les echeancier d'un ou plusieurs eleves
 */
export function fetchEcheancierIndividuel(
  studentIds: number[] | null = null
): Promise<ISpiderEcheancierItem[]> {
  return new Promise<ISpiderEcheancierItem[]>(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab"
      ]);
      const baseSql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab,echeancier.idEleve, echeancier.idRubrique,
       echeancier.periode, echeancier.libelleRubrique AS rubrique, echeancier.montant, echeancier.datelimite, echeancier.description, echeancier.dejaPaye, 
       echeancier.categorieVersement, echeancier.priorite, echeancier.optionnel, echeancier.solde FROM echeancier WHERE echeancier.idEleve IS NOT NULL`;
      const sql = studentIds
        ? `${baseSql} AND idEleve IN (${studentIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<ISpiderEcheancierItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de récupération des écheanciers des frais scolaires");
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
export function fetchIndividualEcheancier(
  studentIds: number[] | null = null
): Promise<ISpiderEcheancierItem[]> {
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
          IIf(IsNull([Brut]),Null,(IIf([NetAPayer] Is Null,0,[NetAPayer]))-(IIf([DejaPaye] Is Null,0,[DejaPaye]))) AS Solde, TypesVersement.Categorie AS categorie, TypesVersement.optionnel
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
      console.log("🚀 ~ file: functions-vba.ts:338 ~ returnnewPromise ~ rubriques", rubriques)

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
      console.log("🚀 ~ file: functions-vba.ts:381 ~ returnnewPromise ~ echeancierPerso", echeancierPerso)

      const paramObj = await paramEtabObjet([
        "Anscol1",
        "DateButoirEcheance",
        "CodeEtab",
      ]);
      const { anscol1, codeetab, datebutoirecheance } = paramObj;
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
          if (stuRubr.NetAPayer !== 0 && stuRubr.NetAPayer !== null) {
            //si le net a payer est positif

            //verifier rubrique presente dans echeancier perso
            const echPerso = echeancierPerso.find(
              (item) =>
                item.ideleve === student.ideleve &&
                item.refTypeVers === stuRubr.refTypeVers
            );

            if (!echPerso) {
              //si rubrique pas presente dans echeancier perso
              //verifier rubrique presente dans echeancier global
              const echGlobal = echeancierGlobal.find(
                (item) =>
                  item.refTypeVers === stuRubr.refTypeVers &&
                  item.statut === student.statut &&
                  item.refTypeClasse === student.refTypeClasse
              );

              if (!echGlobal) {
                //si rubrique pas presente dans echeancier global
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
                const montantReste = !soldeData
                  ? stuRubr.NetAPayer - stuRubr.DejaPaye
                  : soldeData.octobre +
                  soldeData.novembre +
                  soldeData.decembre +
                  soldeData.janvier +
                  soldeData.fevrier +
                  soldeData.mars +
                  soldeData.avril +
                  soldeData.mai +
                  soldeData.juin +
                  soldeData.septembre;

                const montantPaye = montant - montantReste;
                //cas de rubrique non echanlonnée
                result.push({
                  anneeScolaire: anscol1,
                  codeEtab: codeetab,
                  idEleve: student.ideleve,
                  montant: stuRubr.NetAPayer,
                  dejaPaye: montantPaye,
                  datelimite: `${anscol1.split("-")[0]}-09-${pFormat(
                    datebutoirecheance,
                    2
                  )}`,
                  description: `${stuRubr.libelle} rentrée scolaire`,
                  rubrique: stuRubr.libelle,
                  idRubrique: stuRubr.refTypeVers,
                  categorieVersement: stuRubr.categorie,
                  periode: "Rentrée scolaire",
                  priorite: stuRubr.priorite,
                });
              } else {
                // cas écheanchier global défini pour la rubrique
                const resultEchGlobal = echeancierItem(
                  echGlobal,
                  anscol1,
                  codeetab,
                  datebutoirecheance,
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
                anscol1,
                codeetab,
                datebutoirecheance,
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
  anscol1,
  codeetab,
  datebutoirecheance,
  ideleve,
  studentSoldeEch,
  refTypeVers,
  categorieVersement,
  montantDejaPaye,
  montantNetAPaye,
  prioriteRubrique
) => {
  const result = []; // doit contenir le resultat final

  if (studentSoldeEch.length === 0) {
    // si solde echeance de l'eleve pas defini
    const newItem: any = {
      anneeScolaire: anscol1,
      codeEtab: codeetab,
      idEleve: ideleve,
      montant: montantNetAPaye,
      datelimite: `${anscol1.split("-")[0]}-09-${pFormat(
        datebutoirecheance,
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
      priorite: prioriteRubrique,
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
            index + 1 >= 9 ? anscol1.split("-")[0] : anscol1.split("-")[1];
          const newIndex = index + 1;
          const mois = pFormat(newIndex, 2);
          const jour = pFormat(datebutoirecheance, 2);
          const datelimite = `${annee}-${mois}-${jour}`;
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
            anneeScolaire: anscol1,
            codeEtab: codeetab,
            idEleve: ideleve,
            montant,
            datelimite: datelimite,
            rubrique: echeance.libelle
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .toUpperCase(),
            idRubrique: echeance.refTypeVers,
            periode: key,
            dejaPaye: montantPaye,
            description: `${echeance.libelle} ${key}`,
            categorieVersement,
            priorite: prioriteRubrique,
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
        actionsList = "('ENVOYER_ECHEANCIER_INDIVIDUEL')";
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

export const fetchPayments = async (versementIds: number[] | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🚀 ~ file: functions-vba.ts:725 ~ fetchPayments ~ versementIds:", versementIds)
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const baseSql = `
        SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, Versements.RefElève AS idEleve, DetailsVersements.Montant AS montantVersement,
         Versements.RefVersement AS idVersement, UCase([lib_mode_paie]) AS modeVersement,
         TypesVersement.LibelléVers AS rubriqueVersement, Versements.DateVers AS dateVersement 
         FROM tbl_mode_vers_scolarite INNER JOIN ((TypesVersement INNER JOIN (Versements INNER JOIN DetailsVersements ON Versements.RefVersement = DetailsVersements.RefVers) ON TypesVersement.RefTypeVers = DetailsVersements.RefTypeVers) INNER JOIN Elèves ON Versements.RefElève = Elèves.RefElève) ON tbl_mode_vers_scolarite.id_mode_paie = Versements.ModePaie
     `;
      const sql = versementIds
        ? `${baseSql} WHERE Versements.RefVersement IN (${versementIds.join(",")})`
        : baseSql;
      console.log("🚀 ~ file: functions-vba.ts:739 ~ returnnewPromise ~ sql:", sql)
      const result = await fetchFromMsAccess<IFocusEcolePaymentItem[]>(
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
 * fetcher les details de versement pour une rubrique obligatoire
 * @param versementIds
 * @returns
 */
export const fetchDetailsVersementRubriqueObligatoire = async (
  versementIds: number[] | null
): Promise<ISpiderDetailsVersementRubriqueObligatoireItem[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT details_versement_rubrique_obligatoire_newspd.idVersement, details_versement_rubrique_obligatoire_newspd.idRubrique, details_versement_rubrique_obligatoire_newspd.montant
      FROM details_versement_rubrique_obligatoire_newspd`;
      const sql = versementIds
        ? `${baseSql} WHERE details_versement_rubrique_obligatoire_newspd.idVersement IN (${versementIds.join(
          ","
        )})`
        : baseSql;
      const result = await fetchFromMsAccess<
        ISpiderDetailsVersementRubriqueObligatoireItem[]
      >(sql, appCnx);
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
export const fetchDetailsVersementRubriqueOptionnel = async (
  versementIds: number[] | null
): Promise<ISpiderDetailsVersementRubriqueOptionnelItem[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT details_versement_rubrique_obligatoire_newspd.idVersement, details_versement_rubrique_obligatoire_newspd.idRubrique, details_versement_rubrique_obligatoire_newspd.montant
      FROM details_versement_rubrique_obligatoire_newspd`;
      const sql = versementIds
        ? `${baseSql} WHERE details_versement_rubrique_obligatoire_newspd.idVersement IN (${versementIds.join(
          ","
        )})`
        : baseSql;
      const result = await fetchFromMsAccess<
        ISpiderDetailsVersementRubriqueOptionnelItem[]
      >(sql, appCnx);
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
export const fetchTypeClasses = async (): Promise<
  ISpiderClassseMatiereProf[]
> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT TypesClasses.RefTypeClasse AS idTypeClasse, Niveaux.NiveauCourt AS libelleTypeClasseCourt, Niveaux.NiveauLong AS libelleTypeClasseLong, Niveaux.Cycle AS Cycle, TypesClasses.Série AS Serie
FROM TypesClasses INNER JOIN Niveaux ON TypesClasses.Niveau = Niveaux.RefNiveau;`;
      const result = await fetchFromMsAccess<ISpiderClassseMatiereProf[]>(
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
 * Obtenir la liste des profs par classe et par matiere
 * @returns
 */
export const fetchClassesMatieresProfs = async (
  classeIds: number[] | null = null
): Promise<ISpiderClassseMatiereProf[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const baseSql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, classe_matieres_prof_eval.refClasse AS idClasse, classe_matieres_prof_eval.refPers AS idPersonnel,
       IIf([idSousMatiere] Is Null,[idMatiere],[idSousMatiere]) AS idSousMatiereOuMatiere,classe_matieres_prof_eval.refTypeClasse AS idTypeClasse, classe_matieres_prof_eval.refMat AS idMatiere,
        classe_matieres_prof_eval.classeCourt AS libelleClasseCourt,Classes.classeLong AS libelleClasseLong,  classe_matieres_prof_eval.ordreClasse AS ordreClasse, classe_matieres_prof_eval.matCourt AS libelleMatiereCourt,
         classe_matieres_prof_eval.matLong AS libelleMatiereLong, classe_matieres_prof_eval.nomPers AS nomPersonnel, classe_matieres_prof_eval.idSousMatiere, classe_matieres_prof_eval.libelleSousMatiereCourt, classe_matieres_prof_eval.libelleSousMatiereLong,
         classe_matieres_prof_eval.coefMatiere, classe_matieres_prof_eval.coefSousMatiere
      FROM classe_matieres_prof_eval INNER JOIN Classes ON classe_matieres_prof_eval.refClasse = Classes.RefClasse
      WHERE (((classe_matieres_prof_eval.refPers) Is Not Null));`;
      const sql = classeIds
        ? `${baseSql} AND classe_matieres_prof_eval.refClasse IN (${classeIds.join(
          ","
        )})`
        : baseSql;

      const result = await fetchFromMsAccess<ISpiderClassseMatiereProf[]>(
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
 * recupperer le planning d'une ou plusieurs classes
 */
export function fecthPlannig(
  classeIds: number[] | null = null
): Promise<ISpiderPlanning[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const baseSql = `SELECT DISTINCT horaire_plage_modele.RefHoraire AS idHoraire, classe_matieres_prof_eval.refClasse AS idClasse, classe_matieres_prof_eval.refMat AS idMatiere,
            Personnel.RefPersonnel AS idPersonnel, Seances.RefSeance AS idSeance, classe_matieres_prof_eval.ClasseCourt AS libelleClasseCourt,  horaire_plage_modele.Horaire AS libelleHoraire,
            classe_matieres_prof_eval.matCourt AS libelleMatiereCourt, classe_matieres_prof_eval.matLong AS libelleMatiereLong,
            Personnel.NomPers AS nomPersonnel, Personnel.PrénomPers AS prenomPersonnel, horaire_plage_modele.PlageHoraire AS plageHoraire,
            Personnel.Sexe AS sexePersonnel, Salles.NomSalle AS libelleSalle, Salles.RefSalle AS idSalle,"${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab
            FROM (((Seances LEFT JOIN Personnel ON Seances.RefPers = Personnel.RefPersonnel) LEFT JOIN Salles ON Seances.RefSalle = Salles.RefSalle)
            INNER JOIN classe_matieres_prof_eval ON (Seances.RefPers = classe_matieres_prof_eval.refPers) AND (Seances.RefClasse = classe_matieres_prof_eval.refClasse)
            AND (Seances.RefMatière = classe_matieres_prof_eval.refMat)) INNER JOIN horaire_plage_modele
            ON (Seances.idModelePlageHoraire = horaire_plage_modele.idModelePlageHoraire) AND (Seances.RefHoraire = horaire_plage_modele.RefHoraire)`;
      const sql = classeIds
        ? `${baseSql} WHERE classe_matieres_prof_eval.refClasse IN (${classeIds.join(
          ","
        )})`
        : baseSql;
      const result = await fetchFromMsAccess<ISpiderPlanning[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation paiements pour gain technologie"
      );
      reject(error);
    }
  });
}

/**
 * recuuper les horaires
 * @returns
 */
export function fecthHoraires(): Promise<ISpiderHoraireItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const sql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, Horaires.RefHoraire AS idHoraire, Horaires.Horaire AS libelleHoraire FROM Horaires;`;
      const result = await fetchFromMsAccess<ISpiderHoraireItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation paiements pour gain technologie"
      );
      reject(error);
    }
  });
}

export function fecthHoraires_old(): Promise<ISpiderHoraireItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const sql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, Horaires.RefHoraire AS idHoraire, Horaires.Horaire AS libelleHoraire, Horaires.PlageHoraire AS plageHoraire FROM Horaires;`;
      const result = await fetchFromMsAccess<ISpiderHoraireItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation paiements pour gain technologie"
      );
      reject(error);
    }
  });
}

/**
 * recupperer les plage horaire
 * @returns
 */
export function fecthPlageHoraires(): Promise<ISpiderPlageHoraireItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT PlagesHoraires.Chrono AS chrono, PlagesHoraires.Utilisation AS utilisation, PlagesHoraires.Debut AS debut, PlagesHoraires.Fin AS fin
      FROM modelePlagesHoraires;`;
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
}

/**
 * recupperer les modeles plages horaires
 * @returns
 */
export function fecthModelePlageHoraires(): Promise<ISpiderPlageHoraireItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const sql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, modelePlagesHoraires.idModelePlageHoraire, modelePlagesHoraires.libelleModelePlageHoraire, modelePlagesHoraires.descriptionModelePlageHoraire FROM PlagesHoraires;`;
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
}

/**
 * recupper les données sur un ou plusieurs memebre du ersonnel
 * @param personnelIds
 * @returns
 */
export function fecthPersonnel(
  personnelIds: number[] | null = null
): Promise<ISpiderPersonnelItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab"]);

      const baseSql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, "" AS whatsApp, "" AS email, Personnel.RefPersonnel AS idPersonnel,
       Personnel.NomPers AS nomPersonnel, Personnel.PrénomPers AS prenomPersonnel, Fonction.Fonction AS fonction, Personnel.Matricule AS matriculePersonnel,
        Personnel.Sexe AS sexe, Personnel.TélPers AS phone1, Personnel.CelPers AS phone2, Personnel.DateNaiss AS dateNaissance, Personnel.LieuNaiss AS lieuNaissance,
         Diplomes.NomDiplome AS libelleDiplome, Personnel.Quartier AS residence, Personnel.SitMatr AS situationMatrimoniale, Personnel.DateEmbauche AS dateEmbauche,
          Personnel.N°CNPS AS numeroCnps, Personnel.NbEnfants AS nombreEnfant, Personnel.Corps AS corpsMetier, Personnel.RefMatière AS specialite
      FROM ((Personnel LEFT JOIN Fonction ON Personnel.Fonction = Fonction.RefFonction) LEFT JOIN Diplomes ON Personnel.RefDiplome = Diplomes.RefDiplome) LEFT JOIN Matières ON Personnel.RefMatière = Matières.RefMatière`;
      const sql = personnelIds
        ? `${baseSql} WHERE Personnel.RefPersonnel IN (${personnelIds.join(
          ","
        )})`
        : baseSql;

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
}

/**
 * recuperer les notes d'une ou plusieurs evalutions
 * @param evalId ids des notes evaluations
 * @returns
 */
export function fecthEvaluationNotes(
  evalIds: number[] | null = null
): Promise<ISpiderEvaluationNoteItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      // const fields_list = "anneeScolaire,codeEtab,idEvaluationProgrammation,idEleve,noteEvaluation,operateurSaisie,operateurModification,dateSaisie,dateModification,recup,device";

      const paramObj = await paramEtabObjet(["Anscol1", "CodeEtab"]);
      const { anscol1, codeetab } = paramObj;
      const baseSql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, tb_eval_note.idEval AS idEvaluationProgrammation, tb_eval_note.refEleve AS idEleve,
                tb_eval_note.noteEval AS noteEvaluation,tb_eval_note.opSaisie AS operateurSaisie,tb_eval_note.opModif AS operateurModification,tb_eval_note.dateSaisie AS dateSaisie,
                tb_eval_note.dateModif AS dateModification, tb_eval_note.recup, tb_eval_note.device AS device
                FROM tb_eval_note INNER JOIN tb_eval_prog ON tb_eval_note.idEval = tb_eval_prog.idEval`;
      const sql = evalIds
        ? `${baseSql} WHERE tb_eval_note.idEval IN ('${evalIds.join("','")}')`
        : baseSql;

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
}

/**
 * fetcher la programtion des evalutions
 * @param evalIds
 * @returns
 */
export function fecthEvalProg(
  evalIds: number[] | null = null
): Promise<ISpiderEvaluationProgrammationItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const baseSql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, tb_eval_prog.idEval AS idEvaluationProgrammation, tb_eval_prog.refClasse AS idClasse, tb_eval_prog.refMat AS idMatiere,
       tb_eval_prog.periodeEval AS periodeEvaluation, tb_eval_prog.numEval AS numeroEvaluation, tb_eval_prog.coefEval AS coefficientEvaluation,
        tb_eval_prog.dateCompo AS dateComposition, tb_eval_prog.typeEval AS typeEvaluation FROM tb_eval_prog`;
      const sql = evalIds
        ? `${baseSql} WHERE tb_eval_prog.idEval IN (${evalIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<
        ISpiderEvaluationProgrammationItem[]
      >(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch programtion evaluation ");
      reject(error);
    }
  });
}

/**
 * recupper les données sur une ou plusieurs matieres
 * @param matieresIds
 * @returns
 */
export function fecthMatieres(
  matieresIds: number[] | null = null
): Promise<ISpiderMatiereItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const baseSql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, Matières.RefMatière AS idMatiere, Matières.MatCourt AS libelleMatiereCourt, Matières.MatLong AS libelleMatiereLong, Matières.MatAbrég AS libelleMatiereAbreger, 
      Matières.Ordre AS ordreMatiere, Matières.CouleurMatière AS couleurMatiere, Matières.Gen AS [general], Matières.Bilan AS bilan
      FROM Matières`;
      const sql = matieresIds
        ? `${baseSql} WHERE Matières.RefMatière IN (${matieresIds.join(",")})`
        : baseSql;
      console.log(
        "🚀 ~ file: functions.ts ~ line 636 ~ returnnewPromise ~ sql",
        sql
      );
      const result = await fetchFromMsAccess<ISpiderMatiereItem[]>(sql, appCnx);
      console.log("🚀 ~ file: functions-vba.ts:1106 ~ returnnewPromise ~ result:", result.length)

      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch matieres");
      reject(error);
    }
  });
}

/**
 * recupperer les salles definit dans spider
 * @param roomIds
 * @returns
 */
export function fecthSalles(
  roomIds: number[] | null = null
): Promise<ISpiderSalleItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT Salles.RefSalle AS idSalle, Salles.NomSalle AS libelleSalle, Salles.typeSalle AS typeSalle, Salles.CapaciteSalle AS capaciteSalle,
       Salles.ordreSalle AS ordreSalle FROM Salles`;
      const sql = roomIds
        ? `${baseSql} WHERE Salles.RefSalle IN (${roomIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<ISpiderSalleItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch salles");
      reject(error);
    }
  });
}

/**
 * fetcher les seances programmées dans spider
 * @returns
 */
export function fecthSeances(
  seanceIds: number[] | null = null
): Promise<ISpiderSeanceItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const baseSql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, Seances.RefSeance AS idSeance, Seances.RefSalle AS idSalle, 
            Seances.RefPers AS idPersonnel, Seances.RefMatière AS idMatiere, Seances.RefClasse AS idClasse, Seances.RefHoraire AS idHoraire,
            Seances.obs AS observation,Seances.idModelePlageHoraire
      FROM Seances WHERE RefPers IS NOT NULL AND RefClasse IS NOT NULL AND RefHoraire IS NOT NULL AND RefMatière IS NOT NULL`;
      const sql = seanceIds
        ? `${baseSql} AND Seances.RefSeance IN (${seanceIds.join(",")})`
        : baseSql;

      console.log(
        "🚀 ~ file: functions-vba.ts ~ line 931 ~ returnnewPromise ~ sql",
        sql
      );
      const result = await fetchFromMsAccess<ISpiderSeanceItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation seances");
      reject(error);
    }
  });
}

/**
 * fetcher les groupes rubriques dans spider
 * @returns
 */
export function fecthGroupeRubriques(): Promise<ISpiderGroupeRubriqueItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT groupe_rubrique.idGroupeRubrique, groupe_rubrique.libelleGroupeRubrique, groupe_rubrique.descriptionGroupeRubrique, groupe_rubrique.idCategorieGroupeRubrique
      FROM groupe_rubrique;`;
      const result = await fetchFromMsAccess<ISpiderGroupeRubriqueItem[]>(
        sql,
        appCnx
      );
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation seances");
      reject(error);
    }
  });
}

/**
 * fetcher les rubriques defini dans spider
 * @returns
 */
export function fecthRubriques(
  rubriqueIds: number[] | null = null
): Promise<ISpiderRubriqueItem[]> {
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
      Logger.error("Erreur lors de recuperation rubriques");
      reject(error);
    }
  });
}

/**
 * Fetcher tous les rubriques qu'un ou plusieurs ont personnalisé (le rythme de paiement / versement ...)
 * @param eleveIds
 * @returns
 */
export function fetchEleveRubrique(
  eleveIds: number[] | null = null
): Promise<ISpiderEleveRubriqueItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT eleve_rubrique_newspd.idEleveRubrique, eleve_rubrique_newspd.idEleve, eleve_rubrique_newspd.idRubrique, eleve_rubrique_newspd.nombreVersement, eleve_rubrique_newspd.montantRubrique
      FROM eleve_rubrique_newspd`;
      const sql = eleveIds
        ? `${baseSql} WHERE eleve_rubrique_newspd.idEleve IN (${eleveIds.join(
          ","
        )})`
        : baseSql;
      const result = await fetchFromMsAccess<ISpiderEleveRubriqueItem[]>(
        sql,
        appCnx
      );
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
export function fetchEcheancierPersonnelEleveRubrique(
  idEleveRubrique: number[] | null = null
): Promise<ISpiderEcheancierPersonnelEleveRubriqueItem[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT echeancier_personnel_eleve_rubrique_newspd.idEcheancierRubriquePersonnel, echeancier_personnel_eleve_rubrique_newspd.idEleveRubrique, 
      echeancier_personnel_eleve_rubrique_newspd.libellePeriode, echeancier_personnel_eleve_rubrique_newspd.dateDebutPeriode,
       echeancier_personnel_eleve_rubrique_newspd.dateFinPeriode, echeancier_personnel_eleve_rubrique_newspd.montantPeriode
      FROM echeancier_personnel_eleve_rubrique_newspd`;
      const sql = baseSql;
      // ? `${baseSql} WHERE echeancier_personnel_eleve_rubrique_newspd.idEleveRubrique.idEleve IN ("${idEleveRubrique.join(`","`)}")`
      // : baseSql;
      console.log(
        "🚀 ~ file: functions.ts ~ line 1023 ~ returnnewPromise ~ sql",
        sql
      );
      const result = await fetchFromMsAccess<
        ISpiderEcheancierPersonnelEleveRubriqueItem[]
      >(sql, appCnx);
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
      const result = await fetchFromMsAccess<ISpiderRubriqueItem[]>(
        sql,
        appCnx
      );
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation seances");
      reject(error);
    }
  });
}
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

/**
 * recuperer toutes les classes matières prof du general
 * @returns 
 */
export function fetchClassesMatieresProfsGeneral(): Promise<IClassesMatieresProfsGeneral[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT classe_matieres_prof_eval.refClasse,classe_matieres_prof_eval.refMat AS idMatiere ,classe_matieres_prof_eval.refTypeClasse,
      classe_matieres_prof_eval.matLong, 
      IIf(libelleSousMatiereCourt Is Null,matCourt,libelleSousMatiereCourt) AS matCourt,
      IIf(idSousMatiere Is Null,null,refMat) AS idMatiereParent
      FROM classe_matieres_prof_eval
      WHERE (((classe_matieres_prof_eval.refTypeClasse)<14));
      `;

      const result = await fetchFromMsAccess<IClassesMatieresProfsGeneral[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch salles");
      reject(error);
    }
  });
}



/**
 * recuperer toutes les t_notes du general
 *  @param periodeEval 
 * @returns 
 */
export function fetchTNotesGeneral(periodeEval: number): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT T_Notes.RefElève AS idEleve, T_Notes.RefTypeClasse, T_Notes.RefClasse, T_Notes.CF1, T_Notes.OG1, 
      T_Notes.EO1, T_Notes.FR1, T_Notes.PHILO1, T_Notes.HG1, T_Notes.AN1, T_Notes.LV21, T_Notes.MATH1, T_Notes.SP1, T_Notes.SVT1,
       T_Notes.EPS1, T_Notes.APMUS1, T_Notes.ECM1, T_Notes.COND1, T_Notes.MOYG1, T_Notes.MCA1, T_Notes.MCB1, T_Notes.Info1,
        ${periodeEval < 4 ? "T_Notes.TM1," : ""} T_Notes.MCC1, T_Notes.MCD1, Elèves.LV2, Elèves.Arts, Classes.LV2 AS classeLV2,
         Classes.Arts AS classeArts, T_Notes.CoefFR1,T_Notes.CoefPHILO1, T_Notes.CoefHG1, T_Notes.CoefAN1, T_Notes.CoefLV21,
          T_Notes.CoefMATH1, T_Notes.CoefSP1, T_Notes.CoefSVT1,T_Notes.CoefEPS1, T_Notes.CoefAPMUS1, T_Notes.CoefECM1, T_Notes.CoefCOND1
      FROM (T_Notes INNER JOIN Elèves ON T_Notes.RefElève = Elèves.RefElève) INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse;
      `.replace(/1/g, periodeEval.toString());
      const result = await fetchFromMsAccess<any[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      console.log("🚀 ~ file: functions-vba.ts:1430 ~ returnnewPromise ~ error:", error)
      Logger.error("Erreur lors de fetch salles");
      reject(error);
    }
  });
}


/**
 * recuperer les notes du general
 * @param periodeEval 
 * @returns 
 */
export function fetchNotesGeneral(periodeEval: number): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT Notes.RefElève AS idEleve, Notes.RangCF1, Notes.RangOG1, Notes.RangEO1, Notes.RangFR1, Notes.RangPHILO1, Notes.RangHG1,
       Notes.RangAN1, Notes.RangLV21, Notes.RangMATH1, Notes.RangSP1, Notes.RangSVT1, Notes.RangEPS1, Notes.RangAPMUS1,
        Notes.RangECM1, Notes.RangMCA1, Notes.RangMCB1, Notes.RangInfo1, Notes.RangMCC1, Notes.RangMCD1, Notes.RangG1
      FROM Notes;            
      `.replace(/1/g, periodeEval.toString());
      const result = await fetchFromMsAccess<any[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch salles");
      reject(error);
    }
  });
}


/**
 * liste des notes obtenues  suivant les matieres 
 * @returns 
 */
export function compoMatieresNotes(compoIds: string[]): Promise<ICompoMatieresNotes[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab",]);

      const sql = `SELECT 
      "${anscol1}" AS anneeScolaire,
      "${codeetab}" AS codeEtab,
      tbl_eval_prim.id_compo AS idCompo, 
      tbl_eval_prim.RefElève AS idEleve, 
      tbl_eval_prim.Note AS [note], 
      tbl_eval_prim.Rang AS rang, 
  tbl_matiere_prim.Lib_mat_long AS libelleMatiere,
      IIf(
          tbl_compo_matieres_prim.RefSousMatiere Is Null, 
          tbl_compo_matieres_prim.RefMatiere, 
          tbl_compo_matieres_prim.RefSousMatiere
      ) AS idMatiere, 
      IIf(
          tbl_compo_matieres_prim.RefSousMatiere Is Null,
          tbl_compo_matieres_prim.MatiereNoteSur,
          tbl_compo_matieres_prim.SousMatiereNoteSur
      ) AS matiereNoteSur, 
      IIf(
          tbl_compo_matieres_prim.RefSousMatiere Is Null,
          Null,
          tbl_compo_matieres_prim.RefMatiere
      ) AS idMatiereParent, 
      IIf(
          tbl_compo_matieres_prim.RefSousMatiere Is Null,
          Null,
          tbl_compo_matieres_prim.MatiereNoteSur
      ) AS matiereParentNoteSur
  FROM 
      (tbl_matiere_prim 
      INNER JOIN tbl_eval_prim ON tbl_matiere_prim.RefMatiere = tbl_eval_prim.RefMatiere)
      INNER JOIN tbl_compo_matieres_prim ON tbl_eval_prim.id_compo = tbl_compo_matieres_prim.id_compo 
          AND tbl_eval_prim.RefMatiere = IIf(tbl_compo_matieres_prim.RefSousMatiere Is Null, tbl_compo_matieres_prim.RefMatiere, tbl_compo_matieres_prim.RefSousMatiere)
          WHERE  tbl_eval_prim.id_compo IN ("${compoIds.join('","')}")
      `;

      const result = await fetchFromMsAccess<ICompoMatieresNotes[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch salles");
      reject(error);
    }
  });
}

/**
 * liste des moyennes obtenu suivant les compositons
 * @returns 
 */
export function compoMoyennes(compoIds: string[]): Promise<ICompoMoyennes[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet(["Anscol1", "CodeEtab",]);
      const sql = `SELECT "${anscol1}" AS anneeScolaire, "${codeetab}" AS codeEtab, tbl_compo_prim.id_compo AS idCompo,
      tbl_compo_prim.LibCompo AS libelle,tbl_compo_prim.CompoOficiel AS compoOfficiel, tbl_moy_prim.Moy AS moyenne,
      tbl_moy_prim.Rang AS rang, tbl_compo_prim.moy_sur AS moyenneSur, 
      tbl_compo_prim.date_compo AS dateCompo, 
      tbl_moy_prim.RefElève AS idEleve,tbl_compo_prim.Comptabilise AS comptabilise
      FROM tbl_compo_prim INNER JOIN tbl_moy_prim ON tbl_compo_prim.id_compo = tbl_moy_prim.id_compo
      WHERE tbl_compo_prim.id_compo IN ("${compoIds.join('","')}") AND tbl_compo_prim.LibCompo IS NOT NULL;`;
      const result = await fetchFromMsAccess<ICompoMoyennes[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch salles");
      reject(error);
    }
  });
}

/**
 * liste des moyennes obtenu suivant les compositons
 * @returns 
 */
export function getListeCompoPrimaire(): Promise<IListeCompoPrimaire[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT tbl_compo_prim.id_compo AS idCompo, tbl_compo_prim.LibCompo AS libelle, iif(tbl_compo_prim.date_compo is null,"", tbl_compo_prim.date_compo) AS dateCompo,
       tbl_compo_prim.CompoOficiel AS compoOfficiel, tbl_compo_prim.moy_sur, tbl_compo_prim.Comptabilise AS comptabilise,tbl_compo_prim.RefTypeClasse AS typeClasse
      FROM tbl_compo_prim
      WHERE tbl_compo_prim.LibCompo IS NOT NULL;`;
      const result = await fetchFromMsAccess<IListeCompoPrimaire[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Recupperer les moyennes des matieres pour les eleves du technique pour une periode donnée
 * @param periodeEval 
 * @returns 
 */
export function getMoyennesMatieresTechnique(periodeEval: number) {
  return new Promise<IMoyenneMatiere[]>(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);

      const sql = `SELECT "${anscol1}" AS anneeScolaire,"${codeetab}" AS codeEtab, Moyennes.ValMoy AS moyenne,
       Moyennes.RefElève AS idEleve, classe_matieres_prof_eval.refMat AS idMatiere,
       Moyennes.Rang AS rang, Moyennes.RefPeriode AS periode, IIf(idSousMatiere Is Null,Null,refMat) AS idMatiereParent
      FROM Moyennes INNER JOIN (classe_matieres_prof_eval INNER JOIN promotion_Matiere_Module ON (classe_matieres_prof_eval.refMat = promotion_Matiere_Module.RefPromModMat) AND (classe_matieres_prof_eval.refTypeClasse = promotion_Matiere_Module.RefTypeClasse)) ON Moyennes.RefPromModMat = promotion_Matiere_Module.RefPromModMat
      WHERE Moyennes.RefPeriode = ${periodeEval};
      `;
      const result = await fetchFromMsAccess<IMoyenneMatiere[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch salles");
      reject(error);
    }
  });
}

/**
 * Recupperer les moyennes generales pour les eleves du technique pour une periode donnée
 * @param periodeEval 
 * @returns 
 */
export function getMoyennesGeneralesTechnique(periodeEval: number): Promise<any> {
  return new Promise<IMoyenneGeneral[]>(async (resolve, reject) => {
    try {
      const { anscol1, codeetab } = await paramEtabObjet([
        "Anscol1",
        "CodeEtab",
      ]);
      const sql = `SELECT 
       T_NotesTech.RefElève AS idEleve, T_NotesTech.MOYG_1 AS moyenne, T_NotesTech.RangG_1 AS rang
      FROM T_NotesTech;
      `.replace(/1/g, periodeEval.toString());
      const result = await fetchFromMsAccess<IMoyenneGeneral[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de fetch salles");
      reject(error);
    }
  });
}

export default {
  fetchClasses,
  setFocusEcoleHistoric,
  fetchStudents,
  fetchEcheancierIndividuel,
  setFocusEcoleLogsGroupActionSuccess,
  fetchPayments,
  fetchLogs,
  fetchClassesMatieresProfs,
  fecthHoraires,
  fecthPlageHoraires,
  fecthModelePlageHoraires,
  fecthEvaluationNotes,
  fecthEvalProg,
  fecthSalles,
  fecthPersonnel,
  fecthMatieres,
  fecthSeances,
  fecthGroupeRubriques,
  fecthRubriques,
  fecthLibelleEcheances,
  fetchSouscriptionFraisRubriqueOptionnel, // Fetcher les souscription rubrique optionnnel effectué par un ou plusieur eleve
  fetchEleveRubrique, //Fetcher tous les rubriques qu'un ou plusieurs ont personnalisé (le rythme de paiement / versement ...)
  fetchEcheancierPersonnelEleveRubrique, //fetcher les echeances de un ou  plusieurs rubrique personnalisé  pour un ou plusieur eleves (eleve rubrique)*
  fetchRubriqueOptionnelGlobal, //Fetcher les rubriques optionnel global defini dans spider
  fetchEcheancierRubriqueOptionnelGlobal, //Fetcher l'echeancier global des rubriques optionnel defini dans spider
  fetchOptionTypeClasseRubriqueObligatoire, //Fetcher les options des rubliques obigatoires
  fetchTypeClasseRubriqueObligatoire, // fetcher les rubriques obligatoires definit suivant les types classes
  fetchEcheancierTypeClasseRubriqueObligatoire, // fetcher les echeances des rubriques obligatoires
  fetchDetailsVersementRubriqueObligatoire, //fetcher les details de versement pour une rubrique obligatoire
  fetchDetailsVersementRubriqueOptionnel, // fetcher les details de versement pour une rubrique obligatoire
  subscriptionOptionnalRubric, //souscrire a une ou plusieurs rubrique optionnelle
  fetchTypeClasses, // fetcher tous les types classes,
  fecthPlannig,
  fetchParents,
  fetchClassesMatieresProfsGeneral,
  fetchTNotesGeneral,
  fetchNotesGeneral,
  compoMatieresNotes,
  compoMoyennes,
  getListeCompoPrimaire,
  getMoyennesMatieresTechnique,
  getMoyennesGeneralesTechnique
};
