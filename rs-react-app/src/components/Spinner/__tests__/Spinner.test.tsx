import { render } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Spinner from '../Spinner';

describe('Spinner — rendering', () => {
  test('рендерится без ошибок с дефолтными свойствами', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('применяет дефолтный размер 40px', () => {
    const { container } = render(<Spinner />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('40px');
    expect(el.style.height).toBe('40px');
  });

  test('применяет переданный размер через prop size', () => {
    const { container } = render(<Spinner size={80} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('80px');
    expect(el.style.height).toBe('80px');
  });

  test('применяет переданный цвет через prop color', () => {
    const { container } = render(<Spinner color="rgb(255, 0, 0)" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.borderColor).toContain('rgb(255, 0, 0) transparent');
  });

  test('применяет дефолтный цвет rgb(76, 175, 80)', () => {
    const { container } = render(<Spinner />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.borderColor).toContain('rgb(76, 175, 80) transparent');
  });

  test('рендерит div-элемент', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });
});
