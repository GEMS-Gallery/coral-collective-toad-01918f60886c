import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      await backend.createNote(title, content, categoryId);
      onUpdate();
      handleClose();
      setTitle('');
      setContent('');
      setCategoryId(null);
    } catch (error) {
      console.error('Error creating note:', error);
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
                <Typography variant="h6">{note.title}</Typography>
                <Typography variant="body2">{note.content}</Typography>
                <Typography variant="caption">
                  Category: {categories.find(c => c.id === note.categoryId)?.name || 'Uncategorized'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Note</DialogTitle>
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
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NotesView;
