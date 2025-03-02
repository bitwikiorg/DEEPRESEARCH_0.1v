
import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';

// Ensure environment variables are loaded
dotenv.config();

/**
 * Verifies GitHub memory configuration
 * @returns {Promise<boolean>} True if config is valid
 */
export const verifyGitHubMemoryConfig = async () => {
  try {
    const config = getGitHubMemoryConfig();
    
    if (!config.token || !config.owner || !config.repo) {
      console.log('GitHub memory configuration incomplete');
      return false;
    }
    
    const octokit = new Octokit({ auth: config.token });
    
    // Try to access the repository
    await octokit.repos.get({
      owner: config.owner,
      repo: config.repo
    });
    
    console.log(`GitHub memory configuration verified for ${config.owner}/${config.repo}`);
    return true;
  } catch (error) {
    console.error('Error verifying GitHub memory config:', error);
    return false;
  }
};

/**
 * Helper to get GitHub memory config
 * @returns {Object} GitHub config
 */
function getGitHubMemoryConfig() {
  return {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_MEMORY_OWNER || process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_MEMORY_REPO || process.env.GITHUB_REPO,
    branch: process.env.GITHUB_MEMORY_BRANCH || process.env.GITHUB_BRANCH || 'main',
    path: process.env.GITHUB_MEMORY_PATH || ''
  };
}

/**
 * List modules from the self-system on GitHub
 * @param {string} directory - Directory path within the self system
 * @returns {Promise<Object>} - List of modules or error
 */
export const listSelfModulesFromGitHub = async (directory = '') => {
  try {
    const config = getGitHubMemoryConfig();
    
    if (!config.token || !config.owner || !config.repo) {
      return { success: false, error: 'GitHub configuration incomplete' };
    }
    
    const octokit = new Octokit({ auth: config.token });
    
    // Construct path
    const fullPath = directory 
      ? `${config.path}/${directory}`.replace(/\/+/g, '/') 
      : config.path;
    
    console.log(`Listing self modules from: ${config.owner}/${config.repo}/${fullPath}`);
    
    // Get directory contents
    const response = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: fullPath,
      ref: config.branch
    });
    
    // Process results
    if (Array.isArray(response.data)) {
      const files = response.data.map(item => ({
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
        url: item.html_url
      }));
      
      return { success: true, files, directory: fullPath };
    } else {
      // Not a directory
      return { success: false, error: 'Not a directory' };
    }
  } catch (error) {
    console.error('Error listing self modules:', error);
    
    // Special handling for 404 (directory doesn't exist)
    if (error.status === 404) {
      return { success: true, files: [], directory, notFound: true };
    }
    
    return { 
      success: false, 
      error: error.message || 'Failed to list self modules'
    };
  }
};

/**
 * Fetch a self module file from GitHub
 * @param {string} path - Path to the module file
 * @returns {Promise<Object>} Module content or error
 */
export const fetchSelfModuleFromGitHub = async (path) => {
  try {
    const config = getGitHubMemoryConfig();
    
    if (!config.token || !config.owner || !config.repo) {
      return { success: false, error: 'GitHub configuration incomplete' };
    }
    
    const octokit = new Octokit({ auth: config.token });
    
    // Clean up path and add base path if needed
    const fullPath = config.path
      ? `${config.path}/${path}`.replace(/\/+/g, '/')
      : path;
    
    console.log(`Fetching self module: ${config.owner}/${config.repo}/${fullPath}`);
    
    // Get file content
    const response = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: fullPath,
      ref: config.branch
    });
    
    // File found
    if (!Array.isArray(response.data) && response.data.type === 'file') {
      // Decode content from base64
      const content = Buffer.from(response.data.content, 'base64').toString('utf8');
      
      return {
        success: true,
        content,
        path: response.data.path,
        name: response.data.name,
        url: response.data.html_url,
        sha: response.data.sha
      };
    } else {
      return { success: false, error: 'Not a file' };
    }
  } catch (error) {
    console.error('Error fetching self module:', error);
    
    // Special handling for 404 (file doesn't exist)
    if (error.status === 404) {
      return { success: false, error: 'Module not found', notFound: true };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to fetch self module'
    };
  }
};

/**
 * Save a self module to GitHub
 * @param {Object} options - Save options
 * @param {string} options.path - Path to the module
 * @param {string} options.content - Content to save
 * @param {string} options.message - Commit message
 * @returns {Promise<Object>} Result of the save operation
 */
