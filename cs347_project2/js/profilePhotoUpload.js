    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyCugocTZH66lmDVBisEUEMk97NYq79087s",
      authDomain: "webdev-de842.firebaseapp.com",
      databaseURL: "https://webdev-de842-default-rtdb.firebaseio.com",
      projectId: "webdev-de842",
      storageBucket: "webdev-de842.appspot.com",
      messagingSenderId: "137584891375",
      appId: "1:137584891375:web:7cb2f803879d6edf72d21a",
      measurementId: "G-MY7HRZ4FEJ"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    import {getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js";
    import { getDatabase, ref, set, child, get, update}
     from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js"
    const realdb = getDatabase();
    var files = [];
    var reader = new FileReader();

    var extlab = document.getElementById('extlab');
    var myimg = document.getElementById('profile-pic');
    var proglab = document.getElementById('upprogress');
    var SelBtn = document.getElementById('selbtn');
    var UpBtn = document.getElementById('upbtn');
    var DownBtn = document.getElementById('downbtn');
    var currentuser;


    var input = document.createElement('input');
    input.type = 'file';

    var extension;
    var name;

    input.onchange = e => {
      files = e.target.files;

      extension = GetFileExt(files[0]);
      name = GetFileName(files[0]);


      reader.readAsDataURL(files[0]);
    }

    reader.onload = function() {
      myimg.src = reader.result;
    }

    SelBtn.onclick = function() {
      input.click();
    }

    function GetFileExt(file) {
      var temp = file.name.split('.');
      var ext = temp.slice((temp.length-1),(temp.length));
      return '.' + ext[0];
    }

    function GetFileName(file) {
      var temp = file.name.split('.');
      var fname = temp.slice(0,-1).join('.');
      return fname;
    }

    async function UploadProccess() {
      var ImgToUpload = files[0];

      var ImgName = name + extension;

      const metaData = {
        contentType: ImgToUpload.type
      }
      const storage = getStorage();

      const storageRef = sRef(storage, "Images/"+ImgName);

      const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

      UploadTask.on('state-changed', (snapshot)=>{
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        proglab.innerHTML = "Upload " + progress + "%";
      }, 
      (error) => {
        alert("error: image not uloaded!");
      }, 
      () => {
        getDownloadURL(UploadTask.snapshot.ref).then((downloadURL)=> {
          SaveURLtoRealtimDB(downloadURL);
        });
      });
    }
    
    function getUser() {
  let keepLoggedIn = localStorage.getItem("keepLoggedIn");
  if (keepLoggedIn == "yes") {
    currentuser = JSON.parse(localStorage.getItem('user'));
  } else {
    currentuser = JSON.parse(sessionStorage.getItem('user'));
  }
}

    function SaveURLtoRealtimDB(URL) {
      getUser();
      update(ref(realdb, "UsersList/"+currentuser.username), {
        ImageName: (name+extension),
        ImgUrl: URL
      });
      
    }

    function GetURLfromRealtimDB() {
      getUser();
      var dbRef = ref(realdb);
      get(child(dbRef, "UsersList/"+currentuser.username)).then((snapshot)=> {
        if(snapshot.exists()){
          myimg.src = snapshot.val().ImgUrl;
        }
      })
    }
    UpBtn.onclick = UploadProccess;
    GetURLfromRealtimDB();