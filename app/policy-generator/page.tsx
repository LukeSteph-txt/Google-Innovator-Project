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
import { Textarea } from "@/components/ui/textarea";
import Footer from "@/components/footer";

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
  subQuestions?: SubQuestion[];
  setter: (value: string) => void;
}

interface SubQuestion {
  question: string;
  options: string[];
  setter: (value: string) => void;
  type: 'regular';
}

interface DropdownQuestion extends BaseQuestion {
  type: 'dropdown';
}

interface SliderQuestion extends BaseQuestion {
  type: 'slider';
  min: number;
  max: number;
}

interface RegularQuestion extends BaseQuestion {
  type: 'regular';
}

type Question = DropdownQuestion | SliderQuestion | RegularQuestion;

// Define section type
type SectionType = 'landing' | 'location' | 'context' | 'demographics' | 'role' | 'devices' | 'literacy' | 'environment' | 'priorities' | 'results';

export default function PolicyGenerator() {
  // State for tracking if user has started the process
  const [started, setStarted] = useState(false);
  
  // States for user responses
  const [state, setState] = useState("");
  const [policyScope, setPolicyScope] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [role, setRole] = useState("");
  const [devicePolicy, setDevicePolicy] = useState("");
  const [staffDevicePercentage, setStaffDevicePercentage] = useState("");
  const [staffGenAIFrequency, setStaffGenAIFrequency] = useState("");
  const [studentDevicePercentage, setStudentDevicePercentage] = useState("");
  const [studentGenAIFrequency, setStudentGenAIFrequency] = useState("");
  const [leaderAILiteracy, setLeaderAILiteracy] = useState("");
  const [staffAILiteracy, setStaffAILiteracy] = useState("");
  const [studentAILiteracy, setStudentAILiteracy] = useState("");
  const [environmentalAwareness, setEnvironmentalAwareness] = useState("");
  const [criticalPriority, setCriticalPriority] = useState("");
  
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
        // Location and Context Section
        locationContext: (() => {
          let locationDetails = [];
          
          // Context based on policy scope
          switch(policyScope) {
            case "A district":
              locationDetails.push("This policy covers a comprehensive district-wide approach to AI usage.");
              break;
            case "A school":
              locationDetails.push("This policy is tailored to a specific school's AI integration strategy.");
              break;
            case "A classroom":
              locationDetails.push("This policy focuses on classroom-level AI implementation and guidelines.");
              break;
          }
  
          // Context based on age group
          switch(ageGroup) {
            case "Under 13 (K-3, 4-6, 6-8)":
              locationDetails.push("Special consideration must be given to the digital safety of young learners.");
              locationDetails.push("Parental consent and monitoring are critical for AI interactions.");
              break;
            case "Over 13-18 (9-12)":
              locationDetails.push("Emphasize critical thinking and ethical use of AI technologies.");
              locationDetails.push("Prepare students for responsible AI engagement.");
              break;
            case "College Students (Over 18)":
              locationDetails.push("Focus on professional and academic integrity in AI usage.");
              locationDetails.push("Emphasize research and innovation with AI tools.");
              break;
          }
  
          return locationDetails.join(" ");
        })(),
  
        // Device Access Section
        deviceContext: (() => {
          let deviceDetails = [];
  
          // Device policy context
          switch(devicePolicy) {
            case "One-to-one":
              deviceDetails.push("Comprehensive device access enables consistent AI integration across all learning activities.");
              break;
            case "BYOD":
              deviceDetails.push("Policy must account for varying device capabilities and ensure equitable access.");
              break;
            case "Computer Lab":
              deviceDetails.push("AI usage is primarily limited to scheduled lab sessions.");
              break;
            case "We have no comprehensive device policy":
              deviceDetails.push("Policy needs to address varying levels of device access and capabilities.");
              break;
          }
  
          // Staff and student usage context
          switch(staffDevicePercentage) {
            case "0-25%":
              deviceDetails.push("Limited staff device access necessitates careful AI rollout planning.");
              break;
            case "25-50%":
              deviceDetails.push("Moderate staff device access requires balanced AI implementation.");
              break;
            case "50-75%":
              deviceDetails.push("Most staff have device access, enabling widespread AI integration.");
              break;
            case "75-100%":
              deviceDetails.push("Staff are well-equipped for AI integration.");
              break;
          }
  
          switch(studentDevicePercentage) {
            case "0-25%":
              deviceDetails.push("Limited student device access requires alternative AI access strategies.");
              break;
            case "25-50%":
              deviceDetails.push("Mixed student device access requires flexible AI implementation.");
              break;
            case "50-75%":
              deviceDetails.push("Most students have device access, enabling widespread AI integration.");
              break;
            case "75-100%":
              deviceDetails.push("Students have widespread access to AI tools.");
              break;
          }
  
          return deviceDetails.join(" ");
        })(),
  
        // AI Literacy Section
        literacyContext: (() => {
          let literacyDetails = [];
  
          switch(leaderAILiteracy) {
            case "0-25%":
              literacyDetails.push("Limited leadership AI literacy necessitates extensive training programs.");
              break;
            case "25-50%":
              literacyDetails.push("Moderate leadership AI literacy requires additional training and support.");
              break;
            case "50-75%":
              literacyDetails.push("Most leaders have a good understanding of AI, enabling effective policy implementation.");
              break;
            case "75-100%":
              literacyDetails.push("Strong leadership understanding of AI enables comprehensive policy implementation.");
              break;
          }
  
          switch(staffAILiteracy) {
            case "0-25%":
              literacyDetails.push("Staff require significant training in AI usage and implementation.");
              break;
            case "25-50%":
              literacyDetails.push("Staff need moderate support in AI integration.");
              break;
            case "50-75%":
              literacyDetails.push("Most staff are prepared to implement AI in educational contexts.");
              break;
            case "75-100%":
              literacyDetails.push("Staff are well-prepared to implement AI in educational contexts.");
              break;
          }
  
          switch(studentAILiteracy) {
            case "0-25%":
              literacyDetails.push("Students require fundamental AI literacy education.");
              break;
            case "25-50%":
              literacyDetails.push("Students need guidance in responsible AI usage.");
              break;
            case "50-75%":
              literacyDetails.push("Most students are equipped to engage with AI tools responsibly.");
              break;
            case "75-100%":
              literacyDetails.push("Students are well-equipped to engage with AI tools responsibly.");
              break;
          }
  
          return literacyDetails.join(" ");
        })(),
  
        // Environmental Impact Section
        environmentContext: (() => {
          let environmentDetails = [];
  
          switch(environmentalAwareness) {
            case "Not aware at all":
              environmentDetails.push("Policy needs to establish basic environmental considerations for AI usage.");
              break;
            case "Somewhat aware":
              environmentDetails.push("Policy should build upon existing environmental awareness.");
              break;
            case "Very aware":
              environmentDetails.push("Policy can incorporate advanced environmental impact considerations.");
              break;
          }
  
          return environmentDetails.join(" ");
        })(),
  
        // Priority Section
        priorityContext: (() => {
          let priorityDetails = [];
  
          switch(criticalPriority) {
            case "Academic Dishonesty among Students":
              priorityDetails.push("Policy emphasizes robust academic integrity measures.");
              break;
            case "Data security and privacy for all users within the organization":
              priorityDetails.push("Policy prioritizes comprehensive data protection protocols.");
              break;
            case "Environmental Impact":
              priorityDetails.push("Policy focuses on sustainable AI implementation.");
              break;
            case "Basic Legal Compliance":
              priorityDetails.push("Policy ensures adherence to all relevant regulations.");
              break;
            case "Ongoing training and AI Literacy Development":
              priorityDetails.push("Policy emphasizes continuous learning and skill development.");
              break;
            case "Student Learning Outcomes":
              priorityDetails.push("Policy centers on enhancing educational effectiveness.");
              break;
            case "All of the above":
              priorityDetails.push("Policy addresses all key areas comprehensively.");
              break;
            case "None of the above":
              priorityDetails.push("Policy will be customized based on specific institutional needs.");
              break;
          }
  
          return priorityDetails.join(" ");
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
          If the age group is specified, use age-appropriate language and considerations.
          If the state is specified, include relevant state-specific regulations or guidelines.
          If device access and usage patterns are mentioned, address those specific needs.
          If AI literacy levels are specified, tailor the guidelines accordingly.
          If environmental awareness is provided, adjust the environmental impact section accordingly.
          If specific priorities are mentioned, emphasize those areas in the policy.
          
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
        - Role: ${role}
        - Device Policy: ${devicePolicy}
        - Staff Device Access: ${staffDevicePercentage}
        - Staff GenAI Usage: ${staffGenAIFrequency}
        - Student Device Access: ${studentDevicePercentage}
        - Student GenAI Usage: ${studentGenAIFrequency}
        - Leader AI Literacy: ${leaderAILiteracy}
        - Staff AI Literacy: ${staffAILiteracy}
        - Student AI Literacy: ${studentAILiteracy}
        - Environmental Awareness: ${environmentalAwareness}
        - Critical Priority: ${criticalPriority}
        
        CONTEXTUAL INSIGHTS:
        ${policyContext.locationContext}
        ${policyContext.deviceContext}
        ${policyContext.literacyContext}
        ${policyContext.environmentContext}
        ${policyContext.priorityContext}
        
        Generate the Introduction and Rationale section of the AI policy. This section should:
        - Explain the purpose of the policy
        - Provide context for why AI integration is important
        - Outline the benefits of AI in education
        - Set the tone for the rest of the policy
        - Reference the specific context of this ${policyScope} (${ageGroup} students in ${state})
        - Address the specific needs related to device access and usage patterns
        - Mention the level of AI literacy across different groups
        - Include environmental considerations based on awareness level
        - Emphasize the critical priority identified
        
        IMPORTANT: Do not use specific percentages or numbers in the policy. Instead, use qualitative language like "most students," "some staff," "limited access," etc.
      `;
      
      const permittedUsePrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Device Policy: ${devicePolicy}
        - Staff Device Access: ${staffDevicePercentage}
        - Staff GenAI Usage: ${staffGenAIFrequency}
        - Student Device Access: ${studentDevicePercentage}
        - Student GenAI Usage: ${studentGenAIFrequency}
        - Leader AI Literacy: ${leaderAILiteracy}
        - Staff AI Literacy: ${staffAILiteracy}
        - Student AI Literacy: ${studentAILiteracy}
        
        CONTEXTUAL INSIGHTS:
        ${policyContext.deviceContext}
        ${policyContext.literacyContext}
        
        Generate the Permitted Use section of the AI policy. This section should:
        - Clearly outline what uses of AI are permitted and encouraged
        - Provide specific examples of acceptable AI usage
        - Explain how AI can supplement student learning
        - Include guidelines for teachers on how to incorporate AI
        - Tailor the permitted uses to the specific age group (${ageGroup})
        - Consider the device access patterns and capabilities
        - Address AI literacy levels across different groups
        - Include state-specific considerations for ${state}
        
        IMPORTANT: Do not use specific percentages or numbers in the policy. Instead, use qualitative language like "most students," "some staff," "limited access," etc.
      `;
      
      const prohibitedUsePrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Critical Priority: ${criticalPriority}
        
        Generate the Prohibited Use section of the AI policy. This section should:
        - Clearly outline what uses of AI are prohibited
        - Address academic integrity concerns
        - Provide specific examples of unacceptable AI usage
        - Explain the consequences of policy violations
        - Tailor the prohibited uses to the specific age group (${ageGroup})
        - Address the specific critical priority (${criticalPriority})
        - Include state-specific considerations for ${state}
        
        IMPORTANT: Do not use specific percentages or numbers in the policy. Instead, use qualitative language like "most students," "some staff," "limited access," etc.
      `;
      
      const staffTrainingPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Leader AI Literacy: ${leaderAILiteracy}
        - Staff AI Literacy: ${staffAILiteracy}
        - Critical Priority: ${criticalPriority}
        
        Generate the Commitment to Staff Training section of the AI policy. This section should:
        - Outline the school's commitment to training staff on AI usage
        - Describe the types of training that will be provided
        - Explain how staff will be supported in implementing AI tools
        - Include guidelines for ongoing professional development
        - Tailor the training approach to the specific age group (${ageGroup})
        - Address the current AI literacy levels
        - Address the specific critical priority (${criticalPriority})
        - Include state-specific considerations for ${state}
        
        IMPORTANT: Do not use specific percentages or numbers in the policy. Instead, use qualitative language like "most leaders," "some staff," "limited literacy," etc.
      `;
      
      const privacyPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Critical Priority: ${criticalPriority}
        
        Generate the Privacy & Transparency section of the AI policy. This section should:
        - Address data privacy concerns
        - Outline disclosure rules
        - Explain how student data will be protected
        - Include guidelines for transparency in AI usage
        - Tailor privacy considerations to the specific age group (${ageGroup})
        - Address the specific critical priority (${criticalPriority})
        - Include state-specific privacy regulations for ${state}
        
        IMPORTANT: Do not use specific percentages or numbers in the policy. Instead, use qualitative language like "most students," "some staff," "limited access," etc.
      `;
      
      const biasPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Device Policy: ${devicePolicy}
        - Staff Device Access: ${staffDevicePercentage}
        - Student Device Access: ${studentDevicePercentage}
        
        Generate the Bias & Accessibility section of the AI policy. This section should:
        - Address potential bias in AI tools
        - Outline strategies for ensuring equitable access
        - Explain how the policy promotes inclusivity
        - Include guidelines for selecting unbiased AI tools
        - Tailor bias considerations to the specific age group (${ageGroup})
        - Address device access disparities
        - Include state-specific considerations for ${state}
        
        IMPORTANT: Do not use specific percentages or numbers in the policy. Instead, use qualitative language like "most students," "some staff," "limited access," etc.
      `;
      
      const environmentalPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Environmental Awareness: ${environmentalAwareness}
        - Critical Priority: ${criticalPriority}
        
        Generate the Environmental Impact section of the AI policy. This section should:
        - Address the environmental impact of AI technologies
        - Outline strategies for minimizing carbon footprint
        - Explain how the school will promote sustainable AI usage
        - Include specific environmental goals and commitments
        - Tailor environmental considerations to the specific age group (${ageGroup})
        - Address the level of environmental awareness (${environmentalAwareness})
        - Include specific commitments based on critical priority (${criticalPriority})
        - Include state-specific environmental considerations for ${state}
        
        IMPORTANT: Do not use specific percentages or numbers in the policy. Instead, use qualitative language like "most students," "some staff," "limited access," etc.
      `;
      
      const accountabilityPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Critical Priority: ${criticalPriority}
        
        Generate the Accountability & Enforcement section of the AI policy. This section should:
        - Outline how the policy will be enforced
        - Describe the roles and responsibilities of different stakeholders
        - Explain the consequences of policy violations
        - Include guidelines for monitoring and evaluation
        - Tailor accountability measures to the specific age group (${ageGroup})
        - Address the specific critical priority (${criticalPriority})
        - Include state-specific considerations for ${state}
        
        IMPORTANT: Do not use specific percentages or numbers in the policy. Instead, use qualitative language like "most students," "some staff," "limited access," etc.
      `;
      
      const conclusionPrompt = `
        POLICY PARAMETERS:
        - Policy Scope: ${policyScope}
        - Age Group: ${ageGroup}
        - State: ${state}
        - Device Policy: ${devicePolicy}
        - Staff Device Access: ${staffDevicePercentage}
        - Staff GenAI Usage: ${staffGenAIFrequency}
        - Student Device Access: ${studentDevicePercentage}
        - Student GenAI Usage: ${studentGenAIFrequency}
        - Leader AI Literacy: ${leaderAILiteracy}
        - Staff AI Literacy: ${staffAILiteracy}
        - Student AI Literacy: ${studentAILiteracy}
        - Environmental Awareness: ${environmentalAwareness}
        - Critical Priority: ${criticalPriority}
        
        CONTEXTUAL INSIGHTS:
        ${policyContext.locationContext}
        ${policyContext.deviceContext}
        ${policyContext.literacyContext}
        ${policyContext.environmentContext}
        ${policyContext.priorityContext}
        
        Generate the Conclusion section of the AI policy. This section should:
        - Summarize the key points of the policy
        - Reinforce the school's commitment to responsible AI usage
        - Outline the next steps for implementation
        - Include a statement about the policy's evolution over time
        - Reference the specific context of this ${policyScope} (${ageGroup} students in ${state})
        - Address the specific needs related to device access and usage patterns
        - Mention the level of AI literacy across different groups
        - Include environmental considerations based on awareness level
        - Emphasize the critical priority identified
        
        IMPORTANT: Do not use specific percentages or numbers in the policy. Instead, use qualitative language like "most students," "some staff," "limited access," etc.
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
    location: [
      {
        question: "What state is your school located in?",
        type: 'dropdown',
        options: usStates,
        setter: setState
      }
    ],
    context: [
      {
        question: "Is this policy for:",
        type: 'regular',
        options: ["A district", "A school", "A classroom"],
        setter: setPolicyScope
      }
    ],
    demographics: [
      {
        question: "How old are the impacted students?",
        type: 'regular',
        options: ["Under 13 (K-3, 4-6, 6-8)", "Over 13-18 (9-12)", "College Students (Over 18)"],
        setter: setAgeGroup
      }
    ],
    role: [
      {
        question: "I am:",
        type: 'regular',
        options: [
          "A district-level leader (Superintendent, etc.)", 
          "A district-level tech Leader (CTO or IT Director, etc.)", 
          "A site leader (Principal, etc.)", 
          "A classroom teacher", 
          "Other (consultant, tech trainer, etc.)"
        ],
        setter: setRole
      }
    ],
    devices: [
      {
        question: "What is your device policy?",
        type: 'regular',
        options: ["One-to-one", "BYOD", "Computer Lab", "We have no comprehensive device policy"],
        setter: setDevicePolicy
      },
      {
        question: "What percentage of your staff would you say has a device capable of accessing GenAI regularly?",
        type: 'regular',
        options: ["0-25%", "25-50%", "50-75%", "75-100%"],
        setter: setStaffDevicePercentage
      },
      {
        question: "How frequently would you say your staff is accessing any GenAI tools?",
        type: 'regular',
        options: ["Never", "Once in a while", "At least once a week", "Daily"],
        setter: setStaffGenAIFrequency
      },
      {
        question: "What percentage of your student body has a device capable of accessing GenAI?",
        type: 'regular',
        options: ["0-25%", "25-50%", "50-75%", "75-100%"],
        setter: setStudentDevicePercentage
      },
      {
        question: "How frequently would you say your students are accessing any GenAI tools?",
        type: 'regular',
        options: ["Never", "Once in a while", "At least once a week", "Daily"],
        setter: setStudentGenAIFrequency
      }
    ],
    literacy: [
      {
        question: "What percentage of your staff would you say has basic AI literacy?",
        type: 'regular',
        options: ["0-25%", "25-50%", "50-75%", "75-100%"],
        setter: setStaffAILiteracy
      },
      {
        question: "What percentage of your students would you say has basic AI literacy?",
        type: 'regular',
        options: ["0-25%", "25-50%", "50-75%", "75-100%"],
        setter: setStudentAILiteracy
      }
    ],
    environment: [
      {
        question: "How aware is your organization of the environmental impact of GenAI?",
        type: 'regular',
        options: ["Not aware at all", "Somewhat aware", "Very aware"],
        setter: setEnvironmentalAwareness
      }
    ],
    priorities: [
      {
        question: "What is the most critical item that you want the policy to address?",
        type: 'regular',
        options: [
          "Academic Dishonesty among Students",
          "Data security and privacy for all users within the organization",
          "Environmental Impact",
          "Basic Legal Compliance",
          "Ongoing training and AI Literacy Development",
          "Student Learning Outcomes",
          "All of the above",
          "None of the above"
        ],
        setter: setCriticalPriority
      }
    ],
    results: []
  };

  // Function to start the process
  const startProcess = () => {
    setStarted(true);
    setSection("location");
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
      const sectionOrder: SectionType[] = ["landing", "location", "context", "demographics", "role", "devices", "literacy", "environment", "priorities", "results"]; 
      const currentIndex = sectionOrder.indexOf(section);
      const nextSection = sectionOrder[currentIndex + 1] as SectionType;
      
      if (nextSection) {
        setSection(nextSection);
        setQuestionIndex(0);
        
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
      const sectionOrder: SectionType[] = ["landing", "location", "context", "demographics", "role", "devices", "literacy", "environment", "priorities", "results"];
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
      location: "Geographical Location",
      context: "Policy Context",
      demographics: "Student Demographics",
      role: "Your Role",
      devices: "Device Access",
      literacy: "AI Literacy Level",
      environment: "Environmental Impact",
      priorities: "Policy Priorities",
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
  const isDropdownQuestion = (question: Question | null): question is DropdownQuestion => {
    return question !== null && 'type' in question && question.type === 'dropdown';
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
                <span>Location</span>
                <span>Context</span>
                <span>Demographics</span>
                <span>Role</span>
                <span>Devices</span>
                <span>Literacy</span>
                <span>Environment</span>
                <span>Priorities</span>
              </div>
              <Progress 
                value={(() => {
                  const sectionValues: Record<SectionType, number> = { 
                    landing: 0,
                    location: 12.5, 
                    context: 25, 
                    demographics: 37.5, 
                    role: 50, 
                    devices: 62.5, 
                    literacy: 75, 
                    environment: 87.5, 
                    priorities: 100, 
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
                {!isDropdownQuestion(getCurrentQuestion()) && (
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
        <div className="mt-16">
          <Footer />
        </div>
      </div>
    </div>
  );
} 