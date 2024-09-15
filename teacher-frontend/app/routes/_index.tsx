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
// import ContentPasteIcon from '@mui/icons-material/ContentPaste';

// TODO: Update products
const products = [
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  {
    title: "Kubernetes",
    link: "https://kubernetes.io/",
    thumbnail:
      "https://media.discordapp.net/attachments/1284707830661648424/1284710926192345169/Screenshot_2024-09-14_at_11.02.24_PM.png?ex=66e79fc9&is=66e64e49&hm=917d925791a74f1e6eec5f72e6f6569ce045f4fae68d6761abcd8e073e99cb3d&=&format=webp&quality=lossless&width=1478&height=1082",
  },
  {
    title: "Docker",
    link: "https://www.docker.com/",
    thumbnail:
      "https://media.discordapp.net/attachments/1284707830661648424/1284707842044989511/Example-of-a-Docker-file-for-a-GPU-image-From-the-Docker-files-multiple-Docker-container.png?ex=66e79cea&is=66e64b6a&hm=88f44ddef0793f14473cd99937a24b66b744034070a7b00d7e9ca8a29501e570&=&format=webp&quality=lossless&width=1700&height=1082",
  },
];

export default function Index() {
  const [textValue, setTextValue] = useState("");
  const [numberValue, setNumberValue] = useState("");
  const [output, setOutput] = useState<{ dockerfile: string; students: any[] } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // const handleConfigure = async () => {
  //   try {
  //     const response = await fetch("http://localhost:8000/create_envs", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         num_containers: parseInt(numberValue),
  //         dockerfile_content: textValue,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to create containers: ${response.statusText}`);
  //     }

  //     const data = await response.json();
  //     setOutput({
  //       dockerfile: data.dockerfile,
  //       students: data.students,
  //     });
  //   } catch (error: any) {
  //     setError(`Error: ${error.message}`);
  //   }
  // };

  const handleConfigure = async () => {
    setOutput({
      dockerfile: `# Dummy Dockerfile\nFROM python:3.8\nRUN pip install flask\nCOPY . /app\nCMD ["python", "/app/run.py"]`,
      students: [
        {
          name: "John Doe",
          email: "john.doe@example.com",
          ssh_command: "ssh john.doe@192.168.1.10",
          feedback: "Environment is running fine.",
        },
        {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          ssh_command: "ssh jane.smith@192.168.1.11",
          feedback: "Everything set up perfectly!",
        },
      ],
    });
  };

  return (
    <div>
      <SignedIn>
        <Layout>
        <div className="flex h-[150vh] flex-col items-center gap-6 bg-black text-white">
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

            {/* SSH Commands */}
            <h3 className="text-lg font-medium mt-6">Student SSH Commands:</h3>
            {output.students.map((student, index) => (
              <div key={index} className="mt-2 flex items-center gap-2">
                <pre className="p-2 bg-gray-700 text-gray-100 rounded-md overflow-auto flex-grow">
                  <code>{student.ssh_command}</code>
                </pre>
                <Button
                  onClick={() => copyToClipboard(student.ssh_command)}
                  className="px-2 py-1 text-sm bg-blue-500"
                >
                  Copy
                </Button>
                {/* <ContentPasteIcon /> */}
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
