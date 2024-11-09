import { GoogleLogin } from "@react-oauth/google";

function LoginPage() {
    // Handle the Google login success
    const handleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;  // This is the ID token from Google
        console.log("Google login successful:", token);

        try {
            // Send the token to the backend API for authentication
            const response = await fetch("http://localhost:82/user/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: "\"" + token + "\"", // Send the token as string
            });

            if (!response.ok) {
                console.error("Failed to authenticate");
                return;
            }

            const data = await response.json();
            console.log("Authentication successful:", data);
            localStorage.setItem("jwtToken", data.token);

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
