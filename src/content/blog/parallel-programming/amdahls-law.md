---
title: "Amdahl's Law and Why Parallel Speedup Isn't Linear"
date: 2025-02-15
category: parallel-programming
description: "Understanding the theoretical limits of parallel computation."
---

Amdahl's Law says your speedup from parallelization is limited by the serial portion of your program. If 10% of your code must run sequentially, the maximum speedup is 10x — no matter how many cores you throw at it.

This sounds discouraging, but it's practical. It tells you where to focus: optimize the serial bottleneck first. Adding more threads to the already-parallel part yields diminishing returns.

The formula is simple: Speedup = 1 / (s + p/N), where s is the serial fraction, p is the parallel fraction, and N is the number of processors. With s=0.1 and 64 cores, you get about 7.5x speedup, not 64x.

Gustafson's Law offers the other perspective: as you add processors, you tend to solve larger problems rather than solve the same problem faster. Both laws are true — they just answer different questions.
