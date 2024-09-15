
export const PROF_EXPERT_SERVER_URL = process.env.NODE_ENV === "production"
    ? `https://profexpert.spider-api.com/v2`
    : "https://profexpert.spider-api.com/v2" // `http://127.0.0.1:1974/v2`
    // : "https://profexpert.spider-api.com/v2" // `http://127.0.0.1:1974/v2`

export const PROF_EXPERT_SERV = "PROF_EXPERT_SERV";
export const profDataDir = `C:/SPIDER/prof-data`