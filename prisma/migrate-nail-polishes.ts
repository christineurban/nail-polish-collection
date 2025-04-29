import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data from the sheet with image URLs
const nailPolishes = [
  {
    brand: 'A England',
    name: 'Rose Bower',
    color: 'Red',
    finishes: ['Micro Holo Glitter', 'Shimmer'],
    imageUrl: 'https://lh7-rt.googleusercontent.com/sheetsz/AHOq17FkpsjCNgvsXvA2IpZ527i2v1MZ7uKNNSapC1BZJyqQWBoWJuPPGupZn9XILVAH8N5thPedGhmofWW-wxH4T75LquuESzK6SWzbQC4qFIxINWB-qByZB1kpu9AHPTAXZLFeVBtaOns8JD_FmObf0w=w200-h199',
    link: 'http://thepolishwell.blogspot.com/2013/08/a-england-rose-bower-order-of-garter.html',
    status: 'ACTIVE'
  },
  {
    brand: 'Barry M',
    name: 'Mediterranean',
    color: 'Multi',
    finishes: ['Duochrome', 'Metallic'],
    imageUrl: 'https://lh7-rt.googleusercontent.com/sheetsz/AHOq17HfWjzvq-j7l6BmPFUeG8q49KFPnuXD3Nu6MGorcw9upsGaFqZNjtgp8ylOw4oS1S2yRngVfFflXPJ_iVvp1W8uWYA7_zeCD2vHBbSC_0xltw0R-A-1RFIVjvFQl8Vd52AhFFOpMR615o9TkHevIA=w200-h199',
    link: 'https://rainbowifyme.blogspot.com/2015/02/barry-m-pacific-and-mediterranean.html',
    status: 'ACTIVE'
  },
  {
    brand: 'Barry M',
    name: 'Socialite',
    color: 'Pink',
    finishes: ['Iridescent Glitter', 'Shimmer', 'Shifty'],
    imageUrl: 'https://lh7-rt.googleusercontent.com/sheetsz/AHOq17G48pscBOwseWEoJ_SfbKRs98nJ5o76fkwdnk5GdlV7JLoHHju0ke2KCkNWXeu4BuzYmhJKu8p2zz4GkCJI-HANtjxPl9Uzb6Rs_DR8bJVN1cqwOYkN0eALCBK3TqSoGndA14SHfRRAq1Hpip0WxA=w200-h199',
    coats: 2,
    rating: 'B_PLUS',
    notes: 'thinned this out but could use more thinner, is probably an A',
    link: 'https://nail-lacquer.co.uk/barry-m-glitterati/',
    status: 'ACTIVE'
  },
  {
    brand: 'Barry M',
    name: 'Vintage Violet',
    color: 'Purple',
    finishes: ['Creme'],
    imageUrl: 'https://lh7-rt.googleusercontent.com/sheetsz/AHOq17EEIifbjDK_1ATf8txKJOVTdh8x_zfLOrkZNZpzIF1gltN7T2VUbt1hX0EsaAHAWWX6ZJ5O6SvgjYY4HDVqxjaW5xPz-S4Y22oHXfED4GLGRnx0ZiQ7_0InS3NBEFUtMxO-Sm9TON33gv95FC05=w200-h199',
    coats: 2,
    rating: 'A',
    notes: 'great formula, skinny brush tho',
    link: 'http://www.thevegantaff.com/2015/03/manicure-monday-barry-m-vintage-violet.html',
    status: 'ACTIVE'
  },
  {
    brand: 'Barry M Speedy Quick Dry',
    name: 'Lap of Honour',
    color: 'Purple',
    finishes: ['Creme'],
    status: 'ACTIVE',
    link: 'https://www.britnails.co.uk/2015/02/barry-m-speedy-quick-dry-collection.html?showComment=1423267483764'
  },
  {
    brand: 'Believe Beauty',
    name: 'Party Purple',
    color: 'Purple',
    finishes: ['Shimmer', 'Crelly'],
    coats: 2,
    rating: 'B',
    notes: 'a little sheer and patchy but not bad',
    link: 'https://www.believebeautycosmetics.com/nail-shop/just-jewel-nail-polish',
    status: 'ACTIVE'
  },
  {
    brand: 'Cirque Colors',
    name: 'Socialite',
    color: 'Purple',
    finishes: ['Neon'],
    coats: 2,
    rating: 'A',
    notes: 'great formula, super long lasting, so many compliments',
    link: 'https://www.cirquecolors.com/socialite/',
    status: 'ACTIVE'
  },
  {
    brand: 'Cirque Colors',
    name: 'Cloud Nine',
    color: 'Purple',
    finishes: ['Shimmer', 'Scattered Holo'],
    coats: 3,
    rating: 'B_MINUS',
    notes: 'needs a lot of coats, looked ok over another color',
    link: 'https://www.cirquecolors.com/cloud-nine/',
    status: 'ACTIVE'
  },
  {
    brand: 'Cirque Colors',
    name: 'Fizzy Lifting Drink',
    color: 'Purple',
    finishes: ['Magnetic', 'Holo'],
    status: 'ACTIVE',
    link: 'https://www.cirquecolors.com/fizzy-lifting-drink/'
  }
];

async function main() {
  for (const polish of nailPolishes) {
    try {
      // Find or create brand
      const brand = await prisma.brands.upsert({
        where: { name: polish.brand },
        update: {},
        create: {
          name: polish.brand,
          updated_at: new Date()
        },
      });

      // Find or create color
      const color = await prisma.colors.upsert({
        where: { name: polish.color },
        update: {},
        create: {
          name: polish.color,
          updated_at: new Date()
        },
      });

      // Create nail polish
      const nailPolish = await prisma.nail_polish.create({
        data: {
          name: polish.name,
          image_url: polish.imageUrl,
          coats: polish.coats,
          rating: polish.rating,
          notes: polish.notes,
          link: polish.link,
          brand_id: brand.id,
          status: polish.status,
          total_bottles: 1,
          empty_bottles: 0,
          updated_at: new Date(),
          colors: {
            create: {
              color_id: color.id,
              updated_at: new Date()
            }
          }
        },
      });

      // Handle finishes
      if (polish.finishes && polish.finishes.length > 0) {
        for (const finishName of polish.finishes) {
          const finish = await prisma.finishes.upsert({
            where: { name: finishName },
            update: {},
            create: {
              name: finishName,
              updated_at: new Date()
            },
          });

          // Create finish relationship through junction table
          await prisma.nail_polish_finish.create({
            data: {
              nail_polish_id: nailPolish.id,
              finish_id: finish.id,
              updated_at: new Date()
            },
          });
        }
      }

      console.log(`Successfully created polish: ${polish.brand} - ${polish.name}`);
    } catch (e: any) {
      console.error(`Failed to create polish: ${polish.brand} - ${polish.name}`);
      console.error('Error details:', {
        name: e.name,
        message: e.message,
        code: e.code,
        meta: e.meta
      });
    }
  }

  console.log('Migration completed successfully');
}

main()
  .catch((e: any) => {
    console.error('Error details:', {
      name: e.name,
      message: e.message,
      code: e.code,
      meta: e.meta
    });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
