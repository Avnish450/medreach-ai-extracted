import { NextRequest, NextResponse } from 'next/server';
import { doctors } from '@/lib/data/doctors';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty');
    const availableOnly = searchParams.get('availableOnly') === 'true';
    const maxFee = searchParams.get('maxFee') ? parseInt(searchParams.get('maxFee') || '0', 10) : null;
    const minExperience = searchParams.get('minExperience') ? parseInt(searchParams.get('minExperience') || '0', 10) : null;
    const searchQuery = searchParams.get('searchQuery')?.toLowerCase() || '';

    let filteredDoctors = [...doctors];

    if (specialty && specialty !== 'All') {
      filteredDoctors = filteredDoctors.filter(
        d => d.specialty.toLowerCase() === specialty.toLowerCase()
      );
    }

    if (availableOnly) {
      filteredDoctors = filteredDoctors.filter(d => d.availabilityStatus === 'available');
    }

    if (maxFee !== null && maxFee > 0) {
      filteredDoctors = filteredDoctors.filter(d => d.consultationFee <= maxFee);
    }

    if (minExperience !== null && minExperience > 0) {
      filteredDoctors = filteredDoctors.filter(d => d.experience >= minExperience);
    }

    if (searchQuery) {
      filteredDoctors = filteredDoctors.filter(
        d => d.name.toLowerCase().includes(searchQuery) ||
          d.specialty.toLowerCase().includes(searchQuery) ||
          d.clinicName.toLowerCase().includes(searchQuery)
      );
    }

    return NextResponse.json(filteredDoctors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }

}
