import plantsMarkdown from '../content/plants.md?raw';
import { parsePlantMarkdown } from './contentParsers';

const uploadedPlantImages = import.meta.glob('../assets/plants/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

const getUploadedPlantImage = (imageFile: string) => {
  if (!imageFile) return '';
  const normalizedImageFile = imageFile.replace(/^\/?/, '');
  const matchedEntry = Object.entries(uploadedPlantImages).find(([path]) => path.endsWith(`/plants/${normalizedImageFile}`));
  return matchedEntry?.[1] ?? '';
};

const parsedPlants = parsePlantMarkdown(plantsMarkdown);

export const plantMeta = parsedPlants.meta;
export const plantRecommendationGroups = parsedPlants.groups.map((group) => ({
  ...group,
  plants: group.plants.map((plant) => ({
    ...plant,
    image: getUploadedPlantImage(plant.imageFile) || plant.image,
  })),
}));
