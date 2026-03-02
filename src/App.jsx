import React, { useState } from 'react';
import HeroSearch from './components/HeroSearch';
import FlightResults from './components/FlightResults';
import BookingForm from './components/BookingForm';
import BookingConfirmation from './components/BookingConfirmation';
import BookingTracker from './components/BookingTracker';
import BlogList from './components/BlogList';
import BlogArticle from './components/BlogArticle';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StandaloneFormPage from './components/StandaloneFormPage';
import PublicPackagesList from './components/PublicPackagesList';
import UmrahPackageDetail from './components/UmrahPackageDetail';
import CustomerBookingWizard from './components/CustomerBookingWizard';

export default function App() {
  // home | results | booking | confirmation | tracker | blog | article
  const [page, setPage] = useState('home');
  const [searchParams, setSearchParams] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [validatedData, setValidatedData] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState(null);
  const [formSlug, setFormSlug] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState(null);
  const [completedBooking, setCompletedBooking] = useState(null);

  React.useEffect(() => {
    // Basic routing for direct links
    const path = window.location.pathname;
    if (path.startsWith('/forms/')) {
      const slug = path.replace('/forms/', '');
      setFormSlug(slug);
      setPage('form');
    } else if (path.startsWith('/blogs/')) {
      const slug = path.replace('/blogs/', '');
      setSelectedArticleSlug(slug);
      setPage('article');
    }
  }, []);

  const handleSearch = (params, flights) => {
    setSearchParams(params);
    setResults(flights);
    setPage('results');
  };

  const handleSelectFlight = (flight, validated) => {
    setSelectedFlight(flight);
    setValidatedData(validated);
    setPage('booking');
  };

  const handleBookingComplete = (result) => {
    setBookingResult(result);
    setPage('confirmation');
  };

  const handleReset = () => {
    setPage('home');
    setSearchParams(null);
    setResults([]);
    setSelectedFlight(null);
    setValidatedData(null);
    setBookingResult(null);
    setSelectedArticleSlug(null);
  };

  const handleViewPackage = (id) => {
    setSelectedPackageId(id);
    setPage('packageDetail');
  };

  const handleBookPackage = (pkg) => {
    setSelectedPackageForBooking(pkg);
    setPage('umrahBooking');
  };

  const handleBookingDone = (bookingData) => {
    setCompletedBooking(bookingData);
    setPage('bookingSuccess');
  };

  const handleReadArticle = (slug) => {
    setSelectedArticleSlug(slug);
    setPage('article');
  };

  const navigateTo = (target) => {
    if (target === 'home') handleReset();
    else setPage(target);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onLogoClick={handleReset}
        onTrackBooking={() => setPage('tracker')}
        onBlogClick={() => setPage('blog')}
        onPackagesClick={() => setPage('packages')}
      />

      <main style={{ flex: 1 }}>
        {page === 'home' && <HeroSearch onSearch={handleSearch} />}
        {page === 'results' && (
          <FlightResults
            results={results}
            searchParams={searchParams}
            onSelect={handleSelectFlight}
            onNewSearch={handleReset}
            onSearch={handleSearch}
          />
        )}
        {page === 'booking' && (
          <BookingForm
            flight={selectedFlight}
            validatedData={validatedData}
            searchParams={searchParams}
            onComplete={handleBookingComplete}
            onBack={() => setPage('results')}
          />
        )}
        {page === 'confirmation' && (
          <BookingConfirmation
            result={bookingResult}
            flight={selectedFlight}
            searchParams={searchParams}
            onNewSearch={handleReset}
          />
        )}
        {page === 'packages' && (
          <PublicPackagesList
            onBack={handleReset}
            onViewPackage={handleViewPackage}
          />
        )}
        {page === 'packageDetail' && (
          <UmrahPackageDetail
            packageId={selectedPackageId}
            onBack={() => setPage('packages')}
            onBook={handleBookPackage}
          />
        )}
        {page === 'umrahBooking' && selectedPackageForBooking && (
          <CustomerBookingWizard
            pkg={selectedPackageForBooking}
            onBack={() => setPage('packageDetail')}
          />
        )}
        {page === 'tracker' && (
          <BookingTracker onBack={handleReset} />
        )}
        {page === 'blog' && (
          <BlogList onReadArticle={handleReadArticle} />
        )}
        {page === 'article' && (
          <BlogArticle slug={selectedArticleSlug} onBack={() => setPage('blog')} />
        )}
        {page === 'form' && (
          <StandaloneFormPage slug={formSlug} onBack={handleReset} />
        )}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
