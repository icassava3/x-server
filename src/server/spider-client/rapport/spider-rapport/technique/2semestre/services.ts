import functions from "./functions";
import functions_main from "../../utils";


const rapport = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const Isdownloaded:any[] = await functions_main.isDownloaded();
      // const is=Isdownloaded[0].cpt
      // // console.log("is....", is)
      // if (is !== 0) return resolve("");

      const labels_comments = await functions_main.reportLabel(data.id); // les textes à saisir puis les commentaires du tableau
      const otherParams = functions_main.pythonParams();
      const reportData = await functions.rapport(otherParams);
      const resultData = {
        ...labels_comments,
        ...reportData
      };
     const result = await functions_main.genererRapport(resultData);
     resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  rapport
};
