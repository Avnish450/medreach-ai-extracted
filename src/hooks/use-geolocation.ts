import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location>({ lat: 28.6139, lng: 77.2090 }); // Default Delhi
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Defer state updates to avoid React lint warnings about setState in effects.
      queueMicrotask(() => {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);


  return { location, error, loading };
}
