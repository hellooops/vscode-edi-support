import { EdiType } from "edi-parser";
import { InlayHintsEdiProvider } from "./inlayHintsEdiProvider";

export class InlayHintsEdiX12Provider extends InlayHintsEdiProvider {
  getLanguageId(): string {
    return EdiType.X12;
  }
}
