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
