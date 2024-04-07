import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
    firstname?: string 
    lastname?: string 
    oldPassword?: string 
    newPassword?: string 
    newEmail?: string
}
