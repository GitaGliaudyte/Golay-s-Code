import * as React from 'react'
import FieldWithError from './field-with-error'
import { Encoder } from '@/golay_implementation/encode'
import { sendThroughBSC } from '@/golay_implementation/channel'
import { useEffect, useMemo, useRef } from 'react'
import { binaryStringXOR } from '@/utils/utils-for-binary'
import { Decoder } from '@/golay_implementation/decode'

type Props = {
    probability: number
    encoderRef?: React.MutableRefObject<Encoder | null> | React.RefObject<Encoder | null>
    decoderRef?: React.MutableRefObject<Decoder | null> | React.RefObject<Decoder | null>
}

export function VectorFields({ probability, encoderRef: externalEncoderRef, decoderRef: externalDecoderRef }: Props) {
    const [originalVector, setOriginalVector] = React.useState<string>('')
    const [encodedVector, setEncodedVector] = React.useState<string>('')
    const [receivedVector, setReceivedVector] = React.useState<string>('')
    const [decodedVector, setDecodedVector] = React.useState<string>('')
    const [encoderError, setEncoderError] = React.useState<string | null>(null)
    const [errorVectorError, setErrorVectorError] = React.useState<string | null>(null)
    const [errorVector, setErrorVector] = React.useState<string>('');
    const [decodedVectorError, setDecodedVectorError] = React.useState<string | null>(null);

    const isLengthOk = originalVector.length === 12
    const isBinary = /^[01]*$/.test(originalVector)
    let errorMessage: string | null = null
    if (!isLengthOk) errorMessage = `Must be exactly 12 characters (current: ${originalVector.length})`
    else if (!isBinary) errorMessage = 'Must contain only 0 and 1'

    // Create encoder and decoder instance once, but prefer externally-provided refs
    const internalEncoderRef = useRef<Encoder | null>(null)
    if (internalEncoderRef.current === null) internalEncoderRef.current = new Encoder()
    const encoderRef = externalEncoderRef ?? internalEncoderRef

    const internalDecoderRef = useRef<Decoder | null>(null)
    if (internalDecoderRef.current === null) internalDecoderRef.current = new Decoder()
    const decoderRef = externalDecoderRef ?? internalDecoderRef

    // Recompute encoded vector whenever originalVector changes and is valid
    useEffect(() => {
        setEncoderError(null)
        if (errorMessage === null) {
            try {
                const encoded = encoderRef.current!.encode(originalVector)
                setEncodedVector(encoded)
            } catch (e: any) {
                const msg = e?.message ?? String(e)
                setEncoderError(msg)
                setEncodedVector('')
            }
        } else {
            setEncodedVector('')
        }
    }, [originalVector, errorMessage])

    // Send encoded vector through channel when encodedVector or probability changes
    useEffect(() => {
        setErrorVectorError(null);
        if (!encodedVector) {
            setReceivedVector('')
            return
        }

        try {
            const afterChannel = sendThroughBSC(encodedVector, probability)
            setReceivedVector(afterChannel)
        } catch (e: any) {
            const msg = e?.message ?? String(e)
            setReceivedVector('')
            setErrorVector('')
            setErrorVectorError(msg)
        }
    }, [encodedVector, probability]);

    // Calculate error vector (XOR of encoded and received)
    useEffect(() => {
        try {
            const xor = binaryStringXOR(encodedVector, receivedVector);
            setErrorVector(xor);
            setErrorVectorError(null);
        } catch (e: any) {
            const msg = e?.message ?? String(e);
            setErrorVector('');
            setErrorVectorError(msg);
        }
    }, [encodedVector, receivedVector]);

    // Decode received vector
    useEffect(() => {
        if(receivedVector){
            try{
                const decoded = decoderRef.current!.decode(receivedVector)
                setDecodedVector(decoded);
                setDecodedVectorError(null);
            } catch (e: any) {
                const msg = e?.message ?? String(e);
                setDecodedVector('');
                setDecodedVectorError(msg);
            }
        }
        else {
            setDecodedVector('');
            setDecodedVectorError(null);
        }
    }, [receivedVector])

return (
    <div className="grid grid-cols-1 gap-2">
        <FieldWithError
            label="Original Vector"
            value={originalVector}
            onChange={setOriginalVector}
            errorMessage={errorMessage ?? encoderError}
        />
        <FieldWithError
            label="Encoded Vector"
            value={encodedVector}
            onChange={setEncodedVector}
            errorMessage={null}
            inputProps={{ disabled: true }}
        />
        <div>
            <FieldWithError
                label="Error Vector"
                value={errorVector}
                onChange={setErrorVector}
                errorMessage={errorVectorError}
                inputProps={{ disabled: true }}
            />
            {errorVector && (
                <p className="text-sm text-gray-600 mt-1">
                    Number of errors:{" "}
                    <span className="font-semibold">
                        {errorVector.split("").filter((b) => b === "1").length}
                    </span>
                </p>
            )}
        </div>
        <FieldWithError
            label="Received Vector"
            value={receivedVector}
            onChange={setReceivedVector}
            errorMessage={null}
        />
        <FieldWithError
            label="Decoded Vector"
            value={decodedVector}
            onChange={setDecodedVector}
            errorMessage={decodedVectorError}
            inputProps={{ disabled: true }}
        />
    </div>
)
}

export default VectorFields
