import * as fs from "fs";
import * as path from "path";

export function getFixturePath(fileName: string): string {
  const candidates = [
    path.resolve(__dirname, "..", "fixtures", "messages", fileName),
    path.resolve(__dirname, "..", "..", "..", "test", "fixtures", "messages", fileName),
  ];
  const matchedPath = candidates.find((candidate) => fs.existsSync(candidate));

  if (!matchedPath) {
    throw new Error(`Fixture not found: ${fileName}`);
  }

  return matchedPath;
}

export function readFixture(fileName: string): string {
  return fs.readFileSync(getFixturePath(fileName), "utf8");
}

export function normalizeLineBreaks(text: string, lineBreak: string): string {
  return text.replace(/\r\n|\n|\r/g, lineBreak);
}

export function stripTrailingLineBreaks(text: string): string {
  return text.replace(/(?:\r\n|\n|\r)+$/, "");
}

export function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createX12PurchaseOrderDocument(lineBreak = "\n"): string {
  return [
    "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~",
    "GS*PO*SENDER*RECEIVER*20241111*0300*1*X*004010~",
    "ST*850*0001~",
    "BEG*00*DS*PO1**20150708~",
    "DTM*097*20150708~",
    "SE*4*0001~",
    "GE*1*1~",
    "IEA*1*000000001~",
  ].join(lineBreak);
}

export function createX12PurchaseOrderWithCustomQualifier(lineBreak = "\n"): string {
  return [
    "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~",
    "GS*PO*SENDER*RECEIVER*20241111*0300*1*X*004010~",
    "ST*850*0001~",
    "DTM*ZZ*20150708~",
    "SE*3*0001~",
    "GE*1*1~",
    "IEA*1*000000001~",
  ].join(lineBreak);
}

export function createUnsupportedReleaseX12Document(lineBreak = "\n"): string {
  return [
    "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*99999*000000001*0*T*:~",
    "GS*PO*SENDER*RECEIVER*20241111*0300*1*X*999990~",
    "ST*850*0001~",
    "BEG*00*DS*PO1**20150708~",
    "SE*3*0001~",
    "GE*1*1~",
    "IEA*1*000000001~",
  ].join(lineBreak);
}

export function createX12856Document(lineBreak = "\n"): string {
  return [
    "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~",
    "GS*SH*SENDER*RECEIVER*20241111*0300*1*X*004010~",
    "ST*856*0001~",
    "BSN*00*SHIP1*20241111*0300~",
    "HL*1**S~",
    "TD1*CTN25*1~",
    "HL*2*1*O~",
    "PRF*PO1~",
    "HL*3*2*I~",
    "LIN**SK*ABC123~",
    "SN1**1*EA~",
    "N1*ST*Ship To~",
    "N2*Dock 1~",
    "SE*11*0001~",
    "GE*1*1~",
    "IEA*1*000000001~",
  ].join(lineBreak);
}

export function createX12810Document(lineBreak = "\n"): string {
  return [
    "ISA*00*          *00*          *ZZ*SENDER         *ZZ*RECEIVER       *241111*0300*U*00401*000000001*0*T*:~",
    "GS*IN*SENDER*RECEIVER*20241111*0300*1*X*004010~",
    "ST*810*0001~",
    "BIG*20241111*INV-1001*PO1~",
    "IT1*1*1*EA*12.34**VP*ABC123~",
    "TDS*1234~",
    "SE*5*0001~",
    "GE*1*1~",
    "IEA*1*000000001~",
  ].join(lineBreak);
}

export function createEdifactOrdersDocument(lineBreak = "\n", includeUna = true): string {
  const segments = [
    "UNB+UNOA:2+SENDER:14+RECEIVER:14+140407:0910+0001'",
    "UNH+001+ORDERS:D:96A:UN'",
    "BGM+220+PO1+9'",
    "UNT+3+001'",
    "UNZ+1+0001'",
  ];

  if (includeUna) {
    segments.unshift("UNA:+.?*'");
  }

  return segments.join(lineBreak);
}

export function createEdifactDelforDocument(lineBreak = "\n"): string {
  return [
    "UNA:+.?*'",
    "UNB+UNOA:2+JLR:ZZ+TEST:ZZ+030325:0725+242++DELFOR'",
    "UNH+1+DELFOR:D:97A:UN'",
    "BGM+241+20020102084517+5'",
    "DTM+51:230101:101'",
    "UNT+4+1'",
    "UNZ+1+242'",
  ].join(lineBreak);
}

export function createEdifactInvoicDocument(lineBreak = "\n", includeUna = true): string {
  const segments = [
    "UNB+UNOA:2+SUPPLIER:14+BUYER:14+200115:1430+INV001'",
    "UNH+1+INVOIC:D:96A:UN'",
    "BGM+380+INV-2020-001+9'",
    "UNT+3+1'",
    "UNZ+1+INV001'",
  ];

  if (includeUna) {
    segments.unshift("UNA:+.?*'");
  }

  return segments.join(lineBreak);
}

export function createVda511Document(lineBreak = "\n"): string {
  return `51102                  9999900001250124111231                                                                                   ${lineBreak}`;
}
