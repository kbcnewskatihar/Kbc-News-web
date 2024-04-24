importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyCnJldfLMaUtalpsAxgDqEeMzPQrRmyVpI",
  authDomain: "kbc-news-a6f9d.firebaseapp.com",
  projectId: "kbc-news-a6f9d",
  storageBucket: "kbc-news-a6f9d.appspot.com",
  messagingSenderId: "449304960312",
  appId: "1:449304960312:web:f1a8cfe2144bf5d8b675cd",
  measurementId: "G-D5PWMJ1RR3"
};



firebase?.initializeApp(firebaseConfig)


// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener('install', function (event) {
  // console.log('Hello world from the Service Worker :call_me_hand:');
});

// Handle background messages
self.addEventListener('push', function (event) {
  const payload = event.data.json();
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});