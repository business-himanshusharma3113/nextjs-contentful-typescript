import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { fetchpageBlogPost, fetchpageBlogPosts } from '@/contentful/pageBlogPosts';
import RichText from '@/contentful/RichText';
import SEO from '@/contentful/SEO';

interface PageProps {
  params: { slug: string };
}

function formatDate(date: string | number | Date | undefined): string {
  if (!date) return 'Date unavailable';
  
  try {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObject);
  } catch (error) {
    console.error('Error formatting date:', error, 'Date value:', date);
    return 'Invalid date';
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const blogPost = await fetchpageBlogPost({ slug: params.slug, preview: draftMode().isEnabled });
  const allPosts = await fetchpageBlogPosts({ preview: draftMode().isEnabled });

  if (!blogPost) {
    notFound();
  }

  const currentIndex = allPosts.findIndex(post => post.slug === blogPost.slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <>
      {blogPost.seoFields && <SEO {...blogPost.seoFields} />}
      <div className="bg-[#f7f9fa] min-h-screen font-sans text-[#1b273a]">
        <main className="py-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm font-medium">
              ← Back to Posts
            </Link>
            <article className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
              {blogPost.featuredImage && (
                <div className="relative h-64 sm:h-80 md:h-96">
                  <Image
                    src={blogPost.featuredImage.src}
                    alt={blogPost.featuredImage.alt}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="px-6 py-8 sm:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {blogPost.title}
                </h1>
                <div className="flex items-center mb-6 text-sm text-gray-600">
                  {blogPost.author && (
                    <div className="flex items-center mr-4">
                      {blogPost.author.avatar && (
                        <Image
                          src={blogPost.author.avatar.src}
                          alt={blogPost.author.name}
                          width={32}
                          height={32}
                          className="rounded-full mr-2"
                        />
                      )}
                      <span className="font-medium">{blogPost.author.name}</span>
                    </div>
                  )}
                  <time dateTime={blogPost.publishedDate} className="text-gray-500">
                    {formatDate(blogPost.publishedDate)}
                  </time>
                </div>
                <div className="prose prose-lg max-w-none">
                  <RichText content={blogPost.content} />
                </div>
              </div>
            </article>
            
            <div className="mt-12 flex flex-col sm:flex-row justify-between space-y-6 sm:space-y-0 sm:space-x-6">
              {previousPost && (
                <Link href={`/${previousPost.slug}`} className="flex items-center group">
                  <div className="flex-shrink-0 w-16 h-16 relative mr-4">
                    {previousPost.featuredImage && (
                      <Image
                        src={previousPost.featuredImage.src}
                        alt={previousPost.featuredImage.alt}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    )}
                  </div>
                  <div>
                    <span className="block text-sm text-gray-600 mb-1">Previous Post</span>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{previousPost.title}</h3>
                  </div>
                </Link>
              )}
              {nextPost && (
                <Link href={`/${nextPost.slug}`} className="flex items-center text-right group sm:ml-auto">
                  <div className="sm:order-2 flex-shrink-0 w-16 h-16 relative ml-4">
                    {nextPost.featuredImage && (
                      <Image
                        src={nextPost.featuredImage.src}
                        alt={nextPost.featuredImage.alt}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    )}
                  </div>
                  <div className="sm:order-1">
                    <span className="block text-sm text-gray-600 mb-1">Next Post</span>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{nextPost.title}</h3>
                  </div>
                </Link>
              )}
            </div>

            {blogPost.relatedBlogPosts && blogPost.relatedBlogPosts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPost.relatedBlogPosts.map((post) => (
                    <Link key={post.slug} href={`/${post.slug}`} className="block">
                      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {post.featuredImage && ( // Render featured image for related posts here.
                          <div className="relative h-48">
                            <Image 
                              src={post.featuredImage.src} 
                              alt={post.title} 
                              layout="fill" 
                              objectFit="cover" 
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                          <p className="text-gray600 text-sm mb-2">{post.shortDescription}</p>
                          <div className="flex items-center text-xs text-gray500">
                            <time dateTime={post.publishedDate}>
                              {formatDate(post.publishedDate)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}