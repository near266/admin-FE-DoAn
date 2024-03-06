import SrcIcons from '@/assets/icons';
import CKEditor from '@ckeditor/ckeditor5-react';
import dynamic from 'next/dynamic';
import Image from 'next/legacy/image';
import { useCallback, useRef } from 'react';

export interface IEditorBlockProps {
  title?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  required?: boolean;
}
const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => (
    <div className="w-full flex justify-center items-center z-30">
      <Image
        width={100}
        height={100}
        objectFit="cover"
        src={SrcIcons.sunnyLoading}
        priority
        quality={1}
        alt=""
      />
    </div>
  ),
});
export function EditorBlock(props: IEditorBlockProps) {
  const { title, defaultValue, onChange } = props;
  const editorRef = useRef<CKEditor>(null);
  const onEditorChange = useCallback((value: string) => {
    onChange(value);
  }, []);
  return (
    <>
      <div className="">
        <p className="block_title">
          {require && ''}&nbsp;{title}
        </p>
        <div className="">
          <Editor onChange={onEditorChange} defaultValue={defaultValue} />
        </div>
      </div>
    </>
  );
}
