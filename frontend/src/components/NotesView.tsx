import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { backend } from '../../declarations/backend';

interface Note {
  id: number;
  title: string;
  content: string;
  categoryId: number | null;
}

interface Category {
  id: number;
  name: string;
}

interface NotesViewProps {
  notes: Note[];
  categories: Category[];
  onUpdate: () => void;
}

const NotesView: React.FC<NotesViewProps> = ({ notes, categories, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingNoteId(null);
    setTitle('');
    setContent('');
    setCategoryId(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingNoteId) {
        const result = await backend.updateNote(
          editingNoteId,
          title,
          content,
          categoryId ? [categoryId] : []
        );
        if ('ok' in result) {
          onUpdate();
          handleClose();
        } else {
          console.error('Error updating note:', result.err);
        }
      } else {
        const result = await backend.createNote(
          title,
          content,
          categoryId ? [categoryId] : []
        );
        if ('ok' in result) {
          onUpdate();
          handleClose();
        } else {
          console.error('Error creating note:', result.err);
        }
      }
    } catch (error) {
      console.error('Error submitting note:', error);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategoryId(note.categoryId);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await backend.deleteNote(id);
      if (result) {
        onUpdate();
      } else {
        console.error('Error deleting note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const getCategoryName = (categoryId: number | null) => {
    if (categoryId === null) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Note
      </Button>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {notes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {note.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {note.content}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Category: {getCategoryName(note.categoryId)}
                </Typography>
                <IconButton aria-label="edit" onClick={() => handleEdit(note)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => handleDelete(note.id)}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingNoteId ? 'Edit Note' : 'Add New Note'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId !== null ? categoryId : ''}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
            >
              <MenuItem value="">Uncategorized</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editingNoteId ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotesView;
