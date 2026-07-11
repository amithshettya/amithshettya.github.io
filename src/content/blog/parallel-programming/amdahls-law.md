---
title: "Amdahl's Law and Why Parallel Speedup Isn't Linear"
date: 2025-02-15
category: parallel-programming
description: "What the classic law of parallel computation actually teaches you about where to spend optimization effort."
---

Amdahl's Law is usually stated as a discouraging formula: the speedup you get from parallelizing a program is bounded by the portion that must run sequentially. If 10% of your workload is inherently serial, your maximum speedup is 10x, no matter how many cores you add.

The formula itself is simple. Speedup = 1 / (s + p/N), where s is the serial fraction, p is the parallel fraction, and N is the number of processors. With s = 0.1 and N = 64, you get about 7.5x speedup, not 64x. The curve asymptotes quickly, and beyond a certain point, adding more cores barely moves the needle.

Most presentations stop there, treating it as a theoretical upper bound to note and move past. But the real value of Amdahl's Law is not the ceiling it reveals. It is the prioritization it forces. The law tells you exactly where to spend your optimization effort: on the serial bottleneck first. Optimizing the parallel portion of your code is subject to diminishing returns. Halving the serial fraction from 10% to 5% doubles your maximum possible speedup. Doubling the parallel portion does almost nothing once you are past a modest core count.

This sounds like it applies only to HPC or scientific computing contexts where you are running simulations across thousands of cores. In practice, it shows up everywhere. Every time you have a pipeline that mixes sequential and parallel stages, Amdahl's Law governs the throughput. A MapReduce job with a serial reduce phase that takes 1% of the runtime still caps your scaling. A web request handler that spends 5ms in a shared cache lookup and 95ms computing responses in parallel is still bounded by that 5ms serial dependency.

Gustafson's Law is often presented as the optimistic counterpoint: as you add processors, you tend to solve larger problems rather than solve the same problem faster. This is true, and it is not contradictory. Gustafson describes scaling the workload to match the hardware. Amdahl describes the ceiling on a fixed workload. Both are correct, and the one that matters depends entirely on what you are optimizing for.

The practical takeaway is to profile the serial fraction of your hot paths before investing in parallelism. If 90% of your code is already parallel and you are getting 2x speedup on 16 cores, the bottleneck is not the parallelism strategy. It is the 10% you have not looked at. Optimize that first, then parallelize.