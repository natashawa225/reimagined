"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, Info, Eye, Sparkles } from "lucide-react"
import type { AnalysisResult, ArgumentElement } from "@/lib/types"

interface ArgumentDiagramProps {
  analysis: AnalysisResult
  essay: string
}

export function ArgumentDiagram({ analysis, essay }: ArgumentDiagramProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  const getElementStyle = (effectiveness: string, found: boolean) => {
    if (!found) {
      return "bg-gray-200 border-gray-400 border-dashed text-gray-500"
    }

    switch (effectiveness) {
      case "Effective":
        return "bg-gradient-to-br from-green-100 to-green-200 border-green-400 text-green-800 shadow-lg"
      case "Adequate":
        return "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 text-yellow-800 shadow-lg"
      case "Ineffective":
        return "bg-gradient-to-br from-red-100 to-red-200 border-red-400 text-red-800 shadow-lg"
      default:
        return "bg-gray-100 border-gray-400 text-gray-800"
    }
  }

  const getEffectivenessIcon = (effectiveness: string, found: boolean) => {
    if (!found) return <XCircle className="h-4 w-4 text-gray-500" />

    switch (effectiveness) {
      case "Effective":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Adequate":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Ineffective":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const DiagramElement = ({
    id,
    label,
    element,
    className = "",
    style = {},
  }: {
    id: string
    label: string
    element: ArgumentElement
    className?: string
    style?: React.CSSProperties
  }) => {
    const isSelected = selectedElement === id
    const found = element.text !== "" || element.effectiveness !== "Missing"

    return (
      <div
        className={`absolute border-2 rounded-lg p-3 min-w-[120px] text-center cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${getElementStyle(
          element.effectiveness,
          found,
        )} ${isSelected ? "ring-2 ring-purple-500 ring-offset-2" : ""} ${className}`}
        style={style}
        onClick={() => setSelectedElement(isSelected ? null : id)}
      >
        <div className="font-bold text-sm mb-1">{label}</div>
        <div className="flex justify-center items-center gap-1 mb-1">
          {getEffectivenessIcon(element.effectiveness, found)}
          <span className="text-xs font-medium">{found ? element.effectiveness : "Missing"}</span>
        </div>
        {found && element.text && (
          <div className="text-xs italic truncate max-w-[100px]" title={element.text}>
            "{element.text.substring(0, 25)}..."
          </div>
        )}
      </div>
    )
  }

  const missingElements = Object.entries(analysis.elements)
    .filter(([_, element]) => element.effectiveness === "Missing")
    .map(([key, _]) => key)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />Visual Argument Structure
        </CardTitle>
        <p>
          Interactive diagram showing your essay's argumentative structure based on the Crossley model. Missing elements
          are greyed out.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative w-full h-[700px] bg-gradient-to-br from-gray-50 to-gray-100 border-2 rounded-lg overflow-hidden shadow-inner">
          {/* SVG for arrows - matching the Crossley diagram exactly */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
              </marker>
              <marker id="arrowhead-bidirectional" markerWidth="10" markerHeight="7" refX="1" refY="3.5" orient="auto">
                <polygon points="10 0, 0 3.5, 10 7" fill="#8b5cf6" />
              </marker>
            </defs>

            {/* Hierarchical arrows - Position to Lead */}
            <line x1="460" y1="150" x2="460" y2="85" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />

            {/* Claims/Counterclaim to Position */}
            <line x1="210" y1="260" x2="210" y2="210" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <line x1="460" y1="260" x2="460" y2="210" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <line x1="710" y1="260" x2="710" y2="210" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />

            {/* Claims to Evidence */}
            <line x1="150" y1="380" x2="150" y2="330" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <line x1="280" y1="380" x2="280" y2="330" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <line x1="460" y1="380" x2="460" y2="330" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />

            {/* Counterclaim to Rebuttal/Evidence */}
            <line x1="650" y1="380" x2="650" y2="330" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <line x1="790" y1="380" x2="790" y2="330" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />

            {/* Rebuttal to Evidence */}
            <line x1="630" y1="475" x2="630" y2="447" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />

            {/* Parallel connections (bidirectional) */}
            <line
              x1="310"
              y1="300"
              x2="400"
              y2="300"
              stroke="#8b5cf6"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              markerStart="url(#arrowhead-bidirectional)"
            />
            <line
              x1="520"
              y1="300"
              x2="620"
              y2="300"
              stroke="#8b5cf6"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              markerStart="url(#arrowhead-bidirectional)"
            />
            <line
              x1="185"
              y1="410"
              x2="240"
              y2="410"
              stroke="#8b5cf6"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              markerStart="url(#arrowhead-bidirectional)"
            />

            {/* All elements to conclusion */}
            <line x1="390" y1="575" x2="390" y2="210" stroke="#8b5cf6" strokeWidth="3" markerEnd="url(#arrowhead)" />
          </svg>

          {/* Diagram Elements - positioned exactly like the Crossley model */}
          <div style={{ zIndex: 2, position: "relative" }}>
            {/* Lead - Top level */}
            <DiagramElement
              id="lead"
              label="Lead"
              element={analysis.elements.lead}
              style={{ top: "10px", left: "168px", minWidth: "600px" }}
            />

            {/* Position - Second level */}
            <DiagramElement
              id="position"
              label="Position"
              element={analysis.elements.position}
              style={{ top: "130px", left: "168px", minWidth: "600px" }}
            />

            {/* Claims and Counterclaim - Third level */}
            <DiagramElement
              id="claim1"
              label="Claim"
              element={analysis.elements.claims}
              style={{ top: "260px", left: "110px", minWidth: "200px" }}
            />
            <DiagramElement
              id="claim2"
              label="Claim"
              element={analysis.elements.claims}
              style={{ top: "260px", left: "400px" }}
            />
            <DiagramElement
              id="counterclaim"
              label="Counterclaim"
              element={analysis.elements.counterclaim}
              style={{ top: "260px", left: "620px", minWidth: "200px" }}
            />

            {/* Evidence blocks - Fourth level */}
            <DiagramElement
              id="evidence1"
              label="Evidence"
              element={analysis.elements.evidence}
              style={{ top: "375px", left: "65px" }}
            />
            <DiagramElement
              id="evidence2"
              label="Evidence"
              element={analysis.elements.evidence}
              style={{ top: "375px", left: "240px" }}
            />
            <DiagramElement
              id="evidence3"
              label="Evidence"
              element={analysis.elements.evidence}
              style={{ top: "375px", left: "400px" }}
            />
            <DiagramElement
              id="rebuttal"
              label="Rebuttal"
              element={analysis.elements.rebuttal}
              style={{ top: "375px", left: "570px" }}
            />
            <DiagramElement
              id="evidence4"
              label="Evidence"
              element={analysis.elements.evidence}
              style={{ top: "375px", left: "750px" }}
            />

            {/* Evidence under Rebuttal */}
            <DiagramElement
              id="evidence5"
              label="Evidence"
              element={analysis.elements.evidence}
              style={{ top: "475px", left: "570px" }}
            />

            {/* Concluding Summary - Bottom level */}
            <DiagramElement
              id="concluding"
              label="Concluding Summary"
              element={analysis.elements.conclusion}
              style={{ top: "560px", left: "300px", minWidth: "140px" }}
            />
          </div>

          {/* Legend */}
          <div
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border-2 border-purple-200"
            style={{ zIndex: 3 }}
          >
            <h4 className="font-medium mb-2 text-sm text-purple-700 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Effectiveness Legend
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-green-100 to-green-200 border border-green-400 rounded"></div>
                <span>Effective</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-yellow-100 to-yellow-200 border border-yellow-400 rounded"></div>
                <span>Adequate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-red-100 to-red-200 border border-red-400 rounded"></div>
                <span>Ineffective</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 border-2 border-gray-400 border-dashed rounded"></div>
                <span>Missing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Element Details */}
        {selectedElement && (
          <div className="mt-4">
            {(() => {
              const elementKey = selectedElement.replace(/\d+$/, "").toLowerCase()
              const elementMap: { [key: string]: keyof typeof analysis.elements } = {
                lead: "lead",
                position: "position",
                claim: "claims",
                counterclaim: "counterclaim",
                rebuttal: "rebuttal",
                evidence: "evidence",
                concluding: "conclusion",
              }
              const element = analysis.elements[elementMap[elementKey] || "lead"]

              return (
                <Alert className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                  <Info className="h-4 w-4 text-purple-600" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div>
                        <strong className="text-purple-700">
                          {selectedElement.charAt(0).toUpperCase() + selectedElement.slice(1)}:
                        </strong>{" "}
                        <Badge
                          variant={
                            element.effectiveness === "Effective"
                              ? "default"
                              : element.effectiveness === "Adequate"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {element.effectiveness}
                        </Badge>
                      </div>
                      {element.text && (
                        <div>
                          <strong className="text-purple-700">Identified Text:</strong>
                          <p className="text-sm bg-white/50 p-2 rounded mt-1">"{element.text}"</p>
                        </div>
                      )}
                      <div>
                        <strong className="text-purple-700">Feedback:</strong>
                        <p className="text-sm text-gray-700 mt-1">{element.feedback}</p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )
            })()}
          </div>
        )}

        {/* Missing Elements Summary */}
        {missingElements.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Missing Argumentative Elements ⚠️
            </h4>
            <p className="text-red-700 text-sm mb-2">
              Your essay is missing the following elements from the Crossley model:
            </p>
            <div className="flex flex-wrap gap-2">
              {missingElements.map((element) => (
                <Badge key={element} variant="destructive" className="text-xs">
                  {element.charAt(0).toUpperCase() + element.slice(1)}
                </Badge>
              ))}
            </div>
            <p className="text-red-700 text-sm mt-2">
              These missing elements are shown in grey with dashed borders in the diagram above. 💫
            </p>
          </div>
        )}

        {/* Effectiveness Summary */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-200 text-center shadow-md">
            <h4 className="font-medium text-green-800 mb-1">Effective ✨</h4>
            <p className="text-3xl font-bold text-green-600">
              {Object.values(analysis.elements).filter((e) => e.effectiveness === "Effective").length}
            </p>
            <p className="text-xs text-green-700">Strong elements</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-200 text-center shadow-md">
            <h4 className="font-medium text-yellow-800 mb-1">Adequate 💫</h4>
            <p className="text-3xl font-bold text-yellow-600">
              {Object.values(analysis.elements).filter((e) => e.effectiveness === "Adequate").length}
            </p>
            <p className="text-xs text-yellow-700">Good but improvable</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border-2 border-red-200 text-center shadow-md">
            <h4 className="font-medium text-red-800 mb-1">Ineffective ⚠️</h4>
            <p className="text-3xl font-bold text-red-600">
              {Object.values(analysis.elements).filter((e) => e.effectiveness === "Ineffective").length}
            </p>
            <p className="text-xs text-red-700">Need improvement</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border-2 border-gray-200 text-center shadow-md">
            <h4 className="font-medium text-gray-800 mb-1">Missing 🔍</h4>
            <p className="text-3xl font-bold text-gray-600">
              {Object.values(analysis.elements).filter((e) => e.effectiveness === "Missing").length}
            </p>
            <p className="text-xs text-gray-700">Not found</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
