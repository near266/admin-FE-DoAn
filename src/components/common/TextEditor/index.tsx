import { useLayoutEffect, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import { debounce } from 'lodash-es';
import cx from 'classnames';
import 'quill/dist/quill.snow.css';
import { fileService } from '@/shared/services/fileService';
import { useOnceCallWhenExistValue } from '@/shared/common';
import { Container } from './styles';

interface IProps {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (par: string) => any;
  getEditor?: (any) => any;
}

const TextEditor = ({
  className,
  placeholder,
  // we're not really feeding new value to quill instance on each render because it's too
  // expensive, but we're still accepting 'value' prop as alias for defaultValue because
  // other components like <Form.Field> feed their children with data via the 'value' prop
  value: alsoDefaultValue,
  onChange,
  getEditor,
}: IProps) => {
  const containerRef = useRef<HTMLDivElement>();
  const editorRef = useRef<HTMLDivElement>();
  const quillRef = useRef<Quill>();

  const quillConfig = useMemo(() => {
    // Handle when choose image in editor
    function imageHandler() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        const formData = new FormData();
        formData.append('image', file);

        uploadFiles(formData);
      };
    }

    return {
      theme: 'snow',
      // scrollingContainer: document.documentElement,
      scrollingContainer: 'body',
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'],
            ['blockquote', 'code-block'],
            [{ color: [] }, { background: [] }],
            ['clean'],
          ],
          handlers: {
            image: imageHandler,
          },
        },
      },
    };
  }, []);

  // Initial editor
  useLayoutEffect(() => {
    const currentEditorContainer = containerRef.current;
    quillRef.current = new Quill(editorRef.current, { placeholder, ...quillConfig });

    containerRef.current.querySelector('.ql-editor').setAttribute('spellcheck', 'false');

    const handleContentsChange = debounce(() => {
      onChange(getHTMLValue());
    }, 100);

    const getHTMLValue = () => {
      return containerRef.current.querySelector('.ql-editor').innerHTML;
    };

    getEditor({ getValue: getHTMLValue });

    quillRef.current.on('text-change', handleContentsChange);
    return () => {
      quillRef.current.off('text-change', handleContentsChange);
      quillRef.current = null;
      currentEditorContainer.querySelector('.ql-toolbar')?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fix autoscroll when choose toolbar
  useEffect(() => {
    function handlePreventAutoScroll(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
    }

    document.querySelectorAll('.ql-box .ql-picker').forEach((tool) => {
      tool.addEventListener('mousedown', handlePreventAutoScroll);
    });

    document.querySelectorAll('.ql-box .ql-action').forEach((tool) => {
      tool.addEventListener('mousedown', handlePreventAutoScroll);
    });

    return () => {
      document.querySelectorAll('.ql-box .ql-picker').forEach((tool) => {
        tool.removeEventListener('mousedown', handlePreventAutoScroll);
      });

      document.querySelectorAll('.ql-box .ql-action').forEach((tool) => {
        tool.removeEventListener('mousedown', handlePreventAutoScroll);
      });
    };
  }, []);

  // Fix editor toolbar in top when scroll
  useEffect(() => {
    let didScroll = false;
    const editor: HTMLElement = containerRef.current;
    const toolbarElement: HTMLElement = editor.querySelector('.ql-toolbar');

    function scrollIt() {
      didScroll = true;
    }

    function handleWindowScroll() {
      // Check is scroll
      if (!didScroll) {
        return;
      }

      const offsetTop =
        editor.ownerDocument.defaultView.pageYOffset + editor.getBoundingClientRect().top;
      const isSticky = editor.classList.contains('ql-sticky-on');

      if (window.scrollY >= offsetTop && !isSticky) {
        editor.classList.add('ql-sticky-on');
        toolbarElement.style.width = `${editor.clientWidth}px`;
      }

      if (window.scrollY < offsetTop && isSticky) {
        editor.classList.remove('ql-sticky-on');
        toolbarElement.style.width = null;
      }

      // Unset scroll
      didScroll = false;
    }

    window.addEventListener('scroll', scrollIt);
    const intervalCheckScroll = setInterval(handleWindowScroll, 100);

    return () => {
      window.removeEventListener('scroll', scrollIt);
      clearInterval(intervalCheckScroll);
    };
  }, []);

  useOnceCallWhenExistValue(
    () => {
      insertInitialValue();
    },
    alsoDefaultValue,
    100
  );

  const insertInitialValue = () => {
    const initialValue = alsoDefaultValue || '';
    quillRef.current.clipboard.dangerouslyPasteHTML(0, initialValue);
    quillRef.current.blur();
  };

  const uploadFiles = async (formData: FormData) => {
    const res = await fileService.upload('editor', formData);

    if (res.code === 'SUCCESS') {
      // Insert image to editor
      const range = quillRef.current.getSelection();
      quillRef.current.insertEmbed(range.index, 'image', res.payload.url);

      return res.payload;
    }
  };

  return (
    <>
      <Container className={cx(className, 'ql-box')} ref={containerRef}>
        <div ref={editorRef} />
      </Container>
    </>
  );
};

TextEditor.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  getEditor: PropTypes.func,
};

TextEditor.defaultProps = {
  className: undefined,
  placeholder: undefined,
  value: undefined,
  onChange: () => {},
  getEditor: () => {},
};

export default TextEditor;
