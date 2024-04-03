import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invitation {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false})
    receiverInvitationEmail
}
