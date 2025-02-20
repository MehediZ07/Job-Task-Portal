import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

function App() {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    technology: "",
    givenBy: "",
    deadline: "",
  });

  const addTask = (e) => {
    e.preventDefault();
    if (
      !newTask.name.trim() ||
      !newTask.description.trim() ||
      !newTask.technology.trim() ||
      !newTask.givenBy.trim() ||
      !newTask.deadline.trim()
    )
      return;

    const task = {
      id: Date.now().toString(),
      ...newTask,
    };

    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, task], // Always add to "To-Do"
    }));

    setNewTask({
      name: "",
      description: "",
      technology: "",
      givenBy: "",
      deadline: "",
    }); // Reset form
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reordering in the same column
      const items = Array.from(tasks[source.droppableId]);
      const [movedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, movedItem);

      setTasks((prev) => ({ ...prev, [source.droppableId]: items }));
    } else {
      // Moving to another column
      const sourceItems = Array.from(tasks[source.droppableId]);
      const destinationItems = Array.from(tasks[destination.droppableId]);

      const [movedItem] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, movedItem);

      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destinationItems,
      }));
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4 text-white">Add a New Task</h2>
        <form onSubmit={addTask} className="space-y-4">
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
          <input
            type="text"
            placeholder="Technology Stack (e.g., React, Node.js)"
            value={newTask.technology}
            onChange={(e) =>
              setNewTask({ ...newTask, technology: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
          <input
            type="text"
            placeholder="Task Given By (e.g., Manager, Client)"
            value={newTask.givenBy}
            onChange={(e) =>
              setNewTask({ ...newTask, givenBy: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
          <input
            type="date"
            value={newTask.deadline}
            onChange={(e) =>
              setNewTask({ ...newTask, deadline: e.target.value })
            }
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </form>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 p-10 bg-gray-900 min-h-screen">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 w-80 rounded-lg shadow-md"
                >
                  <h2 className="text-lg font-bold mb-2 capitalize">
                    {columnId}
                  </h2>
                  {columnTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-700 p-4 mb-2 rounded shadow text-sm"
                        >
                          <strong className="text-white">{task.name}</strong>
                          <p className="text-gray-400">{task.description}</p>
                          <span className="text-xs text-blue-300">
                            {task.technology}
                          </span>
                          <p className="text-xs text-yellow-400">
                            Given by: {task.givenBy}
                          </p>
                          <p className="text-xs text-red-400">
                            Deadline: {task.deadline}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <Footer />
    </>
  );
}

export default App;
