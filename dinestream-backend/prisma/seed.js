require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt           = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  // Admin
  const hashed = await bcrypt.hash('Admin@123', 12)
  await prisma.user.upsert({
    where:  { email: 'admin@dinestream.com' },
    update: {},
    create: {
      name:        'Muhammad Sohail',
      email:       'msohailg211@gmail.com',
      password:    hashed,
      role:        'ADMIN',
      avatarColor: '#f97316',
    }
  })

  // Categories
  const cats = [
    { name: 'Burgers',  icon: '🍔', color: '#f97316' },
    { name: 'Pizza',    icon: '🍕', color: '#ef4444'  },
    { name: 'Drinks',   icon: '🥤', color: '#3b82f6'  },
    { name: 'Mains',    icon: '🍛', color: '#22c55e'  },
    { name: 'Sides',    icon: '🍟', color: '#eab308'  },
    { name: 'Desserts', icon: '🍫', color: '#a855f7'  },
  ]

  for (const cat of cats) {
    await prisma.category.upsert({
      where:  { name: cat.name },
      update: {},
      create: cat,
    })
  }

  // Menu Items
  const burgers  = await prisma.category.findUnique({ where: { name: 'Burgers'  } })
  const drinks   = await prisma.category.findUnique({ where: { name: 'Drinks'   } })
  const sides    = await prisma.category.findUnique({ where: { name: 'Sides'    } })
  const pizza    = await prisma.category.findUnique({ where: { name: 'Pizza'    } })
  const mains    = await prisma.category.findUnique({ where: { name: 'Mains'    } })
  const desserts = await prisma.category.findUnique({ where: { name: 'Desserts' } })

  const menuItems = [
    { name: 'Smash Burger',       price: 850,  emoji: '🍔', prepTime: 12, categoryId: burgers.id  },
    { name: 'Zinger Burger',      price: 750,  emoji: '🍔', prepTime: 10, categoryId: burgers.id  },
    { name: 'Margherita Pizza',   price: 1200, emoji: '🍕', prepTime: 20, categoryId: pizza.id    },
    { name: 'Chocolate Shake',    price: 450,  emoji: '🥤', prepTime: 5,  categoryId: drinks.id   },
    { name: 'Crispy Fries',       price: 320,  emoji: '🍟', prepTime: 8,  categoryId: sides.id    },
    { name: 'Chicken Karahi',     price: 1800, emoji: '🍛', prepTime: 25, categoryId: mains.id    },
    { name: 'BBQ Platter',        price: 2800, emoji: '🥩', prepTime: 30, categoryId: mains.id    },
    { name: 'Brownie + Ice Cream',price: 550,  emoji: '🍫', prepTime: 7,  categoryId: desserts.id },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where:  { name: item.name },
      update: {},
      create: item,
    })
  }

  // Tables
  for (let i = 1; i <= 15; i++) {
    await prisma.table.upsert({
      where:  { tableNumber: i },
      update: {},
      create: {
        tableNumber: i,
        label:       `T-${String(i).padStart(2, '0')}`,
        capacity:    i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
        floor:       i <= 8 ? 1 : 2,
        status:      'AVAILABLE',
      }
    })
  }

  console.log('✅ Seeding complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())