import * as CryptoJS from 'crypto-js';

export function encriptar(data: any) {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), 'Pi7@').toString();
    } catch (e) {
        localStorage.clear();
        console.log(e);
    }
}

export function desencriptar(data: any) {
    try {
        const bytes = CryptoJS.AES.decrypt(data, 'Pi7@');
        if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return data;
    } catch (e) {
        localStorage.clear();
        console.log(e);
    }
}
