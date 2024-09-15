//Convert from clipboard (Shift + Ctrl + Alt + V)

export interface IChp1_A_2_a {
  ResponsableEtab: string,
  Discipline: string,
  NomComplet: string,
  Etab: string,
  Contact: string
}

export interface IChp1_A_2_b {
  Discipline: string,
  DatePeriode: string,
  TypeActivite: string,
  AnimateurTheme: string,
}

export interface IChp1_A_3_a {
  Visiteur:string,
  typeVisiteur:string,
  nomVisiteur: string,
  NomCompletProf: string,
  Discipline: string,
  Classe: string,
  Dates: string,
  Heures: string,
}

export interface IChp1_A_3_b {
  Visiteur: string,
  NomCompletProf: string,
  Discipline: string,
  Classe: string,
  Dates: string,
  Heures: string,
}

export interface IChp1_A_3_c {
  Visiteur: string,
  NomCompletProf: string,
  Discipline: string,
  Classe: string,
  Dates: string,
  Heures: string,
}

export interface IChp1_A_4_c {
  Discipline: string,
  DateFormation: string,
  ThemeEtLieu: string,
  AnimateurDuTheme: string,
}

export interface IChp_1_B_1 {
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

export interface IChp_1_B_2 {
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
}

export interface IChp_1_B_3 {
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
  Lang: string;
  StatutEleve: string;
  NumDeciAffect: string;
  RangG2: string;
}

export interface IChp1_B_4 {
  CycleX: string,
  NiveauSerie: string,
  GT1:  number,
  FT1: number,
  TT1:  number,
  GT2:  number,
  FT2:  number,
  TT2:  number,
  GT3A:  number,
  FT3A:  number,
  TT3A:  number,
  GT3B:  number,
  FT3B:  number,
  TT3B:  number,
  GT3C:  number,
  FT3C:  number,
  TT3C:  number,
  TT3:  number,
}

export interface IChp2_A {
  MatriculeNational: string,
  NomComplet: string,
  ClasseCourt: string,
  Genre: string,
  BE: string,
  Demiboursier: string,
}

export interface IChp2_B {
  orderby: number;
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

export interface IChp3_A {
  Periode:string, 
  Activite_menee:string, 
  Observations:string, 
}

export interface IChp3_B {
  Dates:string, 
  NomComplet:string, 
  MatriculeNational:string, 
  ClasseCourt:string, 
  Genre:string, 
  Objet:string, 
  Decision:string, 
}

export interface IChp3_C {
  Club:string, 
  Dates:string, 
  ActiviteMenee:string, 
}

export interface IChp3_D_1 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Genre:string, 
  Observations:string, 
}

export interface IChp3_D_2 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Genre:string, 
  ProblemePsycho:string, 
  Observations:string, 
}


export interface IChp3_D_3 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Age:string, 
  TermeTheorique:string, 
  QualiteAuteur:string, 
  Auteur:string, 
  ProblemePsycho:string, 
  FonctionAuteur:string, 
}

export interface IChp3_D_4 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Genre:string, 
  DateDepotCertificat:string, 
  NatureMaladie:string, 
  DureeMaladie:string, 
}

export interface IChp3_D_5 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Genre:string, 
  DateDeces:string, 
  CauseDeces:string,   
}

//fin




