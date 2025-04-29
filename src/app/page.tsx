import { prisma } from '@/lib/prisma';
import { Prisma, nail_polish, Rating as PrismaRating } from '@prisma/client';
import PageClient from '@/components/PageClient';

interface PageProps {
  searchParams: {
    brand?: string;
    finish?: string;
    color?: string;
    search?: string;
    sort?: string;
    purchaseYear?: string;
    rating?: string;
    hasImage?: string;
  };
}

type Rating = 'A_PLUS' | 'A' | 'A_MINUS' | 'B_PLUS' | 'B' | 'B_MINUS' | 'C_PLUS' | 'C' | 'C_MINUS' | 'D_PLUS' | 'D' | 'D_MINUS' | 'F';

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string;
  colors: string[];
  finishes: string[];
  rating: string;
  link: string;
}

interface NailPolishWithRelations extends nail_polish {
  brands: { name: string };
  colors: { color: { name: string } }[];
  finishes: { finish: { name: string } }[];
}

export default async function Home({ searchParams }: PageProps) {
  // Build the where clause for filtering
  const where: Prisma.nail_polishWhereInput = {};

  // Brand filter
  if (searchParams.brand) {
    const brands = searchParams.brand.split(',');
    where.brands = {
      name: { in: brands }
    };
  }

  // Finish filter (multi-select)
  if (searchParams.finish) {
    const finishes = searchParams.finish.split(',');
    where.finishes = {
      some: {
        finish: {
          name: { in: finishes }
        }
      }
    };
  }

  // Color filter (multi-select)
  if (searchParams.color) {
    const colors = searchParams.color.split(',');
    where.colors = {
      some: {
        color: {
          name: { in: colors }
        }
      }
    };
  }

  // Rating filter (multi-select)
  if (searchParams.rating) {
    const ratings = searchParams.rating.split(',') as PrismaRating[];
    where.rating = { in: ratings };
  }

  // Image presence filter
  if (searchParams.hasImage === 'true') {
    where.image_url = { not: null };
  } else if (searchParams.hasImage === 'false') {
    where.image_url = null;
  }

  // Purchase year filter
  if (searchParams.purchaseYear) {
    where.purchase_year = parseInt(searchParams.purchaseYear, 10);
  }

  // Search filter
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { brands: { name: { contains: searchParams.search, mode: 'insensitive' } } }
    ];
  }

  // Build the orderBy clause for sorting
  let orderBy: Prisma.nail_polishOrderByWithRelationInput[] = [];

  switch (searchParams.sort) {
    case 'brand-desc':
      orderBy = [{ brands: { name: 'desc' } }, { name: 'asc' }];
      break;
    case 'name-asc':
      orderBy = [{ name: 'asc' }, { brands: { name: 'asc' } }];
      break;
    case 'name-desc':
      orderBy = [{ name: 'desc' }, { brands: { name: 'asc' } }];
      break;
    case 'rating-desc':
      orderBy = [{ rating: 'desc' }, { brands: { name: 'asc' } }, { name: 'asc' }];
      break;
    case 'rating-asc':
      orderBy = [{ rating: 'asc' }, { brands: { name: 'asc' } }, { name: 'asc' }];
      break;
    case 'updated-desc':
      orderBy = [{ updated_at: 'desc' }, { brands: { name: 'asc' } }, { name: 'asc' }];
      break;
    case 'updated-asc':
      orderBy = [{ updated_at: 'asc' }, { brands: { name: 'asc' } }, { name: 'asc' }];
      break;
    default: // brand-asc
      orderBy = [{ brands: { name: 'asc' } }, { name: 'asc' }];
  }

  // Fetch all unique brands, finishes, and colors for filters
  const [polishes, brands, finishes, colors] = await Promise.all([
    prisma.nail_polish.findMany({
      where,
      orderBy,
      include: {
        brands: true,
        colors: {
          include: {
            color: true
          }
        },
        finishes: {
          include: {
            finish: true
          }
        }
      }
    }),
    prisma.brands.findMany({
      orderBy: { name: 'asc' },
      select: { name: true }
    }),
    prisma.finishes.findMany({
      orderBy: { name: 'asc' },
      select: { name: true }
    }),
    prisma.colors.findMany({
      orderBy: { name: 'asc' },
      select: { name: true }
    })
  ]);

  const transformedPolishes = polishes.map((polish: NailPolishWithRelations): Polish => ({
    id: polish.id,
    brand: polish.brands.name,
    name: polish.name,
    imageUrl: polish.image_url || '',
    colors: polish.colors.map(c => c.color.name),
    finishes: polish.finishes.map(f => f.finish.name),
    rating: polish.rating?.toString() || '',
    link: polish.link || ''
  }));

  const currentFilters = {
    brand: typeof searchParams.brand === 'string' ? searchParams.brand.split(',') : [],
    finish: typeof searchParams.finish === 'string' ? searchParams.finish.split(',') : [],
    color: typeof searchParams.color === 'string' ? searchParams.color.split(',') : [],
    rating: typeof searchParams.rating === 'string' ? searchParams.rating.split(',') : [],
    search: typeof searchParams.search === 'string' ? searchParams.search : '',
    sort: typeof searchParams.sort === 'string' ? searchParams.sort : '',
    purchaseYear: typeof searchParams.purchaseYear === 'string' ? searchParams.purchaseYear : '',
    hasImage: typeof searchParams.hasImage === 'string' ? searchParams.hasImage : '',
  };

  return (
    <PageClient
      polishes={transformedPolishes}
      brands={brands.map((b: any) => b.name)}
      finishes={finishes.map((f: any) => f.name)}
      colors={colors.map((c: any) => c.name)}
      currentFilters={currentFilters}
    />
  );
}
