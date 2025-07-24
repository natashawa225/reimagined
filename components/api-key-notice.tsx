"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Key } from "lucide-react"

export function ApiKeyNotice() {
  return (
    <Alert className="border-orange-200 bg-orange-50 mb-6">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium text-orange-800">OpenAI API Key Required</p>
          <p className="text-orange-700 text-sm">
            To use this IELTS feedback system, you need to configure your OpenAI API key:
          </p>
          <div className="bg-orange-100 p-3 rounded-lg text-sm font-mono">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-3 w-3" />
              <span className="font-medium">Environment Variable:</span>
            </div>
            <code>OPENAI_API_KEY=your_api_key_here</code>
          </div>
          <p className="text-orange-700 text-xs">
            Get your API key from{" "}
            <a
              href="https://platform.openai.com/api-keys"
              className="underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              OpenAI Platform
            </a>
          </p>
        </div>
      </AlertDescription>
    </Alert>
  )
}
