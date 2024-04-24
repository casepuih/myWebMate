import { Exclude, Expose, Transform } from "class-transformer";
import { Member } from "src/modules/members/entities/member.entity";
import { Permission } from "src/modules/permissions/entities/permission.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ type: "text", nullable: true })
    content: string;

    @Exclude()
    @ManyToOne(() => Member, member => member.notes, { eager: true })
    member: Member;

    @Exclude()
    @ManyToMany(() => Member, { eager: true })
    @JoinTable()
    sharedWith?: Member[];

    @OneToMany(() => Permission, permission => permission.note)
    permissions: Permission[]

    @Exclude()
    @CreateDateColumn()
    readonly created_at: Date 
  
    @Exclude()
    @UpdateDateColumn()
    readonly updated_at: Date
}
