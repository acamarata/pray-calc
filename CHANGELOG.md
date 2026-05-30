# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.2] - 2026-05-30

### Fixed
- Add explicit `files` field to package.json; remove `.npmignore` to ensure correct published file set
- Include `dist/index.d.mts` in published package (was missing from 2.1.1)

## [2.1.1] - 2026-05-28

### Changed
- Flatten exports map to ADR-015 standard (import/require/types at top level)
- Add "./package.json" export condition
- Add coverage script (c8 --reporter=lcov)
- Migrate CI from pnpm/action-setup to corepack enable

## [2.1.0] - 2026-05-28

### Added
- Initial release
