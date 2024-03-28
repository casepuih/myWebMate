import { Optional } from "@nestjs/common"
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsString } from "class-validator"

export class CreateNoteDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    content: string

    @IsNotEmpty()
    @IsInt()
    member: number

    @Optional()
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    sharedWith?: number[]
}
