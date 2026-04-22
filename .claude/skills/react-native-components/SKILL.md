---
name: react-native-components
description: >
  Trigger when creating or modifying React Native components, screens, or custom hooks
  in this project. Also trigger when the user asks about styling, theming, animations,
  form state, or how to structure a component. Covers the component/screen file layout,
  the styling-hook pattern, design tokens, the { state, actions } hook return shape,
  and Reanimated animations. Err toward triggering for any component-level work.
---

# React Native Component & Screen Patterns

See `references/component-patterns.md` for copy-paste code templates.

## Design Spec — Figma (Optional, Preferred)

Before writing any JSX, check if a Figma link is available (provided by the user, in the ticket body, or in the component description). If one exists, fetch it using the Figma MCP before coding.

```
// Extract the file key and node ID from the Figma URL:
// https://www.figma.com/file/<fileKey>/...?node-id=<nodeId>
mcp__figma__get_file_nodes  →  fileKey + nodeId
```

From the Figma response, extract and map to project tokens:

| Figma property | Project token |
|---|---|
| Fill colors | `theme.colors.*` (adaptive) or `Colors.*` (static) |
| Padding / gap | `Dimens.padding.*` — pick the closest step |
| Border radius | `Dimens.border.*` — pick the closest step |
| Font style | `typography.*` — match by size + weight |
| Icon / image size | `Dimens.image.*` — pick the closest step |

If an exact value doesn't match a token, use the closest token and note the deviation. Never hardcode raw numbers pulled from Figma.

If no Figma link is available, proceed with the existing codebase patterns and any spec provided in text.

## File Layout

**Components** — reusable UI elements:
```
app/components/MyComponent/
  index.tsx        ← component logic + JSX (named export)
  styles.ts        ← styling hook
  useMyComponent.ts  ← optional: extracted state/actions hook
```

**Screens** — page-level components:
```
app/screens/MyScreen/
  index.tsx        ← screen JSX (default export)
  styles.ts        ← styling hook
  useMyScreen.ts   ← screen logic hook (always extract)
```

## Export Convention

- **Components** → named export: `export const MyComponent = ...`
- **Screens** → default export: `export default function MyScreen() {...}`
- **Types** → named export alongside the component: `export type MyComponentProps = {...}`

## Styling Pattern

Styles are always written as a factory function that takes theme (and any dynamic parameters), then wrapped in a custom hook using `useTheme()` + `useMemo()`.

```tsx
// styles.ts
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper'; // or the project's theme hook
import { Dimens } from '@themes/dimens';
import { typography } from '@themes/typography';

const styles = (theme: ReturnType<typeof useTheme>, isDisabled?: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: Dimens.border.small,
      padding: Dimens.padding.medium,
    },
    label: {
      ...typography.bodyLarge,
      color: isDisabled ? theme.colors.onSurfaceDisabled : theme.colors.onSurface,
    },
  });

export const useMyComponentStyles = (isDisabled?: boolean) => {
  const theme = useTheme();
  return useMemo(() => styles(theme, isDisabled), [theme, isDisabled]);
};
```

```tsx
// index.tsx — consume it
const styles = useMyComponentStyles(disabled);
```

**Theme hook:** Check what the project exports before assuming the hook name. This project uses `useTheme` from `react-native-paper` and a custom `useAppTheme` from `@contexts/ThemeContext`. Use whichever is appropriate — `useAppTheme` for accessing `isDark` or custom colors, `useTheme` for Material Design 3 color tokens.

## Design Tokens — Always Use, Never Hardcode

Import from `@themes/`:

```tsx
import { Dimens } from '@themes/dimens';
import { typography } from '@themes/typography';
import { Colors } from '@themes/colors';
```

| Token | Use for |
|-------|---------|
| `Dimens.padding.xSmall / small / medium / large / xLarge` | Spacing, margins, padding |
| `Dimens.border.small / medium / large` | Border radius |
| `Dimens.image.xxSmall … xxLarge` | Icon/image sizes |
| `Dimens.shadow.*` | Shadow properties |
| `typography.bodySmall / bodyMedium / bodyLarge / titleSmall …` | Spread into text styles |
| `Colors.*` | Static colors (prefer `theme.colors.*` for adaptive colors) |

```tsx
// Correct
padding: Dimens.padding.medium,
borderRadius: Dimens.border.small,
...typography.bodyLarge,

// Wrong — never hardcode
padding: 16,
borderRadius: 8,
fontSize: 16,
```

## Custom Hook Return Shape

All hooks that manage component or screen state must return `{ state, actions }`:

```tsx
export const useMyScreen = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => { ... };
  const handleChange = (text: string) => { setValue(text); };

  return {
    state: { value, loading },
    actions: { handleSubmit, handleChange },
  };
};
```

Consume in the component:
```tsx
const { state, actions } = useMyScreen();
```

## Form State

No form libraries (react-hook-form, Formik). Use manual `useState` with the `Input<T>` wrapper type:

```tsx
// From @objectTypes/components/input.type
type Input<T> = { value: T; error?: string };

const [email, setEmail] = useState<Input<string>>({ value: '' });

const changeEmail = (newValue: string) => {
  setEmail({
    value: newValue,
    error: isValidEmail(newValue) ? undefined : t('error.invalid_regex_email'),
  });
};
```

Validation utilities in `@utils/inputUtils`:
- `hasError(input)` — true if `input.error !== undefined`
- `hasErrorOrValueUndefined(input)` — true if error or empty

Enable a submit button:
```tsx
useEffect(() => {
  setIsBtnEnabled(
    !hasErrorOrValueUndefined(email) && !hasErrorOrValueUndefined(password),
  );
}, [email, password]);
```

## Animations — Reanimated

Always use `react-native-reanimated`. Pattern: `useSharedValue` + `withTiming` + `useAnimatedStyle`.

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const opacity = useSharedValue(0);
const height = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  height: height.value,
  overflow: 'hidden',
}));

// Trigger animation
opacity.value = withTiming(1, { duration: 300 });
height.value = withTiming(targetHeight, { duration: 300 });

return <Animated.View style={animatedStyle}>{children}</Animated.View>;
```

For cross-thread callbacks (e.g. calling `setState` from an animation callback), use `runOnJS`:
```tsx
height.value = withTiming(0, { duration: 300 }, (finished) => {
  if (finished) runOnJS(setVisible)(false);
});
```

## i18n

All user-visible strings go through `useTranslation()`:
```tsx
const { t } = useTranslation();
<Text>{t('login.title')}</Text>
```

Never hardcode English strings in JSX.
