import { bookTypes } from '../formats';

export const authorIsRequired = 'At least one author is required';
export const invalidType = `Type must be one of the following: ${bookTypes}`;
export const typeIsRequired = 'Type must be specified';
export const languageIsRequired = 'Language must be specified';
export const volumeMustBePositive =
    'Negative numbers for volume are not allowed';
