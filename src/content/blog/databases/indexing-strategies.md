---
title: "Indexing Strategies That Actually Matter"
date: 2025-01-25
category: databases
description: "A practical look at how indexes work, when they help, and how to avoid the common mistakes."
---

Most database performance problems are not about hardware. They are about missing or wrong indexes. A well-placed index can turn a 30-second sequential scan into a single-digit millisecond lookup. The difference between a good indexing strategy and a bad one is often the difference between a system that works and one that falls over under load.

B-tree indexes are the default in most relational databases for a reason. They handle both equality lookups and range queries efficiently. The tree structure keeps the search depth logarithmic in the number of entries, and the leaf nodes form a linked list that supports efficient range scans. But B-trees are not free. Every index on a table adds overhead to writes because the database must update the index on every INSERT, UPDATE, and DELETE. A table with 15 indexes will have measurably slower write throughput than one with 3. The question is whether the read performance gain justifies the write cost for your workload.

Composite indexes are where most of the practical optimization happens. The leftmost prefix rule governs how they work: an index on (country, city, zip) can serve queries filtering by country alone, or country and city together, or all three. But it cannot serve a query filtering by city alone, because city is not the leftmost column. The practical implication is that you should design composite indexes to match your query filter patterns, and you should order the columns by selectivity — most selective first — so that the index prunes the search space as early as possible.

Covering indexes are an underused technique. If the index includes all the columns needed by a query, the database can satisfy the query entirely from the index without touching the table at all. This eliminates the heap lookup that normally follows an index scan. In PostgreSQL, adding INCLUDE columns to an index lets you store extra values in the leaf nodes without affecting the tree structure, so you can cover queries without increasing the index depth.

Partial indexes are another technique that deserves more attention. If most of your queries filter on a specific subset of rows — active users, non-deleted records, or orders within the last 90 days — index only those rows. In PostgreSQL, `CREATE INDEX idx_active_users ON users (email) WHERE status = 'active'` creates an index that is a fraction of the size of the full-table index. Smaller indexes mean faster scans, less memory pressure, and cheaper maintenance.

The common mistake is indexing without understanding the query plan. Before adding an index, run EXPLAIN ANALYZE on the query. Look for sequential scans, bitmap scans, and the actual row estimates. An index that does not change the query plan is wasted writes. After adding an index, verify that the query plan changed. The number of teams that add indexes speculatively without measuring impact is larger than it should be.