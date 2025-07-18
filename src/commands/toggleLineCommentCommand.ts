import { ICommandable } from "../interfaces/commandable";
import * as vscode from "vscode";
import * as constants from "../constants";

export class ToggleLineCommentCommand implements ICommandable {
  name: string = constants.commands.toggleLineCommentCommand.name;

  public async command(...args: any[]) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const selections = editor.selections;

    editor.edit(editBuilder => {
      selections.forEach(selection => {
        for (let i = selection.start.line; i <= selection.end.line; i++) {
          const line = document.lineAt(i);
          const lineText = line.text;
          const trimmedLine = lineText.trimStart();
          if (trimmedLine.startsWith(constants.ediDocument.lineCommentSymbol)) {
            const commentStartIndex = lineText.indexOf(constants.ediDocument.lineCommentSymbol);
            const textAfterLineCommentSymbol = lineText.substring(commentStartIndex + constants.ediDocument.lineCommentSymbol.length);
            const isBlankAfterLineCommentSymbol = textAfterLineCommentSymbol.length !== textAfterLineCommentSymbol.trimStart().length;
            if (commentStartIndex !== -1) {
              editBuilder.delete(
                new vscode.Range(i, commentStartIndex, i, commentStartIndex + constants.ediDocument.lineCommentSymbol.length + (isBlankAfterLineCommentSymbol ? 1 : 0))
              );
            }
          } else {
            const firstNonWhitespaceCharIndex = line.firstNonWhitespaceCharacterIndex;
            editBuilder.insert(
              new vscode.Position(i, firstNonWhitespaceCharIndex),
              constants.ediDocument.lineCommentSymbol + " "
            );
          }
        }
      });
    });
  }
}
