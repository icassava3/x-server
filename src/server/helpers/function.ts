import CryptoJS from "crypto-js"
import { IRecentActivity } from "../../client/store/interfaces";
import { _executeSql, _selectSql } from "../databases";
import { statisticsData, statisticsPhoto } from "../spider-dashboard/services";
const ini = require("ini");
const fs = require("fs");
const path = require("path");
var hddserial = require('hddserial');

interface Iplages {
  idPlage: number;
  heureDebut: string;
  heureFin: string;
}
/**
 * Obtenir le serial number du 1er disque dur
 */
export const getHDDSerialNumber = () => {
  try {
    hddserial.first(function (err, serial) {
      console.log("hdd serial for first hdd : %s", serial);
      return serial
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: function.ts ~ line 25 ~ getAccessConfig ~ error",
      error
    );
  }
};



export const formatErrors = () => { };

/**
 *Function pour formater un nombre avec des zeros non significatifs
 *@number: le nombre à formater
 *@nbDigit: la longueur de la chaine à obtenir
 */
export const pFormat = (number: string | number, nbDigit: number) => {
  const nbZ = nbDigit - number.toString().length;
  return "0".repeat(nbZ) + number.toString();
};

export const getCodeEtabFromIdEtab = (idEtablissement: string) => { };

/**
 * reduire une le format d'une année scolaire en prenant les deux derniers nombre de chaque année
 * @param year l'année scolaire au format xxxx-yyyy
 * @return string
 */
export const reduceSchoolYear = (schoolYear: string) => {
  const patern = /^([0-9]){4}-([0-9]{4})$/; //regex verifier le format
  if (patern.test(schoolYear)) {
    const years = schoolYear.split("-");
    const firstPart = years[0].slice(-2);
    const secondPart = years[1].slice(-2);
    return `${firstPart}${secondPart}`;
  } else {
    throw "Format année scolaire incorrect";
  }
};

/**
 * sleep pendant x seconde
 * @param ms
 * @returns
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const splitArray = (inArr, size) => {
  //size - child_array.length
  const arr = [...inArr];
  var out = [],
    i = 0,
    n = Math.ceil(arr.length / size);
  while (i < n) {
    out.push(
      arr.splice(0, i == n - 1 && size < arr.length ? arr.length : size)
    );
    i++;
  }
  return out;
};

/**
 * ecrire dans la session LOCAL_SERVER du ficchier config.ini du server
 * @param url l'url du server local
 */
export const configLocalServerUrl = (url) => {
  /* const config = ini.parse(fs.readFileSync("C:\\SPIDER\\Ressources\\config.ini", "utf-8"));
        config.LOCAL_SERVER = {}
        config.LOCAL_SERVER.url = url
        const iniText = ini.stringify(config);
        fs.writeFileSync("C:\\SPIDER\\Ressources\\config.ini", iniText); */
  try {
    const config = ini.parse(fs.readFileSync("C:\\SPIDER\\Ressources\\config.ini", "utf-8"));
    config.LOCAL_SERVER = {};
    config.LOCAL_SERVER.url = url;
    const iniText = ini.stringify(config);
    console.log("🚀 ~ file: function.ts ~ line 105 ~ configLocalServerUrl ~ iniText", iniText)
    fs.writeFileSync("C:\\SPIDER\\Ressources\\config.ini", iniText);
  } catch (error) {
    throw "Une erreur s'est produite lors de la configuration du server local";
  }
};

export const getTimeStamp = () => {
  return Math.round(+new Date() / 1000);
};


export const getFileToBase64 = (filePath: string): Promise<String> => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = filePath;
      if (fs.existsSync(file)) {
        const fileBase64 = fs.readFileSync(file, 'base64');
        resolve(`${fileBase64}`);
        // resolve(`data:image/jpeg;base64,${fileBase64}`);
      } else {
        resolve('');
      }
    } catch (error) {
      console.log('error in getFileToBase64.....', error.message)
      reject(error)
    }
  });
};

export const encryptQr = (value: string) => {
  let result = "";
  for (let i = 0; i < value.length; i++) {
    result += String.fromCharCode(value.charCodeAt(i) + 10);
  }
  return result;
}

