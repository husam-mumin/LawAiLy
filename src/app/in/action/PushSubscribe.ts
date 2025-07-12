const SERVICE_WORKER_FILE_PATH = "./sw.js";

export async function registerAndSubscribe(): Promise<void> {
  try {
    await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
    await subscribe();
  } catch (e) {
    console.error("Failed to register service-worker: ", e);
  }
}
async function subscribe(): Promise<void> {
  navigator.serviceWorker.ready
    .then((registration: ServiceWorkerRegistration) => {
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
    })
    .then((subscription: PushSubscription) => {
      console.info("Created subscription Object: ", subscription.toJSON());
      // submit subscription to server.
      submitSubscription(subscription).then(() => {});
    })
    .catch((e) => {
      console.error("Failed to subscribe cause of: ", e);
    });
}

async function submitSubscription(
  subscription: PushSubscription
): Promise<void> {
  const user = localStorage.getItem("userid")
    ? localStorage.getItem("userid") || "{}"
    : {};

  const endpointUrl = "/api/in/user/pushSubscription";
  await fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscription, userId: user }),
  });
}

export function checkPermissionStateAndAct(): void {
  const state: NotificationPermission = Notification.permission;
  switch (state) {
    case "denied":
      break;
    case "granted":
      registerAndSubscribe();
      break;
    case "default":
      registerAndSubscribe();
      break;
  }
}
