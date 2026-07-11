---
title: "How the TCP Handshake Actually Works"
date: 2025-02-01
category: computer-networks
description: "The three-way handshake is just the beginning. The interesting part is what happens in those packets."
featured: true
---

Every web request begins with a TCP three-way handshake. SYN, SYN-ACK, ACK. Most developers know this. Fewer know what is inside those packets, and that is where the practical detail lives.

When a client sends a SYN, it negotiates the connection parameters it wants to use. The MSS option tells the peer the largest segment size the client can receive, usually derived from the MTU of the local interface. The window scale option shifts the 16-bit window field to allow windows larger than 64KB, which is critical for high-latency paths. The SACK-permitted option signals that the client supports selective acknowledgments, allowing the receiver to tell the sender exactly which segments were lost rather than relying on the cumulative ACK mechanism that retransmits everything after a gap. These options are not boilerplate. They determine the efficiency of the connection for its entire lifetime.

The initial sequence numbers are not random in the cryptographic sense. They follow algorithms designed to prevent sequence number guessing and to detect stale segments from previous connections. Modern Linux kernels generate ISNs using a hash-based function tied to a secret key and the connection's local and remote addresses and ports. This prevents off-path attackers from injecting spoofed segments without knowing the ISN, which was a practical attack on earlier implementations that used simple counter-based ISNs.

TCP Fast Open is worth understanding because it is a concrete optimization that reduces latency on repeat connections. With TFO, the client sends data in the SYN packet itself, eliminating one full round trip before the application payload starts flowing. The server caches a cookie during an initial handshake, which the client includes in subsequent SYNs to prove it has completed a previous handshake. On a service that handles many repeat connections from the same clients, this cuts the connection setup overhead in half.

SYN floods exploit the handshake design by sending a high volume of SYN packets without completing the handshake. The naive server allocates memory for each half-open connection, and enough of these exhaust available resources. SYN cookies solve this by encoding the connection state into the sequence number of the SYN-ACK. When the ACK comes back, the server reconstructs the connection state from the acknowledgment number without ever storing anything for the half-open connection. The tradeoff is that SYN cookies disable certain TCP options like SACK and window scaling because there is no space to negotiate them in the cookie. This means connections established during a SYN flood may operate at reduced efficiency, but they complete at all, which is the priority.

The handshake is simple in abstraction and involved in implementation. The options, ISN generation, and tail loss behavior all affect real-world connection performance. Understanding them turns debugging connection issues from trial and error into diagnosis.