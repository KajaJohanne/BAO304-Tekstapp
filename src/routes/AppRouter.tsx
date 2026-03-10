import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/applications/HomePage/HomePage";
import CreateApplicationPage from "../pages/applications/CreateApplicationPage/CreateApplicationPage";
import ApplicationDetailPage from "../pages/applications/ApplicationDetailPage/ApplicationDetailPage";
import CreateTextKeyPage from "../pages/textKeys/CreateTextKeyPage/CreateTextKeyPage";
import LoginPage from "../pages/LoginPage";
import TextKeyDetailPage from "../pages/textKeys/TextKeyDetailPage/TextKeyDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import SectionPage from "../pages/applications/SectionPage/SectionPage";
import SubSectionPage from "../pages/applications/SubSectionPage/SubSectionPage";
import AllTextKeysPage from "../pages/textKeys/AllTextKeysPage/AllTextKeysPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-application" element={<CreateApplicationPage />} />
        <Route
          path="/applicationDetails/:id"
          element={<ApplicationDetailPage />}
        />
        <Route path="/create-textkey" element={<CreateTextKeyPage />} />
        <Route path="/textkeys" element={<AllTextKeysPage />} />
        <Route path="/section" element={<SectionPage />} />
        <Route path="/subSection" element={<SubSectionPage />} />
        <Route path="/textkeyDetails/:id" element={<TextKeyDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
