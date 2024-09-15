
export interface ISendStudentsPhotos {
  idEleve: number;
  idClasse?: number;
  photo: string | "";
  nomEleve:string;
  prenomEleve:string;
}

export interface IPersPhotoForMobileApp {
  _id: number;
  nom: string;
  prenom: string;
  fonction: string;
  photo?: string | undefined;
  photoUploaded?: boolean;
  photoDir?: string;
  anScol?: string;
  codeEtab?:string;
}

export interface IParamEtabItem {
  param_name: string;
  param_value: string;
}

export interface IStudentPhotoInfos {
  studentId: string | number;
  matricule?: string | null;
  nomPrenom: string;
  classe: string;
}

export interface IExecuteResult {
  affectedRows: number,
  lastId: number
}

export interface IClasseItem {
  idClasse: number;
  classe: string;
  OrdreClasse: number;
}


export  interface IstudentDataPhotoShare  {
  codeEtab:  string;
  anScol:  string;
  id: number
  matricule:  string;
  nom_pre:  string;
}

