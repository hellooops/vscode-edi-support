import { EdiType } from "../parser/entities";
import { InlayHintsEdiProvider } from "./inlayHintsEdiProvider";

export class InlayHintsEdiEdifactProvider extends InlayHintsEdiProvider {
  getLanguageId(): string {
    return EdiType.EDIFACT;
  }
}
