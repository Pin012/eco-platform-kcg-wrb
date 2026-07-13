import plantsMarkdown from '../content/plants.md?raw';
import { parsePlantMarkdown } from './contentParsers';

const parsedPlants = parsePlantMarkdown(plantsMarkdown);

export const plantMeta = parsedPlants.meta;
export const plantRecommendationGroups = parsedPlants.groups;
