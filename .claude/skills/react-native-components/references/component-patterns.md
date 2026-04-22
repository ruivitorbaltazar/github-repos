# Component & Screen Code Templates

## Component Template

```tsx
// app/components/MyComponent/index.tsx
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useMyComponentStyles } from './styles';

export type MyComponentProps = {
  label: string;
  disabled?: boolean;
};

export const MyComponent = ({ label, disabled }: MyComponentProps) => {
  const styles = useMyComponentStyles(disabled);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};
```

```tsx
// app/components/MyComponent/styles.ts
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Dimens } from '@themes/dimens';
import { typography } from '@themes/typography';

const styles = (theme: ReturnType<typeof useTheme>, disabled?: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: disabled ? theme.colors.surfaceDisabled : theme.colors.surface,
      borderRadius: Dimens.border.small,
      padding: Dimens.padding.medium,
    },
    label: {
      ...typography.bodyLarge,
      color: disabled ? theme.colors.onSurfaceDisabled : theme.colors.onSurface,
    },
  });

export const useMyComponentStyles = (disabled?: boolean) => {
  const theme = useTheme();
  return useMemo(() => styles(theme, disabled), [theme, disabled]);
};
```

---

## Screen Template

```tsx
// app/screens/MyScreen/index.tsx
import { View } from 'react-native';
import { useMyScreen } from './useMyScreen';
import { useMyScreenStyles } from './styles';

export default function MyScreen() {
  const { state, actions } = useMyScreen();
  const styles = useMyScreenStyles();

  return (
    <View style={styles.container}>
      {/* screen content */}
    </View>
  );
}
```

```tsx
// app/screens/MyScreen/useMyScreen.ts
import { useState } from 'react';
import { Input } from '@objectTypes/components/input.type';
import { hasErrorOrValueUndefined } from '@utils/inputUtils';

export const useMyScreen = () => {
  const [field, setField] = useState<Input<string>>({ value: '' });
  const [loading, setLoading] = useState(false);

  const changeField = (newValue: string) => {
    setField({ value: newValue, error: undefined });
  };

  const handleSubmit = async () => {
    setLoading(true);
    // ... async work
    setLoading(false);
  };

  return {
    state: { field, loading },
    actions: { changeField, handleSubmit },
  };
};
```

---

## Reanimated Collapse/Expand

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const DURATION = 250;

export const CollapsibleSection = ({ isExpanded, children }) => {
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (measuredHeight > 0) {
      progress.value = withTiming(isExpanded ? 1 : 0, { duration: DURATION });
    }
  }, [isExpanded, measuredHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: measuredHeight === 0 ? undefined : progress.value * measuredHeight,
    opacity: progress.value,
    overflow: 'hidden',
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View onLayout={(e) => setMeasuredHeight(e.nativeEvent.layout.height)}>
        {children}
      </View>
    </Animated.View>
  );
};
```

---

## Form Field with Validation

```tsx
import { useState, useEffect } from 'react';
import { Input } from '@objectTypes/components/input.type';
import { hasErrorOrValueUndefined } from '@utils/inputUtils';
import { isValidEmail } from '@utils/validationUtils';

const [email, setEmail] = useState<Input<string>>({ value: '' });
const [password, setPassword] = useState<Input<string>>({ value: '' });
const [canSubmit, setCanSubmit] = useState(false);

const changeEmail = (text: string) => {
  setEmail({
    value: text,
    error: text && !isValidEmail(text) ? t('error.invalid_regex_email') : undefined,
  });
};

const changePassword = (text: string) => {
  setPassword({ value: text, error: undefined });
};

useEffect(() => {
  setCanSubmit(
    !hasErrorOrValueUndefined(email) && !hasErrorOrValueUndefined(password),
  );
}, [email, password]);
```

---

## Available Dimens Values

```ts
Dimens.padding.xSmall    // 4
Dimens.padding.small     // 13
Dimens.padding.medium    // 16
Dimens.padding.mediumLarge // 18
Dimens.padding.large     // 24
Dimens.padding.xLarge    // 32
Dimens.padding.xxLarge   // 48

Dimens.border.small      // 8
Dimens.border.medium     // 16
Dimens.border.large      // 28

Dimens.image.xxSmall     // 14
Dimens.image.xSmall      // 24
Dimens.image.small       // 32
Dimens.image.medium      // 52
Dimens.image.large       // 76
Dimens.image.xLarge      // 100

Dimens.shadow.elevation          // 6
Dimens.shadow.shadowOffsetWidth  // 0
Dimens.shadow.shadowOffsetHeight // 2
Dimens.shadow.shadowOpacity      // 0.5
Dimens.shadow.shadowRadius       // 2.84
```
