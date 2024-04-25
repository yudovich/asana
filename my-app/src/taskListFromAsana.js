import React, { useState, useEffect } from 'react';
const Asana = require('asana');
const date = new Date();

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '<ACCESS_TOKEN>';

let tasksApiInstance = new Asana.TasksApi();
let opts = { 
    'limit': 5, 
    'project': "<PROJECT_GID>", 
    'completed_since': date,
    'opt_fields': "name,due_on"
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [nextOffset, setNextOffset] = useState(null);
  const [initialFetch, setInitialFetch] = useState(true);

  const fetchTasks = (offset) => {
    const options = initialFetch ? opts : { ...opts, offset };
    tasksApiInstance.getTasks(options)
      .then((result) => {
        if (result._response && result._response.next_page) {
          setNextOffset(result._response.next_page.offset);
        }
        const filteredTasks = result.data.filter(task => new Date(task.due_on) < date);
        if (initialFetch) {
          setTasks(filteredTasks);
          setInitialFetch(false);
        } else {
          setTasks(prevTasks => [...prevTasks, ...filteredTasks]);
        }
      })
      .catch((error) => {
        console.error(error.response ? error.response.body : error);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleShowMore = () => {
    fetchTasks(nextOffset);
  };

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.gid}>
            {task.name} - Due on: {task.due_on}
          </li>
        ))}
      </ul>
      {nextOffset && <button onClick={handleShowMore}>Show More</button>}
    </div>
  );
};

export default TaskList;