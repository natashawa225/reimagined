"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Users, AlertTriangle, Download, Settings, Eye, MessageSquare, Search, Filter } from "lucide-react"
import { EssayReviewModal } from "@/components/essay-review-modal"
import { mockStudentSubmissions, type StudentSubmission } from "@/lib/mock-teacher-data"

export function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState("class-1")
  const [feedbackMode, setFeedbackMode] = useState("standard")
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data - in real app, this would come from API
  const classData = {
    "class-1": {
      name: "Advanced Writing Class",
      students: 24,
      submissions: 18,
      avgScore: 6.2,
      commonIssues: [
        { issue: "Weak thesis statements", count: 12, percentage: 67 },
        { issue: "Missing evidence", count: 8, percentage: 44 },
        { issue: "Poor paragraph transitions", count: 15, percentage: 83 },
        { issue: "Limited academic vocabulary", count: 10, percentage: 56 },
      ],
    },
  }

  const currentClass = classData[selectedClass as keyof typeof classData]

  // Filter submissions based on search and status
  const filteredSubmissions = mockStudentSubmissions.filter((submission) => {
    const matchesSearch = submission.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOpenEssay = (submission: StudentSubmission) => {
    setSelectedSubmission(submission)
    setIsReviewModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reviewed":
        return "bg-green-100 text-green-800"
      case "graded":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-green-600"
    if (score >= 5) return "text-yellow-600"
    return "text-red-600"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Teacher Dashboard
              </CardTitle>
              <p className="text-sm text-gray-600">Monitor student progress and provide detailed feedback</p>
            </div>
            <div className="flex gap-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class-1">Advanced Writing Class</SelectItem>
                  <SelectItem value="class-2">Intermediate Writing</SelectItem>
                  <SelectItem value="class-3">IELTS Preparation</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="submissions">Student Submissions</TabsTrigger>
          <TabsTrigger value="overview">Class Overview</TabsTrigger>
          <TabsTrigger value="issues">Common Issues</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="graded">Graded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Student Submissions List */}
          <Card>
            <CardHeader>
              <CardTitle>Student Submissions ({filteredSubmissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {submission.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{submission.studentName}</h4>
                        <p className="text-sm text-gray-600">Submitted {formatDate(submission.submittedAt)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </Badge>
                          <span className={`text-sm font-medium ${getScoreColor(submission.analysis.holisticScore)}`}>
                            Score: {submission.analysis.holisticScore}/9
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {submission.teacherComment && (
                        <Badge variant="outline" className="text-xs">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Has Comment
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEssay(submission)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Review Essay
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          {/* Class Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{currentClass.students}</div>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{currentClass.submissions}</div>
                  <p className="text-sm text-gray-600">Submissions</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{currentClass.avgScore}</div>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {Math.round((currentClass.submissions / currentClass.students) * 100)}%
                  </div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Common Writing Issues Analysis
              </CardTitle>
              <p className="text-sm text-gray-600">
                Identify patterns across student submissions to inform instruction
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentClass.commonIssues.map((issue, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{issue.issue}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {issue.count}/{currentClass.submissions} students
                        </span>
                        <Badge
                          variant={
                            issue.percentage > 70 ? "destructive" : issue.percentage > 40 ? "secondary" : "default"
                          }
                        >
                          {issue.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          issue.percentage > 70
                            ? "bg-red-500"
                            : issue.percentage > 40
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${issue.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Feedback Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Feedback Mode</label>
                  <Select value={feedbackMode} onValueChange={setFeedbackMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Feedback</SelectItem>
                      <SelectItem value="indirect">Indirect Hints Only</SelectItem>
                      <SelectItem value="minimal">Minimal Feedback</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Enable/Disable Features</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Element-level feedback</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Linguistic analysis</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Visual argument diagram</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Direct corrections (not recommended)</span>
                    </label>
                  </div>
                </div>

                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Essay Review Modal */}
      <EssayReviewModal
        submission={selectedSubmission}
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false)
          setSelectedSubmission(null)
        }}
      />
    </div>
  )
}

