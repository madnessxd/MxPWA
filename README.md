# Mendix PWA - Precaching With Workbox

In this __How to!__ we'll see how we can convert our mendix app to a PWA and enable precaching for the static resources using [Workbox](https://developers.google.com/web/tools/workbox/).

<p align='center'>
<img src='https://github.com/madnessxd/MxPWA/blob/development/mendix_pwa.png' width="375px" alt='logo'>
</p>


***

## Prerequisites:

1. You need to have [Nodejs](https://nodejs.org/en/) installed on your machine.

2. You need to install [Workbox CLI](https://developers.google.com/web/tools/workbox/modules/workbox-cli) globally on your machine:

```sh
> npm install workbox-cli --global
```
3. You need to have [Lighthouse](https://developers.google.com/web/tools/lighthouse/) on your machine (You can skip this step if you have chrome installed on your machine).

4. The explanation is assuming that you have a blank mendix app (this does __NOT__ mean that you cannot use it for an existing app, but rather for the seek of clarity in folder structures and naming conventions).

***

## Implementation:

**1.** First, let's start by copying some files into our mendix app.

__>>__ Copy the following files in the `MX_APP_ROOT_FOLDER/theme` folder:

* [robots.txt](https://github.com/madnessxd/MxPWA/blob/master/robots.txt), [learn more](https://support.google.com/webmasters/answer/6062608).

* [manifest.json](https://github.com/madnessxd/MxPWA/blob/master/manifest.json), [learn more](https://developer.mozilla.org/en-US/docs/Web/Manifest).
```js
//manifest.json
{
  "short_name": "Mendix PWA",
  "name": "Mendix Starter PWA",
  "start_url": "index.html",
  "icons": [
    {
      "src": "logo.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "logo.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "display": "standalone",
  "theme_color": "#0595DB",
  "background_color": "#ffffff"
}
```
* [logo.png](https://github.com/madnessxd/MxPWA/blob/master/logo.png) your app's logo.

* [swRegister.js](https://github.com/madnessxd/MxPWA/blob/master/swRegister.js) this script will register the service worker in the browser.

__>>__ Copy the following files in the `MX_APP_ROOT_FOLDER` folder:

* [workbox-config.js](https://github.com/madnessxd/MxPWA/blob/master/workbox-config.js), the configuration file which will be used by `workbox` to generate the service worker.

> This configurations understand how a mendix application works. However, you can customize it for your app's needs, for more information check [here](https://developers.google.com/web/tools/workbox/modules/workbox-cli#configuration).

```js
module.exports = {
  globDirectory: "deployment/web", // as the static resources will be
  globPatterns: [
    "**/*.{png,ico,jpg,gif,eot,svg,ttf,woff,woff2,txt}",
  ],
  globIgnores: [
    "preview/*",
    "index-example.html"
  ],
  // set URLs that served by the server and you do nt have direct access to them from within your project.
  // e.g. in a mendix application the client js & css
  // e.g. if your styles request external resources fonts, images, etc..
  templatedURLs: {
    "mxclientsystem/mxui/mxui.js": "mxui-client-core",
    "mxclientsystem/mxui/ui/mxui.css": "mxui-styling",
    "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700":
      "font-set-1",
  },
  // here you set URLs patterns for the resources the will be requested in runtime, or later by user interaction
  // you may will customize this for the needs of your application
  runtimeCaching: [
    {
      // Match any same-origin request that contains has the following path.
      urlPattern: /mxclientsystem\/dojo/,
      // Apply a cache-first strategy.
      handler: "CacheFirst",
    },
    {
      // Match any cross-origin request that contains that comes from this origin.
      urlPattern: /https:\/\/fonts\.googleapis\.com/,
      // Apply a cache-first strategy.
      handler: "CacheFirst",
    },
  ],
  // generate a service worker file 'sw.js' and put it in 'theme' folder.
  swDest: "theme/sw.js",
  ignoreURLParametersMatching: [/./], // this is needed to ignore mx cache busting
  cleanupOutdatedCaches: true,
  cacheId: "MxApp-Cache",
  // the following options make it possible to enable skipWaiting so that newer version of the service worker
  // get activated immediately, rather than waiting until a user closes the app. By default both values are set
  // to false, both need to be set to true if you wish to enforce refresh immediately after receiving updates
  skipWaiting: false,
  clientsClaim: false
};


```

**2.** Add the required meta tags & scripts to `MX_APP_ROOT_FOLDER/theme/index.html` file.

__>>__ add the following tags inside your `<head>...</head>` tag:
```html
        <meta name="description" content="This a Mendix PWA Starter App.">
        <meta name="theme-color" content="#ffffff">
        <link rel="manifest" href="/manifest.json">
        <link rel="apple-touch-icon" href="logo.png">
```
__>>__ add the following `<noscript>...</noscript>` tag inside your `<body>...</body>` tag:
```html
        <noscript>
            <div class="container noscript-container">
                <h3>Please enable javascript in your browser</h3>
                <h4><a class="mx-link" href='https://www.wikihow.com/Enable-JavaScript'>How to enable javascript in my browser</a></h4>
            </div>
        </noscript>
```
__>>__ add the following script before the closing `body` tag:
```html
      ....
      <script src="swRegister.js"></script>
      </body>
      ....
```
Your `index.html` file should look like this example file: [index.example.html](https://github.com/madnessxd/MxPWA/blob/master/index.example.html).
> **Note**: If you're targeting IOS devices, please consider checking this [article](https://medium.com/appscope/designing-native-like-progressive-web-apps-for-ios-1b3cdda1d0e8) as well, as we are here focusing on android devices.

**3.** Generating service worker using workbox.

__>>__ Open your command line in your `MX_APP_ROOT_FOLDER` and run the following command:
```sh
> workbox generateSW
```
This command will make use of the configurations in our `workbox-config.js` to generate a service worker `sw.js` in the `theme` folder of our app.

> **Note**: before running this command, make sure that you have built your application (in other words your `deployment/web` folder is not empty) by running the app locally this folder will be generated.

🚀🚀 Now everything is set, re-rurn your app, and then it has all the required settings/files for a PWA, you can check if you're app has become a PWA using [Lighthouse](https://developers.google.com/web/tools/lighthouse/)



**4.** Repeat.

Perform this command each time you have change in your static assets (mendix pages are also considered static assets).
> You're most likely going to perform this only before creating your (test/accpetance/production) build.




***
## Development Tips:

1. When running locally, it is recommended to use specific port numbers for developing PWAs which is different from the the ones you use for the normal web apps as the PWAs make use of service workers which will be registered in the browser and linked to your app domain and intercept requests for resources to this domain and return the resources from the cache if these resources are already cached, therefore using the same port numbers **without clearing the cache** when switching between apps could lead to the wrong assets being served, e.g. consider you have the app `my_pwa` is running on `localhost:3000`, this app registered a service worker and this service worker saved `index.html` in the cache, now you want to work on your `my_normal_app` (not a pwa) which is also running on `localhost:3000`, if `my_normal_app` requests `index.html` the already registered service worker will intercept this request and return back the cached `index.html` which belongs to a completely different app and that's completely wrong and confusing, so make sure to clear your cache and unregister service workers before switching to work on a different app that runs on the same port. 
