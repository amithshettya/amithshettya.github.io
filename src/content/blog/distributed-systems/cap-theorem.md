---
title: "The CAP Theorem: Why You Can't Have It All"
date: 2025-01-20
category: distributed-systems
description: "Understanding the fundamental trade-offs in distributed system design."
---

The CAP theorem states that a distributed system can only guarantee two of three properties: Consistency, Availability, and Partition tolerance. Since network partitions are inevitable, you're really choosing between consistency and availability.

CP systems like ZooKeeper sacrifice availability during partitions — they'd rather return an error than stale data. AP systems like Cassandra keep serving requests but may return outdated writes.

In practice, most systems offer tunable consistency. Cassandra lets you set consistency levels per query. CockroachDB uses Raft consensus for strong consistency but allows stale reads with follower reads.

The real takeaway isn't the theorem itself — it's that every distributed system makes trade-offs. Understanding those trade-offs lets you pick the right tool for your workload instead of chasing an impossible guarantee.
