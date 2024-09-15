"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
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
                    messages: [
                        {
                            "role": "user",
                            "content": `Analyze the weakness of the following code: ${fileContent}`
                        }
                    ],
                    model: "benxu/benxu-gpt-4o-mini",
                    stream: false,
                    "frequency_penalty": 0.2,
                    "max_tokens": 100
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
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
        }
        else {
            vscode.window.showErrorMessage('No active text editor found.');
        }
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(analyze);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map