import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Blog from '@/components/Blog';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Blog />
      <Footer />
    </div>
  );
};

export default Index;
