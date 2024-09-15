export interface IGainStudentItem {
  ideleve: number;
  nomfamille: string;
  prenoms: string;
  statut: string;
  sexe: string;
  niveau: string;
  idclasse: string;
  matricule: string;
  datenaissance: string;
  lieunaissance: string;
  mobile: string;
  redoublant: string;
}

export interface IGainPaymentItem {
  ideleve: string;
  montant: number;
  numeropiece: string;
  modepaiement: string;
  libelle: string;
}


export interface IGainClassItem {
  idclasse: string;
  nom: string;
  branche: string;
  niveau: string;
  serie: string;
  lv2: string;
  salle: string;

}

export interface IGainEcheancierGlobalItem {
  branche: string;
  statut: string;
  montantancien: number;
  montantnouveau: number;
  datelimite: string;
  libelle: string;
  rubrique: string;
  periode: string;
}

export interface IGainEleveIdentifiantItem {
  ideleve: string;
  matricule: string;
}
export interface IGainLogItem {
  id: string;
  action: string;
  payload: number[]|null;
  statut: number;
  date: string;
}


export interface IGainEcheancierPersolItem {
  ideleve: string;
  montant: number;
  datelimite: string;
  libelle: string;
  rubrique: string;
  periode: string;
}

export interface ISpiderEcheancierPersoItem {
  ideleve: string;
  octobre: number | null;
  novembre: number | null;
  decembre: number | null;
  janvier: number | null;
  fevrier: number | null;
  mars: number | null;
  avril: number | null;
  mai: number | null;
  juin: number | null;
  septembre: number | null;
  libelle: string;
}

export interface ISpiderEcheancierGlobalItem {
  branche: string;
  statut: string;
  octobre: number | null;
  novembre: number | null;
  decembre: number | null;
  janvier: number | null;
  fevrier: number | null;
  mars: number | null;
  avril: number | null;
  mai: number | null;
  juin: number | null;
  septembre: number | null;
  libelle: string;
}

export interface ITypeEcheancier {
  type:"global"|"perso"
}