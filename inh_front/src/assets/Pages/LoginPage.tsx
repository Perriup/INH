import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    nameid: string;
    unique_name: string;
    email: string;
    role: string;
    picture: string; // Include picture in the token interface
}

function LoginPage() {
    // Handle the Google login success
    // @ts-ignore
    const handleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;  // This is the ID token from Google
        console.log("Google login successful:", token);

        try {
            // Send the token to the backend API for authentication
            const response = await fetch(`https://localhost:7187/User/authenticate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: "\"" + token + "\"", // Send the token as string
            });

            if (!response.ok) {
                console.error("Failed to authenticate");
                console.error(import.meta.env);
                return;
            }

            const data = await response.json();
            console.log("Authentication successful:", data);
            
            const decoded: DecodedToken = jwtDecode(data.token);

            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("userPicture", decoded.picture);

            //Move to a MainPage
            window.location.href = "/main"
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div>
            <h1>Login with Google</h1>
            <GoogleLogin onSuccess={handleSuccess}/>
        </div>
    );
}

export default LoginPage;
