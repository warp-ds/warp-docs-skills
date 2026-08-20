#!/usr/bin/env node

/**
 * Test script to verify Figma connection
 * Usage: FIGMA_ACCESS_TOKEN=xxx FIGMA_FILE_KEY=yyy node test-connection.js
 */

import { FigmaClient } from './figma-client.js';

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

async function testConnection() {
  console.log('🔍 Testing Figma connection...\n');

  // Check environment variables
  if (!FIGMA_ACCESS_TOKEN) {
    console.error('❌ FIGMA_ACCESS_TOKEN not set');
    console.log('Usage: FIGMA_ACCESS_TOKEN=xxx FIGMA_FILE_KEY=yyy node test-connection.js');
    process.exit(1);
  }

  if (!FIGMA_FILE_KEY) {
    console.error('❌ FIGMA_FILE_KEY not set');
    console.log('Usage: FIGMA_ACCESS_TOKEN=xxx FIGMA_FILE_KEY=yyy node test-connection.js');
    process.exit(1);
  }

  console.log('✓ Environment variables set\n');

  // Test Figma API connection
  const client = new FigmaClient(FIGMA_ACCESS_TOKEN);

  try {
    console.log('📡 Connecting to Figma API...');
    const file = await client.getFile(FIGMA_FILE_KEY);
    console.log('✓ Connected successfully!\n');

    console.log('📄 File Information:');
    console.log(`   Name: ${file.name}`);
    console.log(`   Last Modified: ${file.lastModified}`);
    console.log(`   Version: ${file.version}\n`);

    // Get components
    console.log('📦 Fetching components...');
    const components = await client.getComponents(FIGMA_FILE_KEY);
    console.log(`✓ Found ${components.length} components\n`);

    if (components.length > 0) {
      console.log('Sample components:');
      components.slice(0, 5).forEach(comp => {
        console.log(`   - ${comp.name} (${comp.type})`);
      });
      if (components.length > 5) {
        console.log(`   ... and ${components.length - 5} more`);
      }
      console.log('');
    }

    // Get design tokens
    console.log('🎨 Fetching design tokens...');
    const tokens = await client.getDesignTokens(FIGMA_FILE_KEY);
    console.log(`✓ Found:`);
    console.log(`   - ${tokens.colors.length} color tokens`);
    console.log(`   - ${tokens.typography.length} typography tokens`);
    console.log(`   - ${tokens.spacing.length} spacing tokens`);
    console.log(`   - ${tokens.borderRadius.length} border radius tokens\n`);

    console.log('✅ All tests passed! Your setup is working correctly.\n');
    console.log('Next steps:');
    console.log('1. Add the MCP server to your Claude Code settings');
    console.log('2. Restart Claude Code');
    console.log('3. Ask Claude about your design system!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('- Verify your access token is valid');
    console.log('- Check that the file key is correct');
    console.log('- Make sure the file is accessible with your account');
    process.exit(1);
  }
}

testConnection();
