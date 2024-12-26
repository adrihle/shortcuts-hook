import { useCallback, useEffect, useMemo } from 'react';

const LOG_TAG = '#hooks #useShortcuts' as const;

type ModifierKey = keyof Pick<KeyboardEvent, 'ctrlKey' | 'shiftKey' | 'metaKey' | 'altKey'>;

const MODIFIERS_KEYS: ModifierKey[] = ['ctrlKey', 'shiftKey', 'metaKey', 'altKey'];

type Shortcut = {
  action: (() => void) | (() => Promise<void>);
  modifiers: Array<ModifierKey>;
  key: string;
  description: string;
};

type ShortcutConfig = {
  silent?: boolean;
  map: Shortcut[];
};

type ShortcutMap = Record<string, Shortcut>;

type GetShortcutParams = {
  event: KeyboardEvent;
  shortcutMap: ShortcutMap;
};

const getEventMapKey = (event: KeyboardEvent) => {
  const modifiersPressed = MODIFIERS_KEYS.filter((m) => event[m]).sort();
  return `${modifiersPressed.join('-')}-${event.key.toLowerCase()}`;
};

const getShortcut = ({ shortcutMap = {}, event }: GetShortcutParams) => {
  const indexMapKey = getEventMapKey(event);
  return shortcutMap[indexMapKey];
};

const generateShorcutMap = (map: ShortcutConfig['map']): ShortcutMap => {
  return map.reduceRight((acc, config) => {
    const { modifiers, key } = config;
    const indexKey = `${modifiers.sort().join('-')}-${key}`;

    return { ...acc, [indexKey]: config };
  }, {} as ShortcutMap);
};

/**
 * `useShortcuts` is a custom React hook that listens for specific keyboard shortcuts and triggers 
 * corresponding actions when those shortcuts are detected. The hook helps in handling keyboard 
 * interactions within a component for a better user experience.
 *
 * @param {Object} config - The configuration object for keyboard shortcuts.
 * @param {Array} config.map - An array of objects that define the keyboard shortcuts and their actions.
 * @param {string} config.map[].key - The key for the shortcut (e.g., 'o', 'i', etc.).
 * @param {Array<string>} config.map[].modifiers - A list of modifier keys that must be pressed for the shortcut to trigger (e.g., 'ctrlKey', 'shiftKey').
 * @param {Function} config.map[].action - The function to be executed when the shortcut is triggered.
 * @param {boolean} [config.silent=false] - If true, disables logging actions in the console (default is false).
 * 
 * @returns {void} This hook does not return a value.
 * 
 * @example config
 *     map: [
 *       {
 *         key: 'o',
 *         modifiers: ['ctrlKey', 'shiftKey'],
 *         action: () => console.log('Ctrl + Shift + O pressed')
 *       },
 *       {
 *         key: 'i',
 *         modifiers: ['altKey', 'ctrlKey'],
 *         action: () => console.log('Ctrl + Alt + I pressed')
 *       }
 *     ],
 *     silent: false
 * 
 * @throws {Error} If the hook is used outside of a functional component.
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent} for more on KeyboardEvent.
 */
const useShortcuts = ({ map, silent }: ShortcutConfig) => {
  const shortcutMap = useMemo(() => generateShorcutMap(map), [map]);

  const handleKeyPress = useCallback(
    async (event: KeyboardEvent) => {
      const shortcut = getShortcut({ event, shortcutMap });
      if (!shortcut) return;

      const { key, description, modifiers, action } = shortcut;
      await action();

      if (silent) return;
      console.info(`${LOG_TAG} with ${modifiers} executed for key "${key}": ${description}`);
    },
    [shortcutMap, silent],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};

export { generateShorcutMap, getEventMapKey, useShortcuts };
export type { ShortcutConfig };
