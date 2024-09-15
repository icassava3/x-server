import functions from "./functions";
import functions_main from "../../../../utils";

const rapport = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const labels_comments = await functions_main.reportLabel(data.id);
      const pythonParams = functions_main.pythonParams();
      const reportData = await functions.rapport(pythonParams);
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
  rapport,
};
