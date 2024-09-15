export interface ICodeEtabAnneeScolaire {
  anneeScolaire: string;
  codeEtab: string;
}
export interface ISpiderClassseItem {
  idClasse: number;
  idTypeclasse: number;
  ordreClasse: number;
  libelleClasseCourt: string;
  libelleClasseLong: string;
  lv2: string;
  arts: string;
}

export interface IFocusEcoleClasseItem extends ISpiderClassseItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface ISpiderClassseMatiereProf {
  idClasse: number;
  idPersonnel: number;
  idMatiere: number;
  libelleClasseCourt: string;
  libelleClasseLong: string;
  idTypeClasse: number;
  ordreClasse: number;
  libelleMatiereCourt: string;
  libelleMatiereLong: string;
  nomPersonnel: string;
}
export interface IFocusEcoleClassseMatiereProf extends ISpiderClassseMatiereProf {
  anneeScolaire: string;
  codeEtab: string;
}

export interface ISpiderStudentItem {
  idEleve: number;
  idClasse: number;
  matricule: string;
  nomEleve: string;
  prenomEleve: string;
  prenoms: string;
  statutEleve: string;
  sexe: string;
  niveau: string;
  idclasse: string;
  numeroExtrait: string;
  dateEnregExtrait: string;
  dateNaissance: string;
  lieuNaissance: string;
  mobile: string;
  lv2: string;
  arts: string;
  nationalite: string;
  residenceEleve: string;
  emailEleve: string;
  inscrit: number;
  dateInscrit: Date | string;
  etabOrigine: string;
  redoublant: number;
  transfert: number;
  numeroTransfert: string;
  decisionAffectation: string;
}

export interface IFocusEcoleStudentItem extends ISpiderStudentItem {
  anneeScolaire: string;
  codeEtab: string;
}
export interface ISpiderEleveRubriqueItem {
  idEleveRubrique: number;
  idEleve: number;
  idRubrique: number;
  nombreVersement: number;
  montantRubrique: number;
}
export interface IFocusEcoleEleveRubriqueItem extends ISpiderEleveRubriqueItem {
  anneeScolaire: string;
  codeEtab: string;
}


export interface ISpiderEcheancierPersonnelEleveRubriqueItem {
  idEcheancierRubriquePersonnel: number;
  idEleveRubrique: number;
  libellePeriode: string;
  dateDebutPeriode: Date | string;
  dateFinPeriode: Date | string;
  montantPeriode: number;
}

export interface IFocusEcoleEcheancierPersonnelEleveRubriqueItem extends ISpiderEcheancierPersonnelEleveRubriqueItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface IFocusEcolePaymentItem {
  ideleve: string;
  montant: number;
  numeropiece: string;
  modepaiement: string;
  libelle: string;
  dateVersement: string
}

export interface ISpiderEcheancierItem {
  idEleve: string;
  libelleRubrique: string;
  libellePeriode: string;
  modepaiement: string;
  dateLimitePeriode: Date | string;
  descriptionPeriode: string;
  montantPeriode: number;
  MontantPayer: number;
  idRubrique: number;
  categorieVersement: string;
  prioriteRubrique: number;
  idGroupeRubrique: number;
  libelleGroupeRubrique: string;
  idCategorieGroupeRubrique: number;
  libelleCategorieGroupeRubrique: string;
}

export interface IFocusEcoleEcheancierItem extends ISpiderEcheancierItem {
  anneeScolaire: string;
  codeEtab: string;
}


