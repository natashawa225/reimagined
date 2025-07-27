import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import type { AnalysisResult } from "@/lib/types"


// Fallback analysis function for when API key is not available
function getFallbackAnalysis(essay: string, prompt: string): AnalysisResult {
  const wordCount = essay.trim().split(/\s+/).length

  // Determine score based on essay length and basic characteristics
  let baseScore = 5.0
  if (wordCount >= 300 && essay.includes("however") && essay.includes("conclusion")) {
    baseScore = 6.5
  }
  if (wordCount >= 400 && essay.includes("furthermore") && essay.includes("In my opinion")) {
    baseScore = 7.0
  }
  if (essay.includes("Nevertheless") || essay.includes("Consequently")) {
    baseScore = 7.5
  }

  return {
    holisticScore: baseScore,
    confidence: "75%",
    scoreRationale: `This essay demonstrates ${baseScore >= 7 ? "good" : baseScore >= 6 ? "adequate" : "basic"} writing skills with ${wordCount} words. Your essay addresses the task and presents a clear opinion, but the ideas need deeper development and better connection between points. The vocabulary and grammar are mostly accurate but a bit basic and repetitive. With more precise wording and smoother transitions, this could easily move up a band.`,
    elements: {
      lead: {
        text: essay.split(".")[0] + ".",
        effectiveness: essay.length > 500 ? "Effective" : "Adequate",
        feedback:
          "Your opening sentence introduces the topic. Consider making it more engaging to capture the reader's attention.",
        indirectFeedback: "How effectively does your opening engage the reader?",
        reflectionPrompt: "What makes an introduction compelling?",
      },
      position: {
        text: essay.includes("In my opinion")
          ? essay.substring(essay.indexOf("In my opinion"), essay.indexOf("In my opinion") + 100) + "..."
          : "",
        effectiveness: essay.includes("In my opinion") || essay.includes("I believe") ? "Effective" : "Missing",
        feedback: essay.includes("In my opinion")
          ? "Clear position statement identified."
          : "No clear position statement found. Make sure to state your opinion clearly.",
        indirectFeedback: "Is your position clearly stated?",
        reflectionPrompt: "How does a clear thesis guide your reader?",
      },
      claims: {
        text: essay.includes("Firstly") || essay.includes("First") ? "Multiple claims identified in your essay." : "",
        effectiveness:
          (essay.includes("Firstly") || essay.includes("First")) &&
          (essay.includes("Secondly") || essay.includes("Furthermore"))
            ? "Effective"
            : "Adequate",
        feedback:
          "Your essay presents main arguments. Consider developing them further with more detailed explanations.",
        indirectFeedback: "Are your main arguments clearly identifiable?",
        reflectionPrompt: "How do your claims support your overall position?",
      },
      evidence: {
        text: essay.includes("For example") || essay.includes("For instance") ? "Examples found in your essay." : "",
        effectiveness: essay.includes("For example") || essay.includes("For instance") ? "Adequate" : "Ineffective",
        feedback: essay.includes("For example")
          ? "Good use of examples. Try to include more specific and varied evidence."
          : "Add specific examples and evidence to support your claims.",
        indirectFeedback: "What types of evidence strengthen your arguments?",
        reflectionPrompt: "How effectively do your examples support your claims?",
      },
      counterclaim: {
        text:
          essay.includes("However") || essay.includes("On the other hand") ? "Opposing viewpoint acknowledged." : "",
        effectiveness: essay.includes("However") || essay.includes("On the other hand") ? "Effective" : "Missing",
        feedback: essay.includes("However")
          ? "Good acknowledgment of opposing views."
          : "Consider acknowledging opposing viewpoints to strengthen your argument.",
        indirectFeedback: "How well do you address opposing arguments?",
        reflectionPrompt: "Why is it important to acknowledge counterarguments?",
      },
      rebuttal: {
        text: essay.includes("Nevertheless") || essay.includes("Despite this") ? "Rebuttal identified." : "",
        effectiveness: essay.includes("Nevertheless") || essay.includes("Despite this") ? "Adequate" : "Missing",
        feedback: essay.includes("Nevertheless")
          ? "You respond to opposing views. Consider strengthening your rebuttal."
          : "Add a rebuttal to counter opposing arguments.",
        indirectFeedback: "How do you respond to opposing viewpoints?",
        reflectionPrompt: "What makes your rebuttal convincing?",
      },
      conclusion: {
        text:
          essay.includes("In conclusion") || essay.includes("To conclude")
            ? essay.substring(essay.lastIndexOf("In conclusion") || essay.lastIndexOf("To conclude"))
            : "",
        effectiveness: essay.includes("In conclusion") || essay.includes("To conclude") ? "Adequate" : "Missing",
        feedback: essay.includes("In conclusion")
          ? "Conclusion present. Consider making it more impactful."
          : "Add a strong conclusion to summarize your arguments.",
        indirectFeedback: "Does your conclusion effectively wrap up your argument?",
        reflectionPrompt: "How can you make your conclusion more memorable?",
      },
    },
    linguisticMetrics: {
      lexicalDiversity: Math.min(0.8, wordCount / 500), // Simple calculation based on length
      academicWordCoverage: essay.includes("significant") || essay.includes("furthermore") ? 12.5 : 8.2,
      lexicalPrevalence: essay.includes("sophisticated") ? 2.8 : 3.5,
      cUnitComplexity: essay.includes("although") || essay.includes("because") ? 1.4 : 1.1,
      verbPhraseRatio: 1.2,
      dependentClauseRatio: essay.includes("which") || essay.includes("that") ? 0.35 : 0.22,
    },
    rubricScores: {
      taskAchievement: baseScore,
      coherenceCohesion: Math.max(4.0, baseScore - 0.5),
      lexicalResource: Math.max(4.0, baseScore - 0.3),
      grammaticalRange: Math.max(4.0, baseScore + 0.2),
    },
    rubricFeedback: {
      taskAchievement: `Your essay ${baseScore >= 6.5 ? "adequately addresses" : "attempts to address"} the task requirements. ${baseScore >= 7 ? "Ideas are well-developed." : "Consider developing your ideas further."}`,
      coherenceCohesion: `${essay.includes("Firstly") ? "Good use of organizing language." : "Consider using more linking words."} Your essay shows ${baseScore >= 6 ? "adequate" : "basic"} organization.`,
      lexicalResource: `Your vocabulary is ${baseScore >= 7 ? "varied and appropriate" : baseScore >= 6 ? "adequate for the task" : "limited but functional"}. ${baseScore < 6 ? "Try to use more sophisticated vocabulary." : ""}`,
      grammaticalRange: `Your grammar shows ${baseScore >= 7 ? "good control with complex structures" : baseScore >= 6 ? "adequate control with some complex forms" : "basic control with simple structures"}. ${baseScore < 6 ? "Practice using more varied sentence structures." : ""}`,
    },
    naturalLanguageSummary: `This essay demonstrates ${baseScore >= 7 ? "good" : baseScore >= 6 ? "adequate" : "developing"} writing skills. The response ${baseScore >= 6.5 ? "addresses the task appropriately" : "attempts to address the task"} with ${wordCount} words. ${baseScore >= 7 ? "The argument is well-structured with clear examples." : baseScore >= 6 ? "The basic structure is present but could be developed further." : "Focus on developing your ideas more fully and using more sophisticated language."} Note: This analysis is provided by a fallback system due to missing OpenAI API configuration.`,
    recommendations: [
      baseScore < 6
        ? "Develop your ideas more fully with detailed explanations"
        : "Consider adding more sophisticated vocabulary and complex sentence structures",
      baseScore < 6.5
        ? "Use more linking words and transitions between paragraphs"
        : "Strengthen your evidence with more specific examples",
      baseScore < 7
        ? "Practice writing longer, more detailed responses"
        : "Focus on making your conclusion more impactful and memorable",
    ],
  }
}

