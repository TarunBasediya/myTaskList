import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { fetchTasks } from "../firebase/tasks.ts";
import "./TaskList.css";
import { reorderTasks, updateTaskStatus } from "../redux/taskSlice.ts";

const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.task.tasks || []);
  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDropdown = (taskId: string) => {
    setDropdownStates((prev) => ({
      [taskId]: !prev[taskId], // Toggle the dropdown for the specific task
    }));
  };

  const handleEdit = (taskId: string) => {
    console.log("Edit option clicked for task ID:", taskId);
    // Add your edit logic here
  };

  const handleDelete = (taskId: string) => {
    console.log("Delete option clicked for task ID:", taskId);
    // Add your delete logic here
  };

  // Fetch tasks from the backend
  useEffect(() => {
    fetchTasks(dispatch).catch((error) =>
      console.error("Failed to fetch tasks:", error)
    );
  }, [dispatch]);

  // Group tasks by their status
  const groupedTasks = {
    todo: tasks.filter((task) => task.status === "ToDo"),
    inProgress: tasks.filter((task) => task.status === "In Progress"),
    completed: tasks.filter((task) => task.status === "Completed"),
  };

  // Handle drag-and-drop functionality
  const handleOnDragEnd = (result: any) => {
    const { source, destination } = result;

    // If the task is dropped outside a droppable area, return early
    if (!destination) return;

    // If the task is dropped in the same position, return early
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    ) {
      return;
    }

    const sourceList = groupedTasks[source.droppableId];
    const destinationList = groupedTasks[destination.droppableId];

    // Remove the task from the source list
    const [movedTask] = sourceList.splice(source.index, 1);

    // Insert the task into the destination list at the new position
    destinationList.splice(destination.index, 0, movedTask);

    // Flatten the updated grouped tasks into a single array
    const updatedTasks = [
      ...groupedTasks.todo,
      ...groupedTasks.inProgress,
      ...groupedTasks.completed,
    ];

    // Dispatch the updated tasks to reorder them in Redux
    dispatch(reorderTasks(updatedTasks));

    // Optionally, update the task's status if it's being moved between different sections
    if (source.droppableId !== destination.droppableId) {
      dispatch(
        updateTaskStatus({
          ...movedTask,
          status: destination.droppableId,
        })
      );
    }
  };

  return (
    <div className="task-list-page">
      <div className="task-list-header-row">
        <div className="task-header">Task Name</div>
        <div className="task-header">Due On</div>
        <div className="task-header">Task Status</div>
        <div className="task-header">Task Category</div>
        <div className="task-header">Options</div>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        {/* Todo Section */}
        <div className="task-section">
          <h2 className="section-title" style={{ backgroundColor: "#fac3ff" }}>
            Todo ({groupedTasks.todo.length})
          </h2>
          <Droppable droppableId="todo">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="task-container"
              >
                {groupedTasks.todo.map((task, index) => (
                  <Draggable
                    key={task.id ?? `task-${index}`} // If task.id is undefined, use fallback
                    draggableId={task.id ?? `task-${index}`} // Fallback to task-${index} if task.id is undefined
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="task-item-row"
                      >
                        <div>{task.title}</div>
                        <div>{task.dueDate}</div>
                        <div>{task.status}</div>
                        <div>{task.category}</div>
                        <div className="task-cell task-options">
                          <button
                            className="task-options-button"
                            onClick={() => toggleDropdown(task.id || "")}
                          >
                            ⋮
                          </button>
                          {/* Dropdown Menu */}
                          {dropdownStates[task.id ?? ""] && (
                            <div className="dropdown-menu show">
                              <button
                                className="dropdown-item"
                                onClick={() => handleEdit(task.id ?? "")}
                              >
                                Edit
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => handleDelete(task.id ?? "")}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* In Progress Section */}
        <div className="task-section">
          <h2 className="section-title" style={{ backgroundColor: "#85d9f1" }}>
            In Progress ({groupedTasks.inProgress.length})
          </h2>
          <Droppable droppableId="inProgress">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="task-container"
              >
                {groupedTasks.inProgress.map((task, index) => (
                  <Draggable
                    key={task.id ?? `task-${index}`} // If task.id is undefined, use fallback
                    draggableId={task.id ?? `task-${index}`} // Ensure draggableId is always a string
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="task-item-row"
                      >
                        <div>{task.title}</div>
                        <div>{task.dueDate}</div>
                        <div>{task.status}</div>
                        <div>{task.category}</div>
                        <div className="task-cell task-options">
                          <button
                            className="task-options-button"
                            onClick={() => toggleDropdown(task.id || "")}
                          >
                            ⋮
                          </button>
                          {/* Dropdown Menu */}
                          {dropdownStates[task.id ?? ""] && (
                            <div className="dropdown-menu">
                              <button
                                className="dropdown-item"
                                onClick={() => handleEdit(task.id ?? "")}
                              >
                                Edit
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => handleDelete(task.id ?? "")}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Completed Section */}
        <div className="task-section">
          <h2 className="section-title" style={{ backgroundColor: "#cdffcc" }}>
            Completed ({groupedTasks.completed.length})
          </h2>
          <Droppable droppableId="completed">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="task-container"
              >
                {groupedTasks.completed.map((task, index) => (
                  <Draggable
                    key={task.id ?? `task-${index}`} // If task.id is undefined, use fallback
                    draggableId={task.id ?? `task-${index}`} // Ensure draggableId is always a string
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="task-item-row"
                      >
                        <div>{task.title}</div>
                        <div>{task.dueDate}</div>
                        <div>{task.status}</div>
                        <div>{task.category}</div>
                        <div className="task-cell task-options">
                          <button
                            className="task-options-button"
                            onClick={() => toggleDropdown(task.id || "")}
                          >
                            ⋮
                          </button>
                          {/* Dropdown Menu */}
                          {dropdownStates[task.id ?? ""] && (
                            <div className="dropdown-menu">
                              <button
                                className="dropdown-item"
                                onClick={() => handleEdit(task.id ?? "")}
                              >
                                Edit
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => handleDelete(task.id ?? "")}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
