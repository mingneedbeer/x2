import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

function toPascalCase(str: string): string {
  const hasSeparators = /[-_\s]/.test(str);
  if (!hasSeparators) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function validateComponentName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new Error('Component name cannot be empty');
  }
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    throw new Error('Component name must start with a letter and contain only alphanumeric characters, hyphens, or underscores');
  }
}

export async function generateComponent(name: string, force: boolean = false): Promise<void> {
  validateComponentName(name);

  const componentName = toPascalCase(name);
  const storiesDir = join(process.cwd(), 'src', 'stories');

  if (!existsSync(storiesDir)) {
    mkdirSync(storiesDir, { recursive: true });
  }

  const componentPath = join(storiesDir, `${componentName}.tsx`);
  const storyPath = join(storiesDir, `${componentName}.stories.ts`);
  const stylePath = join(storiesDir, `${componentName}.css`);

  const existingFiles = [componentPath, storyPath, stylePath].filter(existsSync);
  if (existingFiles.length > 0 && !force) {
    throw new Error(`Component "${componentName}" already exists. Use --force to overwrite.`);
  }

  const componentTemplate = `import './${componentName}.css';

export interface ${componentName}Props {
  children?: React.ReactNode;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ children }) => {
  return (
    <div className="${componentName}">
      {children}
    </div>
  );
};
`;

  const storyTemplate = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '${componentName} Component',
  },
};
`;

  const styleTemplate = `.${componentName} {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}
`;

  writeFileSync(componentPath, componentTemplate);
  writeFileSync(storyPath, storyTemplate);
  writeFileSync(stylePath, styleTemplate);

  console.log(`✓ Component "${componentName}" created successfully!`);
  console.log(`  - ${componentPath}`);
  console.log(`  - ${storyPath}`);
  console.log(`  - ${stylePath}`);
}
