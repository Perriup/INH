import React, { ReactNode, useState, useEffect } from 'react';
import {
    AppBar,
    Avatar,
    Button,
    Container,
    List,
    ListItem,
    ListItemText,
    TextField,
    Box,
    Paper,
    Dialog,
    Typography,
    Drawer,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import IconSvg from "../public/icon.svg";

interface WireframeProps {
    children?: ReactNode;
    userPicture?: string;
    categories: { id: number; name: string }[];
    selectedCategory: number | null;
    onCategorySelect: (categoryId: number) => void;
    onNewPost?: (postData: { title: string; content: string; categoryId: number }) => Promise<{ success: boolean; message: string }>;
    responseMessage?: string;
    clearResponse?: () => void;
    selectedPost: { id: number; title: string; content: string; comments: any[] } | null;
    onPostClick: (postId: number) => void;
    closeModal: () => void;
    addComment: (postId: number, comment: string) => Promise<void>;
    decodedInfo: { unique_name: string; role: string } | null;
}

const Wireframe: React.FC<WireframeProps> = ({
    children,
    userPicture,
    categories,
    selectedCategory,
    onCategorySelect,
    onNewPost,
    selectedPost,
    onPostClick,
    closeModal,
    addComment,
    decodedInfo,
}) => {
    const [showNewPost, setShowNewPost] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', categoryId: 0 });
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [view, setView] = useState<'main' | 'profile' | 'users'>('main');
    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [localCategories, setLocalCategories] = useState(categories);
    const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);

    const handleCategoryClick = (id: number) => {
        onCategorySelect(id);
        console.log('Id:', id);
        console.log('categories', localCategories)
    };

    const handleOpenNewPost = () => {
        setResponseMessage(null);
        setShowNewPost(true);
    };

    const handleCloseNewPost = () => {
        setShowNewPost(false);
        setNewPost({ title: '', content: '', categoryId: -1 });
        setResponseMessage(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (onNewPost) {
            const result = await onNewPost({
                title: newPost.title,
                content: newPost.content,
                categoryId: selectedCategory || 0,
            });
            setResponseMessage(result.message);

            if (result.success) {
                handleCloseNewPost();
            }
        }
    };

    const handleAddComment = async () => {
        if (selectedPost && newComment.trim()) {
            await addComment(selectedPost.id, newComment.trim());
            setNewComment('');
        }
    };

    const theme = createTheme({
        typography: {
          fontFamily: 'Oswald, sans-serif',
          h1: {
            fontFamily: 'Playwrite DE VA Guides, serif', // Specific font for headings
          },
        },
      });

      const handleLogout = () => {
        // Clear the token and user picture from localStorage
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userPicture');
    
        // Redirect to login page
        window.location.href = '/login';
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
    
        try {
            const response = await fetch(`https://localhost:7187/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
                body: JSON.stringify({ name: newCategoryName }),
            });
    
            if (response.ok) {
                await fetchCategories(); // Fetch the updated category list
                setNewCategoryName(''); // Reset input
                setShowNewCategoryModal(false); // Close modal
            } else {
                console.error('Failed to create category:', await response.text());
            }
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };
    

    //used only when a new category is made
    const fetchCategories = async () => {
        try {
            const response = await fetch(`https://localhost:7187/category`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                const mappedCategories = data.map((category: any) => ({
                    id: category.categoryId || category.id,
                    name: category.name,
                }));
                setLocalCategories(mappedCategories);
            } else {
                console.error('Failed to fetch categories:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };    

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            const response = await fetch(`https://localhost:7187/Category/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                // Update localCategories after deletion
                setLocalCategories((prevCategories) =>
                    prevCategories.filter((category) => category.id !== categoryId)
                );
                console.log(`Category with ID ${categoryId} deleted successfully.`);
            } else {
                console.error('Failed to delete category:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };    

    const handleDeleteComment = async (postId: number, commentId: number) => {
        console.log('Post ID:', postId);
        console.log('Comment ID:', commentId);

        try {
            const response = await fetch(`https://localhost:7187/category/${selectedCategory}/post/${postId}/comment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                console.log(`Comment with ID ${commentId} deleted successfully.`);
                onPostClick(postId);
            } else {
                console.error('Failed to delete comment:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };    

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://localhost:7187/User', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });
    
            if (response.ok) {
                const data = await response.json();
                const mappedUsers = data.map((user: any) => ({
                    id: user.sub || user.id, // Ensure id is mapped to a string
                    name: user.name,
                    email: user.email,
                }));
                setUsers(mappedUsers);
            } else {
                console.error('Failed to fetch users:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    
    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return; // User canceled the deletion
        }
    
        try {
            const response = await fetch(`https://localhost:7187/User/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Use string comparison
                alert(`User with ID ${userId} has been deleted.`);
            } else {
                const errorText = await response.text();
                console.error('Failed to delete user:', errorText);
                alert(`Failed to delete user: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting the user.');
        }
    };    

    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);
    

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <AppBar
                    position="sticky"
                    sx={{
                        backgroundColor: '#5A72A0',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                <Container
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 1,
                        flexDirection: 'row',
                    }}
                >
                    {/* Hamburger Menu (Small Screens) */}
                    <IconButton
                        onClick={() => setDrawerOpen(true)}
                        sx={{
                            display: { xs: 'block', md: 'none' }, // Visible only on small screens
                            marginRight: 2, // Adds spacing
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Buttons (Always Visible) */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            flexGrow: 1, // Ensures the avatar is pushed to the far right
                            marginLeft: { xs: 2, md: 0 }, // Adds spacing for better alignment on small screens
                        }}
                    >
                        {['Dashboard', 'Profile', 'Make Post'].map((link) => (
                            <Button
                                key={link}
                                sx={{
                                    color: 'text.primary',
                                }}
                                onClick={() => {
                                    if (link === 'Make Post') {
                                      handleOpenNewPost();
                                    } else if (link === 'Profile') {
                                      setView('profile'); // Switch to Profile view
                                    } else if (link === 'Dashboard') {
                                      setView('main'); // Switch to Main content view
                                    }
                                  }
                                }
                            >
                                {link}
                            </Button>
                        ))}
                        {decodedInfo?.role === 'Admin' && ( // Admin-only button
                            <Button
                                sx={{
                                    color: 'text.primary',
                                }}
                                onClick={() => {
                                    fetchUsers(); // Fetch users
                                    setView('users'); // Set the view to "users"
                                }}
                            >
                                View Users
                            </Button>
                        )}
                    </Box>

                    {/* User Avatar (Always on the Right) */}
                    <Avatar
                        src={userPicture}
                        alt="User Profile Picture"
                        sx={{
                            bgcolor: 'grey.700',
                            marginLeft: 2,
                        }}
                    />
                    <img
                        src="/icon.svg"
                        alt="Standalone Icon"
                        style={{ width: '32px', height: '32px' }}
                    />
                </Container>

                </AppBar>

                <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowNewCategoryModal(true)} // Open the modal
                    sx={{
                        marginTop: 2,
                        width: '100%',
                        textTransform: 'none',
                    }}
                >
                    Add New Category
                </Button>
                    <List>
                        {localCategories.map((category) => (
                            <ListItem
                                key={category.id}
                                component="button"
                                onClick={() => handleCategoryClick(category.id)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    textAlign: 'left',
                                    width: '100%',
                                    padding: 1,
                                    backgroundColor: selectedCategory === category.id ? 'grey.300' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'grey.300' },
                                }}
                            >
                                <ListItemText primary={category.name} />
                                {decodedInfo?.role === 'Admin' && ( // Show delete button for admins
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering category click
                                            handleDeleteCategory(category.id);
                                        }}
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                    >
                                        Delete
                                    </Button>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                    <Box
                        component={Paper}
                        elevation={1}
                        sx={{
                            width: { xs: '100%', md: 250 },
                            height: '100%',
                            overflowY: 'auto',
                            padding: 2,
                            backgroundColor: '#83B4FF',
                            display: { xs: 'none', md: 'block' },
                        }}
                    >
                        <Typography variant="h6">Categories</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setShowNewCategoryModal(true)} // Open the modal
                            sx={{
                                marginTop: 2,
                                width: '100%',
                                textTransform: 'none',
                            }}
                        >
                            Add New Category
                        </Button>
                        <List>
                            {localCategories.map((category) => (
                                <ListItem
                                    key={category.id}
                                    component="button"
                                    onClick={() => handleCategoryClick(category.id)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        textAlign: 'left',
                                        width: '100%',
                                        padding: 1,
                                        backgroundColor: selectedCategory === category.id ? 'grey.300' : 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: 'grey.300' },
                                    }}
                                >
                                    <ListItemText primary={category.name} />
                                    {decodedInfo?.role === 'Admin' && ( // Show delete button for admins
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering category click
                                                handleDeleteCategory(category.id);
                                            }}
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    <Box
                        component={Paper}
                        elevation={3}
                        sx={{
                            flexGrow: 1,
                            backgroundColor: '#FDFFE2',
                            padding: 3,
                            borderRadius: 2,
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            overflowY: 'auto',
                        }}
                        >
                        {view === 'main' ? (
                            children // The existing main content
                        ) : view === 'profile' ? (
                            <div style={{ padding: '2rem' }}>
                                {decodedInfo ? (
                                    <>
                                        <h1>Profile</h1>
                                        <p><strong>Name:</strong> {decodedInfo.unique_name}</p>
                                        <p><strong>Role:</strong> {decodedInfo.role}</p>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                marginTop: '2rem',
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#83B4FF',
                                                color: '#FFF',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                            }}
                                        >
                                            Log Out
                                        </button>
                                    </>
                                ) : (
                                    <p>No profile information available.</p>
                                )}
                            </div>
                            ) : view === 'users' ? ( // Render users list
                                <div style={{ padding: '2rem' }}>
                                    <h1>All Users</h1>
                                    {users.length > 0 ? (
                                        <Box>
                                            {users.map((user) => (
                                                <Box
                                                    key={user.id}
                                                    sx={{
                                                        padding: 2,
                                                        borderBottom: '1px solid #ccc',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <Typography>{user.name}</Typography>
                                                    <Typography color="text.secondary">{user.email}</Typography>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => handleDeleteUser(user.id)} // Add Delete Handler
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography>No users found.</Typography>
                                    )}
                                </div>
                            ) : null}
                    </Box>
                </Box>

                <Box
                    component="footer"
                    sx={{
                        backgroundColor: 'grey.900',
                        color: '#1A2130',
                        textAlign: 'center',
                        padding: 2,
                    }}
                    >
                    <Typography variant="body2" sx={{ color: 'white' }}>
                    © 2024 INH, Input Name Here.
                    </Typography>
                </Box>

                {showNewPost && (
                    <Dialog open={showNewPost} onClose={handleCloseNewPost}>
                        <Box sx={{ padding: 2 }}>
                            <TextField
                                label="Title"
                                name="title"
                                value={newPost.title}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Content"
                                name="content"
                                value={newPost.content}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                fullWidth
                                margin="normal"
                            />
                            {responseMessage && <Typography color="error">{responseMessage}</Typography>}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                <Button variant="contained" onClick={handleSubmit}>
                                    Submit
                                </Button>
                                <Button variant="outlined" onClick={handleCloseNewPost}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </Dialog>
                )}

                {selectedPost && (
                    <Dialog open={!!selectedPost} onClose={closeModal}>
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="h6">Comments</Typography>
                            {selectedPost.comments.length > 0 ? (
                                selectedPost.comments.map((comment) => (
                                    <Box
                                    key={comment.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.5rem',
                                        borderBottom: '1px solid #ccc',
                                    }}
                                >
                                    <Typography sx={{ flexGrow: 1 }}>{comment.text}</Typography>
                                    {decodedInfo?.role === 'Admin' && ( // Show delete button for admins
                                        <Button
                                            onClick={() => handleDeleteComment(selectedPost.id, comment.commentId)}
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </Box>
                                ))
                            ) : (
                                <Typography>No comments available.</Typography>
                            )}

                            <Box sx={{ marginTop: 2 }}>
                                <TextField
                                    label="Add a comment"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    sx={{ marginBottom: 1 }}
                                />
                                <Button variant="contained" onClick={handleAddComment} disabled={!newComment.trim()}>
                                    Add Comment
                                </Button>
                            </Box>
                        </Box>
                    </Dialog>
                )}

                {showNewCategoryModal && (
                    <Dialog open={showNewCategoryModal} onClose={() => setShowNewCategoryModal(false)}>
                    <Box sx={{ padding: 2, width: 300 }}>
                        <Typography variant="h6">Create New Category</Typography>
                        <TextField
                            label="Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => handleCreateCategory()}
                                disabled={!newCategoryName.trim()} // Disable if input is empty
                            >
                                Create
                            </Button>
                            <Button variant="outlined" onClick={() => setShowNewCategoryModal(false)}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Dialog>                
                )}
            </Box>
        </ThemeProvider>
    );
};

export default Wireframe;
