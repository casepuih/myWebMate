import { PermissionLevel } from "src/enums/permission.enum";
import { Member } from "src/modules/members/entities/member.entity";
import { Note } from "src/modules/notes/entities/note.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number 

    @ManyToOne(() => Member, member => member.permissions)
    member: Member

    @ManyToOne(() => Note, note => note.permissions)
    note: Note

    @Column({ type: 'enum', enum: PermissionLevel })
    level: PermissionLevel
}
