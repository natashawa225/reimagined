"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, FileText } from "lucide-react"
import type { AnalysisResult } from "@/lib/types"

interface RubricFeedbackProps {
  analysis: AnalysisResult
}

export function RubricFeedback({ analysis }: RubricFeedbackProps) {
  const rubricCategories = [
    {
      name: "Task Achievement",
      score: analysis.rubricScores.taskAchievement,
      description: "How well the essay addresses the task requirements",
      feedback: analysis.rubricFeedback.taskAchievement,
    },
    {
      name: "Coherence & Cohesion",
      score: analysis.rubricScores.coherenceCohesion,
      description: "Organization and logical flow of ideas",
      feedback: analysis.rubricFeedback.coherenceCohesion,
    },
    {
      name: "Lexical Resource",
      score: analysis.rubricScores.lexicalResource,
      description: "Vocabulary range and accuracy",
      feedback: analysis.rubricFeedback.lexicalResource,
    },
    {
      name: "Grammatical Range & Accuracy",
      score: analysis.rubricScores.grammaticalRange,
      description: "Sentence structures and grammar accuracy",
      feedback: analysis.rubricFeedback.grammaticalRange,
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            IELTS Writing Task 2 Rubric Assessment
          </CardTitle>
          <p className="text-sm text-gray-600">
            Detailed feedback based on official IELTS Writing Task 2 assessment criteria
          </p>
        </CardHeader>
      </Card>

      {/* Overall Score */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-3xl font-bold text-blue-800 mb-2">Overall Band Score: {analysis.holisticScore}/9</h3>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {getBandDescription(analysis.holisticScore)}
              </Badge>
            </div>
            <p className="text-blue-700 max-w-2xl mx-auto">{analysis.scoreRationale}</p>
          </div>
        </CardContent>
      </Card>

      {/* Rubric Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rubricCategories.map((category, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {getScoreIcon(category.score)}
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Natural Language Summary */}
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

      {/* Improvement Recommendations */}
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

      {/* Band Score Descriptors */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Your Band Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Band 8-9 (Very Good to Excellent)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Fully addresses all parts of the task</li>
                <li>• Ideas are well-developed and supported</li>
                <li>• Wide range of vocabulary used naturally</li>
                <li>• Complex structures used accurately</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Band 6-7 (Competent to Good)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Addresses the task with some clarity</li>
                <li>• Ideas are relevant but may lack development</li>
                <li>• Adequate vocabulary with some flexibility</li>
                <li>• Mix of simple and complex sentences</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Band 4-5 (Limited to Modest)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Attempts to address the task</li>
                <li>• Limited development of ideas</li>
                <li>• Basic vocabulary with repetition</li>
                <li>• Simple sentence structures predominate</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Band 1-3 (Non-user to Extremely Limited)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Minimal attempt to address task</li>
                <li>• Ideas difficult to identify</li>
                <li>• Very limited vocabulary</li>
                <li>• Major grammatical errors</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
