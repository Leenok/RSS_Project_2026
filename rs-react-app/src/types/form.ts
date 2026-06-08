
export interface FormValues {
    name: string;
    age: number | string;
    email: string;
    gender: string;
    acceptTerms: boolean;
    password: string;
    confirmPassword: string;
    country: string;
    image?: FileList | null;
}

export interface FormSubmission {
    id: string;
    name: string;
    age: number;
    email: string;
    gender: string;
    acceptTerms: boolean;
    password: string;
    country: string;
    imageBase64?: string;
    submittedAt: number;
    isNew?: boolean;
    source: 'uncontrolled' | 'rhf';
}