import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import { FC } from 'react';

const JsonEditor: FC<{ value: any; onChange: any }> = ({ value, onChange }) => {
  return <Editor value={value} onChange={onChange} />;
};

export default JsonEditor;
