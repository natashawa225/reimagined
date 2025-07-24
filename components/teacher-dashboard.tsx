"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, AlertTriangle, Download, Settings } from "lucide-react"

export function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState("class-1")
  const [feedbackMode, setFeedbackMode] = useState("standard")

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
      recentSubmissions: [
        { student: "Alice Johnson", score: 7.5, submitted: "2 hours ago", issues: ["coherence"] },
        { student: "Bob Smith", score: 5.5, submitted: "4 hours ago", issues: ["vocabulary", "grammar"] },
        { student: "Carol Davis", score: 6.8, submitted: "1 day ago", issues: ["evidence"] },
      ],
    },
    "class-2": {
      name: "Intermediate Writing",
      students: 30,
      submissions: 22,
      avgScore: 5.4,
      commonIssues: [
        { issue: "Incomplete conclusions", count: 14, percentage: 64 },
        { issue: "Sentence fragments", count: 10, percentage: 45 },
        { issue: "Basic vocabulary", count: 18, percentage: 82 },
        { issue: "Lack of topic sentences", count: 9, percentage: 41 },
      ],
      recentSubmissions: [
        { student: "David Lee", score: 5.9, submitted: "3 hours ago", issues: ["structure"] },
        { student: "Eva Green", score: 4.8, submitted: "6 hours ago", issues: ["grammar", "vocabulary"] },
        { student: "Fiona Martinez", score: 6.0, submitted: "2 days ago", issues: ["conclusion"] },
      ],
    },
    "class-3": {
      name: "IELTS Preparation",
      students: 28,
      submissions: 26,
      avgScore: 6.8,
      commonIssues: [
        { issue: "Task response misalignment", count: 11, percentage: 42 },
        { issue: "Inaccurate grammar usage", count: 16, percentage: 62 },
        { issue: "Unclear introductions", count: 8, percentage: 31 },
        { issue: "Lack of coherence", count: 13, percentage: 50 },
      ],
      recentSubmissions: [
        { student: "George Tan", score: 7.0, submitted: "1 hour ago", issues: ["task response"] },
        { student: "Hannah Kim", score: 6.3, submitted: "5 hours ago", issues: ["grammar"] },
        { student: "Ibrahim Zayed", score: 7.2, submitted: "Yesterday", issues: ["coherence"] },
      ],
    },
  }

  const currentClass = classData[selectedClass as keyof typeof classData]

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
              <p className="text-sm text-gray-600">Monitor student progress and identify common writing issues</p>
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Class Overview</TabsTrigger>
          <TabsTrigger value="issues">Common Issues</TabsTrigger>
          <TabsTrigger value="students">Student Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

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

          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentClass.recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{submission.student}</h4>
                      <p className="text-sm text-gray-600">{submission.submitted}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {submission.issues.map((issue, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-lg font-bold text-blue-600">{submission.score}/9</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

          {/* Instructional Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Instructional Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">High Priority &gt;70% of students</h4>
                  <p className="text-sm text-red-700">
                    <strong>Poor paragraph transitions:</strong> Consider dedicating a lesson to cohesive devices and
                    paragraph linking strategies.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Medium Priority 40-70% of students</h4>
                  <p className="text-sm text-yellow-700">
                    <strong>Weak thesis statements & Limited academic vocabulary:</strong> Focus on thesis construction
                    and introduce AWL vocabulary exercises.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Individual Support &lt;40% of students</h4>
                  <p className="text-sm text-green-700">
                    <strong>Missing evidence:</strong> Provide targeted support to specific students on evidence
                    integration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Individual Student Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would show individual student progress over time */}
                <p className="text-gray-600">
                  Individual student tracking and progress visualization would be implemented here.
                </p>
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
    </div>
  )
}
