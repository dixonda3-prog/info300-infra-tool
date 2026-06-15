INFO 300 - Infrastructure Decision Tool
Darron Dixon | dixonda3 | VCU
================================================================================

HOW TO RUN:
  node index.js

INSTALL DEPENDENCIES FIRST:
  npm install


================================================================================
SUBNET HOST CHECKER - EXAMPLES
================================================================================

EXAMPLE 1 - Subnet IS sufficient:

  Input:
    VPC CIDR:     /16
    Subnet CIDR:  /24
    Devices:      50

  Output:
    Subnet Check: PASS - /24 is consistent with a /16 VPC.
    Usable hosts in /24: 254
    Capacity Check: SUFFICIENT - 204 unused IP address(es) remaining.

---

EXAMPLE 2 - Subnet is NOT sufficient:

  Input:
    VPC CIDR:     /16
    Subnet CIDR:  /28
    Devices:      30

  Output:
    Subnet Check: PASS - /28 is consistent with a /16 VPC.
    Usable hosts in /28: 14
    Capacity Check: INSUFFICIENT - You need 16 more IP address(es).

================================================================================
HOW THE PROGRAM DETERMINES THE RESULT
================================================================================

For the subnet check, the program verifies that the subnet prefix is larger than
the VPC prefix. A higher number means a smaller more specific network which is
what you want for a subnet inside a VPC. For example /24 is valid inside /16
because 24 > 16 but /16 inside /24 makes no sense.

For available hosts it uses the formula 2^(32 - prefix) - 2. The minus 2
accounts for the network address and the broadcast address which cannot be
assigned to devices. So a /24 gives you 2^8 - 2 = 254 usable host addresses.

The program compares those usable hosts to the number of devices entered. If
usable hosts are greater than or equal to devices the subnet is sufficient and
it shows the leftover IPs. If not it shows exactly how many more IPs are needed.

================================================================================
