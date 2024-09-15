import {
  appCnx,
  fetchFromMsAccess,
  paramEtabObjet,
} from "../../databases/accessDB";
import Logger from "../../helpers/logger";
import {
  IGainPaymentItem,
  IGainStudentItem,
  ISpiderEcheancierGlobalItem,
  IGainEcheancierGlobalItem,
  ITypeEcheancier,
  ISpiderEcheancierPersoItem,
  IGainLogItem,
  IGainClassItem
} from "./interface";
import { pFormat } from "../../helpers/function";
import { _executeSql, _selectSql } from "../../databases/index";
import redisFunctions from "../../databases/redis/functions";


export function fetchEleves<IGainStudentItem>(
  studentIds: number[] | null = null
): Promise<IGainStudentItem> {
  return new Promise(async (resolve, reject) => {
    try {
      const matricOrMatricProv = await redisFunctions.getGlobalVariable("matricOrMatricProv");

      const baseSql = `SELECT DISTINCT Elèves.RefElève AS ideleve, Elèves.nomElève AS nomfamille, Elèves.prénomElève AS prenoms,
      IIf([Elèves].[statutElève]=1,"AFF","NAFF") AS statut, IIf([Elèves].[sexe]=2,"F","M") AS sexe,
      Niveau_DPES.Niveau_Dpes as niveau, [classes].[RefClasse] AS idclasse,
      ${matricOrMatricProv}, DateNaiss AS datenaissance,
      Elèves.LieuNaiss AS lieunaissance, IIf(Elèves.TélTuteur is null,"0000000000",Elèves.TélTuteur) AS mobile, IIf([Elèves].[Redoub]=Yes,"OUI","NON") AS redoublant,
      0 AS scolarite
      FROM Niveau_DPES INNER JOIN (Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON Niveau_DPES.RefTypeClasse = Classes.RefTypeClasse
      WHERE Elèves.inscrit = yes
      `;

      const sql = studentIds
        ? `${baseSql} AND Elèves.RefElève IN (${studentIds.join(",")})`
        : baseSql;

      const result = await fetchFromMsAccess<IGainStudentItem>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleves pour gain technologie");
      reject(error);
    }
  });
}

const fetchPaiements = async (versementIds: number[] | null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT CStr([Versements].[RefElève]) AS ideleve, DetailsVersements.Montant AS montant, CStr([RefVersement]) AS numeropiece, UCase(Mid([lib_mode_paie],1,3)) AS modepaiement, TypesVersement.LibelléVers AS libelle
      FROM (tbl_mode_paie INNER JOIN (TypesVersement INNER JOIN (Versements INNER JOIN DetailsVersements ON Versements.RefVersement = DetailsVersements.RefVers) ON TypesVersement.RefTypeVers = DetailsVersements.RefTypeVers) ON tbl_mode_paie.id_mode_paie = Versements.ModePaie) INNER JOIN Elèves ON Versements.RefElève = Elèves.RefElève`;

      const sql = versementIds
        ? `${baseSql} WHERE Versements.RefVersement IN (${versementIds.join(
            ","
          )})`
        : baseSql;

      const result = await fetchFromMsAccess<IGainPaymentItem[]>(sql, appCnx);
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
 * fetch les paiements d'un ou plusieurs eleves
 * @param refEleves 
 * @returns 
 */
export const fetchPaiementEleves = async (refEleves: number[] | null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT CStr([Versements].[RefElève]) AS ideleve, DetailsVersements.Montant AS montant, CStr([RefVersement]) AS numeropiece, UCase(Mid([lib_mode_paie],1,3)) AS modepaiement, TypesVersement.LibelléVers AS libelle
      FROM (tbl_mode_paie INNER JOIN (TypesVersement INNER JOIN (Versements INNER JOIN DetailsVersements ON Versements.RefVersement = DetailsVersements.RefVers) ON TypesVersement.RefTypeVers = DetailsVersements.RefTypeVers) ON tbl_mode_paie.id_mode_paie = Versements.ModePaie) INNER JOIN Elèves ON Versements.RefElève = Elèves.RefElève`;
      const sql = refEleves
        ? `${baseSql} WHERE Versements.RefElève IN (${refEleves.join(
            ","
          )})`
        : baseSql;
      const result = await fetchFromMsAccess<IGainPaymentItem[]>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error(
        "Erreur lors de recuperation paiements pour gain technologie"
      );
      reject(error);
    }
  });
};

