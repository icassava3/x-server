export interface IParamEtabItem {
  param_name: string;
  param_value: string;
}

export interface IAccessConfig {
  rootDir: string;
  appPath: string;
  currentDB: string;
  studentsPhotoDir: string;
  currentCodeEtab: string;
  currentAnScol: string;
  dbPath: string;
  persPhotoDir:string;
};

export interface IGlobalApiServerUser {
  userPhone: string;
  appID: string;
  profile: string;
  password: string;
  refreshToken: string;
  _id: number;
  token: string;
};


export interface IWarehouseConfig {
  anneeScolaire: string;
  codeEtab: string;
  hddserialnumber: string;
};
