import * as React from 'react'
import * as FormPrimitive from '@radix-ui/react-form'

type Kind = 'vector' | 'text' | 'image' | 'probability'

interface Props {
  kind?: Kind
}

export function FormDemo({ kind = 'vector' }: Props) {
  // Vector fields
  const [vectorValues, setVectorValues] = React.useState<string[]>(['', '', '', '', ''])
  // Text fields
  const [title, setTitle] = React.useState('')
  const [body, setBody] = React.useState('')
  const [language, setLanguage] = React.useState('')
  // Image upload
  const [file, setFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  // Probability
  const [prob, setProb] = React.useState<number>(0.5)

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function onVectorChange(i: number, v: string) {
    setVectorValues((prev) => {
      const next = [...prev]
      next[i] = v
      return next
    })
  }

  return (
    <FormPrimitive.Root onSubmit={(e) => e.preventDefault()} className="p-4 bg-white rounded shadow">
      {kind === 'vector' && (
        <div className="grid grid-cols-1 gap-2">
          {vectorValues.map((val, i) => (
            <div key={i}>
              <label className="block text-sm font-medium">v{i + 1}</label>
              <input value={val} onChange={(e) => onVectorChange(i, e.target.value)} className="mt-1 block w-full rounded border px-2 py-1" />
            </div>
          ))}
        </div>
      )}

      {kind === 'text' && (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded border px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium">Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className="mt-1 block w-full rounded border px-2 py-1" rows={4} />
          </div>
          <div>
            <label className="block text-sm font-medium">Language</label>
            <input value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 block w-full rounded border px-2 py-1" />
          </div>
        </div>
      )}

      {kind === 'image' && (
        <div className="grid grid-cols-1 gap-2">
          <label className="block text-sm font-medium">Upload image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1"
          />
          {previewUrl && <img src={previewUrl} alt="preview" className="mt-2 max-h-48 object-contain" />}
        </div>
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

      <div className="flex gap-2 mt-4">
        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Submit</button>
        <button type="button" onClick={() => {
          setVectorValues(['', '', '', '', ''])
          setTitle('')
          setBody('')
          setLanguage('')
          setFile(null)
          setProb(0.5)
        }} className="px-3 py-1 border rounded">Reset</button>
      </div>
    </FormPrimitive.Root>
  )
}

export default FormDemo
