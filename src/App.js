import React from 'react';
import ContactForm from './components/sections/contactForm';
import TeamSection from './components/sections/teamSection';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-900 text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">BDSM Software</h1>
        <p className="text-xl text-gray-300">Building Digital Solutions for Modern Success</p>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <TeamSection />
        <div className="mt-16">
          <ContactForm />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BDSM Software. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;