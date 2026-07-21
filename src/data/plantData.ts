import plantsMarkdown from '../content/plants.md?raw';
import { parsePlantMarkdown } from './contentParsers';

const PLANT_IMAGE_DIRECTORY = '/images/planting-suggestions/';

const parsedPlants = parsePlantMarkdown(plantsMarkdown);

export const plantingSuggestions = parsedPlants.suggestions.map((suggestion) => ({
  ...suggestion,
  cards: suggestion.cards.map(({ imageFile, ...card }) => ({
    ...card,
    image: imageFile ? `${PLANT_IMAGE_DIRECTORY}${imageFile}` : '',
  })),
}));
