import { Encoder } from "@/golay_implementation/encode";

// Utility function to split a string into substrings of a specified length
export const stringToSubstrings = (str: string, length: number): string[] => {
    const substrings: string[] = [];
    for (let i = 0; i < str.length; i += length) {
        substrings.push(str.substring(i, i + length));
    }
    return substrings;
};

// Utility function to pad substrings to a specified length with trailing zeros
export const paddedStrings = (substrings: string[], length: number): string[] => {
    return substrings.map(s => {
        const substring = s.padEnd(length, '0');
        return substring;
    });
};

// Utility function to convert a numeric string into an array of numbers
export const stringToNumberArray = (str: string): number[] => {
    if(isNaN(parseInt(str, 10))) {
        throw new Error("Input string must contain only numeric characters.");
    };

    return str.split('').map(char => parseInt(char, 10));
};

// Utility function to convert an array of numbers back into a string
export const numberArrayToString = (arr: number[]): string => {
    return arr.join('');
}

// Flip a '0' to '1' at the specified position in a 12-character binary string.
export const flipBitAtPosition = (str: string, pos: number): string => {
    const chars = str.split('');
    if (chars[pos] === '0') chars[pos] = '1';
    return chars.join('');
}
