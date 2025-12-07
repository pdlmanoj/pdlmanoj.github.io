---
title: "Concurrency in Go: Goroutines and Channels"
date: 2025-11-25
categories:
  - go
  - backend
header:
   teaser: /images/interned-example2.png
---

Go is famous for its concurrency model. It uses **Goroutines** and **Channels** to handle concurrent tasks efficiently.

## Goroutines

A Goroutine is a lightweight thread managed by the Go runtime.

```go
package main

import (
	"fmt"
	"time"
)

func say(s string) {
	for i := 0; i < 5; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println(s)
	}
}

func main() {
	go say("world")
	say("hello")
}
```

## Channels

Channels are the pipes that connect concurrent goroutines. You can send values into channels from one goroutine and receive those values into another goroutine.
