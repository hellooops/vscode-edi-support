import { EdiDocument } from "@/entities";

export default function useTestData(): EdiDocument {
  const x12TestData: IEdiDocument = {
    "interchanges": [
      {
        "key": "R7lB06KyAUfdoM80JM1IZ",
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
            "key": "Shyi21NpX5ey35RbUnGGd",
            "meta": { "date": "20210517", "time": "0643", "id": "7080" },
            "id": "7080",
            "transactionSets": [
              {
                "key": "paFyPmBA97FewHd--Xsvl",
                "meta": { "release": "00401", "version": "850", "id": "0001" },
                "id": "0001",
                "segments": [
                  {
                    "key": "1DJxeqK760D7SnfvsxVNj",
                    "id": "BEG",
                    "desc": "Beginning Segment for Purchase Order",
                    "purpose": "To indicate the beginning of the Purchase Order Transaction Set and transmit identifying numbers and dates",
                    "elements": [
                      {
                        "key": "RYm9U7thGqcHGFs--DveL",
                        "type": "Data Element",
                        "value": "00",
                        "id": "353",
                        "desc": "Transaction Set Purpose Code",
                        "required": true,
                        "codeValue": "Original",
                        "definition": "Code identifying purpose of transaction set"
                      },
                      {
                        "key": "NvYX02Cyyxyx44qsb6BWE",
                        "type": "Data Element",
                        "value": "BK",
                        "id": "92",
                        "desc": "Purchase Order Type Code",
                        "required": true,
                        "codeValue": "Blanket Order (Quantity Firm)",
                        "definition": "Code specifying the type of Purchase Order"
                      },
                      {
                        "key": "kxR0FnTmnXxFFfhuspDtU",
                        "type": "Data Element",
                        "value": "0019-1234567-1234",
                        "id": "324",
                        "desc": "Purchase Order Number",
                        "dataType": "AN",
                        "required": true,
                        "minLength": 1,
                        "maxLength": 22,
                        "definition": "Identifying number for Purchase Order assigned by the orderer/purchaser"
                      },
                      {
                        "key": "UZ5qZtqpPM7eLE3c7AKwA",
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
                        "key": "AuQLLi66hZ01vxKGsTuKj",
                        "type": "Data Element",
                        "value": "20000130",
                        "id": "373",
                        "desc": "Date",
                        "dataType": "DT",
                        "required": true,
                        "minLength": 8,
                        "maxLength": 8,
                        "definition": "Date expressed as CCYYMMDD"
                      }
                    ]
                  },
                  {
                    "key": "pMlH76mdMeesNnt22YXN4",
                    "id": "REF",
                    "desc": "Reference Identification",
                    "purpose": "To specify identifying information",
                    "elements": [
                      {
                        "key": "3BR-OYzRPy4VswakKmgRZ",
                        "type": "Data Element",
                        "value": "IA",
                        "id": "128",
                        "desc": "Reference Identification Qualifier",
                        "required": true,
                        "codeValue": "Internal Vendor Number",
                        "definition": "Code qualifying the Reference Identification"
                      },
                      {
                        "key": "pAqv-A524ZEWW0ii5qBVl",
                        "type": "Data Element",
                        "value": "3688063",
                        "id": "127",
                        "desc": "Reference Identification",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 30,
                        "definition": "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier"
                      },
                      {
                        "key": "5Ydz7hIRocNHbpj86buse",
                        "type": "Data Element",
                        "value": "VENDOR NAME",
                        "id": "352",
                        "desc": "Description",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 80,
                        "definition": "A free-form description to clarify the related data elements and their content"
                      }
                    ]
                  },
                  {
                    "key": "kzIt3OtW4a3Dy66BHkvqq",
                    "id": "REF",
                    "desc": "Reference Identification",
                    "purpose": "To specify identifying information",
                    "elements": [
                      {
                        "key": "CvamKLWnSR_GRy-87HFnh",
                        "type": "Data Element",
                        "value": "2H",
                        "id": "128",
                        "desc": "Reference Identification Qualifier",
                        "required": true,
                        "codeValue": "Assigned by transaction set sender",
                        "definition": "Code qualifying the Reference Identification"
                      },
                      {
                        "key": "X5W2ZHHgiSDn7jP86Qv8i",
                        "type": "Data Element",
                        "value": "AD",
                        "id": "127",
                        "desc": "Reference Identification",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 30,
                        "definition": "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier"
                      },
                      {
                        "key": "eCoWxoF40lKaND7W6Qzn_",
                        "type": "Data Element",
                        "value": "Ad",
                        "id": "352",
                        "desc": "Description",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 1,
                        "maxLength": 80,
                        "definition": "A free-form description to clarify the related data elements and their content"
                      }
                    ]
                  },
                  {
                    "key": "0HClYSBrTn2i9_fX9tsti",
                    "id": "SACLoop1",
                    "desc": "Service, Promotion, Allowance, or Charge Information",
                    "purpose": "To request or identify a service, promotion, allowance, or charge; to specify the amount or percentage for the service, promotion, allowance, or charge",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "B2GJbZPOfq074ue2WZIaN",
                        "id": "SAC",
                        "desc": "Service, Promotion, Allowance, or Charge Information",
                        "purpose": "To request or identify a service, promotion, allowance, or charge; to specify the amount or percentage for the service, promotion, allowance, or charge",
                        "elements": [
                          {
                            "key": "lUCO1iHAqEGWvMWoyrqHr",
                            "type": "Data Element",
                            "value": "A",
                            "id": "248",
                            "desc": "Allowance or Charge Indicator",
                            "required": true,
                            "codeValue": "",
                            "definition": "Code which indicates an allowance or charge for the service specified"
                          },
                          {
                            "key": "lICaICYndRRYVM1YSOH7G",
                            "type": "Data Element",
                            "value": "",
                            "id": "1300",
                            "desc": "Service, Promotion, Allowance, or Charge Code",
                            "required": false,
                            "definition": "Code identifying the service, promotion, allowance, or charge"
                          },
                          {
                            "key": "NlzB3MMzEXFXwGxlbkqnD",
                            "type": "Data Element",
                            "value": "",
                            "id": "559",
                            "desc": "Agency Qualifier Code",
                            "required": false,
                            "definition": "Code identifying the agency assigning the code values"
                          },
                          {
                            "key": "L1sjvPMVFPIR4Fh7a9ssz",
                            "type": "Data Element",
                            "value": "100.00",
                            "id": "1301",
                            "desc": "Agency Service, Promotion, Allowance, or Charge Code",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 10,
                            "definition": "Agency maintained code identifying the service, promotion, allowance, or charge"
                          }
                        ]
                      },
                      {
                        "key": "stl-rxpTaCKrZw7iZgvnZ",
                        "id": "CUR",
                        "desc": "Currency",
                        "purpose": "To specify the currency (dollars, pounds, francs, etc.) used in a transaction",
                        "elements": [
                          {
                            "key": "UEVoAvrgnflRsrNGqR7nk",
                            "type": "Data Element",
                            "value": "LZ",
                            "id": "98",
                            "desc": "Entity Identifier Code",
                            "required": true,
                            "codeValue": "Local Chain",
                            "definition": "Code identifying an organizational entity, a physical location, property or an individual"
                          },
                          {
                            "key": "ogQdFimqOXgbhbokZJE2m",
                            "type": "Data Element",
                            "value": "USD",
                            "id": "100",
                            "desc": "Currency Code",
                            "dataType": "ID",
                            "required": true,
                            "minLength": 3,
                            "maxLength": 3,
                            "definition": "Code (Standard ISO) for country in whose currency the charges are specified"
                          },
                          {
                            "key": "HR0xCzj32jpC62nIh08_o",
                            "type": "Data Element",
                            "value": "",
                            "id": "280",
                            "desc": "Exchange Rate",
                            "dataType": "R",
                            "required": false,
                            "minLength": 4,
                            "maxLength": 10,
                            "definition": "Value to be used as a multiplier conversion factor to convert monetary value from one currency to another"
                          },
                          {
                            "key": "qX0ynQR_cfjnG79UjhyZW",
                            "type": "Data Element",
                            "value": "VN",
                            "id": "98",
                            "desc": "Entity Identifier Code",
                            "required": false,
                            "codeValue": "Vendor",
                            "definition": "Code identifying an organizational entity, a physical location, property or an individual"
                          },
                          {
                            "key": "yKhI1tAg39GfNh3_nyZtA",
                            "type": "Data Element",
                            "value": "USD",
                            "id": "100",
                            "desc": "Currency Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 3,
                            "maxLength": 3,
                            "definition": "Code (Standard ISO) for country in whose currency the charges are specified"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "NJuZ-PdRzbQ1KUsupzh8W",
                    "id": "N1Loop1",
                    "desc": "Name",
                    "purpose": "To identify a party by type of organization, name, and code",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "CN2EOgmtQDuJEUgKEH-sP",
                        "id": "N1",
                        "desc": "Name",
                        "purpose": "To identify a party by type of organization, name, and code",
                        "elements": [
                          {
                            "key": "TDkQ0io93NRiqpa-DWCK5",
                            "type": "Data Element",
                            "value": "BT",
                            "id": "98",
                            "desc": "Entity Identifier Code",
                            "required": true,
                            "codeValue": "Bill-to-Party",
                            "definition": "Code identifying an organizational entity, a physical location, property or an individual"
                          },
                          {
                            "key": "ktzzRzA6LqTrLnRikDTbz",
                            "type": "Data Element",
                            "value": "Example.com Accounts Payable",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name"
                          }
                        ]
                      },
                      {
                        "key": "IHoBP-B-stYsSn_DC5VI9",
                        "id": "N2",
                        "desc": "Additional Name Information",
                        "purpose": "To specify additional names or those longer than 35 characters in length",
                        "elements": [
                          {
                            "key": "O8nfyfCNc9RRycxaZxbGA",
                            "type": "Data Element",
                            "value": "asde",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name"
                          }
                        ]
                      },
                      {
                        "key": "DRRxF4YKV7n8r3bgCPClx",
                        "id": "N3",
                        "desc": "Address Information",
                        "purpose": "To specify the location of the named party",
                        "elements": [
                          {
                            "key": "FC6EfDQyrb5fpiYCLuZk3",
                            "type": "Data Element",
                            "value": "TNC 3110",
                            "id": "166",
                            "desc": "Address Information",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 55,
                            "definition": "Address information"
                          },
                          {
                            "key": "oEpLkrUChGKnesY4CV8kt",
                            "type": "Data Element",
                            "value": "PO Box 1296",
                            "id": "166",
                            "desc": "Address Information",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 55,
                            "definition": "Address information"
                          }
                        ]
                      },
                      {
                        "key": "YLKA7Du6mOZsuc2tH1xN2",
                        "id": "N4",
                        "desc": "Geographic Location",
                        "purpose": "To specify the geographic place of the named party",
                        "elements": [
                          {
                            "key": "wseiGFOy9AdypGDmPGYe6",
                            "type": "Data Element",
                            "value": "Minneapolis",
                            "id": "19",
                            "desc": "City Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 30,
                            "definition": "Free-form text for city name"
                          },
                          {
                            "key": "z5fZhrI0Ds0u3Tpiu23bx",
                            "type": "Data Element",
                            "value": "MN",
                            "id": "156",
                            "desc": "State or Province Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 2,
                            "definition": "Code (Standard State/Province) as defined by appropriate government agency"
                          },
                          {
                            "key": "UjYt-VLel_DRGNeQR3zUP",
                            "type": "Data Element",
                            "value": "55440",
                            "id": "116",
                            "desc": "Postal Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 3,
                            "maxLength": 15,
                            "definition": "Code defining international postal zone code excluding punctuation and blanks (zip code for United States)"
                          },
                          {
                            "key": "4o9r6z5kr6G9WY6vspz-u",
                            "type": "Data Element",
                            "value": "US",
                            "id": "26",
                            "desc": "Country Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 3,
                            "definition": "Code identifying the country"
                          }
                        ]
                      },
                      {
                        "key": "wGoCsanYgrN84CQSG2B52",
                        "id": "PER",
                        "desc": "Administrative Communications Contact",
                        "purpose": "To identify a person or office to whom administrative communications should be directed",
                        "elements": [
                          {
                            "key": "P8zH8NvnECizDiRdPpgia",
                            "type": "Data Element",
                            "value": "CN",
                            "id": "366",
                            "desc": "Contact Function Code",
                            "required": true,
                            "codeValue": "General Contact",
                            "definition": "Code identifying the major duty or responsibility of the person or group named"
                          },
                          {
                            "key": "34_Ynzco27IhNfaVHGOM8",
                            "type": "Data Element",
                            "value": "EDI",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name"
                          },
                          {
                            "key": "TYpYRzb7r0dt0lqYQ1QsR",
                            "type": "Data Element",
                            "value": "EM",
                            "id": "365",
                            "desc": "Communication Number Qualifier",
                            "required": false,
                            "codeValue": "Electronic Mail",
                            "definition": "Code identifying the type of communication number"
                          },
                          {
                            "key": "az6aW1QDqJsp1JXvfynah",
                            "type": "Data Element",
                            "value": "test@ABC.COM",
                            "id": "364",
                            "desc": "Communication Number",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 80,
                            "definition": "Complete communications number including country or area code when applicable"
                          },
                          {
                            "key": "1yDTAz2CJ-QdjeJwhJy1e",
                            "type": "Data Element",
                            "value": "TE",
                            "id": "365",
                            "desc": "Communication Number Qualifier",
                            "required": false,
                            "codeValue": "Telephone",
                            "definition": "Code identifying the type of communication number"
                          },
                          {
                            "key": "OQ7py40ZCwjWU-I7bfItA",
                            "type": "Data Element",
                            "value": "111-222-3333",
                            "id": "364",
                            "desc": "Communication Number",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 80,
                            "definition": "Complete communications number including country or area code when applicable"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "1KhIsJDfk5LJnGnefRkrJ",
                    "id": "N1Loop1",
                    "desc": "Name",
                    "purpose": "To identify a party by type of organization, name, and code",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "cAaB4oSiGedjwtjuCzeDN",
                        "id": "N1",
                        "desc": "Name",
                        "purpose": "To identify a party by type of organization, name, and code",
                        "elements": [
                          {
                            "key": "EOE5rc3L0ttLrNIqDFwND",
                            "type": "Data Element",
                            "value": "SO",
                            "id": "98",
                            "desc": "Entity Identifier Code",
                            "required": true,
                            "codeValue": "Sold To If Different From Bill To",
                            "definition": "Code identifying an organizational entity, a physical location, property or an individual"
                          },
                          {
                            "key": "2yaTLG6SQ5X5yzljHPa5Y",
                            "type": "Data Element",
                            "value": "EDI Helpdesk",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name"
                          }
                        ]
                      },
                      {
                        "key": "nwISxD3JJc7WVlu5b1JeW",
                        "id": "N2",
                        "desc": "Additional Name Information",
                        "purpose": "To specify additional names or those longer than 35 characters in length",
                        "elements": [
                          {
                            "key": "PMViqZu9cpDvZLTJN4f4f",
                            "type": "Data Element",
                            "value": "Mike",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name"
                          }
                        ]
                      },
                      {
                        "key": "JKQRR2PBEdr3TiV3gNR1I",
                        "id": "N3",
                        "desc": "Address Information",
                        "purpose": "To specify the location of the named party",
                        "elements": [
                          {
                            "key": "CZI10R-KJAZY_3mrxe2sA",
                            "type": "Data Element",
                            "value": "7000 Example Parkway",
                            "id": "166",
                            "desc": "Address Information",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 55,
                            "definition": "Address information"
                          }
                        ]
                      },
                      {
                        "key": "024I5yvrzVL24Yu1IaxYJ",
                        "id": "N4",
                        "desc": "Geographic Location",
                        "purpose": "To specify the geographic place of the named party",
                        "elements": [
                          {
                            "key": "fTo9e4CZF4smq8tzIhxFM",
                            "type": "Data Element",
                            "value": "Brooklyn Park",
                            "id": "19",
                            "desc": "City Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 30,
                            "definition": "Free-form text for city name"
                          },
                          {
                            "key": "c-gDaWbikpo422bGQedW_",
                            "type": "Data Element",
                            "value": "MN",
                            "id": "156",
                            "desc": "State or Province Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 2,
                            "definition": "Code (Standard State/Province) as defined by appropriate government agency"
                          },
                          {
                            "key": "sIowwQUKYAqFEwa4Lo3nn",
                            "type": "Data Element",
                            "value": "55445",
                            "id": "116",
                            "desc": "Postal Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 3,
                            "maxLength": 15,
                            "definition": "Code defining international postal zone code excluding punctuation and blanks (zip code for United States)"
                          },
                          {
                            "key": "d2GScfKIwystvejBZj-h2",
                            "type": "Data Element",
                            "value": "US",
                            "id": "26",
                            "desc": "Country Code",
                            "dataType": "ID",
                            "required": false,
                            "minLength": 2,
                            "maxLength": 3,
                            "definition": "Code identifying the country"
                          }
                        ]
                      },
                      {
                        "key": "BizyfAvgchsEuKFxVQ07N",
                        "id": "PER",
                        "desc": "Administrative Communications Contact",
                        "purpose": "To identify a person or office to whom administrative communications should be directed",
                        "elements": [
                          {
                            "key": "GNfFgwCt07flgRJQdfhSh",
                            "type": "Data Element",
                            "value": "CN",
                            "id": "366",
                            "desc": "Contact Function Code",
                            "required": true,
                            "codeValue": "General Contact",
                            "definition": "Code identifying the major duty or responsibility of the person or group named"
                          },
                          {
                            "key": "HcSzcPeWO6uT3GbY7Gs1t",
                            "type": "Data Element",
                            "value": "EDI",
                            "id": "93",
                            "desc": "Name",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 60,
                            "definition": "Free-form name"
                          },
                          {
                            "key": "KfUWjk_OPseu8U7S4Pzp0",
                            "type": "Data Element",
                            "value": "EM",
                            "id": "365",
                            "desc": "Communication Number Qualifier",
                            "required": false,
                            "codeValue": "Electronic Mail",
                            "definition": "Code identifying the type of communication number"
                          },
                          {
                            "key": "4OgrFUVLhtWR3vNMrdMDh",
                            "type": "Data Element",
                            "value": "test@ABC.COM",
                            "id": "364",
                            "desc": "Communication Number",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 80,
                            "definition": "Complete communications number including country or area code when applicable"
                          },
                          {
                            "key": "UlWRbFxDkBCfaUWONwHib",
                            "type": "Data Element",
                            "value": "TE",
                            "id": "365",
                            "desc": "Communication Number Qualifier",
                            "required": false,
                            "codeValue": "Telephone",
                            "definition": "Code identifying the type of communication number"
                          },
                          {
                            "key": "M7Rg9b3n21Bv8rYVtTxEw",
                            "type": "Data Element",
                            "value": "111-222-4444",
                            "id": "364",
                            "desc": "Communication Number",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 80,
                            "definition": "Complete communications number including country or area code when applicable"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "Ag-81Vto0uQiNmUHGWMDV",
                    "id": "PO1Loop1",
                    "desc": "Baseline Item Data",
                    "purpose": "To specify basic and most frequently used line item data",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "mY4pVXNJGfuP0qti4ySGB",
                        "id": "PO1",
                        "desc": "Baseline Item Data",
                        "purpose": "To specify basic and most frequently used line item data",
                        "elements": [
                          {
                            "key": "5e-b3ts72FU6pj0a-mfc6",
                            "type": "Data Element",
                            "value": "1",
                            "id": "350",
                            "desc": "Assigned Identification",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 20,
                            "definition": "Alphanumeric characters assigned for differentiation within a transaction set"
                          },
                          {
                            "key": "1bRZekOmzFxUYR5w251xn",
                            "type": "Data Element",
                            "value": "3",
                            "id": "330",
                            "desc": "Quantity Ordered",
                            "dataType": "R",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 15,
                            "definition": "Quantity ordered"
                          },
                          {
                            "key": "mC8T6KhMBFrj-G37ijEjm",
                            "type": "Data Element",
                            "value": "EA",
                            "id": "355",
                            "desc": "Unit or Basis for Measurement Code",
                            "required": false,
                            "codeValue": "Each",
                            "definition": "Code specifying the units in which a value is being expressed, or manner in which a measurement has been taken"
                          },
                          {
                            "key": "7SPFW6FrZfM7_LcLVJa23",
                            "type": "Data Element",
                            "value": "12.3",
                            "id": "212",
                            "desc": "Unit Price",
                            "dataType": "R",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 17,
                            "definition": "Price per unit of product, service, commodity, etc."
                          },
                          {
                            "key": "O5573oLQBrZ_gOpT_jBqx",
                            "type": "Data Element",
                            "value": "PE",
                            "id": "639",
                            "desc": "Basis of Unit Price Code",
                            "required": false,
                            "codeValue": "Price per Each",
                            "definition": "Code identifying the type of unit price for an item"
                          },
                          {
                            "key": "_rKvTTcwi0imB_3sSosm3",
                            "type": "Data Element",
                            "value": "IN",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "Buyer's Item Number",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)"
                          },
                          {
                            "key": "Egk5aOazHGUf_4pcyxjyb",
                            "type": "Data Element",
                            "value": "15013163",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service"
                          },
                          {
                            "key": "h2_VFmKKZpjHlwJ2sVnP4",
                            "type": "Data Element",
                            "value": "SK",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "Stock Keeping Unit (SKU)",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)"
                          },
                          {
                            "key": "ui4pmV51tBLU7ZbrrZDw7",
                            "type": "Data Element",
                            "value": "7680-02009152",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service"
                          },
                          {
                            "key": "gD0pL-U97U1T6HLPoSiGN",
                            "type": "Data Element",
                            "value": "UP",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "GTIN-12",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)"
                          },
                          {
                            "key": "Hb51EmT7YH3N_EVcRW9Wf",
                            "type": "Data Element",
                            "value": "846186077111",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service"
                          },
                          {
                            "key": "XGOXe3eMge7eM8UmgxvR4",
                            "type": "Data Element",
                            "value": "CB",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "Buyer's Catalog Number",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)"
                          },
                          {
                            "key": "D3MVvfa5PjkjkrwWB4F5c",
                            "type": "Data Element",
                            "value": "790-01-20",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service"
                          },
                          {
                            "key": "odr6Os6IhzZNiQIdlKAvU",
                            "type": "Data Element",
                            "value": "EN",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "GTIN-13",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)"
                          },
                          {
                            "key": "HUd9hUUnKPnDNn5LXBmq0",
                            "type": "Data Element",
                            "value": "12345",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service"
                          }
                        ]
                      },
                      {
                        "key": "ucGsXeNfOgFFgZREeWOeA",
                        "id": "PIDLoop1",
                        "desc": "Product/Item Description",
                        "purpose": "To describe a product or process in coded or free-form format",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "YUR4t_4w90gJ8JSsDMWjm",
                            "id": "PID",
                            "desc": "Product/Item Description",
                            "purpose": "To describe a product or process in coded or free-form format",
                            "elements": [
                              {
                                "key": "_ZQ85TkEAZEYKGD051r9H",
                                "type": "Data Element",
                                "value": "F",
                                "id": "349",
                                "desc": "Item Description Type",
                                "required": true,
                                "codeValue": "",
                                "definition": "Code indicating the format of a description"
                              },
                              {
                                "key": "mPzZGTqep_AAJTBmsCzYe",
                                "type": "Data Element",
                                "value": "08",
                                "id": "750",
                                "desc": "Product/Process Characteristic Code",
                                "required": false,
                                "codeValue": "Product",
                                "definition": "Code identifying the general class of a product or process characteristic"
                              },
                              {
                                "key": "wFxovCXJWE4oWCIGS-U4Q",
                                "type": "Data Element",
                                "value": "",
                                "id": "559",
                                "desc": "Agency Qualifier Code",
                                "required": false,
                                "definition": "Code identifying the agency assigning the code values"
                              },
                              {
                                "key": "0gWH0oNWFVZblfJ5diJvB",
                                "type": "Data Element",
                                "value": "",
                                "id": "751",
                                "desc": "Product Description Code",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 12,
                                "definition": "A code from an industry code list which provides specific data about a product characteristic"
                              },
                              {
                                "key": "lhk3oHuweEXZR494cHiPt",
                                "type": "Data Element",
                                "value": "WR CARGO SHO 38 BLK SOLID",
                                "id": "352",
                                "desc": "Description",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 80,
                                "definition": "A free-form description to clarify the related data elements and their content"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "key": "3fwAk8hPRcW2GKiUY_C-o",
                        "id": "MSG",
                        "desc": "Message Text",
                        "purpose": "To provide a free-form format that allows the transmission of text information",
                        "elements": [
                          {
                            "key": "2imhQJeifHXHVD2siMq4z",
                            "type": "Data Element",
                            "value": "Mail In or Store",
                            "id": "933",
                            "desc": "Free-Form Message Text",
                            "dataType": "AN",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 264,
                            "definition": "Free-form message text"
                          }
                        ]
                      },
                      {
                        "key": "zq4dU2WSPUkJ3salpE77Q",
                        "id": "PKGLoop1",
                        "desc": "Marking, Packaging, Loading",
                        "purpose": "To describe marking, packaging, loading, and unloading requirements",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "Q_IXqjoS5Q2wJU0KyGX34",
                            "id": "PKG",
                            "desc": "Marking, Packaging, Loading",
                            "purpose": "To describe marking, packaging, loading, and unloading requirements",
                            "elements": [
                              {
                                "key": "EFaOObZtXoQxwSnCn8s-u",
                                "type": "Data Element",
                                "value": "F",
                                "id": "349",
                                "desc": "Item Description Type",
                                "required": false,
                                "codeValue": "",
                                "definition": "Code indicating the format of a description"
                              },
                              {
                                "key": "gs2rEHRgKPfcUMNjKqm36",
                                "type": "Data Element",
                                "value": "WM",
                                "id": "753",
                                "desc": "Packaging Characteristic Code",
                                "required": false,
                                "codeValue": "Wrapping Material",
                                "definition": "Code specifying the marking, packaging, loading and related characteristics being described"
                              },
                              {
                                "key": "bU2Qr7XMjBbygwg1f_Vsr",
                                "type": "Data Element",
                                "value": "",
                                "id": "559",
                                "desc": "Agency Qualifier Code",
                                "required": false,
                                "definition": "Code identifying the agency assigning the code values"
                              },
                              {
                                "key": "rBiOv3w5Circn0sCE5s3R",
                                "type": "Data Element",
                                "value": "",
                                "id": "754",
                                "desc": "Packaging Description Code",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 7,
                                "definition": "A code from an industry code list which provides specific data about the marking, packaging or loading and unloading of a product"
                              },
                              {
                                "key": "Tdt0DQE5s_Ir7pEk3pryK",
                                "type": "Data Element",
                                "value": "GIFTWRAP",
                                "id": "352",
                                "desc": "Description",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 80,
                                "definition": "A free-form description to clarify the related data elements and their content"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "key": "IRxndV2_xNOhIEfXxfSV3",
                        "id": "N9Loop2",
                        "desc": "Reference Identification",
                        "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "kVjgUNDSMg2yCR1BwdKb8",
                            "id": "N9",
                            "desc": "Reference Identification",
                            "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                            "elements": [
                              {
                                "key": "rWqjk4PrCpdCSqS8IuW1z",
                                "type": "Data Element",
                                "value": "L1",
                                "id": "128",
                                "desc": "Reference Identification Qualifier",
                                "required": true,
                                "codeValue": "Letters or Notes",
                                "definition": "Code qualifying the Reference Identification"
                              },
                              {
                                "key": "wZ8rW_tB9zRSP4k1R_kXm",
                                "type": "Data Element",
                                "value": "MESSAGE",
                                "id": "127",
                                "desc": "Reference Identification",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 30,
                                "definition": "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier"
                              },
                              {
                                "key": "DzIcoX681sMzNLkVKxgug",
                                "type": "Data Element",
                                "value": "This item must be returned within 90 days of",
                                "id": "369",
                                "desc": "Free-form Description",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 45,
                                "definition": "Free-form descriptive text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "key": "TmlIzO3tpzhBtEz2_qtJH",
                        "id": "N9Loop2",
                        "desc": "Reference Identification",
                        "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "tudou2ZuDHCumH5vggs10",
                            "id": "N9",
                            "desc": "Reference Identification",
                            "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                            "elements": [
                              {
                                "key": "jN1lGfOnbaJAHVuia2Rj_",
                                "type": "Data Element",
                                "value": "L1",
                                "id": "128",
                                "desc": "Reference Identification Qualifier",
                                "required": true,
                                "codeValue": "Letters or Notes",
                                "definition": "Code qualifying the Reference Identification"
                              },
                              {
                                "key": "8-2Q7WNPUBm8d_2_OJ0Q4",
                                "type": "Data Element",
                                "value": "MESSAGE",
                                "id": "127",
                                "desc": "Reference Identification",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 30,
                                "definition": "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier"
                              },
                              {
                                "key": "2lBbz-0caYW9DZsVDnrKe",
                                "type": "Data Element",
                                "value": " the ship date.",
                                "id": "369",
                                "desc": "Free-form Description",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 45,
                                "definition": "Free-form descriptive text"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "key": "ludd1D7KM6_8qQV9cYf8j",
                        "id": "N1Loop3",
                        "desc": "Name",
                        "purpose": "To identify a party by type of organization, name, and code",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "B47inIZzLMzd50EBahRb6",
                            "id": "N1",
                            "desc": "Name",
                            "purpose": "To identify a party by type of organization, name, and code",
                            "elements": [
                              {
                                "key": "YWb5PN4gcGglYFMqkpQHR",
                                "type": "Data Element",
                                "value": "ST",
                                "id": "98",
                                "desc": "Entity Identifier Code",
                                "required": true,
                                "codeValue": "Ship To",
                                "definition": "Code identifying an organizational entity, a physical location, property or an individual"
                              },
                              {
                                "key": "N-dsXgmturxUuNboUJoEF",
                                "type": "Data Element",
                                "value": "Company",
                                "id": "93",
                                "desc": "Name",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 60,
                                "definition": "Free-form name"
                              }
                            ]
                          },
                          {
                            "key": "5I1ggx0zpT6BYFi7tYLge",
                            "id": "LDTLoop2",
                            "desc": "Lead Time",
                            "purpose": "To specify lead time for availability of products and services",
                            "elements": [],
                            "Loop": [
                              {
                                "key": "o6vpWwoa9VQqXI_8iwHLO",
                                "id": "LDT",
                                "desc": "Lead Time",
                                "purpose": "To specify lead time for availability of products and services",
                                "elements": [
                                  {
                                    "key": "HPPmleLDLnXBXv-p6X_VS",
                                    "type": "Data Element",
                                    "value": "AA",
                                    "id": "345",
                                    "desc": "Lead Time Code",
                                    "required": true,
                                    "codeValue": "From date of PO receipt to sample ready",
                                    "definition": "Code indicating the time range"
                                  },
                                  {
                                    "key": "ht2x4K90V26gB-iOq7od2",
                                    "type": "Data Element",
                                    "value": "10",
                                    "id": "380",
                                    "desc": "Quantity",
                                    "dataType": "R",
                                    "required": true,
                                    "minLength": 1,
                                    "maxLength": 15,
                                    "definition": "Numeric value of quantity"
                                  },
                                  {
                                    "key": "41lEw0D1WBTRfLbGwT7Kc",
                                    "type": "Data Element",
                                    "value": "AA",
                                    "id": "344",
                                    "desc": "Unit of Time Period or Interval",
                                    "required": true,
                                    "codeValue": "",
                                    "definition": "Code indicating the time period or interval"
                                  }
                                ]
                              },
                              {
                                "key": "WtowG5_Ku_77nmEbnxQay",
                                "id": "QTY",
                                "desc": "Quantity",
                                "purpose": "To specify quantity information",
                                "elements": [
                                  {
                                    "key": "D2_h796r-Hjm3y5kT6Fft",
                                    "type": "Data Element",
                                    "value": "10",
                                    "id": "673",
                                    "desc": "Quantity Qualifier",
                                    "required": true,
                                    "codeValue": "Cumulative Quantity - Rejected Material:Disposition Pending",
                                    "definition": "Code specifying the type of quantity"
                                  },
                                  {
                                    "key": "jm5OptKnKiAoJYdoJNkOu",
                                    "type": "Data Element",
                                    "value": "100",
                                    "id": "380",
                                    "desc": "Quantity",
                                    "dataType": "R",
                                    "required": false,
                                    "minLength": 1,
                                    "maxLength": 15,
                                    "definition": "Numeric value of quantity"
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "key": "4oZqV434EdW3zYVUnky87",
                        "id": "SLNLoop1",
                        "desc": "Subline Item Detail",
                        "purpose": "To specify product subline detail item data",
                        "elements": [],
                        "Loop": [
                          {
                            "key": "TfGq81JOxsQtoUpZA43xG",
                            "id": "SLN",
                            "desc": "Subline Item Detail",
                            "purpose": "To specify product subline detail item data",
                            "elements": [
                              {
                                "key": "b9ppbNVhcYtRcGvjTlFiR",
                                "type": "Data Element",
                                "value": "1",
                                "id": "350",
                                "desc": "Assigned Identification",
                                "dataType": "AN",
                                "required": true,
                                "minLength": 1,
                                "maxLength": 20,
                                "definition": "Alphanumeric characters assigned for differentiation within a transaction set"
                              },
                              {
                                "key": "AUveAMy7Es4MJBCwp3itu",
                                "type": "Data Element",
                                "value": "",
                                "id": "350",
                                "desc": "Assigned Identification",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 20,
                                "definition": "Alphanumeric characters assigned for differentiation within a transaction set"
                              },
                              {
                                "key": "ZoDGlBe7dxGJvMra3mTA8",
                                "type": "Data Element",
                                "value": "I",
                                "id": "662",
                                "desc": "Relationship Code",
                                "required": true,
                                "codeValue": "Included",
                                "definition": "Code indicating the relationship between entities"
                              },
                              {
                                "key": "3PwVnoRScPGHkXfj_62J1",
                                "type": "Data Element",
                                "value": "1",
                                "id": "380",
                                "desc": "Quantity",
                                "dataType": "R",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 15,
                                "definition": "Numeric value of quantity"
                              },
                              {
                                "key": "7bKkZlpF5lL-WNcKXkIyf",
                                "type": "Data Element",
                                "value": "EA",
                                "components": [
                                  {
                                    "key": "C97QyA3YD_6gEwJCPCLPM",
                                    "type": "Component Element",
                                    "value": "EA",
                                    "id": "355",
                                    "desc": "Unit or Basis for Measurement Code",
                                    "required": true,
                                    "codeValue": "Each",
                                    "definition": "Code specifying the units in which a value is being expressed, or manner in which a measurement has been taken"
                                  }
                                ],
                                "id": "C001",
                                "desc": "Composite Unit of Measure",
                                "required": false,
                                "definition": "To identify a composite unit of measure\\n\\n(See Figures Appendix for examples of use)"
                              },
                              {
                                "key": "YUcd3EXw7t-Czy4G1AwF8",
                                "type": "Data Element",
                                "value": "3.55",
                                "id": "212",
                                "desc": "Unit Price",
                                "dataType": "R",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 17,
                                "definition": "Price per unit of product, service, commodity, etc."
                              },
                              {
                                "key": "eD14CDqj3TvHszdLMr2fY",
                                "type": "Data Element",
                                "value": "",
                                "id": "639",
                                "desc": "Basis of Unit Price Code",
                                "required": false,
                                "definition": "Code identifying the type of unit price for an item"
                              },
                              {
                                "key": "F6XzxOWCEmenP2UtFFzhZ",
                                "type": "Data Element",
                                "value": "",
                                "id": "662",
                                "desc": "Relationship Code",
                                "required": false,
                                "definition": "Code indicating the relationship between entities"
                              },
                              {
                                "key": "7zj1he4cD1V-USnKGjTSM",
                                "type": "Data Element",
                                "value": "IN",
                                "id": "235",
                                "desc": "Product/Service ID Qualifier",
                                "required": false,
                                "codeValue": "Buyer's Item Number",
                                "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)"
                              },
                              {
                                "key": "5lj3n5sXSHwE6w5I11NhW",
                                "type": "Data Element",
                                "value": "2456987",
                                "id": "234",
                                "desc": "Product/Service ID",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 48,
                                "definition": "Identifying number for a product or service"
                              },
                              {
                                "key": "MfyfDTHjmVwC3__dTuNGA",
                                "type": "Data Element",
                                "value": "SK",
                                "id": "235",
                                "desc": "Product/Service ID Qualifier",
                                "required": false,
                                "codeValue": "Stock Keeping Unit (SKU)",
                                "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)"
                              },
                              {
                                "key": "MyZb5UWT4E4HKY57MObhd",
                                "type": "Data Element",
                                "value": "123456",
                                "id": "234",
                                "desc": "Product/Service ID",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 48,
                                "definition": "Identifying number for a product or service"
                              },
                              {
                                "key": "_JMc7yU17DGuU-i09u3rG",
                                "type": "Data Element",
                                "value": "UP",
                                "id": "235",
                                "desc": "Product/Service ID Qualifier",
                                "required": false,
                                "codeValue": "GTIN-12",
                                "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)"
                              },
                              {
                                "key": "5YNn46ZVWpdIYbE7-H_pW",
                                "type": "Data Element",
                                "value": "105647894512",
                                "id": "234",
                                "desc": "Product/Service ID",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 48,
                                "definition": "Identifying number for a product or service"
                              },
                              {
                                "key": "7x2Q5zHzOOI6jc_6Bw_gz",
                                "type": "Data Element",
                                "value": "CB",
                                "id": "235",
                                "desc": "Product/Service ID Qualifier",
                                "required": false,
                                "codeValue": "Buyer's Catalog Number",
                                "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)"
                              },
                              {
                                "key": "zR3XB4kgrYZlRkNulczC8",
                                "type": "Data Element",
                                "value": "123-12-1239",
                                "id": "234",
                                "desc": "Product/Service ID",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 48,
                                "definition": "Identifying number for a product or service"
                              },
                              {
                                "key": "g4ww4et1DFJ-09qF3ai7b",
                                "type": "Data Element",
                                "value": "UA",
                                "id": "235",
                                "desc": "Product/Service ID Qualifier",
                                "required": false,
                                "codeValue": "",
                                "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)"
                              },
                              {
                                "key": "yRPOJ91FVd_HhlyGeTcYk",
                                "type": "Data Element",
                                "value": "3456787",
                                "id": "234",
                                "desc": "Product/Service ID",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 48,
                                "definition": "Identifying number for a product or service"
                              }
                            ]
                          },
                          {
                            "key": "hYDl36ZUpfl7Ji_0RLg00",
                            "id": "PID",
                            "desc": "Product/Item Description",
                            "purpose": "To describe a product or process in coded or free-form format",
                            "elements": [
                              {
                                "key": "wnEOQkYRNwCA1DSFRhlPp",
                                "type": "Data Element",
                                "value": "F",
                                "id": "349",
                                "desc": "Item Description Type",
                                "required": true,
                                "codeValue": "",
                                "definition": "Code indicating the format of a description"
                              },
                              {
                                "key": "-nFaC-4s7cPQCSrNzqLrB",
                                "type": "Data Element",
                                "value": "08",
                                "id": "750",
                                "desc": "Product/Process Characteristic Code",
                                "required": false,
                                "codeValue": "Product",
                                "definition": "Code identifying the general class of a product or process characteristic"
                              },
                              {
                                "key": "eF_-4P_5kHtiXjZ_9WlgS",
                                "type": "Data Element",
                                "value": "",
                                "id": "559",
                                "desc": "Agency Qualifier Code",
                                "required": false,
                                "definition": "Code identifying the agency assigning the code values"
                              },
                              {
                                "key": "BWmJpLIh9LOENRA5I_n82",
                                "type": "Data Element",
                                "value": "",
                                "id": "751",
                                "desc": "Product Description Code",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 12,
                                "definition": "A code from an industry code list which provides specific data about a product characteristic"
                              },
                              {
                                "key": "M9z7kCL7dghkYbCZ-xz4P",
                                "type": "Data Element",
                                "value": "Component Description",
                                "id": "352",
                                "desc": "Description",
                                "dataType": "AN",
                                "required": false,
                                "minLength": 1,
                                "maxLength": 80,
                                "definition": "A free-form description to clarify the related data elements and their content"
                              }
                            ]
                          },
                          {
                            "key": "I1yUt3Uayex9jhQuPgbvT",
                            "id": "N9Loop3",
                            "desc": "Reference Identification",
                            "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                            "elements": [],
                            "Loop": [
                              {
                                "key": "dR6nFYante_VTRTNnOF8v",
                                "id": "N9",
                                "desc": "Reference Identification",
                                "purpose": "To transmit identifying information as specified by the Reference Identification Qualifier",
                                "elements": [
                                  {
                                    "key": "nlJZZPA88xbxoUZtrm146",
                                    "type": "Data Element",
                                    "value": "L1",
                                    "id": "128",
                                    "desc": "Reference Identification Qualifier",
                                    "required": true,
                                    "codeValue": "Letters or Notes",
                                    "definition": "Code qualifying the Reference Identification"
                                  },
                                  {
                                    "key": "mgNrPBmTQ7bVOdKcUyh3F",
                                    "type": "Data Element",
                                    "value": "MESSAGE",
                                    "id": "127",
                                    "desc": "Reference Identification",
                                    "dataType": "AN",
                                    "required": false,
                                    "minLength": 1,
                                    "maxLength": 30,
                                    "definition": "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier"
                                  },
                                  {
                                    "key": "lcseZUqJqH7yLxVd5mUg8",
                                    "type": "Data Element",
                                    "value": "Subline Item",
                                    "id": "369",
                                    "desc": "Free-form Description",
                                    "dataType": "AN",
                                    "required": false,
                                    "minLength": 1,
                                    "maxLength": 45,
                                    "definition": "Free-form descriptive text"
                                  }
                                ]
                              },
                              {
                                "key": "ZjYLjVgAwI6qK0gOaseSY",
                                "id": "MSG",
                                "desc": "Message Text",
                                "purpose": "To provide a free-form format that allows the transmission of text information",
                                "elements": [
                                  {
                                    "key": "FuUJzZNYdIlbCTwe71Mpx",
                                    "type": "Data Element",
                                    "value": "3 Items",
                                    "id": "933",
                                    "desc": "Free-Form Message Text",
                                    "dataType": "AN",
                                    "required": true,
                                    "minLength": 1,
                                    "maxLength": 264,
                                    "definition": "Free-form message text"
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
                    "key": "zyOd0uQqvNd0pdasHn-WZ",
                    "id": "PO1Loop1",
                    "desc": "Baseline Item Data",
                    "purpose": "To specify basic and most frequently used line item data",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "krundZcPZWik8Ozo6LKds",
                        "id": "PO1",
                        "desc": "Baseline Item Data",
                        "purpose": "To specify basic and most frequently used line item data",
                        "elements": [
                          {
                            "key": "z4vEASrAQljW_fxtUdPSz",
                            "type": "Data Element",
                            "value": "2",
                            "id": "350",
                            "desc": "Assigned Identification",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 20,
                            "definition": "Alphanumeric characters assigned for differentiation within a transaction set"
                          },
                          {
                            "key": "_8kUCmFPfj4gCdFyWNmvq",
                            "type": "Data Element",
                            "value": "3",
                            "id": "330",
                            "desc": "Quantity Ordered",
                            "dataType": "R",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 15,
                            "definition": "Quantity ordered"
                          },
                          {
                            "key": "3Nxz9phXZOKJacZwSdSRh",
                            "type": "Data Element",
                            "value": "EA",
                            "id": "355",
                            "desc": "Unit or Basis for Measurement Code",
                            "required": false,
                            "codeValue": "Each",
                            "definition": "Code specifying the units in which a value is being expressed, or manner in which a measurement has been taken"
                          },
                          {
                            "key": "XRVLwQ7AfvtSr0j01yE_Z",
                            "type": "Data Element",
                            "value": "12.3",
                            "id": "212",
                            "desc": "Unit Price",
                            "dataType": "R",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 17,
                            "definition": "Price per unit of product, service, commodity, etc."
                          },
                          {
                            "key": "fII-4RQcbjufE-QVUK85w",
                            "type": "Data Element",
                            "value": "PE",
                            "id": "639",
                            "desc": "Basis of Unit Price Code",
                            "required": false,
                            "codeValue": "Price per Each",
                            "definition": "Code identifying the type of unit price for an item"
                          },
                          {
                            "key": "UYVkz5mXFR503Y3RBcf4U",
                            "type": "Data Element",
                            "value": "IN",
                            "id": "235",
                            "desc": "Product/Service ID Qualifier",
                            "required": false,
                            "codeValue": "Buyer's Item Number",
                            "definition": "Code identifying the type/source of the descriptive number used in Product/Service ID (234)"
                          },
                          {
                            "key": "NPU0SpTDI9UEJdc_RDkpx",
                            "type": "Data Element",
                            "value": "123",
                            "id": "234",
                            "desc": "Product/Service ID",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 48,
                            "definition": "Identifying number for a product or service"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "xtjS0PAkvRs0247SOm-5U",
                    "id": "CTTLoop1",
                    "desc": "Transaction Totals",
                    "purpose": "To transmit a hash total for a specific element in the transaction set",
                    "elements": [],
                    "Loop": [
                      {
                        "key": "9RjDI_kp0nmolDnZUcKDR",
                        "id": "CTT",
                        "desc": "Transaction Totals",
                        "purpose": "To transmit a hash total for a specific element in the transaction set",
                        "elements": [
                          {
                            "key": "j1QTh_jYz1LPBwACAJ0wc",
                            "type": "Data Element",
                            "value": "1",
                            "id": "354",
                            "desc": "Number of Line Items",
                            "dataType": "N",
                            "required": true,
                            "minLength": 1,
                            "maxLength": 6,
                            "definition": "Total number of line items in the transaction set"
                          },
                          {
                            "key": "0nIji3mGmDzQ4m5MJwLhM",
                            "type": "Data Element",
                            "value": "200",
                            "id": "347",
                            "desc": "Hash Total",
                            "dataType": "R",
                            "required": false,
                            "minLength": 1,
                            "maxLength": 10,
                            "definition": "Sum of values of the specified data element. All values in the data element will be summed without regard to decimal points (explicit or implicit) or signs. Truncation will occur on the left most digits if the sum is greater than the maximum size of the hash total of the data element.\\n\\nExample:\\n-.0018 First occurrence of value being hashed.\\n.18 Second occurrence of value being hashed.\\n1.8 Third occurrence of value being hashed.\\n18.01 Fourth occurrence of value being hashed.\\n---------\\n1855 Hash total prior to truncation.\\n855 Hash total after truncation to three-digit field."
                          }
                        ]
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "key": "clGROfnhqCEUnJR5uZsA5",
                  "id": "ST",
                  "desc": "Transaction Set Header",
                  "purpose": "To indicate the start of a transaction set and to assign a control number",
                  "elements": [
                    {
                      "key": "d28zCW4znZiEekmp9N5qD",
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
                      "key": "N38yP2HvO504ziFpDNYa3",
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
                  "key": "mmt1EC3MZlA_EzkSCe91Q",
                  "id": "SE",
                  "desc": "Transaction Set Trailer",
                  "purpose": "To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)",
                  "elements": [
                    {
                      "key": "BfBkrOIanP-KIMUU9O_xA",
                      "type": "Data Element",
                      "value": "32",
                      "id": "96",
                      "desc": "Number of Included Segments",
                      "dataType": "AN",
                      "required": true,
                      "minLength": 1,
                      "maxLength": 10,
                      "definition": "Total number of segments included in a transaction set including ST and SE segments"
                    },
                    {
                      "key": "AjQCCs4HXGLv5WEPZm92F",
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
              }
            ],
            "startSegment": {
              "key": "rxGVIyIe2S3BKb-4VRfUX",
              "id": "GS",
              "desc": "Functional Group Header",
              "purpose": "To indicate the beginning of a functional group and to provide control information",
              "elements": [
                {
                  "key": "lMFyjtr4kozGN-BjRSAjr",
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
                  "key": "keF7EjRKcpXsSQDPRSboO",
                  "type": "Data Element",
                  "value": "DERICL",
                  "id": "142",
                  "desc": "Application Sender's Code",
                  "required": true,
                  "minLength": 2,
                  "maxLength": 15,
                  "definition": "Code identifying party sending transmission; codes agreed to by trading partners"
                },
                {
                  "key": "9Hkw9E1Bcl6WIQcas4X0y",
                  "type": "Data Element",
                  "value": "TEST01",
                  "id": "124",
                  "desc": "Application Receiver's Code",
                  "required": true,
                  "minLength": 2,
                  "maxLength": 15,
                  "definition": "Code identifying party receiving transmission. Codes agreed to by trading partners"
                },
                {
                  "key": "qwvRSDVDMnohnoYNNzaH-",
                  "type": "Data Element",
                  "value": "20210517",
                  "id": "373",
                  "desc": "Date",
                  "required": true,
                  "minLength": 8,
                  "maxLength": 8,
                  "definition": "Date expressed as CCYYMMDD"
                },
                {
                  "key": "GCDMzmCFTcQN4R8W33aTG",
                  "type": "Data Element",
                  "value": "0643",
                  "id": "337",
                  "desc": "Time",
                  "required": true,
                  "minLength": 4,
                  "maxLength": 8,
                  "definition": "Time expressed in 24-hour clock time as follows: HHMM, or HHMMSS, or HHMMSSD, or HHMMSSDD, where H = hours (00-23), M = minutes (00-59), S = integer seconds (00-59) and DD = decimal seconds; decimal seconds are expressed as follows: D = tenths (0-9) and DD = hundredths (00-99)"
                },
                {
                  "key": "hXeBOb34BFJvnDflLjDM3",
                  "type": "Data Element",
                  "value": "7080",
                  "id": "28",
                  "desc": "Group Control Number",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 9,
                  "definition": "Assigned number originated and maintained by the sender"
                },
                {
                  "key": "M7Ksp_WuQRV2adMGzwafC",
                  "type": "Data Element",
                  "value": "X",
                  "id": "455",
                  "desc": "Responsible Agency Code",
                  "required": true,
                  "minLength": 1,
                  "maxLength": 2,
                  "definition": "Code used in conjunction with Data Element 480 to identify the issuer of the standard"
                },
                {
                  "key": "kbdfgUyOTmyVhEBe3fOLK",
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
              "key": "stgV0U3qGVIMDUHn44OHf",
              "id": "GE",
              "desc": "Functional Group Trailer",
              "purpose": "To indicate the end of a functional group and to provide control information",
              "elements": [
                {
                  "key": "dtYskn_MBxYWfX6FcdV7t",
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
                  "key": "XOixzKyG5XfYiy3KH28NE",
                  "type": "Data Element",
                  "value": "7080",
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
          "key": "ADDB27nkTGwVPQ69KH30U",
          "id": "ISA",
          "desc": "Interchange Control Header",
          "purpose": "To start and identify an interchange of zero or more functional groups and interchange-related control segments",
          "elements": [
            {
              "key": "13-pFNgyMBlTjXVkyOkDa",
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
              "key": "PX3KpA-Y24dqsYZYgima0",
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
              "key": "NRCBzRSMeLAmsk4YV9HxV",
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
              "key": "iMtf-6OIXJuddWZvuUIkm",
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
              "key": "4qjV2NgiMGXMevV5-87Js",
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
              "key": "IOtze3MxCRjLmBa61YZRI",
              "type": "Data Element",
              "value": "DERICL         ",
              "id": "I06",
              "desc": "Interchange Sender ID",
              "required": true,
              "minLength": 15,
              "maxLength": 15,
              "definition": "Identification code published by the sender for other parties to use as the receiver ID to route data to them; the sender always codes this value in the sender ID element"
            },
            {
              "key": "gG1c7hFCH2guhLzWCxJnZ",
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
              "key": "RYmSSOz2v-NRKOzmBOZkz",
              "type": "Data Element",
              "value": "TEST01         ",
              "id": "I07",
              "desc": "Interchange Receiver ID",
              "required": true,
              "minLength": 15,
              "maxLength": 15,
              "definition": "Identification code published by the receiver of the data; When sending, it is used by the sender as their sending ID, thus other parties sending to them will use this as a receiving ID to route data to them"
            },
            {
              "key": "sL3s0iewT-7TdHctRne9V",
              "type": "Data Element",
              "value": "210517",
              "id": "I08",
              "desc": "Interchange Date",
              "required": true,
              "minLength": 6,
              "maxLength": 6,
              "definition": "Date of the interchange"
            },
            {
              "key": "273LcgT6Ey8xPQyjfWkgV",
              "type": "Data Element",
              "value": "0643",
              "id": "I09",
              "desc": "Interchange Time",
              "required": true,
              "minLength": 4,
              "maxLength": 4,
              "definition": "Time of the interchange"
            },
            {
              "key": "JdDJWXNNVGxvGr7HLSIl4",
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
              "key": "dyUtPNaaisyRS3Wwtdbue",
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
              "key": "jvjB8g-beIQo8vzWRAIVz",
              "type": "Data Element",
              "value": "000007080",
              "id": "I12",
              "desc": "Interchange Control Number",
              "required": true,
              "minLength": 9,
              "maxLength": 9,
              "definition": "A control number assigned by the interchange sender"
            },
            {
              "key": "m3gJKFhWOcYsywIf2_9M5",
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
              "key": "Eg8p66mNV-NBGDZYxNWc-",
              "type": "Data Element",
              "value": "P",
              "id": "I14",
              "desc": "Usage Indicator",
              "required": true,
              "minLength": 1,
              "maxLength": 1,
              "definition": "Code to indicate whether data enclosed by this interchange envelope is test, production or information"
            },
            {
              "key": "xR8CHUTiKRF2RnUkeuxsu",
              "type": "Data Element",
              "value": ">",
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
          "key": "cP8bbWwoB43C0hDDsMder",
          "id": "IEA",
          "desc": "Interchange Control Trailer",
          "purpose": "To define the end of an interchange of zero or more functional groups and interchange-related control segments",
          "elements": [
            {
              "key": "3n1ZXU4rHGuTNmjVNCTpv",
              "type": "Data Element",
              "value": "1",
              "id": "I16",
              "desc": "Number of Transaction Sets Included",
              "required": true,
              "minLength": 1,
              "maxLength": 5,
              "definition": "A count of the number of functional groups included in an interchange"
            },
            {
              "key": "OS-2FMdokDApNMCrW7shK",
              "type": "Data Element",
              "value": "000007080",
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
  

  const edifactTestData: IEdiDocument = {
    "interchanges": [
      {
        "key": "cwwWNxwr8t8ztiEPeHjCU",
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
            "key": "Og1SMXIKITAoEVSZRqG9W",
            "meta": {},
            "id": "",
            "transactionSets": [
              {
                "key": "SzlDL2qC5idJzc5fh1s_p",
                "meta": { "id": "001", "version": "ORDERS", "release": "D96A" },
                "id": "001",
                "segments": [
                  {
                    "key": "qSTEI3EyaE2SREt4nEhmF",
                    "id": "BGM",
                    "desc": "BEGINNING OF MESSAGE",
                    "purpose": "To indicate the type and function of a message and to transmit the identifying number.",
                    "elements": [
                      {
                        "key": "G8VWmAxNJ1dv1Wwkh56kP",
                        "type": "Data Element",
                        "value": "220",
                        "components": [
                          {
                            "key": "LQkm8bGrFSCDZqtmh7S01",
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
                        "key": "RFzZ-HVa-gQ7evVaAbPK4",
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
                        "key": "D3IYJXgXBduhzATXByvdP",
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
                  "key": "yTjDo9-B55iC1UIYObDya",
                  "id": "UNH",
                  "desc": "Message header",
                  "purpose": "To head, identify and specify a message.",
                  "elements": [
                    {
                      "key": "icwlX3SLTB3yrbq_Wqq-X",
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
                      "key": "ra4xZDbhMezOjRG1ocY1l",
                      "type": "Data Element",
                      "value": "ORDERS:D:96A:UN:EAN001",
                      "components": [
                        {
                          "key": "W0aph-wRJL8msiFroH4j8",
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
                          "key": "vzujJ_ncQDCYoQaBl5AZA",
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
                          "key": "H8XnqUIt93ypvicwYJgXW",
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
                          "key": "38q_EbtoU5rRoWhG0uazp",
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
                          "key": "2Rl_sMDSVrWWoX5BLJIL_",
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
                  "key": "ZnHoaoSxDsaMREgvvFbfO",
                  "id": "UNT",
                  "desc": "Message trailer",
                  "purpose": "To end and check the completeness of a message.",
                  "elements": [
                    {
                      "key": "Zi0MHqXeSsuu_YUptsJ8J",
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
                      "key": "pUdnzPxTUprSXE9iIPJPm",
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
                "key": "VTiXglY3833yy4CNeCEwf",
                "meta": { "id": "002", "version": "DESADV", "release": "D96A" },
                "id": "002",
                "segments": [
                  {
                    "key": "OnoWolP0H_WuG5QX65Vrt",
                    "id": "BGM",
                    "desc": "BEGINNING OF MESSAGE",
                    "purpose": "To indicate the type and function of a message and to transmit the identifying number.",
                    "elements": [
                      {
                        "key": "OLYBtkclmYr0GjTSQpb_x",
                        "type": "Data Element",
                        "value": "351",
                        "components": [
                          {
                            "key": "A-VPXTfjK8cLxpqLUifaH",
                            "type": "Component Element",
                            "value": "351",
                            "id": "1001",
                            "desc": "Document/message name, coded",
                            "dataType": "AN",
                            "required": false,
                            "minLength": 0,
                            "maxLength": 3,
                            "codeValue": "Despatch advice",
                            "definition": "Document/message identifier expressed in code."
                          }
                        ],
                        "id": "C002",
                        "desc": "DOCUMENT/MESSAGE NAME",
                        "required": false,
                        "definition": "Identification of a type of document/message by code or name. Code preferred."
                      },
                      {
                        "key": "IfsQtF7MUTIqSEgXwS3KK",
                        "type": "Data Element",
                        "value": "20171229",
                        "id": "1004",
                        "desc": "DOCUMENT/MESSAGE NUMBER",
                        "dataType": "AN",
                        "required": false,
                        "minLength": 0,
                        "maxLength": 35,
                        "definition": "Reference number assigned to the document/message by the issuer."
                      }
                    ]
                  }
                ],
                "startSegment": {
                  "key": "af0_-O__NPy8nViZqck_n",
                  "id": "UNH",
                  "desc": "Message header",
                  "purpose": "To head, identify and specify a message.",
                  "elements": [
                    {
                      "key": "hvAkPqry_zs7Z6DzxO1oI",
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
                      "key": "F4HwBRzr3EMwGpJDPk2bX",
                      "type": "Data Element",
                      "value": "DESADV:D:96A:UN:EAN001",
                      "components": [
                        {
                          "key": "h5kJgCyurEJlm06uSK03a",
                          "type": "Component Element",
                          "value": "DESADV",
                          "id": "0065",
                          "desc": "Message type identifier",
                          "dataType": "AN",
                          "required": true,
                          "minLength": 0,
                          "maxLength": 6,
                          "codeValue": "Despatch advice message",
                          "definition": "Code identifying a type of message and assigned by its controlling agency."
                        },
                        {
                          "key": "gYMCt2hkZvoxHpnBYOZbw",
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
                          "key": "KEyQg416dZqDsnJu2slQa",
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
                          "key": "uJ5THKtdu0OsGNCKWneoa",
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
                          "key": "vJgDOBZbxa8U75gKv97uN",
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
                  "key": "r6VLSjM9q0dgQ3IJK5SNL",
                  "id": "UNT",
                  "desc": "Message trailer",
                  "purpose": "To end and check the completeness of a message.",
                  "elements": [
                    {
                      "key": "1ZlXfVcP1EPe6B6cEo4pR",
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
                      "key": "rvjU_8eXyiVMHFRwOFqne",
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
          "key": "IPXaV8gkK2BhzMN3jSE_u",
          "id": "UNB",
          "desc": "Interchange header",
          "purpose": "To start, identify and specify an interchange.",
          "elements": [
            {
              "key": "RtcWWoejTOwvLI1e86yVg",
              "type": "Data Element",
              "value": "UNOA:2",
              "components": [
                {
                  "key": "3Bab0rzCa-ITGDfUJKFwA",
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
                  "key": "z_Pdd_Nabg5VoVjsPQzpO",
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
              "key": "TYaCMs66oAjFQGtNcK9OI",
              "type": "Data Element",
              "value": "<Sender GLN>:14",
              "components": [
                {
                  "key": "E2xESaTMtQ4fLh3ChVLub",
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
                  "key": "m1mAimI2WSglw1EsFngg4",
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
              "key": "zrGKWOMvh-fUMwDApUNd9",
              "type": "Data Element",
              "value": "<Receiver GLN>:14",
              "components": [
                {
                  "key": "_cz0cMFDMzvuT7nHdiIUs",
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
                  "key": "hgt15LRyZ4Fzjtg7ShFiy",
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
              "key": "fMhpqqzbI6rRSN_BkrRr8",
              "type": "Data Element",
              "value": "140407:0910",
              "components": [
                {
                  "key": "453JpxB_6CNlUOr4xTN7o",
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
                  "key": "zM_49hav-oT3cJvWecCMS",
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
              "key": "oi5PVs0ZiWJEmXqRpG8V6",
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
          "key": "CSBRV-LqqdQrtb2I4_5JR",
          "id": "UNZ",
          "desc": "Interchange trailer",
          "purpose": "To end and check the completeness of an interchange.",
          "elements": [
            {
              "key": "KBCKyYoz2-A0w7G3icSxb",
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
              "key": "o_A8KqJ80EeUrZk_CzCtZ",
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
        "key": "Hh314lQNuJak5LEbX4nL5",
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
            "key": "2vtPYeBv8vJo9VzKhtbIc",
            "meta": {},
            "id": "",
            "transactionSets": [
              {
                "key": "8Ecj3OHJuPREQ2cJ_FrJZ",
                "meta": { "id": "003", "version": "ORDERS", "release": "D96A" },
                "id": "003",
                "segments": [
                  {
                    "key": "R0Sryyy-cdE77WiQ1-Tgt",
                    "id": "BGM",
                    "desc": "BEGINNING OF MESSAGE",
                    "purpose": "To indicate the type and function of a message and to transmit the identifying number.",
                    "elements": [
                      {
                        "key": "ftBgAPUhbp26D1SFF5Joy",
                        "type": "Data Element",
                        "value": "220",
                        "components": [
                          {
                            "key": "jPQM_mqS-T7ipN-x05Vu2",
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
                        "key": "-T2peFOAWSzpSIvQjupb3",
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
                        "key": "fnmhsuZi3fpJC8LLJyUQS",
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
                  "key": "FCNg29wWd3Q70JSA872Wb",
                  "id": "UNH",
                  "desc": "Message header",
                  "purpose": "To head, identify and specify a message.",
                  "elements": [
                    {
                      "key": "hvy15rfkQXwVjMdomGSqw",
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
                      "key": "Ks__LmxFkiLxLfJPuU6S_",
                      "type": "Data Element",
                      "value": "ORDERS:D:96A:UN:EAN001",
                      "components": [
                        {
                          "key": "tW8pj59b_jcbmA6A3vNBW",
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
                          "key": "cMoDrnp2eagxHnzvixlas",
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
                          "key": "al1NS8HH8nOl-deMyrnpI",
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
                          "key": "ij9cSWEgs5ODAHvUDAofN",
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
                          "key": "CsRSosw0YqPanYxz8xIFW",
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
                  "key": "Wkj-o7tx9yPBsjVatfXiH",
                  "id": "UNT",
                  "desc": "Message trailer",
                  "purpose": "To end and check the completeness of a message.",
                  "elements": [
                    {
                      "key": "d-h11gMNke0BUz5CAMfPC",
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
                      "key": "a7OxhpqTnqfnWjUN8O8od",
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
          "key": "OB0VSDJtSYzgxg_83qfQO",
          "id": "UNB",
          "desc": "Interchange header",
          "purpose": "To start, identify and specify an interchange.",
          "elements": [
            {
              "key": "hg4KcT01ZCRIg5I7aNoNw",
              "type": "Data Element",
              "value": "UNOA:2",
              "components": [
                {
                  "key": "XTesPfG7AA8Uw2ijSfXB9",
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
                  "key": "tPT9Lki5b63OAeVPTwWrC",
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
              "key": "DFBNMeU0NSTx88l92Q7TB",
              "type": "Data Element",
              "value": "<Sender GLN>:14",
              "components": [
                {
                  "key": "BiyxswJJSBWhqwQFqu0mR",
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
                  "key": "a-lRTcR7LeA0MlVnSTt1N",
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
              "key": "W2_eK9t_Gj8O6OaUgekiy",
              "type": "Data Element",
              "value": "<Receiver GLN>:14",
              "components": [
                {
                  "key": "d3ZIr_U2RcVkybEhBo5Wr",
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
                  "key": "aPRKokRDlzz34xIDnF7uM",
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
              "key": "yHDqiMKbwnUXXXd6qWR_v",
              "type": "Data Element",
              "value": "140407:0910",
              "components": [
                {
                  "key": "3XGAUzG6PNqjJXGfg7vP9",
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
                  "key": "S9SGkWtM7QOohIFnajv9j",
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
              "key": "fM5gXOyVhFRJLuMq-aHF0",
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
          "key": "zHqlzwPbVscMq5Sam0sm8",
          "id": "UNZ",
          "desc": "Interchange trailer",
          "purpose": "To end and check the completeness of an interchange.",
          "elements": [
            {
              "key": "PuzSK_BNGuCeIGLgud_Ny",
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
              "key": "qtPYm6qe7BGKMU_OTQ4Mw",
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
      "key": "UA0DPFN4U8YEHYiuh6zi0",
      "id": "UNA",
      "desc": "Delimiter String Advice",
      "purpose": "To start, identify and specify an interchange.",
      "elements": [
        {
          "key": "4yTKyFEjNZv7P4sgCXAu1",
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
          "key": "8m0wFulUTuiVCHFDa0xSw",
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
          "key": "y9kt43A4n2YqC5dFiY0dV",
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
          "key": "5UeTX_6yPyBwFBE7oD6yq",
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
          "key": "i6Qd9RWFFY9sMzdY-5nsp",
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
  };
  

  return new EdiDocument(x12TestData);
}
