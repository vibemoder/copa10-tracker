import React, { useEffect } from 'react';

interface Props {
  isLoggedIn: boolean;
}

export default function LocationSync({ isLoggedIn }: Props) {
  useEffect(() => {
    if (!isLoggedIn) return;

    // Try to get location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          await fetch('/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
          });
        } catch (error) {
          console.error('Failed to sync location:', error);
        }
      }, (error) => {
        console.warn('Geolocation error:', error.message);
      }, {
        enableHighAccuracy: false, // Low accuracy is fine for anonymity
        timeout: 5000,
        maximumAge: 3600000 // 1 hour
      });
    }
  }, [isLoggedIn]);

  return null; // This component doesn't render anything
}
