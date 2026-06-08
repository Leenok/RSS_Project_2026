import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormSchemaType } from '../../lib/formSchema';
import { useFormStore } from '../../store/formStore';
import { imageToBase64 } from '../../utils/formUtils';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import styles from './FormCommon.module.css';

interface Props {
    onClose: () => void;
}

const RHFForm: React.FC<Props> = ({ onClose }) => {
    const { addSubmission } = useFormStore();

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isValid },
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
    });

    const passwordValue = watch('password') ?? '';

    const onSubmit = async (data: FormSchemaType) => {
        let imageBase64: string | undefined;
        const files = data.image as FileList | undefined;
        if (files && files.length > 0) {
            imageBase64 = await imageToBase64(files[0]);
        }

        addSubmission({
            name: data.name,
            age: data.age as number,
            email: data.email,
            gender: data.gender,
            acceptTerms: data.acceptTerms,
            password: data.password,
            country: data.country,
            imageBase64,
            source: 'rhf',
        });

        onClose();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form} data-testid="rhf-form">
            {/* Name */}
            <div className={styles.field}>
                <label htmlFor="rhf-name" className={styles.label}>Name</label>
                <input id="rhf-name" type="text" {...register('name')} className={`${styles.input} ${errors.name ? styles.inputError : ''}`} />
                {errors.name && <span className={styles.error} role="alert">{errors.name.message}</span>}
            </div>

            {/* Age */}
            <div className={styles.field}>
                <label htmlFor="rhf-age" className={styles.label}>Age</label>
                <input id="rhf-age" type="number" {...register('age')} className={`${styles.input} ${errors.age ? styles.inputError : ''}`} />
                {errors.age && <span className={styles.error} role="alert">{errors.age.message}</span>}
            </div>

            {/* Email */}
            <div className={styles.field}>
                <label htmlFor="rhf-email" className={styles.label}>Email</label>
                <input id="rhf-email" type="email" {...register('email')} className={`${styles.input} ${errors.email ? styles.inputError : ''}`} />
                {errors.email && <span className={styles.error} role="alert">{errors.email.message}</span>}
            </div>

            {/* Gender */}
            <div className={styles.field}>
                <label htmlFor="rhf-gender" className={styles.label}>Gender</label>
                <select id="rhf-gender" {...register('gender')} className={`${styles.input} ${errors.gender ? styles.inputError : ''}`}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && <span className={styles.error} role="alert">{errors.gender.message}</span>}
            </div>

            {/* Password */}
            <div className={styles.field}>
                <label htmlFor="rhf-password" className={styles.label}>Password</label>
                <input id="rhf-password" type="password" {...register('password')} className={`${styles.input} ${errors.password ? styles.inputError : ''}`} />
                <PasswordStrength password={passwordValue} />
                {errors.password && <span className={styles.error} role="alert">{errors.password.message}</span>}
            </div>

            {/* Confirm Password */}
            <div className={styles.field}>
                <label htmlFor="rhf-confirm-password" className={styles.label}>Confirm Password</label>
                <input id="rhf-confirm-password" type="password" {...register('confirmPassword')} className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`} />
                {errors.confirmPassword && <span className={styles.error} role="alert">{errors.confirmPassword.message}</span>}
            </div>

            {/* Country */}
            <div className={styles.field}>
                <label htmlFor="rhf-country" className={styles.label}>Country</label>
                <Controller
                    name="country"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <CountryAutocomplete
                            id="rhf-country"
                            name="country"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.country?.message}
                        />
                    )}
                />
                {errors.country && <span className={styles.error} role="alert">{errors.country.message}</span>}
            </div>

            {/* Image */}
            <div className={styles.field}>
                <label htmlFor="rhf-image" className={styles.label}>Profile Image (PNG/JPEG, max 2MB)</label>
                <input
                    id="rhf-image"
                    type="file"
                    accept="image/png,image/jpeg"
                    {...register('image')}
                    className={`${styles.input} ${errors.image ? styles.inputError : ''}`}
                />
                {errors.image && <span className={styles.error} role="alert">{errors.image.message as string}</span>}
            </div>

            {/* Terms */}
            <div className={styles.checkboxField}>
                <input id="rhf-terms" type="checkbox" {...register('acceptTerms')} className={styles.checkbox} />
                <label htmlFor="rhf-terms" className={styles.checkboxLabel}>I accept the Terms and Conditions</label>
                {errors.acceptTerms && <span className={styles.error} role="alert">{errors.acceptTerms.message}</span>}
            </div>

            <button
                type="submit"
                className={styles.submitButton}
                disabled={!isValid}
                data-testid="rhf-submit"
            >
                Submit
            </button>
        </form>
    );
};

export default RHFForm;