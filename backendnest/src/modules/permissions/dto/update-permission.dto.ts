import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsEnum, IsInt } from 'class-validator';
import { PermissionLevel } from 'src/enums/permission.enum';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
    @IsInt()
    memberId: number

    @IsInt()
    noteId: number

    @IsEnum(PermissionLevel)
    level: PermissionLevel
}
