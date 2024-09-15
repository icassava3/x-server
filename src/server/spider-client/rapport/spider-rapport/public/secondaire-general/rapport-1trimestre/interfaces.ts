//Convert from clipboard (Shift + Ctrl + Alt + V)

export interface IChp1A_3_a {
  ResponsableEtab: string,
  Discipline: string,
  NomComplet: string,
  Etab: string,
  Contact: string
}

export interface IChp1A_3_b {
  Discipline: string,
  DatePeriode: string,
  TypeActivite: string,
  AnimateurTheme: string,
}

export interface IChp1A_4_a {
  Discipline: string,
  Responsable: string,
  Emploi: string,
  Contact: string,
}
export interface IChp1A_4_b {
  Discipline: string,
  DatePeriode: string,
  TypeActivite: string,
  AnimateurTheme: string,
}

export interface IChp1A_5_a {
  Visiteur:string,
  typeVisiteur:string,
  nomVisiteur: string,
  NomCompletProf: string,
  Discipline: string,
  Classe: string,
  Dates: string,
  Heures: string,
}

export interface IChp1A_5_b {
  Visiteur: string,
  NomCompletProf: string,
  Discipline: string,
  Classe: string,
  Dates: string,
  Heures: string,
}

export interface IChp1A_5_c {
  Visiteur: string,
  NomCompletProf: string,
  Discipline: string,
  Classe: string,
  Dates: string,
  Heures: string,
}

export interface IChp1A_6 {
  Discipline: string,
  DateFormation: string,
  ThemeEtLieu: string,
  AnimateurDuTheme: string,
}

export interface IChp1B_1 {
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

export interface IChp1B_1_Result {
  bg: string;
  group: string;
  label: string;
  cols: [];
}


export interface IChp1B_2 {
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

}

export interface IChp1B_3 {
  RefTypeClasse: number;
  MoyG1: number;
  NiveauCourt: string;
  label: string;
  ClasseCourt: string;
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
  RangG1: string;
}

export interface IChp1B_4 {
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
export interface IChp2A {
  MatriculeNational: string,
  NomComplet: string,
  Genre: string,
  ClasseCourt: string,
  Age: number,
  Redoub: string,
  Nat: string,
  EtsOrig: string,
}

export interface IChp2B {
  MatriculeNational: string,
  NomComplet: string,
  ClasseCourt: string,
  Genre: string,
  BE: string,
  Demiboursier: string,
}

export interface IChp2C {
  annee: string,
  genre: string,
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
  StOTAL: number,
  filière: number,
}
export interface IChp2D {
  CycleX: string,
  NiveauSerie: string,
  NbreClasses: number,
  G1: number,
  F1: number,
  T1: number,
  G2: number,
  F2: number,
  T2: number,
  G3: number,
  F3: number,
  T3: number,
  G4: number,
  F4: number,
  T4: number,
  TG: number,
  TF: number,
  TT: number,
}

export interface IChp3A_1 {
  NomComplet:string, 
  Genre:string, 
  Fonction:string, 
  QualiteMembre:string, 
  Contact:string, 
}
export interface IChp3A_2 {
  Periode:string, 
  Activite_menee:string, 
  Observations:string, 
}
export interface IChp3B_1 {
  NomComplet:string, 
  Genre:string, 
  Fonction:string, 
  QualiteMembre:string, 
  Contact:string, 
}
export interface IChp3B_2 {
  Dates:string, 
  NomComplet:string, 
  MatriculeNational:string, 
  ClasseCourt:string, 
  Genre:string, 
  Objet:string, 
  Decision:string, 
}
export interface IChp3C {
  Club:string, 
  Dates:string, 
  ActiviteMenee:string, 
}
export interface IChp3D_1 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Genre:string, 
  Observations:string, 
}
export interface IChp3D_2 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Genre:string, 
  ProblemePsycho:string, 
  Observations:string, 
}
export interface IChp3D_3 {
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
export interface IChp3D_4 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Genre:string, 
  DateDepotCertificat:string, 
  NatureMaladie:string, 
  DureeMaladie:string, 
}
export interface IChp3D_5 {
  MatriculeNational:string, 
  NomComplet:string, 
  ClasseCourt:string, 
  Genre:string, 
  DateDeces:string, 
  CauseDeces:string,   
}
export interface IChp4A_1 {
  NomComplet:string, 
  Matricule:string, 
  Genre:string, 
  Emploi:string, 
  Fonction:string, 
  NomCorps:string, 
  FonctionActuelle:string, 
  Contact:string, 
}
export interface IChp4A_2 {
  Fonction:string, 
  Existant_femmes:string, 
  Existant_garcons:string, 
  qte_besoin:string, 
  Observations:string, 
}
export interface IChp4B_1 {
  NomComplet:string, 
  Matricule:string, 
  Fonction:string, 
  Discipline:string, 
  Genre:string, 
  NomCorps:string, 
  Contact:string, 
  TélPers:string, 
}
export interface IChp4B_2 {
  Discipline:string, 
  Genre:string, 
  Cycle:string, 
  Femme_prof_cycle1:number, 
  Homme_prof_cycle1:number, 
  Total_prof_cycle1:number, 
  Besoin_prof_cycle1:number, 
  Femme_prof_cycle2:number, 
  Homme_prof_cycle2:number, 
  Total_prof_cycle2:number, 
  Besoin_prof_cycle2:number, 
  Femme_prof_total:number,  
  Homme_prof_total:number, 
  Total_prof_total:number, 
  Besoin_prof_total:number,
}
export interface IChp4C_1 {
  NomComplet:string, 
  Matricule:string, 
  Genre:string, 
  Fonction:string, 
  Contact:string, 
}
export interface IChp4C_2 {
  Fonction:string, 
  Femme_existant:number, 
  Homme_existant:number, 
  Besoins_existant:number, 
  Observations:string, 
  qte_besoin:string, 
  Genre:string
}
export interface IChp5A_1 {
  Locaux:string, 
  Toiture:string, 
  Plafond:string, 
  Mur:string, 
  Plancher:string, 
  Portes:string, 
  Fenetres:string, 
  Electricite:string, 
  Plomberie:string, 
}
export interface IChp5A_2 {
  TypesInstallation:string, 
  Etats:string, 
  Besoins:number, 
}
export interface IChp5A_3_a {
  Designation:string, 
  Bon:string, 
  Passable:string, 
  HorsUsage:string, 
  Total:string, 
  Besoins:string, 
}
export interface IChp5A_3_b {
  Designation:string, 
  Bon:string, 
  Passable:string, 
  HorsUsage:string, 
  Total:string, 
  Besoins:string, 
}
export interface IChp5A_3_c {
  Designation:string, 
  Bon:string, 
  Passable:string, 
  HorsUsage:string, 
  Total:string, 
  Besoins:string, 
}
export interface IChp5B_1_a {
  DatesPeriodes:string, 
  ActivitesMenees:string, 
  Observations:string, 
}
export interface IChp5B_1_b {
  EffectifTotal:number, 
  SommeAllouee:number, 
  Depenses:number, 
  Disponible:number, 
}
export interface IChp5B_2 {
  EffectifTotal:number, 
  BudgetGeneral1:number, 
  Faes1:number, 
  BudgetGeneral2:number, 
  Faes2:number, 
  BudgetGeneral3:number, 
  Faes3:number, 
}

