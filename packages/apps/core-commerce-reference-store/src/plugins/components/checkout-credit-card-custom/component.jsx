/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import RadioButton from '@oracle-cx-commerce/react-components/radio';
import React, {useCallback, useEffect, useContext, useRef, useMemo} from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import {getCheckoutCreditCardData} from './selectors';
import {PaymentsContext, StoreContext} from '@oracle-cx-commerce/react-ui/contexts';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import AddCardDetails from './components/add-card-details';
import CheckoutSavedCards from './components/checkout-saved-cards';
import {useLoadSavedCards, useCardState} from './hooks';
import {useCardTypesFetcher} from '@oracle-cx-commerce/fetchers/payments/hooks';
import {PAYMENT_TYPE_CARD} from '@oracle-cx-commerce/commerce-utils/constants';
import PropTypes from 'prop-types';
import {validatePaymentsEnabled} from '@oracle-cx-commerce/react-components/utils/payment';

/**
 * Credit Card widget allows to enter card details or select a saved card. Contains nested components for saved cards, card details, billing address and
 * save card to profile.
 * @param props
 */
const CheckoutCreditCardCustom = props => {
  const {
    appliedCreditCardPaymentGroup,
    id,
    isApprovalEnabled = false,
    isLoggedIn,
    labelCreditCard,
    savedCardExists,
    isPaymentMethodEnabledForApproval,
    isDisplayCreditCard = false,
    isCardPaymentDisabled = false,
    PaymentInfoForScheduledOrder
  } = props;

  const formElementRef = useRef(null);
  const store = useContext(StoreContext);

  // Fetches the saved cards for the profile for a logged in user
  useLoadSavedCards();

  // Calls the useCardState function which maintains the card state and adds the card details to the payment context once the supplied in formElement is valid
  const {useAnotherCard, updateCard, updateSavedCard, addDifferentCard} = useCardState(
    isCardPaymentDisabled,
    formElementRef,
    appliedCreditCardPaymentGroup
  );

  // Fetches the list of card types
  useCardTypesFetcher(store);
  const {isApprovalRequired, selectedPaymentType, setSelectedPaymentType, updateSelectedPaymentType} =
    useContext(PaymentsContext) || {};

  const isCardPaymentApplied = appliedCreditCardPaymentGroup ? true : false;

  // reset selected payment type, if card payment is disabled
  useEffect(() => {
    if (isCardPaymentDisabled && selectedPaymentType === PAYMENT_TYPE_CARD) {
      setSelectedPaymentType('');
    }
  }, [isCardPaymentDisabled, selectedPaymentType, setSelectedPaymentType]);

  // useEffect will set isPaymentSelected if payment already applied
  useEffect(() => {
    if (isCardPaymentApplied) {
      setSelectedPaymentType(PAYMENT_TYPE_CARD);
    }
  }, [isCardPaymentApplied, setSelectedPaymentType]);

  /**
   * This method updates the selected payment type on credit card payment selection
   */
  const onCreditCardPaymentSelection = useCallback(() => {
    updateSelectedPaymentType(PAYMENT_TYPE_CARD);
  }, [updateSelectedPaymentType]);

  /**
   * Determines whether new card details entry section has to be hidden
   * @returns {boolean} true if the card details section is to be hidden
   */
  const isCardDetailsEntryHidden = useCallback(() => {
    return selectedPaymentType !== PAYMENT_TYPE_CARD || (!useAnotherCard && savedCardExists);
  }, [selectedPaymentType, savedCardExists, useAnotherCard]);

  return (
    <React.Fragment>
      {useMemo(
        () => (
          <Styled id="CheckoutCreditCard" css={css}>
            {isDisplayCreditCard &&
              validatePaymentsEnabled(
                isApprovalRequired,
                isApprovalEnabled,
                isPaymentMethodEnabledForApproval,
                PaymentInfoForScheduledOrder
              ) && (
                <React.Fragment>
                  <div className="CheckoutCreditCard CheckoutPaymentsGroup">
                    {!savedCardExists && (
                      <div className="CheckoutCreditCard__RadioButtonContainer">
                        <RadioButton
                          id={`checkout-creditCard-${id}`}
                          name="CheckoutPayments"
                          disabled={isCardPaymentDisabled}
                          checked={selectedPaymentType === PAYMENT_TYPE_CARD}
                          value={PAYMENT_TYPE_CARD}
                          labelText={labelCreditCard}
                          onChange={onCreditCardPaymentSelection}
                        />
                      </div>
                    )}
                    <form ref={formElementRef} noValidate>
                      <React.Fragment>
                        {isLoggedIn && savedCardExists ? (
                          <CheckoutSavedCards
                            {...props}
                            onInput={updateSavedCard}
                            addDifferentCardCallback={addDifferentCard}
                            useAnotherCard={useAnotherCard}
                            isCardPaymentDisabled={isCardPaymentDisabled}
                            selectedPaymentType={selectedPaymentType}
                            setSelectedPaymentType={setSelectedPaymentType}
                            updateSelectedPaymentType={updateSelectedPaymentType}
                            isApprovalRequired={isApprovalRequired}
                          />
                        ) : null}
                        <div
                          className={`CheckoutCreditCard__AddCardDetailsContainer ${
                            isCardDetailsEntryHidden() ? ' CheckoutCreditCard__AddCardDetailsContainer--hidden' : ''
                          }`}
                        >
                          <AddCardDetails
                            {...props}
                            onInput={updateCard}
                            useAnotherCard={savedCardExists ? useAnotherCard : true}
                            isPaymentDisabled={isCardPaymentDisabled}
                            selectedPaymentType={selectedPaymentType}
                          />
                        </div>
                      </React.Fragment>
                    </form>
                  </div>
                </React.Fragment>
              )}
          </Styled>
        ),
        [
          isDisplayCreditCard,
          isApprovalEnabled,
          isPaymentMethodEnabledForApproval,
          isApprovalRequired,
          PaymentInfoForScheduledOrder,
          id,
          selectedPaymentType,
          setSelectedPaymentType,
          labelCreditCard,
          onCreditCardPaymentSelection,
          updateSelectedPaymentType,
          isLoggedIn,
          savedCardExists,
          props,
          updateSavedCard,
          addDifferentCard,
          useAnotherCard,
          isCardPaymentDisabled,
          isCardDetailsEntryHidden,
          updateCard
        ]
      )}
    </React.Fragment>
  );
};

