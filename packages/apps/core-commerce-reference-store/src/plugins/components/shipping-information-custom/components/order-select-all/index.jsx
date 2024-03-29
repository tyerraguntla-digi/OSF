/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import React, {useContext} from 'react';
import {ProductSelectionContext, OrderContext, ContainerContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from '@oracle-cx-commerce/react-widgets/profile/shipping-information/components/order-select-all/styles.css';

const OrderSelectAll = props => {
  const {commerceItems = {}, actionSelectAll, actionDeselectAll} = props;

  // context
  const {productSelection = [], setProductSelection = () => {}} = useContext(ProductSelectionContext || {});

  const isSelectAll = productSelection.length !== Object.entries(commerceItems).length;

  const handleClick = () => {
    if (isSelectAll) {
      setProductSelection(Object.values(commerceItems).map(commerceItem => ({commerceItem})));
    } else {
      setProductSelection([]);
    }
  };

  const buttonLabel = isSelectAll ? actionSelectAll : actionDeselectAll;

  return (
    <Styled id="ShippingInformationSelectAll" css={css}>
      <button
        type="button"
        className="secondary ShippingInformationSelectAll__SelectAllButton"
        onClick={handleClick}
        aria-label={buttonLabel}
      >
        {buttonLabel}
      </button>
    </Styled>
  );
};

export default OrderSelectAll;
