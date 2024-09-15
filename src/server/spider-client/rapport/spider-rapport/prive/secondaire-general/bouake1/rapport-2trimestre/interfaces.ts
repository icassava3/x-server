//Convert from clipboard (Shift + Ctrl + Alt + V)

export interface IChp1_A_1 {
  TypeActivite: string,
  Nombre: string,
}

export interface IChp1_A_2_a {
  nom_complet: string;
  matiere: string;
  nombre_visit: number;
  date_visit: string;
  observ_visit?: any;
}

export interface IChp1_A_2_b {
  discipline: string,
  enseignant_formes: string,
  nombre_formation: string,
  dates: string,
  obs: string,
}

export interface IChp1_B_1 {
  RefNiveau: number;
  bg: string;
  NiveauCourt: string;
  ClasseCourt: string;
  EffectTotal: number;
  EffectClasse: number;
  EffectNonClasse: number;
  Tranche1: number;
  Taux1: number;
  Tranche2: number;
  Taux2: number;
  Tranche3: number;
  Taux3: number;
  MoyClasse: number;
}

export interface IChp1_B_1_b {
  RefNiveau: number;
  orderby: number;
  label: string;
  NiveauCourt: string;
  NiveauLong: string;
  bg: string;
  genre: string;
  NbreClasses: number;
  EffectTotal: number;
  EffectClasse: number;
  EffectNonClasse: number;
  Tranche1: number;
  Taux1: number;
  Tranche2: number;
  Taux2: number;
  Tranche3: number;
  Taux3: number;
  MoyClasse: number;
}

export interface IChp1_B_2 {
  OrderBy: number,
  ClasseCourt: string,
  ClasseLong: string,
  MatriculeNational: string,
  NomComplet: string,
  DateNaiss: string,
  Genre: string,
  Nationalite: string,
  Redoub: string,
  Lang2: string,
  Lang1: string,
  MoyG3: string,
  MoyG1: string,
  RangG1: string,
  RangG3: string,
  MS: string,
  ProfP: string,
  Educ: string,
  StatutEleve: string,
  NumDeciAffect: string,
  Obs: string,
  EffectTotal: number,
  Admis: number,
  Redouble: number,
  Exclus: number,
  IdAppréciation: string;
  Niveau: string;
  Appréciations: string;
  NotePlancher: number;
  NotePlafond: number;
  Appreciations:string;
  RefNiveau:string, 
  RefClasse:string,  
  RefTypeClasse:string,  
  MoyG2:string,  
  RangG2:string,  
  LieuNaiss:string,  
}

export interface IChp1_B_3 {
  RefTypeClasse: number;
  MoyG2: number;
  NiveauCourt: string;
  NiveauSerie: string;
  ClasseCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  DateNais: string;
  Age: number;
  Genre: string;
  Nationalite: string;
  Redoub: string;
  Lang2: string;
  StatutEleve: string;
  NumDeciAffect: string;
  RangG1: string;
}
export interface IChp_1_B_2 {
  RefTypeClasse: number;
  ClasseCourt: string;
  MoyG2: number;
  NiveauCourt: string;
  label: string;
  MatriculeNational: string;
  NomComplet: string;
  DateNais: string;
  Age: number;
  Genre: string;
  Nationalite: string;
  Redoub: string;
  Lang2: string;
  StatutEleve: string;
  NumDeciAffect: string;
  RangG2: string;
}

export interface IChp2_A {
  RefClasse: number;
  RefTypeClasse: number;
  MatriculeNational: string;
  NomComplet: string;
  Genre: string;
  ClasseCourt: string;
  NiveauCourt: string;
  DateNaiss: string;
  Age: number;
  Redoub: string;
  Nat: string;
  EtsOrig: string;
  EtsAcc: string;
  NumTrans: string;
  Decision: string;
}
export interface IChp2_B {
  RefClasse: number;
  RefTypeClasse: number;
  MatriculeNational: string;
  NomComplet: string;
  Genre: string;
  ClasseCourt: string;
  NiveauCourt: string;
  DateNaiss: string;
  Total: number;
  G1: number;
  F1: number;
  EtsOrig: string;
  EtsAcc: string;
  NumTrans: string;
  Decision: string;
}


export interface IChp2_A_1 {
  RefClasse: number;
  RefTypeClasse: number;
  MatriculeNational: string;
  NomComplet: string;
  Genre: string;
  ClasseCourt: string;
  NiveauCourt: string;
  DateNaiss: string;
  Age: number;
  Redoub: string;
  Nat: string;
  EtsOrig: string;
  EtsAcc: string;
  NumTrans: string;
  Decision: string;
}

export interface IChp2_B {
  annee: string;
  genre: string;
  "6e": number;
  "5e": number;
  "4e": number;
  "3e": number;
  ST1: number;
  "2ndA": number;
  "2ndC": number;
  "1ereA": number;
  "1ereC": number;
  "1ereD": number;
  TleA: number;
  TleC: number;
  TleD: number;
  ST2: number;
  TOTAL: number;
}

export interface IChp2_D {
  RefNiveau: number;
  bg: string;
  NiveauCourt: string;
  NiveauSerie: string;
  CycleX: string;
  NbreClasses: number;
  F1: number;
  F2: number;
  T1: number;
  G1: number;
  G2: number;
  T2: number;
  TT1: number;
  TT2: number;
  TT3: number;
}
export interface IChp2_C {
  RefNiveau: number;
  NiveauCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  ClasseCourt: string;
  Genre: string;
  Decision: string;
  Regime: string;
  DateNaiss:string
  LieuNaissance:string
}

