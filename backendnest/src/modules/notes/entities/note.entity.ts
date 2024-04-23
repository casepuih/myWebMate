import { Exclude, Expose, Transform } from "class-transformer";
import { Member } from "src/modules/members/entities/member.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Expose()
    get sharedWithIds(): number[] {
        const ids = this.sharedWith.map(member => member.id)
        return ids
    }

    @Exclude()
    @CreateDateColumn()
    readonly created_at: Date 
  
    @Exclude()
    @UpdateDateColumn()
    readonly updated_at: Date
}
