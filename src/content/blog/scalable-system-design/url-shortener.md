---
title: "Designing a URL Shortener at Scale"
date: 2025-01-15
category: scalable-system-design
description: "A deep dive into designing a URL shortener that handles millions of requests per second."
---

A URL shortener seems simple: map a long URL to a short one. But at scale, it becomes a fascinating distributed systems problem.

The core challenge is generating unique short keys without a bottleneck. A centralized counter won't cut it when you need millions of keys per second. Instead, use a base62 encoding of a distributed ID generator like Snowflake, or pre-compute batches of keys from multiple database nodes.

For storage, a key-value store like DynamoDB or Cassandra works well — you're doing simple lookups, not joins. Replicate across regions for low latency reads.

The trickier part is analytics. Every redirect is a write. Fan out click events to a stream processing pipeline for real-time dashboards without slowing down the read path. The key insight: optimize reads aggressively, batch writes, and let analytics happen asynchronously.
