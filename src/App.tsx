import { ThemeProvider, useTheme } from '@/components/theme-provider';
import NavigationMenuDemo from '@/components/ui/navigation-menu';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <header className="flex items-center justify-between p-4">
        <h1 className="text-lg font-semibold">Golay's code C23</h1>
      </header>
      <div className="mt-6 max-w-3xl mx-auto flex flex-col gap-4">
        <NavigationMenuDemo />
      </div>
    </ThemeProvider>
  );
}

export default App;
