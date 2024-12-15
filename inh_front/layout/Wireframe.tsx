import React, { ReactNode, useState } from 'react';
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
} from '@mui/material';

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
}

const Wireframe: React.FC<WireframeProps> = ({
    children, 
    userPicture, 
    categories, 
    selectedCategory, 
    onCategorySelect, 
    onNewPost,
    selectedPost,
    closeModal,
    addComment,
}) => {
    const [showNewPost, setShowNewPost] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', categoryId: 0 });
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');


    const handleCategoryClick = (id: number) => {
        onCategorySelect(id);
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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <AppBar position="sticky" color="default" elevation={1}>
                <Container
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 1,
                        flexDirection: { xs: 'column', md: 'row' }, // Stack for smaller screens
                    }}
                >
                    <Avatar
                        src={userPicture}
                        alt="User Profile Picture"
                        sx={{ bgcolor: 'grey.700', marginBottom: { xs: 2, md: 0 } }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {['Dashboard', 'Profile', 'Make Post'].map((link) => (
                            <Button
                                key={link}
                                sx={{ color: 'text.primary' }}
                                onClick={link === 'Make Post' ? handleOpenNewPost : undefined}
                            >
                                {link}
                            </Button>
                        ))}
                    </Box>
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        sx={{ maxWidth: 160 }}
                    />
                </Container>
            </AppBar>

            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <Box component={Paper} elevation={1} sx={{ width: 250, height: '100%', overflowY: 'auto', padding: 2 }}>
                <Typography variant="h6">Categories</Typography>
                    <List>
                        {categories.map((category) => (
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
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box component={Paper} elevation={1} sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
                    {children}
                </Box>
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
                            selectedPost.comments.map((comment, index) => (
                                <Typography key={index} sx={{ marginBottom: 1 }}>
                                    {comment.text}
                                </Typography>
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
        </Box>
    );
};

export default Wireframe;
