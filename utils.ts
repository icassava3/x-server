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
