import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product_provisioning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  orgid: number;

  @Column({ type: 'int' })
  subscription_id: number;

  @Column({ type: 'text', array: true, default: [] })
  events: string[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
