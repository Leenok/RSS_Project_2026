export interface PasswordStrength {
    score: number; // 0-4
    label: string;
    color: string;
    checks: {
        hasNumber: boolean;
        hasUppercase: boolean;
        hasLowercase: boolean;
        hasSpecial: boolean;
        hasMinLength: boolean;
    };
}

export function getPasswordStrength(password: string): PasswordStrength {
    const checks = {
        hasNumber: /\d/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasSpecial: /[^A-Za-z0-9]/.test(password),
        hasMinLength: password.length >= 8,
    };

    const score = Object.values(checks).filter(Boolean).length;

    const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Strong'];
    const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60', '#27ae60'];

    return {
        score,
        label: labels[score] ?? 'Very weak',
        color: colors[score] ?? '#e74c3c',
        checks,
    };
}

export function imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}