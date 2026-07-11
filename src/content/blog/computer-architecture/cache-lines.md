---
title: "Cache Lines and the False Sharing Problem"
date: 2025-02-10
category: computer-architecture
description: "Why your multi-threaded code might be slower than you think."
featured: true
---

When two threads write to different variables on the same cache line, performance tanks. This is false sharing — the CPU doesn't know you're using separate variables, so it bounces the cache line between cores.

A cache line is typically 64 bytes. Two `int64_t` variables sitting next to each other in a struct share a line. Thread 1 writing to variable A invalidates the cache line for Thread 2 writing to variable B, even though they're logically independent.

The fix: pad your structures to ensure hot variables live on separate cache lines. In C++, `alignas(64)` works. In Rust, `#[repr(align(64))]` does the same.

You can verify with perf tools — high L1 cache invalidation rates are a telltale sign. Profile before optimizing, but when you see mysterious slowdowns in concurrent code, false sharing is often the culprit.
