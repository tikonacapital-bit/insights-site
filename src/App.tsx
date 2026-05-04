import { Navigate, Route, Routes } from "react-router-dom";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import CalculatorsPage from "./pages/CalculatorsPage";
import AllBlogsPage from "./pages/AllBlogsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<BlogListPage />} />
        <Route path="/post" element={<AllBlogsPage />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/post/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
