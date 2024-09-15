export const CINETPAY_SERV_ID = "SERV_CINETPAY"//l'id du service cinetpay dans la base sqlite local
export const CINETPAY_SERVER_BASE_URL = process.env.NODE_ENV === "production"
    ? `https://cinetpay.spider-api.com/v1`
    : `https://cinetpay.spider-api.com/v1` // "http://127.0.0.1:1971"