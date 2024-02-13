import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtGallery from './pages/ArtGallery';
import ClassificationDetail from './pages/ClassificationDetail';
import Home from './pages/Home'; 
import ArtworkDetail from './pages/ArtworkDetail';
import NavBar from './components/NavBar';
import SearchResults from './pages/SearchResults';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import MyGallery from './pages/MyGallery';

const apiKey = '0f4dc3f5-f76a-40aa-adaf-78bcdc8f2e05';

function App() {
  return (
    <div className='page-container'>
      <div className="content-wrap">
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explorer" element={<ArtGallery apiKey={apiKey} />} />
            <Route path="/classification/:classificationId" element={<ClassificationDetail apiKey={apiKey} />} />
            <Route path="/artwork/:artworkId" element={<ArtworkDetail apiKey={apiKey} />} />
            <Route path="/search" element={<SearchResults apiKey={apiKey} />} />            
            <Route path="/my-gallery" element={<MyGallery />} />  
            <Route path="contact/*" element={<Contact />} />
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
  
}

export default App;
