import { EdiDocument } from "@/entities";

export default function useTestData(): EdiDocument {
  const x12TestData: IEdiDocument = {
    "interchanges": [
      {
        "key": "qyo44LjiZkqXg6BN8YQxu",
        "meta": {
          "senderQualifer": "ZZ",
          "senderID": "SENDER         ",
          "receiverQualifer": "ZZ",
          "receiverID": "RECEIVER       ",
          "date": "241111",
          "time": "0300",
          "id": "000000001"
        },
        "id": "000000001",
        "functionalGroups": [
          {
            "key": "Y6kJXPhYMdBfxlKpqZKHg",
            "meta": { "date": "20241111", "time": "0300", "id": "1" },
            "id": "1",
            "transactionSets": [
              {
                "key": "WMomcM2E5Hbdt_yFBmjos",
                "meta": { "release": "00401", "version": "850", "id": "0001" },
                "id": "0001",
                "segments": [
                  {
                    "key": "c0TgTDgl4ZJBYLfQTVUaq",
                    "id": "BEG",
                    "desc": "Beginning Segment for Purchase Order",
                    "purpose": "To indicate the beginning of the Purchase Order Transaction Set and transmit identifying numbers and dates",
                    "elements": [
                      {
                        "key": "lxLI4y7y_7eQnWdWuia-8",
                        "type": "Data Element",
                        "value": "00",
                        "id": "353",
                        "desc": "Transaction Set Purpose Code",
                        "required": true,
                        "codeValue": "Original",
                        "definition": "Code identifying purpose of transaction set"
                      },
                      {
                        "key": "eRHsdAz7GE6Tzvau5hcQ-",
                        "type": "Data Element",
                        "value": "DS",
                        "id": "92",
                        "desc": "Purchase Order Type Code",
                        "required": true,
                        "codeValue": "Dropship",
                        "definition": "Code specifying the type of Purchase Order"
                      },
                      {
                        "key": "QUtS4TQ0FM4_bQfiGRPp0",
                        "type": "Data Element",
                        "value": "PO1",
                        "id": "324",
                        "desc": "Purchase Order Number",
                        "dataType": "AN",
                        "required": true,
                        "minLength": 1,
                        "maxLength": 22,
                        "definition": "Identifying number for Purchase Order assigned by the orderer/purchaser"
                      },
                      {
                        "key": "_iY5I322ouMR1NZCSBs4v",
                        "type": "Data Element",
                        "value": "",
                        "id": "328",
                        "desc": "Release Number",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 30,
                        "definition": "Number identifying a release against a Purchase Order previously placed by the parties involved in the transaction"
                      },
                      {
                        "key": "wRKvgyyMzZHkW9yGlpjlR",
                        "type": "Data Element",
                        "value": "20150708",
                        "id": "373",
                        "desc": "Date",
                        "dataType": "DT",
                        "required": true,
                        "minLength": 8,
                        "maxLength": 8,
                        "definition": "Date expressed as CCYYMMDD"
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "key": "YchzaQoxvhG3sFpnkamii",
                  "id": "ST",
                  "desc": "Transaction Set Header",
                  "purpose": "To indicate the start of a transaction set and to assign a control number",
                  "elements": [
                    {
                      "key": "FRQX_yC1dUc301fDWFqey",
                      "type": "Data Element",
                      "value": "850",
                      "id": "143",
                      "desc": "Transaction Set Identifier Code",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 3,
                      "maxLength": 3,
                      "codeValue": "Purchase Order",
                      "definition": "Code uniquely identifying a Transaction Set"
                    },
                    {
                      "key": "8z3s2J8qdj3TeStoz7nbq",
                      "type": "Data Element",
                      "value": "0001",
                      "id": "329",
                      "desc": "Transaction Set Control Number",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 4,
                      "maxLength": 9,
                      "definition": "Identifying control number that must be unique within the transaction set functional group assigned by the originator for a transaction set"
                    }
                  ]
                },
                "endSegment": {
                  "key": "VDKkk7n7jzcKP425XfogC",
                  "id": "SE",
                  "desc": "Transaction Set Trailer",
                  "purpose": "To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)",
                  "elements": [
                    {
                      "key": "v1wGbMBdr5bplHx2UOo2y",
                      "type": "Data Element",
                      "value": "3",
                      "id": "96",
                      "desc": "Number of Included Segments",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 1,
                      "maxLength": 10,
                      "definition": "Total number of segments included in a transaction set including ST and SE segments"
                    },
                    {
                      "key": "Bi6PH04brSCtRBSHQVRLT",
                      "type": "Data Element",
                      "value": "0001",
                      "id": "329",
                      "desc": "Transaction Set Control Number",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 4,
                      "maxLength": 9,
                      "definition": "Identifying control number that must be unique within the transaction set functional group assigned by the originator for a transaction set"
                    }
                  ]
                }
              },
              {
                "key": "jq-RWXo1r-ECC8njEchL5",
                "meta": { "release": "00401", "version": "864", "id": "0002" },
                "id": "0002",
                "segments": [
                  {
                    "key": "tE57glf1MR49TX-LFK8fc",
                    "id": "BMG",
                    "desc": "Beginning Segment For Text Message",
                    "purpose": "To indicate the beginning of a Text Message Transaction Set",
                    "elements": [
                      {
                        "key": "leIKkTfQe2FPu0he8ijfA",
                        "type": "Data Element",
                        "value": "00",
                        "id": "353",
                        "desc": "Transaction Set Purpose Code",
                        "required": true,
                        "codeValue": "Original",
                        "definition": "Code identifying purpose of transaction set"
                      },
                      {
                        "key": "oSMuHHZ_wY-X6ijvNb68K",
                        "type": "Data Element",
                        "value": "",
                        "id": "352",
                        "desc": "Description",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 80,
                        "definition": "A free-form description to clarify the related data elements and their content"
                      },
                      {
                        "key": "ed3DRX7aZK6Nso0G0ZIx0",
                        "type": "Data Element",
                        "value": "03",
                        "id": "640",
                        "desc": "Transaction Type Code",
                        "required": false,
                        "codeValue": "Report Message",
                        "definition": "Code specifying the type of transaction"
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "key": "Kz4PL5rM8YC9wOd4IYZ_N",
                  "id": "ST",
                  "desc": "Transaction Set Header",
                  "purpose": "To indicate the start of a transaction set and to assign a control number",
                  "elements": [
                    {
                      "key": "xOFCtJSADKMq8LTuIGksI",
                      "type": "Data Element",
                      "value": "864",
                      "id": "143",
                      "desc": "Transaction Set Identifier Code",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 3,
                      "maxLength": 3,
                      "codeValue": "Text Message",
                      "definition": "Code uniquely identifying a Transaction Set"
                    },
                    {
                      "key": "0c8geqJSS2ywWFN9PoCW_",
                      "type": "Data Element",
                      "value": "0002",
                      "id": "329",
                      "desc": "Transaction Set Control Number",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 4,
                      "maxLength": 9,
                      "definition": "Identifying control number that must be unique within the transaction set functional group assigned by the originator for a transaction set"
                    }
                  ]
                },
                "endSegment": {
                  "key": "rTNegXK7bys2CxCIsMgP6",
                  "id": "SE",
                  "desc": "Transaction Set Trailer",
                  "purpose": "To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)",
                  "elements": [
                    {
                      "key": "_ah8xAII4YvZ5JTqw8-KJ",
                      "type": "Data Element",
                      "value": "3",
                      "id": "96",
                      "desc": "Number of Included Segments",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 1,
                      "maxLength": 10,
                      "definition": "Total number of segments included in a transaction set including ST and SE segments"
                    },
                    {
                      "key": "urpPo_QIDaobCmBhImwvn",
                      "type": "Data Element",
                      "value": "0002",
                      "id": "329",
                      "desc": "Transaction Set Control Number",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 4,
                      "maxLength": 9,
                      "definition": "Identifying control number that must be unique within the transaction set functional group assigned by the originator for a transaction set"
                    }
                  ]
                }
              }
            ],
            "startSegment": {
              "key": "1Id8lAnJ5CaW5uyUZPI4I",
              "id": "GS",
              "desc": "Functional Group Header",
              "purpose": "To indicate the beginning of a functional group and to provide control information",
              "elements": [
                {
                  "key": "gdJ69JTVAqtkWhQIZlEpv",
                  "type": "Data Element",
                  "value": "PO",
                  "id": "479",
                  "desc": "Functional Identifier Code",
                  "required": true,
                  "minLength": 2,
                  "maxLength": 2,
                  "definition": "Code identifying a group of application related transaction sets"
                },
                {
                  "key": "T0EmCLRipdURG60S0UfNp",
                  "type": "Data Element",
                  "value": "  ",
                  "id": "142",
                  "desc": "Application Sender's Code",
                  "required": true,
                  "minLength": 2,
                  "maxLength": 15,
                  "definition": "Code identifying party sending transmission; codes agreed to by trading partners"
                },
                {
                  "key": "CbtvFwipOOpLKhBgaTYzF",
                  "type": "Data Element",
                  "value": "  ",
                  "id": "124",
                  "desc": "Application Receiver's Code",
                  "required": true,
                  "minLength": 2,
                  "maxLength": 15,
                  "definition": "Code identifying party receiving transmission. Codes agreed to by trading partners"
                },
                {
                  "key": "BV9cRQYUqsubQM0TryPhU",
                  "type": "Data Element",
                  "value": "20241111",
                  "id": "373",
                  "desc": "Date",
                  "required": true,
                  "minLength": 8,
                  "maxLength": 8,
                  "definition": "Date expressed as CCYYMMDD"
                },
                {
                  "key": "MF2oqUFyw8f38r3TDL6Gq",
                  "type": "Data Element",
                  "value": "0300",
                  "id": "337",
                  "desc": "Time",
                  "required": true,
                  "minLength": 4,
                  "maxLength": 8,
                  "definition": "Time expressed in 24-hour clock time as follows: HHMM, or HHMMSS, or HHMMSSD, or HHMMSSDD, where H = hours (00-23), M = minutes (00-59), S = integer seconds (00-59) and DD = decimal seconds; decimal seconds are expressed as follows: D = tenths (0-9) and DD = hundredths (00-99)"
                },
                {
                  "key": "jRBcYpFAsXmO6pOjjhmQN",
                  "type": "Data Element",
                  "value": "1",
                  "id": "28",
                  "desc": "Group Control Number",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 9,
                  "definition": "Assigned number originated and maintained by the sender"
                },
                {
                  "key": "nXoYre2ovcGEaP6CP7Tv1",
                  "type": "Data Element",
                  "value": "T",
                  "id": "455",
                  "desc": "Responsible Agency Code",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 2,
                  "definition": "Code used in conjunction with Data Element 480 to identify the issuer of the standard"
                },
                {
                  "key": "6axXVdXJ0QJZ-QpyI6J_G",
                  "type": "Data Element",
                  "value": "004010",
                  "id": "480",
                  "desc": "Version / Release / Industry Identifier Code",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 12,
                  "definition": "Code indicating the version, release, subrelease, and industry identifier of the EDI standard being used, including the GS and GE segments; if code in DE455 in GS segment is X, then in DE 480 positions 1-3 are the version number; positions 4-6 are the release and subrelease, level of the version; and positions 7-12 are the industry or trade association identifiers (optionally assigned by user); if code in DE455 in GS segment is T, then other formats are allowed"
                }
              ]
            },
            "endSegment": {
              "key": "oBI7aJIfoSvKVLn5dDQC0",
              "id": "GE",
              "desc": "Functional Group Trailer",
              "purpose": "To indicate the end of a functional group and to provide control information",
              "elements": [
                {
                  "key": "50fsK836CRhHw5bJXuek8",
                  "type": "Data Element",
                  "value": "2",
                  "id": "97",
                  "desc": "Number of Transaction Sets Included",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 6,
                  "definition": "Total number of transaction sets included in the functional group or interchange (transmission) group terminated by the trailer containing this data element"
                },
                {
                  "key": "69RQ6iWJRPUKRYgtZk3NZ",
                  "type": "Data Element",
                  "value": "1",
                  "id": "28",
                  "desc": "Group Control Number",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 9,
                  "definition": "Assigned number originated and maintained by the sender"
                }
              ]
            }
          },
          {
            "key": "cTb_4sSQBt8xPYWoLgG30",
            "meta": { "date": "20241111", "time": "0300", "id": "2" },
            "id": "2",
            "transactionSets": [
              {
                "key": "uR7uH48j9S9GTGo3OI887",
                "meta": { "release": "00401", "version": "850", "id": "0003" },
                "id": "0003",
                "segments": [
                  {
                    "key": "eHhIbJUIDpfCqOAi6_lw3",
                    "id": "BEG",
                    "desc": "Beginning Segment for Purchase Order",
                    "purpose": "To indicate the beginning of the Purchase Order Transaction Set and transmit identifying numbers and dates",
                    "elements": [
                      {
                        "key": "ecf2-majCYTNQehAJ5pSS",
                        "type": "Data Element",
                        "value": "00",
                        "id": "353",
                        "desc": "Transaction Set Purpose Code",
                        "required": true,
                        "codeValue": "Original",
                        "definition": "Code identifying purpose of transaction set"
                      },
                      {
                        "key": "TRONQg4pr9dLs07Wg4TT4",
                        "type": "Data Element",
                        "value": "DS",
                        "id": "92",
                        "desc": "Purchase Order Type Code",
                        "required": true,
                        "codeValue": "Dropship",
                        "definition": "Code specifying the type of Purchase Order"
                      },
                      {
                        "key": "pxvDucBcClNoTjFoS19PS",
                        "type": "Data Element",
                        "value": "PO3",
                        "id": "324",
                        "desc": "Purchase Order Number",
                        "dataType": "AN",
                        "required": true,
                        "minLength": 1,
                        "maxLength": 22,
                        "definition": "Identifying number for Purchase Order assigned by the orderer/purchaser"
                      },
                      {
                        "key": "V_N46A8qpICVqmwmRZ0Wm",
                        "type": "Data Element",
                        "value": "",
                        "id": "328",
                        "desc": "Release Number",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 30,
                        "definition": "Number identifying a release against a Purchase Order previously placed by the parties involved in the transaction"
                      },
                      {
                        "key": "aeW2CKLoRgLhVYGd1-Jty",
                        "type": "Data Element",
                        "value": "20150708",
                        "id": "373",
                        "desc": "Date",
                        "dataType": "DT",
                        "required": true,
                        "minLength": 8,
                        "maxLength": 8,
                        "definition": "Date expressed as CCYYMMDD"
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "key": "4vPfkYXKx8iWYOFqGp0q5",
                  "id": "ST",
                  "desc": "Transaction Set Header",
                  "purpose": "To indicate the start of a transaction set and to assign a control number",
                  "elements": [
                    {
                      "key": "tivLgJnLG8fELYt0Rk5fc",
                      "type": "Data Element",
                      "value": "850",
                      "id": "143",
                      "desc": "Transaction Set Identifier Code",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 3,
                      "maxLength": 3,
                      "codeValue": "Purchase Order",
                      "definition": "Code uniquely identifying a Transaction Set"
                    },
                    {
                      "key": "I6R6O6PNxfYYjsSCWJJPe",
                      "type": "Data Element",
                      "value": "0003",
                      "id": "329",
                      "desc": "Transaction Set Control Number",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 4,
                      "maxLength": 9,
                      "definition": "Identifying control number that must be unique within the transaction set functional group assigned by the originator for a transaction set"
                    }
                  ]
                },
                "endSegment": {
                  "key": "YsHwFzc5aw4JQtMluwEgn",
                  "id": "SE",
                  "desc": "Transaction Set Trailer",
                  "purpose": "To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)",
                  "elements": [
                    {
                      "key": "d2F7y9uxp0jJUQe1rLdBp",
                      "type": "Data Element",
                      "value": "3",
                      "id": "96",
                      "desc": "Number of Included Segments",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 1,
                      "maxLength": 10,
                      "definition": "Total number of segments included in a transaction set including ST and SE segments"
                    },
                    {
                      "key": "7jXasZuKPFlZlny5Jc1Vz",
                      "type": "Data Element",
                      "value": "0003",
                      "id": "329",
                      "desc": "Transaction Set Control Number",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 4,
                      "maxLength": 9,
                      "definition": "Identifying control number that must be unique within the transaction set functional group assigned by the originator for a transaction set"
                    }
                  ]
                }
              }
            ],
            "startSegment": {
              "key": "dIUG8Z3yTx607ah-xtQ4b",
              "id": "GS",
              "desc": "Functional Group Header",
              "purpose": "To indicate the beginning of a functional group and to provide control information",
              "elements": [
                {
                  "key": "JnJyjVZ16cMpOBo1BhVsc",
                  "type": "Data Element",
                  "value": "PO",
                  "id": "479",
                  "desc": "Functional Identifier Code",
                  "required": true,
                  "minLength": 2,
                  "maxLength": 2,
                  "definition": "Code identifying a group of application related transaction sets"
                },
                {
                  "key": "21plNss6zXa7D1UqYl0pE",
                  "type": "Data Element",
                  "value": "  ",
                  "id": "142",
                  "desc": "Application Sender's Code",
                  "required": true,
                  "minLength": 2,
                  "maxLength": 15,
                  "definition": "Code identifying party sending transmission; codes agreed to by trading partners"
                },
                {
                  "key": "ORcLn7onul9SFS9s5J8ME",
                  "type": "Data Element",
                  "value": "  ",
                  "id": "124",
                  "desc": "Application Receiver's Code",
                  "required": true,
                  "minLength": 2,
                  "maxLength": 15,
                  "definition": "Code identifying party receiving transmission. Codes agreed to by trading partners"
                },
                {
                  "key": "Jzd1xRNTXX3QmmEsF-uF4",
                  "type": "Data Element",
                  "value": "20241111",
                  "id": "373",
                  "desc": "Date",
                  "required": true,
                  "minLength": 8,
                  "maxLength": 8,
                  "definition": "Date expressed as CCYYMMDD"
                },
                {
                  "key": "4UdCiVq3N-hHrTrfDW0AE",
                  "type": "Data Element",
                  "value": "0300",
                  "id": "337",
                  "desc": "Time",
                  "required": true,
                  "minLength": 4,
                  "maxLength": 8,
                  "definition": "Time expressed in 24-hour clock time as follows: HHMM, or HHMMSS, or HHMMSSD, or HHMMSSDD, where H = hours (00-23), M = minutes (00-59), S = integer seconds (00-59) and DD = decimal seconds; decimal seconds are expressed as follows: D = tenths (0-9) and DD = hundredths (00-99)"
                },
                {
                  "key": "G_onJS9Ttb52JBVZN3iIb",
                  "type": "Data Element",
                  "value": "2",
                  "id": "28",
                  "desc": "Group Control Number",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 9,
                  "definition": "Assigned number originated and maintained by the sender"
                },
                {
                  "key": "8tBZH_n4UhS9JwF9QuFmm",
                  "type": "Data Element",
                  "value": "T",
                  "id": "455",
                  "desc": "Responsible Agency Code",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 2,
                  "definition": "Code used in conjunction with Data Element 480 to identify the issuer of the standard"
                },
                {
                  "key": "_xovk4BYLtN4QJCJhA-7r",
                  "type": "Data Element",
                  "value": "004010",
                  "id": "480",
                  "desc": "Version / Release / Industry Identifier Code",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 12,
                  "definition": "Code indicating the version, release, subrelease, and industry identifier of the EDI standard being used, including the GS and GE segments; if code in DE455 in GS segment is X, then in DE 480 positions 1-3 are the version number; positions 4-6 are the release and subrelease, level of the version; and positions 7-12 are the industry or trade association identifiers (optionally assigned by user); if code in DE455 in GS segment is T, then other formats are allowed"
                }
              ]
            },
            "endSegment": {
              "key": "TI8ibAYUEYRmTYU2XOHqz",
              "id": "GE",
              "desc": "Functional Group Trailer",
              "purpose": "To indicate the end of a functional group and to provide control information",
              "elements": [
                {
                  "key": "dOXeD9acW5_JKsGU0kZIQ",
                  "type": "Data Element",
                  "value": "1",
                  "id": "97",
                  "desc": "Number of Transaction Sets Included",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 6,
                  "definition": "Total number of transaction sets included in the functional group or interchange (transmission) group terminated by the trailer containing this data element"
                },
                {
                  "key": "puat44OQHyw-azMNIrPGr",
                  "type": "Data Element",
                  "value": "2",
                  "id": "28",
                  "desc": "Group Control Number",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 9,
                  "definition": "Assigned number originated and maintained by the sender"
                }
              ]
            }
          }
        ],
        "startSegment": {
          "key": "zwEOqg-jgZ4dneEibn7d-",
          "id": "ISA",
          "desc": "Interchange Control Header",
          "purpose": "To start and identify an interchange of zero or more functional groups and interchange-related control segments",
          "elements": [
            {
              "key": "gqhfg8IIDXsk-mkLpYOys",
              "type": "Data Element",
              "value": "00",
              "id": "I01",
              "desc": "Authorization Information Qualifier",
              "required": true,
              "minLength": 2,
              "maxLength": 2,
              "definition": "Code to identify the type of information in the Authorization Information"
            },
            {
              "key": "NySaUvvqqdp_V4NwzZ4Zr",
              "type": "Data Element",
              "value": "          ",
              "id": "I02",
              "desc": "Authorization Information",
              "required": true,
              "minLength": 10,
              "maxLength": 10,
              "definition": "Information used for additional identification or authorization of the interchange sender or the data in the interchange; the type of information is set by the Authorization Information Qualifier (I01)"
            },
            {
              "key": "Ds1qqQshxVBuXsFJi_Bvx",
              "type": "Data Element",
              "value": "00",
              "id": "I03",
              "desc": "Security Information Qualifier",
              "required": true,
              "minLength": 2,
              "maxLength": 2,
              "definition": "Code to identify the type of information in the Security Information"
            },
            {
              "key": "jofi32LBz_NnkejcPxYxM",
              "type": "Data Element",
              "value": "          ",
              "id": "I04",
              "desc": "Security Information",
              "required": true,
              "minLength": 10,
              "maxLength": 10,
              "definition": "This is used for identifying the security information about the interchange sender or the data in the interchange; the type of information is set by the Security Information Qualifier (I03)"
            },
            {
              "key": "jfOLooSqXArfvler65xpt",
              "type": "Data Element",
              "value": "ZZ",
              "id": "I05",
              "desc": "Interchange ID Qualifier",
              "required": true,
              "minLength": 2,
              "maxLength": 2,
              "definition": "Qualifier to designate the system/method of code structure used to designate the sender or receiver ID element being qualified"
            },
            {
              "key": "7q4wl9aiQVmL6rBmQ9DTz",
              "type": "Data Element",
              "value": "SENDER         ",
              "id": "I06",
              "desc": "Interchange Sender ID",
              "required": true,
              "minLength": 15,
              "maxLength": 15,
              "definition": "Identification code published by the sender for other parties to use as the receiver ID to route data to them; the sender always codes this value in the sender ID element"
            },
            {
              "key": "JJIrbLMCseaZY2RE1QBi1",
              "type": "Data Element",
              "value": "ZZ",
              "id": "I05",
              "desc": "Interchange ID Qualifier",
              "required": true,
              "minLength": 2,
              "maxLength": 2,
              "definition": "Qualifier to designate the system/method of code structure used to designate the sender or receiver ID element being qualified"
            },
            {
              "key": "XPJ_ymnTE09XrVQDn-SlU",
              "type": "Data Element",
              "value": "RECEIVER       ",
              "id": "I07",
              "desc": "Interchange Receiver ID",
              "required": true,
              "minLength": 15,
              "maxLength": 15,
              "definition": "Identification code published by the receiver of the data; When sending, it is used by the sender as their sending ID, thus other parties sending to them will use this as a receiving ID to route data to them"
            },
            {
              "key": "Uvdwu9Q4in6G3oETvvM8p",
              "type": "Data Element",
              "value": "241111",
              "id": "I08",
              "desc": "Interchange Date",
              "required": true,
              "minLength": 6,
              "maxLength": 6,
              "definition": "Date of the interchange"
            },
            {
              "key": "kTMqMJC0Itj0hJuoKI6Lr",
              "type": "Data Element",
              "value": "0300",
              "id": "I09",
              "desc": "Interchange Time",
              "required": true,
              "minLength": 4,
              "maxLength": 4,
              "definition": "Time of the interchange"
            },
            {
              "key": "u95p75wlM8v9JoftiVJxW",
              "type": "Data Element",
              "value": "U",
              "id": "I10",
              "desc": "Interchange Control Standards Identifier",
              "required": true,
              "minLength": 1,
              "maxLength": 1,
              "definition": "Code to identify the agency responsible for the control standard used by the message that is enclosed by the interchange header and trailer"
            },
            {
              "key": "DFjfAkH9iNFX3GcIpwuQL",
              "type": "Data Element",
              "value": "00401",
              "id": "I11",
              "desc": "Interchange Control Version Number",
              "required": true,
              "minLength": 5,
              "maxLength": 5,
              "definition": "This version number covers the interchange control segments"
            },
            {
              "key": "OsWSWt5DWhgHI3We58gzN",
              "type": "Data Element",
              "value": "000000001",
              "id": "I12",
              "desc": "Interchange Control Number",
              "required": true,
              "minLength": 9,
              "maxLength": 9,
              "definition": "A control number assigned by the interchange sender"
            },
            {
              "key": "AnGBjUeJsE97LlA1xWu5-",
              "type": "Data Element",
              "value": "0",
              "id": "I13",
              "desc": "Acknowledgment Requested",
              "required": true,
              "minLength": 1,
              "maxLength": 1,
              "definition": "Code sent by the sender to request an interchange acknowledgment (TA1)"
            },
            {
              "key": "pQdtVQf7PmkQWz8e9wTQe",
              "type": "Data Element",
              "value": "T",
              "id": "I14",
              "desc": "Usage Indicator",
              "required": true,
              "minLength": 1,
              "maxLength": 1,
              "definition": "Code to indicate whether data enclosed by this interchange envelope is test, production or information"
            },
            {
              "key": "70hAvvoQz7eO-li3y3V30",
              "type": "Data Element",
              "value": ":",
              "id": "I15",
              "desc": "Component Element Separator",
              "required": true,
              "minLength": 1,
              "maxLength": 1,
              "definition": "Type is not applicable; the component element separator is a delimiter and not a data element; this field provides the delimiter used to separate component data elements within a composite data structure; this value must be different than the data element separator and the segment terminator"
            }
          ]
        },
        "endSegment": {
          "key": "dPxqgTGspyVARlSp54-64",
          "id": "IEA",
          "desc": "Interchange Control Trailer",
          "purpose": "To define the end of an interchange of zero or more functional groups and interchange-related control segments",
          "elements": [
            {
              "key": "jQND-E4nfspJbWdffCQEW",
              "type": "Data Element",
              "value": "2",
              "id": "I16",
              "desc": "Number of Transaction Sets Included",
              "required": true,
              "minLength": 1,
              "maxLength": 5,
              "definition": "A count of the number of functional groups included in an interchange"
            },
            {
              "key": "4L_bKAyMOQpYchaU67KDN",
              "type": "Data Element",
              "value": "000000001",
              "id": "I12",
              "desc": "Group Control Number",
              "required": true,
              "minLength": 9,
              "maxLength": 9,
              "definition": "A control number assigned by the interchange sender"
            }
          ]
        }
      }
    ],
    "ediType": "x12"
  }

  const edifactTestData: IEdiDocument = {
    "interchanges": [
      {
        "key": "V5PyKv4m011MzpSNYoJrc",
        "meta": {
          "senderID": "<Sender GLN>",
          "senderQualifer": "14",
          "receiverID": "<Receiver GLN>",
          "receiverQualifer": "14",
          "date": "140407",
          "time": "0910",
          "id": "0001"
        },
        "id": "0001",
        "functionalGroups": [
          {
            "key": "_8iSqEu8T9GDTOx9Ge1qe",
            "meta": {},
            "id": "",
            "transactionSets": [
              {
                "key": "-Oi-dPGc0kqfQVpFwQq4T",
                "meta": { "id": "001", "version": "ORDERS", "release": "D96A" },
                "id": "001",
                "segments": [
                  {
                    "key": "IkRHUrJf2PcBe2wOIL5lO",
                    "id": "BGM",
                    "desc": "BEGINNING OF MESSAGE",
                    "purpose": "To indicate the type and function of a message and to transmit the identifying number.",
                    "elements": [
                      {
                        "key": "j61Dd-S0QpyLPHARUp0_5",
                        "type": "Data Element",
                        "value": "220",
                        "components": [
                          {
                            "key": "1Mar-V6LEMRjSitaijBQg",
                            "type": "Component Element",
                            "value": "220",
                            "id": "1001",
                            "desc": "Document/message name, coded",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Order",
                            "definition": "Document/message identifier expressed in code."
                          }
                        ],
                        "id": "C002",
                        "desc": "DOCUMENT/MESSAGE NAME",
                        "required": false,
                        "definition": "Identification of a type of document/message by code or name. Code preferred."
                      },
                      {
                        "key": "IGm7LyWtXXBC3PFyTyjno",
                        "type": "Data Element",
                        "value": "PO1",
                        "id": "1004",
                        "desc": "DOCUMENT/MESSAGE NUMBER",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 0,
                        "maxLength": 35,
                        "definition": "Reference number assigned to the document/message by the issuer."
                      },
                      {
                        "key": "ka3rHNu86Luj4D_yvziSE",
                        "type": "Data Element",
                        "value": "9",
                        "id": "1225",
                        "desc": "MESSAGE FUNCTION, CODED",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 0,
                        "maxLength": 3,
                        "codeValue": "Original",
                        "definition": "Code indicating the function of the message."
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "key": "n2siY6ZeH48SYK3wTp8vj",
                  "id": "UNH",
                  "desc": "Message header",
                  "purpose": "To head, identify and specify a message.",
                  "elements": [
                    {
                      "key": "Y0Z545402CFDM1zTWeC2a",
                      "type": "Data Element",
                      "value": "001",
                      "id": "0062",
                      "desc": "MESSAGE REFERENCE NUMBER",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 14,
                      "definition": "Unique message reference assigned by the sender."
                    },
                    {
                      "key": "0OFrPeNOZUUNYRgEjFe8k",
                      "type": "Data Element",
                      "value": "ORDERS:D:96A:UN:EAN001",
                      "components": [
                        {
                          "key": "pH-Nne5z-IGwWT9RffDez",
                          "type": "Component Element",
                          "value": "ORDERS",
                          "id": "0065",
                          "desc": "Message type identifier",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 6,
                          "codeValue": "Purchase order message",
                          "definition": "Code identifying a type of message and assigned by its controlling agency."
                        },
                        {
                          "key": "PErB-orpDUqcrVXDkwWKQ",
                          "type": "Component Element",
                          "value": "D",
                          "id": "0052",
                          "desc": "Message type version number",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 3,
                          "definition": "Version number of a message type."
                        },
                        {
                          "key": "999O7Vl-5AKXw9_p9Y1xJ",
                          "type": "Component Element",
                          "value": "96A",
                          "id": "0054",
                          "desc": "Message type release number",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 3,
                          "definition": "Release number within the current message type version number (0052)."
                        },
                        {
                          "key": "K7ErPSMyoIxTxGlQ2_9A3",
                          "type": "Component Element",
                          "value": "UN",
                          "id": "0051",
                          "desc": "Controlling agency",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 2,
                          "codeValue": "UN/ECE/TRADE/WP.4, United Nations Standard Messages (UNSM)",
                          "definition": "Code to identify the agency controlling the specification, maintenance and publication of the message type."
                        },
                        {
                          "key": "s1OnFsWDOv7FKk5U6JAkG",
                          "type": "Component Element",
                          "value": "EAN001",
                          "id": "0057",
                          "desc": "Association assigned code",
                          "dataType": "AN",
                          "required": false,
                          "minLength": 0,
                          "maxLength": 6,
                          "definition": "A code assigned by the association responsible for the design and maintenance of the message type concerned, which further identifies the message."
                        }
                      ],
                      "id": "S009",
                      "desc": "MESSAGE IDENTIFIER",
                      "required": true,
                      "definition": "Identification of the type, version etc. of the message being interchanged."
                    }
                  ]
                },
                "endSegment": {
                  "key": "0ePF5GNp_8vjSVZnB5yBv",
                  "id": "UNT",
                  "desc": "Message trailer",
                  "purpose": "To end and check the completeness of a message.",
                  "elements": [
                    {
                      "key": "D1tHMSaUU5k_i9vQjSOVB",
                      "type": "Data Element",
                      "value": "3",
                      "id": "0074",
                      "desc": "NUMBER OF SEGMENTS IN A MESSAGE",
                      "dataType": "N",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 6,
                      "definition": "Control count of number of segments in a message."
                    },
                    {
                      "key": "rB8LXRUsMgLusIRHY_IYr",
                      "type": "Data Element",
                      "value": "001",
                      "id": "0062",
                      "desc": "MESSAGE REFERENCE NUMBER",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 14,
                      "definition": "Unique message reference assigned by the sender."
                    }
                  ]
                }
              },
              {
                "key": "jy6NZBLReiteknPpohyAu",
                "meta": { "id": "002", "version": "DESADV", "release": "D07A" },
                "id": "002",
                "segments": [
                  {
                    "key": "TURuTb_CeJJf2hCK-0Av-",
                    "id": "BGM",
                    "desc": "BEGINNING OF MESSAGE",
                    "purpose": "To indicate the type and function of a message and to transmit the identifying number.",
                    "elements": [
                      {
                        "key": "siKwjJAlOy2CJL49FP_on",
                        "type": "Data Element",
                        "value": "351",
                        "components": [
                          {
                            "key": "QJbvyGXZM-vZQPZmucGCJ",
                            "type": "Component Element",
                            "value": "351",
                            "id": "1001",
                            "desc": "Document name code",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Despatch advice",
                            "definition": "Code specifying the document name."
                          }
                        ],
                        "id": "C002",
                        "desc": "DOCUMENT/MESSAGE NAME",
                        "required": false,
                        "definition": "Identification of a type of document/message by code or name. Code preferred."
                      },
                      {
                        "key": "mmovx4fF6KsbL-2O-CWqj",
                        "type": "Data Element",
                        "value": "20171229",
                        "components": [
                          {
                            "key": "hzhRmFkp1IEW0Zz29HZ92",
                            "type": "Component Element",
                            "value": "20171229",
                            "id": "1004",
                            "desc": "Document identifier",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 35,
                            "definition": "To identify a document."
                          }
                        ],
                        "id": "C106",
                        "desc": "DOCUMENT/MESSAGE IDENTIFICATION",
                        "required": false,
                        "definition": "Identification of a document/message by its number and eventually its version or revision."
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "key": "RoYlRTJS6VMRZS5lFoWjn",
                  "id": "UNH",
                  "desc": "Message header",
                  "purpose": "To head, identify and specify a message.",
                  "elements": [
                    {
                      "key": "ddjXYpS85_n4ISWJPeHpv",
                      "type": "Data Element",
                      "value": "002",
                      "id": "0062",
                      "desc": "MESSAGE REFERENCE NUMBER",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 14,
                      "definition": "Unique message reference assigned by the sender."
                    },
                    {
                      "key": "-c3v-PiYoRGVq3bl_aaFl",
                      "type": "Data Element",
                      "value": "DESADV:D:07A:UN:EAN001",
                      "components": [
                        {
                          "key": "gE9j0FGf2efY1IwAAAKOT",
                          "type": "Component Element",
                          "value": "DESADV",
                          "id": "0065",
                          "desc": "Message type",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 6,
                          "codeValue": "Despatch advice message",
                          "definition": "Code identifying a type of message and assigned by its controlling agency."
                        },
                        {
                          "key": "pFgxXxPROA9SYLCCOWgdq",
                          "type": "Component Element",
                          "value": "D",
                          "id": "0052",
                          "desc": "Message version number",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 3,
                          "codeValue": "Draft version/UN/EDIFACT Directory",
                          "definition": "Version number of a message type."
                        },
                        {
                          "key": "dSfVpINfQudev66jvGhaO",
                          "type": "Component Element",
                          "value": "07A",
                          "id": "0054",
                          "desc": "Message release number",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 3,
                          "codeValue": "Release 2007 - A",
                          "definition": "Release number within the current message version number."
                        },
                        {
                          "key": "0Xl277sJLuPwO_Tpw0yXw",
                          "type": "Component Element",
                          "value": "UN",
                          "id": "0051",
                          "desc": "Controlling agency, coded",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 3,
                          "codeValue": "UN/CEFACT",
                          "definition": "Code identifying a controlling agency."
                        },
                        {
                          "key": "hG5GKihOP6ubeP43leWOR",
                          "type": "Component Element",
                          "value": "EAN001",
                          "id": "0057",
                          "desc": "Association assigned code",
                          "dataType": "AN",
                          "required": false,
                          "minLength": 0,
                          "maxLength": 6,
                          "definition": "Code, assigned by the association responsible for the design and maintenance of the message type concerned, which further identifies the message."
                        }
                      ],
                      "id": "S009",
                      "desc": "MESSAGE IDENTIFIER",
                      "required": true,
                      "definition": "Identification of the type, version, etc. of the message being interchanged."
                    }
                  ]
                },
                "endSegment": {
                  "key": "7i5XkVM0UdqWig0K3jaFv",
                  "id": "UNT",
                  "desc": "Message trailer",
                  "purpose": "To end and check the completeness of a message.",
                  "elements": [
                    {
                      "key": "a3g5QsYqNquBCR7sY3l0p",
                      "type": "Data Element",
                      "value": "3",
                      "id": "0074",
                      "desc": "NUMBER OF SEGMENTS IN A MESSAGE",
                      "dataType": "N",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 10,
                      "definition": "The number of segments in a message body, plus the message header segment and message trailer segment."
                    },
                    {
                      "key": "xtW91plpZihdMHezjtJz3",
                      "type": "Data Element",
                      "value": "002",
                      "id": "0062",
                      "desc": "MESSAGE REFERENCE NUMBER",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 14,
                      "definition": "Unique message reference assigned by the sender."
                    }
                  ]
                }
              }
            ]
          }
        ],
        "startSegment": {
          "key": "RtQNwmkALiSL6kkF602uC",
          "id": "UNB",
          "desc": "Interchange header",
          "purpose": "To start, identify and specify an interchange.",
          "elements": [
            {
              "key": "xS7NcZyPU3gK-em9n7guB",
              "type": "Data Element",
              "value": "UNOA:2",
              "components": [
                {
                  "key": "K4zgTraHF9dwBkQf9rXjP",
                  "type": "Component Element",
                  "value": "UNOA",
                  "id": "0001",
                  "desc": "Syntax identifier",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 4,
                  "maxLength": 4,
                  "definition": "Coded identification of the agency controlling a syntax and syntax level used in an interchange."
                },
                {
                  "key": "3hJeIrYdsvocajPx_TcOk",
                  "type": "Component Element",
                  "value": "2",
                  "id": "0002",
                  "desc": "Syntax version number",
                  "dataType": "N",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 1,
                  "definition": "Version number of the syntax identified in the syntax identifier (0001)"
                }
              ],
              "id": "S001",
              "desc": "Syntax identifier",
              "required": true,
              "definition": "Identification of the agency controlling the syntax and indication of syntax level."
            },
            {
              "key": "zxb3oglvgvcpisz9Vfu9p",
              "type": "Data Element",
              "value": "<Sender GLN>:14",
              "components": [
                {
                  "key": "E6NHDM3bHSDp1yNp5QEhK",
                  "type": "Component Element",
                  "value": "<Sender GLN>",
                  "id": "0004",
                  "desc": "Sender identification",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 35,
                  "definition": "Name or coded representation of the sender of a data interchange."
                },
                {
                  "key": "HQv586yXYaTbO5t9q7MxG",
                  "type": "Component Element",
                  "value": "14",
                  "id": "0007",
                  "desc": "Partner identification code qualifier",
                  "dataType": "AN",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 4,
                  "definition": "Qualifier referring to the source of codes for the identifiers of interchanging partners."
                }
              ],
              "id": "S002",
              "desc": "Interchange sender",
              "required": true,
              "definition": "Identification of the sender of the interchange."
            },
            {
              "key": "kTbFueIUOXzQkKT1jZcHi",
              "type": "Data Element",
              "value": "<Receiver GLN>:14",
              "components": [
                {
                  "key": "erD3ePdWaTkV61QpvQ6Pz",
                  "type": "Component Element",
                  "value": "<Receiver GLN>",
                  "id": "0010",
                  "desc": "Recipient identification",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 35,
                  "definition": "Name or coded representation of the recipient of a data interchange."
                },
                {
                  "key": "FUQoVizDo2iIr4bouHuR-",
                  "type": "Component Element",
                  "value": "14",
                  "id": "0007",
                  "desc": "Partner identification code qualifier",
                  "dataType": "AN",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 4,
                  "definition": "Qualifier referring to the source of codes for the identifiers of interchanging partners."
                }
              ],
              "id": "S003",
              "desc": "Interchange recipient",
              "required": true,
              "definition": "Identification of the recipient of the interchange."
            },
            {
              "key": "FZ4-DVsWShcQs7rl_bBpf",
              "type": "Data Element",
              "value": "140407:0910",
              "components": [
                {
                  "key": "fF-VnOJBmXfUHZBp-lkJi",
                  "type": "Component Element",
                  "value": "140407",
                  "id": "0017",
                  "desc": "Date of preparation",
                  "dataType": "N",
                  "required": true,
                  "minLength": 6,
                  "maxLength": 6,
                  "definition": "Local date when an interchange or a functional group was prepared."
                },
                {
                  "key": "A4Uhs-5_2uHUPCmwWxaTC",
                  "type": "Component Element",
                  "value": "0910",
                  "id": "0019",
                  "desc": "Time of preparation",
                  "dataType": "N",
                  "required": false,
                  "minLength": 4,
                  "maxLength": 4,
                  "definition": "Local time of day when an interchange or a functional group was prepared."
                }
              ],
              "id": "S004",
              "desc": "Date/time of preparation",
              "required": true,
              "definition": "Date and time of preparation of the interchange."
            },
            {
              "key": "LyS4SDl26vHvpiOL3eThy",
              "type": "Data Element",
              "value": "0001",
              "id": "0020",
              "desc": "Interchange control reference",
              "dataType": "AN",
              "required": true,
              "minLength": 1,
              "maxLength": 14,
              "definition": "Unique reference assigned by the sender to an interchange."
            }
          ]
        },
        "endSegment": {
          "key": "hCPx1p1xlQnCH2lE-DOUk",
          "id": "UNZ",
          "desc": "Interchange trailer",
          "purpose": "To end and check the completeness of an interchange.",
          "elements": [
            {
              "key": "9w8RFRxgh2yO_Kh7t47jy",
              "type": "Data Element",
              "value": "2",
              "id": "0036",
              "desc": "Interchange control count",
              "required": true,
              "minLength": 1,
              "maxLength": 6,
              "definition": "Count either of the number of messages or, if used, of the number of functional groups in an interchange."
            },
            {
              "key": "JJvteWBameE8s0-KMG0CL",
              "type": "Data Element",
              "value": "0001",
              "id": "0020",
              "desc": "Interchange control reference",
              "required": true,
              "minLength": 1,
              "maxLength": 14,
              "definition": "Unique reference assigned by the sender to an interchange."
            }
          ]
        }
      },
      {
        "key": "jKSqPFfMLoI7nO4UqkaVx",
        "meta": {
          "senderID": "<Sender GLN>",
          "senderQualifer": "14",
          "receiverID": "<Receiver GLN>",
          "receiverQualifer": "14",
          "date": "140407",
          "time": "0910",
          "id": "0002"
        },
        "id": "0002",
        "functionalGroups": [
          {
            "key": "vSFepyjEUyDtsZs3-3nPx",
            "meta": {},
            "id": "",
            "transactionSets": [
              {
                "key": "FaGtKKVGpijhX-qWeH3VW",
                "meta": { "id": "003", "version": "ORDERS", "release": "D96A" },
                "id": "003",
                "segments": [
                  {
                    "key": "o_3GdYCnwNYh5DlfNo_Th",
                    "id": "BGM",
                    "desc": "BEGINNING OF MESSAGE",
                    "purpose": "To indicate the type and function of a message and to transmit the identifying number.",
                    "elements": [
                      {
                        "key": "D-dGksQjhgEzACPf_FIDG",
                        "type": "Data Element",
                        "value": "220",
                        "components": [
                          {
                            "key": "gqvKjfDDttVUyggOxAlDT",
                            "type": "Component Element",
                            "value": "220",
                            "id": "1001",
                            "desc": "Document/message name, coded",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Order",
                            "definition": "Document/message identifier expressed in code."
                          }
                        ],
                        "id": "C002",
                        "desc": "DOCUMENT/MESSAGE NAME",
                        "required": false,
                        "definition": "Identification of a type of document/message by code or name. Code preferred."
                      },
                      {
                        "key": "5eg0cSrs7Z8GHGrgJlCLq",
                        "type": "Data Element",
                        "value": "PO3",
                        "id": "1004",
                        "desc": "DOCUMENT/MESSAGE NUMBER",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 0,
                        "maxLength": 35,
                        "definition": "Reference number assigned to the document/message by the issuer."
                      },
                      {
                        "key": "H17bacf7WSeaWoaEV8VVn",
                        "type": "Data Element",
                        "value": "9",
                        "id": "1225",
                        "desc": "MESSAGE FUNCTION, CODED",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 0,
                        "maxLength": 3,
                        "codeValue": "Original",
                        "definition": "Code indicating the function of the message."
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "key": "yH7vaJKm6So9V68gq5QSj",
                  "id": "UNH",
                  "desc": "Message header",
                  "purpose": "To head, identify and specify a message.",
                  "elements": [
                    {
                      "key": "mI2ItNpL84d6oFrq4Nmuc",
                      "type": "Data Element",
                      "value": "003",
                      "id": "0062",
                      "desc": "MESSAGE REFERENCE NUMBER",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 14,
                      "definition": "Unique message reference assigned by the sender."
                    },
                    {
                      "key": "_hyOxANENrfuOt5lgvd5G",
                      "type": "Data Element",
                      "value": "ORDERS:D:96A:UN:EAN001",
                      "components": [
                        {
                          "key": "0DsIicoNtVvduJki7XQlr",
                          "type": "Component Element",
                          "value": "ORDERS",
                          "id": "0065",
                          "desc": "Message type identifier",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 6,
                          "codeValue": "Purchase order message",
                          "definition": "Code identifying a type of message and assigned by its controlling agency."
                        },
                        {
                          "key": "LMjcS0OaGBpmkvO0uxDKm",
                          "type": "Component Element",
                          "value": "D",
                          "id": "0052",
                          "desc": "Message type version number",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 3,
                          "definition": "Version number of a message type."
                        },
                        {
                          "key": "_aApTFkdFtrJvFESR3DhJ",
                          "type": "Component Element",
                          "value": "96A",
                          "id": "0054",
                          "desc": "Message type release number",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 3,
                          "definition": "Release number within the current message type version number (0052)."
                        },
                        {
                          "key": "tk4FMlUkYSna6bd93b-ke",
                          "type": "Component Element",
                          "value": "UN",
                          "id": "0051",
                          "desc": "Controlling agency",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 2,
                          "codeValue": "UN/ECE/TRADE/WP.4, United Nations Standard Messages (UNSM)",
                          "definition": "Code to identify the agency controlling the specification, maintenance and publication of the message type."
                        },
                        {
                          "key": "eWXpw146sj3nnZMKeVceI",
                          "type": "Component Element",
                          "value": "EAN001",
                          "id": "0057",
                          "desc": "Association assigned code",
                          "dataType": "AN",
                          "required": false,
                          "minLength": 0,
                          "maxLength": 6,
                          "definition": "A code assigned by the association responsible for the design and maintenance of the message type concerned, which further identifies the message."
                        }
                      ],
                      "id": "S009",
                      "desc": "MESSAGE IDENTIFIER",
                      "required": true,
                      "definition": "Identification of the type, version etc. of the message being interchanged."
                    }
                  ]
                },
                "endSegment": {
                  "key": "1oF8DJxXFBsdeY5vHu3yn",
                  "id": "UNT",
                  "desc": "Message trailer",
                  "purpose": "To end and check the completeness of a message.",
                  "elements": [
                    {
                      "key": "7gRIjtCIIjbI9S8s7uaJ2",
                      "type": "Data Element",
                      "value": "3",
                      "id": "0074",
                      "desc": "NUMBER OF SEGMENTS IN A MESSAGE",
                      "dataType": "N",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 6,
                      "definition": "Control count of number of segments in a message."
                    },
                    {
                      "key": "cXE0KkACjgLE1G15LmLZa",
                      "type": "Data Element",
                      "value": "003",
                      "id": "0062",
                      "desc": "MESSAGE REFERENCE NUMBER",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 14,
                      "definition": "Unique message reference assigned by the sender."
                    }
                  ]
                }
              }
            ]
          }
        ],
        "startSegment": {
          "key": "Es4QZIJqQjGxnUDB6WBlW",
          "id": "UNB",
          "desc": "Interchange header",
          "purpose": "To start, identify and specify an interchange.",
          "elements": [
            {
              "key": "KECGWfaSUPGNgXH1bc4_c",
              "type": "Data Element",
              "value": "UNOA:2",
              "components": [
                {
                  "key": "zUoedoB2NgImSAyds8ToB",
                  "type": "Component Element",
                  "value": "UNOA",
                  "id": "0001",
                  "desc": "Syntax identifier",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 4,
                  "maxLength": 4,
                  "definition": "Coded identification of the agency controlling a syntax and syntax level used in an interchange."
                },
                {
                  "key": "WGEzIM74LavX05mLFIX_x",
                  "type": "Component Element",
                  "value": "2",
                  "id": "0002",
                  "desc": "Syntax version number",
                  "dataType": "N",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 1,
                  "definition": "Version number of the syntax identified in the syntax identifier (0001)"
                }
              ],
              "id": "S001",
              "desc": "Syntax identifier",
              "required": true,
              "definition": "Identification of the agency controlling the syntax and indication of syntax level."
            },
            {
              "key": "OTOLsBdzhcUpOa3JKZDrp",
              "type": "Data Element",
              "value": "<Sender GLN>:14",
              "components": [
                {
                  "key": "xUWKVhUHV0sXm9m9Y9PmV",
                  "type": "Component Element",
                  "value": "<Sender GLN>",
                  "id": "0004",
                  "desc": "Sender identification",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 35,
                  "definition": "Name or coded representation of the sender of a data interchange."
                },
                {
                  "key": "57jTSV2wHEEZZ0jkmFcYg",
                  "type": "Component Element",
                  "value": "14",
                  "id": "0007",
                  "desc": "Partner identification code qualifier",
                  "dataType": "AN",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 4,
                  "definition": "Qualifier referring to the source of codes for the identifiers of interchanging partners."
                }
              ],
              "id": "S002",
              "desc": "Interchange sender",
              "required": true,
              "definition": "Identification of the sender of the interchange."
            },
            {
              "key": "fqE5BzEXCoBU3GVVHwULu",
              "type": "Data Element",
              "value": "<Receiver GLN>:14",
              "components": [
                {
                  "key": "VoguUw-BUbrbFA0_65TNJ",
                  "type": "Component Element",
                  "value": "<Receiver GLN>",
                  "id": "0010",
                  "desc": "Recipient identification",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 35,
                  "definition": "Name or coded representation of the recipient of a data interchange."
                },
                {
                  "key": "IeAOI2sRYwxDX9GzY3dWI",
                  "type": "Component Element",
                  "value": "14",
                  "id": "0007",
                  "desc": "Partner identification code qualifier",
                  "dataType": "AN",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 4,
                  "definition": "Qualifier referring to the source of codes for the identifiers of interchanging partners."
                }
              ],
              "id": "S003",
              "desc": "Interchange recipient",
              "required": true,
              "definition": "Identification of the recipient of the interchange."
            },
            {
              "key": "jDSXjaL-q4rPa-ysXlrlE",
              "type": "Data Element",
              "value": "140407:0910",
              "components": [
                {
                  "key": "UZx0d7oMzwvZwcW1EbJd5",
                  "type": "Component Element",
                  "value": "140407",
                  "id": "0017",
                  "desc": "Date of preparation",
                  "dataType": "N",
                  "required": true,
                  "minLength": 6,
                  "maxLength": 6,
                  "definition": "Local date when an interchange or a functional group was prepared."
                },
                {
                  "key": "6nUDGh3DeL5r20YjFsi0D",
                  "type": "Component Element",
                  "value": "0910",
                  "id": "0019",
                  "desc": "Time of preparation",
                  "dataType": "N",
                  "required": false,
                  "minLength": 4,
                  "maxLength": 4,
                  "definition": "Local time of day when an interchange or a functional group was prepared."
                }
              ],
              "id": "S004",
              "desc": "Date/time of preparation",
              "required": true,
              "definition": "Date and time of preparation of the interchange."
            },
            {
              "key": "L9K7-UPMH3CvrmxA4w1z3",
              "type": "Data Element",
              "value": "0002",
              "id": "0020",
              "desc": "Interchange control reference",
              "dataType": "AN",
              "required": true,
              "minLength": 1,
              "maxLength": 14,
              "definition": "Unique reference assigned by the sender to an interchange."
            }
          ]
        },
        "endSegment": {
          "key": "jgM3e_ZM6Mf6Wo2LFUXaZ",
          "id": "UNZ",
          "desc": "Interchange trailer",
          "purpose": "To end and check the completeness of an interchange.",
          "elements": [
            {
              "key": "xdGuKR7wFk270jD4RQe3T",
              "type": "Data Element",
              "value": "1",
              "id": "0036",
              "desc": "Interchange control count",
              "required": true,
              "minLength": 1,
              "maxLength": 6,
              "definition": "Count either of the number of messages or, if used, of the number of functional groups in an interchange."
            },
            {
              "key": "sxUjVR9l8vO7TM0xvnPb0",
              "type": "Data Element",
              "value": "0002",
              "id": "0020",
              "desc": "Interchange control reference",
              "required": true,
              "minLength": 1,
              "maxLength": 14,
              "definition": "Unique reference assigned by the sender to an interchange."
            }
          ]
        }
      }
    ],
    "separatorsSegment": {
      "key": "GF2YlY4EYo4sazh79j-VI",
      "id": "UNA",
      "desc": "Delimiter String Advice",
      "purpose": "To start, identify and specify an interchange.",
      "elements": [
        {
          "key": "KFV2zHBBUJxT7_uZe9p_q",
          "type": "Data Element",
          "value": ":",
          "id": "UNA01",
          "desc": "Sub-element delimiter",
          "required": true,
          "minLength": 1,
          "maxLength": 1,
          "definition": "Sub-element delimiter"
        },
        {
          "key": "9QvMLBioKFL1RYu3Vdppv",
          "type": "Data Element",
          "value": "+",
          "id": "UNA02",
          "desc": "Data element delimiter",
          "required": true,
          "minLength": 1,
          "maxLength": 1,
          "definition": "Data element delimiter"
        },
        {
          "key": "uKw2QN7zgk94av1KkerfM",
          "type": "Data Element",
          "value": ".",
          "id": "UNA03",
          "desc": "Decimal point indicator",
          "required": true,
          "minLength": 1,
          "maxLength": 1,
          "definition": "Decimal point indicator"
        },
        {
          "key": "3Xl-P0-fmqyynQ9Yo_TEZ",
          "type": "Data Element",
          "value": "?",
          "id": "UNA04",
          "desc": "Release character",
          "required": true,
          "minLength": 1,
          "maxLength": 1,
          "definition": "Release character"
        },
        {
          "key": "w2YU63JtD5Gk69F7PIn4Z",
          "type": "Data Element",
          "value": "*",
          "id": "UNA05",
          "desc": "Space",
          "required": true,
          "minLength": 1,
          "maxLength": 1,
          "definition": "Space"
        }
      ]
    },
    "ediType": "edifact"
  }

  return new EdiDocument(edifactTestData);
}
