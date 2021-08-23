## Quick Start

Run the following commands:

```
npm install
npm start
```

This will install dependencies, and then start the app and mock API.

## React State Management

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The PluralSight author, Cory House, initialized the app with the following changes:

1. Added a mock API using [json-server](https://github.com/typicode/json-server). Configured `npm start` to run the app and mock API at the same time using [npm-run-all](https://www.npmjs.com/package/npm-run-all). See [Building Applications with React and Flux](https://app.pluralsight.com/library/courses/react-flux-building-applications/table-of-contents) for details on how to set this up from scratch.
2. Installed [react-router-dom](https://www.npmjs.com/package/react-router-dom), [history](https://www.npmjs.com/package/history) (React Router peer dependency), and [cross-env](https://www.npmjs.com/search?q=cross-env) for declaring environment variables.
3. Added some basic React components: Header, Footer, Spinner
4. Added styles to App.css
5. Added `/public/images`.
6. Added data fetching functions in `/src/services`.
7. Added db.json to root as json-server's mock database
8. Overwrote App.css with custom styles
9. Simplified index.js (removed service worker)
10. Deleted from src: index.css, logo.svg, serviceWorker.js, App.test.js
11. Deleted from public: logo files, manifest.json, robots.txt
12. Customized App.js and renamed to App.jsx

Steven Dunn built and modified the app while following the PuralSight course entitled: 'React State Management'.
