---
title: "Cache Lines and the False Sharing Problem"
date: 2025-02-10
category: computer-architecture
description: "A persistent performance bug that shows up when you least expect it, and how to catch it."
featured: true
---

False sharing is a performance bug that looks like it should not exist. Two threads write to different memory addresses, so there is no data race. The code is correct by every conventional measure. And yet performance degrades as you add threads, sometimes dramatically.

The root cause is in the cache coherence protocol. A cache line — typically 64 bytes on modern x86 and ARM processors — is the unit of coherence. When one core writes to any byte on a cache line, it invalidates that line on every other core that holds it. So if thread A writes to variable X and thread B writes to variable Y, and X and Y happen to share a cache line, every write from either thread forces a cache miss on the other. The line bounces back and forth between L1 caches at the speed of the interconnect, which is orders of magnitude slower than a local cache hit.

Consider a struct with two counters: one incremented by thread A, one by thread B. In memory, they sit adjacent. Each thread reads the entire cache line, modifies its own counter, and writes the line back. The other thread cannot proceed until it gets the updated line from the first thread's cache. Throughput collapses.

The fix is straightforward once you identify the problem. Pad your structures so that hot variables live on separate cache lines. In C++, `alignas(64)` ensures a variable starts at a cache-line boundary. In Rust, `#[repr(align(64))]` achieves the same. The padding wastes memory, but the performance difference is often an order of magnitude on contended paths.

Identifying false sharing in a running system is harder than fixing it. The obvious symptom is that performance does not scale with core count. Profiling tools like `perf` on Linux can show elevated L1 cache miss rates and a high frequency of coherence-related events. The Linux `perf c2c` tool is specifically designed to detect cache-line contention and will attribute misses to specific cache lines. On macOS, Instruments provides similar counters through the Cache Miss and CPU Cycles profiler templates. Another reliable signal: a mutex-free data structure that runs slower on 8 threads than on 2 is almost always suffering from false sharing or a worse coherence issue.

The subtle version of this problem involves heap-allocated objects allocated sequentially by different threads. Their addresses happen to fall within the same cache line. This does not require sharing a struct. Two completely independent allocations can collide if the allocator places them adjacent. This is harder to reproduce and usually requires examining memory layout at runtime.

False sharing is one of those problems where understanding the hardware model of your system directly translates to better concurrent code. It is not an obscure concern. It shows up in production concurrent code routinely. The fix is easy. Catching it requires knowing it exists.