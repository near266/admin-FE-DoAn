import { FC, BaseSyntheticEvent, useContext, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';

import { fileService } from '@/shared/services/fileService';
import { UploadFolderType } from '@/interfaces/type/common';
import FormContext from '../../contexts/FormContext';
import styles from './styles.module.scss';

interface IProps {
  uploadFolder: UploadFolderType;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  [x: string]: any;
}

const FileUpload: FC<IProps> = ({
  uploadFolder,
  name,
  label,
  placeholder,
  className,
  ...rest
}) => {
  const fileRef = useRef<any>();
  const { form } = useContext(FormContext);

  const [processing, setProcessing] = useState(false);
  const [filePlaceholderState, setFilePlaceholderState] = useState<string>();

  useEffect(() => {
    setFilePlaceholderState(placeholder);
  }, [placeholder]);

  const showFileChooser = () => {
    if (processing) {
      return;
    }
    fileRef.current.click();
  };

  const handleFileChange = (e: BaseSyntheticEvent) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      setProcessing(true);

      // create form data
      const formData = new FormData();
      formData.append('image', files['0']);

      fileService
        .upload(uploadFolder, formData)
        .then((res) => {
          if (res?.code === 'SUCCESS') {
            setFilePlaceholderState(files[0].name);
            form.setFieldValue(name, res.payload.url);
          }
        })
        .finally(() => setProcessing(false));
    } else {
      setFilePlaceholderState(placeholder);
    }
  };

  return (
    <div className={className}>
      <div className={styles.uploadArea} onClick={() => showFileChooser()}>
        <input
          {...rest}
          className={styles.uploadArea__file}
          onChange={(e) => handleFileChange(e)}
          name={name}
          type="file"
          ref={fileRef}
        />
        {processing ? (
          <CircularProgress size={26} />
        ) : (
          <div className={styles.uploadArea__chosser}>
            <i className="bi bi-image-fill"></i>
            <span className={styles.uploadArea__placeholder}>{filePlaceholderState}</span>
          </div>
        )}
      </div>
      {form.values[name] && (
        <div className={styles.preview}>
          <img src={form.values[name]} alt="preview" />
        </div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  uploadFolder: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  textFieldProps: PropTypes.object,
};

export default FileUpload;
