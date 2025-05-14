import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardContent, Grid, Typography, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  InputAdornment, Avatar
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon
} from '@mui/icons-material';

const UserManagement = () => {
  axios.defaults.withCredentials = true;
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    username: '', email: '', number: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://mern-education-vj03.onrender.com/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setFormData(user || { username: '', email: '', number: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await axios.put(`https://mern-education-vj03.onrender.com/api/users/${editingUser.email}`, formData);
      } else {
        await axios.post('https://mern-education-vj03.onrender.com/api/register', formData); // Change this route if needed
      }
      fetchUsers();
      handleClose();
    } catch (err) {
      console.error('Error submitting user:', err);
    }
  };

  const handleDelete = async (email) => {
    try {
      await axios.delete(`https://mern-education-vj03.onrender.com/api/users/${email}`);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const username = u.username || '';
    const email = u.email || '';
    return (
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Box className='mt-3'>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          Add User
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by username or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {filteredUsers.map((user) => (
          <Grid item xs={12} md={6} key={user._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar src={`https://i.pravatar.cc/150?u=${user.email}`} />
                  <Box>
                    <Typography variant="h6">{user.username}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Phone: {user.number}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                <IconButton onClick={() => handleOpen(user)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.email)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Username"
              fullWidth
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!editingUser}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            {editingUser ? 'Save Changes' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
