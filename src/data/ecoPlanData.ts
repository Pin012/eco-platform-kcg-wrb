import ecoPlanMarkdown from '../content/ecoplan.md?raw';
import { parseEcoPlanMarkdown } from './contentParsers';

export const ECO_PLAN_IMAGE_DIRECTORY = '/images/ecological-measures/';
export const ecoPlanData = parseEcoPlanMarkdown(ecoPlanMarkdown);
