import { AddEditForm } from '@/components/AddEditForm';
import { getPolishById } from '@/lib/api/polish';
import type { NailPolishWithRelations } from '@/types/polish';
import type { Rating } from '@prisma/client';
import { PageHeader } from '@/components/PageHeader';

interface EditPageProps {
  params: {
    id: string;
  };
  searchParams: {
    polish?: string;
  };
}

export default async function EditPage({ params, searchParams }: EditPageProps) {
  let polish: NailPolishWithRelations;

  if (searchParams.polish) {
    try {
      polish = JSON.parse(decodeURIComponent(searchParams.polish));
    } catch (e) {
      console.error('Failed to parse polish data from URL:', e);
      polish = await getPolishById(params.id);
    }
  } else {
    polish = await getPolishById(params.id);
  }

  const transformedPolish = {
    id: polish.id,
    brand: polish.brands.name,
    name: polish.name,
    imageUrl: polish.image_url || undefined,
    colors: polish.colors.map(c => c.color.name),
    finishes: polish.finishes.map(f => f.finish.name),
    rating: polish.rating || undefined,
    link: polish.link || undefined,
    coats: polish.coats || undefined,
    notes: polish.notes || undefined,
    lastUsed: polish.last_used || undefined,
    totalBottles: polish.total_bottles || 1,
    emptyBottles: polish.empty_bottles || 0,
    isOld: polish.is_old || false
  };

  return (
    <>
      <PageHeader
        title={`Edit ${polish.brands.name} - ${polish.name}`}
      />
      <AddEditForm initialData={transformedPolish} isEditing={true} />
    </>
  );
}