export interface ISpiderEcheancierIndividuelItem {
  idEleve: number;
  idRubrique: number;
  idLibelleEcheance: number;
  libelleRubrique: string;
  descriptionRubrique: string;
  nomEleve: string;
  prenomEleve: string;
  montantEcheance: number;
  MontantDejaPaye: number;
  priorite: number;
  dateDebutPeriode: Date | string;
  dateFinPeriode: Date | string;
  libelleGroupeRubrique: string;
  descriptionGroupeRubrique: string;
  libelleCategorieGroupeRubrique: Date | string;
  libelleNaturePaiement: string;
  libelleEcheance: string;
  statutEleve: number;
  ancienneteEleve: number;
  idSouscriptionFraisRubriqueOptionnel: number;
}
export interface IFocusEcoleEcheancierIndividuelItem extends ISpiderEcheancierIndividuelItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface ISpiderOptionTypeClasseRubriqueObligatoireItem {
  idOptionTypeClasseRubrique: number;
  idTypeClasse: number;
  idRubrique: number;
  priorite: number;
  tenirCompteDeStatut: number;
  tenirCompteDeAnciennete: number;
  tenirCompteDeGenre: number;
}
export interface IFocusEcoleOptionTypeClasseRubriqueObligatoireItem extends ISpiderOptionTypeClasseRubriqueObligatoireItem {
  anneeScolaire: string;
  codeEtab: string;
}
export interface ISpiderTypeClasseRubriqueObligatoireItem {
  idTypeClasseRubrique: number;
  idOptionTypeClasseRubrique: number;
  nombreVersement: number;
  montantRubrique: number;
  statut: number;
  anciennete: number;
  genre: number;
}
export interface IFocusEcoleTypeClasseRubriqueObligatoireItem extends ISpiderTypeClasseRubriqueObligatoireItem {
  anneeScolaire: string;
  codeEtab: string;
}
export interface ISpiderEcheancierTypeClasseRubriqueObligatoireItem {
  idTypeClasseRubrique: number;
  libellePeriode: string;
  dateDebutPeriode: Date | string;
  dateFinPeriode: Date | string;
  montantPeriode: number;
}
export interface IFocusEcoleEcheancierTypeClasseRubriqueObligatoireItem extends ISpiderEcheancierTypeClasseRubriqueObligatoireItem {
  anneeScolaire: string;
  codeEtab: string;
}
export interface ISpiderRubriqueOptionnelGlobalItem {
  idRubriqueOptionnelGlobal: number;
  idRubrique: number;
  montantRubrique: number;
  nombreVersement: number;
}
export interface IFocusEcoleRubriqueOptionnelGlobalItem extends ISpiderRubriqueOptionnelGlobalItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface ISpiderEcheancierRubriqueOptionnelItem {
  idEcheancierRubriqueOptionnelGlobal: number;
  idRubriqueGlobalOptionnel: number;
  libellePeriode: number;
  dateDebutPeriode: Date | string;
  dateFinPeriode: Date | string;
  montantPeriode: number;
}
export interface IFocusEcoleEcheancierRubriqueOptionnelItem extends ISpiderEcheancierRubriqueOptionnelItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface IFocusEcoleLogItem {
  id: string;
  action: string;
  payload: number[] | null;
  statut: number;
  date: string;
}
export interface ISpiderHoraireItem {
  idHoraire: number,
  libelleHoraire: string,
  plageHoraire: string,
}
export interface IFocusEcoleHoraireItem extends ISpiderHoraireItem {
  anneeScolaire: string;
  codeEtab: string;
}
export interface ISpiderPlageHoraireItem {
  anneeScolaire: string;
  codeEtab: string;
  chrono: string;
  utilisation: string;
  debut: string;
  fin: string;
}
export interface IFocusEcolePlageHoraireItem extends ISpiderPlageHoraireItem {
  anneeScolaire: string;
  codeEtab: string;
}
export interface ISpiderEvaluationNoteItem {
  anneeScolaire: string;
  codeEtab: string;
  idEvaluationProgrammation: number;
  idEleve: number;
  idMatiere: number;
  idClasse: number;
  noteEvaluation: number;
  periodeEvaluation: number;
  dateSaisie: Date | string;
  operateurSaisie: string;
  dateModification: Date | string;
  operateurModification: string;
  recuperer: Number;
  device: string;
}

export interface IFocusEcoleEvaluationNoteItem extends ISpiderEvaluationNoteItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface ISpiderEvaluationProgrammationItem {
  idEvaluationProgrammation: number;
  idEleve: number;
  idMatiere: number;
  idClasse: number;
  periodeEvaluation: number;
  numeroEvaluation: number;
  coefficientEvaluation: number;
  dateComposition: Date | string;
  typeEvaluation: string;
}
export interface IFocusEcoleEvaluationProgrammationItem extends ISpiderEvaluationProgrammationItem {
  anneeScolaire: string;
  codeEtab: string;
}
export interface ISpiderSalleItem {
  idSalle: string;
  libelleSalle: string;
  typeSalle: string;
  capaciteSalle: string;
  ordreSalle: string;
}
export interface IFocusEcoleSalleItem extends ISpiderSalleItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface ISpiderPersonnelItem {
  idPersonnel: number;
  nomPersonnel: string;
  prenomPersonnel: string;
  fonction: string;
  matriculePersonnel: string;
  sexe: string;
  phone1: string;
  phone2: string;
  dateNaissance: string;
  lieuNaissance: string;
  idDiplome: string;
  residence: string;
  situationMatrimoniale: string;
  dateEmbauche: string;
  numeroCnps: number;
  corpsMetier: number;
  numeroWhatsApp: string;
  email: string;
}
export interface IFocusEcolePersonnelItem extends ISpiderPersonnelItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface ISpiderMatiereItem {
  idMatiere: number
  libelleMatiereCourt: string;
  libelleMatiereLong: string;
  libelleMatiereAbreger: string;
  ordreMatiere: number
  couleurMatiere: number,
  general: Boolean,
  bilan: string;
}

