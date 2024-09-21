import { draftMode } from 'next/headers'
import { fetchpageBlogPosts } from '@/contentful/pageBlogPosts'
import Link from 'next/link'

async function Home() {
	const pageBlogPosts = await fetchpageBlogPosts({ preview: draftMode().isEnabled })

	return (
		<main className="p-[6vw]">
			<div className="prose">
				<h1>My Contentful Blog</h1>
				<ul>
					{pageBlogPosts.map((pageBlogPost) => {
						return (
							<li key={pageBlogPost.slug}>
								<Link href={`/${pageBlogPost.slug}`}>{pageBlogPost.title}</Link>
							</li>
						)
					})}
				</ul>
			</div>
		</main>
	)
}

export default Home
