import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, get, set, push } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjuPHyoBchvfSf-FYXqXk4y2iwtekIHv0",
  authDomain: "arachnes-website.firebaseapp.com",
  databaseURL: "https://arachnes-website-default-rtdb.firebaseio.com",
  projectId: "arachnes-website",
  storageBucket: "arachnes-website.appspot.com",
  messagingSenderId: "598408301141",
  appId: "1:598408301141:web:06d254956c7fa87a1be2dc"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const errorParagraph = document.getElementById("errorParagraph");
const loginButton = document.getElementById("loginButton");
const showPasswordCheckbox = document.getElementById("showPassword");
const loginForm = document.getElementById("LoginForm");
const dataSection = document.getElementById("dataSection");

onAuthStateChanged(auth, user => {
  if (user) {
    loginForm.style.display = "none";
    dataSection.style.display = "block";
    loadUserData(user);
  } else {
    loginForm.style.display = "block";
    dataSection.style.display = "none";
  }
});

function loadUserData(user) {
  const adminUid = user.uid;
  get(ref(db, `admins/${adminUid}`)).then(adminSnapshot => {
    if (adminSnapshot.exists()) {
      const data = adminSnapshot.val();
      if(data.allowedOffers === true){
        loadOfferData();
      }
    }
  });
}

function loadOfferData(selectedOffer) {
  const header = document.getElementById("header");
  const addOfferDiv = document.getElementById("addOfferDiv");
  get(ref(db, `shop`)).then(allowedOffersSnapshot => {
    if (allowedOffersSnapshot.exists()) {
      dataSection.innerHTML = "";
      addOfferDiv.innerHTML = "";
      
      const addOfferBtn = document.createElement('i');
      
      addOfferBtn.className = "fa-sharp fa-solid fa-plus";
      addOfferBtn.id = 'addOfferBtn';
      
      addOfferDiv.appendChild(addOfferBtn);
      header.appendChild(addOfferDiv);
      
      addOfferBtn.addEventListener('click', () => {
  const dialog = document.createElement('div');
dialog.innerHTML = `<div class="dialog">
    <label for="title">العنوان:</label>
    <input type="text" id="title" placeholder="العنوان" maxlength="24">
    <label for="">الوصف:</label>
    <input type="text" id="description" placeholder="الوصف" maxlength="60">
    <label for="price">السعر:</label>
    <input type="number" id="price" placeholder="السعر">
    <p id="errorElm"></p>
    <div class="buttons-div">
      <button id="confirmBtn">تأكيد</button>
      <button id="cancelBtn">إلغاء</button>
    </div>
  </div>`;
document.body.appendChild(dialog);
document.body.classList.add('modal-open');

const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const errorElm = document.getElementById('errorElm');

  confirmBtn.addEventListener('click', async () => {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const priceInput = document.getElementById('price');
    const secondPriceInput = document.getElementById('second-price')

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const price = priceInput.value.trim();

    if (title === "" || description === "" || price === "") {
      errorElm.textContent = "إملأ كل الحقول المطلوبة";
      return;
    }

    try {
      const newOfferRef = ref(db, `shop/${title}`);
      set(newOfferRef, {
        title: title,
        description: description,
        price: price
      }).then(() => {
        alert('تم إضافة العرض بنجاح!');
        dialog.remove();
        location.reload();
      }).catch(error => {
        alert('حصل خطأ أثناء إضافة العرض: ' + error.message);
      });
    } catch (error) {
      errorElm.textContent = "حدث خطأ أثناء إضافة العرض ";
    }
  });

  cancelBtn.addEventListener('click', () => {
    dialog.remove();
    document.body.classList.remove('modal-open');
  });

      });
      const offersData = allowedOffersSnapshot.val();
      const sortedOfferIds = Object.keys(offersData).sort((a, b) => {
        const valueA = offersData[a].toString();
        const valueB = offersData[b].toString();
        return valueA.localeCompare(valueB, 'ar');
      });
      sortedOfferIds.forEach(offerId => {
        const offerData = offersData[offerId];
        createofferCard(offerId, offerData);
      });
    } else {
        addOfferDiv.innerHTML = "";
      
      const addOfferBtn = document.createElement('i');
      
      addOfferBtn.className = "fa-sharp fa-solid fa-plus";
      addOfferBtn.id = 'addOfferBtn';
      
      addOfferDiv.appendChild(addOfferBtn);
      header.appendChild(addOfferDiv);
      
      addOfferBtn.addEventListener('click', addNewOffer());
      const offersData = allowedOffersSnapshot.val();
      const sortedOfferIds = Object.keys(offersData).sort((a, b) => {
        const valueA = offersData[a].toString();
        const valueB = offersData[b].toString();
        return valueA.localeCompare(valueB, 'ar');
      });
      sortedOfferIds.forEach(offerId => {
        const offerData = offersData[offerId];
        createofferCard(offerId, offerData);
      });
    }
  });
}

