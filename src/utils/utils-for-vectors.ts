import { numberArrayToString } from "./utils-for-strings";

// Utility functions for vector and matrix operations
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

export const vectorWeight = (vector: string): number => {
    return vector.split('').reduce((sum, bit) => sum + (bit === '1' ? 1 : 0), 0);
}

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