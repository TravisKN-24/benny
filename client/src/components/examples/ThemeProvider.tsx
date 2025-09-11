import { ThemeProvider } from '../ThemeProvider'
import { Button } from "@/components/ui/button"
import { useTheme } from '../ThemeProvider'

function ThemeDemo() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className="p-4 space-y-4">
      <p>Current theme: {theme}</p>
      <Button onClick={toggleTheme}>
        Toggle to {theme === 'dark' ? 'light' : 'dark'} mode
      </Button>
    </div>
  )
}

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <ThemeDemo />
    </ThemeProvider>
  )
}