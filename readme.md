# Truck Client & Server Repository

This repository contains two separate projects:

- **Client:** An Angular application that provides the user interface for searching available trucks.
- **Server:** An Express (Node.js) backend that integrates with the PC\*MILER API to calculate ground miles.

## Prerequisites

- [Node.js](https://nodejs.org/) (recommended LTS version)
- npm (comes with Node.js)
- (Optional) [nvm](https://github.com/nvm-sh/nvm) for managing Node versions
- (Optional) Angular CLI installed globally:
  ```bash
  npm install -g @angular/cli
  ```

## Repository Structure

```
.
├── client                # Angular frontend application
│   ├── angular.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── src
│   │   ├── app
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── pages
│   │   │   └── truck-search
│   │   │       ├── truck-search.component.html
│   │   │       └── truck-search.component.ts
│   │   ├── services
│   │   │   ├── pc-miler.service.ts
│   │   │   └── truck.service.ts
│   │   └── styles.scss
│   └── tsconfig*.json
├── server                # Express backend server
│   ├── package.json
│   └── server.js
└── readme.md             # This file
```

## Setup & Running the Projects

### 1. Setup & Run the Server

The server provides an API endpoint that calculates driving distances using PC\*MILER.

1. **Navigate to the server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the `server` directory with the following content (adjust values as needed):

   ```env
   PCMILER_API_URL=https://api.pcmiler.com/computeDistance
   PCMILER_API_KEY=your_pcmiler_api_key_here
   PORT=3000
   ```

4. **Start the Server:**
   ```bash
   npm start
   ```
   The server should now be running at [http://localhost:3000](http://localhost:3000).

### 2. Setup & Run the Client

The client is an Angular application that calls the backend to search for trucks based on ground miles.

1. **Open a new terminal window and navigate to the client directory:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the Angular Development Server:**
   ```bash
   ng serve
   ```
   The application will be available at [http://localhost:4200](http://localhost:4200).

## Additional Notes

- **CORS:**  
  The server uses the `cors` package to allow cross-origin requests. If you run into any CORS issues, ensure that the CORS middleware is correctly configured in `server.js`.

- **Tailwind CSS:**  
  The Angular project uses Tailwind CSS. The Tailwind configuration is defined in `postcss.config.mjs` and your styles are imported in `src/styles.scss`. Ensure that the Tailwind directives are correctly set:

  ```scss
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

- **PC\*MILER Integration:**  
  The PC\*MILER service (`pc-miler.service.ts`) is integrated on the backend. Make sure you have valid API credentials in your `.env` file.

- **Node Version:**  
  If you encounter issues with your Node version, consider using [nvm](https://github.com/nvm-sh/nvm) to switch versions:
  ```bash
  nvm install <version>
  nvm use <version>
  ```

## Troubleshooting

- **Common Angular Build Issues:**  
  Make sure you have the required Angular CLI version installed and that your dependencies are up to date.

- **Server API Issues:**  
  Check the server logs for errors. Ensure that your PC\*MILER API URL and key are correct and that the API is reachable.

## Contact

For any issues or questions, please open an issue in this repository or contact the maintainer at [simon.el.mansoury@gmail.com](mailto:simon.el.mansoury@gmail.com).
