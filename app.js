const provider = new firebase.auth.GoogleAuthProvider();

function login() {
  auth.signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      document.getElementById("user-info").textContent = `مرحبًا، ${user.displayName}`;
      getTools();
    })
    .catch(console.error);
}

function logout() {
  auth.signOut().then(() => {
    document.getElementById("user-info").textContent = "تم تسجيل الخروج";
    document.getElementById("tools-container").innerHTML = "";
  });
}

function addTool() {
  const name = document.getElementById("tool-name").value;
  const link = document.getElementById("tool-link").value;
  const user = auth.currentUser;

  if (user && name && link) {
    db.collection("tools").add({
      name: name,
      link: link,
      email: user.email,
      created: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      document.getElementById("tool-name").value = "";
      document.getElementById("tool-link").value = "";
    });
  }
}

function getTools() {
  db.collection("tools").orderBy("created", "desc").onSnapshot(snapshot => {
    const container = document.getElementById("tools-container");
    container.innerHTML = "";
    snapshot.forEach(doc => {
      const tool = doc.data();
      container.innerHTML += `<div><a href="${tool.link}" target="_blank">${tool.name}</a></div>`;
    });
  });
}

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("user-info").textContent = `مرحبًا، ${user.displayName}`;
    getTools();
  }
});
