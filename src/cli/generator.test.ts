import { describe, it, expect, afterEach } from 'vitest';
import { generateComponent } from './generator';
import { rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const testStoriesDir = join(process.cwd(), 'src', 'stories');

describe('Component Generator', () => {
  afterEach(() => {
    // Cleanup test components
    const testComponents = [
      'TestComponent',
      'MyButton',
      'InputField',
      'CardComponent',
      'MyTestComponent',
      'TestUnderscoreComponent'
    ];
    testComponents.forEach(name => {
      const componentPath = join(testStoriesDir, `${name}.tsx`);
      const storyPath = join(testStoriesDir, `${name}.stories.ts`);
      const stylePath = join(testStoriesDir, `${name}.css`);

      [componentPath, storyPath, stylePath].forEach(path => {
        if (existsSync(path)) {
          rmSync(path);
        }
      });
    });
  });

  describe('generateComponent', () => {
    it('should create component, story, and style files', async () => {
      await generateComponent('TestComponent');

      const componentPath = join(testStoriesDir, 'TestComponent.tsx');
      const storyPath = join(testStoriesDir, 'TestComponent.stories.ts');
      const stylePath = join(testStoriesDir, 'TestComponent.css');

      expect(existsSync(componentPath)).toBe(true);
      expect(existsSync(storyPath)).toBe(true);
      expect(existsSync(stylePath)).toBe(true);
    });

    it('should generate correct component file content', async () => {
      await generateComponent('MyButton');

      const componentPath = join(testStoriesDir, 'MyButton.tsx');
      const content = readFileSync(componentPath, 'utf-8');

      expect(content).toContain("import './MyButton.css'");
      expect(content).toContain('export interface MyButtonProps');
      expect(content).toContain('export const MyButton: React.FC<MyButtonProps>');
      expect(content).toContain('className="MyButton"');
    });

    it('should generate correct story file content', async () => {
      await generateComponent('MyButton');

      const storyPath = join(testStoriesDir, 'MyButton.stories.ts');
      const content = readFileSync(storyPath, 'utf-8');

      expect(content).toContain("import { MyButton } from './MyButton'");
      expect(content).toContain("title: 'Components/MyButton'");
      expect(content).toContain('component: MyButton');
      expect(content).toContain('export const Default: Story');
    });

    it('should generate correct style file content', async () => {
      await generateComponent('MyButton');

      const stylePath = join(testStoriesDir, 'MyButton.css');
      const content = readFileSync(stylePath, 'utf-8');

      expect(content).toContain('.MyButton {');
      expect(content).toContain('padding: 16px');
      expect(content).toContain('border: 1px solid #ddd');
    });

    it('should convert kebab-case to PascalCase', async () => {
      await generateComponent('input-field');

      const componentPath = join(testStoriesDir, 'InputField.tsx');
      expect(existsSync(componentPath)).toBe(true);

      const content = readFileSync(componentPath, 'utf-8');
      expect(content).toContain('export const InputField: React.FC<InputFieldProps>');
    });

    it('should convert snake_case to PascalCase', async () => {
      await generateComponent('card_component');

      const componentPath = join(testStoriesDir, 'CardComponent.tsx');
      expect(existsSync(componentPath)).toBe(true);
    });

    it('should throw error when component already exists', async () => {
      await generateComponent('TestComponent');

      await expect(generateComponent('TestComponent')).rejects.toThrow(
        'Component "TestComponent" already exists. Use --force to overwrite.'
      );
    });

    it('should overwrite existing component with force flag', async () => {
      await generateComponent('TestComponent');
      const firstWrite = readFileSync(
        join(testStoriesDir, 'TestComponent.tsx'),
        'utf-8'
      );

      await generateComponent('TestComponent', true);
      const secondWrite = readFileSync(
        join(testStoriesDir, 'TestComponent.tsx'),
        'utf-8'
      );

      expect(firstWrite).toEqual(secondWrite);
    });

    it('should throw error for empty component name', async () => {
      await expect(generateComponent('')).rejects.toThrow('Component name cannot be empty');
    });

    it('should throw error for whitespace-only component name', async () => {
      await expect(generateComponent('   ')).rejects.toThrow('Component name cannot be empty');
    });

    it('should throw error for name starting with number', async () => {
      await expect(generateComponent('123Component')).rejects.toThrow(
        'Component name must start with a letter'
      );
    });

    it('should throw error for name with invalid characters', async () => {
      await expect(generateComponent('Component@Name')).rejects.toThrow(
        'Component name must start with a letter'
      );
    });

    it('should accept valid names with hyphens', async () => {
      await generateComponent('my-test-component');
      const componentPath = join(testStoriesDir, 'MyTestComponent.tsx');
      expect(existsSync(componentPath)).toBe(true);
    });

    it('should accept valid names with underscores', async () => {
      await generateComponent('test_underscore_component');
      const componentPath = join(testStoriesDir, 'TestUnderscoreComponent.tsx');
      expect(existsSync(componentPath)).toBe(true);
    });
  });
});
