import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import NavBar from './components/NavBar/NavBar';
import FlyOut from './components/Flyout/Flyout'

import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import PokemonDetailPanel from './components/PokemonDetailPanel/PokemonDetailPanel';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';

const RootLayout: React.FC = () => (
  <div>
    <NavBar />
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
    <FlyOut />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <MainPage />,
        children: [
          {
            path: 'details/:detailId',
            element: <PokemonDetailPanel />,
          },
        ],
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: '404',
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />,
      },

    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />;
    </ThemeProvider>
  )
}

export default App;
