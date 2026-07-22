import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

// Lazy load feature modules logic to ensure fast initial bundle load
const FocusedIssues = lazy(() => import('./pages/FocusedIssues'));
const DigitalMap = lazy(() => import('./pages/DigitalMap'));
const FAQList = lazy(() => import('./pages/FAQList'));
const EcologicalMeasures = lazy(() => import('./pages/EcologicalMeasures'));

// Fallback loader while lazy-loading components
const PageLoader = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[400px]">
    <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route 
            path="issues" 
            element={
              <Suspense fallback={<PageLoader />}>
                <FocusedIssues />
              </Suspense>
            } 
          />
          <Route 
            path="map" 
            element={
              <Suspense fallback={<PageLoader />}>
                <DigitalMap />
              </Suspense>
            } 
          />
          <Route 
            path="faq" 
            element={
              <Suspense fallback={<PageLoader />}>
                <FAQList />
              </Suspense>
            } 
          />
          <Route 
            path="plants" 
            element={
              <Suspense fallback={<PageLoader />}>
                <EcologicalMeasures />
              </Suspense>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
