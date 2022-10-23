import './App.css';
import Input from './Components/Input';
import LoginForm from './Components/LoginForm';
import {NavBar} from './Components/NavBar'
import {Footer} from './Components/Footer.jsx'

function App() {
  return (
    <div className="App">
      <NavBar login="Login" signup="Sign Up" />
      <Input />
    </div>
  );
}

export default App;
