import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  org_id: number;

  @Column({ type: 'simple-array', default: null })
  products: string[];
}
