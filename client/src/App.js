import './App.css';
import Input from './Components/Input';
import {NavBar} from './Components/NavBar'

function App() {
  return (
    <div className="App">
      <NavBar login="Login" signup="Sign Up" />
      <Input />
    </div>
  );
}

export default App;
