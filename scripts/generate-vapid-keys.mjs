/**
 * Prints a new VAPID key pair for Web Push. Set both values as environment
 * variables (e.g. in Railway). Generate once: changing the keys invalidates
 * every existing push subscription.
 * Run with: npm run vapid
 */
import webpush from "web-push";

const { publicKey, privateKey } = webpush.generateVAPIDKeys();

console.log(`VAPID_PUBLIC_KEY=${publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${privateKey}`);
