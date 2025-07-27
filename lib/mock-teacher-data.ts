import type { AnalysisResult } from "@/lib/types"

export interface StudentSubmission {
  id: string
  studentName: string
  studentId: string
  submittedAt: string
  prompt: string
  essay: string
  analysis: AnalysisResult
  teacherComment?: string
  status: "pending" | "reviewed" | "graded"
  grade?: number
}

export const mockStudentSubmissions: StudentSubmission[] = [
  {
    id: "sub_001",
    studentName: "Alice Johnson",
    studentId: "st_001",
    submittedAt: "2024-01-15T10:30:00Z",
    prompt:
      "Some people believe that technology has made learning easier and more accessible, while others argue that it has made students lazy and less capable of deep thinking. Discuss both views and give your own opinion.",
    essay: `In today's digital age, the role of technology in education has become a subject of intense debate. While some argue that technological advancements have revolutionized learning by making it more accessible and engaging, others contend that it has led to intellectual laziness and superficial thinking among students.

Proponents of educational technology highlight several compelling advantages. Firstly, digital platforms have democratized access to knowledge, allowing students from remote areas to attend virtual lectures from world-renowned institutions. For instance, online courses from universities like Harvard and MIT are now available to anyone with an internet connection. Additionally, interactive learning tools such as educational apps and virtual reality simulations can make complex concepts more understandable and memorable.

However, critics raise valid concerns about technology's impact on cognitive development. They argue that the constant availability of information through search engines has made students overly dependent on external sources, reducing their ability to think critically and retain information. Furthermore, the prevalence of social media and entertainment platforms can be highly distracting, leading to shortened attention spans.

In my opinion, while technology presents certain challenges, its benefits in education far outweigh the drawbacks when used appropriately. The key lies in finding the right balance and implementing technology as a tool to enhance rather than replace traditional learning methods.

In conclusion, technology has undoubtedly transformed the educational landscape, offering unprecedented opportunities for learning and growth. However, it is crucial that educators and students alike approach these tools mindfully.`,
    analysis: {
      holisticScore: 7.5,
      confidence: "High (88%)",
      scoreRationale:
        "Strong essay with clear structure, good vocabulary range, and balanced argument presentation. Minor issues with conclusion development.",
      elements: {
        lead: {
          text: "In today's digital age, the role of technology in education has become a subject of intense debate.",
          effectiveness: "Effective",
          feedback: "Strong opening that clearly introduces the topic and sets up the debate structure.",
          indirectFeedback: "How effectively does your opening engage the reader?",
          reflectionPrompt: "Consider how this opening prepares the reader for your argument structure.",
        },
        position: {
          text: "In my opinion, while technology presents certain challenges, its benefits in education far outweigh the drawbacks when used appropriately.",
          effectiveness: "Effective",
          feedback: "Clear position statement that acknowledges both sides while taking a definitive stance.",
          indirectFeedback: "Is your position clearly stated and well-supported?",
          reflectionPrompt: "How does your position relate to the arguments you've presented?",
        },
        claims: {
          text: "Proponents of educational technology highlight several compelling advantages. Firstly, digital platforms have democratized access to knowledge",
          effectiveness: "Effective",
          feedback: "Well-structured claims with clear topic sentences and logical progression.",
          indirectFeedback: "Are your main arguments clearly identifiable?",
          reflectionPrompt: "How do your claims support your overall position?",
        },
        evidence: {
          text: "For instance, online courses from universities like Harvard and MIT are now available to anyone with an internet connection.",
          effectiveness: "Adequate",
          feedback: "Good use of specific examples, but could benefit from more varied evidence types.",
          indirectFeedback: "What types of evidence strengthen your arguments?",
          reflectionPrompt: "How effectively do your examples support your claims?",
        },
        counterclaim: {
          text: "However, critics raise valid concerns about technology's impact on cognitive development.",
          effectiveness: "Effective",
          feedback: "Strong acknowledgment of opposing viewpoint with clear transition.",
          indirectFeedback: "How well do you address opposing arguments?",
          reflectionPrompt: "Why is it important to acknowledge counterarguments?",
        },
        rebuttal: {
          text: "The key lies in finding the right balance and implementing technology as a tool to enhance rather than replace traditional learning methods.",
          effectiveness: "Adequate",
          feedback: "Reasonable rebuttal but could be more developed with specific strategies.",
          indirectFeedback: "How do you respond to opposing viewpoints?",
          reflectionPrompt: "What makes your rebuttal convincing?",
        },
        conclusion: {
          text: "In conclusion, technology has undoubtedly transformed the educational landscape, offering unprecedented opportunities for learning and growth.",
          effectiveness: "Adequate",
          feedback: "Adequate conclusion that summarizes main points but lacks strong final impact.",
          indirectFeedback: "Does your conclusion effectively wrap up your argument?",
          reflectionPrompt: "How can you make your conclusion more memorable?",
        },
      },
      linguisticMetrics: {
        lexicalDiversity: 0.68,
        academicWordCoverage: 14.2,
        lexicalPrevalence: 3.1,
        cUnitComplexity: 1.6,
        verbPhraseRatio: 1.3,
        dependentClauseRatio: 0.42,
      },
      rubricScores: {
        taskAchievement: 7.5,
        coherenceCohesion: 7.0,
        lexicalResource: 7.5,
        grammaticalRange: 8.0,
      },
      rubricFeedback: {
        taskAchievement:
          "Fully addresses the task with well-developed ideas and clear position. Good balance of both viewpoints.",
        coherenceCohesion:
          "Well-organized with clear progression. Good use of cohesive devices, though some transitions could be smoother.",
        lexicalResource: "Good range of vocabulary with appropriate academic language. Some repetition of key terms.",
        grammaticalRange: "Wide range of structures used accurately. Complex sentences handled well with minor errors.",
      },
      naturalLanguageSummary:
        "This is a well-structured argumentative essay that effectively addresses the task requirements. The writer demonstrates good command of English with varied vocabulary and complex sentence structures. The argument is balanced and logical, though the conclusion could be strengthened.",
      recommendations: [
        "Develop the conclusion with a stronger final statement or call to action",
        "Vary evidence types beyond just examples (statistics, expert opinions)",
        "Strengthen the rebuttal with more specific counterarguments",
      ],
    },
    teacherComment:
      "Excellent work, Alice! Your essay shows strong analytical thinking and good structure. Focus on developing your conclusion more fully in future essays.",
    status: "reviewed",
    grade: 7.5,
  },
  {
    id: "sub_002",
    studentName: "Bob Smith",
    studentId: "st_002",
    submittedAt: "2024-01-15T14:45:00Z",
    prompt:
      "Some people believe that technology has made learning easier and more accessible, while others argue that it has made students lazy and less capable of deep thinking. Discuss both views and give your own opinion.",
    essay: `Technology in education is a hot topic nowadays. Many people think it's good but others think it's bad.

First, technology makes learning easier. Students can use computers and internet to find information quickly. They can also watch videos and use apps to learn. This is good because it saves time and makes learning fun.

But some people think technology makes students lazy. They say students don't think for themselves anymore because they just google everything. Also, students get distracted by social media and games when they should be studying.

I think technology is mostly good for education. It helps students learn better and faster. But teachers need to make sure students use it properly.

In conclusion, technology has both good and bad points in education. We should use it wisely.`,
    analysis: {
      holisticScore: 5.0,
      confidence: "High (92%)",
      scoreRationale:
        "Basic essay structure present but lacks development, sophisticated vocabulary, and detailed argumentation. Ideas are relevant but underdeveloped.",
      elements: {
        lead: {
          text: "Technology in education is a hot topic nowadays.",
          effectiveness: "Adequate",
          feedback: "Simple opening that introduces the topic but lacks engagement and sophistication.",
          indirectFeedback: "How can you make your opening more engaging?",
          reflectionPrompt: "What makes an introduction compelling to readers?",
        },
        position: {
          text: "I think technology is mostly good for education.",
          effectiveness: "Adequate",
          feedback: "Clear but simple position statement. Could be more sophisticated and nuanced.",
          indirectFeedback: "Is your position clearly stated?",
          reflectionPrompt: "How can you express your opinion more academically?",
        },
        claims: {
          text: "First, technology makes learning easier. Students can use computers and internet to find information quickly.",
          effectiveness: "Adequate",
          feedback: "Basic claims present but lack depth and sophisticated development.",
          indirectFeedback: "Are your arguments well-developed?",
          reflectionPrompt: "How can you strengthen your main arguments?",
        },
        evidence: {
          text: "They can also watch videos and use apps to learn.",
          effectiveness: "Ineffective",
          feedback: "Very basic examples without specific details or convincing support.",
          indirectFeedback: "What evidence would make your arguments stronger?",
          reflectionPrompt: "How do strong examples differ from weak ones?",
        },
        counterclaim: {
          text: "But some people think technology makes students lazy.",
          effectiveness: "Adequate",
          feedback: "Acknowledges opposing view but lacks detailed explanation.",
          indirectFeedback: "How thoroughly do you explore opposing arguments?",
          reflectionPrompt: "Why is it important to fully understand counterarguments?",
        },
        rebuttal: {
          text: "But teachers need to make sure students use it properly.",
          effectiveness: "Ineffective",
          feedback: "Weak rebuttal that doesn't effectively counter the opposing arguments.",
          indirectFeedback: "How do you address opposing viewpoints?",
          reflectionPrompt: "What makes a rebuttal convincing?",
        },
        conclusion: {
          text: "In conclusion, technology has both good and bad points in education. We should use it wisely.",
          effectiveness: "Adequate",
          feedback: "Basic conclusion that restates main points but lacks sophistication and impact.",
          indirectFeedback: "Does your conclusion effectively summarize your argument?",
          reflectionPrompt: "How can you make your conclusion more powerful?",
        },
      },
      linguisticMetrics: {
        lexicalDiversity: 0.45,
        academicWordCoverage: 6.8,
        lexicalPrevalence: 4.8,
        cUnitComplexity: 1.1,
        verbPhraseRatio: 1.0,
        dependentClauseRatio: 0.18,
      },
      rubricScores: {
        taskAchievement: 5.0,
        coherenceCohesion: 5.5,
        lexicalResource: 4.5,
        grammaticalRange: 5.0,
      },
      rubricFeedback: {
        taskAchievement:
          "Addresses the task but with limited development. Ideas are relevant but lack depth and sophistication.",
        coherenceCohesion: "Basic organization present with simple linking words. Progression is clear but mechanical.",
        lexicalResource:
          "Limited vocabulary range with repetition. Basic word choice throughout with few academic terms.",
        grammaticalRange:
          "Simple sentence structures predominate. Some complex sentences attempted but with limited range.",
      },
      naturalLanguageSummary:
        "This essay demonstrates a basic understanding of the task requirements but lacks the development and sophistication expected at higher band levels. The writer uses simple vocabulary and sentence structures throughout.",
      recommendations: [
        "Develop ideas more fully with detailed explanations and examples",
        "Use more sophisticated vocabulary and academic language",
        "Vary sentence structures with more complex grammatical forms",
      ],
    },
    status: "pending",
  },
  {
    id: "sub_003",
    studentName: "Carol Davis",
    studentId: "st_003",
    submittedAt: "2024-01-14T16:20:00Z",
    prompt:
      "In many countries, people are working longer hours and have less time for family and leisure activities. What are the causes of this trend? What solutions can you suggest to improve work-life balance?",
    essay: `The phenomenon of extended working hours has become increasingly prevalent in contemporary society, significantly impacting individuals' personal lives and overall well-being. This essay will examine the underlying causes of this trend and propose viable solutions to restore a healthier work-life equilibrium.

Several factors contribute to the extension of working hours in modern workplaces. Economic pressures represent the primary catalyst, as companies strive to maximize productivity while minimizing operational costs in an increasingly competitive global market. This often translates to expecting greater output from existing employees rather than expanding the workforce. Furthermore, technological advancement, while offering numerous conveniences, has inadvertently blurred the boundaries between professional and personal life. Smartphones and laptops enable constant connectivity, making it challenging for workers to disconnect from their professional responsibilities even during supposed leisure time.

The ramifications of this trend are far-reaching and concerning. Prolonged working hours contribute to elevated stress levels, burnout, and various health complications, including cardiovascular disease and mental health disorders. Family relationships suffer as parents have insufficient time to spend with their children, potentially affecting child development and family cohesion. Additionally, reduced leisure time means fewer opportunities for personal growth, hobbies, and community engagement, which are essential for overall life satisfaction.

To address these challenges, several solutions could be implemented. Governments should introduce legislation establishing maximum working hour limits and ensuring adequate rest periods, similar to policies already implemented in several European nations. Companies must be encouraged to adopt flexible working arrangements, including remote work options and compressed work weeks, which can enhance efficiency while providing employees greater control over their schedules. Moreover, organizations need to cultivate a culture that respects personal time and discourages after-hours communication except in genuine emergencies.

In conclusion, the trend toward extended working hours stems from economic pressures and technological developments but can be mitigated through legislative action, corporate policy changes, and cultural shifts that prioritize employee well-being alongside productivity.`,
    analysis: {
      holisticScore: 8.0,
      confidence: "High (91%)",
      scoreRationale:
        "Excellent essay with sophisticated vocabulary, complex structures, and comprehensive task response. Minor areas for improvement in conclusion impact.",
      elements: {
        lead: {
          text: "The phenomenon of extended working hours has become increasingly prevalent in contemporary society, significantly impacting individuals' personal lives and overall well-being.",
          effectiveness: "Effective",
          feedback: "Sophisticated opening with advanced vocabulary and clear topic introduction.",
          indirectFeedback: "How effectively does your opening establish the essay's scope?",
          reflectionPrompt: "What makes this introduction academically strong?",
        },
        position: {
          text: "This essay will examine the underlying causes of this trend and propose viable solutions to restore a healthier work-life equilibrium.",
          effectiveness: "Effective",
          feedback: "Clear thesis statement that outlines the essay structure and approach.",
          indirectFeedback: "Does your thesis clearly indicate your essay's direction?",
          reflectionPrompt: "How does a strong thesis guide your reader?",
        },
        claims: {
          text: "Several factors contribute to the extension of working hours in modern workplaces. Economic pressures represent the primary catalyst",
          effectiveness: "Effective",
          feedback: "Well-developed claims with sophisticated language and clear logical progression.",
          indirectFeedback: "Are your main arguments clearly structured?",
          reflectionPrompt: "How do you ensure logical flow between ideas?",
        },
        evidence: {
          text: "This often translates to expecting greater output from existing employees rather than expanding the workforce.",
          effectiveness: "Effective",
          feedback: "Strong supporting evidence with specific explanations and real-world applications.",
          indirectFeedback: "How well do your examples support your arguments?",
          reflectionPrompt: "What makes evidence convincing in academic writing?",
        },
        counterclaim: {
          text: "",
          effectiveness: "Missing",
          feedback: "This is a cause-solution essay type, so counterclaims are not required for this task format.",
          indirectFeedback: "Does this essay type require opposing viewpoints?",
          reflectionPrompt: "How do different essay types have different structural requirements?",
        },
        rebuttal: {
          text: "",
          effectiveness: "Missing",
          feedback: "Not applicable for this cause-solution essay format.",
          indirectFeedback: "Is rebuttal necessary for all essay types?",
          reflectionPrompt: "How do task requirements determine essay structure?",
        },
        conclusion: {
          text: "In conclusion, the trend toward extended working hours stems from economic pressures and technological developments but can be mitigated through legislative action, corporate policy changes, and cultural shifts that prioritize employee well-being alongside productivity.",
          effectiveness: "Effective",
          feedback: "Strong conclusion that effectively summarizes causes and solutions with sophisticated language.",
          indirectFeedback: "Does your conclusion effectively tie together your main points?",
          reflectionPrompt: "How can you make your conclusion memorable and impactful?",
        },
      },
      linguisticMetrics: {
        lexicalDiversity: 0.72,
        academicWordCoverage: 18.5,
        lexicalPrevalence: 2.8,
        cUnitComplexity: 1.8,
        verbPhraseRatio: 1.5,
        dependentClauseRatio: 0.48,
      },
      rubricScores: {
        taskAchievement: 8.0,
        coherenceCohesion: 8.0,
        lexicalResource: 8.0,
        grammaticalRange: 8.0,
      },
      rubricFeedback: {
        taskAchievement:
          "Fully addresses all parts of the task with well-developed causes and solutions. Ideas are extended and supported effectively.",
        coherenceCohesion:
          "Excellent organization with clear progression throughout. Skillful use of cohesive devices without mechanical overuse.",
        lexicalResource:
          "Wide range of vocabulary used naturally and appropriately. Good use of academic language with precise word choice.",
        grammaticalRange:
          "Wide range of structures used flexibly and accurately. Complex sentences handled with confidence.",
      },
      naturalLanguageSummary:
        "This is an excellent essay that demonstrates sophisticated language use and comprehensive task response. The writer shows strong command of academic English with varied vocabulary and complex sentence structures. The argument is well-developed and logically structured.",
      recommendations: [
        "Consider adding a more impactful final statement to strengthen conclusion",
        "Include more specific statistical data to support arguments",
        "Explore additional innovative solutions beyond traditional approaches",
      ],
    },
    teacherComment:
      "Outstanding work, Carol! This essay demonstrates excellent academic writing skills. Your vocabulary and sentence structures are sophisticated, and you've addressed the task comprehensively.",
    status: "reviewed",
    grade: 8.0,
  },
]

export const getSubmissionsByClass = (classId: string) => {
  return mockStudentSubmissions
}

export const updateTeacherComment = (submissionId: string, comment: string) => {
  const submission = mockStudentSubmissions.find((s) => s.id === submissionId)
  if (submission) {
    submission.teacherComment = comment
    submission.status = "reviewed"
  }
}

export const updateSubmissionGrade = (submissionId: string, grade: number) => {
  const submission = mockStudentSubmissions.find((s) => s.id === submissionId)
  if (submission) {
    submission.grade = grade
    submission.status = "graded"
  }
}
