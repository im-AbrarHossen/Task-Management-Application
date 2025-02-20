import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { fetchTasks, addTask, updateTask, deleteTask, connectWebSocket } from "../api";
import { auth, signInWithGoogle, logout } from "../../firebase/firebase.init";
import { onAuthStateChanged } from "firebase/auth";

function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
        fetchTasks(token).then(setTasks);
        connectWebSocket(setTasks);
      }
    });
  }, []);

  // Handle Drag-and-Drop Reordering
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);
  };

  // Add New Task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    const task = await addTask({ title: newTask }, token);
    setNewTask("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <button className="bg-red-500 text-white px-4 py-2 rounded mt-2" onClick={logout}>
            Logout
          </button>

          {/* Add Task */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              className="border px-4 py-2"
              placeholder="New task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddTask}>
              Add Task
            </button>
          </div>

          {/* Task List with Drag-and-Drop */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <ul ref={provided.innerRef} {...provided.droppableProps} className="mt-6 w-full max-w-md">
                  {tasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white shadow p-4 rounded flex justify-between items-center mb-2"
                        >
                          {task.title}
                          <button className="text-red-500" onClick={() => deleteTask(task._id, token)}>
                            ❌
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </>
      ) : (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      )}
    </div>
  );
}

export default TaskBoard;