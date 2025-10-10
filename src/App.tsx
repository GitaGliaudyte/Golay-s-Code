import React, { useState } from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

import { ThemeProvider, useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import logo from './assets/react.svg';

import viteLogo from '/vite.svg';
import NavigationMenuDemo from '@/components/ui/navigation-menu';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Welcome />
    </ThemeProvider>
  );
}

function Welcome() {
  const [count, setCount] = useState(0);

  return (
    <>
      <header className="flex items-center justify-between p-4">
        <h1 className="text-lg font-semibold">Golay's code C23</h1>
      </header>
      <div className="mt-6 max-w-3xl mx-auto flex flex-col gap-4">
        <NavigationMenuDemo />
      </div>
    </>
  );
}

export default App;
