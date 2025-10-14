import { useEffect, useMemo, useRef, useState } from "react"
import FieldWithError from "./field-with-error"
import { Encoder } from '@/golay_implementation/encode'
import { Decoder } from '@/golay_implementation/decode'
import { convertString, convertBinaryStringToText } from "@/utils/convertions"
import { sendThroughBSC } from "@/golay_implementation/channel"

type Props = {
  probability: number
  encoderRef?: React.MutableRefObject<Encoder | null> | React.RefObject<Encoder | null>
  decoderRef?: React.MutableRefObject<Decoder | null> | React.RefObject<Decoder | null>
}

export function TextFields({ probability, encoderRef: externalEncoderRef, decoderRef: externalDecoderRef }: Props) {
  const [text, setText] = useState<string>('')
  const [decodedText, setDecodedText] = useState<string>('')
  const [insecureText, setInsecureText] = useState<string>('')

  // Create encoder and decoder instances once and memoize them. If external refs are
  // provided prefer those, otherwise keep internal refs pointing to memoized instances.
  const memoizedEncoder = useMemo(() => new Encoder(), [])
  const memoizedDecoder = useMemo(() => new Decoder(), [])

  const internalEncoderRef = useRef<Encoder | null>(memoizedEncoder)
  const encoderRef = externalEncoderRef ?? internalEncoderRef

  const internalDecoderRef = useRef<Decoder | null>(memoizedDecoder)
  const decoderRef = externalDecoderRef ?? internalDecoderRef

  const convertedText = useMemo(() => (text.length > 0 ? convertString(text) : ''), [text])

  useEffect(() => {
    if (convertedText.length > 0) {
      try {
        const afterChannelInsecure = sendThroughBSC(convertedText, probability)

        const insecureReceived = convertBinaryStringToText(afterChannelInsecure.slice(0, convertedText.length))
        setInsecureText(insecureReceived)

        const encoded = encoderRef.current!.encode(convertedText)

        const afterChannel = sendThroughBSC(encoded, probability)

        const decodedBinaryFull = decoderRef.current!.decode(afterChannel)
        const decodedBinary = decodedBinaryFull.slice(0, convertedText.length)

        const decoded = convertBinaryStringToText(decodedBinary)
        setDecodedText(decoded)
      } catch (e: any) {
        setDecodedText('')
      }
    } else {
      setDecodedText('')
      setInsecureText('')
    }
  }, [convertedText, probability, encoderRef, decoderRef])

  return (
    <div className="grid grid-cols-1 gap-2">
      <FieldWithError label="Text" value={text} onChange={setText} errorMessage={null} textareaProps={{ rows: 4 }} />
      <FieldWithError label="Non-coded (channel only)" value={insecureText} onChange={setInsecureText} errorMessage={null} textareaProps={{ rows: 4, disabled: true }} />
      <FieldWithError label="Decoded Text" value={decodedText} onChange={setDecodedText} errorMessage={null} textareaProps={{ rows: 4, disabled: true }} />
    </div>
  )
}

export default TextFields
