"use client";

import Image from "next/image";
import { useState } from "react";
import Head from "next/head";
import OpenAI from "openai";

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

export default function Home() {
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
  type SectionType = 'landing' | 'privacy' | 'bias' | 'learning' | 'environment' | 'results';
  const [section, setSection] = useState<SectionType>('landing');
  const [questionIndex, setQuestionIndex] = useState(0);

  // OpenAI configuration
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY, 
    dangerouslyAllowBrowser: false
  });
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
  
      // Combine all contexts into a comprehensive prompt
      const prompt = `
        You are a tool that helps educators outline and format policy towards AI based on the following comprehensive analysis:
        
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
      
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
      });
      
      if (completion.choices && completion.choices.length > 0) {
        setResponse(completion.choices[0].message?.content || "No response received");
      } 
    } catch (error) {
      console.error("Error generating policy:", error);
      setResponse("An error occurred while generating the policy. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  

  // Questions organized by sections
  const sections = {
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
    guidelines: [], // No questions as per requirements
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
    if (sections[section].length > 0 && questionIndex < sections[section].length) {
      sections[section][questionIndex].setter(value);
    }
    
    // Move to next question or section
    if (questionIndex < sections[section].length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // Determine next section
      const sectionOrder = ["landing", "privacy", "bias", "learning", "guidelines", "environment", "results"];
      const currentIndex = sectionOrder.indexOf(section);
      const nextSection = sectionOrder[currentIndex + 1];
      
      if (nextSection) {
        setSection(nextSection);
        setQuestionIndex(0);
        
        // Skip guidelines section as it has no questions
        if (nextSection === "guidelines" && sections[nextSection].length === 0) {
          setSection(sectionOrder[currentIndex + 2]);
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
    const titles = {
      landing: "Welcome to EducAIt",
      privacy: "Privacy Considerations",
      bias: "Bias Assessment",
      learning: "Student Learning",
      guidelines: "Guidelines and Laws",
      environment: "Environmental Impact",
      results: "Your AI Policy"
    };
    return titles[section] || "";
  };

  // Get current question
  const getCurrentQuestion = () => {
    if (sections[section].length > 0 && questionIndex < sections[section].length) {
      return sections[section][questionIndex];
    }
    return null;
  };

  // Handle slider change
  const handleSliderChange = (e) => {
    document.getElementById("sliderValue").textContent = e.target.value;
  };

  return (
    <>
      <Head>
        <title>EducAIt - AI Policy Generator</title>
      </Head>

      <div className="overflow-x-hidden min-h-screen flex flex-col items-center justify-center p-4">
        {/* Navigation Bar */}
        <nav className="bg-grey-100 text-black p-4 fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl rounded-b-2xl shadow-lg">
          <div className="flex justify-evenly">
            <button className="hover:bg-gray-100 px-4 py-1 rounded">About Us</button>
            <button className="hover:bg-gray-100 px-4 py-1 rounded">Documentation</button>
            <button className="hover:bg-gray-100 px-4 py-1 rounded">Contact Us</button>
          </div>
        </nav>

        <div className="text-center max-w-4xl w-full mt-20 mb-20">
          {/* Title based on current section */}
          <h1 className="text-4xl md:text-6xl font-bold mb-8"
              style={{ textShadow: "3px 3px 6px rgba(0, 0, 0, .3)" }}>
            {getSectionTitle()}
          </h1>

          {/* Landing Page */}
          {section === "landing" && (
            <div className="flex flex-col items-center gap-6">
              <p className="text-xl mb-8">
                Welcome to EducAIt, your comprehensive tool for drafting customized AI policies
                for educational institutions. Answer a few questions about your needs to generate
                a tailored policy outline.
              </p>
              <button
                className="w-64 bg-gray-700 text-white py-4 text-lg rounded-lg hover:bg-gray-600 transition-all"
                onClick={startProcess}
              >
                Draft Policy
              </button>
            </div>
          )}

          {/* Questions */}
          {section !== "landing" && section !== "results" && getCurrentQuestion() && (
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-2xl font-semibold mb-4">{getCurrentQuestion().question}</h2>
              
              {/* Regular options */}
              {!getCurrentQuestion().dropdown && !getCurrentQuestion().slider && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {getCurrentQuestion().options.map((option, i) => (
                    <button
                      key={i}
                      className="bg-gray-700 text-white py-4 text-lg rounded-lg hover:bg-gray-600 transition-all"
                      onClick={() => handleNext(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Dropdown */}
              {getCurrentQuestion().dropdown && (
                <div className="w-full max-w-md">
                  <select 
                    className="w-full p-4 border rounded-lg text-lg"
                    onChange={(e) => handleNext(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a state</option>
                    {getCurrentQuestion().options.map((option, i) => (
                      <option key={i} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Slider */}
              {getCurrentQuestion().slider && (
                <div className="w-full max-w-md">
                  <div className="flex justify-between mb-2">
                    <span>Low ({getCurrentQuestion().min})</span>
                    <span>High ({getCurrentQuestion().max})</span>
                  </div>
                  <input 
                    type="range" 
                    min={getCurrentQuestion().min} 
                    max={getCurrentQuestion().max}
                    defaultValue={Math.floor((getCurrentQuestion().max + getCurrentQuestion().min) / 2)}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    onChange={(e) => {
                      handleSliderChange(e);
                      getCurrentQuestion().setter(`${e.target.value}/10`);
                    }}
                    onMouseUp={(e) => handleNext(e.target.value)}
                    onTouchEnd={(e) => handleNext(e.target.value)}
                  />
                  <div className="mt-2 text-center text-lg font-semibold">
                    Selected: <span id="sliderValue">{Math.floor((getCurrentQuestion().max + getCurrentQuestion().min) / 2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results Page */}
          {section === "results" && (
            <div className="flex flex-col items-center gap-6 w-full">
              {loading ? (
                <div className="text-xl">Generating your AI policy...</div>
              ) : (
                <>
                  <div className="border rounded-lg p-6 max-h-96 overflow-y-auto w-full bg-white shadow-md">
                    <div className="whitespace-pre-line">{response}</div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="bg-gray-700 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-all"
                      onClick={() => {
                        // Reset to start
                        setSection("landing");
                        setQuestionIndex(0);
                        setResponse("");
                      }}
                    >
                      Start Over
                    </button>
                    <button
                      className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-500 transition-all"
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
                      Download Policy
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Progress indicator */}
          {section !== "landing" && section !== "results" && (
            <div className="mt-12 w-full max-w-2xl mx-auto">
              <div className="flex justify-between mb-2 text-sm">
                <span>Privacy</span>
                <span>Bias</span>
                <span>Learning</span>
                <span>Environment</span>
                <span>Results</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gray-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${(() => {
                      const sectionValues = { privacy: 20, bias: 40, learning: 60, guidelines: 80, environment: 80, results: 100 };
                      return sectionValues[section] || 0;
                    })()}%` 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Logo */}
        <div className="fixed bottom-0 left-0 p-4">
          <Image src="/logo.png" alt="EducAIt logo" width={150} height={150} priority />
        </div>
      </div>
    </>
  );
}