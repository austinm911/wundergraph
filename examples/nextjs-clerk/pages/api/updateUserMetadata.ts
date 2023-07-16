import { getAuth, clerkClient } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { userId } = getAuth(req);

	if (!userId) {
		console.log('No user ID found');
		return res.status(401).json({ error: 'Unauthorized' });
	}

	// Generate a random team ID and user ID
	const teamId = nanoid();
	const userId_backend = nanoid();

	console.log(`Generated teamId: ${teamId}`);
	console.log(`Generated userId_backend: ${userId_backend}`);

	try {
		// Update the user's metadata
		await clerkClient.users.updateUser(userId, {
			publicMetadata: { teamId, userId_backend },
		});

		console.log('User metadata updated successfully');
		res.status(200).json({ message: 'User metadata updated successfully' });
	} catch (err) {
		console.error('Failed to update user metadata:', err);
		res.status(500).json({ error: 'Failed to update user metadata' });
	}
}
