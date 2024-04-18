type VSCodeMessageTemplate<T extends any> = {
  name: string;
  data: T;
};

type VSCodeMessage = VSCodeMessageTemplate<any>;

type VSCodeMessageFileChange = VSCodeMessageTemplate<{
  fileName: string;
  text: string;
}>;