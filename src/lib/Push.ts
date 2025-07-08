export function notificationUnsupported(): boolean {
  let unsupported = false;
  if (
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('showNotification' in ServiceWorkerRegistration.prototype)
  ) {
    unsupported = true;
  }
  return unsupported;
}