/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import * as resourceBundle from '@oracle-cx-commerce/resources';
import {buildConfigResources} from '@oracle-cx-commerce/resources/utils';

const configResourceKeys = [
  'configNumberOfAddressesToLoadHelpText',
  'configNumberOfAddressesToLoadLabel',
  'configShowItemPriceLabel',
  'configShowItemPriceHelpText',
  'configShippingMethodSelectorHelpText',
  'configShippingMethodSelectorTypeLabel',
  'configShippingMethodSelectorRadioLabel',
  'configShippingMethodSelectorDropDownLabel'
];

const config = {
  properties: [
    {
      id: 'numberOfAddressesToLoad',
      type: 'stringType',
      helpTextResourceId: 'configNumberOfAddressesToLoadHelpText',
      labelResourceId: 'configNumberOfAddressesToLoadLabel',
      defaultValue: '12',
      pattern: '^[0-9]*$'
    },
    {
      id: 'showItemPrice',
      type: 'booleanType',
      labelResourceId: 'configShowItemPriceLabel',
      defaultValue: false,
      helpTextResourceId: 'configShowItemPriceHelpText'
    },
    {
      id: 'shippingMethodSelectorType',
      type: 'optionType',
      name: 'shippingMethodSelectorType',
      helpTextResourceId: 'configShippingMethodSelectorHelpText',
      labelResourceId: 'configShippingMethodSelectorTypeLabel',
      defaultValue: 'radio',
      required: true,
      options: [
        {
          id: 'shippingMethodSelectorTypeRadio',
          value: 'radio',
          labelResourceId: 'configShippingMethodSelectorRadioLabel'
        },
        {
          id: 'shippingMethodSelectorTypeDropDown',
          value: 'dropdown',
          labelResourceId: 'configShippingMethodSelectorDropDownLabel'
        }
      ]
    }
  ],
  locales: buildConfigResources(resourceBundle, configResourceKeys)
};

export default config;
