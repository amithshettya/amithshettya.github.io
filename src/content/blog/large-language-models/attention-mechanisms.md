---
title: "How Attention Mechanisms Power Modern LLMs"
date: 2025-02-20
category: large-language-models
description: "A practical explanation of the transformer architecture's key innovation."
---

Attention is how transformers decide which words matter for predicting the next one. In "The cat sat on the mat," when processing "sat," attention might weight "cat" heavily because it tells you what's sitting.

Self-attention computes three vectors for each token: query, key, and value. The dot product of query and key vectors determines how much attention one token pays to another. The softmax over these scores creates a weighted sum of value vectors.

Multi-head attention runs this process in parallel with different learned projections. One head might capture syntactic relationships, another semantic ones. This parallelism is what makes transformers so powerful.

The computational bottleneck is the O(n²) attention matrix for long sequences. FlashAttention and sparse attention patterns address this by recomputing or skipping attention blocks, enabling context windows of 100k+ tokens.
