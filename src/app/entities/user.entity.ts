// import { hashPassword } from '@foal/core';
import {BaseEntity, Column, /*Column, */Entity, PrimaryGeneratedColumn} from 'typeorm';
import {hashPassword} from "@foal/core";

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;


  //todo is this secure?, actually probably doens't matter much, the tokens won't be worth much probably
  @Column()
  tokenAccountSecret : string

  @Column()
  distributionAccountSecret : string


  async setPassword(password: string) {
    this.password = await hashPassword(password);
  }

}
