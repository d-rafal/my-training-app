import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Layout from "./components/layout/Layout";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import RequireAuth from "./components/requireAuth/RequireAuth";
import { lazy } from "react";

import AuthSide from "./routes/auth/AuthSide";
import ContextsProvider from "./components/contexts-provider/ContextsProvider";
import WelcomeDialog from "./components/welcome-dialog/WelcomeDialog";

const Trainings = lazy(() => import("./routes/trainings/Trainings"));
const Progress = lazy(() => import("./routes/progress/Progress"));
const Plan = lazy(() => import("./routes/plan/Plan"));
const NoMatch = lazy(() => import("./routes/no-match/NoMatch"));
const Profile = lazy(() => import("./routes/profile/Profile"));
const MyAccount = lazy(() => import("./routes/my-account/MyAccount"));
const Settings = lazy(() => import("./routes/settings/Settings"));

function App() {
  return (
    <ContextsProvider>
      {/* <BrowserRouter basename="/my-training-app-v3"> */}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout navbar={<Navbar />} footer={<Footer />} />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate replace to="trainings" />} />
            <Route path="trainings/*" element={<Outlet />}>
              <Route path="" element={<Trainings />} />
              <Route path="*" element={<NoMatch />} />
            </Route>
            <Route path="progress" element={<Progress />} />
            <Route path="plan" element={<Plan />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
          <Route path="/login" element={<AuthSide />} />
        </Routes>
      </BrowserRouter>
      <WelcomeDialog />
    </ContextsProvider>
  );
}

export default App;
