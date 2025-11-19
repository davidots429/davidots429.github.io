import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogCategory from './pages/BlogCategory';
import BlogPost from './pages/BlogPost';
import ProjectList from './pages/ProjectList';
import ProjectCategory from './pages/ProjectCategory';
import ProjectPost from './pages/ProjectPost';
import AboutMe from './pages/AboutMe';
import AboutBlog from './pages/AboutBlog';
import Resume from './pages/Resume';
import Introduction from './pages/Introduction';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter basename="/">
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />
            
            {/* Projects - 반드시 Blog보다 먼저! */}
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:category" element={<ProjectCategory />} />
            <Route path="/projects/:category/:slug" element={<ProjectPost />} />
            
            {/* Blog - Projects 아래에 위치 */}
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:category" element={<BlogCategory />} />
            <Route path="/blog/:category/:slug" element={<BlogPost />} />
            
            {/* About */}
            <Route path="/about/me" element={<AboutMe />} />
            <Route path="/about/blog" element={<AboutBlog />} />
            
            {/* Documents */}
            <Route path="/document/resume" element={<Resume />} />
            <Route path="/document/introduction" element={<Introduction />} />
            
            {/* 404 - 마지막에 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
