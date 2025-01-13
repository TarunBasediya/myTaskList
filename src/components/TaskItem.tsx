import React from "react";

interface TaskItemProps {
  task: any;
  onToggleDropdown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  dropdownState: boolean;
  onStatusChange: (status: string) => void; // Add this
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleDropdown,
  onEdit,
  onDelete,
  dropdownState,
  onStatusChange,
}) => (
  <div className="task-item-row">
    <div>{task.title}</div>
    <div>{task.dueDate}</div>
    <div>
      {task.status}
      <button className="status-dropdown-button" onClick={onToggleDropdown}>
        +
      </button>
      {dropdownState && (
        <div className="status-dropdown-menu">
          {["ToDo", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              className="dropdown-item"
              onClick={() => onStatusChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
    <div>{task.category}</div>
    <div className="task-cell task-options">
      <button className="task-options-button" onClick={onToggleDropdown}>
        ⋮
      </button>
      {dropdownState && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={onEdit}>
            Edit
          </button>
          <button className="dropdown-item" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  </div>
);

export default TaskItem;
