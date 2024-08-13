/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const Task = ({ task, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(task.id, newText);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-2">
      {isEditing ? (
        <input
          className="border-2 border-gray-300 rounded-md p-1 flex-grow mr-2"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
      ) : (
        <span>{task.text}</span>
      )}

      <div>
        {isEditing ? (
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
            onClick={handleSave}
          >
            Save
          </button>
        ) : (
          <button
            className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2"
            onClick={handleEdit}
          >
            Edit
          </button>
        )}
        <button
          className="bg-red-500 text-white px-2 py-1 rounded-md"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Task;
