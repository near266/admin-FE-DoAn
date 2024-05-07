import styled from '@emotion/styled';

export const Container = styled.div`
  .ql-toolbar.ql-snow {
    border-radius: 4px 4px 0 0;
    border-bottom: none;
    background: #fff;
    z-index: 10;
  }

  &.ql-sticky-on .ql-toolbar {
    position: fixed;
    top: 0px;
    border: 1px solid #ccc;
    z-index: 1001;
  }

  .ql-container.ql-snow {
    border-radius: 0 0 4px 4px;
    border: 1px solid initial;
    border-top: none;
    color: #172b4d;
    font-size: 16px;
  }

  .ql-editor {
    min-height: 100px;
  }

  .ql-editor p,
  .ql-editor ol,
  .ql-editor ul,
  .ql-editor pre,
  .ql-editor blockquote,
  .ql-editor h1,
  .ql-editor h2,
  .ql-editor h3,
  .ql-editor h4,
  .ql-editor h5,
  .ql-editor h6 {
    margin-bottom: 1rem;
  }
`;
