# useShortcuts - React Hook for Keyboard Shortcuts

`useShortcuts` is a simple React hook that allows you to map keyboard shortcuts to specific actions. It enables your application to respond to user key presses with configurable actions, making it easier to handle keyboard shortcuts across your components.

## Installation

To install the package, run:

```bash
npm install @your-package-name
```

Or if you are using yarn:

```bash
yarn add @your-package-name
```

## Usage

You can use the useShortcuts hook to register a list of keyboard shortcuts and map them to specific actions in your components.

```tsx
import { useShortcuts, ShortcutConfig } from '@your-package-name';

const SHORTCUT_CONFIG: ShortcutConfig = {
  map: [
    {
      action: () => console.log('Action 1 triggered!'),
      modifiers: ['shiftKey', 'ctrlKey'],
      key: 'o',
      description: 'Sample action 1',
    },
    {
      action: () => console.log('Action 2 triggered!'),
      modifiers: ['altKey', 'ctrlKey'],
      key: 'i',
      description: 'Sample action 2',
    },
  ],
};

const MyComponent = () => {
  useShortcuts(SHORTCUT_CONFIG);

  return <div>Press keys to trigger actions</div>;
};
```

## API

#### useShortcuts(config: ShortcutConfig)

This hook takes a ShortcutConfig object that defines a list of keyboard shortcuts and their associated actions.

#### Parameters

	•   config (object): The configuration for the keyboard shortcuts.
	•	map (array of objects): An array of shortcut definitions. Each shortcut object can contain:
	•	action (function): The action to be executed when the shortcut is triggered.
	•	modifiers (array of strings): The modifier keys (e.g., ctrlKey, shiftKey) that need to be pressed.
	•	key (string): The key that should be pressed along with the modifiers.
	•	description (string): A description of the shortcut (optional).
	•	silent (boolean, optional): If set to true, the hook will not log any warnings to the console when a shortcut is not found. Default is false.

#### Example

```jsx
interface ShortcutConfig {
  map: {
    action: () => void;
    modifiers: string[];
    key: string;
    description: string;
  }[];
  silent?: boolean;
}
```

## Contributions

Feel free to fork the repository, open issues, or submit pull requests.

## License

Distributed under the MIT License. See LICENSE for more information.

## Features included in the README:

- **Installation**: How to install the package using npm or yarn.
- **Usage**: A simple example of how to use the `useShortcuts` hook in a React component.
- **API**: Explanation of the configuration structure for the `useShortcuts` hook.
- **License**: Information about contributing and licensing.
