import { render } from '@testing-library/react';
import Spinner from '../Spinner';

describe('Spinner component', () => {
  test('рендерится без ошибок с дефолтными пропсами', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('применяет переданный размер через inline style', () => {
    const { container } = render(<Spinner size={80} />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.style.width).toBe('80px');
    expect(spinner.style.height).toBe('80px');
  });

  test('применяет дефолтный размер 40px если size не передан', () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.style.width).toBe('40px');
    expect(spinner.style.height).toBe('40px');
  });

  test('применяет переданный цвет через inline style', () => {
    const { container } = render(<Spinner color="#FF0000" />);
    const spinner = container.firstChild as HTMLElement;
    expect(spinner.style.borderColor).toContain('#FF0000');
  });
});
