export const samplePrompts = [
  {
    id: 1,
    title: "Technology and Education",
    prompt:
      "Some people believe that technology has made learning easier and more accessible, while others argue that it has made students lazy and less capable of deep thinking. Discuss both views and give your own opinion.",
  },
  {
    id: 2,
    title: "Work-Life Balance",
    prompt:
      "In many countries, people are working longer hours and have less time for family and leisure activities. What are the causes of this trend? What solutions can you suggest to improve work-life balance?",
  },
  {
    id: 3,
    title: "Environmental Protection",
    prompt:
      "Some people think that environmental problems should be solved by the government, while others believe that individuals should take responsibility. Discuss both views and give your opinion.",
  },
  {
    id: 4,
    title: "Social Media Impact",
    prompt:
      "Social media platforms have become an integral part of modern life. Do the advantages of social media outweigh the disadvantages? Give reasons for your answer and include relevant examples.",
  },
]

export const sampleEssays = [
  {
    id: 1,
    promptId: 1,
    title: "Technology and Education Essay",
    essay: `In today's digital age, the role of technology in education has become a subject of intense debate. While some argue that technological advancements have revolutionized learning by making it more accessible and engaging, others contend that it has led to intellectual laziness and superficial thinking among students. This essay will examine both perspectives before presenting my own viewpoint.

Proponents of educational technology highlight several compelling advantages. Firstly, digital platforms have democratized access to knowledge, allowing students from remote areas to attend virtual lectures from world-renowned institutions. For instance, online courses from universities like Harvard and MIT are now available to anyone with an internet connection. Additionally, interactive learning tools such as educational apps and virtual reality simulations can make complex concepts more understandable and memorable. These technologies cater to different learning styles, enabling visual, auditory, and kinesthetic learners to grasp information more effectively.

However, critics raise valid concerns about technology's impact on cognitive development. They argue that the constant availability of information through search engines has made students overly dependent on external sources, reducing their ability to think critically and retain information. Furthermore, the prevalence of social media and entertainment platforms can be highly distracting, leading to shortened attention spans and difficulty concentrating on academic tasks. Some educators also worry that students are losing essential skills such as handwriting and mental arithmetic due to over-reliance on digital devices.

In my opinion, while technology presents certain challenges, its benefits in education far outweigh the drawbacks when used appropriately. The key lies in finding the right balance and implementing technology as a tool to enhance rather than replace traditional learning methods. Teachers should guide students in developing digital literacy skills while also emphasizing the importance of critical thinking and independent analysis.

In conclusion, technology has undoubtedly transformed the educational landscape, offering unprecedented opportunities for learning and growth. However, it is crucial that educators and students alike approach these tools mindfully, ensuring that technology serves to augment human intelligence rather than diminish it.`,
  },
  {
    id: 2,
    promptId: 2,
    title: "Work-Life Balance Essay",
    essay: `The modern workplace has undergone significant changes in recent decades, with many employees finding themselves working longer hours while having less time for personal pursuits and family relationships. This trend has become increasingly prevalent across developed nations and raises important questions about the sustainability of current work practices.

Several factors contribute to the extension of working hours in contemporary society. Economic pressures play a primary role, as companies strive to remain competitive in global markets by maximizing productivity and minimizing costs. This often translates to expecting more output from existing employees rather than hiring additional staff. Furthermore, technological advancement, while offering many conveniences, has blurred the boundaries between work and personal life. Smartphones and laptops enable constant connectivity, making it difficult for workers to truly disconnect from their professional responsibilities even during supposed leisure time.

The consequences of this trend are far-reaching and concerning. Extended working hours can lead to increased stress levels, burnout, and various health problems including cardiovascular disease and mental health issues. Family relationships often suffer as parents have less time to spend with their children, potentially affecting child development and family cohesion. Additionally, reduced leisure time means fewer opportunities for personal growth, hobbies, and community engagement, which are essential for overall well-being and life satisfaction.

To address these challenges, several solutions could be implemented. Governments could introduce legislation limiting maximum working hours and ensuring adequate rest periods, similar to policies already in place in some European countries. Companies should be encouraged to adopt flexible working arrangements, such as remote work options and compressed work weeks, which can improve efficiency while giving employees more control over their schedules. Additionally, organizations need to foster a culture that respects personal time and discourages after-hours communication except in genuine emergencies.

In conclusion, the trend toward longer working hours represents a significant challenge to modern society's well-being. Through combined efforts from governments, employers, and individuals, it is possible to create a more balanced approach to work that prioritizes both productivity and quality of life.`,
  },
]

export const getDefaultPrompt = () => samplePrompts[0].prompt
export const getDefaultEssay = () => sampleEssays[0].essay

export const getEssayForPrompt = (promptId: number) => {
  return sampleEssays.find((essay) => essay.promptId === promptId)?.essay || ""
}
