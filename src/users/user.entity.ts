import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove } from 'typeorm'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    password: string

    @AfterInsert()
    logInsert() {
        console.log('Inserted User id: ', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updating user: ', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removing user with id: ', this.id);
    }
}