export function fetchClasses<IGainClassItem>(
  classeIds: number[] | null = null
): Promise<IGainClassItem> {
  return new Promise(async (resolve, reject) => {
    try {
      const baseSql = `SELECT CStr(Classes.RefClasse) AS idclasse, Classes.ClasseCourt AS nom, 
      UCase([NiveauCourt] & [Série]) AS branche, NiveauSerie.NiveauCourt AS niveau, 
      NiveauSerie.Série AS serie, Classes.LV2 AS lv2, "" AS salle, iif (Eff_Max is null, 50, Eff_Max ) as effectiflimite
      FROM NiveauSerie INNER JOIN Classes ON NiveauSerie.RefTypeClasse = Classes.RefTypeClasse`;
      const sql = classeIds
        ? `${baseSql} WHERE Classes.RefClasse IN (${classeIds.join(",")})`
        : baseSql;
      const result = await fetchFromMsAccess<IGainClassItem>(sql, appCnx);
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation classes pour gain technologie");
      reject(error);
    }
  });
}

const fetchEcheanciers = async (
  type: ITypeEcheancier["type"],
  elevesIds: number[] | null = null
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = "";
      if (type === "global") {
        sql = `SELECT UCase([NiveauCourt] & [Série]) AS branche, IIf([EcheancierGlobal].[statut]=1,"AFF","NAFF") AS statut,
        EcheancierGlobal.Octobre AS octobre, EcheancierGlobal.Novembre AS novembre, EcheancierGlobal.Décembre AS decembre,
         EcheancierGlobal.Janvier AS janvier, EcheancierGlobal.Février AS fevrier, EcheancierGlobal.Mars AS mars,
          EcheancierGlobal.Avril AS avril, EcheancierGlobal.Mai AS mai, EcheancierGlobal.Juin AS juin,
           EcheancierGlobal.Septembre AS septembre, TypesVersement.LibelléVers AS libelle
 FROM (TypesVersement INNER JOIN EcheancierGlobal ON TypesVersement.RefTypeVers = EcheancierGlobal.RefTypeVers) 
   INNER JOIN NiveauSerie ON EcheancierGlobal.RefTypeClasse = NiveauSerie.RefTypeClasse`;
      } else {
        const baseSql = `SELECT cstr(EcheancierPerso.RefElève) AS ideleve, EcheancierPerso.Octobre AS octobre, EcheancierPerso.Novembre AS novembre,
        EcheancierPerso.Décembre AS decembre, EcheancierPerso.Janvier AS janvier, EcheancierPerso.Février AS fevrier, EcheancierPerso.Mars AS mars,
         EcheancierPerso.Avril AS avril, EcheancierPerso.Mai AS mai, EcheancierPerso.Juin AS juin, EcheancierPerso.Septembre AS septembre, TypesVersement.LibelléVers AS libelle
       FROM TypesVersement INNER JOIN EcheancierPerso ON TypesVersement.RefTypeVers = EcheancierPerso.RefTypeVers`;

        sql = elevesIds
          ? `${baseSql} WHERE EcheancierPerso.RefElève IN (${elevesIds.join(
              ","
            )})`
          : baseSql;
      }

      const echeances =
        type === "global"
          ? await fetchFromMsAccess<ISpiderEcheancierGlobalItem[]>(sql, appCnx)
          : await fetchFromMsAccess<ISpiderEcheancierPersoItem[]>(sql, appCnx);

      const paramEtab = await paramEtabObjet(["Anscol1", "DateButoirEcheance"]);
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

      const result = [];
      echeances.map((item: any) => {
        Object.keys(item).map((key) => {
          const index: number = months.indexOf(key);
          if (index !== -1) {
            if (item[key] !== null) {
              const annee =
                index + 1 >= 9
                  ? paramEtab.anscol1.split("-")[0]
                  : paramEtab.anscol1.split("-")[1];
              const newIndex = index + 1;

              const mois = pFormat(newIndex, 2);
              const jour = pFormat(paramEtab.datebutoirecheance, 2);
              const dateLimit = `${annee}-${mois}-${jour}`;
              let newItem: any = {};

              if (type === "global") {
                newItem = {
                  branche: item?.branche
                    .normalize("NFD")
                    .replace(/\p{Diacritic}/gu, "")
                    .replace(/ /g, ""),
                  statut: item.statut,
                  montantancien: item[key],
                  montantnouveau: item[key],
                  datelimite: dateLimit,
                  libelle: `${item.libelle} ${key}`,
                  rubrique: item.libelle
                    .normalize("NFD")
                    .replace(/\p{Diacritic}/gu, "")
                    .toUpperCase(),
                  periode: key,
                };
              } else {
                newItem = {
                  ideleve: item.ideleve,
                  montant: item[key],
                  datelimite: dateLimit,
                  libelle: `${item.libelle} ${key}`,
                  rubrique: item.libelle
                    .normalize("NFD")
                    .replace(/\p{Diacritic}/gu, "")
                    .toUpperCase(),
                  periode: key,
                };
              }
              result.push(newItem);
            }
          }
        });
      });

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

export function fetchEcheancierGlobal(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      //fetch les points de versements eleves rubriques
      const getRubriques = async () => {
        const baseSqlPointVers = `SELECT UCase([NiveauCourt] & [Série]) AS branche, promotion_frais.RefTypeVers As refTypeVers , promotion_frais.LibFrais AS libelle,
         promotion_frais.RefTypeClasse AS refTypeClasse, promotion_frais.ValFrais1 AS montantAffecte,promotion_frais.ValFrais2 AS montantNonAffecte 
        FROM promotion_frais INNER JOIN NiveauSerie ON promotion_frais.RefTypeClasse = NiveauSerie.RefTypeClasse`;
        const result = await fetchFromMsAccess<any>(baseSqlPointVers, appCnx);
        return result;
      };
      const rubriques = await getRubriques();

      //fetch echeancier global
      const getEcheancierGlobal = async () => {
        const sqlEchGlobal = `SELECT UCase([NiveauCourt] & [Série]) AS branche, EcheancierGlobal.statut AS statut,
        EcheancierGlobal.Octobre AS octobre, EcheancierGlobal.Novembre AS novembre, EcheancierGlobal.Décembre AS decembre,
         EcheancierGlobal.Janvier AS janvier, EcheancierGlobal.Février AS fevrier, EcheancierGlobal.Mars AS mars,
          EcheancierGlobal.Avril AS avril, EcheancierGlobal.Mai AS mai, EcheancierGlobal.Juin AS juin,TypesVersement.RefTypeVers As refTypeVers, 
           EcheancierGlobal.Septembre AS septembre, TypesVersement.LibelléVers AS libelle, EcheancierGlobal.RefTypeClasse AS refTypeClasse
 FROM (TypesVersement INNER JOIN EcheancierGlobal ON TypesVersement.RefTypeVers = EcheancierGlobal.RefTypeVers) 
   INNER JOIN NiveauSerie ON EcheancierGlobal.RefTypeClasse = NiveauSerie.RefTypeClasse`;
        const result = await fetchFromMsAccess<any>(sqlEchGlobal, appCnx);
        return result;
      };
      const echeancierGlobal = await getEcheancierGlobal();
      const paramEtab = await paramEtabObjet(["Anscol1", "DateButoirEcheance"]);
      const result = [];
      //Parcourir les élèves et obtenir les paiement du pour chaque élève.
      rubriques.map((rubrique) => {
        //sinon,verifier rubrique presente dans echeancier global
        const echGlobalAffecte = echeancierGlobal.find(
          (item) =>
            item.refTypeVers === rubrique.refTypeVers &&
            item.refTypeClasse === rubrique.refTypeClasse &&
            item.statut === 1
        );
        //cas écheanchier global non défini dans cette rubrique pour les eleves affectés
        if (!echGlobalAffecte) {
          result.push({
            branche: rubrique.branche
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .replace(/ /g, ""),
            statut: "AFF",
            montantancien: rubrique.montantAffecte || null,
            montantnouveau: rubrique.montantAffecte || null,
            datelimite: `${paramEtab.anscol1.split("-")[0]}-09-${pFormat(
              paramEtab.datebutoirecheance,
              2
            )}`,
            libelle: `${rubrique.libelle} rentrée scolaire`,
            rubrique: rubrique.libelle,
            periode: "Rentrée scolaire",
          });
        } else {
          // cas écheanchier global défini dans cette rubrique pour les eleves affectés
          const resultEchGlobal = echeancierItem(
            echGlobalAffecte,
            paramEtab,
            null,
            "global"
          );
          result.push(...resultEchGlobal);
        }
        const echGlobalNonAffecte = echeancierGlobal.find(
          (item) =>
            item.refTypeVers === rubrique.refTypeVers &&
            item.refTypeClasse === rubrique.refTypeClasse &&
            item.statut === 2
        );
        if (!echGlobalNonAffecte) {
          //cas écheanchier global non défini dans cette rubrique pour les eleves non affectés
          result.push({
            branche: rubrique.branche
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .replace(/ /g, ""),
            statut: "NAFF",
            montantancien: rubrique.montantAffecte || null,
            montantnouveau: rubrique.montantAffecte || null,
            datelimite: `${paramEtab.anscol1.split("-")[0]}-09-${pFormat(
              paramEtab.datebutoirecheance,
              2
            )}`,
            libelle: `${rubrique.libelle} rentrée scolaire`,
            rubrique: rubrique.libelle,
            periode: "Rentrée scolaire",
          });
        } else {
          // cas écheanchier global défini dans cette rubrique pour les eleves non affectés
          const resultEchGlobal = echeancierItem(
            echGlobalNonAffecte,
            paramEtab,
            null,
            "global"
          );
          result.push(...resultEchGlobal);
        }
      });
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de ");
      reject(error);
    }
  });
}
export function fetchEcheancierIndividuel(
  studentIds: number[] | null = null
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      //fetch les points de versements eleves rubriques
      const getRubriques = async () => {
        const baseSqlPointVers = `SELECT Elèves.RefElève AS ideleve, promotion_frais.RefTypeVers As refTypeVers, promotion_frais.LibFrais AS libelle, IIf([StatutElève]=1,[ValFrais1],[Valfrais2]) AS Brut, IIf([Promotion_frais].[RefTypeVers]=2,IIf([StatutElève]=1,[tbl_promotion_PriseEnCharge].[Montant_PC],[tbl_PriseEnCharge_Perso].[Montant_PC]),0) AS PC, (SELECT montant_arriere FROM tbl_arrieres_rubriques WHERE RefElève =Elèves.RefElève And RefTypeVers=promotion_frais.RefTypeVers;) AS Arrieres, (SELECT montant_remise FROM tbl_remises_rubriques WHERE RefElève =Elèves.RefElève And RefTypeVers=promotion_frais.RefTypeVers;) AS Remise, ([Brut]+IIf([Arrieres] Is Null,0,[Arrieres]))-(IIf([PC] Is Null,0,[PC])+IIf([Remise] Is Null,0,[Remise])) AS NetAPayer, (SELECT Sum(DetailsVersements.Montant) AS Total FROM DetailsVersements WHERE RefElève =Elèves.RefElève And RefTypeVers=promotion_frais.RefTypeVers;) AS DejaPaye, IIf(IsNull([Brut]),Null,(IIf([NetAPayer] Is Null,0,[NetAPayer]))-(IIf([DejaPaye] Is Null,0,[DejaPaye]))) AS Solde
        FROM ((promotion_frais INNER JOIN (Elèves INNER JOIN Classes ON Elèves.RefClasse = Classes.RefClasse) ON promotion_frais.RefTypeClasse = Classes.RefTypeClasse) INNER JOIN tbl_promotion_PriseEnCharge ON promotion_frais.RefTypeClasse = tbl_promotion_PriseEnCharge.RefTypeClasse) LEFT JOIN tbl_PriseEnCharge_Perso ON Elèves.RefElève = tbl_PriseEnCharge_Perso.RefElève
        WHERE promotion_frais.RefTypeVers<>5`;
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
        WHERE Elèves.inscrit=Yes
        `;
        const sql = studentIds
          ? `${baseSql} AND Elèves.RefElève IN (${studentIds.join(",")})`
          : baseSql;
        const result = await fetchFromMsAccess<any>(sql, appCnx);
        return result;
      };
      const students = await getStudents();

      //fetch echeancier global
      const getEcheancierGlobal = async () => {
        const sqlEchGlobal = `SELECT UCase([NiveauCourt] & [Série]) AS branche, EcheancierGlobal.statut AS statut,
        EcheancierGlobal.Octobre AS octobre, EcheancierGlobal.Novembre AS novembre, EcheancierGlobal.Décembre AS decembre,
         EcheancierGlobal.Janvier AS janvier, EcheancierGlobal.Février AS fevrier, EcheancierGlobal.Mars AS mars,
          EcheancierGlobal.Avril AS avril, EcheancierGlobal.Mai AS mai, EcheancierGlobal.Juin AS juin,TypesVersement.RefTypeVers As refTypeVers, 
           EcheancierGlobal.Septembre AS septembre, TypesVersement.LibelléVers AS libelle, EcheancierGlobal.RefTypeClasse AS refTypeClasse
 FROM (TypesVersement INNER JOIN EcheancierGlobal ON TypesVersement.RefTypeVers = EcheancierGlobal.RefTypeVers) 
   INNER JOIN NiveauSerie ON EcheancierGlobal.RefTypeClasse = NiveauSerie.RefTypeClasse`;
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
      let resultNoEch = 0;
      //Parcourir les élèves et obtenir les paiement du pour chaque élève.
      students.map((student) => {
        //on récupère les types de versement pour un élève.
        const studentRubriques = rubriques.filter(
          (item) => item.ideleve === student.ideleve
        );
        //verifier rubrique presente dans echeancier perso
        studentRubriques.map((stuRubr) => {
          if (stuRubr.NetAPayer !== 0 && stuRubr.NetAPayer !== null) {
            //si le net a payer est positif

            const echPerso = echeancierPerso.find(
              (item) =>
                item.ideleve === student.ideleve &&
                item.refTypeVers === stuRubr.refTypeVers
            );
            //sinon,verifier rubrique presente dans echeancier global
            if (!echPerso) {
              const echGlobal = echeancierGlobal.find(
                (item) =>
                  item.refTypeVers === stuRubr.refTypeVers &&
                  item.statut === student.statut &&
                  item.refTypeClasse === student.refTypeClasse
              );
              //contruire un object pour la rubrique
              if (!echGlobal) {
                resultNoEch++;
                //cas de rubrique non echanlonnée
                result.push({
                  ideleve: student.ideleve,
                  montant: stuRubr.NetAPayer,
                  datelimite: `${paramEtab.anscol1.split("-")[0]}-09-${pFormat(
                    paramEtab.datebutoirecheance,
                    2
                  )}`,
                  libelle: `${stuRubr.libelle} rentrée scolaire`,
                  rubrique: stuRubr.libelle,
                  periode: "Rentrée scolaire",
                });
              } else {
                // cas écheanchier global défini pour la rubrique
                const resultEchGlobal = echeancierItem(
                  echGlobal,
                  paramEtab,
                  student.ideleve,
                  "individuel"
                );
                result.push(...resultEchGlobal);
              }
            } else {
              //cas écheanchier perso défini lélève
              const resultEchPerso = echeancierItem(
                echPerso,
                paramEtab,
                student.ideleve,
                "individuel"
              );
              result.push(...resultEchPerso);
            }
          }
        });
      });

      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de ");
      reject(error);
    }
  });
}

/**
 * fonction poour creer un item echeancier
 * @param echeance
 * @param paramEtab
 * @param ideleve
 * @param type
 * @returns
 */
const echeancierItem = (echeance, paramEtab, ideleve, type) => {
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
  const result = [];

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
        const newItem: any =
          type === "global"
            ? {
                branche: echeance?.branche
                  .normalize("NFD")
                  .replace(/\p{Diacritic}/gu, "")
                  .replace(/ /g, ""),
                statut: echeance.statut === 1 ? "AFF" : "NAFF",
                montantancien: echeance[key],
                montantnouveau: echeance[key],
                datelimite: dateLimit,
                libelle: `${echeance.libelle} ${key}`,
                rubrique: echeance.libelle
                  .normalize("NFD")
                  .replace(/\p{Diacritic}/gu, "")
                  .toUpperCase(),
                periode: key,
              }
            : {
                ideleve: ideleve,
                montant: echeance[key],
                datelimite: dateLimit,
                libelle: `${echeance.libelle} ${key}`,
                rubrique: echeance.libelle
                  .normalize("NFD")
                  .replace(/\p{Diacritic}/gu, "")
                  .toUpperCase(),
                periode: key,
              };

        result.push(newItem);
      }
    }
  });

  return result;
};

/**
 * historiser les actions effectuées chez Gain technologie
 * @param action
 * @param payload
 * @param statut
 * @returns
 */
const setGainHistoric = (action: string, payload: any, statut: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateNow = new Date().toLocaleString();
      const sql = `INSERT INTO gain_logs (action, payload, statut,date) VALUES (?, ?, ?, ?)`;
      const payloadStringify = JSON.stringify(payload);

      const sqlParams = [action, payloadStringify, statut, dateNow];
      await _executeSql(sql, sqlParams);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export function fetchElevesIdentifiant<
  IGainEleveIdentifiantItem
>(): Promise<IGainEleveIdentifiantItem> {
  return new Promise(async (resolve, reject) => {
    try {

      const sql = `SELECT clng(idEleveGain) as id, cstr(Elèves.RefElève) AS ideleve FROM Elèves`;
      const result = await fetchFromMsAccess<IGainEleveIdentifiantItem>(
        sql,
        appCnx
      );
      resolve(result);
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleves pour gain technologie");
      reject(error);
    }
  });
}

/**
 * fetcher des logs
 * @param logIds un array ids logs initialiser a null
 * @returns
 */
export function fetchLogs<IGainLogItem>(logIds: number[] | null = null) {
  return new Promise(async (resolve, reject) => {
    try {
      if (logIds) {
        const sql = `SELECT * FROM gain_logs WHERE id IN  (${logIds.join(
          ","
        )})`;
        const result: IGainLogItem[] = await _selectSql(sql, []);
        resolve(result);
      } else {
        const sql = `SELECT * FROM gain_logs`;
        const result: IGainLogItem[] = await _selectSql(sql, []);
        resolve(result);
      }
    } catch (error) {
      Logger.error("Erreur lors de recuperation eleves pour gain technologie");
      reject(error);
    }
  });
}

/**
 *marquer comme succes (statut =1)  des logs gain
 * @param logIds
 * @returns
 */
export const setGainLogsSuccess = (logIds: number[]): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const dateNow = new Date().toLocaleString();
      const sql = `UPDATE gain_logs SET statut = ?,date=? WHERE id IN  (${logIds.join(
        ","
      )})`;
      await _executeSql(sql, [1, dateNow]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * marquer toutes un groupe d'action (classe , eleve ...) comme success
 * @param actionFor
 * @returns
 */
export const setGainLogsGroupActionSuccess = (
  actionFor: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      let actionsList = "()";
      if (actionFor === "eleve") {
        actionsList = "('AJOUTER_ELEVE','MODIFIER_ELEVE','SUPPRIMER_ELEVE')";
      } else if (actionFor === "classe") {
        actionsList = "('AJOUTER_CLASSE','MODIFIER_CLASSE','SUPPRIMER_CLASSE')";
      } else if (actionFor === "paiement") {
        actionsList =
          "('INITIALISER_PAIEMENT','INSERER_PAIEMENT','MODIFIER_PAIEMENT','SUPPRIMER_PAIEMENT')";
      } else if (actionFor === "echglobal") {
        actionsList = "('CREER_ECHEANCIER_GLOBAL')";
      } else if (actionFor === "echperso") {
        actionsList =
          "('INITIALISER_ECHEANCIER_PERSO','CREER_ECHEANCIER_PERSO')";
      }
      const dateNow = new Date().toLocaleString();
      const sql = `UPDATE gain_logs SET statut = ?,date=? WHERE action IN  ${actionsList}`;
      await _executeSql(sql, [1, dateNow]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  fetchEleves,
  fetchPaiements,
  fetchClasses,
  fetchEcheanciers,
  setGainHistoric,
  fetchElevesIdentifiant,
  fetchLogs,
  setGainLogsSuccess,
  setGainLogsGroupActionSuccess,
  fetchEcheancierIndividuel,
  fetchEcheancierGlobal,
  fetchPaiementEleves
};
