const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create default user
  const user = await prisma.user.upsert({
    where: { email: 'default@amazonclone.abc' },
    update: {},
    create: {
      name: 'Default User',
      email: 'default@amazonclone.abc',
      address: '123 MG Road, Bangalore, Karnataka 560001',
    },
  });

  console.log({ user });

  // Delete existing products to re-seed with correct data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.product.deleteMany({});

  // Products with prices in INR and working placeholder images
  const products = [
    // ===== Electronics (4 products) =====
    {
      title: 'Echo Dot (5th Gen) | Smart Speaker with Alexa',
      description: 'Our best sounding Echo Dot yet. Enjoy an improved audio experience compared to any previous Echo Dot with clearer vocals, deeper bass and vibrant sound in any room.',
      price: 4499,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=400&fit=crop'
      ]),
      category: 'Electronics',
      stock: 50,
    },
    {
      title: 'Samsung Galaxy M14 5G (Berry Blue, 6GB, 128GB)',
      description: '6000mAh massive battery, 50MP Triple Camera, 5nm Processor Exynos 1330, 6GB RAM with RAM Plus, Android 13, One UI 5.1.',
      price: 13490,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop'
      ]),
      category: 'Electronics',
      stock: 30,
    },
    {
      title: 'boAt Rockerz 450 Bluetooth On-Ear Headphones',
      description: 'Adaptive lightweight design, immersive audio, integrated controls, dual connectivity modes (Bluetooth & AUX), up to 15 hours of playback.',
      price: 1299,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop'
      ]),
      category: 'Electronics',
      stock: 100,
    },
    {
      title: 'Apple iPad (9th Generation) 10.2-inch Wi-Fi 64GB',
      description: 'Stunning 10.2-inch Retina display, A13 Bionic chip with Neural Engine, 8MP Wide back camera, Touch ID for secure authentication.',
      price: 27900,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop'
      ]),
      category: 'Electronics',
      stock: 15,
    },

    // ===== Books (3 products) =====
    {
      title: 'The Pragmatic Programmer: Your Journey To Mastery',
      description: '20th Anniversary Edition. A guide for developers seeking to master their craft and improve their programming skills by David Thomas and Andrew Hunt.',
      price: 2999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop'
      ]),
      category: 'Books',
      stock: 100,
    },
    {
      title: 'Atomic Habits by James Clear',
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. #1 New York Times bestseller. Over 10 million copies sold worldwide.',
      price: 399,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=400&fit=crop'
      ]),
      category: 'Books',
      stock: 200,
    },
    {
      title: 'Rich Dad Poor Dad by Robert T. Kiyosaki',
      description: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not! The #1 Personal Finance book of all time.',
      price: 299,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop'
      ]),
      category: 'Books',
      stock: 150,
    },

    // ===== Home (3 products) =====
    {
      title: 'Amazon Basics Microfiber Bed Sheet Set - Queen',
      description: 'Made from 100% polyester microfiber for durability and softness. Includes flat sheet, fitted sheet, and 2 pillowcases. Machine washable.',
      price: 1499,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop'
      ]),
      category: 'Home',
      stock: 200,
    },
    {
      title: 'Pigeon Stovekraft Pressure Cooker 3 Litre',
      description: 'Aluminium body, Induction Base, ideal for Indian cooking needs. ISI certified. Suitable for all cook-tops including induction.',
      price: 799,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop'
      ]),
      category: 'Home',
      stock: 80,
    },
    {
      title: 'Havells Instanio Prime 3L Instant Water Heater',
      description: 'Color Changing LED indicator. Heavy duty copper heating element. Advanced safety features with 4 levels of protection. ISI Marked.',
      price: 3299,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop'
      ]),
      category: 'Home',
      stock: 40,
    },

    // ===== Clothing (3 products) =====
    {
      title: 'Allen Solly Men Slim Fit Polo T-Shirt',
      description: 'Cotton blend, Polo neck, Short sleeves, Machine wash. Regular fit with comfortable fabric ideal for casual wear.',
      price: 699,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop'
      ]),
      category: 'Clothing',
      stock: 60,
    },
    {
      title: 'Levi\'s Men 511 Slim Fit Jeans',
      description: 'Authentic Levi\'s quality denim. Slim through the hip and thigh with a narrow leg opening. Zip fly with button closure.',
      price: 1999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=400&fit=crop'
      ]),
      category: 'Clothing',
      stock: 45,
    },
    {
      title: 'Nike Men Revolution 6 Running Shoe',
      description: 'Lightweight cushioning and a minimalist design. Breathable mesh upper for comfort, foam midsole for soft responsiveness.',
      price: 2995,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop'
      ]),
      category: 'Clothing',
      stock: 35,
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
    console.log(`Created product: ${p.title}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
