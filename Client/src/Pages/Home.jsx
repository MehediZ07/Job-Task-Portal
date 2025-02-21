import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useContext, useState, useEffect } from "react";
import Hero from "../Components/Hero";
import { AuthContext } from "../Providers/AuthProvider";
import axios from "axios";
import { QueryClient, useQuery } from "@tanstack/react-query";

function Home() {
  const {
    data: fetchedTasks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:5000/task");
      return data;
    },
  });

  const { user } = useContext(AuthContext);

  // State to store categorized tasks
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  // Categorize tasks dynamically based on status
  useEffect(() => {
    if (fetchedTasks) {
      const categorizedTasks = {
        todo: fetchedTasks.filter((task) => task.status === "todo"),
        inProgress: fetchedTasks.filter((task) => task.status === "inProgress"),
        done: fetchedTasks.filter((task) => task.status === "done"),
      };
      setTasks(categorizedTasks);
    }
  }, [fetchedTasks]);

  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    technology: "",
    givenBy: "",
    deadline: "",
    status: "todo",
  });

  // Handle adding a new task
  const addTask = async (e) => {
    e.preventDefault();
    if (
      !newTask.name.trim() ||
      !newTask.description.trim() ||
      !newTask.technology.trim() ||
      !newTask.givenBy.trim() ||
      !newTask.deadline.trim()
    )
      return;

    // Generate a sequential ID
    const newId = fetchedTasks.length + 1;

    const taskData = { id: newId, ...newTask };

    try {
      await axios.post(`http://localhost:5000/task`, taskData);
      QueryClient.invalidateQueries("task");
      refetch();
      setNewTask({
        name: "",
        description: "",
        technology: "",
        givenBy: "",
        deadline: "",
        status: "todo",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Handle drag & drop
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;

    if (sourceColumn === destColumn) {
      const reorderedTasks = Array.from(tasks[sourceColumn]);
      const [movedItem] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedItem);

      setTasks((prev) => ({ ...prev, [sourceColumn]: reorderedTasks }));
    } else {
      const sourceTasks = Array.from(tasks[sourceColumn]);
      const destinationTasks = Array.from(tasks[destColumn]);

      const [movedItem] = sourceTasks.splice(source.index, 1);
      movedItem.status = destColumn; // Update status
      destinationTasks.splice(destination.index, 0, movedItem);

      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: sourceTasks,
        [destColumn]: destinationTasks,
      }));

      try {
        await axios.put(`http://localhost:5000/task/${movedItem.id}`, {
          status: destColumn,
        });
        QueryClient.invalidateQueries("task");
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  if (isLoading) return <h2>Loading...</h2>;

  return (
    <>
      <Hero />
      {user ? (
        <>
          {/* Add Task Form */}
          <div className="max-w-lg mx-auto mt-6 bg-violet-300 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4 text-center text-white">
              Add a New Task
            </h2>
            <form onSubmit={addTask} className="space-y-4">
              <input
                type="text"
                placeholder="Task Name"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
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

          {/* Drag & Drop Task Board */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-4 p-10 mx-auto w-full min-h-screen">
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
                          key={task.id.toString()}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-gray-700 p-4 mb-2 rounded shadow text-sm"
                            >
                              <strong className="text-white">
                                {task.name}
                              </strong>
                              <p className="text-gray-400">
                                {task.description}
                              </p>
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
        </>
      ) : null}
    </>
  );
}

export default Home;
