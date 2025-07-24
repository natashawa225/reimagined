"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText, BarChart3, Users, Lightbulb, PenTool, Target, Eye } from "lucide-react"
import { CombinedAnalysis } from "@/components/combined-analysis"
import { LinguisticAnalysis } from "@/components/linguistic-analysis"
import { RubricFeedback } from "@/components/rubric-feedback"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { AccessibilitySettings } from "@/components/accessibility-settings"
import { TTSButton } from "@/components/tts-button"
import { PromptSelector } from "@/components/prompt-selector"
import type { AnalysisResult } from "@/lib/types"
import { SetupGuide } from "@/components/setup-guide"
import { getDefaultPrompt, getDefaultEssay } from "@/lib/sample-data"

export default function IELTSFeedbackApp() {
  const [prompt, setPrompt] = useState("")
  const [essay, setEssay] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("write")
  const [userMode, setUserMode] = useState<"student" | "teacher">("student")
  const [accessibilityMode, setAccessibilityMode] = useState<"standard" | "dyslexia" | "adhd">("standard")
  const [dyslexiaBackground, setDyslexiaBackground] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(false)

  const handleAnalyze = async () => {
    if (!essay.trim() || essay.length < 200) {
      alert("Please enter an essay of at least 200 words.")
      return
    }

    if (!prompt.trim()) {
      alert("Please enter the essay prompt.")
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay, prompt, mode: "comprehensive" }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const result = await response.json()
      setAnalysis(result)
      setActiveTab("structure-analysis")
    } catch (error) {
      console.error("Analysis error:", error)
      const errorMessage = error instanceof Error ? error.message : "Analysis failed. Please try again."

      if (errorMessage.includes("API key")) {
        alert("OpenAI API key is not configured. Please check the setup instructions above.")
      } else {
        alert(errorMessage)
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getAccessibilityClasses = () => {
    const baseClasses = "min-h-screen transition-all duration-300"

    switch (accessibilityMode) {
      case "dyslexia":
        return `${baseClasses} ${dyslexiaBackground ? "bg-yellow-50" : "bg-white"} font-atkinson text-lg leading-loose tracking-wide`
      case "adhd":
        return `${baseClasses} bg-gray-50 font-inter`
      default:
        return `${baseClasses} bg-gray-50 font-inter`
    }
  }

  const getContainerClasses = () => {
    switch (accessibilityMode) {
      case "dyslexia":
        return "container mx-auto p-8 max-w-6xl"
      case "adhd":
        return "container mx-auto p-6 max-w-6xl"
      default:
        return "container mx-auto p-6 max-w-5xl"
    }
  }

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

  const getPromptTextareaClasses = () => {
    switch (accessibilityMode) {
      case "dyslexia":
        return "min-h-[120px] text-lg leading-loose tracking-wide p-4 border-2 focus:border-blue-400 resize-none bg-white"
      case "adhd":
        return "min-h-[120px] text-base leading-relaxed border-2 border-blue-300 focus:border-blue-500 resize-none bg-white"
      default:
        return "min-h-[120px] text-base leading-relaxed resize-none bg-white border focus:border-blue-400 transition-colors duration-200"
    }
  }

  const getEssayTextareaClasses = () => {
    switch (accessibilityMode) {
      case "dyslexia":
        return "min-h-[400px] text-lg leading-loose tracking-wide p-6 border-2 focus:border-blue-400 resize-none bg-white"
      case "adhd":
        return "min-h-[400px] text-base leading-relaxed border-2 border-blue-300 focus:border-blue-500 resize-none bg-white"
      default:
        return "min-h-[400px] text-base leading-relaxed resize-none bg-white border focus:border-blue-400 transition-colors duration-200"
    }
  }

  const getAnimationClasses = () => {
    switch (accessibilityMode) {
      case "adhd":
        return "transition-none"
      default:
        return "transition-all duration-200"
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

  const wordCount = essay
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  const getWordCountBadge = () => {
    if (wordCount >= 200 && wordCount <= 600) {
      return (
        <Badge className="bg-green-600 text-white">
          <Target className="h-3 w-3 mr-1" />
          Good Length
        </Badge>
      )
    }
    if (wordCount < 200 && wordCount > 0) {
      return <Badge className="bg-amber-600 text-white">Need {200 - wordCount} more</Badge>
    }
    if (wordCount > 600) {
      return <Badge className="bg-red-600 text-white">Too Long ({wordCount - 600} over)</Badge>
    }
    return null
  }

  return (
    <div className={getAccessibilityClasses()}>
      <div className={getContainerClasses()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className={`text-4xl font-bold text-gray-800 ${accessibilityMode === "dyslexia" ? "font-bold" : ""}`}>
              IELTS Writing Feedback
            </h1>
            <p className={`text-lg text-gray-600 ${getTextClasses()}`}>Comprehensive feedback using the Crossley Argumentative Diagram Model</p>
          </div>
          <div className="flex gap-3">
            <AccessibilitySettings
              mode={accessibilityMode}
              onModeChange={setAccessibilityMode}
              dyslexiaBackground={dyslexiaBackground}
              onDyslexiaBackgroundChange={setDyslexiaBackground}
              ttsEnabled={ttsEnabled}
              onTtsEnabledChange={setTtsEnabled}
            />
            <Button
              variant={userMode === "student" ? "default" : "outline"}
              onClick={() => setUserMode("student")}
              className="shadow-sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Student
            </Button>
            <Button
              variant={userMode === "teacher" ? "default" : "outline"}
              onClick={() => setUserMode("teacher")}
              className="shadow-sm"
            >
              <Users className="h-4 w-4 mr-2" />
              Teacher
            </Button>
          </div>
        </div>

        {userMode === "teacher" ? (
          <TeacherDashboard />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className={`grid w-full grid-cols-4 ${getCardClasses()}`}>
              <TabsTrigger value="write" className={getAnimationClasses()}>
                <PenTool className="h-4 w-4 mr-2" />
                Write Essay
              </TabsTrigger>
              <TabsTrigger value="structure-analysis" disabled={!analysis} className={getAnimationClasses()}>
                <Eye className="h-4 w-4 mr-2" />
                Structure Analysis
              </TabsTrigger>
              <TabsTrigger value="rubric-feedback" disabled={!analysis} className={getAnimationClasses()}>
                <FileText className="h-4 w-4 mr-2" />
                Rubric Feedback
              </TabsTrigger>
              <TabsTrigger value="linguistic" disabled={!analysis} className={getAnimationClasses()}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Linguistic Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-6">

              {/* Essay Input */}
              <Card className={getCardClasses()}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${getTextClasses()}`}>
                    <PenTool className="h-5 w-5" />
                    Essay Writing
                  </CardTitle>
                  <p className={`text-sm text-gray-600 ${getTextClasses()}`}>
                    Enter the IELTS Writing Task 2 question and write your response
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Prompt Section */}
                  <div className="space-y-3">
                    <label className={`text-sm font-medium text-gray-700 ${getTextClasses()}`}>
                      IELTS Task 2 Prompt
                    </label>
                    <Textarea
                      placeholder="Enter the essay prompt here..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={3}
                      className={getPromptTextareaClasses()}
                      disabled={isAnalyzing}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${accessibilityMode === "dyslexia" ? "text-base px-4 py-2" : ""}`}
                        onClick={() => setPrompt(getDefaultPrompt())}
                      >
                        <Lightbulb className="h-3 w-3 mr-1" />
                        Use Sample Prompt
                      </Button>
                      {accessibilityMode === "adhd" && ttsEnabled && prompt && <TTSButton text={prompt} size="sm" />}
                    </div>
                  </div>

                  {/* Essay Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className={`text-sm font-medium text-gray-700 ${getTextClasses()}`}>
                        Your Essay Response
                      </label>
                      {accessibilityMode === "adhd" && ttsEnabled && essay && <TTSButton text={essay} size="default" />}
                    </div>
                    <div className="relative">
                      <Textarea
                        placeholder={
                          accessibilityMode === "dyslexia"
                            ? "Start writing your essay here. Take your time and focus on one idea at a time..."
                            : "Write your essay response here..."
                        }
                        value={essay}
                        onChange={(e) => setEssay(e.target.value)}
                        rows={16}
                        className={getEssayTextareaClasses()}
                        disabled={isAnalyzing}
                      />
                      <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded shadow-sm border">
                          <span className={`text-sm text-gray-600 ${getTextClasses()}`}>
                            <span className={`font-medium ${accessibilityMode === "dyslexia" ? "text-base" : ""}`}>
                              {wordCount}
                            </span>{" "}
                            words
                          </span>
                          {getWordCountBadge()}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEssay(getDefaultEssay())}
                        className={`${accessibilityMode === "dyslexia" ? "text-base px-4 py-2" : ""}`}
                      >
                        <Lightbulb className="h-3 w-3 mr-1" />
                        Use Sample Essay
                      </Button>
                      <div className="text-xs text-gray-500">Target: 250-400 words • Minimum: 200 words</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analyze Button */}
              <Card className={getCardClasses()}>
                <CardContent className="pt-6">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!essay.trim() || !prompt.trim() || isAnalyzing || wordCount < 200}
                    className={`w-full h-12 ${getAnimationClasses()} ${accessibilityMode === "dyslexia" ? "text-lg px-8 py-4 h-16" : ""}`}
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing Essay...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Analyze Essay
                      </>
                    )}
                  </Button>
                  {(!essay.trim() || !prompt.trim() || wordCount < 200) && (
                    <p className={`text-center text-sm text-gray-500 mt-2 ${getTextClasses()}`}>
                      {!prompt.trim()
                        ? "Please enter a prompt"
                        : !essay.trim()
                          ? "Please enter your essay"
                          : wordCount < 200
                            ? `Need ${200 - wordCount} more words`
                            : ""}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Results */}
              {analysis && (
                <Card className={`border-green-200 bg-green-50 ${getCardClasses()}`}>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div>
                        <h3
                          className={`text-3xl font-bold text-green-800 mb-2 ${accessibilityMode === "dyslexia" ? "text-4xl" : ""}`}
                        >
                          Score: {analysis.holisticScore}/9
                        </h3>
                        <Badge
                          variant="secondary"
                          className={`${accessibilityMode === "dyslexia" ? "text-base px-4 py-2" : ""}`}
                        >
                          Confidence: {analysis.confidence}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <p
                          className={`text-green-700 max-w-2xl ${accessibilityMode === "dyslexia" ? "text-lg leading-loose" : ""} ${getTextClasses()}`}
                        >
                          {analysis.scoreRationale}
                        </p>
                        {accessibilityMode === "adhd" && ttsEnabled && <TTSButton text={analysis.scoreRationale} />}
                      </div>
                      <div className="flex justify-center gap-4 pt-4">
                        <Button
                          onClick={() => setActiveTab("structure-analysis")}
                          className={accessibilityMode === "dyslexia" ? "text-lg px-6 py-3" : ""}
                        >
                          View Structure Analysis
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("rubric-feedback")}
                          className={accessibilityMode === "dyslexia" ? "text-lg px-6 py-3" : ""}
                        >
                          View Rubric Feedback
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="structure-analysis">
              {analysis && (
                <CombinedAnalysis
                  analysis={analysis}
                  essay={essay}
                  accessibilityMode={accessibilityMode}
                  ttsEnabled={ttsEnabled}
                />
              )}
            </TabsContent>

            <TabsContent value="rubric-feedback">
              {analysis && (
                <RubricFeedback analysis={analysis}/>
              )}
            </TabsContent>

            <TabsContent value="linguistic">
              {analysis && (
                <LinguisticAnalysis
                  analysis={analysis}
                  essay={essay}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

