import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-react';
import PropTypes from 'prop-types';
import { memo, useCallback, useRef, useState } from 'react';
interface IProps {
  data?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange: (data: string) => void;
  onReady?: () => void;
  onInit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onError?: () => void;
}

const Editor: React.FC<IProps> = (props: IProps) => {
  const {
    data,
    defaultValue,
    disabled,
    onChange,
    onReady,
    onInit,
    onFocus,
    onBlur,
    onError,
  } = props;
  const [curData, setData] = useState(data ?? '');
  const onType = useCallback(
    (event: any, editor: CKEditor) => {
      const data = editor.getData();
      setData(data);
      if (onChange) {
        onChange(data);
      }
    },
    [onChange]
  );
  const editorRef = useRef();

  return (
    <div className="">
      <CKEditor
        editor={ClassicEditor}
        data={defaultValue ?? curData}
        onInit={onInit}
        onReady={onReady}
        onFocus={onFocus}
        onBlur={onBlur}
        onError={onError}
        disabled={disabled}
        onChange={onType}
      />
      {/* <div dangerouslySetInnerHTML={{ __html: data }} /> */}
    </div>
  );
};

Editor.propTypes = {
  data: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onReady: PropTypes.func,
  onInit: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onError: PropTypes.func,
};

Editor.defaultProps = {
  data: '',
  defaultValue: '',
  disabled: false,
  onChange: () => {},
  onReady: () => {},
  onInit: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onError: () => {},
};
export default memo(Editor);