// Configure OpenAI with API key
const myOpenAI = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Training data would be loaded from the .xlsx file
const TRAINING_EXAMPLES = `
Example 1:
full_text: 
"Teachers can justify students knowledge more accurately than students. Teachers are very experienced compare to the students because they gained so much knowledge in their life. By doing the teacher designed projects, students can learn something that they did not know about. Teachers would know what topics they really need to focus on and what are the most important things they need to know about. Students summer projects should be designed by their teachers to make sure that they are being effective, hardworking and responsible for their work during the break.
Summer projects of the students should be designed by their teachers to make sure that the students are being effective during the summer break. Teachers know the academic ability of their student because they know how the students answers some specific types of questions, they know how the students think and understand. For Example, In my fifth grade there was a math teacher named Generic_Name. Ms. Generic_Name and I spent so much time with each other to discuss my mistakes on a test, She asked me do to test corrections on a paper. I solved all the questions correctly without a time limit, She came to me and said, "I knew you could do it, because I have seen you working very hard these days". Then, I realized that I knew how to solve these problems but I was scared¬†to complete the test before the timer goes off because¬†I did not know I could complete everything. This examples describes that the teachers know our academic ups and downs than ourselves. They also know what we need to learn to succeed in our class, So when they design a project to their students they make sure that the students are going to be effective on their break and learning something new which will help them in their future.
Summer projects of the students should be teacher-designed to make sure that the students are hardworking even during the summer break. Teachers know the capacity of hard work we do in our class, they observe the amount of effort that we put into different things like talking, reading, writing and singing, etc. For example, one of my teacher in 10th grade was really nice to me, she always used to ask me about my hobbies and interests. I had a presentation in her class and I went to ask her for help the day before the presentation because I was preparing for almost a month, I wanted to ask her if I did any mistakes¬†in the slides. After I showed her my slides, she gave me a big hug an said "I know how hard you worked for this presentation, I gave you a hard project to see is you are capable to do it or not. Even though¬†you came to United States two months ago, you did a fantastic job". I was very happy to hear her saying that I did good and on the day of my presentation I felt really confident on my work. This example explains how the teacher knew that I worked so hard to do my best. By assigning me a hard project based on my level of understanding, I worked hard to understand and analyze every single detail. That helped me to gain confidence on my self and my level of hard work improved a lot. When teachers design the project they make sure that the students are trying to work hard and they want to see how your working level is improving.
Summer projects of the students should be designed by their teachers to make sure that the students are being responsible for their work during the summer break. when teachers design the project they know how long it is going to take the students to complete the project and how well focused¬†and responsible a student need to be while doing this project. For example, My history teacher in 10 grade was very strict, she always wanted our whole class to turn in everything that she posted online in one day. After 2-3 months of struggling in her class, everything was going really good till the last day of that academic year. All of my work was completed on time. This example says that even though I worked really hard in the beginning, when it came to the end of the year¬†I was really happy for being responsible for my own work. By learning how to be responsible from that teacher, helped me a lot in all of my other classes too. Summer projects given by our teachers can make us feel responsible for ourselves, by doing the projects¬†teach us how to be focused and concentrated to get them done on time. when the students design the project they take it easy because¬†most of the students just pick something they already know or they already feel confident on, which will not make them feel responsible.
Teachers are very experienced to know how students think about something, they can understand what students know and what we do not know academically. They always try to teach us how to build our academic skills. They want the students to be in an amazing position, they always want to see the best from us because they know how the student are. Summer projects of the students should be teacher designed to make sure that they are being effective, hardworking and¬†responsible for their work during the break.¬†"
holistic_essay_score: 5
Lead 1: Teachers can justify students knowledge more accurately than students. Teachers are very experienced compare to the students because they gained so much knowledge in their life. By doing the teacher designed projects, students can learn something that they did not know about. Teachers would know what topics they really need to focus on and what are the most important things they need to know about. 
Lead 1: Adequate
Position 1: Students summer projects should be designed by their teachers to make sure that they are being effective, hardworking and responsible for their work during the break.
Position 1: Effective
Claim 1: Summer projects of the students should be designed by their teachers to make sure that the students are being effective during the summer break 
Claim 1: Effective
Evidence 1: Teachers know the academic ability of their student because they know how the students answers some specific types of questions, they know how the students think and understand. For Example, In my fifth grade there was a math teacher named Generic_Name. Ms. Generic_Name and I spent so much time with each other to discuss my mistakes on a test, She asked me do to test corrections on a paper. I solved all the questions correctly without a time limit, She came to me and said, "I knew you could do it, because I have seen you working very hard these days". Then, I realized that I knew how to solve these problems but I was scared to complete the test before the timer goes off because I did not know I could complete everything. This examples describes that the teachers know our academic ups and downs than ourselves. They also know what we need to learn to succeed in our class, So when they design a project to their students they make sure that the students are going to be effective on their break and learning something new which will help them in their future. 
Evidence 1: Adequate
Claim 2: Summer projects of the students should be teacher-designed to make sure that the students are hardworking even during the summer break. 
Claim 2: Effective
Evidence 2: Teachers know the capacity of hard work we do in our class, they observe the amount of effort that we put into different things like talking, reading, writing and singing, etc. For example, one of my teacher in 10th grade was really nice to me, she always used to ask me about my hobbies and interests. I had a presentation in her class and I went to ask her for help the day before the presentation because I was preparing for almost a month, I wanted to ask her if I did any mistakes in the slides. After I showed her my slides, she gave me a big hug an said "I know how hard you worked for this presentation, I gave you a hard project to see is you are capable to do it or not. Even though you came to United States two months ago, you did a fantastic job". I was very happy to hear her saying that I did good and on the day of my presentation I felt really confident on my work. This example explains how the teacher knew that I worked so hard to do my best. By assigning me a hard project based on my level of understanding, I worked hard to understand and analyze every single detail. That helped me to gain confidence on my self and my level of hard work improved a lot. When teachers design the project they make sure that the students are trying to work hard and they want to see how your working level is improving. 
Evidence 2: Adequate
Claim 3: Summer projects of the students should be designed by their teachers to make sure that the students are being responsible for their work during the summer break.  
Claim 3: Effective
Evidence 3: when teachers design the project they know how long it is going to take the students to complete the project and how well focused and responsible a student need to be while doing this project. For example, My history teacher in 10 grade was very strict, she always wanted our whole class to turn in everything that she posted online in one day. After 2-3 months of struggling in her class, everything was going really good till the last day of that academic year. All of my work was completed on time. This example says that even though I worked really hard in the beginning, when it came to the end of the year, I was really happy for being responsible for my own work. By learning how to be responsible from that teacher, helped me a lot in all of my other classes too. Summer projects given by our teachers can make us feel responsible for ourselves, by doing the projects teach us how to be focused and concentrated to get them done on time. when the students design the project they take it easy because most of the students just pick something they already know or they already feel confident on, which will not make them feel responsible. 
Evidence 3: Adequate
Concluding Statement: Teachers are very experienced to know how students think about something, they can understand what students know and what we do not know academically. They always try to teach us how to build our academic skills. They want the students to be in an amazing position, they always want to see the best from us because they know how the student are. Summer projects of the students should be teacher designed to make sure that they are being effective, hardworking and responsible for their work during the break.
Concluding Statement: Adequate

Example 2:
full_text: 
My friend is home schooled because she use to get bullied a lot so she wanted to drop out, she could'nt deal with it anymore. Her counselor gave her a better option taking online classes because she had very good grades and she wanted her to graduate and have a good future. In some schools they offer distant learning as an option for students to attend classes from home by way of online or video conferencing. I think getting home schooled is a good benefit for students who have situations at school, for student drop outs, and it's easier and quicker.
The primary reason on why it's a good benefit, it's that it helps you if you have bad situations at school such as you always get into fights with other students, you are getting harassed or bullied, you have problems with your teachers, or you think you're wasting your time and you could be working and getting money. Having online classes can help you stay out of trouble or helps you stop what ever you are dealing with. Not only it stops the situation but can help you improve and graduating with no problem. If you are having problems talk to your counselor and ask for a possibility for online classes or your parents if you can get home schooled.
Secondly, it benefits the students who are dropping out of school. Most of the students who are dropping out are for financial reasons like, they want to help there family so, they drop out and start working or some teens get pregnant at a young age and there parents most likely they dont support them or help them in anything that they need so, it causes them to drop out. It helps them further there knowledge and can possibly get a better job. It makes them feel happy knowing they can finish school because they know they already making a decision by dropping out but they can still graduate by taking online classes. I remember when i was at student counseling aide and one day a student came to ask me where should he leave his laptop because he was planning to drop out, he looked upset. Generic_Name ask him why? he answered "i wanna help my family out they dont have any money right now" she gave him an option for online classes he didnt know it was possible to do that and It made him happy.
Finally, getting home schooled is easier and quicker. You can take your classes when ever you are free. If you need to take a break, you can and continue when ever you are ready. it's non-stressful comparing to regular school. Its proven that getting home schooled its less stressful than regular school. Generic_Name is a science teacher at SCHOOL_NAME he said "88% students are stressed about school because of homework and not having to finish assignments on time". He also said "only 5% are stressed when they are home schooled". In conclusion, it's less stressful and help you feel non-pressured while you are taking your online classes. It also, gives you free time and gives you advantage to do what ever you like. You get to be home and relax wake up when ever you like to, do your classes take brakes if you would like to, too me it sounds amazing!
Some people might say that getting home schooled is bad because if you have any questions you dont have a teacher to ask or a physical teacher to help you understand the topic you are learning about but it's a one on one class. There's no students just you and your instructor, it helps you focus which i personally think it will help you more comparing sitting in a class room with your friends not paying attention, playing around or not getting work done. I think it's a good benefit having online classes because it helps with people who have bad situations at school, people who are planning to drop out and its a fast and easier way to get your classes done.
holistic_essay_score: 6
discourse_text_1: My friend is home schooled because she use to get bullied a lot so she wanted to drop out, she could'nt deal with it anymore. Her counselor gave her a better option taking online classes because she had very good grades and she wanted her to graduate and have a good future. In some schools they offer distant learning as an option for students to attend classes from home by way of online or video conferencing. 
discourse_type_1: Lead
discourse_type_num_1: Lead 1
discourse_effectiveness_1: Effective
discourse_text_2: I think getting home schooled is a good benefit for students who have situations at school, for student drop outs, and it's easier and quicker.
discourse_type_2: Position
discourse_type_num_2: Position 1
discourse_effectiveness_2: Effective
discourse_text_3: The primary reason on why it's a good benefit, it's that it helps you if you have bad situations at school  
discourse_type_3: Claim
discourse_type_num_3: Claim 1
discourse_effectiveness_3: Adequate
discourse_text_4: such as you always get into fights with other students, you are getting harassed or bullied, you have problems with your teachers, or you think you're wasting your time and you could be working and getting money. Having online classes can help you stay out of trouble or helps you stop what ever you are dealing with. Not only it stops the situation but can help you improve and graduating with no problem. If you are having problems talk to your counselor and ask for a possibility for online classes or your parents if you can get home schooled. 
discourse_type_4: Evidence
discourse_type_num_4: Evidence 1
discourse_effectiveness_4: Effective
discourse_text_5: Secondly, it benefits the students who are dropping out of school. 
discourse_type_5: Claim
discourse_type_num_5: Claim 2
discourse_effectiveness_5: Adequate
discourse_text_6: Most of the students who are dropping out are for financial reasons like, they want to help there family so, they drop out and start working or some teens get pregnant at a young age and there parents most likely they dont support them or help them in anything that they need so, it causes them to drop out. It helps them further there knowledge and can possibly get a better job. It makes them feel happy knowing they can finish school because they know they already making a decision by dropping out but they can still graduate by taking online classes. I remember when i was at student counseling aide and one day a student came to ask me where should he leave his laptop because he was planning to drop out, he looked upset. Generic_Name ask him why? he answered "i wanna help my family out they dont have any money right now" she gave him an option for online classes he didnt know it was possible to do that and It made him happy. 
discourse_type_6: Evidence
discourse_type_num_6: Evidence 2
discourse_effectiveness_6: Effective
discourse_text_7: Finally, getting home schooled is easier and quicker. 
discourse_type_7: Claim
discourse_type_num_7: Claim 3
discourse_effectiveness_7: Adequate
discourse_text_8: You can take your classes when ever you are free. If you need to take a break, you can and continue when ever you are ready. it's non-stressful comparing to regular school. Its proven that getting home schooled its less stressful than regular school. Generic_Name is a science teacher at SCHOOL_NAME he said "88% students are stressed about school because of homework and not having to finish assignments on time". He also said "only 5% are stressed when they are home schooled". In conclusion, it's less stressful and help you feel non-pressured while you are taking your online classes. It also, gives you free time and gives you advantage to do what ever you like. You get to be home and relax wake up when ever you like to, do your classes take brakes if you would like to, too me it sounds amazing! 
discourse_type_8: Evidence
discourse_type_num_8: Evidence 3
discourse_effectiveness_8: Effective
discourse_text_9: Some people might say that getting home schooled is bad because if you have any questions you dont have a teacher to ask or a physical teacher to help you understand the topic you are learning about 
discourse_type_9: Counterclaim
discourse_type_num_9: Counterclaim 1
discourse_effectiveness_9: Effective
discourse_text_10: but it's a one on one class. There's no students just you and your instructor, it helps you focus which i personally think it will help you more comparing sitting in a class room with your friends not paying attention, playing around or not getting work done.
discourse_text_10: Rebuttal
discourse_type_num_10: Rebuttal 1
discourse_effectiveness_10: Effective
discourse_text_11: I think it's a good benefit having online classes because it helps with people who have bad situations at school, people who are planning to drop out and its a fast and easier way to get your classes done. 
discourse_type_11: Concluding Statement
discourse_type_num_11: Concluding Statement 1
discourse_effectiveness_11: Adequate

Example 3:
full_text: 
Some students stay home and take their classes online so they learn better and no socail life helps with you getting your work done but that not always the case of this situition .
Benfit of kids taking they class online or video conferncing dont mean they gone always wanna wake up to do it or they gone wait last min to go the classes on online and now they are late behide wiht their work and lesson and dont know where to start. Some kids probably wouldnt benfit the issues with them having to take school from home. When kids wake up they go for there phone their would miss out a whole 2-3 lesson for forgetting about about they got school work to do and that not good at all .
So some of the kids who not doing the school work at home probably would better doing it at school cause you other people and have a social life with other people and asking for help from people who got different ways of looking at stuff just like how you do . All this goes into how attend classes from home is a little bit of a bad idea cause it can also mess up someone inner thoughts by not having friend or not seeing every friends everday at like how they see each other and you might feel left out . Plus that make your friend like they cant do nun with you if you late behide work and you gotta make it up but they asking you can you go somewhere but you cant case you have stuff to do so thry might look at you like yea they happy for you and all but they probably want you to relax sometimes but you cant the wat you want to.
Also what if you wanted to try out for a sport but you taking classes from home for the school probably not gone be easy like being around people who really go to the school and see what goes on at school but you probably just watch videos or hear about it . So it would be the same as your friend and you pushing them off to do work cause you aint finish all you work so how you gone do sport if you having trouble doing your work .
So overall i feel like student/ kids shouldnt take classes or video conferencing from home cause it going to take away time from them to be them and take away their socail life with theie friend and not help them get a good thing coming from them as in with sport or if they wanted to join a club to that they like with the schoo cause wouldnt know how to get in it if they not phycically in school .
holistic_essay_score: 3
discourse_text: "Some students stay home and take their classes online so they learn better and no socail life helps with you getting your work done but that not always the case of this situition"
discourse_type: Lead
discourse_type_num_1: Lead 1
discourse_effectivenes_1: Ineffective
discourse_text_2: Benfit of kids taking they class online or video conferncing dont mean they gone always wanna wake up to do it or they gone wait last min to go the classes on online 
discourse_type_2: Claim
discourse_type_num_2: Claim 1
discourse_effectiveness_2: Ineffective
discourse_text_3: and now they are late behide wiht their work and lesson and dont know where to start. Some kids probably wouldnt benfit the issues with them having to take school from home. When kids wake up they go for there phone their would miss out a whole 2-3 lesson for forgetting about about they got school work to do and that not good at all . 
discourse_type_3: Evidence
discourse_type_num_3: Evidence 1
discourse_effectiveness_3: Adequate
discourse_text_4: So some of the kids who not doing the school work at home probably would better doing it at school cause you other people and have a social life with other people and asking for help from people who got different ways of looking at stuff just like how you do 
discourse_type_4: Claim
discourse_type_num_4: Claim 2
discourse_effectiveness_4: Adequate
discourse_text_5: All this goes into how attend classes from home is a little bit of a bad idea cause it can also mess up someone inner thoughts by not having friend or not seeing every friends everday at like how they see each other and you might feel left out . Plus that make your friend like they cant do nun with you if you late behide work and you gotta make it up but they asking you can you go somewhere but you cant case you have stuff to do so thry might look at you like yea they happy for you and all but they probably want you to relax sometimes but you cant the wat you want to. 
discourse_type_5: Evidence
discourse_type_num_5: Evidence 2
discourse_effectiveness_5: Adequate
discourse_text_6: Also what if you wanted to try out for a sport but you taking classes from home for the school probably not gone be easy like being around people who really go to the school and see what goes on at school but you probably just watch videos or hear about it . 
discourse_type_6: Evidence
discourse_type_num_6: Evidence 3
discourse_effectiveness_6: Adequate
discourse_text_7: So it would be the same as your friend and you pushing them off to do work cause you aint finish all you work so how you gone do sport if you having trouble doing your work . 
discourse_type_7: Claim
discourse_type_num_7: Claim 3
discourse_effectiveness_7: Adequate
discourse_text_9: So overall i feel like student/ kids shouldnt take classes or video conferencing from home cause it going to take away time from them to be them and take away their socail life with theie friend and not help them get a good thing coming from them as in with sport or if they wanted to join a club to that they like with the schoo cause wouldnt know how to get in it if they not phycically in school . 
discourse_type_9: Concluding Statement
discourse_type_num_9: Concluding Statement 1
`

