"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, TrendingUp, Zap } from "lucide-react"
import type { AnalysisResult } from "@/lib/types"

interface LinguisticAnalysisProps {
  analysis: AnalysisResult
  essay: string
}

export function LinguisticAnalysis({ analysis, essay}: LinguisticAnalysisProps) {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<string>("lexical")
  const [wordSuggestions, setWordSuggestions] = useState<{ [key: string]: string[] }>({})

  const metrics = analysis.linguisticMetrics

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

  const highlightUncommonWords = (text: string) => {
    // This would normally use the COCA corpus data
    const uncommonWords = ["sophisticated", "nevertheless", "consequently", "furthermore"]
    let highlightedText = text

    uncommonWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi")
      highlightedText = highlightedText.replace(
        regex,
        `<span class="bg-blue-100 cursor-pointer hover:bg-blue-200 px-1 rounded" data-word="${word}">$&</span>`,
      )
    })

    return highlightedText
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Linguistic & Grammar Analysis
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive analysis of lexical sophistication and grammatical complexity
          </p>
        </CardHeader>
      </Card>

      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lexical">Lexical Metrics</TabsTrigger>
          <TabsTrigger value="grammar">Grammar Complexity</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="lexical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lexical Diversity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lexical Diversity</CardTitle>
                <p className="text-sm text-gray-600">Variety of vocabulary used</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {(metrics.lexicalDiversity * 100).toFixed(1)}%
                    </span>
                    <Badge variant="secondary">
                      {metrics.lexicalDiversity >= 0.7
                        ? "Excellent"
                        : metrics.lexicalDiversity >= 0.5
                          ? "Good"
                          : "Needs Improvement"}
                    </Badge>
                  </div>
                  <Progress value={metrics.lexicalDiversity * 100} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {getScoreInterpretation("lexicalDiversity", metrics.lexicalDiversity)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Academic Word Coverage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Academic Vocabulary</CardTitle>
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
                </div>
              </CardContent>
            </Card>

            {/* Lexical Prevalence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lexical Sophistication</CardTitle>
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Essay with Word Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary Analysis</CardTitle>
              <p className="text-sm text-gray-600">
                Highlighted words show lexical sophistication. Hover for suggestions.
              </p>
            </CardHeader>
            <CardContent>
              <div
                className="prose max-w-none p-4 bg-gray-50 rounded-lg border"
                dangerouslySetInnerHTML={{
                  __html: highlightUncommonWords(essay).replace(/\n/g, "<br>"),
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grammar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* C-unit Complexity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sentence Complexity</CardTitle>
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
                </div>
              </CardContent>
            </Card>

            {/* Verb Phrase Ratio */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verb Complexity</CardTitle>
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
                </div>
              </CardContent>
            </Card>

            {/* Dependent Clause Ratio */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clause Embedding</CardTitle>
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grammar Diagnostic */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Grammar Complexity Diagnostic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Overall Assessment:</h4>
                  <p className="text-blue-700">
                    {metrics.cUnitComplexity >= 1.5
                      ? "Your writing demonstrates sophisticated sentence structures with good variety in complexity."
                      : metrics.cUnitComplexity >= 1.2
                        ? "Your writing shows moderate complexity. Consider integrating more varied sentence openings and subordinating conjunctions."
                        : "Your writing relies heavily on simple structures. Try combining ideas with conjunctions like 'although', 'because', 'while', etc."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-1">Strengths:</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      {metrics.lexicalDiversity >= 0.6 && <li>• Good vocabulary variety</li>}
                      {metrics.academicWordCoverage >= 12 && <li>• Strong academic vocabulary</li>}
                      {metrics.cUnitComplexity >= 1.3 && <li>• Complex sentence structures</li>}
                    </ul>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-1">Areas for Improvement:</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {metrics.lexicalDiversity < 0.5 && <li>• Increase vocabulary variety</li>}
                      {metrics.academicWordCoverage < 10 && <li>• Use more academic vocabulary</li>}
                      {metrics.cUnitComplexity < 1.2 && <li>• Add sentence complexity</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Improvement Suggestions
              </CardTitle>
              <p className="text-sm text-gray-600">Targeted recommendations based on your linguistic analysis</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Vocabulary Suggestions */}
                <div>
                  <h4 className="font-medium mb-3">Vocabulary Enhancement</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Academic Word Alternatives</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>important</strong> → <em>significant, crucial, vital</em>
                        </div>
                        <div>
                          <strong>show</strong> → <em>demonstrate, illustrate, reveal</em>
                        </div>
                        <div>
                          <strong>big</strong> → <em>substantial, considerable, extensive</em>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">Transition Words</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Furthermore</strong> - to add information
                        </div>
                        <div>
                          <strong>Nevertheless</strong> - to show contrast
                        </div>
                        <div>
                          <strong>Consequently</strong> - to show result
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grammar Suggestions */}
                <div>
                  <h4 className="font-medium mb-3">Sentence Structure Enhancement</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h5 className="font-medium text-purple-800 mb-2">Complex Sentence Patterns</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Simple:</strong> Technology is important. It helps education.
                        </div>
                        <div>
                          <strong>Complex:</strong> Technology, which has revolutionized many sectors, plays a crucial
                          role in modern education.
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h5 className="font-medium text-orange-800 mb-2">Subordinating Conjunctions</h5>
                      <div className="text-sm">
                        Try using: <em>although, whereas, despite, provided that, in order that</em>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Practice Exercises */}
                <div>
                  <h4 className="font-medium mb-3">Practice Exercises</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong>Exercise 1:</strong> Rewrite three simple sentences from your essay using subordinating
                        conjunctions.
                      </div>
                      <div>
                        <strong>Exercise 2:</strong> Replace five common words with academic alternatives from the AWL.
                      </div>
                      <div>
                        <strong>Exercise 3:</strong> Add two transition phrases to improve paragraph connections.
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
  )
}
