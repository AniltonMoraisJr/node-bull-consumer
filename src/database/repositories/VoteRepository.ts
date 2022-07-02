import AppDataSource from '..';
import { Vote } from '../entities/Vote';

export const voteReposity = AppDataSource.getRepository(Vote);
