import MessageInfo from "../interfaces/messageInfo";
import { d96a_message_infos } from "./edifact_d96a_meta";
import { r00401_message_infos } from "./x12_00401_meta";

export class EdiSchema {
  public ediReleaseSchema: EdiReleaseSchema;
  public ediVersionSchema?: EdiVersionSchema;

  constructor(rawReleaseSchema: any, rawVersionSchema: any) {
    this.ediReleaseSchema = new EdiReleaseSchema(rawReleaseSchema);
    if (rawVersionSchema) {
      this.ediVersionSchema = new EdiVersionSchema(rawVersionSchema);
    }
  }
}

export class EdiQualifier {
  public value: string;
  public desc: string;

  constructor(value: string, desc: string) {
    this.value = value;
    this.desc = desc;
  }

  getEscapedDesc() : string {
    return this.desc.replace(/"/g, `\\"`);
  }
}

export class EdiReleaseSchema {
  private _rawSchema: any;

  public release: string;
  public qualifiers: Record<string, EdiQualifier[]>;
  public segments: Record<string, EdiReleaseSchemaSegment>;
  constructor (raw: any) {
    this._rawSchema = raw;
    this.release = raw.Release;
    this.qualifiers = {};
    if (raw.Qualifiers) {
      for (let qualifierName in raw.Qualifiers) {
        const qualifier = raw.Qualifiers[qualifierName];
        Object.keys(qualifier).forEach(qualifierKey => {
          this.addQualifier(qualifierName, qualifierKey, qualifier[qualifierKey]);
        });
      }
    }
    this.segments = {};
    if (raw.Segments) {
      for (let segmentName in raw.Segments) {
        this.segments[segmentName] = new EdiReleaseSchemaSegment(raw.Segments[segmentName], this);
      }
    }
  }

  public getSegment(name: string) : EdiReleaseSchemaSegment | undefined {
    return this.segments[name];
  }

  public addQualifier(name: string, value: string, desc: string) {
    if (!this.qualifiers[name]) {
      this.qualifiers[name] = [];
    }

    this.qualifiers[name].push(new EdiQualifier(value, desc));
  }

  public clone() {
    return new EdiReleaseSchema(this._rawSchema);
  }
}

export class EdiReleaseSchemaElement {
  private _schema?: EdiReleaseSchema;
  public id: string;
  public desc: string;
  public dataType: string;
  public required: boolean;
  public minLength: number;
  public maxLength: number;
  public qualifierRef: string;
  public definition: string;
  public components: EdiReleaseSchemaElement[];
  public length?: number;  // VDA

  public mock: boolean;

  constructor(raw: any, schema: EdiReleaseSchema | undefined) {
    this.id = raw.Id;
    this.desc = raw.Desc;
    this.dataType = raw.DataType;
    this.required = raw.Required;
    this.minLength = raw.MinLength;
    this.maxLength = raw.MaxLength;
    this.qualifierRef = raw.QualifierRef;
    this.definition = raw.Definition;
    this.length = raw.Length;
    this.components = raw.Components?.map((e: any) => new EdiReleaseSchemaElement(e, schema));
    this._schema = schema;
    this.mock = !!raw.mock;
  }

  public isComposite() : boolean {
    return this.components?.length > 0;
  }

  public getCodes() : EdiQualifier[] | null {
    if (!this.qualifierRef || !this._schema?.qualifiers[this.qualifierRef]) {
      return null;
    }

    return this._schema.qualifiers[this.qualifierRef];
  }

  public getCodeByValue(value: string): EdiQualifier {
    const codes = this.getCodes();
    if (!codes) {
      return new EdiQualifier(value, `No codes found for ${this.id}`);
    }

    const code = codes.find(c => c.value === value);
    if (!code) {
      return new EdiQualifier(value, `No code found for ${value}`);
    }

    return code;
  }

  public getCodeOrNullByValue(value: string): EdiQualifier | null {
    const codes = this.getCodes();
    if (!codes) {
      return null;
    }

    const code = codes.find(c => c.value === value);
    if (!code) {
      return null;
    }

    return code;
  }

  public getQualifierDesc(code: string) : string | null {
    const codes = this.getCodes();
    if (!codes) {
      return null;
    }

    const qualifier = codes.find(c => c.value === code);
    if (!qualifier) {
      return null;
    }

    return qualifier.desc;
  }
}

export class EdiReleaseSchemaSegment {
  private _schema?: EdiReleaseSchema;
  public desc: string;
  public purpose: string;
  public elements: EdiReleaseSchemaElement[];
  public raw: any;

  public mock: boolean;
  // EDIFACT
  public static UNA: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Delimiter String Advice",
    Elements: [
      { Id: "UNA01", Required: true, MinLength: 1, MaxLength: 1, Desc: "Sub-element delimiter", Definition: "Sub-element delimiter", mock: true },
      { Id: "UNA02", Required: true, MinLength: 1, MaxLength: 1, Desc: "Data element delimiter", Definition: "Data element delimiter", mock: true },
      { Id: "UNA03", Required: true, MinLength: 1, MaxLength: 1, Desc: "Decimal point indicator", Definition: "Decimal point indicator", mock: true },
      { Id: "UNA04", Required: true, MinLength: 1, MaxLength: 1, Desc: "Release character", Definition: "Release character", mock: true },
      { Id: "UNA05", Required: true, MinLength: 1, MaxLength: 1, Desc: "Space", Definition: "Space", mock: true },
      // { Id: "UNA06", Required: true, MinLength: 1, MaxLength: 1, Desc: "Segment terminator" },  // This is supposed to be the segment separator, not including in the elements
    ],
    Purpose: "To start, identify and specify an interchange.",
    mock: true
  }, undefined);
  public static UNB: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Interchange header",
    Elements: [
      {
        Id: "S001",
        Desc: "Syntax identifier",
        Required: true,
        Definition: "Identification of the agency controlling the syntax and indication of syntax level.",
        Components: [
          { Id: "0001", Desc: "Syntax identifier", DataType: "AN", Required: true, MinLength: 4, MaxLength: 4, Definition: "Coded identification of the agency controlling a syntax and syntax level used in an interchange.", mock: true, QualifierRef: "Syntax identifier" },
          { Id: "0002", Desc: "Syntax version number", DataType: "N", Required: true, MinLength: 1, MaxLength: 1, Definition: "Version number of the syntax identified in the syntax identifier (0001)", mock: true, QualifierRef: "Syntax version number" },
        ],
        mock: true
      },
      {
        Id: "S002",
        Desc: "Interchange sender",
        Required: true,
        Definition: "Identification of the sender of the interchange.",
        Components: [
          { Id: "0004", Desc: "Sender identification", DataType: "AN", Required: true, MinLength: 1, MaxLength: 35, Definition: "Name or coded representation of the sender of a data interchange.", mock: true },
          { Id: "0007", Desc: "Partner identification code qualifier", DataType: "AN", Required: false, MinLength: 1, MaxLength: 4, Definition: "Qualifier referring to the source of codes for the identifiers of interchanging partners.", mock: true, QualifierRef: "Identification code qualifier" },
          { Id: "0008", Desc: "Address for reverse routing", DataType: "AN", Required: false, MinLength: 1, MaxLength: 14, Definition: "Address specified by the sender of an interchange to be included by the recipient in the response interchanges to facilitate internal routing.", mock: true },
        ],
        mock: true
      },
      {
        Id: "S003",
        Desc: "Interchange recipient",
        Required: true,
        Definition: "Identification of the recipient of the interchange.",
        Components: [
          { Id: "0010", Desc: "Recipient identification", DataType: "AN", Required: true, MinLength: 1, MaxLength: 35, Definition: "Name or coded representation of the recipient of a data interchange.", mock: true },
          { Id: "0007", Desc: "Partner identification code qualifier", DataType: "AN", Required: false, MinLength: 1, MaxLength: 4, Definition: "Qualifier referring to the source of codes for the identifiers of interchanging partners.", mock: true, QualifierRef: "Identification code qualifier" },
          { Id: "0014", Desc: "Routing address", DataType: "AN", Required: false, MinLength: 1, MaxLength: 14, Definition: "Address specified by the recipient of an interchange to be included by the sender and used by the recipient for routing of received interchanges inside his organization.", mock: true },
        ],
        mock: true
      },
      {
        Id: "S004",
        Desc: "Date/time of preparation",
        Required: true,
        Definition: "Date and time of preparation of the interchange.",
        Components: [
          { Id: "0017", Desc: "Date of preparation", DataType: "N", Required: true, MinLength: 6, MaxLength: 6, Definition: "Local date when an interchange or a functional group was prepared.", mock: true },
          { Id: "0019", Desc: "Time of preparation", DataType: "N", Required: false, MinLength: 4, MaxLength: 4, Definition: "Local time of day when an interchange or a functional group was prepared.", mock: true },
        ],
        mock: true
      },
      { Id: "0020", Desc: "Interchange control reference", DataType: "AN", Required: true, MinLength: 1, MaxLength: 14, Definition: "Unique reference assigned by the sender to an interchange.", mock: true },
      {
        Id: "S005",
        Desc: "Recipient's reference, password",
        Required: false,
        Definition: "Reference or password as agreed between the communicating partners.",
        Components: [
          { Id: "0022", Desc: "Recipient's reference/password", DataType: "AN", Required: true, MinLength: 1, MaxLength: 14, Definition: "Unique reference assigned by the recipient to the data interchange or a password to the recipient's system or to a third party network as specified in the partners interchange agreement.", mock: true },
          { Id: "0025", Desc: "Recipient's reference/password qualifier", DataType: "AN", Required: false, MinLength: 2, MaxLength: 2, Definition: "Qualifier for the recipient's reference or password.", mock: true, QualifierRef: "Recipient reference/password qualifier" },
        ],
        mock: true
      },
      { Id: "0026", Desc: "Application reference", DataType: "AN", Required: false, MinLength: 1, MaxLength: 14, Definition: "Identification of the application area assigned by the sender, to which the messages in the interchange relate e.g. the message identifier if all the messages in the interchange are of the same type.", mock: true },
      { Id: "0029", Desc: "Processing priority code", DataType: "AN", Required: false, MinLength: 1, MaxLength: 1, Definition: "Code determined by the sender requesting processing priority for the interchange.", mock: true, QualifierRef: "Processing priority code" },
      { Id: "0031", Desc: "Acknowledgement request", DataType: "N", Required: false, MinLength: 1, MaxLength: 1, Definition: "Code determined by the sender for acknowledgement of the interchange.", mock: true, QualifierRef: "Acknowledgement request" },
      { Id: "0032", Desc: "Communications agreement ID", DataType: "AN", Required: false, MinLength: 1, MaxLength: 35, Definition: "Identification by name or code of the type of agreement under which the interchange takes place.", mock: true },
      { Id: "0035", Desc: "Test indicator", DataType: "N", Required: false, MinLength: 1, MaxLength: 1, Definition: "Indication that the interchange is a test.", mock: true, QualifierRef: "Test indicator" },
    ],
    Purpose: "To start, identify and specify an interchange.",
    mock: true
  }, new EdiReleaseSchema({
    "Qualifiers": {
      "Syntax identifier": {
        "UNOA": "UN/ECE level A: As defined in the basic code table of ISO 646 with the exceptions of lower case letters, alternative graphic character allocations and national or application-oriented graphic character allocations.",
        "UNOB": "UN/ECE level B: As defined in the basic code table of ISO 646 with the exceptions of alternative graphic character allocations and national or application-oriented graphic character allocations.",
        "UNOC": "UN/ECE level C: As defined in ISO/IEC 8859-1 : Information technology - Part 1: Latin alphabet No. 1.",
        "UNOD": "UN/ECE level D: As defined in ISO/IEC 8859-2 : Information technology - Part 2: Latin alphabet No. 2.",
        "UNOE": "UN/ECE level E: As defined in ISO/IEC 8859-5 : Information technology - Part 5: Latin/Cyrillic alphabet.",
        "UNOF": "UN/ECE level F: As defined in ISO 8859-7 : Information processing - Part 7: Latin/Greek alphabet.",
        "UNOL": "UN/ECE level L: As defined in ISO/IEC 8859-15 : Information technology - Part 15: Latin alphabet No. 9.",
        "UNOW": "UN/ECE level W: ISO 10646-1 octet with code extension technique to support UTF-8 (UCS Transformation Format, 8 bit) encoding.",
      },
      "Syntax version number": {
        "1": "Version 1: ISO 9735:1988.",
        "2": "Version 2: ISO 9735:1990.",
        "3": "Version 3: ISO 9735 Amendment 1:1992.",
        "4": "Version 4: ISO 9735:1998."
      },
      "Identification code qualifier": {
        "1": "DUNS (Data Universal Numbering System)",
        "4": "IATA (International Air Transport Association)",
        "5": "INSEE (Institut National de la Statistique et des Etudes Economiques) - SIRET",
        "8": "UCC Communications ID (Uniform Code Council Communications Identifier)",
        "9": "DUNS (Data Universal Numbering System) with 4 digit suffix",
        "12": "Telephone number",
        "14": "GS1",
        "18": "AIAG (Automotive Industry Action Group)",
        "22": "INSEE (Institut National de la Statistique et des Etudes Economiques) - SIREN",
        "30": "ISO 6523: Organization identification",
        "31": "DIN (Deutsches Institut fuer Normung)",
        "33": "BfA (Bundesversicherungsanstalt fuer Angestellte)",
        "34": "National Statistical Agency",
        "51": "GEIS (General Electric Information Services)",
        "52": "INS (IBM Network Services)",
        "53": "Datenzentrale des Einzelhandels",
        "54": "Bundesverband der Deutschen Baustoffhaendler",
        "55": "Bank identifier code",
        "57": "KTNet (Korea Trade Network Services)",
        "58": "UPU (Universal Postal Union)",
        "59": "ODETTE (Organization for Data Exchange through Tele-Transmission in Europe)",
        "61": "SCAC (Standard Carrier Alpha Code)",
        "63": "ECA (Electronic Commerce Australia)",
        "65": "TELEBOX 400 (Deutsche Telekom)",
        "80": "NHS (National Health Service)",
        "82": "Statens Teleforvaltning",
        "84": "Athens Chamber of Commerce",
        "85": "Swiss Chamber of Commerce",
        "86": "US Council for International Business",
        "87": "National Federation of Chambers of Commerce and Industry",
        "89": "Association of British Chambers of Commerce",
        "90": "SITA (Societe Internationale de Telecommunications Aeronautiques)",
        "91": "Assigned by seller or seller's agent",
        "92": "Assigned by buyer or buyer's agent",
        "103": "TW, Trade-van",
        "128": "CH, BCNR (Swiss Clearing Bank Number)",
        "129": "CH, BPI (Swiss Business Partner Identification)",
        "144": "US, DoDAAC (Department of Defense Activity Address Code)",
        "145": "FR, DGCP (Direction Generale de la Comptabilite Publique)",
        "146": "FR, DGI (Direction Generale des Impots)",
        "147": "JP, JIPDEC/ECPC (Japan Information Processing Development Corporation / Electronic Commerce Promotion Center)",
        "148": "ITU (International Telecommunications Union) Data Network Identification Code (DNIC)",
        "500": "DE, BDEW (Bundesverband der Energie- und Wasserwirtschaft e.V.)",
        "501": "EASEE-gas (European Association for the Streamlining of Energy Exchange) ",
        "502": "DE, DVGW (Deutsche Vereinigung des Gas- und Wasserfaches e.V.)",
        "Z01": "Vehicle registration number",
        "ZZZ": "Mutually defined"
      },
      "Recipient reference/password qualifier": {
        "AA": "Reference",
        "AB": "Password"
      },
      "Processing priority code": {
        "A": "Highest priority"
      },
      "Acknowledgement request": {
        "1": "Acknowledgement requested",
        "2": "Indication of receipt"
      },
      "Test indicator": {
        "1": "Interchange is a test",
        "2": "Syntax only test",
        "3": "Echo request",
        "4": "Echo response",
        "5": "Interchange is a service provider test"
      }
    }
  }));
  public static UNB_SYNTAX_4: EdiReleaseSchemaSegment = EdiReleaseSchemaSegment.UNB.clone();
  static {
    EdiReleaseSchemaSegment.UNB_SYNTAX_4.elements[3].components[0].maxLength = 8;
    EdiReleaseSchemaSegment.UNB_SYNTAX_4.elements[3].components[0].minLength = 8;
    EdiReleaseSchemaSegment.UNB_SYNTAX_4._schema!.addQualifier("Syntax identifier", "", "");
    EdiReleaseSchemaSegment.UNB_SYNTAX_4._schema!.addQualifier("Syntax identifier", "UNOG", "UN/ECE level G: As defined in ISO/IEC 8859-3 : Information technology - Part 3: Latin alphabet No. 3.");
    EdiReleaseSchemaSegment.UNB_SYNTAX_4._schema!.addQualifier("Syntax identifier", "UNOH", "UN/ECE level H: As defined in ISO/IEC 8859-4 : Information technology - Part 4: Latin alphabet No. 4.");
    EdiReleaseSchemaSegment.UNB_SYNTAX_4._schema!.addQualifier("Syntax identifier", "UNOI", "UN/ECE level I: As defined in ISO/IEC 8859-6 : Information technology - Part 6: Latin/Arabic alphabet.");
    EdiReleaseSchemaSegment.UNB_SYNTAX_4._schema!.addQualifier("Syntax identifier", "UNOJ", "UN/ECE level J: As defined in ISO/IEC 8859-8 : Information technology - Part 8: Latin/Hebrew alphabet.");
    EdiReleaseSchemaSegment.UNB_SYNTAX_4._schema!.addQualifier("Syntax identifier", "UNOK", "UN/ECE level K: As defined in ISO/IEC 8859-9 : Information technology - Part 9: Latin alphabet No. 5.");
    EdiReleaseSchemaSegment.UNB_SYNTAX_4._schema!.addQualifier("Syntax identifier", "UNOX", "UN/ECE level X: Code extension technique as defined by ISO 2022 utilising the escape techniques in accordance with ISO 2375.");
    EdiReleaseSchemaSegment.UNB_SYNTAX_4._schema!.addQualifier("Syntax identifier", "UNOY", "UN/ECE level Y: ISO 10646-1 octet without code extension technique.");
  }
  public static UNZ: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Interchange trailer",
    Elements: [
      { Id: "0036", Required: true, MinLength: 1, MaxLength: 6, Desc: "Interchange control count", Definition: "Count either of the number of messages or, if used, of the number of functional groups in an interchange.", mock: true },
      { Id: "0020", Required: true, MinLength: 1, MaxLength: 14, Desc: "Interchange control reference", Definition: "Unique reference assigned by the sender to an interchange.", mock: true },
    ],
    Purpose: "To end and check the completeness of an interchange.",
    mock: true
  }, undefined);
  // TODO: Id is supposed to be a number
  // X12
  public static ISA: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Interchange Control Header",
    Elements: [
      { Id: "I01", Required: true, MinLength: 2, MaxLength: 2, Definition: "Code to identify the type of information in the Authorization Information", Desc: "Authorization Information Qualifier" },
      { Id: "I02", Required: true, MinLength: 10, MaxLength: 10, Definition: "Information used for additional identification or authorization of the interchange sender or the data in the interchange; the type of information is set by the Authorization Information Qualifier (I01)", Desc: "Authorization Information" },
      { Id: "I03", Required: true, MinLength: 2, MaxLength: 2, Definition: "Code to identify the type of information in the Security Information", Desc: "Security Information Qualifier" },
      { Id: "I04", Required: true, MinLength: 10, MaxLength: 10, Definition: "This is used for identifying the security information about the interchange sender or the data in the interchange; the type of information is set by the Security Information Qualifier (I03)", Desc: "Security Information" },
      { Id: "I05", Required: true, MinLength: 2, MaxLength: 2, Definition: "Qualifier to designate the system/method of code structure used to designate the sender or receiver ID element being qualified", Desc: "Interchange ID Qualifier" },
      { Id: "I06", Required: true, MinLength: 15, MaxLength: 15, Definition: "Identification code published by the sender for other parties to use as the receiver ID to route data to them; the sender always codes this value in the sender ID element", Desc: "Interchange Sender ID" },
      { Id: "I05", Required: true, MinLength: 2, MaxLength: 2, Definition: "Qualifier to designate the system/method of code structure used to designate the sender or receiver ID element being qualified", Desc: "Interchange ID Qualifier" },
      { Id: "I07", Required: true, MinLength: 15, MaxLength: 15, Definition: "Identification code published by the receiver of the data; When sending, it is used by the sender as their sending ID, thus other parties sending to them will use this as a receiving ID to route data to them", Desc: "Interchange Receiver ID" },
      { Id: "I08", Required: true, MinLength: 6, MaxLength: 6, Definition: "Date of the interchange", Desc: "Interchange Date" },
      { Id: "I09", Required: true, MinLength: 4, MaxLength: 4, Definition: "Time of the interchange", Desc: "Interchange Time" },
      { Id: "I10", Required: true, MinLength: 1, MaxLength: 1, Definition: "Code to identify the agency responsible for the control standard used by the message that is enclosed by the interchange header and trailer", Desc: "Interchange Control Standards Identifier" },
      { Id: "I11", Required: true, MinLength: 5, MaxLength: 5, Definition: "This version number covers the interchange control segments", Desc: "Interchange Control Version Number" },
      { Id: "I12", Required: true, MinLength: 9, MaxLength: 9, Definition: "A control number assigned by the interchange sender", Desc: "Interchange Control Number" },
      { Id: "I13", Required: true, MinLength: 1, MaxLength: 1, Definition: "Code sent by the sender to request an interchange acknowledgment (TA1)", Desc: "Acknowledgment Requested" },
      { Id: "I14", Required: true, MinLength: 1, MaxLength: 1, Definition: "Code to indicate whether data enclosed by this interchange envelope is test, production or information", Desc: "Usage Indicator" },
      { Id: "I15", Required: true, MinLength: 1, MaxLength: 1, Definition: "Type is not applicable; the component element separator is a delimiter and not a data element; this field provides the delimiter used to separate component data elements within a composite data structure; this value must be different than the data element separator and the segment terminator", Desc: "Component Element Separator" },
    ],
    Purpose: "To start and identify an interchange of zero or more functional groups and interchange-related control segments",
    mock: true
  }, undefined);
  public static GS_lt_00401: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Functional Group Header",
    Elements: [
      { Id: "479", Required: true, MinLength: 2, MaxLength: 2, Definition: "Code identifying a group of application related transaction sets", Desc: "Functional Identifier Code" },
      { Id: "142", Required: true, MinLength: 2, MaxLength: 15, Definition: "Code identifying party sending transmission; codes agreed to by trading partners", Desc: "Application Sender's Code" },
      { Id: "124", Required: true, MinLength: 2, MaxLength: 15, Definition: "Code identifying party receiving transmission. Codes agreed to by trading partners", Desc: "Application Receiver's Code" },
      { Id: "373", Required: true, MinLength: 6, MaxLength: 6, Definition: "Date expressed as YYMMDD", Desc: "Date" },
      { Id: "337", Required: true, MinLength: 4, MaxLength: 8, Definition: "Time expressed in 24-hour clock time as follows: HHMM, or HHMMSS, or HHMMSSD, or HHMMSSDD, where H = hours (00-23), M = minutes (00-59), S = integer seconds (00-59) and DD = decimal seconds; decimal seconds are expressed as follows: D = tenths (0-9) and DD = hundredths (00-99)", Desc: "Time" },
      { Id: "28", Required: true, MinLength: 1, MaxLength: 9, Definition: "Assigned number originated and maintained by the sender", Desc: "Group Control Number" },
      { Id: "455", Required: true, MinLength: 1, MaxLength: 2, Definition: "Code used in conjunction with Data Element 480 to identify the issuer of the standard", Desc: "Responsible Agency Code" },
      { Id: "480", Required: true, MinLength: 1, MaxLength: 12, Definition: "Code indicating the version, release, subrelease, and industry identifier of the EDI standard being used, including the GS and GE segments; if code in DE455 in GS segment is X, then in DE 480 positions 1-3 are the version number; positions 4-6 are the release and subrelease, level of the version; and positions 7-12 are the industry or trade association identifiers (optionally assigned by user); if code in DE455 in GS segment is T, then other formats are allowed", Desc: "Version / Release / Industry Identifier Code" },
    ],
    Purpose: "To indicate the beginning of a functional group and to provide control information",
    mock: true
  }, undefined);
  public static GS_ge_00401: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Functional Group Header",
    Elements: [
      { Id: "479", Required: true, MinLength: 2, MaxLength: 2, Definition: "Code identifying a group of application related transaction sets", Desc: "Functional Identifier Code" },
      { Id: "142", Required: true, MinLength: 2, MaxLength: 15, Definition: "Code identifying party sending transmission; codes agreed to by trading partners", Desc: "Application Sender's Code" },
      { Id: "124", Required: true, MinLength: 2, MaxLength: 15, Definition: "Code identifying party receiving transmission. Codes agreed to by trading partners", Desc: "Application Receiver's Code" },
      { Id: "373", Required: true, MinLength: 8, MaxLength: 8, Definition: "Date expressed as CCYYMMDD", Desc: "Date" },
      { Id: "337", Required: true, MinLength: 4, MaxLength: 8, Definition: "Time expressed in 24-hour clock time as follows: HHMM, or HHMMSS, or HHMMSSD, or HHMMSSDD, where H = hours (00-23), M = minutes (00-59), S = integer seconds (00-59) and DD = decimal seconds; decimal seconds are expressed as follows: D = tenths (0-9) and DD = hundredths (00-99)", Desc: "Time" },
      { Id: "28", Required: true, MinLength: 1, MaxLength: 9, Definition: "Assigned number originated and maintained by the sender", Desc: "Group Control Number" },
      { Id: "455", Required: true, MinLength: 1, MaxLength: 2, Definition: "Code used in conjunction with Data Element 480 to identify the issuer of the standard", Desc: "Responsible Agency Code" },
      { Id: "480", Required: true, MinLength: 1, MaxLength: 12, Definition: "Code indicating the version, release, subrelease, and industry identifier of the EDI standard being used, including the GS and GE segments; if code in DE455 in GS segment is X, then in DE 480 positions 1-3 are the version number; positions 4-6 are the release and subrelease, level of the version; and positions 7-12 are the industry or trade association identifiers (optionally assigned by user); if code in DE455 in GS segment is T, then other formats are allowed", Desc: "Version / Release / Industry Identifier Code" },
    ],
    Purpose: "To indicate the beginning of a functional group and to provide control information",
    mock: true
  }, undefined);
  public static GE: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Functional Group Trailer",
    Elements: [
      { Id: "97", Required: true, MinLength: 1, MaxLength: 6, Definition: "Total number of transaction sets included in the functional group or interchange (transmission) group terminated by the trailer containing this data element", Desc: "Number of Transaction Sets Included" },
      { Id: "28", Required: true, MinLength: 1, MaxLength: 9, Definition: "Assigned number originated and maintained by the sender", Desc: "Group Control Number" },
    ],
    Purpose: "To indicate the end of a functional group and to provide control information",
    mock: true
  }, undefined);
  public static IEA: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Interchange Control Trailer",
    Elements: [
      { Id: "I16", Required: true, MinLength: 1, MaxLength: 5, Definition: "A count of the number of functional groups included in an interchange", Desc: "Number of Transaction Sets Included" },
      { Id: "I12", Required: true, MinLength: 9, MaxLength: 9, Definition: "A control number assigned by the interchange sender", Desc: "Group Control Number" },
    ],
    Purpose: "To define the end of an interchange of zero or more functional groups and interchange-related control segments",
    mock: true
  }, undefined);

  constructor(raw: any, schema: EdiReleaseSchema | undefined) {
    this.desc = raw.Desc;
    this.purpose = raw.Purpose;
    this.elements = raw.Elements?.map((e: any) => new EdiReleaseSchemaElement(e, schema));
    this._schema = schema;
    this.mock = !!raw.mock;
    this.raw = raw;
  }

  clone(): EdiReleaseSchemaSegment {
    return new EdiReleaseSchemaSegment(this.raw, this._schema?.clone());
  }
}

export class EdiVersionSegment {
  Id: string;
  Min?: number;
  Max?: number | "unbounded";
  Loop?: EdiVersionSegment[];

  constructor (raw: any) {
    this.Id = raw.Id;
    this.Min = raw.Min;
    this.Max = raw.Max;
    if (raw.Loop) {
      this.Loop = raw.Loop.map((i: any) => new EdiVersionSegment(i));
    }
  }

  isLoop(): boolean {
    return this.Loop !== undefined;
  }

  getMax(): number {
    if (this.Max === undefined) {
      return 1;
    } else if (this.Max === "unbounded") {
      return 99999;
    } else {
      return this.Max;
    }
  }
}

export class EdiVersionSchema {
  public Release: string;
  public DocumentType: string;
  public Introduction: string;
  public name: string;
  public TransactionSet: EdiVersionSegment[];

  constructor (raw: any) {
    this.Release = raw.Release;
    this.DocumentType = raw.DocumentType;
    this.Introduction = raw.Introduction;
    this.name = raw.name;

    this.TransactionSet = raw.TransactionSet.map((i: any) => new EdiVersionSegment(i));
  }
}

const versionMessageInfos: Record<string, MessageInfo> = [...r00401_message_infos, ...d96a_message_infos].reduce((infos, cur) => {
  infos[cur.version] = cur;
  return infos;
}, {} as Record<string, MessageInfo>);

export function getMessageInfo(version: string | undefined): MessageInfo | undefined {
  if (!version) return undefined;
  return versionMessageInfos[version];
}