export interface IFocusEcoleMatiereItem extends ISpiderMatiereItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface ISpiderSeanceItem {
  idSeance: number
  idSalle: number;
  idPersonnel: number;
  idMatiere: number;
  idClasse: number
  idHoraire: number,
  observation: string,
}
export interface IFocusEcoleSeanceItem extends ISpiderSeanceItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface ISpiderGroupeRubriqueItem {
  idGroupeRubrique: number;
  libelleGroupeRubrique: string;
  descriptionGroupeRubrique: string;
  idCategorieGroupeRubrique: number
}
export interface IFocusEcoleGroupeRubriqueItem extends ISpiderGroupeRubriqueItem {
  anneeScolaire: string;
  codeEtab: string;
}
export interface ISpiderRubriqueItem {
  idRubrique: number;
  idGroupeRubrique: number;
  libelleRubrique: string;
  descriptionRubrique: string;
  idNaturePaiement: number;
  desabonnementInterdit: number;
}
export interface IFocusEcoleIRubriqueItem extends ISpiderRubriqueItem {
  anneeScolaire: string;
  codeEtab: string;
}
export interface ISpiderLibelleEcheanceItem {
  idRubrique: number;
  idGroupeRubrique: number;
  libelleRubrique: string;
  descriptionRubrique: string;
  idNaturePaiement: number;
  desabonnementInterdit: number;
}
export interface IFocusEcoleLibelleEcheanceItem extends ISpiderLibelleEcheanceItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface ISpiderSouscriptionFraisRubriqueOptionnelItem {
  idSouscriptionRubriqueOptionnel: number;
  idEcheancierRubriqueOptionnel: number;
  idEleve: number;
  personnalise: boolean;
}
export interface IFocusEcoleSouscriptionFraisOptionnelItem extends ISpiderSouscriptionFraisRubriqueOptionnelItem {
  anneeScolaire: string;
  codeEtab: string;
}


export interface IFocusEcoleMessageItem {
  idMessage?: number;
  idTag: number;
  idNiveauAlert: number;
  anneeScolaire: string;
  codeEtab: string;
  titre: string;
  contenu: string;
}

export interface IMessageDestinataireItem {
  idEleves: string[],
}

export interface ISpiderVersementItem {
  idVersement:number;
  idEleve:number;
  dateEnregistrement:Date | string;
  datePaiement:Date | string;
  montantVersement:number;
  idMoyenPaiement:number;
  operateurSaisie:string;
  nomPrenomClient:string;
  contactClient:string;
  idModification:number;
  idElevnumeroRecuManuele:number;
  transactionId:string;
}

export interface IFocusEcoleISpiderVersementItem extends ISpiderVersementItem {
  anneeScolaire: string;
  codeEtab: string;
}


export interface ISpiderDetailsVersementRubriqueObligatoireItem {
  idVersement: number,
  idRubrique: number,
  montant: number,
}

export interface IFocusEcoleDetailsVersementRubriqueObligatoireItemItem extends ISpiderDetailsVersementRubriqueObligatoireItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface ISpiderDetailsVersementRubriqueOptionnelItem {
  idVersement: number,
  idSouscriptionFraisRubriqueOptionnel: number,
  montant: number,
}
export interface IFocusEcoleDetailsVersementRubriqueOptionnelItem extends ISpiderDetailsVersementRubriqueOptionnelItem {
  anneeScolaire: string;
  codeEtab: string;
}

export interface IFocusEcoleSouscriptionRubriqueOptionnelEnAttente extends ICodeEtabAnneeScolaire{
  idEleve:number,
  idRubriqueOptionnelGlobal:number,
  recupere:number
}