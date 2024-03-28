import { Member } from "src/members/entities/member.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ type: "text", nullable: true })
    content: string;

    @ManyToOne(() => Member)
    member: Member;

    @ManyToMany(() => Member)
    @JoinTable()
    sharedWith: Member[];

    @CreateDateColumn()
    readonly created_at: Date 
  
    @UpdateDateColumn()
    readonly updated_at: Date
}
