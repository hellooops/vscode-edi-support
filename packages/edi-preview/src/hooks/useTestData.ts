import { EdiDocument } from "@/entities";

export default function useTestData(): EdiDocument {
  const x12TestData: IEdiDocument = {
    "interchanges": [
      {
        "key": "rqvGj9TmqEjv2Wy7YW6Kl",
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
            "key": "6fQ-NyFTp-JP_3apWSPhO",
            "meta": { "date": "20210517", "time": "0643", "id": "7080" },
            "id": "7080",
            "transactionSets": [
              {
                "key": "VedUI77nm1ttfBq9S4_vV",
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
                    "key": "9ECkRhq0IGhp5I8ucynwx",
                    "id": "BEG",
                    "desc": "Beginning Segment for Purchase Order",
                    "purpose": "To indicate the beginning of the Purchase Order Transaction Set and transmit identifying numbers and dates",
                    "elements": [
                      {
                        "key": "RrtoET_NMgZdYBJVQlR68",
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
                        "key": "tjJGNe7aRcZXG3T_ezENt",
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
                        "key": "ctg8x8BhHShXOoHKULb8K",
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
                        "key": "2lD4wmke0yFLnPGM_CeLE",
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
                        "key": "EtsRUulRPPIWuQH9RxfOw",
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
                    ]
                  },
                  {
                    "key": "jfSyqsRZibArIsSba5pfq",
                    "id": "REF",
                    "desc": "Reference Identification",
                    "purpose": "To specify identifying information",
                    "elements": [
                      {
                        "key": "K0kv7EFee1qK2eNlkE9D7",
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
                        "key": "sWM94TvDgg5folx-DQxSd",
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
                        "key": "FMcLcQzkrIC6Y9alihoyy",
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
                    ]
                  },
                  {
                    "key": "ezZqPM8NP2dTfNfQdjN63",
                    "id": "REF",
                    "desc": "Reference Identification",
                    "purpose": "To specify identifying information",
                    "elements": [
                      {
                        "key": "AvbJR1ixnUWlZG3cQYuPk",
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
                        "key": "uHW-x5ky14lcJf45jHBgc",
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
                        "key": "VSdVwUCQxXqTyETAqLRgj",
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
                    ]
                  },
                  {
                    "key": "Fl3pY4JfwZ5YeVoJpnRWh",
                    "id": "SACLoop1",
                    "desc": "Service, Promotion, Allowance, or Charge Information",
                    "purpose": "To request or identify a service, promotion, allowance, or charge; to specify the amount or percentage for the service, promotion, allowance, or charge",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "7eGveLEC4x8yUOVS5Es5Y",
                        "id": "SAC",
                        "desc": "Service, Promotion, Allowance, or Charge Information",
                        "purpose": "To request or identify a service, promotion, allowance, or charge; to specify the amount or percentage for the service, promotion, allowance, or charge",
                        "elements": [
                          {
                            "key": "J88lTMwhnUxOK9cx_k-d7",
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
                            "key": "FQawXL1Ci5pED5xFbj_uc",
                            "type": "Data Element",
                            "value": "",
                            "id": "1300",
                            "desc": "Service, Promotion, Allowance, or Charge Code",
                            "required": false,
                            "definition": "Code identifying the service, promotion, allowance, or charge",
                            "designator": "SAC02"
                          },
                          {
                            "key": "JBVG0-CTIboxfo-ohqtp-",
                            "type": "Data Element",
                            "value": "",
                            "id": "559",
                            "desc": "Agency Qualifier Code",
                            "required": false,
                            "definition": "Code identifying the agency assigning the code values",
                            "designator": "SAC03"
                          },
                          {
                            "key": "A5kir-p-VnbcsiHfTDuw1",
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
                        ]
                      },
                      {
                        "key": "gdAXAGEyRBjy7HTj-Klj1",
                        "id": "CUR",
                        "desc": "Currency",
                        "purpose": "To specify the currency (dollars, pounds, francs, etc.) used in a transaction",
                        "elements": [
                          {
                            "key": "GOYvP41vPq-31LNRDoBxW",
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
                            "key": "6GU3co6DHcX_-TLbWTF_h",
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
                            "key": "3Evj-H9zZv3K3BosMMgbQ",
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
                            "key": "hEwOKduU2aCm3Xvw6365w",
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
                            "key": "xHKxjMmGP8l_VawA_fS4_",
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
                        ]
                      }
                    ]
                  },
                  {
                    "key": "oWe083ycq4_c7VFqmVocH",
                    "id": "N1Loop1",
                    "desc": "Name",
                    "purpose": "To identify a party by type of organization, name, and code",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "DltT2GehNQrn8otfaCfE_",
                        "id": "N1",
                        "desc": "Name",
                        "purpose": "To identify a party by type of organization, name, and code",
                        "elements": [
                          {
                            "key": "22CzyX35wC99ueQynxfZL",
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
                            "key": "cN94xlX3F-AAAef-xvZeq",
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
                        ]
                      },
                      {
                        "key": "vUGdZBzSlq0qzV49ofBqs",
                        "id": "N2",
                        "desc": "Additional Name Information",
                        "purpose": "To specify additional names or those longer than 35 characters in length",
                        "elements": [
                          {
                            "key": "2kf0WoLruIvZjGs2TEmM_",
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
                        ]
                      },
                      {
                        "key": "VYVhV6VK4q5UgIxCIPagr",
                        "id": "N3",
                        "desc": "Address Information",
                        "purpose": "To specify the location of the named party",
                        "elements": [
                          {
                            "key": "NEM5JjAiPrHz4_0YtkqXV",
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
                            "key": "njzfvW5wLzWVeLkjrEgar",
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
                        ]
                      },
                      {
                        "key": "nBEh3BDLKPecZ0FLrG-Ke",
                        "id": "N4",
                        "desc": "Geographic Location",
                        "purpose": "To specify the geographic place of the named party",
                        "elements": [
                          {
                            "key": "3U6_JURhhq6sqhgEVq-RC",
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
                            "key": "usFEbUsSesyJqPZFLTpKQ",
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
                            "key": "ZZtdNnDIHgW4j_V5JiOSm",
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
                            "key": "umsOqx-KvGUhFNIjHJ7Lr",
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
                        ]
                      },
                      {
                        "key": "L8dML2pif3LYxgAp072UE",
                        "id": "PER",
                        "desc": "Administrative Communications Contact",
                        "purpose": "To identify a person or office to whom administrative communications should be directed",
                        "elements": [
                          {
                            "key": "zSjUwrNXHWWebMloNCEfO",
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
                            "key": "lqiS5BM5y5bAa3h546NSc",
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
                            "key": "Xh1Dv1a_pRJB5EA4OU6JK",
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
                            "key": "QiPKSk7ZjLSg_qm0pIBg-",
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
                            "key": "ublwNBGNeDq_JHLQrGLlg",
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
                            "key": "CRurjbtJ1rqwYPGvjOP9N",
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
                        ]
                      }
                    ]
                  },
                  {
                    "key": "ph0jNJ44il5ayN2WdjUxy",
                    "id": "N1Loop1",
                    "desc": "Name",
                    "purpose": "To identify a party by type of organization, name, and code",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "cdSOBFXOzlenMl1JLn98T",
                        "id": "N1",
                        "desc": "Name",
                        "purpose": "To identify a party by type of organization, name, and code",
                        "elements": [
                          {
                            "key": "dWlH6jNZiDLLTZtzPrbh_",
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
                            "key": "WAAarj6iUDj9TleMMouD2",
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
                        ]
                      },
                      {
                        "key": "zIKQpFcG4bw6Vk_8eN2W3",
                        "id": "N2",
                        "desc": "Additional Name Information",
                        "purpose": "To specify additional names or those longer than 35 characters in length",
                        "elements": [
                          {
                            "key": "W5micmt_1xYVf2LyIImR1",
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
                        ]
                      },
                      {
                        "key": "YjzvjDupz_v-Pdo25wqDr",
                        "id": "N3",
                        "desc": "Address Information",
                        "purpose": "To specify the location of the named party",
                        "elements": [
                          {
                            "key": "mfIq3JzllfBzZzYAZ6KR_",
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
                        ]
                      },
                      {
                        "key": "e-uhx-uhRZ_3NSNwGW7yX",
                        "id": "N4",
                        "desc": "Geographic Location",
                        "purpose": "To specify the geographic place of the named party",
                        "elements": [
                          {
                            "key": "hUITyY_ZSNNqiK0Hn9Ksl",
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
                            "key": "8GdxMGAQ_n_-IBwDTK6dI",
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
                            "key": "49HNG6BCQ5ryCidRhq0gP",
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
                            "key": "5obd4If0WVAnyKPOcR9WB",
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
                        ]
                      },
                      {
                        "key": "BfMuX3YRpHOos5tUQ91nZ",
                        "id": "PER",
                        "desc": "Administrative Communications Contact",
                        "purpose": "To identify a person or office to whom administrative communications should be directed",
                        "elements": [
                          {
                            "key": "CQdfpSZ9d8r8eesLTIzOa",
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
                            "key": "WGyLqujZ1TjV0oj1qDROu",
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
                            "key": "7A-E7Crdcq10-E9dlYLm9",
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
                            "key": "nlQUOwoPjH4CosBKsjbTM",
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
                            "key": "luVhkw6GiUYACvntQmqUe",
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
                            "key": "neHwgFLrUjqbK-JGyxL8Y",
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
                        ]
                      }
                    ]
                  },
                  {
                    "key": "FkJ2HgXmAiNPrN29Q5hlj",
                    "id": "PO1Loop1",
                    "desc": "Baseline Item Data",
                    "purpose": "To specify basic and most frequently used line item data",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "tVmyguQ-FOcKJCzOY0CnV",
                        "id": "PO1",
                        "desc": "Baseline Item Data",
                        "purpose": "To specify basic and most frequently used line item data",
                        "elements": [
                          {
                            "key": "UHw1EsyRYFJN9qHjoU3-i",
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
                            "key": "QgULwVV5SiVATnflrFE29",
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
                            "key": "tLXqCfkn5-dvbOVjd1dqe",
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
                            "key": "MsFVVpkfkTvyZHSSqI_1L",
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
                            "key": "jGiGu1TzxhaEibyv6U9tt",
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
                            "key": "14w6xXRk2z9XCXDVP4Hbg",
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
                            "key": "Amg41hFyaKFia38eOmI9_",
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
                            "key": "ahd-TtnLdVgzXzgKGdPml",
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
                            "key": "1rr0wPi5oqX6MM6PDtnnM",
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
                            "key": "vgQlswUSMHLdyfKOehAY0",
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
                            "key": "PnJlFthoMhPWS9pYqog76",
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
                            "key": "xI9jdHJknyvKBAcVTsTNn",
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
                            "key": "G01QTzCJCulEYnIusqNiW",
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
                            "key": "MeN_u1Np0mX9zYsjWNGPP",
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
                            "key": "e-36P8f10Rv4IvHiQJ31x",
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
                        ]
                      },
                      {
                        "key": "qOK82662ytV4E9RM6ZZA4",
                        "id": "PIDLoop1",
                        "desc": "Product/Item Description",
                        "purpose": "To describe a product or process in coded or free-form format",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "YFewNq0EOwGTjqE7I6X0G",
                            "id": "PID",
                            "desc": "Product/Item Description",
                            "purpose": "To describe a product or process in coded or free-form format",
                            "elements": [
                              {
                                "key": "wtZn_BsNEQ_0Cx7A-xXn9",
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
                                "key": "N7D9RB3buj31T5FFyOldf",
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
                                "key": "Z-PyiA1BRwdA-9pGRqzoO",
                                "type": "Data Element",
                                "value": "",
                                "id": "559",
                                "desc": "Agency Qualifier Code",
                                "required": false,
                                "definition": "Code identifying the agency assigning the code values",
                                "designator": "PID03"
                              },
                              {
                                "key": "qU7irNL4OPBK2xalRfRUY",
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
                                "key": "U9H1K1k7_E7f98nQm8H_j",
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
                            ]
                          }
                        ]
                      },
                      {
                        "key": "YxjHYC1Z5sq6Wly8_oAZv",
                        "id": "MSG",
                        "desc": "Message Text",
                        "purpose": "To provide a free-form format that allows the transmission of text information",
                        "elements": [
                          {
                            "key": "9wQEjEDXGbkduTbAvj55f",
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
                        ]
                      },
                      {
                        "key": "wqHURt5g0JhSDcH5AcGPC",
                        "id": "PKGLoop1",
                        "desc": "Marking, Packaging, Loading",
                        "purpose": "To describe marking, packaging, loading, and unloading requirements",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "GWIvQoEpgaMqSrtVPEBiH",
                            "id": "PKG",
                            "desc": "Marking, Packaging, Loading",
                            "purpose": "To describe marking, packaging, loading, and unloading requirements",
                            "elements": [
                              {
                                "key": "5yrxW3z0U-npVV-FpJgCp",
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
                                "key": "tMmX9u0gnsURrpB1S8xl4",
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
                                "key": "_jiI1k_lTw0CY-v2oQUCh",
                                "type": "Data Element",
                                "value": "",
                                "id": "559",
                                "desc": "Agency Qualifier Code",
                                "required": false,
                                "definition": "Code identifying the agency assigning the code values",
                                "designator": "PKG03"
                              },
                              {
                                "key": "aixGuvzcbGq5jwXQunqIa",
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
                                "key": "nhFSK6qTm2hatc3XtalpX",
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
                            ]
                          }
                        ]
                      },
                      {
                        "key": "EZMxJ7rF0Cmq2Of_BozeO",
                        "id": "N9Loop2",
                        "desc": "Reference Identification",
                        "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "Tm7-ZJIg9lGhKo24ZHAXO",
                            "id": "N9",
                            "desc": "Reference Identification",
                            "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                            "elements": [
                              {
                                "key": "5-y_pBqxlt_sFLJh89RrQ",
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
                                "key": "oqT1SUIKWWVxraf05hzRT",
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
                                "key": "XGsDzYbKcgYPGcyu120k6",
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
                            ]
                          }
                        ]
                      },
                      {
                        "key": "4x1POo2-FvCSIWIuhIDLE",
                        "id": "N9Loop2",
                        "desc": "Reference Identification",
                        "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "l_RFCLw8-ylMpAIKLmTgh",
                            "id": "N9",
                            "desc": "Reference Identification",
                            "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                            "elements": [
                              {
                                "key": "maqpZUfxEjMJ2uq6JlRSA",
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
                                "key": "eiLVdIYFgiJQMqdNfCvzX",
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
                                "key": "0jLn4nuffN1fZHi2GW4Bm",
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
                            ]
                          }
                        ]
                      },
                      {
                        "key": "98iyUtsFFqT0Suk40sIu2",
                        "id": "N1Loop3",
                        "desc": "Name",
                        "purpose": "To identify a party by type of organization, name, and code",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "6e7o-TaVJSsnRXIAsIndL",
                            "id": "N1",
                            "desc": "Name",
                            "purpose": "To identify a party by type of organization, name, and code",
                            "elements": [
                              {
                                "key": "V_xMhVBFQJNufeN9_AzW5",
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
                                "key": "u4YeYTOYM7JwCdd28rjf1",
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
                            ]
                          },
                          {
                            "key": "nNiJacIdZhZ9cjEVhktVF",
                            "id": "LDTLoop2",
                            "desc": "Lead Time",
                            "purpose": "To specify lead time for availability of products and services",
                            "elements": [],
                            "Loop": [
                              {
                                "key": "sXpQSS_wDdRFpAoiqMStv",
                                "id": "LDT",
                                "desc": "Lead Time",
                                "purpose": "To specify lead time for availability of products and services",
                                "elements": [
                                  {
                                    "key": "Qu2Jwue_Yq96SA3bg5XLI",
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
                                    "key": "RPCeKiiOh_NLDxCkkgRN9",
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
                                    "key": "UYB5uvZjGAUh45jR-PSwk",
                                    "type": "Data Element",
                                    "value": "AA",
                                    "id": "344",
                                    "desc": "Unit of Time Period or Interval",
                                    "required": true,
                                    "codeValue": "",
                                    "definition": "Code indicating the time period or interval",
                                    "designator": "LDT03"
                                  }
                                ]
                              },
                              {
                                "key": "9B0OfD5J9ciUb9XNYUaEr",
                                "id": "QTY",
                                "desc": "Quantity",
                                "purpose": "To specify quantity information",
                                "elements": [
                                  {
                                    "key": "OQ2grPQ8yFRyVfFvDAZaE",
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
                                    "key": "BH83ZIUnFH9VnY9xleRND",
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
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "key": "ZEmTKjFIHBRBn9DXkA1zv",
                        "id": "SLNLoop1",
                        "desc": "Subline Item Detail",
                        "purpose": "To specify product subline detail item data",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "8Su9gH8f9PK_2Rm34yeVb",
                            "id": "SLN",
                            "desc": "Subline Item Detail",
                            "purpose": "To specify product subline detail item data",
                            "elements": [
                              {
                                "key": "_cP0LLBIeahsxkULYTpjd",
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
                                "key": "jvJLJgCVxJ5ctUP7Hu43_",
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
                                "key": "yhMdimmdI9Z4b4WflBgmY",
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
                                "key": "GR_sPmNv0CyahRDZLMa_7",
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
                                "key": "kfSmcR2Ogyx9nJ_6ICVc7",
                                "type": "Data Element",
                                "value": "EA",
                                "components": [
                                  {
                                    "key": "uDyzi9bYBQ-cUEtTftt7t",
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
                                "definition": "To identify a composite unit of measure\\n\\n(See Figures Appendix for examples of use)",
                                "designator": "SLN05"
                              },
                              {
                                "key": "_kIo72WDg7y01UPbafOuc",
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
                                "key": "jY5m_OCU75Acn6cMpMU8w",
                                "type": "Data Element",
                                "value": "",
                                "id": "639",
                                "desc": "Basis of Unit Price Code",
                                "required": false,
                                "definition": "Code identifying the type of unit price for an item",
                                "designator": "SLN07"
                              },
                              {
                                "key": "ZHO2pXSCFLkSBs1pGrnvv",
                                "type": "Data Element",
                                "value": "",
                                "id": "662",
                                "desc": "Relationship Code",
                                "required": false,
                                "definition": "Code indicating the relationship between entities",
                                "designator": "SLN08"
                              },
                              {
                                "key": "-8G1nkTYKcDDpZ9Q5ug8V",
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
                                "key": "79Ys-jA4XkF8WmHztijRI",
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
                                "key": "BEFuWr0h16z0Z_0NEydNB",
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
                                "key": "fuY4ZxeieG_BoYr5SR7xU",
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
                                "key": "Q6R_JLBcY9tyVhsgquOJA",
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
                                "key": "D_mh9lMSBerLOBaR8fPQJ",
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
                                "key": "iZAVAVhPI42B-bsEOnDZi",
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
                                "key": "Cc0aBmeK3fWnjgcJoB8pB",
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
                                "key": "CiaHSMH7WiHvlG1WwhAe3",
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
                                "key": "MQVQqDXVRRpG1gKpO146V",
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
                            ]
                          },
                          {
                            "key": "VAmF9DABShEhhttt5PIPu",
                            "id": "PID",
                            "desc": "Product/Item Description",
                            "purpose": "To describe a product or process in coded or free-form format",
                            "elements": [
                              {
                                "key": "R2bZDmEjFWQ5OneMBB88u",
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
                                "key": "BNsKiPtNrs995_f2R9Ebb",
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
                                "key": "Fr3u3OOYK5sWT_YnttJPv",
                                "type": "Data Element",
                                "value": "",
                                "id": "559",
                                "desc": "Agency Qualifier Code",
                                "required": false,
                                "definition": "Code identifying the agency assigning the code values",
                                "designator": "PID03"
                              },
                              {
                                "key": "Ps7J8yHo9SSxv-t5wWoR4",
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
                                "key": "S098T-R7V8r0DmGLcOjSX",
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
                            ]
                          },
                          {
                            "key": "E-UjEokYT6WSETtcxryj_",
                            "id": "N9Loop3",
                            "desc": "Reference Identification",
                            "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                            "elements": [],
                            "Loop": [
                              {
                                "key": "gGddY_4AWUeiMxvjcsFhS",
                                "id": "N9",
                                "desc": "Reference Identification",
                                "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                                "elements": [
                                  {
                                    "key": "utAgoXdBuuWr50UI8Nrnr",
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
                                    "key": "wJsnjBViwdaJS4KUJWye7",
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
                                    "key": "tqp_Sk1bjTyfe31AakOdC",
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
                                ]
                              },
                              {
                                "key": "JHWH3t2jbik-W3fPa3fme",
                                "id": "MSG",
                                "desc": "Message Text",
                                "purpose": "To provide a free-form format that allows the transmission of text information",
                                "elements": [
                                  {
                                    "key": "xI3bK3bIrIDCvE57UhHRn",
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
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "S2DkcCd52OIKmrPcJD4ZR",
                    "id": "PO1Loop1",
                    "desc": "Baseline Item Data",
                    "purpose": "To specify basic and most frequently used line item data",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "TC0XFwv7rertyadelxCOm",
                        "id": "PO1",
                        "desc": "Baseline Item Data",
                        "purpose": "To specify basic and most frequently used line item data",
                        "elements": [
                          {
                            "key": "b5mFFL0CRx5xqkroBzHG2",
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
                            "key": "jP_uLpI2UoyLBbk-8MQVi",
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
                            "key": "wibIUSY6jy4g70lcpRk3M",
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
                            "key": "UMlUqzzcIpku94REA3rlJ",
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
                            "key": "HDFKLOvRxPVZeeHf8kxKS",
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
                            "key": "JoUyC4mcmdn86OPrZKrTD",
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
                            "key": "xQ9RySTq4tgH-ge1EfhJC",
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
                        ]
                      }
                    ]
                  },
                  {
                    "key": "cwGvCtUVg2de5S3UQJILU",
                    "id": "CTTLoop1",
                    "desc": "Transaction Totals",
                    "purpose": "To transmit a hash total for a specific element in the transaction set",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "uBjI3P1SL9vpodv1WYnM2",
                        "id": "CTT",
                        "desc": "Transaction Totals",
                        "purpose": "To transmit a hash total for a specific element in the transaction set",
                        "elements": [
                          {
                            "key": "d5ZgudMe3WBDI_1UGHboA",
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
                            "key": "3W8wo_dopME9viLrLQdOI",
                            "type": "Data Element",
                            "value": "200",
                            "id": "347",
                            "desc": "Hash Total",
                            "dataType": "R",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 10,
                            "definition": "Sum of values of the specified data element. All values in the data element will be summed without regard to decimal points (explicit or implicit) or signs. Truncation will occur on the left most digits if the sum is greater than the maximum size of the hash total of the data element.\\n\\nExample:\\n-.0018 First occurrence of value being hashed.\\n.18 Second occurrence of value being hashed.\\n1.8 Third occurrence of value being hashed.\\n18.01 Fourth occurrence of value being hashed.\\n---------\\n1855 Hash total prior to truncation.\\n855 Hash total after truncation to three-digit field.",
                            "designator": "CTT02"
                          }
                        ]
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "key": "DhL1qt-ezT_YEoVcBIv1G",
                  "id": "ST",
                  "desc": "Transaction Set Header",
                  "purpose": "To indicate the start of a transaction set and to assign a control number",
                  "elements": [
                    {
                      "key": "IL1ggpJCVNHlA3e35tX7Q",
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
                      "key": "PuyHJ9-l3_m53PtIRuijc",
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
                  ]
                },
                "endSegment": {
                  "key": "vDZusoTGSpo9GzIE6lZ6I",
                  "id": "SE",
                  "desc": "Transaction Set Trailer",
                  "purpose": "To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)",
                  "elements": [
                    {
                      "key": "R5cQ-BelK-Db56G5pIhAw",
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
                      "key": "yyDXLy_WTlzpBj82h-xos",
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
                  ]
                }
              }
            ],
            "startSegment": {
              "key": "d77Wln2amdJQKQo4GpPY2",
              "id": "GS",
              "desc": "Functional Group Header",
              "purpose": "To indicate the beginning of a functional group and to provide control information",
              "elements": [
                {
                  "key": "MI9Sdsu2VSfvSroiu95HT",
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
                  "key": "Tek_M-FDzBE99EQtBuk91",
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
                  "key": "3z4CdYde5EXTZFogLKdOz",
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
                  "key": "YLs9vsAx63TTTze-1YGMf",
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
                  "key": "clzCQTGkr43evBag3PJ6j",
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
                  "key": "foNW4dQNcDt54QJsWf12w",
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
                  "key": "Com6NpvtMMLx_XS5Looup",
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
                  "key": "NT827h2drcEs5msik5238",
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
              ]
            },
            "endSegment": {
              "key": "LrWqYiq4qBj2GPQJhyTzX",
              "id": "GE",
              "desc": "Functional Group Trailer",
              "purpose": "To indicate the end of a functional group and to provide control information",
              "elements": [
                {
                  "key": "SPqVUipbJR2qLlUpY7LNf",
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
                  "key": "vhawzNOvPAVVnvNaKlr03",
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
              ]
            }
          }
        ],
        "startSegment": {
          "key": "wHB_DwHaIPNzaujeh-TYn",
          "id": "ISA",
          "desc": "Interchange Control Header",
          "purpose": "To start and identify an interchange of zero or more functional groups and interchange-related control segments",
          "elements": [
            {
              "key": "EumOwQGDzAVZGxQfFlmMd",
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
              "key": "IbYetD7tyd84-7xLae40Q",
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
              "key": "VBCLZhiavbtgkqxTdHZEQ",
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
              "key": "Iu8kAvAA-04ye0uoVqdnO",
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
              "key": "5rL3c6ma984dCBhDCVlz3",
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
              "key": "AHJww4tVqM5Dh4DIMzAKf",
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
              "key": "fxRQ_RTYyYkJbBbiHb9EM",
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
              "key": "Mj1u8ZiQSkUMXagAnYffD",
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
              "key": "0rH5U89X6FIksD--S67PL",
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
              "key": "mZJxH-a1RR74knrBLvrMP",
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
              "key": "0ZpUIAegeXmYOTCimHIUj",
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
              "key": "jIRdItA7HJRyu9vsvyiXp",
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
              "key": "m4PKf7akF5wzOEixAN0Sz",
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
              "key": "uK-Grf1VYPvPBzIMJnEYT",
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
              "key": "UtYmBdc_rKyNYBrlts4wS",
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
              "key": "aLbg5uIP6zyXQFlxviHZV",
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
          ]
        },
        "endSegment": {
          "key": "cam_46AhS0Jzn_EENJii2",
          "id": "IEA",
          "desc": "Interchange Control Trailer",
          "purpose": "To define the end of an interchange of zero or more functional groups and interchange-related control segments",
          "elements": [
            {
              "key": "3UepDz3jM23EbCQv_iIpH",
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
              "key": "BbU7dH7Wjz-JNijeHldvC",
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
          ]
        }
      }
    ],
    "ediType": "x12"
  };
  

  const edifactTestData: IEdiDocument = {
    "interchanges": [
      {
        "key": "WLMdasynygbRaVqJhUjEK",
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
            "key": "2EyBXWpF18-84j-urg21p",
            "meta": {},
            "id": "",
            "transactionSets": [
              {
                "key": "3zZTOyrXeBclREr24zDA0",
                "meta": {
                  "id": "001",
                  "version": "ORDERS",
                  "messageInfo": {
                    "name": "Purchase order",
                    "version": "ORDERS",
                    "introduction": "A message specifying details for goods or services ordered under conditions agreed between the seller and the buyer."
                  },
                  "release": "D96A"
                },
                "id": "001",
                "segments": [
                  {
                    "key": "wdxUG9u-bE1MyXSOIEG7x",
                    "id": "BGM",
                    "desc": "BEGINNING OF MESSAGE",
                    "purpose": "To indicate the type and function of a message and to transmit the identifying number.",
                    "elements": [
                      {
                        "key": "0JP3DKLO5IGJOK6k6icPw",
                        "type": "Data Element",
                        "value": "220",
                        "components": [
                          {
                            "key": "wSz1GYrI1DdblhlUtjDxq",
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
                        "key": "XY2xJ_epXWFbrT9XDZcLp",
                        "type": "Data Element",
                        "value": "PO1",
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
                        "key": "U_rR4dxQdZJ87OYLykBDF",
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
                    ]
                  }
                ],
                "startSegment": {
                  "key": "P1e6I7RC_ZvRQxeZPzUlt",
                  "id": "UNH",
                  "desc": "Message header",
                  "purpose": "To head, identify and specify a message.",
                  "elements": [
                    {
                      "key": "Rz4u5WDLudY6cJiA6p_Ey",
                      "type": "Data Element",
                      "value": "001",
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
                      "key": "y-JgLkRsbSv9IMLszCNQa",
                      "type": "Data Element",
                      "value": "ORDERS:D:96A:UN:EAN001",
                      "components": [
                        {
                          "key": "9HEgQfvnZfiqBfVzbRBEB",
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
                          "key": "39SEfOKABTT7cFRuffJzA",
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
                          "key": "bp7SwcYBOi0Ei-PvJzkp2",
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
                          "key": "S5Qt55ewTTz5tMzfaaGwY",
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
                          "key": "d0r2ecdFj5QbBIYnWe1rh",
                          "type": "Component Element",
                          "value": "EAN001",
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
                  ]
                },
                "endSegment": {
                  "key": "iQsiCvZbtKrahe7Z2f1rr",
                  "id": "UNT",
                  "desc": "Message trailer",
                  "purpose": "To end and check the completeness of a message.",
                  "elements": [
                    {
                      "key": "yMIlE_2dRX1uluOMpk4M2",
                      "type": "Data Element",
                      "value": "3",
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
                      "key": "1RmUGFuob4386WLGFWRIU",
                      "type": "Data Element",
                      "value": "001",
                      "id": "0062",
                      "desc": "MESSAGE REFERENCE NUMBER",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 14,
                      "definition": "Unique message reference assigned by the sender.",
                      "designator": "UNT02"
                    }
                  ]
                }
              },
              {
                "key": "iN5i-tnbOSEo2-qsOL3nx",
                "meta": {
                  "id": "002",
                  "version": "DESADV",
                  "messageInfo": {
                    "name": "Despatch advice",
                    "version": "DESADV",
                    "introduction": "A message specifying details for goods despatched or ready for despatch under agreed conditions.\\nThe United Nations Despatch Advice Message serves both as a specification for Delivery Despatch Advice and also as a Returns Despatch Advice message. Throughout this document, the reference to 'Despatch Advice' may be interpreted as conveying the wider meaning of 'Delivery Despatch Advice/Returns Despatch Advice'."
                  },
                  "release": "D96A"
                },
                "id": "002",
                "segments": [
                  {
                    "key": "iR-P_ODD2tJjFbebmlWmi",
                    "id": "BGM",
                    "desc": "BEGINNING OF MESSAGE",
                    "purpose": "To indicate the type and function of a message and to transmit the identifying number.",
                    "elements": [
                      {
                        "key": "Y8eRmSlYXD4myepKJDJJg",
                        "type": "Data Element",
                        "value": "351",
                        "components": [
                          {
                            "key": "-8gOflv4Ral89yf0PGGL-",
                            "type": "Component Element",
                            "value": "351",
                            "id": "1001",
                            "desc": "Document/message name, coded",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Despatch advice",
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
                        "key": "DPWX1mWJ-f-p55NVb9EJx",
                        "type": "Data Element",
                        "value": "20171229",
                        "id": "1004",
                        "desc": "DOCUMENT/MESSAGE NUMBER",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 0,
                        "maxLength": 35,
                        "definition": "Reference number assigned to the document/message by the issuer.",
                        "designator": "BGM02"
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "key": "qmAQ5ZYxIKkr8nFS2uyl2",
                  "id": "UNH",
                  "desc": "Message header",
                  "purpose": "To head, identify and specify a message.",
                  "elements": [
                    {
                      "key": "KAImJ854An0C485ab7xPS",
                      "type": "Data Element",
                      "value": "002",
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
                      "key": "Hu9OftGhiDhFChtvg0_0o",
                      "type": "Data Element",
                      "value": "DESADV:D:96A:UN:EAN001",
                      "components": [
                        {
                          "key": "JJrEOWMR3ZGBhGzNfxL6W",
                          "type": "Component Element",
                          "value": "DESADV",
                          "id": "0065",
                          "desc": "Message type identifier",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 6,
                          "codeValue": "Despatch advice message",
                          "definition": "Code identifying a type of message and assigned by its controlling agency.",
                          "designator": "UNH0201"
                        },
                        {
                          "key": "ZwSPf3zXhMJdTTI2Bg_XU",
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
                          "key": "gOeGqVzO8D_SrPsf5e-1G",
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
                          "key": "9Cb_tjue8k4r57FqAk0yl",
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
                          "key": "hiw-m100GooVmw_Q-NuLV",
                          "type": "Component Element",
                          "value": "EAN001",
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
                  ]
                },
                "endSegment": {
                  "key": "so6DnUKTmJkTEu1pLJ5Kw",
                  "id": "UNT",
                  "desc": "Message trailer",
                  "purpose": "To end and check the completeness of a message.",
                  "elements": [
                    {
                      "key": "m7KQjALYj-UDKhvGwGMW4",
                      "type": "Data Element",
                      "value": "3",
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
                      "key": "bv7z_NNEb5usQ_Qo07iQd",
                      "type": "Data Element",
                      "value": "002",
                      "id": "0062",
                      "desc": "MESSAGE REFERENCE NUMBER",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 14,
                      "definition": "Unique message reference assigned by the sender.",
                      "designator": "UNT02"
                    }
                  ]
                }
              }
            ]
          }
        ],
        "startSegment": {
          "key": "4ydJ8uGra-JlTsEDVNBt3",
          "id": "UNB",
          "desc": "Interchange header",
          "purpose": "To start, identify and specify an interchange.",
          "elements": [
            {
              "key": "S5haD5VUndRDM_0OhLGJ6",
              "type": "Data Element",
              "value": "UNOA:2",
              "components": [
                {
                  "key": "m25ZMnr0CDEbysXVRv9Yw",
                  "type": "Component Element",
                  "value": "UNOA",
                  "id": "0001",
                  "desc": "Syntax identifier",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 4,
                  "maxLength": 4,
                  "definition": "Coded identification of the agency controlling a syntax and syntax level used in an interchange.",
                  "designator": "UNB0101"
                },
                {
                  "key": "MufpRhuGLUHkDLrhy3N0O",
                  "type": "Component Element",
                  "value": "2",
                  "id": "0002",
                  "desc": "Syntax version number",
                  "dataType": "N",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 1,
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
              "key": "z806FUQDVRdyTf856aD9h",
              "type": "Data Element",
              "value": "<Sender GLN>:14",
              "components": [
                {
                  "key": "_YMLUHHi6JT8WsEsFzmfG",
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
                  "key": "-pClHHk7Aflv8BuTY_gQP",
                  "type": "Component Element",
                  "value": "14",
                  "id": "0007",
                  "desc": "Partner identification code qualifier",
                  "dataType": "AN",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 4,
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
              "key": "JtoqS5N_3g6laPZ80As5M",
              "type": "Data Element",
              "value": "<Receiver GLN>:14",
              "components": [
                {
                  "key": "5_u292KHV3kT6p1ojFjkd",
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
                  "key": "-OsfgfjBYOj5rqxEprITL",
                  "type": "Component Element",
                  "value": "14",
                  "id": "0007",
                  "desc": "Partner identification code qualifier",
                  "dataType": "AN",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 4,
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
              "key": "8FNqbU-qBcjB0ZStYDnsR",
              "type": "Data Element",
              "value": "140407:0910",
              "components": [
                {
                  "key": "nR0ojekcgYH-VFr1xuMUl",
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
                  "key": "PUrp5aMEhyTZgaeY9hNxi",
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
              "key": "cK0q-vowfN0_D0h9gpJFS",
              "type": "Data Element",
              "value": "0001",
              "id": "0020",
              "desc": "Interchange control reference",
              "dataType": "AN",
              "required": true,
              "minLength": 1,
              "maxLength": 14,
              "definition": "Unique reference assigned by the sender to an interchange.",
              "designator": "UNB05"
            }
          ]
        },
        "endSegment": {
          "key": "j14hAnrsxxYVtxh1DD0Vx",
          "id": "UNZ",
          "desc": "Interchange trailer",
          "purpose": "To end and check the completeness of an interchange.",
          "elements": [
            {
              "key": "5g4YmmJnBFhz5JxXRQuFm",
              "type": "Data Element",
              "value": "2",
              "id": "0036",
              "desc": "Interchange control count",
              "required": true,
              "minLength": 1,
              "maxLength": 6,
              "definition": "Count either of the number of messages or, if used, of the number of functional groups in an interchange.",
              "designator": "UNZ01"
            },
            {
              "key": "Kr8QxJY5ncAbuOQSlN9jt",
              "type": "Data Element",
              "value": "0001",
              "id": "0020",
              "desc": "Interchange control reference",
              "required": true,
              "minLength": 1,
              "maxLength": 14,
              "definition": "Unique reference assigned by the sender to an interchange.",
              "designator": "UNZ02"
            }
          ]
        }
      },
      {
        "key": "2gpckBK6DcxXpn7R6VtTk",
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
            "key": "alk6cfDI2dQvfX_g_Zmq-",
            "meta": {},
            "id": "",
            "transactionSets": [
              {
                "key": "JLAN_sFQMCqKO2TfWpYuS",
                "meta": {
                  "id": "003",
                  "version": "ORDERS",
                  "messageInfo": {
                    "name": "Purchase order",
                    "version": "ORDERS",
                    "introduction": "A message specifying details for goods or services ordered under conditions agreed between the seller and the buyer."
                  },
                  "release": "D96A"
                },
                "id": "003",
                "segments": [
                  {
                    "key": "gA8-3dueB4INi1Qz0hz_H",
                    "id": "BGM",
                    "desc": "BEGINNING OF MESSAGE",
                    "purpose": "To indicate the type and function of a message and to transmit the identifying number.",
                    "elements": [
                      {
                        "key": "vQJFX2Mg3vwMwAyfTa5aw",
                        "type": "Data Element",
                        "value": "220",
                        "components": [
                          {
                            "key": "sgMNLpcpnF2wMfH8e7QXN",
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
                        "key": "Dl-_m0VwYII7_nGCTJVC2",
                        "type": "Data Element",
                        "value": "PO3",
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
                        "key": "F2U0e6RiA_w6qOU-w73Kx",
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
                    ]
                  }
                ],
                "startSegment": {
                  "key": "GJUntUZS2JSZLTYkGQLNq",
                  "id": "UNH",
                  "desc": "Message header",
                  "purpose": "To head, identify and specify a message.",
                  "elements": [
                    {
                      "key": "D103KV7Ema1uhyfbbMr08",
                      "type": "Data Element",
                      "value": "003",
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
                      "key": "VlVogaHeh4UJ7BBqsJdVr",
                      "type": "Data Element",
                      "value": "ORDERS:D:96A:UN:EAN001",
                      "components": [
                        {
                          "key": "5BPc_MPE17gMkMpcDBKs0",
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
                          "key": "6HHDlSOTBz-z_Fb10YZoJ",
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
                          "key": "R21Lk9PKVzd5s45Hlrm-3",
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
                          "key": "Urwza7tMFk_ahEOkdRpiM",
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
                          "key": "VX3ATA6Apex85JJmGg-K-",
                          "type": "Component Element",
                          "value": "EAN001",
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
                  ]
                },
                "endSegment": {
                  "key": "0jgbIregToYuOdfnaQgIX",
                  "id": "UNT",
                  "desc": "Message trailer",
                  "purpose": "To end and check the completeness of a message.",
                  "elements": [
                    {
                      "key": "pKNkNn4uW_C-l1-fpmgSO",
                      "type": "Data Element",
                      "value": "3",
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
                      "key": "NiMWmVKZE_rAqmL4BNifZ",
                      "type": "Data Element",
                      "value": "003",
                      "id": "0062",
                      "desc": "MESSAGE REFERENCE NUMBER",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 0,
                      "maxLength": 14,
                      "definition": "Unique message reference assigned by the sender.",
                      "designator": "UNT02"
                    }
                  ]
                }
              }
            ]
          }
        ],
        "startSegment": {
          "key": "vlPzz7LHx5iFJ2s-3NAAH",
          "id": "UNB",
          "desc": "Interchange header",
          "purpose": "To start, identify and specify an interchange.",
          "elements": [
            {
              "key": "6w9VUslXb_dc9gi2M0VPS",
              "type": "Data Element",
              "value": "UNOA:2",
              "components": [
                {
                  "key": "h0SRD8AzItlpHq7uRR0Te",
                  "type": "Component Element",
                  "value": "UNOA",
                  "id": "0001",
                  "desc": "Syntax identifier",
                  "dataType": "AN",
                  "required": true,
                  "minLength": 4,
                  "maxLength": 4,
                  "definition": "Coded identification of the agency controlling a syntax and syntax level used in an interchange.",
                  "designator": "UNB0101"
                },
                {
                  "key": "zL24fHtdhRsFcg6SvB9MR",
                  "type": "Component Element",
                  "value": "2",
                  "id": "0002",
                  "desc": "Syntax version number",
                  "dataType": "N",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 1,
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
              "key": "Vvc6m7cJGy5xSm6s3rn-n",
              "type": "Data Element",
              "value": "<Sender GLN>:14",
              "components": [
                {
                  "key": "d64GR-JPFdEye62A1ZcUv",
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
                  "key": "XYJL_oAYWx3jRPV264egV",
                  "type": "Component Element",
                  "value": "14",
                  "id": "0007",
                  "desc": "Partner identification code qualifier",
                  "dataType": "AN",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 4,
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
              "key": "quGecEwmoGyrS3TYQa-nK",
              "type": "Data Element",
              "value": "<Receiver GLN>:14",
              "components": [
                {
                  "key": "88MVvZnrTvOIY_5CClO6b",
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
                  "key": "Q5ls8utn2M4EHiF73Ek7V",
                  "type": "Component Element",
                  "value": "14",
                  "id": "0007",
                  "desc": "Partner identification code qualifier",
                  "dataType": "AN",
                  "required": false,
                  "minLength": 1,
                  "maxLength": 4,
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
              "key": "PjiJEeTwbE7fg5rSLLozN",
              "type": "Data Element",
              "value": "140407:0910",
              "components": [
                {
                  "key": "Kger6oJYAP1AfuyAoGMc_",
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
                  "key": "S4AFmAj4cKRaCJou__SpU",
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
              "key": "9T3auLIq9rxupw_yVWF_P",
              "type": "Data Element",
              "value": "0002",
              "id": "0020",
              "desc": "Interchange control reference",
              "dataType": "AN",
              "required": true,
              "minLength": 1,
              "maxLength": 14,
              "definition": "Unique reference assigned by the sender to an interchange.",
              "designator": "UNB05"
            }
          ]
        },
        "endSegment": {
          "key": "07oGoA0tFXJGHCmRCI1l8",
          "id": "UNZ",
          "desc": "Interchange trailer",
          "purpose": "To end and check the completeness of an interchange.",
          "elements": [
            {
              "key": "NDV4pkXLfDmyySWrCR-23",
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
              "key": "Gk1GcT8te_wNospT1QuqL",
              "type": "Data Element",
              "value": "0002",
              "id": "0020",
              "desc": "Interchange control reference",
              "required": true,
              "minLength": 1,
              "maxLength": 14,
              "definition": "Unique reference assigned by the sender to an interchange.",
              "designator": "UNZ02"
            }
          ]
        }
      }
    ],
    "separatorsSegment": {
      "key": "qz3p_GRjR_GkACQ0LQGle",
      "id": "UNA",
      "desc": "Delimiter String Advice",
      "purpose": "To start, identify and specify an interchange.",
      "elements": [
        {
          "key": "NdhQF1slFrupHbVyx9sun",
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
          "key": "pPGeH33DR40FdQJc_nbaQ",
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
          "key": "zZ-Ck1u0dSYY_6H0V8Wtg",
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
          "key": "Kt8oDMadNGRYcTwf5BmdU",
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
          "key": "Z0x7ISeERemy1mY_47wUy",
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
      ]
    },
    "ediType": "edifact"
  };

  const vdaTestData: IEdiDocument = {
    "interchanges": [
      {
        "key": "Hhvk0GcCK4YgcAVEjtbSo",
        "meta": {},
        "functionalGroups": [
          {
            "key": "jelhFpgkrzjG-_zSjewwl",
            "meta": {},
            "id": "",
            "transactionSets": [
              {
                "key": "8Mb6XI4I0gpp_WOtRM7z0",
                "meta": {
                  "id": "00002",
                  "release": "02",
                  "version": "511"
                },
                "id": "00002",
                "segments": [
                  {
                    "key": "s8kWGN_qzxboP2XZNJCTv",
                    "id": "511",
                    "elements": [
                      {
                        "key": "-ByHpuOsI4rjJn2sOfpqO",
                        "type": "Data Element",
                        "value": "02",
                        "desc": "Version Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 2,
                        "designator": "51101"
                      },
                      {
                        "key": "rX2nY-s7YspKkw_LJQTKn",
                        "type": "Data Element",
                        "value": "         ",
                        "desc": "Customer Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 9,
                        "designator": "51102"
                      },
                      {
                        "key": "JFRBslGtiMj81o_QufUl2",
                        "type": "Data Element",
                        "value": "         ",
                        "desc": "Supplier Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 9,
                        "designator": "51103"
                      },
                      {
                        "key": "bWS1_0cYpeW8SZ43snWYh",
                        "type": "Data Element",
                        "value": "99999",
                        "desc": "Old Transmission Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 5,
                        "designator": "51104"
                      },
                      {
                        "key": "exomlIMIeU89gfNC7NYlq",
                        "type": "Data Element",
                        "value": "00001",
                        "desc": "New Transmission Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 5,
                        "designator": "51105"
                      },
                      {
                        "key": "STIahk_-f5oY8oIrf1opn",
                        "type": "Data Element",
                        "value": "250124",
                        "desc": "Transmission Date",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51106"
                      },
                      {
                        "key": "o2j1nMonbNjjxtpvH0ckt",
                        "type": "Data Element",
                        "value": "111231",
                        "desc": "Date Of Zero",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51107"
                      },
                      {
                        "key": "KtDz4OhbfVVJs7wZEo_U2",
                        "type": "Data Element",
                        "value": "                                                                                   ",
                        "desc": "Empty",
                        "dataType": "AN",
                        "required": true,
                        "length": 83,
                        "designator": "51108"
                      }
                    ]
                  },
                  {
                    "key": "CiIh7pE_HVGiRu-Jdsrhw",
                    "id": "512",
                    "elements": [
                      {
                        "key": "YYZoOnxEt3mzVaddpwJFt",
                        "type": "Data Element",
                        "value": "01",
                        "desc": "Version Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 2,
                        "designator": "51201"
                      },
                      {
                        "key": "r23-BBGJehLNoztAb_GCp",
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
                        "key": "eIgnOq_qF4GS7Bkbj43tY",
                        "type": "Data Element",
                        "value": "187      ",
                        "desc": "New Call Off Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 9,
                        "designator": "51203"
                      },
                      {
                        "key": "8TvlnYeEvjSHRZ4YexVbq",
                        "type": "Data Element",
                        "value": "121115",
                        "desc": "New Call Off Date",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51204"
                      },
                      {
                        "key": "UgtEv_i8UfzxTzx-oVyAe",
                        "type": "Data Element",
                        "value": "186      ",
                        "desc": "Old Call Off Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 9,
                        "designator": "51205"
                      },
                      {
                        "key": "o3f1X5c88R_zutJ5tbK4c",
                        "type": "Data Element",
                        "value": "121109",
                        "desc": "Old Call Off Date",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51206"
                      },
                      {
                        "key": "g15WhyihoDqs9uk-xh9kT",
                        "type": "Data Element",
                        "value": "1514280009100         ",
                        "desc": "Customer Part Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 22,
                        "designator": "51207"
                      },
                      {
                        "key": "36K2JWrRlhGwhEcx8dGS0",
                        "type": "Data Element",
                        "value": "                      ",
                        "desc": "Supplier Part Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 22,
                        "designator": "51208"
                      },
                      {
                        "key": "cFv4qkyCR_SoqAqX4h_XU",
                        "type": "Data Element",
                        "value": "CGF-56026482",
                        "desc": "Purchase Order Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 12,
                        "designator": "51209"
                      },
                      {
                        "key": "LLpIlo4AFGaN_hpiCDcs_",
                        "type": "Data Element",
                        "value": "A 13 ",
                        "desc": "Unloading Point",
                        "dataType": "AN",
                        "required": true,
                        "length": 5,
                        "designator": "51210"
                      },
                      {
                        "key": "xjQY0inhKHDcLPRzExI9J",
                        "type": "Data Element",
                        "value": "    ",
                        "desc": "Code Of Customer",
                        "dataType": "AN",
                        "required": true,
                        "length": 4,
                        "designator": "51211"
                      },
                      {
                        "key": "-uC7rKvFPc6R7BaNf7C6I",
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
                        "key": "Xv-iRti0023tNNO5sbWHQ",
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
                        "key": "VXfwgDTp6eocZjTeLGy9G",
                        "type": "Data Element",
                        "value": " ",
                        "desc": "Inclusive Production Release",
                        "dataType": "AN",
                        "required": true,
                        "length": 1,
                        "designator": "51214"
                      },
                      {
                        "key": "DtgKl7mXDnVbjvaU_sAtf",
                        "type": "Data Element",
                        "value": " ",
                        "desc": "Material Release",
                        "dataType": "AN",
                        "required": true,
                        "length": 1,
                        "designator": "51215"
                      },
                      {
                        "key": "sYk787U178pKkOvf54Z3u",
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
                        "key": "4NysXGejZAzW11wLZ-jDS",
                        "type": "Data Element",
                        "value": "       ",
                        "desc": "Allocation",
                        "dataType": "AN",
                        "required": true,
                        "length": 7,
                        "designator": "51217"
                      },
                      {
                        "key": "-UnhDCE4EMYbJII_WikhE",
                        "type": "Data Element",
                        "value": "       ",
                        "desc": "Warehouse Location",
                        "dataType": "AN",
                        "required": true,
                        "length": 7,
                        "designator": "51218"
                      },
                      {
                        "key": "05FEZb0gaYOl6tVRKpcBx",
                        "type": "Data Element",
                        "value": "     ",
                        "desc": "Empty",
                        "dataType": "AN",
                        "required": true,
                        "length": 5,
                        "designator": "51219"
                      }
                    ]
                  },
                  {
                    "key": "y-Au-UTZf5ypx4nUryWEl",
                    "id": "513",
                    "elements": [
                      {
                        "key": "oPaz1c4FNtVFYccWaZFR8",
                        "type": "Data Element",
                        "value": "01",
                        "desc": "Version Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 2,
                        "designator": "51301"
                      },
                      {
                        "key": "QbOvffgZClQsufKFvnS4H",
                        "type": "Data Element",
                        "value": "121113",
                        "desc": "Entry Date Last delivery",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51302"
                      },
                      {
                        "key": "yUIQ0DKlpeprmwPZ7h7ZX",
                        "type": "Data Element",
                        "value": "432701  ",
                        "desc": "Delivery Note Number last delivery",
                        "dataType": "AN",
                        "required": true,
                        "length": 8,
                        "designator": "51303"
                      },
                      {
                        "key": "JchStOvIEN7GTf5_dY7oP",
                        "type": "Data Element",
                        "value": "      ",
                        "desc": "Delivery Note Date last delivery",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51304"
                      },
                      {
                        "key": "-aJab5GXx1m_cudkrZYJP",
                        "type": "Data Element",
                        "value": "000000346000",
                        "desc": "Quantity Last Delivery",
                        "dataType": "AN",
                        "required": true,
                        "length": 12,
                        "designator": "51305"
                      },
                      {
                        "key": "HVg4oXe2BNvD9_TzNF02z",
                        "type": "Data Element",
                        "value": "0000019427",
                        "desc": "Cumulative Figure",
                        "dataType": "AN",
                        "required": true,
                        "length": 10,
                        "designator": "51306"
                      },
                      {
                        "key": "od3cW25nuk-VdJ7StuMuj",
                        "type": "Data Element",
                        "value": "121115",
                        "desc": "Call Off Date 1",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51307"
                      },
                      {
                        "key": "-Cvlbh7970hfGi3aMM5a0",
                        "type": "Data Element",
                        "value": "000000000",
                        "desc": "Call Off Quantity 1",
                        "dataType": "AN",
                        "required": true,
                        "length": 9,
                        "designator": "51308"
                      },
                      {
                        "key": "M-qhn5ND5xj63G57CmTYC",
                        "type": "Data Element",
                        "value": "000000",
                        "desc": "Call Off Date 2",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51309"
                      },
                      {
                        "key": "I8Ukg-v4Kwz5ND1y6JuNC",
                        "type": "Data Element",
                        "value": "         ",
                        "desc": "Call Off Quantity 2",
                        "dataType": "AN",
                        "required": true,
                        "length": 9,
                        "designator": "51310"
                      },
                      {
                        "key": "yPdHwEZdwxXp-YNKLpSjs",
                        "type": "Data Element",
                        "value": "      ",
                        "desc": "Call Off Date 3",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51311"
                      },
                      {
                        "key": "Pb92k1j2IdcluLmlyaPJZ",
                        "type": "Data Element",
                        "value": "         ",
                        "desc": "Call Off Quantity 3",
                        "dataType": "AN",
                        "required": true,
                        "length": 9,
                        "designator": "51312"
                      },
                      {
                        "key": "NhT6QwPgcfB1CJgfTYqUp",
                        "type": "Data Element",
                        "value": "      ",
                        "desc": "Call Off Date 4",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51313"
                      },
                      {
                        "key": "OBS7uLXIA_j4TBySMt2j-",
                        "type": "Data Element",
                        "value": "         ",
                        "desc": "Call Off Quantity 4",
                        "dataType": "AN",
                        "required": true,
                        "length": 9,
                        "designator": "51314"
                      },
                      {
                        "key": "OM3p24HMjm2DcKMQqD9Jv",
                        "type": "Data Element",
                        "value": "      ",
                        "desc": "Call Off Date 5",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51315"
                      },
                      {
                        "key": "yWAhla1XWhBFy9IRBR9cB",
                        "type": "Data Element",
                        "value": "         ",
                        "desc": "Call Off Quantity 5",
                        "dataType": "AN",
                        "required": true,
                        "length": 9,
                        "designator": "51316"
                      },
                      {
                        "key": "VU_Eqnb2zLIsAvdj3E9sa",
                        "type": "Data Element",
                        "value": "      ",
                        "desc": "Empty",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51317"
                      }
                    ]
                  },
                  {
                    "key": "jqQU2i-fIVYlOz18qNjC1",
                    "id": "515",
                    "elements": [
                      {
                        "key": "A-fC__8H13tYbtaWGm8Aq",
                        "type": "Data Element",
                        "value": "01",
                        "desc": "Version Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 2,
                        "designator": "51501"
                      },
                      {
                        "key": "RZRk8BdgXAyGxmkXDQFW-",
                        "type": "Data Element",
                        "value": "000000",
                        "desc": "Production Authorisation, start date",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51502"
                      },
                      {
                        "key": "0HtkXIcAjy9eRN2odZJra",
                        "type": "Data Element",
                        "value": "130213",
                        "desc": "Production Authorisation, end date",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51503"
                      },
                      {
                        "key": "pt-5G-Wg9AyUZyd_ZgnIg",
                        "type": "Data Element",
                        "value": "0000000000",
                        "desc": "Production Authorisation, cumulative quantity",
                        "dataType": "AN",
                        "required": true,
                        "length": 10,
                        "designator": "51504"
                      },
                      {
                        "key": "ceVMq7M2DQt7osWSjrv_L",
                        "type": "Data Element",
                        "value": "000000",
                        "desc": "Material Authorisation, start date",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51505"
                      },
                      {
                        "key": "YJM2ccKIgh3AJKx8n8xhP",
                        "type": "Data Element",
                        "value": "130315",
                        "desc": "Material Authorisation, end date",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51506"
                      },
                      {
                        "key": "zbAd89PVUDotJSjRowvh-",
                        "type": "Data Element",
                        "value": "0000000000",
                        "desc": "Material Authorisation, cumulative demand",
                        "dataType": "AN",
                        "required": true,
                        "length": 10,
                        "designator": "51507"
                      },
                      {
                        "key": "fpUkKKyCym5KXMFk-YQ56",
                        "type": "Data Element",
                        "value": "                      ",
                        "desc": "FPSD Article Code",
                        "dataType": "AN",
                        "required": true,
                        "length": 22,
                        "designator": "51508"
                      },
                      {
                        "key": "4eHaWtkHWhaDeup3_lWEQ",
                        "type": "Data Element",
                        "value": "         ",
                        "desc": "Sub Supplier",
                        "dataType": "AN",
                        "required": true,
                        "length": 9,
                        "designator": "51509"
                      },
                      {
                        "key": "R7pNtqWQja8RmNy7jcXzE",
                        "type": "Data Element",
                        "value": "000000",
                        "desc": "Planning Horizon Date",
                        "dataType": "AN",
                        "required": true,
                        "length": 6,
                        "designator": "51510"
                      },
                      {
                        "key": "Z5ATEk_MxZR-hCAnSMq2c",
                        "type": "Data Element",
                        "value": "              ",
                        "desc": "Point Of Use",
                        "dataType": "AN",
                        "required": true,
                        "length": 14,
                        "designator": "51511"
                      },
                      {
                        "key": "DWUxh1beybkkJgUmxKfdd",
                        "type": "Data Element",
                        "value": "          ",
                        "desc": "Cumulative Received Quantity before resetting it to zero",
                        "dataType": "AN",
                        "required": true,
                        "length": 10,
                        "designator": "51512"
                      },
                      {
                        "key": "ov98KOa2MTpPJswhExsfd",
                        "type": "Data Element",
                        "value": "                  ",
                        "desc": "Empty",
                        "dataType": "AN",
                        "required": true,
                        "length": 18,
                        "designator": "51513"
                      }
                    ]
                  },
                  {
                    "key": "6jZjseaVyLO2k__57Lpi7",
                    "id": "518",
                    "elements": [
                      {
                        "key": "Zd4fxqz7A8NrY9FurgIPv",
                        "type": "Data Element",
                        "value": "01",
                        "desc": "Version Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 2,
                        "designator": "51801"
                      },
                      {
                        "key": "Y9nS1MNUK4cjG0Eyf7hUe",
                        "type": "Data Element",
                        "value": "07-08140295/04                          ",
                        "desc": "Call Off Text 1",
                        "dataType": "AN",
                        "required": true,
                        "length": 40,
                        "designator": "51802"
                      },
                      {
                        "key": "MAlN99bsrk-7qZrL0uY50",
                        "type": "Data Element",
                        "value": "23-09140029                             ",
                        "desc": "Call Off Text 2",
                        "dataType": "AN",
                        "required": true,
                        "length": 40,
                        "designator": "51803"
                      },
                      {
                        "key": "NN6pJD1_5dGJ2DMFYJCz1",
                        "type": "Data Element",
                        "value": "                                        ",
                        "desc": "Call Off Text 3",
                        "dataType": "AN",
                        "required": true,
                        "length": 40,
                        "designator": "51804"
                      },
                      {
                        "key": "_wbIepTL2R0ivsXKofK5j",
                        "type": "Data Element",
                        "value": "   ",
                        "desc": "Empty",
                        "dataType": "AN",
                        "required": true,
                        "length": 3,
                        "designator": "51805"
                      }
                    ]
                  },
                  {
                    "key": "wWHEUDfqjq7FS5IORSu2J",
                    "id": "519",
                    "elements": [
                      {
                        "key": "aqMel-gST2ovzu-_cF9G1",
                        "type": "Data Element",
                        "value": "01",
                        "desc": "Version Number",
                        "dataType": "AN",
                        "required": true,
                        "length": 2,
                        "designator": "51901"
                      },
                      {
                        "key": "jDdplOmCdhdmLNXAJ6GXu",
                        "type": "Data Element",
                        "value": "0000001",
                        "desc": "Counter Record 511",
                        "dataType": "AN",
                        "required": true,
                        "length": 7,
                        "designator": "51902"
                      },
                      {
                        "key": "UsTdxSLuVI92sms2AKZkk",
                        "type": "Data Element",
                        "value": "0000001",
                        "desc": "Counter Record 512",
                        "dataType": "AN",
                        "required": true,
                        "length": 7,
                        "designator": "51903"
                      },
                      {
                        "key": "LZq8KJNAZrXGsism_DlSx",
                        "type": "Data Element",
                        "value": "0000001",
                        "desc": "Counter Record 513",
                        "dataType": "AN",
                        "required": true,
                        "length": 7,
                        "designator": "51904"
                      },
                      {
                        "key": "rvLWeeKhUZOSQyNLTpwG7",
                        "type": "Data Element",
                        "value": "0000000",
                        "desc": "Counter Record 514",
                        "dataType": "AN",
                        "required": true,
                        "length": 7,
                        "designator": "51905"
                      },
                      {
                        "key": "JnQtIUapwukmBRMFJSQR-",
                        "type": "Data Element",
                        "value": "0000000",
                        "desc": "Counter Record 517",
                        "dataType": "AN",
                        "required": true,
                        "length": 7,
                        "designator": "51906"
                      },
                      {
                        "key": "uyJ5zvi0Gbewqr__l63QV",
                        "type": "Data Element",
                        "value": "0000001",
                        "desc": "Counter Record 518",
                        "dataType": "AN",
                        "required": true,
                        "length": 7,
                        "designator": "51907"
                      },
                      {
                        "key": "vaC4SIetQXaNa0pb7HVPS",
                        "type": "Data Element",
                        "value": "0000001",
                        "desc": "Counter Record 519",
                        "dataType": "AN",
                        "required": true,
                        "length": 7,
                        "designator": "51908"
                      },
                      {
                        "key": "9hcWgxWKXJB04NQkbvRrZ",
                        "type": "Data Element",
                        "value": "0000001",
                        "desc": "Counter Record 515",
                        "dataType": "AN",
                        "required": true,
                        "length": 7,
                        "designator": "51909"
                      },
                      {
                        "key": "QOYXm5eBGQHM0oYVLOmbP",
                        "type": "Data Element",
                        "value": "                                                                   ",
                        "desc": "Empty",
                        "dataType": "AN",
                        "required": true,
                        "length": 67,
                        "designator": "51910"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "ediType": "vda"
  };
  

  return new EdiDocument(vdaTestData);
}
