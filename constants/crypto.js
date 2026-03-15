import { Buffer } from "buffer";

const SECRET_KEY = "shine-bright-like-a-diamond";

function keyToBytes(key, length = 32) {
  const bytes = [];
  for (let i = 0; i < length; i++) {
    bytes.push(key.charCodeAt(i % key.length));
  }
  return new Uint8Array(bytes);
}

function xorEncrypt(text, key) {
  const keyBytes = keyToBytes(key);
  const textBytes = new TextEncoder().encode(text);
  const result = textBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
  return Buffer.from(result).toString("base64");
}

function xorDecrypt(base64, key) {
  const keyBytes = keyToBytes(key);
  const encBytes = new Uint8Array(Buffer.from(base64, "base64"));
  const result = encBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
  return new TextDecoder().decode(result);
}

export function encrypt(text) {
  return xorEncrypt(text, SECRET_KEY);
}

export function decrypt(cipherText) {
  try {
    return xorDecrypt(cipherText, SECRET_KEY);
  } catch {
    return "";
  }
}
