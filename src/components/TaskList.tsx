import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchTasks, updateTaskInFirestore } from "../firebase/tasks.ts";
import { reorderTasks, updateTaskStatus } from "../redux/taskSlice.ts";
import TaskSection from "../components/TaskSection.tsx";
import "./TaskList.css";
import { DragDropContext } from "react-beautiful-dnd";

const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.task.tasks || []);
  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDropdown = (taskId: string) => {
    setDropdownStates((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleEdit = (taskId: string) => {
    console.log("Edit option clicked for task ID:", taskId);
  };

  const handleDelete = (taskId: string) => {
    console.log("Delete option clicked for task ID:", taskId);
  };

  const handleStatusChange = (task: any, newStatus: string) => {
    const updatedTask = { ...task, status: newStatus };

    // Update task in Firestore and Redux
    updateTaskInFirestore(updatedTask, dispatch)
      .then(() => {
        console.log(`Task status updated to ${newStatus}`);
      })
      .catch((error) => console.error("Error updating task status:", error));
  };

  useEffect(() => {
    fetchTasks(dispatch).catch((error) =>
      console.error("Failed to fetch tasks:", error)
    );
  }, [dispatch]);

  const groupedTasks = {
    todo: tasks.filter((task) => task.status === "ToDo"),
    inProgress: tasks.filter((task) => task.status === "In Progress"),
    completed: tasks.filter((task) => task.status === "Completed"),
  };

  const handleOnDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    )
      return;

    const sourceList = [...groupedTasks[source.droppableId]];
    const destinationList = [...groupedTasks[destination.droppableId]];

    const [movedTask] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedTask);

    const updatedTasks = [
      ...groupedTasks.todo,
      ...groupedTasks.inProgress,
      ...groupedTasks.completed,
    ];

    dispatch(reorderTasks(updatedTasks));

    if (source.droppableId !== destination.droppableId) {
      dispatch(
        updateTaskStatus({ ...movedTask, status: destination.droppableId })
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
        <TaskSection
          title="Todo"
          color="#fac3ff"
          tasks={groupedTasks.todo}
          droppableId="todo"
          dropdownStates={dropdownStates}
          onToggleDropdown={toggleDropdown}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange} // Passed here correctly
        />

        <TaskSection
          title="In Progress"
          color="#85d9f1"
          tasks={groupedTasks.inProgress}
          droppableId="inProgress"
          dropdownStates={dropdownStates}
          onToggleDropdown={toggleDropdown}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange} // Passed here correctly
        />
        <TaskSection
          title="Completed"
          color="#cdffcc"
          tasks={groupedTasks.completed}
          droppableId="completed"
          dropdownStates={dropdownStates}
          onToggleDropdown={toggleDropdown}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange} // Passed here correctly
        />
      </DragDropContext>
    </div>
  );
};

export default TaskList;