function createofferCard(offerId, offerData) {
  const card = document.createElement("div");
  const titleDiv = document.createElement("div");
  const titleTitle = document.createElement("h3");
  const titleEl = document.createElement("p");
  const descriptionDiv = document.createElement("div");
  const descriptionTitle = document.createElement("h3");
  const descriptionEl = document.createElement("p");
  const priceDiv = document.createElement("div");
  const priceTitle = document.createElement("h3");
  const priceEl = document.createElement("p");
  
  const iconsDiv = document.createElement("div");
  const deleteBtn = document.createElement("i");
  const editBtn = document.createElement("i");
  
  card.className = "offer-card";
  titleEl.className = "offer-title";
  descriptionEl.className = "offer-description";
  priceEl.className = "offer-price";
  deleteBtn.className = "fa-solid fa-trash";
  editBtn.className = "fa-solid fa-pen";
  
  titleTitle.textContent = "العنوان: ";
  titleEl.textContent = offerData.title;
  descriptionTitle.textContent = "الوصف: ";
  descriptionEl.textContent = offerData.description;
  
  
  priceTitle.textContent = "السعر: ";
  priceEl.textContent = offerData.price;
  
  deleteBtn.onclick = function() {
    if (confirm("متأكد من حذف هذا العرض؟")) {
      const offerRef = ref(db, `shop/${offerId}`);
      set(offerRef, null)
        .then(() => {
          alert('لقد تم حذف العرض بنجاح')
          card.remove();
        })
        .catch(error => {
          alert('حصل خطأ أثناء الحذف: ', error);
        });
    }
  };
  let isEditable = false;
  editBtn.addEventListener('click', () => {
    let secondPriceValue;
    if (!isEditable) {
      titleEl.contentEditable = true;
      descriptionEl.contentEditable = true;
      priceEl.contentEditable = true;
      editBtn.className = "fa-solid fa-floppy-disk";
      isEditable = true;
    } else {
      const priceValue = parseFloat(priceEl.textContent);
      set(ref(db, `shop/${offerId}`), {
        title: titleEl.textContent,
        description: descriptionEl.textContent,
        price: priceValue,
      });
      titleEl.contentEditable = false;
      descriptionEl.contentEditable = false;
      priceEl.contentEditable = false;
      editBtn.className = "fa-solid fa-pen";
      isEditable = false;
    }
  });
  titleDiv.appendChild(titleTitle);
  titleDiv.appendChild(titleEl);
  descriptionDiv.appendChild(descriptionTitle);
  descriptionDiv.appendChild(descriptionEl);
  priceDiv.appendChild(priceTitle);
  priceDiv.appendChild(priceEl);
  iconsDiv.appendChild(deleteBtn);
  iconsDiv.appendChild(editBtn);
  card.appendChild(titleDiv);
  card.appendChild(descriptionDiv);
  card.appendChild(priceDiv);
  card.appendChild(iconsDiv);
  dataSection.appendChild(card);
}

showPasswordCheckbox.addEventListener('change', function() {
  passwordInput.type = this.checked ? "text" : "password";
});

loginButton.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (email === "" || password === "") {
    errorParagraph.style.display = "block";
    errorParagraph.textContent = "أدخل البريد الإلكتروني و كلمة المرور معا!";
    return;
  }

  try {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    errorParagraph.style.display = "block";
    errorParagraph.textContent = error.message;
  }
});