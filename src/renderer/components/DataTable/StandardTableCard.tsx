import React, { PureComponent } from 'react';
import styles from './StandardTableCard.less';
import { Card } from 'antd';
import { BaseProps } from '@/models/connect';

interface IStandardTableCardProps extends BaseProps {
  query?: JSX.Element;
}

class StandardTableCard extends PureComponent<IStandardTableCardProps> {
  render() {
    const { query } = this.props;
    return (
      <Card className={styles.root}>
        {query ? <div className={styles.query}>{query}</div> : null}
        <div className={styles.content}>{this.props.children}</div>
      </Card>
    );
  }
}

export default StandardTableCard;
