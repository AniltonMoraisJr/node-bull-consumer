import AppDataSource from '..';
import { Candidate } from '../entities/Candidate';

export const candidateReposity = AppDataSource.getRepository(Candidate);
