---
title: "System Design Basics: Load Balancing"
date: 2025-11-28
categories:
  - system-design
header:
  # Using a placeholder
---

Load balancing is a critical component of any distributed system. It helps to spread the traffic across a cluster of servers to improve responsiveness and availability.

## What is a Load Balancer?

A load balancer sits between the client and the server farm accepting incoming network and application traffic and distributing the traffic across multiple backend servers using various algorithms.

### Algorithms

1. **Round Robin**: Requests are distributed sequentially.
2. **Least Connections**: Request is sent to the server with the fewest active connections.
3. **IP Hash**: The IP address of the client is used to determine which server receives the request.
