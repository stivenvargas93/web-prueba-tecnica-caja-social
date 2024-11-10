import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY || "1234567890123456");
const IV = CryptoJS.enc.Utf8.parse(process.env.IV || "1234567890123456");

export function encryptData(data: object): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY, {
        iv: IV,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    }).toString();
}

export function decryptData<T>(encryptedData: string): T {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY, {
        iv: IV,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData) as T;
}