CheckoutCreditCardCustom.propTypes = {
  /**
   * The applied credit card payment group(the details of the card if it is applied previously)
   */
  appliedCreditCardPaymentGroup: PropTypes.shape({
    /**
     * The billing address details
     */
    billingAddress: PropTypes.shape({
      /**
       * The first name
       */
      firstName: PropTypes.string.isRequired,
      /**
       * The last name
       */
      lastName: PropTypes.string.isRequired,
      /**
       * The address snippet
       */
      address1: PropTypes.string.isRequired,
      /**
       * The city
       */
      city: PropTypes.string.isRequired,
      /**
       * The state
       */
      state: PropTypes.string.isRequired,
      /**
       * The postal code
       */
      postalCode: PropTypes.string.isRequired,
      /**
       * The country
       */
      country: PropTypes.string.isRequired,
      /**
       * The company name
       */
      companyName: PropTypes.string,
      /**
       * The phone number
       */
      phoneNumber: PropTypes.string
    }).isRequired,
    /**
     * The card number
     */
    cardNumber: PropTypes.string.isRequired,
    /**
     * The card type
     */
    cardType: PropTypes.string.isRequired,
    /**
     * The customPaymentProperties for the payment group
     */
    customPaymentProperties: PropTypes.shape({}),
    /**
     * The expiry month for the card
     */
    expiryMonth: PropTypes.string.isRequired,
    /**
     * The expiry year for the card
     */
    expiryYear: PropTypes.string.isRequired,
    /**
     * The name on the card
     */
    nameOnCard: PropTypes.string,
    /**
     * The payment group id
     */
    paymentGroupId: PropTypes.string.isRequired,
    /**
     * The payment method for the payment group(creditCard)
     */
    paymentMethod: PropTypes.string.isRequired,
    /**
     * The state of the payment group(INITIAL, AUTHORIZED)
     */
    paymentState: PropTypes.string.isRequired,
    /**
     * Property which determines whether to save this card or not
     */
    saveCard: PropTypes.string,
    /**
     * The saved card id
     */
    savedCardId: PropTypes.string // Required if selected a saved card
  }),
  /**
   * The unique id for the component
   */
  id: PropTypes.string.isRequired,
  /**
   * Indicates if approval is enabled
   */
  isApprovalEnabled: PropTypes.bool,
  /**
   * Indicates if the card payment should be disabled
   */
  isCardPaymentDisabled: PropTypes.bool,
  /**
   * Indicates if the credit card widget should be displayed ord not
   */
  isDisplayCreditCard: PropTypes.bool,
  /**
   * Indicates if user is logged in
   */
  isLoggedIn: PropTypes.bool.isRequired,
  /**
   * Indicates if payment method is enabled for approval
   */
  isPaymentMethodEnabledForApproval: PropTypes.bool,
  /**
   * Indicates if saved cards exists for the logged in shopper
   */
  savedCardExists: PropTypes.bool
};

CheckoutCreditCardCustom.defaultProps = {
  appliedCreditCardPaymentGroup: undefined,
  isApprovalEnabled: false,
  isCardPaymentDisabled: false,
  isDisplayCreditCard: false,
  isPaymentMethodEnabledForApproval: false,
  savedCardExists: false
};

export default connect(getCheckoutCreditCardData)(CheckoutCreditCardCustom);
