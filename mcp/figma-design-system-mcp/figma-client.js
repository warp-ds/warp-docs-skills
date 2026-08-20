import fetch from 'node-fetch';

export class FigmaClient {
  constructor(accessToken, defaultFileKey = null) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://api.figma.com/v1';
    this.defaultFileKey = defaultFileKey;
    this.currentFileKey = defaultFileKey; // Can be main file or branch file key
    this.currentBranch = null; // Track current branch info
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'X-Figma-Token': this.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Figma API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async getFile(fileKey) {
    return this.request(`/files/${fileKey}`);
  }

  async getFileNodes(fileKey, nodeIds) {
    const ids = nodeIds.join(',');
    return this.request(`/files/${fileKey}/nodes?ids=${ids}`);
  }

  async getComponents(fileKey) {
    const file = await this.getFile(fileKey);
    const components = [];

    const traverse = (node, parentPath = []) => {
      const currentPath = [...parentPath, node.name];

      if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
        components.push({
          id: node.id,
          name: node.name,
          type: node.type,
          path: currentPath.join(' / '),
          description: node.description || '',
          properties: this.extractComponentProperties(node),
          styles: this.extractStyles(node),
        });
      }

      if (node.children) {
        node.children.forEach(child => traverse(child, currentPath));
      }
    };

