import { Member } from "src/modules/members/entities/member.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invitation {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Member)
    receiver : Member

    @ManyToOne(() => Member)
    sender : Member

}
