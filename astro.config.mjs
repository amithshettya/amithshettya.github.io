// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: "https://amithshettya.github.io",
	integrations: [
		starlight({
			title: 'Amith Shetty',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/amithshettya' }, { icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/amithshettya' }],
			sidebar: [
				{ label: 'Home', slug: '' },
				{
					label: 'Blog',
					items: [
						{
							label: 'Networking',
							autogenerate: { directory: 'blog/networking' },
						},
						{
							label: 'Operating Systems',
							autogenerate: { directory: 'blog/operating-systems' },
						},
						{
							label: 'Databases',
							autogenerate: { directory: 'blog/databases' },
						},
						{
							label: 'LLM',
							autogenerate: { directory: 'blog/llm' },
						},
					],
				},
			],
		}),
	],
});