export const saveSelfModuleToGitHub = async ({ path, content, message }) => {
  try {
    const config = getGitHubMemoryConfig();
    
    if (!config.token || !config.owner || !config.repo) {
      return { success: false, error: 'GitHub configuration incomplete' };
    }
    
    if (!path || !content) {
      return { success: false, error: 'Path and content are required' };
    }
    
    const octokit = new Octokit({ auth: config.token });
    
    // Clean up path and add base path if needed
    const fullPath = config.path
      ? `${config.path}/${path}`.replace(/\/+/g, '/')
      : path;
    
    console.log(`Saving self module: ${config.owner}/${config.repo}/${fullPath}`);
    
    // Check if file exists to get its SHA (for update)
    let sha;
    try {
      const existing = await octokit.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path: fullPath,
        ref: config.branch
      });
      
      if (!Array.isArray(existing.data) && existing.data.type === 'file') {
        sha = existing.data.sha;
      }
    } catch (checkError) {
      // File doesn't exist, that's okay for creation
      if (checkError.status !== 404) {
        console.error('Error checking for existing file:', checkError);
      }
    }
    
    // Upload/update the file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: config.owner,
      repo: config.repo,
      path: fullPath,
      message: message || `Update ${path}`,
      content: Buffer.from(content).toString('base64'),
      branch: config.branch,
      sha: sha // Include SHA if file exists, omit for new file
    });
    
    return {
      success: true,
      content: response.data.content,
      commit: response.data.commit,
      message: `Successfully saved ${path}`
    };
  } catch (error) {
    console.error('Error saving self module:', error);
    return {
      success: false,
      error: error.message || 'Failed to save self module'
    };
  }
};

/**
 * Initialize Self system on GitHub with base architecture
 * @returns {Promise<Object>} Result of initialization
 */
export const initializeSelfSystemOnGitHub = async () => {
  try {
    // Define base architecture files
    const baseFiles = [
      {
        path: 'README.md',
        content: `# Self System Architecture
        
## Overview

This repository contains the Self system architecture - a structured framework for representing core knowledge, procedures, and abilities.

## Structure

- \`execution_framework/\` - Contains procedures and action sequences for system operation
- \`knowledge_synthesis/\` - Houses synthesized information and semantic learnings
- \`memory_management/\` - Handles different types of memory storage and recall
- \`goal_alignment/\` - Maintains goal structures and preference frameworks
- \`task_management/\` - Contains task definitions, scheduling and execution logs

## License

MIT License`
      },
      {
        path: 'memory_management/README.md',
        content: `# Memory Management

This module implements different memory types:

- Short-term memory: Temporary, task-related information
- Long-term memory: Persistent knowledge store 
- Episodic memory: Records of specific events and interactions`
      },
      {
        path: 'memory_management/short_term_memory.md',
        content: `# Short-Term Memory

Active memory store for immediate task processing. Contents expire after task completion.

## Active Context

- System is in initialization state
- Last interaction: Initial setup
- Current task: None`
      },
      {
        path: 'memory_management/long_term_registry.md',
        content: `# Long-Term Memory Registry

Registry of important concepts, facts, and learnings.

## Core Concepts

1. Self-improvement requires introspection and honest evaluation
2. Knowledge should be organized in a retrievable structure
3. Learning is an iterative process of discovery, integration, and application

## Recent Learnings

1. Initial system setup completed successfully
2. Memory architecture established with multiple storage types`
      },
      {
        path: 'memory_management/episodic_memories/index.md',
        content: `# Episodic Memory Index

Chronological record of significant events and interactions.

## Recent Events

1. System initialization - [Date of initialization]
2. Memory architecture creation`
      },
      {
        path: 'knowledge_synthesis/semantic_learnings/index.md',
        content: `# Semantic Knowledge

Structured knowledge synthesized from observations and research.

## Domains

1. System Architecture
2. Memory Management
3. Knowledge Representation
4. Task Processing

## Recent Syntheses

- Memory structures require different retention strategies based on information type and importance`
      },
      {
        path: 'execution_framework/procedures/index.md',
        content: `# Procedures Index

Core procedures for system operation and task execution.

## Core Procedures

1. Memory Management
   - Short-term memory update
   - Long-term memory consolidation
   - Episodic memory recording

2. Knowledge Processing
   - Information retrieval
   - Knowledge synthesis
   - Concept mapping

3. Task Execution
   - Task parsing
   - Resource allocation
   - Execution monitoring`
      },
      {
        path: 'goal_alignment/preferences.md',
        content: `# System Preferences

Core values and preferences guiding system behavior.

## Primary Values

1. Accuracy - Information should be factual and precise
2. Usefulness - Prioritize actions with practical utility
3. Learning - Continuously improve through experience
4. Coherence - Maintain internal consistency
5. Adaptability - Adjust to changing conditions and requirements`
      },
      {
        path: 'task_management/tasks.md',
        content: `# Task Management

Active and scheduled tasks for the system.

## Current Tasks

- None pending

## Completed Tasks

- System initialization
- Base architecture setup

## Task Templates

### Research Task

\`\`\`
Title: [Research Subject]
Objective: [Clear description of the desired outcome]
Depth: [1-5, indicating depth of research]
Breadth: [1-5, indicating breadth of exploration]
Output: [Required format and key elements]
Schedule: [Timing/priority]
\`\`\`

### Learning Task

\`\`\`
Title: [Learning Objective]
Resources: [Materials or sources to consult]
Success Criteria: [How to evaluate successful learning]
Integration: [How to integrate with existing knowledge]
Schedule: [Timing/priority]
\`\`\`

### Implementation Task

\`\`\`
Title: [Implementation Name]
Description: [What to implement]  
Steps: [Sequential steps for implementation]
Validation: [How to verify successful implementation]
Schedule: [Timing/priority]
\`\`\`
`
      },
      {
        path: 'README-init.md',
        content: `# System Initialization Log

The Self system was initialized on [${new Date().toISOString()}].

## Initial Configuration

- Base architecture created
- Memory systems initialized
- Task framework established

## Next Steps

- Initialize knowledge bases
- Create first research task
- Establish learning objectives
- Initialize Self system architecture
`
      }
    ];

    const created = [];

    // Create directories (implicit through file creation)
    for (const file of baseFiles) {
      const result = await saveSelfModuleToGitHub({
        path: file.path,
        content: file.content,
        message: `Initialize Self system: Create ${file.path}`
      });

      if (result.success) {
        created.push(file.path);
      } else {
        console.error(`Failed to create ${file.path}:`, result.error);
      }
    }

    return { 
      success: true, 
      created,
      message: `Self system initialized with ${created.length} modules`
    };
  } catch (error) {
    console.error('Error initializing self system on GitHub:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to initialize Self system'
    };
  }
};

