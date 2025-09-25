
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

    const firebaseConfig = {
        apiKey: "AIzaSyAAse8fcxMntSDgI4ssrKVcuS14TIcxqYo",
        authDomain: "star-wars-list-b450b.firebaseapp.com",
        projectId: "star-wars-list-b450b",
        storageBucket: "star-wars-list-b450b.firebasestorage.app",
        messagingSenderId: "1078874247193",
        appId: "1:1078874247193:web:5ab3e99fcf561140dcda88"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Expor auth para uso global
    window.firebaseAuth = auth;
    window.firebaseSignIn = signInWithEmailAndPassword;
    window.firebaseCreateUser = createUserWithEmailAndPassword;
    window.firebaseSendPasswordReset = sendPasswordResetEmail;
