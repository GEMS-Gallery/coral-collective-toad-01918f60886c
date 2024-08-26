import React, { useState } from 'react';
import { List, ListItem, ListItemText, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
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
  const [editingCategoryId, setEditingCategoryId] = useState<bigint | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingCategoryId(null);
    setName('');
  };

  const handleSubmit = async () => {
    try {
      if (editingCategoryId) {
        await backend.updateCategory(Number(editingCategoryId), name);
      } else {
        await backend.createCategory(name);
      }
      onUpdate();
      handleClose();
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setName(category.name);
    setOpen(true);
  };

  const handleDelete = async (id: bigint) => {
    try {
      const result = await backend.deleteCategory(Number(id));
      if (result) {
        onUpdate();
      } else {
        console.error('Error deleting category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
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
            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(category)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(category.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingCategoryId ? 'Edit Category' : 'Add New Category'}</DialogTitle>
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
          <Button onClick={handleSubmit}>{editingCategoryId ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CategoriesView;
