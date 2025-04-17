"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from 'react-markdown';
import { Download, RefreshCw, ArrowLeft, Edit, Save } from "lucide-react";
import Navbar from "@/components/navbar";
import { Textarea } from "@/components/ui/custom-textarea";

// List of US states for dropdown
const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
  "Wisconsin", "Wyoming", "District of Columbia"
];

// Define question types
interface BaseQuestion {
  question: string;
  options: string[];
  setter: (value: string) => void;
}

interface DropdownQuestion extends BaseQuestion {
  dropdown: true;
  slider?: never;
}

interface SliderQuestion extends BaseQuestion {
  slider: true;
  min: number;
  max: number;
  dropdown?: never;
}

interface RegularQuestion extends BaseQuestion {
  dropdown?: false;
  slider?: false;
}

type Question = RegularQuestion | DropdownQuestion | SliderQuestion;

// Define section type
type SectionType = 'landing' | 'privacy' | 'bias' | 'learning' | 'environment' | 'results' | 'guidelines';

export default function PolicyGenerator() {
  // State for tracking if user has started the process
  const [started, setStarted] = useState(false);
  
  // States for user responses
  const [policyScope, setPolicyScope] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [state, setState] = useState("");
  const [diversity, setDiversity] = useState("");
  const [englishProficiency, setEnglishProficiency] = useState("");
  const [academicIntegrity, setAcademicIntegrity] = useState("");
  const [aiIncorporation, setAiIncorporation] = useState("");
  const [environmentalConsciousness, setEnvironmentalConsciousness] = useState("");
  const [environmentalCommitment, setEnvironmentalCommitment] = useState("");
  
  // State for API response
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPolicy, setEditedPolicy] = useState("");
  
  // State for current section and question
  const [section, setSection] = useState<SectionType>('landing');
  const [questionIndex, setQuestionIndex] = useState(0);

  const policyRef = useRef<HTMLDivElement>(null);

  async function generatePolicy() {
    setLoading(true);
    try {
      // Create a dynamic context object
      const policyContext = {
        // Privacy Section Context
        privacyContext: (() => {
          let privacyDetails = [];
          
          // Context based on policy scope
          switch(policyScope) {
            case "A district":
              privacyDetails.push("This policy covers a comprehensive district-wide approach to AI usage.");
              break;
            case "A school":
              privacyDetails.push("This policy is tailored to a specific school's AI integration strategy.");
              break;
            case "A classroom":
              privacyDetails.push("This policy focuses on classroom-level AI implementation and guidelines.");
              break;
          }
  
          // Context based on age group
          switch(ageGroup) {
            case "K-5":
              privacyDetails.push("Special consideration must be given to the digital safety of young learners.");
              privacyDetails.push("Parental consent and monitoring are critical for AI interactions.");
              break;
            case "6-8":
              privacyDetails.push("Developing digital literacy and responsible AI use is paramount.");
              privacyDetails.push("Introduce AI concepts with strong ethical guidelines.");
              break;
            case "9-12":
              privacyDetails.push("Emphasize critical thinking and ethical use of AI technologies.");
              privacyDetails.push("Prepare students for responsible AI engagement.");
              break;
          }
  
          return privacyDetails.join(" ");
        })(),
  
        // Bias Section Context
        biasContext: (() => {
          let biasDetails = [];
  
          // Diversity context
          switch(diversity) {
            case "Mild":
              biasDetails.push("Implement basic AI bias mitigation strategies.");
              break;
            case "Moderate":
              biasDetails.push("Develop comprehensive approaches to address potential AI bias.");
              biasDetails.push("Regular assessment of AI tools for cultural sensitivity is necessary.");
              break;
            case "Considerable":
              biasDetails.push("Prioritize AI tools with robust bias detection and correction mechanisms.");
              biasDetails.push("Implement multi-layered bias assessment protocols.");
              break;
            case "Intense":
              biasDetails.push("Critical need for AI solutions that actively promote inclusivity and representation.");
              biasDetails.push("Develop custom AI usage guidelines that specifically address diverse learning needs.");
              break;
          }
  
          // English proficiency context
          const proficiencyLevel = parseInt(englishProficiency.split('/')[0]);
          if (proficiencyLevel <= 3) {
            biasDetails.push("Ensure AI tools support multilingual and translation capabilities.");
            biasDetails.push("Provide additional language support in AI-assisted learning.");
          } else if (proficiencyLevel <= 6) {
            biasDetails.push("Include language support features in AI learning tools.");
          }
  
          return biasDetails.join(" ");
        })(),
  
        // Learning Section Context
        learningContext: (() => {
          let learningDetails = [];
  
          // Academic integrity context
          switch(academicIntegrity) {
            case "Little issue":
              learningDetails.push("Implement preventative AI usage guidelines.");
              break;
            case "Moderate issue":
              learningDetails.push("Develop robust AI detection and prevention strategies.");
              learningDetails.push("Create clear guidelines on acceptable AI assistance.");
              break;
            case "Considerable issue":
              learningDetails.push("Establish comprehensive AI academic integrity protocols.");
              learningDetails.push("Implement advanced plagiarism and AI-generated content detection.");
              break;
            case "Major issue":
              learningDetails.push("Develop a zero-tolerance approach to unauthorized AI use.");
              learningDetails.push("Create extensive educational programs on academic honesty.");
              learningDetails.push("Implement sophisticated AI content verification systems.");
              break;
          }
  
          // AI incorporation context
          switch(aiIncorporation) {
            case "None":
              learningDetails.push("Maintain traditional teaching methods with minimal AI integration.");
              break;
            case "Mildly":
              learningDetails.push("Carefully introduce AI as a supplementary learning tool.");
              break;
            case "Moderately":
              learningDetails.push("Develop a balanced approach to AI-assisted learning.");
              learningDetails.push("Create structured AI integration frameworks.");
              break;
            case "Majorly":
              learningDetails.push("Implement comprehensive AI-driven learning strategies.");
              learningDetails.push("Develop cutting-edge AI educational technologies.");
              break;
          }
  
          return learningDetails.join(" ");
        })(),
  
        // Environmental Context
        environmentContext: (() => {
          let environmentDetails = [];
  
          // Environmental consciousness
          switch(environmentalConsciousness) {
            case "Mildly":
              environmentDetails.push("Introduce basic awareness of AI's environmental impact.");
              break;
            case "Moderately":
              environmentDetails.push("Develop strategies to minimize the carbon footprint of AI technologies.");
              break;
            case "Majorly":
              environmentDetails.push("Prioritize energy-efficient and sustainable AI solutions.");
              environmentDetails.push("Implement comprehensive green computing practices.");
              break;
          }
  
          // Environmental commitment
          switch(environmentalCommitment) {
            case "Mildly":
              environmentDetails.push("Begin tracking and reporting AI energy consumption.");
              break;
            case "Moderately":
              environmentDetails.push("Develop a systematic approach to reducing AI-related environmental impact.");
              break;
            case "Majorly":
              environmentDetails.push("Lead in sustainable AI implementation and green technology adoption.");
              environmentDetails.push("Set ambitious goals for carbon-neutral AI usage.");
              break;
          }
  
          return environmentDetails.join(" ");
        })()
      };
  
      // Function to make API calls for each section
      const generateSection = async (sectionName: string, sectionPrompt: string, exampleContent?: string) => {
        const systemPrompt = `
          You are an expert in creating AI policies for educational institutions. Your task is to generate the "${sectionName}" section of an AI policy based on the parameters and contextual insights provided.
          
          Focus ONLY on the "${sectionName}" section. Do not include any other sections.
          Be specific, clear, and actionable in your guidelines.
          Use professional language appropriate for an educational policy document.
          Do not include any introductory or concluding remarks outside of the section content.
          
          Use the specific data points provided in the prompt to tailor the content to the institution's needs.
          If the institution is a district, school, or classroom, adjust the scope and language accordingly.
          If the age group is K-5, 6-8, or 9-12, use age-appropriate language and considerations.
          If the state is specified, include relevant state-specific regulations or guidelines.
          If diversity or English proficiency levels are mentioned, address those specific needs.
          If academic integrity or AI incorporation levels are specified, tailor the guidelines accordingly.
          If environmental consciousness or commitment levels are provided, adjust the environmental impact section accordingly.
          
          ${exampleContent ? `Use the following example as a optimal reference and template for style and structure, but adapt the content to the specific parameters provided above:\n\n${exampleContent}` : ''}
        `;

        const response = await fetch('/api/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            model: "gpt-4.1-nano",
            systemPrompt, 
            prompt: sectionPrompt 
          }),
        });
        
        const data = await response.json();
        
        if (data.content) {
          return data.content;
        } else if (data.error) {
          return `Error in ${sectionName} section: ${data.error}`;
        } else {
          return `No valid response received for ${sectionName} section.`;
        }
      };

      // Generate each section
      const introductionPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Student Body Diversity: ${diversity}
        - English Proficiency: ${englishProficiency}
        - Academic Integrity: ${academicIntegrity}
        - AI Incorporation Level: ${aiIncorporation}
        - Environmental Consciousness: ${environmentalConsciousness}
        - Environmental Commitment: ${environmentalCommitment}
        
        CONTEXTUAL INSIGHTS:
        ${policyContext.privacyContext}
        ${policyContext.biasContext}
        ${policyContext.learningContext}
        ${policyContext.environmentContext}
        
        Generate the Introduction and Rationale section of the AI policy. This section should:
        - Explain the purpose of the policy
        - Provide context for why AI integration is important
        - Outline the benefits of AI in education
        - Set the tone for the rest of the policy
        - Reference the specific context of this ${policyScope} (${ageGroup} students in ${state})
        - Address the specific needs related to diversity (${diversity}) and English proficiency (${englishProficiency})
        - Mention the level of AI incorporation (${aiIncorporation}) and academic integrity concerns (${academicIntegrity})
        - Include environmental considerations based on consciousness (${environmentalConsciousness}) and commitment (${environmentalCommitment})
      `;
      
      const permittedUsePrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - AI Incorporation Level: ${aiIncorporation}
        - Academic Integrity: ${academicIntegrity}
        
        CONTEXTUAL INSIGHTS:
        ${policyContext.learningContext}
        
        Generate the Permitted Use section of the AI policy. This section should:
        - Clearly outline what uses of AI are permitted and encouraged
        - Provide specific examples of acceptable AI usage
        - Explain how AI can supplement student learning
        - Include guidelines for teachers on how to incorporate AI
        - Tailor the permitted uses to the specific age group (${ageGroup})
        - Consider the level of AI incorporation desired (${aiIncorporation})
        - Address academic integrity concerns (${academicIntegrity})
        - Include state-specific considerations for ${state}
      `;
      
      const prohibitedUsePrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Academic Integrity: ${academicIntegrity}
        - AI Incorporation Level: ${aiIncorporation}
        
        CONTEXTUAL INSIGHTS:
        ${policyContext.learningContext}
        
        Generate the Prohibited Use section of the AI policy. This section should:
        - Clearly outline what uses of AI are prohibited
        - Address academic integrity concerns
        - Provide specific examples of unacceptable AI usage
        - Explain the consequences of policy violations
        - Tailor the prohibited uses to the specific age group (${ageGroup})
        - Consider the level of AI incorporation (${aiIncorporation})
        - Address the specific academic integrity concerns (${academicIntegrity})
        - Include state-specific considerations for ${state}
      `;
      
      const staffTrainingPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - AI Incorporation Level: ${aiIncorporation}
        - Academic Integrity: ${academicIntegrity}
        
        Generate the Commitment to Staff Training section of the AI policy. This section should:
        - Outline the school's commitment to training staff on AI usage
        - Describe the types of training that will be provided
        - Explain how staff will be supported in implementing AI tools
        - Include guidelines for ongoing professional development
        - Tailor the training approach to the specific age group (${ageGroup})
        - Consider the level of AI incorporation (${aiIncorporation})
        - Address the specific academic integrity concerns (${academicIntegrity})
        - Include state-specific considerations for ${state}
      `;
      
      const privacyPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Student Body Diversity: ${diversity}
        - English Proficiency: ${englishProficiency}
        
        CONTEXTUAL INSIGHTS:
        ${policyContext.privacyContext}
        
        Generate the Privacy & Transparency section of the AI policy. This section should:
        - Address data privacy concerns
        - Outline disclosure rules
        - Explain how student data will be protected
        - Include guidelines for transparency in AI usage
        - Tailor privacy considerations to the specific age group (${ageGroup})
        - Consider the diversity of the student body (${diversity})
        - Address language considerations based on English proficiency (${englishProficiency})
        - Include state-specific privacy regulations for ${state}
      `;
      
      const biasPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Student Body Diversity: ${diversity}
        - English Proficiency: ${englishProficiency}
        
        CONTEXTUAL INSIGHTS:
        ${policyContext.biasContext}
        
        Generate the Bias & Accessibility section of the AI policy. This section should:
        - Address potential bias in AI tools
        - Outline strategies for ensuring equitable access
        - Explain how the policy promotes inclusivity
        - Include guidelines for selecting unbiased AI tools
        - Tailor bias considerations to the specific age group (${ageGroup})
        - Address the specific diversity needs (${diversity})
        - Include language considerations based on English proficiency (${englishProficiency})
        - Include state-specific considerations for ${state}
      `;
      
      const environmentalPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Environmental Consciousness: ${environmentalConsciousness}
        - Environmental Commitment: ${environmentalCommitment}
        
        CONTEXTUAL INSIGHTS:
        ${policyContext.environmentContext}
        
        Generate the Environmental Impact section of the AI policy. This section should:
        - Address the environmental impact of AI technologies
        - Outline strategies for minimizing carbon footprint
        - Explain how the school will promote sustainable AI usage
        - Include specific environmental goals and commitments
        - Tailor environmental considerations to the specific age group (${ageGroup})
        - Address the level of environmental consciousness (${environmentalConsciousness})
        - Include specific commitments based on environmental commitment level (${environmentalCommitment})
        - Include state-specific environmental considerations for ${state}
      `;
      
      const accountabilityPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Academic Integrity: ${academicIntegrity}
        - AI Incorporation Level: ${aiIncorporation}
        
        Generate the Accountability & Enforcement section of the AI policy. This section should:
        - Outline how the policy will be enforced
        - Describe the roles and responsibilities of different stakeholders
        - Explain the consequences of policy violations
        - Include guidelines for monitoring and evaluation
        - Tailor accountability measures to the specific age group (${ageGroup})
        - Address the specific academic integrity concerns (${academicIntegrity})
        - Consider the level of AI incorporation (${aiIncorporation})
        - Include state-specific considerations for ${state}
      `;
      
      const conclusionPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Student Body Diversity: ${diversity}
        - English Proficiency: ${englishProficiency}
        - Academic Integrity: ${academicIntegrity}
        - AI Incorporation Level: ${aiIncorporation}
        - Environmental Consciousness: ${environmentalConsciousness}
        - Environmental Commitment: ${environmentalCommitment}
        
        CONTEXTUAL INSIGHTS:
        ${policyContext.privacyContext}
        ${policyContext.biasContext}
        ${policyContext.learningContext}
        ${policyContext.environmentContext}
        
        Generate the Conclusion section of the AI policy. This section should:
        - Summarize the key points of the policy
        - Reinforce the school's commitment to responsible AI usage
        - Outline the next steps for implementation
        - Include a statement about the policy's evolution over time
        - Reference the specific context of this ${policyScope} (${ageGroup} students in ${state})
        - Address the specific needs related to diversity (${diversity}) and English proficiency (${englishProficiency})
        - Mention the level of AI incorporation (${aiIncorporation}) and academic integrity concerns (${academicIntegrity})
        - Include environmental considerations based on consciousness (${environmentalConsciousness}) and commitment (${environmentalCommitment})
      `;

      // Example content for each section
      const introductionExample = `
