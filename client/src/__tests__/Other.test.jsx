import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import * as ReactRedux from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from 'redux-thunk';
import { act } from "react-dom/test-utils";
import { LandingPage } from '../Pages/LandingPage';
import PageNotFound from '../Pages/PageNotFound';

// This file is for testing the rendering of the landing and error pages