export interface IChp3_C_1 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Age:string, 
  TermeTheorique:string, 
  QualiteAuteur:string, 
  Auteur:string, 
  ProblemePsycho:string, 
  FonctionAuteur:string, 
  Genre:string, 
  Observations:string, 
}

export interface IChp3_C_2 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Genre:string, 
  Age:string, 
  Observations:string, 
}
export interface IChp3_C_3 {
  NomComplet:string, 
  Deces:string, 
  Handicap:string, 
  Maladie:string, 
}
export interface IChp4_2 {
  NomComplet:string, 
  Genre:string, 
  NumCnps:string, 
  NomDiplome:string, 
  MatLong:string, 
  VolumeHoraire:string, 
  categorie:string, 
  NumAut:string, 
  Fonction:string, 
  Fonct:string, 
}

export interface IChp2_E {
  orderby: number;
  label: string;
  _6eme: number;
  _5eme: number;
  _4emeEsp: number;
  _4emeAll: number;
  Tot4eme: number;
  _3emeEsp: number;
  _3emeAll: number;
  Tot3eme: number;
  TotalCycle1: number;
  _2ndAEsp: number;
  _2ndAll: number;
  _2ndCEsp: number;
  _2ndCAll: number;
  Tot2nd: number;
  _1ereAEsp: number;
  _1ereCEsp: number;
  _1ereDEsp: number;
  _1ereAAll: number;
  _1ereCAll: number;
  _1ereDAll: number;
  TOT1ere: number;
  _TleAEsp: number;
  _TleCEsp: number;
  _TleDEsp: number;
  _TleAAll: number;
  _TleCAll: number;
  _TleDAll: number;
  TOTTle: number;
  TotalCycle2: number;
  TotalGeneral: number;
}
export interface IChp4_A_1_3 {
  FrCycle1: number;
  FrCycle2: string;
  PhiloCycle1: number;
  PhiloCycle2: number;
  AnCycle1: number;
  AnCycle2: number;
  AllCycle2: number;
  HgCycle2: number;
  MathCycle2: number;
  PcCycle2: number;
  SvtCycle2: number;
  EpsCycle2: number;
  ApCycle2: number;
  MusCycle2: number;
  TotalCycle1: number;
  TotalCycle2: number;
  Fonction: number;
}
export interface IChp3_B {
  RefPersonnel: number;
  NomComplet: string;
  NomDiplome?: any;
  Sexe: string;
  Fonction: string;
  NumCnps?: any;
}
export interface IChp3_A {
  RefPersonnel: number;
  NomComplet: string;
  Genre: string;
  NomDiplome: string;
  FonctVacatire: string;
  PrivePermanent: string;
  PriveVacataire: string;
  VolumeHoraire?: any;
  NumCnps?: any;
  NumAut?: any;
  MatLong: string;
  Contacts: string;
  Fonction: number;
}
export interface IChp3_A_1 {
  FR1: number;
  FR2: number;
  HG1: number;
  HG2: number;
  ANG1: number;
  ANG2: number;
  PHILO1: number;
  PHILO2: number;
  ALL1: number;
  ALL2: number;
  ESP1: number;
  ESP2: number;
  MATHS1: number;
  MATHS2: number;
  SVT1: number;
  SVT2: number;
  EDHC1: number;
  EDHC2: number;
  AP1: number;
  AP2: number;
  SP1: number;
  SP2: number;
  EPS1: number;
  EPS2: number;
  INFOR1: number;
  INFOR2: number;
  T1: number;
  T2: number;
  T3: number;
}
export interface IChp3_A_2 {
  FR1: number;
  FR2: number;
  HG1: number;
  HG2: number;
  ANG1: number;
  ANG2: number;
  PHILO1: number;
  PHILO2: number;
  ALL1: number;
  ALL2: number;
  ESP1: number;
  ESP2: number;
  MATHS1: number;
  MATHS2: number;
  SVT1: number;
  SVT2: number;
  EDHC1: number;
  EDHC2: number;
  AP1: number;
  AP2: number;
  SP1: number;
  SP2: number;
  EPS1: number;
  EPS2: number;
  INFOR1: number;
  INFOR2: number;
  T1: number;
  T2: number;
  T3: number;
}
export interface IChp2_E {
  RefNiveau: number;
  NiveauCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  ClasseCourt: string;
  Genre: string;
  Decision: string;
  Regime: string;
  DateNaiss:string
  LieuNaissance:string
}
export interface IChp4_1 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Genre:string, 
  DateDepotCertificat:string, 
  DateDeces:string, 
  CauseDeces:string, 
  Age:string;
  StatutEleve:string;
  }
  export interface IChp4_2 {
    MatriculeNational:string, 
    NomComplet:string, 
    Age:string, 
    ClasseCourt:string, 
    Genre:string, 
    AdresseParent:string, 
    DateDepotCertificat:string, 
    NomAuteur:string, 
    FonctionAuteur:string, 
    DateAccouchement:string, 
    }
    export interface IChp4_3 {
      MatriculeNational:string, 
      NomComplet:string, 
      ClasseCourt:string, 
      Genre:string, 
      DateDeces:string, 
      CauseDeces:string, 
      DateDepotCertificat:string;  
      NatureMaladie:string;  
      DureeMaladie:string;  
    }
    export interface IChp2_D {
      annee: string;
      genre: string;
      "6e": number;
      "5e": number;
      "4e": number;
      "3e": number;
      ST1: number;
      "2ndA": number;
      "2ndC": number;
      "1ereA": number;
      "1ereC": number;
      "1ereD": number;
      TleA: number;
      TleC: number;
      TleD: number;
      ST2: number;
      TOTAL: number;
    }
    
