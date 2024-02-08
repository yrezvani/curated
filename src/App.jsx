import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtGallery from './components/ArtGallery';
import ClassificationDetail from './components/ClassificationDetail';
import Home from './pages/Home'; 

const apiKey = '0f4dc3f5-f76a-40aa-adaf-78bcdc8f2e05';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page route */}
        <Route path="/art-gallery" element={<ArtGallery apiKey={apiKey} />} />
        <Route path="/classification/:classificationId" element={<ClassificationDetail apiKey={apiKey} />} />
      </Routes>
    </Router>
  );
}

export default App;
