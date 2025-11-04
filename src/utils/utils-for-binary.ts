/**
 * Checks whether a given string contains only binary digits (0 and 1).
 *
 * @param {string} value - The input string to validate.
 * @returns {boolean} - `true` if the string is binary, otherwise `false`.
 */
export const validateBinaryVector = (value: string): boolean => {
    const regex = /^[01]+$/;
    return regex.test(value);
};

/**
 * Performs a bitwise XOR (exclusive OR) operation on two binary strings.
 * Both strings must be of equal length and contain only '0' or '1' characters.
 *
 * @param {string} a - The first binary string.
 * @param {string} b - The second binary string.
 * @returns {string} - The result of the XOR operation as a new binary string.
 *
 * @throws {Error} If the strings are not of the same length.
 * @throws {Error} If either string contains non-binary characters.
 */
export const binaryStringXOR = (a: string, b: string): string => {
    if (a.length !== b.length) {
        throw new Error("Binary strings must be of the same length for XOR operation.");
    }

    if ((!validateBinaryVector(a) || !validateBinaryVector(b)) && (a !== '' && b !== '')) {
        throw new Error("Both strings must be binary.");
    }

    let result = '';
    for (let i = 0; i < a.length; i++) {
        result += a[i] === b[i] ? '0' : '1';
    }
    return result;
}