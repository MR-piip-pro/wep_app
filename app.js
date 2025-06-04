import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تحميل الأدوات من Firestore
const toolsContainer = document.getElementById("tools-container");
toolsContainer.innerHTML = "<p>جاري تحميل الأدوات...</p>";

const toolsQuery = query(collection(db, "tools"), orderBy("added_at", "desc"));

getDocs(toolsQuery)
  .then(snapshot => {
    toolsContainer.innerHTML = "";
    if (snapshot.empty) {
      toolsContainer.innerHTML = "<p>لا توجد أدوات متاحة حالياً.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const tool = doc.data();
      const div = document.createElement('div');
      div.className = 'tool-card';
      div.innerHTML = `
        <h2>${tool.name}</h2>
        <a href="${tool.link}" target="_blank">📥 تحميل الأداة</a>
      `;
      toolsContainer.appendChild(div);
    });
  })
  .catch(error => {
    console.error("حدث خطأ أثناء تحميل الأدوات:", error);
    toolsContainer.innerHTML = "<p>حدث خطأ أثناء تحميل الأدوات.</p>";
  });


// تحميل الأدوات عند تشغيل الصفحة
getTools();