export const decryptQr = (value: string) => {
  let result = "";
  for (let i = 0; i < value.length; i++) {
    result += String.fromCharCode(value.charCodeAt(i) - 10);
  }
  return result;
}

//diviser un tableau en plusieurs tableau
export const chunksArray = (array, chunkSize) => {
  const res = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

export const merge2ArraysOfObjects = (arr1: any[], arr2: any[], key: string) => arr1.map(a => ({ ...a, ...arr2.find(b => b[key] === a[key]) }))
export const merge2ArraysOfObjectsBy2Keys = (arr1: any[], arr2: any[], key1: string, key2: string) => arr1.map(a => ({ ...a, ...arr2.find(b => b[key1] === a[key1] && b[key2] === a[key2]) }))

/**
 *Fonction pour savoir si un processus (programme) est lancé
 * @param {string} processName The executable name to check
 * @param {function} cb The callback function
 * @returns {boolean} True: Process running, else false
 */
export function isProcessRunning(processName, cb) {
  const cmd = (() => {
    switch (process.platform) {
      case 'win32': return `tasklist`;
      case 'darwin': return `ps -ax | grep ${processName}`;
      case 'linux': return `ps -A`;
      default: return false;
    }
  })();
  require('child_process').exec(cmd, (err, stdout, stderr) => {
    cb(stdout.toLowerCase().indexOf(processName.toLowerCase()) > -1);
  });
}

/**
 * permet de faire une pause de x milliseconds
 * @param delay 
 * @returns 
 */
export const pause = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

/**
 * Savoir si le process lancé avec child_process 
 * est toujours en marche
 * @param pid process identifier
 * @returns 
 */
export const isRunning = (pid: number) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Obtenir la date et lheure d'aujourdh'ui au format dd/mm/yyyy hh:mm:ss
 */
export const getTodayDateTime = () => {
  const d = new Date()
  const date = d.toISOString().split('T')[0];
  const time = d.toTimeString().split(' ')[0];
  return `${date} ${time}`
}


/**
 * convetir une date de format iso a format yyyy-mm-dd hh:mm:ss
 * eg:2023-04-17T12:06:10.000Z ===> 2023-04-17 12:06:10
 * @param isoDate 
 * @returns 
 */
export const isoDateToDateTime = (isoDate) => {
  const date = new Date(isoDate);
  const formattedDate = date.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
  return formattedDate;
}

/**
 * Décrypter le payload venant du web client
 * @param data payload crypté
 * @param key la clé de dechiffrement
 */
export function decryptPayload(data: any, key: string) {
  const bytes = CryptoJS.AES.decrypt(data, key);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData
}
export const encryptPayload = (data: any, key: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  return ciphertext
};

export function trouverPlageHoraire(heure: string, plages: Iplages[]) {
  console.log("🚀 ~ file: function.ts:249 ~ trouverPlageHoraire ~ plages:", plages)
  // const plages = [
  //   { id: 1, heureDebut: "08:00", heureFin: "11:59" },
  //   { id: 2, heureDebut: "12:00", heureFin: "15:59" },
  //   { id: 3, heureDebut: "16:00", heureFin: "23:59" }
  // ];
  // Convertir l'heure envoyée en objet Date
  const heureRecherchee = new Date(`2000-01-01T${heure}`);
  // Parcourir les plages pour trouver la correspondance
  for (const plage of plages) {
    const heureDebutPlage = new Date(`2000-01-01T${plage.heureDebut}`);
    const heureFinPlage = new Date(`2000-01-01T${plage.heureFin}`);
    // Vérifier si l'heure recherchée est dans la plage actuelle
    if (heureRecherchee >= heureDebutPlage && heureRecherchee <= heureFinPlage) {
      return plage;
    }
  }
  // Si aucune plage n'est trouvée, renvoyer null ou une valeur par défaut
  return null;
}


export const updateDashboardServiceStatus = (io: any, serviceId: string, status: boolean) => {
  const data = { "SERV_SCHOOL_CONTROL": "schoolControl", "SERV_CINETPAY": "cinetpay" }
  io.emit("updateDashboard", { [data[serviceId]]: status })
}


export const countJPGFiles = (directoryPath: string): number => {
  let jpgCount = 0;
  // Vérifie si le répertoire existe
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const filePath = path.join(directoryPath, file);
      if (fs.statSync(filePath).isFile() && path.extname(file).toLowerCase() === '.jpg') {
        jpgCount++;
      }
    });
  }
  return jpgCount;
}

