import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'organization' })
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  org_name: string;

  @Column({ type: 'simple-array', default: null })
  users: number[];

  @Column({ type: 'boolean' })
  is_active: boolean;

  @Column({ type: 'varchar' })
  domain: string;
}
