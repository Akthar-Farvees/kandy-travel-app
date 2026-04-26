import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';

const HomePage = lazy(async () => {
  const module = await import('./pages/HomePage');
  return { default: module.HomePage };
});

const AdminLoginPage = lazy(async () => {
  const module = await import('./pages/AdminLoginPage');
  return { default: module.AdminLoginPage };
});

const AdminDashboardPage = lazy(async () => {
  const module = await import('./pages/AdminDashboardPage');
  return { default: module.AdminDashboardPage };
});

const NotFoundPage = lazy(async () => {
  const module = await import('./pages/NotFoundPage');
  return { default: module.NotFoundPage };
});

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="rounded-full border border-primary/20 bg-white px-6 py-3 text-sm font-medium text-secondary shadow-card">
          Loading admin session...
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="rounded-full border border-primary/20 bg-white px-5 py-2 text-sm font-medium text-secondary shadow-card">
        Loading page...
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            } />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />

            <Route
              path="*"
              element={
                <MainLayout>
                  <NotFoundPage />
                </MainLayout>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
