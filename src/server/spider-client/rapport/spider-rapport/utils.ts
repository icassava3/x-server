import { spawn } from "child_process";
import { Request } from "express";
import { fetchFromMsAccess, paramEtabObjet } from "../../../databases/accessDB";
import { appCnx } from "../../../databases/accessDB";
import { _selectSql } from "../../../databases/index";
import { IEnregistrementMoyenne, IEnregistrementObservation, IRapportLabel, IResultRow } from "./interfaces";
const fs = require("fs");
const _ = require("lodash");

const bg = { c1: "#EBEBEB", c2: "#E3E3E3" };
const jsonData = `C:/SPIDER/spd_save_tmp/jsonData.json`;
const path2 = require("path");

  
/**
 * Permet de passer les données json à python
 * utilisation:genererRapport
 */
export const pythonPromise = (data: any): Promise<String> => {
  return new Promise(async (resolve, reject) => {
    const { name_report, path_report, generated_report } = data;

    const templateDocxFile = process.env.NODE_ENV === "production"
      //@ts-ignore
      ? `${process.resourcesPath}/templates/rapports/${path_report}/${name_report}.docx`.replace(/\\/g, '/')
      : process.argv.slice(2)[0] === 'sqlite' //si le projet est lancé avec "yarn start-server"
        ? path2.resolve(__dirname, "..", "..", "..", "..", "..", "templates", "rapports", path_report, `${name_report}.docx`).replace(/\\/g, '/')
        : path2.resolve('./', 'templates', "rapports", path_report, `${name_report}.docx`).replace(/\\/g, '/')

    const outputDocxFile = `C:/SPIDER/spd_save_tmp/${generated_report}.docx`;
    const params = [jsonData, templateDocxFile, outputDocxFile];

    const pythonPath = process.env.NODE_ENV === "production"
      //@ts-ignore
      ? `${process.resourcesPath}/bin`.replace(/\\/g, '/')
      : process.argv.slice(2)[0] === 'sqlite' //si le projet est lancé avec "yarn start-server"
        ? path2.resolve(__dirname, "..", "..", "..", "..", "..", "bin").replace(/\\/g, '/')
        : path2.resolve('./', 'bin').replace(/\\/g, '/')

    console.log("🚀 ~ returnnewPromise ~ pythonPath:", pythonPath)

    const python = spawn("gendoc.exe", params, { cwd: pythonPath });

    console.log("params **************************", params);

    python.stdout.on("data", (data) => {
      resolve(data.toString());
    });

    python.stderr.on("data", (data) => {
      reject({ "err.python => +++ ": data.toString() });
    });

    python.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });
};

/**
 * permet de générer le fichier JSON
 * utilisation:genererRapport
 */
const createJsonFile = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const json = {
        data: {
          ...data,
        },
      };
      /*
        writeFile => crée le ficher et écrit des données
        writeFileSync=> écrit seulement des données dans le fichier existant
      */
      fs.writeFileSync(jsonData, JSON.stringify(json, null, 2), "utf8");
      resolve(true);
    } catch (err) {
      return reject(err);
    }
  });
};

//empécher les etabbliss qui sont techniques de télécharger le rapport
const isDownloaded = (): Promise<[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `
              SELECT Count(Elèves.RefElève) AS cpt
              FROM Classes INNER JOIN Elèves ON Classes.RefClasse = Elèves.RefClasse
              WHERE (((Classes.RefTypeClasse) Between 1 And 13));
            `;
      const sqlResult: any = await fetchFromMsAccess<any[]>(sql, appCnx);
      resolve(sqlResult);
    } catch (err: any) {
      console.log(`err =>   isDownloaded`);
      return reject(err);
    }
  });
};

export const serverUrl = (req: Request, reportName: string) => {
  const url = `${req.protocol}://${req.get("host")}/download/${reportName}`;
  return url;
};

