export interface ArgumentElement {
  text: string
  effectiveness: "Effective" | "Adequate" | "Ineffective" | "Missing"
  feedback: string
  indirectFeedback?: string
  reflectionPrompt?: string
}

export interface LinguisticMetrics {
  lexicalDiversity: number
  academicWordCoverage: number
  lexicalPrevalence: number
  cUnitComplexity: number
  verbPhraseRatio: number
  dependentClauseRatio: number
}

export interface RubricScores {
  taskAchievement: number
  coherenceCohesion: number
  lexicalResource: number
  grammaticalRange: number
}

export interface RubricFeedback {
  taskAchievement: string
  coherenceCohesion: string
  lexicalResource: string
  grammaticalRange: string
}

export interface AnalysisResult {
  holisticScore: number
  confidence: string
  scoreRationale: string
  elements: {
    lead: ArgumentElement
    position: ArgumentElement
    claims: ArgumentElement[]
    evidence: ArgumentElement[]
    counterclaim: ArgumentElement
    rebuttal: ArgumentElement
    conclusion: ArgumentElement
  }
  linguisticMetrics: LinguisticMetrics
  rubricScores: RubricScores
  rubricFeedback: RubricFeedback
  naturalLanguageSummary: string
  recommendations: string[]
}
