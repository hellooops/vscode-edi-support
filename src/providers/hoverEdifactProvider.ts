import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import { EdiElement, EdiSegment, EdiVersion, EdifactParser } from "../parser";
import { SchemaViewerUtils, StringBuilder } from "../utils/utils";

export class HoverEdifactProvider implements vscode.HoverProvider, IProvidable {
  async provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Hover | undefined | null> {
    if (vscode.workspace.getConfiguration("ediEdifactSupport").get("enableHover") !== true) {
      return null;
    }
    let text = document.getText();
    const parser = new EdifactParser(text);
    let ediVersion: EdiVersion = parser.parseReleaseAndVersion();
    let segments = await parser.parseSegments();
    let realPosition = document.offsetAt(
      new vscode.Position(position.line, position.character)
    );
    let selectedSegment = segments.find(x => realPosition >= x.startIndex && realPosition <= (x.endIndex + 1));

    if (!selectedSegment?.elements || selectedSegment?.elements?.length <= 0) {
      return null;
    }

    const selectedElement = selectedSegment?.elements.find(x => realPosition >= (selectedSegment!.startIndex + x.startIndex) && realPosition <= (selectedSegment!.startIndex + x.endIndex + 1));
    if (!selectedElement) {
      return new vscode.Hover(this.buildSegmentMarkdownString(ediVersion, selectedSegment));
    }
    let selectedComponentElement: EdiElement | undefined = undefined;
    if (selectedElement?.ediReleaseSchemaElement?.isComposite()) {
      selectedComponentElement = selectedElement?.components.find(x => realPosition >= (selectedSegment!.startIndex + x.startIndex) && realPosition <= (selectedSegment!.startIndex + x.endIndex + 1));
    }

    if (!selectedElement) {
      return null;
    }

    if (selectedComponentElement) {
      return new vscode.Hover(this.buildElementMarkdownString(ediVersion, selectedSegment, selectedComponentElement));
    } else {
      return new vscode.Hover(this.buildElementMarkdownString(ediVersion, selectedSegment, selectedElement));
    }
  }

  private buildSegmentMarkdownString(ediVersion: EdiVersion, segment: EdiSegment) : vscode.MarkdownString[] {
    const part2MdSb = new StringBuilder();
    if (segment?.ediReleaseSchemaSegment?.desc) {
      part2MdSb.append(`**${segment.ediReleaseSchemaSegment.desc}**\n\n`);
    }
    if (segment?.ediReleaseSchemaSegment?.purpose) {
      part2MdSb.append(`${segment.ediReleaseSchemaSegment.purpose}\n\n`);
    }
    part2MdSb.append(`\`\`\`edifact\n${segment}\n\`\`\``);
    const segmentSchemaViewerUrl: string = SchemaViewerUtils.getSegmentUrl(ediVersion.release, segment.id);
    const mdStrings: vscode.MarkdownString[] = [
      new vscode.MarkdownString(
        `**${segment.id}** (Segment)`
      ),
      new vscode.MarkdownString(part2MdSb.toString()),
      new vscode.MarkdownString(`[EDI Schema Reference](${segmentSchemaViewerUrl})\n`)
    ];
    return mdStrings;
  }

  private buildElementMarkdownString(ediVersion: EdiVersion, segment: EdiSegment, element: EdiElement) : vscode.MarkdownString[] {
    const part1MdSb = new StringBuilder();
    part1MdSb.append(`**${segment.id}**${element.designatorIndex} (Element)`);
    if (element?.ediReleaseSchemaElement) {
      if (element.ediReleaseSchemaElement.id !== undefined) {
        part1MdSb.append(`\n\n\`Id ${element.ediReleaseSchemaElement.id}\``);
      }
      if (element.ediReleaseSchemaElement.dataType !== undefined) {
        part1MdSb.append(` \`Type ${element.ediReleaseSchemaElement.dataType}\``);
      }
      if (element.ediReleaseSchemaElement.minLength !== undefined && element.ediReleaseSchemaElement.maxLength !== undefined) {
        part1MdSb.append(` \`Min ${element.ediReleaseSchemaElement.minLength} / Max ${element.ediReleaseSchemaElement.maxLength}\``);
      }
    }

    const part2MdSb = new StringBuilder();
    if (element?.ediReleaseSchemaElement) {
      if (element.ediReleaseSchemaElement.desc) {
        part2MdSb.append(`**${element.ediReleaseSchemaElement.desc}**\n\n`);
      }
      if (element.ediReleaseSchemaElement.definition) {
        part2MdSb.append(`${element.ediReleaseSchemaElement.definition}\n\n`);
      }
    }
    part2MdSb.append(`\`\`\`edifact\n${segment}\n\`\`\``);

    const mdStrings: vscode.MarkdownString[] = [
      new vscode.MarkdownString(part1MdSb.toString()),
      new vscode.MarkdownString(part2MdSb.toString()),
    ];

    const elementSchemaViewerUrl: string = SchemaViewerUtils.getElementUrl(ediVersion.release, segment.id, element.getDesignator());
    if (element?.ediReleaseSchemaElement?.qualifierRef) {
      const codes = element?.ediReleaseSchemaElement?.getCodes();
      if (codes && codes.length > 0) {
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
