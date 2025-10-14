// Utility functions for binary vector validation
export const validateBinaryVector = (value: string): boolean => {
    const regex = /^[01]+$/;
    return regex.test(value);
};

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