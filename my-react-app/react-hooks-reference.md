# React Hooks — Complete Reference

## State Hooks

### `useState`
Adds a piece of local state to a component. Returns a value and a setter.

```jsx
const [count, setCount] = useState(0);

setCount(count + 1);
setCount(prev => prev + 1); // functional update, safe with stale closures
```
Use when: a component needs to remember a simple value across renders (form input, toggle, counter).

### `useReducer`
An alternative to `useState` for more complex state logic — dispatches actions to a reducer function, similar to Redux.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });
```
Use when: state transitions are complex, involve multiple sub-values, or the next state depends heavily on the previous one.

---

## Context Hook

### `useContext`
Reads a value from a React Context, without needing to wrap children in a `<Context.Consumer>`.

```jsx
const ThemeContext = createContext('light');

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```
Use when: passing data through many layers of props ("prop drilling") — theme, auth user, locale, etc.

---

## Effect Hooks

### `useEffect`
Runs side effects after render (data fetching, subscriptions, manually changing the DOM, timers). Runs after the browser paints.

```jsx
useEffect(() => {
  const id = setInterval(() => setTick(t => t + 1), 1000);
  return () => clearInterval(id); // cleanup
}, []); // dependency array — [] = run once on mount
```
Rules:
- No dependency array → runs after every render.
- `[]` → runs once, after initial mount.
- `[dep1, dep2]` → runs when any listed dependency changes.
- The returned function is cleanup, run before the next effect execution and on unmount.

### `useLayoutEffect`
Same signature as `useEffect`, but fires **synchronously** after DOM mutations and **before** the browser paints.

```jsx
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height);
}, []);
```
Use when: you need to measure or mutate the DOM before the user sees a flicker (e.g., tooltip positioning).

### `useInsertionEffect`
Fires before any DOM mutations, even before `useLayoutEffect`. Designed specifically for CSS-in-JS libraries to inject styles before layout reads happen. Rarely used directly in app code.

---

## Ref Hooks

### `useRef`
Creates a mutable object (`{ current: value }`) that persists across renders **without** causing re-renders when changed.

```jsx
const inputRef = useRef(null);

function focusInput() {
  inputRef.current.focus();
}

<input ref={inputRef} />
```
Use when: accessing DOM nodes directly, or storing a mutable value (like a timer ID or previous value) that shouldn't trigger a re-render.

### `useImperativeHandle`
Customizes the instance value exposed to parent components when using `ref` on a child (used with `forwardRef`).

```jsx
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
  }));
  return <input ref={inputRef} />;
});
```
Use when: you want a parent to call specific imperative methods on a child, without exposing the whole DOM node.

---

## Performance Hooks

### `useMemo`
Memoizes a **computed value** so it's only recalculated when its dependencies change.

```jsx
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.value - b.value);
}, [items]);
```
Use when: an expensive calculation would otherwise re-run on every render.

### `useCallback`
Memoizes a **function reference** so it doesn't get recreated on every render — useful for avoiding unnecessary re-renders of child components that rely on referential equality (e.g., wrapped in `React.memo`).

```jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### `useTransition`
Marks state updates as non-urgent ("transitions"), letting React keep the UI responsive by interrupting the transition if something more urgent comes in.

```jsx
const [isPending, startTransition] = useTransition();

function handleChange(value) {
  startTransition(() => {
    setSearchQuery(value); // low priority update
  });
}
```
Use when: a state update might cause a slow re-render (filtering a large list) and you don't want it to block typing/clicks.

### `useDeferredValue`
Returns a deferred version of a value that "lags behind" during urgent updates, similar in spirit to `useTransition` but for values passed in rather than state you control.

```jsx
const deferredQuery = useDeferredValue(query);
// pass deferredQuery to an expensive child component
```

---

## Other Built-in Hooks

### `useId`
Generates a unique, stable ID string — useful for linking form labels/inputs, safe with server-side rendering (avoids hydration mismatches).

```jsx
const id = useId();
<label htmlFor={id}>Name</label>
<input id={id} />
```

### `useSyncExternalStore`
Subscribes to an external data source (outside React) in a way that's safe for concurrent rendering — the recommended way to build custom hooks for external stores (browser APIs, third-party state libraries).

```jsx
const value = useSyncExternalStore(store.subscribe, store.getSnapshot);
```

### `useDebugValue`
Displays a label for custom hooks in React DevTools. Only useful inside your own custom hooks, not regular components.

```jsx
function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}
```

---

## React 19+ Hooks

### `useActionState`
Manages state that updates based on the result of a form action (works with `<form action={...}>`).

```jsx
const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
  const result = await submitForm(formData);
  return result;
}, initialState);

<form action={formAction}>...</form>
```

### `useFormStatus`
Reads the status of the parent `<form>`'s pending submission — used inside a child component of the form (no need to pass props down).

```jsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}
```

### `useOptimistic`
Shows an optimistic state while an async action is underway, then reconciles with the real result.

```jsx
const [optimisticLikes, addOptimisticLike] = useOptimistic(likes, (state, newLike) => state + newLike);

async function like() {
  addOptimisticLike(1);
  await sendLike();
}
```

### `use`
Reads the value of a resource like a Promise or Context — unlike other hooks, it can be called conditionally or in loops. Used with Suspense for data fetching.

```jsx
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise); // suspends until resolved
  return comments.map(c => <p key={c.id}>{c.text}</p>);
}
```

---

## Rules of Hooks

1. **Only call hooks at the top level.** Never inside loops, conditions, or nested functions (breaks the order React relies on to match hook calls between renders). Exception: `use` is exempt from this rule.
2. **Only call hooks from React functions.** Function components or custom hooks — not regular JS functions.
3. **Custom hooks start with `use`.** This naming convention lets React's linter and DevTools recognize them and enforce the rules above.

---

## Quick Reference Table

| Hook | Category | Purpose |
|---|---|---|
| `useState` | State | Local component state |
| `useReducer` | State | Complex state logic via reducer |
| `useContext` | Context | Read context value |
| `useEffect` | Effect | Side effects after paint |
| `useLayoutEffect` | Effect | Side effects before paint |
| `useInsertionEffect` | Effect | CSS-in-JS style injection |
| `useRef` | Ref | Mutable value / DOM reference |
| `useImperativeHandle` | Ref | Customize exposed ref instance |
| `useMemo` | Performance | Memoize computed value |
| `useCallback` | Performance | Memoize function reference |
| `useTransition` | Performance | Mark update as low-priority |
| `useDeferredValue` | Performance | Defer a value during urgent updates |
| `useId` | Utility | Stable unique ID |
| `useSyncExternalStore` | Utility | Subscribe to external store |
| `useDebugValue` | Utility | Label custom hooks in DevTools |
| `useActionState` | Forms (19+) | State from a form action |
| `useFormStatus` | Forms (19+) | Read parent form's pending status |
| `useOptimistic` | Forms (19+) | Optimistic UI updates |
| `use` | Data (19+) | Read a Promise or Context, conditionally |
