import React from 'react';
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import * as ReactRedux from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from 'redux-thunk';
import { act } from "react-dom/test-utils";
import { AvailableJobsPage } from '../Pages/AvailableJobsPage';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-redux', () => {
  return {
    __esModule: true,
    ...jest.requireActual('react-redux')
  };
});

afterEach(done => {
  cleanup();
  jest.resetAllMocks();
  done();
});

describe('Available Jobs Page', () => {
 const setup = async (jobs = {}) => {
  jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('{"token":"token"}');
  axios.get = jest.fn().mockResolvedValue({
    data: {
      data: [
       {
        uuid: '0',
        name: 'United States'
       },
       {
        uuid: '1',
        name: 'Canada'
       },
      ]
    }
  });

  const mockStore = configureMockStore([thunk]);
  const store = mockStore({
   proposals: [
    {
     jobs_taken: jobs.taken || [],
     jobs_pending: jobs.pending || []
    }
   ]
  });

  const dispatch = jest.fn(() => Promise.resolve());
  const useDispatch = jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(dispatch);

  const { Provider } = ReactRedux;

  const { container } = render(
   <Provider store={store}>
    <Router>
     <AvailableJobsPage />
    </Router>
   </Provider>
  );

  const resolve = Promise.resolve();
  await act(async () => {
   await resolve;
  });

  return {
   container,
   useDispatch
  };
 }

 it('renders the available jobs page', async () => {
  const { container } = await setup();
  expect(container).toMatchSnapshot();
 });
});