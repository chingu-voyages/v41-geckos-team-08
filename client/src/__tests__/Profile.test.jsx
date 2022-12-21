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
 const setup = async (is_supplier = false) => {
  const mockStore = configureMockStore([thunk]);
  const store = mockStore({
   auth: {
    data: {
     name: 'exampleUser',
     email: 'example@email.com',
     phone: '1234567890',
     uuid: 'exampleUUID',
     is_supplier
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

 it('renders the user as a customer', async () => {
  await setup();

  expect(screen.getByTestId('profileName').textContent).toEqual('exampleUser');
  expect(screen.getByTestId('profileEmail').textContent).toEqual('Email: example@email.com');
  expect(screen.getByTestId('profilePhone').textContent).toEqual('Phone: (123) 4567890');

  expect(screen.getByTestId('profileType').textContent).toEqual('');
  expect(screen.getByTestId('leftBtn').textContent).toEqual('Jobs Posted');
  expect(screen.getByTestId('rightBtn').textContent).toEqual('Jobs In Progress');  
 });

 it('renders the user as a supplier', async () => {
  await setup(true);

  expect(screen.getByTestId('profileType').textContent).toEqual('Service Provider');
  expect(screen.getByTestId('leftBtn').textContent).toEqual('Jobs Taken');
  expect(screen.getByTestId('rightBtn').textContent).toEqual('Jobs Pending');
 });
});