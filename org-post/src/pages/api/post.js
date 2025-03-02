import prisma from '../../prisma/PrismaClient.js';
import { authenticate } from '../../utils/authMiddleware.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    authenticate(req, res, async () => {
      const { content, organizationId } = req.body;
      const membership = await prisma.userOrganization.findUnique({
        where: { userId_organizationId: { userId: req.userId, organizationId } }
      });
      if (!membership) return res.status(403).json({ error: 'Not a member of this organization' });
      const post = await prisma.post.create({
        data: { content, userId: req.userId, organizationId }
      });
      res.status(201).json(post);
    });
  } else if (req.method === 'GET') {
    authenticate(req, res, async () => {
      const { organizationId } = req.query;
      const membership = await prisma.userOrganization.findUnique({
        where: { userId_organizationId: { userId: req.userId, organizationId } }
      });
      if (!membership) return res.status(403).json({ error: 'Not a member of this organization' });
      const posts = await prisma.post.findMany({ where: { organizationId } });
      res.status(200).json(posts);
    });
  }
}
