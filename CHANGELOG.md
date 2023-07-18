# Change Log

All notable changes to the "edi-edifact-support" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

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
