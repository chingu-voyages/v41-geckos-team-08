import React from 'react';
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import * as ReactRouter from 'react-router';
import * as ReactRedux from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from 'redux-thunk';
import axios from "axios";
import { act } from "react-dom/test-utils";
import { LoginPage } from '../Pages/LoginPage';

jest.mock('axios');

jest.mock('../assets/images/Drill.jpg');

jest.mock('react-redux', () => {
  return {
    __esModule: true,
    ...jest.requireActual('react-redux')
  };
});

describe("Login Page", () => {
 const setup = async () => {
  const mockStore = configureMockStore([thunk]);
  const store = mockStore({});

  const dispatch = jest.fn();
  const useDispatch = jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(dispatch);

  const { Provider } = ReactRedux;

  const { container } = render(
   <Provider store={store}>
    <Router>
     <LoginPage />
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

 it('renders the login page', async () => {
  const { container } = await setup();
  expect(container).toMatchSnapshot();
 });

 it('logs in the user', async () => {
  const { useDispatch } = await setup();

  fireEvent.change(screen.getByTestId("email"), {target: {value: "example@email.com"}});
  expect(screen.getByTestId('email')).toHaveValue('example@email.com');

  fireEvent.change(screen.getByTestId("password"), {target: {value: "Example@1"}});
  expect(screen.getByTestId('password')).toHaveValue('Example@1');

  fireEvent.click(screen.getByTestId("btn"));
  expect(useDispatch).toBeCalled();
 });
});