import { validateBinaryVector } from "@/utils/utils-for-binary";
import { GOLAY_B_MATRIX, IDENTITY_MATRIX } from "./matrixes";
import { paddedStrings, stringToNumberArray, stringToSubstrings } from "@/utils/utils-for-strings";
import { multiplyVectorByMatrix } from "@/utils/utils-for-vectors";

export class Encoder {
    public static readonly codeLength = 12;

    private static matrixGenerate: number[][] = IDENTITY_MATRIX.map((row, i) =>
        row.concat(GOLAY_B_MATRIX[i].slice(0, -1))
    );

    public encode = (value: string): string => {
        if (!validateBinaryVector(value)) {
            throw new Error("Input must be a binary string.");
        }
        
        return stringToSubstrings(value, Encoder.codeLength)
            .map(s => {
                const substring = s.padEnd(Encoder.codeLength, '0');
                return multiplyVectorByMatrix(stringToNumberArray(substring), Encoder.matrixGenerate);
            }).join('');
    };
}
