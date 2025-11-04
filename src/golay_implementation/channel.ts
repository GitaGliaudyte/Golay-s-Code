import { validateBinaryVector } from "@/utils/utils-for-binary"

/**
 * Simulates sending a binary string through a Binary Symmetric Channel (BSC)
 * with a given distortion rate. Each bit has a probability of being flipped
 * based on the distortion value.
 *
 * @param {string} value - The binary input string (e.g., "0101101").
 * @param {number} distortion - The probability (0–1) that each bit is flipped.
 * @returns {string} - The resulting binary string after passing through the noisy channel.
 *
 * @throws {Error} If the input is not a valid binary string.
 * @throws {Error} If the distortion value is not between 0 and 1.
 */
export const sendThroughBSC = (value: string, distortion: number): string => {
    if(!validateBinaryVector(value)) {
        throw new Error("Input must be a binary string.");
    }

    if(distortion < 0 || distortion > 1) {
        throw new Error("Distortion must be between 0 and 1.");
    }

    return value.split('').map(bit => {
        const rand = Math.random();
        
        if (rand >= distortion) {
            return bit;
        }

        return bit === '0' ? '1' : '0';
    }).join('');
}