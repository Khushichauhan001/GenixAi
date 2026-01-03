import { SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'
 
 function Home() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <Navbar />

      {/* 🔐 Auth buttons (temporary or permanent) */}
      <div style={{ display: "flex", gap: "12px", padding: "16px" }}>
        {!isSignedIn && <SignInButton />}
        {isSignedIn && <UserButton />}
      </div>

      <Hero />
      <AiTools />
      <Testimonial />
      <Plan />
      <Footer />
    </>
  );
}

export default Home;
