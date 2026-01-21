import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlaceholderPage from './placeholder_components.jsx';
import LandingPage from './components/landing_page/landing_page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<PlaceholderPage pageName='login'/>}/>
        <Route path='/register' element={<PlaceholderPage pageName='Register'/>}/>
      </Routes>
    </BrowserRouter>

  );
}
export default App;
