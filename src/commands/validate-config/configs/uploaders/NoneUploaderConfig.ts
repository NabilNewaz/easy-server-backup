import * as yup from 'yup';

export type NoneUploaderConfig = {
  type: 'none';
};

export const NoneUploaderConfigSchema = yup.object().shape({
  type: yup.string().required().matches(new RegExp('none'))
});
