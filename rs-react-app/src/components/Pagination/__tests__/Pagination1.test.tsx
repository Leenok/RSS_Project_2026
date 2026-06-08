import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import Pagination from '../Pagination';

describe('Pagination', () => {
  test('не рендерит ничего при totalPages <= 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('рендерит кнопки страниц', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('текущая страница имеет aria-current="page"', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />);
    const activeBtn = screen.getByRole('button', { name: '3' });
    expect(activeBtn).toHaveAttribute('aria-current', 'page');
  });

  test('кнопка "предыдущая" отключена на первой странице', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  test('кнопка "следующая" отключена на последней странице', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  test('вызывает onPageChange при клике на страницу', async () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: '2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('вызывает onPageChange с page-1 при клике "предыдущая"', async () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByLabelText('Previous page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('вызывает onPageChange с page+1 при клике "следующая"', async () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
