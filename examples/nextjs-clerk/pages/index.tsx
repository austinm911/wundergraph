import { NextPage } from 'next';
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { useQuery, useUser } from '../components/generated/nextjs';
import { SignInButton, useClerk } from '@clerk/nextjs';

const Home: NextPage = () => {
	// Get the user object from useUser()
	const user = useUser();

	const updateUserMetadata = async () => {
		try {
			const response = await fetch('/api/updateUserMetadata', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			// Log the status code
			console.log('Response status:', response.status);

			// Check if the response is JSON before trying to parse it
			const contentType = response.headers.get('content-type');
			let data;
			if (contentType && contentType.includes('application/json')) {
				data = await response.json();
			} else {
				data = await response.text();
			}

			// Log the response body
			console.log('Response body:', data);

			if (!response.ok) {
				throw new Error(data.error || 'Response not OK');
			}

			console.log('User metadata updated:', data);
		} catch (err) {
			console.error('Failed to update user metadata:', err);
		}
	};




	const { signOut } = useClerk();
	const countries = useQuery({
		operationName: 'Country',
	});
	return (
		<div>
			<div className="relative max-w-5xl pt-10 mx-auto sm:pt-14 lg:pt-18">
				<div className="flex justify-center mb-8">
					<div className="flex flex-row space-x-12 text-cyan-400 dark:text-white">
						<a href="https://wundergraph.com" className="inline-flex w-24 h-24">
							<img src="/wundergraph.svg" alt="WunderGraph" />
						</a>
						<a href="https://clerk.com" className="inline-flex w-24 h-24">
							<img src="/clerk.svg" alt="Clerk" />
						</a>
					</div>
				</div>
				<h1 className="text-4xl font-bold tracking-tight text-center text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
					WunderGraph + Clerk
				</h1>
				<p className="max-w-3xl mx-auto mt-6 text-lg text-center text-slate-600 dark:text-slate-400">
					Use{' '}
					<code className="font-mono font-medium text-sky-500 dark:text-sky-400">
						<a className="text-cyan-400 hover:text-cyan-600" target="_blank" href="https://clerk.com">
							Clerk
						</a>
					</code>{' '}
					to protect your WunderGraph API and Next.js application.
				</p>
			</div>
			<div className="relative flex flex-col items-center p-8 overflow-hidden sm:p-12">
				<div className="w-full max-w-5xl px-20 rounded-2xl bg-gray-50 py-14">
					<button className='bg-blue-400 rounded p4' onClick={updateUserMetadata}>Update User Metadata</button>
					<div className="flex flex-col max-w-xl mx-auto">
						<pre>
							<code className="p-3">{JSON.stringify(countries, null, 2)}</code>
						</pre>
					</div>
					<div className="flex flex-col max-w-xl mx-auto">
						<p className="mt-3 mb-8 text-center text-black/80">Token: </p>
						{/* {user.data && (
							<pre>
								<code className="flex-wrap max-w-3xl">{JSON.stringify(token, null, 2)}</code>
							</pre>
						)} */}
						<p className="mt-3 mb-8 text-center text-black/80">User: </p>
						{user.data && (
							<pre>
								<code className="flex-wrap max-w-3xl">{JSON.stringify(user.data, null, 2)}</code>
							</pre>
						)}
						{!user.data && <code className="flex-wrap max-w-3xl">User not authenticated, click Login</code>}
					</div>
					<div className="flex justify-center gap-2 mt-8">
						{!user.data && (
							<SignInButton>
								<button className="flex items-center justify-center w-full h-12 px-6 font-semibold text-white rounded-lg bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400">
									Login
								</button>
							</SignInButton>
						)}
						{user.data && (
							<button
								className="flex items-center justify-center w-full h-12 px-6 font-semibold text-white rounded-lg bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
								onClick={() => {
									signOut().then((r) => window.location.reload());
								}}
							>
								Logout
							</button>
						)}
					</div>
				</div>
				<footer className="flex justify-between text-gray-400">
					<p className="pt-3">
						Visit{' '}
						<a
							className="text-cyan-400 hover:text-cyan-600"
							target="_blank"
							href="https://github.com/wundergraph/wundergraph"
						>
							Github
						</a>{' '}
						to learn more about WunderGraph.
					</p>
				</footer>
			</div>
		</div>
	);
};

export default Home;
