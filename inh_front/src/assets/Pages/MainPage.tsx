import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
//const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;


function MainPage() {
    const [token, setToken] = useState<string | null>(null);
    const [decodedInfo, setDecodedInfo] = useState<TokenPayload | null>(null);
    const [response, setResponse] = useState<string | null>(null);
    const [newPostContent, setNewPostContent] = useState<string>('');
    const [categoryId, setCategoryId] = useState<number>(-1);
    const [postTitle, setPostTitle] = useState<string>('');

    interface TokenPayload {
        nameid?: string;
        unique_name?: string;
        email?: string;
        role?: string;
    }
    interface Comment {
        commentId: number;
        text: string;
        postId: number;
        categoryId: number;
    }
    interface Post {
        postId: number;
        title: string;
        content: string;
        categoryId: number;
        comments: Comment[];
    }

    useEffect(() => {
        const tryGetTokenFromLocalStorage = () => {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                setToken(token);
                const decoded = jwtDecode<TokenPayload>(token);
                setDecodedInfo(decoded);
                console.log(decoded);
            }
        };
        tryGetTokenFromLocalStorage();
    }, []);

    const addPost = async () => {
        if (!newPostContent || categoryId < 0) {
            setResponse("Please enter a valid category ID and content.");
            return;
        }

        console.log("JWT Token:", token);

        const postData: Post = {
            postId: 0,
            title: postTitle,
            content: newPostContent,
            categoryId: categoryId,
            comments: []
        };

        const response = await fetch(`https://inhback20241111003517.azurewebsites.net/category/${categoryId}/Post`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({postData})
        });

        if (response.ok) {
            setResponse('Post added successfully');
            setNewPostContent('');
        } else {
            setResponse('Failed to add post');
        }
    };


    return (
        <>
            <h1>React OAuth/JWT Example</h1>
            <p>Token: {token}</p>
            {decodedInfo && (
                <div>
                    <h2>Decoded Token Information</h2>
                    <p><strong>Subject:</strong> {decodedInfo.nameid}</p>
                    {/* ClaimTypes.Name automatically set this var to unique_name, but it doesnt actually have to be unique, lol */}
                    <p><strong>Name:</strong> {decodedInfo.unique_name}</p>
                    <p><strong>Email:</strong> {decodedInfo.email}</p>
                    <p><strong>Role:</strong> {decodedInfo.role}</p>
                </div>
            )}
            <div>
                <h2>Make a Post</h2>
                <input
                    type="number"
                    placeholder="Category ID"
                    value={categoryId >= 0 ? categoryId : ''} // Show empty input if categoryId is -1
                    onChange={(e) => setCategoryId(parseInt(e.target.value))}
                />
                <input
                    type="text"
                    placeholder="Title"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Content"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                />
                <button onClick={addPost}>Post</button>
            </div>
            <div>
                <h2>Response Message</h2>
                <textarea
                    value={response || ''}
                    readOnly
                    style={{ width: '100%', height: '50px' }}
                />
            </div>
        </>
    );
}

export default MainPage;
