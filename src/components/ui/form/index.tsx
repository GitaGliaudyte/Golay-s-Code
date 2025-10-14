import * as React from 'react'
import * as FormPrimitive from '@radix-ui/react-form'
import VectorFields from './vector-fields'
import TextFields from './text-fields'
import ImageUpload from './image-upload'
import { Encoder } from '@/golay_implementation/encode'
import { Decoder } from '@/golay_implementation/decode'

type Kind = 'vector' | 'text' | 'image' | 'probability'

interface Props {
  kind?: Kind
  encoderRef?: React.MutableRefObject<Encoder | null> | React.RefObject<Encoder | null>
  decoderRef?: React.MutableRefObject<Decoder | null> | React.RefObject<Decoder | null>
}

export function FormDemo({ kind = 'vector', encoderRef, decoderRef }: Props) {

  // Distortion Probability
  const [prob, setProb] = React.useState<number>(0.05)

  return (
    <FormPrimitive.Root className="p-4 bg-white rounded shadow">
      {kind === 'vector' && (
        <VectorFields probability={prob}/>
      )}

      {kind === 'text' && (
        <TextFields probability={prob} encoderRef={encoderRef} decoderRef={decoderRef} />
      )}

      {kind === 'image' && (
        <ImageUpload probability={prob} encoderRef={encoderRef} decoderRef={decoderRef} />
      )}

      {kind === 'probability' && (
        <div>
          <label className="block text-sm font-medium">Global probability</label>
          <input
            type="number"
            step="any"
            min={0}
            max={1}
            value={Number.isNaN(prob) ? '' : prob}
            onChange={(e) => setProb(Number(e.target.value))}
            className="mt-1 block w-48 rounded border px-2 py-1"
          />
        </div>
      )}
    </FormPrimitive.Root>
  )
}

export default FormDemo
