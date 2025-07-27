"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Zap, ChevronDown, ChevronRight, Eye } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AnalysisResult } from "@/lib/types"

interface LinguisticAnalysisProps {
  analysis: AnalysisResult
  essay: string
  accessibilityMode?: "standard" | "dyslexia" | "adhd"
  ttsEnabled?: boolean
}

export function LinguisticAnalysis({
  analysis,
  essay,
  accessibilityMode = "standard",
  ttsEnabled = false,
}: LinguisticAnalysisProps) {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<string>("lexical")
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [highlightedText, setHighlightedText] = useState<string>("")
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null)

  const metrics = analysis.linguisticMetrics

  // Mock vocabulary analysis data
  const vocabularyAnalysis = {
    sophisticated: [
      {
        word: "democratized",
        explanation: "Academic word meaning 'made accessible to everyone'",
        frequency: "Low frequency (sophisticated)",
        replacement: "made available",
      },
      {
        word: "compelling",
        explanation: "Strong adjective showing persuasive quality",
        frequency: "Academic register",
        replacement: "convincing",
      },
      {
        word: "unprecedented",
        explanation: "Formal vocabulary meaning 'never happened before'",
        frequency: "Low frequency (sophisticated)",
        replacement: "new",
      },
      {
        word: "mindfully",
        explanation: "Adverb showing thoughtful consideration",
        frequency: "Academic register",
        replacement: "carefully",
      },
    ],
    academic: [
      { word: "technological", explanation: "Academic Word List - technology-related", category: "AWL Sublist 3" },
      { word: "institutions", explanation: "Academic Word List - formal organizations", category: "AWL Sublist 2" },
      { word: "accessible", explanation: "Academic Word List - able to be reached", category: "AWL Sublist 4" },
      {
        word: "furthermore",
        explanation: "Academic transition word for adding information",
        category: "Cohesive device",
      },
    ],
    repetitive: [
      {
        word: "technology",
        count: 8,
        suggestion: "Use alternatives: digital tools, technological innovations, IT systems",
      },
      { word: "students", count: 6, suggestion: "Use alternatives: learners, pupils, individuals" },
      { word: "education", count: 5, suggestion: "Use alternatives: learning, schooling, academic instruction" },
    ],
  }

  const grammarAnalysis = {
    complexSentences: [
      {
        sentence:
          "While some argue that technological advancements have revolutionized learning by making it more accessible and engaging, others contend that it has led to intellectual laziness",
        analysis: "Complex sentence with subordinate clause, showing advanced grammar",
        structures: [
          "Subordinate clause (While...)",
          "Parallel structure (some...others)",
          "Gerund phrase (by making...)",
        ],
      },
      {
        sentence:
          "For instance, online courses from universities like Harvard and MIT are now available to anyone with an internet connection",
        analysis: "Good use of exemplification with prepositional phrases",
        structures: ["Discourse marker (For instance)", "Prepositional phrases", "Relative clause (like...)"],
      },
    ],
    simpleStructures: [
      {
        sentence: "This is good because it saves time and makes learning fun",
        analysis: "Simple structure - could be more sophisticated",
        improvement:
          "This proves beneficial as it enhances efficiency while rendering the learning process more engaging",
      },
    ],
  }

  const getScoreColor = (score: number, type: "percentage" | "ratio") => {
    if (type === "percentage") {
      if (score >= 70) return "text-green-600"
      if (score >= 50) return "text-yellow-600"
      return "text-red-600"
    } else {
      if (score >= 1.5) return "text-green-600"
      if (score >= 1.0) return "text-yellow-600"
      return "text-red-600"
    }
  }

  const getScoreInterpretation = (metric: string, score: number) => {
    switch (metric) {
      case "lexicalDiversity":
        if (score >= 0.7) return "Excellent vocabulary variety"
        if (score >= 0.5) return "Good vocabulary variety"
        return "Limited vocabulary variety - try using more diverse words"

      case "academicWordCoverage":
        if (score >= 15) return "Strong academic vocabulary usage"
        if (score >= 10) return "Adequate academic vocabulary"
        return "Consider using more academic vocabulary from AWL/AFL"

      case "cUnitComplexity":
        if (score >= 1.5) return "Good sentence complexity with varied structures"
        if (score >= 1.2) return "Moderate complexity - consider more complex sentences"
        return "Simple sentence structures - try combining ideas with conjunctions"

      default:
        return "Analysis complete"
    }
  }

  const highlightVocabularyInEssay = (text: string, wordType: string) => {
    let highlightedText = text

    if (wordType === "sophisticated") {
      vocabularyAnalysis.sophisticated.forEach((item) => {
        const regex = new RegExp(`\\b${item.word}\\b`, "gi")
        highlightedText = highlightedText.replace(
          regex,
          `<span class="bg-green-200 cursor-pointer hover:bg-green-300 px-1 rounded border border-green-400" data-word="${item.word}" title="Sophisticated vocabulary: ${item.explanation}">$&</span>`,
        )
      })
    } else if (wordType === "academic") {
      vocabularyAnalysis.academic.forEach((item) => {
        const regex = new RegExp(`\\b${item.word}\\b`, "gi")
        highlightedText = highlightedText.replace(
          regex,
          `<span class="bg-blue-200 cursor-pointer hover:bg-blue-300 px-1 rounded border border-blue-400" data-word="${item.word}" title="Academic vocabulary: ${item.explanation}">$&</span>`,
        )
      })
    } else if (wordType === "repetitive") {
      vocabularyAnalysis.repetitive.forEach((item) => {
        const regex = new RegExp(`\\b${item.word}\\b`, "gi")
        highlightedText = highlightedText.replace(
          regex,
          `<span class="bg-yellow-200 cursor-pointer hover:bg-yellow-300 px-1 rounded border border-yellow-400" data-word="${item.word}" title="Repetitive word (${item.count} times): ${item.suggestion}">$&</span>`,
        )
      })
    }

    return highlightedText
  }

  const handleMetricClick = (metricName: string) => {
    setExpandedCard(expandedCard === metricName ? null : metricName)
    setHighlightedText("")
    setActiveAnalysis(null)
  }

  const handleVocabularyHighlight = (wordType: string, analysis: string) => {
    setHighlightedText(wordType)
    setActiveAnalysis(analysis)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Linguistic & Grammar Analysis
            </CardTitle>
            <p className="text-sm text-gray-600">
              Interactive analysis of lexical sophistication and grammatical complexity. Click cards for detailed
              insights.
            </p>
          </CardHeader>
        </Card>

        <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lexical">Lexical Metrics</TabsTrigger>
            <TabsTrigger value="grammar">Grammar Complexity</TabsTrigger>
            <TabsTrigger value="suggestions">Interactive Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="lexical" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lexical Diversity */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader onClick={() => handleMetricClick("lexicalDiversity")}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Lexical Diversity</CardTitle>
                    {expandedCard === "lexicalDiversity" ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Variety of vocabulary used</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        {(metrics.lexicalDiversity * 100).toFixed(1)}%
                      </span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary">
                            {metrics.lexicalDiversity >= 0.7
                              ? "Excellent"
                              : metrics.lexicalDiversity >= 0.5
                                ? "Good"
                                : "Needs Improvement"}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Unique words ÷ Total words = {(metrics.lexicalDiversity * 100).toFixed(1)}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Progress value={metrics.lexicalDiversity * 100} className="h-2" />
                    <p className="text-sm text-gray-600">
                      {getScoreInterpretation("lexicalDiversity", metrics.lexicalDiversity)}
                    </p>

                    {expandedCard === "lexicalDiversity" && (
                      <div className="space-y-3 animate-in fade-in-50 duration-200">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-800 mb-2">What this means:</h5>
                          <p className="text-sm text-blue-700">
                            You used {Math.round(metrics.lexicalDiversity * 100)} unique words out of every 100 words.
                            Higher diversity shows sophisticated vocabulary control.
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVocabularyHighlight("sophisticated", "Sophisticated vocabulary")}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Show Advanced Words
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVocabularyHighlight("repetitive", "Repetitive words")}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Show Repetition
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVocabularyHighlight("academic", "Academic vocabulary")}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Show Academic Words
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Academic Word Coverage */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader onClick={() => handleMetricClick("academicWordCoverage")}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Academic Vocabulary</CardTitle>
                    {expandedCard === "academicWordCoverage" ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">AWL/AFL word usage</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        {metrics.academicWordCoverage.toFixed(1)}%
                      </span>
                      <Badge variant="secondary">
                        {metrics.academicWordCoverage >= 15
                          ? "Strong"
                          : metrics.academicWordCoverage >= 10
                            ? "Adequate"
                            : "Weak"}
                      </Badge>
                    </div>
                    <Progress value={metrics.academicWordCoverage} className="h-2" />
                    <p className="text-sm text-gray-600">
                      {getScoreInterpretation("academicWordCoverage", metrics.academicWordCoverage)}
                    </p>

                    {expandedCard === "academicWordCoverage" && (
                      <div className="space-y-3 animate-in fade-in-50 duration-200">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-green-800 mb-2">Academic Words Found:</h5>
                          <div className="space-y-2">
                            {vocabularyAnalysis.academic.map((word, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{word.word}</span>
                                <Badge variant="outline" className="text-xs">
                                  {word.category}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVocabularyHighlight("academic", "Academic vocabulary from AWL")}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Highlight in Essay
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Lexical Sophistication */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader onClick={() => handleMetricClick("lexicalPrevalence")}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Lexical Sophistication</CardTitle>
                    {expandedCard === "lexicalPrevalence" ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Based on COCA academic corpus</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600">{metrics.lexicalPrevalence.toFixed(2)}</span>
                      <Badge variant="secondary">
                        {metrics.lexicalPrevalence <= 3.0
                          ? "Sophisticated"
                          : metrics.lexicalPrevalence <= 4.0
                            ? "Moderate"
                            : "Common"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Lower scores indicate more sophisticated vocabulary usage</p>

                    {expandedCard === "lexicalPrevalence" && (
                      <div className="space-y-3 animate-in fade-in-50 duration-200">
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h5 className="font-medium text-purple-800 mb-2">Sophistication Examples:</h5>
                          <div className="space-y-2">
                            {vocabularyAnalysis.sophisticated.map((word, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-medium text-purple-700">{word.word}</span>
                                <span className="text-gray-600"> → {word.explanation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVocabularyHighlight("sophisticated", "Sophisticated vocabulary")}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Show Sophisticated Words
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Essay Analysis */}
            {highlightedText && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Vocabulary Analysis: {activeAnalysis}
                  </CardTitle>
                  <p className="text-sm text-blue-600">Hover over highlighted words for detailed explanations</p>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose max-w-none p-4 bg-white rounded-lg border"
                    dangerouslySetInnerHTML={{
                      __html: highlightVocabularyInEssay(essay, highlightedText).replace(/\n/g, "<br><br>"),
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setHighlightedText("")
                      setActiveAnalysis(null)
                    }}
                    className="mt-4"
                  >
                    Clear Highlights
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="grammar" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* C-unit Complexity */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader onClick={() => handleMetricClick("cUnitComplexity")}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Sentence Complexity</CardTitle>
                    {expandedCard === "cUnitComplexity" ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">C-units per clause</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">{metrics.cUnitComplexity.toFixed(2)}</span>
                      <Badge variant="secondary">
                        {metrics.cUnitComplexity >= 1.5
                          ? "Complex"
                          : metrics.cUnitComplexity >= 1.2
                            ? "Moderate"
                            : "Simple"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {getScoreInterpretation("cUnitComplexity", metrics.cUnitComplexity)}
                    </p>

                    {expandedCard === "cUnitComplexity" && (
                      <div className="space-y-3 animate-in fade-in-50 duration-200">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-800 mb-2">Complex Sentences Found:</h5>
                          <div className="space-y-2">
                            {grammarAnalysis.complexSentences.map((sentence, idx) => (
                              <div key={idx} className="text-sm">
                                <p className="font-medium mb-1">"{sentence.sentence.substring(0, 80)}..."</p>
                                <p className="text-blue-700 text-xs">{sentence.analysis}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {sentence.structures.map((structure, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {structure}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Verb Phrase Ratio */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader onClick={() => handleMetricClick("verbPhraseRatio")}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Verb Complexity</CardTitle>
                    {expandedCard === "verbPhraseRatio" ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">C-units per verb phrase</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">{metrics.verbPhraseRatio.toFixed(2)}</span>
                      <Badge variant="secondary">
                        {metrics.verbPhraseRatio >= 1.3
                          ? "Varied"
                          : metrics.verbPhraseRatio >= 1.0
                            ? "Adequate"
                            : "Limited"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Higher ratios indicate more varied verb usage</p>

                    {expandedCard === "verbPhraseRatio" && (
                      <div className="space-y-3 animate-in fade-in-50 duration-200">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-green-800 mb-2">Verb Variety Examples:</h5>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Modal verbs:</span> can, should, would
                            </p>
                            <p>
                              <span className="font-medium">Perfect tenses:</span> have revolutionized, has become
                            </p>
                            <p>
                              <span className="font-medium">Passive voice:</span> are now available
                            </p>
                            <p>
                              <span className="font-medium">Gerunds:</span> making, leading, finding
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Dependent Clause Ratio */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader onClick={() => handleMetricClick("dependentClauseRatio")}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Clause Embedding</CardTitle>
                    {expandedCard === "dependentClauseRatio" ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Dependent to total clauses</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600">
                        {(metrics.dependentClauseRatio * 100).toFixed(1)}%
                      </span>
                      <Badge variant="secondary">
                        {metrics.dependentClauseRatio >= 0.4
                          ? "High"
                          : metrics.dependentClauseRatio >= 0.25
                            ? "Moderate"
                            : "Low"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Shows use of subordination and complex structures</p>

                    {expandedCard === "dependentClauseRatio" && (
                      <div className="space-y-3 animate-in fade-in-50 duration-200">
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h5 className="font-medium text-purple-800 mb-2">Subordination Examples:</h5>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">While clauses:</span> "While some argue..."
                            </p>
                            <p>
                              <span className="font-medium">That clauses:</span> "argue that technology..."
                            </p>
                            <p>
                              <span className="font-medium">Which clauses:</span> "tools which enhance..."
                            </p>
                            <p>
                              <span className="font-medium">Because clauses:</span> "because it saves..."
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Interactive Improvement Suggestions
                </CardTitle>
                <p className="text-sm text-gray-600">Click on suggestions to see examples and explanations</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Vocabulary Enhancement */}
                  <div>
                    <h4 className="font-medium mb-3">Vocabulary Enhancement</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleVocabularyHighlight("repetitive", "Words to vary")}
                      >
                        <h5 className="font-medium text-red-800 mb-2">Reduce Repetition</h5>
                        <div className="space-y-2 text-sm">
                          {vocabularyAnalysis.repetitive.map((item, idx) => (
                            <div key={idx}>
                              <strong>{item.word}</strong> (used {item.count} times)
                              <p className="text-xs text-gray-600">{item.suggestion}</p>
                            </div>
                          ))}
                        </div>
                      </Card>

                      <Card
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleVocabularyHighlight("sophisticated", "Advanced vocabulary")}
                      >
                        <h5 className="font-medium text-green-800 mb-2">Sophisticated Alternatives</h5>
                        <div className="space-y-2 text-sm">
                          {vocabularyAnalysis.sophisticated.map((item, idx) => (
                            <div key={idx}>
                              <strong>{item.replacement}</strong> → <em>{item.word}</em>
                              <p className="text-xs text-gray-600">{item.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Grammar Suggestions */}
                  <div>
                    <h4 className="font-medium mb-3">Grammar Enhancement</h4>
                    <div className="space-y-4">
                      {grammarAnalysis.simpleStructures.map((item, idx) => (
                        <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                          <h5 className="font-medium text-orange-800 mb-2">Sentence Sophistication</h5>
                          <div className="space-y-2 text-sm">
                            <div>
                              <strong>Current:</strong> "{item.sentence}"
                            </div>
                            <div>
                              <strong>Improved:</strong> "{item.improvement}"
                            </div>
                            <p className="text-xs text-gray-600">{item.analysis}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Practice Exercises */}
                  <div>
                    <h4 className="font-medium mb-3">Practice Exercises</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong>Exercise 1:</strong> Replace the word "technology" with 3 different alternatives in
                          your essay.
                        </div>
                        <div>
                          <strong>Exercise 2:</strong> Combine two simple sentences using subordinating conjunctions
                          (while, although, because).
                        </div>
                        <div>
                          <strong>Exercise 3:</strong> Add two academic words from the AWL to strengthen your argument.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
