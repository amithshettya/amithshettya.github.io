---
title: "Microservices vs Monoliths: It's Not What You Think"
date: 2025-02-05
category: software-architecture
description: "Architecture debates miss the real variable: coupling, not deployment topology."
---

The debate between monoliths and microservices is almost always framed as a binary choice. You pick one architectural style and commit to it. In practice, this framing misses the variable that actually determines maintainability: coupling, not deployment topology.

A well-structured monolith with clear module boundaries is easier to maintain than a microservices architecture where services share databases, have tangled dependencies, or require coordinated deployments. The deployment model does not determine coupling. The boundaries you enforce between components determine coupling. And you can enforce boundaries just as well within a monolith as you can across network services.

Microservices add significant operational complexity. Service discovery, distributed tracing, network partitions, eventual consistency, retries with backoff, circuit breakers — these are not optional infrastructure to adopt when convenient. They are requirements for a functioning system. Each one has a learning curve and a failure mode. Organizations that adopt microservices without the operational maturity to manage these concerns end up with a distributed monolith: multiple services that must be deployed together, share data stores, and fail in unpredictable ways because the network introduces failure modes that do not exist in-process.

The conditions that justify microservices are specific. You need independent scaling requirements — different services that need different amounts of compute. You need independent deployment cadences — teams that ship on different schedules without blocking each other. You need team boundaries — organizations large enough that coordinating changes across a single codebase becomes a bottleneck. If none of these conditions apply, you are paying the complexity tax without collecting the benefit.

The practical path is the modular monolith. Start with a single deployable unit that has well-defined internal modules. Use in-process interfaces that model clear boundaries. If you later need to extract a service, it should be a mechanical exercise of replacing an in-process call with an RPC call, because the interface boundary already exists. The strangler fig pattern lets you extract services incrementally without a risky big-bang migration.

The best architecture is the one your team can operate reliably. For most teams at most organizations, that is a well-structured monolith. Microservices are a tool, not a goal.