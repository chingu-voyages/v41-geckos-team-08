import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import * as ReactRedux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { LandingPage } from '../Pages/LandingPage';
import PageNotFound from '../Pages/PageNotFound';

// This file is for testing the rendering of the landing and error pages
jest.mock('../assets/images/Drill.jpg');

describe('Landing Page', () => {
  const setup = () => {
    const { container } = render(
      <Router>
        <LandingPage />
      </Router>
    );
    return { container };
  };

  it('renders the landing page', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  it('renders the text content', () => {
    setup();
    expect(screen.getByTestId('topHeading')).toHaveTextContent(
      'Need a job done?Find someone in your city to do the Handy Work for you.'
    );
    expect(screen.getByTestId('bottomHeading')).toHaveTextContent(
        "Here's what Handy Work can do for you"
      );
     
  });
});
