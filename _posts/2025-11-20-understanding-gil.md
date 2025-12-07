---
title: "Understanding the Global Interpreter Lock (GIL) in Python"
date: 2025-11-20
categories:
  - python
header:
  teaser: /images/interned-example1.png
---

The Python Global Interpreter Lock or **GIL**, in simple words, is a mutex (or a lock) that allows only one thread to hold the control of the Python interpreter.

This means that only one thread can be in a state of execution at any point in time. The impact of the GIL isn't visible to developers who execute single-threaded programs, but it can be a performance bottleneck in CPU-bound and multi-threaded code.

## Why does Python have a GIL?

Python uses reference counting for memory management. It means that objects created in Python have a reference count variable that keeps track of the number of references that point to the object. When this count reaches zero, the memory allocated to the object is released.

The problem was that this reference count variable needed protection from race conditions where two threads increase or decrease its value simultaneously. If this happens, it can cause either leaked memory that is never released or, incorrectly releasing the memory while a reference to that object still exists.
