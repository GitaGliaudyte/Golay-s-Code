import { validateBinaryVector } from '@/utils/utils-for-binary';
import { GOLAY_B_MATRIX, IDENTITY_MATRIX } from './matrixes';
import { flipBitAtPosition, stringToNumberArray, stringToSubstrings } from '@/utils/utils-for-strings';
import { addVectors, multiplyVectorByMatrix, vectorWeight } from '@/utils/utils-for-vectors';
import { Encoder } from './encode';

export class Decoder {
    public static readonly codeLength = 23;

    // Control matrix for Golay code (G|I). Note that this is 12x24 matrix.
    // Identity matrix concatenated with Golay B matrix vertically.
    private static controlMatrix: number[][] =
        IDENTITY_MATRIX.concat(GOLAY_B_MATRIX);

    public decode = (value: string): string => {
        if (value.length % Decoder.codeLength !== 0) {
            throw new Error(
                `Invalid encoded string length. Must be a multiple of ${Decoder.codeLength}.`,
            );
        }

        if (!validateBinaryVector(value)) {
            throw new Error('Input must be a binary string.');
        }

        const substrings = stringToSubstrings(value, Decoder.codeLength);
        return substrings.map(str => this.decodeSubstring(str)).join('');
    };

    private decodeSubstring = (substring: string): string => {
        const word = substring.concat(
            vectorWeight(substring) % 2 === 0 ? '1' : '0', // Append parity bit to make the weight odd
        );
        const errorVector = this.searchForErrorVector(word);
        if(errorVector === undefined) throw new Error("Retransmission is needed.");
        
        const v = errorVector[0] + errorVector[1];
        const codeword = addVectors(substring, v.slice(0, -1));
        return codeword.slice(0, 12);
    };

    private searchForErrorVector = (codeword: string): [string, string] | undefined => {
        const wVector = stringToNumberArray(codeword);
        const syndrome = this.calculateFirstSyndrome(wVector);
        let u: [string, string] | undefined = undefined;
        
        u = this.useVectorWeightToSearch(syndrome);

        if(u !== undefined) return u;

        const secondSyndrome = this.calculateSecondSyndrome(syndrome);
        let u2 = this.useVectorWeightToSearch(secondSyndrome);
        if (u2 !== undefined) {
            u = [u2[1], u2[0]];
            return u;
        }
        return undefined;
    }

    private calculateFirstSyndrome = (w: number[]): string => {
        return multiplyVectorByMatrix(w, Decoder.controlMatrix);
    }

    private calculateSecondSyndrome = (s: string): string => {
        return multiplyVectorByMatrix(stringToNumberArray(s), GOLAY_B_MATRIX);
    }

    private useVectorWeightToSearch = (syndrome: string): [string, string] | undefined => {
        let u: [string, string] | undefined = undefined;

        if (vectorWeight(syndrome) <= 3) {
            const zeros = '0'.repeat(Encoder.codeLength);
            u = [syndrome, zeros];
            return u;
        }

        GOLAY_B_MATRIX.forEach((row, i) => {
            const rowVector = addVectors(syndrome, row.join(''));
            if (vectorWeight(rowVector) <= 2) {
                const zeros = '0'.repeat(Encoder.codeLength);
                const e_i = flipBitAtPosition(zeros, i);
                u = [rowVector, e_i];
                return;
            }
        });

        return u;
    }
}
