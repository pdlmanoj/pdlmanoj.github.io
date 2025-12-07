---
title: "React Hooks Explained: useState and useEffect"
date: 2025-11-22
categories:
  - javascript
  - frontend
header:
  # No image to test placeholder
---

React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8.

## useState

`useState` is a Hook that lets you add React state to function components.

```javascript
import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## useEffect

The Effect Hook, `useEffect`, adds the ability to perform side effects from a function component. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` in React classes, but unified into a single API.
