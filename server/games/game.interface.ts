import { Document } from 'mongoose';
import { Game } from '../../lib/interfaces';

export interface IGame extends Game, Document {}
