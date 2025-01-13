import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchTasks } from "../firebase/tasks.ts";
import { DragDropContext } from "react-beautiful-dnd";
import "./TaskBoardView.css";
import TaskSectionBoard from "./TaskSectionBoard.tsx";
import { reorderTasks, updateTaskStatus } from "../redux/taskSlice.ts";

const TaskListBoard: React.FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.task.tasks || []);
  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDropdown = (taskId: string) => {
    setDropdownStates((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
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
    <div className="task-board-container1">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <TaskSectionBoard
          title="Todo"
          color="#fac3ff"
          tasks={groupedTasks.todo}
          droppableId="todo"
          dropdownStates={dropdownStates}
          onToggleDropdown={toggleDropdown}
          onEdit={() => {}}
          onDelete={() => {}}
          onStatusChange={() => {}}
        />
        <TaskSectionBoard
          title="In Progress"
          color="#85d9f1"
          tasks={groupedTasks.inProgress}
          droppableId="inProgress"
          dropdownStates={dropdownStates}
          onToggleDropdown={toggleDropdown}
          onEdit={() => {}}
          onDelete={() => {}}
          onStatusChange={() => {}}
        />
        <TaskSectionBoard
          title="Completed"
          color="#cdffcc"
          tasks={groupedTasks.completed}
          droppableId="completed"
          dropdownStates={dropdownStates}
          onToggleDropdown={toggleDropdown}
          onEdit={() => {}}
          onDelete={() => {}}
          onStatusChange={() => {}}
        />
      </DragDropContext>
    </div>
  );
};

export default TaskListBoard;
