import { PureComponent } from "react";
import { Drawer } from "antd";
import BaseProductForm from "./BaseProductForm";
import EyeglassesForm from "./EyeglassesForm";
import ContactLensesForm from "./ContactLensesForm";
import ServiceProductForm from "./ServiceProductForm";
import styles from './UpdateModal.less';

interface UpdateModalProps {
  visible?: boolean;
  onClose?: () => void;
  productInfo?: {
    kind?: number;
    [key: string]: any;
  };
}

interface UpdateModalState {
  // productInfo: any;
}

class UpdateModal extends PureComponent<UpdateModalProps, UpdateModalState> {

  state: UpdateModalState = {
    // productInfo: {},
  }

  render() {
    
    const { kind = 0 } = this.props.productInfo || {};
    console.log(kind, 'kind ===');
    return <Drawer
      visible={this.props.visible}
      onClose={this.props.onClose}
      className={styles.modal}
      width="100%"
      placement="right"
      title="修改商品信息"
    >
      {
        (+kind === 0) ? (
          <BaseProductForm initData={this.props.productInfo} />
        ) : null
      }
      {
        +kind === 1 ? (
          <EyeglassesForm />
        ) : null
      }
      {
        +kind === 2 ? (
          <ContactLensesForm />
        ) : null
      }
      {
        +kind === 3 ? (
          <ServiceProductForm />
        ) : null
      }
    </Drawer>
  }
}

export default UpdateModal;