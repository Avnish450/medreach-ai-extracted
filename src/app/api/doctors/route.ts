import { NextRequest, NextResponse } from 'next/server';
import { doctors } from '@/lib/data/doctors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty');
    const city = searchParams.get('city');
    const availableOnly = searchParams.get('availableOnly') === 'true';
    const emergencyOnly = searchParams.get('emergencyOnly') === 'true';
    const maxFeeRaw = searchParams.get('maxFee');
    const minFeeRaw = searchParams.get('minFee');
    const minExperience = searchParams.get('minExperience') ? parseInt(searchParams.get('minExperience') || '0', 10) : null;
    const searchQuery = searchParams.get('searchQuery')?.toLowerCase() || '';

    const maxFee = maxFeeRaw !== null ? parseInt(maxFeeRaw, 10) : null;
    const minFee = minFeeRaw !== null ? parseInt(minFeeRaw, 10) : null;

    let filteredDoctors = [...doctors];

    if (specialty && specialty !== 'All') {
      filteredDoctors = filteredDoctors.filter(
        d => d.specialty.toLowerCase() === specialty.toLowerCase()
      );
    }

    if (city && city !== 'All India') {
      filteredDoctors = filteredDoctors.filter(
        d => d.clinicCity.toLowerCase() === city.toLowerCase() ||
          (d.clinicState && d.clinicState.toLowerCase().includes(city.toLowerCase())) ||
          d.clinicCity.toLowerCase() === 'pan india'
      );
    }

    if (availableOnly) {
      filteredDoctors = filteredDoctors.filter(d => d.availabilityStatus === 'available');
    }

    if (emergencyOnly) {
      filteredDoctors = filteredDoctors.filter(d => d.isEmergencyAvailable === true);
    }

    // Filter by fee range: respect both min and max
    if (maxFee !== null && maxFee < 2500) {
      filteredDoctors = filteredDoctors.filter(d => d.consultationFee <= maxFee);
    }
    if (minFee !== null && minFee > 0) {
      filteredDoctors = filteredDoctors.filter(d => d.consultationFee >= minFee);
    }

    if (minExperience !== null && minExperience > 0) {
      filteredDoctors = filteredDoctors.filter(d => d.experience >= minExperience);
    }

    if (searchQuery) {
      filteredDoctors = filteredDoctors.filter(
        d => d.name.toLowerCase().includes(searchQuery) ||
          d.specialty.toLowerCase().includes(searchQuery) ||
          d.clinicName.toLowerCase().includes(searchQuery) ||
          d.clinicCity.toLowerCase().includes(searchQuery) ||
          (d.clinicState && d.clinicState.toLowerCase().includes(searchQuery))
      );
    }

    // Sort: available first, then by fee ascending
    filteredDoctors.sort((a, b) => {
      if (a.availabilityStatus === 'available' && b.availabilityStatus !== 'available') return -1;
      if (a.availabilityStatus !== 'available' && b.availabilityStatus === 'available') return 1;
      return a.consultationFee - b.consultationFee;
    });

    return NextResponse.json(filteredDoctors);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}
