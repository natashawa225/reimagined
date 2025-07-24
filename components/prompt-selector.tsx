"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, BookOpen } from "lucide-react"
import { samplePrompts, getEssayForPrompt } from "@/lib/sample-data"

interface PromptSelectorProps {
  onPromptSelect: (prompt: string) => void
  onEssaySelect: (essay: string) => void
  className?: string
}

export function PromptSelector({ onPromptSelect, onEssaySelect, className = "" }: PromptSelectorProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null)

  const handlePromptSelect = (promptId: number, prompt: string) => {
    setSelectedPrompt(promptId)
    onPromptSelect(prompt)

    // Auto-load corresponding essay if available
    const correspondingEssay = getEssayForPrompt(promptId)
    if (correspondingEssay) {
      onEssaySelect(correspondingEssay)
    }
  }

  return (
    <Card className={`border-purple-200 bg-purple-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <BookOpen className="h-4 w-4" />
          Sample IELTS Prompts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-white">
              {selectedPrompt ? samplePrompts.find((p) => p.id === selectedPrompt)?.title : "Choose a sample prompt..."}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            {samplePrompts.map((prompt) => (
              <DropdownMenuItem
                key={prompt.id}
                onClick={() => handlePromptSelect(prompt.id, prompt.prompt)}
                className="flex flex-col items-start p-3 cursor-pointer"
              >
                <div className="font-medium text-sm">{prompt.title}</div>
                <div className="text-xs text-gray-600 mt-1 line-clamp-2">{prompt.prompt.substring(0, 100)}...</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedPrompt && (
          <div className="mt-3 p-3 bg-white rounded-lg border">
            <div className="text-sm text-gray-700">{samplePrompts.find((p) => p.id === selectedPrompt)?.prompt}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
