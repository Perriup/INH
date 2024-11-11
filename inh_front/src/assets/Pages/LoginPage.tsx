import { GoogleLogin } from "@react-oauth/google";
//const BACK_END_URL = import.meta.env.VITE_BACK_END_URL;

function LoginPage() {
    // Handle the Google login success
    // @ts-ignore
    const handleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;  // This is the ID token from Google
        console.log("Google login successful:", token);

        try {
            // Send the token to the backend API for authentication
            const response = await fetch(`https://inhback20241111003517.azurewebsites.net/User/authenticate`, {
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
