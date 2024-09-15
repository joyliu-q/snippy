// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {generate} from './utils';
import {strengthsAndWeaknesses} from './prompts';
import {metrics} from './prompts';

function generateRandomString(length: number): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
	  const randomIndex = Math.floor(Math.random() * characters.length);
	  result += characters[randomIndex];
	}
	return result;
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
			const content = await generate(fileContent, strengthsAndWeaknesses);
			let sections: string[] = [];
			if (content.includes("##")) {
				sections = content.split("##");
			} else {
				sections = [content];
			}
			const evaluations = await generate(fileContent, metrics);

			const evals = evaluations.split(',');

			// Show the content in VS Code
			const panel = vscode.window.createWebviewPanel(
				'analysisResult',
				'Analysis Result',
				vscode.ViewColumn.Three,
					
				{
					enableScripts: true,
				}
			);
            panel.webview.html = getWebviewContent(sections, evals);

			// Define the data to be sent in the request body
			const now = new Date();

			const upsert_data = {
				key: generateRandomString(7),
				timestamp: now.toISOString(),
				summary: sections.join('\n')
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
			});

			if (evals.length === 3) {
				const upsert_score = {
					timestamp: now.toISOString(),
					readability: evals[0],
					syntax: evals[1],
					practice: evals[2]
				};
				fetch('http://127.0.0.1:8000/upload_scores', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(upsert_score)
				})
				.then(response => {
					if (!response.ok) {
						vscode.window.showInformationMessage(`HTTP error! Status: ${response.statusText}`);
					}
				});
			}

		} else {
			vscode.window.showErrorMessage('No active text editor found.');
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(analyze);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(sections: string[], evals: string[]) {
	// vscode.window.showInformationMessage(content);
    // // Split content into sections based on "###" delimiter

    const sectionsHTML = sections.map(section => `<p>${(section.trim())}</p>`).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src 'unsafe-eval'; style-src 'unsafe-inline';">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Analysis Result</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: stretch;
                    height: 100vh;
                    box-sizing: border-box;
                    overflow-y: auto;
                    overflow-x: hidden; /* Prevent horizontal overflow */
                    max-width: 100%;
                }
                .message-box {
                    border: 1px solid #ccc;
                    padding: 20px;
                    font-size: 20px;
                    line-height: 1.8; /* Increased line height for more vertical spacing */
                    width: calc(100% - 40px); /* Equal padding on both sides (20px left + 20px right) */
                    margin: 0 auto; /* Center the box horizontally */
                    box-sizing: border-box;
                    word-wrap: break-word; /* Ensure text wraps within the container */
                }
                ul {
                    margin: 0;
                    padding: 0 0 20px 20px; /* Added bottom padding for vertical spacing */
                    list-style-type: disc;
                    font-size: 18px;
                }
                li {
                    margin-bottom: 10px; /* Space out list items */
                }
                p {
                    font-size: 18px;
                    margin-bottom: 20px; /* Increased margin for more vertical space */
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 20px; /* Space out the heading */
                }
            </style>
        </head>
        <body>
            <div class="message-box">
                <h1>Here's your feedback!</h1>
                ${sectionsHTML}
				${evals.length === 3 ? `Readability: ${evals[0]}, Syntax: ${evals[1]}, Good Practices: ${evals[2]}` : ''}
            </div>
        </body>
        </html>`;
}