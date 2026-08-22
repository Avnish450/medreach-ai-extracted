import { NextRequest, NextResponse } from 'next/server';
import { demoClinics } from '@/lib/data/clinics';
import { calculateDistance } from '@/lib/utils';
import { Clinic } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const specialty = searchParams.get('specialty') || '';
    const radiusStr = searchParams.get('radius') || '5000'; // 5km default

    const lat = latStr ? parseFloat(latStr) : 28.6139; // default Delhi
    const lng = lngStr ? parseFloat(lngStr) : 77.2090;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    let clinicsResult: Clinic[] = [];
    let isLiveGoogleData = false;

    if (apiKey && apiKey.trim() !== '') {
      try {
        // Construct targeted search query based on selected specialty
        let typeQuery = 'hospital|doctor|pharmacy';
        let keywordQuery = '';

        if (specialty && specialty !== 'All') {
          if (specialty === 'Emergency') {
            keywordQuery = `&keyword=emergency`;
          } else {
            keywordQuery = `&keyword=${encodeURIComponent(specialty.toLowerCase() + ' clinic')}`;
          }
        }

        // Fetch from Google Places Nearby Search API
        const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusStr}&type=${typeQuery}${keywordQuery}&key=${apiKey}`;
        
        const response = await fetch(endpoint, {
          headers: { 'Accept': 'application/json' },
          next: { revalidate: 60 } // cache for 1 minute
        });
        
        const data = await response.json();

        if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
          isLiveGoogleData = true;
          clinicsResult = data.results.map((place: {
            geometry?: { location?: { lat: number; lng: number } };
            opening_hours?: { open_now?: boolean };
            business_status?: string;
            types?: string[];
            place_id?: string;
            name?: string;
            vicinity?: string;
            rating?: number;
            user_ratings_total?: number;
          }, index: number) => {
            const placeLat = place.geometry?.location?.lat ?? lat;
            const placeLng = place.geometry?.location?.lng ?? lng;
            const distance = calculateDistance(lat, lng, placeLat, placeLng);
            const isOpen = place.opening_hours?.open_now ?? (place.business_status === 'OPERATIONAL');

            const placeTypes = place.types || [];
            const isHospital = placeTypes.includes('hospital');

            // Dynamic specialty tagging
            const specialtiesList = ['General Medicine'];
            if (isHospital) specialtiesList.push('Emergency Medicine', 'Critical Care');
            if (placeTypes.includes('doctor')) specialtiesList.push('Family Medicine');
            if (placeTypes.includes('pharmacy')) specialtiesList.push('Pharmacy & Diagnostics');
            if (specialty && specialty !== 'All' && !specialtiesList.includes(specialty)) {
              specialtiesList.push(specialty);
            }

            return {
              id: place.place_id || `google-${index}`,
              name: place.name || 'Medical Center',
              type: isHospital ? 'hospital' : 'clinic',
              address: place.vicinity || 'Address available on map',
              distance,
              rating: place.rating ? Number(place.rating.toFixed(1)) : 4.2,
              reviewCount: place.user_ratings_total || 25,
              isOpen,
              openHours: isOpen ? 'Open Now (Live)' : 'Closed',
              phone: '+91-11-XXXXXXXX',
              specialties: specialtiesList,
              location: {
                lat: placeLat,
                lng: placeLng
              },
              isEmergency: isHospital
            };
          });
        }
      } catch (err) {
        console.error('Failed to fetch from Google Places API:', err);
      }
    }

    // Fallback or Mock data recalculating distances
    if (clinicsResult.length === 0) {
      clinicsResult = demoClinics.map(clinic => {
        const distance = calculateDistance(lat, lng, clinic.location.lat, clinic.location.lng);
        return {
          ...clinic,
          distance
        };
      });
    }

    // Filter by specialty if provided and not live-queried
    if (!isLiveGoogleData && specialty && specialty !== 'All') {
      clinicsResult = clinicsResult.filter(clinic =>
        clinic.specialties.some(spec => spec.toLowerCase().includes(specialty.toLowerCase()))
      );
    }

    // Sort by distance ascending
    clinicsResult.sort((a, b) => a.distance - b.distance);

    return NextResponse.json(clinicsResult, {
      headers: {
        'x-data-source': isLiveGoogleData ? 'google-places-live' : 'mock-fallback'
      }
    });
  } catch (error) {
    console.error('API Clinics Error:', error);
    return NextResponse.json({ error: 'Failed to fetch clinics' }, { status: 500 });
  }
}
