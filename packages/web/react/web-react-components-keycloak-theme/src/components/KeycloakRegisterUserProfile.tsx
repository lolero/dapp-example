import type { PageProps } from 'keycloakify/lib/KcProps';
import { I18nBase, KcContextBase } from 'keycloakify';
import React, { useState } from 'react';
import clsx from 'clsx';
import { KeycloakCommonFields } from './KeycloakCommonFields';

export const KeycloakRegisterUserProfile: React.FunctionComponent<
  PageProps<
    Extract<
      KcContextBase.RegisterUserProfile,
      { pageId: 'register-user-profile.ftl' }
    >,
    I18nBase
  >
> = ({
  kcContext,
  i18n,
  doFetchDefaultThemeResources = true,
  Template,
  ...kcProps
}) => {
  const { url, messagesPerField, recaptchaRequired, recaptchaSiteKey } =
    kcContext;

  const { msg, msgStr } = i18n;

  const [isFomSubmittable, setIsFomSubmittable] = useState(false);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doFetchDefaultThemeResources={doFetchDefaultThemeResources}
      {...kcProps}
      displayMessage={messagesPerField.exists('global')}
      displayRequiredFields
      headerNode={msg('registerTitle')}
      formNode={
        <form
          id="kc-register-form"
          className={clsx(kcProps.kcFormClass)}
          action={url.registrationAction}
          method="post"
        >
          <p>this is rodris register user profile test</p>
          <KeycloakCommonFields
            kcContext={kcContext}
            onIsFormSubmittableValueChange={setIsFomSubmittable}
            i18n={i18n}
            {...kcProps}
          />
          {recaptchaRequired && (
            <div className="form-group">
              <div className={clsx(kcProps.kcInputWrapperClass)}>
                <div
                  className="g-recaptcha"
                  data-size="compact"
                  data-sitekey={recaptchaSiteKey}
                />
              </div>
            </div>
          )}
          <div
            className={clsx(kcProps.kcFormGroupClass)}
            style={{ marginBottom: 30 }}
          >
            <div
              id="kc-form-options"
              className={clsx(kcProps.kcFormOptionsClass)}
            >
              <div className={clsx(kcProps.kcFormOptionsWrapperClass)}>
                <span>
                  <a href={url.loginUrl}>{msg('backToLogin')}</a>
                </span>
              </div>
            </div>

            <div
              id="kc-form-buttons"
              className={clsx(kcProps.kcFormButtonsClass)}
            >
              <input
                className={clsx(
                  kcProps.kcButtonClass,
                  kcProps.kcButtonPrimaryClass,
                  kcProps.kcButtonBlockClass,
                  kcProps.kcButtonLargeClass,
                )}
                type="submit"
                value={msgStr('doRegister')}
                disabled={!isFomSubmittable}
              />
            </div>
          </div>
        </form>
      }
    />
  );
};
