import * as React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import AppOnError from "./AppOnError";
import ErrorBoundary from "./components/error-boundary/ErrorBoundary";
import { CssBaseline } from "@mui/material";

import "./auxiliary/heightAdjustment";
import { worker } from "./mocks/server";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

const start = async () => {
  await worker.start({
    serviceWorker: {
      ...(process.env.NODE_ENV !== "development"
        ? { url: "/my-training-app/mockServiceWorker.js" }
        : null),
    },
    onUnhandledRequest: "bypass",
  });

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <CssBaseline />
      <ErrorBoundary renderOnError={(error) => <AppOnError error={error} />}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

start();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
