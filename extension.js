// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const clipboardy = require("clipboardy");

function getSpaces(string) {
  const spaceRegex = /^[ ]*/g;
  return string.match(spaceRegex).join("");
}

function replacer(match, p1, p2) {
  if (p1) return `${getSpaces(match)}#${p1}`;
  if (p2) return `${getSpaces(match)}.${p2}`;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.sayHello",
    function() {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      // if no callback is provided, paste synchronously returns the current contents of the system clip board. Otherwise, the contents of the system clip board are passed to the callback as the second parameter.

      // Note: The synchronous version of paste is not always availabled. Unfortunately, I'm having a hard time finding a synchronous version of child_process.exec that consistently works on all platforms, especially windows. An error message is shown if the synchronous version of paste is used on an unsupported platform. That said, the asynchronous version of paste is always available.
      const coppiedText = clipboardy.readSync();
      const classAndIdRegex = /.*(?:className|class)=['|"]([^'"]*)['|"]|.*(?:id)=['|"]([^'"]*)['|"]/g;
      const replaceRegex = /.*(?:id)=['|"]([^'"]*)['|"].*|.*(?:className|class)=['|"]([^'"]*)['|"].*/;
      const replacedTargetTextArray = coppiedText.match(classAndIdRegex);
      const finalText = replacedTargetTextArray
        .filter(text => text)
        .map(text => text.replace(replaceRegex, replacer))
        .join("\n");
      let activeEditor;

      if ((activeEditor = vscode.window.activeTextEditor)) {
        activeEditor.edit(function(textInserter) {
          textInserter.insert(activeEditor.selection.start, finalText);
        });
      }

      vscode.window.showInformationMessage("Paste Successed");
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
