import logo from './logo.svg';
import './App.css';

import TaskList from './taskListFromAsana.js'; // Import your TaskList component

function App() {
  return (
    <div className="App">
      <TaskList /> {/* Render your TaskList component */}
    </div>
  );
}

export default App;
