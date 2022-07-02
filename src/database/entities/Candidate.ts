import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vote } from './Vote';

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  partyNumber: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  photo: string;

  @OneToMany(() => Vote, (vote) => vote.partyNumber, { cascade: true })
  @JoinColumn({ name: 'partyNumber' })
  votes: Vote[];
}
