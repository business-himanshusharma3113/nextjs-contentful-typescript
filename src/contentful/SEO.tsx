// components/SEO.tsx
import Head from 'next/head';

interface SEOProps {
  pageTitle: string;
  pageDescription?: string;
  canonicalUrl?: string;
  nofollow: boolean;
  noindex: boolean;
  shareImages?: Array<{
    src: string;
    width: number;
    height: number;
    alt: string;
  }>;
}

export default function SEO({ pageTitle, pageDescription, canonicalUrl, nofollow, noindex, shareImages }: SEOProps) {
  return (
    <Head>
      <title>{pageTitle}</title>
      {pageDescription && <meta name="description" content={pageDescription} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {nofollow && <meta name="robots" content="nofollow" />}
      {noindex && <meta name="robots" content="noindex" />}
      {shareImages && shareImages.map((image, index) => (
        <meta key={index} property="og:image" content={image.src} />
      ))}
      {shareImages && shareImages[0] && (
        <>
          <meta property="og:image:width" content={shareImages[0].width.toString()} />
          <meta property="og:image:height" content={shareImages[0].height.toString()} />
          <meta property="og:image:alt" content={shareImages[0].alt} />
        </>
      )}
    </Head>
  );
}