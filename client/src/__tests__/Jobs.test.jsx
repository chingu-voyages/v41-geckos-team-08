import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  const getMock = async (url) => await axios.get.mockImplementation(() => {
   switch (url) {
    case "locations":
     return Promise.resolve({
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
     })
    case "locations/0":
     return Promise.resolve({
      data: {
       data: [
        {
         uuid: '0',
         name: 'Los Angeles'
        },
        {
         uuid: '1',
         name: 'New York'
        },
       ]
      }
     })
    case "jobs?city=0":
     return Promise.resolve({
      data: {
       data: [
        {
         uuid: '0',
         customer: {
          name: 'Customer Zero',
         },
         city: {
          name: 'Los Angeles'
         },
         description: 'Example Description Zero',
         trade: {
          description: "Electrician"
         },
         expiration_date: "2032-01-01T00:00:00",
         is_taken: false
        },
        {
         uuid: '1',
         customer: {
          name: 'Customer One',
         },
         city: {
          name: 'Los Angeles'
         },
         description: 'Example Description One',
         trade: {
          description: "Welder"
         },
         expiration_date: "2032-01-01T00:00:00",
         is_taken: false
        },
       ]
      }
     })
    default:
     return '';
   }
  });

  await getMock('locations');

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
   getMock,
   useDispatch
  };
 }

 it('renders the available jobs page', async () => {
  const { container } = await setup();
  expect(container).toMatchSnapshot();
 });

 it('selects a city', async () => {
  const { getMock } = await setup();
  jest.useFakeTimers();

  await act(async () => {
    await getMock('locations/0');
  });

  userEvent.selectOptions(screen.getByTestId("countrySelect"), "United States");
  await act(async () => {
   await jest.runAllTimers();
  });

  fireEvent.change(screen.getByTestId("cityInput"), {target: {value: "Los Angeles"}});
  expect((screen.getByTestId("citySelect")).textContent).toEqual("Los Angeles");

  fireEvent.click(screen.getByTestId("cityInput"));

  expect((screen.getByText("United States")).selected).toBeTruthy();
  expect((screen.getByTestId("cityInput"))).toHaveValue("Los Angeles");
 });

 it("returns no jobs", async () => {
  const { getMock } = await setup({
   pending: [
    {
     job: {
      uuid: '0',
     },
     city: {
      name: 'Los Angeles'
     },
    },
    {
     job: {
      uuid: '1',
     },
     city: {
      name: 'Los Angeles'
     },
    },
   ]
  });
  jest.useFakeTimers();

  await act(async () => {
    await getMock('locations/0');
  });

  userEvent.selectOptions(screen.getByTestId("countrySelect"), "United States");
  await act(async () => {
   await jest.runAllTimers();
  });

  fireEvent.change(screen.getByTestId("cityInput"), {target: {value: "Los Angeles"}});
  fireEvent.click(screen.getByTestId("citySelect"));  

  await act(async () => {
    await getMock('jobs?city=0');
  });

  fireEvent.click(screen.getByTestId("submitBtn"));
  
  await act(async () => {
   await jest.runAllTimers();
  });

  await waitFor(() => {
   expect(screen.getByTestId("noJobs")).toBeInTheDocument();
  });

  expect(screen.getByTestId("noJobs").textContent).toEqual("Sorry, there are no jobs available in Los Angeles.");
 });

 it("returns jobs from the selected city", async () => {
  const { getMock } = await setup({
   pending: [
    {
     job: {
      uuid: '3',
     },
     city: {
      name: 'Los Angeles'
     },
    },
    {
     job: {
      uuid: '4',
     },
     city: {
      name: 'Los Angeles'
     },
    },
   ]
  });
  jest.useFakeTimers();

  await act(async () => {
    await getMock('locations/0');
  });

  userEvent.selectOptions(screen.getByTestId("countrySelect"), "United States");
  await act(async () => {
   await jest.runAllTimers();
  });

  fireEvent.change(screen.getByTestId("cityInput"), {target: {value: "Los Angeles"}});
  fireEvent.click(screen.getByTestId("citySelect"));  

  await act(async () => {
    await getMock('jobs?city=0');
  });

  fireEvent.click(screen.getByTestId("submitBtn"));
  
  await act(async () => {
   await jest.runAllTimers();
  });

  expect(screen.queryByTestId("noJobs")).not.toBeInTheDocument();
  expect(screen.getByTestId('jobResults').textContent).toEqual('Showing results for Los Angeles');

  expect(screen.getByTestId('jobName1').textContent).toEqual('Customer One');
  expect(screen.getByTestId('jobDescription0').textContent).toEqual('Example Description Zero');
  expect(screen.getByTestId('jobTrade1').textContent).toEqual('Skills Required: Welder');
  expect(screen.getByTestId('jobExpiration0').textContent).toEqual('Due Date: 2032-01-01');
 });
});