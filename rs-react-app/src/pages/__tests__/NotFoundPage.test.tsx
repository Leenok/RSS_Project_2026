import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import NotFoundPage from '../NotFoundPage';

const renderNotFound = () =>
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>
  );

describe('NotFoundPage', () => {
  test('отображает код 404', () => {
    renderNotFound();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  test('содержит сообщение о ненайденной странице', () => {
    renderNotFound();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  test('содержит ссылку для возврата на главную', () => {
    renderNotFound();
    const link = screen.getByRole('link', { name: /go back to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
