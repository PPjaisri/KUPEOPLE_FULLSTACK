import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

type myProps = {  }
type myState = { content: any }

export default class TextEditor extends React.Component<myProps, myState> {
  constructor(props: any) {
    super(props);

    this.state = { content: '' };
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  handleEditorChange(content: any, editor: any) {
    this.setState({ content });
  }

  render() {
    console.log(this.state.content);
    const message = this.state.content;
    localStorage.setItem("message", message);
    
    return (
      <div>

        <Editor
          apiKey="mst7ooroci6ekyb714kes48cufcv5yx1nnnncjaumak2xq9w"
          value={this.state.content}
          onEditorChange={this.handleEditorChange}
        />

      </div>
    );
  }
}