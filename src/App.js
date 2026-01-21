import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlaceholderPage from './placeholder_components.jsx';
import LandingPage from './components/landing_page/landing_page';
import LoginPage from './components/login_page/login_page.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<PlaceholderPage pageName='Register'/>}/>
      </Routes>
    </BrowserRouter>

  );
}
export default App;
