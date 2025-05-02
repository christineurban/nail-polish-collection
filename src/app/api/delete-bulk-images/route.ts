import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { images } = await request.json();

    // Validate request body
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Delete images from storage
    const { data, error } = await supabase.storage
      .from('nail-polish-images')
      .remove(images);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${images.length} images`,
      data
    });

  } catch (error) {
    console.error('Error deleting images:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete images',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
