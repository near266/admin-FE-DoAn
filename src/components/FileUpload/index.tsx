import SrcIcons from '@/assets/icons';
import { Button, message, Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import Image from 'next/legacy/image';
import React, { useCallback, useState } from 'react';
interface IProps {
  defaultImage?: string;
  onChange: (file: UploadChangeParam<UploadFile>) => void;
}
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Hãy sử dụng ảnh có định dạng là JPG/PNG !');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.warning('Kích cỡ ảnh không nên quá 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
const FileUploader: React.FC<IProps> = (props: IProps) => {
  const { defaultImage, onChange } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([
    { uid: '-1', name: '', status: 'done', url: defaultImage ?? '' },
  ]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const onFileChange: UploadProps['onChange'] = useCallback(
    ({ fileList: newFileList, event }) => {
      if (fileList[0].status === 'uploading') {
        setLoading(true);
        return;
      }
      if (fileList[0].status === 'done') {
        // Get this url from response
      }
      if (newFileList.length > 0) {
        const lastestImage = newFileList[newFileList.length - 1];
        setFileList([lastestImage]);
      } else {
        setFileList([]);
      }
      onChange({ fileList: newFileList, file: newFileList[0], event: event });
    },
    []
  );

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };
  const handleCancel = () => setPreviewVisible(false);
  return (
    <>
      {/* <ImgCrop rotate quality={1} zoom> */}
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={onFileChange}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
      >
        {/* {fileList.length < 5 && '+ Upload'} */}
        <Button
          size="large"
          className="rounded-[10px] bg-white flex items-center justify-center text-[var(--primary-color)] "
        >
          <div className="relative h-5 w-5">
            <Image src={SrcIcons.plusActionIcon} layout="fill" />
          </div>
          <span className="text-sm leading-[21px]">Thêm ảnh </span>
        </Button>
      </Upload>
      {/* </ImgCrop> */}
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default FileUploader;
