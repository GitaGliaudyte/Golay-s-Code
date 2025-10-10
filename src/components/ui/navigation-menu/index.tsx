import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import FormDemo from '@/components/ui/form'

type Kind = 'vector' | 'text' | 'image' | 'probability'

export default function NavigationMenuDemo() {
  const [kind, setKind] = React.useState<Kind>('vector')

  const options: { key: Kind; label: string }[] = [
    { key: 'vector', label: 'Vector' },
    { key: 'text', label: 'Text' },
    { key: 'image', label: 'Image' },
    { key: 'probability', label: 'Probability' },
  ]

  return (
    <div className="bg-white shadow rounded p-4">
      <NavigationMenuPrimitive.Root>
        <NavigationMenuPrimitive.List className="flex gap-2">
          {options.map((opt) => (
            <NavigationMenuPrimitive.Item key={opt.key}>
              <button
                onClick={() => setKind(opt.key)}
                className={`px-3 py-1 rounded ${kind === opt.key ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-800 hover:bg-gray-100'}`}
              >
                {opt.label}
              </button>
            </NavigationMenuPrimitive.Item>
          ))}
        </NavigationMenuPrimitive.List>
      </NavigationMenuPrimitive.Root>

      <div className="mt-4">
        <FormDemo kind={kind} />
      </div>
    </div>
  )
}

