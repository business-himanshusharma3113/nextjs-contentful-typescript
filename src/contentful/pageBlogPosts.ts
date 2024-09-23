import { Entry, Asset } from 'contentful'
import { Document as RichTextDocument } from '@contentful/rich-text-types'
import contentfulClient from './contentfulClient'
import { ContentImage, parseContentfulContentImage } from './contentImage'

interface TypepageBlogPostSkeleton {
  internalName: string
  seoFields?: Entry<any>
  slug: string
  author?: Entry<any>
  publishedDate: string
  title: string
  shortDescription?: string
  featuredImage: Asset
  content: RichTextDocument
  relatedBlogPosts?: Entry<TypepageBlogPostSkeleton>[]
  tags?: string[]
}

type pageBlogPostEntry = Entry<TypepageBlogPostSkeleton, undefined, string>

export interface pageBlogPost {
  internalName: string
  slug: string
  author?: {
    name: string
    avatar: ContentImage | null
  }
  publishedDate: string
  title: string
  shortDescription?: string
  featuredImage: ContentImage | null
  content: RichTextDocument
  relatedBlogPosts?: {
    slug: string
    title: string
    shortDescription?: string
    publishedDate: string
    featuredImage: ContentImage | null // Include featured image here
  }[]
  tags?: string[]
  seoFields?: {
    pageTitle: string
    pageDescription?: string
    canonicalUrl?: string
    nofollow: boolean
    noindex: boolean
    shareImages?: Array<{
      src: string
      width: number
      height: number
      alt: string
    }>
  }
}

function parseContentfulpageBlogPost(pageBlogPostEntry?: pageBlogPostEntry): pageBlogPost | null {
  if (!pageBlogPostEntry) {
    return null
  }

  const fields = pageBlogPostEntry.fields

  return {
    internalName: fields.internalName,
    slug: fields.slug,
    author: fields.author ? {
      name: fields.author.fields.name,
      avatar: parseContentfulContentImage(fields.author.fields.avatar)
    } : undefined,
    publishedDate: fields.publishedDate,
    title: fields.title,
    shortDescription: fields.shortDescription,
    featuredImage: parseContentfulContentImage(fields.featuredImage),
    content: fields.content,
    relatedBlogPosts: fields.relatedBlogPosts?.map(post => ({
      slug: post.fields.slug,
      title: post.fields.title,
      shortDescription: post.fields.shortDescription,
      publishedDate: post.fields.publishedDate,
      featuredImage: parseContentfulContentImage(post.fields.featuredImage) // Parse featured image here
    })),
    tags: fields.tags,
    seoFields: fields.seoFields ? {
      pageTitle: fields.seoFields.fields.pageTitle,
      pageDescription: fields.seoFields.fields.pageDescription,
      canonicalUrl: fields.seoFields.fields.canonicalUrl,
      nofollow: fields.seoFields.fields.nofollow,
      noindex: fields.seoFields.fields.noindex,
      shareImages: fields.seoFields.fields.shareImages?.map(image => ({
        src: image.fields.file.url,
        width: image.fields.file.details.image.width,
        height: image.fields.file.details.image.height,
        alt: image.fields.title
      }))
    } : undefined
  }
}

interface FetchpageBlogPostsOptions {
  preview: boolean
}

export async function fetchpageBlogPosts({ preview }: FetchpageBlogPostsOptions): Promise<pageBlogPost[]> {
  const contentful = contentfulClient({ preview })

  try {
    const pageBlogPostsResult = await contentful.getEntries<TypepageBlogPostSkeleton>({
      content_type: 'pageBlogPost',
      include: 1,
      order: ['-fields.publishedDate'],
    })

    const parsedPosts = pageBlogPostsResult.items
      .map((pageBlogPostEntry) => parseContentfulpageBlogPost(pageBlogPostEntry))
      .filter((post): post is pageBlogPost => post !== null)

    return parsedPosts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    throw error
  }
}

interface FetchpageBlogPostOptions {
  slug: string
  preview: boolean
}

export async function fetchpageBlogPost({ slug, preview }: FetchpageBlogPostOptions): Promise<pageBlogPost | null> {
  const contentful = contentfulClient({ preview })

  try {
    const pageBlogPostsResult = await contentful.getEntries<TypepageBlogPostSkeleton>({
      content_type: 'pageBlogPost',
      'fields.slug': slug,
      include: 1,
    })

    const post = parseContentfulpageBlogPost(pageBlogPostsResult.items[0])

    if (post && post.tags && post.tags.length > 0) {
      const relatedPostsResult = await contentful.getEntries<TypepageBlogPostSkeleton>({
        content_type: 'pageBlogPost',
        'fields.tags[in]': post.tags.join(','),
        'fields.slug[ne]': slug,
        limit: 3,
        include: 1,
      })

      post.relatedBlogPosts = relatedPostsResult.items
        .map(parseContentfulpageBlogPost)
        .filter((relatedPost): relatedPost is pageBlogPost => relatedPost !== null)
        .map(relatedPost => ({
          slug: relatedPost.slug,
          title: relatedPost.title,
          shortDescription: relatedPost.shortDescription,
          publishedDate: relatedPost.publishedDate
        }))
    }

    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    throw error
  }
}