import React from 'react';
import { render } from '@testing-library/react';
import NoPage from '../pages/Main/Admin/NoPage';

/**
 * @module NoPage.test
 * @description Jest teszt függvény, ami ellenőrzi, hogy a NoPage komponens helyesen jelenik meg.
 * Ellenőrzi, hogy a videó automatikusan indul-e, illetve folyamatosan játszdik-e le, valamint némítva van-e.
 * Továbbá ellenőrzi, hogy a megfelelő videót jeleníti-e meg.
 */

it('NoPage helyesen jelenik-e meg', () => {
  const { getByTestId } = render(<NoPage />);
  const video = getByTestId('video');

  expect(video).toHaveAttribute('autoPlay');
  expect(video).toHaveAttribute('loop');
  expect(video.muted).toBe(true);
  expect(video.firstChild).toHaveAttribute('src', 'Metro_404.mp4');
  expect(video.firstChild).toHaveAttribute('type', 'video/mp4');
});