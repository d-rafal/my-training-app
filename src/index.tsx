import * as React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import store from "./store/store";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import AppOnError from "./AppOnError";
import ErrorBoundary from "./components/error-boundary/ErrorBoundary";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";

import "./auxiliary/heightAdjustment";
import { worker } from "./mocks/server";

const start = async () => {
  await worker.start({
    // serviceWorker: {
    // url: "/my-training-app-v3/mockServiceWorker.js",
    // },
    onUnhandledRequest: "bypass",
  });

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <CssBaseline />
      <ErrorBoundary renderOnError={(error) => <AppOnError error={error} />}>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

start();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
