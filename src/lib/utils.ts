import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class URLShortener {
  private alphabet: string;
  private base: number;

  constructor() {
    // Define the alphabet without ambiguous characters like 0, O, l, I
    this.alphabet = "23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_";
    this.base = this.alphabet.length;
  }

  /**
   * Encodes a given number into the shortest possible string using the alphabet.
   * @param num - The number to encode.
   * @returns The encoded string.
   */
  encode(num: number): string {
    if (num === 0) return this.alphabet[0]!;

    let encoded = "";
    while (num > 0) {
      const remainder = num % this.base;
      encoded = this.alphabet[remainder] + encoded;
      num = Math.floor(num / this.base);
    }

    return encoded;
  }

  /**
   * Decodes a given string back into the corresponding number.
   * @param str - The encoded string.
   * @returns The decoded number.
   */
  decode(str: string): number {
    let decoded = 0;

    for (const char of str) {
      const index = this.alphabet.indexOf(char);
      if (index === -1) {
        throw new Error(`Invalid character "${char}" in input string`);
      }
      decoded = decoded * this.base + index;
    }

    return decoded;
  }

  string2Number(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash); // A simple hash algorithm
    }
    return Math.abs(hash); // Ensure the hash is a positive number
  }

  number2String(num: number) {
    let str = "";
    while (num > 0) {
      str = this.alphabet.charAt(num % this.base) + str;
      num = Math.floor(num / this.base);
    }
    return str;
  }
}
