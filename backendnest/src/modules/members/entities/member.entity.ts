import { Exclude, Transform } from 'class-transformer';
import { Invitation } from 'src/modules/invitations/entities/invitation.entity';
import { Note } from 'src/modules/notes/entities/note.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

    @Exclude()
    @ManyToMany(type => Member)
    @JoinTable()
    friends: Member[]

    @Transform(({ value }) => value.map(member => member.id))
    friendIds: number[]


    @OneToMany(() => Invitation, invitation => invitation.receiver)
    receivedInvitations: Invitation[]

    @OneToMany(() => Invitation, invitation => invitation.sender)
    sentInvitations: Invitation[]

    @CreateDateColumn()
    readonly created_at: Date 
  
    @UpdateDateColumn()
    readonly updated_at: Date 
}
