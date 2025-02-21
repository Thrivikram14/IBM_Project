import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../slices/tasksSlice';

const TaskList = ({ tasks }) => {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all',
    sortBy: 'dueDate'
  });

  // Existing helper functions remain the same
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      return (filters.status === 'all' || task.status === filters.status) &&
             (filters.priority === 'all' || task.priority === filters.priority) &&
             (filters.category === 'all' || task.category === filters.category) &&
             (filters.assignedTo === 'all' || task.assignedTo === filters.assignedTo);
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority': {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  };

  const getUniqueValues = (field) => {
    return ['all', ...new Set(tasks.map(task => task[field]).filter(Boolean))];
  };

  const calculateProgress = (task) => {
    const statusWeights = {
      todo: 0,
      inProgress: 33,
      review: 66,
      completed: 100
    };
    return statusWeights[task.status] || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  // Existing CRUD operations remain the same
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      dispatch(deleteTask(id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdate = async (id, updatedTask) => {
    try {
      const response = await axios.patch(`http://localhost:3001/tasks/${id}`, updatedTask);
      dispatch(updateTask(response.data));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditForm(task);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddComment = async (taskId) => {
    const comment = commentsMap[taskId];
    if (!comment?.trim()) return;

    try {
      const response = await axios.post(`http://localhost:3001/tasks/${taskId}/comments`, {
        content: comment,
        createdAt: new Date(),
        author: 'Current User'
      });
      
      dispatch(updateTask(response.data));
      setCommentsMap(prev => ({...prev, [taskId]: ''}));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Styled Filter Section
  const FilterSection = () => (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Filters</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              {getUniqueValues('status').map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
            >
              {getUniqueValues('priority').map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              {getUniqueValues('category').map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // Styled Edit Form
  const EditForm = ({ task }) => (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleUpdate(task._id, editForm);
    }} className="p-3">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={editForm.title}
            onChange={handleEditChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            className="form-control"
            name="dueDate"
            value={editForm.dueDate ? editForm.dueDate.split('T')[0] : ''}
            onChange={handleEditChange}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            rows="3"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            name="priority"
            value={editForm.priority}
            onChange={handleEditChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={editForm.category}
            onChange={handleEditChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={editForm.status}
            onChange={handleEditChange}
          >
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Assigned To</label>
          <input
            type="text"
            className="form-control"
            name="assignedTo"
            value={editForm.assignedTo}
            onChange={handleEditChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Estimated Time (hours)</label>
          <input
            type="number"
            className="form-control"
            name="estimatedTime"
            value={editForm.estimatedTime}
            onChange={handleEditChange}
            min="0"
            step="0.5"
          />
        </div>

        <div className="col-12 text-end">
          <button type="button" className="btn btn-secondary me-2" onClick={() => setEditingId(null)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );

  // Styled Task Details
  const TaskDetails = ({ task }) => {
    const getPriorityBadgeClass = (priority) => {
      const classes = {
        low: 'bg-success',
        medium: 'bg-info',
        high: 'bg-warning text-dark',
        urgent: 'bg-danger'
      };
      return `badge ${classes[priority] || 'bg-secondary'}`;
    };

    const getStatusBadgeClass = (status) => {
      const classes = {
        todo: 'bg-secondary',
        inProgress: 'bg-primary',
        review: 'bg-info',
        completed: 'bg-success'
      };
      return `badge ${classes[status] || 'bg-secondary'}`;
    };

    return (
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">{task.title}</h5>
          <div>
            <span className={`${getPriorityBadgeClass(task.priority)} me-2`}>
              {task.priority}
            </span>
            <span className={getStatusBadgeClass(task.status)}>
              {task.status}
            </span>
          </div>
        </div>

        <p className="card-text">{task.description}</p>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <small className="text-muted">Due Date:</small>
            <div>{formatDate(task.dueDate)}</div>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Assigned To:</small>
            <div>{task.assignedTo || 'Unassigned'}</div>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Category:</small>
            <div>{task.category || 'Not set'}</div>
          </div>
          <div className="col-md-6">
            <small className="text-muted">Estimated Time:</small>
            <div>{task.estimatedTime ? `${task.estimatedTime} hours` : 'Not set'}</div>
          </div>
        </div>

        <div className="mb-3">
          <div className="progress" style={{ height: '20px' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${calculateProgress(task)}%` }}
              aria-valuenow={calculateProgress(task)}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {calculateProgress(task)}%
            </div>
          </div>
        </div>

        <div className="comments-section mb-3">
          <h6 className="mb-3">Comments</h6>
          {task.comments?.map(comment => (
            <div key={comment._id} className="card mb-2">
              <div className="card-body py-2">
                <p className="mb-1">{comment.content}</p>
                <small className="text-muted">
                  By {comment.author} on {formatDate(comment.createdAt)}
                </small>
              </div>
            </div>
          ))}
          <div className="mt-3">
            <textarea
              className="form-control mb-2"
              value={commentsMap[task._id] || ''}
              onChange={(e) => setCommentsMap({...commentsMap, [task._id]: e.target.value})}
              placeholder="Add a comment..."
              rows="2"
            />
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => handleAddComment(task._id)}
            >
              Add Comment
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={() => startEdit(task)}>
            Edit
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(task._id)}>
            Delete
          </button>
          <button 
            className={`btn btn-${task.status === 'completed' ? 'warning' : 'success'} btn-sm`}
            onClick={() => handleUpdate(task._id, { 
              status: task.status === 'completed' ? 'todo' : 'completed' 
            })}
          >
            {task.status === 'completed' ? 'Reopen' : 'Complete'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Task List</h2>
      </div>
      
      <FilterSection />
      
      <div className="row g-4">
        {getFilteredTasks().map(task => (
          <div key={task._id} className="col-12">
            <div className="card shadow-sm">
              {editingId === task._id ? (
                <EditForm task={task} />
              ) : (
                <TaskDetails task={task} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;