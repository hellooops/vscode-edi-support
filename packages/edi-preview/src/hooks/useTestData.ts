export default function useTestData(): IEdiMessage {
  return {
    ediVersion: { release: "D96A", version: "ORDERS" },
    segments: [
      {
        key: 0,
        id: "UNB",
        desc: "Interchange header",
        purpose: "To start, identify and specify an interchange.",
        elements: [
          {
            key: "UNB01",
            type: "Data Element",
            value: "UNOA:2",
            components: [
              {
                key: "UNB0101",
                type: "Component Element",
                value: "UNOA",
                id: "0001",
                desc: "Syntax identifier",
                dataType: "AN",
                required: true,
                minLength: 4,
                maxLength: 4,
                definition:
                  "Coded identification of the agency controlling a syntax and syntax level used in an interchange."
              },
              {
                key: "UNB0102",
                type: "Component Element",
                value: "2",
                id: "0002",
                desc: "Syntax version number",
                dataType: "N",
                required: true,
                minLength: 1,
                maxLength: 1,
                definition:
                  "Version number of the syntax identified in the syntax identifier (0001)"
              }
            ],
            id: "S001",
            desc: "Syntax identifier",
            required: true
          },
          {
            key: "UNB02",
            type: "Data Element",
            value: "<Sender GLN>:14",
            components: [
              {
                key: "UNB0201",
                type: "Component Element",
                value: "<Sender GLN>",
                id: "0004",
                desc: "Sender identification",
                dataType: "AN",
                required: true,
                minLength: 1,
                maxLength: 35,
                definition: "Name or coded representation of the sender of a data interchange."
              },
              {
                key: "UNB0202",
                type: "Component Element",
                value: "14",
                id: "0007",
                desc: "Partner identification code qualifier",
                dataType: "AN",
                required: false,
                minLength: 1,
                maxLength: 4,
                definition:
                  "Qualifier referring to the source of codes for the identifiers of interchanging partners."
              }
            ],
            id: "S002",
            desc: "Interchange sender",
            required: true
          },
          {
            key: "UNB03",
            type: "Data Element",
            value: "<Receiver GLN>:14",
            components: [
              {
                key: "UNB0301",
                type: "Component Element",
                value: "<Receiver GLN>",
                id: "0010",
                desc: "Recipient identification",
                dataType: "AN",
                required: true,
                minLength: 1,
                maxLength: 35,
                definition: "Name or coded representation of the recipient of a data interchange."
              },
              {
                key: "UNB0302",
                type: "Component Element",
                value: "14",
                id: "0007",
                desc: "Partner identification code qualifier",
                dataType: "AN",
                required: false,
                minLength: 1,
                maxLength: 4,
                definition:
                  "Qualifier referring to the source of codes for the identifiers of interchanging partners."
              }
            ],
            id: "S003",
            desc: "Interchange recipient",
            required: true
          },
          {
            key: "UNB04",
            type: "Data Element",
            value: "140407:0910",
            components: [
              {
                key: "UNB0401",
                type: "Component Element",
                value: "140407",
                id: "0017",
                desc: "Date of preparation",
                dataType: "N",
                required: true,
                minLength: 6,
                maxLength: 6,
                definition: "Local date when an interchange or a functional group was prepared."
              },
              {
                key: "UNB0402",
                type: "Component Element",
                value: "0910",
                id: "0019",
                desc: "Time of preparation",
                dataType: "N",
                required: false,
                minLength: 4,
                maxLength: 4,
                definition:
                  "Local time of day when an interchange or a functional group was prepared."
              }
            ],
            id: "S004",
            desc: "Date/time of preparation",
            required: true
          },
          {
            key: "UNB05",
            type: "Data Element",
            value: "5",
            id: "0020",
            desc: "Interchange control reference",
            dataType: "AN",
            required: true,
            minLength: 1,
            maxLength: 14,
            definition: "Unique reference assigned by the sender to an interchange."
          },
          {
            key: "UNB06",
            type: "Data Element",
            value: "000000001",
            components: [
              {
                key: "UNB0601",
                type: "Component Element",
                value: "000000001",
                id: "0022",
                desc: "Recipient's reference/password",
                dataType: "AN",
                required: true,
                minLength: 1,
                maxLength: 14,
                definition:
                  "Unique reference assigned by the recipient to the data interchange or a password to the recipient's system or to a third party network as specified in the partners interchange agreement."
              }
            ],
            id: "S005",
            desc: "Recipient's reference, password",
            required: true
          },
          {
            key: "UNB07",
            type: "Data Element",
            value: "",
            id: "0026",
            desc: "Application reference",
            dataType: "AN",
            required: false,
            minLength: 1,
            maxLength: 14,
            definition:
              "Identification of the application area assigned by the sender, to which the messages in the interchange relate e.g. the message identifier if all the messages in the interchange are of the same type."
          },
          {
            key: "UNB08",
            type: "Data Element",
            value: "",
            id: "0029",
            desc: "Processing priority code",
            dataType: "AN",
            required: false,
            minLength: 1,
            maxLength: 1,
            definition:
              "Code determined by the sender requesting processing priority for the interchange."
          },
          {
            key: "UNB09",
            type: "Data Element",
            value: "1",
            id: "0031",
            desc: "Acknowledgement request",
            dataType: "N",
            required: false,
            minLength: 1,
            maxLength: 1,
            definition: "Code determined by the sender for acknowledgement of the interchange."
          },
          {
            key: "UNB10",
            type: "Data Element",
            value: "EANCOM",
            id: "0032",
            desc: "Communications agreement ID",
            dataType: "AN",
            required: false,
            minLength: 1,
            maxLength: 35,
            definition:
              "Identification by name or code of the type of agreement under which the interchange takes place."
          }
        ]
      },
      {
        key: 82,
        id: "UNH",
        desc: "Message header",
        purpose: "To head, identify and specify a message.",
        elements: [
          {
            key: "UNH01",
            type: "Data Element",
            value: "1",
            id: "0062",
            desc: "MESSAGE REFERENCE NUMBER",
            dataType: "AN",
            required: true,
            minLength: 0,
            maxLength: 14,
            definition: "Unique message reference assigned by the sender."
          },
          {
            key: "UNH02",
            type: "Data Element",
            value: "ORDERS:D:96A:UN:EAN008",
            components: [
              {
                key: "UNH0201",
                type: "Component Element",
                value: "ORDERS",
                id: "0065",
                desc: "Message type identifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 6,
                codeValue: "Purchase order message",
                definition:
                  "Code identifying a type of message and assigned by its controlling agency."
              },
              {
                key: "UNH0202",
                type: "Component Element",
                value: "D",
                id: "0052",
                desc: "Message type version number",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                definition: "Version number of a message type."
              },
              {
                key: "UNH0203",
                type: "Component Element",
                value: "96A",
                id: "0054",
                desc: "Message type release number",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                definition: "Release number within the current message type version number (0052)."
              },
              {
                key: "UNH0204",
                type: "Component Element",
                value: "UN",
                id: "0051",
                desc: "Controlling agency",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 2,
                codeValue: "UN/ECE/TRADE/WP.4, United Nations Standard Messages (UNSM)",
                definition:
                  "Code to identify the agency controlling the specification, maintenance and publication of the message type."
              },
              {
                key: "UNH0205",
                type: "Component Element",
                value: "EAN008",
                id: "0057",
                desc: "Association assigned code",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 6,
                definition:
                  "A code assigned by the association responsible for the design and maintenance of the message type concerned, which further identifies the message."
              }
            ],
            id: "S009",
            desc: "MESSAGE IDENTIFIER",
            required: true,
            definition:
              "Identification of the type, version etc. of the message being interchanged."
          }
        ]
      },
      {
        key: 113,
        id: "BGM",
        desc: "BEGINNING OF MESSAGE",
        purpose:
          "To indicate the type and function of a message and to transmit the identifying number.",
        elements: [
          {
            key: "BGM01",
            type: "Data Element",
            value: "220",
            components: [
              {
                key: "BGM0101",
                type: "Component Element",
                value: "220",
                id: "1001",
                desc: "Document/message name, coded",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "Order",
                definition: "Document/message identifier expressed in code."
              }
            ],
            id: "C002",
            desc: "DOCUMENT/MESSAGE NAME",
            required: false,
            definition:
              "Identification of a type of document/message by code or name. Code preferred."
          },
          {
            key: "BGM02",
            type: "Data Element",
            value: "1AA1TEST",
            id: "1004",
            desc: "DOCUMENT/MESSAGE NUMBER",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 35,
            definition: "Reference number assigned to the document/message by the issuer."
          },
          {
            key: "BGM03",
            type: "Data Element",
            value: "9",
            id: "1225",
            desc: "MESSAGE FUNCTION, CODED",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 3,
            codeValue: "Original",
            definition: "Code indicating the function of the message."
          }
        ]
      },
      {
        key: 134,
        id: "DTM",
        desc: "DATE/TIME/PERIOD",
        purpose: "To specify date, and/or time, or period.",
        elements: [
          {
            key: "DTM01",
            type: "Data Element",
            value: "137:20140407:102",
            components: [
              {
                key: "DTM0101",
                type: "Component Element",
                value: "137",
                id: "2005",
                desc: "Date/time/period qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Document/message date/time",
                definition: "Code giving specific meaning to a date, time or period."
              },
              {
                key: "DTM0102",
                type: "Component Element",
                value: "20140407",
                id: "2380",
                desc: "Date/time/period",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition:
                  "The value of a date, a date and time, a time or of a period in a specified representation."
              },
              {
                key: "DTM0103",
                type: "Component Element",
                value: "102",
                id: "2379",
                desc: "Date/time/period format qualifier",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "CCYYMMDD",
                definition:
                  "Specification of the representation of a date, a date and time or of a period."
              }
            ],
            id: "C507",
            desc: "DATE/TIME/PERIOD",
            required: true,
            definition:
              "Date and/or time, or period relevant to the specified date/time/period type."
          }
        ]
      },
      {
        key: 157,
        id: "DTM",
        desc: "DATE/TIME/PERIOD",
        purpose: "To specify date, and/or time, or period.",
        elements: [
          {
            key: "DTM01",
            type: "Data Element",
            value: "63:20140421:102",
            components: [
              {
                key: "DTM0101",
                type: "Component Element",
                value: "63",
                id: "2005",
                desc: "Date/time/period qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Delivery date/time, latest",
                definition: "Code giving specific meaning to a date, time or period."
              },
              {
                key: "DTM0102",
                type: "Component Element",
                value: "20140421",
                id: "2380",
                desc: "Date/time/period",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition:
                  "The value of a date, a date and time, a time or of a period in a specified representation."
              },
              {
                key: "DTM0103",
                type: "Component Element",
                value: "102",
                id: "2379",
                desc: "Date/time/period format qualifier",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "CCYYMMDD",
                definition:
                  "Specification of the representation of a date, a date and time or of a period."
              }
            ],
            id: "C507",
            desc: "DATE/TIME/PERIOD",
            required: true,
            definition:
              "Date and/or time, or period relevant to the specified date/time/period type."
          }
        ]
      },
      {
        key: 179,
        id: "DTM",
        desc: "DATE/TIME/PERIOD",
        purpose: "To specify date, and/or time, or period.",
        elements: [
          {
            key: "DTM01",
            type: "Data Element",
            value: "64:20140414:102",
            components: [
              {
                key: "DTM0101",
                type: "Component Element",
                value: "64",
                id: "2005",
                desc: "Date/time/period qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Delivery date/time, earliest",
                definition: "Code giving specific meaning to a date, time or period."
              },
              {
                key: "DTM0102",
                type: "Component Element",
                value: "20140414",
                id: "2380",
                desc: "Date/time/period",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition:
                  "The value of a date, a date and time, a time or of a period in a specified representation."
              },
              {
                key: "DTM0103",
                type: "Component Element",
                value: "102",
                id: "2379",
                desc: "Date/time/period format qualifier",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "CCYYMMDD",
                definition:
                  "Specification of the representation of a date, a date and time or of a period."
              }
            ],
            id: "C507",
            desc: "DATE/TIME/PERIOD",
            required: true,
            definition:
              "Date and/or time, or period relevant to the specified date/time/period type."
          }
        ]
      },
      {
        key: 201,
        id: "RFF",
        desc: "REFERENCE",
        purpose: "To specify a reference.",
        elements: [
          {
            key: "RFF01",
            type: "Data Element",
            value: "ADE:FIRSTORDER",
            components: [
              {
                key: "RFF0101",
                type: "Component Element",
                value: "ADE",
                id: "1153",
                desc: "Reference qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Account number",
                definition:
                  "Code giving specific meaning to a reference segment or a reference number."
              },
              {
                key: "RFF0102",
                type: "Component Element",
                value: "FIRSTORDER",
                id: "1154",
                desc: "Reference number",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition:
                  "Identification number the nature and function of which can be qualified by an entry in data element 1153 Reference qualifier."
              }
            ],
            id: "C506",
            desc: "REFERENCE",
            required: true,
            definition: "Identification of a reference."
          }
        ]
      },
      {
        key: 222,
        id: "RFF",
        desc: "REFERENCE",
        purpose: "To specify a reference.",
        elements: [
          {
            key: "RFF01",
            type: "Data Element",
            value: "PD:1704",
            components: [
              {
                key: "RFF0101",
                type: "Component Element",
                value: "PD",
                id: "1153",
                desc: "Reference qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Promotion deal number",
                definition:
                  "Code giving specific meaning to a reference segment or a reference number."
              },
              {
                key: "RFF0102",
                type: "Component Element",
                value: "1704",
                id: "1154",
                desc: "Reference number",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition:
                  "Identification number the nature and function of which can be qualified by an entry in data element 1153 Reference qualifier."
              }
            ],
            id: "C506",
            desc: "REFERENCE",
            required: true,
            definition: "Identification of a reference."
          }
        ]
      },
      {
        key: 236,
        id: "RFF",
        desc: "REFERENCE",
        purpose: "To specify a reference.",
        elements: [
          {
            key: "RFF01",
            type: "Data Element",
            value: "CR:ABCD5",
            components: [
              {
                key: "RFF0101",
                type: "Component Element",
                value: "CR",
                id: "1153",
                desc: "Reference qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Customer reference number",
                definition:
                  "Code giving specific meaning to a reference segment or a reference number."
              },
              {
                key: "RFF0102",
                type: "Component Element",
                value: "ABCD5",
                id: "1154",
                desc: "Reference number",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition:
                  "Identification number the nature and function of which can be qualified by an entry in data element 1153 Reference qualifier."
              }
            ],
            id: "C506",
            desc: "REFERENCE",
            required: true,
            definition: "Identification of a reference."
          }
        ]
      },
      {
        key: 251,
        id: "NAD",
        desc: "NAME AND ADDRESS",
        purpose:
          "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
        elements: [
          {
            key: "NAD01",
            type: "Data Element",
            value: "BY",
            id: "3035",
            desc: "PARTY QUALIFIER",
            dataType: "AN",
            required: true,
            minLength: 0,
            maxLength: 3,
            codeValue: "Buyer",
            definition: "Code giving specific meaning to a party."
          },
          {
            key: "NAD02",
            type: "Data Element",
            value: "5450534000024::9",
            components: [
              {
                key: "NAD0201",
                type: "Component Element",
                value: "5450534000024",
                id: "3039",
                desc: "Party id. identification",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 35,
                definition: "Code identifying a party involved in a transaction."
              },
              {
                key: "NAD0202",
                type: "Component Element",
                value: "",
                id: "1131",
                desc: "Code list qualifier",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                definition: "Identification of a code list."
              },
              {
                key: "NAD0203",
                type: "Component Element",
                value: "9",
                id: "3055",
                desc: "Code list responsible agency, coded",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "EAN (International Article Numbering association)",
                definition: "Code identifying the agency responsible for a code list."
              }
            ],
            id: "C082",
            desc: "PARTY IDENTIFICATION DETAILS",
            required: false,
            definition: "Identification of a transaction party by code."
          }
        ]
      },
      {
        key: 277,
        id: "NAD",
        desc: "NAME AND ADDRESS",
        purpose:
          "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
        elements: [
          {
            key: "NAD01",
            type: "Data Element",
            value: "SU",
            id: "3035",
            desc: "PARTY QUALIFIER",
            dataType: "AN",
            required: true,
            minLength: 0,
            maxLength: 3,
            codeValue: "Supplier",
            definition: "Code giving specific meaning to a party."
          },
          {
            key: "NAD02",
            type: "Data Element",
            value: "<Supplier GLN>::9",
            components: [
              {
                key: "NAD0201",
                type: "Component Element",
                value: "<Supplier GLN>",
                id: "3039",
                desc: "Party id. identification",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 35,
                definition: "Code identifying a party involved in a transaction."
              },
              {
                key: "NAD0202",
                type: "Component Element",
                value: "",
                id: "1131",
                desc: "Code list qualifier",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                definition: "Identification of a code list."
              },
              {
                key: "NAD0203",
                type: "Component Element",
                value: "9",
                id: "3055",
                desc: "Code list responsible agency, coded",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "EAN (International Article Numbering association)",
                definition: "Code identifying the agency responsible for a code list."
              }
            ],
            id: "C082",
            desc: "PARTY IDENTIFICATION DETAILS",
            required: false,
            definition: "Identification of a transaction party by code."
          }
        ]
      },
      {
        key: 304,
        id: "NAD",
        desc: "NAME AND ADDRESS",
        purpose:
          "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
        elements: [
          {
            key: "NAD01",
            type: "Data Element",
            value: "DP",
            id: "3035",
            desc: "PARTY QUALIFIER",
            dataType: "AN",
            required: true,
            minLength: 0,
            maxLength: 3,
            codeValue: "Delivery party",
            definition: "Code giving specific meaning to a party."
          },
          {
            key: "NAD02",
            type: "Data Element",
            value: "5450534000109::9",
            components: [
              {
                key: "NAD0201",
                type: "Component Element",
                value: "5450534000109",
                id: "3039",
                desc: "Party id. identification",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 35,
                definition: "Code identifying a party involved in a transaction."
              },
              {
                key: "NAD0202",
                type: "Component Element",
                value: "",
                id: "1131",
                desc: "Code list qualifier",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                definition: "Identification of a code list."
              },
              {
                key: "NAD0203",
                type: "Component Element",
                value: "9",
                id: "3055",
                desc: "Code list responsible agency, coded",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "EAN (International Article Numbering association)",
                definition: "Code identifying the agency responsible for a code list."
              }
            ],
            id: "C082",
            desc: "PARTY IDENTIFICATION DETAILS",
            required: false,
            definition: "Identification of a transaction party by code."
          },
          {
            key: "NAD03",
            type: "Data Element",
            value: "",
            id: "C058",
            desc: "NAME AND ADDRESS",
            required: false,
            definition: "Unstructured name and address: one to five lines."
          },
          {
            key: "NAD04",
            type: "Data Element",
            value: "",
            id: "C080",
            desc: "PARTY NAME",
            required: false,
            definition:
              "Identification of a transaction party by name, one to five lines. Party name may be formatted."
          },
          {
            key: "NAD05",
            type: "Data Element",
            value: "",
            id: "C059",
            desc: "STREET",
            required: false,
            definition:
              "Street address and/or PO Box number in a structured address: one to three lines."
          },
          {
            key: "NAD06",
            type: "Data Element",
            value: "",
            id: "3164",
            desc: "CITY NAME",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 35,
            definition: "Name of a city (a town, a village) for addressing purposes."
          },
          {
            key: "NAD07",
            type: "Data Element",
            value: "",
            id: "3229",
            desc: "COUNTRY SUB-ENTITY IDENTIFICATION",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 9,
            definition:
              "Identification of the name of sub-entities (state, province) defined by appropriate governmental agencies."
          },
          {
            key: "NAD08",
            type: "Data Element",
            value: "",
            id: "3251",
            desc: "POSTCODE IDENTIFICATION",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 9,
            definition: "Code defining postal zones or addresses."
          },
          {
            key: "NAD09",
            type: "Data Element",
            value: "GB",
            id: "3207",
            desc: "COUNTRY, CODED",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 3,
            definition:
              "Identification of the name of a country or other geographical entity as specified in ISO 3166."
          }
        ]
      },
      {
        key: 339,
        id: "NAD",
        desc: "NAME AND ADDRESS",
        purpose:
          "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
        elements: [
          {
            key: "NAD01",
            type: "Data Element",
            value: "IV",
            id: "3035",
            desc: "PARTY QUALIFIER",
            dataType: "AN",
            required: true,
            minLength: 0,
            maxLength: 3,
            codeValue: "Invoicee",
            definition: "Code giving specific meaning to a party."
          },
          {
            key: "NAD02",
            type: "Data Element",
            value: "5450534007139::9",
            components: [
              {
                key: "NAD0201",
                type: "Component Element",
                value: "5450534007139",
                id: "3039",
                desc: "Party id. identification",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 35,
                definition: "Code identifying a party involved in a transaction."
              },
              {
                key: "NAD0202",
                type: "Component Element",
                value: "",
                id: "1131",
                desc: "Code list qualifier",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                definition: "Identification of a code list."
              },
              {
                key: "NAD0203",
                type: "Component Element",
                value: "9",
                id: "3055",
                desc: "Code list responsible agency, coded",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "EAN (International Article Numbering association)",
                definition: "Code identifying the agency responsible for a code list."
              }
            ],
            id: "C082",
            desc: "PARTY IDENTIFICATION DETAILS",
            required: false,
            definition: "Identification of a transaction party by code."
          },
          {
            key: "NAD03",
            type: "Data Element",
            value: "",
            id: "C058",
            desc: "NAME AND ADDRESS",
            required: false,
            definition: "Unstructured name and address: one to five lines."
          },
          {
            key: "NAD04",
            type: "Data Element",
            value: "Test:Name2",
            components: [
              {
                key: "NAD0401",
                type: "Component Element",
                value: "Test",
                id: "3036",
                desc: "Party name",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 35,
                definition: "Name of a party involved in a transaction."
              },
              {
                key: "NAD0402",
                type: "Component Element",
                value: "Name2",
                id: "3036",
                desc: "Party name",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition: "Name of a party involved in a transaction."
              }
            ],
            id: "C080",
            desc: "PARTY NAME",
            required: false,
            definition:
              "Identification of a transaction party by name, one to five lines. Party name may be formatted."
          },
          {
            key: "NAD05",
            type: "Data Element",
            value: "Test Street:Steet2",
            components: [
              {
                key: "NAD0501",
                type: "Component Element",
                value: "Test Street",
                id: "3042",
                desc: "Street and number/p.o. box",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 35,
                definition: "Street and number in plain language, or Post Office Box No."
              },
              {
                key: "NAD0502",
                type: "Component Element",
                value: "Steet2",
                id: "3042",
                desc: "Street and number/p.o. box",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition: "Street and number in plain language, or Post Office Box No."
              }
            ],
            id: "C059",
            desc: "STREET",
            required: false,
            definition:
              "Street address and/or PO Box number in a structured address: one to three lines."
          },
          {
            key: "NAD06",
            type: "Data Element",
            value: "Beijing",
            id: "3164",
            desc: "CITY NAME",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 35,
            definition: "Name of a city (a town, a village) for addressing purposes."
          },
          {
            key: "NAD07",
            type: "Data Element",
            value: "",
            id: "3229",
            desc: "COUNTRY SUB-ENTITY IDENTIFICATION",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 9,
            definition:
              "Identification of the name of sub-entities (state, province) defined by appropriate governmental agencies."
          },
          {
            key: "NAD08",
            type: "Data Element",
            value: "EC2A 2FA",
            id: "3251",
            desc: "POSTCODE IDENTIFICATION",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 9,
            definition: "Code defining postal zones or addresses."
          },
          {
            key: "NAD09",
            type: "Data Element",
            value: "GB",
            id: "3207",
            desc: "COUNTRY, CODED",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 3,
            definition:
              "Identification of the name of a country or other geographical entity as specified in ISO 3166."
          }
        ]
      },
      {
        key: 417,
        id: "RFF",
        desc: "REFERENCE",
        purpose: "To specify a reference.",
        elements: [
          {
            key: "RFF01",
            type: "Data Element",
            value: "VA:GB727255821",
            components: [
              {
                key: "RFF0101",
                type: "Component Element",
                value: "VA",
                id: "1153",
                desc: "Reference qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "VAT registration number",
                definition:
                  "Code giving specific meaning to a reference segment or a reference number."
              },
              {
                key: "RFF0102",
                type: "Component Element",
                value: "GB727255821",
                id: "1154",
                desc: "Reference number",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition:
                  "Identification number the nature and function of which can be qualified by an entry in data element 1153 Reference qualifier."
              }
            ],
            id: "C506",
            desc: "REFERENCE",
            required: true,
            definition: "Identification of a reference."
          }
        ]
      },
      {
        key: 438,
        id: "CUX",
        desc: "CURRENCIES",
        purpose:
          "To specify currencies used in the transaction and relevant details for the rate of exchange.",
        elements: [
          {
            key: "CUX01",
            type: "Data Element",
            value: "2:EUR:9",
            components: [
              {
                key: "CUX0101",
                type: "Component Element",
                value: "2",
                id: "6347",
                desc: "Currency details qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Reference currency",
                definition: "Specification of the usage to which the currency relates."
              },
              {
                key: "CUX0102",
                type: "Component Element",
                value: "EUR",
                id: "6345",
                desc: "Currency, coded",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                definition:
                  "Identification of the name or symbol of the monetary unit involved in the transaction."
              },
              {
                key: "CUX0103",
                type: "Component Element",
                value: "9",
                id: "6343",
                desc: "Currency qualifier",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "Order currency",
                definition: "Code giving specific meaning to data element 6345 Currency."
              }
            ],
            id: "C504",
            desc: "CURRENCY DETAILS",
            required: false,
            definition: "The usage to which a currency relates."
          }
        ]
      },
      {
        key: 452,
        id: "LIN",
        desc: "LINE ITEM",
        purpose: "To identify a line item and configuration.",
        elements: [
          {
            key: "LIN01",
            type: "Data Element",
            value: "1",
            id: "1082",
            desc: "LINE ITEM NUMBER",
            dataType: "N",
            required: false,
            minLength: 0,
            maxLength: 6,
            definition: "Serial number designating each separate item within a series of articles."
          },
          {
            key: "LIN02",
            type: "Data Element",
            value: "",
            id: "1229",
            desc: "ACTION REQUEST/NOTIFICATION, CODED",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 3,
            definition: "Code specifying the action to be taken or already taken."
          },
          {
            key: "LIN03",
            type: "Data Element",
            value: "9783898307529:EN",
            components: [
              {
                key: "LIN0301",
                type: "Component Element",
                value: "9783898307529",
                id: "7140",
                desc: "Item number",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition: "A number allocated to a group or item."
              },
              {
                key: "LIN0302",
                type: "Component Element",
                value: "EN",
                id: "7143",
                desc: "Item number type, coded",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "International Article Numbering Association (EAN)",
                definition: "Identification of the type of item number."
              }
            ],
            id: "C212",
            desc: "ITEM NUMBER IDENTIFICATION",
            required: false,
            definition: "Goods identification for a specified source."
          }
        ]
      },
      {
        key: 478,
        id: "PIA",
        desc: "ADDITIONAL PRODUCT ID",
        purpose: "To specify additional or substitutional item identification codes.",
        elements: [
          {
            key: "PIA01",
            type: "Data Element",
            value: "5",
            id: "4347",
            desc: "PRODUCT ID. FUNCTION QUALIFIER",
            dataType: "AN",
            required: true,
            minLength: 0,
            maxLength: 3,
            codeValue: "Product identification",
            definition: "Indication of the function of the product code."
          },
          {
            key: "PIA02",
            type: "Data Element",
            value: "3899408268X-39:SA",
            components: [
              {
                key: "PIA0201",
                type: "Component Element",
                value: "3899408268X-39",
                id: "7140",
                desc: "Item number",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition: "A number allocated to a group or item."
              },
              {
                key: "PIA0202",
                type: "Component Element",
                value: "SA",
                id: "7143",
                desc: "Item number type, coded",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "Supplier's article number",
                definition: "Identification of the type of item number."
              }
            ],
            id: "C212",
            desc: "ITEM NUMBER IDENTIFICATION",
            required: true,
            definition: "Goods identification for a specified source."
          }
        ]
      },
      {
        key: 504,
        id: "QTY",
        desc: "QUANTITY",
        purpose: "To specify a pertinent quantity.",
        elements: [
          {
            key: "QTY01",
            type: "Data Element",
            value: "21:5",
            components: [
              {
                key: "QTY0101",
                type: "Component Element",
                value: "21",
                id: "6063",
                desc: "Quantity qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Ordered quantity",
                definition: "Code giving specific meaning to a quantity."
              },
              {
                key: "QTY0102",
                type: "Component Element",
                value: "5",
                id: "6060",
                desc: "Quantity",
                dataType: "N",
                required: true,
                minLength: 0,
                maxLength: 15,
                definition: "Numeric value of a quantity."
              }
            ],
            id: "C186",
            desc: "QUANTITY DETAILS",
            required: true,
            definition: "Quantity information in a transaction, qualified when relevant."
          }
        ]
      },
      {
        key: 515,
        id: "PRI",
        desc: "PRICE DETAILS",
        purpose: "To specify price information.",
        elements: [
          {
            key: "PRI01",
            type: "Data Element",
            value: "AAA:27.5",
            components: [
              {
                key: "PRI0101",
                type: "Component Element",
                value: "AAA",
                id: "5125",
                desc: "Price qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Calculation net",
                definition: "Identification of a type of price."
              },
              {
                key: "PRI0102",
                type: "Component Element",
                value: "27.5",
                id: "5118",
                desc: "Price",
                dataType: "N",
                required: false,
                minLength: 0,
                maxLength: 15,
                definition:
                  "The monetary value associated with a purchase or sale of an article, product or service."
              }
            ],
            id: "C509",
            desc: "PRICE INFORMATION",
            required: false,
            definition: "Identification of price type, price and related details."
          }
        ]
      },
      {
        key: 530,
        id: "LIN",
        desc: "LINE ITEM",
        purpose: "To identify a line item and configuration.",
        elements: [
          {
            key: "LIN01",
            type: "Data Element",
            value: "2",
            id: "1082",
            desc: "LINE ITEM NUMBER",
            dataType: "N",
            required: false,
            minLength: 0,
            maxLength: 6,
            definition: "Serial number designating each separate item within a series of articles."
          },
          {
            key: "LIN02",
            type: "Data Element",
            value: "",
            id: "1229",
            desc: "ACTION REQUEST/NOTIFICATION, CODED",
            dataType: "AN",
            required: false,
            minLength: 0,
            maxLength: 3,
            definition: "Code specifying the action to be taken or already taken."
          },
          {
            key: "LIN03",
            type: "Data Element",
            value: "390787706322:UP",
            components: [
              {
                key: "LIN0301",
                type: "Component Element",
                value: "390787706322",
                id: "7140",
                desc: "Item number",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition: "A number allocated to a group or item."
              },
              {
                key: "LIN0302",
                type: "Component Element",
                value: "UP",
                id: "7143",
                desc: "Item number type, coded",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "UPC (Universal product code)",
                definition: "Identification of the type of item number."
              }
            ],
            id: "C212",
            desc: "ITEM NUMBER IDENTIFICATION",
            required: false,
            definition: "Goods identification for a specified source."
          }
        ]
      },
      {
        key: 555,
        id: "QTY",
        desc: "QUANTITY",
        purpose: "To specify a pertinent quantity.",
        elements: [
          {
            key: "QTY01",
            type: "Data Element",
            value: "21:1",
            components: [
              {
                key: "QTY0101",
                type: "Component Element",
                value: "21",
                id: "6063",
                desc: "Quantity qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Ordered quantity",
                definition: "Code giving specific meaning to a quantity."
              },
              {
                key: "QTY0102",
                type: "Component Element",
                value: "1",
                id: "6060",
                desc: "Quantity",
                dataType: "N",
                required: true,
                minLength: 0,
                maxLength: 15,
                definition: "Numeric value of a quantity."
              }
            ],
            id: "C186",
            desc: "QUANTITY DETAILS",
            required: true,
            definition: "Quantity information in a transaction, qualified when relevant."
          }
        ]
      },
      {
        key: 566,
        id: "PRI",
        desc: "PRICE DETAILS",
        purpose: "To specify price information.",
        elements: [
          {
            key: "PRI01",
            type: "Data Element",
            value: "AAA:10.87",
            components: [
              {
                key: "PRI0101",
                type: "Component Element",
                value: "AAA",
                id: "5125",
                desc: "Price qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Calculation net",
                definition: "Identification of a type of price."
              },
              {
                key: "PRI0102",
                type: "Component Element",
                value: "10.87",
                id: "5118",
                desc: "Price",
                dataType: "N",
                required: false,
                minLength: 0,
                maxLength: 15,
                definition:
                  "The monetary value associated with a purchase or sale of an article, product or service."
              }
            ],
            id: "C509",
            desc: "PRICE INFORMATION",
            required: false,
            definition: "Identification of price type, price and related details."
          }
        ]
      },
      {
        key: 582,
        id: "LIN",
        desc: "LINE ITEM",
        purpose: "To identify a line item and configuration.",
        elements: [
          {
            key: "LIN01",
            type: "Data Element",
            value: "3",
            id: "1082",
            desc: "LINE ITEM NUMBER",
            dataType: "N",
            required: false,
            minLength: 0,
            maxLength: 6,
            definition: "Serial number designating each separate item within a series of articles."
          }
        ]
      },
      {
        key: 590,
        id: "PIA",
        desc: "ADDITIONAL PRODUCT ID",
        purpose: "To specify additional or substitutional item identification codes.",
        elements: [
          {
            key: "PIA01",
            type: "Data Element",
            value: "5",
            id: "4347",
            desc: "PRODUCT ID. FUNCTION QUALIFIER",
            dataType: "AN",
            required: true,
            minLength: 0,
            maxLength: 3,
            codeValue: "Product identification",
            definition: "Indication of the function of the product code."
          },
          {
            key: "PIA02",
            type: "Data Element",
            value: "3899408268X-39:SA",
            components: [
              {
                key: "PIA0201",
                type: "Component Element",
                value: "3899408268X-39",
                id: "7140",
                desc: "Item number",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 35,
                definition: "A number allocated to a group or item."
              },
              {
                key: "PIA0202",
                type: "Component Element",
                value: "SA",
                id: "7143",
                desc: "Item number type, coded",
                dataType: "AN",
                required: false,
                minLength: 0,
                maxLength: 3,
                codeValue: "Supplier's article number",
                definition: "Identification of the type of item number."
              }
            ],
            id: "C212",
            desc: "ITEM NUMBER IDENTIFICATION",
            required: true,
            definition: "Goods identification for a specified source."
          }
        ]
      },
      {
        key: 616,
        id: "QTY",
        desc: "QUANTITY",
        purpose: "To specify a pertinent quantity.",
        elements: [
          {
            key: "QTY01",
            type: "Data Element",
            value: "21:3",
            components: [
              {
                key: "QTY0101",
                type: "Component Element",
                value: "21",
                id: "6063",
                desc: "Quantity qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Ordered quantity",
                definition: "Code giving specific meaning to a quantity."
              },
              {
                key: "QTY0102",
                type: "Component Element",
                value: "3",
                id: "6060",
                desc: "Quantity",
                dataType: "N",
                required: true,
                minLength: 0,
                maxLength: 15,
                definition: "Numeric value of a quantity."
              }
            ],
            id: "C186",
            desc: "QUANTITY DETAILS",
            required: true,
            definition: "Quantity information in a transaction, qualified when relevant."
          }
        ]
      },
      {
        key: 627,
        id: "PRI",
        desc: "PRICE DETAILS",
        purpose: "To specify price information.",
        elements: [
          {
            key: "PRI01",
            type: "Data Element",
            value: "AAA:3.85",
            components: [
              {
                key: "PRI0101",
                type: "Component Element",
                value: "AAA",
                id: "5125",
                desc: "Price qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Calculation net",
                definition: "Identification of a type of price."
              },
              {
                key: "PRI0102",
                type: "Component Element",
                value: "3.85",
                id: "5118",
                desc: "Price",
                dataType: "N",
                required: false,
                minLength: 0,
                maxLength: 15,
                definition:
                  "The monetary value associated with a purchase or sale of an article, product or service."
              }
            ],
            id: "C509",
            desc: "PRICE INFORMATION",
            required: false,
            definition: "Identification of price type, price and related details."
          }
        ]
      },
      {
        key: 642,
        id: "UNS",
        purpose: "To separate header, detail and summary sections of a message.",
        elements: [
          {
            key: "UNS01",
            type: "Data Element",
            value: "S",
            id: "0081",
            desc: "SECTION IDENTIFICATION",
            dataType: "A",
            required: true,
            minLength: 1,
            maxLength: 1,
            codeValue: "Detail/summary section separation",
            definition: "Separates sections in a message."
          }
        ]
      },
      {
        key: 650,
        id: "CNT",
        desc: "CONTROL TOTAL",
        purpose: "To provide control total.",
        elements: [
          {
            key: "CNT01",
            type: "Data Element",
            value: "2:3",
            components: [
              {
                key: "CNT0101",
                type: "Component Element",
                value: "2",
                id: "6069",
                desc: "Control qualifier",
                dataType: "AN",
                required: true,
                minLength: 0,
                maxLength: 3,
                codeValue: "Number of line items in message",
                definition:
                  "Determines the source data elements in the message which forms the basis for 6066 Control value."
              },
              {
                key: "CNT0102",
                type: "Component Element",
                value: "3",
                id: "6066",
                desc: "Control value",
                dataType: "N",
                required: true,
                minLength: 0,
                maxLength: 18,
                definition:
                  "Value obtained from summing the values specified by the Control Qualifier throughout the message (Hash total)."
              }
            ],
            id: "C270",
            desc: "CONTROL",
            required: true,
            definition: "Control total for checking integrity of a message or part of a message."
          }
        ]
      },
      {
        key: 660,
        id: "UNT",
        desc: "Message trailer",
        purpose: "To end and check the completeness of a message.",
        elements: [
          {
            key: "UNT01",
            type: "Data Element",
            value: "28",
            id: "0074",
            desc: "NUMBER OF SEGMENTS IN A MESSAGE",
            dataType: "N",
            required: true,
            minLength: 0,
            maxLength: 6,
            definition: "Control count of number of segments in a message."
          },
          {
            key: "UNT02",
            type: "Data Element",
            value: "1",
            id: "0062",
            desc: "MESSAGE REFERENCE NUMBER",
            dataType: "AN",
            required: true,
            minLength: 0,
            maxLength: 14,
            definition: "Unique message reference assigned by the sender."
          }
        ]
      },
      {
        key: 671,
        id: "UNZ",
        desc: "Interchange trailer",
        purpose: "To end and check the completeness of an interchange.",
        elements: [
          {
            key: "UNZ01",
            type: "Data Element",
            value: "1",
            id: "0036",
            desc: "Interchange control count",
            required: true,
            minLength: 1,
            maxLength: 6
          },
          {
            key: "UNZ02",
            type: "Data Element",
            value: "5",
            id: "0020",
            desc: "Interchange control reference",
            required: true,
            minLength: 1,
            maxLength: 14
          }
        ]
      }
    ]
  };
}
