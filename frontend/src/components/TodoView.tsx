import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox, IconButton, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { backend } from '../../declarations/backend';

interface Todo {
  id: bigint;
  title: string;
  completed: boolean;
}

interface TodoViewProps {
  todos: Todo[];
  onUpdate: () => void;
}

const TodoView: React.FC<TodoViewProps> = ({ todos, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      await backend.createTodo(title, false);
      onUpdate();
      handleClose();
      setTitle('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleToggle = async (id: bigint, completed: boolean) => {
    try {
      await backend.updateTodo(id, todos.find(t => t.id === id)?.title || '', !completed);
      onUpdate();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await backend.deleteTodo(id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Todo
      </Button>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id.toString()}>
            <Checkbox
              edge="start"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id, todo.completed)}
            />
            <ListItemText primary={todo.title} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(todo.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Todo Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TodoView;