Artificial Intelligence (AI), particularly Generative AI (Gen AI), is playing an increasing role in education, from conversational chatbots and virtual tutors to automated grading software and classroom monitoring tools. Therefore, [SCHOOL NAME] recognizes the need for transparent governance of these technologies to harness their benefits while safeguarding our students and staff. With proper guidance, AI has the potential to improve learning outcomes, support teachers, and promote fairness in education; however, without clear policies, there is a risk of privacy violations, biased outcomes, and other unintended harms when these tools are used in schools. 

This policy establishes a framework for the ethical and effective use of AI in our high school that serves students over 13 years of age and defines the scope of AI tools it covers. It applies to all AI-powered systems used within the school's educational and administrative processes – including generative AI chatbots, automated grading and assessment platforms, adaptive learning or tutoring systems, and AI-based monitoring or proctoring technologies. 

By outlining expectations and limitations for these tools, [SCHOOL NAME] commits to using AI in a manner that upholds our educational mission and values, complies with all applicable laws, and protects the rights and interests of students, parents, and staff. 

The scope of this policy encompasses students, teachers, and administrators. It also sets the expectations for any third-party vendors or tools involved in the use of AI within our school setting. 

Our overarching goal is to ensure that AI is employed as a positive supplement to education – never as a replacement for human judgment or accountability – and that its use is transparent, fair, and aligned with best practices in K-12 education governance.
      `;

      const permittedUseExample = `