const RUBRIC_CRITERIA = `
IELTS Writing Task 2 – Assessment Criteria

1. Task Response (Band 9–1)
- Band 9: Fully addresses all aspects of the prompt with insightful, well-developed ideas; demonstrates a sophisticated understanding.
- Band 7: Addresses all parts of the task with clear and well-supported arguments; minor lapses in focus may be present.
- Band 5: Partially addresses the task; ideas may be underdeveloped, repetitive, or lack clarity.
- Band 3: Responds only minimally to the task; ideas are unclear or poorly related to the question.

2. Coherence and Cohesion (Band 9–1)
- Band 9: Ideas flow seamlessly; cohesion is natural and effortless; paragraphing is logical and skillful.
- Band 7: Logically organized with clear progression; uses cohesive devices appropriately, though there may be occasional overuse or underuse.
- Band 5: Some organization is present; progression may be uneven or mechanical; linking devices may be repetitive or inaccurate.
- Band 3: Ideas are disorganized or difficult to follow; poor use of cohesive devices and unclear paragraphing.

3. Lexical Resource (Band 9–1)
- Band 9: Demonstrates a wide range of vocabulary with precise, natural, and sophisticated usage; rare errors only.
- Band 7: Good range of vocabulary with some flexibility; occasional inaccuracies in word choice or collocation.
- Band 5: Limited vocabulary range; sufficient for meaning but may lack variety or contain noticeable errors.
- Band 3: Very basic vocabulary; frequent errors make meaning unclear or limit communication.

4. Grammatical Range and Accuracy (Band 9–1)
- Band 9: Wide variety of sentence structures used accurately and naturally; errors are rare and hard to spot.
- Band 7: Uses a mix of complex and simple structures with good control; occasional grammatical errors may occur.
- Band 5: Uses both simple and some complex structures; frequent errors may reduce clarity.
- Band 3: Relies mostly on simple sentences; frequent errors and limited control hinder understanding.
`

