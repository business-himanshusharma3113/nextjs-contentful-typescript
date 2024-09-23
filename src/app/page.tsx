import { draftMode } from 'next/headers'
import { fetchpageBlogPosts } from '@/contentful/pageBlogPosts'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const pageBlogPosts = await fetchpageBlogPosts({ preview: draftMode().isEnabled })

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">My Contentful Blog</h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageBlogPosts.map((post) => (
            <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link href={`/${post.slug}`} className="block hover:opacity-75 transition-opacity duration-300">
                {post.featuredImage && (
                  <Image
                    src={post.featuredImage.src}
                    alt={post.featuredImage.alt}
                    width={post.featuredImage.width}
                    height={post.featuredImage.height}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                  {post.shortDescription && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.shortDescription}</p>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    {post.author && (
                      <div className="flex items-center mr-4">
                        {post.author.avatar && (
                          <Image
                            src={post.author.avatar.src}
                            alt={post.author.name}
                            width={32}
                            height={32}
                            className="rounded-full mr-2"
                          />
                        )}
                        <span>{post.author.name}</span>
                      </div>
                    )}
                    <span>
                      <i className="far fa-calendar mr-2"></i>
                      {new Date(post.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}