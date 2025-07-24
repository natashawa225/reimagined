"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle } from "lucide-react"

interface ProgressItem {
  id: string
  label: string
  completed: boolean
}

interface ProgressTrackerProps {
  items: ProgressItem[]
  title?: string
}

export function ProgressTracker({ items, title = "Progress" }: ProgressTrackerProps) {
  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Completed</span>
            <span>
              {completedCount}/{totalCount}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-sm">
              {item.completed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              <span className={item.completed ? "text-green-700" : "text-gray-600"}>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
