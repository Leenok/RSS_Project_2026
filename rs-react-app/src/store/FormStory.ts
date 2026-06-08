import { create } from 'zustand';
import type { FormSubmission } from '../types/form';
import { COUNTRIES } from '../lib/countries';

interface FormStore {
    submissions: FormSubmission[];
    countries: string[];
    addSubmission: (submission: Omit<FormSubmission, 'id' | 'submittedAt'>) => void;
    markAllOld: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
    submissions: [],
    countries: COUNTRIES,

    addSubmission: (submission) => {
        const newEntry: FormSubmission = {
            ...submission,
            id: crypto.randomUUID(),
            submittedAt: Date.now(),
            isNew: true,
        };
        set((state) => ({
            submissions: [newEntry, ...state.submissions],
        }));
    },

    markAllOld: () => {
        set((state) => ({
            submissions: state.submissions.map((s) => ({ ...s, isNew: false })),
        }));
    },
}));