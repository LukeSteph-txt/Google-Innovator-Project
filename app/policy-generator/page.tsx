"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ReactMarkdown from 'react-markdown';
import { Download, RefreshCw } from "lucide-react";

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
  

      const systemPrompt = `
        You are a tool that helps educators outline and format policy towards AI based on the following comprehensive analysis. Make sure to utilize all the information provided to you.
      `;

      // Combine all contexts into a comprehensive prompt
      const prompt = `
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
  
        1. PRIVACY CONSIDERATIONS:
        ${policyContext.privacyContext}
  
        2. BIAS AND INCLUSIVITY:
        ${policyContext.biasContext}
  
        3. LEARNING AND ACADEMIC INTEGRITY:
        ${policyContext.learningContext}
  
        4. ENVIRONMENTAL RESPONSIBILITY:
        ${policyContext.environmentContext}
  
        POLICY GENERATION INSTRUCTIONS:
        Please generate a comprehensive, nuanced AI policy document that:
        - Addresses the specific needs of the identified educational context
        - Provides clear, actionable guidelines
        - Considers the unique combination of parameters provided
        - Offers both strategic overview and detailed implementation suggestions
        - Ensures ethical, inclusive, and responsible AI usage
  
        Format the policy with clear sections including:
        - Introduction and Rationale
        - Scope and Applicability
        - Detailed Guidelines
        - Implementation Strategies
        - Monitoring and Compliance
        - Future Adaptability
      `;
      
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ systemPrompt, prompt }),
      });
      
      const data = await response.json();
      
      if (data.content) {
        setResponse(data.content);
      } else if (data.error) {
        setResponse(`Error: ${data.error}`);
      } else {
        setResponse("No valid response received from the API.");
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

  // Get section title
  const getSectionTitle = () => {
    const titles: Record<SectionType, string> = {
      landing: "Welcome to EducAIt",
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
    <div className="container max-w-5xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">AI Policy Generator</h1>
        <p className="mt-2 text-muted-foreground">
          Create a customized AI policy for your educational institution
        </p>
      </div>

      {/* Progress indicator */}
      {section !== "landing" && section !== 'results' && (
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
      {section === "landing" && (
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Welcome to EducAIt</CardTitle>
            <CardDescription>
              Welcome to EducAIt, your comprehensive tool for drafting customized AI policies
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
      {section !== "landing" && section !== "results" && (
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>{getSectionTitle()}</CardTitle>
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
      {section === "results" && (
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
  );
} 