The following lists several permissible and encouraged uses of AI when they serve as supplements to a student's effort and thinking. Students are allowed to use AI for specific learning activities under the direction and supervision of their classroom teachers. The classroom teacher must explicitly permit the following use. Without such permission, it is assumed that all activities are not permissible. Teachers may recommend or incorporate AI-powered tools to differentiate instruction or provide additional support outside of class. 

The following includes typical student activities that are permitted by a staff member:

* Practicing skills with an AI tutor or drill program
* Use of AI-driven tutoring systems 
* Generative AI tools can help brainstorm ideas or summarize complex information to support student understanding
* Using AI to translate passages or define words for language learning
* Employing speech-to-text or text-to-speech tools for accessibility based on the student's Individual Education Plan, 504 Plan, or under the direction of the classroom teacher
* Generating sample problems or quizzes to test themselves
* Getting feedback on drafts (like grammar suggestions or hints to improve an essay)
* Other formative or assistive tasks.
      `;

      const prohibitedUseExample = `
At the same time, [SCHOOL NAME] maintains strict rules against the misuse of AI in any manner that undermines learning.

First and foremost, students and staff are forbidden from using AI tools to impersonate others or engage in unethical behavior such as creating deep fakes, bullying, or harassment. Using AI to generate false images, videos, or messages of a classmate, teacher, or any individual is strictly prohibited and subject to serious disciplinary action under our bullying and harassment policies. Likewise, attempting to use AI to hack school systems, to bypass security or content filters, or to access inappropriate content is banned.

