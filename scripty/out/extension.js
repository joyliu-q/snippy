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
const utils_1 = require("./utils");
const prompts_1 = require("./prompts");
const prompts_2 = require("./prompts");
function generateRandomString(length) {
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
            const content = await (0, utils_1.generate)(fileContent, prompts_1.strengthsAndWeaknesses);
            let sections = [];
            if (content.includes("##")) {
                sections = content.split("##");
            }
            else {
                sections = [content];
            }
            const evaluations = await (0, utils_1.generate)(fileContent, prompts_2.metrics);
            const evals = evaluations.split(',');
            // Show the content in VS Code
            const panel = vscode.window.createWebviewPanel('analysisResult', 'Analysis Result', vscode.ViewColumn.Three, {
                enableScripts: true,
            });
            panel.webview.html = getWebviewContent(sections, evals, context.extensionUri, panel.webview);
            // Define the data to be sent in the request body
            const now = new Date();
            const key = generateRandomString(7);
            const upsert_data = {
                key: key,
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
function getWebviewContent(sections, evals, extensionUri, webview) {
    // vscode.window.showInformationMessage(content);
    // // Split content into sections based on "###" delimiter
    const imagePath = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'scripty.png'));
    const sectionsHTML = sections.map(section => `<p>${(section.trim())}</p>`).join('');
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src 'unsafe-inline';">
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
                    overflow-x: hidden;
                    max-width: 100%;
                }
                .message-box {
                    position: relative;
                    border: 1px solid #ccc;
                    padding: 20px;
                    font-size: 20px;
                    line-height: 1.8;
                    width: calc(100% - 40px);
                    margin: 0 auto;
                    box-sizing: border-box;
                    word-wrap: break-word;
                }
                .top-right-image {
                    position: absolute;
                    top: 10px;
                    right: 30px; /* Move the image more to the left */
                    max-width: 150px; /* Increase the image size */
                    height: auto;
                }
                ul {
                    margin: 0;
                    padding: 0 0 20px 20px;
                    list-style-type: disc;
                    font-size: 18px;
                }
                li {
                    margin-bottom: 10px;
                }
                p {
                    font-size: 18px;
                    margin-bottom: 20px;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <div class="message-box">
                <img class="top-right-image" src="${imagePath}" alt="Descriptive feedback image">
                <h1>Here's your feedback!</h1>
                ${sectionsHTML}
                ${evals.length === 3 ? `<p>Readability: ${evals[0]}, Syntax: ${evals[1]}, Good Practices: ${evals[2]}</p>` : ''}
            </div>
        </body>
        </html>`;
}
//# sourceMappingURL=extension.js.map