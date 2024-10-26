import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Aisoko text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Aisoko/i);
  expect(linkElement).toBeInTheDocument();
});
