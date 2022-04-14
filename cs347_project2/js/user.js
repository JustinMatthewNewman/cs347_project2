let userlink = document.getElementById('userlink');
let signout = document.getElementById('signout');
var currentuser = null;

function getUser() {
  let keepLoggedIn = localStorage.getItem("keepLoggedIn");
  if (keepLoggedIn == "yes") {
    currentuser = JSON.parse(localStorage.getItem('user'));
  } else {
    currentuser = JSON.parse(sessionStorage.getItem('user'));
  }
}

function signUserout() {
  sessionStorage.removeItem('user');
  localStorage.removeItem('user');
  localStorage.removeItem('keepLoggedIn');
  window.location = "index.html";
}

window.onload = function() {
  getUser();
  if (currentuser == null) {
    userlink.innerText= "";
    userlink.classList.replace("nav-link","btn");
    userlink.classList.add("btn-primary");
    userlink.href = "signup.html";

    signout.innerText = "Login";
    signout.classList.replace("nav-link","btn");
    signout.classList.add("btn-success");
    signout.href = "signup.html";

  } else {
    userlink.innerText = currentuser.username;
    userlink.classList.replace("btn","nav-link");
    userlink.classList.remove("btn-primary");
    userlink.href = "#";

    signout.innerText = "Sign Out";
    signout.classList.replace("btn", "nav-link");
    signout.classList.remove("btn-success");
    signout.href = "javascript:signUserout()";
  }
}