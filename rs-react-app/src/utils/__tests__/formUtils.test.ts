import { describe, it, expect } from 'vitest';
import { getPasswordStrength, imageToBase64 } from '../formUtils';

describe('getPasswordStrength', () => {
    it('returns score 0 for empty string', () => {
        const result = getPasswordStrength('');
        expect(result.score).toBe(0);
    });

    it('detects number', () => {
        const result = getPasswordStrength('1');
        expect(result.checks.hasNumber).toBe(true);
    });

    it('detects uppercase', () => {
        const result = getPasswordStrength('A');
        expect(result.checks.hasUppercase).toBe(true);
    });

    it('detects lowercase', () => {
        const result = getPasswordStrength('a');
        expect(result.checks.hasLowercase).toBe(true);
    });

    it('detects special character', () => {
        const result = getPasswordStrength('!');
        expect(result.checks.hasSpecial).toBe(true);
    });

    it('detects min length', () => {
        const result = getPasswordStrength('abcdefgh');
        expect(result.checks.hasMinLength).toBe(true);
    });

    it('returns score 5 for strong password', () => {
        const result = getPasswordStrength('StrongP@ss1');
        expect(result.score).toBe(5);
        expect(result.label).toBe('Strong');
    });

    it('returns correct color for score', () => {
        const weak = getPasswordStrength('a');
        // score 1 (only lowercase) → colors[1]
        expect(weak.color).toBe('#e67e22');
        const strong = getPasswordStrength('StrongP@ss1');
        expect(strong.color).toBe('#27ae60');
    });
});

describe('imageToBase64', () => {
    it('converts a File to base64 string', async () => {
        const file = new File(['hello'], 'test.png', { type: 'image/png' });
        const result = await imageToBase64(file);
        expect(result).toContain('data:image/png;base64,');
    });
});