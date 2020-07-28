import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/shorten/i);
  expect(linkElement).toBeInTheDocument();
});
