import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";

const auth = getAuth();
const emailField = document.getElementById('email');
const resetPassword = document.getElementById('sub-forgot');

function resetPasswordEmail(email) {
  return sendPasswordResetEmail(auth, email).then((a) => {
    alert("Password reset email sent")
  })
}
resetPassword.onclick = function() {
  resetPasswordEmail(emailField.value)    
}