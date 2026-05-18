import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import NavBar from './components/NavBar/NavBar';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

const RootLayout: React.FC = () => (
  <div>
    <NavBar />
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
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
  return <RouterProvider router={router} />;
}

export default App;
