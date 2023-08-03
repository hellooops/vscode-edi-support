import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import Utils from "../utils/utils";
import { EdiUtils } from "../utils/ediUtils";
import { EdiElement, EdiSegment, EdiType } from "../parser/entities";
import { ICommandable } from "../interfaces/commandable";
import * as constants from "../constants";

export class TreeEdiProvider implements vscode.TreeDataProvider<TreeItemElement>, IProvidable, ICommandable {
  name: string = constants.explorers.refreshEdiExplorer;
  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  public refresh(): any {
    this._onDidChangeTreeData.fire(undefined);
  }

  async getTreeItem(element: TreeItemElement): Promise<vscode.TreeItem> {
    if (element.type === TreeItemType.Segment) {
      return this.getSegmentTreeItem(element.segment!);
    } else if (element.type === TreeItemType.DataElement) {
      return this.getDataElementTreeItem(element.segment!, element.element!);
    } else if (element.type === TreeItemType.CompositeElement) {
      return this.getCompositeElementTreeItem(element.segment!, element.element!);
    } else if (element.type === TreeItemType.ElementAttribute) {
      return this.getElementAttributeTreeItem(element.elementAttribute!);
    } else {
      throw new Error(`Unknown tree item type: ${element.type}`);
    }
  }

  async getChildren(element?: TreeItemElement | undefined): Promise<TreeItemElement[] | null | undefined> {
    const document = vscode.window.activeTextEditor?.document;
    if (!document) {
      return;
    }

    if (!element) {
      const { parser, ediType } = EdiUtils.getEdiParser(document);
      if (ediType === EdiType.UNKNOWN) {
        return;
      }

      let segments = await parser!.parseSegments();

      return segments.map((segment) => {
        return {
          key: segment.id,
          type: TreeItemType.Segment,
          segment
        };
      });
    }

    if (element.type === TreeItemType.Segment) {
      return element.segment!.elements.map((el) => {
        return {
          key: el.getDesignator(),
          type: TreeItemType.DataElement,
          element: el,
          segment: element.segment
        };
      });
    } else if (element.type === TreeItemType.DataElement && element.element!.isComposite()) {
      return element.element!.components.map((el) => {
        return {
          key: el.getDesignator(),
          type: TreeItemType.CompositeElement,
          element: el,
          segment: element.segment
        };
      });
    } else if (element.type === TreeItemType.CompositeElement || (element.type === TreeItemType.DataElement && !element.element!.isComposite())) {
      const attrKeys: { key: string, label: string }[] = [
        {key: "id", label: "Id"},
        {key: "desc", label: "Description"},
        {key: "dataType", label: "Data Type"},
        {key: "required", label: "Required"},
        {key: "minLength", label: "Min Length"},
        {key: "maxLength", label: "Max Length"},
        {key: "qualifierRef", label: "Qualifier Ref"},
        {key: "definition", label: "Definition"},
      ];
      const children: TreeItemElement[] = [];
      for (let attrKey of attrKeys) {
        const attrValue = Utils.toString(element.element!.ediReleaseSchemaElement?.[attrKey.key]);
        if (attrValue === null || attrValue === undefined || attrValue === "") {
          continue;
        }

        children.push({
          key: `${element.element!.getDesignator()}-${attrKey.key}`,
          type: TreeItemType.ElementAttribute,
          elementAttribute: {
            key: attrKey.label,
            value: Utils.toString(element.element!.ediReleaseSchemaElement?.[attrKey.key])!
          }
        });
      }

      return children;
    } else {
      return;
    }
  }

  getParent?(element: TreeItemElement): vscode.ProviderResult<TreeItemElement> {
    throw new Error(constants.errors.methodNotImplemented);
  }

  resolveTreeItem?(item: vscode.TreeItem, element: TreeItemElement, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
    return item;
  }
  
  command(...args: any[]) {
    this.refresh();
  }

  private getSegmentTreeItem(segment: EdiSegment): vscode.TreeItem {
    const segmentDesc = segment.ediReleaseSchemaSegment?.desc ?? "";
    return {
      label: segment.id,
      iconPath: EdiUtils.icons.segment,
      description: segmentDesc,
      tooltip: segmentDesc,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      command: {
        command: constants.commands.selectTextByPositionCommand.name,
        title: "",
        arguments: [segment.startIndex, segment.endIndex + 1]
      }
    };
  }

  private getDataElementTreeItem(segment: EdiSegment, element: EdiElement): vscode.TreeItem {
    return this.getCompositeElementTreeItem(segment, element);
  }

  private getCompositeElementTreeItem(segment: EdiSegment, element: EdiElement): vscode.TreeItem {
    const elementDesc = element.ediReleaseSchemaElement?.desc ?? "";
    return {
      label: element.getDesignatorWithId(),
      iconPath: EdiUtils.icons.element,
      description: elementDesc,
      tooltip: elementDesc,
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      command: {
        command: constants.commands.selectTextByPositionCommand.name,
        title: "",
        arguments: [segment.startIndex + element.startIndex, segment.startIndex + element.endIndex + 1]
      }
    };
  }

  private getElementAttributeTreeItem(elementAttribute: ElementAttribute): vscode.TreeItem {
    return {
      label: elementAttribute.key,
      iconPath: EdiUtils.icons.elementAttribute,
      description: elementAttribute.value,
      tooltip: elementAttribute.value,
      collapsibleState: vscode.TreeItemCollapsibleState.None,
    };
  }

  public onTextChange(e: any) {
    if (!e?.document) {
      return;
    }

    if (EdiUtils.isX12(e?.document) || EdiUtils.isEdifact(e?.document)) {
      this.refresh();
    }
  }

  public registerFunctions(): vscode.Disposable[] {
    vscode.window.onDidChangeActiveTextEditor(e => this.onTextChange(e));
    vscode.workspace.onDidChangeTextDocument(e => this.onTextChange(e));

    return [
      vscode.window.createTreeView(constants.explorers.treeExplorerId, {
        treeDataProvider: this,
        showCollapseAll: true,
      }),
    ];
  }
}

enum TreeItemType {
  Segment,
  DataElement,
  CompositeElement,
  ElementAttribute
}

class TreeItemElement {
  key: string;
  type: TreeItemType;
  segment?: EdiSegment;
  element?: EdiElement;
  compositeElement?: EdiElement;
  elementAttribute?: ElementAttribute;
}

class ElementAttribute {
  key: string;
  value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}

