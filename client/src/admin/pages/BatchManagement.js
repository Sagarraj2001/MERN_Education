import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Box, Button, Card, CardContent, Grid, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, InputAdornment, Chip, Stack, Avatar, Divider
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, CalendarToday as CalendarIcon,
  AccessTime as TimeIcon, Group as GroupIcon
} from '@mui/icons-material';

const API_URL = 'https://mern-education-vj03.onrender.com/api/batches';


const BatchManagement = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    courseName: '',
    startDate: '',
    endDate: '',
    timings: '',
    availableSeats: '',
    enrolledStudents: 0,
    instructor: { name: '', avatar: '' },
    status: 'upcoming'
  });



  useEffect(() => {
    axios
      .get("https://mern-education-vj03.onrender.com/api/verify", { withCredentials: true })
      .then(res => {
        if (!res.data.login) {
          navigate("/login");
        }
      })
      .catch(err => {
        console.error("Authentication error:", err);
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get(API_URL,{withCredentials: true});
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const handleOpen = (batch = null) => {
    setEditingBatch(batch);
    setFormData(batch || {
      courseName: '',
      startDate: '',
      endDate: '',
      timings: '',
      availableSeats: '',
      enrolledStudents: 0,
      instructor: { name: '', avatar: '' },
      status: 'upcoming'
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBatch(null);
  };

  const handleSubmit = async () => {
    try {
      const batchData = {
        courseName: formData.courseName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        timings: formData.timings,
        availableSeats: Number(formData.availableSeats),
        enrolledStudents: Number(formData.enrolledStudents),
        instructor: { name: formData.instructor.name, avatar: formData.instructor.avatar },
        status: formData.status
      };

      let updatedBatches;

      if (editingBatch) {
        const response = await axios.put(`${API_URL}/${editingBatch._id}`, batchData,{withCredentials: true});
        updatedBatches = batches.map(batch =>
          batch._id === editingBatch._id ? response.data : batch
        );
      } else {
        const response = await axios.post(API_URL, batchData,{withCredentials: true});
        updatedBatches = [...batches, response.data];
      }

      setBatches(updatedBatches);
      handleClose();
    } catch (error) {
      console.error("Error saving batch:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`,{withCredentials: true});
      setBatches(batches.filter(batch => batch._id !== id));
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  const filteredBatches = batches.filter((batch) =>
    batch.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Batch Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add New Batch
        </Button>
      </Box>

      <TextField fullWidth variant="outlined" placeholder="Search batches..." value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 3 }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
      />

      <Grid container spacing={3}>
        {filteredBatches.map((batch) => (
          <Grid item xs={12} md={6} key={batch._id}>
            <Card sx={{ width: "100%", minWidth: "350px", p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{batch.courseName}</Typography>
                  <Chip label={batch.status} color={batch.status === 'active' ? 'success' : 'info'} size="small" />
                </Box>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon color="action" />
                    <Typography variant="body2">
                      {dayjs(batch.startDate).format('DD-MM-YYYY')} - {dayjs(batch.endDate).format('DD-MM-YYYY')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon color="action" />
                    <Typography variant="body2">{batch.timings}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon color="action" />
                    <Typography variant="body2">{batch.enrolledStudents} / {batch.availableSeats} students</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={batch.instructor.avatar} />
                    <Box>
                      <Typography variant="subtitle2">{batch.instructor?.name || "Unknown Instructor"}</Typography>
                      <Typography variant="caption" color="text.secondary">Instructor</Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <IconButton onClick={() => handleOpen(batch)} color="primary"><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(batch._id)} color="error"><DeleteIcon /></IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBatch ? 'Edit Batch' : 'Add New Batch'}</DialogTitle>
        <DialogContent>
          <TextField label="Course Name" fullWidth value={formData.courseName}
            onChange={(e) => setFormData({ ...formData, courseName: e.target.value })} sx={{ mt: 2 }} />

          <TextField label="Start Date" type="date" fullWidth value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }} sx={{ mt: 2 }} />

          <TextField label="End Date" type="date" fullWidth value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }} sx={{ mt: 2 }} />

          <TextField label="Timings" fullWidth value={formData.timings}
            onChange={(e) => setFormData({ ...formData, timings: e.target.value })} sx={{ mt: 2 }} />

          <TextField label="Available Seats" fullWidth type="number" value={formData.availableSeats}
            onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })} sx={{ mt: 2 }} />

          <TextField label="Enrolled Students" fullWidth type="number" value={formData.enrolledStudents}
            onChange={(e) => setFormData({ ...formData, enrolledStudents: e.target.value })} sx={{ mt: 2 }} />

          <TextField label="Instructor Name" fullWidth value={formData.instructor.name}
            onChange={(e) => setFormData({ ...formData, instructor: { ...formData.instructor, name: e.target.value } })} sx={{ mt: 2 }} />

          <TextField label="Status" fullWidth select SelectProps={{ native: true }} value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })} sx={{ mt: 2 }}>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </TextField>
        </DialogContent>



        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BatchManagement;
