#!/usr/bin/env node

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
x2 - Component Library CLI

Usage:
  x2 <command> [options]

Commands:
  generate <name>     Generate a new component
  --help, -h         Show this help message
  --version, -v      Show version

Options:
  --force            Overwrite existing files

Examples:
  x2 generate Button
  x2 generate my-component
  x2 generate Card --force
    `);
    process.exit(0);
  }

  if (args[0] === '--version' || args[0] === '-v') {
    console.log(`x2 version ${packageJson.version}`);
    process.exit(0);
  }

  if (args[0] === 'generate') {
    if (args.length < 2) {
      console.error('Error: Component name required');
      console.error('Usage: x2 generate <name> [--force]');
      process.exit(1);
    }

    try {
      const { generateComponent } = await import('../src/cli/generator.ts');
      const componentName = args[1];
      const force = args.includes('--force');
      await generateComponent(componentName, force);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  } else {
    console.error(`Error: Unknown command "${args[0]}"`);
    console.error('Run "x2 --help" for usage information');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
