
const genererRapport = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  genererRapport,
};