const fileExists = (path: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let filePath = "";
      if (fs.existsSync(path)) {
        filePath = path;
      } else {
        filePath = "";
      }
      resolve(filePath);
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * quelques parametre (image,rtext) ajouter a notre main.py
 * utilisation:utilisé dans services
 */
const pythonParams = () => {
  const result = {
    //les paramètre qui se trouve sur le fichier main.py
    logo1: "",
    image1: "",
    rtext: "",
    text_bold: "",
    date_signature: new Date().toLocaleString("fr-FR").substring(0, 10),
  };
  return result;
};

/**
 * permet d'arrondir au 100è près
 */

const round2 = (data: any) => {
  return data.map((item) => Number(item.toFixed(2)));
};


/*objectif:replacer null par 0
 */
const nz = (data: any) => {
  return Number.isNaN(data) ? 0 : data;
};

/*objectif:replacer dans le tableau tous les 0 par vide ""
 */
const rav = (data: any) => {
  const ito = Object.values(data) as any;
  return ito.map((item) => (item === 0 || item === null ? "" : item));
};


/**
 * permet de remplacer 0 par vide "" dans les données de cols 
 * 
 * @param data
 * @returns
 */
const rav2 = (data: any[]) => {
  let newCols: any = [];
  const result = data.map((item: any, i: number) => {
    newCols = item.cols.map((item2: any, i2: number) => {
      return item2 === 0 || item2 === null ? "" : item2;
    });
    return {
      ...item, cols: newCols,
    };
  });
  return result;
}

/**
 * permet de compter le nombre d'élément de chaque label dans le tableau et retoune un objet
 * 
 * @param data
 * @returns
 */
const countLabel = (data: any) => {
  const count: any = {};
  data.forEach((item: any) => {
    if (count[item.label]) {
      count[item.label] += 1;
    } else {
      count[item.label] = 1;
    }
  });
  return count;
};

/* objectif: ajoute la ligne de la somme total
 * utilisation: 
 */
const addSumRow = (data: any[], label: string = "Total", bg: string = "#FFFF") => {
  let totalCols: any = [];
  let sum: any = [];
  const dataFormat = data.map((item: any, i: number) => {
    sum = item.cols.map((item2: any, i2: number) => {
      return item2 + totalCols[i2];
    });
    totalCols = totalCols.length > 0 ? [...sum] : [...item.cols];
    return { ...item };
  });
  return [...dataFormat, { bg: bg, label: label, cols: [...totalCols] }];
}


/* objectif: ajoute la ligne de pourcentage
 * utilisation: Rapport de rentrée
 */
const addPercentRow = (data: any[], label: string = "%") => {
  let total = []
  data.map((item) => {
    if (!total.length) {
      total = item.cols
      // console.log("total...", total)
    } else {
      const newTotal = item.cols.map((elt, i) => {
        const x = ((elt / total[i]) * 100).toFixed(2)
        // console.log("elt...", elt," | total[i]", total[i]," | i", i)
        return (total[i] === 0 || elt === 0 || Number.isNaN(elt)) ? 0 + '%' : x.replace('.00', '') + '%';
      })
      total = newTotal
    }
    // console.log(" total.length ...", total)
  })
  // console.log("total...", total)
  return [...data, { label: label, cols: [...total] }];
}

/* objectif: ajoute la ligne de pourcentage des lignes precedentes
 * utilisation: abidjan3 trim3
 */
const addPercentRow2 = (data: any[]) => {
  let total = []
  data.map((item) => {
    if (!total.length) {
      total = item.cols
    } else {
      const newTotal = item.cols.map((elt, i) => {
        const x = ((elt / total[i]) * 100).toFixed(2)
        return (total[i] === 0 || elt === 0 || Number.isNaN(elt)) ? 0 : x.replace('.00', '');
      })
      total = newTotal
    }
  })
  return [...total];
}


//  Faire la division de deux objet dans un tableau
const calculDivisionEntiere = (data: any[]) => {
  let resultat = [];

  for (var i = 0; i < data[0].cols.length; i++) {
    const division = data[0].cols[i] / data[1].cols[i];
    if (isNaN(division)) {
      resultat.push(0);
    } else {
      resultat.push(Math.floor(division));
    }
  }
  return resultat;
}
//  Faire la division de deux objet dans un tableau
const calculDivisionEntiere2 = (data: any[]) => {
  let resultat = [];

  for (var key in data[1]) {
    // if (key !== "TOTAL") {
    const division = data[1][key] / data[0][key];
    if (isNaN(division)) {
      resultat.push(0);
    } else {
      resultat.push(Math.floor(division));
    }
    // }
  }

  return resultat;
}

/**
 * Formater  les commentaires du tableau
 * @param data
 */
const formatReportLabel = (data: any) => {
  let newPlanRapport: any = {};
  data.map((item: any) => {
    const isComment =
      item.content === "" ? "" : "Commentaire : " + item.content;
    newPlanRapport = {
      ...newPlanRapport,
      [item.name]:
        item.name.substr(-8) === "_comment" ? isComment : item.content,
    };
  });
  return newPlanRapport;
};

/*objectif:permet de grouper les labels par année
 * utilisation:chp2_C
 */

export const formatGroupeByLabel = (contents) => {
  let labelArray: any = [];
  let newContents: any = [];

  contents.map((contentItem: any) => {
    if (newContents.length > 0 && labelArray.length > 0) {
      const isLabelExist = labelArray.includes(contentItem.label);
      if (isLabelExist) {
        const index = newContents.findIndex(
          (copyItem: any) => copyItem.label === contentItem.label
        );
        if (index < 0) {
          newContents.push(contentItem);
          labelArray.push(contentItem.label);
        } else {
          let newContentItem = { ...newContents[index] };
          const cols = [...newContentItem.cols];
          newContentItem.cols = [...cols, ...contentItem.cols];
          newContents = [
            ...newContents.slice(0, index),
            { ...newContentItem },
            ...newContents.slice(index + 1),
          ];
          labelArray.push(contentItem.label);
        }
      } else {
        newContents.push(contentItem);
        labelArray.push(contentItem.label);
      }
    } else {
      newContents.push(contentItem);
      labelArray.push(contentItem.label);
    }
  });

  // console.log("formatGroupeByLabel...", JSON.stringify(newContents))
  return newContents;
};


/* objectif: somme total de filles et garçons pour une année
 * utilisation: chp2_C
 */
const addTRow = (data: any) => {
  let newData: any = [];
  newData = data.map((contentItem: any) => {
    let totalObject: any = {};
    let totalCol: any = [];
    let formatedCols: any = [];
    contentItem.cols.map((colItem: any) => {
      let newCol: any = [];
      if (totalCol.length > 0) {
        const sum = colItem.col.map((col: any, colIndex: number) => {
          const formatedCol = col === 0 ? "" : col;
          newCol.push(formatedCol);
          return col + totalCol[colIndex];
        });
        totalCol = sum;
      } else {
        colItem.col.map((col: any, colIndex: number) => {
          const formatedCol = col === 0 ? "" : col;
          newCol.push(formatedCol);
        });
        totalCol = [...colItem.col];
      }
      if (colItem.libelle === "G") {
        formatedCols.unshift({ ...colItem, col: newCol });
      } else {
        formatedCols.push({ ...colItem, col: newCol });
      }
    });

    if (formatedCols.length === 1) {
      const findformatedCols: any = formatedCols[0].col;
      let i: number = 0;
      let nombreLigne: number = findformatedCols.length;
      let newCols: any = [];
      for (i; i < nombreLigne; i++) {
        newCols.push("");
      }

      if (formatedCols[0].libelle === "G") {
        formatedCols.push({ libelle: "F", col: newCols });
      } else {
        formatedCols.unshift({ libelle: "G", col: newCols });
      }
    }

    const newItems = totalCol.map((item: any) => (item === 0 ? "" : item));
    totalObject = { libelle: "T", col: newItems };
    const newCols = [...formatedCols, totalObject];

    return { ...contentItem, cols: newCols };
  }); //
  // console.log("newData....", JSON.stringify(newData))
  return newData;
};



/* objectif: somme total de filles et garçons pour une année
 * utilisation: REPARTITION DES ELEVES PAR ANNEE DE NAISSANCE
 */
const addGFTRow = (data: any) => {
  let newData: any = [];
  newData = data.map((contentItem: any) => {
    let totalObject: any = {};
    let totalCol: any = [];
    let formatedCols: any = [];
    contentItem.cols.map((colItem: any) => {
      let newCol: any = [];
      if (totalCol.length > 0) {
        const sum = colItem.col.map((col: any, colIndex: number) => {
          const formatedCol = col === 0 ? "" : col;
          newCol.push(formatedCol);
          return col + totalCol[colIndex];
        });
        totalCol = sum;
      } else {
        colItem.col.map((col: any, colIndex: number) => {
          const formatedCol = col === 0 ? "" : col;
          newCol.push(formatedCol);
        });
        totalCol = [...colItem.col];
      }

      if (colItem.genre === "G") {
        formatedCols.unshift({ ...colItem, col: newCol });
      } else {
        formatedCols.push({ ...colItem, col: newCol });
      }


    });

    if (formatedCols.length === 1) {
      const findformatedCols: any = formatedCols[0].col;
      let i: number = 0;
      let nombreLigne: number = findformatedCols.length;
      let newCols: any = [];
      for (i; i < nombreLigne; i++) {
        newCols.push("");
      }

      if (formatedCols[0].genre === "G") {
        formatedCols.push({ genre: "F", col: newCols });
      } else {
        formatedCols.unshift({ genre: "G", col: newCols });
      }

    }

    const newItems = totalCol.map((item: any) => (item === 0 ? "" : item));
    totalObject = { genre: "T", col: newItems };
    const newCols = [...formatedCols, totalObject];

    return { ...contentItem, cols: newCols };
  }); //
  // console.log("newData....", JSON.stringify(newData))
  return newData;
};

/*objectif:permet de grouper et d'ajouter le total des colonnes
 * utilisation:chp1_B_1
 */
const formatGroupBy = (contents: any) => {
  let labelArray: any = [];
  let newContents: any = [];
  const contentsCopy = [...contents];
  let contentsTotal: any = [];
  let newContentsTotal: any = [];
  const bg1 = bg.c1;
  const bg2 = bg.c2;
  // console.log("contentsCopy ...", contentsCopy);
  contents.map((contentItem: any) => {
    const isLabelExist = labelArray.includes(contentItem.group);
    if (!isLabelExist) {
      // console.log("isLabelExist ...", isLabelExist)

      const filterContentsByLabel = contentsCopy.filter(
        (item: any) => item.group === contentItem.group
      );
      // console.log("filterContentsByLabel...++", filterContentsByLabel)
      //on fait la somme des colonnes par groupe pour calculer le total du groupe
      let contentGroupeLabelTotal: any = [];
      if (filterContentsByLabel.length > 1) {
        filterContentsByLabel.map((groupedContentItem: any, i: number) => {
          if (contentGroupeLabelTotal.length > 0) {
            const sum = groupedContentItem.cols.map(
              (col: any, colIndex: number) => {
                return (col + contentGroupeLabelTotal[colIndex]);
              }
            );
            contentGroupeLabelTotal = [...sum];
          } else {
            contentGroupeLabelTotal = [...groupedContentItem.cols];
          }

          // Calculer les pourcentages
          if (i === filterContentsByLabel.length - 1) {
            const copyContentGroupeLabelTotal = [...contentGroupeLabelTotal];
            const sum = copyContentGroupeLabelTotal.map(
              (col: any, colIndex: number) => {
                // const newCol = [4, 6, 8].includes(colIndex)
                //   ? ((contentGroupeLabelTotal[colIndex - 1] /contentGroupeLabelTotal[1]) *100)
                //   : (col);
                return nz(col);
              }
            );
            contentGroupeLabelTotal = [...sum];
          }
        });

        const reformatFilterContentsByLabel = [
          ...filterContentsByLabel,
          {
            bg: bg1,
            label: `Total ${contentItem.group}`,
            cols: round2(contentGroupeLabelTotal),
          },
        ];
        // console.log("reformatFilterContentsByLabel...", reformatFilterContentsByLabel)
        // return;
        newContents = [...newContents, ...reformatFilterContentsByLabel];
        contentsTotal.push({
          label: `Total ${contentItem.group}`,
          cols: round2(contentGroupeLabelTotal),
        });
        // labelArray.push(contentItem.label)
      } else {
        const reformatFilterContentsByLabel = [
          ...filterContentsByLabel,
          {
            bg: bg1,
            label: `Total ${contentItem.group}`,
            cols: round2(contentItem.cols),
          },
        ];
        newContents = [...newContents, ...reformatFilterContentsByLabel];
        contentsTotal.push({
          label: `Total ${contentItem.group}`,
          cols: round2(contentItem.cols),
        });
        // labelArray.push(contentItem.label)
      }

      // console.log("contentsTotal...", contentsTotal)

      newContentsTotal = [];
      contentsTotal.map((contentsTotalItem: any, i: number) => {
        if (newContentsTotal.length > 0) {
          const sum = contentsTotalItem.cols.map(
            (col: any, colIndex: number) => {
              return col + newContentsTotal[colIndex];
            }
          );
          newContentsTotal = [...sum];
        } else {
          newContentsTotal = [...contentsTotalItem.cols];
        }
      });

      labelArray.push(contentItem.group);
    }
  });

  // Calculer les pourcentages
  const copyNewContentsTotal = [...newContentsTotal];
  const sum = copyNewContentsTotal.map((col: any, colIndex: number) => {
    // const newCol = [4, 6, 8].includes(colIndex)
    //   ? ((newContentsTotal[colIndex - 1] / newContentsTotal[1]) * 100)
    //   : (col);
    return nz(col);
  });
  newContentsTotal = [...sum];

  // console.log("labelArraynewContents...", labelArray)

  newContents = [
    ...newContents,
    { bg: bg2, label: `Total Etabliss`, cols: round2(newContentsTotal) },
  ];

  // console.log("formatGroupeByLabel.newContents ...", JSON.stringify(newContents))

  // console.log("🚀 ~ file: functions.ts:284 ~ formatGroupBy ~ newContents", newContents)
  return newContents;
};

/*objectif:Permet de grouper par un label par group ex :NiveauCourt
 * utilisation:
 */
export const groupLabelByGroup = (data: any[]) => {
  let contents: any = [];
  let labels: any = [];
  const dataCopy = [...data];
  if (data.length > 0) {
    dataCopy.map((item: any, index: number) => {
      if (!labels.includes(item.label)) {
        const groupArray = dataCopy.filter((x: any) => x.label === item.label);
        const group = groupArray.map((item: any, i: number) => {
          return {
            c0: i + 1,
            ...item,
          };
        });
        const newObj = {
          label: item.label,
          obj: item.obj,
          group: group,
          count: group.length
        };
        contents.push(newObj);
        labels.push(item.label);
      }
    });
  }
  return contents;
};

export const groupLabelByGroup2 = (data: any[]) => {
  let contents: any = [];
  let labels: any = [];
  let iAdmis: number;
  let iRedouble: number;
  let iExclus: number;
  const dataCopy = [...data];
  if (data.length > 0) {
    dataCopy.map((item: any, index: number) => {
      if (!labels.includes(item.label)) {
        iAdmis = 0
        iRedouble = 0
        iExclus = 0
        const groupArray = dataCopy.filter((x: any) => x.label === item.label);
        const group = groupArray.map((item: any, i: number) => {
          iAdmis += item.Admis
          iRedouble += item.Redouble
          iExclus += item.Exclus
          return {
            c0: i + 1,
            ...item,
          };
        });

        const newObj = {
          label: item.label,
          obj: item.obj,
          group: group,
          count: group.length,
          countAdmis: iAdmis,
          countRedouble: iRedouble,
          countExclus: iExclus,
        };
        // console.log("newObj ...", newObj)
        contents.push(newObj);
        labels.push(item.label);
      }
    });
  }
  // console.log("contents ...", contents)
  return contents;
};

export const formatTleA = (data) => {
  const dataFound: any = []
  const testDataCopy = [...data]
  let newData: any = []
  data.map((item) => {
    if (item.CycleX !== "2nd Cycle" || item.NiveauSerie === "S/T") {
      newData.push(item)
    } else {
      if (!dataFound.length || dataFound.findIndex((elt: any) => elt?.NiveauCourt === item?.NiveauCourt && elt?.NiveauSerie.includes(item?.Serie!.slice(0, 1))) < 0) {
        const filterTestData = testDataCopy.filter((elt: any) =>
          elt.NiveauCourt === item.NiveauCourt && elt.NiveauSerie.includes(item?.Serie?.slice(0, 1)))
        const filterTestDataCopy = [...filterTestData]
        // console.log(":fusée: ~ file: Accueil.tsx:266 ~ newData ~ filterTestData", filterTestData)
        let cols: any = []
        let NiveauSerie: string = ""
        filterTestData.map((elt: any, index: number) => {
          NiveauSerie = elt.Serie.includes("A")
            ? elt.NiveauCourt + " A"
            : elt.NiveauSerie
          if (!index) {
            cols = [...elt.cols]
          } else {
            cols = elt.cols.map((x: any, i: number) => x + cols[i])
          }
        })
        dataFound.push(item)
        const finalItem: any = {
          ...item,
          NiveauSerie,
          cols
        }
        newData.push(finalItem)
      }
    }
  })
  // console.log(":fusée: ~ file: Accueil.tsx:284 ~ newData ~ newData", newData)
  return newData
};

/**
 * fetcher les donnees saisies sur le frond-end
 * @param idRapport
 *
 */
const reportLabel = (idRapport: number): Promise<IRapportLabel> => {
  return new Promise(async (resolve, reject) => {
    try {
      var d = new Date();
      var datestring = d.getDate() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + "_" + d.getHours() + "-" + d.getMinutes();

      const sql = "SELECT * FROM rapport WHERE idRapport=?";
      const sqlResult = await _selectSql(sql, [idRapport]);
      if (sqlResult.length === 0) return resolve(null);

      const dataResult = JSON.parse(sqlResult[0].rapportData);
      const generated_report = sqlResult[0].libelleRapport + "_" + datestring;
      let ContentSqlResult = {};
      dataResult.map((item: any, index: number) => {
        const isComment =
          item.content === "" ? "" : "Commentaire : " + item.content;
        const itemNameValues =
          item.name.substr(-8) === "_comment" ? isComment : item.content;
        return (ContentSqlResult = {
          ...ContentSqlResult,
          [item.name]: itemNameValues,
        });
      });

      const result = formatReportLabel(dataResult);
      const resultData = { ...result, generated_report };
      // console.log("resultData", resultData)

      resolve(resultData);
    } catch (err: any) {
      console.log(`err => functions.reportLabel`);
      return reject(err);
    }
  });
};

/**
 * fonction generique qui permet de generer les rapports en fonction des trimestres en lui passant le data
 * @param data
 * @returns
 */
export const genererRapport = (data: any) => {
  var d = new Date();
  var datestring = d.getDate() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + "_" + d.getHours() + "-" + d.getMinutes();
  const rapportNonRenseigne = data.name_report + "_" + "" + `${datestring}`
  console.log("🚀 ~ file: functions.ts:826 ~ genererRapport ~ rapportNonRenseigne:", rapportNonRenseigne)
  return new Promise(async (resolve, reject) => {
    try {
      const generated = data.generated_report || rapportNonRenseigne;
      console.log("🚀 ~ file: functions.ts:829 ~ returnnewPromise ~ generated:", generated)
      const generated_report = `${generated}.docx`;
      await createJsonFile(data);
      console.log("generated_report+++++++++++++++++", generated_report)
      await pythonPromise({
        name_report: data.name_report,
        path_report: data.path_report,
        generated_report: generated,
      });
      resolve(generated_report);
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 * Cette fonction est utilisé pour les listes nommivatives pour afficher la partie observation du tableau
 * @param (data1,data2)
 * @returns
 */

const fusionnerTableaux = (tableauObservation: IEnregistrementObservation[], tableauMoyenne: IEnregistrementMoyenne[], moyenne: string): (IEnregistrementObservation & IEnregistrementMoyenne)[] => {
  // Tableau final pour stocker les données fusionnées
  let tableauFusion: (IEnregistrementObservation & IEnregistrementMoyenne)[] = [];

  // Vérifier si le tableau tableauObservation n'est pas vide
  if (tableauObservation && tableauObservation.length > 0) {
    // Parcourir les résultats contenant la moyenne de l'élève
    tableauMoyenne.forEach((itemMoyEleve) => {
      let moyTrim: number;

      if (typeof itemMoyEleve[moyenne] === "number") {
        moyTrim = itemMoyEleve[moyenne] as number;
      } else {
        moyTrim = parseFloat(itemMoyEleve[moyenne] as string);
      }

      // Prendre un item pour chaque tour du tableauMoyenne et faire la comparaison de la moyenne en fonction des notes plancher et plafond
      let correspondance = null;
      if (tableauObservation && tableauObservation.length > 0) {
        correspondance = tableauObservation.find((itemObs) => {
          return moyTrim >= itemObs.NotePlancher && moyTrim <= itemObs.NotePlafond;
        });
      }

      if (correspondance) {
        // Fusionner les propriétés des deux tableaux dans un nouvel objet fusionné
        const objetFusion: (IEnregistrementObservation & IEnregistrementMoyenne) = { ...correspondance, ...itemMoyEleve };

        // Ajouter l'objet fusionné au tableau de fusion
        tableauFusion.push(objetFusion);
      }
    });

    // Fusionner les enregistrements de tableauMoyenne qui n'ont pas de correspondance dans tableauObservation
    tableauMoyenne.forEach((itemMoyEleve) => {
      let moyTrim: number;

      if (typeof itemMoyEleve[moyenne] === "number") {
        moyTrim = itemMoyEleve[moyenne] as number;
      } else {
        moyTrim = parseFloat(itemMoyEleve[moyenne] as string);
      }

      const correspondance = tableauFusion.find((fusion) => {
        return (
          moyTrim >= fusion.NotePlancher && moyTrim <= fusion.NotePlafond
        );
      });

      if (!correspondance) {
        const nouvelObjetFusion: (IEnregistrementObservation & IEnregistrementMoyenne) = {
          IdAppréciation: '',
          Niveau: '',
          Appréciations: '',
          NotePlancher: 0,
          NotePlafond: 0,
          ...itemMoyEleve,
        };

        tableauFusion.push(nouvelObjetFusion);
      }
    });
  } else {
    // Utiliser uniquement le tableau tableauMoyenne
    tableauFusion = tableauMoyenne as (IEnregistrementObservation & IEnregistrementMoyenne)[];
  }

  // Retourner le tableau fusionné
  return tableauFusion;
};


export const addEstimationRow = (data1, data2) => {
  const result = [];
  const estimationRow = [];
  for (let j = 6; j < data1[0].cols.length; j++) {
    const totalStudents = data2[0].cols[j];
    const numClasses = data1[0].cols[j - 6];
    const estimation = Math.ceil(totalStudents / numClasses);
    estimationRow.push(estimation);
  }
  return estimationRow;
};


const calculateEstimationRow = (data: any) => {
  const result = [];
  const numCols = data[0].cols.length;
  for (let i = 0; i < numCols; i++) {
    const estimationRow = [];
    const totalStudents = data[1].cols[i];
    const numClasses = data[0].cols[i];
    const estimation = isNaN(totalStudents / numClasses) ? 0 : Math.ceil(totalStudents / numClasses);
    estimationRow.push(estimation);
    result.push(estimation);
  }
  return result;
};

export const convertirFormatDate = (dateString) => {
  const date = new Date(dateString);

  const jour = date.getDate().toString().padStart(2, '0');
  const mois = (date.getMonth() + 1).toString().padStart(2, '0');
  const annee = date.getFullYear();

  return `${jour}/${mois}/${annee}`;
}

const calculerTotaux = (data: any) => {
  const totauxParCycle: any = {};

  // Calculer les totaux pour chaque cycle
  data.forEach((entry: any) => {
    const cycle = entry.CycleX;  // Utiliser le bon nom de propriété
    if (!totauxParCycle[cycle]) {
      totauxParCycle[cycle] = {
        classePedagogique: 0,
        G1: 0,
        F1: 0,
        T1: 0,
        G3: 0,
        F3: 0,
        T3: 0
      };
    }

    totauxParCycle[cycle].classePedagogique += entry.classePedagogique;
    totauxParCycle[cycle].G1 += entry.G1;
    totauxParCycle[cycle].F1 += entry.F1;
    totauxParCycle[cycle].T1 += entry.T1;
    totauxParCycle[cycle].G3 += entry.G3;
    totauxParCycle[cycle].F3 += entry.F3;
    totauxParCycle[cycle].T3 += entry.T3;
  });

  const resultat = [];

  // Ajouter les éléments du 1er Cycle
  data.filter((entry: any) => entry.CycleX === "1er Cycle").forEach((entry: any) => {
    resultat.push(entry);
  });

  // Ajouter le total du 1er Cycle
  resultat.push({
    // Cycle: "1er cycle",
    NiveauSerie: "Total 1er cycle",
    classePedagogique: totauxParCycle["1er Cycle"].classePedagogique,
    classePhysique: " ",
    G1: totauxParCycle["1er Cycle"].G1,
    F1: totauxParCycle["1er Cycle"].F1,
    T1: totauxParCycle["1er Cycle"].T1,
    G3: totauxParCycle["1er Cycle"].G3,
    F3: totauxParCycle["1er Cycle"].F3,
    T3: totauxParCycle["1er Cycle"].T3
  });

  // Ajouter les éléments du 2nd Cycle
  data.filter((entry: any) => entry.CycleX === "2nd Cycle").forEach((entry: any) => {
    resultat.push(entry);
  });

  // Ajouter le total du 2nd Cycle
  resultat.push({
    // Cycle: "2nd Cycle",
    NiveauSerie: "Total 2nd Cycle",
    classePedagogique: totauxParCycle["2nd Cycle"].classePedagogique,
    classePhysique: " ",
    G1: totauxParCycle["2nd Cycle"].G1,
    F1: totauxParCycle["2nd Cycle"].F1,
    T1: totauxParCycle["2nd Cycle"].T1,
    G3: totauxParCycle["2nd Cycle"].G3,
    F3: totauxParCycle["2nd Cycle"].F3,
    T3: totauxParCycle["2nd Cycle"].T3
  });

  // Calculer le total général
  const totalGeneral: any = Object.values(totauxParCycle).reduce(
    (total: any, cycle: any) => {
      total.classePedagogique += cycle.classePedagogique;
      total.G1 += cycle.G1;
      total.F1 += cycle.F1;
      total.T1 += cycle.T1;
      total.G3 += cycle.G3;
      total.F3 += cycle.F3;
      total.T3 += cycle.T3;
      return total;
    },
    {
      classePedagogique: 0,
      G1: 0,
      F1: 0,
      T1: 0,
      G3: 0,
      F3: 0,
      T3: 0
    }
  );

  // Ajouter le total général au tableau résultant
  resultat.push({
    // Cycle: "Total Général",
    NiveauSerie: "Total Général",
    classePedagogique: totalGeneral.classePedagogique,
    classePhysique: " ",
    G1: totalGeneral.G1,
    F1: totalGeneral.F1,
    T1: totalGeneral.T1,
    G3: totalGeneral.G3,
    F3: totalGeneral.F3,
    T3: totalGeneral.T3
  });

  return resultat;
};

export const formatDataEquipe = (inputData) => {

  const dataFinally = {
    row1: [],
    row2: [],
    row3: []
  };

  inputData.forEach((item) => {
    const formattedItem = {
      NomComplet: item.NomComplet || ' ',
      Groupe: item.Groupe || ' ',
      CelPers: item.CelPers || ' ',
      Corps: item.Corps || ' ',
      Sexe: item.Sexe || ' ',
      RefFonction: item.RefFonction,
      email: item.email || '',
      NumAut: item.NumAut || ' ',
    };
    if (item.RefFonction === 3) {
      dataFinally.row1.push(formattedItem);
    } else if (item.RefFonction === 23) {
      dataFinally.row2.push(formattedItem);
    }
    dataFinally.row3.push(formattedItem);
  });

  // Vérifier si les tableaux row1,row2 et row3 sont vides, et les remplir si nécessaire
  if (dataFinally.row1.length === 0) {
    dataFinally.row1.push({
      NomComplet: '',
      Groupe: 3,
      CelPers: '',
      Corps: 1,
      Sexe: '',
      RefFonction: 3,
      email: '',
      NumAut: '',
    });
  }
  if (dataFinally.row2.length === 0) {
    dataFinally.row2.push({
      NomComplet: '',
      Groupe: 3,
      CelPers: '',
      Corps: 1,
      Sexe: '',
      RefFonction: 23,
      email: '',
      NumAut: '',
    });
  }
  if (dataFinally.row3.length === 0) {
    dataFinally.row2.push({
      NomComplet: '',
      Groupe: 3,
      CelPers: '',
      Corps: 1,
      Sexe: '',
      RefFonction: 23,
      email: '',
      NumAut: '',
    });
  }

  return dataFinally;
};

export const formatDataFiliere = (inputData) => {
  const dataFinally = {
    row1: [],
    row2: [],
    row3: [],
    row4: [],
    row5: [],
    row6: [],
    row7: [],
    row8: [],
  };

  inputData.forEach((item) => {
    const formattedItem = [
      item.nomFiliere || '',
      parseInt(item.annee1) || '',
      parseInt(item.annee2) || '',
      parseInt(item.annee3) || '',
      parseInt(item.total) || '',
    ];

    switch (item.nomFiliere) {
      case 'F2 Electronique':
        dataFinally.row1.push(...formattedItem);
        break;
      case 'F3 Electrotechnique':
        dataFinally.row2.push(...formattedItem);
        break;
      case 'Mécanique':
        dataFinally.row3.push(...formattedItem);
        break;
      case 'Biochimie':
        dataFinally.row4.push(...formattedItem);
        break;
      case 'Economie':
        dataFinally.row5.push(...formattedItem);
        break;
      case 'G1 Secrétariat':
        dataFinally.row6.push(...formattedItem);
        break;
      case 'G2 Comptabilité':
        dataFinally.row7.push(...formattedItem);
        break;
      default:
        break;
    }
  });

  // Calculer les totaux pour chaque colonne
  const totals = [
    '',
    inputData.reduce((acc, cur) => acc + (parseInt(cur.annee1) || 0), 0),
    inputData.reduce((acc, cur) => acc + (parseInt(cur.annee2) || 0), 0),
    inputData.reduce((acc, cur) => acc + (parseInt(cur.annee3) || 0), 0),
    inputData.reduce((acc, cur) => acc + (parseInt(cur.total) || 0), 0),
  ];

  dataFinally.row8.push(...totals);

  // Vérifier si les tableaux row1,row2 et row3 sont vides, et les remplir si nécessaire
  for (let key in dataFinally) {
    if (Array.isArray(dataFinally[key]) && dataFinally[key].length === 0) {
      dataFinally[key].push('', '', '', '', '');
    }
  }

  return dataFinally;
};

export const formationFiliere = (inputData) => {
  const dataFinally = {
    row1: [],
    row2: [],
    row3: [],
    row4: [],
    row5: [],
    row6: [],
    row7: [],
  };

  inputData.forEach((item) => {
    const formattedItem = [
      item.nomFiliere || '',
      item.groupe_filiere || '',
      parseInt(item.duree_etude) || '',
      item.obs || '',
    ];
    switch (item.nomFiliere) {
      case 'F2 Electronique':
        dataFinally.row1.push(...formattedItem);
        break;
      case 'F3 Electrotechnique':
        dataFinally.row2.push(...formattedItem);
        break;
      case 'Mécanique':
        dataFinally.row3.push(...formattedItem);
        break;
      case 'Biochimie':
        dataFinally.row4.push(...formattedItem);
        break;
      case 'Economie':
        dataFinally.row5.push(...formattedItem);
        break;
      case 'G1 Secrétariat':
        dataFinally.row6.push(...formattedItem);
        break;
      case 'G2 Comptabilité':
        dataFinally.row7.push(...formattedItem);
        break;
      default:
        break;
    }
  });

  // Vérifier si les tableaux row1,row2 et row3 sont vides, et les remplir si nécessaire
  for (let key in dataFinally) {
    if (Array.isArray(dataFinally[key]) && dataFinally[key].length === 0) {
      dataFinally[key].push('', '', '', '');
    }
  }

  return dataFinally;
};

export const formatDataFiliere1 = (inputData) => {
  const dataFinally = {
    row1: [],
    row2: [],
    row3: [],
    row4: [],
    row5: [],
    row6: [],
    row7: [],
    row8: [],
  };

  inputData.forEach((item) => {
    const formattedItem = [
      item.nomFiliere || '',
      parseInt(item.capaciteAccueil) || '',
      parseInt(item.inscrit) || '',
      parseInt(item.ecart) || '',
    ];

    switch (item.nomFiliere) {
      case 'F2 Electronique':
        dataFinally.row1.push(...formattedItem);
        break;
      case 'F3 Electrotechnique':
        dataFinally.row2.push(...formattedItem);
        break;
      case 'Mécanique':
        dataFinally.row3.push(...formattedItem);
        break;
      case 'Biochimie':
        dataFinally.row4.push(...formattedItem);
        break;
      case 'Economie':
        dataFinally.row5.push(...formattedItem);
        break;
      case 'G1 Secrétariat':
        dataFinally.row6.push(...formattedItem);
        break;
      case 'G2 Comptabilité':
        dataFinally.row7.push(...formattedItem);
        break;
      default:
        break;
    }
  });

  // Calculer les totaux pour chaque colonne
  const totals = [
    '',
    inputData.reduce((acc, cur) => acc + (parseInt(cur.capaciteAccueil) || 0), 0),
    inputData.reduce((acc, cur) => acc + (parseInt(cur.inscrit) || 0), 0),
    inputData.reduce((acc, cur) => acc + (parseInt(cur.ecart) || 0), 0),
  ];

  dataFinally.row8.push(...totals);

  // Vérifier si les tableaux row1,row2 et row3 sont vides, et les remplir si nécessaire
  for (let key in dataFinally) {
    if (Array.isArray(dataFinally[key]) && dataFinally[key].length === 0) {
      dataFinally[key].push('', '', '', '');
    }
  }

  return dataFinally;
};

export function calculateTotals(data) {
  const result = [];
  let grandTotal = {
    GBoursier: 0,
    GNBoursier: 0,
    TotalG: 0,
    FBoursier: 0,
    FNBoursier: 0,
    TotalF: 0
  };

  const niveaux = {};

  data.forEach(entry => {
    if (!niveaux[entry.NiveauCourt]) {
      niveaux[entry.NiveauCourt] = {
        label: entry.NiveauCourt,
        filieres: [],
        total: {
          Groupe_filiere: 'Total ' + entry.NiveauCourt,
          NomFiliere: 'Total ' + entry.NiveauCourt,
          GBoursier: 0,
          GNBoursier: 0,
          TotalG: 0,
          FBoursier: 0,
          FNBoursier: 0,
          TotalF: 0,
          NiveauCourt: entry.NiveauCourt
        }
      };
    }

    niveaux[entry.NiveauCourt].filieres.push(entry);

    niveaux[entry.NiveauCourt].total.GBoursier += entry.GBoursier || '';
    niveaux[entry.NiveauCourt].total.GNBoursier += entry.GNBoursier || '';
    niveaux[entry.NiveauCourt].total.TotalG += entry.TotalG || '';
    niveaux[entry.NiveauCourt].total.FBoursier += entry.FBoursier || '';
    niveaux[entry.NiveauCourt].total.FNBoursier += entry.FNBoursier || '';
    niveaux[entry.NiveauCourt].total.TotalF += entry.TotalF || '';

    grandTotal.GBoursier += entry.GBoursier || '';
    grandTotal.GNBoursier += entry.GNBoursier || '';
    grandTotal.TotalG += entry.TotalG || '';
    grandTotal.FBoursier += entry.FBoursier || '';
    grandTotal.FNBoursier += entry.FNBoursier || '';
    grandTotal.TotalF += entry.TotalF || '';
  });

  Object.values(niveaux).forEach((niveau: any) => {
    niveau.filieres.push(niveau.total);
    result.push(niveau);
  });

  result.push({
    label: 'Total Général',
    filieres: [{
      ...grandTotal,
      NiveauCourt: 'Total Général'
    }]
  });

  return result;
}

export function calculateTotals1(data) {
  // Initialise un tableau vide pour stocker les résultats.
  const result = [];

  // Initialise des objets pour stocker les données relatives aux filières industrielles et tertiaires.
  let bacIndustriel = { label: "BAC INDUSTRIEL", filieres: [] };
  let bacTertiaire = { label: "BAC TERTIAIRE", filieres: [] };

  // Initialise des objets pour stocker les totaux des filières industrielles et tertiaires.
  let totalBacIndustriel = { label: "TOTAL BAC INDUSTRIEL", filieres: [] };
  let totalBacTertiaire = { label: "TOTAL BAC TERTIAIRE", filieres: [] };

  // Parcourt chaque entrée dans le tableau de données.
  data.forEach(entry => {
    // Vérifie si le groupe de filière de l'entrée n'est pas "AB", "G1" ou "G2".
    if (!["AB", "G1", "G2"].includes(entry.Groupe_filiere)) {
      // Si oui, ajoute l'entrée à la liste des filières industrielles.
      bacIndustriel.filieres.push(entry);
    } else {
      // Sinon, ajoute l'entrée à la liste des filières tertiaires.
      bacTertiaire.filieres.push(entry);
    }
  });

  // Calcule les totaux pour les filières industrielles.
  totalBacIndustriel.filieres.push({
    Groupe_filiere: "",
    NomFiliere: "",
    Fille: bacIndustriel.filieres.reduce((total, entry) => total + (entry.Fille || 0), 0),
    Garçon: bacIndustriel.filieres.reduce((total, entry) => total + (entry.Garçon || 0), 0),
    TotalF: bacIndustriel.filieres.reduce((total, entry) => total + (entry.TotalF || 0), 0),
  });

  // Calcule les totaux pour les filières tertiaires.
  totalBacTertiaire.filieres.push({
    Groupe_filiere: "",
    NomFiliere: "",
    Fille: bacTertiaire.filieres.reduce((total, entry) => total + (entry.Fille || 0), 0),
    Garçon: bacTertiaire.filieres.reduce((total, entry) => total + (entry.Garçon || 0), 0),
    TotalF: bacTertiaire.filieres.reduce((total, entry) => total + (entry.TotalF || 0), 0),
  });

  // Ajoute les données des filières industrielles, des totaux des filières industrielles,
  // des filières tertiaires et des totaux des filières tertiaires au tableau de résultats.
  result.push(bacIndustriel);
  result.push(totalBacIndustriel);
  result.push(bacTertiaire);
  result.push(totalBacTertiaire);

  // Calcule le total général en ajoutant les totaux des filières industrielles et tertiaires.
  result.push({
    label: "Total Général",
    filieres: [{
      Groupe_filiere: "",
      NomFiliere: "",
      Fille: totalBacIndustriel.filieres[0].Fille + totalBacTertiaire.filieres[0].Fille,
      Garçon: totalBacIndustriel.filieres[0].Garçon + totalBacTertiaire.filieres[0].Garçon,
      TotalF: totalBacIndustriel.filieres[0].TotalF + totalBacTertiaire.filieres[0].TotalF,
    }],
  });

  // Retourne le tableau de résultats.
  return result;
}

export const formatDataTechnique = (data: any[]) => {
  const emptyRow: string[] = [",", ",", ","]; // Tableau vide avec ses différents champs colonne vide
  const formattedData: any[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i] as { [key: string]: string[] }; // Assertion de type

    // Si la ligne est vide, ajoute un tableau vide
    if (Object.values(row).every((column: string[]) => column.every((value: string) => value === "" || value === null))) {
      formattedData.push({ ...emptyRow });
    } else {
      // Si la ligne contient des données, ajoute la ligne telle quelle
      formattedData.push({ ...row });
    }
  }

  // Ajoute la somme des autres colonnes qui sont au-dessus
  const totalRow = {
    row1: emptyRow,
    row2: emptyRow,
    row3: emptyRow,
    row4: emptyRow,
    row5: emptyRow,
    row6: emptyRow,
    row7: emptyRow,
    row8: [
      formattedData.reduce((acc: number, curr: any) => acc + parseInt(curr.row8[0] || 0, 10), 0),
      formattedData.reduce((acc: number, curr: any) => acc + parseInt(curr.row8[1] || 0, 10), 0),
      formattedData.reduce((acc: number, curr: any) => acc + parseInt(curr.row8[2] || 0, 10), 0)
    ]
  };

  formattedData.push(totalRow);

  return formattedData;
}

// Cette fonction prend un tableau de données en entrée et groupe les éléments du tableau en fonction de leur étiquette (label).
export const groupLabelByDiplome = (data: any[]) => {
  // Initialise un tableau vide pour stocker les éléments regroupés par étiquette.
  let contents: any = [];
  // Initialise un tableau vide pour stocker les étiquettes déjà rencontrées.
  let labels: any = [];
  // Copie les données d'entrée pour éviter de modifier les données d'origine.
  const dataCopy = [...data];

  // Vérifie si le tableau de données d'entrée n'est pas vide.
  if (data.length > 0) {
    // Parcourt chaque élément du tableau de données.
    dataCopy.map((item: any, index: number) => {
      // Vérifie si l'étiquette de l'élément n'a pas déjà été traitée.
      if (!labels.includes(item.label)) {
        // Si l'étiquette n'a pas encore été rencontrée, crée un nouveau groupe avec tous les éléments ayant la même étiquette.
        const groupArray = dataCopy.filter((x: any) => x.label === item.label);
        const group = groupArray.map((item: any, i: number) => {
          // Ajoute une nouvelle propriété 'c0' à chaque élément du groupe, contenant le numéro de classement dans le groupe.
          return {
            c0: i + 1,
            ...item,
          };
        });
        // Crée un nouvel objet contenant l'étiquette et le groupe correspondant.
        const newObj = {
          label: item.label,
          group: group,
        };
        // Ajoute le nouvel objet au tableau de contenu.
        contents.push(newObj);
        // Ajoute l'étiquette au tableau des étiquettes rencontrées.
        labels.push(item.label);
      }
    });
  }
  // Retourne le tableau de contenu contenant les éléments regroupés par étiquette.
  return contents;
};

export const filiereFormations = (data) => {
  // On définit un tableau `labels` contenant les étiquettes attendues.
  const labels = ["BT INDUSTRIEL", "BT TERTIAIRE", "CAP INDUSTRIEL", "CAP TERTIAIRE"];
  // On crée un tableau vide `formattedData` qui va contenir les données formatées.
  const formattedData = [];

  // On parcourt chaque étiquette définie dans le tableau `labels`.
  for (const label of labels) {
    // On filtre les données de `sqlResult` pour trouver celles qui ont la même étiquette que l'itération en cours.
    const labelData = data.filter(item => item.label === label);
    // Si des données sont trouvées pour l'étiquette actuelle.
    if (labelData.length > 0) {
      // On ajoute un objet contenant l'étiquette et les données correspondantes au tableau `formattedData`.
      formattedData.push({
        label: label,
        Filiere: labelData
      });
    } else {
      // Si aucune donnée n'est trouvée pour l'étiquette actuelle, on crée un objet avec des données vides pour cette étiquette.
      const emptyLabelData = {
        label: label,
        Filiere: [
          { nomFiliere: "", groupe_filiere: "", duree_filiere: "", obs: "" },
          { nomFiliere: "", groupe_filiere: "", duree_filiere: "", obs: "" },
          { nomFiliere: "", groupe_filiere: "", duree_filiere: "", obs: "" }
        ]
      };
      // On ajoute l'objet avec les données vides au tableau `formattedData`.
      formattedData.push(emptyLabelData);
    }
  }
  // On retourne le tableau `formattedData` contenant les données formatées.
  return formattedData;
}

export const formatDataFiliereProfessionnelle = (inputData) => {
  const dataFinally = {
    row1: [],
    row2: [],
    row3: [],
    row4: [],
    row5: [],
    row6: [],
    row7: [],
    row8: [],
    row9: [],
    row10: [],
    row11: [],
    row12: [],
    row13: [],
    row14: [],
  };

  inputData.forEach((item) => {
    const formattedItem = [
      item.nomFiliere || '',
      parseInt(item.annee1) || '',
      parseInt(item.annee2) || '',
      parseInt(item.annee3) || '',
      parseInt(item.total) || '',
    ];

    switch (item.nomFiliere) {
      case 'F2 Electronique':
        dataFinally.row1.push(...formattedItem);
        break;
      case 'F3 Electrotechnique':
        dataFinally.row2.push(...formattedItem);
        break;
      case 'Mécanique':
        dataFinally.row3.push(...formattedItem);
        break;
      case 'Biochimie':
        dataFinally.row4.push(...formattedItem);
        break;
      case 'Economie':
        dataFinally.row5.push(...formattedItem);
        break;
      case 'G1 Secrétariat':
        dataFinally.row6.push(...formattedItem);
        break;
      case 'G2 Comptabilité':
        dataFinally.row7.push(...formattedItem);
        break;
      case 'CAP Mécanique Générale':
        dataFinally.row8.push(...formattedItem);
        break;
      case 'CAP Electricité':
        dataFinally.row9.push(...formattedItem);
        break;
      case 'CAP Mécanique Auto':
        dataFinally.row10.push(...formattedItem);
        break;
      case 'CAP Coiffure':
        dataFinally.row11.push(...formattedItem);
        break;
      case 'CAP Couture':
        dataFinally.row12.push(...formattedItem);
        break;
      case 'CAP Sanitaire Social':
        dataFinally.row13.push(...formattedItem);
        break;
      default:
        break;
    }
  });

  // Calculer les totaux pour chaque colonne
  const totals = [
    '',
    inputData.reduce((acc, cur) => acc + (parseInt(cur.annee1) || 0), 0),
    inputData.reduce((acc, cur) => acc + (parseInt(cur.annee2) || 0), 0),
    inputData.reduce((acc, cur) => acc + (parseInt(cur.annee3) || 0), 0),
    inputData.reduce((acc, cur) => acc + (parseInt(cur.total) || 0), 0),
  ];

  dataFinally.row14.push(...totals);

  // Vérifier si les tableaux row1,row2 et row3 sont vides, et les remplir si nécessaire
  for (let key in dataFinally) {
    if (Array.isArray(dataFinally[key]) && dataFinally[key].length === 0) {
      dataFinally[key].push('', '', '', '', '');
    }
  }

  return dataFinally;
};

const reformatResult = (sqlResult: Array<any>): Array<IResultRow> => {

  const rows: Array<any> = [];

  // Crée les quatre lignes attendues
  for (let i = 0; i < 4; i++) {
    const row: any = {};

    // Remplit la ligne avec les valeurs appropriées
    row.c1 = sqlResult[i].InscritFille;
    row.c2 = sqlResult[i].InscritGarçon;
    row.c3 = sqlResult[i].TotalInscrit;
    row.c4 = sqlResult[i].PresentFille;
    row.c5 = sqlResult[i].PresentGarçon;
    row.c6 = sqlResult[i].TotalPresent;
    row.c7 = sqlResult[i].AdmisFille;
    row.c8 = sqlResult[i].AdmisGarçon;
    row.c9 = sqlResult[i].TotalAdmis;

    // Ajoute la ligne au tableau de résultats
    rows.push(row);
  }

  return rows;
}
// parametres des etablissements
export const paramsEtablisement = (): Promise<any | {}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        nomcompletetab,
        num_ouverture,
        num_reconnaissance,
        nometab,
        anscol1,
        codeetab,
        sitgeo,
        bpetab,
        teletab,
        emailetab,
        drencomplet,

        fondateur,
        telfondateur,
        emailfondateur,

        nomchefetab,
        telchefetab,
        emailchefetab,
        titrechefetab,
        boitepostale,
      } = await paramEtabObjet([
        "nomcompletetab",
        "num_ouverture",
        "num_reconnaissance",
        "nometab",
        "anscol1",
        "codeetab",
        "sitgeo",
        "bpetab",
        "teletab",
        "emailetab",
        "drencomplet",

        "fondateur",
        "telfondateur",
        "emailfondateur",

        "nomchefetab",
        "telchefetab",
        "emailchefetab",
        "titrechefetab",
        "boitepostale",
      ]);

      const result = {
        //ETABLISSEMENT
        drencomplet: drencomplet,
        nomcompletetab: nomcompletetab,
        num_ouverture: num_ouverture,
        num_reconnaissance: num_reconnaissance,
        nometab: nometab,
        anscol1: anscol1,
        codeetab: codeetab,
        sitgeo: sitgeo,
        bpetab: bpetab,
        teletab: teletab,
        emailetab: emailetab,

        //FONDATEUR
        fondateur: fondateur,
        telfondateur: telfondateur,
        emailfondateur: emailfondateur,

        //DIRECTEUR DES ETUDES
        nomchefetab: nomchefetab,
        telchefetab: telchefetab,
        emailchefetab: emailchefetab,
        titrechefetab:titrechefetab,
        boitepostale:boitepostale,

      };
      resolve(result);
    } catch (err: any) {
      console.log(`err => paramsEtablisement`);
      return reject(err);
    }
  });
};

