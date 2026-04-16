import { EdiDocument } from "@/entities";

// Generated from:
// - src/test/suite/test-files/formatting/x12.prettify.edi
// - src/test/suite/test-files/formatting/edifact.prettify.edi
// - docs/4905.edi

export default function useTestData(): EdiDocument {
  const x12TestData: IEdiDocument =   {
    "interchanges": [
      {
        "nodeKey": "interchange:000007080:0:1127",
        "meta": {
          "senderQualifer": "ZZ",
          "senderID": "DERICL         ",
          "receiverQualifer": "ZZ",
          "receiverID": "TEST01         ",
          "date": "210517",
          "time": "0643",
          "id": "000007080"
        },
        "id": "000007080",
        "functionalGroups": [
          {
            "nodeKey": "functional-group:7080:108:1109",
            "meta": {
              "date": "20210517",
              "time": "0643",
              "id": "7080"
            },
            "id": "7080",
            "transactionSets": [
              {
                "nodeKey": "transaction-set:0001:158:1097",
                "meta": {
                  "release": "00401",
                  "version": "850",
                  "messageInfo": {
                    "name": "Purchase Order",
                    "version": "850",
                    "introduction": "This Draft Standard for Trial Use contains the format and establishes the data contents of the Purchase Order Transaction Set (850) for use within the context of an Electronic Data Interchange (EDI) environment. The transaction set can be used to provide for customary and established business and industry practice relative to the placement of purchase orders for goods and services. This transaction set should not be used to convey purchase order changes or purchase order acknowledgment information."
                  },
                  "id": "0001"
                },
                "id": "0001",
                "segments": [
                  {
                    "nodeKey": "segment:BEG:172:209",
                    "id": "BEG",
                    "segmentStr": "BEG*00*BK*0019-1234567-1234**20000130~",
                    "elements": [
                      {
                        "nodeKey": "element:BEG01:175:177",
                        "type": "Data Element",
                        "value": "00",
                        "id": "353",
                        "desc": "Transaction Set Purpose Code",
                        "required": true,
                        "codeValue": "Original",
                        "definition": "Code identifying purpose of transaction set",
                        "designator": "BEG01"
                      },
                      {
                        "nodeKey": "element:BEG02:178:180",
                        "type": "Data Element",
                        "value": "BK",
                        "id": "92",
                        "desc": "Purchase Order Type Code",
                        "required": true,
                        "codeValue": "Blanket Order (Quantity Firm)",
                        "definition": "Code specifying the type of Purchase Order",
                        "designator": "BEG02"
                      },
                      {
                        "nodeKey": "element:BEG03:181:198",
                        "type": "Data Element",
                        "value": "0019-1234567-1234",
                        "id": "324",
                        "desc": "Purchase Order Number",
                        "dataType": "AN",
                        "required": true,
                        "minLength": 1,
                        "maxLength": 22,
                        "definition": "Identifying number for Purchase Order assigned by the orderer/purchaser",
                        "designator": "BEG03"
                      },
                      {
                        "nodeKey": "element:BEG04:199:199",
                        "type": "Data Element",
                        "value": "",
                        "id": "328",
                        "desc": "Release Number",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 30,
                        "definition": "Number identifying a release against a Purchase Order previously placed by the parties involved in the transaction",
                        "designator": "BEG04"
                      },
                      {
                        "nodeKey": "element:BEG05:200:208",
                        "type": "Data Element",
                        "value": "20000130",
                        "id": "373",
                        "desc": "Date",
                        "dataType": "DT",
                        "required": true,
                        "minLength": 8,
                        "maxLength": 8,
                        "definition": "Date expressed as CCYYMMDD",
                        "designator": "BEG05"
                      }
                    ],
                    "desc": "Beginning Segment for Purchase Order",
                    "purpose": "To indicate the beginning of the Purchase Order Transaction Set and transmit identifying numbers and dates"
                  },
                  {
                    "nodeKey": "segment:REF:212:238",
                    "id": "REF",
                    "segmentStr": "REF*IA*3688063*VENDOR NAME~",
                    "elements": [
                      {
                        "nodeKey": "element:REF01:215:217",
                        "type": "Data Element",
                        "value": "IA",
                        "id": "128",
                        "desc": "Reference Identification Qualifier",
                        "required": true,
                        "codeValue": "Internal Vendor Number",
                        "definition": "Code qualifying the Reference Identification",
                        "designator": "REF01"
                      },
                      {
                        "nodeKey": "element:REF02:218:225",
                        "type": "Data Element",
                        "value": "3688063",
                        "id": "127",
                        "desc": "Reference Identification",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 30,
                        "definition": "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier",
                        "designator": "REF02"
                      },
                      {
                        "nodeKey": "element:REF03:226:237",
                        "type": "Data Element",
                        "value": "VENDOR NAME",
                        "id": "352",
                        "desc": "Description",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 80,
                        "definition": "A free-form description to clarify the related data elements and their content",
                        "designator": "REF03"
                      }
                    ],
                    "desc": "Reference Identification",
                    "purpose": "To specify identifying information"
                  },
                  {
                    "nodeKey": "segment:REF:241:253",
                    "id": "REF",
                    "segmentStr": "REF*2H*AD*Ad~",
                    "elements": [
                      {
                        "nodeKey": "element:REF01:244:246",
                        "type": "Data Element",
                        "value": "2H",
                        "id": "128",
                        "desc": "Reference Identification Qualifier",
                        "required": true,
                        "codeValue": "Assigned by transaction set sender",
                        "definition": "Code qualifying the Reference Identification",
                        "designator": "REF01"
                      },
                      {
                        "nodeKey": "element:REF02:247:249",
                        "type": "Data Element",
                        "value": "AD",
                        "id": "127",
                        "desc": "Reference Identification",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 30,
                        "definition": "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier",
                        "designator": "REF02"
                      },
                      {
                        "nodeKey": "element:REF03:250:252",
                        "type": "Data Element",
                        "value": "Ad",
                        "id": "352",
                        "desc": "Description",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 80,
                        "definition": "A free-form description to clarify the related data elements and their content",
                        "designator": "REF03"
                      }
                    ],
                    "desc": "Reference Identification",
                    "purpose": "To specify identifying information"
                  },
                  {
                    "nodeKey": "loop:SACLoop1:256:291",
                    "id": "SACLoop1",
                    "elements": [],
                    "desc": "Service, Promotion, Allowance, or Charge Information",
                    "purpose": "To request or identify a service, promotion, allowance, or charge; to specify the amount or percentage for the service, promotion, allowance, or charge",
                    "Loop": [
                      {
                        "nodeKey": "segment:SAC:256:270",
                        "id": "SAC",
                        "segmentStr": "SAC*A***100.00~",
                        "elements": [
                          {
                            "nodeKey": "element:SAC01:259:260",
                            "type": "Data Element",
                            "value": "A",
                            "id": "248",
                            "desc": "Allowance or Charge Indicator",
                            "required": true,
                            "codeValue": "",
                            "definition": "Code which indicates an allowance or charge for the service specified",
                            "designator": "SAC01"
                          },
                          {
                            "nodeKey": "element:SAC02:261:261",
                            "type": "Data Element",
                            "value": "",
                            "id": "1300",
                            "desc": "Service, Promotion, Allowance, or Charge Code",
                            "required": false,
                            "definition": "Code identifying the service, promotion, allowance, or charge",
                            "designator": "SAC02"
                          },
                          {
                            "nodeKey": "element:SAC03:262:262",
                            "type": "Data Element",
                            "value": "",
                            "id": "559",
                            "desc": "Agency Qualifier Code",
                            "required": false,
                            "definition": "Code identifying the agency assigning the code values",
                            "designator": "SAC03"
                          },
                          {
                            "nodeKey": "element:SAC04:263:269",
                            "type": "Data Element",
                            "value": "100.00",
                            "id": "1301",
                            "desc": "Agency Service, Promotion, Allowance, or Charge Code",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 10,
                            "definition": "Agency maintained code identifying the service, promotion, allowance, or charge",
                            "designator": "SAC04"
                          }
                        ],
                        "desc": "Service, Promotion, Allowance, or Charge Information",
                        "purpose": "To request or identify a service, promotion, allowance, or charge; to specify the amount or percentage for the service, promotion, allowance, or charge"
                      },
                      {
                        "nodeKey": "segment:CUR:273:291",
                        "id": "CUR",
                        "segmentStr": "CUR*LZ*USD**VN*USD~",
                        "elements": [
                          {
                            "nodeKey": "element:CUR01:276:278",
                            "type": "Data Element",
                            "value": "LZ",
                            "id": "98",
                            "desc": "Entity Identifier Code",
                            "required": true,
                            "codeValue": "Local Chain",
                            "definition": "Code identifying an organizational entity, a physical location, property or an individual",
                            "designator": "CUR01"
                          },
                          {
                            "nodeKey": "element:CUR02:279:282",
                            "type": "Data Element",
                            "value": "USD",
                            "id": "100",
                            "desc": "Currency Code",
                            "dataType": "ID",
                            "required": true,
                            "minLength": 3,
                            "maxLength": 3,
                            "definition": "Code (Standard ISO) for country in whose currency the charges are specified",
                            "designator": "CUR02"
                          },
                          {
                            "nodeKey": "element:CUR03:283:283",
                            "type": "Data Element",
                            "value": "",
                            "id": "280",
                            "desc": "Exchange Rate",
                            "dataType": "R",
                            "required": false,
                            "minLength": 4,
                            "maxLength": 10,
                            "definition": "Value to be used as a multiplier conversion factor to convert monetary value from one currency to another",
                            "designator": "CUR03"
                          },
                          {
                            "nodeKey": "element:CUR04:284:286",
                            "type": "Data Element",
                            "value": "VN",
                            "id": "98",
                            "desc": "Entity Identifier Code",
                            "required": false,
                            "codeValue": "Vendor",
                            "definition": "Code identifying an organizational entity, a physical location, property or an individual",
                            "designator": "CUR04"
                          },
                          {
                            "nodeKey": "element:CUR05:287:290",
                            "type": "Data Element",
                            "value": "USD",
                            "id": "100",
                            "desc": "Currency Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 3,
                            "maxLength": 3,
                            "definition": "Code (Standard ISO) for country in whose currency the charges are specified",
                            "designator": "CUR05"
                          }
                        ],
                        "desc": "Currency",
                        "purpose": "To specify the currency (dollars, pounds, francs, etc.) used in a transaction"
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:N1Loop1:294:438",
                    "id": "N1Loop1",
                    "elements": [],
                    "desc": "Name",
                    "purpose": "To identify a party by type of organization, name, and code",
                    "Loop": [
                      {
                        "nodeKey": "segment:N1:294:328",
                        "id": "N1",
                        "segmentStr": "N1*BT*Example.com Accounts Payable~",
                        "elements": [
                          {
                            "nodeKey": "element:N101:296:298",
                            "type": "Data Element",
                            "value": "BT",
                            "id": "98",
                            "desc": "Entity Identifier Code",
                            "required": true,
                            "codeValue": "Bill-to-Party",
                            "definition": "Code identifying an organizational entity, a physical location, property or an individual",
                            "designator": "N101"
                          },
                          {
                            "nodeKey": "element:N102:299:327",
                            "type": "Data Element",
                            "value": "Example.com Accounts Payable",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name",
                            "designator": "N102"
                          }
                        ],
                        "desc": "Name",
                        "purpose": "To identify a party by type of organization, name, and code"
                      },
                      {
                        "nodeKey": "segment:N2:331:338",
                        "id": "N2",
                        "segmentStr": "N2*asde~",
                        "elements": [
                          {
                            "nodeKey": "element:N201:333:337",
                            "type": "Data Element",
                            "value": "asde",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name",
                            "designator": "N201"
                          }
                        ],
                        "desc": "Additional Name Information",
                        "purpose": "To specify additional names or those longer than 35 characters in length"
                      },
                      {
                        "nodeKey": "segment:N3:341:364",
                        "id": "N3",
                        "segmentStr": "N3*TNC 3110*PO Box 1296~",
                        "elements": [
                          {
                            "nodeKey": "element:N301:343:351",
                            "type": "Data Element",
                            "value": "TNC 3110",
                            "id": "166",
                            "desc": "Address Information",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 55,
                            "definition": "Address information",
                            "designator": "N301"
                          },
                          {
                            "nodeKey": "element:N302:352:363",
                            "type": "Data Element",
                            "value": "PO Box 1296",
                            "id": "166",
                            "desc": "Address Information",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 55,
                            "definition": "Address information",
                            "designator": "N302"
                          }
                        ],
                        "desc": "Address Information",
                        "purpose": "To specify the location of the named party"
                      },
                      {
                        "nodeKey": "segment:N4:367:393",
                        "id": "N4",
                        "segmentStr": "N4*Minneapolis*MN*55440*US~",
                        "elements": [
                          {
                            "nodeKey": "element:N401:369:380",
                            "type": "Data Element",
                            "value": "Minneapolis",
                            "id": "19",
                            "desc": "City Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 30,
                            "definition": "Free-form text for city name",
                            "designator": "N401"
                          },
                          {
                            "nodeKey": "element:N402:381:383",
                            "type": "Data Element",
                            "value": "MN",
                            "id": "156",
                            "desc": "State or Province Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 2,
                            "definition": "Code (Standard State/Province) as defined by appropriate government agency",
                            "designator": "N402"
                          },
                          {
                            "nodeKey": "element:N403:384:389",
                            "type": "Data Element",
                            "value": "55440",
                            "id": "116",
                            "desc": "Postal Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 3,
                            "maxLength": 15,
                            "definition": "Code defining international postal zone code excluding punctuation and blanks (zip code for United States)",
                            "designator": "N403"
                          },
                          {
                            "nodeKey": "element:N404:390:392",
                            "type": "Data Element",
                            "value": "US",
                            "id": "26",
                            "desc": "Country Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 3,
                            "definition": "Code identifying the country",
                            "designator": "N404"
                          }
                        ],
                        "desc": "Geographic Location",
                        "purpose": "To specify the geographic place of the named party"
                      },
                      {
                        "nodeKey": "segment:PER:396:438",
                        "id": "PER",
                        "segmentStr": "PER*CN*EDI*EM*test@ABC.COM*TE*111-222-3333~",
                        "elements": [
                          {
                            "nodeKey": "element:PER01:399:401",
                            "type": "Data Element",
                            "value": "CN",
                            "id": "366",
                            "desc": "Contact Function Code",
                            "required": true,
                            "codeValue": "General Contact",
                            "definition": "Code identifying the major duty or responsibility of the person or group named",
                            "designator": "PER01"
                          },
                          {
                            "nodeKey": "element:PER02:402:405",
                            "type": "Data Element",
                            "value": "EDI",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name",
                            "designator": "PER02"
                          },
                          {
                            "nodeKey": "element:PER03:406:408",
                            "type": "Data Element",
                            "value": "EM",
                            "id": "365",
                            "desc": "Communication Number Qualifier",
                            "required": false,
                            "codeValue": "Electronic Mail",
                            "definition": "Code identifying the type of communication number",
                            "designator": "PER03"
                          },
                          {
                            "nodeKey": "element:PER04:409:421",
                            "type": "Data Element",
                            "value": "test@ABC.COM",
                            "id": "364",
                            "desc": "Communication Number",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 80,
                            "definition": "Complete communications number including country or area code when applicable",
                            "designator": "PER04"
                          },
                          {
                            "nodeKey": "element:PER05:422:424",
                            "type": "Data Element",
                            "value": "TE",
                            "id": "365",
                            "desc": "Communication Number Qualifier",
                            "required": false,
                            "codeValue": "Telephone",
                            "definition": "Code identifying the type of communication number",
                            "designator": "PER05"
                          },
                          {
                            "nodeKey": "element:PER06:425:437",
                            "type": "Data Element",
                            "value": "111-222-3333",
                            "id": "364",
                            "desc": "Communication Number",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 80,
                            "definition": "Complete communications number including country or area code when applicable",
                            "designator": "PER06"
                          }
                        ],
                        "desc": "Administrative Communications Contact",
                        "purpose": "To identify a person or office to whom administrative communications should be directed"
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:N1Loop1:441:571",
                    "id": "N1Loop1",
                    "elements": [],
                    "desc": "Name",
                    "purpose": "To identify a party by type of organization, name, and code",
                    "Loop": [
                      {
                        "nodeKey": "segment:N1:441:459",
                        "id": "N1",
                        "segmentStr": "N1*SO*EDI Helpdesk~",
                        "elements": [
                          {
                            "nodeKey": "element:N101:443:445",
                            "type": "Data Element",
                            "value": "SO",
                            "id": "98",
                            "desc": "Entity Identifier Code",
                            "required": true,
                            "codeValue": "Sold To If Different From Bill To",
                            "definition": "Code identifying an organizational entity, a physical location, property or an individual",
                            "designator": "N101"
                          },
                          {
                            "nodeKey": "element:N102:446:458",
                            "type": "Data Element",
                            "value": "EDI Helpdesk",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name",
                            "designator": "N102"
                          }
                        ],
                        "desc": "Name",
                        "purpose": "To identify a party by type of organization, name, and code"
                      },
                      {
                        "nodeKey": "segment:N2:462:469",
                        "id": "N2",
                        "segmentStr": "N2*Mike~",
                        "elements": [
                          {
                            "nodeKey": "element:N201:464:468",
                            "type": "Data Element",
                            "value": "Mike",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name",
                            "designator": "N201"
                          }
                        ],
                        "desc": "Additional Name Information",
                        "purpose": "To specify additional names or those longer than 35 characters in length"
                      },
                      {
                        "nodeKey": "segment:N3:472:495",
                        "id": "N3",
                        "segmentStr": "N3*7000 Example Parkway~",
                        "elements": [
                          {
                            "nodeKey": "element:N301:474:494",
                            "type": "Data Element",
                            "value": "7000 Example Parkway",
                            "id": "166",
                            "desc": "Address Information",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 55,
                            "definition": "Address information",
                            "designator": "N301"
                          }
                        ],
                        "desc": "Address Information",
                        "purpose": "To specify the location of the named party"
                      },
                      {
                        "nodeKey": "segment:N4:498:526",
                        "id": "N4",
                        "segmentStr": "N4*Brooklyn Park*MN*55445*US~",
                        "elements": [
                          {
                            "nodeKey": "element:N401:500:513",
                            "type": "Data Element",
                            "value": "Brooklyn Park",
                            "id": "19",
                            "desc": "City Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 30,
                            "definition": "Free-form text for city name",
                            "designator": "N401"
                          },
                          {
                            "nodeKey": "element:N402:514:516",
                            "type": "Data Element",
                            "value": "MN",
                            "id": "156",
                            "desc": "State or Province Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 2,
                            "definition": "Code (Standard State/Province) as defined by appropriate government agency",
                            "designator": "N402"
                          },
                          {
                            "nodeKey": "element:N403:517:522",
                            "type": "Data Element",
                            "value": "55445",
                            "id": "116",
                            "desc": "Postal Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 3,
                            "maxLength": 15,
                            "definition": "Code defining international postal zone code excluding punctuation and blanks (zip code for United States)",
                            "designator": "N403"
                          },
                          {
                            "nodeKey": "element:N404:523:525",
                            "type": "Data Element",
                            "value": "US",
                            "id": "26",
                            "desc": "Country Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 3,
                            "definition": "Code identifying the country",
                            "designator": "N404"
                          }
                        ],
                        "desc": "Geographic Location",
                        "purpose": "To specify the geographic place of the named party"
                      },
                      {
                        "nodeKey": "segment:PER:529:571",
                        "id": "PER",
                        "segmentStr": "PER*CN*EDI*EM*test@ABC.COM*TE*111-222-4444~",
                        "elements": [
                          {
                            "nodeKey": "element:PER01:532:534",
                            "type": "Data Element",
                            "value": "CN",
                            "id": "366",
                            "desc": "Contact Function Code",
                            "required": true,
                            "codeValue": "General Contact",
                            "definition": "Code identifying the major duty or responsibility of the person or group named",
                            "designator": "PER01"
                          },
                          {
                            "nodeKey": "element:PER02:535:538",
                            "type": "Data Element",
                            "value": "EDI",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name",
                            "designator": "PER02"
                          },
                          {
                            "nodeKey": "element:PER03:539:541",
                            "type": "Data Element",
                            "value": "EM",
                            "id": "365",
                            "desc": "Communication Number Qualifier",
                            "required": false,
                            "codeValue": "Electronic Mail",
                            "definition": "Code identifying the type of communication number",
                            "designator": "PER03"
                          },
                          {
                            "nodeKey": "element:PER04:542:554",
                            "type": "Data Element",
                            "value": "test@ABC.COM",
                            "id": "364",
                            "desc": "Communication Number",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 80,
                            "definition": "Complete communications number including country or area code when applicable",
                            "designator": "PER04"
                          },
                          {
                            "nodeKey": "element:PER05:555:557",
                            "type": "Data Element",
                            "value": "TE",
                            "id": "365",
                            "desc": "Communication Number Qualifier",
                            "required": false,
                            "codeValue": "Telephone",
                            "definition": "Code identifying the type of communication number",
                            "designator": "PER05"
                          },
                          {
                            "nodeKey": "element:PER06:558:570",
                            "type": "Data Element",
                            "value": "111-222-4444",
                            "id": "364",
                            "desc": "Communication Number",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 80,
                            "definition": "Complete communications number including country or area code when applicable",
                            "designator": "PER06"
                          }
                        ],
                        "desc": "Administrative Communications Contact",
                        "purpose": "To identify a person or office to whom administrative communications should be directed"
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:PO1Loop1:574:1044",
                    "id": "PO1Loop1",
                    "elements": [],
                    "desc": "Baseline Item Data",
                    "purpose": "To specify basic and most frequently used line item data",
                    "Loop": [
                      {
                        "nodeKey": "segment:PO1:574:659",
                        "id": "PO1",
                        "segmentStr": "PO1*1*3*EA*12.3*PE*IN*15013163*SK*7680-02009152*UP*846186077111*CB*790-01-20*EN*12345~",
                        "elements": [
                          {
                            "nodeKey": "element:PO101:577:578",
                            "type": "Data Element",
                            "value": "1",
                            "id": "350",
                            "desc": "Assigned Identification",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 20,
                            "definition": "Alphanumeric characters assigned for differentiation within a transaction set",
                            "designator": "PO101"
                          },
                          {
                            "nodeKey": "element:PO102:579:580",
                            "type": "Data Element",
                            "value": "3",
                            "id": "330",
                            "desc": "Quantity Ordered",
                            "dataType": "R",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 15,
                            "definition": "Quantity ordered",
                            "designator": "PO102"
                          },
                          {
                            "nodeKey": "element:PO103:581:583",
                            "type": "Data Element",
                            "value": "EA",
                            "id": "355",
                            "desc": "Unit or Basis for Measurement Code",
                            "required": false,
                            "codeValue": "Each",
                            "definition": "Code specifying the units in which a value is being expressed, or manner in which a measurement has been taken",
                            "designator": "PO103"
                          },
                          {
                            "nodeKey": "element:PO104:584:588",
                            "type": "Data Element",
                            "value": "12.3",
                            "id": "212",
                            "desc": "Unit Price",
                            "dataType": "R",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 17,
                            "definition": "Price per unit of product, service, commodity, etc.",
                            "designator": "PO104"
                          },
                          {
                            "nodeKey": "element:PO105:589:591",
                            "type": "Data Element",
                            "value": "PE",
                            "id": "639",
                            "desc": "Basis of Unit Price Code",
                            "required": false,
                            "codeValue": "Price per Each",
                            "definition": "Code identifying the type of unit price for an item",
                            "designator": "PO105"
                          },
                          {
                            "nodeKey": "element:PO106:592:594",
                            "type": "Data Element",
                            "value": "IN",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "Buyer's Item Number",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)",
                            "designator": "PO106"
                          },
                          {
                            "nodeKey": "element:PO107:595:603",
                            "type": "Data Element",
                            "value": "15013163",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service",
                            "designator": "PO107"
                          },
                          {
                            "nodeKey": "element:PO108:604:606",
                            "type": "Data Element",
                            "value": "SK",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "Stock Keeping Unit (SKU)",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)",
                            "designator": "PO108"
                          },
                          {
                            "nodeKey": "element:PO109:607:620",
                            "type": "Data Element",
                            "value": "7680-02009152",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service",
                            "designator": "PO109"
                          },
                          {
                            "nodeKey": "element:PO110:621:623",
                            "type": "Data Element",
                            "value": "UP",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "GTIN-12",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)",
                            "designator": "PO110"
                          },
                          {
                            "nodeKey": "element:PO111:624:636",
                            "type": "Data Element",
                            "value": "846186077111",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service",
                            "designator": "PO111"
                          },
                          {
                            "nodeKey": "element:PO112:637:639",
                            "type": "Data Element",
                            "value": "CB",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "Buyer's Catalog Number",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)",
                            "designator": "PO112"
                          },
                          {
                            "nodeKey": "element:PO113:640:649",
                            "type": "Data Element",
                            "value": "790-01-20",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service",
                            "designator": "PO113"
                          },
                          {
                            "nodeKey": "element:PO114:650:652",
                            "type": "Data Element",
                            "value": "EN",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "GTIN-13",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)",
                            "designator": "PO114"
                          },
                          {
                            "nodeKey": "element:PO115:653:658",
                            "type": "Data Element",
                            "value": "12345",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service",
                            "designator": "PO115"
                          }
                        ],
                        "desc": "Baseline Item Data",
                        "purpose": "To specify basic and most frequently used line item data"
                      },
                      {
                        "nodeKey": "loop:PIDLoop1:662:698",
                        "id": "PIDLoop1",
                        "elements": [],
                        "desc": "Product/Item Description",
                        "purpose": "To describe a product or process in coded or free-form format",
                        "Loop": [
                          {
                            "nodeKey": "segment:PID:662:698",
                            "id": "PID",
                            "segmentStr": "PID*F*08***WR CARGO SHO 38 BLK SOLID~",
                            "elements": [
                              {
                                "nodeKey": "element:PID01:665:666",
                                "type": "Data Element",
                                "value": "F",
                                "id": "349",
                                "desc": "Item Description Type",
                                "required": true,
                                "codeValue": "",
                                "definition": "Code indicating the format of a description",
                                "designator": "PID01"
                              },
                              {
                                "nodeKey": "element:PID02:667:669",
                                "type": "Data Element",
                                "value": "08",
                                "id": "750",
                                "desc": "Product/Process Characteristic Code",
                                "required": false,
                                "codeValue": "Product",
                                "definition": "Code identifying the general class of a product or process characteristic",
                                "designator": "PID02"
                              },
                              {
                                "nodeKey": "element:PID03:670:670",
                                "type": "Data Element",
                                "value": "",
                                "id": "559",
                                "desc": "Agency Qualifier Code",
                                "required": false,
                                "definition": "Code identifying the agency assigning the code values",
                                "designator": "PID03"
                              },
                              {
                                "nodeKey": "element:PID04:671:671",
                                "type": "Data Element",
                                "value": "",
                                "id": "751",
                                "desc": "Product Description Code",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 12,
                                "definition": "A code from an industry code list which provides specific data about a product characteristic",
                                "designator": "PID04"
                              },
                              {
                                "nodeKey": "element:PID05:672:697",
                                "type": "Data Element",
                                "value": "WR CARGO SHO 38 BLK SOLID",
                                "id": "352",
                                "desc": "Description",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 80,
                                "definition": "A free-form description to clarify the related data elements and their content",
                                "designator": "PID05"
                              }
                            ],
                            "desc": "Product/Item Description",
                            "purpose": "To describe a product or process in coded or free-form format"
                          }
                        ]
                      },
                      {
                        "nodeKey": "segment:MSG:701:721",
                        "id": "MSG",
                        "segmentStr": "MSG*Mail In or Store~",
                        "elements": [
                          {
                            "nodeKey": "element:MSG01:704:720",
                            "type": "Data Element",
                            "value": "Mail In or Store",
                            "id": "933",
                            "desc": "Free-Form Message Text",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 264,
                            "definition": "Free-form message text",
                            "designator": "MSG01"
                          }
                        ],
                        "desc": "Message Text",
                        "purpose": "To provide a free-form format that allows the transmission of text information"
                      },
                      {
                        "nodeKey": "loop:PKGLoop1:724:743",
                        "id": "PKGLoop1",
                        "elements": [],
                        "desc": "Marking, Packaging, Loading",
                        "purpose": "To describe marking, packaging, loading, and unloading requirements",
                        "Loop": [
                          {
                            "nodeKey": "segment:PKG:724:743",
                            "id": "PKG",
                            "segmentStr": "PKG*F*WM***GIFTWRAP~",
                            "elements": [
                              {
                                "nodeKey": "element:PKG01:727:728",
                                "type": "Data Element",
                                "value": "F",
                                "id": "349",
                                "desc": "Item Description Type",
                                "required": false,
                                "codeValue": "",
                                "definition": "Code indicating the format of a description",
                                "designator": "PKG01"
                              },
                              {
                                "nodeKey": "element:PKG02:729:731",
                                "type": "Data Element",
                                "value": "WM",
                                "id": "753",
                                "desc": "Packaging Characteristic Code",
                                "required": false,
                                "codeValue": "Wrapping Material",
                                "definition": "Code specifying the marking, packaging, loading and related characteristics being described",
                                "designator": "PKG02"
                              },
                              {
                                "nodeKey": "element:PKG03:732:732",
                                "type": "Data Element",
                                "value": "",
                                "id": "559",
                                "desc": "Agency Qualifier Code",
                                "required": false,
                                "definition": "Code identifying the agency assigning the code values",
                                "designator": "PKG03"
                              },
                              {
                                "nodeKey": "element:PKG04:733:733",
                                "type": "Data Element",
                                "value": "",
                                "id": "754",
                                "desc": "Packaging Description Code",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 7,
                                "definition": "A code from an industry code list which provides specific data about the marking, packaging or loading and unloading of a product",
                                "designator": "PKG04"
                              },
                              {
                                "nodeKey": "element:PKG05:734:742",
                                "type": "Data Element",
                                "value": "GIFTWRAP",
                                "id": "352",
                                "desc": "Description",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 80,
                                "definition": "A free-form description to clarify the related data elements and their content",
                                "designator": "PKG05"
                              }
                            ],
                            "desc": "Marking, Packaging, Loading",
                            "purpose": "To describe marking, packaging, loading, and unloading requirements"
                          }
                        ]
                      },
                      {
                        "nodeKey": "loop:N9Loop2:746:804",
                        "id": "N9Loop2",
                        "elements": [],
                        "desc": "Reference Identification",
                        "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                        "Loop": [
                          {
                            "nodeKey": "segment:N9:746:804",
                            "id": "N9",
                            "segmentStr": "N9*L1*MESSAGE*This item must be returned within 90 days of~",
                            "elements": [
                              {
                                "nodeKey": "element:N901:748:750",
                                "type": "Data Element",
                                "value": "L1",
                                "id": "128",
                                "desc": "Reference Identification Qualifier",
                                "required": true,
                                "codeValue": "Letters or Notes",
                                "definition": "Code qualifying the Reference Identification",
                                "designator": "N901"
                              },
                              {
                                "nodeKey": "element:N902:751:758",
                                "type": "Data Element",
                                "value": "MESSAGE",
                                "id": "127",
                                "desc": "Reference Identification",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 30,
                                "definition": "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier",
                                "designator": "N902"
                              },
                              {
                                "nodeKey": "element:N903:759:803",
                                "type": "Data Element",
                                "value": "This item must be returned within 90 days of",
                                "id": "369",
                                "desc": "Free-form Description",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 45,
                                "definition": "Free-form descriptive text",
                                "designator": "N903"
                              }
                            ],
                            "desc": "Reference Identification",
                            "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier"
                          }
                        ]
                      },
                      {
                        "nodeKey": "loop:N9Loop2:807:836",
                        "id": "N9Loop2",
                        "elements": [],
                        "desc": "Reference Identification",
                        "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                        "Loop": [
                          {
                            "nodeKey": "segment:N9:807:836",
                            "id": "N9",
                            "segmentStr": "N9*L1*MESSAGE* the ship date.~",
                            "elements": [
                              {
                                "nodeKey": "element:N901:809:811",
                                "type": "Data Element",
                                "value": "L1",
                                "id": "128",
                                "desc": "Reference Identification Qualifier",
                                "required": true,
                                "codeValue": "Letters or Notes",
                                "definition": "Code qualifying the Reference Identification",
                                "designator": "N901"
                              },
                              {
                                "nodeKey": "element:N902:812:819",
                                "type": "Data Element",
                                "value": "MESSAGE",
                                "id": "127",
                                "desc": "Reference Identification",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 30,
                                "definition": "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier",
                                "designator": "N902"
                              },
                              {
                                "nodeKey": "element:N903:820:835",
                                "type": "Data Element",
                                "value": " the ship date.",
                                "id": "369",
                                "desc": "Free-form Description",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 45,
                                "definition": "Free-form descriptive text",
                                "designator": "N903"
                              }
                            ],
                            "desc": "Reference Identification",
                            "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier"
                          }
                        ]
                      },
                      {
                        "nodeKey": "loop:N1Loop3:839:880",
                        "id": "N1Loop3",
                        "elements": [],
                        "desc": "Name",
                        "purpose": "To identify a party by type of organization, name, and code",
                        "Loop": [
                          {
                            "nodeKey": "segment:N1:839:852",
                            "id": "N1",
                            "segmentStr": "N1*ST*Company~",
                            "elements": [
                              {
                                "nodeKey": "element:N101:841:843",
                                "type": "Data Element",
                                "value": "ST",
                                "id": "98",
                                "desc": "Entity Identifier Code",
                                "required": true,
                                "codeValue": "Ship To",
                                "definition": "Code identifying an organizational entity, a physical location, property or an individual",
                                "designator": "N101"
                              },
                              {
                                "nodeKey": "element:N102:844:851",
                                "type": "Data Element",
                                "value": "Company",
                                "id": "93",
                                "desc": "Name",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 60,
                                "definition": "Free-form name",
                                "designator": "N102"
                              }
                            ],
                            "desc": "Name",
                            "purpose": "To identify a party by type of organization, name, and code"
                          },
                          {
                            "nodeKey": "loop:LDTLoop2:855:880",
                            "id": "LDTLoop2",
                            "elements": [],
                            "desc": "Lead Time",
                            "purpose": "To specify lead time for availability of products and services",
                            "Loop": [
                              {
                                "nodeKey": "segment:LDT:855:867",
                                "id": "LDT",
                                "segmentStr": "LDT*AA*10*AA~",
                                "elements": [
                                  {
                                    "nodeKey": "element:LDT01:858:860",
                                    "type": "Data Element",
                                    "value": "AA",
                                    "id": "345",
                                    "desc": "Lead Time Code",
                                    "required": true,
                                    "codeValue": "From date of PO receipt to sample ready",
                                    "definition": "Code indicating the time range",
                                    "designator": "LDT01"
                                  },
                                  {
                                    "nodeKey": "element:LDT02:861:863",
                                    "type": "Data Element",
                                    "value": "10",
                                    "id": "380",
                                    "desc": "Quantity",
                                    "dataType": "R",
                                    "required": true,
                                    "minLength": 1,
                                    "maxLength": 15,
                                    "definition": "Numeric value of quantity",
                                    "designator": "LDT02"
                                  },
                                  {
                                    "nodeKey": "element:LDT03:864:866",
                                    "type": "Data Element",
                                    "value": "AA",
                                    "id": "344",
                                    "desc": "Unit of Time Period or Interval",
                                    "required": true,
                                    "codeValue": "",
                                    "definition": "Code indicating the time period or interval",
                                    "designator": "LDT03"
                                  }
                                ],
                                "desc": "Lead Time",
                                "purpose": "To specify lead time for availability of products and services"
                              },
                              {
                                "nodeKey": "segment:QTY:870:880",
                                "id": "QTY",
                                "segmentStr": "QTY*10*100~",
                                "elements": [
                                  {
                                    "nodeKey": "element:QTY01:873:875",
                                    "type": "Data Element",
                                    "value": "10",
                                    "id": "673",
                                    "desc": "Quantity Qualifier",
                                    "required": true,
                                    "codeValue": "Cumulative Quantity - Rejected Material:Disposition Pending",
                                    "definition": "Code specifying the type of quantity",
                                    "designator": "QTY01"
                                  },
                                  {
                                    "nodeKey": "element:QTY02:876:879",
                                    "type": "Data Element",
                                    "value": "100",
                                    "id": "380",
                                    "desc": "Quantity",
                                    "dataType": "R",
                                    "required": false,
                                    "minLength": 1,
                                    "maxLength": 15,
                                    "definition": "Numeric value of quantity",
                                    "designator": "QTY02"
                                  }
                                ],
                                "desc": "Quantity",
                                "purpose": "To specify quantity information"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "nodeKey": "loop:SLNLoop1:883:1044",
                        "id": "SLNLoop1",
                        "elements": [],
                        "desc": "Subline Item Detail",
                        "purpose": "To specify product subline detail item data",
                        "Loop": [
                          {
                            "nodeKey": "segment:SLN:883:966",
                            "id": "SLN",
                            "segmentStr": "SLN*1**I*1*EA*3.55***IN*2456987*SK*123456*UP*105647894512*CB*123-12-1239*UA*3456787~",
                            "elements": [
                              {
                                "nodeKey": "element:SLN01:886:887",
                                "type": "Data Element",
                                "value": "1",
                                "id": "350",
                                "desc": "Assigned Identification",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 1,
                                "maxLength": 20,
                                "definition": "Alphanumeric characters assigned for differentiation within a transaction set",
                                "designator": "SLN01"
                              },
                              {
                                "nodeKey": "element:SLN02:888:888",
                                "type": "Data Element",
                                "value": "",
                                "id": "350",
                                "desc": "Assigned Identification",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 20,
                                "definition": "Alphanumeric characters assigned for differentiation within a transaction set",
                                "designator": "SLN02"
                              },
                              {
                                "nodeKey": "element:SLN03:889:890",
                                "type": "Data Element",
                                "value": "I",
                                "id": "662",
                                "desc": "Relationship Code",
                                "required": true,
                                "codeValue": "Included",
                                "definition": "Code indicating the relationship between entities",
                                "designator": "SLN03"
                              },
                              {
                                "nodeKey": "element:SLN04:891:892",
                                "type": "Data Element",
                                "value": "1",
                                "id": "380",
                                "desc": "Quantity",
                                "dataType": "R",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 15,
                                "definition": "Numeric value of quantity",
                                "designator": "SLN04"
                              },
                              {
                                "nodeKey": "element:SLN05:893:895",
                                "type": "Data Element",
                                "value": "EA",
                                "components": [
                                  {
                                    "nodeKey": "element:SLN0501:893:895",
                                    "type": "Component Element",
                                    "value": "EA",
                                    "id": "355",
                                    "desc": "Unit or Basis for Measurement Code",
                                    "required": true,
                                    "codeValue": "Each",
                                    "definition": "Code specifying the units in which a value is being expressed, or manner in which a measurement has been taken",
                                    "designator": "SLN0501"
                                  }
                                ],
                                "id": "C001",
                                "desc": "Composite Unit of Measure",
                                "required": false,
                                "definition": "To identify a composite unit of measure\n\n(See Figures Appendix for examples of use)",
                                "designator": "SLN05"
                              },
                              {
                                "nodeKey": "element:SLN06:896:900",
                                "type": "Data Element",
                                "value": "3.55",
                                "id": "212",
                                "desc": "Unit Price",
                                "dataType": "R",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 17,
                                "definition": "Price per unit of product, service, commodity, etc.",
                                "designator": "SLN06"
                              },
                              {
                                "nodeKey": "element:SLN07:901:901",
                                "type": "Data Element",
                                "value": "",
                                "id": "639",
                                "desc": "Basis of Unit Price Code",
                                "required": false,
                                "definition": "Code identifying the type of unit price for an item",
                                "designator": "SLN07"
                              },
                              {
                                "nodeKey": "element:SLN08:902:902",
                                "type": "Data Element",
                                "value": "",
                                "id": "662",
                                "desc": "Relationship Code",
                                "required": false,
                                "definition": "Code indicating the relationship between entities",
                                "designator": "SLN08"
                              },
                              {
                                "nodeKey": "element:SLN09:903:905",
                                "type": "Data Element",
                                "value": "IN",
                                "id": "235",
                                "desc": "Product/Service ID Qualifier",
                                "required": false,
                                "codeValue": "Buyer's Item Number",
                                "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)",
                                "designator": "SLN09"
                              },
                              {
                                "nodeKey": "element:SLN10:906:913",
                                "type": "Data Element",
                                "value": "2456987",
                                "id": "234",
                                "desc": "Product/Service ID",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 48,
                                "definition": "Identifying number for a product or service",
                                "designator": "SLN10"
                              },
                              {
                                "nodeKey": "element:SLN11:914:916",
                                "type": "Data Element",
                                "value": "SK",
                                "id": "235",
                                "desc": "Product/Service ID Qualifier",
                                "required": false,
                                "codeValue": "Stock Keeping Unit (SKU)",
                                "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)",
                                "designator": "SLN11"
                              },
                              {
                                "nodeKey": "element:SLN12:917:923",
                                "type": "Data Element",
                                "value": "123456",
                                "id": "234",
                                "desc": "Product/Service ID",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 48,
                                "definition": "Identifying number for a product or service",
                                "designator": "SLN12"
                              },
                              {
                                "nodeKey": "element:SLN13:924:926",
                                "type": "Data Element",
                                "value": "UP",
                                "id": "235",
                                "desc": "Product/Service ID Qualifier",
                                "required": false,
                                "codeValue": "GTIN-12",
                                "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)",
                                "designator": "SLN13"
                              },
                              {
                                "nodeKey": "element:SLN14:927:939",
                                "type": "Data Element",
                                "value": "105647894512",
                                "id": "234",
                                "desc": "Product/Service ID",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 48,
                                "definition": "Identifying number for a product or service",
                                "designator": "SLN14"
                              },
                              {
                                "nodeKey": "element:SLN15:940:942",
                                "type": "Data Element",
                                "value": "CB",
                                "id": "235",
                                "desc": "Product/Service ID Qualifier",
                                "required": false,
                                "codeValue": "Buyer's Catalog Number",
                                "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)",
                                "designator": "SLN15"
                              },
                              {
                                "nodeKey": "element:SLN16:943:954",
                                "type": "Data Element",
                                "value": "123-12-1239",
                                "id": "234",
                                "desc": "Product/Service ID",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 48,
                                "definition": "Identifying number for a product or service",
                                "designator": "SLN16"
                              },
                              {
                                "nodeKey": "element:SLN17:955:957",
                                "type": "Data Element",
                                "value": "UA",
                                "id": "235",
                                "desc": "Product/Service ID Qualifier",
                                "required": false,
                                "codeValue": "",
                                "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)",
                                "designator": "SLN17"
                              },
                              {
                                "nodeKey": "element:SLN18:958:965",
                                "type": "Data Element",
                                "value": "3456787",
                                "id": "234",
                                "desc": "Product/Service ID",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 48,
                                "definition": "Identifying number for a product or service",
                                "designator": "SLN18"
                              }
                            ],
                            "desc": "Subline Item Detail",
                            "purpose": "To specify product subline detail item data"
                          },
                          {
                            "nodeKey": "segment:PID:969:1001",
                            "id": "PID",
                            "segmentStr": "PID*F*08***Component Description~",
                            "elements": [
                              {
                                "nodeKey": "element:PID01:972:973",
                                "type": "Data Element",
                                "value": "F",
                                "id": "349",
                                "desc": "Item Description Type",
                                "required": true,
                                "codeValue": "",
                                "definition": "Code indicating the format of a description",
                                "designator": "PID01"
                              },
                              {
                                "nodeKey": "element:PID02:974:976",
                                "type": "Data Element",
                                "value": "08",
                                "id": "750",
                                "desc": "Product/Process Characteristic Code",
                                "required": false,
                                "codeValue": "Product",
                                "definition": "Code identifying the general class of a product or process characteristic",
                                "designator": "PID02"
                              },
                              {
                                "nodeKey": "element:PID03:977:977",
                                "type": "Data Element",
                                "value": "",
                                "id": "559",
                                "desc": "Agency Qualifier Code",
                                "required": false,
                                "definition": "Code identifying the agency assigning the code values",
                                "designator": "PID03"
                              },
                              {
                                "nodeKey": "element:PID04:978:978",
                                "type": "Data Element",
                                "value": "",
                                "id": "751",
                                "desc": "Product Description Code",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 12,
                                "definition": "A code from an industry code list which provides specific data about a product characteristic",
                                "designator": "PID04"
                              },
                              {
                                "nodeKey": "element:PID05:979:1000",
                                "type": "Data Element",
                                "value": "Component Description",
                                "id": "352",
                                "desc": "Description",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 80,
                                "definition": "A free-form description to clarify the related data elements and their content",
                                "designator": "PID05"
                              }
                            ],
                            "desc": "Product/Item Description",
                            "purpose": "To describe a product or process in coded or free-form format"
                          },
                          {
                            "nodeKey": "loop:N9Loop3:1004:1044",
                            "id": "N9Loop3",
                            "elements": [],
                            "desc": "Reference Identification",
                            "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                            "Loop": [
                              {
                                "nodeKey": "segment:N9:1004:1030",
                                "id": "N9",
                                "segmentStr": "N9*L1*MESSAGE*Subline Item~",
                                "elements": [
                                  {
                                    "nodeKey": "element:N901:1006:1008",
                                    "type": "Data Element",
                                    "value": "L1",
                                    "id": "128",
                                    "desc": "Reference Identification Qualifier",
                                    "required": true,
                                    "codeValue": "Letters or Notes",
                                    "definition": "Code qualifying the Reference Identification",
                                    "designator": "N901"
                                  },
                                  {
                                    "nodeKey": "element:N902:1009:1016",
                                    "type": "Data Element",
                                    "value": "MESSAGE",
                                    "id": "127",
                                    "desc": "Reference Identification",
                                    "dataType": "AN",
                                    "required": false,
                                    "minLength": 1,
                                    "maxLength": 30,
                                    "definition": "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier",
                                    "designator": "N902"
                                  },
                                  {
                                    "nodeKey": "element:N903:1017:1029",
                                    "type": "Data Element",
                                    "value": "Subline Item",
                                    "id": "369",
                                    "desc": "Free-form Description",
                                    "dataType": "AN",
                                    "required": false,
                                    "minLength": 1,
                                    "maxLength": 45,
                                    "definition": "Free-form descriptive text",
                                    "designator": "N903"
                                  }
                                ],
                                "desc": "Reference Identification",
                                "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier"
                              },
                              {
                                "nodeKey": "segment:MSG:1033:1044",
                                "id": "MSG",
                                "segmentStr": "MSG*3 Items~",
                                "elements": [
                                  {
                                    "nodeKey": "element:MSG01:1036:1043",
                                    "type": "Data Element",
                                    "value": "3 Items",
                                    "id": "933",
                                    "desc": "Free-Form Message Text",
                                    "dataType": "AN",
                                    "required": true,
                                    "minLength": 1,
                                    "maxLength": 264,
                                    "definition": "Free-form message text",
                                    "designator": "MSG01"
                                  }
                                ],
                                "desc": "Message Text",
                                "purpose": "To provide a free-form format that allows the transmission of text information"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:PO1Loop1:1047:1072",
                    "id": "PO1Loop1",
                    "elements": [],
                    "desc": "Baseline Item Data",
                    "purpose": "To specify basic and most frequently used line item data",
                    "Loop": [
                      {
                        "nodeKey": "segment:PO1:1047:1072",
                        "id": "PO1",
                        "segmentStr": "PO1*2*3*EA*12.3*PE*IN*123~",
                        "elements": [
                          {
                            "nodeKey": "element:PO101:1050:1051",
                            "type": "Data Element",
                            "value": "2",
                            "id": "350",
                            "desc": "Assigned Identification",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 20,
                            "definition": "Alphanumeric characters assigned for differentiation within a transaction set",
                            "designator": "PO101"
                          },
                          {
                            "nodeKey": "element:PO102:1052:1053",
                            "type": "Data Element",
                            "value": "3",
                            "id": "330",
                            "desc": "Quantity Ordered",
                            "dataType": "R",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 15,
                            "definition": "Quantity ordered",
                            "designator": "PO102"
                          },
                          {
                            "nodeKey": "element:PO103:1054:1056",
                            "type": "Data Element",
                            "value": "EA",
                            "id": "355",
                            "desc": "Unit or Basis for Measurement Code",
                            "required": false,
                            "codeValue": "Each",
                            "definition": "Code specifying the units in which a value is being expressed, or manner in which a measurement has been taken",
                            "designator": "PO103"
                          },
                          {
                            "nodeKey": "element:PO104:1057:1061",
                            "type": "Data Element",
                            "value": "12.3",
                            "id": "212",
                            "desc": "Unit Price",
                            "dataType": "R",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 17,
                            "definition": "Price per unit of product, service, commodity, etc.",
                            "designator": "PO104"
                          },
                          {
                            "nodeKey": "element:PO105:1062:1064",
                            "type": "Data Element",
                            "value": "PE",
                            "id": "639",
                            "desc": "Basis of Unit Price Code",
                            "required": false,
                            "codeValue": "Price per Each",
                            "definition": "Code identifying the type of unit price for an item",
                            "designator": "PO105"
                          },
                          {
                            "nodeKey": "element:PO106:1065:1067",
                            "type": "Data Element",
                            "value": "IN",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "Buyer's Item Number",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)",
                            "designator": "PO106"
                          },
                          {
                            "nodeKey": "element:PO107:1068:1071",
                            "type": "Data Element",
                            "value": "123",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service",
                            "designator": "PO107"
                          }
                        ],
                        "desc": "Baseline Item Data",
                        "purpose": "To specify basic and most frequently used line item data"
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:CTTLoop1:1075:1084",
                    "id": "CTTLoop1",
                    "elements": [],
                    "desc": "Transaction Totals",
                    "purpose": "To transmit a hash total for a specific element in the transaction set",
                    "Loop": [
                      {
                        "nodeKey": "segment:CTT:1075:1084",
                        "id": "CTT",
                        "segmentStr": "CTT*1*200~",
                        "elements": [
                          {
                            "nodeKey": "element:CTT01:1078:1079",
                            "type": "Data Element",
                            "value": "1",
                            "id": "354",
                            "desc": "Number of Line Items",
                            "dataType": "N",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 6,
                            "definition": "Total number of line items in the transaction set",
                            "designator": "CTT01"
                          },
                          {
                            "nodeKey": "element:CTT02:1080:1083",
                            "type": "Data Element",
                            "value": "200",
                            "id": "347",
                            "desc": "Hash Total",
                            "dataType": "R",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 10,
                            "definition": "Sum of values of the specified data element. All values in the data element will be summed without regard to decimal points (explicit or implicit) or signs. Truncation will occur on the left most digits if the sum is greater than the maximum size of the hash total of the data element.\n\nExample:\n-.0018 First occurrence of value being hashed.\n.18 Second occurrence of value being hashed.\n1.8 Third occurrence of value being hashed.\n18.01 Fourth occurrence of value being hashed.\n---------\n1855 Hash total prior to truncation.\n855 Hash total after truncation to three-digit field.",
                            "designator": "CTT02"
                          }
                        ],
                        "desc": "Transaction Totals",
                        "purpose": "To transmit a hash total for a specific element in the transaction set"
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "nodeKey": "segment:ST:158:169",
                  "id": "ST",
                  "segmentStr": "ST*850*0001~",
                  "elements": [
                    {
                      "nodeKey": "element:ST01:160:163",
                      "type": "Data Element",
                      "value": "850",
                      "id": "143",
                      "desc": "Transaction Set Identifier Code",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 3,
                      "maxLength": 3,
                      "codeValue": "Purchase Order",
                      "definition": "Code uniquely identifying a Transaction Set",
                      "designator": "ST01"
                    },
                    {
                      "nodeKey": "element:ST02:164:168",
                      "type": "Data Element",
                      "value": "0001",
                      "id": "329",
                      "desc": "Transaction Set Control Number",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 4,
                      "maxLength": 9,
                      "definition": "Identifying control number that must be unique within the transaction set functional group assigned by the originator for a transaction set",
                      "designator": "ST02"
                    }
                  ],
                  "desc": "Transaction Set Header",
                  "purpose": "To indicate the start of a transaction set and to assign a control number"
                },
                "endSegment": {
                  "nodeKey": "segment:SE:1087:1097",
                  "id": "SE",
                  "segmentStr": "SE*32*0001~",
                  "elements": [
                    {
                      "nodeKey": "element:SE01:1089:1091",
                      "type": "Data Element",
                      "value": "32",
                      "id": "96",
                      "desc": "Number of Included Segments",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 1,
                      "maxLength": 10,
                      "definition": "Total number of segments included in a transaction set including ST and SE segments",
                      "designator": "SE01"
                    },
                    {
                      "nodeKey": "element:SE02:1092:1096",
                      "type": "Data Element",
                      "value": "0001",
                      "id": "329",
                      "desc": "Transaction Set Control Number",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 4,
                      "maxLength": 9,
                      "definition": "Identifying control number that must be unique within the transaction set functional group assigned by the originator for a transaction set",
                      "designator": "SE02"
                    }
                  ],
                  "desc": "Transaction Set Trailer",
                  "purpose": "To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)"
                }
              }
            ],
            "startSegment": {
              "nodeKey": "segment:GS:108:155",
              "id": "GS",
              "segmentStr": "GS*PO*DERICL*TEST01*20210517*0643*7080*X*004010~",
              "elements": [
                {
                  "nodeKey": "element:GS01:110:112",
                  "type": "Data Element",
                  "value": "PO",
                  "id": "479",
                  "desc": "Functional Identifier Code",
                  "required": true,
                  "minLength": 2,
                  "maxLength": 2,
                  "definition": "Code identifying a group of application related transaction sets",
                  "designator": "GS01"
                },
                {
                  "nodeKey": "element:GS02:113:119",
                  "type": "Data Element",
                  "value": "DERICL",
                  "id": "142",
                  "desc": "Application Sender's Code",
                  "required": true,
                  "minLength": 2,
                  "maxLength": 15,
                  "definition": "Code identifying party sending transmission; codes agreed to by trading partners",
                  "designator": "GS02"
                },
                {
                  "nodeKey": "element:GS03:120:126",
                  "type": "Data Element",
                  "value": "TEST01",
                  "id": "124",
                  "desc": "Application Receiver's Code",
                  "required": true,
                  "minLength": 2,
                  "maxLength": 15,
                  "definition": "Code identifying party receiving transmission. Codes agreed to by trading partners",
                  "designator": "GS03"
                },
                {
                  "nodeKey": "element:GS04:127:135",
                  "type": "Data Element",
                  "value": "20210517",
                  "id": "373",
                  "desc": "Date",
                  "required": true,
                  "minLength": 8,
                  "maxLength": 8,
                  "definition": "Date expressed as CCYYMMDD",
                  "designator": "GS04"
                },
                {
                  "nodeKey": "element:GS05:136:140",
                  "type": "Data Element",
                  "value": "0643",
                  "id": "337",
                  "desc": "Time",
                  "required": true,
                  "minLength": 4,
                  "maxLength": 8,
                  "definition": "Time expressed in 24-hour clock time as follows: HHMM, or HHMMSS, or HHMMSSD, or HHMMSSDD, where H = hours (00-23), M = minutes (00-59), S = integer seconds (00-59) and DD = decimal seconds; decimal seconds are expressed as follows: D = tenths (0-9) and DD = hundredths (00-99)",
                  "designator": "GS05"
                },
                {
                  "nodeKey": "element:GS06:141:145",
                  "type": "Data Element",
                  "value": "7080",
                  "id": "28",
                  "desc": "Group Control Number",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 9,
                  "definition": "Assigned number originated and maintained by the sender",
                  "designator": "GS06"
                },
                {
                  "nodeKey": "element:GS07:146:147",
                  "type": "Data Element",
                  "value": "X",
                  "id": "455",
                  "desc": "Responsible Agency Code",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 2,
                  "definition": "Code used in conjunction with Data Element 480 to identify the issuer of the standard",
                  "designator": "GS07"
                },
                {
                  "nodeKey": "element:GS08:148:154",
                  "type": "Data Element",
                  "value": "004010",
                  "id": "480",
                  "desc": "Version / Release / Industry Identifier Code",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 12,
                  "definition": "Code indicating the version, release, subrelease, and industry identifier of the EDI standard being used, including the GS and GE segments; if code in DE455 in GS segment is X, then in DE 480 positions 1-3 are the version number; positions 4-6 are the release and subrelease, level of the version; and positions 7-12 are the industry or trade association identifiers (optionally assigned by user); if code in DE455 in GS segment is T, then other formats are allowed",
                  "designator": "GS08"
                }
              ],
              "desc": "Functional Group Header",
              "purpose": "To indicate the beginning of a functional group and to provide control information"
            },
            "endSegment": {
              "nodeKey": "segment:GE:1100:1109",
              "id": "GE",
              "segmentStr": "GE*1*7080~",
              "elements": [
                {
                  "nodeKey": "element:GE01:1102:1103",
                  "type": "Data Element",
                  "value": "1",
                  "id": "97",
                  "desc": "Number of Transaction Sets Included",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 6,
                  "definition": "Total number of transaction sets included in the functional group or interchange (transmission) group terminated by the trailer containing this data element",
                  "designator": "GE01"
                },
                {
                  "nodeKey": "element:GE02:1104:1108",
                  "type": "Data Element",
                  "value": "7080",
                  "id": "28",
                  "desc": "Group Control Number",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 9,
                  "definition": "Assigned number originated and maintained by the sender",
                  "designator": "GE02"
                }
              ],
              "desc": "Functional Group Trailer",
              "purpose": "To indicate the end of a functional group and to provide control information"
            }
          }
        ],
        "startSegment": {
          "nodeKey": "segment:ISA:0:105",
          "id": "ISA",
          "segmentStr": "ISA*00*          *00*          *ZZ*DERICL         *ZZ*TEST01         *210517*0643*U*00401*000007080*0*P*>~",
          "elements": [
            {
              "nodeKey": "element:ISA01:3:5",
              "type": "Data Element",
              "value": "00",
              "id": "I01",
              "desc": "Authorization Information Qualifier",
              "required": true,
              "minLength": 2,
              "maxLength": 2,
              "definition": "Code to identify the type of information in the Authorization Information",
              "designator": "ISA01"
            },
            {
              "nodeKey": "element:ISA02:6:16",
              "type": "Data Element",
              "value": "          ",
              "id": "I02",
              "desc": "Authorization Information",
              "required": true,
              "minLength": 10,
              "maxLength": 10,
              "definition": "Information used for additional identification or authorization of the interchange sender or the data in the interchange; the type of information is set by the Authorization Information Qualifier (I01)",
              "designator": "ISA02"
            },
            {
              "nodeKey": "element:ISA03:17:19",
              "type": "Data Element",
              "value": "00",
              "id": "I03",
              "desc": "Security Information Qualifier",
              "required": true,
              "minLength": 2,
              "maxLength": 2,
              "definition": "Code to identify the type of information in the Security Information",
              "designator": "ISA03"
            },
            {
              "nodeKey": "element:ISA04:20:30",
              "type": "Data Element",
              "value": "          ",
              "id": "I04",
              "desc": "Security Information",
              "required": true,
              "minLength": 10,
              "maxLength": 10,
              "definition": "This is used for identifying the security information about the interchange sender or the data in the interchange; the type of information is set by the Security Information Qualifier (I03)",
              "designator": "ISA04"
            },
            {
              "nodeKey": "element:ISA05:31:33",
              "type": "Data Element",
              "value": "ZZ",
              "id": "I05",
              "desc": "Interchange ID Qualifier",
              "required": true,
              "minLength": 2,
              "maxLength": 2,
              "definition": "Qualifier to designate the system/method of code structure used to designate the sender or receiver ID element being qualified",
              "designator": "ISA05"
            },
            {
              "nodeKey": "element:ISA06:34:49",
              "type": "Data Element",
              "value": "DERICL         ",
              "id": "I06",
              "desc": "Interchange Sender ID",
              "required": true,
              "minLength": 15,
              "maxLength": 15,
              "definition": "Identification code published by the sender for other parties to use as the receiver ID to route data to them; the sender always codes this value in the sender ID element",
              "designator": "ISA06"
            },
            {
              "nodeKey": "element:ISA07:50:52",
              "type": "Data Element",
              "value": "ZZ",
              "id": "I05",
              "desc": "Interchange ID Qualifier",
              "required": true,
              "minLength": 2,
              "maxLength": 2,
              "definition": "Qualifier to designate the system/method of code structure used to designate the sender or receiver ID element being qualified",
              "designator": "ISA07"
            },
            {
              "nodeKey": "element:ISA08:53:68",
              "type": "Data Element",
              "value": "TEST01         ",
              "id": "I07",
              "desc": "Interchange Receiver ID",
              "required": true,
              "minLength": 15,
              "maxLength": 15,
              "definition": "Identification code published by the receiver of the data; When sending, it is used by the sender as their sending ID, thus other parties sending to them will use this as a receiving ID to route data to them",
              "designator": "ISA08"
            },
            {
              "nodeKey": "element:ISA09:69:75",
              "type": "Data Element",
              "value": "210517",
              "id": "I08",
              "desc": "Interchange Date",
              "required": true,
              "minLength": 6,
              "maxLength": 6,
              "definition": "Date of the interchange",
              "designator": "ISA09"
            },
            {
              "nodeKey": "element:ISA10:76:80",
              "type": "Data Element",
              "value": "0643",
              "id": "I09",
              "desc": "Interchange Time",
              "required": true,
              "minLength": 4,
              "maxLength": 4,
              "definition": "Time of the interchange",
              "designator": "ISA10"
            },
            {
              "nodeKey": "element:ISA11:81:82",
              "type": "Data Element",
              "value": "U",
              "id": "I10",
              "desc": "Interchange Control Standards Identifier",
              "required": true,
              "minLength": 1,
              "maxLength": 1,
              "definition": "Code to identify the agency responsible for the control standard used by the message that is enclosed by the interchange header and trailer",
              "designator": "ISA11"
            },
            {
              "nodeKey": "element:ISA12:83:88",
              "type": "Data Element",
              "value": "00401",
              "id": "I11",
              "desc": "Interchange Control Version Number",
              "required": true,
              "minLength": 5,
              "maxLength": 5,
              "definition": "This version number covers the interchange control segments",
              "designator": "ISA12"
            },
            {
              "nodeKey": "element:ISA13:89:98",
              "type": "Data Element",
              "value": "000007080",
              "id": "I12",
              "desc": "Interchange Control Number",
              "required": true,
              "minLength": 9,
              "maxLength": 9,
              "definition": "A control number assigned by the interchange sender",
              "designator": "ISA13"
            },
            {
              "nodeKey": "element:ISA14:99:100",
              "type": "Data Element",
              "value": "0",
              "id": "I13",
              "desc": "Acknowledgment Requested",
              "required": true,
              "minLength": 1,
              "maxLength": 1,
              "definition": "Code sent by the sender to request an interchange acknowledgment (TA1)",
              "designator": "ISA14"
            },
            {
              "nodeKey": "element:ISA15:101:102",
              "type": "Data Element",
              "value": "P",
              "id": "I14",
              "desc": "Usage Indicator",
              "required": true,
              "minLength": 1,
              "maxLength": 1,
              "definition": "Code to indicate whether data enclosed by this interchange envelope is test, production or information",
              "designator": "ISA15"
            },
            {
              "nodeKey": "element:ISA16:103:104",
              "type": "Data Element",
              "value": ">",
              "id": "I15",
              "desc": "Component Element Separator",
              "required": true,
              "minLength": 1,
              "maxLength": 1,
              "definition": "Type is not applicable; the component element separator is a delimiter and not a data element; this field provides the delimiter used to separate component data elements within a composite data structure; this value must be different than the data element separator and the segment terminator",
              "designator": "ISA16"
            }
          ],
          "desc": "Interchange Control Header",
          "purpose": "To start and identify an interchange of zero or more functional groups and interchange-related control segments"
        },
        "endSegment": {
          "nodeKey": "segment:IEA:1112:1127",
          "id": "IEA",
          "segmentStr": "IEA*1*000007080~",
          "elements": [
            {
              "nodeKey": "element:IEA01:1115:1116",
              "type": "Data Element",
              "value": "1",
              "id": "I16",
              "desc": "Number of Transaction Sets Included",
              "required": true,
              "minLength": 1,
              "maxLength": 5,
              "definition": "A count of the number of functional groups included in an interchange",
              "designator": "IEA01"
            },
            {
              "nodeKey": "element:IEA02:1117:1126",
              "type": "Data Element",
              "value": "000007080",
              "id": "I12",
              "desc": "Group Control Number",
              "required": true,
              "minLength": 9,
              "maxLength": 9,
              "definition": "A control number assigned by the interchange sender",
              "designator": "IEA02"
            }
          ],
          "desc": "Interchange Control Trailer",
          "purpose": "To define the end of an interchange of zero or more functional groups and interchange-related control segments"
        }
      }
    ],
    "ediType": "x12"
  };

  const edifactTestData: IEdiDocument =   {
    "interchanges": [
      {
        "nodeKey": "interchange:5:11:689",
        "meta": {
          "senderID": "<Sender GLN>",
          "senderQualifer": "14",
          "receiverID": "<Receiver GLN>",
          "receiverQualifer": "14",
          "date": "140407",
          "time": "0910",
          "id": "5"
        },
        "id": "5",
        "functionalGroups": [
          {
            "nodeKey": "functional-group:none:93:679",
            "meta": {},
            "transactionSets": [
              {
                "nodeKey": "transaction-set:1:93:679",
                "meta": {
                  "id": "1",
                  "version": "ORDERS",
                  "messageInfo": {
                    "name": "Purchase order",
                    "version": "ORDERS",
                    "introduction": "A message specifying details for goods or services ordered under conditions agreed between the seller and the buyer."
                  },
                  "release": "D96A"
                },
                "id": "1",
                "segments": [
                  {
                    "nodeKey": "segment:BGM:124:142",
                    "id": "BGM",
                    "segmentStr": "BGM+220+1AA1TEST+9'",
                    "elements": [
                      {
                        "nodeKey": "element:BGM01:127:130",
                        "type": "Data Element",
                        "value": "220",
                        "components": [
                          {
                            "nodeKey": "element:BGM0101:127:130",
                            "type": "Component Element",
                            "value": "220",
                            "id": "1001",
                            "desc": "Document/message name, coded",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Order",
                            "definition": "Document/message identifier expressed in code.",
                            "designator": "BGM0101"
                          }
                        ],
                        "id": "C002",
                        "desc": "DOCUMENT/MESSAGE NAME",
                        "required": false,
                        "definition": "Identification of a type of document/message by code or name. Code preferred.",
                        "designator": "BGM01"
                      },
                      {
                        "nodeKey": "element:BGM02:131:139",
                        "type": "Data Element",
                        "value": "1AA1TEST",
                        "id": "1004",
                        "desc": "DOCUMENT/MESSAGE NUMBER",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 0,
                        "maxLength": 35,
                        "definition": "Reference number assigned to the document/message by the issuer.",
                        "designator": "BGM02"
                      },
                      {
                        "nodeKey": "element:BGM03:140:141",
                        "type": "Data Element",
                        "value": "9",
                        "id": "1225",
                        "desc": "MESSAGE FUNCTION, CODED",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 0,
                        "maxLength": 3,
                        "codeValue": "Original",
                        "definition": "Code indicating the function of the message.",
                        "designator": "BGM03"
                      }
                    ],
                    "desc": "BEGINNING OF MESSAGE",
                    "purpose": "To indicate the type and function of a message and to transmit the identifying number."
                  },
                  {
                    "nodeKey": "segment:DTM:145:165",
                    "id": "DTM",
                    "segmentStr": "DTM+137:20140407:102'",
                    "elements": [
                      {
                        "nodeKey": "element:DTM01:148:164",
                        "type": "Data Element",
                        "value": "137:20140407:102",
                        "components": [
                          {
                            "nodeKey": "element:DTM0101:148:151",
                            "type": "Component Element",
                            "value": "137",
                            "id": "2005",
                            "desc": "Date/time/period qualifier",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Document/message date/time",
                            "definition": "Code giving specific meaning to a date, time or period.",
                            "designator": "DTM0101"
                          },
                          {
                            "nodeKey": "element:DTM0102:152:160",
                            "type": "Component Element",
                            "value": "20140407",
                            "id": "2380",
                            "desc": "Date/time/period",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 35,
                            "definition": "The value of a date, a date and time, a time or of a period in a specified representation.",
                            "designator": "DTM0102"
                          },
                          {
                            "nodeKey": "element:DTM0103:161:164",
                            "type": "Component Element",
                            "value": "102",
                            "id": "2379",
                            "desc": "Date/time/period format qualifier",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "CCYYMMDD",
                            "definition": "Specification of the representation of a date, a date and time or of a period.",
                            "designator": "DTM0103"
                          }
                        ],
                        "id": "C507",
                        "desc": "DATE/TIME/PERIOD",
                        "required": true,
                        "definition": "Date and/or time, or period relevant to the specified date/time/period type.",
                        "designator": "DTM01"
                      }
                    ],
                    "desc": "DATE/TIME/PERIOD",
                    "purpose": "To specify date, and/or time, or period."
                  },
                  {
                    "nodeKey": "segment:DTM:168:187",
                    "id": "DTM",
                    "segmentStr": "DTM+63:20140421:102'",
                    "elements": [
                      {
                        "nodeKey": "element:DTM01:171:186",
                        "type": "Data Element",
                        "value": "63:20140421:102",
                        "components": [
                          {
                            "nodeKey": "element:DTM0101:171:173",
                            "type": "Component Element",
                            "value": "63",
                            "id": "2005",
                            "desc": "Date/time/period qualifier",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Delivery date/time, latest",
                            "definition": "Code giving specific meaning to a date, time or period.",
                            "designator": "DTM0101"
                          },
                          {
                            "nodeKey": "element:DTM0102:174:182",
                            "type": "Component Element",
                            "value": "20140421",
                            "id": "2380",
                            "desc": "Date/time/period",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 35,
                            "definition": "The value of a date, a date and time, a time or of a period in a specified representation.",
                            "designator": "DTM0102"
                          },
                          {
                            "nodeKey": "element:DTM0103:183:186",
                            "type": "Component Element",
                            "value": "102",
                            "id": "2379",
                            "desc": "Date/time/period format qualifier",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "CCYYMMDD",
                            "definition": "Specification of the representation of a date, a date and time or of a period.",
                            "designator": "DTM0103"
                          }
                        ],
                        "id": "C507",
                        "desc": "DATE/TIME/PERIOD",
                        "required": true,
                        "definition": "Date and/or time, or period relevant to the specified date/time/period type.",
                        "designator": "DTM01"
                      }
                    ],
                    "desc": "DATE/TIME/PERIOD",
                    "purpose": "To specify date, and/or time, or period."
                  },
                  {
                    "nodeKey": "segment:DTM:190:209",
                    "id": "DTM",
                    "segmentStr": "DTM+64:20140414:102'",
                    "elements": [
                      {
                        "nodeKey": "element:DTM01:193:208",
                        "type": "Data Element",
                        "value": "64:20140414:102",
                        "components": [
                          {
                            "nodeKey": "element:DTM0101:193:195",
                            "type": "Component Element",
                            "value": "64",
                            "id": "2005",
                            "desc": "Date/time/period qualifier",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Delivery date/time, earliest",
                            "definition": "Code giving specific meaning to a date, time or period.",
                            "designator": "DTM0101"
                          },
                          {
                            "nodeKey": "element:DTM0102:196:204",
                            "type": "Component Element",
                            "value": "20140414",
                            "id": "2380",
                            "desc": "Date/time/period",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 35,
                            "definition": "The value of a date, a date and time, a time or of a period in a specified representation.",
                            "designator": "DTM0102"
                          },
                          {
                            "nodeKey": "element:DTM0103:205:208",
                            "type": "Component Element",
                            "value": "102",
                            "id": "2379",
                            "desc": "Date/time/period format qualifier",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "CCYYMMDD",
                            "definition": "Specification of the representation of a date, a date and time or of a period.",
                            "designator": "DTM0103"
                          }
                        ],
                        "id": "C507",
                        "desc": "DATE/TIME/PERIOD",
                        "required": true,
                        "definition": "Date and/or time, or period relevant to the specified date/time/period type.",
                        "designator": "DTM01"
                      }
                    ],
                    "desc": "DATE/TIME/PERIOD",
                    "purpose": "To specify date, and/or time, or period."
                  },
                  {
                    "nodeKey": "loop:RFFLoop1:212:230",
                    "id": "RFFLoop1",
                    "elements": [],
                    "desc": "REFERENCE",
                    "purpose": "To specify a reference.",
                    "Loop": [
                      {
                        "nodeKey": "segment:RFF:212:230",
                        "id": "RFF",
                        "segmentStr": "RFF+ADE:FIRSTORDER'",
                        "elements": [
                          {
                            "nodeKey": "element:RFF01:215:229",
                            "type": "Data Element",
                            "value": "ADE:FIRSTORDER",
                            "components": [
                              {
                                "nodeKey": "element:RFF0101:215:218",
                                "type": "Component Element",
                                "value": "ADE",
                                "id": "1153",
                                "desc": "Reference qualifier",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "Account number",
                                "definition": "Code giving specific meaning to a reference segment or a reference number.",
                                "designator": "RFF0101"
                              },
                              {
                                "nodeKey": "element:RFF0102:219:229",
                                "type": "Component Element",
                                "value": "FIRSTORDER",
                                "id": "1154",
                                "desc": "Reference number",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "Identification number the nature and function of which can be qualified by an entry in data element 1153 Reference qualifier.",
                                "designator": "RFF0102"
                              }
                            ],
                            "id": "C506",
                            "desc": "REFERENCE",
                            "required": true,
                            "definition": "Identification of a reference.",
                            "designator": "RFF01"
                          }
                        ],
                        "desc": "REFERENCE",
                        "purpose": "To specify a reference."
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:RFFLoop1:233:244",
                    "id": "RFFLoop1",
                    "elements": [],
                    "desc": "REFERENCE",
                    "purpose": "To specify a reference.",
                    "Loop": [
                      {
                        "nodeKey": "segment:RFF:233:244",
                        "id": "RFF",
                        "segmentStr": "RFF+PD:1704'",
                        "elements": [
                          {
                            "nodeKey": "element:RFF01:236:243",
                            "type": "Data Element",
                            "value": "PD:1704",
                            "components": [
                              {
                                "nodeKey": "element:RFF0101:236:238",
                                "type": "Component Element",
                                "value": "PD",
                                "id": "1153",
                                "desc": "Reference qualifier",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "Promotion deal number",
                                "definition": "Code giving specific meaning to a reference segment or a reference number.",
                                "designator": "RFF0101"
                              },
                              {
                                "nodeKey": "element:RFF0102:239:243",
                                "type": "Component Element",
                                "value": "1704",
                                "id": "1154",
                                "desc": "Reference number",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "Identification number the nature and function of which can be qualified by an entry in data element 1153 Reference qualifier.",
                                "designator": "RFF0102"
                              }
                            ],
                            "id": "C506",
                            "desc": "REFERENCE",
                            "required": true,
                            "definition": "Identification of a reference.",
                            "designator": "RFF01"
                          }
                        ],
                        "desc": "REFERENCE",
                        "purpose": "To specify a reference."
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:RFFLoop1:247:259",
                    "id": "RFFLoop1",
                    "elements": [],
                    "desc": "REFERENCE",
                    "purpose": "To specify a reference.",
                    "Loop": [
                      {
                        "nodeKey": "segment:RFF:247:259",
                        "id": "RFF",
                        "segmentStr": "RFF+CR:ABCD5'",
                        "elements": [
                          {
                            "nodeKey": "element:RFF01:250:258",
                            "type": "Data Element",
                            "value": "CR:ABCD5",
                            "components": [
                              {
                                "nodeKey": "element:RFF0101:250:252",
                                "type": "Component Element",
                                "value": "CR",
                                "id": "1153",
                                "desc": "Reference qualifier",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "Customer reference number",
                                "definition": "Code giving specific meaning to a reference segment or a reference number.",
                                "designator": "RFF0101"
                              },
                              {
                                "nodeKey": "element:RFF0102:253:258",
                                "type": "Component Element",
                                "value": "ABCD5",
                                "id": "1154",
                                "desc": "Reference number",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "Identification number the nature and function of which can be qualified by an entry in data element 1153 Reference qualifier.",
                                "designator": "RFF0102"
                              }
                            ],
                            "id": "C506",
                            "desc": "REFERENCE",
                            "required": true,
                            "definition": "Identification of a reference.",
                            "designator": "RFF01"
                          }
                        ],
                        "desc": "REFERENCE",
                        "purpose": "To specify a reference."
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:NADLoop1:262:285",
                    "id": "NADLoop1",
                    "elements": [],
                    "desc": "NAME AND ADDRESS",
                    "purpose": "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
                    "Loop": [
                      {
                        "nodeKey": "segment:NAD:262:285",
                        "id": "NAD",
                        "segmentStr": "NAD+BY+5450534000024::9'",
                        "elements": [
                          {
                            "nodeKey": "element:NAD01:265:267",
                            "type": "Data Element",
                            "value": "BY",
                            "id": "3035",
                            "desc": "PARTY QUALIFIER",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Buyer",
                            "definition": "Code giving specific meaning to a party.",
                            "designator": "NAD01"
                          },
                          {
                            "nodeKey": "element:NAD02:268:284",
                            "type": "Data Element",
                            "value": "5450534000024::9",
                            "components": [
                              {
                                "nodeKey": "element:NAD0201:268:281",
                                "type": "Component Element",
                                "value": "5450534000024",
                                "id": "3039",
                                "desc": "Party id. identification",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "Code identifying a party involved in a transaction.",
                                "designator": "NAD0201"
                              },
                              {
                                "nodeKey": "element:NAD0202:282:282",
                                "type": "Component Element",
                                "value": "",
                                "id": "1131",
                                "desc": "Code list qualifier",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "definition": "Identification of a code list.",
                                "designator": "NAD0202"
                              },
                              {
                                "nodeKey": "element:NAD0203:283:284",
                                "type": "Component Element",
                                "value": "9",
                                "id": "3055",
                                "desc": "Code list responsible agency, coded",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "EAN (International Article Numbering association)",
                                "definition": "Code identifying the agency responsible for a code list.",
                                "designator": "NAD0203"
                              }
                            ],
                            "id": "C082",
                            "desc": "PARTY IDENTIFICATION DETAILS",
                            "required": false,
                            "definition": "Identification of a transaction party by code.",
                            "designator": "NAD02"
                          }
                        ],
                        "desc": "NAME AND ADDRESS",
                        "purpose": "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207."
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:NADLoop1:288:312",
                    "id": "NADLoop1",
                    "elements": [],
                    "desc": "NAME AND ADDRESS",
                    "purpose": "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
                    "Loop": [
                      {
                        "nodeKey": "segment:NAD:288:312",
                        "id": "NAD",
                        "segmentStr": "NAD+SU+<Supplier GLN>::9'",
                        "elements": [
                          {
                            "nodeKey": "element:NAD01:291:293",
                            "type": "Data Element",
                            "value": "SU",
                            "id": "3035",
                            "desc": "PARTY QUALIFIER",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Supplier",
                            "definition": "Code giving specific meaning to a party.",
                            "designator": "NAD01"
                          },
                          {
                            "nodeKey": "element:NAD02:294:311",
                            "type": "Data Element",
                            "value": "<Supplier GLN>::9",
                            "components": [
                              {
                                "nodeKey": "element:NAD0201:294:308",
                                "type": "Component Element",
                                "value": "<Supplier GLN>",
                                "id": "3039",
                                "desc": "Party id. identification",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "Code identifying a party involved in a transaction.",
                                "designator": "NAD0201"
                              },
                              {
                                "nodeKey": "element:NAD0202:309:309",
                                "type": "Component Element",
                                "value": "",
                                "id": "1131",
                                "desc": "Code list qualifier",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "definition": "Identification of a code list.",
                                "designator": "NAD0202"
                              },
                              {
                                "nodeKey": "element:NAD0203:310:311",
                                "type": "Component Element",
                                "value": "9",
                                "id": "3055",
                                "desc": "Code list responsible agency, coded",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "EAN (International Article Numbering association)",
                                "definition": "Code identifying the agency responsible for a code list.",
                                "designator": "NAD0203"
                              }
                            ],
                            "id": "C082",
                            "desc": "PARTY IDENTIFICATION DETAILS",
                            "required": false,
                            "definition": "Identification of a transaction party by code.",
                            "designator": "NAD02"
                          }
                        ],
                        "desc": "NAME AND ADDRESS",
                        "purpose": "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207."
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:NADLoop1:315:347",
                    "id": "NADLoop1",
                    "elements": [],
                    "desc": "NAME AND ADDRESS",
                    "purpose": "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
                    "Loop": [
                      {
                        "nodeKey": "segment:NAD:315:347",
                        "id": "NAD",
                        "segmentStr": "NAD+DP+5450534000109::9+++++++GB'",
                        "elements": [
                          {
                            "nodeKey": "element:NAD01:318:320",
                            "type": "Data Element",
                            "value": "DP",
                            "id": "3035",
                            "desc": "PARTY QUALIFIER",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Delivery party",
                            "definition": "Code giving specific meaning to a party.",
                            "designator": "NAD01"
                          },
                          {
                            "nodeKey": "element:NAD02:321:337",
                            "type": "Data Element",
                            "value": "5450534000109::9",
                            "components": [
                              {
                                "nodeKey": "element:NAD0201:321:334",
                                "type": "Component Element",
                                "value": "5450534000109",
                                "id": "3039",
                                "desc": "Party id. identification",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "Code identifying a party involved in a transaction.",
                                "designator": "NAD0201"
                              },
                              {
                                "nodeKey": "element:NAD0202:335:335",
                                "type": "Component Element",
                                "value": "",
                                "id": "1131",
                                "desc": "Code list qualifier",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "definition": "Identification of a code list.",
                                "designator": "NAD0202"
                              },
                              {
                                "nodeKey": "element:NAD0203:336:337",
                                "type": "Component Element",
                                "value": "9",
                                "id": "3055",
                                "desc": "Code list responsible agency, coded",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "EAN (International Article Numbering association)",
                                "definition": "Code identifying the agency responsible for a code list.",
                                "designator": "NAD0203"
                              }
                            ],
                            "id": "C082",
                            "desc": "PARTY IDENTIFICATION DETAILS",
                            "required": false,
                            "definition": "Identification of a transaction party by code.",
                            "designator": "NAD02"
                          },
                          {
                            "nodeKey": "element:NAD03:338:338",
                            "type": "Data Element",
                            "value": "",
                            "id": "C058",
                            "desc": "NAME AND ADDRESS",
                            "required": false,
                            "definition": "Unstructured name and address: one to five lines.",
                            "designator": "NAD03"
                          },
                          {
                            "nodeKey": "element:NAD04:339:339",
                            "type": "Data Element",
                            "value": "",
                            "id": "C080",
                            "desc": "PARTY NAME",
                            "required": false,
                            "definition": "Identification of a transaction party by name, one to five lines. Party name may be formatted.",
                            "designator": "NAD04"
                          },
                          {
                            "nodeKey": "element:NAD05:340:340",
                            "type": "Data Element",
                            "value": "",
                            "id": "C059",
                            "desc": "STREET",
                            "required": false,
                            "definition": "Street address and/or PO Box number in a structured address: one to three lines.",
                            "designator": "NAD05"
                          },
                          {
                            "nodeKey": "element:NAD06:341:341",
                            "type": "Data Element",
                            "value": "",
                            "id": "3164",
                            "desc": "CITY NAME",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 35,
                            "definition": "Name of a city (a town, a village) for addressing purposes.",
                            "designator": "NAD06"
                          },
                          {
                            "nodeKey": "element:NAD07:342:342",
                            "type": "Data Element",
                            "value": "",
                            "id": "3229",
                            "desc": "COUNTRY SUB-ENTITY IDENTIFICATION",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 9,
                            "definition": "Identification of the name of sub-entities (state, province) defined by appropriate governmental agencies.",
                            "designator": "NAD07"
                          },
                          {
                            "nodeKey": "element:NAD08:343:343",
                            "type": "Data Element",
                            "value": "",
                            "id": "3251",
                            "desc": "POSTCODE IDENTIFICATION",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 9,
                            "definition": "Code defining postal zones or addresses.",
                            "designator": "NAD08"
                          },
                          {
                            "nodeKey": "element:NAD09:344:346",
                            "type": "Data Element",
                            "value": "GB",
                            "id": "3207",
                            "desc": "COUNTRY, CODED",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "definition": "Identification of the name of a country or other geographical entity as specified in ISO 3166.",
                            "designator": "NAD09"
                          }
                        ],
                        "desc": "NAME AND ADDRESS",
                        "purpose": "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207."
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:NADLoop1:350:446",
                    "id": "NADLoop1",
                    "elements": [],
                    "desc": "NAME AND ADDRESS",
                    "purpose": "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207.",
                    "Loop": [
                      {
                        "nodeKey": "segment:NAD:350:425",
                        "id": "NAD",
                        "segmentStr": "NAD+IV+5450534007139::9++Test:Name2+Test Street:Steet2+Beijing++EC2A 2FA+GB'",
                        "elements": [
                          {
                            "nodeKey": "element:NAD01:353:355",
                            "type": "Data Element",
                            "value": "IV",
                            "id": "3035",
                            "desc": "PARTY QUALIFIER",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Invoicee",
                            "definition": "Code giving specific meaning to a party.",
                            "designator": "NAD01"
                          },
                          {
                            "nodeKey": "element:NAD02:356:372",
                            "type": "Data Element",
                            "value": "5450534007139::9",
                            "components": [
                              {
                                "nodeKey": "element:NAD0201:356:369",
                                "type": "Component Element",
                                "value": "5450534007139",
                                "id": "3039",
                                "desc": "Party id. identification",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "Code identifying a party involved in a transaction.",
                                "designator": "NAD0201"
                              },
                              {
                                "nodeKey": "element:NAD0202:370:370",
                                "type": "Component Element",
                                "value": "",
                                "id": "1131",
                                "desc": "Code list qualifier",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "definition": "Identification of a code list.",
                                "designator": "NAD0202"
                              },
                              {
                                "nodeKey": "element:NAD0203:371:372",
                                "type": "Component Element",
                                "value": "9",
                                "id": "3055",
                                "desc": "Code list responsible agency, coded",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "EAN (International Article Numbering association)",
                                "definition": "Code identifying the agency responsible for a code list.",
                                "designator": "NAD0203"
                              }
                            ],
                            "id": "C082",
                            "desc": "PARTY IDENTIFICATION DETAILS",
                            "required": false,
                            "definition": "Identification of a transaction party by code.",
                            "designator": "NAD02"
                          },
                          {
                            "nodeKey": "element:NAD03:373:373",
                            "type": "Data Element",
                            "value": "",
                            "id": "C058",
                            "desc": "NAME AND ADDRESS",
                            "required": false,
                            "definition": "Unstructured name and address: one to five lines.",
                            "designator": "NAD03"
                          },
                          {
                            "nodeKey": "element:NAD04:374:384",
                            "type": "Data Element",
                            "value": "Test:Name2",
                            "components": [
                              {
                                "nodeKey": "element:NAD0401:374:378",
                                "type": "Component Element",
                                "value": "Test",
                                "id": "3036",
                                "desc": "Party name",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "Name of a party involved in a transaction.",
                                "designator": "NAD0401"
                              },
                              {
                                "nodeKey": "element:NAD0402:379:384",
                                "type": "Component Element",
                                "value": "Name2",
                                "id": "3036",
                                "desc": "Party name",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "Name of a party involved in a transaction.",
                                "designator": "NAD0402"
                              }
                            ],
                            "id": "C080",
                            "desc": "PARTY NAME",
                            "required": false,
                            "definition": "Identification of a transaction party by name, one to five lines. Party name may be formatted.",
                            "designator": "NAD04"
                          },
                          {
                            "nodeKey": "element:NAD05:385:403",
                            "type": "Data Element",
                            "value": "Test Street:Steet2",
                            "components": [
                              {
                                "nodeKey": "element:NAD0501:385:396",
                                "type": "Component Element",
                                "value": "Test Street",
                                "id": "3042",
                                "desc": "Street and number/p.o. box",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "Street and number in plain language, or Post Office Box No.",
                                "designator": "NAD0501"
                              },
                              {
                                "nodeKey": "element:NAD0502:397:403",
                                "type": "Component Element",
                                "value": "Steet2",
                                "id": "3042",
                                "desc": "Street and number/p.o. box",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "Street and number in plain language, or Post Office Box No.",
                                "designator": "NAD0502"
                              }
                            ],
                            "id": "C059",
                            "desc": "STREET",
                            "required": false,
                            "definition": "Street address and/or PO Box number in a structured address: one to three lines.",
                            "designator": "NAD05"
                          },
                          {
                            "nodeKey": "element:NAD06:404:411",
                            "type": "Data Element",
                            "value": "Beijing",
                            "id": "3164",
                            "desc": "CITY NAME",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 35,
                            "definition": "Name of a city (a town, a village) for addressing purposes.",
                            "designator": "NAD06"
                          },
                          {
                            "nodeKey": "element:NAD07:412:412",
                            "type": "Data Element",
                            "value": "",
                            "id": "3229",
                            "desc": "COUNTRY SUB-ENTITY IDENTIFICATION",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 9,
                            "definition": "Identification of the name of sub-entities (state, province) defined by appropriate governmental agencies.",
                            "designator": "NAD07"
                          },
                          {
                            "nodeKey": "element:NAD08:413:421",
                            "type": "Data Element",
                            "value": "EC2A 2FA",
                            "id": "3251",
                            "desc": "POSTCODE IDENTIFICATION",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 9,
                            "definition": "Code defining postal zones or addresses.",
                            "designator": "NAD08"
                          },
                          {
                            "nodeKey": "element:NAD09:422:424",
                            "type": "Data Element",
                            "value": "GB",
                            "id": "3207",
                            "desc": "COUNTRY, CODED",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "definition": "Identification of the name of a country or other geographical entity as specified in ISO 3166.",
                            "designator": "NAD09"
                          }
                        ],
                        "desc": "NAME AND ADDRESS",
                        "purpose": "To specify the name/address and their related function, either by CO82 only and/or unstructured by CO58 or structured by CO80 thru 3207."
                      },
                      {
                        "nodeKey": "loop:RFFLoop2:428:446",
                        "id": "RFFLoop2",
                        "elements": [],
                        "desc": "REFERENCE",
                        "purpose": "To specify a reference.",
                        "Loop": [
                          {
                            "nodeKey": "segment:RFF:428:446",
                            "id": "RFF",
                            "segmentStr": "RFF+VA:GB727255821'",
                            "elements": [
                              {
                                "nodeKey": "element:RFF01:431:445",
                                "type": "Data Element",
                                "value": "VA:GB727255821",
                                "components": [
                                  {
                                    "nodeKey": "element:RFF0101:431:433",
                                    "type": "Component Element",
                                    "value": "VA",
                                    "id": "1153",
                                    "desc": "Reference qualifier",
                                    "dataType": "AN",
                                    "required": true,
                                    "minLength": 0,
                                    "maxLength": 3,
                                    "codeValue": "VAT registration number",
                                    "definition": "Code giving specific meaning to a reference segment or a reference number.",
                                    "designator": "RFF0101"
                                  },
                                  {
                                    "nodeKey": "element:RFF0102:434:445",
                                    "type": "Component Element",
                                    "value": "GB727255821",
                                    "id": "1154",
                                    "desc": "Reference number",
                                    "dataType": "AN",
                                    "required": false,
                                    "minLength": 0,
                                    "maxLength": 35,
                                    "definition": "Identification number the nature and function of which can be qualified by an entry in data element 1153 Reference qualifier.",
                                    "designator": "RFF0102"
                                  }
                                ],
                                "id": "C506",
                                "desc": "REFERENCE",
                                "required": true,
                                "definition": "Identification of a reference.",
                                "designator": "RFF01"
                              }
                            ],
                            "desc": "REFERENCE",
                            "purpose": "To specify a reference."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:CUXLoop1:449:460",
                    "id": "CUXLoop1",
                    "elements": [],
                    "desc": "CURRENCIES",
                    "purpose": "To specify currencies used in the transaction and relevant details for the rate of exchange.",
                    "Loop": [
                      {
                        "nodeKey": "segment:CUX:449:460",
                        "id": "CUX",
                        "segmentStr": "CUX+2:EUR:9'",
                        "elements": [
                          {
                            "nodeKey": "element:CUX01:452:459",
                            "type": "Data Element",
                            "value": "2:EUR:9",
                            "components": [
                              {
                                "nodeKey": "element:CUX0101:452:453",
                                "type": "Component Element",
                                "value": "2",
                                "id": "6347",
                                "desc": "Currency details qualifier",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "Reference currency",
                                "definition": "Specification of the usage to which the currency relates.",
                                "designator": "CUX0101"
                              },
                              {
                                "nodeKey": "element:CUX0102:454:457",
                                "type": "Component Element",
                                "value": "EUR",
                                "id": "6345",
                                "desc": "Currency, coded",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "definition": "Identification of the name or symbol of the monetary unit involved in the transaction.",
                                "designator": "CUX0102"
                              },
                              {
                                "nodeKey": "element:CUX0103:458:459",
                                "type": "Component Element",
                                "value": "9",
                                "id": "6343",
                                "desc": "Currency qualifier",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "Order currency",
                                "definition": "Code giving specific meaning to data element 6345 Currency.",
                                "designator": "CUX0103"
                              }
                            ],
                            "id": "C504",
                            "desc": "CURRENCY DETAILS",
                            "required": false,
                            "definition": "The usage to which a currency relates.",
                            "designator": "CUX01"
                          }
                        ],
                        "desc": "CURRENCIES",
                        "purpose": "To specify currencies used in the transaction and relevant details for the rate of exchange."
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:LINLoop1:463:538",
                    "id": "LINLoop1",
                    "elements": [],
                    "desc": "LINE ITEM",
                    "purpose": "To identify a line item and configuration.",
                    "Loop": [
                      {
                        "nodeKey": "segment:LIN:463:486",
                        "id": "LIN",
                        "segmentStr": "LIN+1++9783898307529:EN'",
                        "elements": [
                          {
                            "nodeKey": "element:LIN01:466:467",
                            "type": "Data Element",
                            "value": "1",
                            "id": "1082",
                            "desc": "LINE ITEM NUMBER",
                            "dataType": "N",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 6,
                            "definition": "Serial number designating each separate item within a series of articles.",
                            "designator": "LIN01"
                          },
                          {
                            "nodeKey": "element:LIN02:468:468",
                            "type": "Data Element",
                            "value": "",
                            "id": "1229",
                            "desc": "ACTION REQUEST/NOTIFICATION, CODED",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "definition": "Code specifying the action to be taken or already taken.",
                            "designator": "LIN02"
                          },
                          {
                            "nodeKey": "element:LIN03:469:485",
                            "type": "Data Element",
                            "value": "9783898307529:EN",
                            "components": [
                              {
                                "nodeKey": "element:LIN0301:469:482",
                                "type": "Component Element",
                                "value": "9783898307529",
                                "id": "7140",
                                "desc": "Item number",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "A number allocated to a group or item.",
                                "designator": "LIN0301"
                              },
                              {
                                "nodeKey": "element:LIN0302:483:485",
                                "type": "Component Element",
                                "value": "EN",
                                "id": "7143",
                                "desc": "Item number type, coded",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "International Article Numbering Association (EAN)",
                                "definition": "Identification of the type of item number.",
                                "designator": "LIN0302"
                              }
                            ],
                            "id": "C212",
                            "desc": "ITEM NUMBER IDENTIFICATION",
                            "required": false,
                            "definition": "Goods identification for a specified source.",
                            "designator": "LIN03"
                          }
                        ],
                        "desc": "LINE ITEM",
                        "purpose": "To identify a line item and configuration."
                      },
                      {
                        "nodeKey": "segment:PIA:489:512",
                        "id": "PIA",
                        "segmentStr": "PIA+5+3899408268X-39:SA'",
                        "elements": [
                          {
                            "nodeKey": "element:PIA01:492:493",
                            "type": "Data Element",
                            "value": "5",
                            "id": "4347",
                            "desc": "PRODUCT ID. FUNCTION QUALIFIER",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Product identification",
                            "definition": "Indication of the function of the product code.",
                            "designator": "PIA01"
                          },
                          {
                            "nodeKey": "element:PIA02:494:511",
                            "type": "Data Element",
                            "value": "3899408268X-39:SA",
                            "components": [
                              {
                                "nodeKey": "element:PIA0201:494:508",
                                "type": "Component Element",
                                "value": "3899408268X-39",
                                "id": "7140",
                                "desc": "Item number",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "A number allocated to a group or item.",
                                "designator": "PIA0201"
                              },
                              {
                                "nodeKey": "element:PIA0202:509:511",
                                "type": "Component Element",
                                "value": "SA",
                                "id": "7143",
                                "desc": "Item number type, coded",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "Supplier's article number",
                                "definition": "Identification of the type of item number.",
                                "designator": "PIA0202"
                              }
                            ],
                            "id": "C212",
                            "desc": "ITEM NUMBER IDENTIFICATION",
                            "required": true,
                            "definition": "Goods identification for a specified source.",
                            "designator": "PIA02"
                          }
                        ],
                        "desc": "ADDITIONAL PRODUCT ID",
                        "purpose": "To specify additional or substitutional item identification codes."
                      },
                      {
                        "nodeKey": "segment:QTY:515:523",
                        "id": "QTY",
                        "segmentStr": "QTY+21:5'",
                        "elements": [
                          {
                            "nodeKey": "element:QTY01:518:522",
                            "type": "Data Element",
                            "value": "21:5",
                            "components": [
                              {
                                "nodeKey": "element:QTY0101:518:520",
                                "type": "Component Element",
                                "value": "21",
                                "id": "6063",
                                "desc": "Quantity qualifier",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "Ordered quantity",
                                "definition": "Code giving specific meaning to a quantity.",
                                "designator": "QTY0101"
                              },
                              {
                                "nodeKey": "element:QTY0102:521:522",
                                "type": "Component Element",
                                "value": "5",
                                "id": "6060",
                                "desc": "Quantity",
                                "dataType": "N",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 15,
                                "definition": "Numeric value of a quantity.",
                                "designator": "QTY0102"
                              }
                            ],
                            "id": "C186",
                            "desc": "QUANTITY DETAILS",
                            "required": true,
                            "definition": "Quantity information in a transaction, qualified when relevant.",
                            "designator": "QTY01"
                          }
                        ],
                        "desc": "QUANTITY",
                        "purpose": "To specify a pertinent quantity."
                      },
                      {
                        "nodeKey": "loop:PRILoop1:526:538",
                        "id": "PRILoop1",
                        "elements": [],
                        "desc": "PRICE DETAILS",
                        "purpose": "To specify price information.",
                        "Loop": [
                          {
                            "nodeKey": "segment:PRI:526:538",
                            "id": "PRI",
                            "segmentStr": "PRI+AAA:27.5'",
                            "elements": [
                              {
                                "nodeKey": "element:PRI01:529:537",
                                "type": "Data Element",
                                "value": "AAA:27.5",
                                "components": [
                                  {
                                    "nodeKey": "element:PRI0101:529:532",
                                    "type": "Component Element",
                                    "value": "AAA",
                                    "id": "5125",
                                    "desc": "Price qualifier",
                                    "dataType": "AN",
                                    "required": true,
                                    "minLength": 0,
                                    "maxLength": 3,
                                    "codeValue": "Calculation net",
                                    "definition": "Identification of a type of price.",
                                    "designator": "PRI0101"
                                  },
                                  {
                                    "nodeKey": "element:PRI0102:533:537",
                                    "type": "Component Element",
                                    "value": "27.5",
                                    "id": "5118",
                                    "desc": "Price",
                                    "dataType": "N",
                                    "required": false,
                                    "minLength": 0,
                                    "maxLength": 15,
                                    "definition": "The monetary value associated with a purchase or sale of an article, product or service.",
                                    "designator": "PRI0102"
                                  }
                                ],
                                "id": "C509",
                                "desc": "PRICE INFORMATION",
                                "required": false,
                                "definition": "Identification of price type, price and related details.",
                                "designator": "PRI01"
                              }
                            ],
                            "desc": "PRICE DETAILS",
                            "purpose": "To specify price information."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:LINLoop1:541:590",
                    "id": "LINLoop1",
                    "elements": [],
                    "desc": "LINE ITEM",
                    "purpose": "To identify a line item and configuration.",
                    "Loop": [
                      {
                        "nodeKey": "segment:LIN:541:563",
                        "id": "LIN",
                        "segmentStr": "LIN+2++390787706322:UP'",
                        "elements": [
                          {
                            "nodeKey": "element:LIN01:544:545",
                            "type": "Data Element",
                            "value": "2",
                            "id": "1082",
                            "desc": "LINE ITEM NUMBER",
                            "dataType": "N",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 6,
                            "definition": "Serial number designating each separate item within a series of articles.",
                            "designator": "LIN01"
                          },
                          {
                            "nodeKey": "element:LIN02:546:546",
                            "type": "Data Element",
                            "value": "",
                            "id": "1229",
                            "desc": "ACTION REQUEST/NOTIFICATION, CODED",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "definition": "Code specifying the action to be taken or already taken.",
                            "designator": "LIN02"
                          },
                          {
                            "nodeKey": "element:LIN03:547:562",
                            "type": "Data Element",
                            "value": "390787706322:UP",
                            "components": [
                              {
                                "nodeKey": "element:LIN0301:547:559",
                                "type": "Component Element",
                                "value": "390787706322",
                                "id": "7140",
                                "desc": "Item number",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "A number allocated to a group or item.",
                                "designator": "LIN0301"
                              },
                              {
                                "nodeKey": "element:LIN0302:560:562",
                                "type": "Component Element",
                                "value": "UP",
                                "id": "7143",
                                "desc": "Item number type, coded",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "UPC (Universal product code)",
                                "definition": "Identification of the type of item number.",
                                "designator": "LIN0302"
                              }
                            ],
                            "id": "C212",
                            "desc": "ITEM NUMBER IDENTIFICATION",
                            "required": false,
                            "definition": "Goods identification for a specified source.",
                            "designator": "LIN03"
                          }
                        ],
                        "desc": "LINE ITEM",
                        "purpose": "To identify a line item and configuration."
                      },
                      {
                        "nodeKey": "segment:QTY:566:574",
                        "id": "QTY",
                        "segmentStr": "QTY+21:1'",
                        "elements": [
                          {
                            "nodeKey": "element:QTY01:569:573",
                            "type": "Data Element",
                            "value": "21:1",
                            "components": [
                              {
                                "nodeKey": "element:QTY0101:569:571",
                                "type": "Component Element",
                                "value": "21",
                                "id": "6063",
                                "desc": "Quantity qualifier",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "Ordered quantity",
                                "definition": "Code giving specific meaning to a quantity.",
                                "designator": "QTY0101"
                              },
                              {
                                "nodeKey": "element:QTY0102:572:573",
                                "type": "Component Element",
                                "value": "1",
                                "id": "6060",
                                "desc": "Quantity",
                                "dataType": "N",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 15,
                                "definition": "Numeric value of a quantity.",
                                "designator": "QTY0102"
                              }
                            ],
                            "id": "C186",
                            "desc": "QUANTITY DETAILS",
                            "required": true,
                            "definition": "Quantity information in a transaction, qualified when relevant.",
                            "designator": "QTY01"
                          }
                        ],
                        "desc": "QUANTITY",
                        "purpose": "To specify a pertinent quantity."
                      },
                      {
                        "nodeKey": "loop:PRILoop1:577:590",
                        "id": "PRILoop1",
                        "elements": [],
                        "desc": "PRICE DETAILS",
                        "purpose": "To specify price information.",
                        "Loop": [
                          {
                            "nodeKey": "segment:PRI:577:590",
                            "id": "PRI",
                            "segmentStr": "PRI+AAA:10.87'",
                            "elements": [
                              {
                                "nodeKey": "element:PRI01:580:589",
                                "type": "Data Element",
                                "value": "AAA:10.87",
                                "components": [
                                  {
                                    "nodeKey": "element:PRI0101:580:583",
                                    "type": "Component Element",
                                    "value": "AAA",
                                    "id": "5125",
                                    "desc": "Price qualifier",
                                    "dataType": "AN",
                                    "required": true,
                                    "minLength": 0,
                                    "maxLength": 3,
                                    "codeValue": "Calculation net",
                                    "definition": "Identification of a type of price.",
                                    "designator": "PRI0101"
                                  },
                                  {
                                    "nodeKey": "element:PRI0102:584:589",
                                    "type": "Component Element",
                                    "value": "10.87",
                                    "id": "5118",
                                    "desc": "Price",
                                    "dataType": "N",
                                    "required": false,
                                    "minLength": 0,
                                    "maxLength": 15,
                                    "definition": "The monetary value associated with a purchase or sale of an article, product or service.",
                                    "designator": "PRI0102"
                                  }
                                ],
                                "id": "C509",
                                "desc": "PRICE INFORMATION",
                                "required": false,
                                "definition": "Identification of price type, price and related details.",
                                "designator": "PRI01"
                              }
                            ],
                            "desc": "PRICE DETAILS",
                            "purpose": "To specify price information."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "nodeKey": "loop:LINLoop1:593:650",
                    "id": "LINLoop1",
                    "elements": [],
                    "desc": "LINE ITEM",
                    "purpose": "To identify a line item and configuration.",
                    "Loop": [
                      {
                        "nodeKey": "segment:LIN:593:598",
                        "id": "LIN",
                        "segmentStr": "LIN+3'",
                        "elements": [
                          {
                            "nodeKey": "element:LIN01:596:597",
                            "type": "Data Element",
                            "value": "3",
                            "id": "1082",
                            "desc": "LINE ITEM NUMBER",
                            "dataType": "N",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 6,
                            "definition": "Serial number designating each separate item within a series of articles.",
                            "designator": "LIN01"
                          }
                        ],
                        "desc": "LINE ITEM",
                        "purpose": "To identify a line item and configuration."
                      },
                      {
                        "nodeKey": "segment:PIA:601:624",
                        "id": "PIA",
                        "segmentStr": "PIA+5+3899408268X-39:SA'",
                        "elements": [
                          {
                            "nodeKey": "element:PIA01:604:605",
                            "type": "Data Element",
                            "value": "5",
                            "id": "4347",
                            "desc": "PRODUCT ID. FUNCTION QUALIFIER",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Product identification",
                            "definition": "Indication of the function of the product code.",
                            "designator": "PIA01"
                          },
                          {
                            "nodeKey": "element:PIA02:606:623",
                            "type": "Data Element",
                            "value": "3899408268X-39:SA",
                            "components": [
                              {
                                "nodeKey": "element:PIA0201:606:620",
                                "type": "Component Element",
                                "value": "3899408268X-39",
                                "id": "7140",
                                "desc": "Item number",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 35,
                                "definition": "A number allocated to a group or item.",
                                "designator": "PIA0201"
                              },
                              {
                                "nodeKey": "element:PIA0202:621:623",
                                "type": "Component Element",
                                "value": "SA",
                                "id": "7143",
                                "desc": "Item number type, coded",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "Supplier's article number",
                                "definition": "Identification of the type of item number.",
                                "designator": "PIA0202"
                              }
                            ],
                            "id": "C212",
                            "desc": "ITEM NUMBER IDENTIFICATION",
                            "required": true,
                            "definition": "Goods identification for a specified source.",
                            "designator": "PIA02"
                          }
                        ],
                        "desc": "ADDITIONAL PRODUCT ID",
                        "purpose": "To specify additional or substitutional item identification codes."
                      },
                      {
                        "nodeKey": "segment:QTY:627:635",
                        "id": "QTY",
                        "segmentStr": "QTY+21:3'",
                        "elements": [
                          {
                            "nodeKey": "element:QTY01:630:634",
                            "type": "Data Element",
                            "value": "21:3",
                            "components": [
                              {
                                "nodeKey": "element:QTY0101:630:632",
                                "type": "Component Element",
                                "value": "21",
                                "id": "6063",
                                "desc": "Quantity qualifier",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 3,
                                "codeValue": "Ordered quantity",
                                "definition": "Code giving specific meaning to a quantity.",
                                "designator": "QTY0101"
                              },
                              {
                                "nodeKey": "element:QTY0102:633:634",
                                "type": "Component Element",
                                "value": "3",
                                "id": "6060",
                                "desc": "Quantity",
                                "dataType": "N",
                                "required": true,
                                "minLength": 0,
                                "maxLength": 15,
                                "definition": "Numeric value of a quantity.",
                                "designator": "QTY0102"
                              }
                            ],
                            "id": "C186",
                            "desc": "QUANTITY DETAILS",
                            "required": true,
                            "definition": "Quantity information in a transaction, qualified when relevant.",
                            "designator": "QTY01"
                          }
                        ],
                        "desc": "QUANTITY",
                        "purpose": "To specify a pertinent quantity."
                      },
                      {
                        "nodeKey": "loop:PRILoop1:638:650",
                        "id": "PRILoop1",
                        "elements": [],
                        "desc": "PRICE DETAILS",
                        "purpose": "To specify price information.",
                        "Loop": [
                          {
                            "nodeKey": "segment:PRI:638:650",
                            "id": "PRI",
                            "segmentStr": "PRI+AAA:3.85'",
                            "elements": [
                              {
                                "nodeKey": "element:PRI01:641:649",
                                "type": "Data Element",
                                "value": "AAA:3.85",
                                "components": [
                                  {
                                    "nodeKey": "element:PRI0101:641:644",
                                    "type": "Component Element",
                                    "value": "AAA",
                                    "id": "5125",
                                    "desc": "Price qualifier",
                                    "dataType": "AN",
                                    "required": true,
                                    "minLength": 0,
                                    "maxLength": 3,
                                    "codeValue": "Calculation net",
                                    "definition": "Identification of a type of price.",
                                    "designator": "PRI0101"
                                  },
                                  {
                                    "nodeKey": "element:PRI0102:645:649",
                                    "type": "Component Element",
                                    "value": "3.85",
                                    "id": "5118",
                                    "desc": "Price",
                                    "dataType": "N",
                                    "required": false,
                                    "minLength": 0,
                                    "maxLength": 15,
                                    "definition": "The monetary value associated with a purchase or sale of an article, product or service.",
                                    "designator": "PRI0102"
                                  }
                                ],
                                "id": "C509",
                                "desc": "PRICE INFORMATION",
                                "required": false,
                                "definition": "Identification of price type, price and related details.",
                                "designator": "PRI01"
                              }
                            ],
                            "desc": "PRICE DETAILS",
                            "purpose": "To specify price information."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "nodeKey": "segment:UNS:653:658",
                    "id": "UNS",
                    "segmentStr": "UNS+S'",
                    "elements": [
                      {
                        "nodeKey": "element:UNS01:656:657",
                        "type": "Data Element",
                        "value": "S",
                        "id": "0081",
                        "desc": "SECTION IDENTIFICATION",
                        "dataType": "A",
                        "required": true,
                        "minLength": 1,
                        "maxLength": 1,
                        "codeValue": "Detail/summary section separation",
                        "definition": "Separates sections in a message.",
                        "designator": "UNS01"
                      }
                    ],
                    "purpose": "To separate header, detail and summary sections of a message."
                  },
                  {
                    "nodeKey": "segment:CNT:661:668",
                    "id": "CNT",
                    "segmentStr": "CNT+2:3'",
                    "elements": [
                      {
                        "nodeKey": "element:CNT01:664:667",
                        "type": "Data Element",
                        "value": "2:3",
                        "components": [
                          {
                            "nodeKey": "element:CNT0101:664:665",
                            "type": "Component Element",
                            "value": "2",
                            "id": "6069",
                            "desc": "Control qualifier",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Number of line items in message",
                            "definition": "Determines the source data elements in the message which forms the basis for 6066 Control value.",
                            "designator": "CNT0101"
                          },
                          {
                            "nodeKey": "element:CNT0102:666:667",
                            "type": "Component Element",
                            "value": "3",
                            "id": "6066",
                            "desc": "Control value",
                            "dataType": "N",
                            "required": true,
                            "minLength": 0,
                            "maxLength": 18,
                            "definition": "Value obtained from summing the values specified by the Control Qualifier throughout the message (Hash total).",
                            "designator": "CNT0102"
                          }
                        ],
                        "id": "C270",
                        "desc": "CONTROL",
                        "required": true,
                        "definition": "Control total for checking integrity of a message or part of a message.",
                        "designator": "CNT01"
                      }
                    ],
                    "desc": "CONTROL TOTAL",
                    "purpose": "To provide control total."
                  }
                ],
                "startSegment": {
                  "nodeKey": "segment:UNH:93:121",
                  "id": "UNH",
                  "segmentStr": "UNH+1+ORDERS:D:96A:UN:EAN008'",
                  "elements": [
                    {
                      "nodeKey": "element:UNH01:96:97",
                      "type": "Data Element",
                      "value": "1",
                      "id": "0062",
                      "desc": "MESSAGE REFERENCE NUMBER",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 14,
                      "definition": "Unique message reference assigned by the sender.",
                      "designator": "UNH01"
                    },
                    {
                      "nodeKey": "element:UNH02:98:120",
                      "type": "Data Element",
                      "value": "ORDERS:D:96A:UN:EAN008",
                      "components": [
                        {
                          "nodeKey": "element:UNH0201:98:104",
                          "type": "Component Element",
                          "value": "ORDERS",
                          "id": "0065",
                          "desc": "Message type identifier",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 6,
                          "codeValue": "Purchase order message",
                          "definition": "Code identifying a type of message and assigned by its controlling agency.",
                          "designator": "UNH0201"
                        },
                        {
                          "nodeKey": "element:UNH0202:105:106",
                          "type": "Component Element",
                          "value": "D",
                          "id": "0052",
                          "desc": "Message type version number",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 3,
                          "definition": "Version number of a message type.",
                          "designator": "UNH0202"
                        },
                        {
                          "nodeKey": "element:UNH0203:107:110",
                          "type": "Component Element",
                          "value": "96A",
                          "id": "0054",
                          "desc": "Message type release number",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 3,
                          "definition": "Release number within the current message type version number (0052).",
                          "designator": "UNH0203"
                        },
                        {
                          "nodeKey": "element:UNH0204:111:113",
                          "type": "Component Element",
                          "value": "UN",
                          "id": "0051",
                          "desc": "Controlling agency",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 2,
                          "codeValue": "UN/ECE/TRADE/WP.4, United Nations Standard Messages (UNSM)",
                          "definition": "Code to identify the agency controlling the specification, maintenance and publication of the message type.",
                          "designator": "UNH0204"
                        },
                        {
                          "nodeKey": "element:UNH0205:114:120",
                          "type": "Component Element",
                          "value": "EAN008",
                          "id": "0057",
                          "desc": "Association assigned code",
                          "dataType": "AN",
                          "required": false,
                          "minLength": 0,
                          "maxLength": 6,
                          "definition": "A code assigned by the association responsible for the design and maintenance of the message type concerned, which further identifies the message.",
                          "designator": "UNH0205"
                        }
                      ],
                      "id": "S009",
                      "desc": "MESSAGE IDENTIFIER",
                      "required": true,
                      "definition": "Identification of the type, version etc. of the message being interchanged.",
                      "designator": "UNH02"
                    }
                  ],
                  "desc": "Message header",
                  "purpose": "To head, identify and specify a message."
                },
                "endSegment": {
                  "nodeKey": "segment:UNT:671:679",
                  "id": "UNT",
                  "segmentStr": "UNT+28+1'",
                  "elements": [
                    {
                      "nodeKey": "element:UNT01:674:676",
                      "type": "Data Element",
                      "value": "28",
                      "id": "0074",
                      "desc": "NUMBER OF SEGMENTS IN A MESSAGE",
                      "dataType": "N",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 6,
                      "definition": "Control count of number of segments in a message.",
                      "designator": "UNT01"
                    },
                    {
                      "nodeKey": "element:UNT02:677:678",
                      "type": "Data Element",
                      "value": "1",
                      "id": "0062",
                      "desc": "MESSAGE REFERENCE NUMBER",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 14,
                      "definition": "Unique message reference assigned by the sender.",
                      "designator": "UNT02"
                    }
                  ],
                  "desc": "Message trailer",
                  "purpose": "To end and check the completeness of a message."
                }
              }
            ]
          }
        ],
        "startSegment": {
          "nodeKey": "segment:UNB:11:90",
          "id": "UNB",
          "segmentStr": "UNB+UNOA:2+<Sender GLN>:14+<Receiver GLN>:14+140407:0910+5+000000001+++1+EANCOM'",
          "elements": [
            {
              "nodeKey": "element:UNB01:14:20",
              "type": "Data Element",
              "value": "UNOA:2",
              "components": [
                {
                  "nodeKey": "element:UNB0101:14:18",
                  "type": "Component Element",
                  "value": "UNOA",
                  "id": "0001",
                  "desc": "Syntax identifier",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 4,
                  "maxLength": 4,
                  "codeValue": "UN/ECE level A: As defined in the basic code table of ISO 646 with the exceptions of lower case letters, alternative graphic character allocations and national or application-oriented graphic character allocations.",
                  "definition": "Coded identification of the agency controlling a syntax and syntax level used in an interchange.",
                  "designator": "UNB0101"
                },
                {
                  "nodeKey": "element:UNB0102:19:20",
                  "type": "Component Element",
                  "value": "2",
                  "id": "0002",
                  "desc": "Syntax version number",
                  "dataType": "N",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 1,
                  "codeValue": "Version 2: ISO 9735:1990.",
                  "definition": "Version number of the syntax identified in the syntax identifier (0001)",
                  "designator": "UNB0102"
                }
              ],
              "id": "S001",
              "desc": "Syntax identifier",
              "required": true,
              "definition": "Identification of the agency controlling the syntax and indication of syntax level.",
              "designator": "UNB01"
            },
            {
              "nodeKey": "element:UNB02:21:36",
              "type": "Data Element",
              "value": "<Sender GLN>:14",
              "components": [
                {
                  "nodeKey": "element:UNB0201:21:33",
                  "type": "Component Element",
                  "value": "<Sender GLN>",
                  "id": "0004",
                  "desc": "Sender identification",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 35,
                  "definition": "Name or coded representation of the sender of a data interchange.",
                  "designator": "UNB0201"
                },
                {
                  "nodeKey": "element:UNB0202:34:36",
                  "type": "Component Element",
                  "value": "14",
                  "id": "0007",
                  "desc": "Partner identification code qualifier",
                  "dataType": "AN",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 4,
                  "codeValue": "GS1",
                  "definition": "Qualifier referring to the source of codes for the identifiers of interchanging partners.",
                  "designator": "UNB0202"
                }
              ],
              "id": "S002",
              "desc": "Interchange sender",
              "required": true,
              "definition": "Identification of the sender of the interchange.",
              "designator": "UNB02"
            },
            {
              "nodeKey": "element:UNB03:37:54",
              "type": "Data Element",
              "value": "<Receiver GLN>:14",
              "components": [
                {
                  "nodeKey": "element:UNB0301:37:51",
                  "type": "Component Element",
                  "value": "<Receiver GLN>",
                  "id": "0010",
                  "desc": "Recipient identification",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 35,
                  "definition": "Name or coded representation of the recipient of a data interchange.",
                  "designator": "UNB0301"
                },
                {
                  "nodeKey": "element:UNB0302:52:54",
                  "type": "Component Element",
                  "value": "14",
                  "id": "0007",
                  "desc": "Partner identification code qualifier",
                  "dataType": "AN",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 4,
                  "codeValue": "GS1",
                  "definition": "Qualifier referring to the source of codes for the identifiers of interchanging partners.",
                  "designator": "UNB0302"
                }
              ],
              "id": "S003",
              "desc": "Interchange recipient",
              "required": true,
              "definition": "Identification of the recipient of the interchange.",
              "designator": "UNB03"
            },
            {
              "nodeKey": "element:UNB04:55:66",
              "type": "Data Element",
              "value": "140407:0910",
              "components": [
                {
                  "nodeKey": "element:UNB0401:55:61",
                  "type": "Component Element",
                  "value": "140407",
                  "id": "0017",
                  "desc": "Date of preparation",
                  "dataType": "N",
                  "required": true,
                  "minLength": 6,
                  "maxLength": 6,
                  "definition": "Local date when an interchange or a functional group was prepared.",
                  "designator": "UNB0401"
                },
                {
                  "nodeKey": "element:UNB0402:62:66",
                  "type": "Component Element",
                  "value": "0910",
                  "id": "0019",
                  "desc": "Time of preparation",
                  "dataType": "N",
                  "required": false,
                  "minLength": 4,
                  "maxLength": 4,
                  "definition": "Local time of day when an interchange or a functional group was prepared.",
                  "designator": "UNB0402"
                }
              ],
              "id": "S004",
              "desc": "Date/time of preparation",
              "required": true,
              "definition": "Date and time of preparation of the interchange.",
              "designator": "UNB04"
            },
            {
              "nodeKey": "element:UNB05:67:68",
              "type": "Data Element",
              "value": "5",
              "id": "0020",
              "desc": "Interchange control reference",
              "dataType": "AN",
              "required": true,
              "minLength": 1,
              "maxLength": 14,
              "definition": "Unique reference assigned by the sender to an interchange.",
              "designator": "UNB05"
            },
            {
              "nodeKey": "element:UNB06:69:78",
              "type": "Data Element",
              "value": "000000001",
              "components": [
                {
                  "nodeKey": "element:UNB0601:69:78",
                  "type": "Component Element",
                  "value": "000000001",
                  "id": "0022",
                  "desc": "Recipient's reference/password",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 14,
                  "definition": "Unique reference assigned by the recipient to the data interchange or a password to the recipient's system or to a third party network as specified in the partners interchange agreement.",
                  "designator": "UNB0601"
                }
              ],
              "id": "S005",
              "desc": "Recipient's reference, password",
              "required": false,
              "definition": "Reference or password as agreed between the communicating partners.",
              "designator": "UNB06"
            },
            {
              "nodeKey": "element:UNB07:79:79",
              "type": "Data Element",
              "value": "",
              "id": "0026",
              "desc": "Application reference",
              "dataType": "AN",
              "required": false,
              "minLength": 1,
              "maxLength": 14,
              "definition": "Identification of the application area assigned by the sender, to which the messages in the interchange relate e.g. the message identifier if all the messages in the interchange are of the same type.",
              "designator": "UNB07"
            },
            {
              "nodeKey": "element:UNB08:80:80",
              "type": "Data Element",
              "value": "",
              "id": "0029",
              "desc": "Processing priority code",
              "dataType": "AN",
              "required": false,
              "minLength": 1,
              "maxLength": 1,
              "definition": "Code determined by the sender requesting processing priority for the interchange.",
              "designator": "UNB08"
            },
            {
              "nodeKey": "element:UNB09:81:82",
              "type": "Data Element",
              "value": "1",
              "id": "0031",
              "desc": "Acknowledgement request",
              "dataType": "N",
              "required": false,
              "minLength": 1,
              "maxLength": 1,
              "codeValue": "Acknowledgement requested",
              "definition": "Code determined by the sender for acknowledgement of the interchange.",
              "designator": "UNB09"
            },
            {
              "nodeKey": "element:UNB10:83:89",
              "type": "Data Element",
              "value": "EANCOM",
              "id": "0032",
              "desc": "Communications agreement ID",
              "dataType": "AN",
              "required": false,
              "minLength": 1,
              "maxLength": 35,
              "definition": "Identification by name or code of the type of agreement under which the interchange takes place.",
              "designator": "UNB10"
            }
          ],
          "desc": "Interchange header",
          "purpose": "To start, identify and specify an interchange."
        },
        "endSegment": {
          "nodeKey": "segment:UNZ:682:689",
          "id": "UNZ",
          "segmentStr": "UNZ+1+5'",
          "elements": [
            {
              "nodeKey": "element:UNZ01:685:686",
              "type": "Data Element",
              "value": "1",
              "id": "0036",
              "desc": "Interchange control count",
              "required": true,
              "minLength": 1,
              "maxLength": 6,
              "definition": "Count either of the number of messages or, if used, of the number of functional groups in an interchange.",
              "designator": "UNZ01"
            },
            {
              "nodeKey": "element:UNZ02:687:688",
              "type": "Data Element",
              "value": "5",
              "id": "0020",
              "desc": "Interchange control reference",
              "required": true,
              "minLength": 1,
              "maxLength": 14,
              "definition": "Unique reference assigned by the sender to an interchange.",
              "designator": "UNZ02"
            }
          ],
          "desc": "Interchange trailer",
          "purpose": "To end and check the completeness of an interchange."
        }
      }
    ],
    "separatorsSegment": {
      "nodeKey": "segment:UNA:0:8",
      "id": "UNA",
      "segmentStr": "UNA:+.?*'",
      "elements": [
        {
          "nodeKey": "element:UNA01:3:3",
          "type": "Data Element",
          "value": ":",
          "id": "UNA01",
          "desc": "Sub-element delimiter",
          "required": true,
          "minLength": 1,
          "maxLength": 1,
          "definition": "Sub-element delimiter",
          "designator": "UNA01"
        },
        {
          "nodeKey": "element:UNA02:4:4",
          "type": "Data Element",
          "value": "+",
          "id": "UNA02",
          "desc": "Data element delimiter",
          "required": true,
          "minLength": 1,
          "maxLength": 1,
          "definition": "Data element delimiter",
          "designator": "UNA02"
        },
        {
          "nodeKey": "element:UNA03:5:5",
          "type": "Data Element",
          "value": ".",
          "id": "UNA03",
          "desc": "Decimal point indicator",
          "required": true,
          "minLength": 1,
          "maxLength": 1,
          "definition": "Decimal point indicator",
          "designator": "UNA03"
        },
        {
          "nodeKey": "element:UNA04:6:6",
          "type": "Data Element",
          "value": "?",
          "id": "UNA04",
          "desc": "Release character",
          "required": true,
          "minLength": 1,
          "maxLength": 1,
          "definition": "Release character",
          "designator": "UNA04"
        },
        {
          "nodeKey": "element:UNA05:7:7",
          "type": "Data Element",
          "value": "*",
          "id": "UNA05",
          "desc": "Space",
          "required": true,
          "minLength": 1,
          "maxLength": 1,
          "definition": "Space",
          "designator": "UNA05"
        }
      ],
      "desc": "Delimiter String Advice",
      "purpose": "To start, identify and specify an interchange."
    },
    "ediType": "edifact"
  };

  const vdaTestData: IEdiDocument =   {
    "interchanges": [
      {
        "nodeKey": "interchange:none:0:778",
        "meta": {},
        "functionalGroups": [
          {
            "nodeKey": "functional-group:none:0:778",
            "meta": {},
            "transactionSets": [
              {
                "nodeKey": "transaction-set:00001:0:778",
                "meta": {
                  "release": "02",
                  "version": "511",
                  "id": "00001"
                },
                "id": "00001",
                "segments": [
                  {
                    "nodeKey": "loop:512Loop:130:648",
                    "id": "512Loop",
                    "elements": [],
                    "desc": "Delivery Instruction Data",
                    "Loop": [
                      {
                        "nodeKey": "segment:512:130:258",
                        "id": "512",
                        "segmentStr": "51201030187      121115186      1211091514280009100                               CGF-56026482A 13     STL                      ",
                        "elements": [
                          {
                            "nodeKey": "element:51201:133:134",
                            "type": "Data Element",
                            "value": "01",
                            "desc": "Version Number",
                            "dataType": "N",
                            "required": true,
                            "length": 2,
                            "designator": "51201"
                          },
                          {
                            "nodeKey": "element:51202:135:137",
                            "type": "Data Element",
                            "value": "030",
                            "desc": "Plant Customer",
                            "dataType": "AN",
                            "required": true,
                            "codeValue": "Component plant Berlin",
                            "length": 3,
                            "designator": "51202"
                          },
                          {
                            "nodeKey": "element:51203:138:146",
                            "type": "Data Element",
                            "value": "187      ",
                            "desc": "New Call Off Number",
                            "dataType": "N",
                            "required": true,
                            "length": 9,
                            "designator": "51203"
                          },
                          {
                            "nodeKey": "element:51204:147:152",
                            "type": "Data Element",
                            "value": "121115",
                            "desc": "New Call Off Date",
                            "dataType": "N",
                            "required": true,
                            "length": 6,
                            "designator": "51204"
                          },
                          {
                            "nodeKey": "element:51205:153:161",
                            "type": "Data Element",
                            "value": "186      ",
                            "desc": "Old Call Off Number",
                            "dataType": "N",
                            "required": true,
                            "length": 9,
                            "designator": "51205"
                          },
                          {
                            "nodeKey": "element:51206:162:167",
                            "type": "Data Element",
                            "value": "121109",
                            "desc": "Old Call Off Date",
                            "dataType": "N",
                            "required": true,
                            "length": 6,
                            "designator": "51206"
                          },
                          {
                            "nodeKey": "element:51207:168:189",
                            "type": "Data Element",
                            "value": "1514280009100         ",
                            "desc": "Customer Part Number",
                            "dataType": "AN",
                            "required": true,
                            "length": 22,
                            "designator": "51207"
                          },
                          {
                            "nodeKey": "element:51208:190:211",
                            "type": "Data Element",
                            "value": "                      ",
                            "desc": "Supplier Part Number",
                            "dataType": "AN",
                            "required": false,
                            "length": 22,
                            "designator": "51208"
                          },
                          {
                            "nodeKey": "element:51209:212:223",
                            "type": "Data Element",
                            "value": "CGF-56026482",
                            "desc": "Purchase Order Number",
                            "dataType": "AN",
                            "required": false,
                            "length": 12,
                            "designator": "51209"
                          },
                          {
                            "nodeKey": "element:51210:224:228",
                            "type": "Data Element",
                            "value": "A 13 ",
                            "desc": "Unloading Point",
                            "dataType": "AN",
                            "required": true,
                            "length": 5,
                            "designator": "51210"
                          },
                          {
                            "nodeKey": "element:51211:229:232",
                            "type": "Data Element",
                            "value": "    ",
                            "desc": "Code Of Customer",
                            "dataType": "AN",
                            "required": true,
                            "length": 4,
                            "designator": "51211"
                          },
                          {
                            "nodeKey": "element:51212:233:234",
                            "type": "Data Element",
                            "value": "ST",
                            "desc": "Unit Of Measurement",
                            "dataType": "AN",
                            "required": true,
                            "codeValue": "Piece",
                            "length": 2,
                            "designator": "51212"
                          },
                          {
                            "nodeKey": "element:51213:235:235",
                            "type": "Data Element",
                            "value": "L",
                            "desc": "Delivery Interval",
                            "dataType": "AN",
                            "required": true,
                            "codeValue": "In accordance with delivery date",
                            "length": 1,
                            "designator": "51213"
                          },
                          {
                            "nodeKey": "element:51214:236:236",
                            "type": "Data Element",
                            "value": " ",
                            "desc": "Inclusive Production Release",
                            "dataType": "N",
                            "required": false,
                            "length": 1,
                            "designator": "51214"
                          },
                          {
                            "nodeKey": "element:51215:237:237",
                            "type": "Data Element",
                            "value": " ",
                            "desc": "Material Release",
                            "dataType": "N",
                            "required": false,
                            "length": 1,
                            "designator": "51215"
                          },
                          {
                            "nodeKey": "element:51216:238:238",
                            "type": "Data Element",
                            "value": " ",
                            "desc": "Code Usage",
                            "dataType": "AN",
                            "required": true,
                            "codeValue": "Invalid code value",
                            "length": 1,
                            "designator": "51216"
                          },
                          {
                            "nodeKey": "element:51217:239:245",
                            "type": "Data Element",
                            "value": "       ",
                            "desc": "Allocation",
                            "dataType": "AN",
                            "required": false,
                            "length": 7,
                            "designator": "51217"
                          },
                          {
                            "nodeKey": "element:51218:246:252",
                            "type": "Data Element",
                            "value": "       ",
                            "desc": "Warehouse Location",
                            "dataType": "AN",
                            "required": false,
                            "length": 7,
                            "designator": "51218"
                          },
                          {
                            "nodeKey": "element:51219:253:257",
                            "type": "Data Element",
                            "value": "     ",
                            "desc": "Empty",
                            "dataType": "AN",
                            "required": false,
                            "length": 5,
                            "designator": "51219"
                          }
                        ],
                        "desc": "Delivery Instruction Data"
                      },
                      {
                        "nodeKey": "segment:513:260:388",
                        "id": "513",
                        "segmentStr": "51301121113432701        0000003460000000019427121115000000000000000                                                            ",
                        "elements": [
                          {
                            "nodeKey": "element:51301:263:264",
                            "type": "Data Element",
                            "value": "01",
                            "desc": "Version Number",
                            "dataType": "N",
                            "required": true,
                            "length": 2,
                            "designator": "51301"
                          },
                          {
                            "nodeKey": "element:51302:265:270",
                            "type": "Data Element",
                            "value": "121113",
                            "desc": "Entry Date Last delivery",
                            "dataType": "N",
                            "required": true,
                            "length": 6,
                            "designator": "51302"
                          },
                          {
                            "nodeKey": "element:51303:271:278",
                            "type": "Data Element",
                            "value": "432701  ",
                            "desc": "Delivery Note Number last delivery",
                            "dataType": "N",
                            "required": true,
                            "length": 8,
                            "designator": "51303"
                          },
                          {
                            "nodeKey": "element:51304:279:284",
                            "type": "Data Element",
                            "value": "      ",
                            "desc": "Delivery Note Date last delivery",
                            "dataType": "N",
                            "required": true,
                            "length": 6,
                            "designator": "51304"
                          },
                          {
                            "nodeKey": "element:51305:285:296",
                            "type": "Data Element",
                            "value": "000000346000",
                            "desc": "Quantity Last Delivery",
                            "dataType": "N",
                            "required": true,
                            "length": 12,
                            "designator": "51305"
                          },
                          {
                            "nodeKey": "element:51306:297:306",
                            "type": "Data Element",
                            "value": "0000019427",
                            "desc": "Cumulative Figure",
                            "dataType": "N",
                            "required": true,
                            "length": 10,
                            "designator": "51306"
                          },
                          {
                            "nodeKey": "element:51307:307:312",
                            "type": "Data Element",
                            "value": "121115",
                            "desc": "Call Off Date 1",
                            "dataType": "N",
                            "required": true,
                            "length": 6,
                            "designator": "51307"
                          },
                          {
                            "nodeKey": "element:51308:313:321",
                            "type": "Data Element",
                            "value": "000000000",
                            "desc": "Call Off Quantity 1",
                            "dataType": "N",
                            "required": true,
                            "length": 9,
                            "designator": "51308"
                          },
                          {
                            "nodeKey": "element:51309:322:327",
                            "type": "Data Element",
                            "value": "000000",
                            "desc": "Call Off Date 2",
                            "dataType": "N",
                            "required": false,
                            "length": 6,
                            "designator": "51309"
                          },
                          {
                            "nodeKey": "element:51310:328:336",
                            "type": "Data Element",
                            "value": "         ",
                            "desc": "Call Off Quantity 2",
                            "dataType": "N",
                            "required": false,
                            "length": 9,
                            "designator": "51310"
                          },
                          {
                            "nodeKey": "element:51311:337:342",
                            "type": "Data Element",
                            "value": "      ",
                            "desc": "Call Off Date 3",
                            "dataType": "N",
                            "required": false,
                            "length": 6,
                            "designator": "51311"
                          },
                          {
                            "nodeKey": "element:51312:343:351",
                            "type": "Data Element",
                            "value": "         ",
                            "desc": "Call Off Quantity 3",
                            "dataType": "N",
                            "required": false,
                            "length": 9,
                            "designator": "51312"
                          },
                          {
                            "nodeKey": "element:51313:352:357",
                            "type": "Data Element",
                            "value": "      ",
                            "desc": "Call Off Date 4",
                            "dataType": "N",
                            "required": false,
                            "length": 6,
                            "designator": "51313"
                          },
                          {
                            "nodeKey": "element:51314:358:366",
                            "type": "Data Element",
                            "value": "         ",
                            "desc": "Call Off Quantity 4",
                            "dataType": "N",
                            "required": false,
                            "length": 9,
                            "designator": "51314"
                          },
                          {
                            "nodeKey": "element:51315:367:372",
                            "type": "Data Element",
                            "value": "      ",
                            "desc": "Call Off Date 5",
                            "dataType": "N",
                            "required": false,
                            "length": 6,
                            "designator": "51315"
                          },
                          {
                            "nodeKey": "element:51316:373:381",
                            "type": "Data Element",
                            "value": "         ",
                            "desc": "Call Off Quantity 5",
                            "dataType": "N",
                            "required": false,
                            "length": 9,
                            "designator": "51316"
                          },
                          {
                            "nodeKey": "element:51317:382:387",
                            "type": "Data Element",
                            "value": "      ",
                            "desc": "Empty",
                            "dataType": "AN",
                            "required": false,
                            "length": 6,
                            "designator": "51317"
                          }
                        ],
                        "desc": "Reconciliation and Schedule Data"
                      },
                      {
                        "nodeKey": "segment:515:390:518",
                        "id": "515",
                        "segmentStr": "5150100000013021300000000000000001303150000000000                               000000                                          ",
                        "elements": [
                          {
                            "nodeKey": "element:51501:393:394",
                            "type": "Data Element",
                            "value": "01",
                            "desc": "Version Number",
                            "dataType": "N",
                            "required": true,
                            "length": 2,
                            "designator": "51501"
                          },
                          {
                            "nodeKey": "element:51502:395:400",
                            "type": "Data Element",
                            "value": "000000",
                            "desc": "Production Authorisation, start date",
                            "dataType": "N",
                            "required": true,
                            "length": 6,
                            "designator": "51502"
                          },
                          {
                            "nodeKey": "element:51503:401:406",
                            "type": "Data Element",
                            "value": "130213",
                            "desc": "Production Authorisation, end date",
                            "dataType": "N",
                            "required": true,
                            "length": 6,
                            "designator": "51503"
                          },
                          {
                            "nodeKey": "element:51504:407:416",
                            "type": "Data Element",
                            "value": "0000000000",
                            "desc": "Production Authorisation, cumulative quantity",
                            "dataType": "N",
                            "required": true,
                            "length": 10,
                            "designator": "51504"
                          },
                          {
                            "nodeKey": "element:51505:417:422",
                            "type": "Data Element",
                            "value": "000000",
                            "desc": "Material Authorisation, start date",
                            "dataType": "N",
                            "required": true,
                            "length": 6,
                            "designator": "51505"
                          },
                          {
                            "nodeKey": "element:51506:423:428",
                            "type": "Data Element",
                            "value": "130315",
                            "desc": "Material Authorisation, end date",
                            "dataType": "N",
                            "required": true,
                            "length": 6,
                            "designator": "51506"
                          },
                          {
                            "nodeKey": "element:51507:429:438",
                            "type": "Data Element",
                            "value": "0000000000",
                            "desc": "Material Authorisation, cumulative demand",
                            "dataType": "N",
                            "required": true,
                            "length": 10,
                            "designator": "51507"
                          },
                          {
                            "nodeKey": "element:51508:439:460",
                            "type": "Data Element",
                            "value": "                      ",
                            "desc": "FPSD Article Code",
                            "dataType": "AN",
                            "required": false,
                            "length": 22,
                            "designator": "51508"
                          },
                          {
                            "nodeKey": "element:51509:461:469",
                            "type": "Data Element",
                            "value": "         ",
                            "desc": "Sub Supplier",
                            "dataType": "AN",
                            "required": false,
                            "length": 9,
                            "designator": "51509"
                          },
                          {
                            "nodeKey": "element:51510:470:475",
                            "type": "Data Element",
                            "value": "000000",
                            "desc": "Planning Horizon Date",
                            "dataType": "N",
                            "required": true,
                            "length": 6,
                            "designator": "51510"
                          },
                          {
                            "nodeKey": "element:51511:476:489",
                            "type": "Data Element",
                            "value": "              ",
                            "desc": "Point Of Use",
                            "dataType": "AN",
                            "required": false,
                            "length": 14,
                            "designator": "51511"
                          },
                          {
                            "nodeKey": "element:51512:490:499",
                            "type": "Data Element",
                            "value": "          ",
                            "desc": "Cumulative Received Quantity before resetting it to zero",
                            "dataType": "N",
                            "required": false,
                            "length": 10,
                            "designator": "51512"
                          },
                          {
                            "nodeKey": "element:51513:500:517",
                            "type": "Data Element",
                            "value": "                  ",
                            "desc": "Empty",
                            "dataType": "AN",
                            "required": false,
                            "length": 18,
                            "designator": "51513"
                          }
                        ],
                        "desc": "Supplementary Data"
                      },
                      {
                        "nodeKey": "segment:518:520:648",
                        "id": "518",
                        "segmentStr": "5180107-08140295/04                          23-09140029                                                                        ",
                        "elements": [
                          {
                            "nodeKey": "element:51801:523:524",
                            "type": "Data Element",
                            "value": "01",
                            "desc": "Version Number",
                            "dataType": "N",
                            "required": true,
                            "length": 2,
                            "designator": "51801"
                          },
                          {
                            "nodeKey": "element:51802:525:564",
                            "type": "Data Element",
                            "value": "07-08140295/04                          ",
                            "desc": "Call Off Text 1",
                            "dataType": "AN",
                            "required": true,
                            "length": 40,
                            "designator": "51802"
                          },
                          {
                            "nodeKey": "element:51803:565:604",
                            "type": "Data Element",
                            "value": "23-09140029                             ",
                            "desc": "Call Off Text 2",
                            "dataType": "AN",
                            "required": false,
                            "length": 40,
                            "designator": "51803"
                          },
                          {
                            "nodeKey": "element:51804:605:644",
                            "type": "Data Element",
                            "value": "                                        ",
                            "desc": "Call Off Text 3",
                            "dataType": "AN",
                            "required": false,
                            "length": 40,
                            "designator": "51804"
                          },
                          {
                            "nodeKey": "element:51805:645:647",
                            "type": "Data Element",
                            "value": "   ",
                            "desc": "Empty",
                            "dataType": "AN",
                            "required": false,
                            "length": 3,
                            "designator": "51805"
                          }
                        ],
                        "desc": "Text Data"
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "nodeKey": "segment:511:0:128",
                  "id": "511",
                  "segmentStr": "51102                  9999900001250124111231                                                                                   ",
                  "elements": [
                    {
                      "nodeKey": "element:51101:3:4",
                      "type": "Data Element",
                      "value": "02",
                      "desc": "Version Number",
                      "dataType": "N",
                      "required": true,
                      "length": 2,
                      "designator": "51101"
                    },
                    {
                      "nodeKey": "element:51102:5:13",
                      "type": "Data Element",
                      "value": "         ",
                      "desc": "Customer Number",
                      "dataType": "AN",
                      "required": true,
                      "length": 9,
                      "designator": "51102"
                    },
                    {
                      "nodeKey": "element:51103:14:22",
                      "type": "Data Element",
                      "value": "         ",
                      "desc": "Supplier Number",
                      "dataType": "AN",
                      "required": true,
                      "length": 9,
                      "designator": "51103"
                    },
                    {
                      "nodeKey": "element:51104:23:27",
                      "type": "Data Element",
                      "value": "99999",
                      "desc": "Old Transmission Number",
                      "dataType": "N",
                      "required": true,
                      "length": 5,
                      "designator": "51104"
                    },
                    {
                      "nodeKey": "element:51105:28:32",
                      "type": "Data Element",
                      "value": "00001",
                      "desc": "New Transmission Number",
                      "dataType": "N",
                      "required": true,
                      "length": 5,
                      "designator": "51105"
                    },
                    {
                      "nodeKey": "element:51106:33:38",
                      "type": "Data Element",
                      "value": "250124",
                      "desc": "Transmission Date",
                      "dataType": "N",
                      "required": true,
                      "length": 6,
                      "designator": "51106"
                    },
                    {
                      "nodeKey": "element:51107:39:44",
                      "type": "Data Element",
                      "value": "111231",
                      "desc": "Date Of Zero",
                      "dataType": "N",
                      "required": false,
                      "length": 6,
                      "designator": "51107"
                    },
                    {
                      "nodeKey": "element:51108:45:127",
                      "type": "Data Element",
                      "value": "                                                                                   ",
                      "desc": "Empty",
                      "dataType": "AN",
                      "required": false,
                      "length": 83,
                      "designator": "51108"
                    }
                  ],
                  "desc": "Interchange Header"
                },
                "endSegment": {
                  "nodeKey": "segment:519:650:778",
                  "id": "519",
                  "segmentStr": "5190100000010000001000000100000000000000000000100000010000001                                                                   ",
                  "elements": [
                    {
                      "nodeKey": "element:51901:653:654",
                      "type": "Data Element",
                      "value": "01",
                      "desc": "Version Number",
                      "dataType": "N",
                      "required": true,
                      "length": 2,
                      "designator": "51901"
                    },
                    {
                      "nodeKey": "element:51902:655:661",
                      "type": "Data Element",
                      "value": "0000001",
                      "desc": "Counter Record 511",
                      "dataType": "N",
                      "required": true,
                      "length": 7,
                      "designator": "51902"
                    },
                    {
                      "nodeKey": "element:51903:662:668",
                      "type": "Data Element",
                      "value": "0000001",
                      "desc": "Counter Record 512",
                      "dataType": "N",
                      "required": true,
                      "length": 7,
                      "designator": "51903"
                    },
                    {
                      "nodeKey": "element:51904:669:675",
                      "type": "Data Element",
                      "value": "0000001",
                      "desc": "Counter Record 513",
                      "dataType": "N",
                      "required": true,
                      "length": 7,
                      "designator": "51904"
                    },
                    {
                      "nodeKey": "element:51905:676:682",
                      "type": "Data Element",
                      "value": "0000000",
                      "desc": "Counter Record 514",
                      "dataType": "N",
                      "required": true,
                      "length": 7,
                      "designator": "51905"
                    },
                    {
                      "nodeKey": "element:51906:683:689",
                      "type": "Data Element",
                      "value": "0000000",
                      "desc": "Counter Record 517",
                      "dataType": "N",
                      "required": true,
                      "length": 7,
                      "designator": "51906"
                    },
                    {
                      "nodeKey": "element:51907:690:696",
                      "type": "Data Element",
                      "value": "0000001",
                      "desc": "Counter Record 518",
                      "dataType": "N",
                      "required": true,
                      "length": 7,
                      "designator": "51907"
                    },
                    {
                      "nodeKey": "element:51908:697:703",
                      "type": "Data Element",
                      "value": "0000001",
                      "desc": "Counter Record 519",
                      "dataType": "N",
                      "required": true,
                      "length": 7,
                      "designator": "51908"
                    },
                    {
                      "nodeKey": "element:51909:704:710",
                      "type": "Data Element",
                      "value": "0000001",
                      "desc": "Counter Record 515",
                      "dataType": "N",
                      "required": true,
                      "length": 7,
                      "designator": "51909"
                    },
                    {
                      "nodeKey": "element:51910:711:777",
                      "type": "Data Element",
                      "value": "                                                                   ",
                      "desc": "Empty",
                      "dataType": "AN",
                      "required": false,
                      "length": 67,
                      "designator": "51910"
                    }
                  ],
                  "desc": "Interchange Trailer"
                }
              }
            ]
          }
        ]
      }
    ],
    "ediType": "vda"
  };

  void x12TestData;
  void vdaTestData;
  return new EdiDocument(edifactTestData);
}
