import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class User_creds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  uid: number;

  @Column({ type: 'varchar' })
  sha32: string;

  @Column({ type: 'varchar' })
  md5: string;
}
