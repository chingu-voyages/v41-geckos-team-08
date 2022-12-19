import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import * as ReactRedux from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from 'redux-thunk';
import { act } from "react-dom/test-utils";
import { UserProfile } from '../Pages/UserProfile';

jest.mock('../assets/images/measurements.jpg');

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

describe("Profile Page", () => {
 const setup = async () => {
  const mockStore = configureMockStore([thunk]);
  const store = mockStore({
   auth: {
    data: {
     is_supplier: false
    }
   },
   jobs: [
    {
     jobs_posted: [],
     jobs_in_progress: []
    }
   ],
   proposals: [
    {
     jobs_taken: [],
     jobs_pending: []
    }
   ]
  });

  const dispatch = jest.fn(() => Promise.resolve());
  const useDispatch = jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(dispatch);

  const { Provider } = ReactRedux;

  const { container } = render(
   <Provider store={store}>
    <Router>
     <UserProfile />
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

 it('renders the profile page', async () => {
  const { container } = await setup();
  expect(container).toMatchSnapshot();
 });
});