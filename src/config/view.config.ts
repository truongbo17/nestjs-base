import { ViewConfigType } from './view.config.type';
import { registerAs } from '@nestjs/config';

export default registerAs<ViewConfigType>('view', () => {
  return {
    pathPublic: 'public',
    pathView: 'views',
    engine: 'hbs',
  };
});
