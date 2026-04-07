import { Injectable, NotFoundException } from '@nestjs/common';

// Mock user database - replace with TypeORM/Prisma in production
const users: any[] = [
  {
    id: '1',
    email: 'admin@bakery.com',
    password: '$argon2id$v=19$m=65536,t=3,p=4$example', // hashed password
    firstName: 'Admin',
    lastName: 'User',
    roles: ['SUPER_ADMIN'],
    permissions: ['*:*:*'],
    createdAt: new Date(),
  },
];

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<any> {
    const user = users.find((u) => u.email === email);
    return user || null;
  }

  async findById(id: string): Promise<any> {
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(createUserDto: any): Promise<any> {
    const newUser = {
      id: String(users.length + 1),
      ...createUserDto,
      roles: createUserDto.roles || ['EMPLOYEE'],
      permissions: createUserDto.permissions || [],
      createdAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  }

  async findAll(): Promise<any[]> {
    return users.map(({ password, ...user }) => user);
  }

  async update(id: string, updateUserDto: any): Promise<any> {
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    
    users[userIndex] = { ...users[userIndex], ...updateUserDto };
    const { password, ...result } = users[userIndex];
    return result;
  }

  async delete(id: string): Promise<void> {
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    users.splice(userIndex, 1);
  }
}