// Remplacer la valeur null par vide
export const nv = (data: any) => {
  return data === null || data === "null" ? "" : data;
};


export const pageGarde = (): Promise<any | {}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        anscol1,
        nometab,
        codeetab,
        teletab,
        emailetab,
        titrechefetab,
        nomchefetab,
        boitepostale,
      } = await paramEtabObjet([
        "anscol1",
        "nometab",
        "codeetab",
        "teletab",
        "emailetab",
        "titrechefetab",
        "nomchefetab",
        "boitepostale",
      ]);

      const path = await fileExists(
        `C:/SPIDER/Ressources/${codeetab}_logo.jpg`
      );
      const logo1  = path;
      // console.log("dataParams...", dataParams);
      const result = {
        ex: "ex",
        anscol1: anscol1,
        nometab: nometab,
        codeetab: codeetab,
        teletab: teletab,
        emailetab: emailetab,
        logo1: logo1,
        path: path,
        titrechefetab: titrechefetab,
        nomchefetab: nomchefetab,
        boitepostale: boitepostale,
      };
      resolve(result);
    } catch (err: any) {
      console.log(`err => pageGarde`);
      return reject(err);
    }
  });
};

/* objectif: somme total de filles et garçons par niveau
 * utilisation: chp1_B_1_a
 */