/**
 * Update Self system with research insights
 * @param {Object} research - Research data
 * @param {string} research.query - The research query
 * @param {string} research.summary - Research summary
 * @param {Array<string>} research.learnings - Key learnings
 * @param {Array<string>} research.sources - Sources
 * @returns {Promise<Object>} Result of the update
 */
export const updateSelfFromResearch = async (research) => {
  try {
    if (!research || !research.query || !research.summary || !research.learnings) {
      return { 
        success: false, 
        error: 'Invalid research data provided'
      };
    }
    
    // Create an episodic memory entry for the research
    const timestamp = new Date().toISOString();
    const episodicMemoryPath = `memory_management/episodic_memories/research_${timestamp.replace(/[:.]/g, '-')}.md`;
    
    const episodicContent = `# Research Event: ${research.query}

## Timestamp
${timestamp}

## Research Query
${research.query}

## Summary
${research.summary}

## Key Learnings
${research.learnings.map((learning, i) => `${i+1}. ${learning}`).join('\n')}

## Sources
${research.sources.map(source => `- ${source}`).join('\n')}
`;

    // Save the episodic memory
    const episodicResult = await saveSelfModuleToGitHub({
      path: episodicMemoryPath,
      content: episodicContent,
      message: `Add research episodic memory: ${research.query}`
    });
    
    // Update the long-term memory with learnings
    const longTermPath = 'memory_management/long_term_registry.md';
    const longTermModule = await fetchSelfModuleFromGitHub(longTermPath);
    
    if (longTermModule.success) {
      // Add the new learnings to the existing content
      const newContent = longTermModule.content + `\n\n## Learnings from "${research.query}"
${research.learnings.map((learning, i) => `${i+1}. ${learning}`).join('\n')}

*Added on: ${timestamp}*
`;
      
      await saveSelfModuleToGitHub({
        path: longTermPath,
        content: newContent,
        message: `Update long-term memory with learnings from: ${research.query}`
      });
    }
    
    // Update the semantic knowledge if relevant
    // This would typically involve more sophisticated categorization
    // Simplified for this implementation
    const semanticPath = 'knowledge_synthesis/semantic_learnings/research_insights.md';
    let semanticContent = '';
    
    try {
      const semanticModule = await fetchSelfModuleFromGitHub(semanticPath);
      if (semanticModule.success) {
        semanticContent = semanticModule.content + '\n\n';
      }
    } catch (error) {
      // File probably doesn't exist yet, create it
      semanticContent = `# Research Insights
A collection of insights derived from research activities.
      
`;
    }
    
    semanticContent += `## ${research.query}
${research.summary}

**Key Takeaways:**
${research.learnings.map((learning, i) => `${i+1}. ${learning}`).join('\n')}

*Research conducted: ${timestamp}*
      
`;
    
    await saveSelfModuleToGitHub({
      path: semanticPath,
      content: semanticContent,
      message: `Update semantic knowledge with insights from: ${research.query}`
    });
    
    return {
      success: true,
      updates: {
        episodic: episodicResult.success,
        longTerm: true,
        semantic: true
      },
      message: `Successfully integrated research on "${research.query}" into Self system`
    };
  } catch (error) {
    console.error('Error updating Self from research:', error);
    return {
      success: false,
      error: error.message || 'Failed to update Self system with research'
    };
  }
};

