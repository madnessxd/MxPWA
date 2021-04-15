module.exports = {
  globDirectory: "deployment/web", // as the static resources will be
  globPatterns: [
    "**/*.{json,png,css,ico,jpg,gif,html,js,eot,svg,ttf,woff,woff2,txt,xml}",
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
