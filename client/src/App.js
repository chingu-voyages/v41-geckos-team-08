import './App.css';
// import LoginForm from './Components/LoginForm';
// import {NavBar} from './Components/NavBar'
import {Footer} from './Components/Footer.jsx'
import Logo from './Components/Logo';
import { ProfileCard } from './Components/ProfileCard';
import Pagination from './Components/Pagination';
import LoginPage from "./Pages/LoginPage";
import {JobCard} from './Components/JobCard'
import {LandingTop} from './Components/LandignTop'
import {LandingBottom} from './Components/LandingBottom'
// import {SignupForm} from './Components/SignupFom'
import {JobForm} from './Components/JobForm'

function App() {
  return (
    <div className="App">
      <JobForm/>
      {/* <SignupForm/> */}
      {/* <LandingBottom/> */}
      {/* <LoginPage /> */}
    {/* <Logo />
    <Footer/>
    <ProfileCard/>
    <Pagination /> */}
    {/* <Logo /> */}
    {/* <Footer/> */}
    {/* <JobCard/> */}
    {/* <LandingTop/> */}
      
     
    </div>
  );
}

export default App;
