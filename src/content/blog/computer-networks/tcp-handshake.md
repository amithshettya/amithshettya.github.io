---
title: "How the TCP Handshake Actually Works"
date: 2025-02-01
category: computer-networks
description: "A practical walkthrough of TCP's three-way handshake and what happens under the hood."
---

Every web request starts with a TCP three-way handshake. SYN, SYN-ACK, ACK. But there's more happening than most people realize.

When your client sends a SYN, it includes options like MSS (maximum segment size), window scale, and SACK permissions. The server's SYN-ACK responds with its own options. This negotiation determines how the connection will behave for its entire lifetime.

The initial sequence numbers aren't random — modern systems use algorithms like TCP Fast Open to reduce latency. On repeat connections, the client can send data in the SYN packet itself, saving one full round trip.

For DDoS protection, SYN floods exploit this handshake by sending millions of SYN packets without completing the connection. SYN cookies solve this by encoding connection state in the sequence number itself, eliminating the need to store half-open connections in memory.
