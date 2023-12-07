import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Sessions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  uid: number;

  @Column({ type: 'int' })
  orgid: number;

  @Column({ type: 'timestamp' })
  started: Date;

  @Column({ type: 'timestamp' })
  ended: Date;

  @Column({ type: 'timestamp' })
  valid_till: Date;

  @Column({ type: 'timestamp' })
  last_ping: Date;
}
