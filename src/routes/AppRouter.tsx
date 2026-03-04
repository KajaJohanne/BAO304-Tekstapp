import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import ApplicationDetailPage from "../pages/ApplicationDetailPage"
import LoginPage from "../pages/LoginPage"
import TextKeyDetailPage from "../pages/TextKeyDetailPage"
import NotFoundPage from "../pages/NotFoundPage"
import ProfilePage from "../pages/ProfilePage"
import SectionPage from "../pages/SectionPage"
import SubSectionPage from "../pages/SubSectionPage"


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />}/>
                <Route path="/" element={<HomePage />}/>
                <Route path="/applicationDetails" element={<ApplicationDetailPage />}/>
                <Route path="/section" element={<SectionPage />}/>
                <Route path="/subSection" element={<SubSectionPage />}/>
                <Route path="/textkeyDetails" element={<TextKeyDetailPage />}/>
                <Route path="/profile" element={<ProfilePage />}/>
                <Route path="*" element={<NotFoundPage />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;