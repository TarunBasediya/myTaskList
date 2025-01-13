import React from "react";
// import "./TaskItemBoard.css";

interface TaskItemProps {
  task: any;
  onToggleDropdown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  dropdownState: boolean;
  onStatusChange: (status: string) => void;
}

const TaskItemBoard: React.FC<TaskItemProps> = ({
  task,
  onToggleDropdown,
  onEdit,
  onDelete,
  dropdownState,
  onStatusChange,
}) => (
  <div className="task-item-row1">
    {/* Title */}
    <div className="task-title1">
      <span
        className={task.status === "Completed" ? "completed-task-title" : ""}
      >
        {task.title}
      </span>
      <button className="task-options-button" onClick={onToggleDropdown}>
        ⋮
      </button>
      {dropdownState && (
        <div className="dropdown-menu1">
          <button className="dropdown-item1" onClick={onEdit}>
            Edit
          </button>
          <button className="dropdown-item1" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}
    </div>

    {/* Category and Due Date */}
    <div className="task-footer1">
      <span className="task-category1">{task.category}</span>
      <span className="task-due-date1">{task.dueDate}</span>
    </div>

    {/* Status Dropdown */}
    <div className="task-status1">
      {task.status}
      <button className="status-dropdown-button1" onClick={onToggleDropdown}>
        ⬇
      </button>
      {dropdownState && (
        <div className="status-dropdown-menu1">
          {["ToDo", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              className="dropdown-item1"
              onClick={() => onStatusChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default TaskItemBoard;