Additional Prohibited uses of AI by students (or staff, where applicable) include, but are not limited to:

* Using AI to plagiarize or produce work that the student then presents as their own original effort
* Submitting essays, projects, or assignments written in full or in major part by generative AI without proper attribution or authorization
* Relying on AI to complete assessments or homework in place of the student's own understanding (for example, copying answers from ChatGPT or an AI solver is cheating and will be treated as such)
* Using AI tools to fabricate data or citations
* Any use of AI to deceive, mislead, or violate academic integrity. All student work must be the student's own, except where use of AI is explicitly permitted and properly documented.

If a teacher allows AI assistance for a particular assignment (for instance, permitting grammar checks or idea brainstorming), the student must still cite or acknowledge the AI's contribution in accordance with the teacher's instructions. Failure to disclose AI-generated content in work that is submitted for credit will be considered a form of plagiarism.
      `;

      const staffTrainingExample = `
[SCHOOL NAME] will provide staff training to emphasize the importance of secure AI use. In line with best practices, [SCHOOL NAME] will ensure a comprehensive approach to compliance and ethics. By strictly following legal requirements and conducting due diligence on all AI tools, we aim to protect our students and the institution from legal risks and to set a high standard for responsible AI adoption in education.

Staff will receive training on:

* How to implement AI tools ethically and securely in their classrooms
* Detecting and addressing misuse by students
* How to cite AI tools when used in academic work
* Understanding AI limitations and avoiding over-reliance on automated systems

Teachers will be equipped to assess AI outputs critically, ensuring AI enhances the learning experience rather than replacing human judgment.
      `;

      const privacyExample = `
[SCHOOL NAME] will ensure full compliance with relevant federal, state, and local laws on student data protection, digital safety, and nondiscrimination pertaining to AI tools. Compliance with all appropriate federal, state, and local laws is essential. All AI usage under this policy must conform to the legal standards and regulations governing data, technology, and student rights. 

We will adhere to the Family Educational Rights and Privacy Act (FERPA), the Health Insurance Portability and Accountability Act (HIPAA), and the Children's Online Privacy Protection Act (COPPA). Additionally, we will comply with the General Data Protection Regulation (GDPR) principles, including data minimization, purpose limitation, and user rights.

In practice, this means our contracts with AI service providers will include provisions that mirror strong privacy protections – for example, limiting the use of our data to only the services provided to the school, ensuring data can be deleted upon request, and reporting any data breaches to the appropriate authority and the school community immediately.
      `;

      const biasExample = `
