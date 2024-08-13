/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Task Component
const Task = ({ task, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);
  const [isCompleted, setIsCompleted] = useState(task.completed || false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(task.id, newText, isCompleted);
    setIsEditing(false);
  };

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    onEdit(task.id, newText, !isCompleted);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
        textDecoration: isCompleted ? 'line-through' : 'none',
        color: isCompleted ? '#9e9e9e' : '#000',
      }}
    >
      {isEditing ? (
        <input
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            padding: '0.25rem',
            flexGrow: 1,
            marginRight: '0.5rem',
          }}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
      ) : (
        <span>{task.text}</span>
      )}

      <div>
        <button
          style={{
            backgroundColor: isCompleted ? '#facc15' : '#3b82f6',
            color: '#ffffff',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            marginRight: '0.5rem',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleComplete}
        >
          {isCompleted ? 'Undo' : 'Complete'}
        </button>
        {isEditing ? (
          <button
            style={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              marginRight: '0.5rem',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={handleSave}
          >
            Save
          </button>
        ) : (
          <button
            style={{
              backgroundColor: '#fbbf24',
              color: '#ffffff',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              marginRight: '0.5rem',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={handleEdit}
          >
            Edit
          </button>
        )}
        <button
          style={{
            backgroundColor: '#ef4444',
            color: '#ffffff',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer',
          }}
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
      completed: false,
    };

    setTasks([...tasks, newTaskItem]);
    setNewTask('');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (id, newText, completed) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, text: newText, completed } : task
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#e5e7eb',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
        }}
      >
        Task Manager
      </h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          style={{
            border: '2px solid #d1d5db',
            borderRadius: '0.25rem',
            padding: '0.5rem',
            marginRight: '0.5rem',
            flexGrow: 1,
          }}
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter a new task"
        />
        <button
          style={{
            backgroundColor: '#22c55e',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer',
          }}
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
              style={{
                backgroundColor: '#f3f4f6',
                padding: '1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '600px',
              }}
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
