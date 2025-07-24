// This would process the 16 annotated essays from the .xlsx file
export function processTrainingData() {
  // In a real implementation, this would:
  // 1. Read the .xlsx file with essay annotations
  // 2. Extract discourse_text, discourse_type, discourse_effectiveness columns
  // 3. Create few-shot examples for GPT prompts
  // 4. Generate training examples string

  const trainingExamples = `
Example 1:
discourse_text: "Too often in today's society people appreciate only the circumstances which immediately profit themselves and they follow the pack, never stopping to wonder, 'Is this really the person who deserves my attention?'"
discourse_type: Lead
discourse_type_num: Lead 1
discourse_effectiveness: Effective

Example 2:
discourse_text: "Online education is a good choice for those who strive to learn something new."
discourse_type: Position
discourse_type_num: Position 1
discourse_effectiveness: Adequate

Example 3:
discourse_text: "The next reason why I agree that every individual has an obligation to think seriously about important matters is because this simple task can help each person get ahead in life and be successful."
discourse_type: Claim
discourse_type_num: Claim 2
discourse_effectiveness: Effective

Example 4:
discourse_text: "For instance, the presidential debate is currently going on and in order to choose the right candidate, they must research all sides of both candidates."
discourse_type: Evidence
discourse_type_num: Evidence 1
discourse_effectiveness: Effective

Example 5:
discourse_text: "The disadvantage of being a twin may be evident during the teenage years. Privacy and sexuality become more important, and rivalry for the attention of the opposite sex and from parents come into play."
discourse_type: Counterclaim
discourse_type_num: Counterclaim 1
discourse_effectiveness: Effective

Example 6:
discourse_text: "However, the process of growing together is what makes the twins bond and understand each other at a level other relationship most often do not get to."
discourse_type: Rebuttal
discourse_type_num: Rebuttal 1
discourse_effectiveness: Effective
`

  return trainingExamples
}

// Process COCA academic corpus for lexical prevalence
export function processCOCACorpus() {
  // This would read 2016_acad.txt and 2017_acad.txt
  // and create frequency mappings for lexical prevalence calculation

  const mockFrequencyData = {
    the: 1000000,
    and: 800000,
    important: 50000,
    significant: 25000,
    sophisticated: 5000,
    nevertheless: 3000,
  }

  return mockFrequencyData
}

// Load Academic Word List (AWL)
export function loadAWL() {
  // This would load the Academic Word List from the EAP Foundation
  const awlWords = [
    "analyze",
    "approach",
    "area",
    "assess",
    "assume",
    "authority",
    "available",
    "benefit",
    "concept",
    "consistent",
    "constitutional",
    "context",
    "contract",
    "create",
    "data",
    "definition",
    "derived",
    "distribution",
    "economic",
    "environment",
    "established",
    "estimate",
    "evidence",
    "export",
    "factors",
    "financial",
    "formula",
    "function",
    "identified",
    "income",
    "indicate",
    "individual",
    "interpretation",
    "involved",
    "issues",
    "labor",
    "legal",
    "legislation",
    "major",
    "method",
    "occur",
    "percent",
    "period",
    "policy",
    "principle",
    "procedure",
    "process",
    "required",
    "research",
    "response",
    "role",
    "section",
    "sector",
    "significant",
    "similar",
    "source",
    "specific",
    "structure",
    "theory",
    "variables",
  ]

  return new Set(awlWords)
}

// Load Academic Formulaic List (AFL)
export function loadAFL() {
  // This would load the Academic Formulaic List
  const aflPhrases = [
    "as a result",
    "in addition",
    "on the other hand",
    "for example",
    "in conclusion",
    "furthermore",
    "nevertheless",
    "consequently",
    "in contrast",
    "moreover",
    "therefore",
    "however",
    "although",
    "in other words",
    "that is to say",
    "in particular",
  ]

  return new Set(aflPhrases)
}

console.log("Training data processing utilities loaded")
