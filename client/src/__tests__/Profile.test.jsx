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
 const setup = async (is_supplier = false, jobs = {}) => {
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
     jobs_posted: jobs.posted || [],
     jobs_in_progress: jobs.in_progress || []
    }
   ],
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

 it('displays the no jobs msg for the customer', async () => {
  await setup();

  expect(screen.getByTestId('noJobs').textContent).toEqual('Sorry, you don\'t have any jobs posted.');

  fireEvent.click(screen.getByTestId('rightBtn'));

  expect(screen.getByTestId('noJobs').textContent).toEqual('Sorry, you don\'t have any jobs in progress.');
 });

 it('displays the no jobs msg for the supplier', async () => {
  await setup(true);

  expect(screen.getByTestId('noJobs').textContent).toEqual('Sorry, you don\'t have any jobs picked up.');

  fireEvent.click(screen.getByTestId('rightBtn'));

  expect(screen.getByTestId('noJobs').textContent).toEqual('Sorry, you don\'t have any jobs waiting to be picked up.');
 });

 it('displays jobs posted by the customer', async () => {
  const jobs = {
   posted: [
    {
     uuid: 0,
     customer: {
      name: 'exampleName0'
     },
     description: 'example description zero',
     trade: {
      description: 'Welder'
     },
     expiration_date: '2032-01-01T00:00:00'
    },
    {
     uuid: 1,
     customer: {
      name: 'exampleName1'
     },
     description: 'example description one',
     trade: {
      description: 'Electrician'
     },
     expiration_date: '2032-01-01T00:00:00'
    },
   ]
  };

  await setup(false, jobs);

  expect(screen.queryByTestId('noJobs')).not.toBeInTheDocument();
  expect(screen.getByTestId('editBtn0')).toBeInTheDocument();
  expect(screen.getByTestId('jobBtn1')).toBeInTheDocument();

  expect(screen.getByTestId('jobName1').textContent).toEqual('exampleName1');
  expect(screen.getByTestId('jobDescription0').textContent).toEqual('example description zero');
  expect(screen.getByTestId('jobTrade1').textContent).toEqual('Skills Required: Electrician');
  expect(screen.getByTestId('jobExpiration0').textContent).toEqual('Due Date: 2032-01-01');
 });

 it('displays job proposals pending from the supplier', async () => {
  const jobs = {
   pending: [
    {
     job: {
      uuid: 0,
      description: 'example description zero',
     },
     customer: {
      name: 'exampleName0'
     },
     trade: {
      description: 'Welder'
     },
     expiration_date: '2032-01-01T00:00:00'
    },
    {
     job: {
      uuid: 1,
      description: 'example description one',
     },
     customer: {
      name: 'exampleName1'
     },
     trade: {
      description: 'Electrician'
     },
     expiration_date: '2032-01-01T00:00:00'
    },
   ]
  };

  await setup(true, jobs);

  fireEvent.click(screen.getByTestId('rightBtn'));

  expect(screen.queryByTestId('noJobs')).not.toBeInTheDocument();
  expect(screen.getByTestId('editBtn0')).toBeInTheDocument();

  expect(screen.getByTestId('jobName1').textContent).toEqual('exampleName1');
  expect(screen.getByTestId('jobDescription0').textContent).toEqual('example description zero');
  expect(screen.getByTestId('jobTrade1').textContent).toEqual('Skills Required: Electrician');
  expect(screen.getByTestId('jobExpiration0').textContent).toEqual('Due Date: 2032-01-01');
 });

 it('displays jobs from the customer in progress', async () => {
  const jobs = {
   in_progress: [
    {
     uuid: 0,
     customer: {
      name: 'exampleName0'
     },
     description: 'example description zero',
     trade: {
      description: 'Welder'
     },
     expiration_date: '2032-01-01T00:00:00'
    },
    {
     uuid: 1,
     customer: {
      name: 'exampleName1'
     },
     description: 'example description one',
     trade: {
      description: 'Electrician'
     },
     expiration_date: '2032-01-01T00:00:00'
    },
   ]
  };

  await setup(false, jobs);

  fireEvent.click(screen.getByTestId('rightBtn'));

  expect(screen.queryByTestId('noJobs')).not.toBeInTheDocument();

  expect(screen.getByTestId('jobName1').textContent).toEqual('exampleName1');
  expect(screen.getByTestId('jobDescription0').textContent).toEqual('example description zero');
  expect(screen.getByTestId('jobTrade1').textContent).toEqual('Skills Required: Electrician');
  expect(screen.getByTestId('jobExpiration0').textContent).toEqual('Due Date: 2032-01-01');
 });

 it('displays job proposals from the supplier that are taken', async () => {
  const jobs = {
   taken: [
    {
     job: {
      uuid: 0,
      description: 'example description zero',
     },
     customer: {
      name: 'exampleName0'
     },
     trade: {
      description: 'Welder'
     },
     expiration_date: '2032-01-01T00:00:00'
    },
    {
     job: {
      uuid: 1,
      description: 'example description one',
     },
     customer: {
      name: 'exampleName1'
     },
     trade: {
      description: 'Electrician'
     },
     expiration_date: '2032-01-01T00:00:00'
    },
   ]
  };

  await setup(true, jobs);

  expect(screen.queryByTestId('noJobs')).not.toBeInTheDocument();
  expect(screen.getByTestId('finishBtn0')).toBeInTheDocument();

  expect(screen.getByTestId('jobName1').textContent).toEqual('exampleName1');
  expect(screen.getByTestId('jobDescription0').textContent).toEqual('example description zero');
  expect(screen.getByTestId('jobTrade1').textContent).toEqual('Skills Required: Electrician');
  expect(screen.getByTestId('jobExpiration0').textContent).toEqual('Due Date: 2032-01-01');
 });
});