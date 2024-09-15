"use client";
import { useState } from "react";
import Layout from "~/components/Layout";
import { Textarea } from "~/components/ui/textarea"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import {
  SignedIn,
  SignedOut,
} from '@clerk/remix'
import { HeroParallax } from "~/components/ui/hero-parallax";

// TODO: Update products & parallax spacing
const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  {
    title: "Rogue",
    link: "https://userogue.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/rogue.png",
  },
];

export default function Index() {
  const [textValue, setTextValue] = useState("");
  const [numberValue, setNumberValue] = useState("");
  const [output, setOutput] = useState<{ dockerfile: string; students: any[] } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleConfigure = async () => {
    try {
      const response = await fetch("http://localhost:8000/create_envs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          num_containers: parseInt(numberValue),
          dockerfile_content: textValue,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create containers: ${response.statusText}`);
      }

      const data = await response.json();
      setOutput({
        dockerfile: data.dockerfile,
        students: data.students,
      });
   } catch (error: any) {
    setError(`Error: ${error.message}`);
  }
  };

  return (
    <div>
      <SignedIn>
        <Layout>
        <div className="flex h-screen flex-col items-center gap-6 bg-black text-white">
          <div className="flex flex-col w-full max-w-md">
            <label htmlFor="textInput" className="text-lg font-medium">
              Generate Set Up
            </label>
            <Textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="mt-2 p-3 text-black"
              placeholder="Install Python..."/>
          </div>

          <div className="flex flex-col w-full max-w-md">
            <label htmlFor="numberInput" className="text-lg font-medium">
              Number of Students
            </label>
            <Input
              type="number"
              id="numberInput"
              value={numberValue}
              onChange={(e) => setNumberValue(e.target.value)}
              className="mt-2 p-3 text-black"
              placeholder="0"
              min={0}
            />
          </div>

          <Button
            onClick={handleConfigure}
            className="mt-6 px-6 py-3 bg-blue-500"
          >
            Configure
          </Button>

          {output && (
          <div className="mt-6 w-full max-w-md p-4 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
            {/* Dockerfile */}
            <h3 className="text-lg font-medium">Generated Dockerfile:</h3>
            <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded-md overflow-auto">
              <code className="text-sm">{output.dockerfile}</code>
            </pre>

            {/* Display Student SSH Commands */}
            <h3 className="text-lg font-medium mt-6">Student SSH Commands:</h3>
            {output.students.map((student, index) => (
              <div key={index} className="mt-2">
                <p>
                  <strong>{student.name}</strong> - {student.email}
                </p>
                <pre className="mt-1 p-2 bg-gray-700 text-gray-100 rounded-md overflow-auto">
                  <code>{student.ssh_command}</code>
                </pre>
                <p className="text-sm mt-1 text-gray-400">{student.feedback}</p>
              </div>
            ))}
          </div>
        )}
        </div>
      </Layout>
    </SignedIn>
    <SignedOut>
      <HeroParallax products={products} />
    </SignedOut>
    </div>
  );
}
