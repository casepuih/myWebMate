import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Link } from "./link.entity";
import { Member } from "src/modules/members/entities/member.entity";

@Entity()
export class LinkGroup {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, length: 50 })
    name: string 

    @Column({ length: 400})
    description: string

    @OneToMany(() => Link, link => link.linkGroup)
    links: Link[]

    @ManyToOne(() => Member)
    member: Member

}