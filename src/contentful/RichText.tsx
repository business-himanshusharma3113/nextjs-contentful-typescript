// @/contentful/RichText.tsx

import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';

const options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-6">{children}</p>,
    [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
    [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-3xl font-bold mb-3">{children}</h2>,
    [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-2xl font-bold mb-2">{children}</h3>,
    [BLOCKS.HEADING_4]: (node, children) => <h4 className="text-xl font-bold mb-2">{children}</h4>,
    [BLOCKS.HEADING_5]: (node, children) => <h5 className="text-lg font-bold mb-2">{children}</h5>,
    [BLOCKS.HEADING_6]: (node, children) => <h6 className="text-base font-bold mb-2">{children}</h6>,
    [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc pl-5 mb-6">{children}</ul>,
    [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal pl-5 mb-6">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node, children) => <li className="mb-2">{children}</li>,
    [BLOCKS.HR]: () => <hr className="my-8 border-t border-gray-300" />,
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6">{children}</blockquote>
    ),
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const { fields } = node.data.target;
      
      if (fields?.image) {
        const { title, file } = fields.image.fields;
        const { url, details } = file;
        const { width, height } = details.image;

        return (
          <div className="my-8">
            <Image
              src={`https:${url}`}
              alt={title || 'Embedded image'}
              width={width}
              height={height}
              layout="responsive"
              className="rounded-lg"
            />
            {fields.caption && (
              <p className="text-sm text-gray-600 mt-2">{fields.caption}</p>
            )}
          </div>
        );
      }

      return null;
    },
    [INLINES.HYPERLINK]: (node, children) => {
      const { uri } = node.data;
      return (
        <Link href={uri} className="text-blue-600 hover:underline">
          {children}
        </Link>
      );
    },
  },
};

const RichText = ({ content }) => {
  if (!content) {
    return null;
  }
  return <div className="prose prose-lg max-w-none">{documentToReactComponents(content, options)}</div>;
};

export default RichText;