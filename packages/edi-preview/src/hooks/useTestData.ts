import { EdiDocument } from "@/entities";

export default function useTestData(): EdiDocument {
  const testData: IEdiDocument = {
    "interchanges": [
      {
        "key": "SUeWHiabNM1zKy8kbO_Af",
        "id": "000000001",
        "functionalGroups": [
          {
            "key": "aTvcN75QQPGweXAwIf26L",
            "id": "1",
            "transactionSets": [
              {
                "key": "i8vsTHs3MgfeCUMA5LFol",
                "id": "0001",
                "ediVersion": { "release": "00401", "version": "850" },
                "segments": [
                  {
                    "key": "VOvOo-AtSEdxFQ1eRqu-S",
                    "id": "BEG",
                    "desc": "Beginning Segment for Purchase Order",
                    "purpose": "To indicate the beginning of the Purchase Order Transaction Set and transmit identifying numbers and dates",
                    "elements": [
                      {
                        "key": "W5g95Wv6phMu5VXUWwnF8",
                        "type": "Data Element",
                        "value": "00",
                        "id": "353",
                        "desc": "Transaction Set Purpose Code",
                        "required": true,
                        "codeValue": "Original",
                        "definition": "Code identifying purpose of transaction set"
                      },
                      {
                        "key": "mGebBXY-Lo8--2-IXIq1X",
                        "type": "Data Element",
                        "value": "DS",
                        "id": "92",
                        "desc": "Purchase Order Type Code",
                        "required": true,
                        "codeValue": "Dropship",
                        "definition": "Code specifying the type of Purchase Order"
                      },
                      {
                        "key": "6p_fUV0Vy6o_lreiJEwe3",
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
                        "key": "wgS8DGJH59v2gGjrbTIW0",
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
                        "key": "VZBCBgfYh7TFChI6BS9N2",
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
                  "key": "zwTXZgwUNh0zJLZiiy6lx",
                  "id": "ST",
                  "desc": "Transaction Set Header",
                  "purpose": "To indicate the start of a transaction set and to assign a control number",
                  "elements": [
                    {
                      "key": "HpFAlGY884BL2qEFVfvmL",
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
                      "key": "Ps_zU1MsqGmkjiaFVlLsR",
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
                  "key": "iNX8KjMXw-_4iKmadG0R0",
                  "id": "SE",
                  "desc": "Transaction Set Trailer",
                  "purpose": "To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)",
                  "elements": [
                    {
                      "key": "bWcs0V9jGjzFJPQFgGNa-",
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
                      "key": "u86Tb0kdaBNfzg7Bs6px3",
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
                "key": "F8PVEUXM2TFWidXv5bfhF",
                "id": "0002",
                "ediVersion": { "release": "00401", "version": "864" },
                "segments": [
                  {
                    "key": "aV-zFvvRz61twC_-xkJCI",
                    "id": "BMG",
                    "desc": "Beginning Segment For Text Message",
                    "purpose": "To indicate the beginning of a Text Message Transaction Set",
                    "elements": [
                      {
                        "key": "EdjRZi7dyFhzW1-_gnjfU",
                        "type": "Data Element",
                        "value": "00",
                        "id": "353",
                        "desc": "Transaction Set Purpose Code",
                        "required": true,
                        "codeValue": "Original",
                        "definition": "Code identifying purpose of transaction set"
                      },
                      {
                        "key": "MV5YFz4tjLikwM3HJRuS6",
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
                        "key": "Fvgc91Yx2FVvVqRx9Xw_2",
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
                  "key": "UfHVclMlptljw_S53EPXA",
                  "id": "ST",
                  "desc": "Transaction Set Header",
                  "purpose": "To indicate the start of a transaction set and to assign a control number",
                  "elements": [
                    {
                      "key": "Ac7Rsrxyv8yPEAlVvpBRt",
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
                      "key": "TvZiPMq5CujNkwtp94l0M",
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
                  "key": "i1zMRzxJsVKhbXskU4LLS",
                  "id": "SE",
                  "desc": "Transaction Set Trailer",
                  "purpose": "To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)",
                  "elements": [
                    {
                      "key": "MpXh4HraP3oEiJLkyC5F9",
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
                      "key": "Tj7nb8rKI3gz1-5Hr5UHN",
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
              "key": "orXeBydE44Z3zH0JsvWWC",
              "id": "GS",
              "desc": "Functional Group Header",
              "purpose": "To indicate the beginning of a functional group and to provide control information",
              "elements": [
                {
                  "key": "AAzmXnSTcOzms24BnV-J0",
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
                  "key": "8z1QA9H3Qjohtm9DaoBT5",
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
                  "key": "U-FcdpIg5OTQsYT2cu3Mt",
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
                  "key": "6S1gAvPW9_jXY7HxCmgWM",
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
                  "key": "zVxWMoP8XVuwyA9J6uZav",
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
                  "key": "W4JMAKNpsMFq7ZQvX4LeW",
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
                  "key": "brTovkYxcZGzYPk3jy-ul",
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
                  "key": "POV-LKXZNwW_oWcUo7btr",
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
              "key": "PP_ctFwTTVlIZGjJqaGd5",
              "id": "GE",
              "desc": "Functional Group Trailer",
              "purpose": "To indicate the end of a functional group and to provide control information",
              "elements": [
                {
                  "key": "Oc5dUH2D-UmVzWfd3LGkC",
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
                  "key": "mp1SuPSzo5zq3MHCsUyoQ",
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
            "key": "1HEs3Afapf7NInCKWfSEQ",
            "id": "2",
            "transactionSets": [
              {
                "key": "8x7MZwDtNCbdNzJ608bb3",
                "id": "0003",
                "ediVersion": { "release": "00401", "version": "850" },
                "segments": [
                  {
                    "key": "xZRVwHzjukaNOZTjM13WS",
                    "id": "BEG",
                    "desc": "Beginning Segment for Purchase Order",
                    "purpose": "To indicate the beginning of the Purchase Order Transaction Set and transmit identifying numbers and dates",
                    "elements": [
                      {
                        "key": "stGeXiTpKapcQAbXwzaek",
                        "type": "Data Element",
                        "value": "00",
                        "id": "353",
                        "desc": "Transaction Set Purpose Code",
                        "required": true,
                        "codeValue": "Original",
                        "definition": "Code identifying purpose of transaction set"
                      },
                      {
                        "key": "VnULvbV3FbBxM9_Uv84BD",
                        "type": "Data Element",
                        "value": "DS",
                        "id": "92",
                        "desc": "Purchase Order Type Code",
                        "required": true,
                        "codeValue": "Dropship",
                        "definition": "Code specifying the type of Purchase Order"
                      },
                      {
                        "key": "g9aN_tqm_fx5qP1y-E8cZ",
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
                        "key": "_N1LAyCugZGgoNhUTzF0z",
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
                        "key": "fR2POuYt0rjlFiDoVFh4q",
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
                  "key": "ljP5EZAsbUahwL2h9NQu1",
                  "id": "ST",
                  "desc": "Transaction Set Header",
                  "purpose": "To indicate the start of a transaction set and to assign a control number",
                  "elements": [
                    {
                      "key": "W8VQC1jCggiH9Km-DDdW2",
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
                      "key": "rFN5tQ88wUO-2uJ0Jmd-A",
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
                  "key": "HeA18HV-xL1iVDTpjMzKJ",
                  "id": "SE",
                  "desc": "Transaction Set Trailer",
                  "purpose": "To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)",
                  "elements": [
                    {
                      "key": "vo7I3l_m42Lf_sr9grWpq",
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
                      "key": "X3PWAIT1Myz-gxPCKjBXP",
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
              "key": "HIAbasMT1BZuZ-DiSWCuP",
              "id": "GS",
              "desc": "Functional Group Header",
              "purpose": "To indicate the beginning of a functional group and to provide control information",
              "elements": [
                {
                  "key": "JNdKypx54V8wzDcT37Ckc",
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
                  "key": "L5uIZQ5p3go5BJQjyDqfA",
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
                  "key": "vUc_l-L2FneJQ2FH80ApH",
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
                  "key": "CGAyzIFflgKEBj6R0auxA",
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
                  "key": "I4gA-0uyGmONznqRnWGAb",
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
                  "key": "JLpMYy0UAE8jiNokgPowk",
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
                  "key": "qQgxQ7e7ML5uzRV875c_y",
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
                  "key": "8-te9Sg_BmvAgmHv3fxX1",
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
              "key": "CFTpdmM5xCWYJ53bOIUIO",
              "id": "GE",
              "desc": "Functional Group Trailer",
              "purpose": "To indicate the end of a functional group and to provide control information",
              "elements": [
                {
                  "key": "Q-jFquOwSI33LEUYfdEDH",
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
                  "key": "rItxixa_mznRl9nPnd1Xn",
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
          "key": "P-LKEQQHXPIS98je1i3tk",
          "id": "ISA",
          "desc": "Interchange Control Header",
          "purpose": "To start and identify an interchange of zero or more functional groups and interchange-related control segments",
          "elements": [
            {
              "key": "gvPY0jr-fdXjZQPwxqoES",
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
              "key": "caHMoU4pZcjHSk6j8HtEN",
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
              "key": "nQq3NQ1jdk5WYa0ORQb0x",
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
              "key": "BjDgRT0gCYzSBkjFF6f12",
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
              "key": "aRDKOWXT3h6D6UrxlWhBo",
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
              "key": "c3MRqWQY4IecC_DbCnxNk",
              "type": "Data Element",
              "value": "               ",
              "id": "I06",
              "desc": "Interchange Sender ID",
              "required": true,
              "minLength": 15,
              "maxLength": 15,
              "definition": "Identification code published by the sender for other parties to use as the receiver ID to route data to them; the sender always codes this value in the sender ID element"
            },
            {
              "key": "b3p0SfTy6mzs8PH9aQ2im",
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
              "key": "OuL479JgW0WybnnMMM8xk",
              "type": "Data Element",
              "value": "               ",
              "id": "I07",
              "desc": "Interchange Receiver ID",
              "required": true,
              "minLength": 15,
              "maxLength": 15,
              "definition": "Identification code published by the receiver of the data; When sending, it is used by the sender as their sending ID, thus other parties sending to them will use this as a receiving ID to route data to them"
            },
            {
              "key": "fDp__XAWvWJWna_mxtvsg",
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
              "key": "J7RqZ0WBQeOOwzIbfzXOz",
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
              "key": "KqI_2gQ_qgs3Y9Mwbkbmy",
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
              "key": "QzIPlHp5MLFEkeWYeLMfl",
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
              "key": "xLPNGTel_ha2RFZNxRfQF",
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
              "key": "CHYP8wcaFAo1vDOGpQG4-",
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
              "key": "iQLRZJ6y0-laMdwnf57Gr",
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
              "key": "DsvPEEVwCVgKL4G0MYIIF",
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
          "key": "1Z3nvNptBVCukT02CSy1m",
          "id": "IEA",
          "desc": "Interchange Control Trailer",
          "purpose": "To define the end of an interchange of zero or more functional groups and interchange-related control segments",
          "elements": [
            {
              "key": "h2boJN6ul1SuOIcV4wFr3",
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
              "key": "qXduZHbTDocBIp-_QOwkW",
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
  };

  return new EdiDocument(testData);
}
