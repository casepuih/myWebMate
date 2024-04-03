import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateInvitationDto {
    @IsNotEmpty()
    @IsEmail()
    @Length(4, 200)
    receiverInvitationEmail: string
}
