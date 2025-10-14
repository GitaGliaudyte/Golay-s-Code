import { Decoder } from "@/golay_implementation/decode"
import { Encoder } from "@/golay_implementation/encode"
import { useMemo, useRef } from "react"
import { useEffect, useState } from "react"
import { blobToImageData, imageDataToBlob, ImageFileData } from '@/utils/convertions'
import { sendThroughBSC } from '@/golay_implementation/channel'
import { LabeledFile } from "./labeled-file"
import { LabeledImage } from "./labeled-image"

type Props = {
  probability: number
  encoderRef?: React.MutableRefObject<Encoder | null> | React.RefObject<Encoder | null>
  decoderRef?: React.MutableRefObject<Decoder | null> | React.RefObject<Decoder | null>
}

export function ImageUpload({ probability, encoderRef: externalEncoderRef, decoderRef: externalDecoderRef }: Props) {
  // Create encoder and decoder instances once and memoize them. If external refs are
  // provided prefer those, otherwise keep internal refs pointing to memoized instances.
  const memoizedEncoder = useMemo(() => new Encoder(), [])
  const memoizedDecoder = useMemo(() => new Decoder(), [])

  const internalEncoderRef = useRef<Encoder | null>(memoizedEncoder)
  const encoderRef = externalEncoderRef ?? internalEncoderRef

  const internalDecoderRef = useRef<Decoder | null>(memoizedDecoder)
  const decoderRef = externalDecoderRef ?? internalDecoderRef

    const [imageFile, setImageFile] = useState<File>();
    const [imageFileError, setImageFileError] = useState<string>();
    const [imageBinaryContents, setImageBinaryContents] = useState<ImageFileData>();

    useEffect(() => {
        const getImageBinaryValue = async () => {
            try {
                if (!imageFile) return;
                const imageData = await blobToImageData(imageFile);
                setImageBinaryContents(imageData);
            } catch (error) {
                if (error instanceof Error) setImageFileError(error.message);
            }
        };
        getImageBinaryValue();
    }, [imageFile]);

    const finalInsecureImage = useMemo(() => {
        if (!imageBinaryContents) return;

        const receivedBinaryValue = sendThroughBSC(imageBinaryContents.binaryString, probability);
    const insecureBlob = imageDataToBlob({
            ...imageBinaryContents,
            binaryString: receivedBinaryValue,
        });
        return URL.createObjectURL(insecureBlob);
    }, [probability, imageBinaryContents]);

    const encodedBinaryValue = useMemo(() => {
        if (!imageBinaryContents) return;
        return encoderRef.current!.encode(imageBinaryContents.binaryString);
    }, [encoderRef, imageBinaryContents]);

    const finalSecureImage = useMemo(() => {
        if (!encodedBinaryValue || !imageBinaryContents) return;

        const receivedCodedBinaryValue = sendThroughBSC(encodedBinaryValue, probability);
        const decodedBinaryValue = decoderRef.current!.decode(receivedCodedBinaryValue).substring(
            0,
            imageBinaryContents.binaryString.length,
        );
    const secureBlob = imageDataToBlob({
            ...imageBinaryContents,
            binaryString: decodedBinaryValue,
        });
        return URL.createObjectURL(secureBlob);
    }, [decoderRef, probability, imageBinaryContents, encodedBinaryValue]);

    useEffect(
        () => () => {
            if (finalInsecureImage) URL.revokeObjectURL(finalInsecureImage);
            if (finalSecureImage) URL.revokeObjectURL(finalSecureImage);
        },
        [finalInsecureImage, finalSecureImage],
    );


  return (
    <div className="grid grid-cols-1 gap-2">
      <LabeledFile
          id="initial-image"
          className="file-input-bordered w-full"
          title="Upload an image"
          setValue={setImageFile}
          errorMessage={imageFileError}
      />
      <div className="divider" />
      {finalInsecureImage && finalSecureImage && (
          <div className="flex w-full flex-col items-center gap-4">
              <LabeledImage
                  id="original-image"
                  title="Original image"
                  src={imageFile ? URL.createObjectURL(imageFile) : undefined}
              />
              <LabeledImage id="insecure-image" title="Non-coded image" src={finalInsecureImage} />
              <LabeledImage id="secure-image" title="Coded image" src={finalSecureImage} />
          </div>
      )}
    </div>
  )
}

export default ImageUpload
