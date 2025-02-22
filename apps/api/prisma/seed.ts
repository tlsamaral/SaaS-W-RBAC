import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
	await prisma.member.deleteMany()
	await prisma.project.deleteMany()
	await prisma.invite.deleteMany()
	await prisma.token.deleteMany()
	await prisma.account.deleteMany()
	await prisma.organization.deleteMany()
	await prisma.user.deleteMany()

	const passwordHash = await bcrypt.hash('123456', 1)

	const user = await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'johndoe@example.com',
			passwordHash: passwordHash,
			avatarUrl: 'https://github.com/tlsamaral.png',
		},
	})

	const anotherUser = await prisma.user.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			passwordHash: passwordHash,
			avatarUrl: faker.image.avatarGitHub(),
		},
	})

	const thirdUser = await prisma.user.create({
		data: {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			passwordHash: passwordHash,
			avatarUrl: faker.image.avatarGitHub(),
		},
	})

	await prisma.organization.create({
		data: {
			name: 'Acme Inc (Admin)',
			domain: 'acme.com',
			slug: 'acme-admin',
			avatarUrl: faker.image.avatarGitHub(),
			shouldAttachUsersByDomain: true,
			ownerId: user.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.commerce.productName(),
							slug: faker.lorem.slug(),
							description: faker.lorem.sentence(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								thirdUser.id,
							]),
						},
						{
							name: faker.commerce.productName(),
							slug: faker.lorem.slug(),
							description: faker.lorem.sentence(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								thirdUser.id,
							]),
						},
						{
							name: faker.commerce.productName(),
							slug: faker.lorem.slug(),
							description: faker.lorem.sentence(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								thirdUser.id,
							]),
						},
					],
				},
			},
			members: {
				createMany: {
					data: [
						{
							userId: user.id,
							role: 'ADMIN',
						},
						{
							userId: anotherUser.id,
							role: 'MEMBER',
						},
						{
							userId: thirdUser.id,
							role: 'MEMBER',
						},
					],
				},
			},
		},
	})

	await prisma.organization.create({
		data: {
			name: 'Acme Inc (Member)',
			slug: 'acme-member',
			avatarUrl: faker.image.avatarGitHub(),
			ownerId: user.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.commerce.productName(),
							slug: faker.lorem.slug(),
							description: faker.lorem.sentence(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								thirdUser.id,
							]),
						},
						{
							name: faker.commerce.productName(),
							slug: faker.lorem.slug(),
							description: faker.lorem.sentence(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								thirdUser.id,
							]),
						},
						{
							name: faker.commerce.productName(),
							slug: faker.lorem.slug(),
							description: faker.lorem.sentence(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								thirdUser.id,
							]),
						},
					],
				},
			},
			members: {
				createMany: {
					data: [
						{
							userId: user.id,
							role: 'MEMBER',
						},
						{
							userId: anotherUser.id,
							role: 'MEMBER',
						},
						{
							userId: thirdUser.id,
							role: 'ADMIN',
						},
					],
				},
			},
		},
	})

	await prisma.organization.create({
		data: {
			name: 'Acme Inc (Billing)',
			slug: 'acme-billing',
			avatarUrl: faker.image.avatarGitHub(),
			ownerId: user.id,
			projects: {
				createMany: {
					data: [
						{
							name: faker.commerce.productName(),
							slug: faker.lorem.slug(),
							description: faker.lorem.sentence(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								thirdUser.id,
							]),
						},
						{
							name: faker.commerce.productName(),
							slug: faker.lorem.slug(),
							description: faker.lorem.sentence(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								thirdUser.id,
							]),
						},
						{
							name: faker.commerce.productName(),
							slug: faker.lorem.slug(),
							description: faker.lorem.sentence(),
							ownerId: faker.helpers.arrayElement([
								user.id,
								anotherUser.id,
								thirdUser.id,
							]),
						},
					],
				},
			},
			members: {
				createMany: {
					data: [
						{
							userId: user.id,
							role: 'BILLING',
						},
						{
							userId: anotherUser.id,
							role: 'MEMBER',
						},
						{
							userId: thirdUser.id,
							role: 'ADMIN',
						},
					],
				},
			},
		},
	})
}

seed().then(() => {
	console.log('Database has been seeded')
})
