import { Member } from "src/modules/members/entities/member.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['sender', 'receiver'])
export class Invitation {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Member)
    receiver : Member

    @ManyToOne(() => Member)
    sender : Member

}
