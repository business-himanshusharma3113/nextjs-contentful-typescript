import { TypepageBlogPostSkeleton } from './types'
import { Entry } from 'contentful'
import { Document as RichTextDocument } from '@contentful/rich-text-types'
import contentfulClient from './contentfulClient'
import { ContentImage, parseContentfulContentImage } from './contentImage'

type pageBlogPostEntry = Entry<TypepageBlogPostSkeleton, undefined, string>

export interface pageBlogPost {
	title: string
	slug: string
	body: RichTextDocument | null
	image: ContentImage | null
}

export function parseContentfulpageBlogPost(pageBlogPostEntry?: pageBlogPostEntry): pageBlogPost | null {
	if (!pageBlogPostEntry) {
		return null
	}

	return {
		title: pageBlogPostEntry.fields.title || '',
		slug: pageBlogPostEntry.fields.slug,
		body: pageBlogPostEntry.fields.body || null,
		image: parseContentfulContentImage(pageBlogPostEntry.fields.image),
	}
}

interface FetchpageBlogPostsOptions {
	preview: boolean
}
export async function fetchpageBlogPosts({ preview }: FetchpageBlogPostsOptions): Promise<pageBlogPost[]> {
	const contentful = contentfulClient({ preview })

	const pageBlogPostsResult = await contentful.getEntries<TypepageBlogPostSkeleton>({
		content_type: 'pageBlogPost',
		include: 2,
		order: ['fields.title'],
	})

	return pageBlogPostsResult.items.map((pageBlogPostEntry) => parseContentfulpageBlogPost(pageBlogPostEntry) as pageBlogPost)
}

interface FetchpageBlogPostOptions {
	slug: string
	preview: boolean
}
export async function fetchpageBlogPost({ slug, preview }: FetchpageBlogPostOptions): Promise<pageBlogPost | null> {
	const contentful = contentfulClient({ preview })

	const pageBlogPostsResult = await contentful.getEntries<TypepageBlogPostSkeleton>({
		content_type: 'pageBlogPost',
		'fields.slug': slug,
		include: 2,
	})

	return parseContentfulpageBlogPost(pageBlogPostsResult.items[0])
}
