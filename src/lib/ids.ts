export function strongId(prefix = ""): string {
    const random = cryptoRandom();
    const time = Date.now().toString(36);
    return `${prefix}_${time}_${random}`;
  }
  
  function cryptoRandom(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const cryptoObj = globalThis.crypto || require("crypto");
  
    for (let i = 0; i < length; i++) {
      const rand = cryptoObj.getRandomValues
        ? cryptoObj.getRandomValues(new Uint32Array(1))[0] % chars.length
        : Math.floor(Math.random() * chars.length);
      result += chars[rand];
    }
  
    return result;
  }