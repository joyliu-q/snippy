import { useState } from "react";
import Layout from "~/components/Layout";

export default function Index() {
  const [textValue, setTextValue] = useState("");
  const [numberValue, setNumberValue] = useState("");
  const [output, setOutput] = useState("");

  const handleConfigure = () => {
    setOutput(`You entered: "${textValue}" and the number: ${numberValue}`);
    // Call Joy's endpoints
  };

  return (
    <Layout>
      <div className="flex h-screen flex-col items-center justify-center gap-6 p-4">
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="textInput" className="text-lg font-medium text-gray-700 dark:text-gray-100">
            Generate Set Up
          </label>
          <input
            type="text"
            id="textInput"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 w-full text-lg"
            placeholder="Install Python..."
          />
        </div>

        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="numberInput" className="text-lg font-medium text-gray-700 dark:text-gray-100">
            Number of Students
          </label>
          <input
            type="number"
            id="numberInput"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 w-full text-lg"
            placeholder="0"
          />
        </div>

        <button
          onClick={handleConfigure}
          className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700"
        >
          Configure
        </button>

        {output && (
          <div className="mt-6 w-full max-w-md p-4 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium">Generated Docker file:</h3>
            <p className="mt-2">{output}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
