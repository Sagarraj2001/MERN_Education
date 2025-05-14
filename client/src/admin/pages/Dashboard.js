import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  axios.defaults.withCredentials = true;
  const navigate =useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalEnrollment: 0,
    totalTasks: 0,
    courseProgress: 0,
    completionRate: 0,
  });

  const [enrollmentData, setEnrollmentData] = useState([]); 
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

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const response = await axios.get('https://mern-education-vj03.onrender.com/api/dashboard');
      setDashboardData(response.data);

      // Example: Generate chart data dynamically
      setEnrollmentData([
        { name: 'Jan', enrollments: response.data.totalEnrollment - 50 },
        { name: 'Feb', enrollments: response.data.totalEnrollment - 40 },
        { name: 'Mar', enrollments: response.data.totalEnrollment - 30 },
        { name: 'Apr', enrollments: response.data.totalEnrollment - 20 },
        { name: 'May', enrollments: response.data.totalEnrollment - 10 },
        { name: 'Jun', enrollments: response.data.totalEnrollment },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto-refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: 'Total Enrollments',
      value: dashboardData.totalEnrollment.toLocaleString(),
      change: '+12%',
      icon: <GroupIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      color: '#1976d2',
    },
    {
      title: 'Total Tasks',
      value: dashboardData.totalTasks,
      change: '+5',
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
      color: '#2e7d32',
    },
    {
      title: 'Completion Rate',
      value: `${dashboardData.completionRate}%`,
      change: '+3%',
      icon: <AssessmentIcon sx={{ fontSize: 40, color: '#ed6c02' }} />,
      color: '#ed6c02',
    },
    {
      title: 'Course Progress',
      value: `${dashboardData.courseProgress}%`,
      change: '+4%',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Dashboard Overview
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton onClick={fetchData}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                p: 2,
              }}>
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{
                      p: 1.5, borderRadius: 2, backgroundColor: `${stat.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="body2" sx={{
                      color: stat.color, fontWeight: 600,
                      backgroundColor: `${stat.color}15`,
                      px: 1.5, py: 0.5, borderRadius: 1
                    }}>
                    {stat.change}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ mb: 1.5, fontWeight: 600 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', p: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Enrollment Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#1976d2"
                      strokeWidth={2}
                      dot={{ fill: '#1976d2', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', p: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Course Progress
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {['Web Development', 'Data Science', 'Mobile Apps', 'UI/UX Design'].map((course, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2">{course}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dashboardData.courseProgress + index * 5}%
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate"
                      value={dashboardData.courseProgress + index * 5}
                      sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': { borderRadius: 4, backgroundColor: '#1976d2' }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
