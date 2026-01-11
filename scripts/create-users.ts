import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creando usuarios...')

  const defaultPassword = await bcrypt.hash('admin123', 12)
  
  const users = await Promise.all([
    // SYSADMIN user (original garv user)
    prisma.user.upsert({
      where: { username: 'garv' },
      update: {
        password: defaultPassword, // Reset password to ensure it's correct
        isActive: true,
      },
      create: {
        name: 'Garv',
        lastName: 'SysAdmin',
        cedula: '1234567890',
        phone: '+595981234567',
        email: 'garv@pizzeria.com',
        address: 'Asunción, Paraguay',
        username: 'garv',
        password: defaultPassword,
        role: 'SYSADMIN',
      },
    }),
    // SYSADMIN user
    prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        password: defaultPassword,
        isActive: true,
      },
      create: {
        name: 'Admin',
        lastName: 'Sistema',
        cedula: '1000000000',
        phone: '+595981234567',
        email: 'admin@s1mple-pos.com',
        address: 'Asunción, Paraguay',
        username: 'admin',
        password: defaultPassword,
        role: 'SYSADMIN',
      },
    }),
    // ADMIN user
    prisma.user.upsert({
      where: { username: 'manager' },
      update: {
        password: defaultPassword,
        isActive: true,
      },
      create: {
        name: 'Manager',
        lastName: 'Admin',
        cedula: '2000000000',
        phone: '+595982234567',
        email: 'manager@s1mple-pos.com',
        address: 'Asunción, Paraguay',
        username: 'manager',
        password: defaultPassword,
        role: 'ADMIN',
      },
    }),
    // USER (cajero)
    prisma.user.upsert({
      where: { username: 'cajero' },
      update: {
        password: defaultPassword,
        isActive: true,
      },
      create: {
        name: 'Cajero',
        lastName: 'Usuario',
        cedula: '3000000000',
        phone: '+595983234567',
        email: 'cajero@s1mple-pos.com',
        address: 'Asunción, Paraguay',
        username: 'cajero',
        password: defaultPassword,
        role: 'USER',
      },
    }),
  ])

  console.log('✅ Usuarios creados/actualizados:')
  users.forEach(user => {
    console.log(`  - ${user.username} (${user.role}) - password: admin123`)
  })
  console.log('\n📝 Nota: Todos los usuarios usan la contraseña: admin123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
