import React from 'react';
import { createRoot } from 'react-dom/client';
import GymApp from './components/GymApp';
import './styles/globals.css';
import './styles/mobile-layout.css';
const mobileOnly = /\/mobile\/?$/.test(location.pathname);
createRoot(document.getElementById('root')!).render(<React.StrictMode><GymApp mobileOnly={mobileOnly}/></React.StrictMode>);
