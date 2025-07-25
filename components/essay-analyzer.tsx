"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Eye, MessageSquare, Lightbulb } from "lucide-react"
import { FocusCard } from "@/components/focus-card"
import { ProgressTracker } from "@/components/progress-tracker"
import { TTSButton } from "@/components/tts-button"
import type { AnalysisResult, ArgumentElement } from "@/lib/types"

interface EssayAnalyzerProps {
  analysis: AnalysisResult
  essay: string
  accessibilityMode?: "standard" | "dyslexia" | "adhd"
  ttsEnabled?: boolean
}

export function EssayAnalyzer({
  analysis,
  essay,
  accessibilityMode = "standard",
  ttsEnabled = false,
}: EssayAnalyzerProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [feedbackLevel, setFeedbackLevel] = useState<"indirect" | "reflection" | "explanation">("indirect")
  const [completedElements, setCompletedElements] = useState<Set<string>>(new Set())

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case "Effective":
        return "text-green-600 bg-green-100"
      case "Adequate":
        return "text-yellow-600 bg-yellow-100"
      case "Ineffective":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
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

  const highlightTextInEssay = (text: string, elementType: string) => {
    if (!text) return essay

    const regex = new RegExp(`(${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    return essay.replace(regex, `<mark class="bg-yellow-200 cursor-pointer" data-element="${elementType}">$1</mark>`)
  }

  const getFeedbackByLevel = (element: ArgumentElement, level: "indirect" | "reflection" | "explanation") => {
    switch (level) {
      case "indirect":
        return (
          element.indirectFeedback ||
          `Consider the effectiveness of this ${selectedElement}. What could make it stronger?`
        )
      case "reflection":
        return (
          element.reflectionPrompt ||
          `Reflect on how this ${selectedElement} supports your overall argument. What evidence backs it up?`
        )
      case "explanation":
        return (
          element.feedback ||
          `This ${selectedElement} demonstrates ${element.effectiveness.toLowerCase()} argumentation.`
        )
    }
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

  const progressItems = elementTypes.map(({ key, label }) => ({
    id: key,
    label,
    completed: completedElements.has(key),
  }))

  const handleMarkComplete = (elementKey: string) => {
    setCompletedElements((prev) => new Set([...prev, elementKey]))
  }

  const getCardClasses = () => {
    switch (accessibilityMode) {
      case "dyslexia":
        return "shadow-sm border-2 p-6"
      case "adhd":
        return "shadow-md border-2 border-blue-200"
      default:
        return ""
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

  if (accessibilityMode === "adhd") {
    return (
      <div className="space-y-6">
        {/* Progress Tracker for ADHD mode */}
        <ProgressTracker items={progressItems} title="Element Analysis Progress" />

        {/* Focused Element Cards */}
        <div className="space-y-4">
          {elementTypes.map(({ key, label, description }) => {
            const element = analysis.elements[key as keyof typeof analysis.elements]
            const isCompleted = completedElements.has(key)
            const feedbackText = Array.isArray(element)
              ? element.map((el) => getFeedbackByLevel(el, "explanation")).join(" ")
              : getFeedbackByLevel(element, "explanation")

            return (
              <FocusCard
                key={key}
                title={
                  Array.isArray(element)
                    ? `${label}: ${element.map((el) => el.effectiveness).join(", ")}`
                    : `${label}: ${element.effectiveness}`
                }
                isCompleted={isCompleted}
                onMarkComplete={() => handleMarkComplete(key)}
                ttsText={ttsEnabled ? `${label}. ${description}. ${feedbackText}` : undefined}
                ttsEnabled={ttsEnabled}
                defaultExpanded={selectedElement === key}
                className={getCardClasses()}
              >
                <div className="space-y-4">
                  {Array.isArray(element) ? (
                    element.map((el, i) => (
                      <div key={i}>
                        <div className="flex items-center gap-2">
                          {getEffectivenessIcon(el.effectiveness)}
                          <Badge className={getEffectivenessColor(el.effectiveness)}>{el.effectiveness}</Badge>
                          <span className={`text-sm text-gray-600 ${getTextClasses()}`}>{description} #{i + 1}</span>
                        </div>
                        {el.text && (
                          <div className={`p-3 bg-blue-50 rounded-lg ${getTextClasses()}`}>
                            <h5 className="font-medium text-blue-800 mb-2">Identified Text:</h5>
                            <p className="text-sm">"{el.text}"</p>
                          </div>
                        )}
                        <div className={`p-3 bg-gray-50 rounded-lg ${getTextClasses()}`}>
                          <h5 className="font-medium text-gray-800 mb-2">Feedback:</h5>
                          <p className="text-sm text-gray-700">{el.feedback}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        {getEffectivenessIcon(element.effectiveness)}
                        <Badge className={getEffectivenessColor(element.effectiveness)}>{element.effectiveness}</Badge>
                        <span className={`text-sm text-gray-600 ${getTextClasses()}`}>{description}</span>
                      </div>
                      {element.text && (
                        <div className={`p-3 bg-blue-50 rounded-lg ${getTextClasses()}`}>
                          <h5 className="font-medium text-blue-800 mb-2">Identified Text:</h5>
                          <p className="text-sm">"{element.text}"</p>
                        </div>
                      )}
                      <div className={`p-3 bg-gray-50 rounded-lg ${getTextClasses()}`}>
                        <h5 className="font-medium text-gray-800 mb-2">Feedback:</h5>
                        <p className="text-sm text-gray-700">{element.feedback}</p>
                      </div>
                    </>
                  )}
                </div>
              </FocusCard>
            )
          })}
        </div>

        {/* Essay with Highlights - Simplified for ADHD */}
        <FocusCard
          title="Your Essay"
          ttsText={ttsEnabled ? essay : undefined}
          ttsEnabled={ttsEnabled}
          className={getCardClasses()}
        >
          <div className={`prose max-w-none p-4 bg-gray-50 rounded-lg border ${getTextClasses()}`}>
            {essay.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </FocusCard>
      </div>
    )
  }

  // Standard and Dyslexia modes
  return (
    <div className="space-y-6">
      {/* Element Overview */}
      <Card className={getCardClasses()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`flex items-center gap-2 ${getTextClasses()}`}>
                <Eye className="h-5 w-5" />
                Argumentative Elements Analysis
              </CardTitle>
              <p className={`text-sm text-gray-600 mt-2 ${getTextClasses()}`}>
                Click on elements to see detailed feedback and highlights in your essay
              </p>
            </div>
            {accessibilityMode === "dyslexia" && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Elements Found</div>
                <div className="text-2xl font-bold text-blue-600">
                  {
                    Object.values(analysis.elements)
                      .flatMap((e) => Array.isArray(e) ? e : [e])
                      .filter((e) => e.effectiveness !== "Missing").length
                  }/7
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`grid grid-cols-1 ${accessibilityMode === "dyslexia" ? "md:grid-cols-2 gap-6" : "md:grid-cols-2 lg:grid-cols-3 gap-4"}`}
          >
            {elementTypes.map(({ key, label, description }) => {
              const element = analysis.elements[key as keyof typeof analysis.elements]
              const isSelected = selectedElement === key

              return (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  } ${getCardClasses()}`}
                  onClick={() => setSelectedElement(isSelected ? null : key)}
                >
                  <CardContent className={accessibilityMode === "dyslexia" ? "p-6" : "p-4"}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-bold ${getTextClasses()}`}>{label}</h4>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          Array.isArray(element)
                            ? ''
                            : getEffectivenessColor(element.effectiveness)
                        } ${accessibilityMode === "dyslexia" ? "text-sm px-3 py-2" : ""}`}
                      >
                        {Array.isArray(element)
                          ? element.map((el, i) => (
                              <span key={i} className="flex items-center gap-1">
                                {getEffectivenessIcon(el.effectiveness)}
                                <span className="font-medium">{el.effectiveness}</span>
                              </span>
                            ))
                          : <>
                              {getEffectivenessIcon(element.effectiveness)}
                              <span className="font-medium">{element.effectiveness}</span>
                            </>
                        }
                      </div>
                    </div>
                    <p className={`text-xs text-gray-600 mb-2 ${getTextClasses()}`}>{description}</p>
                    {Array.isArray(element)
                      ? element.map((el, i) =>
                          el.text && (
                            <p
                              key={i}
                              className={`text-xs bg-gray-50 p-2 rounded ${accessibilityMode === "dyslexia" ? "text-sm p-3" : ""}`}
                            >
                              "{el.text.substring(0, accessibilityMode === "dyslexia" ? 80 : 60)}..."
                            </p>
                          )
                        )
                      : element.text && (
                          <p
                            className={`text-xs bg-gray-50 p-2 rounded ${accessibilityMode === "dyslexia" ? "text-sm p-3" : ""}`}
                          >
                            "{element.text.substring(0, accessibilityMode === "dyslexia" ? 80 : 60)}..."
                          </p>
                        )
                    }
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Essay with Highlights */}
      <Card className={getCardClasses()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={getTextClasses()}>Your Essay with Highlights</CardTitle>
              <p className={`text-sm text-gray-600 mt-2 ${getTextClasses()}`}>
                {selectedElement ? `Highlighting: ${selectedElement}` : "Select an element above to see highlights"}
              </p>
            </div>
            {ttsEnabled && <TTSButton text={essay} />}
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`prose max-w-none p-4 bg-gray-50 rounded-lg border ${getTextClasses()}`}
            dangerouslySetInnerHTML={{
              __html:
                selectedElement && !Array.isArray(analysis.elements[selectedElement as keyof typeof analysis.elements]) && (analysis.elements[selectedElement as keyof typeof analysis.elements] as ArgumentElement)?.text
                  ? highlightTextInEssay(
                      (analysis.elements[selectedElement as keyof typeof analysis.elements] as ArgumentElement).text,
                      selectedElement,
                    )
                  : essay.replace(/\n/g, "<br>"),
            }}
          />
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      {selectedElement && (
        <Card className={`border-2 border-blue-200 ${getCardClasses()}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`flex items-center gap-2 ${getTextClasses()}`}>
                  <MessageSquare className="h-5 w-5" />
                  Detailed Feedback: {selectedElement.charAt(0).toUpperCase() + selectedElement.slice(1)}
                </CardTitle>
                <div className={`flex gap-2 mt-3 ${accessibilityMode === "dyslexia" ? "gap-4" : ""}`}>
                  <Button
                    size={accessibilityMode === "dyslexia" ? "default" : "sm"}
                    variant={feedbackLevel === "indirect" ? "default" : "outline"}
                    onClick={() => setFeedbackLevel("indirect")}
                  >
                    Indirect Hints
                  </Button>
                  <Button
                    size={accessibilityMode === "dyslexia" ? "default" : "sm"}
                    variant={feedbackLevel === "reflection" ? "default" : "outline"}
                    onClick={() => setFeedbackLevel("reflection")}
                  >
                    Reflection
                  </Button>
                  <Button
                    size={accessibilityMode === "dyslexia" ? "default" : "sm"}
                    variant={feedbackLevel === "explanation" ? "default" : "outline"}
                    onClick={() => setFeedbackLevel("explanation")}
                  >
                    Explanation
                  </Button>
                </div>
              </div>
              {ttsEnabled && (
                <TTSButton
                  text={Array.isArray(analysis.elements[selectedElement as keyof typeof analysis.elements])
                    ? (analysis.elements[selectedElement as keyof typeof analysis.elements] as ArgumentElement[])
                        .map((el) => getFeedbackByLevel(el, feedbackLevel))
                        .join(" ")
                    : getFeedbackByLevel(
                        analysis.elements[selectedElement as keyof typeof analysis.elements] as ArgumentElement,
                        feedbackLevel
                      )}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription className={getTextClasses()}>
                {Array.isArray(analysis.elements[selectedElement as keyof typeof analysis.elements])
                  ? (analysis.elements[selectedElement as keyof typeof analysis.elements] as ArgumentElement[])
                      .map((el) => getFeedbackByLevel(el, feedbackLevel))
                      .join(" ")
                  : getFeedbackByLevel(
                      analysis.elements[selectedElement as keyof typeof analysis.elements] as ArgumentElement,
                      feedbackLevel
                    )}
              </AlertDescription>
            </Alert>

            {Array.isArray(analysis.elements[selectedElement as keyof typeof analysis.elements])
              ? (analysis.elements[selectedElement as keyof typeof analysis.elements] as ArgumentElement[]).map(
                  (el, i) =>
                    el.text && (
                      <div
                        key={i}
                        className={`mt-4 p-3 bg-blue-50 rounded-lg ${accessibilityMode === "dyslexia" ? "p-4" : ""}`}
                      >
                        <h5 className={`font-bold text-blue-800 mb-2 ${getTextClasses()}`}>Identified Text #{i + 1}:</h5>
                        <p className={`text-sm ${getTextClasses()}`}>"{el.text}"</p>
                      </div>
                    )
                )
              : ((analysis.elements[selectedElement as keyof typeof analysis.elements]) as ArgumentElement)?.text && (
                  <div className={`mt-4 p-3 bg-blue-50 rounded-lg ${accessibilityMode === "dyslexia" ? "p-4" : ""}`}>
                    <h5 className={`font-bold text-blue-800 mb-2 ${getTextClasses()}`}>Identified Text:</h5>
                    <p className={`text-sm ${getTextClasses()}`}>
                      "{((analysis.elements[selectedElement as keyof typeof analysis.elements]) as ArgumentElement).text}"
                    </p>
                  </div>
                )}
          </CardContent>
        </Card>
      )}

      {/* Missing Elements Alert */}
      {Object.entries(analysis.elements).some(([_, element]) =>
        Array.isArray(element)
          ? element.some((el) => el.effectiveness === "Missing")
          : element.effectiveness === "Missing"
      ) && (
        <Alert className={`border-red-200 bg-red-50 ${getCardClasses()}`}>
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="space-y-2">
              <p className={`font-bold text-red-800 ${getTextClasses()}`}>Missing Argumentative Elements:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(analysis.elements)
                  .filter(([_, element]) =>
                    Array.isArray(element)
                      ? element.some((el) => el.effectiveness === "Missing")
                      : element.effectiveness === "Missing"
                  )
                  .map(([key, _]) => (
                    <Badge
                      key={key}
                      variant="destructive"
                      className={`text-xs ${accessibilityMode === "dyslexia" ? "text-sm px-3 py-1" : ""}`}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Badge>
                  ))}
              </div>
              <p className={`text-red-700 text-sm ${getTextClasses()}`}>
                Consider adding these elements to strengthen your argument structure.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
