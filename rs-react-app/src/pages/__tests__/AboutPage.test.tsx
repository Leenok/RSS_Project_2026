import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import AboutPage from '../AboutPage';

const renderAbout = () =>
  render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>
  );

describe('AboutPage', () => {
  test('рендерит заголовок About', () => {
    renderAbout();
    expect(screen.getByRole('heading', { name: /about/i, level: 1 })).toBeInTheDocument();
  });

  test('содержит ссылку на RS School React курс', () => {
    renderAbout();
    const link = screen.getByRole('link', { name: /rs school react/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://rs.school/react/');
  });

  test('содержит ссылку "Back to home"', () => {
    renderAbout();
    expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument();
  });

  test('отображает информацию об авторе', () => {
    renderAbout();
    expect(screen.getByText(/rss react app/i)).toBeInTheDocument();
  });
});
