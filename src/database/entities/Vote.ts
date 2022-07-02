import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Candidate } from './Candidate';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  partyNumber: number;

  @ManyToOne(() => Candidate)
  @JoinColumn({ name: 'partyNumber' })
  candidate: Candidate;
}
