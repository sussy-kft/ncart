import React from 'react';
import { render } from '@testing-library/react';
import NoPage from '../pages/Main/Admin/NoPage';

it('renders correctly', () => {
  const { getByTestId } = render(<NoPage />);
  const video = getByTestId('video');

  expect(video).toHaveAttribute('autoPlay');
  expect(video).toHaveAttribute('loop');
  expect(video.muted).toBe(true);
  expect(video.firstChild).toHaveAttribute('src', 'Metro_404.mp4');
  expect(video.firstChild).toHaveAttribute('type', 'video/mp4');
});