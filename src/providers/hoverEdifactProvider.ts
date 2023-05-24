import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiElement, EdiSegment, EdiVersion, EdifactParser } from "../parser";
import { SchemaViewerUtils } from "../utils/utils";

export class HoverEdifactProvider implements vscode.HoverProvider, IProvidable {
  async provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Hover> {
    let text = document.getText();
    const parser = new EdifactParser(text);
    let ediVersion: EdiVersion = parser.parseReleaseAndVersion();
    let segments = await parser.parseSegments();
    let realPosition = document.offsetAt(
      new vscode.Position(position.line, position.character)
    );
    let selectedSegment = segments.find(x => realPosition >= x.startIndex && realPosition <= (x.endIndex + 1));

    if (selectedSegment?.elements?.length <= 0) {
      return null;
    }

    const selectedElement = selectedSegment?.elements.find(x => realPosition >= (selectedSegment.startIndex + x.startIndex) && realPosition <= (selectedSegment.startIndex + x.endIndex + 1));
    let selectedComponentElement: EdiElement = null;
    if (selectedElement?.ediReleaseSchemaElement?.isComposite()) {
      selectedComponentElement = selectedElement?.components.find(x => realPosition >= (selectedSegment.startIndex + x.startIndex) && realPosition <= (selectedSegment.startIndex + x.endIndex + 1));
    }

    if (!selectedElement) {
      return null;
    }

    if (selectedSegment.ediReleaseSchemaSegment) {
      if (selectedComponentElement) {
        return new vscode.Hover(this.buildElementMarkdownString(ediVersion, selectedSegment, selectedComponentElement));
      } else {
        return new vscode.Hover(this.buildElementMarkdownString(ediVersion, selectedSegment, selectedElement));
      }
    } else {
      return new vscode.Hover(
        `**${selectedSegment.id}**${selectedElement.designatorIndex} (_${selectedElement.type}_)\n\n` +
          "```edi\n" +
          `${selectedSegment}\n` +
          "```"
      );
    }


  }

  private buildElementMarkdownString(ediVersion: EdiVersion, segment: EdiSegment, element: EdiElement) : vscode.MarkdownString[] {
    const mdStrings = [
      new vscode.MarkdownString(
        `**${segment.id}**${element.designatorIndex}\n` +
        `\`Id ${element.ediReleaseSchemaElement.id}\`\n` +
        `\`Type ${element.ediReleaseSchemaElement.dataType}\`\n` +
        `\`Min ${element.ediReleaseSchemaElement.minLength} / Max ${element.ediReleaseSchemaElement.maxLength}\``
      ),
      new vscode.MarkdownString(
        `**${element.ediReleaseSchemaElement.desc}**\n` +
        `\n` +
        `${element.ediReleaseSchemaElement.definition}\n` +
        "```edifact\n" +
        `${segment}\n` +
        "```"
      )
    ];
    const elementSchemaViewerUrl: string = SchemaViewerUtils.getElementUrl(ediVersion.release, segment.id, element.getDesignator());
    if (element?.ediReleaseSchemaElement?.qualifierRef) {
      const codes = element?.ediReleaseSchemaElement?.getCodes();
      if (codes?.length > 0) {
        mdStrings.push(new vscode.MarkdownString(
          `*Codes*: ${codes.map(code => `[\`${code.value}\`](${elementSchemaViewerUrl} "${code.desc}")`).join(" ")}`
        ));
      }
    }
    mdStrings.push(new vscode.MarkdownString(
      `[EDI Schema Reference](${elementSchemaViewerUrl})\n`
    ));
    return mdStrings;
  }

  public registerFunction(): vscode.Disposable {
    const selector = { language: "edifact", scheme: "file" };
    return vscode.languages.registerHoverProvider(selector, this);
  }
}
