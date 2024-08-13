/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Task Component
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

// TaskList Component
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() === '') return;

    const newTaskItem = {
      id: Date.now().toString(),
      text: newTask,
    };

    setTasks([...tasks, newTaskItem]);
    setNewTask('');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (id, newText) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    setTasks(reorderedTasks);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      <div className="mb-4">
        <input
          className="border-2 border-gray-300 rounded-md p-2 mr-2 flex-grow"
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="bg-gray-100 p-4 rounded-lg shadow-inner"
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Task
                        task={task}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
