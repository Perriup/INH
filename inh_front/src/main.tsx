import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <GoogleOAuthProvider clientId="1076162618570-k6ej1mvlsgqv1tbctjukn9q6djduni87.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    );
}
