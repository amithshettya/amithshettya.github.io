---
title: "The CAP Theorem: Why You Can't Have It All"
date: 2025-01-20
category: distributed-systems
description: "What the CAP theorem actually says, what it doesn't, and how to use it without overapplying it."
---

The CAP theorem states that a distributed data system can guarantee at most two of three properties: Consistency, Availability, and Partition tolerance. Since network partitions are inevitable in distributed systems, you are really choosing between consistency and availability when a partition occurs.

This is the most cited and most misunderstood result in distributed systems. The common reading is that you pick two and forfeit the third. That is not right. The theorem only applies during a partition. When the network is healthy, there is no tradeoff — you can have both consistency and availability. The decision only matters when the network has failed, which in production is exactly when you need to know what your system will do.

CP systems like ZooKeeper or etcd choose consistency. When a partition occurs, they stop accepting writes from the minority side to prevent divergent data. The minority side returns errors until the partition heals and the minority nodes can catch up. This is the right choice for leader election, configuration management, and any system where a stale read would be worse than a failed request. If the metadata in your service registry is wrong, the consequences cascade.

AP systems like Cassandra or DynamoDB choose availability. They accept writes on both sides of a partition, and they rely on conflict resolution mechanisms — last-writer-wins, CRDTs, or application-level merge — to reconcile the divergent data when the partition heals. This is the right choice for systems where availability is the primary requirement and temporary inconsistency is acceptable. If your shopping cart goes down, you lose a sale. If it shows a stale item count for a few seconds, nobody notices.

The practical reality is that most production systems offer tunable consistency rather than a hard binary. Cassandra lets you set the consistency level per query. QUORUM for the reads that must be accurate, ONE for the reads where a slightly stale value is acceptable. CockroachDB uses Raft consensus for strong consistency by default but supports follower reads that may return slightly stale data at lower latency. These systems acknowledge the CAP tradeoff and expose it as a knob rather than a fixed architectural choice.

The insight that matters more than the theorem itself is that the tradeoff is not unique to databases. Any distributed system that maintains state across nodes must decide what happens when communication fails. Cache invalidation, DNS propagation, CDN updates — all face the same fundamental constraint. The data arrives at a different time or not at all, and you must decide whether to serve stale data or return an error.

The theorem tells you that you must choose. It does not tell you which choice is right. That depends on your workload, your failure modes, and what your users expect.