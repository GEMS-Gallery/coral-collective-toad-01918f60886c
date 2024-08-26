import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { backend } from '../../declarations/backend';

interface Note {
  id: bigint;
  title: string;
  content: string;
  categoryId: bigint | null;
}

interface Category {
  id: bigint;
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
  const [categoryId, setCategoryId] = useState<bigint | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<bigint | null>(null);

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
        const result = await backend.updateNote(Number(editingNoteId), title, content, categoryId ? Number(categoryId) : null);
        if ('ok' in result) {
          onUpdate();
          handleClose();
        } else {
          console.error('Error updating note:', result.err);
        }
      } else {
        const result = await backend.createNote(title, content, categoryId ? Number(categoryId) : null);
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

  const handleDelete = async (id: bigint) => {
    try {
      const result = await backend.deleteNote(Number(id));
      if (result) {
        onUpdate();
      } else {
        console.error('Error deleting note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Note
      </Button>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {notes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note.id.toString()}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {note.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {note.content}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Category: {categories.find(c => c.id === note.categoryId)?.name || 'Uncategorized'}
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
              value={categoryId ? categoryId.toString() : ''}
              onChange={(e) => setCategoryId(e.target.value ? BigInt(e.target.value) : null)}
            >
              <MenuItem value="">Uncategorized</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id.toString()} value={category.id.toString()}>
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
