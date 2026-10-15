export type Scene = {
	id: string;
	label: string;
	navGroup: 'inicio' | 'equipamiento' | 'proceso' | 'cocina';
	eyebrow: string;
	title: string;
	body: string;
	poster: string;
	clip: string;
	alt: string;
	accent: string;
	scrollWeight: number;
	objectPosition: string;
};

export const scenes: Scene[] = [
	{
		id: 'almacen', label: 'Almacén', navGroup: 'inicio', eyebrow: 'El recorrido empieza aquí',
		title: 'Del almacén a tu cocina profesional.',
		body: 'Equipamiento profesional en acero inoxidable para hostelería y restauración.',
		poster: '/media/posters/scene-01-warehouse.webp', clip: '/media/videos/scene-01.mp4',
		alt: 'Diorama isométrico de un almacén INOXNOW con operarios y una carretilla',
		accent: '#76528f', scrollWeight: 1.55, objectPosition: '66% 50%',
	},
	{
		id: 'showroom', label: 'Showroom', navGroup: 'equipamiento', eyebrow: 'Equipamiento',
		title: 'El equipamiento adecuado para cada espacio.',
		body: 'Mesas de trabajo, fregaderos, campanas, lavamanos y soluciones de almacenamiento para cocinas profesionales.',
		poster: '/media/posters/scene-02-showroom.webp', clip: '/media/videos/scene-02.mp4',
		alt: 'Diorama isométrico de un showroom con mobiliario profesional de acero inoxidable',
		accent: '#6d568c', scrollWeight: 1.35, objectPosition: '66% 50%',
	},
	{
		id: 'expedicion', label: 'Expedición', navGroup: 'proceso', eyebrow: 'Expedición',
		title: 'Preparados para llegar a tu negocio.',
		body: 'Equipamiento de acero inoxidable para espacios donde cada detalle importa.',
		poster: '/media/posters/scene-03-expedition.webp', clip: '/media/videos/scene-03.mp4',
		alt: 'Diorama isométrico del área de expedición con camión, carga y carretilla',
		accent: '#7b5b91', scrollWeight: 1.25, objectPosition: '67% 50%',
	},
	{
		id: 'espacio', label: 'El espacio', navGroup: 'proceso', eyebrow: 'Planificación',
		title: 'Todo comienza con un espacio.',
		body: 'Cada cocina profesional necesita una distribución y un equipamiento adaptados a su actividad.',
		poster: '/media/posters/scene-04-empty-kitchen.webp', clip: '/media/videos/scene-04.mp4',
		alt: 'Diorama de una cocina profesional vacía con dos profesionales conversando',
		accent: '#725783', scrollWeight: 1.3, objectPosition: '68% 50%',
	},
	{
		id: 'instalacion', label: 'Instalación', navGroup: 'proceso', eyebrow: 'Organización',
		title: 'Cada pieza encuentra su lugar.',
		body: 'Mobiliario y equipamiento para organizar las zonas de preparación, lavado y almacenamiento.',
		poster: '/media/posters/scene-05-installation.webp', clip: '/media/videos/scene-05.mp4',
		alt: 'Diorama isométrico de una cocina en fase de instalación con operarios',
		accent: '#75538e', scrollWeight: 1.35, objectPosition: '67% 50%',
	},
	{
		id: 'cocina', label: 'Tu cocina', navGroup: 'cocina', eyebrow: 'Lista para el servicio',
		title: 'Preparada para trabajar.',
		body: 'INOXNOW. Equipamiento profesional en acero inoxidable para cocinas exigentes.',
		poster: '/media/posters/scene-06-operational-kitchen.webp', clip: '/media/videos/scene-06.mp4',
		alt: 'Diorama isométrico de una cocina profesional operativa con chefs trabajando',
		accent: '#6b4f86', scrollWeight: 1.55, objectPosition: '72% 50%',
	},
];

export const bridges = [
	{ id: '01-02', from: '/media/keyframes/scene-01-end.png', to: '/media/keyframes/scene-02-start.png', fallback: '/media/transitions/bridge-01-02-preview.png' },
	{ id: '02-03', from: '/media/keyframes/scene-02-end.png', to: '/media/keyframes/scene-03-start.png', fallback: '/media/transitions/bridge-02-03-preview.png' },
	{ id: '03-04', from: '/media/keyframes/scene-03-end.png', to: '/media/keyframes/scene-04-start.png', fallback: '/media/transitions/bridge-03-04-preview.png' },
	{ id: '04-05', from: '/media/keyframes/scene-04-end.png', to: '/media/keyframes/scene-05-start.png', fallback: '/media/transitions/bridge-04-05-preview.png' },
	{ id: '05-06', from: '/media/keyframes/scene-05-end.png', to: '/media/keyframes/scene-06-start.png', fallback: '/media/transitions/bridge-05-06-preview.png' },
];
