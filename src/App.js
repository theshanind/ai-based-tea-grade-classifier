import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing_page/landing_page';
import LoginPage from './components/login_page/login_page.jsx';
import RegisterPage from './components/register_page/register_page.jsx';
import DashboardPage from './components/dashboard_page/dashboard_page.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/dashboard' element={<DashboardPage/>}/>
      </Routes>
    </BrowserRouter>

  );
}
export default App;
