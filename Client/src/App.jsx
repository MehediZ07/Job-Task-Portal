import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

const initialTasks = {
  todo: [
    { id: "1", content: "Task 1" },
    { id: "2", content: "Task 2" },
  ],
  inProgress: [{ id: "3", content: "Task 3" }],
  done: [{ id: "4", content: "Task 4" }],
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);

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
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-2 mb-2 rounded shadow"
                      >
                        {task.content}
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
  );
}

export default App;
