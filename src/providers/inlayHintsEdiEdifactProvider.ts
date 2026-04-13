import { EdiType } from "edi-parser";
import { InlayHintsEdiProvider } from "./inlayHintsEdiProvider";

export class InlayHintsEdiEdifactProvider extends InlayHintsEdiProvider {
  getLanguageId(): string {
    return EdiType.EDIFACT;
  }
}
