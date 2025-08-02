// Modula Access Token Contract – Mock Tests with Vitest
type TokenId = number;
type Principal = string;

interface MockContract {
  admin: Principal;
  paused: boolean;
  nextId: number;
  tokenOwners: Map<TokenId, Principal>;
  tokenMetadata: Map<TokenId, string>;

  isAdmin: (caller: Principal) => boolean;
  setPaused: (caller: Principal, pause: boolean) => Result<boolean>;
  mintAccessToken: (caller: Principal, recipient: Principal, metadata: string) => Result<number>;
  burnAccessToken: (caller: Principal, tokenId: number) => Result<boolean>;
  getOwner: (tokenId: number) => Result<Principal>;
  getMetadata: (tokenId: number) => Result<string>;
}

type Result<T> = { value: T } | { error: number };

const ZERO_ADDRESS = 'SP000000000000000000002Q6VF78';
const ERR = {
  NOT_AUTHORIZED: 100,
  TOKEN_EXISTS: 101,
  TOKEN_NOT_FOUND: 102,
  ZERO_ADDRESS: 103,
  PAUSED: 104
};

const mockAccessTokenContract: MockContract = {
  admin: 'ST1ADMIN0000000000000000000000000000000',
  paused: false,
  nextId: 1,
  tokenOwners: new Map(),
  tokenMetadata: new Map(),

  isAdmin(caller) {
    return caller === this.admin;
  },

  setPaused(caller, pause) {
    if (!this.isAdmin(caller)) return { error: ERR.NOT_AUTHORIZED };
    this.paused = pause;
    return { value: pause };
  },

  mintAccessToken(caller, recipient, metadata) {
    if (this.paused) return { error: ERR.PAUSED };
    if (!this.isAdmin(caller)) return { error: ERR.NOT_AUTHORIZED };
    if (recipient === ZERO_ADDRESS) return { error: ERR.ZERO_ADDRESS };
    const tokenId = this.nextId;
    this.tokenOwners.set(tokenId, recipient);
    this.tokenMetadata.set(tokenId, metadata);
    this.nextId++;
    return { value: tokenId };
  },

  burnAccessToken(caller, tokenId) {
    if (this.paused) return { error: ERR.PAUSED };
    const owner = this.tokenOwners.get(tokenId);
    if (!owner) return { error: ERR.TOKEN_NOT_FOUND };
    if (caller !== owner && !this.isAdmin(caller)) return { error: ERR.NOT_AUTHORIZED };
    this.tokenOwners.delete(tokenId);
    this.tokenMetadata.delete(tokenId);
    return { value: true };
  },

  getOwner(tokenId) {
    const owner = this.tokenOwners.get(tokenId);
    if (!owner) return { error: ERR.TOKEN_NOT_FOUND };
    return { value: owner };
  },

  getMetadata(tokenId) {
    const meta = this.tokenMetadata.get(tokenId);
    if (!meta) return { error: ERR.TOKEN_NOT_FOUND };
    return { value: meta };
  }
};

// Vitest Tests
import { describe, it, expect, beforeEach } from 'vitest';

describe('Modula Access Token Contract (Mocked)', () => {
  beforeEach(() => {
    mockAccessTokenContract.paused = false;
    mockAccessTokenContract.nextId = 1;
    mockAccessTokenContract.tokenOwners = new Map();
    mockAccessTokenContract.tokenMetadata = new Map();
  });

  it('should mint a token by admin', () => {
    const result = mockAccessTokenContract.mintAccessToken(
      mockAccessTokenContract.admin,
      'ST2CITIZEN0000000000000000000000000000000',
      'Healthcare Access 2025'
    );
    expect(result).toEqual({ value: 1 });
  });

  it('should not mint token if paused', () => {
    mockAccessTokenContract.setPaused(mockAccessTokenContract.admin, true);
    const result = mockAccessTokenContract.mintAccessToken(
      mockAccessTokenContract.admin,
      'ST2USER1234',
      'Social Housing Access'
    );
    expect(result).toEqual({ error: ERR.PAUSED });
  });

  it('should reject minting from non-admin', () => {
    const result = mockAccessTokenContract.mintAccessToken('ST3NOTADMIN', 'ST2CITIZEN1', 'Gov Access');
    expect(result).toEqual({ error: ERR.NOT_AUTHORIZED });
  });

  it('should return token metadata', () => {
    mockAccessTokenContract.mintAccessToken(
      mockAccessTokenContract.admin,
      'ST2BENEFICIARY',
      'Energy Credit 2025'
    );
    const result = mockAccessTokenContract.getMetadata(1);
    expect(result).toEqual({ value: 'Energy Credit 2025' });
  });

  it('should burn token by owner', () => {
    mockAccessTokenContract.mintAccessToken(mockAccessTokenContract.admin, 'ST2CITIZEN', 'Legal Aid');
    const result = mockAccessTokenContract.burnAccessToken('ST2CITIZEN', 1);
    expect(result).toEqual({ value: true });
    expect(mockAccessTokenContract.getOwner(1)).toEqual({ error: ERR.TOKEN_NOT_FOUND });
  });

  it('should burn token by admin', () => {
    mockAccessTokenContract.mintAccessToken(mockAccessTokenContract.admin, 'ST2CITIZEN', 'Education Grant');
    const result = mockAccessTokenContract.burnAccessToken(mockAccessTokenContract.admin, 1);
    expect(result).toEqual({ value: true });
  });

  it('should prevent non-owner/non-admin from burning', () => {
    mockAccessTokenContract.mintAccessToken(mockAccessTokenContract.admin, 'ST2CITIZEN', 'Disability Support');
    const result = mockAccessTokenContract.burnAccessToken('ST3INTRUDER', 1);
    expect(result).toEqual({ error: ERR.NOT_AUTHORIZED });
  });
});
