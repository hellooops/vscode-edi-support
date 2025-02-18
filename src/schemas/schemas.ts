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
    this.release = raw.Release;
    this.qualifiers = {};
    if (raw.Qualifiers) {
      for (let qualifierName in raw.Qualifiers) {
        const qualifier = raw.Qualifiers[qualifierName];
        this.qualifiers[qualifierName] = Object.keys(qualifier).map(qualifierKey => {
          return new EdiQualifier(qualifierKey, qualifier[qualifierKey]);
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
          { Id: "0001", Desc: "Syntax identifier", DataType: "AN", Required: true, MinLength: 4, MaxLength: 4, Definition: "Coded identification of the agency controlling a syntax and syntax level used in an interchange.", mock: true },
          { Id: "0002", Desc: "Syntax version number", DataType: "N", Required: true, MinLength: 1, MaxLength: 1, Definition: "Version number of the syntax identified in the syntax identifier (0001)", mock: true },
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
          { Id: "0007", Desc: "Partner identification code qualifier", DataType: "AN", Required: false, MinLength: 1, MaxLength: 4, Definition: "Qualifier referring to the source of codes for the identifiers of interchanging partners.", mock: true },
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
          { Id: "0007", Desc: "Partner identification code qualifier", DataType: "AN", Required: false, MinLength: 1, MaxLength: 4, Definition: "Qualifier referring to the source of codes for the identifiers of interchanging partners.", mock: true },
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
          { Id: "0025", Desc: "Recipient's reference/password qualifier", DataType: "AN", Required: false, MinLength: 2, MaxLength: 2, Definition: "Qualifier for the recipient's reference or password.", mock: true },
        ],
        mock: true
      },
      { Id: "0026", Desc: "Application reference", DataType: "AN", Required: false, MinLength: 1, MaxLength: 14, Definition: "Identification of the application area assigned by the sender, to which the messages in the interchange relate e.g. the message identifier if all the messages in the interchange are of the same type.", mock: true },
      { Id: "0029", Desc: "Processing priority code", DataType: "AN", Required: false, MinLength: 1, MaxLength: 1, Definition: "Code determined by the sender requesting processing priority for the interchange.", mock: true },
      { Id: "0031", Desc: "Acknowledgement request", DataType: "N", Required: false, MinLength: 1, MaxLength: 1, Definition: "Code determined by the sender for acknowledgement of the interchange.", mock: true },
      { Id: "0032", Desc: "Communications agreement ID", DataType: "AN", Required: false, MinLength: 1, MaxLength: 35, Definition: "Identification by name or code of the type of agreement under which the interchange takes place.", mock: true },
      { Id: "0035", Desc: "Test indicator", DataType: "N", Required: false, MinLength: 1, MaxLength: 1, Definition: "Indication that the interchange is a test.", mock: true },
    ],
    Purpose: "To start, identify and specify an interchange.",
    mock: true
  }, undefined);
  public static UNB_SYNTAX_4: EdiReleaseSchemaSegment = EdiReleaseSchemaSegment.UNB.clone();
  static {
    EdiReleaseSchemaSegment.UNB_SYNTAX_4.elements[3].components[0].maxLength = 8;
    EdiReleaseSchemaSegment.UNB_SYNTAX_4.elements[3].components[0].minLength = 8;
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
    return new EdiReleaseSchemaSegment(this.raw, this._schema);
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