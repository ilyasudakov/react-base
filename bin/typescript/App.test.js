import { render } from '@testing-library/react';
import { App } from './App.tsx';

describe('App component', () => {
  test('renders', () => {
    const { getByText } = render(<App />);
    expect(getByText('App')).toBeInTheDocument();
  });
});
