import type { Config, Data } from '@puckeditor/core';
import { RichTextViewer } from '../lore/components/rich-text-viewer';

// ---------------------------------------------------------------------------
// Puck component definitions
// ---------------------------------------------------------------------------

const HeadingBlock: Config['components']['Heading'] = {
  label: 'Heading',
  defaultProps: {
    text: 'Heading',
    level: 'h2' as const,
  },
  fields: {
    text: { type: 'text', label: 'Text' },
    level: {
      type: 'select',
      label: 'Level',
      options: [
        { label: 'H1', value: 'h1' },
        { label: 'H2', value: 'h2' },
        { label: 'H3', value: 'h3' },
      ],
    },
  },
  render: ({ text, level }) => {
    const Tag = level as 'h1' | 'h2' | 'h3';
    const sizeClass =
      Tag === 'h1'
        ? 'text-3xl font-bold'
        : Tag === 'h2'
          ? 'text-2xl font-semibold'
          : 'text-xl font-medium';
    return <Tag className={`${sizeClass} text-gray-900`}>{text}</Tag>;
  },
};

const RichTextBlock: Config['components']['RichText'] = {
  label: 'Rich Text',
  defaultProps: {
    content: null,
  },
  fields: {
    content: { type: 'textarea', label: 'Content (JSON)' },
  },
  render: ({ content }) => {
    const parsed = (() => {
      if (!content) return null;
      if (typeof content === 'object') return content;
      try {
        return JSON.parse(content as string);
      } catch {
        return null;
      }
    })();
    if (!parsed) {
      return (
        <p className="text-sm text-gray-400 italic">
          Empty rich text block
        </p>
      );
    }
    return <RichTextViewer content={parsed} />;
  },
};

const ImageBlock: Config['components']['Image'] = {
  label: 'Image',
  defaultProps: {
    url: '',
    alt: '',
    caption: '',
  },
  fields: {
    url: { type: 'text', label: 'Image URL' },
    alt: { type: 'text', label: 'Alt text' },
    caption: { type: 'text', label: 'Caption' },
  },
  render: ({ url, alt, caption }) => {
    if (!url) {
      return (
        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
          No image URL set
        </div>
      );
    }
    return (
      <figure>
        <img
          src={url}
          alt={alt || ''}
          className="w-full rounded-lg object-cover"
        />
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-gray-500">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
};

const DividerBlock: Config['components']['Divider'] = {
  label: 'Divider',
  defaultProps: {
    style: 'solid' as const,
  },
  fields: {
    style: {
      type: 'select',
      label: 'Style',
      options: [
        { label: 'Solid', value: 'solid' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
      ],
    },
  },
  render: ({ style }) => (
    <hr
      className="my-2"
      style={{ borderStyle: style || 'solid', borderColor: '#e5e7eb' }}
    />
  ),
};

const LoreFragmentEmbedBlock: Config['components']['LoreFragmentEmbed'] = {
  label: 'Lore Fragment Embed',
  defaultProps: {
    fragmentId: '',
    fragmentTitle: '',
  },
  fields: {
    fragmentId: { type: 'text', label: 'Fragment ID' },
    fragmentTitle: { type: 'text', label: 'Display title (optional)' },
  },
  render: ({ fragmentId, fragmentTitle }) => {
    if (!fragmentId) {
      return (
        <div className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-600">
          No lore fragment linked. Enter a fragment ID.
        </div>
      );
    }
    return (
      <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
          <span className="text-base">📜</span>
          {fragmentTitle || `Lore: ${fragmentId.slice(0, 8)}...`}
        </div>
        <p className="mt-1 text-xs text-violet-500">
          Fragment ID: {fragmentId}
        </p>
      </div>
    );
  },
};

const LinkCardBlock: Config['components']['LinkCard'] = {
  label: 'Link Card',
  defaultProps: {
    url: '',
    title: '',
    description: '',
  },
  fields: {
    url: { type: 'text', label: 'URL' },
    title: { type: 'text', label: 'Title' },
    description: { type: 'text', label: 'Description' },
  },
  render: ({ url, title, description }) => {
    if (!url) {
      return (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-400">
          No URL set
        </div>
      );
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-violet-300 hover:shadow-md"
      >
        <div className="text-sm font-semibold text-gray-900">
          {title || url}
        </div>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
        <p className="mt-2 text-xs text-violet-600 truncate">{url}</p>
      </a>
    );
  },
};

// ---------------------------------------------------------------------------
// Assembled Puck config
// ---------------------------------------------------------------------------

export const puckConfig: Config = {
  components: {
    Heading: HeadingBlock,
    RichText: RichTextBlock,
    Image: ImageBlock,
    Divider: DividerBlock,
    LoreFragmentEmbed: LoreFragmentEmbedBlock,
    LinkCard: LinkCardBlock,
  },
};

// ---------------------------------------------------------------------------
// Empty data helper
// ---------------------------------------------------------------------------

export const emptyPuckData: Data = {
  root: { props: {} },
  content: [],
};
