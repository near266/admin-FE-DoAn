import { httpClient } from '@/core';
import { AxiosResponse } from 'axios';

import { IServerResponse } from '@/interfaces/server';
import { UploadFolderType } from '@/interfaces/type/common';

class FileService {
  async upload(uploadFolder: UploadFolderType, formData: FormData) {
    const config = {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    };

    const res: AxiosResponse<IServerResponse> = await httpClient.post(
      `save-image/${uploadFolder}`,
      formData,
      config
    );

    return res.data;
  }
}

export const fileService = new FileService();