/**
 * Create a new task in the Self system
 * @param {Object} options - Task options
 * @param {string} options.task - Task description
 * @param {string} options.schedule - When to execute (optional)
 * @returns {Promise<Object>} Result of task creation
 */
export const createSelfTask = async ({ task, schedule = 'As needed' }) => {
  try {
    if (!task) {
      return { success: false, error: 'Task description is required' };
    }
    
    // Get the existing tasks file
    const tasksPath = 'task_management/tasks.md';
    let tasksContent = '';
    
    try {
      const tasksModule = await fetchSelfModuleFromGitHub(tasksPath);
      if (tasksModule.success) {
        tasksContent = tasksModule.content;
      } else {
        // Create a new tasks file if it doesn't exist
        tasksContent = `# Task Management

Active and scheduled tasks for the system.

## Current Tasks

- None pending

## Completed Tasks

- System initialization
- Base architecture setup

`;
      }
    } catch (error) {
      console.error('Error fetching tasks file:', error);
      // Create a basic template if file doesn't exist
      tasksContent = `# Task Management

Active and scheduled tasks for the system.

## Current Tasks

- None pending

## Completed Tasks

- System initialization

`;
    }
    
    // Add the new task to Current Tasks section
    const timestamp = new Date().toISOString();
    const taskEntry = `- **${task}** (Added: ${timestamp}, Schedule: ${schedule})`;
    
    // Replace "None pending" with the new task, or add to the list
    if (tasksContent.includes('- None pending')) {
      tasksContent = tasksContent.replace('- None pending', taskEntry);
    } else {
      // Find the Current Tasks section and add the task
      const currentTasksMatch = tasksContent.match(/## Current Tasks\s+([^#]*)/);
      if (currentTasksMatch) {
        const currentTasksSection = currentTasksMatch[1];
        const updatedSection = currentTasksSection + taskEntry + '\n';
        tasksContent = tasksContent.replace(currentTasksSection, updatedSection);
      } else {
        // If section not found, append a new section
        tasksContent += `\n## Current Tasks\n\n${taskEntry}\n`;
      }
    }
    
    // Save the updated tasks file
    const saveResult = await saveSelfModuleToGitHub({
      path: tasksPath,
      content: tasksContent,
      message: `Add new task: ${task}`
    });
    
    if (saveResult.success) {
      return { 
        success: true, 
        task,
        message: 'Task added successfully'
      };
    } else {
      return { success: false, error: saveResult.error };
    }
  } catch (error) {
    console.error('Error creating Self task:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create Self task'
    };
  }
};

/**
 * Log an event to the Self system
 * @param {Object} options - Event options
 * @param {string} options.event - Event description
 * @param {string} options.category - Event category
 * @returns {Promise<Object>} Result of event logging
 */
export const logSelfEvent = async ({ event, category = 'system' }) => {
  try {
    if (!event) {
      return { success: false, error: 'Event description is required' };
    }
    
    const timestamp = new Date().toISOString();
    const logPath = `logs/${category}_log.md`;
    
    // Get existing log or create new one
    let logContent = '';
    
    try {
      const logModule = await fetchSelfModuleFromGitHub(logPath);
      if (logModule.success) {
        logContent = logModule.content + '\n';
      } else {
        // Create a new log file
        logContent = `# ${category.charAt(0).toUpperCase() + category.slice(1)} Event Log

Chronological record of ${category} events.

`;
      }
    } catch (error) {
      // Create a new log file
      logContent = `# ${category.charAt(0).toUpperCase() + category.slice(1)} Event Log

Chronological record of ${category} events.

`;
    }
    
    // Add the event entry
    logContent += `## ${timestamp}
${event}

`;
    
    // Save the log
    const saveResult = await saveSelfModuleToGitHub({
      path: logPath,
      content: logContent,
      message: `Log ${category} event: ${event.substring(0, 50)}${event.length > 50 ? '...' : ''}`
    });
    
    return {
      success: saveResult.success,
      message: saveResult.success ? 'Event logged successfully' : saveResult.error
    };
  } catch (error) {
    console.error('Error logging Self event:', error);
    return {
      success: false,
      error: error.message || 'Failed to log event'
    };
  }
};

export default {
  verifyGitHubMemoryConfig,
  listSelfModulesFromGitHub,
  fetchSelfModuleFromGitHub,
  saveSelfModuleToGitHub,
  initializeSelfSystemOnGitHub,
  updateSelfFromResearch,
  createSelfTask,
  logSelfEvent
};
