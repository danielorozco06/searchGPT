import * as vscode from 'vscode';
import getWordMeaning from './openai';

let disposable: vscode.Disposable | undefined;

async function showWordMeaning() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active text editor found');
		return;
	}

	const selection = editor.selection;
	const word = editor.document.getText(selection);
	if (!word.trim()) {
		vscode.window.showErrorMessage('No word selected');
		return;
	}

	try {
		const meaning = await getWordMeaning(word);
		vscode.window.showInformationMessage(`"${word}": ${meaning}`);
	} catch (error) {
		vscode.window.showErrorMessage(`Error: ${(error as Error).message}`);
	}
}

export function activate(context: vscode.ExtensionContext) {
	disposable = vscode.commands.registerCommand('searchgpt.show', showWordMeaning);
	context.subscriptions.push(disposable);
}

export function deactivate() {
	if (disposable) {
		disposable.dispose();
	}
}
