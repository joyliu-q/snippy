// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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

	const analyze = vscode.commands.registerCommand('scripty.analyzeCode', () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const fileContent = document.getText();
			vscode.window.showInformationMessage(`Analyzing: ${fileContent}...`);

			// Run analysis here
		} else {
			vscode.window.showErrorMessage('No active text editor found.');
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(analyze);
}

// This method is called when your extension is deactivated
export function deactivate() {}
