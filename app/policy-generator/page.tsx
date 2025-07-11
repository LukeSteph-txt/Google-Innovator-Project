"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from 'react-markdown';
import { Download, RefreshCw, ArrowLeft, Edit, Save, Upload, X } from "lucide-react";
import Navbar from "@/components/navbar";
import { Textarea } from "@/components/ui/textarea";
import Footer from "@/components/footer";
import React, { Fragment } from 'react';
import rehypeRaw from 'rehype-raw';

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
type SectionType = 'landing' | 'location' | 'context' | 'demographics' | 'role' | 'teacherDevices' | 'teacherAccess' | 'studentDevices' | 'teacherAIUsage' | 'studentAIUsage' | 'staffAIliteracy' | 'studentAIliteracy' | 'environment' | 'priorities' | 'documents' | 'results';

interface UploadedDocument {
  filename: string;
  content: string;
}

// Preprocess: Replace Follow Up tags with <followup comment="...">...</followup>
function preprocessFollowUpTags(md: string) {
  // Replace all {{Follow Up (question)}} ... {{/Follow Up}} with a custom <followup comment="...">...</followup> tag
  md = md.replace(/\{\{Follow Up \((.*?)\)\}\}([\s\S]*?)\{\{\/Follow Up\}\}/g, (_match, comment, content) => {
    const cleanContent = String(content).replace(/^\s*\.\.\./, '').replace(/\.\.\.\s*$/, '').trim();
    const safeComment = String(comment).replace(/"/g, '&quot;');
    return `<followup comment="${safeComment}">${cleanContent}</followup>`;
  });
  // Replace all {{SurveyLink (explanation|section)}} ... {{/SurveyLink}} with <surveylink explanation="..." section="...">...</surveylink>
  md = md.replace(/\{\{SurveyLink \((.*?)\|(.*?)\)\}\}([\s\S]*?)\{\{\/SurveyLink\}\}/g, (_match, explanation, section, content) => {
    const cleanContent = String(content).trim();
    const safeExplanation = String(explanation).replace(/"/g, '&quot;');
    const safeSection = String(section).replace(/"/g, '&quot;');
    return `<surveylink explanation="${safeExplanation}" section="${safeSection}">${cleanContent}</surveylink>`;
  });
  // Replace all {{DocLink (filename|explanation)}} ... {{/DocLink}} with <doclink filename="..." explanation="...">...</doclink>
  md = md.replace(/\{\{DocLink \((.*?)\|(.*?)\)\}\}([\s\S]*?)\{\{\/DocLink\}\}/g, (_match, filename, explanation, content) => {
    const cleanContent = String(content).trim();
    const safeFilename = String(filename).replace(/"/g, '&quot;');
    const safeExplanation = String(explanation).replace(/"/g, '&quot;');
    return `<doclink filename="${safeFilename}" explanation="${safeExplanation}">${cleanContent}</doclink>`;
  });
  return md;
}

// Custom FollowUp highlight component
const FollowUp = ({ comment, children }: { comment: string, children: React.ReactNode }) => (
  <span
    style={{ background: '#a78bfa', color: '#fff', borderRadius: '4px', padding: '0.1em 0.3em', cursor: 'pointer', position: 'relative', display: 'inline' }}
    className="followup-highlight group"
    tabIndex={0}
    aria-label={comment}
  >
    {children}
    <span
      style={{
        visibility: 'hidden',
        background: '#6d28d9',
        color: '#fff',
        textAlign: 'left',
        borderRadius: '4px',
        padding: '0.5em 1em',
        position: 'absolute',
        zIndex: 10,
        left: '50%',
        top: '100%',
        transform: 'translateX(-50%)',
        whiteSpace: 'pre-line',
        minWidth: '200px',
        marginTop: '0.5em',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: '0.95em',
        opacity: 0,
        transition: 'opacity 0.2s',
        pointerEvents: 'none',
      }}
      className="followup-tooltip"
      role="tooltip"
    >
      {comment}
    </span>
    <style>{`
      .followup-highlight:hover .followup-tooltip,
      .followup-highlight:focus .followup-tooltip {
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }
    `}</style>
  </span>
);

// Custom highlight components
const sectionColors: Record<string, string> = {
  'Introduction and Rationale': '#f59e42',
  'Permitted Use': '#38bdf8',
  'Prohibited Use': '#ef4444',
  'Commitment to Staff Training': '#a3e635',
  'Privacy & Transparency': '#f472b6',
  'Bias & Accessibility': '#facc15',
  'Environmental Impact': '#34d399',
  'Accountability & Enforcement': '#818cf8',
  'Conclusion': '#fbbf24',
};

const SurveyLink = ({ explanation, section, children }: { explanation: string, section: string, children: React.ReactNode }) => (
  <span
    style={{
      background: sectionColors[section] || '#ddd',
      color: '#222',
      borderRadius: '4px',
      padding: '0.1em 0.3em',
      cursor: 'pointer',
      position: 'relative',
      display: 'inline',
      borderBottom: '2px dotted #555',
    }}
    className="surveylink-highlight group"
    tabIndex={0}
    aria-label={explanation}
  >
    {children}
    <span
      style={{
        visibility: 'hidden',
        background: '#222',
        color: '#fff',
        textAlign: 'left',
        borderRadius: '4px',
        padding: '0.5em 1em',
        position: 'absolute',
        zIndex: 10,
        left: '50%',
        top: '100%',
        transform: 'translateX(-50%)',
        whiteSpace: 'pre-line',
        minWidth: '200px',
        marginTop: '0.5em',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: '0.95em',
        opacity: 0,
        transition: 'opacity 0.2s',
        pointerEvents: 'none',
      }}
      className="surveylink-tooltip"
      role="tooltip"
    >
      <b>Survey Link ({section}):</b> {explanation}
    </span>
    <style>{`
      .surveylink-highlight:hover .surveylink-tooltip,
      .surveylink-highlight:focus .surveylink-tooltip {
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }
    `}</style>
  </span>
);

const DocLink = ({ filename, explanation, children }: { filename: string, explanation: string, children: React.ReactNode }) => (
  <span
    style={{
      background: '#6366f1',
      color: '#fff',
      borderRadius: '4px',
      padding: '0.1em 0.3em',
      cursor: 'pointer',
      position: 'relative',
      display: 'inline',
      borderBottom: '2px dashed #fff',
    }}
    className="doclink-highlight group"
    tabIndex={0}
    aria-label={explanation}
  >
    {children}
    <span
      style={{
        visibility: 'hidden',
        background: '#222',
        color: '#fff',
        textAlign: 'left',
        borderRadius: '4px',
        padding: '0.5em 1em',
        position: 'absolute',
        zIndex: 10,
        left: '50%',
        top: '100%',
        transform: 'translateX(-50%)',
        whiteSpace: 'pre-line',
        minWidth: '200px',
        marginTop: '0.5em',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: '0.95em',
        opacity: 0,
        transition: 'opacity 0.2s',
        pointerEvents: 'none',
      }}
      className="doclink-tooltip"
      role="tooltip"
    >
      <b>Document Link ({filename}):</b> {explanation}
    </span>
    <style>{`
      .doclink-highlight:hover .doclink-tooltip,
      .doclink-highlight:focus .doclink-tooltip {
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }
    `}</style>
  </span>
);

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
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  
  // State for API response
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPolicy, setEditedPolicy] = useState("");
  
  // State for current section and question
  const [section, setSection] = useState<SectionType>('landing');
  const [questionIndex, setQuestionIndex] = useState(0);

  const policyRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function generatePolicy() {
    setLoading(true);
    try {
      // Add uploaded documents to the context
      const uploadedDocsContext = uploadedDocuments.map(doc => 
        `Document "${doc.filename}":\n${doc.content}`
      ).join('\n\n');

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
            case "Bring Your Own Device (BYOD)":
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
          }
  
          return priorityDetails.join(" ");
        })(),
        uploadedDocumentsContext: uploadedDocsContext
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
          If uploaded documents are provided, carefully consider their content and incorporate relevant elements into the policy.
          
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
        
        UPLOADED DOCUMENTS:
        ${uploadedDocsContext}
        
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
        - Incorporate relevant elements from any uploaded documents
        
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
        
        IMPORTANT: Under no circumstances should the name of the school, district, or any specific institution be mentioned in the final policy document, even if it appears in uploaded documents or examples. Remove or replace any such names with generic terms like [Your School Name] or [Your District Name].
        
        1. Identify the three sentences in the final policy that would most benefit from user customization or review. For each, annotate the sentence using the following exact tag format:
        {{Follow Up (Your specific question for the user about customizing this sentence)}} ...policy text... {{/Follow Up}}
        The question in parentheses should be specific to what the user should consider or review for that sentence. Only annotate three sentences in total, and only those that are most likely to require user input or local adaptation.
        
        2. For any sentence or section that is directly influenced by a specific survey answer, annotate it using:
        {{SurveyLink (explanation|section)}} ...policy text... {{/SurveyLink}}
        Where 'explanation' is a brief note on how the survey answer affected the policy, and 'section' is the policy section name (e.g., "Commitment to Staff Training").
        
        3. For two sentences or sections that strongly align with the content of any uploaded document, annotate them using:
        {{DocLink (filename|explanation)}} ...policy text... {{/DocLink}}
        Where 'filename' is the name of the uploaded document, and 'explanation' is a brief note on how the content aligns.
        
        EXAMPLES:
        - If a sentence is directly influenced by a survey answer (e.g., "Staff AI literacy is low"), annotate it like this:
          {{SurveyLink (This section was added because you indicated staff AI literacy is low|Commitment to Staff Training)}} Staff will receive additional AI training days. {{/SurveyLink}}
        - If a sentence strongly aligns with an uploaded document (e.g., "MissionStatement.txt" says "equity is a core value"), annotate it like this:
          {{DocLink (MissionStatement.txt|This sentence reflects the core value of equity from your mission statement)}} The policy prioritizes equity in AI access. {{/DocLink}}
        
        You must include at least two SurveyLink and two DocLink annotations if possible, in addition to the three Follow Up tags.
        
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
      
      // Return a resolved promise to indicate success
      return Promise.resolve();
    } catch (error) {
      console.error("Error generating policy:", error);
      setResponse("An error occurred while generating the policy. Please try again.");
      setEditedPolicy("An error occurred while generating the policy. Please try again.");
      // Return a rejected promise to indicate failure
      return Promise.reject(error);
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
    teacherDevices: [
      {
        question: "What is your device policy?",
        type: 'regular',
        options: ["One-to-one", "Bring Your Own Device (BYOD)", "Computer Lab", "We have no comprehensive device policy"],
        setter: setDevicePolicy
      }
    ],
    teacherAccess: [
      {
        question: "What percentage of your teachers would you say has a device capable of accessing GenAI regularly?",
        type: 'regular',
        options: ["0-25%", "25-50%", "50-75%", "75-100%"],
        setter: setStaffDevicePercentage
      }
    ],
    studentDevices: [
      {
        question: "What percentage of your students has a device capable of accessing GenAI?",
        type: 'regular',
        options: ["0-25%", "25-50%", "50-75%", "75-100%"],
        setter: setStudentDevicePercentage
      }
    ],
    teacherAIUsage: [
      {
        question: "How frequently would you say your teachers are accessing any GenAI tools?",
        type: 'regular',
        options: ["Never", "Once in a while", "At least once a week", "Daily"],
        setter: setStaffGenAIFrequency
      }
    ],
    studentAIUsage: [
      {
        question: "How frequently would you say your students are accessing any GenAI tools?",
        type: 'regular',
        options: ["Never", "Once in a while", "At least once a week", "Daily"],
        setter: setStudentGenAIFrequency
      }
    ],
    staffAIliteracy: [
      {
        question: "What percentage of your staff would you say has basic AI literacy?",
        type: 'regular',
        options: ["0-25%", "25-50%", "50-75%", "75-100%"],
        setter: setStaffAILiteracy
      },
    ],
    studentAIliteracy: [
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
        question: "What is the most critical item that you want the policy to address? (Select a maximum of two)",
        type: 'regular',
        options: [
          "Academic Dishonesty among Students",
          "Data security and privacy for all users within the organization",
          "Environmental Impact",
          "Basic Legal Compliance",
          "Ongoing training and AI Literacy Development",
          "Student Learning Outcomes"
        ],
        setter: setCriticalPriority
      }
    ],
    documents: [],
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
      const sectionOrder: SectionType[] = ["landing", "location", "context", "demographics", "role", "teacherDevices", "teacherAccess", "studentDevices", "teacherAIUsage", "studentAIUsage", "staffAIliteracy", "studentAIliteracy", "environment", "priorities", "documents", "results"];
      const currentIndex = sectionOrder.indexOf(section);
      const nextSection = sectionOrder[currentIndex + 1] as SectionType;
      
      if (nextSection) {
        setSection(nextSection);
        setQuestionIndex(0);
      }
    }
  };

  // Function to handle going back to previous question or section
  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else {
      // Go back to previous section
      const sectionOrder: SectionType[] = ["landing", "location", "context", "demographics", "role", "teacherDevices", "teacherAccess", "studentDevices", "teacherAIUsage", "studentAIUsage", "staffAIliteracy", "studentAIliteracy", "environment", "priorities", "documents", "results"];
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
      teacherDevices: "Institutional Device Policy",
      teacherAccess: "Teacher Device Access",
      studentDevices: "Student Device Access",
      teacherAIUsage: "Teacher GenAI Usage",
      studentAIUsage: "Student GenAI Usage",
      staffAIliteracy: "Staff GenAI Literacy Level",
      studentAIliteracy: "Student GenAI Literacy Level",
      environment: "Environmental Impact",
      priorities: "Policy Priorities",
      documents: "Upload Supporting Documents",
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

  // Function to handle priority selection
  const handlePrioritySelection = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      // Remove priority if already selected
      setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
    } else if (selectedPriorities.length < 2) {
      // Add priority if less than 2 are selected
      setSelectedPriorities([...selectedPriorities, priority]);
    }
  };

  // Function to handle priority submission
  const handlePrioritySubmit = () => {
    if (selectedPriorities.length > 0) {
      // Set the critical priority to the first selected priority
      setCriticalPriority(selectedPriorities[0]);
      
      // Move to documents section instead of generating policy
      setSection("documents");
      setQuestionIndex(0);
    }
  };

  // Function to handle document submission and policy generation
  const handleDocumentSubmit = () => {
    // Set loading state to true
    setLoading(true);
    
    // Generate the policy
    generatePolicy().then(() => {
      // After policy generation, navigate to results page
      setSection("results");
      setLoading(false);
    }).catch(error => {
      console.error("Error generating policy:", error);
      setLoading(false);
    });
  };

  // Effect for rotating loading messages
  useEffect(() => {
    if (loading) {
      const messages = [
        "Analyzing school details...",
        "Generating school policy...",
        "Refining GenAI policy...",
        "Finalizing details...",
        "Styling the policy..."
      ];
      
      let currentIndex = 0;
      setLoadingMessage(messages[currentIndex]);
      
      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % messages.length;
        setLoadingMessage(messages[currentIndex]);
      }, 7000); // Change message every 7 seconds
      
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Render the priorities section with checkboxes and submit button
  const renderPrioritiesSection = () => {
    return (
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
          <div className="grid grid-cols-1 gap-4">
            {getCurrentQuestion()!.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`priority-${i}`}
                  checked={selectedPriorities.includes(option)}
                  onChange={() => handlePrioritySelection(option)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor={`priority-${i}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handlePrioritySubmit}
            disabled={selectedPriorities.length === 0 || loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Policy...
              </div>
            ) : (
              "Generate Policy"
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      let textContent: string;
      let fileName = file.name;

      if (file.type === 'application/pdf') {
        // Only run in the browser
        if (typeof window !== 'undefined') {
          // Load PDF.js from CDN if not already loaded
          // @ts-ignore
          if (!window.pdfjsLib) {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
              script.onload = resolve;
              script.onerror = reject;
              document.body.appendChild(script);
            });
          }
          // @ts-ignore
          const pdfjsLib = window.pdfjsLib;
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            text += strings.join(' ') + '\n';
          }
          textContent = text;
          fileName = fileName.replace(/\.pdf$/i, '.txt');
        } else {
          throw new Error('PDF parsing is only supported in the browser.');
        }
      } else if (file.type === 'text/plain') {
        textContent = await file.text();
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or text file.');
      }

      // Create a new text file from the content
      const textFile = new File([textContent], fileName, { type: 'text/plain' });
      
      // Upload the text file
      const formData = new FormData();
      formData.append('file', textFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload file');
        } else {
          throw new Error('Server returned non-JSON response');
        }
      }

      const data = await response.json();
      setUploadedDocuments(prev => [...prev, {
        filename: fileName,
        content: data.content
      }]);
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else if (typeof error === 'object' && error !== null) {
        alert(JSON.stringify(error));
      } else {
        alert('Failed to upload file: ' + String(error));
      }
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const removeDocument = (filename: string) => {
    setUploadedDocuments(uploadedDocuments.filter(doc => doc.filename !== filename));
  };

  const renderFileUpload = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF or TXT files</p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>
      {uploadedDocuments.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded Documents:</h3>
          <ul className="space-y-2">
            {uploadedDocuments.map((doc) => (
              <li
                key={doc.filename}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm truncate">{doc.filename}</span>
                <button
                  onClick={() => removeDocument(doc.filename)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // Render the document upload section
  const renderDocumentsSection = () => {
    return (
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
            Upload any existing documents that you'd like to be considered when generating your policy. This step is optional but can help create a more tailored policy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              You can upload documents such as:
            </div>
            <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
              <li>Existing school policies</li>
              <li>School mission statements</li>
              <li>Technology guidelines</li>
              <li>Any other relevant documents</li>
            </ul>
            {renderFileUpload()}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleDocumentSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Policy...
              </div>
            ) : (
              "Generate Policy"
            )}
          </Button>
        </CardFooter>
      </Card>
    );
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
            <h1 className="text-4xl font-bold tracking-tight">AI Policy Pathway</h1>
            <p className="mt-2 text-muted-foreground">
              Create a customized AI policy for your educational institution
            </p>
          </div>

          {/* Progress indicator */}
          {section !== 'landing' && section !== 'results' && (
            <div className="mb-8">
              <div className="flex justify-between mb-2 text-sm">
                <span>Context</span>
                <span>Demographics</span>
                <span>Access</span>
                <span>AI Literacy</span>
                <span>Priorities</span>
                <span>Documents</span>
              </div>
              <Progress 
                value={loading ? 100 : (() => {
                  // Define the section order
                  const sectionOrder: SectionType[] = ["landing", "location", "context", "demographics", "role", "teacherDevices", "teacherAccess", "studentDevices", "teacherAIUsage", "studentAIUsage", "staffAIliteracy", "studentAIliteracy", "environment", "priorities", "documents", "results"];
                  
                  // Define which sections belong to which topic
                  const topicSections: Record<string, SectionType[]> = {
                    context: ['location', 'context'],
                    demographics: ['demographics', 'role'],
                    access: ['teacherDevices', 'studentDevices', 'teacherAIUsage', 'studentAIUsage'],
                    aiLiteracy: ['staffAIliteracy', 'studentAIliteracy'],
                    priorities: ['environment', 'priorities'],
                    documents: ['documents']
                  };
                  
                  // Calculate progress based on completed topics
                  let completedTopics = 0;
                  const totalTopics = 6; // Context, Demographics, Access, AI Literacy, Priorities, Documents
                  
                  // Check if we've completed the context topic
                  if (sectionOrder.indexOf(section) > sectionOrder.indexOf('context')) {
                    completedTopics++;
                  }
                  
                  // Check if we've completed the demographics topic
                  if (sectionOrder.indexOf(section) > sectionOrder.indexOf('role')) {
                    completedTopics++;
                  }
                  
                  // Check if we've completed the access topic
                  if (sectionOrder.indexOf(section) > sectionOrder.indexOf('studentAIUsage')) {
                    completedTopics++;
                  }
                  
                  // Check if we've completed the AI literacy topic
                  if (sectionOrder.indexOf(section) > sectionOrder.indexOf('studentAIliteracy')) {
                    completedTopics++;
                  }
                  
                  // Check if we've completed the priorities topic
                  if (sectionOrder.indexOf(section) > sectionOrder.indexOf('priorities')) {
                    completedTopics++;
                  }
                  
                  // Check if we've completed the documents topic
                  if (sectionOrder.indexOf(section) > sectionOrder.indexOf('documents')) {
                    completedTopics++;
                  }
                  
                  // Calculate base percentage
                  let percentage = (completedTopics / totalTopics) * 100;
                  
                  // Add offset for priorities section to make the progress bar extend further
                  if (section === 'environment' || section === 'priorities') {
                    // Add 10% offset to make the progress bar extend further
                    percentage += 10;
                  }
                  
                  // Add offset for AI Literacy categories
                  if (section === 'staffAIliteracy' || section === 'studentAIliteracy') {
                    // Add 5% offset to make the progress bar extend further
                    percentage += 5;
                  }
                  
                  // Ensure percentage doesn't exceed 100%
                  return Math.min(percentage, 100);
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
              <CardContent>
              </CardContent>
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
          {section !== 'landing' && section !== 'results' && section !== 'priorities' && section !== 'documents' && (
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

          {/* Priorities Section with Checkboxes */}
          {section === 'priorities' && renderPrioritiesSection()}

          {/* Documents Section */}
          {section === 'documents' && renderDocumentsSection()}

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
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary mb-6"></div>
                    <p className="text-xl font-medium text-primary">{loadingMessage}</p>
                  </div>
                ) : (
                  <div className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert" ref={policyRef}>
                    {isEditing ? (
                      <Textarea
                        value={editedPolicy}
                        onChange={handlePolicyChange}
                        className="min-h-[500px] font-mono text-sm"
                        placeholder="Edit your policy here..."
                      />
                    ) : (
                      <ReactMarkdown rehypePlugins={[rehypeRaw]} components={{
                        ...( {
                          followup({ node, children, ...props }: any) {
                            const comment = node.properties?.comment || '';
                            return <FollowUp comment={comment}>{children}</FollowUp>;
                          },
                          surveylink({ node, children, ...props }: any) {
                            const explanation = node.properties?.explanation || '';
                            const section = node.properties?.section || '';
                            return <SurveyLink explanation={explanation} section={section}>{children}</SurveyLink>;
                          },
                          doclink({ node, children, ...props }: any) {
                            const filename = node.properties?.filename || '';
                            const explanation = node.properties?.explanation || '';
                            return <DocLink filename={filename} explanation={explanation}>{children}</DocLink>;
                          },
                        } as any )
                      }}>
                        {preprocessFollowUpTags(response)}
                      </ReactMarkdown>
                    )}
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
                    setSelectedPriorities([]);
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