We are committed to using AI to level the playing field and ensuring that no student group is discriminated against. [SCHOOL NAME] requires vendors of AI educational software to provide evidence of efforts to detect and mitigate bias in their products. We will independently evaluate tools to assess whether they have a disparate impact on different groups of students. 

AI-driven decision-making will not be used to prejudice a student's opportunities or treatment based on protected characteristics such as race, ethnicity, gender, or disability. High-stakes decisions like grading, disciplinary actions, and scheduling will always involve human oversight to prevent algorithmic biases from affecting students' futures.
      `;

      const environmentalExample = `
[SCHOOL NAME] acknowledges that while AI can offer significant educational advantages, it also carries an environmental footprint through the energy and computing resources it consumes. The training and operation of AI models, especially large-scale generative AI, require substantial electricity and cooling, which in turn contribute to carbon emissions. As part of our commitment to responsible technology use, we pledge to minimize the environmental impact of AI in our school's operations. 

We will prioritize AI tools optimized for energy efficiency and encourage practices such as using AI only when necessary and leveraging renewable energy where possible. The environmental impact of AI will also be integrated into our curriculum to teach students about the intersection of technology and sustainability.
      `;

      const accountabilityExample = `
An AI Ethics & Compliance Committee will be established to oversee AI use in the school. This committee will be composed of diverse stakeholders such as administrators, teachers, counselors, and data/privacy experts. Its duties will include conducting periodic audits of AI applications, reviewing new AI tool proposals, and addressing any ethical concerns. The committee will also maintain an AI use registry for transparency.

The committee will ensure that all AI tools are in compliance with this policy, and will act promptly to suspend or remove any tool that violates the policy. Additionally, regular reports on AI usage will be provided to the school board to ensure ongoing oversight.
      `;

      const conclusionExample = `
This policy is a living document that may be updated to reflect changes in technology and regulations. [SCHOOL NAME] reserves the right to modify this policy as necessary to ensure the ethical and responsible use of AI in education. We are committed to empowering educators and students through AI while safeguarding privacy, fairness, and academic integrity. 

Our ultimate goal is to enhance learning experiences and promote positive outcomes for all students through the responsible use of AI, while ensuring that these technologies are aligned with the highest standards of ethical and legal compliance.
      `;


      // Generate all sections in parallel
      const [
        introduction,
        permittedUse,
        prohibitedUse,
        staffTraining,
        privacy,
        bias,
        environmental,
        accountability,
        conclusion
      ] = await Promise.all([
        generateSection("Introduction and Rationale", introductionPrompt, introductionExample),
        generateSection("Permitted Use", permittedUsePrompt, permittedUseExample),
        generateSection("Prohibited Use", prohibitedUsePrompt, prohibitedUseExample),
        generateSection("Commitment to Staff Training", staffTrainingPrompt, staffTrainingExample),
        generateSection("Privacy & Transparency", privacyPrompt, privacyExample),
        generateSection("Bias & Accessibility", biasPrompt, biasExample),
        generateSection("Environmental Impact", environmentalPrompt, environmentalExample),
        generateSection("Accountability & Enforcement", accountabilityPrompt, accountabilityExample),
        generateSection("Conclusion", conclusionPrompt, conclusionExample)
      ]);

      // Combine all sections
      const combinedPolicy = `
# AI Policy for ${policyScope === "A district" ? "School District" : policyScope === "A school" ? "School" : "Classroom"}

## Introduction and Rationale
${introduction}

## Permitted Use
${permittedUse}

## Prohibited Use
${prohibitedUse}

## Commitment to Staff Training
${staffTraining}

## Privacy & Transparency
${privacy}

## Bias & Accessibility
${bias}

## Environmental Impact
${environmental}

## Accountability & Enforcement
${accountability}

