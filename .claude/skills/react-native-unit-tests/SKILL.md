---
name: react-native-unit-tests
description: Guides unit and component testing in React Native using Jest and React Testing Library. Use when writing tests, creating test files, or when the user mentions testing, Jest, RNTL, React Testing Library, test coverage, or mocking native modules.
---

# Unit Tests for React Native

## File Structure

Co-locate tests with source files:

```
src/
  features/
    auth/
      SignInScreen.tsx
      useAuth.ts
      __tests__/
        SignInScreen.test.tsx
        useAuth.test.ts
```

## Test Naming

```typescript
describe('SignInScreen', () => {
  it('should display email and password fields on mount', () => { /* ... */ });
  it('should show validation error when email is empty', () => { /* ... */ });
  it('should call signIn with credentials when form is submitted', () => { /* ... */ });
  it('should disable submit button while loading', () => { /* ... */ });
});
```

Pattern: `it('should [expected behavior] when [condition]')`

## Query Priority

Prefer queries that reflect how users interact with the app:

1. `getByRole` -- semantic role (button, heading, text)
2. `getByLabelText` -- accessibility label
3. `getByText` -- visible text content
4. `getByPlaceholderText` -- input placeholder
5. `getByTestId` -- last resort

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';

it('should navigate to sign up when link is pressed', () => {
  render(<SignInScreen />);

  const link = screen.getByRole('link', { name: 'Create an account' });
  fireEvent.press(link);

  expect(mockNavigate).toHaveBeenCalledWith('SignUp');
});
```

## Arrange-Act-Assert

```typescript
it('should show error message when sign-in fails', async () => {
  // Arrange
  mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'));
  render(<SignInScreen />);

  // Act
  fireEvent.changeText(screen.getByLabelText('Email'), 'user@test.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'wrong');
  fireEvent.press(screen.getByRole('button', { name: 'Sign In' }));

  // Assert
  expect(await screen.findByText('Invalid credentials')).toBeTruthy();
});
```

## Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react-native';

it('should increment counter', () => {
  const { result } = renderHook(() => useCounter(0));

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

Wrap hooks that need providers:

```typescript
function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    );
  };
}

const { result } = renderHook(() => useUser('123'), { wrapper: createWrapper() });
```

## Mocking Native Modules

In `jest.setup.ts`:

```typescript
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));
```

## Mocking Navigation

```typescript
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  useRoute: () => ({ params: { id: '123' } }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});
```

## Async and Timers

```typescript
// Async: use findBy queries (they wait automatically)
const errorMessage = await screen.findByText('Something went wrong');

// Timers: use fake timers for animations and debounced inputs
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

it('should debounce search input', () => {
  render(<SearchBar />);
  fireEvent.changeText(screen.getByLabelText('Search'), 'react');

  jest.advanceTimersByTime(300);

  expect(mockSearch).toHaveBeenCalledWith('react');
});
```

## Snapshot Tests

Use sparingly -- only for stable, presentational components:

```typescript
it('should match snapshot', () => {
  const tree = render(<Badge label="New" variant="success" />);
  expect(tree.toJSON()).toMatchSnapshot();
});
```

Update snapshots deliberately: `jest --updateSnapshot`

## Anti-Patterns

| Don't | Do Instead |
|---|---|
| Test implementation details (state, hooks internals) | Test behavior (what the user sees/does) |
| Use `getByTestId` as first choice | Use semantic queries (`getByRole`, `getByText`) |
| Mock everything | Mock only boundaries (API, navigation, native modules) |
| Write one giant test | Split into focused tests per behavior |
| Copy-paste setup into every test | Extract into `beforeEach` or helper functions |
| Rely on snapshot tests alone | Write explicit assertions for critical behavior |
