import { IsEnum, IsInt } from "class-validator";
import { PermissionLevel } from "src/enums/permission.enum";

export class CreatePermissionDto {
    @IsInt()
    memberId: number

    @IsInt()
    noteId: number

    @IsEnum(PermissionLevel)
    level: PermissionLevel
}
