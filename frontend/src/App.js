import './App.css';
import Header from './Header';
import Login from './Login';
import SwipeButtons from './SwipeButtons';
import TinderCards from './TinderCards';

function App() {
  return (
    <div className="app">
      <Login/>
      {/* <Header/> */}
      <TinderCards/>
      <SwipeButtons/>
    </div>
  );
}

export default App;
