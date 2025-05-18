import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

import {
    Box, Button, // Removed unused Paper, Table components
    Typography, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, InputAdornment,
    Accordion, AccordionSummary, AccordionDetails, List,
    ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon,
    CircularProgress // Added for loading state
} from '@mui/material';
import {
    Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
    Search as SearchIcon, ExpandMore as ExpandMoreIcon,
    Description as DescriptionIcon, PictureAsPdf as PdfIcon,
    Preview as PreviewIcon, Upload as UploadIcon,
    Download as DownloadIcon, // Removed unused People icon
} from '@mui/icons-material';

const API_URL = "https://mern-education-vj03.onrender.com"; // Base API URL

const CourseManagement = () => {
    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [open, setOpen] = useState(false); // For Course Add/Edit Dialog
    const [editingCourse, setEditingCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ // For Course Add/Edit
        title: '', description: '', duration: '', image: '', imageFile: null,
    });
    const [chapterDialogOpen, setChapterDialogOpen] = useState(false); // For ADDING a new chapter
    const [selectedCourseForChapter, setSelectedCourseForChapter] = useState(null); // Track which course we add chapter to
    const [chapterFormData, setChapterFormData] = useState({ // For the "Add Chapter" Dialog (Simplified)
        title: '',
        pdfFile: null, // Stores the single PDF file
    });

    // REMOVED: State related to adding PDF to existing chapter (pdfDialogOpen, selectedChapter, pdfFormData)
    // REMOVED: State related to separate chapter fetching (chaptersByCourseId, loadingChapters)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        axios
            .get(`${API_URL}/api/verify`, { withCredentials: true })
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
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_URL}/api/showCourse`, { withCredentials: true });
            // Ensure chapters is always an array, even if backend omits it for courses with no chapters
            const sanitizedCourses = res.data.map(course => ({
                ...course,
                chapters: course.chapters || [],
            }));
            setCourses(sanitizedCourses);
        } catch (err) {
            console.error("Failed to fetch courses", err.response?.data || err.message);
            setError("Failed to load courses. Please try again.");
            setCourses([]); // Clear courses on error
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (course = null) => {
        if (course) {
            setEditingCourse(course);
            // `course.image` is now the full URL from backend
            setFormData({
                ...course, // Spread existing data (_id, title, description, duration, image URL)
                chapters: course.chapters || [], // Ensure chapters array exists
                imageFile: null // Reset file input on edit
            });
        } else {
            setEditingCourse(null);
            setFormData({ title: '', description: '', duration: '', image: '', imageFile: null, chapters: [] });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCourse(null);
        setFormData({ title: '', description: '', duration: '', image: '', imageFile: null, chapters: [] }); // Reset form
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, image: imageUrl, imageFile: file }));
            // TODO: Consider revoking previous blob URL if formData.image was a blob URL
        }
    };

    // Handles Course Add/Edit Submission
    const handleSubmit = async () => {
        const submissionData = new FormData();
        submissionData.append('title', formData.title);
        submissionData.append('description', formData.description);
        submissionData.append('duration', formData.duration);
        if (formData.imageFile) {
            submissionData.append('image', formData.imageFile); // Key 'image' matches backend multer field
        }

        setError(null);
        try {
            let updatedCourseData;
            if (editingCourse) {
                // PUT request to update endpoint
                const res = await axios.put(`${API_URL}/api/updateCourse/${editingCourse._id}`, submissionData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });

                updatedCourseData = res.data; // Backend returns the updated course object
                // Update the course in the state
                setCourses(courses.map(c => (c._id === editingCourse._id ? updatedCourseData : c)));
            } else {
                // POST request to add endpoint
                const res = await axios.post(`${API_URL}/api/addCourse`, submissionData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true       // Move this inside the same config object
                });

                updatedCourseData = res.data; // Backend returns the new course object
                // Add the new course to the state
                setCourses([...courses, updatedCourseData]);
            }
            handleClose();
        } catch (err) {
            console.error("Failed to save course", err.response?.data || err.message);
            setError(err.response?.data?.message || (editingCourse ? "Failed to update course." : "Failed to add course."));
        }
    };

    // Handles Course Deletion
    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course and ALL its chapters?')) {
            setError(null);
            try {
                await axios.delete(`${API_URL}/api/deleteCourse/${courseId}`, { withCredentials: true });
                setCourses(courses.filter((course) => course._id !== courseId));
            } catch (err) {
                console.error("Failed to delete course", err.response?.data || err.message);
                setError(err.response?.data?.message || "Failed to delete course.");
            }
        }
    };

    // --- Chapter Dialog Logic (Simplified for Adding ONE chapter with ONE PDF) ---

    const handleOpenAddChapterDialog = (course) => {
        setSelectedCourseForChapter(course);
        setChapterFormData({ title: '', pdfFile: null }); // Reset form
        setChapterDialogOpen(true);
    };

    const handleCloseChapterDialog = () => {
        setChapterDialogOpen(false);
        setSelectedCourseForChapter(null);
        setChapterFormData({ title: '', pdfFile: null }); // Clear form data
    };

    const handleChapterPdfChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setChapterFormData(prev => ({ ...prev, pdfFile: file }));
        }
    };

    // Handles Submission of New Chapter
    const handleChapterSubmit = async () => {
        if (!selectedCourseForChapter || !chapterFormData.title || !chapterFormData.pdfFile) {
            setError("Chapter title and PDF file are required.");
            return;
        }

        const chapterSubmissionData = new FormData();
        chapterSubmissionData.append("courseId", selectedCourseForChapter._id);
        chapterSubmissionData.append("chapterTitle", chapterFormData.title);
        chapterSubmissionData.append("pdf", chapterFormData.pdfFile); // Key 'pdf' matches backend multer field

        setError(null);
        try {
            // POST to the addChapter endpoint
            const res = await axios.post(
                `${API_URL}/api/addChapter`, // Use the correct endpoint
                chapterSubmissionData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            // Backend returns the *entire updated course object* after adding chapter
            const updatedCourseData = res.data;

            // Update the courses state by replacing the old course with the new one
            setCourses(prevCourses =>
                prevCourses.map(course =>
                    course._id === selectedCourseForChapter._id ? updatedCourseData : course
                )
            );

            handleCloseChapterDialog();
        } catch (err) {
            console.error("Failed to add chapter", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to add chapter.");
        }
    };

    // --- Helper Function ---
    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Format date from backend (assuming ISO string or Date object)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return 'Invalid Date';
        }
    };

    // --- Filtering ---
    const filteredCourses = courses.filter((course) =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Render Logic ---
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
    }

    // Display error message if fetch failed initially
    if (error && courses.length === 0) {
        return <Typography color="error" sx={{ p: 3, textAlign: 'center' }}>{error}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Display non-critical errors */}
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Course Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                    Add Course
                </Button>
            </Box>

            <TextField
                fullWidth variant="outlined" placeholder="Search courses by title..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 3 }}
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            />

            {/* Course List */}
            {filteredCourses.length === 0 && !loading && (
                <Typography sx={{ textAlign: 'center', mt: 4 }}>No courses found matching your search.</Typography>
            )}

            {filteredCourses.map((course) => (
                // Use course._id from MongoDB as the key
                <Accordion key={course._id} sx={{ mb: 2, '&.Mui-expanded': { mb: 2 } /* Ensure margin doesn't collapse */ }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        {/* Accordion Summary Layout */}
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2 }}>
                            <Box sx={{ width: 80, height: 80, borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5", flexShrink: 0 }}>
                                <img
                                    src={course.image || '/placeholder-image.png'} // Use URL from backend
                                    alt={course.title || 'Course'}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.png'; }}
                                />
                            </Box>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}> {/* Added minWidth to prevent text overflow issues */}
                                <Typography variant="h6" fontWeight="bold" noWrap>{course.title || 'Untitled Course'}</Typography>
                                <Typography variant="body2" color="text.secondary" noWrap sx={{ display: { xs: 'none', sm: 'block' } }}> {/* Hide description on small screens */}
                                    {course.description || 'No description'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Duration: {course.duration || 'N/A'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpen(course); }} aria-label="Edit course">
                                    <EditIcon />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(course._id); }} aria-label="Delete course">
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </AccordionSummary>

                    {/* Accordion Details - Chapters are now embedded */}
                    <AccordionDetails sx={{ backgroundColor: '#fafafa', pt: 1, pb: 2 }}>
                        {/* Show full description here */}
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, display: { xs: 'block', sm: 'none' } }}>
                            {course.description || 'No description'}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="medium">Chapters</Typography>
                            <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => handleOpenAddChapterDialog(course)}>
                                Add Chapter
                            </Button>
                        </Box>

                        {/* Chapters List - Use embedded course.chapters */}
                        {course.chapters && course.chapters.length > 0 ? (
                            <List dense sx={{ p: 0 }}>
                                {course.chapters.map((chapter) => (
                                    // Chapter Item - Displaying the single PDF info
                                    <ListItem key={chapter._id} sx={{ borderBottom: '1px solid #eee', pl: 1, pr: 1, '&:last-child': { borderBottom: 'none' } }}>
                                        <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                                            {/* Use URL from chapter object */}
                                            {chapter.url ? <PdfIcon color="error" /> : <DescriptionIcon color="disabled" />}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={chapter.title || 'Untitled Chapter'}
                                            secondary={`Uploaded: ${formatDate(chapter.uploadDate)}`} // Use formatted date
                                        />
                                        {/* Actions only if PDF URL exists */}
                                        {chapter.url && (
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" onClick={() => window.open(chapter.url, '_blank')} sx={{ mr: 0.5 }} aria-label="Preview PDF">
                                                    <PreviewIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton edge="end" onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = chapter.url;
                                                    // Extract filename from URL or use title
                                                    const filename = chapter.pdf || chapter.title || 'download.pdf';
                                                    link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                    aria-label="Download PDF">
                                                    <DownloadIcon fontSize="small" />
                                                </IconButton>
                                                {/* Optional: Add Delete Chapter button here (requires backend endpoint) */}
                                                {/* <IconButton edge="end" color="error" aria-label="Delete Chapter"> <DeleteIcon fontSize="small"/> </IconButton> */}
                                            </ListItemSecondaryAction>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ pl: 2, pt: 1 }}>
                                No chapters added to this course yet.
                            </Typography>
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}

            {/* Course Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                <DialogContent>
                    {/* Form Fields remain the same */}
                    <TextField autoFocus margin="dense" label="Course Title" fullWidth variant="outlined" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    <TextField margin="dense" label="Description" fullWidth multiline rows={3} variant="outlined" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    <TextField margin="dense" label="Duration (e.g., 3 months)" fullWidth variant="outlined" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
                    {/* Image Upload Section */}
                    <Box sx={{ mt: 2, mb: 1, border: '1px dashed grey', padding: 2, borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Course Image</Typography>
                        <Button variant="outlined" component="label" startIcon={<UploadIcon />} fullWidth>
                            {/* Display filename if newly selected, else generic text */}
                            {formData.imageFile ? `Change Image (${formData.imageFile.name})` : (editingCourse && formData.image ? 'Change Image' : 'Upload Image')}
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>
                        {/* Image Preview - handles both local blob URL and backend URL */}
                        {formData.image && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img src={formData.image} alt="Course Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px', border: '1px solid #eee' }} />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={!formData.title}>
                        {editingCourse ? 'Update Course' : 'Add Course'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Chapter Dialog (Simplified) */}
            <Dialog open={chapterDialogOpen} onClose={handleCloseChapterDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Add New Chapter</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Chapter Title" fullWidth variant="outlined" value={chapterFormData.title} onChange={(e) => setChapterFormData({ ...chapterFormData, title: e.target.value })} required />
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Chapter PDF</Typography>
                        {/* Input for single PDF file */}
                        <Button variant="outlined" component="label" startIcon={<UploadIcon />} sx={{ mb: chapterFormData.pdfFile ? 1 : 2 }} fullWidth>
                            {chapterFormData.pdfFile ? `Change PDF (${chapterFormData.pdfFile.name})` : 'Select PDF File'}
                            <input type="file" hidden accept=".pdf" onChange={handleChapterPdfChange} />
                        </Button>
                        {/* Preview for the selected PDF file */}
                        {chapterFormData.pdfFile && (
                            <Box sx={{ p: 1.5, border: '1px dashed #ccc', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PdfIcon color="error" />
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}> {/* Added minWidth */}
                                    <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>{chapterFormData.pdfFile.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{formatFileSize(chapterFormData.pdfFile.size)}</Typography>
                                </Box>
                                <IconButton size="small" onClick={() => window.open(URL.createObjectURL(chapterFormData.pdfFile), '_blank')} aria-label="Preview selected PDF">
                                    <PreviewIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={handleCloseChapterDialog} color="secondary">Cancel</Button>
                    {/* Submit button calls the updated handleChapterSubmit */}
                    <Button onClick={handleChapterSubmit} variant="contained" disabled={!chapterFormData.title || !chapterFormData.pdfFile}>
                        Add Chapter
                    </Button>
                </DialogActions>
            </Dialog>

            {/* PDF Dialog for adding to existing chapter is REMOVED */}

        </Box>
    );
};

export default CourseManagement;