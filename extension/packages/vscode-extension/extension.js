const vscode = require("vscode");

async function activate(context) {
  const { tokenize } = await import("../compiler/src/tokeniser.js");
  const { parse } = await import(
    "../compiler/src/parser/parserMain.js"
  );

  const diagnostics =
    vscode.languages.createDiagnosticCollection("raven");

  context.subscriptions.push(diagnostics);

  function validateDocument(document) {
    if (document.languageId !== "raven") return;

    diagnostics.delete(document.uri);

    try {
      const source = document.getText();
      const tokens = tokenize(source);

      parse(tokens);
    } catch (error) {
      const token = error.token;

      if (!token) return;

      const startLine = Math.max(0, token.line - 1);
      const startColumn = Math.max(0, token.column - 1);
      const length = Math.max(1, token.length ?? 1);

      const range = new vscode.Range(
        startLine,
        startColumn,
        startLine,
        startColumn + length,
      );

      const diagnostic = new vscode.Diagnostic(
        range,
        error.hint
          ? `${error.message}\n\nHelp: ${error.hint}`
          : error.message,
        vscode.DiagnosticSeverity.Error,
      );

      diagnostic.source = "Raven";

      diagnostics.set(document.uri, [diagnostic]);
    }
  }

  // Validate the file currently open
  if (vscode.window.activeTextEditor) {
    validateDocument(vscode.window.activeTextEditor.document);
  }

  // Validate after every edit
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      validateDocument(event.document);
    }),

    vscode.workspace.onDidOpenTextDocument((document) => {
      validateDocument(document);
    }),

    vscode.workspace.onDidCloseTextDocument((document) => {
      diagnostics.delete(document.uri);
    }),
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};