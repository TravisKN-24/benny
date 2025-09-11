import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"

export default function ChatHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
          B
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-app-title">Benny</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-app-subtitle">Your AI Assistant</p>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        data-testid="button-theme-toggle"
        className="hover-elevate"
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  )
}