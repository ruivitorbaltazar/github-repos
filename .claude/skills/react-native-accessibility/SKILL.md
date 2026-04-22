---
name: react-native-accessibility
description: Provides React Native accessibility (a11y) patterns for screen readers, touch targets, roles, and dynamic announcements. Use when building UI components, creating screens, or when the user mentions accessibility, a11y, VoiceOver, TalkBack, or screen reader support.
---

# React Native Accessibility

## Core Rules

1. Every interactive element gets an `accessibilityLabel`
2. Every interactive element gets an `accessibilityRole`
3. Touch targets are at least 44x44 points
4. Color is never the sole indicator of meaning
5. Screen reader flow follows visual reading order

## Labels and Roles

```typescript
// Button
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Add item to cart"
  onPress={handleAddToCart}
>
  <PlusIcon />
</Pressable>

// Link
<Pressable
  accessibilityRole="link"
  accessibilityLabel="View privacy policy"
  onPress={() => router.push('/privacy')}
>
  <Text>Privacy Policy</Text>
</Pressable>

// Image
<Image
  source={avatarSource}
  accessibilityRole="image"
  accessibilityLabel={`Profile photo of ${user.name}`}
/>

// Decorative image (skip by screen reader)
<Image
  source={decorativePattern}
  accessibilityElementsHidden
  importantForAccessibility="no-hide-descendants"
/>
```

## Common Roles

| Role | When to use |
|---|---|
| `button` | Tappable actions |
| `link` | Navigation to another screen/URL |
| `header` | Section headings |
| `image` | Meaningful images |
| `text` | Standalone informational text |
| `search` | Search input fields |
| `switch` | Toggle switches |
| `checkbox` | Checkboxes |
| `tab` | Tab bar items |
| `adjustable` | Sliders and steppers |

## State

```typescript
// Toggle
<Pressable
  accessibilityRole="switch"
  accessibilityLabel="Dark mode"
  accessibilityState={{ checked: isDarkMode }}
  onPress={toggleDarkMode}
/>

// Disabled button
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Submit order"
  accessibilityState={{ disabled: !isValid }}
  disabled={!isValid}
  onPress={handleSubmit}
/>

// Selected tab
<Pressable
  accessibilityRole="tab"
  accessibilityLabel="Home"
  accessibilityState={{ selected: activeTab === 'home' }}
  onPress={() => setActiveTab('home')}
/>

// Expandable section
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Order details"
  accessibilityState={{ expanded: isExpanded }}
  onPress={toggleExpanded}
/>
```

## Grouping

Group related elements so the screen reader reads them as one unit:

```typescript
// Correct -- read as "John Doe, Software Engineer"
<View accessible accessibilityLabel={`${name}, ${title}`}>
  <Text>{name}</Text>
  <Text>{title}</Text>
</View>

// Incorrect -- read as two separate elements
<View>
  <Text>{name}</Text>
  <Text>{title}</Text>
</View>
```

## Hints

Use `accessibilityHint` sparingly -- only when the action isn't obvious from the label:

```typescript
// Helpful hint (action is ambiguous from label alone)
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Profile photo"
  accessibilityHint="Double tap to change your profile photo"
  onPress={openPhotoPicker}
/>

// Unnecessary hint (label already implies the action)
// Don't do this:
<Pressable
  accessibilityLabel="Delete item"
  accessibilityHint="Deletes the item"  // redundant
/>
```

## Dynamic Announcements

```typescript
import { AccessibilityInfo } from 'react-native';

// Announce async results
async function handleSave(): Promise<void> {
  await saveData();
  AccessibilityInfo.announceForAccessibility('Changes saved successfully');
}

// Announce list updates
function handleAddItem(item: Item): void {
  addItem(item);
  AccessibilityInfo.announceForAccessibility(`${item.name} added to cart`);
}
```

## Touch Targets

```typescript
// Ensure minimum 44x44 hit area even for small icons
<Pressable
  onPress={handleClose}
  accessibilityRole="button"
  accessibilityLabel="Close"
  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
  style={{ padding: 8 }}
>
  <CloseIcon size={20} />
</Pressable>
```

## Testing Accessibility

### Manual testing checklist

- [ ] Enable VoiceOver (iOS) or TalkBack (Android) and navigate every screen
- [ ] Verify focus order follows visual layout
- [ ] Confirm all actions are reachable without gestures beyond swipe/tap
- [ ] Test with Dynamic Type / font scaling enabled
- [ ] Verify color contrast ratios (4.5:1 for normal text, 3:1 for large text)

### Automated testing

```typescript
import { render, screen } from '@testing-library/react-native';

it('should have accessible submit button', () => {
  render(<CheckoutForm />);

  const button = screen.getByRole('button', { name: 'Place order' });
  expect(button).toBeTruthy();
});

it('should mark disabled state on button', () => {
  render(<CheckoutForm isValid={false} />);

  const button = screen.getByRole('button', { name: 'Place order' });
  expect(button.props.accessibilityState).toEqual(
    expect.objectContaining({ disabled: true })
  );
});
```

## Quick Reference

| Element | Required a11y props |
|---|---|
| Button / Pressable | `accessibilityRole="button"`, `accessibilityLabel` |
| Link | `accessibilityRole="link"`, `accessibilityLabel` |
| Image (meaningful) | `accessibilityRole="image"`, `accessibilityLabel` |
| Image (decorative) | `accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"` |
| Text input | `accessibilityLabel` (or visible label) |
| Toggle | `accessibilityRole="switch"`, `accessibilityState={{ checked }}` |
| Header | `accessibilityRole="header"` |
| Tab | `accessibilityRole="tab"`, `accessibilityState={{ selected }}` |
