import React, { useEffect } from 'react';
import { Box, CssBaseline, Container } from '@mui/material';
import axios from "axios"
import Header from "../components/Header"
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const navigate=useNavigate();
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
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Header/>
      <Sidebar />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: '30px' },
          mr: { sm: '30px' },
          mt: '64px',
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4 }} className="container-fluid p-4 bg-light min-vh-100">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
