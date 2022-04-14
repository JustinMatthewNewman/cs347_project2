

 import { getDatabase, ref, set, child, get, update}
     from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js"
const db = getDatabase();

// references



const em_signup = document.getElementById('em1');
const pass_signup = document.getElementById('pass1');
const fn = document.getElementById('fn1');
const ln = document.getElementById('ln1');
const un = document.getElementById('un1');

const un_login = document.getElementById("em2");
const pass_login = document.getElementById("pass2");

// validation

function valid() {
    let emailregex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!emailregex.test(em_signup.value)) {
        alert("Invalid Email");
        return false;

    }
    if(!passRegex.test(pass_signup.value)) {
        alert("Password Minimum eight characters, at least one letter, one number and one special character.");
        return false;
    }
    return true;
}


// Signup User

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

const auth = getAuth();


function signupUser() {
    if(!valid()){
        return;
    };
    createUserWithEmailAndPassword(auth, em_signup.value, pass_signup.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
    var terms = document.getElementById("myCheck").checked;
    if (!terms) {
        alert("Please agree to terms.");
        return;
    }

    const dbref = ref(db);

    get(child(dbref, "UsersList/"+ un.value)).then((snapshot)=>{
        if(snapshot.exists()){
            alert("User already exists.");
        }
        else {
            set(ref(db, "UsersList/"+ un.value), {
                username: un.value,
                firstName: fn.value,
                lastName: ln.value,
                email: em_signup.value,
                password: encPass(),
                ImgUrl: "https://firebasestorage.googleapis.com/v0/b/webdev-de842.appspot.com/o/Images%2FDefault_pfp.jpeg?alt=media&token=8bce1a9c-e600-4465-b5bb-bb8540c0569e"
            })
            .then(()=>{
                //alert("User added.");
                newUser();
            })
            .catch((error)=>{
                alert("error" + error);
            })
        }
    });
}

function newUser() {
    const dbref = ref(db);
    get(child(dbref, "UsersList/"+ un.value)).then((snapshot)=>{
        signinUser(snapshot.val());
    });
}

//Login User

function AuthenticateUser() {

    const dbref = ref(db);
    get(child(dbref, "UsersList/"+ un_login.value)).then((snapshot)=>{
        if (snapshot.val().email == null || pass_login.value == null) {
            alert("Invalid Username/Password: (Both case sensitive)");
            return;
        }
        signInWithEmailAndPassword(auth, snapshot.val().email, pass_login.value)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                update(ref(db, "UsersList/"+ un_login.value), {
                    password: encPassNew(pass_login.value)
                })
                .then((result)=>{
                })
                .catch((error)=>{
                    alert("Error");
                })
                signinUser(snapshot.val());
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Invalid Username/Password: (Both case sensitive)");
                return;
            });
    }).then((result)=>{
    })
    .catch((error)=>{
        alert("Invalid Username/Password: (Both case sensitive)");
    });

}


//assign events

document.getElementById("submit1").addEventListener('click', signupUser);
document.getElementById("submit2").addEventListener('click', AuthenticateUser);


//encrypt 

function encPass() {
    var pass12 = CryptoJS.AES.encrypt(pass_signup.value, pass_signup.value);
    return pass12.toString();
}

//decrypt 

function decPass(dbpass) {
    var pass12 = CryptoJS.AES.decrypt(dbpass, pass_login.value);
    return pass12.toString(CryptoJS.enc.Utf8);
}

//encryptNew 

function encPassNew(pass) {
    var pass12 = CryptoJS.AES.encrypt(pass, pass);
    return pass12.toString();
}


// login 

function signinUser(user) {
    let keepLoggedIn = document.getElementById('kli').checked;
    if (!keepLoggedIn) {
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location="index.html";
    } else {
        localStorage.setItem('keepLoggedIn', 'yes');
        localStorage.setItem('user', JSON.stringify(user));
        window.location="index.html";
    }
}

