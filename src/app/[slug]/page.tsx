import { Metadata, ResolvingMetadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { fetchpageBlogPost, fetchpageBlogPosts } from '../../contentful/pageBlogPosts'
import Link from 'next/link'
import RichText from '../../contentful/RichText'

interface pageBlogPostPageParams {
	slug: string
}

interface pageBlogPostPageProps {
	params: pageBlogPostPageParams
}

export async function generateStaticParams(): Promise<pageBlogPostPageParams[]> {
	const pageBlogPosts = await fetchpageBlogPosts({ preview: false })

	return pageBlogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: pageBlogPostPageProps, parent: ResolvingMetadata): Promise<Metadata> {
	const pageBlogPost = await fetchpageBlogPost({ slug: params.slug, preview: draftMode().isEnabled })

	if (!pageBlogPost) {
		return notFound()
	}

	return {
		title: pageBlogPost.title,
	}
}

export default async function pageBlogPostPage({ params }: pageBlogPostPageProps) {
	const pageBlogPost = await fetchpageBlogPost({ slug: params.slug, preview: draftMode().isEnabled })

	if (!pageBlogPost) {
		return notFound()
	}

	return (
		<main className="p-[6vw]">
			<Link href="/">← Posts</Link>
			<div className="prose mt-8 border-t pt-8">
				{pageBlogPost.image && (
					<img
						src={pageBlogPost.image.src}
						srcSet={`${pageBlogPost.image.src}?w=300 1x, ${pageBlogPost.image.src} 2x`}
						width={300}
						height={300}
						alt={pageBlogPost.image.alt}
					/>
				)}
				<h1>{pageBlogPost.title}</h1>
				<RichText document={pageBlogPost.body} />
			</div>
		</main>
	)
}
