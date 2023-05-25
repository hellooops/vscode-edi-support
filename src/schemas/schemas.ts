export class EdiSchema {
  public ediReleaseSchema: EdiReleaseSchema;
  public ediVersionSchema: EdiVersionSchema;

  constructor(rawReleaseSchema: any) {
    this.ediReleaseSchema = new EdiReleaseSchema(rawReleaseSchema);
    this.ediVersionSchema = null; // TODO(Deric)
  }
}

export class EdiQualifier {
  public value: string;
  public desc: string;

  constructor(value: string, desc: string) {
    this.value = value;
    this.desc = desc;
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
    if (name === "UNA") {
      return EdiReleaseSchemaSegment.UNA;
    } else if (name === "UNB") {
      return EdiReleaseSchemaSegment.UNB;
    }

    return this.segments[name];
  }
}

export class EdiReleaseSchemaElement {
  private _schema: EdiReleaseSchema;
  public id: string;
  public desc: string;
  public dataType: string;
  public required: boolean;
  public minLength: number;
  public maxLength: number;
  public qualifierRef: string;
  public definition: string;
  public components: EdiReleaseSchemaElement[];

  constructor(raw: any, schema: EdiReleaseSchema) {
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
  private _schema: EdiReleaseSchema;
  public desc: string;
  public purpose: string;
  public elements: EdiReleaseSchemaElement[];
  public static UNA: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Delimiter String Advice",
    Elements: [
      { Id: "UNA01", Required: true, MinLength: 1, MaxLength: 1, Desc: "Sub-element delimiter" },
      { Id: "UNA02", Required: true, MinLength: 1, MaxLength: 1, Desc: "Data element delimiter" },
      { Id: "UNA03", Required: true, MinLength: 1, MaxLength: 1, Desc: "Decimal point indicator" },
      { Id: "UNA04", Required: true, MinLength: 1, MaxLength: 1, Desc: "Release character" },
      { Id: "UNA05", Required: true, MinLength: 1, MaxLength: 1, Desc: "Space" },
      { Id: "UNA06", Required: true, MinLength: 1, MaxLength: 1, Desc: "Segment terminator" },
    ],
    Purpose: "To start, identify and specify an interchange."
  }, null);
  public static UNB: EdiReleaseSchemaSegment = new EdiReleaseSchemaSegment({
    Desc: "Interchange header",
    Elements: [
      {
        Id: "S001",
        Desc: "Syntax identifier",
        Required: true,
        Components: [
          { Id: "0001", Desc: "Syntax identifier", DataType: "AN", Required: true, MinLength: 4, MaxLength: 4, Definition: "Coded identification of the agency controlling a syntax and syntax level used in an interchange." },
          { Id: "0002", Desc: "Syntax version number", DataType: "N", Required: true, MinLength: 1, MaxLength: 1, Definition: "Version number of the syntax identified in the syntax identifier (0001)" },
        ]
      },
      {
        Id: "S002",
        Desc: "Interchange sender",
        Required: true,
        Components: [
          { Id: "0004", Desc: "Sender identification", DataType: "AN", Required: true, MinLength: 1, MaxLength: 35, Definition: "Name or coded representation of the sender of a data interchange." },
          { Id: "0007", Desc: "Partner identification code qualifier", DataType: "AN", Required: false, MinLength: 1, MaxLength: 4, Definition: "Qualifier referring to the source of codes for the identifiers of interchanging partners." },
          { Id: "0008", Desc: "Address for reverse routing", DataType: "AN", Required: false, MinLength: 1, MaxLength: 14, Definition: "Address specified by the sender of an interchange to be included by the recipient in the response interchanges to facilitate internal routing." },
        ]
      },
      {
        Id: "S003",
        Desc: "Interchange recipient",
        Required: true,
        Components: [
          { Id: "0010", Desc: "Recipient identification", DataType: "AN", Required: true, MinLength: 1, MaxLength: 35, Definition: "Name or coded representation of the recipient of a data interchange." },
          { Id: "0007", Desc: "Partner identification code qualifier", DataType: "AN", Required: false, MinLength: 1, MaxLength: 4, Definition: "Qualifier referring to the source of codes for the identifiers of interchanging partners." },
          { Id: "0014", Desc: "Routing address", DataType: "AN", Required: false, MinLength: 1, MaxLength: 14, Definition: "Address specified by the recipient of an interchange to be included by the sender and used by the recipient for routing of received interchanges inside his organization." },
        ]
      },
      {
        Id: "S004",
        Desc: "Date/time of preparation",
        Required: true,
        Components: [
          { Id: "0017", Desc: "Date of preparation", DataType: "N", Required: true, MinLength: 6, MaxLength: 6, Definition: "Local date when an interchange or a functional group was prepared." },
          { Id: "0019", Desc: "Time of preparation", DataType: "N", Required: false, MinLength: 4, MaxLength: 4, Definition: "Local time of day when an interchange or a functional group was prepared." },
        ]
      },
      { Id: "0020", Desc: "Interchange control reference", DataType: "AN", Required: true, MinLength: 1, MaxLength: 14, Definition: "Unique reference assigned by the sender to an interchange." },
      {
        Id: "S005",
        Desc: "Recipient's reference, password",
        Required: true,
        Components: [
          { Id: "0022", Desc: "Recipient's reference/password", DataType: "AN", Required: true, MinLength: 1, MaxLength: 14, Definition: "Unique reference assigned by the recipient to the data interchange or a password to the recipient's system or to a third party network as specified in the partners interchange agreement." },
          { Id: "0025", Desc: "Recipient's reference/password qualifier", DataType: "AN", Required: false, MinLength: 2, MaxLength: 2, Definition: "Qualifier for the recipient's reference or password." },
        ]
      },
      { Id: "0026", Desc: "Application reference", DataType: "AN", Required: false, MinLength: 1, MaxLength: 14, Definition: "Identification of the application area assigned by the sender, to which the messages in the interchange relate e.g. the message identifier if all the messages in the interchange are of the same type." },
      { Id: "0029", Desc: "Processing priority code", DataType: "AN", Required: false, MinLength: 1, MaxLength: 1, Definition: "Code determined by the sender requesting processing priority for the interchange." },
      { Id: "0031", Desc: "Acknowledgement request", DataType: "N", Required: false, MinLength: 1, MaxLength: 1, Definition: "Code determined by the sender for acknowledgement of the interchange." },
      { Id: "0032", Desc: "Communications agreement ID", DataType: "AN", Required: false, MinLength: 1, MaxLength: 35, Definition: "Identification by name or code of the type of agreement under which the interchange takes place." },
      { Id: "0035", Desc: "Test indicator", DataType: "N", Required: false, MinLength: 1, MaxLength: 1, Definition: "Indication that the interchange is a test." },
    ],
    Purpose: "To start, identify and specify an interchange."
  }, null);

  constructor(raw: any, schema: EdiReleaseSchema) {
    this.desc = raw.Desc;
    this.purpose = raw.Purpose;
    this.elements = raw.Elements?.map((e: any) => new EdiReleaseSchemaElement(e, schema));
    this._schema = schema;
  }
}

export class EdiVersionSchema {
  // TODO(Deric)
}