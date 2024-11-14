import * as vscode from "vscode";
import { IProvidable } from "../interfaces/providable";
import Utils from "../utils/utils";
import { EdiUtils } from "../utils/ediUtils";
import { EdiDocument, EdiElement, EdiFunctionalGroup, EdiInterchange, EdiSegment, EdiTransactionSet, EdiType } from "../parser/entities";
import { EdiReleaseSchemaElement } from "../schemas/schemas"
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
    if (element.type === TreeItemType.Interchange) {
      return this.getInterchangeTreeItem(element.interchange!);
    } else if (element.type === TreeItemType.FunctionalGroup) {
      return this.getFunctionalGroupTreeItem(element.functionalGroup!);
    } else if (element.type === TreeItemType.TransactionSet) {
      return this.getTransactionSetTreeItem(element.transactionSet!);
    } else if (element.type === TreeItemType.Segment) {
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
    if (!element) {
      return await this.getDocumentChildren();
    } else if (element.type === TreeItemType.Interchange) {
      return this.getInterchangeChildren(element);
    } else if (element.type === TreeItemType.FunctionalGroup) {
      return this.getFunctionalGroupChildren(element);
    } else if (element.type === TreeItemType.TransactionSet) {
      return this.getTransactionSetChildren(element);
    } else if (element.type === TreeItemType.Segment) {
      return this.getSegmentChildren(element);
    } else if (element.type === TreeItemType.DataElement && element.element!.isComposite()) {
      return this.getDataElementChildren(element);
    } else if (element.type === TreeItemType.CompositeElement || (element.type === TreeItemType.DataElement && !element.element!.isComposite())) {
      return this.getCompositeElementChildren(element);
    } else {
      return;
    }
  }

  private async getDocumentChildren(): Promise<TreeItemElement[]> {
    const result: TreeItemElement[] = [];
    const document = vscode.window.activeTextEditor?.document;
    if (!document) {
      return result;
    }

    const { parser, ediType } = EdiUtils.getEdiParser(document);
    if (!parser || ediType === EdiType.UNKNOWN) {
      return result;
    }


    const ediDocument = await parser.parse();
    if (!ediDocument) {
      return result;
    }


    if (ediDocument.separatorsSegment) {
      result.push({
        key: ediDocument.separatorsSegment.id,
        type: TreeItemType.Segment,
        document: ediDocument,
        segment: ediDocument.separatorsSegment,
      });
    }
    const children = ediDocument.interchanges.map((interchange) => {
      return {
        key: interchange.getId()!,
        type: TreeItemType.Interchange,
        interchange
      };
    });
    result.push(...children);

    return result;
  }

  private getInterchangeChildren(item: TreeItemElement): TreeItemElement[] {
    const result: TreeItemElement[] = [];
    const interchange = item.interchange!;
    if (interchange.startSegment) {
      result.push({
        key: `${interchange.getId()!}-${interchange.startSegment.getKey()}`,
        type: TreeItemType.Segment,
        interchange: item.interchange,
        segment: interchange.startSegment,
      });
    }
    const children = interchange.functionalGroups.map((el) => {
      return {
        key: el.getId()!,
        type: TreeItemType.FunctionalGroup,
        interchange: interchange,
        functionalGroup: el,
      };
    });
    result.push(...children);
    if (interchange.endSegment) {
      result.push({
        key: `${interchange.getId()!}-${interchange.endSegment.getKey()}`,
        type: TreeItemType.Segment,
        interchange: item.interchange,
        segment: interchange.endSegment,
      });
    }

    return result;
  }

  private getFunctionalGroupChildren(item: TreeItemElement): TreeItemElement[] {
    const result: TreeItemElement[] = [];
    const functionalGroup = item.functionalGroup!;
    if (functionalGroup.startSegment) {
      result.push({
        key: `${functionalGroup.getId()!}-${functionalGroup.startSegment.getKey()}`,
        type: TreeItemType.Segment,
        interchange: item.interchange,
        functionalGroup: functionalGroup,
        segment: functionalGroup.startSegment,
      });
    }
    const children = functionalGroup.transactionSets.map((el) => {
      return {
        key: el.getId()!,
        type: TreeItemType.TransactionSet,
        interchange: item.interchange,
        functionalGroup: item.functionalGroup,
        transactionSet: el,
      };
    });
    result.push(...children);
    if (functionalGroup.endSegment) {
      result.push({
        key: `${functionalGroup.getId()!}-${functionalGroup.endSegment.getKey()}`,
        type: TreeItemType.Segment,
        interchange: item.interchange,
        segment: functionalGroup.endSegment,
      });
    }

    return result;
  }

  private getTransactionSetChildren(item: TreeItemElement): TreeItemElement[] {
    return item.transactionSet!.getSegments().map((el) => {
      return {
        key: `${item.transactionSet!.getId()!}-${el.getKey()}`,
        type: TreeItemType.Segment,
        interchange: item.interchange,
        functionalGroup: item.functionalGroup,
        transactionSet: item.transactionSet,
        segment: el,
      };
    });
  }

  private getSegmentChildren(item: TreeItemElement): TreeItemElement[] {
    return item.segment!.elements.map((el) => {
      const parent = item.transactionSet ?? item.functionalGroup ?? item.interchange;
      return {
        key: `${parent?.getId() ?? ""}-${el.getKey()}`,
        type: TreeItemType.DataElement,
        interchange: item.interchange,
        functionalGroup: item.functionalGroup,
        transactionSet: item.transactionSet,
        segment: item.segment,
        element: el,
      };
    });
  }

  private getDataElementChildren(item: TreeItemElement): TreeItemElement[] {
    return item.element!.components!.map((el) => {
      const parent = item.transactionSet ?? item.functionalGroup ?? item.interchange;
      return {
        key: `${parent?.getId() ?? ""}-${el.getKey()}`,
        type: TreeItemType.CompositeElement,
        interchange: item.interchange,
        functionalGroup: item.functionalGroup,
        transactionSet: item.transactionSet,
        segment: item.segment,
        element: el,
      };
    });
  }

  private getCompositeElementChildren(item: TreeItemElement): TreeItemElement[] {
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
      const attrValue = Utils.toString(item.element!.ediReleaseSchemaElement?.[attrKey.key as keyof EdiReleaseSchemaElement]);
      if (attrValue === null || attrValue === undefined || attrValue === "") {
        continue;
      }

      const parent = item.transactionSet ?? item.functionalGroup ?? item.interchange;
      children.push({
        key: `${parent?.getId() ?? ""}-${item.element!.getDesignator()}-${attrKey.key}`,
        type: TreeItemType.ElementAttribute,
        elementAttribute: {
          key: attrKey.label,
          value: Utils.toString(item.element!.ediReleaseSchemaElement?.[attrKey.key as keyof EdiReleaseSchemaElement])!
        }
      });
    }

    return children;
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

  private getInterchangeTreeItem(interchange: EdiInterchange): vscode.TreeItem {
    return {
      label: "Interchange",
      iconPath: EdiUtils.icons.interchange,
      description: interchange.getId(),
      tooltip: interchange.getId(),
      collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
      command: {
        command: constants.commands.selectTextByPositionCommand.name,
        title: "",
        arguments: [interchange.getFirstSegment()!.startIndex, interchange.getLastSegment()!.endIndex + 1]
      },
    };
  }

  private getFunctionalGroupTreeItem(functionalGroup: EdiFunctionalGroup): vscode.TreeItem {
    return {
      label: "FunctionalGroup",
      iconPath: EdiUtils.icons.functionalGroup,
      description: functionalGroup.getId(),
      tooltip: functionalGroup.getId(),
      collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
      command: {
        command: constants.commands.selectTextByPositionCommand.name,
        title: "",
        arguments: [functionalGroup.getFirstSegment()!.startIndex, functionalGroup.getLastSegment()!.endIndex + 1]
      },
    };
  }

  private getTransactionSetTreeItem(transactionSet: EdiTransactionSet): vscode.TreeItem {
    return {
      label: "TransactionSet",
      iconPath: EdiUtils.icons.transactionSet,
      description: transactionSet.getId(),
      tooltip: transactionSet.getId(),
      collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
      command: {
        command: constants.commands.selectTextByPositionCommand.name,
        title: "",
        arguments: [transactionSet.getFirstSegment()!.startIndex, transactionSet.getLastSegment()!.endIndex + 1]
      },
    };
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
  Document,
  Interchange,
  FunctionalGroup,
  TransactionSet,
  Segment,
  DataElement,
  CompositeElement,
  ElementAttribute
}

interface TreeItemElement {
  key: string;
  type: TreeItemType;
  document?: EdiDocument;
  interchange?: EdiInterchange;
  functionalGroup?: EdiFunctionalGroup;
  transactionSet?: EdiTransactionSet;
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

