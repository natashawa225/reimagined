"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, XCircle, FileText, ChevronDown, ChevronRight, Lightbulb, Eye } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AnalysisResult } from "@/lib/types"

interface RubricFeedbackProps {
  analysis: AnalysisResult
  accessibilityMode?: "standard" | "dyslexia" | "adhd"
  ttsEnabled?: boolean
}

export function RubricFeedback({ analysis, accessibilityMode = "standard", ttsEnabled = false }: RubricFeedbackProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [highlightedText, setHighlightedText] = useState<string>("")
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  // Mock essay text for highlighting (in real app, this would come from props)
  const mockEssay = `In today's digital age, the role of technology in education has become a subject of intense debate. While some argue that technological advancements have revolutionized learning by making it more accessible and engaging, others contend that it has led to intellectual laziness and superficial thinking among students.

Proponents of educational technology highlight several compelling advantages. Firstly, digital platforms have democratized access to knowledge, allowing students from remote areas to attend virtual lectures from world-renowned institutions. For instance, online courses from universities like Harvard and MIT are now available to anyone with an internet connection. Additionally, interactive learning tools such as educational apps and virtual reality simulations can make complex concepts more understandable and memorable.

However, critics raise valid concerns about technology's impact on cognitive development. They argue that the constant availability of information through search engines has made students overly dependent on external sources, reducing their ability to think critically and retain information. Furthermore, the prevalence of social media and entertainment platforms can be highly distracting, leading to shortened attention spans.

In my opinion, while technology presents certain challenges, its benefits in education far outweigh the drawbacks when used appropriately. The key lies in finding the right balance and implementing technology as a tool to enhance rather than replace traditional learning methods.

In conclusion, technology has undoubtedly transformed the educational landscape, offering unprecedented opportunities for learning and growth. However, it is crucial that educators and students alike approach these tools mindfully.`

  const rubricCategories = [
    {
      name: "Task Achievement",
      score: analysis.rubricScores.taskAchievement,
      description: "How well the essay addresses the task requirements",
      feedback: analysis.rubricFeedback.taskAchievement,
      examples: [
        {
          text: "While some argue that technological advancements have revolutionized learning by making it more accessible and engaging, others contend that it has led to intellectual laziness",
          explanation: "Shows clear understanding of both sides of the argument",
          type: "strength",
        },
        {
          text: "In my opinion, while technology presents certain challenges, its benefits in education far outweigh the drawbacks",
          explanation: "Clear position statement addressing the task requirement",
          type: "strength",
        },
      ],
      improvements: [
        "Consider adding more specific examples to support your arguments",
        "Develop your conclusion with stronger final thoughts",
        "Address all parts of the question more explicitly",
      ],
      bandDescriptors: {
        9: "Fully addresses all parts with very sophisticated treatment",
        7: "Addresses all parts with clear, well-developed ideas",
        5: "Addresses the task only partially with limited development",
        3: "Attempts to address but with minimal understanding",
      },
    },
    {
      name: "Coherence & Cohesion",
      score: analysis.rubricScores.coherenceCohesion,
      description: "Organization and logical flow of ideas",
      feedback: analysis.rubricFeedback.coherenceCohesion,
      examples: [
        {
          text: "Firstly, digital platforms have democratized access to knowledge",
          explanation: "Good use of sequencing language to organize ideas",
          type: "strength",
        },
        {
          text: "However, critics raise valid concerns",
          explanation: "Effective contrast marker showing opposing viewpoint",
          type: "strength",
        },
        {
          text: "Furthermore, the prevalence of social media",
          explanation: "Additional linking word but could vary more",
          type: "improvement",
        },
      ],
      improvements: [
        "Use more varied cohesive devices beyond 'furthermore' and 'however'",
        "Improve paragraph transitions with clearer topic sentences",
        "Consider using more sophisticated linking phrases",
      ],
      bandDescriptors: {
        9: "Uses cohesion naturally without attracting attention",
        7: "Logically organizes with clear progression throughout",
        5: "Some organization but may lack overall progression",
        3: "Presents information but not coherently",
      },
    },
    {
      name: "Lexical Resource",
      score: analysis.rubricScores.lexicalResource,
      description: "Vocabulary range and accuracy",
      feedback: analysis.rubricFeedback.lexicalResource,
      examples: [
        {
          text: "democratized access to knowledge",
          explanation: "Sophisticated academic vocabulary showing range",
          type: "strength",
        },
        {
          text: "compelling advantages",
          explanation: "Good collocation usage",
          type: "strength",
        },
        {
          text: "technology presents certain challenges",
          explanation: "Could use more precise vocabulary like 'poses significant obstacles'",
          type: "improvement",
        },
      ],
      improvements: [
        "Replace common words with more academic alternatives",
        "Use more varied vocabulary to avoid repetition of 'technology'",
        "Include more subject-specific terminology",
      ],
      bandDescriptors: {
        9: "Wide range used naturally with very sophisticated control",
        7: "Sufficient range with flexibility and precise usage",
        5: "Limited range but adequate for the task",
        3: "Very limited vocabulary with limited control",
      },
    },
    {
      name: "Grammatical Range & Accuracy",
      score: analysis.rubricScores.grammaticalRange,
      description: "Sentence structures and grammar accuracy",
      feedback: analysis.rubricFeedback.grammaticalRange,
      examples: [
        {
          text: "While some argue that technological advancements have revolutionized learning by making it more accessible and engaging, others contend that it has led to intellectual laziness",
          explanation: "Complex sentence with subordinate clauses showing grammatical range",
          type: "strength",
        },
        {
          text: "allowing students from remote areas to attend virtual lectures",
          explanation: "Good use of participle clause for sentence variety",
          type: "strength",
        },
        {
          text: "it is crucial that educators and students alike approach these tools mindfully",
          explanation: "Could improve with more varied sentence openings",
          type: "improvement",
        },
      ],
      improvements: [
        "Vary sentence openings more (avoid starting with 'it is')",
        "Use more conditional structures to show hypothetical situations",
        "Include more passive voice constructions where appropriate",
      ],
      bandDescriptors: {
        9: "Wide range of structures with full flexibility and accuracy",
        7: "Variety of complex structures with good control",
        5: "Mix of simple and complex forms with some accuracy",
        3: "Only simple sentence forms with limited accuracy",
      },
    },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600"
    if (score >= 5) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 7) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (score >= 5) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getBandDescription = (score: number) => {
    if (score >= 8) return "Very Good"
    if (score >= 7) return "Good"
    if (score >= 6) return "Competent"
    if (score >= 5) return "Modest"
    return "Limited"
  }

  const highlightTextInEssay = (text: string) => {
    if (!text || !highlightedText) return mockEssay

    const regex = new RegExp(`(${highlightedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    return mockEssay.replace(
      regex,
      `<mark class="bg-yellow-200 px-1 rounded cursor-pointer" title="Click for explanation">$1</mark>`,
    )
  }

  const handleTextHighlight = (text: string, explanation: string) => {
    setHighlightedText(text)
    setActiveTooltip(explanation)
  }

  const toggleExpanded = (cardName: string) => {
    setExpandedCard(expandedCard === cardName ? null : cardName)
    setHighlightedText("")
    setActiveTooltip(null)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              IELTS Writing Task 2 Rubric Assessment
            </CardTitle>
            <p className="text-sm text-gray-600">
              Click on categories below for detailed analysis and examples from your essay
            </p>
          </CardHeader>
        </Card>

        {/* Overall Score */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-3xl font-bold text-blue-800 mb-2">
                  Overall Band Score: {analysis.holisticScore}/9
                </h3>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {getBandDescription(analysis.holisticScore)}
                </Badge>
              </div>
              <p className="text-blue-700 max-w-2xl mx-auto">{analysis.scoreRationale}</p>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Rubric Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rubricCategories.map((category, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader onClick={() => toggleExpanded(category.name)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    {expandedCard === category.name ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger>{getScoreIcon(category.score)}</TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Band {category.score}: {getBandDescription(category.score)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <span className={`text-xl font-bold ${getScoreColor(category.score)}`}>{category.score}/9</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{category.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Performance Level</span>
                      <span>{getBandDescription(category.score)}</span>
                    </div>
                    <Progress value={(category.score / 9) * 100} className="h-2" />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{category.feedback}</p>
                  </div>

                  {expandedCard === category.name && (
                    <div className="space-y-4 animate-in fade-in-50 duration-200">
                      {/* Examples from Essay */}
                      <div>
                        <h5 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Examples from Your Essay
                        </h5>
                        <div className="space-y-2">
                          {category.examples.map((example, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                example.type === "strength"
                                  ? "bg-green-50 border-green-400"
                                  : "bg-yellow-50 border-yellow-400"
                              }`}
                              onClick={() => handleTextHighlight(example.text, example.explanation)}
                            >
                              <p className="text-sm font-medium mb-1">"{example.text.substring(0, 60)}..."</p>
                              <p className="text-xs text-gray-600">{example.explanation}</p>
                              <Badge
                                variant={example.type === "strength" ? "default" : "secondary"}
                                className="mt-2 text-xs"
                              >
                                {example.type === "strength" ? "Strength" : "Can Improve"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Improvement Suggestions */}
                      <div>
                        <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Specific Improvements
                        </h5>
                        <div className="space-y-2">
                          {category.improvements.map((improvement, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                              <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                {idx + 1}
                              </div>
                              <p className="text-sm text-blue-800">{improvement}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Band Descriptors */}
                      <div>
                        <h5 className="font-medium text-purple-800 mb-2">Band Score Guide</h5>
                        <div className="space-y-1 text-xs">
                          {Object.entries(category.bandDescriptors).map(([band, description]) => (
                            <div
                              key={band}
                              className={`p-2 rounded ${
                                Number.parseFloat(band) === Math.floor(category.score)
                                  ? "bg-purple-100 border border-purple-300"
                                  : "bg-gray-50"
                              }`}
                            >
                              <span className="font-medium">Band {band}:</span> {description}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Essay with Highlights */}
        {highlightedText && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle>Your Essay with Highlighted Examples</CardTitle>
              <p className="text-sm text-gray-600">
                Highlighted text shows the example being analyzed.
                {activeTooltip && (
                  <span className="block mt-2 p-2 bg-white rounded border-l-4 border-yellow-400">
                    <strong>Analysis:</strong> {activeTooltip}
                  </span>
                )}
              </p>
            </CardHeader>
            <CardContent>
              <div
                className="prose max-w-none p-4 bg-white rounded-lg border"
                dangerouslySetInnerHTML={{
                  __html: highlightTextInEssay(mockEssay).replace(/\n/g, "<br><br>"),
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHighlightedText("")
                  setActiveTooltip(null)
                }}
                className="mt-4"
              >
                Clear Highlights
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Comprehensive Assessment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Comprehensive Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{analysis.naturalLanguageSummary}</p>
            </div>
          </CardContent>
        </Card>

        {/* Key Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Key Recommendations for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-blue-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

