import { Encoder } from "@/golay_implementation/encode";

/**
 * Splits a string into multiple substrings of a given length.
 *
 * @param str - The input string to be split.
 * @param length - The desired length of each substring.
 * @returns An array of substrings, each of the specified length (the last one may be shorter if the string length is not divisible by the length).
 */
export const stringToSubstrings = (str: string, length: number): string[] => {
    const substrings: string[] = [];
    for (let i = 0; i < str.length; i += length) {
        substrings.push(str.substring(i, i + length));
    }
    return substrings;
};

/**
 * Pads each string in an array to a specified length by adding trailing zeros.
 *
 * @param substrings - An array of strings to be padded.
 * @param length - The length to which each string should be padded.
 * @returns A new array of strings, each padded with trailing '0's to the specified length.
 */
export const paddedStrings = (substrings: string[], length: number): string[] => {
    return substrings.map(s => {
        const substring = s.padEnd(length, '0');
        return substring;
    });
};

/**
 * Converts a string containing numeric characters into an array of numbers.
 *
 * @param str - A string containing only numeric characters (e.g., "1234").
 * @throws Throws an error if the input string contains non-numeric characters.
 * @returns An array of numbers corresponding to each character in the string.
 */
export const stringToNumberArray = (str: string): number[] => {
    if(isNaN(parseInt(str, 10))) {
        throw new Error("Input string must contain only numeric characters.");
    };

    return str.split('').map(char => parseInt(char, 10));
};

/**
 * Converts an array of numbers into a string by concatenating all elements.
 *
 * @param arr - An array of numbers.
 * @returns A string representing the concatenation of all numbers in the array.
 */
export const numberArrayToString = (arr: number[]): string => {
    return arr.join('');
}

/**
 * Flips a single '0' bit to '1' at a specified index in a binary string.
 *
 * @param str - A binary string (e.g., "010101010101").
 * @param pos - The position (0-based index) of the bit to flip.
 * @returns A new string with the bit at the specified position flipped from '0' to '1'. If the bit is already '1', it remains unchanged.
 */
export const flipBitAtPosition = (str: string, pos: number): string => {
    const chars = str.split('');
    if (chars[pos] === '0') chars[pos] = '1';
    return chars.join('');
}
