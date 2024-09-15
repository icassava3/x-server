
import redisJSON from "redis-json";
import { redisClient } from ".";



export const cacheControleFraisScolaire = new redisJSON(redisClient, {
    prefix: 'controlefraisScolaire:',
    stringifier: {
        Date: (val) => val.toISOString()
    },
    parser: {
        Date: (str) => new Date(str)
    }
});

export const cacheHistoriquePointage = new redisJSON(redisClient, {
    prefix: 'historiquepointage:',
    stringifier: {
        Date: (val) => val.toISOString()
    },
    parser: {
        Date: (str) => new Date(str)
    }
});