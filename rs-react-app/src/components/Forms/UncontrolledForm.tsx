import { useRef, useState } from 'react';
import { formSchema } from '../../lib/formSchema';
import { useFormStore } from '../../store/formStore';
import { imageToBase64 } from '../../utils/formUtils';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import styles from './FormCommon.module.css';

interface Props {
    onClose: () => void;
}

type FieldErrors = Partial<Record<string, string>>;

const UncontrolledForm: React.FC<Props> = ({ onClose }) => {
    const { addSubmission } = useFormStore();
    const [errors, setErrors] = useState<FieldErrors>({});
    const [passwordValue, setPasswordValue] = useState('');
    const [countryValue, setCountryValue] = useState('');

    const nameRef = useRef<HTMLInputElement>(null);
    const ageRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const genderRef = useRef<HTMLSelectElement>(null);
    const termsRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const raw = {
            name: nameRef.current?.value ?? '',
            age: ageRef.current?.value ?? '',
            email: emailRef.current?.value ?? '',
            gender: genderRef.current?.value ?? '',
            acceptTerms: termsRef.current?.checked ?? false,
            password: passwordRef.current?.value ?? '',
            confirmPassword: confirmPasswordRef.current?.value ?? '',
            country: countryValue,
            image: imageRef.current?.files,
        };

        const result = formSchema.safeParse(raw);

        if (!result.success) {
            const fieldErrors: FieldErrors = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as string;
                if (!fieldErrors[key]) fieldErrors[key] = issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        let imageBase64: string | undefined;
        const files = imageRef.current?.files;
        if (files && files.length > 0) {
            imageBase64 = await imageToBase64(files[0]);
        }

        addSubmission({
            name: result.data.name,
            age: result.data.age as number,
            email: result.data.email,
            gender: result.data.gender,
            acceptTerms: result.data.acceptTerms,
            password: result.data.password,
            country: result.data.country,
            imageBase64,
            source: 'uncontrolled',
        });

        onClose();
    };

    return (
        <form onSubmit={handleSubmit} noValidate className={styles.form} data-testid="uncontrolled-form">
            {/* Name */}
            <div className={styles.field}>
                <label htmlFor="uc-name" className={styles.label}>Name</label>
                <input id="uc-name" name="name" type="text" ref={nameRef} className={`${styles.input} ${errors.name ? styles.inputError : ''}`} />
                {errors.name && <span className={styles.error} role="alert">{errors.name}</span>}
            </div>

            {/* Age */}
            <div className={styles.field}>
                <label htmlFor="uc-age" className={styles.label}>Age</label>
                <input id="uc-age" name="age" type="number" ref={ageRef} className={`${styles.input} ${errors.age ? styles.inputError : ''}`} />
                {errors.age && <span className={styles.error} role="alert">{errors.age}</span>}
            </div>

            {/* Email */}
            <div className={styles.field}>
                <label htmlFor="uc-email" className={styles.label}>Email</label>
                <input id="uc-email" name="email" type="email" ref={emailRef} className={`${styles.input} ${errors.email ? styles.inputError : ''}`} />
                {errors.email && <span className={styles.error} role="alert">{errors.email}</span>}
            </div>

            {/* Gender */}
            <div className={styles.field}>
                <label htmlFor="uc-gender" className={styles.label}>Gender</label>
                <select id="uc-gender" name="gender" ref={genderRef} className={`${styles.input} ${errors.gender ? styles.inputError : ''}`}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && <span className={styles.error} role="alert">{errors.gender}</span>}
            </div>

            {/* Password */}
            <div className={styles.field}>
                <label htmlFor="uc-password" className={styles.label}>Password</label>
                <input
                    id="uc-password"
                    name="password"
                    type="password"
                    ref={passwordRef}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                />
                <PasswordStrength password={passwordValue} />
                {errors.password && <span className={styles.error} role="alert">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className={styles.field}>
                <label htmlFor="uc-confirm-password" className={styles.label}>Confirm Password</label>
                <input id="uc-confirm-password" name="confirmPassword" type="password" ref={confirmPasswordRef} className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`} />
                {errors.confirmPassword && <span className={styles.error} role="alert">{errors.confirmPassword}</span>}
            </div>

            {/* Country */}
            <div className={styles.field}>
                <label htmlFor="uc-country" className={styles.label}>Country</label>
                <CountryAutocomplete
                    id="uc-country"
                    name="country"
                    value={countryValue}
                    onChange={setCountryValue}
                    error={errors.country}
                />
                {errors.country && <span className={styles.error} role="alert">{errors.country}</span>}
            </div>

            {/* Image */}
            <div className={styles.field}>
                <label htmlFor="uc-image" className={styles.label}>Profile Image (PNG/JPEG, max 2MB)</label>
                <input
                    id="uc-image"
                    name="image"
                    type="file"
                    accept="image/png,image/jpeg"
                    ref={imageRef}
                    className={`${styles.input} ${errors.image ? styles.inputError : ''}`}
                />
                {errors.image && <span className={styles.error} role="alert">{errors.image}</span>}
            </div>

            {/* Terms */}
            <div className={styles.checkboxField}>
                <input id="uc-terms" name="acceptTerms" type="checkbox" ref={termsRef} className={styles.checkbox} />
                <label htmlFor="uc-terms" className={styles.checkboxLabel}>I accept the Terms and Conditions</label>
                {errors.acceptTerms && <span className={styles.error} role="alert">{errors.acceptTerms}</span>}
            </div>

            <button type="submit" className={styles.submitButton} data-testid="uc-submit">
                Submit
            </button>
        </form>
    );
};

export default UncontrolledForm;