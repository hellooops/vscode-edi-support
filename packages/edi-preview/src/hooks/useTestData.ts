export default function useTestData(): IEdiMessage {
  return {
    ediVersion: { release: "00401", version: "850" },
    segments: [
      {
        key: 0,
        id: "ISA",
        desc: "Interchange Control Header",
        purpose:
          "To start and identify an interchange of zero or more functional groups and interchange-related control segments",
        elements: [
          {
            key: "ISA01",
            type: "Data Element",
            value: "00",
            id: "I01",
            desc: "Authorization Information Qualifier",
            required: true,
            minLength: 2,
            maxLength: 2
          },
          {
            key: "ISA02",
            type: "Data Element",
            value: " ",
            id: "I02",
            desc: "Authorization Information",
            required: true,
            minLength: 10,
            maxLength: 10
          },
          {
            key: "ISA03",
            type: "Data Element",
            value: "00",
            id: "I03",
            desc: "Security Information Qualifier",
            required: true,
            minLength: 2,
            maxLength: 2
          },
          {
            key: "ISA04",
            type: "Data Element",
            value: " ",
            id: "I04",
            desc: "Security Information",
            required: true,
            minLength: 10,
            maxLength: 10
          },
          {
            key: "ISA05",
            type: "Data Element",
            value: "ZZ",
            id: "I05",
            desc: "Interchange ID Qualifier",
            required: true,
            minLength: 2,
            maxLength: 2
          },
          {
            key: "ISA06",
            type: "Data Element",
            value: "DERICL ",
            id: "I06",
            desc: "Interchange Sender ID",
            required: true,
            minLength: 15,
            maxLength: 15
          },
          {
            key: "ISA07",
            type: "Data Element",
            value: "ZZ",
            id: "I05",
            desc: "Interchange ID Qualifier",
            required: true,
            minLength: 2,
            maxLength: 2
          },
          {
            key: "ISA08",
            type: "Data Element",
            value: "TEST01 ",
            id: "I07",
            desc: "Interchange Receiver ID",
            required: true,
            minLength: 15,
            maxLength: 15
          },
          {
            key: "ISA09",
            type: "Data Element",
            value: "210517",
            id: "I08",
            desc: "Interchange Date",
            required: true,
            minLength: 6,
            maxLength: 6
          },
          {
            key: "ISA10",
            type: "Data Element",
            value: "0643",
            id: "I09",
            desc: "Interchange Time",
            required: true,
            minLength: 4,
            maxLength: 4
          },
          {
            key: "ISA11",
            type: "Data Element",
            value: "U",
            id: "I10",
            desc: "Interchange Control Standards Identifier",
            required: true,
            minLength: 1,
            maxLength: 1
          },
          {
            key: "ISA12",
            type: "Data Element",
            value: "00401",
            id: "I11",
            desc: "Interchange Control Version Number",
            required: true,
            minLength: 5,
            maxLength: 5
          },
          {
            key: "ISA13",
            type: "Data Element",
            value: "000007080",
            id: "I12",
            desc: "Interchange Control Number",
            required: true,
            minLength: 9,
            maxLength: 9
          },
          {
            key: "ISA14",
            type: "Data Element",
            value: "0",
            id: "I13",
            desc: "Acknowledgment Requested",
            required: true,
            minLength: 1,
            maxLength: 1
          },
          {
            key: "ISA15",
            type: "Data Element",
            value: "P",
            id: "I14",
            desc: "Usage Indicator",
            required: true,
            minLength: 1,
            maxLength: 1
          },
          {
            key: "ISA16",
            type: "Data Element",
            value: ">",
            id: "I15",
            desc: "Component Element Separator",
            required: true,
            minLength: 1,
            maxLength: 1
          }
        ]
      },
      {
        key: 108,
        id: "GS",
        desc: "Functional Group Header",
        purpose:
          "To indicate the beginning of a functional group and to provide control information",
        elements: [
          {
            key: "GS01",
            type: "Data Element",
            value: "PO",
            id: "479",
            desc: "Functional Identifier Code",
            required: true,
            minLength: 2,
            maxLength: 2
          },
          {
            key: "GS02",
            type: "Data Element",
            value: "DERICL",
            id: "142",
            desc: "Application Sender's Code",
            required: true,
            minLength: 2,
            maxLength: 15
          },
          {
            key: "GS03",
            type: "Data Element",
            value: "TEST01",
            id: "124",
            desc: "Application Receiver's Code",
            required: true,
            minLength: 2,
            maxLength: 15
          },
          {
            key: "GS04",
            type: "Data Element",
            value: "20210517",
            id: "373",
            desc: "Date",
            required: true,
            minLength: 8,
            maxLength: 8
          },
          {
            key: "GS05",
            type: "Data Element",
            value: "0643",
            id: "337",
            desc: "Time",
            required: true,
            minLength: 4,
            maxLength: 8
          },
          {
            key: "GS06",
            type: "Data Element",
            value: "7080",
            id: "28",
            desc: "Group Control Number",
            required: true,
            minLength: 1,
            maxLength: 9
          },
          {
            key: "GS07",
            type: "Data Element",
            value: "X",
            id: "455",
            desc: "Responsible Agency Code",
            required: true,
            minLength: 1,
            maxLength: 2
          },
          {
            key: "GS08",
            type: "Data Element",
            value: "004010",
            id: "480",
            desc: "Version / Release / Industry Identifier Code",
            required: true,
            minLength: 1,
            maxLength: 12
          }
        ]
      },
      {
        key: 158,
        id: "ST",
        desc: "Transaction Set Header",
        purpose: "To indicate the start of a transaction set and to assign a control number",
        elements: [
          {
            key: "ST01",
            type: "Data Element",
            value: "850",
            id: "143",
            desc: "Transaction Set Identifier Code",
            dataType: "AN",
            required: true,
            minLength: 3,
            maxLength: 3,
            qualifierRef: "Transaction Set Identifier Code",
            definition: "Code uniquely identifying a Transaction Set"
          },
          {
            key: "ST02",
            type: "Data Element",
            value: "0001",
            id: "329",
            desc: "Transaction Set Control Number",
            dataType: "AN",
            required: true,
            minLength: 4,
            maxLength: 9,
            definition:
              "Identifying control number that must be unique within the transaction set functional group assigned by the originator for a transaction set"
          }
        ]
      },
      {
        key: 172,
        id: "BEG",
        desc: "Beginning Segment for Purchase Order",
        purpose:
          "To indicate the beginning of the Purchase Order Transaction Set and transmit identifying numbers and dates",
        elements: [
          {
            key: "BEG01",
            type: "Data Element",
            value: "00",
            id: "353",
            desc: "Transaction Set Purpose Code",
            required: true,
            qualifierRef: "Transaction Set Purpose Code",
            definition: "Code identifying purpose of transaction set"
          },
          {
            key: "BEG02",
            type: "Data Element",
            value: "BK",
            id: "92",
            desc: "Purchase Order Type Code",
            required: true,
            qualifierRef: "Purchase Order Type Code",
            definition: "Code specifying the type of Purchase Order"
          },
          {
            key: "BEG03",
            type: "Data Element",
            value: "0019-1234567-1234",
            id: "324",
            desc: "Purchase Order Number",
            dataType: "AN",
            required: true,
            minLength: 1,
            maxLength: 22,
            definition: "Identifying number for Purchase Order assigned by the orderer/purchaser"
          },
          {
            key: "BEG04",
            type: "Data Element",
            value: "",
            id: "328",
            desc: "Release Number",
            dataType: "AN",
            required: false,
            minLength: 1,
            maxLength: 30,
            definition:
              "Number identifying a release against a Purchase Order previously placed by the parties involved in the transaction"
          },
          {
            key: "BEG05",
            type: "Data Element",
            value: "20000130",
            id: "373",
            desc: "Date",
            dataType: "DT",
            required: true,
            minLength: 8,
            maxLength: 8,
            definition: "Date expressed as CCYYMMDD"
          }
        ]
      },
      {
        key: 212,
        id: "REF",
        desc: "Reference Identification",
        purpose: "To specify identifying information",
        elements: [
          {
            key: "REF01",
            type: "Data Element",
            value: "IA",
            id: "128",
            desc: "Reference Identification Qualifier",
            required: true,
            qualifierRef: "Reference Identification Qualifier",
            definition: "Code qualifying the Reference Identification"
          },
          {
            key: "REF02",
            type: "Data Element",
            value: "3688063",
            id: "127",
            desc: "Reference Identification",
            dataType: "AN",
            required: false,
            minLength: 1,
            maxLength: 30,
            definition:
              "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier"
          },
          {
            key: "REF03",
            type: "Data Element",
            value: "VENDOR NAME",
            id: "352",
            desc: "Description",
            dataType: "AN",
            required: false,
            minLength: 1,
            maxLength: 80,
            definition:
              "A free-form description to clarify the related data elements and their content"
          }
        ]
      },
      {
        key: 241,
        id: "REF",
        desc: "Reference Identification",
        purpose: "To specify identifying information",
        elements: [
          {
            key: "REF01",
            type: "Data Element",
            value: "2H",
            id: "128",
            desc: "Reference Identification Qualifier",
            required: true,
            qualifierRef: "Reference Identification Qualifier",
            definition: "Code qualifying the Reference Identification"
          },
          {
            key: "REF02",
            type: "Data Element",
            value: "AD",
            id: "127",
            desc: "Reference Identification",
            dataType: "AN",
            required: false,
            minLength: 1,
            maxLength: 30,
            definition:
              "Reference information as defined for a particular Transaction Set or as specified by the Reference Identification Qualifier"
          },
          {
            key: "REF03",
            type: "Data Element",
            value: "Ad",
            id: "352",
            desc: "Description",
            dataType: "AN",
            required: false,
            minLength: 1,
            maxLength: 80,
            definition:
              "A free-form description to clarify the related data elements and their content"
          }
        ]
      },
      {
        key: 256,
        id: "CTT",
        desc: "Transaction Totals",
        purpose: "To transmit a hash total for a specific element in the transaction set",
        elements: [
          {
            key: "CTT01",
            type: "Data Element",
            value: "1",
            id: "354",
            desc: "Number of Line Items",
            dataType: "N",
            required: true,
            minLength: 1,
            maxLength: 6,
            definition: "Total number of line items in the transaction set"
          },
          {
            key: "CTT02",
            type: "Data Element",
            value: "200",
            id: "347",
            desc: "Hash Total",
            dataType: "R",
            required: false,
            minLength: 1,
            maxLength: 10,
            definition:
              "Sum of values of the specified data element. All values in the data element will be summed without regard to decimal points (explicit or implicit) or signs. Truncation will occur on the left most digits if the sum is greater than the maximum size of the hash total of the data element.\n\nExample:\n-.0018 First occurrence of value being hashed.\n.18 Second occurrence of value being hashed.\n1.8 Third occurrence of value being hashed.\n18.01 Fourth occurrence of value being hashed.\n---------\n1855 Hash total prior to truncation.\n855 Hash total after truncation to three-digit field."
          }
        ]
      },
      {
        key: 268,
        id: "SE",
        desc: "Transaction Set Trailer",
        purpose:
          "To indicate the end of the transaction set and provide the count of the transmitted segments (including the beginning (ST) and ending (SE) segments)",
        elements: [
          {
            key: "SE01",
            type: "Data Element",
            value: "6",
            id: "96",
            desc: "Number of Included Segments",
            dataType: "AN",
            required: true,
            minLength: 1,
            maxLength: 10,
            definition:
              "Total number of segments included in a transaction set including ST and SE segments"
          },
          {
            key: "SE02",
            type: "Data Element",
            value: "0001",
            id: "329",
            desc: "Transaction Set Control Number",
            dataType: "AN",
            required: true,
            minLength: 4,
            maxLength: 9,
            definition:
              "Identifying control number that must be unique within the transaction set functional group assigned by the originator for a transaction set"
          }
        ]
      },
      {
        key: 280,
        id: "GE",
        desc: "Functional Group Trailer",
        purpose: "To indicate the end of a functional group and to provide control information",
        elements: [
          {
            key: "GE01",
            type: "Data Element",
            value: "1",
            id: "97",
            desc: "Number of Transaction Sets Included",
            required: true,
            minLength: 1,
            maxLength: 6
          },
          {
            key: "GE02",
            type: "Data Element",
            value: "7080",
            id: "28",
            desc: "Group Control Number",
            required: true,
            minLength: 1,
            maxLength: 9
          }
        ]
      },
      {
        key: 292,
        id: "IEA",
        desc: "Interchange Control Trailer",
        purpose:
          "To define the end of an interchange of zero or more functional groups and interchange-related control segments",
        elements: [
          {
            key: "IEA01",
            type: "Data Element",
            value: "1",
            id: "I16",
            desc: "Number of Transaction Sets Included",
            required: true,
            minLength: 1,
            maxLength: 5
          },
          {
            key: "IEA02",
            type: "Data Element",
            value: "000007080",
            id: "I12",
            desc: "Group Control Number",
            required: true,
            minLength: 9,
            maxLength: 9
          }
        ]
      }
    ]
  };
}
