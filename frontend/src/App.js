import './App.css';
import Login from './Login';
import Home from './Home';
import { Switch, Route } from 'react-router-dom'

function App() {
  return (
    <div className="">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </div>
  );
}

export default App;