export const addTGFRow = (data: any) => {
  let newData: any = [];
  newData = data.map((contentItem: any) => {
    let totalObject: any = {};
    let totalCol: any = [];
    let formatedCols: any = [];
    contentItem.cols.map((colItem: any, colItemIndex: number) => {
      let newCol: any = [];
      if (totalCol.length > 0) {
        const sum = colItem.col.map((col: any, colIndex: number) => {
          const formatedCol = col === 0 ? "0" : col;
          newCol.push(formatedCol);
          const isT = colItemIndex > 0 && [4, 6, 8, 9].includes(colIndex)
          return isT
            ? ((col + totalCol[colIndex]) / (colItemIndex + 1)).toFixed(2)
            : col + totalCol[colIndex];
        });
        totalCol = sum;
      } else {
        colItem.col.map((col: any, colIndex: number) => {
          const formatedCol = col === 0 ? "0" : col;
          newCol.push(formatedCol);
        });
        totalCol = [...colItem.col];
      }
      if (colItem.genre === "G") {
        formatedCols.unshift({ ...colItem, col: newCol });
      } else {
        formatedCols.push({ ...colItem, col: newCol });
      }
    });
    if (formatedCols.length === 1) {
      const findformatedCols: any = formatedCols[0].col;
      let i: number = 0;
      let nombreLigne: number = findformatedCols.length;
      let newCols: any = [];
      for (i; i < nombreLigne; i++) {
        newCols.push("");
      }
      if (formatedCols[0].genre === "G") {
        formatedCols.push({ genre: "F", col: newCols });
      } else {
        formatedCols.unshift({ genre: "G", col: newCols });
      }
    }
    const newItems = totalCol.map((item: any) => (item === 0 ? "0" : item));
    totalObject = { genre: "T", col: newItems };
    const newCols = [...formatedCols, totalObject];
    return { ...contentItem, cols: newCols };
  });
  // console.log("newData..........", JSON.stringify(newData))
  return newData;
};


export default {
  genererRapport,
  serverUrl,
  reportLabel,
  pythonParams,
  formatGroupBy,
  groupLabelByGroup,
  groupLabelByGroup2,
  formatGroupeByLabel,
  addTRow,
  addGFTRow,
  fileExists,
  addSumRow,
  addPercentRow,
  countLabel,
  rav,
  rav2,
  isDownloaded,
  addPercentRow2,
  calculDivisionEntiere,
  calculDivisionEntiere2,
  fusionnerTableaux,
  addEstimationRow,
  calculateEstimationRow,
  calculerTotaux,
  formatDataFiliere,
  calculateTotals,
  reformatResult,
  paramsEtablisement,
  nv,
  pageGarde
};
