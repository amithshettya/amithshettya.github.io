---
title: "Designing a URL Shortener at Scale"
date: 2025-01-15
category: scalable-system-design
description: "The problems that emerge when a seemingly simple service needs to handle millions of requests per second."
---

A URL shortener sounds like a trivial service. Map a long URL to a short key, redirect when someone visits the short URL, store the mapping. The core data model is a single table with two columns. In practice, scaling this to millions of requests per second surfaces interesting distributed systems problems.

The first challenge is key generation. You need unique short keys that are short enough to be practical and generated fast enough to handle the write throughput. A single auto-increment counter in a database creates a bottleneck and a single point of failure. A common approach is base62 encoding of a distributed ID. Snowflake-style ID generation gives you unique, time-ordered 64-bit IDs that can be generated without coordination: assign a worker ID to each generation node, use a timestamp for ordering, and include a sequence number for collisions within the same millisecond. The base62 encoding of a 64-bit integer yields keys up to 11 characters, which is comparable to what commercial shorteners use. Another approach is to pre-compute batches of keys in each database node and assign ranges, which avoids the coordination overhead of real-time ID generation.

Storage is the easy part. A key-value store is the natural fit for this workload. DynamoDB, Cassandra, or a well-tuned Redis cluster all work. The access pattern is simple: look up a key, get a URL, issue a 302 redirect. No joins, no transactions for reads. The main consideration is read latency and availability, which favors replication across regions. You want the redirect to be fast regardless of where the request originates.

The hard problem is analytics. Every redirect is a write — you want to record the request timestamp, referrer, user agent, and geographic information for each click. If you do this synchronously on the redirect path, you add latency to every request and risk falling over under write load. The standard approach is to decouple analytics from the read path. The redirect handler publishes the event to a stream — Kafka, Kinesis, or a comparable queue — and a separate consumer processes the events, aggregates them, and writes to an analytics store. This means the redirect handler only does a lookup and a lightweight publish. The analytics pipeline can fall behind during spikes without affecting the redirect service.

The key insight is that the bottleneck in a URL shortener is not the lookups, which are trivially fast in a key-value store. The bottleneck is the write path — both key generation and click tracking. Optimize reads aggressively, batch writes, and push analytics onto an async path. The architecture ends up looking less like a simple database and more like a stream processing pipeline with a fast cache in front.