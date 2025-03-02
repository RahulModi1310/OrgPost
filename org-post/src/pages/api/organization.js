import prisma from '../../prisma/PrismaClient.js';
import { authenticate } from '../../utils/authMiddleware.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    authenticate(req, res, async () => {
      const { name } = req.body;

      if (!req.userId) {
        return res.status(400).json({ error: "User ID is missing from request." });
      }

      const organization = await prisma.organization.create({
        data: {
          name,
          users: {
            create: {
              user: { connect: { id: req.userId } },
              role: 'ADMIN',
            },
          },
        },
      });

      res.status(201).json(organization);
    });
  }
}
