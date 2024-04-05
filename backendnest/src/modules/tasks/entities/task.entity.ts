import { Member } from "src/modules/members/entities/member.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Recurrence {
    NONE="",
    DAILY="daily",
    WEEKLY="weekly",
    MONTHLY="monthly",
    ANNUAL="annual",
}

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ type: "text" })
    description: string;

    @Column({ nullable: false })
    dateBegin: Date;

    @Column({ default: false })
    isRecurring: boolean;

    @Column({ 
        type: "enum",
        enum: Recurrence,
        default: Recurrence.NONE,
    })
    recurrence: Recurrence;

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
