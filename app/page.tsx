"use client";

import Image from "next/image";
import { useState } from "react";
import Head from "next/head";

export default function Home() {
  // States for user responses and stage progression
  const [userType, setUserType] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [cheatingLevel, setCheatingLevel] = useState("");
  const [stage, setStage] = useState(1); // 1: User Type, 2: Age Group, 3: Cheating Level

  // Handler for progressing through stages
  const handleNextStage = (value: string | number) => {
    if (stage === 1) setUserType(value);
    if (stage === 2) setAgeGroup(value);
    if (stage === 3) setCheatingLevel(value);
  };

  return (
    <>
      <Head>
        <title>Who are You?</title>
      </Head>

      <div className="overflow-x-hidden min-h-screen flex flex-col items-center justify-center">
        {/* Navigation Bar */}
        <nav className="bg-grey-100 text-black p-4 fixed top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-1/3 rounded-2xl shadow-lg">
          <div className="flex justify-evenly">
            <button className="hover:bg-gray-100 px-4 py-1 rounded">Our Mission</button>
            <button className="hover:bg-gray-100 px-4 py-1 rounded">About Us</button>
            <button className="hover:bg-gray-100 px-4 py-1 rounded">Documentation</button>
            <button className="hover:bg-gray-100 px-4 py-1 rounded">Contact Us</button>
          </div>
        </nav>

        <div className="text-center">
          {/* Title based on stage */}
          <h1
            style={{ textShadow: "3px 3px 6px rgba(0, 0, 0, .5)" }}
            className="text-6xl font-geistMono font-bold mb-8"
          >
            {stage === 1 && "Who are you?"}
            {stage === 2 && "What age group?"}
            {stage === 3 && "Level of cheating?"}
          </h1>

          {/* Buttons based on stage */}
          <div className="flex flex-col gap-6 items-center">
            {stage === 1 && (
              <>
                <button
                  className="w-64 bg-gray-700 text-white py-4 text-lg rounded-lg hover:bg-gray-400 transition-all"
                  onClick={() => handleNextStage("Student")}
                >
                  Student
                </button>
                <button
                  className="w-64 bg-gray-700 text-white py-4 text-lg rounded-lg hover:bg-gray-400 transition-all"
                  onClick={() => handleNextStage("Teacher")}
                >
                  Teacher
                </button>
                <button
                  className="w-64 bg-gray-700 text-white py-4 text-lg rounded-lg hover:bg-gray-400 transition-all"
                  onClick={() => handleNextStage("Administrator")}
                >
                  Administrator
                </button>
              </>
            )}

            {stage === 2 && (
              <>
                <button
                  className="w-64 bg-gray-700 text-white py-4 text-lg rounded-lg hover:bg-gray-400 transition-all"
                  onClick={() => handleNextStage("K-8")}
                >
                  K-8
                </button>
                <button
                  className="w-64 bg-gray-700 text-white py-4 text-lg rounded-lg hover:bg-gray-400 transition-all"
                  onClick={() => handleNextStage("9-12")}
                >
                  9-12
                </button>
                <button
                  className="w-64 bg-gray-700 text-white py-4 text-lg rounded-lg hover:bg-gray-400 transition-all"
                  onClick={() => handleNextStage("Higher Education")}
                >
                  Higher Education
                </button>
              </>
            )}

            {stage === 3 && (
              <>
                <button
                  className="w-64 bg-gray-700 text-white py-4 text-lg rounded-lg hover:bg-gray-400 transition-all"
                  onClick={() => handleNextStage("Low")}
                >
                  Low
                </button>
                <button
                  className="w-64 bg-gray-700 text-white py-4 text-lg rounded-lg hover:bg-gray-400 transition-all"
                  onClick={() => handleNextStage("Medium")}
                >
                  Medium
                </button>
                <button
                  className="w-64 bg-gray-700 text-white py-4 text-lg rounded-lg hover:bg-gray-400 transition-all"
                  onClick={() => handleNextStage("High")}
                >
                  High
                </button>
              </>
            )}
          </div>

          {/* Display Collected Data */}
          <div className="mt-8 text-xl">
            <p>User Type: {userType}</p>
            <p>Age Group: {ageGroup}</p>
            <p>Cheating Level: {cheatingLevel}</p>
          </div>
        </div>

        {/* Image */}
        <div className="fixed bottom-0 left-0 p-4">
          <Image src="/logo.png" alt="EducAIt logo" width={200} height={400} priority />
        </div>
      </div>
    </>
  );
}
