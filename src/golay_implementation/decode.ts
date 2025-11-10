import { validateBinaryVector } from '@/utils/utils-for-binary';
import { GOLAY_B_MATRIX, IDENTITY_MATRIX } from './matrixes';
import { flipBitAtPosition, stringToNumberArray, stringToSubstrings } from '@/utils/utils-for-strings';
import { addVectors, multiplyVectorByMatrix, vectorWeight } from '@/utils/utils-for-vectors';
import { Encoder } from './encode';

export class Decoder {
    public static readonly codeLength = 23;

    // Control matrix for Golay code (G|I). Note that this is 24x12 matrix.
    // Identity matrix concatenated with Golay B matrix vertically.
    private static controlMatrix: number[][] =
        IDENTITY_MATRIX.concat(GOLAY_B_MATRIX);

    /**
     * Decodes a binary string consisting of one or more concatenated
     * Golay-encoded codewords.
     *
     * @param {string} value - Encoded binary string (multiple of 23 bits).
     * @returns {string} - The decoded binary string (data portion only).
     * @throws {Error} If the input is not a valid binary string or has an invalid length.
     */
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

    /**
     * Decodes a single 23-bit Golay codeword.
     * Adds a parity bit to make the word's weight odd, searches for an error vector,
     * and reconstructs the corrected data bits.
     *
     * @param {string} substring - A 23-bit encoded binary string.
     * @returns {string} - The 12-bit decoded data portion.
     * @throws {Error} If decoding fails and retransmission is required.
     */
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

    /**
     * Searches for the most likely error vector for a given codeword.
     *
     * @param {string} codeword - The received binary codeword (including parity bit).
     * @returns {[string, string] | undefined} - A pair of error vectors if found, otherwise undefined.
     */
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

    /**
     * Calculates the first syndrome for the given codeword.
     *
     * @param {number[]} w - The received codeword as a numeric vector.
     * @returns {string} - The computed syndrome as a binary string.
     */
    private calculateFirstSyndrome = (w: number[]): string => {
        return multiplyVectorByMatrix(w, Decoder.controlMatrix);
    }

    /**
     * Calculates the second syndrome from the first syndrome.
     *
     * @param {string} s - The first syndrome as a binary string.
     * @returns {string} - The resulting second syndrome.
     */
    private calculateSecondSyndrome = (s: string): string => {
        return multiplyVectorByMatrix(stringToNumberArray(s), GOLAY_B_MATRIX);
    }

    /**
     * Attempts to find an error vector by evaluating the weight of the given syndrome.
     * If the syndrome weight is small (≤ 3), correction is possible.
     *
     * @param {string} syndrome - Syndrome vector to test.
     * @returns {[string, string] | undefined} - A valid error vector pair or undefined if not found.
     */
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
