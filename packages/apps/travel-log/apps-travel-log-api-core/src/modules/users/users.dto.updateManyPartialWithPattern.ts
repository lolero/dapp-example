import { RequestsDtoBodyUpdateOnePartialWithPatternIdInt } from '@js-modules/api-nest-utils';
import { UsersDtoUpdateOnePartial } from './users.dto.updateOnePartial';

export class UsersDtoUpdateOnePartialWithPattern extends RequestsDtoBodyUpdateOnePartialWithPatternIdInt<UsersDtoUpdateOnePartial> {}
