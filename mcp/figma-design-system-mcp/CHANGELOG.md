# Changelog

## [1.1.0] - 2026-04-09

### Added
- **Branch support**: List and switch between Figma branches
- New tools:
  - `list_branches` - List all available branches in the file
  - `switch_branch` - Switch to a specific branch by key
  - `switch_to_main` - Return to the main file
  - `get_current_branch` - Get currently active branch info
- All component/token operations now respect the active branch
- Current branch info included in `get_file_info` response

### Changed
- Updated all existing tools to work with the currently active branch
- FigmaClient now tracks and manages branch state

## [1.0.0] - 2026-04-09

### Added
- Initial release
- Component listing and search
- Design token extraction
- Style reading (colors, typography, effects)
- File information retrieval
- Connection to Figma REST API
- MCP server implementation
