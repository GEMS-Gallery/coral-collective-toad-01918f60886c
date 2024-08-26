import React, { useState } from 'react';
import { List, ListItem, ListItemText, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { backend } from '../../declarations/backend';

interface Category {
  id: bigint;
  name: string;
}

interface CategoriesViewProps {
  categories: Category[];
  onUpdate: () => void;
}

const CategoriesView: React.FC<CategoriesViewProps> = ({ categories, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      await backend.createCategory(name);
      onUpdate();
      handleClose();
      setName('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Category
      </Button>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id.toString()}>
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default CategoriesView;
