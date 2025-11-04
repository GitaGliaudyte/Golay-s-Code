import { numberArrayToString } from "./utils-for-strings";

/**
 * Multiplies a binary vector by a binary matrix using modulo 2 arithmetic.
 *
 * @param vector - An array of numbers representing the vector (e.g., [1,0,1]).
 * @param matrix - A 2D array of numbers representing the matrix. Its row count must equal the vector length.
 * @throws Throws an error if the matrix row count does not match the vector length.
 * @returns A string representing the resulting binary vector after multiplication (each element modulo 2).
 */
export const multiplyVectorByMatrix = (vector: number[], matrix: number[][]): string => {
    const vectorLength = vector.length;
    if (matrix.length !== vectorLength) {
        throw new Error("Matrix row count must match vector length.");
    }

    const matrixWidth = matrix[0].length;
    const result: number[] = new Array(matrixWidth).fill(0);

    for (let col = 0; col < matrixWidth; col++) {
        for (let row = 0; row < vectorLength; row++) {
            result[col] += vector[row] * matrix[row][col];
        }
        result[col] = result[col] % 2; // Modulo 2 for binary result
    }

    return numberArrayToString(result);
};

/**
 * Calculates the weight of a binary vector string.
 *
 * @param vector - A string representing a binary vector (e.g., "10101").
 * @returns The number of '1' bits in the vector.
 */
export const vectorWeight = (vector: string): number => {
    return vector.split('').reduce((sum, bit) => sum + (bit === '1' ? 1 : 0), 0);
}

/**
 * Adds two binary vectors element-wise modulo 2.
 *
 * @param a - A string representing the first binary vector (e.g., "1010").
 * @param b - A string representing the second binary vector of the same length.
 * @throws Throws an error if the vector lengths do not match or if the strings contain non-numeric characters.
 * @returns A string representing the element-wise modulo 2 sum of the two vectors.
 */
export const addVectors = (a: string, b: string): string => {
    if(a.length !== b.length){
        throw new Error("Lengths do not match.");
    }

    if(isNaN(parseInt(a, 10)) || isNaN(parseInt(b, 10))){
        throw new Error("Vectors should include numbers only.");
    }

    return a.split('').map((bitA, i) => {
        const coordinateA = parseInt(bitA, 10);
        const coordinateB = parseInt(b[i], 10);

        return ((coordinateA + coordinateB) % 2).toString();
    }).join('');
}