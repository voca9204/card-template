// Service Worker registration with PWA features

export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return;
  }

  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    });

    console.log('Service Worker registered:', registration);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000); // Check every hour

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            if (confirm('새로운 버전이 있습니다. 업데이트하시겠습니까?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      }
    });

    // Handle controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

// Check if app is installed
export const isAppInstalled = () => {
  // For iOS
  if (window.navigator.standalone) {
    return true;
  }
  
  // For Android/Chrome
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }
  
  return false;
};

// Install prompt handling
let deferredPrompt: any = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show custom install button
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
});

export const showInstallPrompt = async () => {
  if (!deferredPrompt) {
    console.log('Install prompt not available');
    return;
  }

  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User response to the install prompt: ${outcome}`);
  
  // Clear the deferred prompt
  deferredPrompt = null;
  
  // Hide install button
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'none';
  }
  
  return outcome;
};

// Check online status
export const isOnline = () => navigator.onLine;

// Listen for online/offline events
window.addEventListener('online', () => {
  console.log('Back online');
  // Trigger sync if needed
  if ('sync' in navigator.serviceWorker.registration!) {
    navigator.serviceWorker.registration!.sync.register('sync-templates');
  }
});

window.addEventListener('offline', () => {
  console.log('Gone offline');
  // Show offline notification
  const offlineNotification = document.getElementById('offline-notification');
  if (offlineNotification) {
    offlineNotification.style.display = 'block';
  }
});

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show notification
export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-96.png',
      ...options
    });
  }
};