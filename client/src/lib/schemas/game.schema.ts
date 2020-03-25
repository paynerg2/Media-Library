import * as yup from 'yup';
import { itemSchema } from './item.schema';
import {
    platformIsRequired,
    multiplayerMustBeIndicated
} from '../messages/game.errorMessages';

export const gameSchema: yup.ObjectSchema = itemSchema.shape({
    platforms: yup
        .array()
        .of(yup.string())
        .required(platformIsRequired),
    multiplayer: yup.boolean().required(multiplayerMustBeIndicated),
    languages: yup.array().of(yup.string()),
    genre: yup.string()
});
