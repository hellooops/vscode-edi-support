export default function useTestData(): IEdiMessage {
  return {
    ediVersion: { release: "D96A", version: "ORDERS" },
    segments: [
      {
        key: "seg-UNB-0",
        id: "UNB",
        desc: "Interchange header",
        purpose: "To start, identify and specify an interchange.",
        elements: [
          {
            key: "ele-UNB01-0-3",
            type: "Data Element",
            value: "UNOA:2",
            components: [
              {
                key: "ele-UNB0101-0-3",
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
                key: "ele-UNB0102-0-8",
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
            required: true,
            definition:
              "Identification of the agency controlling the syntax and indication of syntax level."
          },
          {
            key: "ele-UNB02-0-10",
            type: "Data Element",
            value: "<Sender GLN>:14",
            components: [
              {
                key: "ele-UNB0201-0-10",
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
                key: "ele-UNB0202-0-23",
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
            required: true,
            definition: "Identification of the sender of the interchange."
          },
          {
            key: "ele-UNB03-0-26",
            type: "Data Element",
            value: "<Receiver GLN>:14",
            components: [
              {
                key: "ele-UNB0301-0-26",
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
                key: "ele-UNB0302-0-41",
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
            required: true,
            definition: "Identification of the recipient of the interchange."
          },
          {
            key: "ele-UNB04-0-44",
            type: "Data Element",
            value: "140407:0910",
            components: [
              {
                key: "ele-UNB0401-0-44",
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
                key: "ele-UNB0402-0-51",
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
            required: true,
            definition: "Date and time of preparation of the interchange."
          },
          {
            key: "ele-UNB05-0-56",
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
            key: "ele-UNB06-0-58",
            type: "Data Element",
            value: "000000001",
            components: [
              {
                key: "ele-UNB0601-0-58",
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
            required: true,
            definition: "Reference or password as agreed between the communicating partners."
          },
          {
            key: "ele-UNB07-0-68",
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
            key: "ele-UNB08-0-69",
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
            key: "ele-UNB09-0-70",
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
            key: "ele-UNB10-0-72",
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
        key: "seg-UNH-82",
        id: "UNH",
        desc: "Message header",
        purpose: "To head, identify and specify a message.",
        elements: [
          {
            key: "ele-UNH01-82-3",
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
            key: "ele-UNH02-82-5",
            type: "Data Element",
            value: "ORDERS:D:96A:UN:EAN008",
            components: [
              {
                key: "ele-UNH0201-82-5",
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
                key: "ele-UNH0202-82-12",
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
                key: "ele-UNH0203-82-14",
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
                key: "ele-UNH0204-82-18",
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
                key: "ele-UNH0205-82-21",
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
        key: "seg-BGM-113",
        id: "BGM",
        desc: "BEGINNING OF MESSAGE",
        purpose:
          "To indicate the type and function of a message and to transmit the identifying number.",
        elements: [
          {
            key: "ele-BGM01-113-3",
            type: "Data Element",
            value: "220",
            components: [
              {
                key: "ele-BGM0101-113-3",
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
            key: "ele-BGM02-113-7",
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
            key: "ele-BGM03-113-16",
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
        key: "seg-DTM-134",
        id: "DTM",
        desc: "DATE/TIME/PERIOD",
        purpose: "To specify date, and/or time, or period.",
        elements: [
          {
            key: "ele-DTM01-134-3",
            type: "Data Element",
            value: "137:20140407:102",
            components: [
              {
                key: "ele-DTM0101-134-3",
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
                key: "ele-DTM0102-134-7",
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
                key: "ele-DTM0103-134-16",
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
        key: "seg-DTM-157",
        id: "DTM",
        desc: "DATE/TIME/PERIOD",
        purpose: "To specify date, and/or time, or period.",
        elements: [
          {
            key: "ele-DTM01-157-3",
            type: "Data Element",
            value: "63:20140421:102",
            components: [
              {
                key: "ele-DTM0101-157-3",
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
                key: "ele-DTM0102-157-6",
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
                key: "ele-DTM0103-157-15",
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
        key: "seg-DTM-179",
        id: "DTM",
        desc: "DATE/TIME/PERIOD",
        purpose: "To specify date, and/or time, or period.",
        elements: [
          {
            key: "ele-DTM01-179-3",
            type: "Data Element",
            value: "64:20140414:102",
            components: [
              {
                key: "ele-DTM0101-179-3",
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
                key: "ele-DTM0102-179-6",
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
                key: "ele-DTM0103-179-15",
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
        key: "seg-RFF-201",
        id: "RFF",
        desc: "REFERENCE",
        purpose: "To specify a reference.",
        elements: [
          {
            key: "ele-RFF01-201-3",
            type: "Data Element",
            value: "ADE:FIRSTORDER",
            components: [
              {
                key: "ele-RFF0101-201-3",
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
                key: "ele-RFF0102-201-7",
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
        key: "seg-RFF-222",
        id: "RFF",
        desc: "REFERENCE",
        purpose: "To specify a reference.",
        elements: [
          {
            key: "ele-RFF01-222-3",
            type: "Data Element",
            value: "PD:1704",
            components: [
              {
                key: "ele-RFF0101-222-3",
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
                key: "ele-RFF0102-222-6",
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
        key: "seg-RFF-236",
        id: "RFF",
        desc: "REFERENCE",
        purpose: "To specify a reference.",
        elements: [
          {
            key: "ele-RFF01-236-3",
            type: "Data Element",
            value: "CR:ABCD5",
            components: [
              {
                key: "ele-RFF0101-236-3",
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
                key: "ele-RFF0102-236-6",
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
        key: "seg-NAD-251",
        id: "NAD",
        desc: "NAME AND ADDRESS",
        purpose:
          "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
        elements: [
          {
            key: "ele-NAD01-251-3",
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
            key: "ele-NAD02-251-6",
            type: "Data Element",
            value: "5450534000024::9",
            components: [
              {
                key: "ele-NAD0201-251-6",
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
                key: "ele-NAD0202-251-20",
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
                key: "ele-NAD0203-251-21",
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
        key: "seg-NAD-277",
        id: "NAD",
        desc: "NAME AND ADDRESS",
        purpose:
          "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
        elements: [
          {
            key: "ele-NAD01-277-3",
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
            key: "ele-NAD02-277-6",
            type: "Data Element",
            value: "<Supplier GLN>::9",
            components: [
              {
                key: "ele-NAD0201-277-6",
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
                key: "ele-NAD0202-277-21",
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
                key: "ele-NAD0203-277-22",
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
        key: "seg-NAD-304",
        id: "NAD",
        desc: "NAME AND ADDRESS",
        purpose:
          "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
        elements: [
          {
            key: "ele-NAD01-304-3",
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
            key: "ele-NAD02-304-6",
            type: "Data Element",
            value: "5450534000109::9",
            components: [
              {
                key: "ele-NAD0201-304-6",
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
                key: "ele-NAD0202-304-20",
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
                key: "ele-NAD0203-304-21",
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
            key: "ele-NAD03-304-23",
            type: "Data Element",
            value: "",
            id: "C058",
            desc: "NAME AND ADDRESS",
            required: false,
            definition: "Unstructured name and address: one to five lines."
          },
          {
            key: "ele-NAD04-304-24",
            type: "Data Element",
            value: "",
            id: "C080",
            desc: "PARTY NAME",
            required: false,
            definition:
              "Identification of a transaction party by name, one to five lines. Party name may be formatted."
          },
          {
            key: "ele-NAD05-304-25",
            type: "Data Element",
            value: "",
            id: "C059",
            desc: "STREET",
            required: false,
            definition:
              "Street address and/or PO Box number in a structured address: one to three lines."
          },
          {
            key: "ele-NAD06-304-26",
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
            key: "ele-NAD07-304-27",
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
            key: "ele-NAD08-304-28",
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
            key: "ele-NAD09-304-29",
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
        key: "seg-NAD-339",
        id: "NAD",
        desc: "NAME AND ADDRESS",
        purpose:
          "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
        elements: [
          {
            key: "ele-NAD01-339-3",
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
            key: "ele-NAD02-339-6",
            type: "Data Element",
            value: "5450534007139::9",
            components: [
              {
                key: "ele-NAD0201-339-6",
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
                key: "ele-NAD0202-339-20",
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
                key: "ele-NAD0203-339-21",
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
            key: "ele-NAD03-339-23",
            type: "Data Element",
            value: "",
            id: "C058",
            desc: "NAME AND ADDRESS",
            required: false,
            definition: "Unstructured name and address: one to five lines."
          },
          {
            key: "ele-NAD04-339-24",
            type: "Data Element",
            value: "Test:Name2",
            components: [
              {
                key: "ele-NAD0401-339-24",
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
                key: "ele-NAD0402-339-29",
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
            key: "ele-NAD05-339-35",
            type: "Data Element",
            value: "Test Street:Steet2",
            components: [
              {
                key: "ele-NAD0501-339-35",
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
                key: "ele-NAD0502-339-47",
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
            key: "ele-NAD06-339-54",
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
            key: "ele-NAD07-339-62",
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
            key: "ele-NAD08-339-63",
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
            key: "ele-NAD09-339-72",
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
        key: "seg-RFF-417",
        id: "RFF",
        desc: "REFERENCE",
        purpose: "To specify a reference.",
        elements: [
          {
            key: "ele-RFF01-417-3",
            type: "Data Element",
            value: "VA:GB727255821",
            components: [
              {
                key: "ele-RFF0101-417-3",
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
                key: "ele-RFF0102-417-6",
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
        key: "seg-CUX-438",
        id: "CUX",
        desc: "CURRENCIES",
        purpose:
          "To specify currencies used in the transaction and relevant details for the rate of exchange.",
        elements: [
          {
            key: "ele-CUX01-438-3",
            type: "Data Element",
            value: "2:EUR:9",
            components: [
              {
                key: "ele-CUX0101-438-3",
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
                key: "ele-CUX0102-438-5",
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
                key: "ele-CUX0103-438-9",
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
        key: "seg-LIN-452",
        id: "LIN",
        desc: "LINE ITEM",
        purpose: "To identify a line item and configuration.",
        elements: [
          {
            key: "ele-LIN01-452-3",
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
            key: "ele-LIN02-452-5",
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
            key: "ele-LIN03-452-6",
            type: "Data Element",
            value: "9783898307529:EN",
            components: [
              {
                key: "ele-LIN0301-452-6",
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
                key: "ele-LIN0302-452-20",
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
        key: "seg-PIA-478",
        id: "PIA",
        desc: "ADDITIONAL PRODUCT ID",
        purpose: "To specify additional or substitutional item identification codes.",
        elements: [
          {
            key: "ele-PIA01-478-3",
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
            key: "ele-PIA02-478-5",
            type: "Data Element",
            value: "3899408268X-39:SA",
            components: [
              {
                key: "ele-PIA0201-478-5",
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
                key: "ele-PIA0202-478-20",
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
        key: "seg-QTY-504",
        id: "QTY",
        desc: "QUANTITY",
        purpose: "To specify a pertinent quantity.",
        elements: [
          {
            key: "ele-QTY01-504-3",
            type: "Data Element",
            value: "21:5",
            components: [
              {
                key: "ele-QTY0101-504-3",
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
                key: "ele-QTY0102-504-6",
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
        key: "seg-PRI-515",
        id: "PRI",
        desc: "PRICE DETAILS",
        purpose: "To specify price information.",
        elements: [
          {
            key: "ele-PRI01-515-3",
            type: "Data Element",
            value: "AAA:27.5",
            components: [
              {
                key: "ele-PRI0101-515-3",
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
                key: "ele-PRI0102-515-7",
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
        key: "seg-LIN-530",
        id: "LIN",
        desc: "LINE ITEM",
        purpose: "To identify a line item and configuration.",
        elements: [
          {
            key: "ele-LIN01-530-3",
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
            key: "ele-LIN02-530-5",
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
            key: "ele-LIN03-530-6",
            type: "Data Element",
            value: "390787706322:UP",
            components: [
              {
                key: "ele-LIN0301-530-6",
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
                key: "ele-LIN0302-530-19",
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
        key: "seg-QTY-555",
        id: "QTY",
        desc: "QUANTITY",
        purpose: "To specify a pertinent quantity.",
        elements: [
          {
            key: "ele-QTY01-555-3",
            type: "Data Element",
            value: "21:1",
            components: [
              {
                key: "ele-QTY0101-555-3",
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
                key: "ele-QTY0102-555-6",
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
        key: "seg-PRI-566",
        id: "PRI",
        desc: "PRICE DETAILS",
        purpose: "To specify price information.",
        elements: [
          {
            key: "ele-PRI01-566-3",
            type: "Data Element",
            value: "AAA:10.87",
            components: [
              {
                key: "ele-PRI0101-566-3",
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
                key: "ele-PRI0102-566-7",
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
        key: "seg-LIN-582",
        id: "LIN",
        desc: "LINE ITEM",
        purpose: "To identify a line item and configuration.",
        elements: [
          {
            key: "ele-LIN01-582-3",
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
        key: "seg-PIA-590",
        id: "PIA",
        desc: "ADDITIONAL PRODUCT ID",
        purpose: "To specify additional or substitutional item identification codes.",
        elements: [
          {
            key: "ele-PIA01-590-3",
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
            key: "ele-PIA02-590-5",
            type: "Data Element",
            value: "3899408268X-39:SA",
            components: [
              {
                key: "ele-PIA0201-590-5",
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
                key: "ele-PIA0202-590-20",
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
        key: "seg-QTY-616",
        id: "QTY",
        desc: "QUANTITY",
        purpose: "To specify a pertinent quantity.",
        elements: [
          {
            key: "ele-QTY01-616-3",
            type: "Data Element",
            value: "21:3",
            components: [
              {
                key: "ele-QTY0101-616-3",
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
                key: "ele-QTY0102-616-6",
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
        key: "seg-PRI-627",
        id: "PRI",
        desc: "PRICE DETAILS",
        purpose: "To specify price information.",
        elements: [
          {
            key: "ele-PRI01-627-3",
            type: "Data Element",
            value: "AAA:3.85",
            components: [
              {
                key: "ele-PRI0101-627-3",
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
                key: "ele-PRI0102-627-7",
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
        key: "seg-UNS-642",
        id: "UNS",
        purpose: "To separate header, detail and summary sections of a message.",
        elements: [
          {
            key: "ele-UNS01-642-3",
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
        key: "seg-CNT-650",
        id: "CNT",
        desc: "CONTROL TOTAL",
        purpose: "To provide control total.",
        elements: [
          {
            key: "ele-CNT01-650-3",
            type: "Data Element",
            value: "2:3",
            components: [
              {
                key: "ele-CNT0101-650-3",
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
                key: "ele-CNT0102-650-5",
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
        key: "seg-UNT-660",
        id: "UNT",
        desc: "Message trailer",
        purpose: "To end and check the completeness of a message.",
        elements: [
          {
            key: "ele-UNT01-660-3",
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
            key: "ele-UNT02-660-6",
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
        key: "seg-UNZ-671",
        id: "UNZ",
        desc: "Interchange trailer",
        purpose: "To end and check the completeness of an interchange.",
        elements: [
          {
            key: "ele-UNZ01-671-3",
            type: "Data Element",
            value: "1",
            id: "0036",
            desc: "Interchange control count",
            required: true,
            minLength: 1,
            maxLength: 6,
            definition:
              "Count either of the number of messages or, if used, of the number of functional groups in an interchange."
          },
          {
            key: "ele-UNZ02-671-5",
            type: "Data Element",
            value: "5",
            id: "0020",
            desc: "Interchange control reference",
            required: true,
            minLength: 1,
            maxLength: 14,
            definition: "Unique reference assigned by the sender to an interchange."
          }
        ]
      }
    ]
  };
}
