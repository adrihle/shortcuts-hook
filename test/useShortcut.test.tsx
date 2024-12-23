import { fireEvent, render, RenderResult } from '@testing-library/react';
import { ShortcutConfig, generateShorcutMap, getEventMapKey, useShortcuts } from '../src/useShortcuts';

const SHORTCUT_CONFIG: ShortcutConfig = {
  map: [
    {
      action: jest.fn(),
      modifiers: ['shiftKey', 'ctrlKey'],
      key: 'o',
      description: 'Sample action 1',
    },
    {
      action: jest.fn(),
      modifiers: ['altKey', 'ctrlKey'],
      key: 'i',
      description: 'Sample action 2',
    },
    {
      action: jest.fn(),
      modifiers: ['shiftKey', 'ctrlKey'],
      key: 'o',
      description: 'Sample action 3',
    },
  ],
  silent: true,
};

const TEST_ID = 'test-id' as const;

const TestContainer = () => {
  useShortcuts(SHORTCUT_CONFIG);
  return <div data-testid={TEST_ID} />;
};

describe('useShortcuts', () => {
  let rendered: RenderResult;
  let container: HTMLElement;
  const [action1Spy, action2Spy, action3Spy] = SHORTCUT_CONFIG.map.map((shortcut) => jest.spyOn(shortcut, 'action'));

  beforeEach(() => {
    rendered = render(<TestContainer />);
    container = rendered.getByTestId(TEST_ID);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateShorcutMap', () => {
    let result: ReturnType<typeof generateShorcutMap>;
    const uniqueShortcuts = SHORTCUT_CONFIG.map.slice(0, -1);

    beforeEach(() => {
      result = generateShorcutMap(SHORTCUT_CONFIG.map);
    });

    it('Should contain mapped elements, excluding repeated', () => {
      expect(result).toBeDefined();
      expect(Object.keys(result).length).toBe(uniqueShortcuts.length);
    });

    it('Each indexed element should contain map config', () => {
      uniqueShortcuts.forEach((config) => {
        const { modifiers, key } = config;
        const indexKey = `${modifiers.join('-')}-${key}`;

        const shorcutMap = result[indexKey];
        expect(shorcutMap).toBeDefined();
        expect(shorcutMap).toEqual(config);
      });
    });
  });

  describe('getEventMapKey', () => {
    const EXPECTED = 'ctrlKey-shiftKey-o';

    it('Should generate index map key', () => {
      const KEYBOARD_EVENT = {
        ctrlKey: true,
        shiftKey: true,
        key: 'o',
      } as KeyboardEvent;
      const result = getEventMapKey(KEYBOARD_EVENT);
      expect(result).toBeDefined();
      expect(result).toBe(EXPECTED);
    });

    it('Should generate index map key, reverting event order', () => {
      const KEYBOARD_EVENT = {
        shiftKey: true,
        ctrlKey: true,
        key: 'o',
      } as KeyboardEvent;
      const result = getEventMapKey(KEYBOARD_EVENT);
      expect(result).toBeDefined();
      expect(result).toBe(EXPECTED);
    });
  });

  it('Should trigger action 1 when shortcut keydown, but not action 2', () => {
    fireEvent.keyDown(container, { key: 'o', ctrlKey: true, shiftKey: true });
    expect(action1Spy).toHaveBeenCalled();
    expect(action2Spy).not.toHaveBeenCalled();
  });

  it('Should trigger action 2 when shortcut keydown, but not action 1', () => {
    fireEvent.keyDown(container, { key: 'i', ctrlKey: true, altKey: true });
    expect(action2Spy).toHaveBeenCalled();
    expect(action1Spy).not.toHaveBeenCalled();
  });

  it('Should NOT trigger any action', () => {
    fireEvent.keyDown(container, { key: 'p', ctrlKey: true, altKey: true });
    expect(action2Spy).not.toHaveBeenCalled();
    expect(action1Spy).not.toHaveBeenCalled();
  });

  it('If shortcut is repeated, only trigger first one', () => {
    fireEvent.keyDown(container, { key: 'o', ctrlKey: true, shiftKey: true });
    expect(action1Spy).toHaveBeenCalled();
    expect(action3Spy).not.toHaveBeenCalled();
  });

  it('If container is unmount, should remove event listener', () => {
    rendered.unmount();
    fireEvent.keyDown(container, { key: 'o', ctrlKey: true, shiftKey: true });
    expect(action1Spy).not.toHaveBeenCalled();
    expect(action2Spy).not.toHaveBeenCalled();
  });
});
