import { Formik, Form, Field } from 'formik';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import { baseUrl } from '../config/constant';
import '../CSSsource/CreateComment.css';
import AuthService from '../service/AuthService';
import TextEditor from './TextEditor';

function CommentForm() {
  const { ThreadID } = useParams();
  const history = useHistory();
  const message = localStorage.message;

  return (
    <Formik
      initialValues={{ reply: '', size: '', comment: message, text_type: [] }}
      onSubmit={async (values, actions) => {
        console.log(values.comment)
        const createOption = {
          "userID": AuthService.getUserID(),
          "content": values.comment,
          "image_arr": [],
          "reply_to": Number(values.reply),
        };
        const res = await fetch(`${ baseUrl }/threads/${ThreadID}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createOption)
        }).then(history.goBack);
        localStorage.removeItem("message");
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="createcm-repltyo-frame">
            <label>
              <div className="createcm-replyto">Reply to:</div>
              <Field type="input" id="createcm_replyto_input" name="reply" placeholder="Comment numbers" style={{ width: "250px", height: "70px" }} />
            </label>
          </div>

          <p className="createcm-leave-empty">*If you do not reply just leave it empty</p>
          <div className="createcm-cm-frame">
            <div className="createcm-placecm">Place your comment :</div>
            <div className="createcm-green-frame">
              <div className="createcm-send">
                <button className="createcm-send-frame" disabled={ isSubmitting }>
                  Send
                </button>
              </div>
            </div>
            {/* <Field type="input" name="comment" className="createrp_reason_input" style={{ width: "1140px", height: "250px" }} /> */}
            <div className="createrp_reason_input">
              <TextEditor />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CommentForm;