"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Key, Server, Database } from "lucide-react"

export function SetupGuide() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="border-blue-200 bg-blue-50 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Server className="h-5 w-5" />
            Setup Guide
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-700 hover:text-blue-900"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {isExpanded ? "Hide" : "Show"} Setup Instructions
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">1. OpenAI API Key</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">Required for AI analysis</p>
              <Badge variant="secondary" className="text-xs">
                OPENAI_API_KEY
              </Badge>
            </div>

            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">2. Training Data</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">16 annotated essays (.xlsx)</p>
              <Badge variant="secondary" className="text-xs">
                Optional
              </Badge>
            </div>

            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">3. COCA Corpus</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">Academic corpus files (.txt)</p>
              <Badge variant="secondary" className="text-xs">
                Optional
              </Badge>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <h4 className="font-medium mb-2">Environment Variables Setup:</h4>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
              <div>OPENAI_API_KEY=sk-your-openai-api-key-here</div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Add this to your .env.local file or environment configuration</p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
