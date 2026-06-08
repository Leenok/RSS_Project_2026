import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from '../formStore';

describe('formStore', () => {
    beforeEach(() => {
        useFormStore.setState({ submissions: [] });
    });

    it('initially has no submissions', () => {
        const { submissions } = useFormStore.getState();
        expect(submissions).toHaveLength(0);
    });

    it('has countries list', () => {
        const { countries } = useFormStore.getState();
        expect(countries.length).toBeGreaterThan(0);
        expect(countries).toContain('Germany');
    });

    it('adds a submission', () => {
        const { addSubmission } = useFormStore.getState();
        addSubmission({
            name: 'Alice',
            age: 25,
            email: 'alice@example.com',
            gender: 'female',
            acceptTerms: true,
            password: 'Pass@word1',
            country: 'Germany',
            source: 'rhf',
        });
        const { submissions } = useFormStore.getState();
        expect(submissions).toHaveLength(1);
        expect(submissions[0].name).toBe('Alice');
        expect(submissions[0].isNew).toBe(true);
        expect(submissions[0].id).toBeDefined();
        expect(submissions[0].submittedAt).toBeGreaterThan(0);
    });

    it('adds multiple submissions and prepends newest', () => {
        const { addSubmission } = useFormStore.getState();
        addSubmission({ name: 'Alice', age: 25, email: 'a@a.com', gender: 'female', acceptTerms: true, password: 'x', country: 'Germany', source: 'rhf' });
        addSubmission({ name: 'Bob', age: 30, email: 'b@b.com', gender: 'male', acceptTerms: true, password: 'x', country: 'France', source: 'uncontrolled' });
        const { submissions } = useFormStore.getState();
        expect(submissions[0].name).toBe('Bob');
        expect(submissions[1].name).toBe('Alice');
    });

    it('markAllOld sets isNew to false', () => {
        const { addSubmission, markAllOld } = useFormStore.getState();
        addSubmission({ name: 'Alice', age: 25, email: 'a@a.com', gender: 'female', acceptTerms: true, password: 'x', country: 'Germany', source: 'rhf' });
        markAllOld();
        const { submissions } = useFormStore.getState();
        expect(submissions[0].isNew).toBe(false);
    });
});