import  { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route ,useLocation } from "react-router-dom";
import PageTransition from "./components/PageTransition"; // Import your PageTransition component
import Home from "./pages/Home";
import LicNeemuchPage from './pages/LicNeemuchPage';
import KileshwarMahadevPage from './pages/KileshwarMahadevPage';
import LicCaseStudy from './pages/LicCaseStudy';
import SanjayCaseStudy from './pages/SanjayCaseStudy';
import homePage from "./pages/homePage";

import ContactMe from "./pages/ContactMe";


import LicNeemuchSRS from "./pages/LicNeemuchSRS";

import BlogPage from "./components/BlogPage";
import BlogPost from './components/BlogPost';
import Projects from "./components/Projects";
import Skills from "./pages/Skills";
import Courses from "./pages/Courses";

import Experiences from "./pages/Experiences";
import Certifications from "./pages/Certifications";
import CertificationDetails from "./pages/CertificationDetails";
import Resume from './components/Resume';
import NotFound from "./pages/NotFound";
import ProtectedPage from './components/ProtectedPage';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProjectDetails from './components/ProjectDetails';
import Education from "./components/Education";
import Contact from "./components/Contact";
import Career from './components/Career';
import About from'./components/About';
import  Founder from './components/Founder';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page when the route changes.
  }, [pathname]);

  return null; // This component doesn't render anything.
};
const AppRouter = () => {
 
  return (
    <Router>
      <Navbar />

      <ScrollToTop />
      <Routes>
      <Route path="/founder-eduxcel" element={<Founder/>} />

                  <Route path="/" element={<homePage />} />
                  <Route path="/contact" element={<ContactMe />} />

          <Route path="/lic-neemuch" element={<LicNeemuchPage />} />
          <Route path="/kileshwar-mahadev-ji-neemuch" element={<KileshwarMahadevPage />} />
          <Route path="/lic-case-study" element={<LicCaseStudy/>} />
          <Route path="/lic-neemuch-srs" element={<LicNeemuchSRS/>} />

        
          <Route path="/sanjay-case-study" element={<SanjayCaseStudy/>} />
        <Route path="/projects" element={<Projects />} />
                <Route path="/courses-by-sanjay-patidar" element={<Courses />} />
        <Route path="/projects/:category" element={<Projects />} />
        <Route path="/project/:title" element={<ProjectDetails />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/experiences" element={<PageTransition><Experiences /></PageTransition>} />
        <Route path="/certifications" element={<PageTransition><Certifications /></PageTransition>} />
        <Route path="/certifications/:title" element={<PageTransition><CertificationDetails /></PageTransition>} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/blogs/*" element={<BlogPage />} />
      <Route path="/:vision/*" element={<BlogPost/>} />
        <Route path="/education" element={<PageTransition><Education /></PageTransition>} />
        <Route path="/protected" element={<PageTransition><ProtectedPage /></PageTransition>} />
        <Route path="/contact" element={<Contact />}/>
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        <Route path="/careers/*" element={<Career />} />

      </Routes>
      <Footer/>
    </Router>
  );
};
const HomeWithBlogSuggestion = () => {
  return (
    <>
      <Home />

   
    </>
  );
};

export default AppRouter;
