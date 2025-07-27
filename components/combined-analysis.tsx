"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Eye, Sparkles } from "lucide-react"
import { ArgumentDiagram } from "@/components/argument-diagram"
import { TTSButton } from "@/components/tts-button"
import type { AnalysisResult } from "@/lib/types"

interface CombinedAnalysisProps {
  analysis: AnalysisResult
  essay: string
  accessibilityMode?: "standard" | "dyslexia" | "adhd"
  ttsEnabled?: boolean
}

export function CombinedAnalysis({
  analysis,
  essay,
  accessibilityMode = "standard",
  ttsEnabled = false,
}: CombinedAnalysisProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [highlightedText, setHighlightedText] = useState<string>("")

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case "Effective":
        return "text-green-700 bg-green-100 border-green-300"
      case "Adequate":
        return "text-amber-700 bg-amber-100 border-amber-300"
      case "Ineffective":
        return "text-red-700 bg-red-100 border-red-300"
      default:
        return "text-gray-700 bg-gray-100 border-gray-300"
    }
  }

  const getEffectivenessIcon = (effectiveness: string) => {
    switch (effectiveness) {
      case "Effective":
        return <CheckCircle className="h-4 w-4" />
      case "Adequate":
        return <AlertTriangle className="h-4 w-4" />
      case "Ineffective":
        return <XCircle className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const highlightTextInEssay = (text: string) => {
    if (!text || !highlightedText) return essay

    const regex = new RegExp(`(${highlightedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    return essay.replace(regex, `<mark class="bg-yellow-200 px-1 rounded">$1</mark>`)
  }

  const elementTypes = [
    { key: "lead", label: "Lead", description: "Opening that grabs attention" },
    { key: "position", label: "Position", description: "Clear stance on the topic" },
    { key: "claims", label: "Claims", description: "Main supporting arguments" },
    { key: "evidence", label: "Evidence", description: "Supporting facts and examples" },
    { key: "counterclaim", label: "Counterclaim", description: "Opposing viewpoint" },
    { key: "rebuttal", label: "Rebuttal", description: "Response to counterclaim" },
    { key: "conclusion", label: "Conclusion", description: "Summarizing statement" },
  ]

  const getCardClasses = () => {
    switch (accessibilityMode) {
      case "dyslexia":
        return "shadow-sm border-2 p-6"
      case "adhd":
        return "shadow-md border-2 border-blue-200"
      default:
        return "shadow-sm border bg-white"
    }
  }

  const getTextClasses = () => {
    switch (accessibilityMode) {
      case "dyslexia":
        return "text-lg leading-loose tracking-wide"
      case "adhd":
        return "text-base leading-relaxed"
      default:
        return ""
    }
  }

  const handleElementClick = (elementKey: string) => {
    setSelectedElement(selectedElement === elementKey ? null : elementKey)
    setHighlightedText("")
  }

  const handleFeedbackClick = (text: string) => {
    setHighlightedText(text)
  }

  return (
    <div className="space-y-6">
      {/* Visual Structure Diagram */}
      <ArgumentDiagram analysis={analysis} essay={essay} 
      // accessibilityMode={accessibilityMode} 
      />

      {/* Interactive Element Analysis */}
      <Card className={getCardClasses()}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${getTextClasses()}`}>
            <Eye className="h-5 w-5" />
            Interactive Element Analysis
          </CardTitle>
          <p className={`text-sm text-gray-600 ${getTextClasses()}`}>
            Click on elements below to see detailed feedback. Click feedback text to highlight it in your essay.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {elementTypes.map(({ key, label, description }) => {
              const element = analysis.elements[key as keyof typeof analysis.elements]
              const isSelected = selectedElement === key

              return (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  } ${getCardClasses()}`}
                  onClick={() => handleElementClick(key)}
                >
                  <CardContent className={accessibilityMode === "dyslexia" ? "p-6" : "p-4"}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${getTextClasses()}`}>{label}</h4>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getEffectivenessColor(element.effectiveness)} 
                          ${accessibilityMode === "dyslexia" ? "text-sm px-3 py-2" : ""}`}
                        >
                          {getEffectivenessIcon(element.effectiveness)}
                          <span className="font-medium">{element.effectiveness}</span>
                        </div>
                      </div>
                      <p className={`text-xs text-gray-600 ${getTextClasses()}`}>{description}</p>
                      {element.text && (
                        <p
                          className={`text-xs bg-gray-50 p-2 rounded border-l-2 border-blue-300 ${accessibilityMode === "dyslexia" ? "text-sm p-3" : ""}`}
                        >
                          "{element.text.substring(0, accessibilityMode === "dyslexia" ? 80 : 60)}..."
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback Panel */}
      {selectedElement && (
        <Card className={`border-blue-200 bg-blue-50 ${getCardClasses()}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`flex items-center gap-2 ${getTextClasses()}`}>
                  <Sparkles className="h-5 w-5" />
                  {selectedElement.charAt(0).toUpperCase() + selectedElement.slice(1)} Analysis
                </CardTitle>
                <p className={`text-sm text-blue-600 mt-1 ${getTextClasses()}`}>
                  Click the feedback text below to highlight the relevant sentence in your essay
                </p>
              </div>
              {ttsEnabled && (
                <TTSButton text={analysis.elements[selectedElement as keyof typeof analysis.elements].feedback} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.elements[selectedElement as keyof typeof analysis.elements]?.text && (
                <div className={`p-4 bg-white rounded-lg border ${accessibilityMode === "dyslexia" ? "p-6" : ""}`}>
                  <h5 className={`font-semibold text-blue-800 mb-2 ${getTextClasses()}`}>Identified Text:</h5>
                  <p
                    className={`text-sm cursor-pointer hover:bg-yellow-100 p-2 rounded transition-colors ${getTextClasses()}`}
                    onClick={() =>
                      handleFeedbackClick(analysis.elements[selectedElement as keyof typeof analysis.elements].text)
                    }
                  >
                    "{analysis.elements[selectedElement as keyof typeof analysis.elements].text}"
                  </p>
                </div>
              )}

              <div className={`p-4 bg-white rounded-lg border ${accessibilityMode === "dyslexia" ? "p-6" : ""}`}>
                <h5 className={`font-semibold text-blue-800 mb-2 ${getTextClasses()}`}>Feedback:</h5>
                <p
                  className={`text-sm cursor-pointer hover:bg-yellow-100 p-2 rounded transition-colors ${getTextClasses()}`}
                  onClick={() =>
                    handleFeedbackClick(analysis.elements[selectedElement as keyof typeof analysis.elements].text)
                  }
                >
                  {analysis.elements[selectedElement as keyof typeof analysis.elements].feedback}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedElement(null)
                  setHighlightedText("")
                }}
                className={accessibilityMode === "dyslexia" ? "text-base px-4 py-2" : ""}
              >
                Close Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Essay with Highlights */}
      <Card className={getCardClasses()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={getTextClasses()}>Your Essay</CardTitle>
              <p className={`text-sm text-gray-600 mt-1 ${getTextClasses()}`}>
                {highlightedText
                  ? "Highlighted text shows the element being analyzed"
                  : "Select an element above to see highlights"}
              </p>
            </div>
            {ttsEnabled && <TTSButton text={essay} />}
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`prose max-w-none p-4 bg-gray-50 rounded-lg border ${getTextClasses()}`}
            dangerouslySetInnerHTML={{
              __html: highlightTextInEssay(essay).replace(/\n/g, "<br>"),
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

