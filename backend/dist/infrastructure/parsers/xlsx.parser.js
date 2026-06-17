"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXlsx = parseXlsx;
const XLSX = require("xlsx");
function toDate(value) {
    if (!value)
        return null;
    if (value instanceof Date)
        return value;
    if (typeof value === 'number') {
        return XLSX.SSF.parse_date_code
            ? new Date((value - 25569) * 86400 * 1000)
            : null;
    }
    return null;
}
function toStr(value) {
    if (value === null || value === undefined)
        return null;
    const s = String(value).trim();
    return s === '' ? null : s;
}
function toNum(value) {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
}
function toBool(value) {
    if (!value)
        return false;
    return String(value).toLowerCase() === 'yes' || value === true || value === 1;
}
function parseXlsx(buffer) {
    const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const ws = wb.Sheets['Control'];
    if (!ws)
        throw new Error('Sheet "Control" not found in workbook');
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
    const result = [];
    for (let i = 2; i < rows.length; i++) {
        const r = rows[i];
        if (!r || !r[0])
            continue;
        const code = toStr(r[0]);
        if (!code)
            continue;
        result.push({
            code,
            bu: toStr(r[1]) ?? '',
            area: toStr(r[2]),
            fullAddress: toStr(r[3]),
            officeKeys: toBool(r[4]),
            keysCount: toNum(r[5]),
            securityKeysCount: toNum(r[6]),
            fobCount: toNum(r[7]),
            electricityStatus: toStr(r[8]),
            gasStatus: toStr(r[9]),
            bedNumber: toNum(r[10]),
            bedroomType: toStr(r[11]) ?? '',
            sex: toStr(r[12]) ?? '',
            bedSize: toStr(r[13]) ?? '',
            depositAmount: toNum(r[15]),
            rentAmount: toNum(r[16]),
            residentName: toStr(r[17]),
            residentEmail: toStr(r[18]),
            residentTelephone: toStr(r[19]),
            residentNationality: toStr(r[20]),
            residentPersonalId: toStr(r[21]),
            residentIban: toStr(r[22]),
            residentEmergencyContact: toStr(r[23]),
            residentSource: toStr(r[24]),
            residentIsHead: toBool(r[25]),
            checkInDate: toDate(r[26]),
            contractEndDate: toDate(r[27]),
            checkOutDate: toDate(r[28]),
            comments: toStr(r[30]),
            tempDepositAmount: r[33] !== null ? toNum(r[33]) : null,
            tempRentAmount: r[34] !== null ? toNum(r[34]) : null,
            tempResidentName: toStr(r[35]),
            tempResidentEmail: toStr(r[36]),
            tempResidentTelephone: toStr(r[37]),
            tempResidentNationality: toStr(r[38]),
            tempResidentPersonalId: toStr(r[39]),
            tempResidentIban: toStr(r[40]),
            tempResidentEmergencyContact: toStr(r[41]),
            tempResidentSource: toStr(r[42]),
            tempResidentIsHead: toBool(r[43]),
            tempCheckInDate: toDate(r[44]),
            tempContractEndDate: toDate(r[45]),
        });
    }
    return result;
}
//# sourceMappingURL=xlsx.parser.js.map