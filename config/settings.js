const port = 3002;
const baseURL = `http://localhost:${port}`;

module.exports = {
    port: port,
    USE_HTTPS: false,
    TOKEN_SECRET: "JSONWEBTOKENSECRET", 
    oauth2Credentials: {
        client_id: "", // Google Client Id
        project_id: "", // The name of your project
        api_key: "", // Api Key
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_secret: "", // Google Client Secret
        redirect_uris: [
            `${baseURL}/auth_callback`
        ],
        scopes: [
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
    }
};