export interface IReportData {
  intro: string;
  chp1: string;
  chp1_A: string;
  chp1_A_1: string;
  chp1_A_2: string;
  chp1_A_2_a: string;
  chp1_A_2_b: string;
  chp1_A_2_c: string;
  chp1_A_3: string;
  chp1_A_3_a: string;
  chp1_A_3_a_comment: string;
  chp1_A_3_b: string;
  chp1_A_3_b_comment: string;
  chp1_A_4: string;
  chp1_A_4_a: string;
  chp1_A_4_a_comment: string;
  chp1_A_4_b: string;
  chp1_A_4_b_comment: string;
  chp1_A_5: string;
  chp1_A_5_a: string;
  chp1_A_5_b: string;
  chp1_A_5_b_comment: string;
  chp1_A_5_c: string;
  chp1_A_5_c_comment: string;
  chp1_A_6: string;
  chp1_A_6_comment: string;
  chp1_B: string;
  chp1_B_1: string;
  chp1_B_1_comment: string;
  chp1_B_2: string;
  chp1_B_3: string;
  chp1_B_4: string;
  chp1_B_4_comment: string;
  chp2: string;
  chp2_A: string;
  chp2_A_comment: string;
  chp2_B: string;
  chp2_B_comment: string;
  chp2_C: string;
  chp2_C_comment: string;
  chp2_D: string;
  chp2_D_comment: string;
  chp3: string;
  chp3_A: string;
  chp3_A_1: string;
  chp3_A_2: string;
  chp3_A_2_comment: string;
  chp3_B: string;
  chp3_B_1: string;
  chp3_B_2: string;
  chp3_B_2_comment: string;
  chp3_C: string;
  chp3_C_comment: string;
  chp3_D: string;
  chp3_D_comment: string;
  chp3_E: string;
  chp3_E_1: string;
  chp3_E_1_comment: string;
  chp3_E_2: string;
  chp3_E_2_comment: string;
  chp3_E_3: string;
  chp3_E_3_comment: string;
  chp3_E_4: string;
  chp3_E_4_comment: string;
  chp3_E_5: string;
  chp3_E_5_comment: string;
  chp4: string;
  chp4_A: string;
  chp4_A_1: string;
  chp4_A_1_comment: string;
  chp4_A_2: string;
  chp4_A_2_comment: string;
  chp4_B: string;
  chp4_B_1: string;
  chp4_B_1_comment: string;
  chp4_B_2: string;
  chp4_B_2_comment: string;
  chp4_C: string;
  chp4_C_1: string;
  chp4_C_2: string;
  chp4_C_2_comment: string;
  chp5: string;
  chp5_A: string;
  chp5_A_1: string;
  chp5_B: string;
  chp5_B_1: string;
  chp5_B_a_comment: string;
  chp5_A_b: string;
  chp5_B_1_b_comment: string;
  chp5_C: string;
  chp5_D: string;
  chp5_D_1: string;
  chp5_D_1_a: string;
  chp5_D_1_a_comment: string;
  chp5_D_1_b: string;
  chp5_D_1_b_comment: string;
  chp5_D_2: string;
  chp5_D_2_comment: string;
  conclu: string;
}