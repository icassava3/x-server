//Convert from clipboard (Shift + Ctrl + Alt + V)

export interface IRapportLabel {
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

export interface IEnregistrementObservation {
  IdAppréciation: string;
  Niveau: string;
  Appréciations: string;
  NotePlancher: number;
  NotePlafond: number;
}

export interface IEnregistrementMoyenne {
  RefNiveau: string;
  RefClasse: string;
  ClasseLong: string;
  ClasseCourt: string;
  MatriculeNational: string;
  NomComplet: string;
  DateNaiss: string;
  Genre: string;
  Nationalite: string;
  Redoub: string;
  Lang1: string;
  Lang2: string;
  MoyG3: number | string;
  RangG3: string;
  MS: string;
  ProfP: string;
  StatutEleve: string;
  NumDeciAffect: string;
  Obs: string;
  Educ: string;
  RefTypeClasse: string;
}
export interface IType1 {
  label: string;
  bg: string;
  cols: number;
}

export interface IResultRow {
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
  c6: number;
  c7: number;
  c8: number;
  c9: number;
  inscritFille: string;
  inscritGarçon: string;
  totalInscrit: string;
  presentFille: string;
  presentGarçon: string;
  totalPresent: string;
  admisFille: string;
  admisGarçon: string;
  totalAdmis: string;
}