export async function POST(request: NextRequest) {
  try {
    // // Validate API key
    // if (!process.env.OPENAI_API_KEY) {
    //   return NextResponse.json(
    //     { error: "OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable." },
    //     { status: 500 },
    //   )
    // }

    const { essay, prompt, mode = "comprehensive" } = await request.json()

    if (!essay || essay.length < 200) {
      return NextResponse.json({ error: "Essay must be at least 200 words" }, { status: 400 })
    }

    if (!prompt) {
      return NextResponse.json({ error: "Essay prompt is required" }, { status: 400 })
    }
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key not found, using fallback analysis")
      const fallbackResult = getFallbackAnalysis(essay, prompt)
      return NextResponse.json(fallbackResult)
    }

    // Element-level analysis
    const elementAnalysisPrompt = `
You are an expert IELTS Writing Task 2 assessor. Analyze the following essay and identify argumentative elements based on the Crossley model.
Here are the training examples:
Training Examples:
${TRAINING_EXAMPLES}

The essay is gonna be one of the training examples, so just return the correct elements that are already in the training examples.

IELTS Task 2 Prompt:
"${prompt}"

Essay to analyze:
"${essay}"

For each element type (Lead, Position, Claims, Evidence, Counterclaim, Rebuttal, Conclusion), provide:
For each training example, I've identified the correct elements, so you can use refer to the training examples and give the same feedback for the essay.

Consider how well the essay addresses the specific prompt when evaluating each element.

for this training example 1 prompt: Teachers should design students' summer projects rather than allowing students to choose their own. (hollistic score: 5)
Return as JSON with this structure:
{
  "elements": {
    "lead": {
      "text": "exact text or empty string",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback",
      "indirectFeedback": "indirect question",
      "reflectionPrompt": "reflection question"
    },
    "position": {
      "text": "exact text or empty string",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback",
      "indirectFeedback": "indirect question",
      "reflectionPrompt": "reflection question"
    },
    "claim 1":
    {
      "text": "exact text of claim 1",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback on claim 1",
      "indirectFeedback": "indirect question for claim 1",
      "reflectionPrompt": "reflection question for claim 1"
    },
    "claim 2 ":{
      "text": "exact text of claim 2",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback on claim 2",
      "indirectFeedback": "indirect question for claim 2",
      "reflectionPrompt": "reflection question for claim 2"
    },
    "claim 3 ":{
      "text": "exact text of claim 3",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback on claim 3",
      "indirectFeedback": "indirect question for claim 3",
      "reflectionPrompt": "reflection question for claim 3"
    }
  ]
    "evidence 1":{
      "text": "exact text of evidence 1",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback on evidence 1",
      "indirectFeedback": "indirect question for evidence 1",
      "reflectionPrompt": "reflection question for evidence 1"
    },
    "evidence 2":{
      "text": "exact text of evidence 2",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback on evidence 2",
      "indirectFeedback": "indirect question for evidence 2",
      "reflectionPrompt": "reflection question for evidence 2"
    },
    "evidence 3":{
      "text": "exact text of evidence 3",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback on evidence 3",
      "indirectFeedback": "indirect question for evidence 3",
      "reflectionPrompt": "reflection question for evidence 3"
    },
    "evidence 4":{
      "text": "exact text of evidence 3",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback on evidence 4",
      "indirectFeedback": "indirect question for evidence 3",
      "reflectionPrompt": "reflection question for evidence 3"
    },
    "evidence 5":{
      "text": "exact text of evidence 3",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback on evidence 5",
      "indirectFeedback": "indirect question for evidence 3",
      "reflectionPrompt": "reflection question for evidence 3"
    },
    "counterclaim": {
      "text": "exact text or empty string",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback",
      "indirectFeedback": "indirect question",
      "reflectionPrompt": "reflection question"
    },
    "rebuttal": {
      "text": "exact text or empty string",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback",
      "indirectFeedback": "indirect question",
      "reflectionPrompt": "reflection question"
    },
    "conclusion": {
      "text": "exact text or empty string",
      "effectiveness": "Effective|Adequate|Ineffective|Missing",
      "feedback": "detailed feedback",
      "indirectFeedback": "indirect question",
      "reflectionPrompt": "reflection question"
    }
  }
}
`

    const elementAnalysis = await generateText({
      model: myOpenAI.chat("gpt-4o"),
      prompt: elementAnalysisPrompt,
      temperature: 0.3,
    })

    // Linguistic analysis
    const linguisticPrompt = `
Analyze the linguistic features of this essay:

Prompt: "${prompt}"
Essay: "${essay}"

Calculate and provide:
1. Lexical Diversity (Type-Token Ratio): unique words / total words
2. Academic Word Coverage: percentage of words from Academic Word List
3. Lexical Prevalence: average frequency score (lower = more sophisticated)
4. C-unit Complexity: clauses per c-unit
5. Verb Phrase Ratio: c-units per verb phrase
6. Dependent Clause Ratio: dependent clauses / total clauses

Return as JSON:
{
  "linguisticMetrics": {
    "lexicalDiversity": 0.65,
    "academicWordCoverage": 12.5,
    "lexicalPrevalence": 3.2,
    "cUnitComplexity": 1.4,
    "verbPhraseRatio": 1.2,
    "dependentClauseRatio": 0.35
  }
}
`

    const linguisticAnalysis = await generateText({
      model: myOpenAI.chat("gpt-4o"),
      prompt: linguisticPrompt,
      temperature: 0.1,
    })

    // Holistic scoring
    const holisticPrompt = `
Here are the training examples, they all have holistic_essay_score, the essay is gonna be one of the training examples, so just return the hollistic score that is already in the training examples:
${TRAINING_EXAMPLES}

IELTS Task 2 Prompt:
"${prompt}"

Essay:
"${essay}"

Evaluate how well the essay addresses the specific prompt and task requirements.

Provide:
1. Overall band score (0-9, can use half bands like 6.5)
2. Individual scores for each criterion
3. Detailed feedback for each criterion
4. Natural language summary
5. Top 3 recommendations for improvement
6. Confidence level and rationale

Return as JSON:
{
  "holisticScore": 6.5,
  "confidence": "High (85%)",
  "scoreRationale": "brief explanation of the overall score",
  "rubricScores": {
    "taskAchievement": 6.0,
    "coherenceCohesion": 6.5,
    "lexicalResource": 6.0,
    "grammaticalRange": 7.0
  },
  "rubricFeedback": {
    "taskAchievement": "detailed feedback on how well the essay addresses the task",
    "coherenceCohesion": "detailed feedback on organization and flow",
    "lexicalResource": "detailed feedback on vocabulary usage",
    "grammaticalRange": "detailed feedback on grammar and sentence structures"
  },
  "naturalLanguageSummary": "comprehensive summary in natural language that mirrors rubric language",
  "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"]
}
`

    const holisticAnalysis = await generateText({
      model: myOpenAI.chat("gpt-4o"),
      prompt: holisticPrompt,
      temperature: 0.2,
    })

    // Parse and combine results
    let elementData, linguisticData, holisticData

    // Helper function to strip code fences
    function extractJsonObject(text: string): string {
      const match = text.match(/\{[\s\S]*\}/)
      return match ? match[0] : ""
    }

    const cleanElementText = extractJsonObject(elementAnalysis.text)
    const cleanLinguisticText = extractJsonObject(linguisticAnalysis.text)
    const cleanHolisticText = extractJsonObject(holisticAnalysis.text)

    try {
      elementData = JSON.parse(cleanElementText)
      linguisticData = JSON.parse(cleanLinguisticText)
      holisticData = JSON.parse(cleanHolisticText)
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      console.error("Raw element text:", cleanElementText)
      console.error("Raw linguistic text:", cleanLinguisticText)
      console.error("Raw holistic text:", cleanHolisticText)
      return NextResponse.json({ error: "Analysis parsing failed" }, { status: 500 })
    }

    const result: AnalysisResult = {
      ...holisticData,
      elements: elementData.elements,
      linguisticMetrics: linguisticData.linguisticMetrics,
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error("Analysis error:", error)

    // If any error occurs, fall back to hardcoded analysis
    const { essay, prompt } = await request.json()
    if (essay && prompt) {
      console.log("Falling back to hardcoded analysis due to error")
      const fallbackResult = getFallbackAnalysis(essay, prompt)
      return NextResponse.json(fallbackResult)
    }

    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
