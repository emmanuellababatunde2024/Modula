# Modula

A decentralized middleware protocol that powers transparent, composable access to public infrastructure and social services — enabling institutions, communities, and citizens to interact trustlessly and efficiently on-chain.

---

## Overview

Modula consists of ten modular smart contracts designed to support transparent, permissionless, and user-sovereign interactions between governments, NGOs, and the public:

1. **Identity Registry Contract** – Verifies decentralized identities using attestations and zk-credentials.
2. **Access Token Contract** – Issues non-transferable service access tokens tied to eligibility.
3. **Service Registry Contract** – Registers and manages verified public service providers.
4. **Access Control Contract** – Authorizes or restricts access to services based on verified credentials.
5. **Funding Pool Contract** – Manages and disburses funds for public service initiatives.
6. **Service Request Contract** – Handles user-initiated service requests and their lifecycle.
7. **Audit Log Contract** – Tracks immutable records of public service interactions.
8. **Meta-Transaction Relay Contract** – Enables gasless interactions through trusted relayers.
9. **Reputation Score Contract** – Calculates and updates trust scores for providers and users.
10. **Governance Engine Contract** – Facilitates community governance over access criteria and service policy.

---

## Features

- **Decentralized ID verification** with optional ZK integration  
- **Soulbound tokens** for eligibility and benefit tracking  
- **Composable service registry** for any public institution  
- **Transparent funding pools** for verified service initiatives  
- **Gasless UX** using relayers for accessibility  
- **Request lifecycle tracking** for transparency and accountability  
- **Reputation scoring** to prevent fraud and abuse  
- **Community governance** over service logic and eligibility  
- **Interoperable middleware layer** for civic applications  
- **Immutable audit logs** for verification and dispute resolution  

---

## Smart Contracts

### Identity Registry Contract
- Links wallets to off-chain verified identity credentials
- Supports ZK-based verification and attestations
- Anchors identity without compromising privacy

### Access Token Contract
- Issues non-transferable service access tokens (e.g., healthcare eligibility)
- Tokens expire or evolve based on policy logic
- Enforces unique eligibility per user

### Service Registry Contract
- Onboards and verifies public or NGO service providers
- Stores metadata, categories, and ratings
- Supports modular service definitions

### Access Control Contract
- Checks credential eligibility before service execution
- Integrates with Identity Registry and Token logic
- Supports DAO overrides and emergency policies

### Funding Pool Contract
- Manages treasury funds for service categories
- Enables milestone-based or streaming disbursements
- Supports donations, grants, and quadratic funding

### Service Request Contract
- Users submit structured requests for services
- Tracks approval, completion, and satisfaction outcomes
- Integrates with oracles for off-chain verification

### Audit Log Contract
- Logs all service requests, approvals, and funds transparently
- Verifiable by third parties or audit oracles
- Immutable storage for dispute resolution

### Meta-Transaction Relay Contract
- Enables gasless interactions for non-crypto-native users
- Supports whitelisted or DAO-approved relayers
- Secure signature verification to prevent replay attacks

### Reputation Score Contract
- Assigns scores based on service fulfillment, reviews, and audits
- Prevents collusion and spam with stake slashing logic
- Applies to both users and providers

### Governance Engine Contract
- Manages proposals, votes, and on-chain parameter changes
- Token- or identity-weighted voting support
- Policy modules are upgradeable through consensus

---

## Installation

1. Install [Clarinet CLI](https://docs.hiro.so/clarinet/getting-started)
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/modula.git
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

## Usage

Each contract is modular and can be used independently or in combination.
Modula is designed to serve as a middleware layer for civic tech, allowing builders, governments, and NGOs to deploy secure, permissionless, and user-driven service platforms.

Refer to individual contract documentation for function calls, expected parameters, and integration examples.

## Testing

All contracts include Clarity-based tests that simulate user interactions and role-based permissions.

**Run tests with:**
```bash
npm test
```

## License

MIT License