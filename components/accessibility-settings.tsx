"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings, Eye, Focus, Type, Volume2 } from "lucide-react"

interface AccessibilitySettingsProps {
  mode: "standard" | "dyslexia" | "adhd"
  onModeChange: (mode: "standard" | "dyslexia" | "adhd") => void
  dyslexiaBackground: boolean
  onDyslexiaBackgroundChange: (enabled: boolean) => void
  ttsEnabled: boolean
  onTtsEnabledChange: (enabled: boolean) => void
}

export function AccessibilitySettings({
  mode,
  onModeChange,
  dyslexiaBackground,
  onDyslexiaBackgroundChange,
  ttsEnabled,
  onTtsEnabledChange,
}: AccessibilitySettingsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Accessibility
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => onModeChange("standard")}>
          <Type className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <span>Standard Mode</span>
            <span className="text-xs text-gray-500">Clean, minimalist interface</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onModeChange("dyslexia")}>
          <Eye className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <span>Dyslexia-Friendly</span>
            <span className="text-xs text-gray-500">Readable font, wider spacing</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onModeChange("adhd")}>
          <Focus className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <span>ADHD Focus Mode</span>
            <span className="text-xs text-gray-500">Structured, focused interface</span>
          </div>
        </DropdownMenuItem>

        {mode === "dyslexia" && (
          <>
            <div className="border-t my-1" />
            <DropdownMenuItem onClick={() => onDyslexiaBackgroundChange(!dyslexiaBackground)}>
              <div className="flex items-center justify-between w-full">
                <span>Tinted Background</span>
                <div className={`w-4 h-4 rounded border ${dyslexiaBackground ? "bg-yellow-200" : "bg-white"}`} />
              </div>
            </DropdownMenuItem>
          </>
        )}

        {mode === "adhd" && (
          <>
            <div className="border-t my-1" />
            <DropdownMenuItem onClick={() => onTtsEnabledChange(!ttsEnabled)}>
              <Volume2 className="h-4 w-4 mr-2" />
              <div className="flex items-center justify-between w-full">
                <span>Text-to-Speech</span>
                <div className={`w-4 h-4 rounded border ${ttsEnabled ? "bg-blue-500" : "bg-white"}`} />
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
