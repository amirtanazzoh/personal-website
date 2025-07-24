import argon2 from 'argon2';
import * as bcrypt from 'bcrypt';

// Number of salt rounds for bcrypt hashing (higher = more secure but slower)
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt.
 * 
 * @param plainPassword - The password to hash.
 * @returns The hashed password string.
 */
export async function hashBcrypt ( plainPassword: string ): Promise<string>
{
    return bcrypt.hash( plainPassword, SALT_ROUNDS );
}

/**
 * Verify a plain password against a bcrypt hash.
 * 
 * @param plainPassword - The password to check.
 * @param hashedPassword - The bcrypt hash to compare with.
 * @returns True if the password matches the hash, otherwise false.
 */
export async function verifyBcrypt ( plainPassword: string, hashedPassword: string ): Promise<boolean>
{
    return bcrypt.compare( plainPassword, hashedPassword );
}

/**
 * Hash a plain text password using Argon2 (argon2id variant).
 * 
 * @param plainPassword - The password to hash.
 * @returns The hashed password string.
 */
export async function hashArgon ( plainPassword: string ): Promise<string>
{
    return argon2.hash( plainPassword, {
        type: argon2.argon2id,       // Use argon2id for better resistance to side-channel attacks
        memoryCost: 2 ** 16,         // 64 MB of memory to make hashing more expensive for attackers
        timeCost: 5,                 // Number of iterations (higher = more secure but slower)
        parallelism: 1,              // Number of parallel threads (1 for simplicity)
    } );
}

/**
 * Verify a plain password against an Argon2 hash.
 * 
 * @param hash - The previously hashed password.
 * @param plainPassword - The password to check.
 * @returns True if the password matches the hash, otherwise false.
 */
export async function verifyArgon ( hash: string, plainPassword: string ): Promise<boolean>
{
    return await argon2.verify( hash, plainPassword );
}
