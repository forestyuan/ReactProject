import React from 'react';
import { toast } from 'react-toastify';
import ToastContent from '../Components/ToastContent';

export class Toast {
  static options = { autoClose: 1500, position: toast.POSITION.TOP_RIGHT };

  static success(messageType = 'actionSuccess', options = {}) {
    toast.success(<ToastContent content={messageType}/>, Object.assign(Toast.options, options));
  }

  static failed(messageType = 'actionFailed', options = {}) {
    toast.error(<ToastContent content={messageType}/>, Object.assign(Toast.options, options));
  }
}
