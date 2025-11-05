// helpers/MessageNotifier.js
import { message } from 'antd';

const MessageNotifier = {
  success: (text) => message.success(text, 3), // duración 3s
  error: (text) => message.error(text, 3),
  info: (text) => message.info(text, 3),
};

export default MessageNotifier;
