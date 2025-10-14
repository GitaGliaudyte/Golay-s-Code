import { validateBinaryVector } from "./utils-for-binary";

export type ImageFileData = {
    header: Uint8Array;
    binaryString: string;
    mimeType: string;
};

export const convertString = (input: string): string => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input); // UTF-8 bytes
    return Array.from(bytes)
                .map(byte => byte.toString(2).padStart(8, '0'))
                .join('');
}

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
