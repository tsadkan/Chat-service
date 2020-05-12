import { IsString, IsArray, IsBoolean } from 'class-validator';
import { BaseModelDTO } from '@leocloud/shared/dist/helpers/typegoose/base-model';
import { ApiModelProperty } from '@nestjs/swagger';
import { UserStatuses } from '../enums/userstatuses.enum';

export class ChatUserDTO extends BaseModelDTO {
  public constructor(init?: Partial<ChatUserDTO>) {
    super();
    Object.assign(this, init);
  }

  @IsString()
  @ApiModelProperty({ type: String, required: true })
  userId: string;

  @IsString()
  @ApiModelProperty({ type: String })
  profileId?: string;

  @IsString()
  @ApiModelProperty({ type: String })
  email: string;

  @IsString()
  @ApiModelProperty({ type: String })
  firstname: string;

  @IsString()
  @ApiModelProperty({ type: String })
  lastname: string;

  @IsBoolean()
  @ApiModelProperty({ type: String, default: false })
  blocked?: boolean;

  @IsString()
  @ApiModelProperty({ type: String, required: true })
  companyId: string;

  @IsArray()
  @ApiModelProperty({ type: Array, default: [] })
  teamIds?: Array<string>;

  @IsString()
  @ApiModelProperty({ type: String, default: UserStatuses.NOT_AVAILABLE })
  status?: string;
}
