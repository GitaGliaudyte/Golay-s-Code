import { validateBinaryVector } from "./utils-for-binary";

export type ImageFileData = {
    header: Uint8Array;
    binaryString: string;
    mimeType: string;
};

/**
 * Converts a UTF-8 text string into its binary representation.
 *
 * @param {string} input - Input text string.
 * @returns {string} - A binary string representing the UTF-8 bytes of the input.
 */
export const convertString = (input: string): string => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input); // UTF-8 bytes
    return Array.from(bytes)
                .map(byte => byte.toString(2).padStart(8, '0'))
                .join('');
}

/**
 * Converts a binary string back into human-readable text (UTF-8 decoding).
 *
 * @param {string} binaryString - The binary string to convert.
 * @returns {string} - The decoded text string.
 */
export const convertBinaryStringToText = (binaryString: string): string => {
    const padded = binaryString.padEnd(Math.ceil(binaryString.length / 8) * 8, '0');

    const bytes = padded.match(/.{1,8}/g);
    if (!bytes) return "";

    const byteArray = bytes.map(b => parseInt(b, 2));

    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(byteArray));
}

export enum SupportedImageFileFormat {
    BMP = 'image/bmp',
}

/**
 * Converts a Blob (e.g., uploaded image) into a structured {@link ImageFileData} object.
 * Reads the file, verifies its format, and extracts binary content and header data.
 *
 * @param {Blob} image - Image Blob to convert.
 * @returns {Promise<ImageFileData>} - Promise resolving to structured image data.
 *
 * @throws {Error} If the file cannot be read or the format is unsupported.
 */
export const blobToImageData = async (image: Blob): Promise<ImageFileData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = event => {
            if (event.target?.result) {
                // Store data as decimal values array.
                const dataArray = new Uint8Array(event.target.result as ArrayBuffer);

                switch (image.type) {
                    case SupportedImageFileFormat.BMP: {
                        // Check if it's a valid BMP file
                        if (dataArray[0] !== 0x42 || dataArray[1] !== 0x4d) {
                            reject(new Error('BMP header not found.'));
                            return;
                        }

                        // Extract the header and content based on the BMP file format specifications
                        const headerSize =
                            dataArray[14] + (dataArray[15] << 8) + (dataArray[16] << 16) + (dataArray[17] << 24);
                        const header = dataArray.subarray(0, headerSize);
                        const content = dataArray.subarray(headerSize);

                        // Convert the content part to a binary string.
                        const binaryString = Array.from(content)
                            .map(byte => byte.toString(2).padStart(8, '0'))
                            .join('');
                        resolve({ binaryString, header, mimeType: image.type });
                        break;
                    }
                    default: {
                        reject(
                            new Error(`Only ${Object.keys(SupportedImageFileFormat).join(', ')} images 
                                are currently supported.`),
                        );
                        return;
                    }
                }
            } else reject(new Error('Failed reading the file.'));
        };
        reader.onerror = () => {
            reject(new Error('Error loading the file.'));
        };

        reader.readAsArrayBuffer(image);
    });
};

/**
 * Converts {@link ImageFileData} back into a Blob (image file).
 * Reassembles the binary data and prepends the original header.
 *
 * @param {ImageFileData} imageData - The image data object containing header and binary content.
 * @returns {Blob} - A reconstructed image Blob.
 *
 * @throws {Error} If the binary string is invalid or the format is unsupported.
 */
export const imageDataToBlob = (imageData: ImageFileData): Blob => {
    if (!validateBinaryVector(imageData.binaryString)) throw new Error('Received an unexpected non-binary string.');

    // Split binary string into 8-bit substrings.
    const binaryArray = imageData.binaryString.match(/.{1,8}/g) || [];
    const decimalValues = binaryArray.map(binarySubString => parseInt(binarySubString, 2));

    let bytesArray: Uint8Array;
    switch (imageData.mimeType) {
        case SupportedImageFileFormat.BMP: {
            bytesArray = new Uint8Array([...imageData.header, ...decimalValues]);
            break;
        }
        default: {
            throw new Error(`Only ${Object.keys(SupportedImageFileFormat).join(', ')} images are currently supported.`);
        }
    }
    // Create a fresh copy so the underlying buffer is a plain ArrayBuffer
    const bytesCopy = new Uint8Array(bytesArray);
    return new Blob([bytesCopy], { type: imageData.mimeType });
};
