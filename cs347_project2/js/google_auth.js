import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getDatabase, ref, set, child, get} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js"
const db = getDatabase();

var googleBtn = document.getElementById('googlebtn');
googleBtn.onclick = function() {
    google();
    
}
function google() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
        signupUser(result.user.email, result.user.displayName, result.user.photoURL, credential, token);
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
    
}
// Signup User

function signupUser(email, name, photo, cred, token) {

const dbref = ref(db);

let firstname = name.split(' ')[0];
let lastname = name.split(' ')[1];
let user = email.split('@')[0];

get(child(dbref, "UsersList/"+ user)).then((snapshot)=>{
if(snapshot.exists()){
signinUser(snapshot.val());

}
else {
set(ref(db, "UsersList/"+ user), {
    username: user,
    firstName: firstname,
    lastName: lastname,
    email: email,
    ImgUrl: photo
})
.then((result)=>{
    //alert("User added.");
    signinUser(result.val());
})
.catch((error)=>{
    alert("User Added; You should now be able to sign in with Google.");
})
}
});
}

function signinUser(user) {
localStorage.setItem('keepLoggedIn', 'yes');
localStorage.setItem('user', JSON.stringify(user));
window.location="index.html";
}