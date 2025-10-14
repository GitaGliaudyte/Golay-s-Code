import { validateBinaryVector } from "@/utils/utils-for-binary"

// Simulates sending a binary string through a noisy binary symmetric channel with a given distortion rate
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