export const getAllStatEtab = async (directoryPath: string, io: any) => {
  try {
    const statEtab = await statisticsData()
    const studentPhotoCountInBD: any = await statisticsPhoto()
    const studentPhotoCountInFolder = countJPGFiles(directoryPath)
    io.emit("allStatEtab", { statEtab, studentPhotoCountInBD: studentPhotoCountInBD?.totalPhotos, studentPhotoCountInFolder })
  } catch (error) {
    console.log("aaaaaaaaaaaa", error)
  }
}

/**
 * Verifier si une variable est un object
 * @param variable 
 * @returns 
 */
export const isObject = (variable: string) => {
  return variable !== null && typeof variable === 'object' && !Array.isArray(variable);
}

/**
 * verifier qu'on object ne contient que certains proprietes
 * @param obj l'object a verifier
 * @param properties les proprietes 
 * @returns 
 */
export const hasOnlyProperties = (obj: any, properties: string[]) => {
  return Object.keys(obj).length === properties.length &&
    properties.every(prop => Object.keys(obj).includes(prop));
}

export const convertDateToLocaleStringDate = (date: any) => {
  return new Date(date).toLocaleString("fr-FR", {
    timeZone: "UTC",
    month: "numeric",
    day: "numeric",
    year: "numeric",
  })
}
export const voyelles = ["A", "E", "I", "O", "U", "Y"]

interface PeriodeData {
  idPeriode: number;
  libPeriode: string;
}

export const getPeriodeData = (periode: number): PeriodeData[] => {
  const periodeMapping: Record<number, PeriodeData[]> = {
    0: [
      { idPeriode: 1, libPeriode: "1er trimestre" },
      { idPeriode: 2, libPeriode: "2è trimestre" },
      { idPeriode: 3, libPeriode: "3è trimestre" },
    ],
    1: [
      { idPeriode: 1, libPeriode: "1er semestre" },
      { idPeriode: 3, libPeriode: "2è semestre" },
    ],
  };
  return periodeMapping[periode] || [];
};
export const regrouperEvaluationParEleve = (data: any[]): any[] => {
  const evalData: { [key: number]: any } = {};
  data.forEach((item) => {
    const idEleve = item.idEleve;
    if (!evalData[idEleve]) {
      evalData[idEleve] = {
        ...item,
        compositions: [],
        checked: false
      };
    }
    evalData[idEleve].compositions.push(
      item.composition,
    );
    // evalData[idEleve] = {...evalData[idEleve], [item?.libelleMatiere]: item?.note};
  });
  return Object.values(evalData);
}


export const convertirFormatDate = (dateString) => {
  const date = new Date(dateString);

  const jour = date.getDate().toString().padStart(2, '0');
  const mois = (date.getMonth() + 1).toString().padStart(2, '0');
  const annee = date.getFullYear();

  return `${jour}/${mois}/${annee}`;
}

/**
 * Permet de formater la période en 2ème TRIMESTRE, 1er SEMESTRE, ...
 * @param decoupsemestres 
 * @param trimestre 
 * @returns 
 */
export const getLibPeriod = (decoupsemestres: string, trimestre: number): string => {
  const period = decoupsemestres === "0" ? "TRIMESTRE" : "SEMESTRE";
  const label = trimestre === 1 ? "er" : "ème";
  return `${trimestre}${label} ${period}`;
}

/**
 * Permet d'enlever tous les accents et les espaces dans un libellé en les remplaçant par "_"
 */
export const normalizeLib = (libelle: string): string => libelle
  .normalize("NFD")
  // @ts-ignore
  .replace(/\p{Diacritic}/gu, "")
  .replace(/ /g, "_");
