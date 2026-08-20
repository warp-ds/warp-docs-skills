#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FigmaClient } from './figma-client.js';

// Get configuration from environment variables
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_ACCESS_TOKEN) {
  console.error('Error: FIGMA_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

if (!FIGMA_FILE_KEY) {
  console.error('Error: FIGMA_FILE_KEY environment variable is required');
  process.exit(1);
}

// Initialize Figma client with default file key
const figmaClient = new FigmaClient(FIGMA_ACCESS_TOKEN, FIGMA_FILE_KEY);

// Create MCP server
const server = new Server(
  {
    name: 'figma-design-system-mcp',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_components',
        description: 'List all components in the Figma design system. Returns component names, types, descriptions, and properties.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'search_components',
        description: 'Search for components by name or description. Use this to find specific components like buttons, inputs, cards, etc.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (e.g., "button", "input", "card")',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_component_details',
        description: 'Get detailed information about a specific component including properties, variants, and styles.',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: {
              type: 'string',
              description: 'The name of the component to retrieve',
            },
          },
          required: ['componentName'],
        },
      },
      {
        name: 'get_design_tokens',
        description: 'Get design tokens (colors, spacing, typography, border radius) from the design system.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_styles',
        description: 'Get color styles, typography styles, and effect styles defined in the design system.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_file_info',
        description: 'Get general information about the Figma design system file.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_branches',
        description: 'List all available branches in the Figma file. Shows branch names and keys.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'switch_branch',
        description: 'Switch to a specific branch by key or name. All subsequent operations will use this branch.',
        inputSchema: {
          type: 'object',
          properties: {
            branchKey: {
              type: 'string',
              description: 'The branch file key to switch to',
            },
            branchName: {
              type: 'string',
              description: 'Optional: The branch name for reference',
            },
          },
          required: ['branchKey'],
        },
      },
      {
        name: 'switch_to_main',
        description: 'Switch back to the main file (default branch).',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_current_branch',
        description: 'Get the currently active branch information.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'export_component_image',
        description: 'Export a component or node as an image (SVG, PNG, JPG, PDF). Returns the image URL that can be downloaded.',
        inputSchema: {
          type: 'object',
          properties: {
            nodeId: {
              type: 'string',
              description: 'The node ID or component ID to export',
            },
            format: {
              type: 'string',
              description: 'Image format: svg, png, jpg, or pdf (default: svg)',
              enum: ['svg', 'png', 'jpg', 'pdf'],
            },
            scale: {
              type: 'number',
              description: 'Scale factor from 1-4 (default: 1)',
              minimum: 1,
              maximum: 4,
            },
          },
          required: ['nodeId'],
        },
      },
      {
        name: 'export_component_by_name',
        description: 'Export a component by its name as an image. Automatically finds the component and exports it.',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: {
              type: 'string',
              description: 'The name of the component to export',
            },
            format: {
              type: 'string',
              description: 'Image format: svg, png, jpg, or pdf (default: svg)',
              enum: ['svg', 'png', 'jpg', 'pdf'],
            },
            scale: {
              type: 'number',
              description: 'Scale factor from 1-4 (default: 1)',
              minimum: 1,
              maximum: 4,
            },
          },
          required: ['componentName'],
        },
      },
      {
        name: 'get_component_variants',
        description: 'Get all variants of a component set. Useful for documenting all variations of a component.',
        inputSchema: {
          type: 'object',
          properties: {
            componentSetId: {
              type: 'string',
              description: 'The component set ID',
            },
          },
          required: ['componentSetId'],
        },
      },
      {
        name: 'find_node_by_name',
        description: 'Find a node ID by its name. Useful for locating specific frames or components.',
        inputSchema: {
          type: 'object',
          properties: {
            nodeName: {
              type: 'string',
              description: 'The name of the node to find',
            },
          },
          required: ['nodeName'],
        },
      },
      {
        name: 'add_comment',
        description: 'Add a comment to the Figma file at a specific position or on a node.',
        inputSchema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'The comment message',
            },
            x: {
              type: 'number',
              description: 'X coordinate for the comment',
            },
            y: {
              type: 'number',
              description: 'Y coordinate for the comment',
            },
            nodeId: {
              type: 'string',
              description: 'Optional: Node ID to attach the comment to',
            },
          },
          required: ['message', 'x', 'y'],
        },
      },
      {
        name: 'get_comments',
        description: 'Get all comments from the Figma file.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_components': {
        const components = await figmaClient.getComponents(figmaClient.getActiveFileKey());
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(components, null, 2),
            },
          ],
        };
      }

      case 'search_components': {
        const { query } = args;
        const results = await figmaClient.searchComponents(figmaClient.getActiveFileKey(), query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'get_component_details': {
        const { componentName } = args;
        const components = await figmaClient.getComponents(figmaClient.getActiveFileKey());
        const component = components.find(c => c.name === componentName);

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: `Component "${componentName}" not found. Available components: ${components.map(c => c.name).join(', ')}`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(component, null, 2),
            },
          ],
        };
      }

      case 'get_design_tokens': {
        const tokens = await figmaClient.getDesignTokens(figmaClient.getActiveFileKey());
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tokens, null, 2),
            },
          ],
        };
      }

      case 'get_styles': {
        const styles = await figmaClient.getStyles(figmaClient.getActiveFileKey());
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(styles, null, 2),
            },
          ],
        };
      }

      case 'get_file_info': {
        const file = await figmaClient.getFile(figmaClient.getActiveFileKey());
        const currentBranch = figmaClient.getCurrentBranch();
        const info = {
          name: file.name,
          lastModified: file.lastModified,
          version: file.version,
          thumbnailUrl: file.thumbnailUrl,
          currentBranch: currentBranch.name,
        };
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(info, null, 2),
            },
          ],
        };
      }

      case 'list_branches': {
        const branches = await figmaClient.getBranches(FIGMA_FILE_KEY);
        const branchList = branches.map(branch => ({
          name: branch.name,
          key: branch.key,
          thumbnailUrl: branch.thumbnail_url,
          lastModified: branch.last_modified,
        }));

        // Add main branch
        const result = [
          { name: 'main', key: FIGMA_FILE_KEY, isMain: true },
          ...branchList,
        ];

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'switch_branch': {
        const { branchKey, branchName } = args;
        const branch = await figmaClient.switchToBranch(branchKey, branchName);
        return {
          content: [
            {
              type: 'text',
              text: `Switched to branch: ${branch.name} (${branch.key})`,
            },
          ],
        };
      }

      case 'switch_to_main': {
        const branch = await figmaClient.switchToMain();
        return {
          content: [
            {
              type: 'text',
              text: `Switched to main branch (${branch.key})`,
            },
          ],
        };
      }

      case 'get_current_branch': {
        const branch = figmaClient.getCurrentBranch();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(branch, null, 2),
            },
          ],
        };
      }

      case 'export_component_image': {
        const { nodeId, format = 'svg', scale = 1 } = args;
        const imageUrl = await figmaClient.exportImage(
          figmaClient.getActiveFileKey(),
          nodeId,
          { format, scale }
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                nodeId,
                format,
                imageUrl,
                message: 'Image exported successfully. Download from the imageUrl.',
              }, null, 2),
            },
          ],
        };
      }

      case 'export_component_by_name': {
        const { componentName, format = 'svg', scale = 1 } = args;

        // Find the component first
        const components = await figmaClient.getComponents(figmaClient.getActiveFileKey());
        const component = components.find(c => c.name === componentName);

        if (!component) {
          return {
            content: [
              {
                type: 'text',
                text: `Component "${componentName}" not found. Available components: ${components.map(c => c.name).join(', ')}`,
              },
            ],
          };
        }

        // Export the component
        const imageUrl = await figmaClient.exportImage(
          figmaClient.getActiveFileKey(),
          component.id,
          { format, scale }
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                componentName,
                componentId: component.id,
                format,
                imageUrl,
                message: 'Component exported successfully. Download from the imageUrl.',
              }, null, 2),
            },
          ],
        };
      }

      case 'get_component_variants': {
        const { componentSetId } = args;
        const variants = await figmaClient.getComponentVariants(
          figmaClient.getActiveFileKey(),
          componentSetId
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(variants, null, 2),
            },
          ],
        };
      }

      case 'find_node_by_name': {
        const { nodeName } = args;
        const nodeId = await figmaClient.findNodeIdByName(
          figmaClient.getActiveFileKey(),
          nodeName
        );

        if (!nodeId) {
          return {
            content: [
              {
                type: 'text',
                text: `Node "${nodeName}" not found in the file.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ nodeName, nodeId }, null, 2),
            },
          ],
        };
      }

      case 'add_comment': {
        const { message, x, y, nodeId } = args;
        const comment = await figmaClient.addComment(
          figmaClient.getActiveFileKey(),
          message,
          { x, y },
          nodeId
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Comment added successfully',
                comment,
              }, null, 2),
            },
          ],
        };
      }

      case 'get_comments': {
        const comments = await figmaClient.getComments(figmaClient.getActiveFileKey());
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(comments, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Figma Design System MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
