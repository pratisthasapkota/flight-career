import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the AeroCareers app shell', () => {
  render(
    <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole('link', { name: 'AeroCareers' })).toBeInTheDocument();
});

test('renders the home page content', () => {
  render(
    <MemoryRouter initialEntries={['/']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Students Placed/i)).toBeInTheDocument();
});