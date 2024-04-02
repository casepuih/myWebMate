import { Exclude } from 'class-transformer';
import { Note } from 'src/notes/entities/note.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    hashPassword: string;

    @Column({ default: false })
    isAdmin: boolean;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @OneToMany(() => Note, note => note.member)
    notes: Note[]

    @CreateDateColumn()
    readonly created_at: Date 
  
    @UpdateDateColumn()
    readonly updated_at: Date 
}
