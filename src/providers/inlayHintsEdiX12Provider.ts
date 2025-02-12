import { EdiType } from "../parser/entities";
import { InlayHintsEdiProvider } from "./inlayHintsEdiProvider";

export class InlayHintsEdiX12Provider extends InlayHintsEdiProvider {
  getLanguageId(): string {
    return EdiType.X12;
  }
}
