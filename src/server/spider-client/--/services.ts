import functions from "./functions";

const _serviceName = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const modules = await functions._functionName()
            resolve(modules)
        } catch (error) {
            reject(error);
        }
    });
};


export default {
    _serviceName,
}

