import * as constants from "../constants";
import { exportPreviewHtml } from "../webviews/ediPreviewWebview";
import { ICommandable } from "../interfaces/commandable";

export class ExportPreviewHtmlCommand implements ICommandable {
  name = constants.commands.exportPreviewHtmlCommand.name;

  command() {
    return exportPreviewHtml();
  }
}
