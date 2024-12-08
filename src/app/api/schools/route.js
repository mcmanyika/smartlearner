import { database } from '../../../../utils/firebaseConfig';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    let schoolsRef = ref(database, 'schools');

    if (location) {
      schoolsRef = query(
        schoolsRef,
        orderByChild('location'),
        equalTo(location)
      );
    }

    const snapshot = await get(schoolsRef);
    const schools = snapshot.val() || {};

    return NextResponse.json(Object.entries(schools).map(([id, data]) => ({
      id,
      ...data
    })));
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
} 