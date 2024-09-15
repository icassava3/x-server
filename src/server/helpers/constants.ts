export const PHOTOSHARE_BASE_URL = process.env.NODE_ENV === "production"
    // ? `http://192.168.137.1:1977/v2`
    // : `http://192.168.137.1:1977/v2`
? `https://photoshare.spider-api.com/v2`
: `https://photoshare.spider-api.com/v2`

export const SPIDER_GAIN_API_ID = 14678

export const GLOBAL_API_BASE_URL = process.env.NODE_ENV === "production"
    ? `https://global.spider-api.com/v1`
    : `https://global.spider-api.com/v1`  // "http://127.0.0.1:8001/v1"

export const FOCUS_ECOLE_BASE_URL = process.env.NODE_ENV === "production"
    ? `https://focusecole.spider-api.com/v1`
    : `https://focusecole.spider-api.com/v1`
    // ? `http://127.0.0.1:1972/v1`
    // : `http://127.0.0.1:1972/v1`

//dossier de telechargement temporaire spider
export const tmpDownloadDir = `C:/SPIDER/spd_save_tmp`;

export const SESSION_SECRET = "secret$%^134";
export const DB_PWD = "Pwd2021!";
export const SQLITE_PWD = "Pwd2021";

export const REDIS_ENCRYPT_KEY = "%0ms6B#@2b@a3#1XOVa0"
export const REDIS_PWD='@rEDis2023'
export const REDIS_USER='xsrv'

