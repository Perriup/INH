import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Wireframe from '../../../layout/Wireframe';
// import { Box, Avatar } from '@mui/material';
// const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

function MainPage() {
    const [token, setToken] = useState<string | null>(null);
    const [decodedInfo, setDecodedInfo] = useState<DecodedToken | null>(null);
    const [response, setResponse] = useState<string | null>(null);
    // const [categoryId, setCategoryId] = useState<number>(-1);
    const [picture, setPicture] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [posts, setPosts] = useState<{ id: number; title: string; content: string }[]>([]);
    const [selectedPost, setSelectedPost] = useState<{ id: number; title: string; content: string; comments: any[] } | null>(null);
    const [update, setUpdate] = useState<boolean>(true);

    interface DecodedToken {
        unique_name: string;
        role: string;
    }

    useEffect(() => {
        const validateTokenAndFetchCategories = async () => {
            const storedToken = localStorage.getItem('jwtToken');
            if (!storedToken) {
                window.location.href = '/login';
                return;
            }

            setToken(storedToken);
            const userPicture = localStorage.getItem('userPicture');
            if (userPicture) setPicture(userPicture);

            const decoded = jwtDecode<DecodedToken>(storedToken);
            setDecodedInfo(decoded);

            console.log("decoded:", decoded);

            try {
                const response = await fetch(`https://inhback20241111003517.azurewebsites.net/category`);
                if (response.ok) {
                    const data = await response.json();
                    const mappedCategories = data.map((category: any) => ({
                        id: category.categoryId,
                        name: category.name,
                    }));
                    setCategories(mappedCategories);
                    if (mappedCategories.length > 0) {
                        setSelectedCategory(mappedCategories[0].id);
                    }
                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        validateTokenAndFetchCategories();
    }, []);

    // Fetch posts whenever selectedCategory changes
    useEffect(() => {
        const fetchPosts = async () => {
            if (!selectedCategory) {
                setPosts([]);
                return;
            }

            try {
                const response = await fetch(`https://inhback20241111003517.azurewebsites.net/category/${selectedCategory}/Post`);
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data.map((post: any) => ({
                        id: post.postId,
                        title: post.title,
                        content: post.content,
                    })));
                } else {
                    console.error('Failed to fetch posts');
                    setPosts([]);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                setPosts([]);
            }
        };

        fetchPosts();
    }, [selectedCategory, update]);

    const handleNewPost = async (postData: { title: string; content: string; categoryId: number }) => {
        const { title, content, categoryId } = postData;

        console.log(selectedCategory);

        if (!selectedCategory) {
            return { success: false, message: 'Please select a category before posting.' };
        }

        if (!content || categoryId < 0 || !title.trim()) {
            return { success: false, message: 'Please enter a valid title and content.' };
        }

        try {
            console.log("Category id", categoryId);

            const res = await fetch(`https://inhback20241111003517.azurewebsites.net/category/${categoryId}/Post`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: 0, title, content, categoryId, comments: [] }),
            });

            if (res.ok) {
                setUpdate(!update);
                return { success: true, message: 'Post added successfully.' };
            } else {
                const errorText = await res.text();
                return { success: false, message: `Failed to add post: ${errorText}` };
            }
        } catch (error) {
            console.error('Error adding post:', error);
            return { success: false, message: 'An error occurred while adding the post.' };
        }
    };

    const handlePostClick = async (postId: number) => {
        try {
            const response = await fetch(`https://inhback20241111003517.azurewebsites.net/category/${selectedCategory}/Post/${postId}/Comment`);
            if (response.ok) {
                const data = await response.json();
                const selected = posts.find((post) => post.id === postId);
                if (selected) {
                    setSelectedPost({
                        ...selected,
                        comments: data,
                    });
                }
            } else {
                console.error('Failed to fetch comments');
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const closeModal = () => {
        setSelectedPost(null);
    };

    const handleAddComment = async (postId: number, comment: string) => {
        try {
            const response = await fetch(`https://inhback20241111003517.azurewebsites.net/category/${selectedCategory}/post/${postId}/Comment`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: comment }),
            });
    
            if (response.ok) {
                const newComment = await response.json(); // Expect the backend to return the added comment
                setSelectedPost((prev) => {
                    if (prev) {
                        return {
                            ...prev,
                            comments: [...prev.comments, newComment], // Add the new comment to the existing array
                        };
                    }
                    return null;
                });
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeletePost = async (postId: number) => {
        try {
            const response = await fetch(`https://inhback20241111003517.azurewebsites.net/category/${selectedCategory}/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            } else {
                console.error('Failed to delete post:', await response.text());
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };
    

    return (
        // <Wireframe>
        //     {/* Main Content */}
        //     <Box
        //         sx={{
        //             padding: 2,
        //             display: 'flex',
        //             flexDirection: 'column',
        //             gap: 2,
        //         }}
        //     >
        //         <h1>React OAuth/JWT Example</h1>
        //         <p>Token: {token}</p>
        //         {decodedInfo && (
        //             <div>
        //                 <h2>Decoded Token Information</h2>
        //                 <p><strong>Subject:</strong> {decodedInfo.nameid}</p>
        //                 <p><strong>Name:</strong> {decodedInfo.unique_name}</p>
        //                 <p><strong>Email:</strong> {decodedInfo.email}</p>
        //                 <p><strong>Role:</strong> {decodedInfo.role}</p>
        //             </div>
        //         )}
        //         <div>
        //             <h2>Make a Post</h2>
        //             <input
        //                 type="number"
        //                 placeholder="Category ID"
        //                 value={categoryId >= 0 ? categoryId : ''}
        //                 onChange={(e) => setCategoryId(parseInt(e.target.value))}
        //             />
        //             <input
        //                 type="text"
        //                 placeholder="Title"
        //                 value={postTitle}
        //                 onChange={(e) => setPostTitle(e.target.value)}
        //             />
        //             <input
        //                 type="text"
        //                 placeholder="Content"
        //                 value={newPostContent}
        //                 onChange={(e) => setNewPostContent(e.target.value)}
        //             />
        //             <button onClick={addPost}>Post</button>
        //         </div>
        //         <div>
        //             <h2>Response Message</h2>
        //             <textarea
        //                 value={response || ''}
        //                 readOnly
        //                 style={{ width: '100%', height: '50px' }}
        //             />
        //         </div>
        //     </Box>
        // </Wireframe>
    <Wireframe 
        userPicture={picture || undefined} 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        onNewPost={handleNewPost}
        responseMessage={response || undefined}
        clearResponse={()=>setResponse(null)}
        selectedPost={selectedPost}
        onPostClick={handlePostClick}
        closeModal={closeModal}
        addComment={handleAddComment}
        decodedInfo={decodedInfo}
        >
        {/* Pass posts as children */}
        <div>
        {posts.length > 0 ? (
            posts.map((post) => (
            <div
                key={post.id}
                onClick={() => handlePostClick(post.id)} // Handles comment loading
                style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    position: 'relative',
                    fontFamily: 'Oswald',
                    cursor: 'pointer', // Indicate clickability
                }}
            >
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {decodedInfo?.role === 'Admin' && (
                    <button
                        onClick={(event) => {
                            event.stopPropagation(); // Prevent the post click from firing
                            handleDeletePost(post.id);
                        }}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: '#83B4FF',
                            color: '#FFF',
                            border: 'none',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            borderRadius: '5px',
                        }}
                    >
                        Delete
                    </button>
                )}
            </div>
            ))
        ) : (
            <p>No posts available for the selected category.</p>
        )}
    </div>
    </Wireframe>
    );
}

export default MainPage;
