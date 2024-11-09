import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


function MainPage() {
    const [token, setToken] = useState<string | null>(null);
    const [decodedInfo, setDecodedInfo] = useState<TokenPayload | null>(null);
    interface TokenPayload {
        nameid?: string;
        unique_name?: string;
        email?: string;
        role?: string;
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
    }, []); // Empty dependency array to ensure this only runs once on mount

    return (
        <>
            <h1>React OAuth Example</h1>
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
        </>
    );
}

export default MainPage;