    traverse(file.document);
    return components;
  }

  extractComponentProperties(node) {
    const properties = {};

    if (node.componentPropertyDefinitions) {
      Object.entries(node.componentPropertyDefinitions).forEach(([key, prop]) => {
        properties[key] = {
          type: prop.type,
          defaultValue: prop.defaultValue,
          variantOptions: prop.variantOptions || null,
        };
      });
    }

    return properties;
  }

  extractStyles(node) {
    const styles = {};

    if (node.fills && node.fills.length > 0) {
      styles.fills = node.fills.map(fill => ({
        type: fill.type,
        color: fill.color,
        opacity: fill.opacity,
      }));
    }

    if (node.strokes && node.strokes.length > 0) {
      styles.strokes = node.strokes;
    }

    if (node.effects && node.effects.length > 0) {
      styles.effects = node.effects;
    }

    if (node.cornerRadius !== undefined) {
      styles.cornerRadius = node.cornerRadius;
    }

    if (node.padding) {
      styles.padding = node.padding;
    }

    return styles;
  }

  async getStyles(fileKey) {
    const file = await this.getFile(fileKey);
    const styles = {
      colors: {},
      typography: {},
      effects: {},
    };

    // Extract color styles
    if (file.styles) {
      Object.entries(file.styles).forEach(([styleId, style]) => {
        if (style.styleType === 'FILL') {
          styles.colors[style.name] = {
            id: styleId,
            description: style.description || '',
          };
        } else if (style.styleType === 'TEXT') {
          styles.typography[style.name] = {
            id: styleId,
            description: style.description || '',
          };
        } else if (style.styleType === 'EFFECT') {
          styles.effects[style.name] = {
            id: styleId,
            description: style.description || '',
          };
        }
      });
    }

    return styles;
  }

  async getDesignTokens(fileKey) {
    const file = await this.getFile(fileKey);
    const tokens = {
      colors: [],
      spacing: [],
      typography: [],
      borderRadius: [],
    };

    const traverse = (node) => {
      // Extract color tokens
      if (node.fills && Array.isArray(node.fills)) {
        node.fills.forEach(fill => {
          if (fill.type === 'SOLID' && fill.color) {
            const color = fill.color;
            tokens.colors.push({
              name: node.name,
              value: `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a || 1})`,
              hex: this.rgbaToHex(color),
            });
          }
        });
      }

      // Extract spacing tokens (from padding/gap if available)
      if (node.paddingLeft !== undefined) {
        tokens.spacing.push({
          name: `${node.name}-padding`,
          value: node.paddingLeft,
        });
      }

      // Extract typography tokens
      if (node.style && node.type === 'TEXT') {
        tokens.typography.push({
          name: node.name,
          fontSize: node.style.fontSize,
          fontFamily: node.style.fontFamily,
          fontWeight: node.style.fontWeight,
          lineHeight: node.style.lineHeightPx,
          letterSpacing: node.style.letterSpacing,
        });
      }

      // Extract border radius tokens
      if (node.cornerRadius !== undefined) {
        tokens.borderRadius.push({
          name: node.name,
          value: node.cornerRadius,
        });
      }

      if (node.children) {
        node.children.forEach(child => traverse(child));
      }
    };

    traverse(file.document);
    return tokens;
  }

  rgbaToHex(color) {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  async searchComponents(fileKey, query) {
    const components = await this.getComponents(fileKey);
    const lowerQuery = query.toLowerCase();

    return components.filter(component =>
      component.name.toLowerCase().includes(lowerQuery) ||
      component.description.toLowerCase().includes(lowerQuery) ||
      component.path.toLowerCase().includes(lowerQuery)
    );
  }

  // Branch operations
  async getBranches(fileKey) {
    const data = await this.request(`/files/${fileKey}/branches`);
    return data.branches || [];
  }

  async switchToBranch(branchKey, branchName = null) {
    this.currentFileKey = branchKey;
    this.currentBranch = {
      key: branchKey,
      name: branchName || 'Unknown',
    };
    return this.currentBranch;
  }

  async switchToMain() {
    this.currentFileKey = this.defaultFileKey;
    this.currentBranch = null;
    return { key: this.defaultFileKey, name: 'main' };
  }

  getCurrentBranch() {
    if (this.currentBranch) {
      return this.currentBranch;
    }
    return { key: this.defaultFileKey, name: 'main' };
  }

  getActiveFileKey() {
    return this.currentFileKey || this.defaultFileKey;
  }

  // ===== EXPORT CAPABILITIES =====

  /**
   * Export component or node as image (SVG, PNG, JPG, PDF)
   * @param {string} fileKey - Figma file key
   * @param {string} nodeId - Node ID to export
   * @param {Object} options - Export options
   * @param {string} options.format - Image format: 'svg', 'png', 'jpg', 'pdf' (default: 'svg')
   * @param {number} options.scale - Scale factor (1-4, default: 1)
   * @param {boolean} options.svgIncludeId - Include id attributes in SVG (default: false)
   * @param {boolean} options.svgSimplifyStroke - Simplify strokes in SVG (default: true)
   * @returns {Promise<string>} - Image URL
   */
  async exportImage(fileKey, nodeId, options = {}) {
    const format = options.format || 'svg';
    const scale = options.scale || 1;

    const params = new URLSearchParams({
      ids: nodeId,
      format: format,
      scale: scale.toString(),
    });

    // SVG-specific options
    if (format === 'svg') {
      if (options.svgIncludeId !== undefined) {
        params.append('svg_include_id', options.svgIncludeId.toString());
      }
      if (options.svgSimplifyStroke !== undefined) {
        params.append('svg_simplify_stroke', options.svgSimplifyStroke.toString());
      }
    }

    const data = await this.request(`/images/${fileKey}?${params.toString()}`);

    if (!data.images || !data.images[nodeId]) {
      throw new Error(`Failed to export image for node ${nodeId}`);
    }

    return data.images[nodeId];
  }

  /**
   * Export multiple nodes as images
   * @param {string} fileKey - Figma file key
   * @param {string[]} nodeIds - Array of node IDs to export
   * @param {Object} options - Export options (same as exportImage)
   * @returns {Promise<Object>} - Map of nodeId to image URL
   */
  async exportImages(fileKey, nodeIds, options = {}) {
    const format = options.format || 'svg';
    const scale = options.scale || 1;

    const params = new URLSearchParams({
      ids: nodeIds.join(','),
      format: format,
      scale: scale.toString(),
    });

    if (format === 'svg') {
      if (options.svgIncludeId !== undefined) {
        params.append('svg_include_id', options.svgIncludeId.toString());
      }
      if (options.svgSimplifyStroke !== undefined) {
        params.append('svg_simplify_stroke', options.svgSimplifyStroke.toString());
      }
    }

    const data = await this.request(`/images/${fileKey}?${params.toString()}`);

    if (!data.images) {
      throw new Error('Failed to export images');
    }

    return data.images;
  }

  /**
   * Download image content from URL
   * @param {string} imageUrl - Image URL from Figma
   * @returns {Promise<Buffer>} - Image content as buffer
   */
  async downloadImage(imageUrl) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    return response.buffer();
  }

  // ===== WRITE CAPABILITIES =====

  /**
   * Create a new frame in the Figma file
   * @param {string} fileKey - Figma file key
   * @param {Object} frameData - Frame properties
   * @param {string} frameData.name - Frame name
   * @param {number} frameData.x - X position (default: 0)
   * @param {number} frameData.y - Y position (default: 0)
   * @param {number} frameData.width - Frame width (default: 1920)
   * @param {number} frameData.height - Frame height (default: 1080)
   * @param {string} frameData.backgroundColor - Background color in hex (default: '#FFFFFF')
   * @returns {Promise<Object>} - Created frame data
   */
  async createFrame(fileKey, frameData) {
    const {
      name = 'New Frame',
      x = 0,
      y = 0,
      width = 1920,
      height = 1080,
      backgroundColor = '#FFFFFF',
    } = frameData;

    // Note: Figma's REST API doesn't support direct node creation yet
    // This is a placeholder for when the feature becomes available
    // For now, we'll document what the API call would look like
    throw new Error('Direct frame creation via REST API is not yet supported by Figma. Use Figma Plugins API or manually create frames.');
  }

  /**
   * Update node properties
   * @param {string} fileKey - Figma file key
   * @param {string} nodeId - Node ID to update
   * @param {Object} properties - Properties to update
   * @returns {Promise<Object>} - Updated node data
   */
  async updateNode(fileKey, nodeId, properties) {
    // Note: Figma's REST API doesn't support direct node updates yet
    // This is a placeholder for when the feature becomes available
    throw new Error('Direct node updates via REST API are not yet supported by Figma. Use Figma Plugins API or manually edit nodes.');
  }

  /**
   * Add a comment to a node
   * @param {string} fileKey - Figma file key
   * @param {string} message - Comment message
   * @param {Object} position - Comment position
   * @param {number} position.x - X coordinate
   * @param {number} position.y - Y coordinate
   * @param {string} nodeId - Optional node ID to attach comment to
   * @returns {Promise<Object>} - Created comment data
   */
  async addComment(fileKey, message, position, nodeId = null) {
    const body = {
      message,
      client_meta: {
        x: position.x,
        y: position.y,
        node_id: nodeId,
      },
    };

    return this.request(`/files/${fileKey}/comments`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Get comments from a file
   * @param {string} fileKey - Figma file key
   * @returns {Promise<Array>} - Array of comments
   */
  async getComments(fileKey) {
    const data = await this.request(`/files/${fileKey}/comments`);
    return data.comments || [];
  }

  /**
   * Delete a comment
   * @param {string} fileKey - Figma file key
   * @param {string} commentId - Comment ID to delete
   * @returns {Promise<void>}
   */
  async deleteComment(fileKey, commentId) {
    await this.request(`/files/${fileKey}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // ===== UTILITY METHODS =====

  /**
   * Find node ID by name
   * @param {string} fileKey - Figma file key
   * @param {string} nodeName - Node name to search for
   * @returns {Promise<string|null>} - Node ID or null if not found
   */
  async findNodeIdByName(fileKey, nodeName) {
    const file = await this.getFile(fileKey);

    const traverse = (node) => {
      if (node.name === nodeName) {
        return node.id;
      }
      if (node.children) {
        for (const child of node.children) {
          const found = traverse(child);
          if (found) return found;
        }
      }
      return null;
    };

    return traverse(file.document);
  }

  /**
   * Get component variants
   * @param {string} fileKey - Figma file key
   * @param {string} componentSetId - Component set ID
   * @returns {Promise<Array>} - Array of variant components
   */
  async getComponentVariants(fileKey, componentSetId) {
    const data = await this.getFileNodes(fileKey, [componentSetId]);
    const componentSet = data.nodes[componentSetId];

    if (!componentSet || !componentSet.document) {
      throw new Error(`Component set ${componentSetId} not found`);
    }

    const variants = [];
    const node = componentSet.document;

    if (node.children) {
      node.children.forEach(child => {
        if (child.type === 'COMPONENT') {
          variants.push({
            id: child.id,
            name: child.name,
            description: child.description || '',
            properties: this.extractComponentProperties(child),
          });
        }
      });
    }

    return variants;
  }
}
