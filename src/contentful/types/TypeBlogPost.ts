import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from 'contentful'

export interface TypepageBlogPostFields {
	title?: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	body?: EntryFieldTypes.RichText
	image?: EntryFieldTypes.AssetLink
}

export type TypepageBlogPostSkeleton = EntrySkeletonType<TypepageBlogPostFields, 'pageBlogPost'>
export type TypepageBlogPost<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypepageBlogPostSkeleton,
	Modifiers,
	Locales
>
