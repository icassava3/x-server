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

export interface IChp1_B_1_1 {
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

export interface IChp1_B_1_3 {
  OrdreClasse: number;
  RefNiveau: number;
  NiveauCourt: string;
  ClasseCourt: string;
  bg: string;
  F1: number;
  G1: number;
  T1: number;
  EffectTotal: number;
  F2: number;
  G2: number;
  T2: number;
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

export interface IChp1_B_2_5 {
  RefTypeClasse: number;
  MoyG2: number;
  NiveauCourt: string;
  NiveauSerie: string;
  ClasseCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  DateNais: string;
  LieuNaiss: string;
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
  MatriculeNational: string,
  NomComplet: string,
  Genre: string,
  ClasseCourt: string,
  Age: number,
  Redoub: string,
  Nat: string,
  EtsOrig: string,
  NumTransfert: string,
  DateNaiss: string,
  NumTrans: string,
  NiveauCourt:string
}

export interface IChp2_B {
  RefNiveau: number;
  CycleX: string;
  orderby: string;
  NiveauSerie: string;
  bg: string;
  F1: number;
  G1: number;
  T1: number;
  EffectTotal: number;
  F2: number;
  G2: number;
  T2: number;
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

export interface IChp2_C {
  label: string,
  _6e: number,
  _5e: number,
  _4e: number,
  _3e: number,
  ST1: number,
  _2ndA: number,
  _2ndC: number,
  _1ereA: number,
  _1ereC: number,
  _1ereD: number,
  _TleA: number,
  _TleC: number,
  _TleD: number,
  ST2: number,
  TOTAL: number
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

export interface IChp2_E {
  RefNiveau: number;
  NiveauCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  Genre: string;
  DateNais: string;
  LieuNaiss: string;
  Nationalite: string;
  MoyG2: number;
  RangG2: string;
  Regime: string;
  ClasseCourt: string;
}

export interface IChp2_F {
  label: string;
  _6e: number;
  _5e: number;
  _4e: number;
  _3e: number;
  ST1: number;
  _2ndA: number;
  _2ndC: number;
  _1ereA: number;
  _1ereC: number;
  _1ereD: number;
  _TleA: number;
  _TleC: number;
  _TleD: number;
  ST2: number;
  TOTAL: number;
}

export interface IChp2_F_1 {
  label: string;
  F1: number;
  G1: number;
  T1: number;
  F2: number;
  G2: number;
  T2: number;
  TF: number;
  TG: number;
  TFG: number;
}

export interface IChp3_A_1 {
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

export interface IChp3_A_2 {
  Permanent: number;
  Vacataire: number;
  T1: number;
  x: number;
  cycle1: number;
  cycle2: number;
  T2: number;
  F3: number;
  G3: number;
  T3: number;
  F4: number;
  G4: number;
  T4: number;
  F5: number;
  G5: number;
  T5: number;
}

export interface IChp3_A_3 {
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
  FHR1: number;
  FHR2: number;
  T1: number;
  T2: number;
  T3: number;
}

export interface IChp3_B {
  NomComplet: string;
  NomDiplome: string;
  Fonction: string;
  NumCnps: string;
  NumAut: string;
  Contacts: string;
  Groupe: number;
}

export interface IChp3_B_1 {
  F1: number;
  H1: number;
  F2: number;
  H2: number;
  F3: number;
  H3: number;
  F4: number;
  H4: number;
  F5: number;
  H5: number;
  F6: number;
  H6: number;
  F7: number;
  H7: number;
  F8: number;
  H8: number;
  TF: number;
  TH: number;
  T: number;
}

export interface IChp4_A {
  MatriculeNational: string;
  NomComplet: string;
  ClasseCourt: string;
  CauseDeces: string;
  StatutEleve: string;
  ContactsFamille: string;
}

export interface IChp4_B {
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
  ContactsFamille: string;
  Contacts: string;
  }

  export interface IChp4_C_D {
    MatriculeNational:string, 
    NomComplet:string, 
    ClasseCourt:string, 
    ContactsFamille: string;
    Description: string;
    }
/*

*/