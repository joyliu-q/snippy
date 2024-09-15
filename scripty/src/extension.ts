// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import * as dotenv from 'dotenv';

// dotenv.config();

interface OpenAIResponse {
	choices: {
	  message: {
		content: string;
	  };
	}[];
  }

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "scripty" is now active!');

	// Template Command
	const disposable = vscode.commands.registerCommand('scripty.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Scripty!');
	});

	const analyze = vscode.commands.registerCommand('scripty.analyzeCode', async () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const fileContent = document.getText();
			vscode.window.showInformationMessage(`Analyzing: ${fileContent}...`);

			// const apiKey = process.env.API_KEY;
			// if (!apiKey) {
			// 	throw new Error('Missing API_KEY in environment');
			// }

			// Run analysis here
			const response = await fetch("https://proxy.tune.app/chat/completions", {
				method: "POST",
				headers: {
				  "Content-Type": "application/json",
				  "Authorization": "sk-tune-Sjre53YgSZ3Oufkv5skl1Z2kyN6NjSLfkhG"
				},
				body: JSON.stringify({
				  temperature: 0.9, 
				  messages:  [
					{
					  "role": "user",
					  "content": `Analyze the weakness of the following code: ${fileContent}`
					}
				  ],
				  model: "benxu/benxu-gpt-4o-mini",
				  stream: false,
				  "frequency_penalty":  0.2,
				  "max_tokens": 100
				})
			  });
			  
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const data = await response.json() as OpenAIResponse;

			if (!data.choices || !data.choices.length) {
				vscode.window.showErrorMessage('No analysis data received.');
				return;
			}

			// Assuming the desired content is under a key like 'choices' or similar
			const content = data.choices[0].message.content;

			// Show the content in VS Code
			vscode.window.showInformationMessage(content);

			// Define the data to be sent in the request body
			const now = new Date();

			const upsert_data = {
				key: "example_key",
				timestamp: now.toISOString(),
				summary: content
			};

			fetch('http://127.0.0.1:8000/upload_summary', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(upsert_data)
			})
			.then(response => {
				if (!response.ok) {
					vscode.window.showInformationMessage(`HTTP error! Status: ${response.statusText}`);
				}
				return response.json();
			})
			.then(result => {
				console.log('Success:', result);
			})
			.catch(error => {
				console.error('Error:', error);
			});

		} else {
			vscode.window.showErrorMessage('No active text editor found.');
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(analyze);
}

// This method is called when your extension is deactivated
export function deactivate() {}
