import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Fab } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Notes as NotesIcon, Category as CategoryIcon, CheckCircle as TodoIcon, Add as AddIcon, Menu as MenuIcon } from '@mui/icons-material';
import NotesView from './components/NotesView';
import CategoriesView from './components/CategoriesView';
import TodoView from './components/TodoView';
import { backend } from '../declarations/backend';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notesData, categoriesData, todosData] = await Promise.all([
        backend.getNotes(),
        backend.getCategories(),
        backend.getTodos()
      ]);
      setNotes(notesData);
      setCategories(categoriesData);
      setTodos(todosData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <NotesIcon />
          </ListItemIcon>
          <ListItemText primary="Notes" />
        </ListItem>
        <ListItem button component={Link} to="/categories">
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItem>
        <ListItem button component={Link} to="/todos">
          <ListItemIcon>
            <TodoIcon />
          </ListItemIcon>
          <ListItemText primary="Todos" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Notes & Tasks App
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Main open={open}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<NotesView notes={notes} categories={categories} onUpdate={fetchData} />} />
          <Route path="/categories" element={<CategoriesView categories={categories} onUpdate={fetchData} />} />
          <Route path="/todos" element={<TodoView todos={todos} onUpdate={fetchData} />} />
        </Routes>
      </Main>
      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default App;
