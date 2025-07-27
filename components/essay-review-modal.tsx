"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, MessageSquare, BarChart3, Eye, Save, User, Calendar, Target } from "lucide-react"
import { LinguisticAnalysis } from "@/components/linguistic-analysis"
import { RubricFeedback } from "@/components/rubric-feedback"
import { CombinedAnalysis } from "@/components/combined-analysis"
import type { StudentSubmission } from "@/lib/mock-teacher-data"
import { updateTeacherComment, updateSubmissionGrade } from "@/lib/mock-teacher-data"

interface EssayReviewModalProps {
  submission: StudentSubmission | null
  isOpen: boolean
  onClose: () => void
}

export function EssayReviewModal({ submission, isOpen, onClose }: EssayReviewModalProps) {
  const [teacherComment, setTeacherComment] = useState(submission?.teacherComment || "")
  const [grade, setGrade] = useState(submission?.grade?.toString() || "")
  const [activeTab, setActiveTab] = useState("essay")

  if (!submission) return null

  const handleSaveComment = () => {
    updateTeacherComment(submission.id, teacherComment)
    alert("Comment saved successfully!")
  }

  const handleSaveGrade = () => {
    const gradeNum = Number.parseFloat(grade)
    if (gradeNum >= 0 && gradeNum <= 9) {
      updateSubmissionGrade(submission.id, gradeNum)
      alert("Grade saved successfully!")
    } else {
      alert("Please enter a valid grade between 0 and 9")
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600 bg-green-100"
    if (score >= 5) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <User className="h-6 w-6" />
            {submission.studentName} - Essay Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Info Header */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Student</p>
                    <p className="font-medium">{submission.studentName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium">{formatDate(submission.submittedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Score</p>
                    <Badge className={`font-bold ${getScoreColor(submission.analysis.holisticScore)}`}>
                      {submission.analysis.holisticScore}/9
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="essay">
                <FileText className="h-4 w-4 mr-2" />
                Essay & Prompt
              </TabsTrigger>
              <TabsTrigger value="structure">
                <Eye className="h-4 w-4 mr-2" />
                Structure Analysis
              </TabsTrigger>
              <TabsTrigger value="rubric">
                <BarChart3 className="h-4 w-4 mr-2" />
                Rubric Feedback
              </TabsTrigger>
              <TabsTrigger value="linguistic">
                <BarChart3 className="h-4 w-4 mr-2" />
                Linguistic Analysis
              </TabsTrigger>
              <TabsTrigger value="feedback">
                <MessageSquare className="h-4 w-4 mr-2" />
                Teacher Feedback
              </TabsTrigger>
            </TabsList>

            <TabsContent value="essay" className="space-y-6">
              {/* Essay Prompt */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Essay Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-gray-700 leading-relaxed">{submission.prompt}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Student Essay */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Student Essay
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{submission.essay.split(" ").length} words</Badge>
                    <Badge className={getScoreColor(submission.analysis.holisticScore)}>
                      Score: {submission.analysis.holisticScore}/9
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none p-6 bg-gray-50 rounded-lg border">
                    {submission.essay.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="structure">
              <CombinedAnalysis
                analysis={submission.analysis}
                essay={submission.essay}
                accessibilityMode="standard"
                ttsEnabled={false}
              />
            </TabsContent>

            <TabsContent value="rubric">
              <RubricFeedback analysis={submission.analysis} 
              // accessibilityMode="standard" 
              // ttsEnabled={false} 
              />
            </TabsContent>

            <TabsContent value="linguistic">
              <LinguisticAnalysis
                analysis={submission.analysis}
                essay={submission.essay}
                // accessibilityMode="standard"
                // ttsEnabled={false}
              />
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              {/* Grading Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Grade Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="grade">Overall Grade (0-9)</Label>
                      <Input
                        id="grade"
                        type="number"
                        min="0"
                        max="9"
                        step="0.5"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="Enter grade..."
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleSaveGrade} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Grade
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>AI Suggested Score:</strong> {submission.analysis.holisticScore}/9
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Confidence:</strong> {submission.analysis.confidence}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Teacher Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Teacher Comments & Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="comment">Your feedback for {submission.studentName}</Label>
                    <Textarea
                      id="comment"
                      value={teacherComment}
                      onChange={(e) => setTeacherComment(e.target.value)}
                      placeholder="Enter your feedback and comments for the student..."
                      rows={6}
                      className="mt-2"
                    />
                  </div>
                  <Button onClick={handleSaveComment} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Comment
                  </Button>
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>AI-Generated Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {submission.analysis.recommendations.map((recommendation, index) => (
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
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}