import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskItemBoard from "./TaskItemBoard.tsx";

interface TaskSectionProps {
  title: string;
  color: string;
  tasks: any[];
  droppableId: string;
  dropdownStates: { [key: string]: boolean };
  onToggleDropdown: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (task: any, newStatus: string) => void; // Added this prop
}

const TaskSectionBoard: React.FC<TaskSectionProps> = ({
  title,
  color,
  tasks,
  droppableId,
  dropdownStates,
  onToggleDropdown,
  onEdit,
  onDelete,
  onStatusChange, // Included in the destructuring
}) => (
  <div className="task-section1">
    <h2 className="section-title1" style={{ backgroundColor: color }}>
      {title} ({tasks.length})
    </h2>
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="task-container1"
        >
          {tasks.map((task, index) => (
            <Draggable
              key={task.id ?? `task-${index}`}
              draggableId={task.id ?? `task-${index}`}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskItemBoard
                    task={task}
                    onToggleDropdown={() => onToggleDropdown(task.id)}
                    onEdit={() => onEdit(task.id)}
                    onDelete={() => onDelete(task.id)}
                    dropdownState={dropdownStates[task.id] || false}
                    onStatusChange={(newStatus) =>
                      onStatusChange(task, newStatus)
                    } // Correctly passed
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

export default TaskSectionBoard;
