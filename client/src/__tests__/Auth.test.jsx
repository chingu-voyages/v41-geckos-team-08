import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import * as ReactRedux from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from 'redux-thunk';
import { act } from "react-dom/test-utils";
import { LoginPage } from '../Pages/LoginPage';
import { UserInfoPage } from '../Pages/UserInfoPage';

jest.mock('axios');

jest.mock('../assets/images/Drill.jpg');

jest.mock('react-redux', () => {
  return {
    __esModule: true,
    ...jest.requireActual('react-redux')
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

afterEach(done => {
  cleanup();
  jest.resetAllMocks();
  done();
});

describe("Login Page", () => {
 const setup = async () => {
  const mockStore = configureMockStore([thunk]);
  const store = mockStore({});

  const dispatch = jest.fn(() => Promise.resolve());
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

  await waitFor(() => {
   expect(useDispatch).toBeCalled();
  });
 });
});

describe("Sign Up Page", () => {
 const setup = async () => {
  const mockStore = configureMockStore([thunk]);
  const store = mockStore({
   auth: {}
  });

  const dispatch = jest.fn(() => Promise.resolve());
  const useDispatch = jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(dispatch);

  const { Provider } = ReactRedux;

  const { container } = render(
   <Provider store={store}>
    <Router>
     <UserInfoPage />
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

 it('renders the sign up page', async () => {
  const { container } = await setup();
  expect(container).toMatchSnapshot();
 });

 it('shows the sign up form', async () => {
  await setup();

  expect(screen.getByTestId('header').innerHTML).toEqual('Register');
  expect(screen.getByTestId('header').innerHTML).not.toEqual('Update User');

  expect(screen.getByTestId('btn').innerHTML).toEqual('Sign Up');
  expect(screen.getByTestId('btn').innerHTML).not.toEqual('Update');
 });

 it('signs up the user as a customer', async () => {
  const { useDispatch } = await setup();

  fireEvent.change(screen.getByTestId("name"), {target: {value: "example"}});
  expect(screen.getByTestId('name')).toHaveValue('example');

  fireEvent.change(screen.getByTestId("phone"), {target: {value: "1234567890"}});
  expect(screen.getByTestId('phone')).toHaveValue('1234567890');

  fireEvent.change(screen.getByTestId("email"), {target: {value: "example@email.com"}});
  expect(screen.getByTestId('email')).toHaveValue('example@email.com');

  fireEvent.change(screen.getByTestId("password"), {target: {value: "Example@1"}});
  expect(screen.getByTestId('password')).toHaveValue('Example@1');

  expect(screen.getByTestId('supplier')).not.toBeChecked();
  expect(screen.getByTestId('customer')).toBeChecked();

  fireEvent.click(screen.getByTestId("btn"));

  await waitFor(() => {
   expect(useDispatch).toBeCalled();
  });
 });

 it('signs up the user as a supplier', async () => {
  const { useDispatch } = await setup();

  fireEvent.change(screen.getByTestId("name"), {target: {value: "example"}});
  fireEvent.change(screen.getByTestId("phone"), {target: {value: "1234567890"}});
  fireEvent.change(screen.getByTestId("email"), {target: {value: "example@email.com"}});
  fireEvent.change(screen.getByTestId("password"), {target: {value: "Example@1"}});

  fireEvent.click(screen.getByTestId('supplier'));
  expect(screen.getByTestId('supplier')).toBeChecked();
  expect(screen.getByTestId('customer')).not.toBeChecked();

  fireEvent.change(screen.getByTestId("trade"), {target: {value: "developer"}});
  expect(screen.getByTestId('trade')).toHaveValue('developer');

  fireEvent.click(screen.getByTestId("btn"));

  await waitFor(() => {
   expect(useDispatch).toBeCalled();
  });
 });
});