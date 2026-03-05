import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Scope from './components/Scope';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Scope />
      <Footer />
    </div>
  );
}

export default App;
