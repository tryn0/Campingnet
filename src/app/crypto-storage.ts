import * as CryptoJS from 'crypto-js';

export function encriptar(data: any, key: any) {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    } catch (e) {
        localStorage.clear();
        console.log(e);
    }
}

export function desencriptar(data: any, key: any) {
    try {
        const bytes = CryptoJS.AES.decrypt(data, key);
        if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return data;
    } catch (e) {
        localStorage.clear();
        console.log(e);
    }
}
