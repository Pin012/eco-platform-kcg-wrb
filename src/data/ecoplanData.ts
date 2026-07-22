import ecoplanMarkdown from '../content/ecoplan.md?raw';
import { parseEcoplanMarkdown } from './contentParsers';

const PHOTO_DIRECTORY = '/images/ecological-measures/';

export const ecologicalMeasures = parseEcoplanMarkdown(ecoplanMarkdown).map((measure) => ({
  ...measure,
  photos: measure.photos.map((photo) => ({ ...photo, src: `${PHOTO_DIRECTORY}${photo.fileName}` })),
}));
