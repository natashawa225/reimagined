"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Check } from "lucide-react"
import { TTSButton } from "./tts-button"

interface FocusCardProps {
  title: string
  children: React.ReactNode
  isCompleted?: boolean
  onMarkComplete?: () => void
  ttsText?: string
  ttsEnabled?: boolean
  defaultExpanded?: boolean
  className?: string
}

export function FocusCard({
  title,
  children,
  isCompleted = false,
  onMarkComplete,
  ttsText,
  ttsEnabled = false,
  defaultExpanded = false,
  className = "",
}: FocusCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card
      className={`transition-all duration-200 ${isCompleted ? "bg-green-50 border-green-200" : "bg-white"} ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="p-1">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <CardTitle className="text-lg">{title}</CardTitle>
            {isCompleted && (
              <Badge variant="default" className="bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {ttsEnabled && ttsText && <TTSButton text={ttsText} />}
            {onMarkComplete && !isCompleted && (
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkComplete}
                className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
              >
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      {isExpanded && <CardContent className="pt-0 animate-in fade-in-50 duration-200">{children}</CardContent>}
    </Card>
  )
}
