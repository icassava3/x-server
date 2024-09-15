
/**
 * 
 * @returns 
 */
const _functionName = () => {
    return new Promise(async (resolve, reject) => {
        try {
           resolve(true)
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    _functionName,
}
