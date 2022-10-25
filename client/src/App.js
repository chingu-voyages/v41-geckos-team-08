import './App.css';
// import LoginForm from './Components/LoginForm';
// import {NavBar} from './Components/NavBar'
import {Footer} from './Components/Footer.jsx'
import Logo from './Components/Logo';
import { ProfileCard } from './Components/ProfileCard';
import Pagination from './Components/Pagination';

function App() {
  return (
    <div className="App">
    {/* <Logo /> */}
    <Footer/>
    <ProfileCard/>
    <Pagination />
    {/* <Logo /> */}
    {/* <Footer/> */}
      
     
    </div>
  );
}

export default App;
