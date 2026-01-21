import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
	layout('layouts/AppLayout.tsx', [layout('layouts/GalleryLayout.tsx', [index('pages/Index.tsx')]), route('upload', 'pages/Upload.tsx')]),
	route('*', 'pages/NotFound.tsx'),
] satisfies RouteConfig;
