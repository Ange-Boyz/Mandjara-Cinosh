import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ScreeningProvider } from './hooks/useScreening.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';

// The landing page ships in the main bundle; everything else loads on demand,
// which keeps the first visit light on slower mobile connections.
const EventPage = lazy(() => import('./pages/EventPage.jsx'));
const BookingPage = lazy(() => import('./pages/BookingPage.jsx'));
const ConfirmationPage = lazy(() => import('./pages/ConfirmationPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const FaqPage = lazy(() => import('./pages/FaqPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

export default function App() {
  return (
    <ScreeningProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/next-screening" element={<EventPage />} />
          <Route path="/screening/:slug" element={<EventPage />} />
          <Route path="/ticket" element={<BookingPage />} />
          <Route path="/ticket/:reference" element={<ConfirmationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ScreeningProvider>
  );
}