## Conclusion
${conclusion}
      `;

      // Final proofing and formatting
      const proofingSystemPrompt = `
        You are an expert editor specializing in educational policy documents. Your task is to proofread, format, and refine the provided AI policy document.
        
        Please:
        1. Ensure consistent formatting throughout the document
        2. Remove any text that appears to be from the AI model itself (like "Here's the section on..." or "I've generated...")
        3. Fix any grammatical or spelling errors
        4. Ensure the document flows logically from section to section
        5. Make sure all sections are properly formatted with appropriate headings
        6. Remove any redundant information
        7. Ensure the policy is clear, professional, and actionable
        
        FORMATTING REQUIREMENTS:
        - Use Markdown formatting for proper document structure
        - The main title should be formatted as "# TITLE" (centered, large, bold)
        - Section headings should be formatted as "## SECTION NAME" (bold, medium size)
        - Subsections should be formatted as "### SUBSECTION NAME" (bold, smaller size)
        - Add a blank line before and after each paragraph for proper spacing
        - Use bullet points for lists with proper indentation
        - Use bold text for emphasis where appropriate
        - Ensure consistent spacing between sections (at least one blank line)
        - Format any important terms or definitions in italics
        - Use proper paragraph breaks to improve readability
        
        Return ONLY the final, polished policy document without any additional commentary or explanations.
      `;

      const proofingResponse = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          model: "gpt-4.1",
          systemPrompt: proofingSystemPrompt, 
          prompt: combinedPolicy 
        }),
      });
      
      const proofingData = await proofingResponse.json();
      
      if (proofingData.content) {
        setResponse(proofingData.content);
        setEditedPolicy(proofingData.content);
      } else if (proofingData.error) {
        setResponse(`Error during final proofing: ${proofingData.error}`);
        setEditedPolicy(`Error during final proofing: ${proofingData.error}`);
      } else {
        setResponse("No valid response received during final proofing.");
        setEditedPolicy("No valid response received during final proofing.");
      }
    } catch (error) {
      console.error("Error generating policy:", error);
      setResponse("An error occurred while generating the policy. Please try again.");
      setEditedPolicy("An error occurred while generating the policy. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  // Questions organized by sections
  const sections: Record<SectionType, Question[]> = {
    landing: [],
    privacy: [
      {
        question: "Is this policy for:",
        options: ["A district", "A school", "A classroom"],
        setter: setPolicyScope
      },
      {
        question: "How old are the impacted students?",
        options: ["K-5", "6-8", "9-12"],
        setter: setAgeGroup
      },
      {
        question: "What state is your school located in?",
        dropdown: true,
        options: usStates,
        setter: setState
      }
    ],
    bias: [
      {
        question: "How diverse is your student body?",
        options: ["Mild", "Moderate", "Considerable", "Intense"],
        setter: setDiversity
      },
      {
        question: "What is the English proficiency rate at your school/district?",
        slider: true,
        min: 1,
        max: 10,
        options: [],
        setter: setEnglishProficiency
      }
    ],
    learning: [
      {
        question: "How much of an issue is academic integrity at your school?",
        options: ["Little issue", "Moderate issue", "Considerable issue", "Major issue"],
        setter: setAcademicIntegrity
      },
      {
        question: "How much would you like to incorporate AI in student learning?",
        options: ["None", "Mildly", "Moderately", "Majorly"],
        setter: setAiIncorporation
      }
    ],
    guidelines: [],
    environment: [
      {
        question: "How environmentally conscious is your campus?",
        options: ["Mildly", "Moderately", "Majorly"],
        setter: setEnvironmentalConsciousness
      },
      {
        question: "How committed is your school to positive environmental impact?",
        options: ["Mildly", "Moderately", "Majorly"],
        setter: setEnvironmentalCommitment
      }
    ],
    results: []
  };

  // Function to start the process
  const startProcess = () => {
    setStarted(true);
    setSection("privacy");
    setQuestionIndex(0);
  };

  // Function to handle next question or section
  const handleNext = (value: string) => {
    // Set the current question's answer
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      currentQuestion.setter(value);
    }
    
    // Move to next question or section
    if (questionIndex < sections[section].length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // Determine next section
      const sectionOrder: SectionType[] = ["landing", "privacy", "bias", "learning", "guidelines", "environment", "results"]; 
      const currentIndex = sectionOrder.indexOf(section);
      const nextSection = sectionOrder[currentIndex + 1] as SectionType;
      
      if (nextSection) {
        setSection(nextSection);
        setQuestionIndex(0);
        
        // Skip guidelines section as it has no questions
        if (nextSection === "guidelines" && sections[nextSection].length === 0) {
          setSection(sectionOrder[currentIndex + 2] as SectionType);
        }
        
        // Generate policy when reaching results
        if (nextSection === "results") {
          generatePolicy();
        }
      }
    }
  };

  // Function to handle going back to previous question or section
  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else {
      // Go back to previous section
      const sectionOrder: SectionType[] = ["landing", "privacy", "bias", "learning", "guidelines", "environment", "results"];
      const currentIndex = sectionOrder.indexOf(section);
      const prevSection = sectionOrder[currentIndex - 1] as SectionType;
      
      if (prevSection) {
        setSection(prevSection);
        // Set question index to last question of previous section
        setQuestionIndex(sections[prevSection].length - 1);
      }
    }
  };

  // Get section title
  const getSectionTitle = () => {
    const titles: Record<SectionType, string> = {
      landing: "Welcome to AI Policy Pathway",
      privacy: "Privacy Considerations",
      bias: "Bias Assessment",
      learning: "Student Learning",
      guidelines: "Guidelines and Laws",
      environment: "Environmental Impact",
      results: "Your AI Policy"
    };
    return titles[section];
  };

  // Get current question
  const getCurrentQuestion = (): Question | null => {
    if (sections[section] && sections[section].length > 0 && questionIndex < sections[section].length) {
      return sections[section][questionIndex];
    }
    return null;
  };

  // Type guard functions
  const isSliderQuestion = (question: Question | null): question is SliderQuestion => {
    return question !== null && 'slider' in question && question.slider === true;
  };

  const isDropdownQuestion = (question: Question | null): question is DropdownQuestion => {
    return question !== null && 'dropdown' in question && question.dropdown === true;
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const sliderValueElement = document.getElementById("sliderValue");
    if (sliderValueElement) {
      sliderValueElement.textContent = value[0].toString();
    }
  };

  // Function to handle policy editing
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setResponse(editedPolicy);
    }
    setIsEditing(!isEditing);
  };

  // Function to handle policy text changes
  const handlePolicyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPolicy(e.target.value);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <div className="container max-w-5xl py-10">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">AI Policy Generator</h1>
            <p className="mt-2 text-muted-foreground">
              Create a customized AI policy for your educational institution
            </p>
          </div>

          {/* Progress indicator */}
          {section !== 'landing' && section !== 'results' && (
            <div className="mb-8">
              <div className="flex justify-between mb-2 text-sm">
                <span>Privacy</span>
                <span>Bias</span>
                <span>Learning</span>
                <span>Environment</span>
                <span>Results</span>
              </div>
              <Progress 
                value={(() => {
                  const sectionValues: Record<SectionType, number> = { 
                    landing: 0,
                    privacy: 20, 
                    bias: 40, 
                    learning: 60, 
                    guidelines: 80, 
                    environment: 80, 
                    results: 100 
                  };
                  return sectionValues[section];
                })()} 
                className="h-2"
              />
            </div>
          )}

          {/* Landing Page */}
          {section === 'landing' && (
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle>Welcome to AI Policy Pathway</CardTitle>
                <CardDescription>
                  Welcome to AI Policy Pathway, your comprehensive tool for drafting customized AI policies
                  for educational institutions. Answer a few questions about your needs to generate
                  a tailored policy outline.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={startProcess}
                >
                  Start Creating Your Policy
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Questions */}
          {section !== 'landing' && section !== 'results' && (
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <CardTitle>{getSectionTitle()}</CardTitle>
                  <div className="w-[70px]" /> {/* Spacer for alignment */}
                </div>
                <CardDescription>
                  {getCurrentQuestion()?.question}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Regular options */}
                {!isDropdownQuestion(getCurrentQuestion()) && !isSliderQuestion(getCurrentQuestion()) && (
                  <div className="grid grid-cols-1 gap-4">
                    {getCurrentQuestion()!.options.map((option, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="justify-start h-auto py-4 text-left"
                        onClick={() => handleNext(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Dropdown */}
                {isDropdownQuestion(getCurrentQuestion()) && (
                  <Select onValueChange={handleNext}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCurrentQuestion()!.options.map((option, i) => (
                        <SelectItem key={i} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {/* Slider */}
                {isSliderQuestion(getCurrentQuestion()) && (() => {
                  const question = getCurrentQuestion() as SliderQuestion;
                  return (
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Low ({question.min})</span>
                        <span>High ({question.max})</span>
                      </div>
                      <Slider 
                        defaultValue={[Math.floor((question.max + question.min) / 2)]}
                        min={question.min}
                        max={question.max}
                        step={1}
                        onValueChange={handleSliderChange}
                        onValueCommit={(value) => handleNext(value[0] + "/10")}
                        className="py-4"
                      />
                      <div className="text-center text-sm font-medium">
                        Selected: <span id="sliderValue">{Math.floor((question.max + question.min) / 2)}</span>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Results Page */}
          {section === 'results' && (
            <Card className="mx-auto max-w-4xl">
              <CardHeader>
                <CardTitle>Your AI Policy</CardTitle>
                <CardDescription>
                  Based on your responses, we've generated a customized AI policy for your educational institution.
                  {!isEditing ? " You can edit the policy before downloading." : " Edit the policy below."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Generating your AI policy...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert" ref={policyRef}>
                    <div className="pdf-container">
                      {isEditing ? (
                        <Textarea
                          value={editedPolicy}
                          onChange={handlePolicyChange}
                          className="min-h-[500px] font-mono text-sm"
                          placeholder="Edit your policy here..."
                        />
                      ) : (
                        <ReactMarkdown
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-6" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
                            p: ({node, ...props}) => <p className="my-4 leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4 space-y-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />,
                            li: ({node, ...props}) => <li className="my-1" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            hr: () => null // Remove any horizontal rules
                          }}
                        >
                          {response}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Reset to start
                    setSection("landing");
                    setQuestionIndex(0);
                    setResponse("");
                    setEditedPolicy("");
                    setIsEditing(false);
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={handleEditToggle}
                  >
                    {isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Policy
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={async () => {
                      // Download as PDF
                      if (policyRef.current) {
                        try {
                          // Dynamically import the libraries
                          const { jsPDF } = await import('jspdf');
                          
                          // Create a new PDF document
                          const pdf = new jsPDF({
                            orientation: 'portrait',
                            unit: 'in',
                            format: 'letter'
                          });
                          
                          // Set margins - increase bottom margin to ensure text doesn't hit the bottom
                          const margin = 1; // Increased from 0.5 to 0.75 inches
                          const pageWidth = pdf.internal.pageSize.getWidth();
                          const pageHeight = pdf.internal.pageSize.getHeight();
                          const contentWidth = pageWidth - (2 * margin);
                          const contentHeight = pageHeight - (2 * margin); // Define content height with margins
                          
                          // Set font
                          pdf.setFont('helvetica');
                          
                          // Process the Markdown content to extract text and structure
                          const processMarkdown = (markdown: string) => {
                            // Split by lines
                            const lines = markdown.split('\n');
                            let currentY = margin;
                            let currentFontSize = 12;
                            let currentFontStyle = 'normal';
                            
                            // Process each line
                            for (let i = 0; i < lines.length; i++) {
                              const line = lines[i].trim();
                              
                              // Skip empty lines
                              if (!line) {
                                currentY += 0.2; // Add some spacing
                                continue;
                              }
                              
                              // Check for headings
                              if (line.startsWith('# ')) {
                                // Main title
                                pdf.setFontSize(18);
                                pdf.setFont('helvetica', 'bold');
                                const title = line.substring(2).trim();
                                pdf.text(title, pageWidth / 2, currentY, { align: 'center' });
                                currentY += 0.4;
                                currentFontSize = 12;
                                currentFontStyle = 'normal';
                              } else if (line.startsWith('## ')) {
                                // Section heading
                                pdf.setFontSize(14);
                                pdf.setFont('helvetica', 'bold');
                                const heading = line.substring(3).trim();
                                pdf.text(heading, margin, currentY);
                                currentY += 0.3;
                                currentFontSize = 12;
                                currentFontStyle = 'normal';
                              } else if (line.startsWith('### ')) {
                                // Subsection heading
                                pdf.setFontSize(12);
                                pdf.setFont('helvetica', 'bold');
                                const subheading = line.substring(4).trim();
                                pdf.text(subheading, margin, currentY);
                                currentY += 0.25;
                                currentFontSize = 12;
                                currentFontStyle = 'normal';
                              } else if (line.startsWith('* ') || line.startsWith('- ')) {
                                // Bullet points
                                pdf.setFontSize(currentFontSize);
                                pdf.setFont('helvetica', currentFontStyle);
                                const bulletText = line.substring(2).trim();
                                
                                // Draw bullet point
                                pdf.text('•', margin + 0.1, currentY);
                                
                                // Handle text wrapping for bullet points
                                const bulletIndent = 0.3; // Indent for bullet point text
                                const bulletContentWidth = contentWidth - bulletIndent;
                                
                                // Split text into words to handle wrapping
                                const words = bulletText.split(' ');
                                let lineText = '';
                                let firstLine = true;
                                
                                for (let j = 0; j < words.length; j++) {
                                  const testLine = lineText + words[j] + ' ';
                                  const textWidth = pdf.getStringUnitWidth(testLine) * currentFontSize / 72;
                                  
                                  if (textWidth > bulletContentWidth && j > 0) {
                                    // Draw the current line
                                    pdf.text(lineText, margin + bulletIndent, currentY);
                                    currentY += 0.2;
                                    lineText = words[j] + ' ';
                                    firstLine = false;
                                  } else {
                                    lineText = testLine;
                                  }
                                }
                                
                                // Draw the last line
                                pdf.text(lineText, margin + bulletIndent, currentY);
                                currentY += 0.25;
                              } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || 
                                        line.startsWith('4. ') || line.startsWith('5. ') || line.startsWith('6. ') || 
                                        line.startsWith('7. ') || line.startsWith('8. ') || line.startsWith('9. ')) {
                                // Numbered lists
                                pdf.setFontSize(currentFontSize);
                                pdf.setFont('helvetica', currentFontStyle);
                                const number = line.substring(0, 2);
                                const listText = line.substring(3).trim();
                                
                                // Draw number
                                pdf.text(number, margin + 0.1, currentY);
                                
                                // Handle text wrapping for numbered lists
                                const listIndent = 0.3; // Indent for list text
                                const listContentWidth = contentWidth - listIndent;
                                
                                // Split text into words to handle wrapping
                                const words = listText.split(' ');
                                let lineText = '';
                                let firstLine = true;
                                
                                for (let j = 0; j < words.length; j++) {
                                  const testLine = lineText + words[j] + ' ';
                                  const textWidth = pdf.getStringUnitWidth(testLine) * currentFontSize / 72;
                                  
                                  if (textWidth > listContentWidth && j > 0) {
                                    // Draw the current line
                                    pdf.text(lineText, margin + listIndent, currentY);
                                    currentY += 0.2;
                                    lineText = words[j] + ' ';
                                    firstLine = false;
                                  } else {
                                    lineText = testLine;
                                  }
                                }
                                
                                // Draw the last line
                                pdf.text(lineText, margin + listIndent, currentY);
                                currentY += 0.25;
                              } else {
                                // Regular paragraph
                                pdf.setFontSize(currentFontSize);
                                pdf.setFont('helvetica', currentFontStyle);
                                
                                // Check if we need to start a new page
                                if (currentY > pageHeight - margin) {
                                  pdf.addPage();
                                  currentY = margin;
                                }
                                
                                // Split text into words to handle wrapping
                                const words = line.split(' ');
                                let lineText = '';
                                
                                for (let j = 0; j < words.length; j++) {
                                  const testLine = lineText + words[j] + ' ';
                                  const textWidth = pdf.getStringUnitWidth(testLine) * currentFontSize / 72;
                                  
                                  if (textWidth > contentWidth && j > 0) {
                                    pdf.text(lineText, margin, currentY);
                                    currentY += 0.2;
                                    lineText = words[j] + ' ';
                                  } else {
                                    lineText = testLine;
                                  }
                                }
                                
                                pdf.text(lineText, margin, currentY);
                                currentY += 0.25;
                              }
                              
                              // Check if we need to start a new page - ensure we have enough space for at least one more line
                              if (currentY > pageHeight - margin - 0.3) {
                                pdf.addPage();
                                currentY = margin;
                              }
                            }
                          };
                          
                          // Process the Markdown content - use the edited policy if in edit mode
                          processMarkdown(isEditing ? editedPolicy : response);
                          
                          // Save the PDF
                          pdf.save('AI_Policy_Document.pdf');
                        } catch (error) {
                          console.error("Error generating PDF:", error);
                          alert("There was an error generating the PDF. Please try again.");
                        }
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Policy
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 