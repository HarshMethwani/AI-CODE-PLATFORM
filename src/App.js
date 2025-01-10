import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import './styles.css'
const App = () => (
    <div className="app">
        <Header />
        <main>
            <Home />
        </main>
        <Footer />
    </div>
);

export default App;
