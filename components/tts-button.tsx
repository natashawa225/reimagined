"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Pause } from "lucide-react"

interface TTSButtonProps {
  text: string
  className?: string
  size?: "sm" | "default" | "lg"
}

export function TTSButton({ text, className = "", size = "sm" }: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const speak = () => {
    if ("speechSynthesis" in window) {
      if (isPlaying && !isPaused) {
        window.speechSynthesis.pause()
        setIsPaused(true)
        return
      }

      if (isPaused) {
        window.speechSynthesis.resume()
        setIsPaused(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => {
        setIsPlaying(true)
        setIsPaused(false)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        setIsPaused(false)
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  const stop = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setIsPaused(false)
    }
  }

  if (!("speechSynthesis" in window)) {
    return null
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      <Button
        variant="ghost"
        size={size}
        onClick={speak}
        className="text-blue-600 hover:text-blue-800"
        title={isPlaying ? (isPaused ? "Resume" : "Pause") : "Read aloud"}
      >
        {isPlaying ? (
          isPaused ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      {isPlaying && (
        <Button variant="ghost" size={size} onClick={stop} className="text-red-600 hover:text-red-800" title="Stop">
          <VolumeX className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
