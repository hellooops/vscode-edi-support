# Change Log

All notable changes to the "edi-edifact-support" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## Unreleased

## [1.6.3] - 2025-01-16

### Changed

- Use codeLenses as the identifications if the same level interchanges/functionalGroups/transactionSets occurs multiple times.
- Support qualifier explanation in element annotation.

### Fixed

- Don't crash when unexpected composite element occurs.
- Optimize the logic of parsing separators.
- Optimize the support line break as the segment delimiter.


## [1.6.2] - 2024-11-27

### Changed

- Set UNB06(S005) optional.


## [1.6.1] - 2024-11-27

### Added

- Add MessageInfo to transaction set info section in preview.

### Changed

- Set inlay hints default configuration to false.


## [1.6.0] - 2024-11-26

### Added

- Support loop.
- Support trailing annotations.

### Changed

- Remove elements inlay hints.
- Don't prettify document when toggle inlay hints.


## [1.5.0] - 2024-11-19

### Added

- Fully support multiple interchange/functional group/transaction set.
- Preview tree nested sticky.


## [1.4.3] - 2024-09-14

### Fixed

- Fix semantic tokens support for segment delimiter \n in x12.


## [1.4.2] - 2024-04-22

### Added

- Add codelens for preview.


## [1.4.0] - 2024-04-19

### Added

- ✨ Support document preview.


## [1.3.1] - 2024-03-20

### Changed

- Adjust separator color in dark theme

### Fixed

- Fix bug when segment delimiter is \r, the semantic tokens are built wrong.


## [1.3.0] - 2024-03-19

### Added

- ✨Semantic highlighting with with human readable colors
- Performance improvement

### Fixed

- Open strict mode. Fix typescript issue.


## [1.2.2] - 2023-11-30

### Fixed

- GS06 length is supposed to be 6 when release is less than 00401.


## [1.2.1] - 2023-11-23

### Fixed

- Fix wrong segments count for X12-SE01 and EDIFACT-UNT01 when there are multiple transactions in one file.


## [1.2.0] - 2023-11-06

### Changed

- Remove "EDI Schema Reference" link for mock segments and elements.


## [1.1.9] - 2023-11-03

### Fixed

- Fix parsing escaped element and segment delimiter according to UNA release character.


## [1.1.8] - 2023-10-23

### Added

- Support segments count check for X12-SE01 and EDIFACT-UNT01.


## [1.1.7] - 2023-08-31

### Added

- Support `.ansi` file extension for x12.


## [1.1.6] - 2023-08-03

### Added

- Support x12 different release in ISA and GS.

### Changed

- Also show element id in explorer and documentSymbols.


## [1.1.5] - 2023-07-31

### Fixed

- Fix EDIFACT UNA incorrect parsing and prettify.


## [1.1.4] - 2023-07-26

### Fixed

- Fixed schema import issue.


## [1.1.3] - 2023-07-26

### Fixed

- Fixed component element parsing bug when the element is empty.


## [1.1.2] - 2023-07-24

### Fixed

- Message version is not longer essential for getting schema.
- Support Document Symbols


## [1.1.1] - 2023-07-24

### Changed

- Move the inlayHint to the element left.


## [1.1.0] - 2023-07-24

### Added

- Support extra commands in edi explorer.
- Support segment and element navigation in edi explorer.

### Changed

- Remove the scheme restriction for the features.


## [1.0.9] - 2023-07-18

### Added

- Support `Edi Support Explorer` view

### Fixed

- Fix x12 ISA and edifact UNA segments lost segmentName property when parsing


## [1.0.8] - 2023-07-14

### Fixed

- Fix the incorrect url in x12 hovering markdown.


## [1.0.7] - 2023-07-12

### Added

- File icon for edi files.
- Editor title menu.
- Configuration for editor title menu.
- Language detection by first line.

### Fixed

- Don't formatting if parsing failed
- Change X12 schema ST03 maxLength from 9 to 35.

### Changed
- Use separators to parse X12 ISA


## [1.0.2] - 2023-07-07

### Added

- Support parsing more separators for X12

## [1.0.1] - 2023-07-06

### Changed

- Change extension icon

## [1.0.0] - 2023-07-06

### Added

- Support X12
  - Minify
  - Prettify
  - Formatting
  - Syntax highlighting
- Inlay hints for X12 and EDIFACT
- Command `Toggle Inlay Hints`
- Diagnostics for X12 and EDIFACT
- Language detection for X12 and EDIFACT


### Changed

- Codelens: add commands in codelens instead of showing message information

## [0.2.4] - 2023-07-03

## Added

- Hover: qualifier option description

### Fixed

- Typescript compile errors
- Some segmentName properties are lost when parsing

## [0.2.3] - 2023-06-02

### Fixed

- Remove `Method not implemented.` error when formatting

## [0.2.2] - 2023-05-26

### Changed

- Rename the dispaly name of the extension from `edi-edifact-support` to `Edi Edifact Support`

## [0.2.1] - 2023-05-25

### Added

- Syntax highlighting for EDIFACT
- Minify for EDIFACT
- Prettify for EDIFACT
- Formatting for EDIFACT
- Message information in codelens
