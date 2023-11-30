export class EdiSchema {
  public ediReleaseSchema: EdiReleaseSchema;
  public ediVersionSchema?: EdiVersionSchema;

  constructor(rawReleaseSchema: any) {
    this.ediReleaseSchema = new EdiReleaseSchema(rawReleaseSchema);
    this.ediVersionSchema = undefined;  // TODO(Deric): May implement message schemas in the future.
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
    return this.desc.replace(/"/g, '\\"');
  }
}

export class EdiReleaseSchema {
  private _rawSchema: any;

  public release: string;
  public qualifiers: Record<string, EdiQualifier[]>;
  public segments: Record<string, EdiReleaseSchemaSegment>;
  constructor (raw: any) {
    this.release = raw.Release;
    if (raw.Qualifiers) {
      this.qualifiers = {};
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

  public mock: boolean;
  // EDIFACT
  public static UNA: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Delimiter String Advice",
    Elements: [
      { Id: "UNA01", Required: true, MinLength: 1, MaxLength: 1, Desc: "Sub-element delimiter", mock: true },
      { Id: "UNA02", Required: true, MinLength: 1, MaxLength: 1, Desc: "Data element delimiter", mock: true },
      { Id: "UNA03", Required: true, MinLength: 1, MaxLength: 1, Desc: "Decimal point indicator", mock: true },
      { Id: "UNA04", Required: true, MinLength: 1, MaxLength: 1, Desc: "Release character", mock: true },
      { Id: "UNA05", Required: true, MinLength: 1, MaxLength: 1, Desc: "Space", mock: true },
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
        Required: true,
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
  public static UNZ: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Interchange trailer",
    Elements: [
      { Id: "0036", Required: true, MinLength: 1, MaxLength: 6, Desc: "Interchange control count", mock: true },
      { Id: "0020", Required: true, MinLength: 1, MaxLength: 14, Desc: "Interchange control reference", mock: true },
    ],
    Purpose: "To end and check the completeness of an interchange.",
    mock: true
  }, undefined);
  // TODO: Add UNT
  // TODO: Id is supposed to be a number
  // X12
  public static ISA: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Interchange Control Header",
    Elements: [
      { Id: "I01", Required: true, MinLength: 2, MaxLength: 2, Desc: "Authorization Information Qualifier" },
      { Id: "I02", Required: true, MinLength: 10, MaxLength: 10, Desc: "Authorization Information" },
      { Id: "I03", Required: true, MinLength: 2, MaxLength: 2, Desc: "Security Information Qualifier" },
      { Id: "I04", Required: true, MinLength: 10, MaxLength: 10, Desc: "Security Information" },
      { Id: "I05", Required: true, MinLength: 2, MaxLength: 2, Desc: "Interchange ID Qualifier" },
      { Id: "I06", Required: true, MinLength: 15, MaxLength: 15, Desc: "Interchange Sender ID" },
      { Id: "I05", Required: true, MinLength: 2, MaxLength: 2, Desc: "Interchange ID Qualifier" },
      { Id: "I07", Required: true, MinLength: 15, MaxLength: 15, Desc: "Interchange Receiver ID" },
      { Id: "I08", Required: true, MinLength: 6, MaxLength: 6, Desc: "Interchange Date" },
      { Id: "I09", Required: true, MinLength: 4, MaxLength: 4, Desc: "Interchange Time" },
      { Id: "I10", Required: true, MinLength: 1, MaxLength: 1, Desc: "Interchange Control Standards Identifier" },
      { Id: "I11", Required: true, MinLength: 5, MaxLength: 5, Desc: "Interchange Control Version Number" },
      { Id: "I12", Required: true, MinLength: 9, MaxLength: 9, Desc: "Interchange Control Number" },
      { Id: "I13", Required: true, MinLength: 1, MaxLength: 1, Desc: "Acknowledgment Requested" },
      { Id: "I14", Required: true, MinLength: 1, MaxLength: 1, Desc: "Usage Indicator" },
      { Id: "I15", Required: true, MinLength: 1, MaxLength: 1, Desc: "Component Element Separator" },
    ],
    Purpose: "To start and identify an interchange of zero or more functional groups and interchange-related control segments",
    mock: true
  }, undefined);
  public static GS_lt_00401: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Functional Group Header",
    Elements: [
      { Id: "479", Required: true, MinLength: 2, MaxLength: 2, Desc: "Functional Identifier Code" },
      { Id: "142", Required: true, MinLength: 2, MaxLength: 15, Desc: "Application Sender's Code" },
      { Id: "124", Required: true, MinLength: 2, MaxLength: 15, Desc: "Application Receiver's Code" },
      { Id: "373", Required: true, MinLength: 6, MaxLength: 6, Desc: "Date" },
      { Id: "337", Required: true, MinLength: 4, MaxLength: 8, Desc: "Time" },
      { Id: "28", Required: true, MinLength: 1, MaxLength: 9, Desc: "Group Control Number" },
      { Id: "455", Required: true, MinLength: 1, MaxLength: 2, Desc: "Responsible Agency Code" },
      { Id: "480", Required: true, MinLength: 1, MaxLength: 12, Desc: "Version / Release / Industry Identifier Code" },
    ],
    Purpose: "To indicate the beginning of a functional group and to provide control information",
    mock: true
  }, undefined);
  public static GS_ge_00401: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Functional Group Header",
    Elements: [
      { Id: "479", Required: true, MinLength: 2, MaxLength: 2, Desc: "Functional Identifier Code" },
      { Id: "142", Required: true, MinLength: 2, MaxLength: 15, Desc: "Application Sender's Code" },
      { Id: "124", Required: true, MinLength: 2, MaxLength: 15, Desc: "Application Receiver's Code" },
      { Id: "373", Required: true, MinLength: 8, MaxLength: 8, Desc: "Date" },
      { Id: "337", Required: true, MinLength: 4, MaxLength: 8, Desc: "Time" },
      { Id: "28", Required: true, MinLength: 1, MaxLength: 9, Desc: "Group Control Number" },
      { Id: "455", Required: true, MinLength: 1, MaxLength: 2, Desc: "Responsible Agency Code" },
      { Id: "480", Required: true, MinLength: 1, MaxLength: 12, Desc: "Version / Release / Industry Identifier Code" },
    ],
    Purpose: "To indicate the beginning of a functional group and to provide control information",
    mock: true
  }, undefined);
  public static GE: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Functional Group Trailer",
    Elements: [
      { Id: "97", Required: true, MinLength: 1, MaxLength: 6, Desc: "Number of Transaction Sets Included" },
      { Id: "28", Required: true, MinLength: 1, MaxLength: 9, Desc: "Group Control Number" },
    ],
    Purpose: "To indicate the end of a functional group and to provide control information",
    mock: true
  }, undefined);
  public static IEA: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Interchange Control Trailer",
    Elements: [
      { Id: "I16", Required: true, MinLength: 1, MaxLength: 5, Desc: "Number of Transaction Sets Included" },
      { Id: "I12", Required: true, MinLength: 9, MaxLength: 9, Desc: "Group Control Number" },
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
  }
}

export class EdiVersionSchema {
  // TODO(Deric): May implement message schemas in the future.
}