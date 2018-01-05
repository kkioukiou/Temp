"use strict";

function printFullArray(array) {
    clearOutPrint();
    for (var i = 0; i < array.length; i++){
        list.addItem(array[i].id, array[i].itemValue, array[i].checked, array[i].children, array[i].labels, array[i].remindMe);
    }
}

function clearOutPrint(){
    $('.to-do-list li').remove();
}

function clearLabelsList() {
    $(".labelClass").remove();
}

function printLabelsArray(array) {
    clearLabelsList();
    for (var i = 0; i < array.length; i++){
        labels.addLabel(array[i].labelId, array[i].labelName, array[i].owner);
    }
}

function printLabelsForEveryItemArray(array) {
    clearLabelsListForEveryItem();
    for (var i = 0; i < array.length; i++){
        var label = new LabelsForAddLabelToItem(array[i].labelId, array[i].labelName, array[i].owner);
        $(".to-do-item-labels").append(label.element);
    }
}

function clearLabelsListForEveryItem() {
    $(".labels-for-every-item").remove();
}

var labels = new ToDoLabels();
var list = new ToDoList();
var toDoRepository = new ToDoRepository();
toDoRepository.getAllLabels();
toDoRepository.getItems();

$(".to-do-labels").append(labels.element);
$(".to-do-list").append(list.element);

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function registerServiceWorker() {
    return navigator.serviceWorker.register('scripts/notification/sw.js')
        .then(function(registration) {
            console.log('Service worker successfully registered.');
            return registration;
        })
        .catch(function(err) {
            console.error('Unable to register service worker.', err);
        });
}

function askPermission() {
    return new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
        .then(function(permissionResult) {
            if (permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.');
            }
        });
}

function subscribeUserToPush() {
    return navigator.serviceWorker.register('scripts/notification/sw.js')
        .then(function(registration) {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array(
                    'BA_9nVWnjtYJojn0_YFJfnifDmOo0J2BwduG5Vt2AX8nHcjODBAXH6MjyvtrboaZ4H68yRLvLftlNce9qqFsGyI' //private key : a6pVPOQRaPSfDTXgodyXzsKjVTsGmg87S3gnIUcnwxM
                )
            };

            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then(function(pushSubscription) {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            return pushSubscription;
        })
        .then(function (pushSubscription) {
            const subscriptionObjectToo = JSON.stringify(pushSubscription);
            sendSubscriptionToServer(pushSubscription);
        });
}

function sendSubscriptionToServer(subscription) {

    // Get public key and user auth from the subscription object
    var key = subscription.getKey ? subscription.getKey('p256dh') : '';
    var auth = subscription.getKey ? subscription.getKey('auth') : '';

    // This example uses the new fetch API. This is not supported in all
    // browsers yet.
    toDoRepository.notificationSubscribe(JSON.stringify({
        endpoint: subscription.endpoint,
        // Take byte[] and turn it into a base64 encoded string suitable for
        // POSTing to a server over HTTP
        key: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
        auth: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
    }));
    // return fetch('/api/todo/subscription', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         endpoint: subscription.endpoint,
    //         // Take byte[] and turn it into a base64 encoded string suitable for
    //         // POSTing to a server over HTTP
    //         key: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
    //         auth: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
    //     })
    // });
}

// function sendSubscriptionToBackEnd(subscription) {
//     return fetch('/api/save-subscription/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(subscription)
//     })
//         .then(function(response) {
//             if (!response.ok) {
//                 throw new Error('Bad status code from server.');
//             }
//
//             return response.json();
//         })
//         .then(function(responseData) {
//             if (!(responseData.data && responseData.data.success)) {
//                 throw new Error('Bad response from server.');
//             }
//         });
// }

//
// /**
//  * Step one: run a function on load (or whenever is appropriate for you)
//  * Function run on load sets up the service worker if it is supported in the
//  * browser. Requires a serviceworker in a `sw.js`. This file contains what will
//  * happen when we receive a push notification.
//  * If you are using webpack, see the section below.
//  */
// $(function () {
//     if ('serviceWorker' in navigator) {
//         navigator.serviceWorker.register('scripts/notification/sw.js').then(initialiseState);
//     } else {
//         console.warn('Service workers are not supported in this browser.');
//     }
// });
//
// /**
//  * Step two: The serviceworker is registered (started) in the browser. Now we
//  * need to check if push messages and notifications are supported in the browser
//  */
// function initialiseState() {
//
//     // Check if desktop notifications are supported
//     if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
//         console.warn('Notifications aren\'t supported.');
//         return;
//     }
//
//     // Check if user has disabled notifications
//     // If a user has manually disabled notifications in his/her browser for
//     // your page previously, they will need to MANUALLY go in and turn the
//     // permission back on. In this statement you could show some UI element
//     // telling the user how to do so.
//     if (Notification.permission === 'denied') {
//         console.warn('The user has blocked notifications.');
//         return;
//     }
//
//     // Check is push API is supported
//     if (!('PushManager' in window)) {
//         console.warn('Push messaging isn\'t supported.');
//         return;
//     }
//
//     navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
//
//         // Get the push notification subscription object
//         serviceWorkerRegistration.pushManager.getSubscription().then(function (subscription) {
//
//             // If this is the user's first visit we need to set up
//             // a subscription to push notifications
//             if (!subscription) {
//                 console.log("true");
//                 subscribe();
//
//                 return;
//             }
//
//             // Update the server state with the new subscription
//             sendSubscriptionToServer(subscription);
//         })
//             .catch(function(err) {
//                 // Handle the error - show a notification in the GUI
//                 console.warn('Error during getSubscription()', err);
//             });
//     });
// }
//
// /**
//  * Step three: Create a subscription. Contact the third party push server (for
//  * example mozilla's push server) and generate a unique subscription for the
//  * current browser.
//  */
// function subscribe() {
//     navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
//
//         // Contact the third party push server. Which one is contacted by
//         // pushManager is  configured internally in the browser, so we don't
//         // need to worry about browser differences here.
//         //
//         // When .subscribe() is invoked, a notification will be shown in the
//         // user's browser, asking the user to accept push notifications from
//         // <yoursite.com>. This is why it is async and requires a catch.
//         serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true}).then(function (subscription) {
//
//             // Update the server state with the new subscription
//             return sendSubscriptionToServer(subscription);
//         })
//             .catch(function (e) {
//                 if (Notification.permission === 'denied') {
//                     console.warn('Permission for Notifications was denied');
//                 } else {
//                     console.error('Unable to subscribe to push.', e);
//                 }
//             });
//     });
// }
//
// /**
//  * Step four: Send the generated subscription object to our server.
//  */
// function sendSubscriptionToServer(subscription) {
//
//     // Get public key and user auth from the subscription object
//     var key = subscription.getKey ? subscription.getKey('p256dh') : '';
//     var auth = subscription.getKey ? subscription.getKey('auth') : '';
//
//     // This example uses the new fetch API. This is not supported in all
//     // browsers yet.
//     return fetch('/profile/subscription', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             endpoint: subscription.endpoint,
//             // Take byte[] and turn it into a base64 encoded string suitable for
//             // POSTing to a server over HTTP
//             key: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
//             auth: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
//         })
//     });
// }