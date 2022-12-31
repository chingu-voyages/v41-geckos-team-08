import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import 'jest-canvas-mock';
import { BrowserRouter as Router } from "react-router-dom";
import * as ReactRouter from "react-router";
import * as ReactRedux from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from 'redux-thunk';
import { act } from "react-dom/test-utils";
import { JobFormPage } from '../Pages/JobFormPage';
import axios from 'axios';

jest.mock('axios');

jest.mock('../assets/images/drillBits.jpg');

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

describe("Job Form Page", () => {
 const setup = async (search = '') => {
  jest.spyOn(ReactRouter, 'useLocation').mockReturnValue({ search });
  jest.spyOn(ReactRouter, 'useNavigate').mockReturnThis();

  jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('{"token":"token"}');
  const getMock = async (url) => await axios.get.mockImplementation(() => {
   switch (url) {
    case 'locations':
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
    case "locations/1":
     return Promise.resolve({
      data: {
       data: [
        {
         uuid: '0',
         name: 'Vancouver'
        },
        {
         uuid: '1',
         name: 'Toronto'
        },
       ]
      }
     })
    case 'trades':
     return Promise.resolve({
      data: {
       data: [
        {
         uuid: '0',
         description: 'Electrician'
        },
        {
         uuid: '1',
         description: 'Welder'
        },
       ]
      }
     })    
    case 'jobs/1':
     return Promise.resolve({
      data: {
       data: {
        city: {
         country_uuid: '1',
         name: 'Vancouver',
         uuid: '0'
        },
        trade: {
         uuid: '1'
        },
        expiration_date: '2032-01-01T00:00:00',
        description: 'This is an example job description.',
        low_price: 3,
        high_price: 7
       }
      }
     })  
    default:
     return '';
   }
  });

  await getMock('locations');

  await act(async () => {
    await getMock('trades');
  });
  
  if (search === '?jobs/1') {
   setTimeout(async () => {
    await getMock('jobs/1');
   }, 1);
  }
  
  const mockStore = configureMockStore([thunk]);
  const store = mockStore({
   auth: {
    data: {
     uuid: 'exampleUUID'
    }
   }
  });
  
  const dispatch = jest.fn(() => Promise.resolve());
  const useDispatch = jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(dispatch);
  
  const { Provider } = ReactRedux;
  
  const { container } = render(
   <Provider store={store}>
    <Router>
     <JobFormPage />
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

 it('renders the job form page', async () => {
  const { container } = await setup();
  expect(container).toMatchSnapshot();
 });

 it('renders the create a job form', async () => {
  await setup();
  expect(screen.getByTestId('jobHeading').textContent).toEqual('New Job');
 });

 it('renders the update a job form', async () => {
  await setup('?jobs/1');
  expect(screen.getByTestId('jobHeading').textContent).toEqual('Update Job');
 });
});