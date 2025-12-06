---
title: "Understanding Python String Interning"
date: 2025-11-15
categories:
  - python
  - memory
header:
  teaser: /images/interned-example1.png
classes: wide
excerpt: "Learn how Python optimizes memory usage through string interning and when it applies this optimization technique."
---

String interning is a method of storing only one copy of each distinct string value in memory. This article explores how Python implements this optimization and its performance implications.

## What is String Interning?

Python automatically interns certain strings to save memory and speed up string comparisons. When you create a string, Python checks if an identical string already exists in memory.

## When Does Python Intern Strings?

Python interns strings that:
- Look like identifiers (variable names)
- Are compile-time constants
- Contain only ASCII letters, digits, or underscores

## Performance Benefits

String interning provides two main benefits:
1. **Memory Efficiency**: Only one copy of each string is stored
2. **Faster Comparisons**: Identity checks (`is`) are faster than equality checks (`==`)

## Example Code

```python
a = "hello"
b = "hello"
print(a is b)  # True - both reference the same object
```

Understanding string interning helps you write more memory-efficient Python code!
