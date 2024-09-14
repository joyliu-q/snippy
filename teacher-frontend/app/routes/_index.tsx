import { useState } from "react";
import Layout from "~/components/Layout";
import { Textarea } from "~/components/ui/textarea"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"

export default function Index() {
  const [textValue, setTextValue] = useState("");
  const [numberValue, setNumberValue] = useState("");
  const [output, setOutput] = useState("");

  const handleConfigure = async () => {
    try {
      const response = await fetch("http://localhost:8000/create_envs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          num_containers: parseInt(numberValue),
          dockerfile_content: textValue || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create containers: ${response.statusText}`);
      }

      const data = await response.json();
      setOutput(`Containers created successfully. SSH commands: ${data.ssh_commands}`);
      // Need to connect this to database to then populate dashboard.tsx
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <Layout>
      <div className="flex h-screen flex-col items-center gap-6 pt-20">
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="textInput" className="text-lg font-medium text-gray-700 dark:text-gray-100">
            Generate Set Up
          </label>
          <Textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="mt-2 p-3"
            placeholder="Install Python..."/>
        </div>

        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="numberInput" className="text-lg font-medium text-gray-700 dark:text-gray-100">
            Number of Students
          </label>
          <Input
            type="number"
            id="numberInput"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            className="mt-2 p-3"
            placeholder="0"
          />
        </div>

        <Button
          onClick={handleConfigure}
          className="px-6 py-3"
        >
          Configure
        </Button>

        {output && (
          <div className="mt-6 w-full max-w-md p-4 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium">Generated Docker file:</h3>
            <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded-md overflow-auto">
              <code className="text-sm">{output}</code>
            </pre>
          </div>
        )}
      </div>
    </Layout>
  );
}
