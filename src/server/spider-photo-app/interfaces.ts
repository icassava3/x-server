
export interface IReqQueryProgInfos {
  photographerId: string;
  photographerName: string;
}

export interface IStudentPhotoForMobileApp {
  _id: number;
  matricule: string;
  nom: string;
  prenom: string;
  dateNaiss: string;
  idClasse: number;
  classe: string;
  RefTypeClasse?: number;
  photo?: string | undefined;
  photoUploaded?: boolean;
  photoDir?: string;
  anScol?: string;
  codeEtab?: string;
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
  codeEtab?: string;
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


export interface IstudentDataPhotoShare {
  codeEtab: string;
  anScol: string;
  id: number
  matricule: string;
  nom_pre: string;
}

export interface IStudentPhotoB64 {
  _id: number | string;
  photo: string;
}

export interface IPhotoUploadPayload {
  anScol: string;
  codeEtab: string;
  students: IStudentPhotoB64[];
  photographerId: string;
  photographerName: string;
  deviceModel: string;
  socketId: string;
}

export interface IEmployeesPhotoUploadPayload {
  anScol: string;
  codeEtab: string;
  employees: IStudentPhotoB64[];
  photographerId: string;
  photographerName: string;
  deviceModel: string;
  socketId: string;
}



