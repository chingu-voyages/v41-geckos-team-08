import './App.css';
import Input from './Components/Input';
import LoginForm from './Components/LoginForm';
import {NavBar} from './Components/NavBar'

function App() {
  return (
    <div className="App">
      <NavBar login="Login" signup="Sign Up" />
      <LoginForm />
    </div>
  );
}

export default App;
