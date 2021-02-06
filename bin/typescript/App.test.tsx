import { render } from '@testing-library/react';
import { App } from './App';

describe('App component', () => {
  test('renders', () => {
    const { getByText } = render(<App />);
    expect(getByText('MyApp')).toBeInTheDocument();
  });
});
