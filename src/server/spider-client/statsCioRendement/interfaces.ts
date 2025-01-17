
export interface IGenererElevesSecondaireGeneralRendement {
    trimestre: number
}

export interface IElevesSecondaireGeneralRendementParTrancheMoyEtSexe {
    RefNiveau: number;
    NiveauCourt: string;
    Serie: null;
    FilleIns: number;
    GarcIns: number;
    FilleClass: number;
    GarcClass: number;
    FilleMoySup10: number;
    GarcMoySup10: number;
    FilleMoyEntr810: number;
    GarcMoyEntr810: number;
    FilleMoyInf8: number;
    GarcMoyInf8: number;
    libelleNiveauParSerie: string;
}

export interface IElevesSecondaireGeneralRendementParDfaEtSexe {
    RefNiveau: number;
    NiveauCourt: string;
    Serie: null;
    FilleIns: number;
    GarcIns: number;
    FilleClass: number;
    GarcClass: number;
    FilleAdmise: number;
    GarcAdmis: number;
    FilleRedoublante: number;
    GarcRedoublant: number;
    FilleExclue: number;
    GarcExclu: number;
    libelleNiveauParSerie: string;
}

export interface IElevesSecondaireGeneralRendementParDiscipline2 {
  anneeScolaire: string;
  codeEtab: string;
  idEleve: number;
  RefTypeClasse: number;
  RefClasse: number;
  CF1: number;
  OG1: number;
  EO1: number;
  FR1: number;
  PHILO1: null;
  HG1: number;
  AN1: number;
  LV21: null;
  MATH1: number;
  SP1: number;
  SVT1: number;
  EPS1: number;
  APMUS1: number;
  ECM1: number;
  COND1: number;
  MOYG1: number;
  MOYG2_: null;
  MOYG3_: null;
  MOYG4_: null;
  MCA1: null;
  MCB1: number;
  Info1: number;
  TM1: number;
  MCC1: number;
  MCD1: number;
  LV2: null;
  Arts: string;
  classeLV2: string;
  classeArts: string;
  CoefFR1: number;
  CoefPHILO1: null;
  CoefHG1: number;
  CoefAN1: number;
  CoefLV21: null;
  CoefMATH1: number;
  CoefSP1: number;
  CoefSVT1: number;
  CoefEPS1: number;
  CoefAPMUS1: number;
  CoefECM1: number;
  CoefCOND1: number;
  telTuteur: string;
  prenomEleve: string;
  libelleClasseCourt: string;
  idOrdreEnseignement: number;
  libelleClasseLong: string;
  matriculeEleve: string;
  serie: null;
  idTypeClasse: number;
  idNiveau: number;
  ordreEnseignement: string;
  libelleNiveauCourt: string;
  idClasse: number;
  libelleNiveauParSerie: string;
  decision: string;
  sexe: string;
  nomEleve: string;
  niveauCourt: string;
  eleveLV2?: string;
  dfa: string;
  dateNaissance: any;
  cycle: number;
}

export interface IElevesSecondaireGeneralMoyennesParDiscipline {
    RefNiveau: number;
    NiveauCourt: string;
    Serie: null;
    refTypeClasse: number;
    CFClass: number;
    FilleCFClass: number;
    GarcCFClass: number;
    CFInf10: number;
    FilleCFInf10: number;
    GarcCFInf10: number;
    OGClass: number;
    FilleOGClass: number;
    GarcOGClass: number;
    OGInf10: number;
    FilleOGInf10: number;
    GarcOGInf10: number;
    ANClass: number;
    FilleANClass: number;
    GarcANClass: number;
    ANInf10: number;
    FilleANInf10: number;
    GarcANInf10: number;
    ALLClass: number;
    FilleALLClass: number;
    GarcALLClass: number;
    ALLInf10: number;
    FilleALLInf10: number;
    GarcALLInf10: number;
    ESPClass: number;
    FilleESPClass: number;
    GarcESPClass: number;
    ESPInf10: number;
    FilleESPInf10: number;
    GarcESPInf10: number;
    HGClass: number;
    FilleHGClass: number;
    GarcHGClass: number;
    HGInf10: number;
    FilleHGInf10: number;
    GarcHGInf10: number;
    MATHClass: number;
    FilleMATHClass: number;
    GarcMATHClass: number;
    MATHInf10: number;
    FilleMATHInf10: number;
    GarcMATHInf10: number;
    PCClass: number;
    FillePCClass: number;
    GarcPCClass: number;
    PCInf10: number;
    FillePCInf10: number;
    GarcPCInf10: number;
    SVTClass: number;
    FilleSVTClass: number;
    GarcSVTClass: number;
    SVTInf10: number;
    FilleSVTInf10: number;
    GarcSVTInf10: number;
    PHILOClass: number;
    FillePHILOClass: number;
    GarcPHILOClass: number;
    PHILOInf10: number;
    FillePHILOInf10: number;
    GarcPHILOInf10: number;
    FRClass: number;
    FilleFRClass: number;
    GarcFRClass: number;
    FRInf10: number;
    FilleFRInf10: number;
    GarcFRInf10: number;
    Cycle: string;
    libelleNiveauParSerie: string;
}