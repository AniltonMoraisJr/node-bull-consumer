import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Email {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('varchar')
  message: string;
}
