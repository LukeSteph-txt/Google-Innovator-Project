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
import { ComposableMap, Geographies, Geography, ZoomableGroup, Annotation } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { toast } from "sonner";
import { useAuth, useClerk } from "@clerk/nextjs";

// Clean, accurate full-screen loading overlay with real progress tracking
const FullScreenLoader = ({ message, progress, elapsedTime }: { message: string; progress: number; elapsedTime: number }) => {
  const estimatedTotalTime = 120; // 120 seconds maximum
  const timeProgress = Math.min((elapsedTime / estimatedTotalTime) * 100, 95); // Cap at 95% until actually complete
  const actualProgress = Math.min(progress, timeProgress);
  
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-xl mx-auto px-6">
        {/* Simple loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Simple progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(actualProgress)}%</span>
          </div>
          <div className="w-full bg-primary/10 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${actualProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.floor(elapsedTime)}s elapsed
          </div>
        </div>
        
        {/* Fixed-size message display */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-primary">
            Generating Your AI Policy
          </h2>
          <div className="h-16 flex items-center justify-center">
            <p className="text-lg text-muted-foreground max-w-lg">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// List of US states for dropdown
const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
  "Wisconsin", "Wyoming"
];

// Color-coded state arrays (currently includes all states, can be customized later)
// const greenStates = [
//   "California", "Oregon", "Washington", "Colorado", "Vermont", "Maine", "New Hampshire", 
//   "Massachusetts", "Connecticut", "Rhode Island", "New York", "New Jersey", "Delaware", 
//   "Maryland", "Virginia", "North Carolina", "South Carolina", "Georgia", "Florida"
// ];

const greenStates = ["Alabama", "Florida", "Georgia", "Hawaii", "Massachusetts"];

const yellowStates = [
  "California", "Colorado", "Connecticut", "Delaware", "Indiana", "Kentucky", "Louisiana",
  "Maine", "Minnesota", "Mississippi", "Missouri", "Nevada", "New Mexico", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Utah", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

const redStates = [
  // All states not in greenStates or yellowStates
  "Alaska", "Arizona", "Arkansas", "Idaho", "Illinois", "Iowa", "Kansas", "Maryland",
  "Massachusetts", "Michigan", "Montana", "Nebraska", "New Hampshire", "New Jersey",
  "Michigan", "Montana", "Nebraska", "New Hampshire", "New Jersey",
  "New York", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
  "Texas", "Vermont"
];

// const yellowStates = [
//   "Alaska", "Hawaii", "Arizona", "New Mexico", "Texas", "Louisiana", "Mississippi", 
//   "Alabama", "Tennessee", "Kentucky", "West Virginia", "Ohio", "Indiana", "Illinois", 
//   "Wisconsin", "Michigan", "Minnesota", "Iowa", "Missouri", "Arkansas", "Oklahoma", 
//   "Kansas", "Nebraska", "South Dakota", "North Dakota", "Montana", "Idaho", "Utah", 
//   "Nevada", "Wyoming"
// ];

// const redStates = [
//   "Pennsylvania", "New York", "New Jersey", "Delaware", "Maryland", "Virginia", 
//   "North Carolina", "South Carolina", "Georgia", "Florida", "Alabama", "Mississippi", 
//   "Louisiana", "Texas", "Oklahoma", "Arkansas", "Missouri", "Kansas", "Nebraska", 
//   "Iowa", "Minnesota", "Wisconsin", "Illinois", "Indiana", "Ohio", "Kentucky", 
//   "Tennessee", "West Virginia", "Pennsylvania"
// ];

// State abbreviations for display
const stateAbbreviations: Record<string, string> = {
  "Alabama": "AL",
  "Alaska": "AK",
  "Arizona": "AZ",
  "Arkansas": "AR",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "Florida": "FL",
  "Georgia": "GA",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Mississippi": "MS",
  "Missouri": "MO",
  "Montana": "MT",
  "Nebraska": "NE",
  "Nevada": "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Pennsylvania": "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Vermont": "VT",
  "Virginia": "VA",
  "Washington": "WA",
  "West Virginia": "WV",
  "Wisconsin": "WI",
  "Wyoming": "WY"
};



// US Map component using react-simple-maps
const USMap = ({ onStateSelect, selectedState }: { onStateSelect: (stateName: string) => void, selectedState: string }) => {
  // State name mapping to handle any discrepancies
    const stateNameMap: Record<string, string> = {
    "Alabama": "Alabama",
    "Alaska": "Alaska",
    "Arizona": "Arizona",
    "Arkansas": "Arkansas",
    "California": "California",
    "Colorado": "Colorado",
    "Connecticut": "Connecticut",
    "Delaware": "Delaware",
    "Florida": "Florida",
    "Georgia": "Georgia",
    "Hawaii": "Hawaii",
    "Idaho": "Idaho",
    "Illinois": "Illinois",
    "Indiana": "Indiana",
    "Iowa": "Iowa",
    "Kansas": "Kansas",
    "Kentucky": "Kentucky",
    "Louisiana": "Louisiana",
    "Maine": "Maine",
    "Maryland": "Maryland",
    "Massachusetts": "Massachusetts",
    "Michigan": "Michigan",
    "Minnesota": "Minnesota",
    "Mississippi": "Mississippi",
    "Missouri": "Missouri",
    "Montana": "Montana",
    "Nebraska": "Nebraska",
    "Nevada": "Nevada",
    "New Hampshire": "New Hampshire",
    "New Jersey": "New Jersey",
    "New Mexico": "New Mexico",
    "New York": "New York",
    "North Carolina": "North Carolina",
    "North Dakota": "North Dakota",
    "Ohio": "Ohio",
    "Oklahoma": "Oklahoma",
    "Oregon": "Oregon",
    "Pennsylvania": "Pennsylvania",
    "Rhode Island": "Rhode Island",
    "South Carolina": "South Carolina",
    "South Dakota": "South Dakota",
    "Tennessee": "Tennessee",
    "Texas": "Texas",
    "Utah": "Utah",
    "Vermont": "Vermont",
    "Virginia": "Virginia",
    "Washington": "Washington",
    "West Virginia": "West Virginia",
    "Wisconsin": "Wisconsin",
    "Wyoming": "Wyoming"
  };

  // Manual adjustments for individual state label positions
  const stateLabelOffsets: Record<string, { dx: number; dy: number }> = {
    "California": { dx: -5, dy: 0 }, // Shift right by 5 pixels
    "Louisiana": { dx: -5, dy: 0 }, // Shift left by 5 pixels
    "Tennessee": { dx: 0, dy: 5 }, // Shift down by 5 pixels
    "Kentucky": { dx: 0, dy: 5 }, // Shift down by 5 pixels
    "Washington": { dx: 0, dy: 5 }, // Shift down by 5 pixels
    "Florida": { dx: 5, dy: 0 }, // Shift down by 5 pixels
  };

  // Function to get state color based on category with shading
  const getStateColor = (stateName: string, isSelected: boolean, isHover: boolean = false, isPressed: boolean = false) => {
    // Determine base color category
    let baseColor = "#f8fafc"; // Default light gray
    
    if (greenStates.includes(stateName)) {
      if (isSelected) {
        return "#16a34a"; // Darker green for selected
      } else if (isPressed || isHover) {
        return "#15803d"; // Darkest green for pressed/hover
      } else {
        return "#22c55e"; // Medium green for default (changed from light)
      }
    } else if (yellowStates.includes(stateName)) {
      if (isSelected) {
        return "#ca8a04"; // Darker yellow for selected
      } else if (isPressed || isHover) {
        return "#a16207"; // Darkest yellow for pressed/hover
      } else {
        return "#eab308"; // Medium yellow for default (changed from light)
      }
      } else if (redStates.includes(stateName)) {
        if (isSelected) {
          return "#dc2626"; // Darker red for selected
        } else if (isPressed || isHover) {
          return "#b91c1c"; // Darkest red for pressed/hover
        } else {
          return "#ef4444"; // Medium red for default (changed from light)
        }
    }
    
    // Default gray states (if any)
    if (isSelected) {
      return "#3b82f6"; // Blue for selected
    } else if (isPressed || isHover) {
      return "#1d4ed8"; // Darker blue for pressed/hover
    }
    
    return baseColor;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-white rounded-lg border border-gray-300 p-4" style={{ height: "400px", overflow: "hidden" }}>
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{
            scale: 1200, // Increased by 25% from 960
            center: [0, 0]
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography="https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json">
            {({ geographies }: { geographies: any[] }) => (
              <>
                {geographies.map((geo: any) => {
                const stateName = geo.properties.name;
                const mappedStateName = stateNameMap[stateName] || stateName;
                const isSelected = selectedState === mappedStateName;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onStateSelect(mappedStateName)}
                    style={{
                      default: {
                        fill: getStateColor(mappedStateName, isSelected),
                        stroke: "#cbd5e1",
                        strokeWidth: 0.8,
                        outline: "none",
                        cursor: "pointer",
                      },
                      hover: {
                        fill: getStateColor(mappedStateName, isSelected, true),
                        stroke: "#64748b",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: getStateColor(mappedStateName, isSelected, false, true),
                        stroke: "#475569",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: "pointer",
                      },
                    }}
                  />
                );
                })}
                
                {/* State labels using Annotation component */}
                {geographies.map((geo: any) => {
                  const stateName = geo.properties.name;
                  const mappedStateName = stateNameMap[stateName] || stateName;
                  const abbreviation = stateAbbreviations[mappedStateName];
                  
                  if (!abbreviation) return null;
                  
                  // Get the centroid of the state for label positioning
                  const centroid = geoCentroid(geo);
                  
                  // Define smaller states that need external labels
                  const smallStates = [
                    "Rhode Island", "Delaware", "Connecticut", "New Jersey", 
                    "Massachusetts", "Maryland", "New Hampshire", "Vermont"
                  ];
                  
                  const isSmallState = smallStates.includes(mappedStateName);
                  
                                   // Calculate offset for external labels
                 let dx = 0;
                 let dy = 0;
                 let connectorProps = {};

                 // Apply manual adjustments for specific states
                 const manualOffset = stateLabelOffsets[mappedStateName];
                 if (manualOffset) {
                   dx += manualOffset.dx;
                   dy += manualOffset.dy;
                 }

                 if (isSmallState) {
                   // Position labels outside the state with connecting lines (scaled up 25% more for larger map)
                   if (mappedStateName === "Rhode Island") {
                     // Bottom-right, 35 degrees down - moved further out
                     dx += 39; // Scaled up 25% from 31
                     dy += 28; // Scaled up 25% from 22
                   } else if (mappedStateName === "Delaware") {
                     // Right, angle up by 10% - moved further out
                     dx += 39; // Scaled up 25% from 31
                     dy += 6; // Scaled up 25% from 5
                   } else if (mappedStateName === "Connecticut") {
                     // Bottom-right, 20% shorter arrow - swapped with NJ
                     dx += 25; // Scaled up 25% from 20
                     dy += 28; // Scaled up 25% from 22
                   } else if (mappedStateName === "New Jersey") {
                     // Right, angle down 15-20% and size up 10% - swapped with CT
                     dx += 39; // Scaled up 25% from 31
                     dy += 13; // Scaled up 25% from 10
                   } else if (mappedStateName === "Massachusetts") {
                     // Right, slightly up - moved further out
                     dx += 46; // Scaled up 25% from 37
                     dy += -15; // Scaled up 25% from -12
                   } else if (mappedStateName === "Maryland") {
                     // Right, 30 degrees down - size up 15%
                     dx += 45; // Scaled up 25% from 36
                     dy += 24; // Scaled up 25% from 19
                   } else if (mappedStateName === "New Hampshire") {
                     // Top-left to avoid Maine - angle up 20%
                     dx += -24; // Scaled up 25% from -19
                     dy += -43; // Scaled up 25% from -34
                   } else if (mappedStateName === "Vermont") {
                     // Top-left to avoid Maine - angle down 10%
                     dx += -35; // Scaled up 25% from -28
                     dy += -24; // Scaled up 25% from -19
                   }

                   // Add connecting line properties
                   connectorProps = {
                     stroke: "#374151",
                     strokeWidth: 2, // Doubled from 1
                     strokeLinecap: "round"
                   };
                 }
                  
                  return (
                    <Annotation
                      key={`label-${geo.rsmKey}`}
                      subject={centroid}
                      dx={dx}
                      dy={dy}
                      connectorProps={connectorProps}
                    >
                      <text
                        textAnchor="middle"
                                               style={{
                         fontSize: "21px", // Increased by 30% from 16px
                         fontWeight: "bold",
                         fill: "#374151",
                         pointerEvents: "none",
                         textShadow: "0 0 3px white, 0 0 3px white, 0 0 3px white, 0 0 3px white",
                       }}
                      >
                        {abbreviation}
                      </text>
                    </Annotation>
                  );
                })}


              </>
            )}
          </Geographies>
        </ComposableMap>
        

      </div>
      
      {/* Legend */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Click on any state to select it. Selected state will be highlighted in its category color.</p>
        <div className="flex justify-center items-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 border border-gray-300"></div>
            <span>Green States</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 border border-gray-300"></div>
            <span>Yellow States</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 border border-gray-300"></div>
            <span>Red States</span>
          </div>
        </div>
      </div>
    </div>
  );
};

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

// Function to strip all formatting tags for PDF generation
function stripFormattingTags(md: string) {
  // First, decode HTML entities
  const decodeHtmlEntities = (text: string) => {
    const entities: Record<string, string> = {
      '&quot;': '"',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&apos;': "'",
      '&nbsp;': ' '
    };
    return text.replace(/&[a-zA-Z]+;/g, (match) => entities[match] || match);
  };
  
  // Remove all {{Follow Up (question)}} ... {{/Follow Up}} tags, keeping only the content
  md = md.replace(/\{\{Follow Up \([^)]*\)\}\}([\s\S]*?)\{\{\/Follow Up\}\}/g, (_match, content) => {
    return String(content).replace(/^\s*\.\.\./, '').replace(/\.\.\.\s*$/, '').trim();
  });
  
  // Remove all {{SurveyLink (explanation|section)}} ... {{/SurveyLink}} tags, keeping only the content
  md = md.replace(/\{\{SurveyLink \([^)]*\)\}\}([\s\S]*?)\{\{\/SurveyLink\}\}/g, (_match, content) => {
    return String(content).trim();
  });
  
  // Remove all {{DocLink (filename|explanation)}} ... {{/DocLink}} tags, keeping only the content
  md = md.replace(/\{\{DocLink \([^)]*\)\}\}([\s\S]*?)\{\{\/DocLink\}\}/g, (_match, content) => {
    return String(content).trim();
  });
  
  // Clean up any extra whitespace that might have been created by tag removal
  md = md.replace(/\n\s*\n\s*\n/g, '\n\n'); // Replace multiple blank lines with double blank lines
  
  // Remove any remaining HTML tags that might have been created by the preprocessing
  md = md.replace(/<followup[^>]*>(.*?)<\/followup>/g, '$1');
  md = md.replace(/<surveylink[^>]*>(.*?)<\/surveylink>/g, '$1');
  md = md.replace(/<doclink[^>]*>(.*?)<\/doclink>/g, '$1');
  
  // Remove common HTML tags that might appear inside content
  md = md.replace(/<strong>(.*?)<\/strong>/g, '$1');
  md = md.replace(/<b>(.*?)<\/b>/g, '$1');
  md = md.replace(/<em>(.*?)<\/em>/g, '$1');
  md = md.replace(/<i>(.*?)<\/i>/g, '$1');
  md = md.replace(/<code>(.*?)<\/code>/g, '$1');
  md = md.replace(/<pre>(.*?)<\/pre>/g, '$1');
  md = md.replace(/<p>(.*?)<\/p>/g, '$1');
  md = md.replace(/<br\s*\/?>/g, '\n');
  md = md.replace(/<hr\s*\/?>/g, '\n---\n');
  
  // Handle markdown formatting that should be preserved but cleaned
  // Convert **bold** to regular text (remove bold formatting)
  md = md.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // Convert *italic* to regular text (remove italic formatting) - but be careful with list markers
  // Process italic formatting more carefully to avoid affecting list markers
  // First, temporarily replace list markers with a unique placeholder
  md = md.replace(/^(\s*)(\*|\+|\-)\s/gm, '$1__LIST_MARKER_STAR__ ');
  // Now remove italic formatting
  md = md.replace(/\*(.*?)\*/g, '$1');
  // Restore list markers
  md = md.replace(/__LIST_MARKER_STAR__/g, '*');
  
  // Convert `code` to regular text (remove code formatting)
  md = md.replace(/`(.*?)`/g, '$1');
  
  // Decode HTML entities
  md = decodeHtmlEntities(md);
  
  // Clean up any extra whitespace that might have been created
  md = md.replace(/\s+$/gm, ''); // Remove trailing whitespace from each line
  
  // Add proper spacing between sections
  md = md.replace(/^(#{1,3}\s+.+)$/gm, '\n$1'); // Add blank line before headings
  md = md.replace(/\n\n\n+/g, '\n\n'); // Normalize multiple blank lines to double
  md = md.replace(/^\n+/, ''); // Remove leading blank lines
  
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
  // Authentication state
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn, openSignUp } = useClerk();
  
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingElapsedTime, setLoadingElapsedTime] = useState(0);
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
  const [quota, setQuota] = useState<{used: number; remaining: number; limit: number} | null>(null);
  const [quotaError, setQuotaError] = useState<boolean>(false);

  async function generatePolicy() {
    setLoading(true);
    setLoadingProgress(0);
    setLoadingElapsedTime(0);
    
    try {
      const startTime = Date.now();
      let currentProgress = 0;
      
      const updateProgress = (increment: number) => {
        currentProgress = Math.min(currentProgress + increment, 95); // Cap at 95% until complete
        setLoadingProgress(currentProgress);
      };
      
      updateProgress(3); // Initial setup
      
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
      
      updateProgress(75); // Sections complete

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
        
        IMPORTANT: Under no circumstances should the name of the school, district, or any specific institution be mentioned in the final policy document, even if it appears in uploaded documents or examples. Remove or replace any such names with generic terms like [Your School Name] or [Your District Name]. Please make sure to annotate EACH instance of the school/district name using the FollowUp Tag below.
        
        1. Identify many sentences (1-2 at a time) in the final policy that would most benefit from user customization or review. For each, annotate the sentence using the following exact tag format:
        {{Follow Up (Your specific question for the user about customizing this sentence)}} ...policy text... {{/Follow Up}}
        The question in parentheses should be specific to what the user should consider or review for that sentence. Only annotate three sentences in total, and only those that are most likely to require user input or local adaptation.
        
        2. For any sentence or section that is directly influenced by a specific survey answer, annotate it using:
        {{SurveyLink (explanation|section)}} ...policy text... {{/SurveyLink}}
        Where 'explanation' is a brief note on how the survey answer affected the policy, and 'section' is the policy section name (e.g., "Commitment to Staff Training").
        There should hopefully be at least 1 SurveyLink annotation per paragraph, but ensure there are at least 10 over the policy (the more quality ones the better).
        
        3. For sentences that strongly align with the content of any uploaded document, annotate them using:
        {{DocLink (filename|explanation)}} ...policy text... {{/DocLink}}
        Where 'filename' is the name of the uploaded document, and 'explanation' is a brief note on how the content aligns.
        There should hopefully be 1 DocLink annotation per section, but ensure there are at least 5 over the policy (the more quality ones the better), if the user uploaded documents.
        
        EXAMPLES:
        - If a sentence is directly influenced by a survey answer (e.g., "Staff AI literacy is low"), annotate it like this:
          {{SurveyLink (This section was added because you indicated staff AI literacy is low|Commitment to Staff Training)}} Staff will receive additional AI training days. {{/SurveyLink}}
        - If a sentence strongly aligns with an uploaded document (e.g., "MissionStatement.txt" says "equity is a core value"), annotate it like this:
          {{DocLink (MissionStatement.txt|This sentence reflects the core value of equity from your mission statement)}} The policy prioritizes equity in AI access. {{/DocLink}}
        
        You must try to include multiple SurveyLink and DocLink annotations per paragraph, in addition to the Follow Up tags. The more annotations the better, but ensure each are relevant to the paragraph and quality annotations.
        There can only be 1 annotation per sentence, so SurveyLink, DocLink and FollowUp annotations cannot be on the same sentence(s).
        
        Please:
        1. Ensure consistent formatting throughout the document
        2. Remove any text that appears to be from the AI model itself (like "Here's the section on..." or "I've generated...")
        3. Fix any grammatical or spelling errors
        4. Ensure the document flows logically from section to section
        5. Make sure all sections are properly formatted with appropriate headings
        6. Remove any redundant information
        7. Ensure the policy is clear, professional, and actionable
        8. Try to place as many SurveyLink, DocLink and FollowUp annotations as possible, while ensuring they are relevant to the sentence and quality annotations.
        
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

      updateProgress(90); // Starting final proofing
      
      const proofingResponse = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          model: "gpt-4.1",
          systemPrompt: proofingSystemPrompt, 
          prompt: combinedPolicy,
          isFinal: true
        }),
      });
      
      const proofingData = await proofingResponse.json();
      
      if (proofingData.content) {
        setResponse(proofingData.content);
        setEditedPolicy(proofingData.content);
        
        // Smooth acceleration phase - speed up progress for 5 seconds
        const accelerationDuration = 5000; // 5 seconds
        const startProgress = 90; // Current progress
        const targetProgress = 100;
        const startTime = Date.now();
        
        const accelerateProgress = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(
            startProgress + (elapsed / accelerationDuration) * (targetProgress - startProgress),
            targetProgress
          );
          
          setLoadingProgress(progress);
          
          if (progress < targetProgress) {
            requestAnimationFrame(accelerateProgress);
          }
        };
        
        // Start acceleration phase
        if ((window as any).startLoadingAcceleration) {
          (window as any).startLoadingAcceleration();
        }
        
        // Start acceleration
        requestAnimationFrame(accelerateProgress);
        
        // Set loading to false after acceleration completes
        setTimeout(() => {
          setLoading(false);
        }, accelerationDuration);
        
        return Promise.resolve();
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

  // Fetch quota on mount and when sign-in state changes
  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const res = await fetch('/api/quota', { method: 'GET', credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setQuota(data);
          setQuotaError(false);
        } else {
          setQuotaError(true);
        }
      } catch {
        setQuotaError(true);
      }
    };
    if (isSignedIn) {
      fetchQuota();
    }
  }, [isSignedIn]);
  
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

  // Accurate loading progress tracking with elapsed time
  useEffect(() => {
    if (loading) {
      const startTime = Date.now();
      
      // 30 realistic messages that follow the actual policy generation process
      const messages = [
        // Initial Analysis Phase (0-20s)
        "Analyzing your school's unique requirements...",
        "Processing demographic and geographic data...",
        "Evaluating current technology infrastructure...",
        "Assessing AI literacy levels across staff and students...",
        "Reviewing uploaded documents and context...",
        
        // Research Phase (20-40s)
        "Researching current AI policies and best practices...",
        "Gathering insights from educational AI implementations...",
        "Analyzing successful policy frameworks...",
        "Reviewing compliance requirements and guidelines...",
        "Studying emerging AI trends in education...",
        
        // Framework Design Phase (40-60s)
        "Designing policy structure and sections...",
        "Creating introduction and rationale framework...",
        "Defining permitted use guidelines...",
        "Establishing prohibited use boundaries...",
        "Outlining staff training commitments...",
        
        // Content Generation Phase (60-80s)
        "Generating introduction and rationale section...",
        "Crafting permitted use guidelines...",
        "Developing prohibited use policies...",
        "Creating staff training framework...",
        "Writing privacy and transparency guidelines...",
        
        // Specialized Sections Phase (80-100s)
        "Addressing bias and accessibility concerns...",
        "Incorporating environmental impact considerations...",
        "Establishing accountability and enforcement measures...",
        "Drafting conclusion and implementation guidance...",
        "Ensuring policy coherence and flow...",
        
        // Finalization Phase (100-120s)
        "Proofreading and formatting document...",
        "Adding follow-up annotations for customization...",
        "Incorporating survey link references...",
        "Adding document link annotations...",
        "Finalizing policy for download and implementation..."
      ];
      
      // Acceleration phase messages (faster cycling)
      const accelerationMessages = [
        "Finalizing document formatting...",
        "Preparing policy for download...",
        "Completing final quality checks...",
        "Ready to display your policy..."
      ];
      
      let messageIndex = 0;
      let isAccelerating = false;
      setLoadingMessage(messages[messageIndex]);
      
      // Update elapsed time every second
      const timeInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setLoadingElapsedTime(elapsed);
      }, 1000);
      
      // Cycle through messages every 4 seconds with some variation
      const messageInterval = setInterval(() => {
        if (isAccelerating) {
          // Faster message cycling during acceleration
          messageIndex = (messageIndex + 1) % accelerationMessages.length;
          setLoadingMessage(accelerationMessages[messageIndex]);
        } else {
          // Normal message cycling
          messageIndex = (messageIndex + 1) % messages.length;
          setLoadingMessage(messages[messageIndex]);
        }
      }, isAccelerating ? 1000 : 4000); // Faster during acceleration
      
      // Function to start acceleration phase
      const startAcceleration = () => {
        isAccelerating = true;
        messageIndex = 0;
        setLoadingMessage(accelerationMessages[0]);
        // Clear and restart interval with faster timing
        clearInterval(messageInterval);
        const fastInterval = setInterval(() => {
          messageIndex = (messageIndex + 1) % accelerationMessages.length;
          setLoadingMessage(accelerationMessages[messageIndex]);
        }, 1000);
        
        return () => clearInterval(fastInterval);
      };
      
      // Expose acceleration function globally so generatePolicy can call it
      (window as any).startLoadingAcceleration = startAcceleration;
      
      return () => {
        clearInterval(timeInterval);
        clearInterval(messageInterval);
        delete (window as any).startLoadingAcceleration;
      };
    } else {
      // Reset when loading stops
      setLoadingElapsedTime(0);
      setLoadingProgress(0);
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
                <div className="flex space-x-1 mr-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
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

    // Check file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert(`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB. Please choose a smaller file.`);
      event.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      let textContent: string;
      let fileName = file.name;

      if (file.type === 'application/pdf') {
        // Only run in the browser
        if (typeof window !== 'undefined') {
          try {
            // Load PDF.js from CDN if not already loaded
            // @ts-ignore
            if (!window.pdfjsLib) {
              await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                script.onload = resolve;
                script.onerror = () => reject(new Error('Failed to load PDF.js library'));
                document.body.appendChild(script);
              });
            }
            
            // @ts-ignore
            const pdfjsLib = window.pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let text = '';
            
            // Limit to first 10 pages to prevent timeouts
            const maxPages = Math.min(pdf.numPages, 10);
            for (let i = 1; i <= maxPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const strings = content.items.map((item: any) => item.str);
              text += strings.join(' ') + '\n';
            }
            
            if (pdf.numPages > 10) {
              text += `\n[Note: Only first 10 pages were processed. Total pages: ${pdf.numPages}]`;
            }
            
            textContent = text;
            fileName = fileName.replace(/\.pdf$/i, '.txt');
          } catch (pdfError) {
            console.error('PDF parsing error:', pdfError);
            throw new Error(`Failed to parse PDF: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}`);
          }
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
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      
      if (data.success) {
        setUploadedDocuments(prev => [...prev, {
          filename: fileName,
          content: data.content
        }]);
        toast.success(`Successfully uploaded ${fileName}`);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      toast.error(`Upload failed: ${errorMessage}`);
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
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isUploading 
              ? 'border-blue-300 bg-blue-50 cursor-not-allowed' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <div className="flex space-x-2 mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            ) : (
              <Upload className="w-8 h-8 mb-4 text-gray-500" />
            )}
            <p className="mb-2 text-sm text-gray-500">
              {isUploading ? (
                <span className="font-semibold text-blue-600">Processing file...</span>
              ) : (
                <span className="font-semibold">Click to upload</span>
              )}
              {!isUploading && ' or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">
              PDF or TXT files (max 10MB)
            </p>
            {isUploading && (
              <p className="text-xs text-blue-600 mt-2">
                Please wait while we process your file...
              </p>
            )}
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
      
      {/* File upload tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Upload Tips:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• PDF files will be converted to text automatically</li>
          <li>• Only the first 10 pages of PDFs will be processed</li>
          <li>• Maximum file size is 10MB</li>
          <li>• Supported formats: .pdf, .txt</li>
        </ul>
      </div>
      
      {uploadedDocuments.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded Documents:</h3>
          <ul className="space-y-2">
            {uploadedDocuments.map((doc) => (
              <li
                key={doc.filename}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">{doc.filename}</span>
                  <span className="text-xs text-green-600">
                    ({Math.round(doc.content.length / 1024)}KB)
                  </span>
                </div>
                <button
                  onClick={() => removeDocument(doc.filename)}
                  className="p-1 hover:bg-green-200 rounded text-green-600 hover:text-green-800 transition-colors"
                  title="Remove document"
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
                <div className="flex space-x-1 mr-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
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

  // Render the location section with map
  const renderLocationSection = () => {
    const handleContinue = () => {
      if (!state) {
        toast.error("Please select a state before continuing.");
        return;
      }
      // Move to next section
      setSection('context');
    };

    return (
      <Card className="mx-auto max-w-4xl">
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
          <div className="space-y-6">
            {/* Color Key */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">State AI Policy Status:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded border border-gray-300"></div>
                  <span className="text-sm text-gray-600">Green: Specific AI requirements & bans for K-12</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded border border-gray-300"></div>
                  <span className="text-sm text-gray-600">Yellow: Some AI guidance, no requirements</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded border border-gray-300"></div>
                  <span className="text-sm text-gray-600">Red: No AI guidance or requirements</span>
                </div>
              </div>
            </div>

            {/* Dropdown */}
            <div className="max-w-md">
              <label className="text-sm font-medium mb-2 block">Select from dropdown:</label>
              <Select onValueChange={(value) => setState(value)} value={state}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {getCurrentQuestion()!.options.map((option, i) => (
                    <SelectItem key={i} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleContinue}
                disabled={!state}
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Continue
              </Button>
            </div>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or click on the map below</span>
              </div>
            </div>
            
            {/* US Map */}
            <div className="mt-4">
              <USMap 
                onStateSelect={(stateName) => setState(stateName)} 
                selectedState={state} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
        </div>
        <div className="relative z-10">
          <Navbar />
          <div className="container max-w-5xl py-10">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in page if user is not authenticated
  if (!isSignedIn) {
    return (
      <div className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
        </div>
        <div className="relative z-10">
          <Navbar />
          <div className="container max-w-5xl py-10">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight">AI Policy Pathway</h1>
                  <p className="text-xl text-muted-foreground max-w-md mx-auto">
                    Create a customized AI policy for your educational institution
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="w-48 h-12 text-lg"
                    onClick={() => openSignIn({ redirectUrl: "/policy-generator" })}
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-48 h-12 text-lg"
                    onClick={() => openSignUp({ redirectUrl: "/policy-generator" })}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Full-screen loading overlay */}
      {loading && <FullScreenLoader message={loadingMessage} progress={loadingProgress} elapsedTime={loadingElapsedTime} />}
      
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
            {isSignedIn && (
              <div className="mt-3 text-sm text-muted-foreground">
                {quota ? (
                  <span>
                    Generations remaining: <b>{quota.remaining}</b> / {quota.limit}
                  </span>
                ) : quotaError ? (
                  <span>Quota unavailable</span>
                ) : (
                  <span>Checking quota…</span>
                )}
              </div>
            )}
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
                  disabled={quota !== null && quota.remaining <= 0}
                >
                  {quota !== null && quota.remaining <= 0 ? 'Generation Limit Reached' : 'Start Creating Your Policy'}
                </Button>
              </CardFooter>
            </Card>
          )}



          {/* Questions */}
          {section !== 'landing' && section !== 'results' && section !== 'priorities' && section !== 'documents' && section !== 'location' && (
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

          {/* Location Section with Map */}
          {section === 'location' && renderLocationSection()}

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
                                let title = line.substring(2).trim();
                                // Clean the title of any markdown formatting
                                title = title.replace(/\*\*(.*?)\*\*/g, '$1');
                                title = title.replace(/\*(.*?)\*/g, '$1');
                                title = title.replace(/`(.*?)`/g, '$1');
                                pdf.text(title, pageWidth / 2, currentY, { align: 'center' });
                                currentY += 0.4;
                                currentFontSize = 12;
                                currentFontStyle = 'normal';
                              } else if (line.startsWith('## ')) {
                                // Section heading
                                pdf.setFontSize(14);
                                pdf.setFont('helvetica', 'bold');
                                let heading = line.substring(3).trim();
                                // Clean the heading of any markdown formatting
                                heading = heading.replace(/\*\*(.*?)\*\*/g, '$1');
                                heading = heading.replace(/\*(.*?)\*/g, '$1');
                                heading = heading.replace(/`(.*?)`/g, '$1');
                                pdf.text(heading, margin, currentY);
                                currentY += 0.3;
                                currentFontSize = 12;
                                currentFontStyle = 'normal';
                              } else if (line.startsWith('### ')) {
                                // Subsection heading
                                pdf.setFontSize(12);
                                pdf.setFont('helvetica', 'bold');
                                let subheading = line.substring(4).trim();
                                // Clean the subheading of any markdown formatting
                                subheading = subheading.replace(/\*\*(.*?)\*\*/g, '$1');
                                subheading = subheading.replace(/\*(.*?)\*/g, '$1');
                                subheading = subheading.replace(/`(.*?)`/g, '$1');
                                pdf.text(subheading, margin, currentY);
                                currentY += 0.25;
                                currentFontSize = 12;
                                currentFontStyle = 'normal';
                              } else if (line.startsWith('* ') || line.startsWith('- ')) {
                                // Bullet points
                                pdf.setFontSize(currentFontSize);
                                pdf.setFont('helvetica', currentFontStyle);
                                let bulletText = line.substring(2).trim();
                                
                                // Clean the bullet text of any markdown formatting
                                bulletText = bulletText.replace(/\*\*(.*?)\*\*/g, '$1');
                                bulletText = bulletText.replace(/\*(.*?)\*/g, '$1');
                                bulletText = bulletText.replace(/`(.*?)`/g, '$1');
                                
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
                                let listText = line.substring(3).trim();
                                
                                // Clean the list text of any markdown formatting
                                listText = listText.replace(/\*\*(.*?)\*\*/g, '$1');
                                listText = listText.replace(/\*(.*?)\*/g, '$1');
                                listText = listText.replace(/`(.*?)`/g, '$1');
                                
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
                                
                                // Clean the line of any remaining markdown formatting
                                let cleanLine = line;
                                // Remove any remaining bold/italic formatting that might have slipped through
                                cleanLine = cleanLine.replace(/\*\*(.*?)\*\*/g, '$1');
                                cleanLine = cleanLine.replace(/\*(.*?)\*/g, '$1');
                                cleanLine = cleanLine.replace(/`(.*?)`/g, '$1');
                                
                                // Split text into words to handle wrapping
                                const words = cleanLine.split(' ');
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
                          
                          // Process the Markdown content - use the edited policy if in edit mode, and strip formatting tags for PDF
                          const contentToProcess = isEditing ? editedPolicy : response;
                          const cleanContent = stripFormattingTags(contentToProcess);
                          processMarkdown(cleanContent);
                          
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