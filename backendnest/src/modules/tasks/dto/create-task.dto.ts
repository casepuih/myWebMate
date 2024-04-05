import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsInt, isInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { Member } from "src/modules/members/entities/member.entity";
import { Recurrence } from "../entities/task.entity";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsDateString()
    dateBegin: Date;

    @IsOptional()
    @IsBoolean()
    isRecurring?: boolean;

    @ValidateIf((o) => o.isRecurring)
    @IsEnum({ 
      NONE: "",
      DAILY: "daily",
      WEEKLY: "weekly",
      MONTHLY: "monthly",
      ANNUAL: "annual",
    })
    recurrence?: Recurrence;

    member: number;
}
