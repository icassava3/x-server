// export const FOCUS_ECOLE_SERV_ID = "SERV_FOCUS_ECOLE"
export const WAREHOUSE_SERV_ID = "SERV_WAREHOUSE"
export const WAREHOUSE_PART_ID = "PART_WAREHOUSE"
export const WAREHOUSE_LIBELLE = "Warehouse"
export const WAREHOUSE_DESCRIPTION = "description du service warehouse"

export const WHSERVER_BASE_URL = process.env.NODE_ENV === "production"
    ? `https://wh.spider-api.com/v1`
    // : `http://127.0.0.1:1978/v1`       
    : `https://wh.spider-api.com/v1`       
    // ? "http://127.0.0.1:1978/v1" 
    // : "http://127.0.0.1:1978/v1"       

export const WAREHOUSE_LOG_ACTIONS = {
    ENVOYER_VERSEMENT: "ENVOYER_VERSEMENT"
}

export const partenairesymtelId = "PART_SYMTEL";
export const partenaireEdiattahId = "PART_EDIATTAH";
export const partenaireGainId = "PART_GAIN";
export const partenaireMemoId = "PART_MEMO";
export const partenaireCampusFranceId = "PART_CAMPUS";
export const partenaireCinetPayId = "PART_CINETPAY";
export const partenaireFocusEcoleId = "PART_FOCUS_ECOLE";
export const partenaireSchoolControlId = "PART_SCHOOL_CONTROL";