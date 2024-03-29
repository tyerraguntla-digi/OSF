/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React from 'react';
import {ShippingGroup} from './shipping-group';

/**
 * Following component filters Pickup in store shipping groups and renders each pickup in store shipping group.
 *
 * @param props - list of shipping groups
 */
export const PickUpInStoreShippingGroupList = props => {
  const {shippingGroups = {}, priceListGroup = {}} = props;
  let listCount = 0;
  let list = [];

  const filterPickUpInStoreShippingGroups = () => {
    if (Object.keys(shippingGroups).length > 0) {
      list = Object.keys(shippingGroups).filter(key => {
        return shippingGroups[key].type === 'inStorePickupShippingGroup';
      });
    }
    listCount = list.length;

    return list;
  };

  return (
    <>
      {filterPickUpInStoreShippingGroups().map((shippingGroupId, index) => {
        return (
          <div key={shippingGroupId}>
            {shippingGroups[shippingGroupId].type === 'inStorePickupShippingGroup' && (
              <ShippingGroup
                key={shippingGroupId}
                shippingGroupId={shippingGroupId}
                shippingDeliveryIndex={listCount === 1 ? '' : index + 1}
                type={shippingGroups[shippingGroupId].type}
                priceListGroup={priceListGroup}
                {...props}
              />
            )}
          </div>
        );
      })}
    </>
  );
};
