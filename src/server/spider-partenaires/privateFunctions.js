const changeBase = (number, fromBase, toBase) => {
    if (fromBase == 10)
        return (parseInt(number)).toString(toBase)
    else if (toBase == 10)
        return parseInt(number, fromBase);
    else {
        var numberInDecimal = parseInt(number, fromBase);
        return (parseInt(numberInDecimal)).toString(toBase);
    }
}
const getTimeStamp = () => {
    return Math.round(+new Date() / 1000);
}
const getDateStamp = (date) => {
    date = (date === undefined)
        ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
        : new Date(date)
    return Math.round(date / 1000);
}
const hex = (number) => {
    return changeBase(number, 10, 16)
}
const hexToNum = (hexString) => {
    return changeBase(hexString, 16, 10)
}
const pFormat = (number, nbDigit) => {
    const nbZ = nbDigit - number.toString().length
    return '0'.repeat(nbZ) + number.toString()
}
const cDate = (vbaDateToLong) => {
    E = dateToEpoch(vbaDateToLong) * 1000
    date = new Date(E)
    return (date.getFullYear() + "-" + pFormat(date.getMonth() + 1, 2) + "-" + pFormat(date.getDate()))
}
const vbaDateToLong = (strDate) => {
    strDate = getDateStamp(strDate)
    return epochToDate(strDate, 0);
}
const epochToDate = (E, msFrac) => {
    const eStart = 25569
    msFrac = 0
    if (E > 10000000000) {
        E = E * 0.001
        msFrac = E - E.parseInt()
    }
    return eStart + (E - msFrac) / 86400;
}
const dateToEpoch = (date, msFrac) => {
    const eStart = 25569
    const result = (date - eStart) * 86400
    if (msFrac === undefined) {
        return result
    } else {
        return result * 1000 + msFrac * 1000
    }
}
const getFactors = (codeEtab) => {
    const factors = [330, 289, 766, 301, 645, 176, 576, 932, 425, 823]
    const results = []
    let j = 6
    for (let i = 0; i < codeEtab.length; i++) {
        j--
        const index1 = codeEtab[i]
        const index2 = codeEtab[j]
        const value = parseInt((factors[index1] + factors[index2]) / (j + 1))
        results.push(value)
    }
    return results
}
const alter = (codeEtab, arrFactors) => { //v=value  f=factors
    v = parseInt(codeEtab)
    const f = arrFactors
    return Math.abs(f[0] + v + f[1] - v + f[2] + v - f[3] - v - f[4] + v - f[5] - v)
}

function getKeyByType(type, codeEtab, anScol, imei) {
    const types = ['memo', 'gain', 'cinetpay', 'schoolcontrol', 'rhcontrol']
    const coefs = [4573, 6542, 3894, 5834, 9164]
    if (!types.includes(type) || (type === 'modem' && (imei === undefined || imei === ''))) { return '' }
    let result = ''
    const factors = getFactors(codeEtab)
    const a = parseInt(codeEtab)
    const b = parseInt(anScol.substring(0, 4))
    const c = parseInt(anScol.substring(5, 9))
    const d = (parseInt(imei) === 0 || imei === undefined || imei === '' || type !== 'modem') ? 0 : parseInt(Math.sqrt(parseInt(imei)))
    const index = types.indexOf(type)
    const coef = coefs[index]
    const part1 = parseInt((factors[0] * a) + (factors[1] * b) + (factors[2] * c) + (factors[3] - a) + (factors[4] - factors[5] * c) + coef) + d
    const part2 = parseInt((factors[5] * b) + (factors[4] + a * factors[2]) / (factors[3] - factors[1]) + ((factors[0] - c)) * coef / (factors[4] + factors[3])) + d
    const ret = hex(Math.abs(part1)).toUpperCase() + '-' + hex(Math.abs(part2)).toUpperCase()
    return ret
}

module.exports = {
    getKeyByType
}