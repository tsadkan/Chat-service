import { IsString, IsDate, IsOptional } from "class-validator";

export class BlockedUserDTO {    
    @IsString()
    id: string;

    @IsOptional()
    @IsDate()
    until?: Date;
}