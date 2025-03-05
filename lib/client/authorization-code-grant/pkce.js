class PKCE {
  static async getCryptoAPI() {
    if (!globalThis.crypto?.subtle) {
      throw new Error(
        "Crypto API not available. Ensure a secure context (HTTPS) in the browser or use Node.js 19+."
      );
    }
    return globalThis.crypto;
  }

  static bufferToBase64Url(buffer) {
    if (globalThis.Buffer) {
      // Node.js (uses Buffer)
      return Buffer.from(buffer)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    } else {
      // Browser (uses btoa)
      return btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }
  }

  static encodeToBuffer(input) {
    return new TextEncoder().encode(input);
  }

  static async generateCodeChallenge(codeVerifier) {
    const cryptoAPI = await this.getCryptoAPI();
    const digest = await cryptoAPI.subtle.digest(
      "SHA-256",
      this.encodeToBuffer(codeVerifier)
    );
    return ["S256", this.bufferToBase64Url(digest)];
  }

  static async generateRandomCodeVerifier() {
    const cryptoAPI = await this.getCryptoAPI();
    const randomBytes = new Uint8Array(32);
    cryptoAPI.getRandomValues(randomBytes);
    return this.bufferToBase64Url(randomBytes);
  }
}

export default PKCE;