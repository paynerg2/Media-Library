import { Document } from 'mongoose';
import { Game } from '../../client/src/lib/interfaces';

export interface IGame extends Game, Document {}
