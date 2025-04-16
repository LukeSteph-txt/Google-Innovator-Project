"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from 'react-markdown';
import { Download, RefreshCw, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";

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
  
  // State for current section and question
  const [section, setSection] = useState<SectionType>('landing');
  const [questionIndex, setQuestionIndex] = useState(0);

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
      const generateSection = async (sectionName: string, sectionPrompt: string) => {
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
        generateSection("Introduction and Rationale", introductionPrompt),
        generateSection("Permitted Use", permittedUsePrompt),
        generateSection("Prohibited Use", prohibitedUsePrompt),
        generateSection("Commitment to Staff Training", staffTrainingPrompt),
        generateSection("Privacy & Transparency", privacyPrompt),
        generateSection("Bias & Accessibility", biasPrompt),
        generateSection("Environmental Impact", environmentalPrompt),
        generateSection("Accountability & Enforcement", accountabilityPrompt),
        generateSection("Conclusion", conclusionPrompt)
      ]);

      // Combine all sections
      const combinedPolicy = `
# AI Policy for ${policyScope === "A district" ? "School District" : policyScope === "A school" ? "School" : "Classroom"}

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
      } else if (proofingData.error) {
        setResponse(`Error during final proofing: ${proofingData.error}`);
      } else {
        setResponse("No valid response received during final proofing.");
      }
    } catch (error) {
      console.error("Error generating policy:", error);
      setResponse("An error occurred while generating the policy. Please try again.");
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
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Generating your AI policy...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown>
                      {response}
                    </ReactMarkdown>
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
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
                <Button 
                  onClick={() => {
                    // Download functionality
                    const element = document.createElement("a");
                    const file = new Blob([response], {type: 'text/plain'});
                    element.href = URL.createObjectURL(file);
                    element.download = "AI_Policy_Document.txt";
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Policy
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 